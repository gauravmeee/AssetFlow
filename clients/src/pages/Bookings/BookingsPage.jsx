import { useEffect, useMemo, useState } from 'react'

import axiosInstance from '@/api/axiosInstance'

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: '18px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 },
  subtitle: { fontSize: '14px', color: '#6b7280', margin: '6px 0 0' },
  grid: { display: 'grid', gridTemplateColumns: 'minmax(280px, 380px) 1fr', gap: '16px', alignItems: 'start' },
  panel: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' },
  panelTitle: { fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#111827' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '10px' },
  button: { border: 'none', background: '#534AB7', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
  ghostButton: { border: '1px solid #d1d5db', background: '#fff', color: '#374151', padding: '8px 10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '10px 8px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' },
  error: { color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px', fontSize: '13px' },
}

const toDateTimeLocal = (date) => {
  const value = new Date(date)
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset())
  return value.toISOString().slice(0, 16)
}

export default function BookingsPage() {
  const [assets, setAssets] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    resource: '',
    title: '',
    startTime: toDateTimeLocal(new Date()),
    endTime: toDateTimeLocal(new Date(Date.now() + 60 * 60 * 1000)),
    notes: '',
  })

  const sharedAssets = useMemo(() => assets.filter((asset) => asset.isShared), [assets])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [assetRes, bookingRes] = await Promise.all([
        axiosInstance.get('/assets'),
        axiosInstance.get('/bookings'),
      ])
      setAssets(assetRes.data?.data || [])
      setBookings(bookingRes.data?.data || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load booking data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const createBooking = async () => {
    if (!form.resource || !form.startTime || !form.endTime) {
      setError('Select a shared resource and a valid time slot.')
      return
    }

    try {
      await axiosInstance.post('/bookings', form)
      setForm((prev) => ({ ...prev, resource: '', title: '', notes: '' }))
      await loadData()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create booking.')
    }
  }

  const cancelBooking = async (booking) => {
    try {
      await axiosInstance.patch(`/bookings/${booking._id}/cancel`)
      await loadData()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to cancel booking.')
    }
  }

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Resource booking</h1>
          <p style={S.subtitle}>Book shared assets by time slot. Overlapping requests are rejected automatically.</p>
        </div>
        <button style={S.ghostButton} onClick={loadData}>Refresh</button>
      </div>

      {error ? <div style={S.error}>{error}</div> : null}

      <div style={S.grid}>
        <div style={S.panel}>
          <div style={S.panelTitle}>New booking</div>
          <select style={S.input} value={form.resource} onChange={(e) => setForm((prev) => ({ ...prev, resource: e.target.value }))}>
            <option value="">Select shared resource</option>
            {sharedAssets.map((asset) => (
              <option key={asset._id} value={asset._id}>{asset.assetTag} - {asset.name}</option>
            ))}
          </select>
          <input style={S.input} placeholder="Purpose" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
          <input style={S.input} type="datetime-local" value={form.startTime} onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))} />
          <input style={S.input} type="datetime-local" value={form.endTime} onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))} />
          <input style={S.input} placeholder="Notes" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
          <button style={S.button} onClick={createBooking}>Book resource</button>
        </div>

        <div style={S.panel}>
          <div style={S.panelTitle}>{loading ? 'Loading bookings...' : 'Bookings'}</div>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Resource</th>
                <th style={S.th}>Booked by</th>
                <th style={S.th}>Start</th>
                <th style={S.th}>End</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td style={S.td}>{booking.resource?.assetTag} - {booking.resource?.name}</td>
                  <td style={S.td}>{booking.bookedBy?.name || '-'}</td>
                  <td style={S.td}>{new Date(booking.startTime).toLocaleString()}</td>
                  <td style={S.td}>{new Date(booking.endTime).toLocaleString()}</td>
                  <td style={S.td}>{booking.status}</td>
                  <td style={S.td}>
                    {booking.status !== 'CANCELLED' ? (
                      <button style={S.ghostButton} onClick={() => cancelBooking(booking)}>Cancel</button>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
