import { NavLink } from 'react-router-dom'

const S = {
  nav: {
    flex: 1,
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navLabel: {
    fontSize: '11px',
    color: 'var(--sidebar-label-color)',
    fontWeight: '500',
    letterSpacing: '0.06em',
    padding: '8px 8px 4px',
    textTransform: 'uppercase',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '8px 10px',
    borderRadius: '8px',
    fontSize: '13.5px',
    color: 'var(--sidebar-link-color)',
    textDecoration: 'none',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.1s, color 0.1s',
  },
  navLinkActive: {
    backgroundColor: 'var(--sidebar-link-active-bg)',
    color: 'var(--sidebar-link-active-color)',
    fontWeight: '500',
  },
  navLinkHover: {
    backgroundColor: 'var(--sidebar-link-hover-bg)',
  },
  navIcon: {
    fontSize: '16px',
    flexShrink: 0,
  },
}

const navItems = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard', icon: '⊞', text: 'Dashboard' },
      { to: '/login', icon: '◈', text: 'Login' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { to: '/about', icon: '◎', text: 'About' },
      { to: '/accounts', icon: '◷', text: 'Accounts' },
      { to: '/testing', icon: '▦', text: 'Testing' },
    ],
  },
  {
    label: 'System',
    items: [{ to: '/settings', icon: '⚙', text: 'Settings' }],
  },
]

export default function SidebarNav() {
  return (
    <nav style={S.nav}>
      {navItems.map((group) => (
        <div key={group.label}>
          <div style={S.navLabel}>{group.label}</div>
          {group.items.map(({ to, icon, text }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                ...S.navLink,
                ...(isActive ? S.navLinkActive : {}),
              })}
            >
              <span style={S.navIcon}>{icon}</span>
              {text}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}
