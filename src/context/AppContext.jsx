import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

function normalize(v) { return (v - 1) / 4 }

function computeRiskScore(entries) {
  if (entries.length < 2) return null
  const today = entries[entries.length - 1]
  const last3 = entries.slice(-4, -1)
  const avg = (key) => last3.reduce((s, e) => s + normalize(e[key]), 0) / (last3.length || 1)
  const nStress = normalize(today.stress)
  const nSleep = normalize(today.sleep)
  const nMood = normalize(today.mood)
  const nWork = normalize(today.workload)
  const nNutrition = normalize(today.nutrition)
  const stressTrend = Math.max(0, nStress - avg('stress'))
  const sleepDecline = Math.max(0, avg('sleep') - nSleep)
  const workIntensity = nWork
  const moodVolatility = last3.length > 0 ? Math.abs(nMood - avg('mood')) : 0
  const nutritionInst = Math.max(0, avg('nutrition') - nNutrition)
  const score = 0.30*stressTrend + 0.25*sleepDecline + 0.20*workIntensity + 0.15*moodVolatility + 0.10*nutritionInst
  return Math.min(1, Math.max(0, score))
}

function getRiskLevel(score) {
  if (score === null) return null
  if (score < 0.40) return 'low'
  if (score < 0.70) return 'moderate'
  return 'high'
}

function getStabilityIndex(entries) {
  if (entries.length === 0) return 85
  const score = computeRiskScore(entries) ?? 0.1
  return Math.round((1 - score) * 100)
}

export function predictScheduleStress(scheduleBlocks) {
  if (!scheduleBlocks || scheduleBlocks.length === 0) return null
  const TYPE_WEIGHTS = {
    exam: 1.0, assignment: 0.75, lecture: 0.35, lab: 0.55,
    study: 0.50, meeting: 0.30, social: 0.05, break: -0.20,
    exercise: -0.25, other: 0.25,
  }
  const DURATION_FACTOR = (mins) => {
    if (mins <= 30) return 0.6
    if (mins <= 60) return 0.8
    if (mins <= 90) return 1.0
    if (mins <= 120) return 1.2
    return 1.4
  }
  let rawScore = 0, totalWeight = 0
  scheduleBlocks.forEach(block => {
    const w = TYPE_WEIGHTS[block.type] ?? 0.3
    const d = DURATION_FACTOR(block.duration || 60)
    rawScore += w * d
    totalWeight += 1
  })
  const avg = totalWeight > 0 ? rawScore / totalWeight : 0
  const clamped = Math.max(0, Math.min(1, avg))
  return Math.round(clamped * 4 + 1)
}

function generateInsights(entries) {
  if (entries.length < 2) return []
  const insights = []
  const last = entries[entries.length - 1]
  const prev = entries[entries.length - 2]
  if (last.stress >= 4 && prev.stress >= 4) insights.push({ type: 'warning', icon: '⚠️', title: 'Sustained High Stress Detected', body: 'Your stress has been elevated for 2+ days. Consider scheduling a break or reaching out to academic support.', tag: 'Stress Pattern' })
  if (last.sleep <= 2) insights.push({ type: 'alert', icon: '🌙', title: 'Critical Sleep Deficit', body: 'Sleep below 5 hours significantly impairs memory consolidation and exam performance. Prioritize rest tonight.', tag: 'Sleep Risk' })
  if (last.workload >= 4 && last.stress >= 4) insights.push({ type: 'loop', icon: '🔄', title: 'Behavioral Loop Detected', body: 'High workload + high stress pattern identified. Late-night study sessions may be creating a negative feedback loop.', tag: 'Loop Signal' })
  if (last.mood <= 2 && last.stress >= 3) insights.push({ type: 'mood', icon: '💭', title: 'Mood-Stress Correlation', body: 'Low mood combined with elevated stress is a reliable early burnout signal. Consider a short mindfulness break.', tag: 'Mood Alert' })
  if (last.nutrition <= 2) insights.push({ type: 'nutrition', icon: '🥗', title: 'Nutrition Instability', body: 'Poor nutrition can amplify fatigue and reduce cognitive performance. A small meal or snack can restore focus.', tag: 'Nutrition' })
  if (insights.length === 0) insights.push({ type: 'positive', icon: '✅', title: 'Behavioral Stability Maintained', body: 'Your multi-day trend shows no significant instability patterns. Keep up your current habits.', tag: 'All Clear' })
  return insights
}

