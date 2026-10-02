import { useState, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

type PayrollStatus = 'draft' | 'approved' | 'finalized'
type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum'

interface PayrollEntry {
  name: string
  role: string
  daysPresent: number
  grossPay: number
  netPay: number
  status: PayrollStatus
}

interface AttendanceEntry {
  name: string
  role: string
  daysPresent: number
  daysAbsent: number
}

interface GuestEntry {
  name: string
  visits: number
  totalSpend: number
  tier: LoyaltyTier
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const PAYROLL: PayrollEntry[] = [
  { name: 'Ravi Kumar',   role: 'Kitchen',      daysPresent: 26, grossPay: 28000, netPay: 25200, status: 'finalized' },
  { name: 'Kavita Rao',   role: 'Housekeeping', daysPresent: 24, grossPay: 22000, netPay: 19800, status: 'approved'  },
  { name: 'Suresh Kumar', role: 'Maintenance',  daysPresent: 25, grossPay: 24000, netPay: 21600, status: 'finalized' },
  { name: 'Anita Desai',  role: 'Kitchen',      daysPresent: 22, grossPay: 28000, netPay: 23100, status: 'draft'     },
]

const ATTENDANCE: AttendanceEntry[] = [
  { name: 'Ravi Kumar',   role: 'Kitchen',      daysPresent: 26, daysAbsent: 4  },
  { name: 'Kavita Rao',   role: 'Housekeeping', daysPresent: 24, daysAbsent: 6  },
  { name: 'Suresh Kumar', role: 'Maintenance',  daysPresent: 25, daysAbsent: 5  },
  { name: 'Anita Desai',  role: 'Kitchen',      daysPresent: 22, daysAbsent: 8  },
]

const TOP_GUESTS: GuestEntry[] = [
  { name: 'Arjun Mehta',  visits: 5, totalSpend: 245000, tier: 'gold'     },
  { name: 'Priya Sharma', visits: 3, totalSpend: 120000, tier: 'silver'   },
  { name: 'Sneha Patel',  visits: 8, totalSpend: 480000, tier: 'platinum' },
  { name: 'Rahul Verma',  visits: 2, totalSpend: 65000,  tier: 'bronze'   },
]

// ── Shared helpers ───────────────────────────────────────────────────────────

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

const TD: React.CSSProperties = {
  padding: '0.85rem 1rem',
  color: 'var(--white)',
  fontSize: '0.78rem',
}

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN')
}

// ── Toast ────────────────────────────────────────────────────────────────────

interface Toast {
  id: number
  message: string
}

let toastId = 0

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((message: string) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2000)
  }, [])

  return { toasts, show }
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      zIndex: 9999,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: 'var(--dark-2)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--gold)',
          padding: '0.75rem 1.25rem',
          fontSize: '0.72rem',
          fontFamily: 'Montserrat, sans-serif',
          color: 'var(--white)',
          letterSpacing: '0.04em',
          animation: 'fadeIn 0.25s ease',
          minWidth: '220px',
        }}>
          {t.message}
        </div>
      ))}
    </div>
  )
}

// ── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  label,
  title,
  em,
  exportLabel,
  onExport,
  children,
}: {
  label: string
  title: string
  em: string
  exportLabel: string
  onExport: () => void
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <section style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <span className="section-label">{label}</span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', marginTop: '0.2rem' }}>
            {title} <em style={{ color: 'var(--gold)' }}>{em}</em>
          </h2>
        </div>
        <button
          onClick={onExport}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            padding: '0.4rem 0.9rem',
            fontSize: '0.6rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            border: '1px solid var(--border)',
            background: hovered ? 'rgba(201,168,76,0.08)' : 'transparent',
            color: hovered ? 'var(--gold)' : 'var(--text-muted)',
            transition: 'all 0.2s',
          }}
        >
          {exportLabel}
        </button>
      </div>
      {children}
    </section>
  )
}

// ── Badge ────────────────────────────────────────────────────────────────────

function Badge({ label, style }: { label: string; style: React.CSSProperties }) {
  return (
    <span style={{
      ...style,
      padding: '0.2rem 0.55rem',
      fontSize: '0.55rem',
      letterSpacing: '0.12em',
      textTransform: 'uppercase' as const,
      fontWeight: 600,
      display: 'inline-block',
    }}>
      {label}
    </span>
  )
}

