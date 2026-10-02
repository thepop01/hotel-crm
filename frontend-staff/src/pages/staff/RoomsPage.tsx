import { useState } from 'react'

type RoomStatus = 'available' | 'occupied' | 'cleaning'

interface Room {
  id: string
  number: string
  type: 'Standard' | 'Deluxe' | 'Suite'
  floor: number
  status: RoomStatus
}

interface HousekeepingTask {
  roomId: string
  room: string
  guest: string
  checkoutTime: string
  assignedStaff: string | null
}

interface MaintenanceRequest {
  id: string
  location: string
  category: string
  description: string
  priority: 'low' | 'medium' | 'high'
  assignedStaff: string | null
}

const INITIAL_ROOMS: Room[] = [
  { id: '1', number: '101', type: 'Standard', floor: 1, status: 'available' },
  { id: '2', number: '102', type: 'Standard', floor: 1, status: 'occupied' },
  { id: '3', number: '201', type: 'Deluxe',   floor: 2, status: 'cleaning' },
  { id: '4', number: '202', type: 'Deluxe',   floor: 2, status: 'available' },
  { id: '5', number: '305', type: 'Suite',    floor: 3, status: 'occupied' },
  { id: '6', number: '412', type: 'Deluxe',   floor: 4, status: 'occupied' },
  { id: '7', number: '503', type: 'Suite',    floor: 5, status: 'cleaning' },
  { id: '8', number: '118', type: 'Standard', floor: 1, status: 'available' },
]

const INITIAL_HOUSEKEEPING: HousekeepingTask[] = [
  { roomId: '3', room: '201', guest: 'Rahul Verma',   checkoutTime: '11:00 AM', assignedStaff: 'Kavita Rao' },
  { roomId: '7', room: '503', guest: 'Vikram Singh',  checkoutTime: '12:00 PM', assignedStaff: null },
]

const MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
  { id: 'm1', location: 'Room 102', category: 'AC',         description: 'AC not cooling properly',      priority: 'high',   assignedStaff: 'Suresh Kumar' },
  { id: 'm2', location: 'Lobby',    category: 'Electrical', description: 'Light fixture flickering',     priority: 'medium', assignedStaff: null },
  { id: 'm3', location: 'Room 412', category: 'Plumbing',   description: 'Slow drain in bathroom',       priority: 'low',    assignedStaff: 'Suresh Kumar' },
]

// ── Status colours ──────────────────────────────────────────────────────────

const STATUS_BORDER: Record<RoomStatus, string> = {
  available: '#4ade80',
  occupied:  '#fbbf24',
  cleaning:  '#60a5fa',
}

