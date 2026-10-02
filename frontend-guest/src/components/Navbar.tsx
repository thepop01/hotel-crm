import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: '1.5rem 3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.4s ease',
    background: scrolled || !isHome ? 'rgba(10,10,10,0.97)' : 'transparent',
    borderBottom: scrolled || !isHome ? '1px solid rgba(201,168,76,0.15)' : 'none',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
  }

  const links = [
    { label: 'Rooms', href: '/book' },
    { label: 'Dining', href: '/guest' },
    { label: 'Amenities', href: '/#amenities' },
    { label: 'Experiences', href: '/#experiences' },
  ]

  return (
    <nav style={navStyle}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.6rem',
            color: 'var(--gold)',
            letterSpacing: '0.1em',
            lineHeight: 1,
          }}>AURUM</span>
          <span style={{
            fontSize: '0.5rem',
            letterSpacing: '0.4em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}>LUXURY RESORT</span>
        </div>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="desktop-nav">
        {links.map(l => (
          <Link key={l.label} to={l.href} style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 500,
            transition: 'color 0.3s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >{l.label}</Link>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/login" style={{
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}>Login</Link>
        <Link to="/book" className="btn-gold" style={{ padding: '0.6rem 1.5rem', fontSize: '0.6rem' }}>
          Reserve
        </Link>
        <button
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', color: 'var(--white)', cursor: 'pointer', display: 'none' }}
          className="mobile-menu-btn"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          top: '70px',
          background: 'rgba(10,10,10,0.98)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          zIndex: 99,
        }}>
          {links.map(l => (
            <Link key={l.label} to={l.href} onClick={() => setOpen(false)} style={{
              color: 'var(--white)',
              textDecoration: 'none',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2rem',
            }}>{l.label}</Link>
          ))}
          <Link to="/book" className="btn-gold" onClick={() => setOpen(false)}>Reserve Now</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
