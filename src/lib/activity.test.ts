import { describe, expect, it } from 'vitest'

import { buildActivitySeries } from '@/lib/activity'
import type { Repo } from '@/types'

function makeRepo(
  name: string,
  createdAt: string,
  stargazersCount: number,
  overrides: Partial<Repo> = {},
): Repo {
  return {
    id: name.length + stargazersCount,
    name,
    full_name: `CWBudde/${name}`,
    html_url: `https://github.com/CWBudde/${name}`,
    description: null,
    language: 'Pascal',
    stargazers_count: stargazersCount,
    homepage: null,
    has_pages: false,
    created_at: createdAt,
    updated_at: createdAt,
    fork: false,
    ...overrides,
  }
}

const repos: Repo[] = [
  makeRepo('newest', '2026-01-10T00:00:00Z', 0),
  makeRepo('oldest', '2015-03-01T00:00:00Z', 80),
  makeRepo('middle', '2019-07-01T00:00:00Z', 20),
  makeRepo('same-year-as-middle', '2019-09-01T00:00:00Z', 5),
]

describe('buildActivitySeries', () => {
  it('orders points oldest to newest', () => {
    const { points } = buildActivitySeries(repos)
    expect(points.map((point) => point.repo.name)).toEqual([
      'oldest',
      'middle',
      'same-year-as-middle',
      'newest',
    ])
  })

  it('gives the most-starred repo the full amplitude', () => {
    const { points } = buildActivitySeries(repos)
    const oldest = points.find((point) => point.repo.name === 'oldest')
    expect(oldest?.amplitude).toBe(1)
  })

  it('keeps a zero-star repo at zero amplitude', () => {
    const { points } = buildActivitySeries(repos)
    const newest = points.find((point) => point.repo.name === 'newest')
    expect(newest?.amplitude).toBe(0)
  })

  it('scales amplitude logarithmically so small counts stay visible', () => {
    const { points } = buildActivitySeries(repos)
    const middle = points.find((point) => point.repo.name === 'middle')
    // A linear scale would put 20/80 at 0.25; log keeps it well above that.
    expect(middle?.amplitude).toBeGreaterThan(0.6)
    expect(middle?.amplitude).toBeLessThan(1)
  })

  it('marks the first index of each distinct year', () => {
    const { markers } = buildActivitySeries(repos)
    expect(markers).toEqual([
      { year: 2015, index: 0 },
      { year: 2019, index: 1 },
      { year: 2026, index: 3 },
    ])
  })

  it('reports the peak star count', () => {
    expect(buildActivitySeries(repos).maxStars).toBe(80)
  })

  it('skips repos with an unusable date', () => {
    const broken = makeRepo('broken', 'not-a-date', 5, { updated_at: 'not-a-date' })
    delete broken.created_at
    const { points } = buildActivitySeries([...repos, broken])
    expect(points.map((point) => point.repo.name)).not.toContain('broken')
  })

  it('returns an empty series for an empty catalog', () => {
    expect(buildActivitySeries([])).toEqual({
      points: [],
      markers: [],
      maxStars: 0,
      usesCreationDates: false,
    })
  })

  it('reports creation dates when every repo carries one', () => {
    expect(buildActivitySeries(repos).usesCreationDates).toBe(true)
  })

  it('reports a fallback when any repo is missing created_at', () => {
    const legacy = makeRepo('legacy', '2018-01-01T00:00:00Z', 3)
    delete legacy.created_at
    expect(buildActivitySeries([...repos, legacy]).usesCreationDates).toBe(false)
  })

  it('does not divide by zero when nothing has stars', () => {
    const series = buildActivitySeries([makeRepo('a', '2020-01-01T00:00:00Z', 0)])
    expect(series.points[0].amplitude).toBe(0)
  })
})
