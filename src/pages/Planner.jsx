import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { predictScheduleStress } from '../context/AppContext'

const TYPE_META = {
  exam:       { icon: '📝', color: '#E05A5A', label: 'Exam',       stressHint: 'Very high stress' },
  assignment: { icon: '📋', color: '#2B5CE6', label: 'Assignment', stressHint: 'High stress' },
  lecture:    { icon: '🎓', color: '#8B7FD4', label: 'Lecture',    stressHint: 'Moderate' },
  lab:        { icon: '🔬', color: '#E8A020', label: 'Lab',        stressHint: 'Moderate-high' },
  study:      { icon: '📖', color: '#4B7FFF', label: 'Study',      stressHint: 'Moderate' },
  meeting:    { icon: '🤝', color: '#2BBFA4', label: 'Meeting',    stressHint: 'Low-moderate' },
  social:     { icon: '🎉', color: '#F59E0B', label: 'Social',     stressHint: 'Low' },
  break:      { icon: '☕', color: '#2BBFA4', label: 'Break',      stressHint: 'Reduces stress' },
  exercise:   { icon: '🏃', color: '#2BBFA4', label: 'Exercise',   stressHint: 'Reduces stress' },
  other:      { icon: '📌', color: '#94A3B8', label: 'Other',      stressHint: 'Low' },
}

const DEADLINE_TYPE_META = {
  exam:       { icon: '📝', color: '#E05A5A', label: 'Exam' },
  assignment: { icon: '📋', color: '#2B5CE6', label: 'Assignment' },
  project:    { icon: '🏗️', color: '#8B7FD4', label: 'Project' },
  quiz:       { icon: '❓', color: '#2BBFA4', label: 'Quiz' },
}

const STRESS_LABELS = { 1: 'Very Low', 2: 'Low', 3: 'Moderate', 4: 'High', 5: 'Very High' }
const STRESS_COLORS = { 1: '#2BBFA4', 2: '#4B7FFF', 3: '#E8A020', 4: '#E05A5A', 5: '#B91C1C' }

