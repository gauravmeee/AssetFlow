const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  hero: {
    background: 'linear-gradient(135deg, #f8f7ff 0%, #f2f7ff 100%)',
    border: '1px solid #e7e3ff',
    borderRadius: '20px',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1f2937',
    margin: '0 0 6px',
  },
  subtitle: {
    margin: 0,
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: 1.6,
    maxWidth: '720px',
  },
  actionBtn: {
    border: 'none',
    background: '#534AB7',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '10px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
  },
  statCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '6px',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#111827',
  },
  statDetail: {
    fontSize: '12px',
    color: '#4b5563',
    marginTop: '4px',
  },
  sectionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  sectionCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '18px',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '4px',
  },
  sectionDesc: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '12px',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  itemLabel: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: 600,
  },
  itemValue: {
    fontSize: '13px',
    color: '#6b7280',
    textAlign: 'right',
  },
  tag: {
    padding: '4px 8px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
}

const statusColors = {
  active: { background: '#ecfdf3', color: '#047857' },
  pending: { background: '#fffbeb', color: '#b45309' },
  critical: { background: '#fef2f2', color: '#b91c1c' },
  default: { background: '#eef2ff', color: '#4338ca' },
}

export default function FeaturePage({ title, subtitle, stats = [], sections = [], actionLabel = 'View details' }) {
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.subtitle}>{subtitle}</p>
        </div>
        <button style={styles.actionBtn}>{actionLabel}</button>
      </div>

      <div style={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} style={styles.statCard}>
            <div style={styles.statLabel}>{stat.label}</div>
            <div style={styles.statValue}>{stat.value}</div>
            {stat.detail ? <div style={styles.statDetail}>{stat.detail}</div> : null}
          </div>
        ))}
      </div>

      <div style={styles.sectionsGrid}>
        {sections.map((section) => (
          <div key={section.title} style={styles.sectionCard}>
            <div style={styles.sectionTitle}>{section.title}</div>
            {section.description ? <div style={styles.sectionDesc}>{section.description}</div> : null}
            <div style={styles.itemList}>
              {section.items.map((item) => (
                <div key={item.label} style={styles.itemRow}>
                  <div>
                    <div style={styles.itemLabel}>{item.label}</div>
                    {item.meta ? <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{item.meta}</div> : null}
                  </div>
                  {item.status ? (
                    <span style={{ ...styles.tag, ...statusColors[item.status] }}>
                      {item.status}
                    </span>
                  ) : (
                    <div style={styles.itemValue}>{item.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
