import type { Repo, SortOption } from '@/types'

export interface FilterOptions {
  query?: string
  language?: string
}

export function filterRepos(
  repos: Repo[],
  { query = '', language = 'all' }: FilterOptions = {},
): Repo[] {
  const normalizedQuery = query.trim().toLowerCase()
  const normalizedLanguage = language.trim().toLowerCase()

  return repos.filter((repo) => {
    const matchesLanguage =
      normalizedLanguage === 'all' ||
      normalizedLanguage.length === 0 ||
      (repo.language ?? '').toLowerCase() === normalizedLanguage

    if (!matchesLanguage) {
      return false
    }

    if (normalizedQuery.length === 0) {
      return true
    }

    const haystack = `${repo.name} ${repo.description ?? ''}`.toLowerCase()
    return haystack.includes(normalizedQuery)
  })
}

export function sortRepos(repos: Repo[], sort: SortOption): Repo[] {
  const sorted = [...repos]

  sorted.sort((a, b) => {
    switch (sort) {
      case 'stars-desc':
        return b.stargazers_count - a.stargazers_count
      case 'stars-asc':
        return a.stargazers_count - b.stargazers_count
      case 'updated-desc':
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
      case 'updated-asc':
        return (
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        )
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'name-asc':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  return sorted
}
