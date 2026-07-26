import { useContext } from 'react'

import { LanguageContext, type LanguageContextValue } from '@/i18n/context'

export function useTranslation(): LanguageContextValue {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useTranslation must be used inside a LanguageProvider')
  }

  return context
}
