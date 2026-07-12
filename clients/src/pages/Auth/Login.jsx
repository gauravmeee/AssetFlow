import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    maxWidth: '380px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '28px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: '#EEEDFE',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  logoText: {
    fontSize: '17px',
    fontWeight: '500',
    color: '#1a1a1a',
  },
  heading: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '6px',
  },
  subheading: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    color: '#444',
    marginBottom: '6px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '0.5px solid rgba(0,0,0,0.15)',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: '#fafafa',
    color: '#1a1a1a',
    marginBottom: '16px',
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
    marginBottom: '16px',
  },
}

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill in both fields.')
      return
    }
    // replace with your real auth logic
    if (email === 'admin@myapp.com' && password === 'password') {
      navigate('/dashboard')
    } else {
      setError('Invalid email or password.')
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>⚡</div>
          <span style={styles.logoText}>MyApp</span>
        </div>

        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subheading}>Sign in to your account</p>

        {error && <div style={styles.errorMsg}>{error}</div>}

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError('')
          }}
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
        />

        <button style={styles.submitBtn} onClick={handleLogin}>
          Sign in
        </button>
      </div>
    </div>
  )
}
