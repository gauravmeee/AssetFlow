import { useState } from 'react'

import axiosInstance from '@/api/axiosInstance'

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 1000,
  },
  card: {
    width: '100%',
    maxWidth: '520px',
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.2)',
  },
  title: { fontSize: '18px', fontWeight: 700, marginBottom: '16px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    minHeight: '90px',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' },
  cancelBtn: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    background: '#fff',
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: 'none',
    background: '#534AB7',
    color: '#fff',
    cursor: 'pointer',
  },
}

export default function AssetFormModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    department: '',
    location: '',
    serialNumber: '',
    acquisitionDate: '',
    acquisitionCost: '',
    condition: 'NEW',
    remarks: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.department || !form.location || !form.acquisitionDate || !form.acquisitionCost) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await axiosInstance.post('/assets', {
        ...form,
        acquisitionCost: Number(form.acquisitionCost),
      })
      onCreated?.()
      onClose?.()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create asset.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <div style={styles.title}>Create asset</div>
        {error ? <div style={{ color: '#b91c1c', marginBottom: '10px', fontSize: '13px' }}>{error}</div> : null}

        <div style={styles.row}>
          <div>
            <label style={styles.label}>Asset name</label>
            <input style={styles.input} value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
          </div>
          <div>
            <label style={styles.label}>Category</label>
            <input style={styles.input} value={form.category} onChange={(e) => handleChange('category', e.target.value)} />
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <label style={styles.label}>Department</label>
            <input style={styles.input} value={form.department} onChange={(e) => handleChange('department', e.target.value)} />
          </div>
          <div>
            <label style={styles.label}>Location</label>
            <input style={styles.input} value={form.location} onChange={(e) => handleChange('location', e.target.value)} />
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <label style={styles.label}>Serial number</label>
            <input style={styles.input} value={form.serialNumber} onChange={(e) => handleChange('serialNumber', e.target.value)} />
          </div>
          <div>
            <label style={styles.label}>Condition</label>
            <select style={styles.input} value={form.condition} onChange={(e) => handleChange('condition', e.target.value)}>
              <option value="NEW">NEW</option>
              <option value="GOOD">GOOD</option>
              <option value="FAIR">FAIR</option>
              <option value="DAMAGED">DAMAGED</option>
            </select>
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <label style={styles.label}>Acquisition date</label>
            <input style={styles.input} type="date" value={form.acquisitionDate} onChange={(e) => handleChange('acquisitionDate', e.target.value)} />
          </div>
          <div>
            <label style={styles.label}>Acquisition cost</label>
            <input style={styles.input} type="number" value={form.acquisitionCost} onChange={(e) => handleChange('acquisitionCost', e.target.value)} />
          </div>
        </div>

        <div>
          <label style={styles.label}>Remarks</label>
          <textarea style={styles.textarea} value={form.remarks} onChange={(e) => handleChange('remarks', e.target.value)} />
        </div>

        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.saveBtn} onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save asset'}</button>
        </div>
      </div>
    </div>
  )
}