const STATUS_BADGE: Record<RoomStatus, React.CSSProperties> = {
  available: { background: 'rgba(74,222,128,0.10)',  color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' },
  occupied:  { background: 'rgba(251,191,36,0.10)',  color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' },
  cleaning:  { background: 'rgba(96,165,250,0.10)',  color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' },
}

const STATUS_LABEL: Record<RoomStatus, string> = {
  available: 'Available',
  occupied:  'Occupied',
  cleaning:  'Cleaning',
}

const PRIORITY_BADGE: Record<'low' | 'medium' | 'high', React.CSSProperties> = {
  low:    { background: 'rgba(156,163,175,0.10)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.22)' },
  medium: { background: 'rgba(251,191,36,0.10)',  color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' },
  high:   { background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.22)' },
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Badge({ label, style }: { label: string; style: React.CSSProperties }) {
  return (
    <span style={{
      ...style,
      padding: '0.2rem 0.55rem',
      fontSize: '0.55rem',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      fontWeight: 600,
      display: 'inline-block',
    }}>
      {label}
    </span>
  )
}

function SectionHeading({ label, title, em }: { label: string; title: string; em: string }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <span className="section-label">{label}</span>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', marginTop: '0.2rem' }}>
        {title} <em style={{ color: 'var(--gold)' }}>{em}</em>
      </h2>
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS)
  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>(INITIAL_HOUSEKEEPING)

  const markCleaned = (roomId: string) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: 'available' } : r))
    setHousekeeping(prev => prev.filter(t => t.roomId !== roomId))
  }

  return (
    <div>
      <span className="section-label">Housekeeping</span>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginTop: '0.25rem', marginBottom: '2rem' }}>
        Rooms <em style={{ color: 'var(--gold)' }}>&amp; Housekeeping</em>
      </h1>

      {/* ── 1. Room Status Grid ── */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading label="Overview" title="Room" em="Status" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '1rem',
        }}>
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      {/* ── 2. Housekeeping Task Queue ── */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading label="Housekeeping" title="Cleaning" em="Queue" />
        {housekeeping.length === 0 ? (
          <div style={{
            border: '1px solid var(--border)',
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            fontStyle: 'italic',
          }}>
            No rooms pending cleaning.
          </div>
        ) : (
          <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--dark-2)' }}>
                  {['Room', 'Guest', 'Checkout Time', 'Assigned Staff', 'Action'].map(col => (
                    <th key={col} style={{
                      padding: '0.85rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.6rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {housekeeping.map(task => (
                  <HousekeepingRow key={task.roomId} task={task} onMarkCleaned={markCleaned} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── 3. Maintenance Requests ── */}
      <section>
        <SectionHeading label="Maintenance" title="Open" em="Requests" />
        <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--dark-2)' }}>
                {['Room / Location', 'Category', 'Description', 'Priority', 'Assigned Staff'].map(col => (
                  <th key={col} style={{
                    padding: '0.85rem 1rem',
                    textAlign: 'left',
                    fontSize: '0.6rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MAINTENANCE_REQUESTS.map(req => (
                <MaintenanceRow key={req.id} req={req} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

// ── Room Card ───────────────────────────────────────────────────────────────

function RoomCard({ room }: { room: Room }) {
  return (
    <div style={{
      background: 'var(--dark-2)',
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${STATUS_BORDER[room.status]}`,
      padding: '1.1rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      {/* Room number */}
      <div style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '2rem',
        color: 'var(--gold)',
        lineHeight: 1,
      }}>
        {room.number}
      </div>

      {/* Type */}
      <div style={{
        fontSize: '0.65rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        fontWeight: 500,
      }}>
        {room.type}
      </div>

      {/* Floor */}
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        Floor {room.floor}
      </div>

      {/* Status badge */}
      <div style={{ marginTop: '0.25rem' }}>
        <Badge label={STATUS_LABEL[room.status]} style={STATUS_BADGE[room.status]} />
      </div>
    </div>
  )
}

// ── Housekeeping Row ────────────────────────────────────────────────────────

function HousekeepingRow({ task, onMarkCleaned }: { task: HousekeepingTask; onMarkCleaned: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid var(--border)',
        background: hovered ? 'rgba(201,168,76,0.04)' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      <td style={{ padding: '0.85rem 1rem', color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}>
        {task.room}
      </td>
      <td style={{ padding: '0.85rem 1rem', color: 'var(--white)' }}>
        {task.guest}
      </td>
      <td style={{ padding: '0.85rem 1rem', color: 'var(--white)' }}>
        {task.checkoutTime}
      </td>
      <td style={{ padding: '0.85rem 1rem' }}>
        {task.assignedStaff
          ? <span style={{ color: 'var(--white)' }}>{task.assignedStaff}</span>
          : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
        }
      </td>
      <td style={{ padding: '0.85rem 1rem' }}>
        <button
          onClick={() => onMarkCleaned(task.roomId)}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            padding: '0.3rem 0.75rem',
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            border: '1px solid #4ade80',
            background: btnHovered ? 'rgba(74,222,128,0.15)' : 'transparent',
            color: '#4ade80',
            transition: 'background 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          Mark Cleaned
        </button>
      </td>
    </tr>
  )
}

// ── Maintenance Row ─────────────────────────────────────────────────────────

function MaintenanceRow({ req }: { req: MaintenanceRequest }) {
  const [hovered, setHovered] = useState(false)

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid var(--border)',
        background: hovered ? 'rgba(201,168,76,0.04)' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      <td style={{ padding: '0.85rem 1rem', color: 'var(--white)', fontWeight: 400 }}>
        {req.location}
      </td>
      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        {req.category}
      </td>
      <td style={{ padding: '0.85rem 1rem', color: 'var(--white)', maxWidth: '260px' }}>
        {req.description}
      </td>
      <td style={{ padding: '0.85rem 1rem' }}>
        <Badge
          label={req.priority.charAt(0).toUpperCase() + req.priority.slice(1)}
          style={PRIORITY_BADGE[req.priority]}
        />
      </td>
      <td style={{ padding: '0.85rem 1rem' }}>
        {req.assignedStaff
          ? <span style={{ color: 'var(--white)' }}>{req.assignedStaff}</span>
          : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
        }
      </td>
    </tr>
  )
}
