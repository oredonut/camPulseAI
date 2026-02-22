import { useState } from 'react'
import { useApp } from '../context/AppContext'

const FIELDS = [
  { key: 'mood',      label: 'Mood',              icon: '🙂', desc: 'How are you feeling emotionally?',     lo: 'Very Low', hi: 'Excellent',   color: '#8B7FD4' },
  { key: 'stress',    label: 'Stress Level',       icon: '😓', desc: 'How stressed do you feel right now?',  lo: 'Relaxed',  hi: 'Overwhelmed', color: '#E05A5A' },
  { key: 'sleep',     label: 'Sleep Quality',      icon: '🌙', desc: 'How well did you sleep last night?',   lo: 'Terrible', hi: 'Perfect',     color: '#4B7FFF' },
  { key: 'workload',  label: 'Academic Workload',   icon: '📚', desc: 'How heavy is your workload today?',    lo: 'Light',    hi: 'Crushing',    color: '#E8A020' },
  { key: 'nutrition', label: 'Nutrition',           icon: '🥗', desc: 'How well have you eaten today?',      lo: 'Poor',     hi: 'Great',       color: '#2BBFA4' },
]

function SliderField({ field, value, onChange }) {
  const pct = ((value - 1) / 4) * 100
  const dots = [1,2,3,4,5]

  return (
    <div style={{
      background: 'var(--paper-card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '20px 22px',
      transition: 'box-shadow 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            borderRadius: 10,
            background: `${field.color}12`,
            border: `1.5px solid ${field.color}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>{field.icon}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{field.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{field.desc}</div>
          </div>
        </div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 24,
          fontWeight: 800,
          color: field.color,
          minWidth: 28,
          textAlign: 'right',
        }}>{value}</div>
      </div>

      {/* Dot selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, justifyContent: 'space-between' }}>
        {dots.map(d => (
          <button
            key={d}
            onClick={() => onChange(d)}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 8,
              border: `1.5px solid ${value === d ? field.color : 'var(--border)'}`,
              background: value === d ? `${field.color}15` : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: value === d ? field.color : 'var(--text-muted)',
              fontFamily: "'JetBrains Mono', monospace",
              transition: 'all 0.15s',
            }}
          >{d}</button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        <span>{field.lo}</span>
        <span>{field.hi}</span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 4,
        background: 'var(--paper-warm)',
        borderRadius: 10,
        marginTop: 6,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: field.color,
          borderRadius: 10,
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  )
}

export default function CheckIn() {
  const { addEntry, entries } = useApp()
  const [values, setValues] = useState({ mood: 3, stress: 2, sleep: 4, workload: 3, nutrition: 3 })
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const alreadyChecked = entries.some(e => e.date === today)

  const handleSubmit = () => {
    addEntry({ ...values, note })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Check-In Complete</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Your behavioral data has been logged and your stability score has been updated.</p>
          <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
            ◉ View Updated Score
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 12, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>
          Daily Input
        </p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
          Behavioral Check-In
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Rate each dimension from 1 (lowest) to 5 (highest). Takes under 60 seconds.
        </p>
        {alreadyChecked && (
          <div style={{
            marginTop: 12,
            background: 'rgba(43,191,164,0.08)',
            border: '1px solid rgba(43,191,164,0.25)',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 13,
            color: '#1A9A8A',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            ✓ You already logged today. This will update your existing entry.
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        {FIELDS.map((f, i) => (
          <div key={f.key} className={`fade-up fade-up-${i + 1}`}
            style={i === 4 ? { gridColumn: 'span 2' } : {}}>
            <SliderField
              field={f}
              value={values[f.key]}
              onChange={v => setValues(prev => ({ ...prev, [f.key]: v }))}
            />
          </div>
        ))}
      </div>

      <div className="card fade-up" style={{ marginBottom: 20 }}>
        <div className="card-label" style={{ marginBottom: 10 }}>Optional Note</div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Any context about today? (e.g. 'Had an exam', 'Slept late', 'Feeling off')"
          style={{
            width: '100%',
            minHeight: 80,
            border: '1.5px solid var(--border)',
            borderRadius: 10,
            padding: '10px 14px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: 'var(--text-primary)',
            background: 'var(--paper)',
            outline: 'none',
            resize: 'vertical',
            lineHeight: 1.5,
          }}
        />
      </div>

      {/* Preview */}
      <div className="card fade-up" style={{ marginBottom: 20, background: 'var(--ink)', color: 'white', border: 'none' }}>
        <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
          Risk Preview
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {FIELDS.map(f => (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</span>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1,2,3,4,5].map(d => (
                  <div key={d} style={{
                    width: 8, height: 8,
                    borderRadius: 2,
                    background: d <= values[f.key] ? f.color : 'rgba(255,255,255,0.1)',
                  }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fade-up" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={handleSubmit} style={{ padding: '12px 28px', fontSize: 15 }}>
          ◈ Submit Check-In
        </button>
      </div>
    </div>
  )
}
