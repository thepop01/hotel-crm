import { useState } from 'react'
import { ShoppingCart, Plus, Minus, Clock, Star, CheckCircle, Utensils, Sparkles, Wrench, X, Send, Package, Check } from 'lucide-react'
import Navbar from '../components/Navbar'

const MENU = [
  { id: '1', name: 'Lobster Thermidor', desc: 'Butter-poached Maine lobster, cognac cream, gruyère', price: 3200, category: 'Mains', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80', available: true, rating: 4.9 },
  { id: '2', name: 'Wagyu Beef Tenderloin', desc: 'A5 Wagyu, truffle jus, seasonal vegetables', price: 5800, category: 'Mains', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80', available: true, rating: 4.8 },
  { id: '3', name: 'Saffron Risotto', desc: 'Carnaroli rice, aged parmesan, black truffle', price: 1800, category: 'Mains', img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80', available: true, rating: 4.7 },
  { id: '4', name: 'Burrata & Heirloom Tomato', desc: 'Fresh burrata, heirloom tomatoes, basil oil', price: 1200, category: 'Starters', img: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&q=80', available: true, rating: 4.6 },
  { id: '5', name: 'Foie Gras Torchon', desc: 'Duck foie gras, brioche, fig compote', price: 2400, category: 'Starters', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', available: true, rating: 4.9 },
  { id: '6', name: 'Chocolate Fondant', desc: 'Valrhona dark chocolate, vanilla bean ice cream', price: 900, category: 'Desserts', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80', available: true, rating: 4.8 },
  { id: '7', name: 'Champagne Sorbet', desc: 'Moët & Chandon, raspberry coulis', price: 750, category: 'Desserts', img: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&q=80', available: false, rating: 4.5 },
  { id: '8', name: 'Truffle Fries', desc: 'Hand-cut fries, black truffle, parmesan', price: 650, category: 'Sides', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', available: true, rating: 4.7 },
]

const CATEGORIES = ['All', 'Starters', 'Mains', 'Sides', 'Desserts']

type CartItem = { id: string; name: string; price: number; qty: number }

type Tab = 'dining' | 'services' | 'orders'

const SERVICE_TYPES = [
  { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles, desc: 'Room cleaning & turndown service' },
  { id: 'laundry', label: 'Laundry', icon: Package, desc: 'Express laundry & dry cleaning' },
  { id: 'room_service', label: 'Room Service', icon: Utensils, desc: 'In-room dining & amenities' },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, desc: 'Technical support & repairs' },
]

const MOCK_ORDERS = [
  { id: 'ORD-001', items: ['Wagyu Beef Tenderloin', 'Truffle Fries'], total: 6450, status: 'out_for_delivery', time: '7:45 PM' },
  { id: 'ORD-002', items: ['Chocolate Fondant', 'Champagne Sorbet'], total: 1650, status: 'delivered', time: '6:30 PM' },
]

const STATUS_STEPS = ['placed', 'preparing', 'out_for_delivery', 'delivered']
const STATUS_LABELS: Record<string, string> = {
  placed: 'Order Placed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
}

export default function GuestPortal() {
  const [tab, setTab] = useState<Tab>('dining')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [deliveryTime, setDeliveryTime] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [serviceType, setServiceType] = useState('')
  const [serviceNote, setServiceNote] = useState('')
  const [serviceSubmitted, setServiceSubmitted] = useState(false)

  const filtered = MENU.filter(i => category === 'All' || i.category === category)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const addToCart = (item: typeof MENU[0]) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id)
      if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }]
    })
  }

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0))
  }

  const placeOrder = () => {
    if (!deliveryTime || cart.length === 0) return
    setOrderPlaced(true)
    setCart([])
    setCartOpen(false)
  }

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div style={{ paddingTop: '80px', background: 'var(--dark)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="section-label">Room 412 · Deluxe Ocean Suite</span>
              <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginTop: '0.25rem' }}>
                Good Evening, <em style={{ color: 'var(--gold)' }}>Guest</em>
              </h1>
            </div>
            <button
              onClick={() => setCartOpen(true)}
              style={{ position: 'relative', background: 'none', border: '1px solid var(--border)', color: 'var(--white)', padding: '0.75rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}
            >
              <ShoppingCart size={16} />
              Cart
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--gold)', color: 'var(--black)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', marginTop: '2rem', borderBottom: '1px solid var(--border)' }}>
            {([['dining', 'Dining'], ['services', 'Services'], ['orders', 'My Orders']] as const).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.75rem 1.5rem',
                fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: tab === t ? 'var(--gold)' : 'var(--text-muted)',
                borderBottom: tab === t ? '2px solid var(--gold)' : '2px solid transparent',
                transition: 'all 0.3s',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 500,
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem' }}>

        {/* Dining Tab */}
        {tab === 'dining' && (
          <div>
            {orderPlaced && (
              <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} style={{ color: '#4ade80' }} />
                <span style={{ fontSize: '0.8rem', color: '#4ade80' }}>Your order has been placed. We'll deliver to your room shortly.</span>
              </div>
            )}

            {/* Category filter */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)} style={{
                  padding: '0.4rem 1rem',
                  background: category === c ? 'var(--gold)' : 'transparent',
                  border: `1px solid ${category === c ? 'var(--gold)' : 'var(--border)'}`,
                  color: category === c ? 'var(--black)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  fontFamily: 'Montserrat, sans-serif', fontWeight: 500,
                  transition: 'all 0.3s',
                }}>{c}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {filtered.map(item => {
                const inCart = cart.find(c => c.id === item.id)
                return (
                  <div key={item.id} className="luxury-card" style={{ overflow: 'hidden', opacity: item.available ? 1 : 0.5 }}>
                    <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                      <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {!item.available && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="badge badge-red">Unavailable</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem' }}>{item.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Star size={10} fill="var(--gold)" color="var(--gold)" />
                          <span style={{ fontSize: '0.65rem', color: 'var(--gold)' }}>{item.rating}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>{item.desc}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--gold)' }}>₹{item.price.toLocaleString()}</span>
                        {item.available && (
                          inCart ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <button onClick={() => updateQty(item.id, -1)} style={{ width: '28px', height: '28px', border: '1px solid var(--border)', background: 'none', color: 'var(--white)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={12} /></button>
                              <span style={{ fontSize: '0.85rem', minWidth: '20px', textAlign: 'center' }}>{inCart.qty}</span>
                              <button onClick={() => addToCart(item)} style={{ width: '28px', height: '28px', border: '1px solid var(--gold)', background: 'var(--gold)', color: 'var(--black)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={12} /></button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(item)} className="btn-gold" style={{ padding: '0.4rem 1rem', fontSize: '0.6rem' }}>
                              <Plus size={12} /> Add
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {tab === 'services' && (
          <div style={{ maxWidth: '600px' }}>
            {serviceSubmitted ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <CheckCircle size={48} style={{ color: 'var(--gold)', margin: '0 auto 1.5rem', display: 'block' }} />
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '1rem' }}>Request Submitted</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>Our team will attend to your request shortly. You'll be notified of any updates.</p>
                <button className="btn-gold" onClick={() => { setServiceSubmitted(false); setServiceType(''); setServiceNote('') }}>Submit Another</button>
              </div>
            ) : (
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '2rem' }}>Request a Service</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  {SERVICE_TYPES.map(({ id, label, icon: Icon, desc }) => (
                    <div key={id} onClick={() => setServiceType(id)} style={{
                      padding: '1.5rem',
                      border: `1px solid ${serviceType === id ? 'var(--gold)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      background: serviceType === id ? 'rgba(201,168,76,0.08)' : 'transparent',
                      transition: 'all 0.3s',
                    }}>
                      <Icon size={20} style={{ color: serviceType === id ? 'var(--gold)' : 'var(--text-muted)', marginBottom: '0.75rem' }} />
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{label}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{desc}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Additional Notes</label>
                  <textarea
                    placeholder="Any specific instructions..."
                    value={serviceNote}
                    onChange={e => setServiceNote(e.target.value)}
                    className="luxury-input"
                    rows={3}
                    style={{ resize: 'none' }}
                  />
                </div>
                <button
                  className="btn-gold btn-gold-filled"
                  disabled={!serviceType}
                  onClick={() => setServiceSubmitted(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Send size={14} /> Submit Request
                </button>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div style={{ maxWidth: '700px' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '2rem' }}>My Orders</h2>
            {MOCK_ORDERS.map(order => {
              const stepIdx = STATUS_STEPS.indexOf(order.status)
              return (
                <div key={order.id} style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{order.id}</div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>{order.items.join(', ')}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--gold)' }}>₹{order.total.toLocaleString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                        <Clock size={10} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{order.time}</span>
                      </div>
                    </div>
                  </div>
                  {/* Progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                    {STATUS_STEPS.map((s, i) => {
                      const done = i <= stepIdx
                      return (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 'none' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                            <div style={{
                              width: '24px', height: '24px', borderRadius: '50%',
                              background: done ? 'var(--gold)' : 'var(--dark-3)',
                              border: `1px solid ${done ? 'var(--gold)' : 'var(--border)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.3s',
                            }}>
                              {done && <Check size={10} color="black" />}
                            </div>
                            <span style={{ fontSize: '0.55rem', color: done ? 'var(--gold)' : 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>
                              {STATUS_LABELS[s]}
                            </span>
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div style={{ flex: 1, height: '1px', background: i < stepIdx ? 'var(--gold)' : 'var(--border)', margin: '0 0.25rem', marginBottom: '1.2rem', transition: 'background 0.3s' }} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '400px',
            background: 'var(--dark-2)', borderLeft: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem' }}>Your Order</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }} className="modal-scroll">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <ShoppingCart size={32} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3 }} />
                  <p style={{ fontSize: '0.8rem' }}>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gold)' }}>₹{item.price.toLocaleString()}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{ width: '24px', height: '24px', border: '1px solid var(--border)', background: 'none', color: 'var(--white)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={10} /></button>
                      <span style={{ fontSize: '0.85rem', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={{ width: '24px', height: '24px', border: '1px solid var(--gold)', background: 'var(--gold)', color: 'var(--black)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={10} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                    <Clock size={10} style={{ display: 'inline', marginRight: '0.4rem' }} />Delivery Time
                  </label>
                  <input type="time" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} className="luxury-input" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total</span>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--gold)' }}>₹{cartTotal.toLocaleString()}</span>
                </div>
                <button className="btn-gold btn-gold-filled" style={{ width: '100%', justifyContent: 'center' }} onClick={placeOrder} disabled={!deliveryTime}>
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
