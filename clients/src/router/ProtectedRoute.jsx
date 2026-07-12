import { Navigate, Outlet } from 'react-router-dom'

import { ROUTES } from './routes'

const MOCK_USERS = {
  admin: { isAuthenticated: true, user: { name: 'Admin User', role: 'ADMIN' } },
  user: { isAuthenticated: true, user: { name: 'Normal User', role: 'USER' } },
  tester: { isAuthenticated: true, user: { name: 'Tester User', role: 'TESTER' } },
  guest: { isAuthenticated: false, user: null },
}

const auth = MOCK_USERS.admin

export function ProtectedRoute({ allowedRoles }) {
  if (!auth.isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (allowedRoles && !allowedRoles.includes(auth.user?.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <Outlet />
}
