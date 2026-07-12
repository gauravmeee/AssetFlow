import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axiosInstance from '@/api/axiosInstance'

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
  heading: { fontSize: '20px', fontWeight: '500', color: '#1a1a1a', marginBottom: '6px' },
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
  successMsg: {
    fontSize: '13px',
    color: '#047857',
    backgroundColor: '#ecfdf3',
    border: '0.5px solid #a7f3d0',
    borderRadius: '8px',
    padding: '10px 12px',
    marginBottom: '12px',
  },
  link: { marginTop: '12px', fontSize: '13px', color: '#534AB7', cursor: 'pointer' },
}

export function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !newPassword) {
      setError('Please fill in both fields.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await axiosInstance.post('/auth/forgot-password', { email, newPassword })
      setSuccess('Password updated. You can now sign in with your new password.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Reset password</h1>
        <p style={styles.subheading}>Enter your email and a new password.</p>
        {error ? <div style={styles.errorMsg}>{error}</div> : null}
        {success ? <div style={styles.successMsg}>{success}</div> : null}

        <label style={styles.label}>Email</label>
        <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label style={styles.label}>New password</label>
        <input style={styles.input} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

        <button style={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Updating...' : 'Update password'}
        </button>

        <div style={styles.link} onClick={() => navigate('/login')}>Back to sign in</div>
      </div>
    </div>
  )
}
