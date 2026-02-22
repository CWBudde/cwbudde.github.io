import { describe, expect, it } from 'vitest'

import { filterRepos, sortRepos } from '@/lib/filter'
import type { Repo } from '@/types'

const repos: Repo[] = [
  {
    id: 1,
    name: 'algo-dsp',
    full_name: 'CWBudde/algo-dsp',
    html_url: 'https://github.com/CWBudde/algo-dsp',
    description: 'Digital signal processing playground',
    language: 'Go',
    stargazers_count: 42,
    homepage: 'https://cwbudde.github.io/algo-dsp/',
    has_pages: true,
    updated_at: '2026-01-01T00:00:00Z',
    fork: false,
  },
  {
    id: 2,
    name: 'WebSofa',
    full_name: 'CWBudde/WebSofa',
    html_url: 'https://github.com/CWBudde/WebSofa',
    description: 'UI experiments',
    language: 'TypeScript',
    stargazers_count: 12,
    homepage: null,
    has_pages: false,
    updated_at: '2026-02-01T00:00:00Z',
    fork: false,
  },
  {
    id: 3,
    name: 'Cards',
    full_name: 'CWBudde/Cards',
    html_url: 'https://github.com/CWBudde/Cards',
    description: null,
    language: null,
    stargazers_count: 30,
    homepage: null,
    has_pages: false,
    updated_at: '2025-12-15T00:00:00Z',
    fork: false,
  },
]

describe('filterRepos', () => {
  it('filters by case-insensitive query across name and description', () => {
    const result = filterRepos(repos, { query: 'signal' })
    expect(result.map((repo) => repo.name)).toEqual(['algo-dsp'])
  })

  it('filters by language', () => {
    const result = filterRepos(repos, { language: 'typescript' })
    expect(result.map((repo) => repo.name)).toEqual(['WebSofa'])
  })

  it('returns all repos for language=all and empty query', () => {
    const result = filterRepos(repos, { language: 'all', query: '' })
    expect(result).toHaveLength(3)
  })
})

describe('sortRepos', () => {
  it('sorts by stars descending', () => {
    const result = sortRepos(repos, 'stars-desc')
    expect(result.map((repo) => repo.name)).toEqual([
      'algo-dsp',
      'Cards',
      'WebSofa',
    ])
  })

  it('sorts by updated descending', () => {
    const result = sortRepos(repos, 'updated-desc')
    expect(result.map((repo) => repo.name)).toEqual([
      'WebSofa',
      'algo-dsp',
      'Cards',
    ])
  })

  it('sorts by name ascending', () => {
    const result = sortRepos(repos, 'name-asc')
    expect(result.map((repo) => repo.name)).toEqual([
      'algo-dsp',
      'Cards',
      'WebSofa',
    ])
  })
})
