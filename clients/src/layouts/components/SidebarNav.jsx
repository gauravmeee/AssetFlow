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
    fontWeight: '600',
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
  },
  navLinkActive: {
    backgroundColor: 'var(--sidebar-link-active-bg)',
    color: 'var(--sidebar-link-active-color)',
    fontWeight: '600',
  },
  navIcon: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#eef2ff',
    color: '#4338ca',
    fontSize: '11px',
    fontWeight: 700,
    flexShrink: 0,
  },
}

const navItems = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard', icon: 'D', text: 'Dashboard' },
      { to: '/assets', icon: 'A', text: 'Assets' },
      { to: '/allocations', icon: 'T', text: 'Allocations' },
      { to: '/bookings', icon: 'B', text: 'Bookings' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/maintenance', icon: 'M', text: 'Maintenance' },
      { to: '/audit', icon: 'V', text: 'Audit' },
      { to: '/notifications', icon: 'N', text: 'Notifications' },
      { to: '/reports', icon: 'R', text: 'Reports' },
    ],
  },
  {
    label: 'System',
    items: [{ to: '/settings', icon: 'O', text: 'Organization setup' }],
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
