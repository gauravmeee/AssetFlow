import ThemeToggle from '@devStack/components/ThemeToggle'

import { useAuth } from '@/hooks/useAuth'

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
    width: '100%',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoMark: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#4338ca',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700,
  },
  logo: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },
  meta: {
    fontSize: '12px',
    color: '#6b7280',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logout: {
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#374151',
    borderRadius: '8px',
    padding: '7px 10px',
    cursor: 'pointer',
    fontWeight: 600,
  },
}

export default function Topbar() {
  const { user, logout } = useAuth()

  return (
    <header style={S.topbar}>
      <div style={S.left}>
        <span style={S.logoMark}>AF</span>
        <div>
          <div style={S.logo}>AssetFlow</div>
          <div style={S.meta}>{user?.role || 'User'}</div>
        </div>
      </div>

      <div style={S.right}>
        <ThemeToggle showPresets={true} />
        <button style={S.logout} onClick={logout}>Sign out</button>
      </div>
    </header>
  )
}
