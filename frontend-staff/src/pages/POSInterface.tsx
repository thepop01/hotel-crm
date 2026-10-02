import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed, Sparkles, Activity } from 'lucide-react'

type Station = 'restaurant' | 'spa' | 'activity'
type OrderStatus = 'placed' | 'preparing' | 'ready' | 'delivered'

interface OrderItem {
  name: string
  qty: number
}

interface Order {
  id: string
  guest: string
  room: string
  station: Station
  items: OrderItem[]
  status: OrderStatus
  time: string
  total: number
}

const INITIAL_ORDERS: Order[] = [
  { id: '1', guest: 'Arjun Mehta', room: '412', station: 'restaurant', items: [{ name: 'Club Sandwich', qty: 2 }, { name: 'Fresh Lime Soda', qty: 2 }], status: 'placed', time: '5 min ago', total: 1200 },
  { id: '2', guest: 'Priya Sharma', room: '305', station: 'restaurant', items: [{ name: 'Paneer Tikka', qty: 1 }, { name: 'Butter Naan', qty: 3 }], status: 'preparing', time: '12 min ago', total: 950 },
  { id: '3', guest: 'Rahul Verma', room: '201', station: 'spa', items: [{ name: 'Swedish Massage', qty: 1 }], status: 'placed', time: '3 min ago', total: 3500 },
  { id: '4', guest: 'Sneha Patel', room: '118', station: 'activity', items: [{ name: 'Kayaking Session', qty: 2 }], status: 'ready', time: '20 min ago', total: 2400 },
]

const STATUS_NEXT: Record<OrderStatus, OrderStatus | null> = {
  placed: 'preparing',
  preparing: 'ready',
  ready: 'delivered',
  delivered: null,
}

const STATUS_ACTION: Record<OrderStatus, string | null> = {
  placed: 'Start Preparing',
  preparing: 'Mark Ready',
  ready: 'Mark Delivered',
  delivered: null,
}

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string; label: string }> = {
  placed: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', label: 'Placed' },
  preparing: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', label: 'Preparing' },
  ready: { bg: 'rgba(74,222,128,0.15)', color: '#4ade80', label: 'Ready' },
  delivered: { bg: 'rgba(156,163,175,0.1)', color: '#9ca3af', label: 'Delivered' },
}

const STATIONS: { id: Station; label: string; icon: typeof UtensilsCrossed }[] = [
  { id: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed },
  { id: 'spa', label: 'Spa', icon: Sparkles },
  { id: 'activity', label: 'Activity', icon: Activity },
]

