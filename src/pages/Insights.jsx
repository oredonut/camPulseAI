import { useApp } from '../context/AppContext'

const TYPE_STYLES = {
  warning: { border: '#E8A020', bg: 'rgba(232,160,32,0.06)', icon_bg: 'rgba(232,160,32,0.12)', tag_bg: '#FDF0D8', tag_color: '#C47A10' },
  alert:   { border: '#E05A5A', bg: 'rgba(224,90,90,0.06)',  icon_bg: 'rgba(224,90,90,0.12)',  tag_bg: '#FCEAEA', tag_color: '#B02020' },
  loop:    { border: '#8B7FD4', bg: 'rgba(139,127,212,0.06)',icon_bg: 'rgba(139,127,212,0.12)',tag_bg: '#ECEAFA', tag_color: '#6B5FA4' },
  mood:    { border: '#4B7FFF', bg: 'rgba(75,127,255,0.06)', icon_bg: 'rgba(75,127,255,0.12)', tag_bg: '#EEF3FF', tag_color: '#2B5CE6' },
  nutrition:{ border: '#2BBFA4',bg: 'rgba(43,191,164,0.06)',icon_bg: 'rgba(43,191,164,0.12)', tag_bg: '#D4F5EF', tag_color: '#1A9A8A' },
  positive: { border: '#2BBFA4',bg: 'rgba(43,191,164,0.04)',icon_bg: 'rgba(43,191,164,0.10)', tag_bg: '#D4F5EF', tag_color: '#1A9A8A' },
}

function InsightCard({ insight, index }) {
  const st = TYPE_STYLES[insight.type] || TYPE_STYLES.positive

  return (
    <div className={`fade-up fade-up-${index + 1}`} style={{
      background: st.bg,
      border: `1px solid ${st.border}25`,
      borderLeft: `4px solid ${st.border}`,
      borderRadius: 16,
      padding: '20px 22px',
      display: 'flex',
      gap: 16,
    }}>
      <div style={{
        width: 44, height: 44,
        borderRadius: 12,
        background: st.icon_bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
        flex: 'shrink 0',
        flexShrink: 0,
      }}>{insight.icon}</div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
            {insight.title}
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700,
            padding: '2px 8px', borderRadius: 20,
            background: st.tag_bg, color: st.tag_color,
            letterSpacing: '0.5px', textTransform: 'uppercase',
          }}>{insight.tag}</span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {insight.body}
        </p>
      </div>
    </div>
  )
}

function MiniSparkline({ entries, key: field, color }) {
  const vals = entries.slice(-7).map(e => e[field])
  if (vals.length < 2) return null

  const max = 5, min = 1
  const w = 120, h = 40
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w
    const y = h - ((v - min) / (max - min)) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {vals.map((v, i) => {
        const x = (i / (vals.length - 1)) * w
        const y = h - ((v - min) / (max - min)) * h
        return <circle key={i} cx={x} cy={y} r={i === vals.length-1 ? 4 : 2} fill={color} />
      })}
    </svg>
  )
}

