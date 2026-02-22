# CamPulse AI

Data to Prevention: AI as Your Health Partner for Students

## Overview

CamPulse AI is a predictive health and burnout prevention system designed for students.
It focuses on maintaining physical, mental, and behavioral well-being while preventing early signs of burnout. By analyzing multi-day behavioral trends, CampusPulse AI identifies early warning signs and provides targeted interventions to help students stay healthy, balanced, and academically productive.

## Problem

Student health is often neglected due to:

* Poor sleep habits
* Rising stress levels
* Unhealthy nutrition
* Mood fluctuations
* High academic workload

These factors gradually undermine both health and performance. Students frequently realize the consequences only after burnout or health issues appear.
There is currently no lightweight system that continuously monitors behavioral patterns and predicts health risks early enough to take preventive action.

## Solution

CamPulse AI collects daily health-related data and uses trend analysis to compute a **Behavioral Stability Score**, identifying potential health risks before they escalate.

The system:

1. Collects 1–5 scaled daily inputs:

   * Stress
   * Sleep
   * Mood
   * Nutrition
   * Academic workload (for context)

2. Normalizes values to a 0–1 scale.

3. Calculates multi-day trends to detect early warning signals.

4. Generates a weighted Risk Score.

5. Predicts a **Health Risk Window**:

   * Low Risk
   * Moderate Risk
   * High Risk

6. Provides targeted interventions to restore balance and improve overall health.

## AI Model Architecture

CampusPulse AI uses a deterministic predictive model optimized for clarity and speed.

### Step 1: Normalization

Daily inputs on a 1–5 scale are converted to 0–1:

normalized = (value - 1) / 4

### Step 2: Trend Analysis

Short-term behavioral trends are computed:

trend = today_value - average(last_3_days)

* Increasing stress or workload → raises health risk
* Declining sleep → raises health risk
* Mood volatility → contributes to instability

### Step 3: Weighted Risk Model

Risk Score =
(0.30 × Stress Trend) +
(0.25 × Sleep Decline Rate) +
(0.20 × Workload Intensity) +
(0.15 × Mood Volatility) +
(0.10 × Nutrition Instability)

Risk Score is mapped to:

* 0.00 to 0.39 → Low Health Risk
* 0.40 to 0.69 → Moderate Health Risk
* 0.70 to 1.00 → High Health Risk

This score triggers early preventive interventions to maintain health and prevent burnout.

## Core Features

* Daily 1–5 Health Check-In
* Behavioral Stability Score
* Health Risk Window Prediction
* Targeted Micro-Interventions for physical and mental well-being
* Weekly Health Trend Visualization
* Academic Workload Logging for context
* Preventive Health Insights

## Why It Matters

CamPulse AI transforms passive tracking into **active health prevention**.

By detecting instability early, students can:

* Improve sleep, nutrition, and mood habits
* Reduce stress levels
* Prevent health deterioration
* Maintain both well-being and academic performance

This positions AI as a proactive health partner, not just a tracker.

## Tech Stack

* Frontend: React Native or Flutter
* Backend: Firebase Firestore
* Authentication: Firebase Auth
* Data Modeling: Structured daily logs
* AI Engine: Rule-based weighted predictive model

## Future Improvements

* Adaptive weight tuning based on user history
* Integration with wearable health devices
* Data-driven calibration for predictive accuracy
* Machine learning refinement
* Campus-wide health analytics dashboards
