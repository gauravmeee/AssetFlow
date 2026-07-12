import { REQUEST_TIMEOUT } from '@devStack/constants'
import { StorageKey } from '@devStack/enums/storage-key-enums'
import { message } from 'antd'
import axios from 'axios'

import { removeUserSessionLocally, setUserSessionLocally } from '../../utils/user-session-utils'
import { refreshSession } from '../accounts-me-apis'
import { sleep } from '../utils/sleep-util'

import { parseApiError } from './parseApiError'

const axiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor — attach JWT in DEV ────────────────────────────────
axiosInstance.interceptors.request.use(
  (request) => {
    if (import.meta.env.DEV) {
      request.headers['Authorization'] = `Bearer ${localStorage.getItem(StorageKey.JWT_KEY)}`
      request.withCredentials = true
    }
    return request
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor ───────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  async (response) => {
    if (import.meta.env.DEV) await sleep(import.meta.env.VITE_ARTIFICIAL_DELAY)
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    // ── Refresh token on 401 (except auth endpoints) ─────────────────────
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/me/logoff')
    ) {
      originalRequest._retry = true
      const newSession = await refreshSession()
      if (newSession) setUserSessionLocally(newSession.data)
      return axiosInstance(originalRequest)
    }

    // ── Parse error message via shared util ──────────────────────────────
    const errorMessage = parseApiError(error)

    // ── Per-status side effects ──────────────────────────────────────────
    // For 400 / 409 / 429: reject silently — caller's catch block handles display
    // For everything else: show message here in the interceptor
    switch (status) {
      case 400:
      case 409:
      case 429:
        return Promise.reject(errorMessage)

      case 401:
        message.error(errorMessage)
        removeUserSessionLocally(true)
        break

      case 403:
        message.error(errorMessage)
        break

      case 404:
        message.error(errorMessage)
        // TODO: Route to 404 page
        break

      case 500:
        message.error(errorMessage)
        // TODO: Route to 500 page
        break

      default:
        message.error(errorMessage)
        return Promise.reject(error)
    }
  }
)

export { axiosInstance }
