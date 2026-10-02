import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, ShoppingCart, BedDouble, Package, BarChart2, Users, Settings, LogOut, UtensilsCrossed } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',            label: 'Dashboard',            icon: LayoutDashboard, end: true },
  { to: '/bookings',    label: 'Bookings',             icon: CalendarDays },
  { to: '/orders',      label: 'Orders & POS',         icon: ShoppingCart },
  { to: '/pos',         label: 'POS Interface',        icon: UtensilsCrossed },
  { to: '/rooms',       label: 'Rooms & Housekeeping', icon: BedDouble },
  { to: '/inventory',   label: 'Inventory',            icon: Package },
  { to: '/reports',     label: 'Reports',              icon: BarChart2 },
  { to: '/staff-mgmt',  label: 'Staff',                icon: Users },
  { to: '/settings',    label: 'Settings',             icon: Settings },
]

export default function StaffDashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('staff_token')) {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  if (!localStorage.getItem('staff_token')) return null

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px',
        background: 'var(--dark)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 0',
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        zIndex: 50,
      }}>
        <div style={{ padding: '0 1.5rem 2rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--gold)' }}>AURUM</div>
          <div style={{ fontSize: '0.5rem', letterSpacing: '0.3em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Staff Portal</div>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1.5rem',
                background: isActive ? 'rgba(201,168,76,0.1)' : 'none',
                borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 500,
                transition: 'all 0.3s',
              })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <Link
            to="/login"
            onClick={() => localStorage.removeItem('staff_token')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              color: 'var(--text-muted)', textDecoration: 'none',
              fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}
          >
            <LogOut size={16} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '220px', flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
