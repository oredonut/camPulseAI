import { useApp } from '../context/AppContext'

function BurnoutRadar({ score, level }) {
  const size = 200
  const cx = 100, cy = 100, r = 72

  const levelColor = { low: '#2BBFA4', moderate: '#E8A020', high: '#E05A5A' }
  const color = levelColor[level] || '#2BBFA4'
  const scoreVal = score ?? 0.1

  // Radar spokes
  const spokes = 6
  const spokeAngles = Array.from({ length: spokes }, (_, i) => (i * 360) / spokes)

  // Radar fill polygon
  const axes = [
    { label: 'Stress', val: 0.7 },
    { label: 'Sleep', val: 0.35 },
    { label: 'Mood', val: 0.55 },
    { label: 'Work', val: 0.8 },
    { label: 'Nutrition', val: 0.45 },
    { label: 'Trend', val: scoreVal },
  ]

  const toXY = (angle, radius) => {
    const rad = (angle - 90) * Math.PI / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  const fillPoints = axes.map((a, i) => {
    const angle = (i * 360) / axes.length
    const pt = toXY(angle, a.val * r)
    return `${pt.x},${pt.y}`
  }).join(' ')

  const gridLevels = [0.25, 0.5, 0.75, 1.0]

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Pulse rings */}
      {level !== 'low' && (
        <>
          <div style={{
            position: 'absolute', inset: '15%',
            borderRadius: '50%',
            border: `2px solid ${color}`,
            opacity: 0.3,
            animation: 'radarPulse 2s ease-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: '15%',
            borderRadius: '50%',
            border: `2px solid ${color}`,
            opacity: 0.2,
            animation: 'radarPulse 2s ease-out 0.7s infinite',
          }} />
        </>
      )}

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {gridLevels.map((lvl, i) => (
          <circle
            key={i}
            cx={cx} cy={cy}
            r={r * lvl}
            fill="none"
            stroke="rgba(13,17,23,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* Spokes */}
        {axes.map((_, i) => {
          const angle = (i * 360) / axes.length
          const pt = toXY(angle, r)
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={pt.x} y2={pt.y}
              stroke="rgba(13,17,23,0.07)"
              strokeWidth="1"
            />
          )
        })}

        {/* Fill polygon */}
        <polygon
          points={fillPoints}
          fill={color}
          fillOpacity="0.12"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Center score */}
        <circle cx={cx} cy={cy} r={28} fill="white" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="800"
          fontFamily="'Syne', sans-serif" fill={color}>
          {Math.round(scoreVal * 100)}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fontWeight="600"
          fontFamily="'DM Sans', sans-serif" fill="rgba(13,17,23,0.4)" letterSpacing="0.5">
          RISK SCORE
        </text>

        {/* Axis labels */}
        {axes.map((a, i) => {
          const angle = (i * 360) / axes.length
          const pt = toXY(angle, r + 16)
          return (
            <text
              key={i}
              x={pt.x} y={pt.y + 4}
              textAnchor="middle"
              fontSize="8"
              fontFamily="'DM Sans', sans-serif"
              fontWeight="600"
              fill="rgba(13,17,23,0.45)"
              letterSpacing="0.3"
            >
              {a.label.toUpperCase()}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

function StabilityGauge({ value }) {
  const r = 54
  const circumference = 2 * Math.PI * r
  const filled = (value / 100) * circumference * 0.75
  const offset = circumference * 0.125

  const color = value >= 70 ? '#2BBFA4' : value >= 45 ? '#E8A020' : '#E05A5A'

  return (
    <svg width="160" height="120" viewBox="0 0 160 120">
      {/* Background arc */}
      <circle
        cx="80" cy="90" r={r}
        fill="none"
        stroke="rgba(13,17,23,0.06)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${circumference * 0.75} ${circumference}`}
        strokeDashoffset={-offset}
        transform="rotate(180, 80, 90)"
      />
      {/* Filled arc */}
      <circle
        cx="80" cy="90" r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference}`}
        strokeDashoffset={-offset}
        transform="rotate(180, 80, 90)"
        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x="80" y="85" textAnchor="middle" fontSize="26" fontWeight="800"
        fontFamily="'Syne', sans-serif" fill={color}>{value}</text>
      <text x="80" y="100" textAnchor="middle" fontSize="9" fontWeight="600"
        fontFamily="'DM Sans', sans-serif" fill="rgba(13,17,23,0.4)" letterSpacing="0.5">
        STABILITY INDEX
      </text>
    </svg>
  )
}

function LoopDiagram() {
  const nodes = [
    { label: 'Late Study', icon: '📚', x: 50, y: 10 },
    { label: 'Sleep Drop', icon: '🌙', x: 85, y: 38 },
    { label: 'Stress ↑', icon: '😓', x: 75, y: 72 },
    { label: 'Mood ↓', icon: '😔', x: 40, y: 88 },
    { label: 'Low Output', icon: '📉', x: 8, y: 60 },
    { label: 'More Study', icon: '🔁', x: 5, y: 28 },
  ]

  return (
    <div style={{ position: 'relative', width: '100%', height: 180 }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <marker id="arrow" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
            <path d="M0,0 L0,4 L4,2 z" fill="rgba(43,95,230,0.4)" />
          </marker>
        </defs>
        {nodes.map((n, i) => {
          const next = nodes[(i + 1) % nodes.length]
          const nx = n.x + 7, ny = n.y + 7
          const nnx = next.x + 7, nny = next.y + 7
          const mx = (nx + nnx) / 2, my = (ny + nny) / 2
          const dx = -(nny - ny), dy = (nnx - nx)
          const len = Math.sqrt(dx*dx + dy*dy) || 1
          const cpx = mx + (dx/len) * 10, cpy = my + (dy/len) * 10
          return (
            <path
              key={i}
              d={`M${nx},${ny} Q${cpx},${cpy} ${nnx},${nny}`}
              fill="none"
              stroke="rgba(43,95,230,0.25)"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
              strokeDasharray="3 2"
            />
          )
        })}
      </svg>
      {nodes.map((n, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${n.x}%`, top: `${n.y}%`,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: 10,
            background: 'white',
            border: '1.5px solid rgba(43,95,230,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
            boxShadow: '0 2px 8px rgba(13,17,23,0.08)',
          }}>{n.icon}</div>
          <span style={{
            fontSize: 9, fontWeight: 600,
            color: 'rgba(13,17,23,0.5)',
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: 'nowrap',
            letterSpacing: '0.3px',
          }}>{n.label}</span>
        </div>
      ))}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 40, height: 40, borderRadius: '50%',
        background: 'rgba(224,90,90,0.08)',
        border: '1.5px dashed rgba(224,90,90,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
      }}>🔥</div>
    </div>
  )
}

