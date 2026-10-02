import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Star, Wifi, Car, Utensils, Waves, Dumbbell, Sparkles, ArrowRight, Quote } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ROOMS = [
  {
    name: 'Deluxe Ocean Suite',
    type: 'Suite',
    size: '85 sqm',
    price: 28000,
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    features: ['Ocean View', 'Private Balcony', 'King Bed'],
  },
  {
    name: 'Royal Penthouse',
    type: 'Penthouse',
    size: '220 sqm',
    price: 85000,
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    features: ['Panoramic View', 'Private Pool', 'Butler Service'],
  },
  {
    name: 'Garden Villa',
    type: 'Villa',
    size: '140 sqm',
    price: 45000,
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    features: ['Private Garden', 'Plunge Pool', 'Outdoor Shower'],
  },
]

const AMENITIES = [
  { icon: Waves, label: 'Infinity Pool', desc: 'Overlooking the Arabian Sea' },
  { icon: Sparkles, label: 'Aurum Spa', desc: 'Ancient healing rituals' },
  { icon: Utensils, label: 'Fine Dining', desc: '3 signature restaurants' },
  { icon: Dumbbell, label: 'Fitness Centre', desc: 'State-of-the-art equipment' },
  { icon: Wifi, label: 'High-Speed WiFi', desc: 'Seamless connectivity' },
  { icon: Car, label: 'Valet Parking', desc: 'Complimentary service' },
]

