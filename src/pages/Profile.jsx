import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Profile() {
  const { stabilityIndex, riskLevel, entries, user } = useApp()
  const [goals, setGoals] = useState({
    stabilityTarget: 80,
    sleepTarget: 7,
    stressLimit: 3,
    studyHours: 6,
  })
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const avgOf = (field) => {
    if (entries.length === 0) return 'N/A'
    const avg = entries.reduce((s, e) => s + e[field], 0) / entries.length
    return avg.toFixed(1)
  }

  const streak = entries.length

  const GOAL_FIELDS = [
    { key: 'stabilityTarget', label: 'Stability Target', unit: '/100', min: 40, max: 100, step: 5, color: '#4B7FFF', icon: '◉' },
    { key: 'sleepTarget',     label: 'Sleep Goal',       unit: 'hrs',  min: 5,  max: 10, step: 0.5, color: '#8B7FD4', icon: '🌙' },
    { key: 'stressLimit',     label: 'Stress Limit',     unit: '/5',   min: 1,  max: 5, step: 1, color: '#E05A5A', icon: '😓' },
    { key: 'studyHours',      label: 'Daily Study',      unit: 'hrs',  min: 1,  max: 12, step: 0.5, color: '#E8A020', icon: '📚' },
  ]

  const STATS = [
    { label: 'Avg Stress',    val: avgOf('stress'),    unit: '/5', color: '#E05A5A' },
    { label: 'Avg Sleep',     val: avgOf('sleep'),     unit: '/5', color: '#4B7FFF' },
    { label: 'Avg Mood',      val: avgOf('mood'),      unit: '/5', color: '#8B7FD4' },
    { label: 'Avg Workload',  val: avgOf('workload'),  unit: '/5', color: '#E8A020' },
    { label: 'Avg Nutrition', val: avgOf('nutrition'), unit: '/5', color: '#2BBFA4' },
  ]

  return (
    <div className="page-content">
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 12, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>
          Your Profile
        </p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800 }}>Profile & Goals</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
          Track your wellness targets and monitor your personal performance history.
        </p>
      </div>

      {/* Profile card */}
      <div className="card fade-up" style={{ marginBottom: 20, background: 'var(--ink)', color: 'white', border: 'none', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,127,212,0.3) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          
         <div style={{
            width: 72, height: 72,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #4B7FFF, #8B7FD4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800,
            fontFamily: "'Syne', sans-serif",
            color: 'white',
            flexShrink: 0,
          }}>
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'ST'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>
              {user?.name || 'Student'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
              {user?.year ? `${user.year} · ` : ''}{user?.major || 'Campus Pulse'}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '5px 12px', fontSize: 12 }}>
                🔥 {streak} day streak
              </div>
              <div style={{
                background: riskLevel === 'low' ? 'rgba(43,191,164,0.2)' : riskLevel === 'moderate' ? 'rgba(232,160,32,0.2)' : 'rgba(224,90,90,0.2)',
                color: riskLevel === 'low' ? '#2BBFA4' : riskLevel === 'moderate' ? '#E8A020' : '#E05A5A',
                borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700,
              }}>
                {riskLevel === 'low' ? '● Stable' : riskLevel === 'moderate' ? '◈ Watch' : '▲ At Risk'}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '5px 12px', fontSize: 12 }}>
                ◉ {stabilityIndex}/100 Stability
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Goals */}
        <div className="card fade-up fade-up-1">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div className="card-label">Wellness Targets</div>
              <div className="card-title">Study Goals</div>
            </div>
            <button
              className={`btn ${editing ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: 13, padding: '7px 16px' }}
              onClick={() => editing ? handleSave() : setEditing(true)}
            >
              {editing ? '✓ Save' : '✏️ Edit'}
            </button>
          </div>

          {saved && (
            <div style={{
              background: 'rgba(43,191,164,0.08)',
              border: '1px solid rgba(43,191,164,0.25)',
              borderRadius: 8, padding: '8px 12px', fontSize: 13,
              color: '#1A9A8A', marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              ✓ Goals saved successfully
            </div>
          )}

          {GOAL_FIELDS.map(f => (
            <div key={f.key} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  <span>{f.icon}</span> {f.label}
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14, fontWeight: 700,
                  color: f.color,
                  background: `${f.color}12`,
                  padding: '2px 8px', borderRadius: 6,
                }}>
                  {goals[f.key]}{f.unit}
                </div>
              </div>

              {editing ? (
                <input
                  type="range"
                  min={f.min} max={f.max} step={f.step}
                  value={goals[f.key]}
                  onChange={e => setGoals(p => ({ ...p, [f.key]: parseFloat(e.target.value) }))}
                  style={{
                    width: '100%', appearance: 'none', height: 5,
                    borderRadius: 10, background: `linear-gradient(to right, ${f.color} ${((goals[f.key] - f.min) / (f.max - f.min)) * 100}%, var(--paper-warm) 0%)`,
                    outline: 'none', cursor: 'pointer',
                  }}
                />
              ) : (
                <div style={{ height: 5, background: 'var(--paper-warm)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${((goals[f.key] - f.min) / (f.max - f.min)) * 100}%`,
                    background: f.color, borderRadius: 10,
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card fade-up fade-up-2">
            <div className="card-label" style={{ marginBottom: 16 }}>All-Time Averages</div>
            {STATS.map(s => (
              <div key={s.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: s.color }}>
                    {s.val}{s.unit}
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--paper-warm)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: s.val !== 'N/A' ? `${((parseFloat(s.val) - 1) / 4) * 100}%` : '0%',
                    background: s.color, borderRadius: 10,
                    transition: 'width 0.8s ease',
                  }} />
                </div>
              </div>
            ))}
            <div style={{
              marginTop: 4,
              padding: '10px 12px',
              background: 'var(--paper)',
              borderRadius: 10,
              fontSize: 12,
              color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              📊 Based on {entries.length} check-in{entries.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="card fade-up fade-up-3">
            <div className="card-label" style={{ marginBottom: 14 }}>Future Improvements</div>
            {[
              { icon: '🔗', label: 'Wearable Integration', status: 'Coming Soon' },
              { icon: '🤖', label: 'ML Weight Tuning', status: 'Beta' },
              { icon: '🏫', label: 'Campus Dashboard', status: 'Planned' },
              { icon: '📱', label: 'Mobile App', status: 'Planned' },
            ].map(r => (
              <div key={r.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 16 }}>{r.icon}</span>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--text-secondary)' }}>{r.label}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 20,
                  background: r.status === 'Beta' ? 'rgba(75,127,255,0.1)' : 'var(--paper-warm)',
                  color: r.status === 'Beta' ? '#2B5CE6' : 'var(--text-muted)',
                  letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
