import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

type Category = 'food' | 'housekeeping' | 'maintenance'

interface InventoryItem {
  id: string
  name: string
  unit: string
  stock: number
  threshold: number
  lastPrice: number
}

type ProcurementStatus = 'pending_approval' | 'approved' | 'rejected'

interface ProcurementEntry {
  item: string
  supplier: string
  qty: number
  unitPrice: number
  total: number
  date: string
  status: ProcurementStatus
}

interface Supplier {
  name: string
  category: string
  contact: string
  active: boolean
}

interface PriceAnomaly {
  item: string
  submitted: number
  avgPrice: number
  deviation: number
  date: string
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const INVENTORY: Record<Category, InventoryItem[]> = {
  food: [
    { id: '1', name: 'Basmati Rice',   unit: 'kg',     stock: 45, threshold: 20, lastPrice: 85  },
    { id: '2', name: 'Chicken Breast', unit: 'kg',     stock: 8,  threshold: 15, lastPrice: 320 },
    { id: '3', name: 'Olive Oil',      unit: 'liters', stock: 12, threshold: 10, lastPrice: 450 },
    { id: '4', name: 'Paneer',         unit: 'kg',     stock: 3,  threshold: 10, lastPrice: 280 },
  ],
  housekeeping: [
    { id: '5', name: 'Bed Sheets',      unit: 'pieces', stock: 80,  threshold: 30, lastPrice: 650 },
    { id: '6', name: 'Towels',          unit: 'pieces', stock: 25,  threshold: 40, lastPrice: 350 },
    { id: '7', name: 'Shampoo Bottles', unit: 'pieces', stock: 120, threshold: 50, lastPrice: 45  },
  ],
  maintenance: [
    { id: '8', name: 'Light Bulbs',   unit: 'pieces', stock: 15, threshold: 20, lastPrice: 120 },
    { id: '9', name: 'Paint (White)', unit: 'liters', stock: 30, threshold: 10, lastPrice: 280 },
  ],
}

const INITIAL_PROCUREMENT: ProcurementEntry[] = [
  { item: 'Chicken Breast', supplier: 'Fresh Farms',  qty: 20, unitPrice: 320, total: 6400,  date: '2026-04-15', status: 'approved'          },
  { item: 'Paneer',         supplier: 'Dairy Direct', qty: 15, unitPrice: 280, total: 4200,  date: '2026-04-16', status: 'pending_approval'   },
  { item: 'Towels',         supplier: 'Linen House',  qty: 50, unitPrice: 350, total: 17500, date: '2026-04-14', status: 'rejected'           },
  { item: 'Light Bulbs',    supplier: 'ElectroPro',   qty: 30, unitPrice: 120, total: 3600,  date: '2026-04-17', status: 'pending_approval'   },
]

const SUPPLIERS: Supplier[] = [
  { name: 'Fresh Farms',  category: 'Food',          contact: '+91 98765 43210', active: true  },
  { name: 'Dairy Direct', category: 'Food',          contact: '+91 87654 32109', active: true  },
  { name: 'Linen House',  category: 'Housekeeping',  contact: '+91 76543 21098', active: true  },
  { name: 'ElectroPro',   category: 'Maintenance',   contact: '+91 65432 10987', active: false },
]

const PRICE_ANOMALIES: PriceAnomaly[] = [
  { item: 'Chicken Breast', submitted: 480, avgPrice: 310, deviation: 54.8, date: '2026-04-16' },
]

// ── Shared helpers ───────────────────────────────────────────────────────────

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

const PROCUREMENT_BADGE: Record<ProcurementStatus, React.CSSProperties> = {
  pending_approval: { background: 'rgba(251,191,36,0.12)',  color: '#fbbf24', border: '1px solid rgba(251,191,36,0.28)' },
  approved:         { background: 'rgba(74,222,128,0.10)',  color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' },
  rejected:         { background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.22)' },
}

const PROCUREMENT_LABELS: Record<ProcurementStatus, string> = {
  pending_approval: 'Pending',
  approved:         'Approved',
  rejected:         'Rejected',
}

const TH_STYLE: React.CSSProperties = {
  padding: '0.85rem 1rem',
  textAlign: 'left',
  fontSize: '0.6rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  fontWeight: 500,
  whiteSpace: 'nowrap',
}

// ── Main Page ────────────────────────────────────────────────────────────────

// Simulate manager role — in a real app this would come from auth context
const IS_MANAGER = true

export default function InventoryPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('food')
  const [procurement, setProcurement] = useState<ProcurementEntry[]>(INITIAL_PROCUREMENT)

  const items = INVENTORY[activeCategory]

  const handleApprove = (index: number) => {
    setProcurement(prev => prev.map((e, i) => i === index ? { ...e, status: 'approved' } : e))
  }

  const handleReject = (index: number) => {
    setProcurement(prev => prev.map((e, i) => i === index ? { ...e, status: 'rejected' } : e))
  }

  return (
    <div>
      <span className="section-label">Stock Control</span>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginTop: '0.25rem', marginBottom: '2rem' }}>
        Inventory <em style={{ color: 'var(--gold)' }}>Management</em>
      </h1>

