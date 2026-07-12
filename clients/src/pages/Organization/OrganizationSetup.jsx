import { useEffect, useMemo, useState } from 'react'

import axiosInstance from '@/api/axiosInstance'
import { useAuth } from '@/hooks/useAuth'

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: '18px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 },
  subtitle: { fontSize: '14px', color: '#6b7280', margin: '6px 0 0', maxWidth: '720px' },
  tabs: { display: 'flex', gap: '8px', borderBottom: '1px solid #e5e7eb' },
  tab: { border: 'none', background: 'transparent', padding: '10px 12px', cursor: 'pointer', fontWeight: 600, color: '#6b7280' },
  tabActive: { color: '#4338ca', borderBottom: '2px solid #4338ca' },
  grid: { display: 'grid', gridTemplateColumns: 'minmax(280px, 360px) 1fr', gap: '16px', alignItems: 'start' },
  panel: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' },
  panelTitle: { fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#111827' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '10px' },
  textarea: { width: '100%', minHeight: '84px', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', marginBottom: '10px' },
  button: { border: 'none', background: '#534AB7', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
  ghostButton: { border: '1px solid #d1d5db', background: '#fff', color: '#374151', padding: '8px 10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '10px 8px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' },
  pill: { display: 'inline-flex', padding: '4px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: '#eef2ff', color: '#4338ca' },
  error: { color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px', fontSize: '13px' },
}

const tabs = [
  { id: 'departments', label: 'Departments' },
  { id: 'categories', label: 'Categories' },
  { id: 'employees', label: 'Employee directory' },
]

const roleOptions = ['EMPLOYEE', 'DEPARTMENT_HEAD', 'ASSET_MANAGER', 'ADMIN']
const statusOptions = ['ACTIVE', 'INACTIVE']

export default function OrganizationSetup() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('departments')
  const [departments, setDepartments] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [departmentForm, setDepartmentForm] = useState({ name: '', description: '', manager: '' })
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' })
  const isAdmin = user?.role === 'ADMIN'

  const departmentHeadOptions = useMemo(
    () => users.filter((item) => ['DEPARTMENT_HEAD', 'ADMIN'].includes(item.role)),
    [users]
  )

  const loadSetupData = async () => {
    setLoading(true)
    setError('')
    try {
      const [departmentRes, categoryRes] = await Promise.all([
        axiosInstance.get('/departments'),
        axiosInstance.get('/categories'),
      ])
      setDepartments(departmentRes.data?.data || [])
      setCategories(categoryRes.data?.data || [])

      if (isAdmin) {
        const userRes = await axiosInstance.get('/users')
        setUsers(userRes.data?.data || [])
      } else {
        setUsers([])
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load organization setup data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSetupData()
  }, [isAdmin])

  const createDepartment = async () => {
    if (!departmentForm.name) {
      setError('Department name is required.')
      return
    }

    try {
      await axiosInstance.post('/departments', {
        ...departmentForm,
        manager: departmentForm.manager || null,
        createdBy: user?._id,
      })
      setDepartmentForm({ name: '', description: '', manager: '' })
      await loadSetupData()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create department.')
    }
  }

  const createCategory = async () => {
    if (!categoryForm.name) {
      setError('Category name is required.')
      return
    }

    try {
      await axiosInstance.post('/categories', {
        ...categoryForm,
        createdBy: user?._id,
        updatedBy: user?._id,
      })
      setCategoryForm({ name: '', description: '' })
      await loadSetupData()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create category.')
    }
  }

  const updateUser = async (id, patch) => {
    try {
      await axiosInstance.patch(`/users/${id}`, patch)
      await loadSetupData()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to update employee.')
    }
  }

  const renderDepartments = () => (
    <div style={S.grid}>
      {isAdmin ? (
        <div style={S.panel}>
          <div style={S.panelTitle}>Create department</div>
          <input style={S.input} placeholder="Department name" value={departmentForm.name} onChange={(e) => setDepartmentForm((prev) => ({ ...prev, name: e.target.value }))} />
          <select style={S.input} value={departmentForm.manager} onChange={(e) => setDepartmentForm((prev) => ({ ...prev, manager: e.target.value }))}>
            <option value="">No department head</option>
            {departmentHeadOptions.map((item) => (
              <option key={item._id} value={item._id}>{item.name}</option>
            ))}
          </select>
          <textarea style={S.textarea} placeholder="Description" value={departmentForm.description} onChange={(e) => setDepartmentForm((prev) => ({ ...prev, description: e.target.value }))} />
          <button style={S.button} onClick={createDepartment}>Create department</button>
        </div>
      ) : (
        <div style={S.panel}>
          <div style={S.panelTitle}>Setup is read-only</div>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', lineHeight: 1.6 }}>Only admins can create departments and promote employees. You can still view the setup data used across AssetFlow.</p>
        </div>
      )}

      <div style={S.panel}>
        <div style={S.panelTitle}>Departments</div>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Code</th>
              <th style={S.th}>Name</th>
              <th style={S.th}>Head</th>
              <th style={S.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department._id}>
                <td style={S.td}>{department.code}</td>
                <td style={S.td}>{department.name}</td>
                <td style={S.td}>{department.manager?.name || '-'}</td>
                <td style={S.td}><span style={S.pill}>{department.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderCategories = () => (
    <div style={S.grid}>
      {isAdmin ? (
        <div style={S.panel}>
          <div style={S.panelTitle}>Create category</div>
          <input style={S.input} placeholder="Category name" value={categoryForm.name} onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))} />
          <textarea style={S.textarea} placeholder="Description" value={categoryForm.description} onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))} />
          <button style={S.button} onClick={createCategory}>Create category</button>
        </div>
      ) : (
        <div style={S.panel}>
          <div style={S.panelTitle}>Categories are read-only</div>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', lineHeight: 1.6 }}>Admins manage category master data. Asset managers use these categories when registering assets.</p>
        </div>
      )}

      <div style={S.panel}>
        <div style={S.panelTitle}>Asset categories</div>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Code</th>
              <th style={S.th}>Name</th>
              <th style={S.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td style={S.td}>{category.code}</td>
                <td style={S.td}>{category.name}</td>
                <td style={S.td}><span style={S.pill}>{category.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderEmployees = () => (
    <div style={S.panel}>
      <div style={S.panelTitle}>Employee directory</div>
      {!isAdmin ? (
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', lineHeight: 1.6 }}>Only admins can view and edit employee roles.</p>
      ) : null}
      {isAdmin ? (
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Name</th>
            <th style={S.th}>Email</th>
            <th style={S.th}>Department</th>
            <th style={S.th}>Role</th>
            <th style={S.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr key={item._id}>
              <td style={S.td}>{item.name}</td>
              <td style={S.td}>{item.email}</td>
              <td style={S.td}>
                <select style={S.input} value={item.department?._id || ''} onChange={(e) => updateUser(item._id, { department: e.target.value || null })}>
                  <option value="">No department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>{department.name}</option>
                  ))}
                </select>
              </td>
              <td style={S.td}>
                <select style={S.input} value={item.role} onChange={(e) => updateUser(item._id, { role: e.target.value })}>
                  {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
              </td>
              <td style={S.td}>
                <select style={S.input} value={item.status} onChange={(e) => updateUser(item._id, { status: e.target.value })}>
                  {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      ) : null}
    </div>
  )

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Organization setup</h1>
          <p style={S.subtitle}>Manage departments, asset categories, and employee roles used by the rest of AssetFlow.</p>
        </div>
        <button style={S.ghostButton} onClick={loadSetupData}>Refresh</button>
      </div>

      {error ? <div style={S.error}>{error}</div> : null}

      <div style={S.tabs}>
        {tabs.map((tab) => (
          <button key={tab.id} style={{ ...S.tab, ...(activeTab === tab.id ? S.tabActive : {}) }} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? <div style={S.panel}>Loading setup data...</div> : null}
      {!loading && activeTab === 'departments' ? renderDepartments() : null}
      {!loading && activeTab === 'categories' ? renderCategories() : null}
      {!loading && activeTab === 'employees' ? renderEmployees() : null}
    </div>
  )
}
