import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout'
import { ForgotPassword } from '@/pages/Auth/ForgotPassword'
import { Login } from '@/pages/Auth/Login'
import { Register } from '@/pages/Auth/Register'
import AssetsPage from '@/pages/Assets/AssetsPage'
import AllocationsPage from '@/pages/Allocations/AllocationsPage'
import AuditPage from '@/pages/Audit/AuditPage'
import BookingsPage from '@/pages/Bookings/BookingsPage'
import Dashboard from '@/pages/Dashboard/Dashboard'
import MaintenancePage from '@/pages/Maintenance/MaintenancePage'
import NotificationsPage from '@/pages/Notifications/NotificationsPage'
import ReportsPage from '@/pages/Reports/ReportsPage'

import ErrorPage from '../../devStack/pages/ErrorPage'
import NotFoundPage from '../../devStack/pages/NotFoundPage'

import { ProtectedRoute } from './ProtectedRoute'
import { ROUTES, ROLES } from './routes'

const Placeholder = ({ name }) => (
  <div style={{ padding: 40 }}>
    <h2>{name} Page</h2>
    <p>Role-restricted route working ✅</p>
  </div>
)

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <Login /> },
      { path: ROUTES.REGISTER, element: <Register /> },
      { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
    ],
  },

  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      // public
      { path: ROUTES.ABOUT, element: <Placeholder name="About" /> },

      // needs login
      {
        element: <ProtectedRoute />,
        children: [
          { path: ROUTES.DASHBOARD, element: <Dashboard /> },
          { path: ROUTES.HOME, element: <Dashboard /> },
          { path: ROUTES.ASSETS, element: <AssetsPage /> },
          { path: ROUTES.ALLOCATIONS, element: <AllocationsPage /> },
          { path: ROUTES.BOOKINGS, element: <BookingsPage /> },
          { path: ROUTES.MAINTENANCE, element: <MaintenancePage /> },
          { path: ROUTES.AUDIT, element: <AuditPage /> },
          { path: ROUTES.REPORTS, element: <ReportsPage /> },
          { path: ROUTES.NOTIFICATIONS, element: <NotificationsPage /> },
        ],
      },

      // admin only
      {
        element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />,
        children: [{ path: ROUTES.ACCOUNTS, element: <Placeholder name="Accounts" /> }],
      },

      // tester only
      {
        element: <ProtectedRoute allowedRoles={[ROLES.TESTER]} />,
        children: [{ path: ROUTES.TESTING, element: <Placeholder name="Testing" /> }],
      },
    ],
  },
  // {
  //   element: <AuthLayout />,
  //   children: [
  //     {
  //       path: '*',
  //       element: <NotFoundPage />,
  //     },
  //   ],
  // },

  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
