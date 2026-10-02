import { useState } from 'react'

type OrderStatus = 'placed' | 'preparing' | 'delivered' | 'cancelled'
type Station = 'restaurant' | 'spa' | 'activity'

interface Order {
  id: string
  guest: string
  room: string
  station: Station
  items: string
  status: OrderStatus
  folioCharged: boolean
  time: string
}

interface PosCharge {
  staff: string
  room: string
  items: string
  amount: string
  time: string
}

const ORDERS: Order[] = [
  { id: 'ORD-001', guest: 'Arjun Mehta',  room: '412', station: 'restaurant', items: 'Club Sandwich ×2, Lime Soda ×2',       status: 'delivered',  folioCharged: true,  time: '10:32 AM' },
  { id: 'ORD-002', guest: 'Priya Sharma', room: '305', station: 'restaurant', items: 'Paneer Tikka ×1, Butter Naan ×3',      status: 'preparing',  folioCharged: false, time: '11:05 AM' },
  { id: 'ORD-003', guest: 'Rahul Verma',  room: '201', station: 'spa',        items: 'Swedish Massage ×1',                   status: 'placed',     folioCharged: false, time: '11:20 AM' },
  { id: 'ORD-004', guest: 'Sneha Patel',  room: '118', station: 'activity',   items: 'Kayaking Session ×2',                  status: 'delivered',  folioCharged: true,  time: '09:15 AM' },
  { id: 'ORD-005', guest: 'Meera Nair',   room: '220', station: 'restaurant', items: 'Caesar Salad ×1, Iced Tea ×2',         status: 'placed',     folioCharged: false, time: '11:45 AM' },
]

const POS_CHARGES: PosCharge[] = [
  { staff: 'Ravi Kumar',  room: '412', items: 'Club Sandwich ×2, Lime Soda ×2', amount: '₹1,200', time: '10:35 AM' },
  { staff: 'Anita Desai', room: '118', items: 'Kayaking Session ×2',            amount: '₹2,400', time: '09:18 AM' },
  { staff: 'Ravi Kumar',  room: '305', items: 'Paneer Tikka ×1',                amount: '₹450',   time: '11:10 AM' },
]

const STATUS_LABEL: Record<OrderStatus, string> = {
  placed:    'Placed',
  preparing: 'Preparing',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const STATUS_STYLE: Record<OrderStatus, React.CSSProperties> = {
  placed:    { background: 'rgba(59,130,246,0.12)',  color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' },
  preparing: { background: 'rgba(251,191,36,0.12)',  color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' },
  delivered: { background: 'rgba(74,222,128,0.10)',  color: '#4ade80', border: '1px solid rgba(74,222,128,0.22)' },
  cancelled: { background: 'rgba(156,163,175,0.10)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.22)' },
}

const STATION_LABEL: Record<Station, string> = {
  restaurant: 'Restaurant',
  spa:        'Spa',
  activity:   'Activity',
}

type StationFilter = 'all' | Station
type StatusFilter  = 'all' | OrderStatus

const STATION_TABS: { value: StationFilter; label: string }[] = [
  { value: 'all',        label: 'All' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'spa',        label: 'Spa' },
  { value: 'activity',   label: 'Activity' },
]

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'placed',    label: 'Placed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const TAB_BTN = (active: boolean): React.CSSProperties => ({
  padding: '0.4rem 0.9rem',
  fontSize: '0.65rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 500,
  cursor: 'pointer',
  border: '1px solid',
  borderColor: active ? 'var(--gold)' : 'var(--border)',
  background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
  color: active ? 'var(--gold)' : 'var(--text-muted)',
  transition: 'all 0.2s',
})

const TH: React.CSSProperties = {
  padding: '0.85rem 1rem',
  textAlign: 'left',
  fontSize: '0.6rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  fontWeight: 500,
  whiteSpace: 'nowrap',
}

export default function OrdersPage() {
  const [stationFilter, setStationFilter] = useState<StationFilter>('all')
  const [statusFilter,  setStatusFilter]  = useState<StatusFilter>('all')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const filtered = ORDERS.filter(o => {
    if (stationFilter !== 'all' && o.station !== stationFilter) return false
    if (statusFilter  !== 'all' && o.status  !== statusFilter)  return false
    return true
  })

  return (
    <div>
      <span className="section-label">POS Activity</span>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginTop: '0.25rem', marginBottom: '2rem' }}>
        Orders <em style={{ color: 'var(--gold)' }}>&amp; POS Activity</em>
      </h1>

      {/* Filter bar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
        {/* Station tabs */}
        <div>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Station
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {STATION_TABS.map(tab => (
              <button key={tab.value} onClick={() => setStationFilter(tab.value)} style={TAB_BTN(stationFilter === tab.value)}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status tabs */}
        <div>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Status
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {STATUS_TABS.map(tab => (
              <button key={tab.value} onClick={() => setStatusFilter(tab.value)} style={TAB_BTN(statusFilter === tab.value)}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--dark-2)' }}>
              {['Order ID', 'Guest', 'Room', 'Station', 'Items', 'Status', 'Folio Charge', 'Time'].map(col => (
                <th key={col} style={TH}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No orders match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map(order => (
                <tr
                  key={order.id}
                  onMouseEnter={() => setHoveredRow(order.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: hoveredRow === order.id ? 'rgba(201,168,76,0.04)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Order ID */}
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                    {order.id}
                  </td>

                  {/* Guest */}
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--white)', whiteSpace: 'nowrap' }}>
                    {order.guest}
                  </td>

                  {/* Room */}
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {order.room}
                  </td>

                  {/* Station */}
                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                    <span style={{
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.55rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      background: 'rgba(201,168,76,0.08)',
                      color: 'var(--gold)',
                      border: '1px solid rgba(201,168,76,0.2)',
                    }}>
                      {STATION_LABEL[order.station]}
                    </span>
                  </td>

                  {/* Items */}
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', maxWidth: '220px' }}>
                    {order.items}
                  </td>

                  {/* Status badge */}
                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                    <span style={{
                      ...STATUS_STYLE[order.status],
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.6rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                      display: 'inline-block',
                    }}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </td>

                  {/* Folio charge */}
                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                    {order.folioCharged ? (
                      <span style={{
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.6rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        display: 'inline-block',
                        background: 'rgba(74,222,128,0.10)',
                        color: '#4ade80',
                        border: '1px solid rgba(74,222,128,0.22)',
                      }}>
                        Charged
                      </span>
                    ) : (
                      <span style={{
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.6rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        display: 'inline-block',
                        background: 'rgba(251,191,36,0.10)',
                        color: '#fbbf24',
                        border: '1px solid rgba(251,191,36,0.22)',
                      }}>
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Time */}
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.72rem' }}>
                    {order.time}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div style={{ marginTop: '0.75rem', marginBottom: '3rem', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--text-muted)', textAlign: 'right' }}>
        {filtered.length} of {ORDERS.length} orders
      </div>

      {/* POS Charge Log */}
      <div>
        <span className="section-label">Charge Log</span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
          POS <em style={{ color: 'var(--gold)' }}>Charge Log</em>
        </h2>

        <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', fontFamily: 'Montserrat, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--dark-2)' }}>
                {['Staff', 'Room', 'Item(s)', 'Amount', 'Time'].map(col => (
                  <th key={col} style={TH}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {POS_CHARGES.map((charge, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--white)', whiteSpace: 'nowrap' }}>
                    {charge.staff}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                    {charge.room}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', maxWidth: '220px' }}>
                    {charge.items}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#4ade80', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {charge.amount}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.7rem' }}>
                    {charge.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