export default function POSInterface() {
  const [activeStation, setActiveStation] = useState<Station>('restaurant')
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)
  const [chargeModal, setChargeModal] = useState<Order | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const visibleOrders = orders.filter(o => o.station === activeStation)

  function advanceStatus(id: string) {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o
      const next = STATUS_NEXT[o.status]
      return next ? { ...o, status: next } : o
    }))
  }

  function confirmCharge(order: Order) {
    setChargeModal(null)
    const msg = `Charged to Room ${order.room}`
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', color: 'var(--white)', fontFamily: 'Montserrat, sans-serif' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
          background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)',
          color: '#4ade80', padding: '0.75rem 1.5rem',
          fontSize: '0.75rem', letterSpacing: '0.1em',
          animation: 'fadeIn 0.3s ease',
        }}>
          ✓ {toast}
        </div>
      )}

      {/* Charge to Room Modal */}
      {chargeModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
          onClick={() => setChargeModal(null)}
        >
          <div style={{
            background: 'var(--dark)', border: '1px solid var(--border)',
            padding: '2.5rem', maxWidth: '420px', width: '100%',
          }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 300, marginBottom: '0.5rem', color: 'var(--white)' }}>
              Charge to Room
            </h2>
            <div style={{ width: '32px', height: '1px', background: 'var(--gold)', marginBottom: '1.5rem', opacity: 0.6 }} />

            <div style={{ marginBottom: '1.5rem', fontSize: '0.8rem', lineHeight: 1.8 }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--white)' }}>{chargeModal.guest}</span> — Room {chargeModal.room}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                {chargeModal.items.map(item => (
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    <span>{item.name} × {item.qty}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</span>
                <span style={{ color: 'var(--gold)', fontWeight: 500 }}>₹{chargeModal.total.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => confirmCharge(chargeModal)}
                style={{
                  flex: 1, padding: '0.75rem', background: 'var(--gold)', border: 'none',
                  color: 'var(--black)', fontSize: '0.65rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Confirm Charge
              </button>
              <button
                onClick={() => setChargeModal(null)}
                style={{
                  flex: 1, padding: '0.75rem', background: 'transparent',
                  border: '1px solid var(--border)', color: 'var(--text-muted)',
                  fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '1.25rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--dark)',
      }}>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 300, color: 'var(--white)', letterSpacing: '0.05em' }}>
            POS Interface
          </div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginTop: '0.15rem' }}>
            {STATIONS.find(s => s.id === activeStation)?.label} Station
          </div>
        </div>
        <Link to="/login" style={{
          fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--text-muted)',
          textDecoration: 'none', textTransform: 'uppercase',
          borderBottom: '1px solid var(--border)', paddingBottom: '2px',
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ← Back to Login
        </Link>
      </div>

      {/* Station Tabs */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--border)',
        background: 'var(--dark)',
      }}>
        {STATIONS.map(({ id, label, icon: Icon }) => {
          const active = activeStation === id
          return (
            <button
              key={id}
              onClick={() => setActiveStation(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 2rem',
                background: 'transparent',
                border: 'none',
                borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
                color: active ? 'var(--gold)' : 'var(--text-muted)',
                fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                fontWeight: active ? 500 : 300,
                transition: 'all 0.2s',
                marginBottom: '-1px',
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          )
        })}
      </div>

      {/* Order Queue */}
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'var(--text-muted)', marginBottom: '1.5rem',
        }}>
          Live Order Queue — {visibleOrders.length} order{visibleOrders.length !== 1 ? 's' : ''}
        </div>

        {visibleOrders.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            border: '1px solid var(--border)', color: 'var(--text-muted)',
            fontSize: '0.8rem', letterSpacing: '0.05em',
          }}>
            No active orders for this station.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {visibleOrders.map(order => {
            const statusStyle = STATUS_COLORS[order.status]
            const actionLabel = STATUS_ACTION[order.status]
            const isDelivered = order.status === 'delivered'

            return (
              <div key={order.id} style={{
                background: 'var(--dark)',
                border: '1px solid var(--border)',
                padding: '1.5rem',
                opacity: isDelivered ? 0.6 : 1,
                transition: 'opacity 0.3s',
              }}>
                {/* Card top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--white)', marginBottom: '0.2rem' }}>
                      {order.guest}
                    </div>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                      Room {order.room} · {order.time}
                    </div>
                  </div>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.3rem 0.75rem',
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                    fontWeight: 500,
                    border: `1px solid ${statusStyle.color}33`,
                  }}>
                    {statusStyle.label}
                  </div>
                </div>

                {/* Items */}
                <div style={{ marginBottom: '1.25rem' }}>
                  {order.items.map(item => (
                    <div key={item.name} style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: '0.75rem', color: 'var(--text-muted)',
                      padding: '0.2rem 0',
                    }}>
                      <span>{item.name}</span>
                      <span>× {item.qty}</span>
                    </div>
                  ))}
                  <div style={{
                    borderTop: '1px solid var(--border)', marginTop: '0.75rem', paddingTop: '0.75rem',
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.7rem',
                  }}>
                    <span style={{ color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</span>
                    <span style={{ color: 'var(--gold)', fontWeight: 500 }}>₹{order.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {actionLabel && (
                    <button
                      onClick={() => advanceStatus(order.id)}
                      style={{
                        padding: '0.6rem 1.25rem',
                        background: 'transparent',
                        border: '1px solid var(--gold)',
                        color: 'var(--gold)',
                        fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                        cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 500, transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = 'var(--black)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gold)' }}
                    >
                      {actionLabel}
                    </button>
                  )}
                  {!isDelivered && (
                    <button
                      onClick={() => setChargeModal(order)}
                      style={{
                        padding: '0.6rem 1.25rem',
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                        fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                        cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                    >
                      Charge to Room
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
