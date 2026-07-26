import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { LanguageContext } from '@/i18n/context'
import {
  FALLBACK_LOCALE,
  LOCALES,
  resolveLocale,
  translations,
  type Locale,
} from '@/i18n/translations'

const STORAGE_KEY = 'cwbudde.locale.v1'

function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return LOCALES.find((locale) => locale === stored) ?? null
  } catch {
    return null
  }
}

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return FALLBACK_LOCALE
  }

  const stored = readStoredLocale()
  if (stored) {
    return stored
  }

  const preferred = navigator.languages?.length
    ? navigator.languages
    : [navigator.language].filter(Boolean)

  return resolveLocale(preferred)
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)

    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignore storage failures (private mode, quota) — the choice still
      // applies for this session.
    }
  }, [])

  const value = useMemo(() => {
    const formatter = new Intl.NumberFormat(locale)

    return {
      locale,
      setLocale,
      t: translations[locale],
      formatNumber: (input: number) => formatter.format(input),
    }
  }, [locale, setLocale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
