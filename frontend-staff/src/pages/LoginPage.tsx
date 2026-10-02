import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

const STAFF_CREDENTIALS = { username: 'staff', password: 'aurum123' }

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.username === STAFF_CREDENTIALS.username && form.password === STAFF_CREDENTIALS.password) {
      localStorage.setItem('staff_token', 'authenticated')
      navigate('/')
    } else {
      setError('Invalid username or password.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'stretch' }}>
      {/* Left panel */}
      <div style={{ flex: 1, position: 'relative', display: 'none' }} className="login-left">
        <img
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80"
          alt="Resort"
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)' }} />
        <div style={{ position: 'relative', padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--gold)', letterSpacing: '0.1em' }}>AURUM</div>
            <div style={{ fontSize: '0.5rem', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>LUXURY RESORT</div>
          </div>
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', color: 'var(--white)', lineHeight: 1.1, marginBottom: '1rem' }}>
              Staff<br /><em style={{ color: 'var(--gold)' }}>Dashboard</em>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              Internal operations platform for Aurum staff and management.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        width: '100%', maxWidth: '480px', background: 'var(--dark)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2.5rem', borderLeft: '1px solid var(--border)',
      }}>
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>AURUM</div>
            <span className="section-label">Staff Dashboard</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                className="luxury-input"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="luxury-input"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ fontSize: '0.75rem', color: '#e05c5c', textAlign: 'center', marginTop: '-0.25rem' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-gold btn-gold-filled" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              Sign In <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .login-left { display: block !important; } }
      `}</style>
    </div>
  )
}
