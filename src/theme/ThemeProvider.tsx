import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import {
  THEME_PREFERENCES,
  THEME_STORAGE_KEY,
  ThemeContext,
  type ResolvedTheme,
  type ThemePreference,
} from '@/theme/context'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function readStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return THEME_PREFERENCES.find((value) => value === stored) ?? 'system'
  } catch {
    return 'system'
  }
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference)
  const [systemResolved, setSystemResolved] = useState<ResolvedTheme>(systemTheme)

  // Follow the OS while the preference is "system"; the listener stays cheap
  // enough to keep attached regardless.
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const onChange = () => setSystemResolved(media.matches ? 'dark' : 'light')

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const resolved: ResolvedTheme = preference === 'system' ? systemResolved : preference

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }, [resolved])

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next)

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Ignore storage failures; the choice still applies for this session.
    }
  }, [])

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
