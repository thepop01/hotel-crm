import { useState } from 'react'
import { ArrowRight, Users, Calendar, Check, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ROOMS = [
  {
    id: '1',
    name: 'Deluxe Ocean Suite',
    type: 'Suite',
    size: '85 sqm',
    capacity: 2,
    price: 28000,
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    features: ['Ocean View', 'Private Balcony', 'King Bed', 'Jacuzzi', 'Mini Bar'],
    available: true,
  },
  {
    id: '2',
    name: 'Royal Penthouse',
    type: 'Penthouse',
    size: '220 sqm',
    capacity: 4,
    price: 85000,
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    features: ['Panoramic View', 'Private Pool', 'Butler Service', '2 Bedrooms', 'Private Terrace'],
    available: true,
  },
  {
    id: '3',
    name: 'Garden Villa',
    type: 'Villa',
    size: '140 sqm',
    capacity: 3,
    price: 45000,
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    features: ['Private Garden', 'Plunge Pool', 'Outdoor Shower', 'King Bed', 'Living Room'],
    available: true,
  },
  {
    id: '4',
    name: 'Classic Deluxe Room',
    type: 'Deluxe',
    size: '45 sqm',
    capacity: 2,
    price: 12000,
    img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
    features: ['Pool View', 'King Bed', 'Rain Shower', 'Work Desk'],
    available: false,
  },
]

type Step = 1 | 2 | 3

export default function BookingPage() {
  const [step, setStep] = useState<Step>(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [selectedRoom, setSelectedRoom] = useState<typeof ROOMS[0] | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', requests: '' })
  const [confirmed, setConfirmed] = useState(false)

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmed(true)
  }

  if (confirmed && selectedRoom) {
    return (
      <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem 4rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <div style={{
              width: '80px', height: '80px',
              border: '1px solid var(--gold)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 2rem',
              animation: 'pulse-gold 2s infinite',
            }}>
              <Check size={32} style={{ color: 'var(--gold)' }} />
            </div>
            <span className="section-label" style={{ display: 'block', marginBottom: '1rem' }}>Booking Confirmed</span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', marginBottom: '1rem' }}>
              Welcome to Aurum
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              Your reservation for <strong style={{ color: 'var(--gold)' }}>{selectedRoom.name}</strong> has been confirmed.
              A confirmation has been sent to {form.email}.
            </p>
            <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
              {[
                ['Check-in', checkIn],
                ['Check-out', checkOut],
                ['Guests', guests.toString()],
                ['Total', `₹${(selectedRoom.price * nights).toLocaleString()}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--white)', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <Link to="/" className="btn-gold btn-gold-filled">Return Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ position: 'relative', height: '40vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80" alt="Booking" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <span className="section-label" style={{ display: 'block', marginBottom: '1rem' }}>Reserve Your Stay</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--white)' }}>
            Book Your <em style={{ color: 'var(--gold)' }}>Sanctuary</em>
          </h1>
        </div>
      </div>

      <div style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '3rem' }}>
          {(['Search', 'Select Room', 'Confirm'] as const).map((label, i) => {
            const s = (i + 1) as Step
            const active = step === s
            const done = step > s
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '36px', height: '36px',
                    border: `1px solid ${active || done ? 'var(--gold)' : 'var(--border)'}`,
                    background: done ? 'var(--gold)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: done ? 'var(--black)' : active ? 'var(--gold)' : 'var(--text-muted)',
                    fontSize: '0.75rem', fontWeight: 600,
                    transition: 'all 0.3s',
                  }}>
                    {done ? <Check size={14} /> : s}
                  </div>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? 'var(--gold)' : 'var(--text-muted)' }}>{label}</span>
                </div>
                {i < 2 && <div style={{ width: '80px', height: '1px', background: step > s ? 'var(--gold)' : 'var(--border)', margin: '0 0.5rem', marginBottom: '1.5rem', transition: 'background 0.3s' }} />}
              </div>
            )
          })}
        </div>

        {/* Step 1: Search */}
        {step === 1 && (
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '2.5rem' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', marginBottom: '2rem', textAlign: 'center' }}>
                Find Your Perfect Room
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                    <Calendar size={10} style={{ display: 'inline', marginRight: '0.4rem' }} />Check-in
                  </label>
                  <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="luxury-input" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                    <Calendar size={10} style={{ display: 'inline', marginRight: '0.4rem' }} />Check-out
                  </label>
                  <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="luxury-input" min={checkIn || new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                  <Users size={10} style={{ display: 'inline', marginRight: '0.4rem' }} />Guests
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} style={{ width: '36px', height: '36px', border: '1px solid var(--border)', background: 'none', color: 'var(--white)', cursor: 'pointer', fontSize: '1.2rem' }}>−</button>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', minWidth: '30px', textAlign: 'center' }}>{guests}</span>
                  <button onClick={() => setGuests(Math.min(6, guests + 1))} style={{ width: '36px', height: '36px', border: '1px solid var(--border)', background: 'none', color: 'var(--white)', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                </div>
              </div>
              <button
                className="btn-gold btn-gold-filled"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setStep(2)}
                disabled={!checkIn || !checkOut}
              >
                Search Available Rooms <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Room */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                <ChevronLeft size={16} /> Back
              </button>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {checkIn} → {checkOut} · {guests} guest{guests > 1 ? 's' : ''} · {nights} night{nights > 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {ROOMS.filter(r => r.capacity >= guests).map(room => (
                <div key={room.id} className="luxury-card" style={{
                  overflow: 'hidden',
                  opacity: room.available ? 1 : 0.5,
                  cursor: room.available ? 'pointer' : 'not-allowed',
                  border: selectedRoom?.id === room.id ? '1px solid var(--gold)' : '1px solid var(--border)',
                }} onClick={() => room.available && setSelectedRoom(room)}>
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img src={room.img} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="overlay-gradient" style={{ position: 'absolute', inset: 0 }} />
                    <span className={`badge ${room.available ? 'badge-green' : 'badge-red'}`} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                      {room.available ? 'Available' : 'Unavailable'}
                    </span>
                    {selectedRoom?.id === room.id && (
                      <div style={{ position: 'absolute', top: '1rem', left: '1rem', width: '28px', height: '28px', background: 'var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={14} color="black" />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>{room.name}</h3>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{room.size} · Up to {room.capacity} guests</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--gold)' }}>₹{room.price.toLocaleString()}</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>per night</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {room.features.slice(0, 3).map(f => (
                        <span key={f} style={{ fontSize: '0.6rem', color: 'var(--text-muted)', padding: '0.15rem 0.5rem', border: '1px solid var(--border)' }}>{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedRoom && (
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-gold btn-gold-filled" onClick={() => setStep(3)}>
                  Continue with {selectedRoom.name} <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedRoom && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
            <div>
              <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', marginBottom: '2rem' }}>
                <ChevronLeft size={16} /> Back
              </button>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '2rem' }}>Guest Details</h2>
              <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                  { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
                  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="luxury-input"
                      required
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Special Requests</label>
                  <textarea
                    placeholder="Any special requests or preferences..."
                    value={form.requests}
                    onChange={e => setForm(p => ({ ...p, requests: e.target.value }))}
                    className="luxury-input"
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="btn-gold btn-gold-filled" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                  Confirm Reservation <Check size={14} />
                </button>
              </form>
            </div>

            {/* Summary */}
            <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '2rem', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', marginBottom: '1.5rem' }}>Booking Summary</h3>
              <img src={selectedRoom.img} alt={selectedRoom.name} style={{ width: '100%', height: '160px', objectFit: 'cover', marginBottom: '1.25rem' }} />
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: '0.25rem' }}>{selectedRoom.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{selectedRoom.type} · {selectedRoom.size}</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                {[
                  ['Check-in', checkIn],
                  ['Check-out', checkOut],
                  ['Guests', guests.toString()],
                  ['Duration', `${nights} night${nights > 1 ? 's' : ''}`],
                  ['Rate', `₹${selectedRoom.price.toLocaleString()} / night`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--white)' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0 0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--white)' }}>Total</span>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--gold)' }}>
                    ₹{(selectedRoom.price * nights).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
