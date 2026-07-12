import ThemeToggle from '@devStack/components/ThemeToggle'

const S = {
  topbar: {
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    background: 'var(--topbar-bg)',
    borderBottom: '1px solid var(--topbar-border)',
    flexShrink: 0,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.01em',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
}

export default function Topbar() {
  return (
    <header style={S.topbar}>
      <div style={S.left}>
        <span style={S.logo}>YourApp</span>
      </div>

      <div style={S.right}>
        {/* showPresets exposes the colored dots for preset switching */}
        <ThemeToggle showPresets={true} />
      </div>
    </header>
  )
}
