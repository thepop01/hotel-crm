export default function DashboardHome() {
  return (
    <div>
      <span className="section-label">Overview</span>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginTop: '0.25rem', marginBottom: '2rem' }}>
        Dashboard <em style={{ color: 'var(--gold)' }}>Home</em>
      </h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {['Active Orders', 'Pending Services', 'Rooms Occupied', 'Today Revenue'].map(label => (
          <div key={label} style={{
            background: 'var(--dark-2)',
            border: '1px solid var(--border)',
            padding: '1.5rem',
          }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{label}</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: 'var(--gold)' }}>—</div>
          </div>
        ))}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
        Coming soon — live summary cards will appear here.
      </div>
    </div>
  )
}
