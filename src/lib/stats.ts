import type { Repo } from '@/types'

export interface CatalogStats {
  total: number
  original: number
  forks: number
  languages: number
  stars: number
  firstYear: number | null
  lastYear: number | null
}

/**
 * The year a repository belongs to. `created_at` was added to the catalog
 * later, so fall back to `updated_at` for payloads generated before that.
 */
export function repoYear(repo: Repo): number | null {
  const raw = repo.created_at ?? repo.updated_at
  const year = new Date(raw).getFullYear()

  return Number.isNaN(year) ? null : year
}

export function computeStats(repos: Repo[]): CatalogStats {
  const languages = new Set<string>()
  const years: number[] = []
  let forks = 0
  let stars = 0

  repos.forEach((repo) => {
    if (repo.language) {
      languages.add(repo.language)
    }

    if (repo.fork) {
      forks += 1
    }

    stars += repo.stargazers_count

    const year = repoYear(repo)
    if (year !== null) {
      years.push(year)
    }
  })

  return {
    total: repos.length,
    original: repos.length - forks,
    forks,
    languages: languages.size,
    stars,
    firstYear: years.length > 0 ? Math.min(...years) : null,
    lastYear: years.length > 0 ? Math.max(...years) : null,
  }
}
