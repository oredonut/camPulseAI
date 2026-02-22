const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: functions.config().openai?.key || process.env.GEMINI_API_KEY,
})
/* =========================
   UTILITY FUNCTIONS
========================= */

function normalize(v) {
  return (v - 1) / 4;
}

function clamp(v) {
  return Math.max(0, Math.min(1, v));
}

/* =========================
   PROFILE FUNCTIONS
========================= */

exports.createOrUpdateProfile = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError("unauthenticated");

  const { fullName, matricNo, department, year } = data;

  await db.collection("users").doc(uid).set({
    fullName,
    matricNo,
    department,
    year,
    email: context.auth.token.email,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  return { success: true };
});

exports.getProfile = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError("unauthenticated");

  const doc = await db.collection("users").doc(uid).get();
  return doc.data();
});

/* =========================
   MENTAL HEALTH ENGINE
========================= */

exports.evaluateMentalHealth = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError("unauthenticated");

  // Fetch last 4 daily logs
  const logsSnapshot = await db
    .collection("dailyLogs")
    .where("userId", "==", uid)
    .orderBy("timestamp", "desc")
    .limit(4)
    .get();

  const logs = logsSnapshot.docs.map(doc => doc.data());

  if (logs.length < 4) {
    return {
      phase: "baseline",
      message: "Baseline phase: continue logging for 4 days."
    };
  }

  const profileRef = db.collection("mentalProfiles").doc(uid);
  const profileDoc = await profileRef.get();

  /* =========================
     BASELINE CREATION
  ========================== */
  if (!profileDoc.exists) {
    const avg = (field) =>
      logs.reduce((sum, d) => sum + normalize(d[field]), 0) / 4;

    const baseline = {
      stress: avg("stress"),
      sleep: avg("sleep"),
      mood: avg("mood"),
      workload: avg("workload"),
      nutrition: avg("nutrition")
    };

    await profileRef.set({
      baseline,
      phase: "monitoring",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      phase: "monitoring",
      message: "Baseline established. Monitoring activated."
    };
  }

  /* =========================
     MONITORING MODE
  ========================== */
  const baseline = profileDoc.data().baseline;
  const today = logs[0];

  const stressToday = normalize(today.stress);
  const sleepToday = normalize(today.sleep);
  const moodToday = normalize(today.mood);
  const workloadToday = normalize(today.workload);
  const nutritionToday = normalize(today.nutrition);

  const deviation = {
    stress: stressToday - baseline.stress,
    sleep: baseline.sleep - sleepToday,
    mood: Math.abs(moodToday - baseline.mood),
    workload: workloadToday - baseline.workload,
    nutrition: baseline.nutrition - nutritionToday
  };

  // Normalize deviations
  Object.keys(deviation).forEach(key => {
    deviation[key] = clamp(deviation[key]);
  });

  /* =========================
     DYNAMIC WEIGHTS
  ========================== */
  let weights = {
    stress: 0.30,
    sleep: 0.25,
    workload: 0.20,
    mood: 0.15,
    nutrition: 0.10
  };

  const deviationsArray = Object.entries(deviation)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value);

  // Boost dominant factor slightly
  weights[deviationsArray[0].key] += 0.05;

  /* =========================
     CUMULATIVE STRESS VELOCITY
  ========================== */
  let stressVelocity = 0;
  if (logs.length >= 3) {
    const s1 = normalize(logs[0].stress);
    const s2 = normalize(logs[1].stress);
    const s3 = normalize(logs[2].stress);
    stressVelocity = clamp((s1 - s2) + (s2 - s3));
  }

  /* =========================
     RISK SCORE
  ========================== */
  const riskScore = clamp(
    (weights.stress * deviation.stress) +
    (weights.sleep * deviation.sleep) +
    (weights.workload * deviation.workload) +
    (weights.mood * deviation.mood) +
    (weights.nutrition * deviation.nutrition) +
    (0.10 * stressVelocity)
  );

  let riskLevel = "Low";
  if (riskScore >= 0.7) riskLevel = "High";
  else if (riskScore >= 0.4) riskLevel = "Moderate";

  /* =========================
     FLAG DETECTION
  ========================== */
  let flags = [];
  if (deviation.stress > 0.35) flags.push("rising_stress");
  if (deviation.sleep > 0.35) flags.push("sleep_decline");
  if (deviation.workload > 0.35) flags.push("workload_spike");
  if (deviation.mood > 0.35) flags.push("mood_instability");
  if (deviation.nutrition > 0.35) flags.push("nutrition_drop");

  /* =========================
     BEHAVIORAL STATE
  ========================== */
  let behavioralState = "Stable";
  if (flags.includes("rising_stress") && flags.includes("sleep_decline")) {
    behavioralState = "Burnout Pattern Emerging";
  }
  if (flags.includes("mood_instability") && flags.includes("workload_spike")) {
    behavioralState = "Emotional Overload Pattern";
  }
  if (stressVelocity > 0.4) {
    behavioralState = "Rapid Stress Escalation";
  }

  /* =========================
     RECOVERY TRACKING + ACCELERATION
  ========================== */
  let recoveryStatus = "Stable";
  let accelerationStatus = "Stable";

  const lastRiskSnapshot = await db.collection("riskScores")
    .where("userId", "==", uid)
    .orderBy("timestamp", "desc")
    .limit(3)
    .get();

  if (lastRiskSnapshot.docs.length === 3) {
    const previous = lastRiskSnapshot.docs.map(d => d.data().riskScore);

    if (previous[0] < previous[1] && previous[1] < previous[2]) {
      recoveryStatus = "Improving";
    }
    if (previous[0] > previous[1] && previous[1] > previous[2]) {
      recoveryStatus = "Worsening";
    }

    const delta1 = previous[0] - previous[1];
    const delta2 = previous[1] - previous[2];
    if (delta1 > 0 && delta2 > 0 && delta1 > delta2) {
      accelerationStatus = "Risk Accelerating";
    }
  }

  /* =========================
     INSIGHT & PREVENTIVE MEASURES
  ========================== */
  function generateInsight(riskLevel, flags, behavioralState) {
    if (riskLevel === "Low") {
      return "Your behavioral patterns remain within your baseline range.";
    }
    let message = `Detected changes in ${flags.join(", ").replace(/_/g, " ")}. `;
    if (riskLevel === "Moderate") {
      message += "Early strain indicators observed. Small corrections recommended. ";
    }
    if (riskLevel === "High") {
      message += "Significant deviation from baseline detected. Immediate intervention advised. ";
    }
    message += `Pattern identified: ${behavioralState}.`;
    return message;
  }

  function generatePrevention(flags) {
    let measures = [];
    if (flags.includes("rising_stress"))
      measures.push("Implement structured relaxation periods.");
    if (flags.includes("sleep_decline"))
      measures.push("Reinforce consistent sleep schedule.");
    if (flags.includes("workload_spike"))
      measures.push("Reduce non-essential academic tasks.");
    if (flags.includes("mood_instability"))
      measures.push("Practice journaling or reflection exercises.");
    if (flags.includes("nutrition_drop"))
      measures.push("Maintain regular hydration and balanced meals.");
    return measures;
  }

  let insight = generateInsight(riskLevel, flags, behavioralState);
  let preventiveMeasures = generatePrevention(flags);

  if (riskLevel === "High") {
    await db.collection("alerts").add({
      userId: uid,
      type: "mental_health_risk",
      resolved: false,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  /* =========================
     STORE RISK RESULT
  ========================== */
  await db.collection("riskScores").add({
    userId: uid,
    riskScore,
    riskLevel,
    recoveryStatus,
    accelerationStatus,
    stressVelocity,
    behavioralState,
    flags,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    phase: "monitoring",
    riskScore,
    riskLevel,
    recoveryStatus,
    accelerationStatus,
    stressVelocity,
    behavioralState,
    flags,
    insight,
    preventiveMeasures
  };
});

/* =========================
   DASHBOARD DATA
========================= */
exports.getDashboardData = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError("unauthenticated");

  const riskSnapshot = await db.collection("riskScores")
    .where("userId", "==", uid)
    .orderBy("timestamp", "desc")
    .limit(1)
    .get();

  const alertSnapshot = await db.collection("alerts")
    .where("userId", "==", uid)
    .where("resolved", "==", false)
    .get();

  const plannerSnapshot = await db.collection("planner")
    .where("userId", "==", uid)
    .orderBy("date", "asc")
    .limit(5)
    .get();

  return {
    latestRisk: riskSnapshot.docs[0]?.data() || null,
    activeAlerts: alertSnapshot.docs.length,
    upcomingTasks: plannerSnapshot.docs.map(d => d.data())
  };
});

