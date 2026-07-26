import { Github } from 'lucide-react'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTranslation } from '@/i18n/useTranslation'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="relative overflow-hidden rounded-2xl border border-border bg-card/70 p-6 md:p-8">
      <div
        className="pointer-events-none absolute -right-12 -top-16 size-48 rounded-full bg-[var(--page-glow-a)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 size-36 rounded-full bg-[var(--page-glow-b)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-brand">
              {t.header.eyebrow}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Christian-W. Budde
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
              {t.header.tagline}
            </p>
          </div>

          <a
            href="https://github.com/CWBudde"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Github className="size-4" aria-hidden="true" />
            {t.header.githubProfile}
          </a>
        </div>
      </div>
    </header>
  )
}