const TESTIMONIALS = [
  {
    text: 'An experience beyond words. The attention to detail, the impeccable service, and the breathtaking views made our anniversary truly unforgettable.',
    author: 'Priya & Arjun Mehta',
    stay: 'Royal Penthouse, 5 nights',
    stars: 5,
  },
  {
    text: 'Aurum redefines luxury. From the moment we arrived, every need was anticipated. The spa treatments were transcendent.',
    author: 'Sarah & James Whitfield',
    stay: 'Garden Villa, 7 nights',
    stars: 5,
  },
  {
    text: 'The finest resort I have stayed at across three continents. The culinary experience alone is worth the journey.',
    author: 'Hiroshi Tanaka',
    stay: 'Deluxe Ocean Suite, 4 nights',
    stars: 5,
  },
]

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div ref={heroRef} style={{
          position: 'absolute', inset: '-20%',
          backgroundImage: 'url(https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1800&q=90)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.85) 100%)' }} />

        <div style={{ position: 'relative', textAlign: 'center', padding: '0 2rem', maxWidth: '900px' }}>
          <div className="animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <span className="section-label" style={{ display: 'block', marginBottom: '1.5rem' }}>
              ✦ Welcome to Aurum ✦
            </span>
          </div>
          <h1 className="animate-fade-up" style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            fontWeight: 300,
            lineHeight: 1,
            color: 'var(--white)',
            marginBottom: '1.5rem',
            animationDelay: '0.4s',
            opacity: 0,
          }}>
            Where Luxury<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Finds Its Home</em>
          </h1>
          <p className="animate-fade-up" style={{
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.05em',
            marginBottom: '3rem',
            animationDelay: '0.6s',
            opacity: 0,
          }}>
            An exclusive sanctuary on the shores of Goa, where every moment is crafted to perfection
          </p>
          <div className="animate-fade-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.8s', opacity: 0 }}>
            <Link to="/book" className="btn-gold btn-gold-filled">
              Reserve Your Stay <ArrowRight size={14} />
            </Link>
            <Link to="/guest" className="btn-gold">
              Explore Dining
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          animation: 'fadeIn 1s ease 1.5s forwards', opacity: 0,
        }}>
          <span style={{ fontSize: '0.55rem', letterSpacing: '0.3em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scroll</span>
          <ChevronDown size={16} style={{ color: 'var(--gold)', animation: 'fadeUp 1s ease infinite alternate' }} />
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: 'var(--dark-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2.5rem 2rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
          {[
            { num: '48', label: 'Luxury Suites' },
            { num: '3', label: 'Signature Restaurants' },
            { num: '15+', label: 'Years of Excellence' },
            { num: '98%', label: 'Guest Satisfaction' },
          ].map(({ num, label }) => (
            <div key={label}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: 'var(--gold)', lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.5rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div>
            <span className="section-label">Our Story</span>
            <div className="gold-divider" style={{ margin: '1rem 0' }} />
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
              A Legacy of<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Timeless Elegance</em>
            </h2>
            <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
              Nestled along the pristine coastline of Goa, Aurum Luxury Resort has been the destination of choice for royalty, dignitaries, and discerning travellers since 2009.
            </p>
            <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
              Every corner of our resort tells a story of craftsmanship, every service a testament to our unwavering commitment to excellence.
            </p>
            <Link to="/book" className="btn-gold">Discover More <ArrowRight size={14} /></Link>
          </div>
          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=80"
              alt="Resort"
              style={{ width: '100%', height: '500px', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: '-2rem', left: '-2rem',
              background: 'var(--dark-2)', border: '1px solid var(--border)',
              padding: '1.5rem 2rem',
            }}>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="var(--gold)" color="var(--gold)" />)}
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--white)' }}>Forbes Five-Star</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>CERTIFIED LUXURY RESORT</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="section" style={{ background: 'var(--dark)' }} id="rooms">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-label">Accommodations</span>
            <div className="gold-divider" />
            <h2 className="section-title">Rooms & Suites</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {ROOMS.map(room => (
              <div key={room.name} className="luxury-card" style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative', overflow: 'hidden', height: '260px' }}>
                  <img
                    src={room.img}
                    alt={room.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div className="overlay-gradient" style={{ position: 'absolute', inset: 0 }} />
                  <span className="badge badge-gold" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>{room.type}</span>
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{room.size}</div>
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', marginBottom: '0.75rem' }}>{room.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {room.features.map(f => (
                      <span key={f} style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', padding: '0.2rem 0.6rem', border: '1px solid var(--border)' }}>{f}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: 'var(--gold)' }}>
                        ₹{room.price.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}> / night</span>
                    </div>
                    <Link to="/book" className="btn-gold" style={{ padding: '0.5rem 1.2rem', fontSize: '0.6rem' }}>Book</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="section" id="amenities">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-label">World-Class Facilities</span>
            <div className="gold-divider" />
            <h2 className="section-title">Resort Amenities</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {AMENITIES.map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{
                padding: '2rem 1.5rem',
                border: '1px solid var(--border)',
                textAlign: 'center',
                transition: 'all 0.3s',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'rgba(201,168,76,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{
                  width: '50px', height: '50px',
                  border: '1px solid var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: 'var(--gold)',
                }}>
                  <Icon size={20} />
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', marginBottom: '0.4rem' }}>{label}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width image break */}
      <section style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1540541338537-1220059169af?w=1800&q=80"
          alt="Pool"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '2rem' }}>
          <span className="section-label" style={{ marginBottom: '1rem' }}>Exclusive Offer</span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--white)', marginBottom: '1rem' }}>
            Stay 3 Nights,<br />
            <em style={{ color: 'var(--gold)' }}>Experience Eternity</em>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', maxWidth: '400px' }}>
            Book 3 or more nights and receive complimentary spa access, daily breakfast, and a sunset cruise for two.
          </p>
          <Link to="/book" className="btn-gold btn-gold-filled">Claim Offer</Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span className="section-label">Guest Voices</span>
          <div className="gold-divider" />
          <h2 className="section-title" style={{ marginBottom: '3rem' }}>What Our Guests Say</h2>

          <div style={{ position: 'relative', minHeight: '200px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                position: i === activeTestimonial ? 'relative' : 'absolute',
                opacity: i === activeTestimonial ? 1 : 0,
                transition: 'opacity 0.6s ease',
                top: 0, left: 0, right: 0,
              }}>
                <Quote size={32} style={{ color: 'var(--gold)', opacity: 0.4, margin: '0 auto 1.5rem' }} />
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontStyle: 'italic', color: 'var(--white)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  {[...Array(t.stars)].map((_, j) => <Star key={j} size={14} fill="var(--gold)" color="var(--gold)" />)}
                </div>
                <div style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--white)' }}>{t.author}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{t.stay}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} style={{
                width: i === activeTestimonial ? '24px' : '8px',
                height: '8px',
                background: i === activeTestimonial ? 'var(--gold)' : 'var(--border)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                borderRadius: '4px',
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <span className="section-label">Begin Your Journey</span>
          <div className="gold-divider" />
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            Reserve Your<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Sanctuary</em>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2.5rem' }}>
            Let us craft an experience tailored exclusively for you. Our concierge team is available 24 hours to ensure every detail exceeds your expectations.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/book" className="btn-gold btn-gold-filled">Book Now <ArrowRight size={14} /></Link>
            <a href="tel:+918320000000" className="btn-gold">Call Concierge</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
