import { getMySession, refreshSession } from '@devStack/apiServices/accounts-me-apis'
import { useUserSessionStore } from '@devStack/store/Store'
import { redirectToLoginUtil } from '@devStack/utils/redirect-utils'
import {
  isUserSessionValid,
  removeUserSessionLocally,
  setUserSessionLocally,
} from '@devStack/utils/user-session-utils'
import { message } from 'antd'
import { useEffect, useState } from 'react'

/** Validates session on app mount — refreshes if needed, redirects to login if invalid */
export const useValidateUserSession = () => {
  const { setUserSession } = useUserSessionStore()
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    const validate = async () => {
      if (import.meta.env.PROD && !isUserSessionValid()) {
        redirectToLoginUtil()
        return
      }

      setIsPending(true)

      try {
        const apiFn = import.meta.env.DEV ? getMySession : refreshSession
        const httpResponse = await apiFn()

        if (!httpResponse) return

        const sessionData = setUserSessionLocally(httpResponse.data)
        if (sessionData) setUserSession(sessionData)
      } catch (error) {
        message.error(error?.message || 'Session validation failed.')
        setUserSession(null)
        removeUserSessionLocally()
        redirectToLoginUtil()
      } finally {
        setIsPending(false)
      }
    }

    validate()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { isPending }
}
