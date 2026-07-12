import useThemeStore from '@devStack/store/useThemeStore'
import { useEffect } from 'react'

import { SYSTEM_DARK_QUERY } from './theme-constants'

export default function ThemeProvider({ children }) {
  const syncSystemScheme = useThemeStore((s) => s.syncSystemScheme)

  useEffect(() => {
    const timer = setTimeout(() => {
      document.documentElement.classList.add('theme-transitions-enabled')
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Listen to OS preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY)
    mediaQuery.addEventListener('change', syncSystemScheme)
    return () => mediaQuery.removeEventListener('change', syncSystemScheme)
  }, [syncSystemScheme])

  return children
}
