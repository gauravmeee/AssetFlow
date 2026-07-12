import { createContext, useEffect, useMemo, useState } from 'react'

import axiosInstance from '@/api/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('assetflow_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { data } = await axiosInstance.get('/auth/me')
        setUser(data?.data || null)
      } catch {
        localStorage.removeItem('assetflow_token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [token])

  const login = async (credentials) => {
    const { data } = await axiosInstance.post('/auth/login', credentials)
    const authToken = data?.data?.token
    const authUser = data?.data?.user

    if (authToken) {
      localStorage.setItem('assetflow_token', authToken)
      setToken(authToken)
    }

    setUser(authUser || null)
    return data
  }

  const signup = async (payload) => {
    const { data } = await axiosInstance.post('/auth/signup', payload)
    const authToken = data?.data?.token
    const authUser = data?.data?.user

    if (authToken) {
      localStorage.setItem('assetflow_token', authToken)
      setToken(authToken)
    }

    setUser(authUser || null)
    return data
  }

  const logout = () => {
    localStorage.removeItem('assetflow_token')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, token, loading, login, signup, logout }),
    [user, token, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
