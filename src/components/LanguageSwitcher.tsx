import { Languages } from 'lucide-react'

import { useTranslation } from '@/i18n/useTranslation'
import { LOCALES, LOCALE_LABELS, type Locale } from '@/i18n/translations'

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation()

  return (
    <div className="relative inline-flex items-center">
      <Languages
        className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground"
        aria-hidden="true"
      />
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        aria-label={t.language.label}
        className={[
          'h-8 appearance-none rounded-md border border-border bg-card/60 pl-8 pr-7 text-sm',
          'text-foreground transition-colors hover:bg-accent',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ].join(' ')}
      >
        {LOCALES.map((option) => (
          <option key={option} value={option}>
            {LOCALE_LABELS[option]}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute right-2.5 text-xs text-muted-foreground"
        aria-hidden="true"
      >
        ▾
      </span>
    </div>
  )
}
