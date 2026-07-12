import { StorageKey } from '@devStack/enums/storage-key-enums'
import { useUserSessionStore } from '@devStack/store/Store'
import { redirectToLoginUtil } from '@devStack/utils/redirect-utils'
import { useEffect } from 'react'

/**
 * Syncs auth state across browser tabs.
 * If user logs out in tab A, all other tabs redirect to login automatically.
 * Place this hook once in App.jsx alongside useValidateUserSession.
 */
export const useAuthSync = () => {
  const { setUserSession } = useUserSessionStore()

  useEffect(() => {
    const handleStorageChange = (event) => {
      // Session was removed in another tab → logout this tab too
      if (event.key === StorageKey.USER_SESSION && !event.newValue) {
        setUserSession(null)
        redirectToLoginUtil(false) // don't save path, intentional logout
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [setUserSession])
}
