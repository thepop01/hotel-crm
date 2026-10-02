import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [form, setForm] = useState({ phone: '', room: '' })
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/guest')
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
              Welcome<br /><em style={{ color: 'var(--gold)' }}>Back</em>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              Access your Aurum guest portal to book rooms, order food, and explore resort services.
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
            <span className="section-label">Guest Access</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Phone Number</label>
              <input
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="luxury-input"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Room Number</label>
              <input
                type="text"
                placeholder="e.g. 412"
                value={form.room}
                onChange={e => setForm(p => ({ ...p, room: e.target.value }))}
                className="luxury-input"
                required
              />
            </div>

            <button type="submit" className="btn-gold btn-gold-filled" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              Enter Guest Portal <ArrowRight size={14} />
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
