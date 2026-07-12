import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '0.5px solid rgba(0,0,0,0.1)',
    borderRadius: '16px',
    padding: '36px',
    width: '100%',
    maxWidth: '420px',
  },
  heading: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '6px',
  },
  subheading: { fontSize: '14px', color: '#888', marginBottom: '20px' },
  label: { display: 'block', fontSize: '13px', color: '#444', marginBottom: '6px', fontWeight: '500' },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '0.5px solid rgba(0,0,0,0.15)',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: '#fafafa',
    color: '#1a1a1a',
    marginBottom: '12px',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '11px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#ffffff',
    backgroundColor: '#534AB7',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '4px',
  },
  errorMsg: {
    fontSize: '13px',
    color: '#c0392b',
    backgroundColor: '#FCEBEB',
    border: '0.5px solid #f1b0b0',
    borderRadius: '8px',
    padding: '10px 12px',
    marginBottom: '12px',
  },
  link: { marginTop: '12px', fontSize: '13px', color: '#534AB7', cursor: 'pointer' },
}

export function Register() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      await signup(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subheading}>Start managing assets with AssetFlow.</p>
        {error ? <div style={styles.errorMsg}>{error}</div> : null}

        <label style={styles.label}>Full name</label>
        <input style={styles.input} value={form.name} onChange={(e) => handleChange('name', e.target.value)} />

        <label style={styles.label}>Email</label>
        <input style={styles.input} type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />

        <label style={styles.label}>Password</label>
        <input style={styles.input} type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} />

        <button style={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <div style={styles.link} onClick={() => navigate('/login')}>Already have an account? Sign in</div>
      </div>
    </div>
  )
}
