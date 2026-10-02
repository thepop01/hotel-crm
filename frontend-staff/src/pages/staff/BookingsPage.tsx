import { useState } from 'react'

type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
type BookingSource = 'direct' | 'ota'

interface Booking {
  id: string
  guest: string
  room: string
  checkIn: string
  checkOut: string
  source: BookingSource
  otaPlatform?: string
  status: BookingStatus
}

const INITIAL_BOOKINGS: Booking[] = [
  { id: '1', guest: 'Arjun Mehta',   room: '412', checkIn: '2026-04-15', checkOut: '2026-04-18', source: 'direct', status: 'checked_in' },
  { id: '2', guest: 'Priya Sharma',  room: '305', checkIn: '2026-04-17', checkOut: '2026-04-20', source: 'ota', otaPlatform: 'Booking.com', status: 'confirmed' },
  { id: '3', guest: 'Rahul Verma',   room: '201', checkIn: '2026-04-10', checkOut: '2026-04-14', source: 'direct', status: 'checked_out' },
  { id: '4', guest: 'Sneha Patel',   room: '118', checkIn: '2026-04-18', checkOut: '2026-04-22', source: 'ota', otaPlatform: 'Expedia', status: 'confirmed' },
  { id: '5', guest: 'Vikram Singh',  room: '503', checkIn: '2026-04-12', checkOut: '2026-04-15', source: 'direct', status: 'cancelled' },
  { id: '6', guest: 'Meera Nair',    room: '220', checkIn: '2026-04-19', checkOut: '2026-04-25', source: 'direct', status: 'confirmed' },
]

const STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed:    'Confirmed',
  checked_in:   'Checked In',
  checked_out:  'Checked Out',
  cancelled:    'Cancelled',
}

const STATUS_STYLES: Record<BookingStatus, React.CSSProperties> = {
  confirmed:   { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' },
  checked_in:  { background: 'rgba(74,222,128,0.10)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.22)' },
  checked_out: { background: 'rgba(156,163,175,0.10)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.22)' },
  cancelled:   { background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.22)' },
}

type FilterStatus = 'all' | BookingStatus

const FILTER_TABS: { value: FilterStatus; label: string }[] = [
  { value: 'all',         label: 'All' },
  { value: 'confirmed',   label: 'Confirmed' },
  { value: 'checked_in',  label: 'Checked In' },
  { value: 'checked_out', label: 'Checked Out' },
  { value: 'cancelled',   label: 'Cancelled' },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const updateStatus = (id: string, newStatus: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
  }

  const filtered = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false
    if (dateFrom && b.checkIn < dateFrom) return false
    if (dateTo && b.checkIn > dateTo) return false
    return true
  })

  return (
    <div>
      <span className="section-label">Reservations</span>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginTop: '0.25rem', marginBottom: '2rem' }}>
        Bookings <em style={{ color: 'var(--gold)' }}>Overview</em>
      </h1>

      {/* Filter bar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        {/* Status tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              style={{
                padding: '0.4rem 0.9rem',
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 500,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: statusFilter === tab.value ? 'var(--gold)' : 'var(--border)',
                background: statusFilter === tab.value ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: statusFilter === tab.value ? 'var(--gold)' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Check-in</span>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            style={{
              background: 'var(--dark-2)',
              border: '1px solid var(--border)',
              color: 'var(--white)',
              padding: '0.35rem 0.6rem',
              fontSize: '0.75rem',
              fontFamily: 'Montserrat, sans-serif',
              outline: 'none',
              colorScheme: 'dark',
            }}
          />
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>—</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            style={{
              background: 'var(--dark-2)',
              border: '1px solid var(--border)',
              color: 'var(--white)',
              padding: '0.35rem 0.6rem',
              fontSize: '0.75rem',
              fontFamily: 'Montserrat, sans-serif',
              outline: 'none',
              colorScheme: 'dark',
            }}
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo('') }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                padding: '0.2rem 0.4rem',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--dark-2)' }}>
              {['Guest Name', 'Room', 'Check-in', 'Check-out', 'Source', 'Status', 'Actions'].map(col => (
                <th
                  key={col}
                  style={{
                    padding: '0.85rem 1rem',
                    textAlign: 'left',
                    fontSize: '0.6rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No bookings match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map(booking => (
                <tr
                  key={booking.id}
                  onMouseEnter={() => setHoveredRow(booking.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: hoveredRow === booking.id ? 'rgba(201,168,76,0.04)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Guest */}
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--white)', fontWeight: 400 }}>
                    {booking.guest}
                  </td>

                  {/* Room */}
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}>
                    {booking.room}
                  </td>

                  {/* Check-in */}
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--white)' }}>
                    {booking.checkIn}
                  </td>

                  {/* Check-out */}
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--white)' }}>
                    {booking.checkOut}
                  </td>

                  {/* Source */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {booking.source === 'ota' ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.55rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          background: 'rgba(168,85,247,0.12)',
                          color: '#c084fc',
                          border: '1px solid rgba(168,85,247,0.25)',
                        }}>
                          OTA
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                          {booking.otaPlatform}
                        </span>
                      </span>
                    ) : (
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.55rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        background: 'rgba(201,168,76,0.10)',
                        color: 'var(--gold)',
                        border: '1px solid rgba(201,168,76,0.22)',
                      }}>
                        Direct
                      </span>
                    )}
                  </td>

                  {/* Status badge */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      ...STATUS_STYLES[booking.status],
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.6rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                      display: 'inline-block',
                    }}>
                      {STATUS_LABELS[booking.status]}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {booking.status === 'confirmed' && (
                        <>
                          <ActionButton
                            label="Check In"
                            color="#4ade80"
                            onClick={() => updateStatus(booking.id, 'checked_in')}
                          />
                          <ActionButton
                            label="Cancel"
                            color="#f87171"
                            onClick={() => updateStatus(booking.id, 'cancelled')}
                          />
                        </>
                      )}
                      {booking.status === 'checked_in' && (
                        <ActionButton
                          label="Check Out"
                          color="#9ca3af"
                          onClick={() => updateStatus(booking.id, 'checked_out')}
                        />
                      )}
                      {(booking.status === 'checked_out' || booking.status === 'cancelled') && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontStyle: 'italic' }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div style={{ marginTop: '0.75rem', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--text-muted)', textAlign: 'right' }}>
        {filtered.length} of {bookings.length} bookings
      </div>
    </div>
  )
}

interface ActionButtonProps {
  label: string
  color: string
  onClick: () => void
}

function ActionButton({ label, color, onClick }: ActionButtonProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '0.3rem 0.65rem',
        fontSize: '0.6rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 500,
        cursor: 'pointer',
        border: `1px solid ${color}`,
        background: hovered ? `${color}22` : 'transparent',
        color: color,
        transition: 'background 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}
