import { useApp, AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CheckIn from './pages/CheckIn'
import Planner from './pages/Planner'
import Insights from './pages/Insights'
import Profile from './pages/Profile'
import ChatBot from './components/ChatBot'


import {db} from './firebase';
   console.log('Firebase DB initialized:', db);
const PAGE_MAP = {
  dashboard: { Component: Dashboard, title: 'Dashboard' },
  checkin:   { Component: CheckIn,   title: 'Daily Check-In' },
  planner:   { Component: Planner,   title: 'Academic Planner' },
  insights:  { Component: Insights,  title: 'AI Insights' },
  profile:   { Component: Profile,   title: 'Profile & Goals' },
}

const MOBILE_NAV = [
  { id: 'dashboard', icon: '◉', label: 'Home' },
  { id: 'checkin',   icon: '◈', label: 'Check-In' },
  { id: 'planner',   icon: '▦', label: 'Planner' },
  { id: 'insights',  icon: '◆', label: 'Insights' },
  { id: 'profile',   icon: '◎', label: 'Profile' },
]

function AppInner() {
  const { isAuthenticated, page, setPage } = useApp()

  if (!isAuthenticated) return <Login />

  const current = PAGE_MAP[page] || PAGE_MAP.dashboard
  const { Component, title } = current

  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <header className="topbar">
          <div className="page-title">{title}</div>
          <div className="topbar-right">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>
        <Component />
      </main>
      <nav className="mobile-nav">
        <div className="mobile-nav-inner">
          {MOBILE_NAV.map(item => (
            <button key={item.id} className={`mobile-nav-item${page === item.id ? ' active' : ''}`} onClick={() => setPage(item.id)}>
              <span className="m-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
      <ChatBot />
      <Toast />
    </div>
  )
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>
}
