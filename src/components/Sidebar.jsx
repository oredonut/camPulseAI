import { useApp } from '../context/AppContext'

const NAV = [
  { id: 'dashboard', icon: '◉', label: 'Dashboard' },
  { id: 'checkin',   icon: '◈', label: 'Daily Check-In' },
  { id: 'planner',   icon: '▦', label: 'Academic Planner' },
  { id: 'insights',  icon: '◆', label: 'AI Insights' },
  { id: 'profile',   icon: '◎', label: 'Profile & Goals' },
  { id: 'chat', icon: '🤖', label: 'AI Assistant' },
]

export default function Sidebar() {
  const { page, setPage, riskLevel, examMode, user, logout } = useApp()
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'AI'

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">🎓</div>
        <div className="logo-text">
          CampusPulse
          <span>AI Prevention System</span>
        </div>
      </div>

      {examMode && (
        <div style={{
          background: 'rgba(232,160,32,0.15)',
          border: '1px solid rgba(232,160,32,0.3)',
          borderRadius: 10, padding: '10px 14px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>🔥</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#E8A020', letterSpacing: '0.5px' }}>EXAM MODE ACTIVE</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>Exam in &lt;7 days</div>
          </div>
        </div>
      )}

      <div className="nav-section-label">Navigation</div>
      {NAV.map(item => (
        <button key={item.id} className={`nav-item${page === item.id ? ' active' : ''}`} onClick={() => setPage(item.id)}>
          <span className="nav-icon">{item.icon}</span>
          {item.label}
          {item.id === 'checkin' && riskLevel === 'high' && <span className="nav-badge">!</span>}
        </button>
      ))}

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'Student'}</div>
            <div className="user-role">{user?.year ? `${user.year} · ` : ''}{user?.major || 'Campus Pulse'}</div>
          </div>
        </div>
        <button onClick={logout} style={{
          width: '100%', marginTop: 8, padding: '8px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
          color: 'rgba(255,255,255,0.35)', fontSize: 12,
          fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
          transition: 'all 0.2s',
        }}
          onMouseOver={e => { e.currentTarget.style.color = '#E05A5A'; e.currentTarget.style.borderColor = 'rgba(224,90,90,0.3)' }}
          onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
        >
          ← Log Out
        </button>
      </div>
    </aside>
  )
}
