import { describe, expect, it } from 'vitest'

import { computeStats, repoYear } from '@/lib/stats'
import type { Repo } from '@/types'

function makeRepo(overrides: Partial<Repo> & Pick<Repo, 'id' | 'name'>): Repo {
  return {
    full_name: `CWBudde/${overrides.name}`,
    html_url: `https://github.com/CWBudde/${overrides.name}`,
    description: null,
    language: null,
    stargazers_count: 0,
    homepage: null,
    has_pages: false,
    created_at: '2015-01-01T00:00:00Z',
    updated_at: '2020-01-01T00:00:00Z',
    fork: false,
    ...overrides,
  }
}

const repos: Repo[] = [
  makeRepo({
    id: 1,
    name: 'AggPasMod',
    language: 'Pascal',
    stargazers_count: 83,
    created_at: '2015-06-01T00:00:00Z',
  }),
  makeRepo({
    id: 2,
    name: 'matplotlib-go',
    language: 'Go',
    stargazers_count: 1,
    created_at: '2025-03-01T00:00:00Z',
  }),
  makeRepo({
    id: 3,
    name: 'dcef3',
    language: 'Pascal',
    stargazers_count: 8,
    created_at: '2016-02-01T00:00:00Z',
    fork: true,
  }),
  makeRepo({
    id: 4,
    name: 'unknown-lang',
    language: null,
    stargazers_count: 0,
    created_at: '2019-05-01T00:00:00Z',
  }),
]

describe('repoYear', () => {
  it('reads the creation year', () => {
    expect(repoYear(makeRepo({ id: 9, name: 'x', created_at: '2017-08-09T00:00:00Z' }))).toBe(2017)
  })

  it('falls back to the updated year when created_at is missing', () => {
    const repo = makeRepo({ id: 9, name: 'x', updated_at: '2021-04-02T00:00:00Z' })
    delete repo.created_at
    expect(repoYear(repo)).toBe(2021)
  })

  it('returns null when neither date parses', () => {
    const repo = makeRepo({ id: 9, name: 'x', updated_at: 'not-a-date' })
    delete repo.created_at
    expect(repoYear(repo)).toBeNull()
  })
})

describe('computeStats', () => {
  it('counts totals, forks and originals', () => {
    const stats = computeStats(repos)
    expect(stats.total).toBe(4)
    expect(stats.forks).toBe(1)
    expect(stats.original).toBe(3)
  })

  it('sums stars across every repo including forks', () => {
    expect(computeStats(repos).stars).toBe(92)
  })

  it('counts distinct languages and ignores repos without one', () => {
    expect(computeStats(repos).languages).toBe(2)
  })

  it('reports the year span across the catalog', () => {
    const stats = computeStats(repos)
    expect(stats.firstYear).toBe(2015)
    expect(stats.lastYear).toBe(2025)
  })

  it('handles an empty catalog without dividing by zero', () => {
    expect(computeStats([])).toEqual({
      total: 0,
      original: 0,
      forks: 0,
      languages: 0,
      stars: 0,
      firstYear: null,
      lastYear: null,
    })
  })
})