function StressGauge({ score }) {
  if (!score) return null
  const color = STRESS_COLORS[score]
  const label = STRESS_LABELS[score]
  const pct = ((score - 1) / 4) * 100

  return (
    <div style={{
      background: `${color}08`,
      border: `1.5px solid ${color}30`,
      borderRadius: 16,
      padding: '20px 22px',
      marginBottom: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>
            AI Stress Forecast
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
            Today's Predicted Stress
          </div>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 36, color,
            lineHeight: 1,
          }}>{score}<span style={{ fontSize: 16, color: 'var(--text-muted)', fontFamily: "'DM Sans'" }}>/5</span></div>
          <div style={{
            fontSize: 12, fontWeight: 700, color,
            background: `${color}15`, padding: '3px 10px', borderRadius: 20,
          }}>{label}</div>
        </div>
      </div>

      {/* Gauge bar */}
      <div style={{ height: 10, background: 'var(--paper-warm)', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(to right, #2BBFA4, ${color})`,
          borderRadius: 10,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        <span>Very Low</span><span>Low</span><span>Moderate</span><span>High</span><span>Very High</span>
      </div>

      {score >= 4 && (
        <div style={{
          marginTop: 14, padding: '10px 14px',
          background: `${color}10`, borderRadius: 10,
          fontSize: 13, color: color, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          ⚠ High-stress day detected. Consider adding a break block or redistributing tasks.
        </div>
      )}
      {score <= 2 && (
        <div style={{
          marginTop: 14, padding: '10px 14px',
          background: 'rgba(43,191,164,0.08)', borderRadius: 10,
          fontSize: 13, color: '#1A9A8A', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          ✓ Light day ahead. Great time to catch up on rest or long-term tasks.
        </div>
      )}
    </div>
  )
}

function TimelineBlock({ block, onRemove }) {
  const meta = TYPE_META[block.type] || TYPE_META.other
  const durationLabel = block.duration >= 60
    ? `${Math.floor(block.duration / 60)}h${block.duration % 60 ? ` ${block.duration % 60}m` : ''}`
    : `${block.duration}m`

  return (
    <div style={{
      display: 'flex',
      gap: 12,
      alignItems: 'stretch',
      animation: 'cpFadeUp 0.3s ease both',
    }}>
      {/* Time column */}
      <div style={{ width: 52, flexShrink: 0, textAlign: 'right', paddingTop: 14 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
          {block.startTime}
        </div>
      </div>

      {/* Line + dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: meta.color, marginTop: 16, flexShrink: 0 }} />
        <div style={{ flex: 1, width: 2, background: `${meta.color}20`, minHeight: 20, marginTop: 4 }} />
      </div>

      {/* Block card */}
      <div style={{
        flex: 1,
        background: 'var(--paper-card)',
        border: `1px solid ${meta.color}20`,
        borderLeft: `3px solid ${meta.color}`,
        borderRadius: 12,
        padding: '12px 14px',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{ fontSize: 20 }}>{meta.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
            {block.title}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: meta.color, fontWeight: 600 }}>{meta.label}</span>
            {block.course && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{block.course}</span>}
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>⏱ {durationLabel}</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>{meta.stressHint}</span>
          </div>
        </div>
        <button onClick={onRemove} style={{
          width: 26, height: 26, borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'transparent', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.15s',
        }}
          onMouseOver={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#E05A5A' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >✕</button>
      </div>
    </div>
  )
}

export default function Planner() {
  const { deadlines, addDeadline, schedules, addScheduleBlock, removeScheduleBlock } = useApp()

  const [activeTab, setActiveTab] = useState('schedule') // 'schedule' | 'deadlines'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showBlockForm, setShowBlockForm] = useState(false)
  const [showDeadlineForm, setShowDeadlineForm] = useState(false)
  const [viewMonth, setViewMonth] = useState(new Date())

  const [blockForm, setBlockForm] = useState({
    title: '', type: 'lecture', startTime: '09:00', duration: 60, course: '',
  })
  const [deadlineForm, setDeadlineForm] = useState({
    title: '', course: '', date: selectedDate, type: 'assignment', priority: 'medium',
  })

  const todayBlocks = (schedules[selectedDate] || []).sort((a, b) => a.startTime.localeCompare(b.startTime))
  const predictedStress = predictScheduleStress(todayBlocks)

  const handleAddBlock = () => {
    if (!blockForm.title) return
    addScheduleBlock(selectedDate, { ...blockForm, duration: Number(blockForm.duration) })
    setBlockForm({ title: '', type: 'lecture', startTime: '09:00', duration: 60, course: '' })
    setShowBlockForm(false)
  }

  const handleAddDeadline = () => {
    if (!deadlineForm.title || !deadlineForm.date) return
    addDeadline(deadlineForm)
    setDeadlineForm({ title: '', course: '', date: selectedDate, type: 'assignment', priority: 'medium' })
    setShowDeadlineForm(false)
  }

  // Calendar
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const today = new Date()
  const todayISO = today.toISOString().split('T')[0]

  const getDeadlinesForDay = (day) => {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return deadlines.filter(d => d.date === dateStr)
  }
  const getScheduleForDay = (day) => {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return schedules[dateStr] || []
  }

  const sorted = [...deadlines].sort((a,b) => new Date(a.date) - new Date(b.date))
  const upcoming = sorted.filter(d => new Date(d.date) >= today)
  const getDaysLeft = (dateStr) => Math.ceil((new Date(dateStr) - today) / (1000*60*60*24))

  const inputS = {
    width: '100%', padding: '10px 13px',
    border: '1.5px solid var(--border)', borderRadius: 10,
    fontSize: 14, fontFamily: "'DM Sans', sans-serif",
    outline: 'none', background: 'var(--paper)', color: 'var(--text-primary)',
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>
          Academic Planner
        </p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800 }}>
          Schedule & Deadlines
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
          Log your daily schedule and the AI will predict your stress load for the day.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--paper-warm)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {[
          { id: 'schedule', label: '📅 Daily Schedule' },
          { id: 'deadlines', label: '📋 Deadlines' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '8px 20px', borderRadius: 10, border: 'none',
            background: activeTab === t.id ? 'white' : 'transparent',
            color: activeTab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: 13, fontWeight: activeTab === t.id ? 600 : 400,
            fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
            boxShadow: activeTab === t.id ? '0 2px 8px rgba(13,17,23,0.08)' : 'none',
            transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── SCHEDULE TAB ── */}
      {activeTab === 'schedule' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 20 }}>

          {/* Left: Calendar + date picker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card fade-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div className="card-title">{monthNames[month]} {year}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 16 }}
                    onClick={() => setViewMonth(new Date(year, month - 1, 1))}>‹</button>
                  <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 16 }}
                    onClick={() => setViewMonth(new Date(year, month + 1, 1))}>›</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', padding: '3px 0', letterSpacing: '0.5px' }}>{d}</div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
                {Array(daysInMonth).fill(null).map((_, i) => {
                  const day = i + 1
                  const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                  const isToday = dateStr === todayISO
                  const isSelected = dateStr === selectedDate
                  const hasSchedule = getScheduleForDay(day).length > 0
                  const hasDeadline = getDeadlinesForDay(day).length > 0

                  return (
                    <button key={day} onClick={() => setSelectedDate(dateStr)} style={{
                      aspectRatio: '1', borderRadius: 8, border: 'none',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                      background: isSelected ? 'var(--ink)' : isToday ? 'rgba(75,127,255,0.1)' : 'transparent',
                      cursor: 'pointer', padding: 2,
                      outline: isToday && !isSelected ? '1.5px solid #4B7FFF' : 'none',
                    }}>
                      <span style={{ fontSize: 12, fontWeight: isToday || isSelected ? 700 : 400, color: isSelected ? 'white' : 'var(--text-primary)' }}>
                        {day}
                      </span>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {hasSchedule && <div style={{ width: 4, height: 4, borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.6)' : '#4B7FFF' }} />}
                        {hasDeadline && <div style={{ width: 4, height: 4, borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.6)' : '#E05A5A' }} />}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4B7FFF' }} /> Schedule
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#E05A5A' }} /> Deadline
                </div>
              </div>
            </div>

            {/* Add block form */}
            <div className="card fade-up fade-up-1">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showBlockForm ? 16 : 0 }}>
                <div className="card-title">Add Block</div>
                <button className="btn btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}
                  onClick={() => setShowBlockForm(!showBlockForm)}>
                  {showBlockForm ? '✕ Cancel' : '+ Add'}
                </button>
              </div>

              {showBlockForm && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input value={blockForm.title} onChange={e => setBlockForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Block title (e.g. CS101 Lecture)" style={inputS} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <select value={blockForm.type} onChange={e => setBlockForm(p => ({ ...p, type: e.target.value }))} style={inputS}>
                      {Object.entries(TYPE_META).map(([k, v]) => (
                        <option key={k} value={k}>{v.icon} {v.label}</option>
                      ))}
                    </select>
                    <input value={blockForm.course} onChange={e => setBlockForm(p => ({ ...p, course: e.target.value }))}
                      placeholder="Course code" style={inputS} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>Start Time</div>
                      <input type="time" value={blockForm.startTime} onChange={e => setBlockForm(p => ({ ...p, startTime: e.target.value }))} style={inputS} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>Duration (mins)</div>
                      <select value={blockForm.duration} onChange={e => setBlockForm(p => ({ ...p, duration: Number(e.target.value) }))} style={inputS}>
                        {[15,30,45,60,75,90,120,150,180].map(d => (
                          <option key={d} value={d}>{d >= 60 ? `${Math.floor(d/60)}h${d%60 ? ` ${d%60}m` : ''}` : `${d}m`}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={handleAddBlock} style={{ width: '100%', justifyContent: 'center' }}>
                    ◈ Add to Schedule
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Timeline + stress prediction */}
          <div>
            {/* Date header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {todayBlocks.length} block{todayBlocks.length !== 1 ? 's' : ''} scheduled
                </div>
              </div>
              {selectedDate === todayISO && (
                <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(75,127,255,0.1)', color: '#4B7FFF', padding: '4px 12px', borderRadius: 20 }}>TODAY</span>
              )}
            </div>

            {/* Stress prediction */}
            <StressGauge score={predictedStress} />

            {/* Type breakdown */}
            {todayBlocks.length > 0 && (
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-label" style={{ marginBottom: 12 }}>Schedule Breakdown</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.entries(
                    todayBlocks.reduce((acc, b) => {
                      acc[b.type] = (acc[b.type] || 0) + 1
                      return acc
                    }, {})
                  ).map(([type, count]) => {
                    const m = TYPE_META[type] || TYPE_META.other
                    return (
                      <div key={type} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 20,
                        background: `${m.color}10`,
                        border: `1px solid ${m.color}25`,
                        fontSize: 12, color: m.color, fontWeight: 600,
                      }}>
                        {m.icon} {m.label} ×{count}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Timeline */}
            {todayBlocks.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '48px 24px',
                border: '1.5px dashed var(--border-strong)', borderRadius: 16,
                color: 'var(--text-muted)', fontSize: 14,
              }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📅</div>
                No blocks scheduled for this day.<br />
                <span style={{ fontSize: 13 }}>Add blocks using the form on the left.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {todayBlocks.map(block => (
                  <TimelineBlock
                    key={block.id}
                    block={block}
                    onRemove={() => removeScheduleBlock(selectedDate, block.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── DEADLINES TAB ── */}
      {activeTab === 'deadlines' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div className="card fade-up" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showDeadlineForm ? 16 : 0 }}>
                <div className="card-title">Add Deadline</div>
                <button className="btn btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}
                  onClick={() => setShowDeadlineForm(!showDeadlineForm)}>
                  {showDeadlineForm ? '✕ Cancel' : '+ Add'}
                </button>
              </div>
              {showDeadlineForm && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input value={deadlineForm.title} onChange={e => setDeadlineForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Linear Algebra Midterm" style={inputS} />
                  <input value={deadlineForm.course} onChange={e => setDeadlineForm(p => ({ ...p, course: e.target.value }))}
                    placeholder="Course code (e.g. MATH201)" style={inputS} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>Due Date</div>
                      <input type="date" value={deadlineForm.date} onChange={e => setDeadlineForm(p => ({ ...p, date: e.target.value }))} style={inputS} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>Type</div>
                      <select value={deadlineForm.type} onChange={e => setDeadlineForm(p => ({ ...p, type: e.target.value }))} style={inputS}>
                        <option value="assignment">Assignment</option>
                        <option value="exam">Exam</option>
                        <option value="project">Project</option>
                        <option value="quiz">Quiz</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Priority</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['high','medium','low'].map(p => {
                        const colors = { high: '#E05A5A', medium: '#E8A020', low: '#2BBFA4' }
                        const c = colors[p]
                        return (
                          <button key={p} onClick={() => setDeadlineForm(prev => ({ ...prev, priority: p }))} style={{
                            flex: 1, padding: '8px', borderRadius: 8, border: `1.5px solid ${deadlineForm.priority === p ? c : 'var(--border)'}`,
                            background: deadlineForm.priority === p ? `${c}15` : 'transparent',
                            color: deadlineForm.priority === p ? c : 'var(--text-muted)',
                            fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                            textTransform: 'capitalize',
                          }}>{p}</button>
                        )
                      })}
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={handleAddDeadline} style={{ width: '100%', justifyContent: 'center' }}>
                    ◈ Add Deadline
                  </button>
                </div>
              )}
            </div>

            {/* Upcoming list */}
            <div className="card fade-up fade-up-1">
              <div className="card-label" style={{ marginBottom: 12 }}>Upcoming Deadlines</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {upcoming.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No upcoming deadlines!</p>}
                {upcoming.map(d => {
                  const daysLeft = getDaysLeft(d.date)
                  const meta = DEADLINE_TYPE_META[d.type] || DEADLINE_TYPE_META.assignment
                  return (
                    <div key={d.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', background: 'var(--paper)',
                      borderRadius: 10, border: '1px solid var(--border)',
                      borderLeft: `3px solid ${meta.color}`,
                    }}>
                      <span style={{ fontSize: 18 }}>{meta.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{d.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.course} · {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </div>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: daysLeft <= 2 ? '#E05A5A' : daysLeft <= 5 ? '#E8A020' : 'var(--text-muted)',
                      }}>
                        {daysLeft === 0 ? 'TODAY' : daysLeft === 1 ? '1d' : `${daysLeft}d`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="card fade-up fade-up-1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="card-title">{monthNames[month]} {year}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 16 }}
                  onClick={() => setViewMonth(new Date(year, month - 1, 1))}>‹</button>
                <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 16 }}
                  onClick={() => setViewMonth(new Date(year, month + 1, 1))}>›</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', padding: '3px 0' }}>{d}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
              {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1
                const dayDeadlines = getDeadlinesForDay(day)
                const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
                return (
                  <div key={day} style={{
                    aspectRatio: '1', borderRadius: 8,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                    background: isToday ? 'var(--ink)' : dayDeadlines.length ? 'rgba(75,127,255,0.06)' : 'transparent',
                    border: isToday ? 'none' : dayDeadlines.length ? '1.5px solid rgba(75,127,255,0.15)' : 'none',
                    padding: 2,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? 'white' : 'var(--text-primary)' }}>{day}</span>
                    {dayDeadlines.length > 0 && (
                      <div style={{ display: 'flex', gap: 2 }}>
                        {dayDeadlines.slice(0,3).map((d,j) => (
                          <div key={j} style={{ width: 4, height: 4, borderRadius: '50%', background: DEADLINE_TYPE_META[d.type]?.color || '#4B7FFF' }} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
              {Object.entries(DEADLINE_TYPE_META).map(([k,v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: v.color }} /> {v.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