export default function Insights() {
  const { insights, entries, riskScore, riskLevel, stabilityIndex } = useApp()

  const last = entries[entries.length - 1]
  const metrics = last ? [
    { label: 'Stress',    val: last.stress,    color: '#E05A5A', field: 'stress' },
    { label: 'Sleep',     val: last.sleep,     color: '#4B7FFF', field: 'sleep' },
    { label: 'Mood',      val: last.mood,      color: '#8B7FD4', field: 'mood' },
    { label: 'Workload',  val: last.workload,  color: '#E8A020', field: 'workload' },
    { label: 'Nutrition', val: last.nutrition, color: '#2BBFA4', field: 'nutrition' },
  ] : []

  return (
    <div className="page-content">
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 12, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>
          Predictive Analysis
        </p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
          AI Insights
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Pattern detection and risk signals from your behavioral log history.
        </p>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card fade-up">
          <div className="card-label" style={{ marginBottom: 8 }}>Model Output</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {riskScore !== null ? `${(riskScore * 100).toFixed(1)}` : '--'}
            <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: "'DM Sans'" }}>/100</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Weighted Risk Score</div>
        </div>
        <div className="card fade-up fade-up-1">
          <div className="card-label" style={{ marginBottom: 8 }}>Burnout Window</div>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 4,
            color: riskLevel === 'low' ? '#2BBFA4' : riskLevel === 'moderate' ? '#E8A020' : '#E05A5A',
          }}>
            {riskLevel === 'low' && '● Low Risk'}
            {riskLevel === 'moderate' && '◈ Moderate Risk'}
            {riskLevel === 'high' && '▲ High Risk'}
            {!riskLevel && '— Insufficient Data'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Predicted burnout window</div>
        </div>
        <div className="card fade-up fade-up-2">
          <div className="card-label" style={{ marginBottom: 8 }}>Stability Index</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            {stabilityIndex}
            <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: "'DM Sans'" }}>/100</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Academic stability score</div>
        </div>
      </div>

      {/* 7-day sparklines */}
      {metrics.length > 0 && (
        <div className="card fade-up" style={{ marginBottom: 24 }}>
          <div className="card-label" style={{ marginBottom: 16 }}>7-Day Behavioral Trends</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {metrics.map(m => (
              <div key={m.label}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {m.label}
                </div>
                <MiniSparkline entries={entries} key={m.field} color={m.color} />
                <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: m.color }}>
                    {m.val}/5
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>today</span>
                </div>
                <div style={{ height: 3, background: 'var(--paper-warm)', borderRadius: 10, marginTop: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(m.val - 1) / 4 * 100}%`, background: m.color, borderRadius: 10 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Model Explanation */
        {/* AI Model Explanation */}
      <div className="card fade-up" style={{ marginBottom: 24, background: 'var(--ink)', color: 'white', border: 'none' }}>
        <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
          How Your Score Is Calculated
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
          5 Factors Drive Your Risk Level
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Stress Trend',        weight: 30, color: '#E05A5A', icon: '😓', desc: 'How much your stress has risen recently' },
            { label: 'Sleep Decline',        weight: 25, color: '#4B7FFF', icon: '🌙', desc: 'Drop in sleep quality vs your baseline' },
            { label: 'Workload Intensity',   weight: 20, color: '#E8A020', icon: '📚', desc: 'Current academic pressure level' },
            { label: 'Mood Volatility',      weight: 15, color: '#8B7FD4', icon: '💭', desc: 'Emotional fluctuation over recent days' },
            { label: 'Nutrition Stability',  weight: 10, color: '#2BBFA4', icon: '🥗', desc: 'Consistency of healthy eating habits' },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `${f.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>{f.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{f.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: f.color, fontFamily: "'JetBrains Mono', monospace" }}>{f.weight}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${f.weight * 2}%`, background: f.color, borderRadius: 10 }} />
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
          {[
            { range: '0 – 39', label: 'Low Risk', color: '#2BBFA4' },
            { range: '40 – 69', label: 'Moderate Risk', color: '#E8A020' },
            { range: '70 – 100', label: 'High Risk', color: '#E05A5A' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
              <span style={{ color: r.color, fontWeight: 700 }}>{r.range}</span>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
      </div>
        <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
          Model Architecture
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
          Weighted Risk Formula
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.8,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 10,
          padding: '14px 16px',
        }}>
          <div style={{ color: '#4B7FFF' }}>Risk Score =</div>
          <div>&nbsp; 0.30 × <span style={{ color: '#E05A5A' }}>Stress Trend</span></div>
          <div>&nbsp; + 0.25 × <span style={{ color: '#4B7FFF' }}>Sleep Decline Rate</span></div>
          <div>&nbsp; + 0.20 × <span style={{ color: '#E8A020' }}>Workload Intensity</span></div>
          <div>&nbsp; + 0.15 × <span style={{ color: '#8B7FD4' }}>Mood Volatility</span></div>
          <div>&nbsp; + 0.10 × <span style={{ color: '#2BBFA4' }}>Nutrition Instability</span></div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
          {[
            { range: '0.00–0.39', label: 'Low Risk', color: '#2BBFA4' },
            { range: '0.40–0.69', label: 'Moderate Risk', color: '#E8A020' },
            { range: '0.70–1.00', label: 'High Risk', color: '#E05A5A' },
          ].map(r => (
            <div key={r.label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, color: 'rgba(255,255,255,0.6)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: r.color }}>{r.range}</span>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights list */}
      <div className="card-label" style={{ marginBottom: 12 }}>Detected Patterns</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} index={i} />
        ))}
      </div>

      {entries.length < 2 && (
        <div style={{
          marginTop: 20,
          textAlign: 'center',
          padding: '32px',
          border: '1.5px dashed var(--border-strong)',
          borderRadius: 16,
          color: 'var(--text-muted)',
          fontSize: 14,
        }}>
          📊 Log at least 2 days of check-ins to unlock trend analysis and pattern detection.
        </div>
      )}
    </div>
  )
}

