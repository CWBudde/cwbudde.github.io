import { useMemo, useState } from 'react'

import { RepoCard } from '@/components/RepoCard'
import { SkeletonCard } from '@/components/SkeletonCard'
import { useTranslation } from '@/i18n/useTranslation'
import { filterRepos, sortRepos } from '@/lib/filter'
import type { Repo, SortOption } from '@/types'

interface RepoGridProps {
  repos: Repo[]
  isLoading: boolean
}

const SORT_ORDER: SortOption[] = [
  'stars-desc',
  'updated-desc',
  'name-asc',
  'name-desc',
  'stars-asc',
  'updated-asc',
]

const controlClass =
  'h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

export function RepoGrid({ repos, isLoading }: RepoGridProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('all')
  const [sort, setSort] = useState<SortOption>('stars-desc')

  const languages = useMemo(() => {
    const unique = new Set<string>()

    repos.forEach((repo) => {
      if (repo.language) {
        unique.add(repo.language)
      }
    })

    return ['all', ...Array.from(unique).sort((a, b) => a.localeCompare(b))]
  }, [repos])

  const visibleRepos = useMemo(() => {
    return sortRepos(filterRepos(repos, { query, language }), sort)
  }, [repos, query, language, sort])

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {t.grid.eyebrow}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t.grid.title}</h2>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.grid.searchPlaceholder}
            aria-label={t.grid.searchLabel}
            className={controlClass}
          />

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label={t.grid.languageLabel}
            className={controlClass}
          >
            {languages.map((entry) => (
              <option key={entry} value={entry}>
                {entry === 'all' ? t.grid.allLanguages : entry}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            aria-label={t.grid.sortLabel}
            className={controlClass}
          >
            {SORT_ORDER.map((option) => (
              <option key={option} value={option}>
                {t.grid.sort[option]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={`repo-skeleton-${idx}`} />
          ))}
        </div>
      ) : visibleRepos.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          {t.grid.empty}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </section>
  )
}
