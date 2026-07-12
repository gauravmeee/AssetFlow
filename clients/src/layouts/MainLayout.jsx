import { Outlet } from 'react-router-dom'

import SidebarNav from './components/SidebarNav'
import Topbar from './components/TopBar'

const S = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    // background: '#f5f5f0',
    fontFamily: 'Inter, sans-serif',
  },

  sidebar: {
    width: '240px',
    // background: '#fff',
    borderRight: '1px solid #e5e7eb',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
  },

  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },

  topbar: {
    height: '70px',
    // background: '#fff',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },

  content: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    // background: '#f9fafb',
  },
}

export default function MainLayout() {
  return (
    <div style={S.root}>
      <aside style={S.sidebar}>
        <SidebarNav />
      </aside>

      <div style={S.right}>
        <header style={S.topbar}>
          <Topbar />
        </header>

        <main style={S.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