function WeekChart({ entries }) {
  const days = ['S','M','T','W','T','F','S']
  const last7 = entries.slice(-7)
  const maxH = 60

  if (last7.length === 0) return <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No data yet</div>

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: maxH + 24 }}>
      {last7.map((e, i) => {
        const score = ((e.stress + e.workload) / 2 - 1) / 4
        const h = Math.max(8, score * maxH)
        const color = score < 0.4 ? '#2BBFA4' : score < 0.7 ? '#E8A020' : '#E05A5A'
        const d = new Date(e.date)
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
            <div style={{
              width: '100%', height: h,
              background: color,
              borderRadius: 4,
              opacity: 0.8,
              transition: 'height 0.5s ease',
              minWidth: 20,
            }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
              {days[d.getDay()]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function Dashboard() {
  const { stabilityIndex, riskScore, riskLevel, entries, deadlines, deadlineCluster, clusterDeadlines, examMode, examsSoon, setPage, user } = useApp()
  const upcoming = deadlines
    .filter(d => new Date(d.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4)

  const riskColors = { low: '#2BBFA4', moderate: '#E8A020', high: '#E05A5A' }
  const riskColor = riskColors[riskLevel] || '#2BBFA4'
  const riskLabels = { low: '● Low Risk', moderate: '◈ Moderate Risk', high: '▲ High Risk' }

  const today = new Date()
  const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  return (
    <div className="page-content">
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 12, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>
              {daysOfWeek[today.getDay()]}, {months[today.getMonth()]} {today.getDate()}
            </p>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            Good {today.getHours() < 12 ? 'morning' : today.getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name || 'Student'}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
              Your behavioral stability is being tracked continuously.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setPage('checkin')}>
            ◈ Log Today's Check-In
          </button>
        </div>
      </div>

      {/* Alert banners */}
      {deadlineCluster && (
        <div className="fade-up" style={{
          background: 'linear-gradient(135deg, rgba(232,160,32,0.08), rgba(232,160,32,0.04))',
          border: '1px solid rgba(232,160,32,0.25)',
          borderLeft: '4px solid #E8A020',
          borderRadius: 12,
          padding: '14px 18px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#C47A10' }}>Deadline Cluster Detected</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {clusterDeadlines.length} deadlines within 7 days. Consider breaking tasks into smaller daily goals to reduce workload spikes.
            </div>
          </div>
        </div>
      )}

      {examMode && (
        <div className="fade-up" style={{
          background: 'linear-gradient(135deg, rgba(75,127,255,0.08), rgba(139,127,212,0.06))',
          border: '1px solid rgba(75,127,255,0.2)',
          borderLeft: '4px solid #4B7FFF',
          borderRadius: 12,
          padding: '14px 18px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#2B5CE6' }}>Exam Mode Intelligence Active</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {examsSoon.map(e => e.title).join(', ')} detected. Behavioral thresholds adjusted for exam season monitoring.
            </div>
          </div>
        </div>
      )}

      {/* Top stats row */}
      <div className="grid-4 fade-up fade-up-1" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-accent" style={{ background: '#4B7FFF' }} />
          <div className="stat-label">Stability Index</div>
          <div className="stat-value" style={{ color: stabilityIndex >= 70 ? '#2BBFA4' : stabilityIndex >= 45 ? '#E8A020' : '#E05A5A' }}>
            {stabilityIndex}
          </div>
          <div className="stat-sub">out of 100</div>
        </div>

        <div className="stat-card">
          <div className="stat-accent" style={{ background: riskColor }} />
          <div className="stat-label">Burnout Risk</div>
          <div className="stat-value" style={{ fontSize: 20, paddingTop: 6, color: riskColor }}>
            {riskLabels[riskLevel] || 'Monitoring...'}
          </div>
          <div className="stat-sub">{riskScore !== null ? `Score: ${(riskScore * 100).toFixed(0)}/100` : 'Log a check-in'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-accent" style={{ background: '#8B7FD4' }} />
          <div className="stat-label">Days Tracked</div>
          <div className="stat-value">{entries.length}</div>
          <div className="stat-sub">behavioral logs</div>
        </div>

        <div className="stat-card">
          <div className="stat-accent" style={{ background: '#E8A020' }} />
          <div className="stat-label">Upcoming</div>
          <div className="stat-value">{upcoming.length}</div>
          <div className="stat-sub">deadlines this week</div>
        </div>
      </div>

      {/* Middle row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Burnout Radar */}
        <div className="card fade-up fade-up-2">
          <div className="card-header">
            <div>
              <div className="card-label">Burnout Radar™</div>
              <div className="card-title">Risk Visualization</div>
            </div>
            <span className={`risk-chip risk-${riskLevel}`}>
              {riskLevel === 'low' && '● Low'}
              {riskLevel === 'moderate' && '◈ Moderate'}
              {riskLevel === 'high' && '▲ High'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <BurnoutRadar score={riskScore} level={riskLevel} />
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
            Multi-axis behavioral instability plot
          </p>
        </div>

        {/* Stability Gauge + Weekly Trend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card fade-up fade-up-2" style={{ textAlign: 'center' }}>
            <div className="card-label" style={{ marginBottom: 8 }}>Campus Stability Index™</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StabilityGauge value={stabilityIndex} />
            </div>
            <div style={{
              display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap'
            }}>
              {[
                { label: 'Stress', val: entries.length ? entries[entries.length-1].stress : 3 },
                { label: 'Sleep', val: entries.length ? entries[entries.length-1].sleep : 3 },
                { label: 'Mood', val: entries.length ? entries[entries.length-1].mood : 3 },
              ].map(m => (
                <div key={m.label} style={{
                  background: 'var(--paper-warm)',
                  borderRadius: 8,
                  padding: '5px 10px',
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                }}>
                  {m.label} <strong style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-primary)' }}>{m.val}/5</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="card fade-up fade-up-3">
            <div className="card-header" style={{ marginBottom: 12 }}>
              <div>
                <div className="card-label">Weekly Trend</div>
                <div className="card-title">Stress × Workload</div>
              </div>
            </div>
            <WeekChart entries={entries} />
          </div>
        </div>

        {/* Behavioral Loop */}
        <div className="card fade-up fade-up-3">
          <div className="card-header">
            <div>
              <div className="card-label">Loop Mapping</div>
              <div className="card-title">Behavioral Cycle</div>
            </div>
          </div>
          <LoopDiagram />
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.5 }}>
            Negative behavioral loops compound over time. Breaking any node disrupts the cycle.
          </p>
        </div>
      </div>

      {/* Bottom: Upcoming Deadlines */}
      <div className="card fade-up fade-up-4">
        <div className="card-header">
          <div>
            <div className="card-label">Academic Planner</div>
            <div className="card-title">Upcoming Deadlines</div>
          </div>
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setPage('planner')}>
            View All →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {upcoming.map(d => {
            const daysLeft = Math.ceil((new Date(d.date) - new Date()) / (1000*60*60*24))
            const typeColor = d.type === 'exam' ? '#E05A5A' : d.type === 'project' ? '#8B7FD4' : '#2B5CE6'
            const typeIcon = d.type === 'exam' ? '📝' : d.type === 'project' ? '🏗️' : '📋'
            return (
              <div key={d.id} style={{
                background: 'var(--paper)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '14px 16px',
                borderLeft: `3px solid ${typeColor}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{typeIcon}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: daysLeft <= 3 ? '#E05A5A' : daysLeft <= 7 ? '#E8A020' : 'var(--text-muted)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {daysLeft}d left
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                  {d.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.course}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
