import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--dark)',
      borderTop: '1px solid var(--border)',
      padding: '5rem 2rem 2rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '2rem',
                color: 'var(--gold)',
                letterSpacing: '0.1em',
              }}>AURUM</div>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.4em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                LUXURY RESORT
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: '220px' }}>
              Where timeless elegance meets modern luxury. An unparalleled sanctuary for the discerning traveller.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {['IG', 'FB', 'TW'].map((label, i) => (
                <a key={i} href="#" style={{
                  width: '36px', height: '36px',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                  fontSize: '0.55rem',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
              Explore
            </h4>
            {['Rooms & Suites', 'Dining', 'Spa & Wellness', 'Amenities', 'Events', 'Gallery'].map(item => (
              <div key={item} style={{ marginBottom: '0.75rem' }}>
                <a href="#" style={{
                  color: 'var(--text-muted)', textDecoration: 'none',
                  fontSize: '0.78rem', transition: 'color 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >{item}</a>
              </div>
            ))}
          </div>

          {/* Guest Services */}
          <div>
            <h4 style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
              Guest Services
            </h4>
            {['Online Check-in', 'Room Service', 'Concierge', 'Airport Transfer', 'Loyalty Program', 'Gift Cards'].map(item => (
              <div key={item} style={{ marginBottom: '0.75rem' }}>
                <a href="#" style={{
                  color: 'var(--text-muted)', textDecoration: 'none',
                  fontSize: '0.78rem', transition: 'color 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >{item}</a>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
              Contact
            </h4>
            {[
              { Icon: MapPin, text: '1 Aurum Boulevard, Goa, India 403001' },
              { Icon: Phone, text: '+91 832 000 0000' },
              { Icon: Mail, text: 'reservations@aurumresort.com' },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                <Icon size={14} style={{ color: 'var(--gold)', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            © 2026 Aurum Luxury Resort. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" style={{
                fontSize: '0.7rem', color: 'var(--text-muted)',
                textDecoration: 'none', transition: 'color 0.3s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
