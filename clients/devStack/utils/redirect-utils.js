import { StorageKey } from '@/enums/storage-key-enum'

/** Saves current path to LS so user can be sent back after login */
const savePostLoginRedirectPath = () => {
  const path = window.location.pathname
  if (path !== '/login') {
    localStorage.setItem(StorageKey.POST_LOGIN_REDIRECT, path)
  }
}

/** Reads and clears the saved post-login redirect path */
const getPostLoginRedirectPath = () => {
  const path = localStorage.getItem(StorageKey.POST_LOGIN_REDIRECT) || '/dashboard'
  localStorage.removeItem(StorageKey.POST_LOGIN_REDIRECT)
  return path
}

/** Hard redirects to login, optionally saving current path for post-login redirect */
const redirectToLoginUtil = (saveCurrentPath = true) => {
  if (saveCurrentPath) savePostLoginRedirectPath()
  window.location.replace('/login')
}

/** Hard redirects to any given path */
const redirectToUtil = (path) => {
  window.location.replace(path)
}

export { redirectToLoginUtil, redirectToUtil, savePostLoginRedirectPath, getPostLoginRedirectPath }
