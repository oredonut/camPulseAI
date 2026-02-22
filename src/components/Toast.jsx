import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toast } = useApp()

  if (!toast) return null

  const colors = {
    success: { bg: '#0D1117', accent: '#2BBFA4' },
    info: { bg: '#0D1117', accent: '#4B7FFF' },
    warning: { bg: '#0D1117', accent: '#E8A020' },
  }
  const c = colors[toast.type] || colors.info

  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      background: c.bg,
      color: 'white',
      padding: '14px 20px',
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 500,
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      zIndex: 9999,
      borderLeft: `3px solid ${c.accent}`,
      animation: 'fadeUp 0.3s ease both',
      maxWidth: 320,
    }}>
      {toast.type === 'success' && '✓'}
      {toast.type === 'warning' && '⚠'}
      {toast.type === 'info' && '◉'}
      {toast.msg}
    </div>
  )
}
