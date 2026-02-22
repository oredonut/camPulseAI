import { useState } from 'react'
import { useApp } from '../context/AppContext'

const MAJORS = [
  'Computer Science', 'Engineering', 'Medicine', 'Law',
  'Business', 'Psychology', 'Mathematics', 'Physics',
  'Nursing', 'Education', 'Architecture', 'Economics', 'Other',
]

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year+', 'Postgraduate']

export default function Login() {
  const { completeAuth } = useApp()
  const [mode, setMode] = useState('landing') // landing | login | signup
  const [step, setStep] = useState(1) // for signup steps
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    major: '', year: '', university: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const update = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const validateLogin = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  const handleLogin = () => {
    const e = validateLogin()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      completeAuth({ name: form.email.split('@')[0], email: form.email, major: 'Student', year: '' })
    }, 1200)
  }

  const handleSignupNext = () => {
    if (step === 1) {
      const e = validateStep1()
      if (Object.keys(e).length > 0) { setErrors(e); return }
      setErrors({})
      setStep(2)
    } else {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        completeAuth({ name: form.name, email: form.email, major: form.major, year: form.year, university: form.university })
      }, 1400)
    }
  }

  // ── Landing ────────────────────────────────────────────────────────────────
  if (mode === 'landing') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0D1117',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Background glow orbs */}
        <div style={{ position: 'absolute', top: -120, left: -120, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(75,127,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,127,212,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,191,164,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Nav */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #2B5CE6, #8B7FD4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>🎓</div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: 'white' }}>CampusPulse AI</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setMode('login')} style={{
              padding: '9px 22px', borderRadius: 10,
              border: '1.5px solid rgba(255,255,255,0.12)',
              background: 'transparent', color: 'rgba(255,255,255,0.7)',
              fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
            >Log In</button>
            <button onClick={() => setMode('signup')} style={{
              padding: '9px 22px', borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #2B5CE6, #8B7FD4)',
              color: 'white', fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer', fontWeight: 600,
            }}>Get Started</button>
          </div>
        </nav>

        {/* Hero */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', textAlign: 'center',
          padding: '40px 24px', position: 'relative', zIndex: 2,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(75,127,255,0.12)',
            border: '1px solid rgba(75,127,255,0.25)',
            borderRadius: 20, padding: '6px 16px',
            fontSize: 12, color: '#7AABFF',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, letterSpacing: '0.5px',
            marginBottom: 28,
          }}>
            ◉ AI-Powered Burnout Prevention
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(36px, 6vw, 68px)',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.1,
            maxWidth: 720,
            marginBottom: 20,
          }}>
            Protect your academic<br />
            <span style={{ background: 'linear-gradient(135deg, #4B7FFF, #C4BEEE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              performance with AI
            </span>
          </h1>

          <p style={{
            fontSize: 17, color: 'rgba(255,255,255,0.5)',
            maxWidth: 520, lineHeight: 1.7, marginBottom: 40,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            CampusPulse detects burnout before it hits. Daily check-ins, predictive risk scoring, and smart interventions — built specifically for students.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => setMode('signup')} style={{
              padding: '14px 32px', borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(135deg, #2B5CE6, #8B7FD4)',
              color: 'white', fontSize: 15, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(43,92,230,0.35)',
            }}>Start for Free →</button>
            <button onClick={() => setMode('login')} style={{
              padding: '14px 32px', borderRadius: 12,
              border: '1.5px solid rgba(255,255,255,0.12)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)', fontSize: 15,
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
            }}>I have an account</button>
          </div>

          {/* Feature pills */}
          <div style={{ display: 'flex', gap: 12, marginTop: 56, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: '🔮', label: 'Burnout Radar™' },
              { icon: '📊', label: 'Stability Index' },
              { icon: '🔄', label: 'Loop Detection' },
              { icon: '⚡', label: 'Cluster Alerts' },
              { icon: '🤖', label: 'AI Assistant' },
              { icon: '🔥', label: 'Exam Mode' },
            ].map(f => (
              <div key={f.label} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: '8px 16px',
                fontSize: 13, color: 'rgba(255,255,255,0.55)',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {f.icon} {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '20px 48px',
          display: 'flex', justifyContent: 'center', gap: 48,
          position: 'relative', zIndex: 2, flexWrap: 'wrap',
        }}>
          {[
            { val: '94%', label: 'Prediction Accuracy' },
            { val: '3min', label: 'Daily Check-In' },
            { val: '5 metrics', label: 'Behavioral Tracking' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: 'white' }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Shared auth card wrapper ───────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -100, left: -100, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(75,127,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,127,212,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: 440,
        background: '#161B22',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: '36px 36px',
        position: 'relative', zIndex: 2,
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #2B5CE6, #8B7FD4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🎓</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: 'white' }}>CampusPulse AI</span>
        </div>

        {/* ── LOGIN ── */}
        {mode === 'login' && (
          <>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: 'white', marginBottom: 6 }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
              Log in to continue tracking your wellness.
            </p>

            <Field label="Email" error={errors.email}>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                placeholder="you@university.edu" style={inputStyle} />
            </Field>

            <Field label="Password" error={errors.password}>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                placeholder="••••••••" style={inputStyle} />
            </Field>

            <button onClick={handleLogin} disabled={loading} style={primaryBtnStyle(loading)}>
              {loading ? <Spinner /> : 'Log In →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 20 }}>
              Don't have an account?{' '}
              <span onClick={() => { setMode('signup'); setErrors({}) }}
                style={{ color: '#7AABFF', cursor: 'pointer', fontWeight: 600 }}>Sign up</span>
            </p>
            <p style={{ textAlign: 'center', marginTop: 12 }}>
              <span onClick={() => setMode('landing')}
                style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}>← Back to home</span>
            </p>
          </>
        )}

        {/* ── SIGNUP ── */}
        {mode === 'signup' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: 'white' }}>
                {step === 1 ? 'Create account' : 'Your academic profile'}
              </h2>
              <div style={{ display: 'flex', gap: 5 }}>
                {[1, 2].map(s => (
                  <div key={s} style={{
                    width: s === step ? 20 : 8, height: 8,
                    borderRadius: 10,
                    background: s === step ? '#4B7FFF' : s < step ? '#2BBFA4' : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s',
                  }} />
                ))}
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 28 }}>
              Step {step} of 2 · {step === 1 ? 'Account details' : 'Academic info'}
            </p>

            {step === 1 && (
              <>
                <Field label="Full Name" error={errors.name}>
                  <input value={form.name} onChange={e => update('name', e.target.value)}
                    placeholder="Alex Kim" style={inputStyle} />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    placeholder="you@university.edu" style={inputStyle} />
                </Field>
                <Field label="Password" error={errors.password}>
                  <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                    placeholder="Min. 6 characters" style={inputStyle} />
                </Field>
              </>
            )}

            {step === 2 && (
              <>
                <Field label="University / Institution">
                  <input value={form.university} onChange={e => update('university', e.target.value)}
                    placeholder="e.g. University of Lagos" style={inputStyle} />
                </Field>
                <Field label="Major / Course">
                  <select value={form.major} onChange={e => update('major', e.target.value)} style={inputStyle}>
                    <option value="">Select your major</option>
                    {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Year of Study">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {YEARS.map(y => (
                      <button key={y} onClick={() => update('year', y)} style={{
                        padding: '8px 4px',
                        borderRadius: 8,
                        border: `1.5px solid ${form.year === y ? '#4B7FFF' : 'rgba(255,255,255,0.08)'}`,
                        background: form.year === y ? 'rgba(75,127,255,0.15)' : 'transparent',
                        color: form.year === y ? '#7AABFF' : 'rgba(255,255,255,0.45)',
                        fontSize: 11, fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.15s',
                      }}>{y}</button>
                    ))}
                  </div>
                </Field>
              </>
            )}

            <button onClick={handleSignupNext} disabled={loading} style={primaryBtnStyle(loading)}>
              {loading ? <Spinner /> : step === 1 ? 'Continue →' : 'Create Account →'}
            </button>

            {step === 2 && (
              <button onClick={() => setStep(1)} style={{
                width: '100%', marginTop: 10, padding: '12px',
                borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.08)',
                background: 'transparent', color: 'rgba(255,255,255,0.4)',
                fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>← Back</button>
            )}

            <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 20 }}>
              Already have an account?{' '}
              <span onClick={() => { setMode('login'); setStep(1); setErrors({}) }}
                style={{ color: '#7AABFF', cursor: 'pointer', fontWeight: 600 }}>Log in</span>
            </p>
            <p style={{ textAlign: 'center', marginTop: 8 }}>
              <span onClick={() => setMode('landing')}
                style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}>← Back to home</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 7, letterSpacing: '0.3px' }}>{label}</div>
      {children}
      {error && <div style={{ fontSize: 11, color: '#E05A5A', marginTop: 5 }}>⚠ {error}</div>}
    </div>
  )
}

function Spinner() {
  return (
    <div style={{
      width: 18, height: 18,
      border: '2px solid rgba(255,255,255,0.2)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      margin: '0 auto',
    }} />
  )
}

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1.5px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  color: 'white',
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  colorScheme: 'dark',
}

const primaryBtnStyle = (loading) => ({
  width: '100%',
  marginTop: 8,
  padding: '13px',
  borderRadius: 12,
  border: 'none',
  background: loading ? 'rgba(75,127,255,0.4)' : 'linear-gradient(135deg, #2B5CE6, #8B7FD4)',
  color: 'white',
  fontSize: 15,
  fontWeight: 600,
  fontFamily: "'DM Sans', sans-serif",
  cursor: loading ? 'not-allowed' : 'pointer',
  transition: 'opacity 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
})
