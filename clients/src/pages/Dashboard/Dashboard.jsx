import { useEffect, useState } from 'react'

import axiosInstance from '@/api/axiosInstance'

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: '18px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 },
  subtitle: { fontSize: '14px', color: '#6b7280', margin: '6px 0 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' },
  label: { fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' },
  value: { fontSize: '28px', lineHeight: 1, fontWeight: 700, color: '#111827' },
  band: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '18px' },
  bandTitle: { fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '8px' },
  bandText: { fontSize: '14px', color: '#4b5563', lineHeight: 1.6, margin: 0 },
  error: { color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px', fontSize: '13px' },
}

const metricConfig = [
  ['assetsAvailable', 'Assets available'],
  ['assetsAllocated', 'Assets allocated'],
  ['underMaintenance', 'Under maintenance'],
  ['activeBookings', 'Bookings today'],
  ['overdueAllocations', 'Overdue returns'],
  ['upcomingReturns', 'Upcoming returns'],
  ['departmentCount', 'Departments'],
  ['categoryCount', 'Categories'],
]

export default function Dashboard() {
  const [summary, setSummary] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const { data } = await axiosInstance.get('/dashboard/summary')
        setSummary(data?.data || {})
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Dashboard data is not available yet.')
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [])

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Dashboard</h1>
          <p style={S.subtitle}>Live operational snapshot for assets, bookings, returns, and setup data.</p>
        </div>
      </div>

      {error ? <div style={S.error}>{error}</div> : null}

      <div style={S.grid}>
        {metricConfig.map(([key, label]) => (
          <div key={key} style={S.card}>
            <div style={S.label}>{label}</div>
            <div style={S.value}>{loading ? '-' : summary[key] ?? 0}</div>
          </div>
        ))}
      </div>

      <div style={S.band}>
        <div style={S.bandTitle}>Next actions</div>
        <p style={S.bandText}>
          Use Organization Setup to create departments and categories, register shared assets from Assets,
          then allocate them or book shared resources from the operational modules.
        </p>
      </div>
    </div>
  )
}