      {/* ── 1. Category Tabs ── */}
      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

      {/* ── 2. Inventory Table ── */}
      <section style={{ marginBottom: '3rem' }}>
        <InventoryTable items={items} />
      </section>

      {/* ── 3. Procurement Entries ── */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading label="Procurement" title="Procurement" em="Entries" />
        <ProcurementTable
          entries={procurement}
          isManager={IS_MANAGER}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </section>

      {/* ── 4 & 5. Bottom panels ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <section>
          <SectionHeading label="Vendors" title="Supplier" em="Directory" />
          <SupplierDirectory suppliers={SUPPLIERS} />
        </section>
        <section>
          <SectionHeading label="Alerts" title="Price" em="Anomalies" />
          <PriceAnomalyPanel anomalies={PRICE_ANOMALIES} />
        </section>
      </div>
    </div>
  )
}

// ── Category Tabs ────────────────────────────────────────────────────────────

const CATEGORY_TABS: { value: Category; label: string }[] = [
  { value: 'food',         label: 'Food'         },
  { value: 'housekeeping', label: 'Housekeeping' },
  { value: 'maintenance',  label: 'Maintenance'  },
]

function CategoryTabs({ active, onChange }: { active: Category; onChange: (c: Category) => void }) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem' }}>
      {CATEGORY_TABS.map(tab => {
        const isActive = tab.value === active
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            style={{
              padding: '0.45rem 1.1rem',
              fontSize: '0.65rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: isActive ? 'var(--gold)' : 'var(--border)',
              background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
              color: isActive ? 'var(--gold)' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Inventory Table ──────────────────────────────────────────────────────────

function InventoryTable({ items }: { items: InventoryItem[] }) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  return (
    <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--dark-2)' }}>
            {['Item Name', 'Unit', 'Current Stock', 'Min Threshold', 'Last Purchase Price', 'Status'].map(col => (
              <th key={col} style={TH_STYLE}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const isLow = item.stock < item.threshold
            const isHovered = hoveredRow === item.id
            return (
              <tr
                key={item.id}
                onMouseEnter={() => setHoveredRow(item.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  borderBottom: '1px solid var(--border)',
                  background: isLow
                    ? isHovered ? 'rgba(248,113,113,0.10)' : 'rgba(248,113,113,0.06)'
                    : isHovered ? 'rgba(201,168,76,0.04)' : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <td style={{ padding: '0.85rem 1rem', color: 'var(--white)', fontWeight: 400 }}>
                  {item.name}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                  {item.unit}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: isLow ? '#f87171' : 'var(--white)', fontWeight: isLow ? 600 : 400 }}>
                  {item.stock}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                  {item.threshold}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--white)' }}>
                  ₹{item.lastPrice.toLocaleString()}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  {isLow ? (
                    <Badge
                      label="Low Stock"
                      style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}
                    />
                  ) : (
                    <Badge
                      label="OK"
                      style={{ background: 'rgba(74,222,128,0.10)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.22)' }}
                    />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Procurement Table ────────────────────────────────────────────────────────

function ProcurementTable({
  entries,
  isManager,
  onApprove,
  onReject,
}: {
  entries: ProcurementEntry[]
  isManager: boolean
  onApprove: (i: number) => void
  onReject: (i: number) => void
}) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  const cols = isManager
    ? ['Item', 'Supplier', 'Qty', 'Unit Price', 'Total', 'Date', 'Approval Status', 'Actions']
    : ['Item', 'Supplier', 'Qty', 'Unit Price', 'Total', 'Date', 'Approval Status']

  return (
    <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'Montserrat, sans-serif' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--dark-2)' }}>
            {cols.map(col => <th key={col} style={TH_STYLE}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr
              key={i}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                borderBottom: '1px solid var(--border)',
                background: hoveredRow === i ? 'rgba(201,168,76,0.04)' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              <td style={{ padding: '0.85rem 1rem', color: 'var(--white)' }}>{entry.item}</td>
              <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{entry.supplier}</td>
              <td style={{ padding: '0.85rem 1rem', color: 'var(--white)' }}>{entry.qty}</td>
              <td style={{ padding: '0.85rem 1rem', color: 'var(--white)' }}>₹{entry.unitPrice.toLocaleString()}</td>
              <td style={{ padding: '0.85rem 1rem', color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem' }}>
                ₹{entry.total.toLocaleString()}
              </td>
              <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{entry.date}</td>
              <td style={{ padding: '0.85rem 1rem' }}>
                <Badge label={PROCUREMENT_LABELS[entry.status]} style={PROCUREMENT_BADGE[entry.status]} />
              </td>
              {isManager && (
                <td style={{ padding: '0.85rem 1rem' }}>
                  {entry.status === 'pending_approval' ? (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <ActionButton label="Approve" color="#4ade80" onClick={() => onApprove(i)} />
                      <ActionButton label="Reject"  color="#f87171" onClick={() => onReject(i)}  />
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontStyle: 'italic' }}>—</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Supplier Directory ───────────────────────────────────────────────────────

function SupplierDirectory({ suppliers }: { suppliers: Supplier[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {suppliers.map(s => (
        <div
          key={s.name}
          style={{
            background: 'var(--dark-2)',
            border: '1px solid var(--border)',
            borderLeft: `3px solid ${s.active ? '#4ade80' : '#6b7280'}`,
            padding: '0.9rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '0.78rem', color: 'var(--white)', marginBottom: '0.2rem' }}>
              {s.name}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
              {s.category} · {s.contact}
            </div>
          </div>
          <Badge
            label={s.active ? 'Active' : 'Inactive'}
            style={s.active
              ? { background: 'rgba(74,222,128,0.10)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.22)' }
              : { background: 'rgba(107,114,128,0.12)', color: '#9ca3af', border: '1px solid rgba(107,114,128,0.22)' }
            }
          />
        </div>
      ))}
    </div>
  )
}

// ── Price Anomaly Panel ──────────────────────────────────────────────────────

function PriceAnomalyPanel({ anomalies }: { anomalies: PriceAnomaly[] }) {
  if (anomalies.length === 0) {
    return (
      <div style={{
        border: '1px solid var(--border)',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        fontStyle: 'italic',
      }}>
        No price anomalies detected.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {anomalies.map((a, i) => (
        <div
          key={i}
          style={{
            background: 'rgba(248,113,113,0.05)',
            border: '1px solid rgba(248,113,113,0.22)',
            borderLeft: '3px solid #f87171',
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '0.78rem', color: 'var(--white)' }}>
              {a.item}
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{a.date}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                Submitted
              </div>
              <div style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 600 }}>₹{a.submitted}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                Hist. Avg
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--white)' }}>₹{a.avgPrice}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                Deviation
              </div>
              <div style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 700 }}>+{a.deviation}%</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Shared sub-components ────────────────────────────────────────────────────

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

function ActionButton({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
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
