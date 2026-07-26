import { createContext } from 'react'

import type { Locale, Translation } from '@/i18n/translations'

export interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  /** The active dictionary. */
  t: Translation
  /** Locale-aware number formatting, so 1.234 vs 1,234 follows the language. */
  formatNumber: (value: number) => string
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
