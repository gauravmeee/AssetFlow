import { StorageKey } from '@/enums/storage-key-enum'
import { Theme } from '@/enums/theme-enum'
import { getActiveDecodedToken, getRolesFromToken } from '@/utils/token-utils'

/** Reads and parses user session from localStorage, returns null if missing or malformed */
const getUserSessionLocally = () => {
  try {
    return JSON.parse(localStorage.getItem(StorageKey.USER_SESSION) || 'null')
  } catch {
    return null
  }
}

/** Decodes JWT, writes session to LS, sets preferences, returns store-ready session object */
const setUserSessionLocally = (userSession) => {
  const decodedJwt = getActiveDecodedToken(userSession.accessToken)

  if (!decodedJwt) return null

  const userSessionToSave = {
    userName: decodedJwt.uname,
    expiresOn: new Date(decodedJwt.exp * 1000),
  }

  localStorage.setItem(StorageKey.USER_SESSION, JSON.stringify(userSessionToSave))
  setUserPreferencesLocally()

  const roles = getRolesFromToken(decodedJwt)

  return {
    email: decodedJwt.uname,
    firstName: userSession.firstName,
    lastName: userSession.lastName,
    userInitials: userSession.userInitials,
    isGE: roles.includes('GE'),
    userRoles: roles,
    expiresOn: new Date(decodedJwt.exp * 1000),
  }
}

/** Writes user preferences to LS — skips if no new prefs passed and preferences already exist */
const setUserPreferencesLocally = (userPreferences) => {
  const existing = JSON.parse(localStorage.getItem(StorageKey.USER_PREFERENCES) || 'null')
  if (!userPreferences && existing?.theme) return

  const prefsToSave = {
    theme: userPreferences?.theme || Theme.LIGHT,
  }

  localStorage.setItem(StorageKey.USER_PREFERENCES, JSON.stringify(prefsToSave))
}

/** Reads and parses user preferences from localStorage, returns null if missing */
const getUserPreferencesLocally = () => {
  try {
    return JSON.parse(localStorage.getItem(StorageKey.USER_PREFERENCES) || 'null')
  } catch {
    return null
  }
}

/** Returns true if session exists in LS and has not expired */
const isUserSessionValid = () => {
  const session = getUserSessionLocally()
  if (!session?.expiresOn) return false
  return new Date(session.expiresOn) > new Date()
}

/** Clears session and preferences from LS */
const removeUserSessionLocally = () => {
  localStorage.removeItem(StorageKey.USER_SESSION)
  localStorage.removeItem(StorageKey.USER_PREFERENCES)
}

export {
  getUserSessionLocally,
  getUserPreferencesLocally,
  isUserSessionValid,
  removeUserSessionLocally,
  setUserPreferencesLocally,
  setUserSessionLocally,
}
