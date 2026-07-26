import { useMemo } from 'react'

import { useTranslation } from '@/i18n/useTranslation'
import { computeStats } from '@/lib/stats'
import type { Repo } from '@/types'

interface StatsBarProps {
  repos: Repo[]
  isLoading: boolean
}

export function StatsBar({ repos, isLoading }: StatsBarProps) {
  const { t, formatNumber } = useTranslation()
  const stats = useMemo(() => computeStats(repos), [repos])

  const span =
    stats.firstYear !== null && stats.lastYear !== null
      ? stats.firstYear === stats.lastYear
        ? String(stats.firstYear)
        : `${stats.firstYear}–${stats.lastYear}`
      : null

  const entries: { key: string; label: string; value: string }[] = [
    { key: 'repositories', label: t.stats.repositories, value: formatNumber(stats.total) },
    { key: 'original', label: t.stats.original, value: formatNumber(stats.original) },
    { key: 'forks', label: t.stats.forks, value: formatNumber(stats.forks) },
    { key: 'languages', label: t.stats.languages, value: formatNumber(stats.languages) },
    { key: 'stars', label: t.stats.stars, value: formatNumber(stats.stars) },
    ...(span ? [{ key: 'span', label: t.stats.span, value: span }] : []),
  ]

  return (
    <section aria-label={t.stats.eyebrow}>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {entries.map((entry) => (
          <div key={entry.key} className="bg-card px-4 py-3.5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {entry.label}
            </dt>
            <dd className="mt-1 font-mono text-2xl font-medium tabular-nums tracking-tight text-foreground">
              {isLoading ? (
                <span
                  className="inline-block h-6 w-14 animate-pulse rounded bg-muted align-middle"
                  aria-hidden="true"
                />
              ) : (
                entry.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