const SEED_ENTRIES = [
  { date: '2025-06-08', stress: 2, sleep: 4, mood: 4, workload: 3, nutrition: 3, note: '' },
  { date: '2025-06-09', stress: 3, sleep: 3, mood: 3, workload: 3, nutrition: 3, note: '' },
  { date: '2025-06-10', stress: 3, sleep: 3, mood: 3, workload: 4, nutrition: 2, note: '' },
  { date: '2025-06-11', stress: 4, sleep: 2, mood: 2, workload: 4, nutrition: 2, note: 'Midterm prep' },
]

const SEED_DEADLINES = [
  { id: 1, title: 'Data Structures Assignment', course: 'CS301', date: '2025-06-15', type: 'assignment', priority: 'high' },
  { id: 2, title: 'Linear Algebra Midterm', course: 'MATH201', date: '2025-06-17', type: 'exam', priority: 'high' },
  { id: 3, title: 'Psychology Essay Draft', course: 'PSY102', date: '2025-06-13', type: 'assignment', priority: 'medium' },
  { id: 4, title: 'Physics Lab Report', course: 'PHY201', date: '2025-06-19', type: 'assignment', priority: 'low' },
  { id: 5, title: 'Comp Sci Final Project', course: 'CS401', date: '2025-06-25', type: 'project', priority: 'high' },
]

const todayStr = new Date().toISOString().split('T')[0]
const SEED_SCHEDULES = {
  [todayStr]: [
    { id: 1, title: 'Data Structures Lecture', type: 'lecture', startTime: '08:00', duration: 90, course: 'CS301' },
    { id: 2, title: 'Linear Algebra Assignment', type: 'assignment', startTime: '10:30', duration: 120, course: 'MATH201' },
    { id: 3, title: 'Lunch Break', type: 'break', startTime: '13:00', duration: 60, course: '' },
    { id: 4, title: 'Group Study Session', type: 'study', startTime: '14:30', duration: 90, course: 'CS401' },
  ]
}

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const completeAuth = useCallback((userData) => { setUser(userData); setIsAuthenticated(true) }, [])
  const logout = useCallback(() => { setIsAuthenticated(false); setUser(null) }, [])

  const [page, setPage] = useState('dashboard')
  const [entries, setEntries] = useState(SEED_ENTRIES)
  const [deadlines, setDeadlines] = useState(SEED_DEADLINES)
  const [schedules, setSchedules] = useState(SEED_SCHEDULES)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg, type = 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const addEntry = useCallback((entry) => {
    setEntries(prev => {
      const today = new Date().toISOString().split('T')[0]
      return [...prev.filter(e => e.date !== today), { ...entry, date: today }]
    })
    showToast('Check-in saved! Stability score updated.', 'success')
  }, [showToast])

  const addDeadline = useCallback((dl) => {
    setDeadlines(prev => [...prev, { ...dl, id: Date.now() }])
    showToast('Deadline added to planner.', 'success')
  }, [showToast])

  const addScheduleBlock = useCallback((date, block) => {
    setSchedules(prev => ({ ...prev, [date]: [...(prev[date] || []), { ...block, id: Date.now() }] }))
    showToast('Block added to your schedule.', 'success')
  }, [showToast])

  const removeScheduleBlock = useCallback((date, blockId) => {
    setSchedules(prev => ({ ...prev, [date]: (prev[date] || []).filter(b => b.id !== blockId) }))
  }, [])

  const riskScore = computeRiskScore(entries)
  const riskLevel = getRiskLevel(riskScore)
  const stabilityIndex = getStabilityIndex(entries)
  const insights = generateInsights(entries)

  const now = new Date()
  const examsSoon = deadlines.filter(d => { const diff = (new Date(d.date) - now) / (1000*60*60*24); return d.type === 'exam' && diff >= 0 && diff <= 7 })
  const examMode = examsSoon.length > 0
  const weekFromNow = new Date(now.getTime() + 7*24*60*60*1000)
  const clusterDeadlines = deadlines.filter(d => new Date(d.date) >= now && new Date(d.date) <= weekFromNow)
  const deadlineCluster = clusterDeadlines.length >= 3

  return (
    <AppContext.Provider value={{
      isAuthenticated, user, completeAuth, logout,
      page, setPage,
      entries, addEntry,
      deadlines, addDeadline,
      schedules, addScheduleBlock, removeScheduleBlock,
      riskScore, riskLevel, stabilityIndex, insights,
      examMode, examsSoon, deadlineCluster, clusterDeadlines,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
