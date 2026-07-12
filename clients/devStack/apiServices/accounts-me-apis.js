import { redirectToLoginUtil } from '@devStack/utils/redirect-utils'
import { message } from 'antd'

import { axiosInstance } from './instance/axios-instance'

const baseAPIURL = `${import.meta.env.VITE_ACCOUNTS_API_URL}/me`

/** Log off from sessions based on sessionIds (request is from MyAccount). */
const terminateUserSelectedSessions = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/terminate-my-sessions`, postobj).then((res) => res.data)
}

/** Gets user's current session to view the latest user's info. */
const getMySession = () => {
  return axiosInstance.get(`${baseAPIURL}/my-session`).then((res) => res.data)
}

/** Refreshes user session using cookies. */
const refreshSession = () => {
  return axiosInstance
    .put(`${baseAPIURL}/refresh-session`)
    .then((res) => res.data)
    .catch((error) => {
      message.error(error?.message || 'Session refresh failed. Please log in again.')
      redirectToLoginUtil()
      return null
    })
}

/** Logs off from the current session for the current device. */
const logoffFromCurrentSession = () => {
  return axiosInstance.put(`${baseAPIURL}/logoff`).then((res) => res.data)
}

export { getMySession, logoffFromCurrentSession, refreshSession, terminateUserSelectedSessions }