const PAYROLL_BADGE: Record<PayrollStatus, React.CSSProperties> = {
  draft:     { background: 'rgba(107,114,128,0.12)', color: '#9ca3af', border: '1px solid rgba(107,114,128,0.25)' },
  approved:  { background: 'rgba(251,191,36,0.12)',  color: '#fbbf24', border: '1px solid rgba(251,191,36,0.28)' },
  finalized: { background: 'rgba(74,222,128,0.10)',  color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' },
}

const TIER_BADGE: Record<LoyaltyTier, React.CSSProperties> = {
  bronze:   { background: 'rgba(180,83,9,0.15)',   color: '#d97706', border: '1px solid rgba(180,83,9,0.3)'   },
  silver:   { background: 'rgba(156,163,175,0.12)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.25)' },
  gold:     { background: 'rgba(201,168,76,0.15)',  color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' },
  platinum: { background: 'rgba(139,92,246,0.12)',  color: '#a78bfa', border: '1px solid rgba(139,92,246,0.28)' },
}

// ── 1. Revenue Cards ─────────────────────────────────────────────────────────

function RevenueCards({ onExport }: { onExport: () => void }) {
  const cards = [
    { period: 'Daily Revenue',   amount: 48500,    trend: '+8% vs yesterday',      up: true  },
    { period: 'Weekly Revenue',  amount: 312000,   trend: '+12% vs last week',     up: true  },
    { period: 'Monthly Revenue', amount: 1285000,  trend: '+5% vs last month',     up: true  },
  ]

  return (
    <Section label="Revenue" title="Revenue" em="Metrics" exportLabel="Export PDF" onExport={onExport}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {cards.map(card => (
          <div key={card.period} style={{
            background: 'var(--dark-2)',
            border: '1px solid var(--border)',
            padding: '1.75rem',
          }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              {card.period}
            </div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2.4rem',
              color: 'var(--gold)',
              fontWeight: 400,
              lineHeight: 1,
              marginBottom: '0.75rem',
            }}>
              {fmt(card.amount)}
            </div>
            <div style={{ fontSize: '0.65rem', color: card.up ? '#4ade80' : '#f87171', letterSpacing: '0.04em' }}>
              {card.up ? '↑' : '↓'} {card.trend}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ── 2. Expense Analytics ─────────────────────────────────────────────────────

function ExpenseAnalytics({ onExport }: { onExport: () => void }) {
  const rows = [
    { category: 'Food',          spend: 185000, pct: 52 },
    { category: 'Housekeeping',  spend: 95000,  pct: 27 },
    { category: 'Maintenance',   spend: 75000,  pct: 21 },
  ]
  const total = rows.reduce((s, r) => s + r.spend, 0)

  return (
    <Section label="Expenses" title="Expense" em="Analytics" exportLabel="Export CSV" onExport={onExport}>
      <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--dark-2)' }}>
              {['Category', 'Total Spend', '% of Total'].map(col => (
                <th key={col} style={TH}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.category} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={TD}>{row.category}</td>
                <td style={{ ...TD, color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}>
                  {fmt(row.spend)}
                </td>
                <td style={{ ...TD }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      height: '4px',
                      width: `${row.pct * 1.5}px`,
                      background: 'rgba(201,168,76,0.35)',
                      borderRadius: '2px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        background: 'var(--gold)',
                        borderRadius: '2px',
                      }} />
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>{row.pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
            <tr style={{ borderTop: '1px solid var(--border)', background: 'var(--dark-2)' }}>
              <td style={{ ...TD, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                Total
              </td>
              <td style={{ ...TD, color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 500 }}>
                {fmt(total)}
              </td>
              <td style={{ ...TD, color: 'var(--text-muted)' }}>100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Section>
  )
}

// ── 3. Payroll Summary ───────────────────────────────────────────────────────

function PayrollSummary({ onExport }: { onExport: () => void }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <Section label="Payroll" title="Payroll" em="Summary" exportLabel="Export PDF" onExport={onExport}>
      <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--dark-2)' }}>
              {['Staff Name', 'Role', 'Days Present', 'Gross Pay', 'Net Pay', 'Status'].map(col => (
                <th key={col} style={TH}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYROLL.map((row, i) => (
              <tr
                key={row.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  borderBottom: '1px solid var(--border)',
                  background: hovered === i ? 'rgba(201,168,76,0.04)' : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <td style={{ ...TD, fontWeight: 500 }}>{row.name}</td>
                <td style={{ ...TD, color: 'var(--text-muted)' }}>{row.role}</td>
                <td style={TD}>{row.daysPresent}</td>
                <td style={{ ...TD, color: 'var(--white)' }}>{fmt(row.grossPay)}</td>
                <td style={{ ...TD, color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}>
                  {fmt(row.netPay)}
                </td>
                <td style={TD}>
                  <Badge label={row.status} style={PAYROLL_BADGE[row.status]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

// ── 4. GST Report Downloads ──────────────────────────────────────────────────

function GSTReports({ show }: { show: (msg: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const buttons = [
    { label: 'Download GSTR-1',  key: 'gstr1'  },
    { label: 'Download GSTR-3B', key: 'gstr3b' },
  ]

  return (
    <section style={{ marginBottom: '3rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <span className="section-label">Compliance</span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', marginTop: '0.2rem' }}>
          GST <em style={{ color: 'var(--gold)' }}>Reports</em>
        </h2>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {buttons.map(btn => (
          <button
            key={btn.key}
            onClick={() => show('Generating report...')}
            onMouseEnter={() => setHovered(btn.key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: '0.75rem 1.75rem',
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid var(--gold)',
              background: hovered === btn.key ? 'rgba(201,168,76,0.12)' : 'transparent',
              color: 'var(--gold)',
              transition: 'background 0.2s',
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </section>
  )
}

// ── 5. Staff Attendance ──────────────────────────────────────────────────────

function AttendanceSummary({ onExport }: { onExport: () => void }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const totalDays = 30

  return (
    <Section label="Attendance" title="Staff" em="Attendance" exportLabel="Export CSV" onExport={onExport}>
      <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--dark-2)' }}>
              {['Staff Name', 'Role', 'Days Present', 'Days Absent', 'Attendance %'].map(col => (
                <th key={col} style={TH}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ATTENDANCE.map((row, i) => {
              const pct = Math.round((row.daysPresent / totalDays) * 100)
              const isLow = pct < 80
              return (
                <tr
                  key={row.name}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: hovered === i ? 'rgba(201,168,76,0.04)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  <td style={{ ...TD, fontWeight: 500 }}>{row.name}</td>
                  <td style={{ ...TD, color: 'var(--text-muted)' }}>{row.role}</td>
                  <td style={TD}>{row.daysPresent}</td>
                  <td style={{ ...TD, color: row.daysAbsent > 6 ? '#f87171' : 'var(--text-muted)' }}>
                    {row.daysAbsent}
                  </td>
                  <td style={{ ...TD, color: isLow ? '#f87171' : '#4ade80', fontWeight: 600 }}>
                    {pct}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

// ── 6. Top Guests ────────────────────────────────────────────────────────────

function TopGuests({ onExport }: { onExport: () => void }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <Section label="Guests" title="Top" em="Guests" exportLabel="Export CSV" onExport={onExport}>
      <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--dark-2)' }}>
              {['Guest Name', 'Visits', 'Total Spend', 'Loyalty Tier'].map(col => (
                <th key={col} style={TH}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOP_GUESTS.map((row, i) => (
              <tr
                key={row.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  borderBottom: '1px solid var(--border)',
                  background: hovered === i ? 'rgba(201,168,76,0.04)' : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <td style={{ ...TD, fontWeight: 500 }}>{row.name}</td>
                <td style={TD}>{row.visits}</td>
                <td style={{ ...TD, color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}>
                  {fmt(row.totalSpend)}
                </td>
                <td style={TD}>
                  <Badge label={row.tier} style={TIER_BADGE[row.tier]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const { toasts, show } = useToast()

  return (
    <div>
      <span className="section-label">Analytics</span>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginTop: '0.25rem', marginBottom: '2rem' }}>
        Management <em style={{ color: 'var(--gold)' }}>Reports</em>
      </h1>

      <RevenueCards    onExport={() => show('Exporting Revenue Metrics...')} />
      <ExpenseAnalytics onExport={() => show('Exporting Expense Analytics...')} />
      <PayrollSummary  onExport={() => show('Exporting Payroll Summary...')} />
      <GSTReports      show={show} />
      <AttendanceSummary onExport={() => show('Exporting Attendance Summary...')} />
      <TopGuests       onExport={() => show('Exporting Top Guests...')} />

      <ToastContainer toasts={toasts} />
    </div>
  )
}
