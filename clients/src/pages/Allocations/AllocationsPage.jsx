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
  actions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  error: { color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px', fontSize: '13px' },
}

export default function AllocationsPage() {
  const [assets, setAssets] = useState([])
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [allocations, setAllocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ asset: '', assignedTo: '', department: '', expectedReturnDate: '' })

  const availableAssets = useMemo(() => assets.filter((asset) => asset.status === 'AVAILABLE'), [assets])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [assetRes, userRes, departmentRes, allocationRes] = await Promise.all([
        axiosInstance.get('/assets'),
        axiosInstance.get('/users'),
        axiosInstance.get('/departments'),
        axiosInstance.get('/allocations'),
      ])
      setAssets(assetRes.data?.data || [])
      setUsers(userRes.data?.data || [])
      setDepartments(departmentRes.data?.data || [])
      setAllocations(allocationRes.data?.data || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load allocation data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const createAllocation = async () => {
    if (!form.asset || (!form.assignedTo && !form.department)) {
      setError('Select an asset and assign it to an employee or department.')
      return
    }

    try {
      await axiosInstance.post('/allocations', {
        ...form,
        assignedTo: form.assignedTo || null,
        department: form.department || null,
        expectedReturnDate: form.expectedReturnDate || null,
      })
      setForm({ asset: '', assignedTo: '', department: '', expectedReturnDate: '' })
      await loadData()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to allocate asset.')
    }
  }

  const transferAllocation = async (allocation) => {
    if (!form.assignedTo && !form.department) {
      setError('Select the new employee or department in the form before transfer.')
      return
    }

    try {
      await axiosInstance.patch(`/allocations/${allocation._id}/transfer`, {
        assignedTo: form.assignedTo || null,
        department: form.department || null,
        expectedReturnDate: form.expectedReturnDate || null,
      })
      setForm({ asset: '', assignedTo: '', department: '', expectedReturnDate: '' })
      await loadData()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to transfer allocation.')
    }
  }

  const returnAllocation = async (allocation) => {
    try {
      await axiosInstance.patch(`/allocations/${allocation._id}/return`, { checkInNotes: 'Returned from UI' })
      await loadData()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to return allocation.')
    }
  }

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Allocation & transfer</h1>
          <p style={S.subtitle}>Allocate available assets, transfer active allocations, and mark returns.</p>
        </div>
        <button style={S.ghostButton} onClick={loadData}>Refresh</button>
      </div>

      {error ? <div style={S.error}>{error}</div> : null}

      <div style={S.grid}>
        <div style={S.panel}>
          <div style={S.panelTitle}>Allocate or transfer</div>
          <select style={S.input} value={form.asset} onChange={(e) => setForm((prev) => ({ ...prev, asset: e.target.value }))}>
            <option value="">Select available asset</option>
            {availableAssets.map((asset) => (
              <option key={asset._id} value={asset._id}>{asset.assetTag} - {asset.name}</option>
            ))}
          </select>
          <select style={S.input} value={form.assignedTo} onChange={(e) => setForm((prev) => ({ ...prev, assignedTo: e.target.value }))}>
            <option value="">Assign to employee</option>
            {users.map((item) => (
              <option key={item._id} value={item._id}>{item.name}</option>
            ))}
          </select>
          <select style={S.input} value={form.department} onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}>
            <option value="">Assign to department</option>
            {departments.map((department) => (
              <option key={department._id} value={department._id}>{department.name}</option>
            ))}
          </select>
          <input style={S.input} type="date" value={form.expectedReturnDate} onChange={(e) => setForm((prev) => ({ ...prev, expectedReturnDate: e.target.value }))} />
          <button style={S.button} onClick={createAllocation}>Allocate asset</button>
        </div>

        <div style={S.panel}>
          <div style={S.panelTitle}>{loading ? 'Loading allocations...' : 'Current allocations'}</div>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Asset</th>
                <th style={S.th}>Holder</th>
                <th style={S.th}>Department</th>
                <th style={S.th}>Return</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((allocation) => (
                <tr key={allocation._id}>
                  <td style={S.td}>{allocation.asset?.assetTag} - {allocation.asset?.name}</td>
                  <td style={S.td}>{allocation.assignedTo?.name || '-'}</td>
                  <td style={S.td}>{allocation.department?.name || '-'}</td>
                  <td style={S.td}>{allocation.expectedReturnDate ? new Date(allocation.expectedReturnDate).toLocaleDateString() : '-'}</td>
                  <td style={S.td}>{allocation.status}</td>
                  <td style={S.td}>
                    {allocation.status === 'ACTIVE' ? (
                      <div style={S.actions}>
                        <button style={S.ghostButton} onClick={() => transferAllocation(allocation)}>Transfer</button>
                        <button style={S.ghostButton} onClick={() => returnAllocation(allocation)}>Return</button>
                      </div>
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
