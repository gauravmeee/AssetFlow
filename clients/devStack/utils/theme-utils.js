import { ColorScheme, StorageKey, SYSTEM_DARK_QUERY } from '../constants/theme-constants'

export function getSavedColorScheme() {
  return localStorage.getItem(StorageKey.COLOR_SCHEME) || ColorScheme.SYSTEM
}

export function resolveColorScheme(colorScheme) {
  if (colorScheme !== ColorScheme.SYSTEM) return colorScheme
  return window.matchMedia(SYSTEM_DARK_QUERY).matches ? ColorScheme.DARK : ColorScheme.LIGHT
}

export function applyThemeToDOM({ colorScheme }) {
  const root = document.documentElement
  const resolved = resolveColorScheme(colorScheme)
  root.setAttribute('data-scheme', resolved)
}

export function saveColorScheme(value) {
  if (value === ColorScheme.SYSTEM) {
    // "system" = no preference saved — key absence IS the system state
    localStorage.removeItem(StorageKey.COLOR_SCHEME)
  } else {
    localStorage.setItem(StorageKey.COLOR_SCHEME, value)
  }
}

export function bootstrapTheme() {
  const colorScheme = getSavedColorScheme()

  applyThemeToDOM({ colorScheme })
}
