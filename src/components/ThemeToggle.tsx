import { Monitor, Moon, Sun } from 'lucide-react'

import { useTranslation } from '@/i18n/useTranslation'
import { THEME_PREFERENCES, type ThemePreference } from '@/theme/context'
import { useTheme } from '@/theme/useTheme'

const ICONS: Record<ThemePreference, typeof Sun> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}

export function ThemeToggle() {
  const { preference, setPreference } = useTheme()
  const { t } = useTranslation()

  const labels: Record<ThemePreference, string> = {
    system: t.theme.system,
    light: t.theme.light,
    dark: t.theme.dark,
  }

  return (
    <div
      role="radiogroup"
      aria-label={t.theme.label}
      className="inline-flex items-center gap-0.5 rounded-md border border-border bg-card/60 p-0.5"
    >
      {THEME_PREFERENCES.map((option) => {
        const Icon = ICONS[option]
        const isActive = preference === option

        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={labels[option]}
            title={labels[option]}
            onClick={() => setPreference(option)}
            className={[
              'inline-flex size-7 items-center justify-center rounded-sm transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              isActive
                ? 'bg-brand text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            ].join(' ')}
          >
            <Icon className="size-3.5" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
