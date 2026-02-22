import { useMemo, useState } from 'react'

import { RepoCard } from '@/components/RepoCard'
import { SkeletonCard } from '@/components/SkeletonCard'
import { filterRepos, sortRepos } from '@/lib/filter'
import type { Repo, SortOption } from '@/types'

interface RepoGridProps {
  repos: Repo[]
  isLoading: boolean
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'stars-desc', label: 'Most Stars' },
  { value: 'updated-desc', label: 'Recently Updated' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'stars-asc', label: 'Fewest Stars' },
  { value: 'updated-asc', label: 'Oldest Updated' },
]

export function RepoGrid({ repos, isLoading }: RepoGridProps) {
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
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Repository Index</p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">All repositories</h2>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search repos"
            className="h-10 rounded-md border border-zinc-700 bg-zinc-950/80 px-3 text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-500 focus:border-emerald-400"
          />

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="h-10 rounded-md border border-zinc-700 bg-zinc-950/80 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-400"
          >
            {languages.map((entry) => (
              <option key={entry} value={entry}>
                {entry === 'all' ? 'All Languages' : entry}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="h-10 rounded-md border border-zinc-700 bg-zinc-950/80 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-400"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 text-sm text-zinc-400">
          No repositories match the current filters.
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