/* =========================
   PLANNER FUNCTIONS
========================= */
exports.addPlannerTask = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError("unauthenticated");

  const { title, description, date, reminderTime } = data;

  await db.collection("planner").add({
    userId: uid,
    title,
    description,
    date,
    reminderTime,
    completed: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true };
});

exports.completeTask = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError("unauthenticated");

  const { taskId } = data;

  await db.collection("planner").doc(taskId).update({
    completed: true
  });

  return { success: true };
});

/* =========================
   WEEKLY SUMMARY
========================= */
exports.generateWeeklySummary = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError("unauthenticated");

  const snapshot = await db.collection("riskScores")
    .where("userId", "==", uid)
    .orderBy("timestamp", "desc")
    .limit(7)
    .get();

  const scores = snapshot.docs.map(doc => doc.data().riskScore);
  const weeklyAverage = scores.reduce((sum, s) => sum + s, 0) / scores.length;

  return {
    weeklyAverage,
    classification:
      weeklyAverage >= 0.7
        ? "High Risk Week"
        : weeklyAverage >= 0.4
        ? "Moderate Risk Week"
        : "Stable Week"
  };
});

/* =========================
   COUNSELOR OVERRIDE
========================= */
exports.overrideRiskLevel = functions.https.onCall(async (data, context) => {
  const { userId, newLevel } = data;

  await db.collection("riskOverrides").add({
    userId,
    overriddenLevel: newLevel,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true };
});
/* =========================
   AI CHATBOT
========================= */
exports.chat = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).send('')
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    })
    res.json({ reply: completion.choices[0].message.content })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'OpenAI request failed' })
  }
})