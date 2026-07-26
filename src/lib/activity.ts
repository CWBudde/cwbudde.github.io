import { repoYear } from '@/lib/stats'
import type { Repo } from '@/types'

export interface ActivityPoint {
  repo: Repo
  year: number
  /** 0–1, log-scaled against the most-starred repository. */
  amplitude: number
}

export interface YearMarker {
  year: number
  /** Index of the first point belonging to this year. */
  index: number
}

export interface ActivitySeries {
  points: ActivityPoint[]
  markers: YearMarker[]
  maxStars: number
  /**
   * False when any point had to fall back to `updated_at`. The chart labels its
   * x-axis from this so it never claims creation order it does not have.
   */
  usesCreationDates: boolean
}

/**
 * Lays the catalog out as a signal: one impulse per repository in creation
 * order, with height driven by stars. A log scale keeps a single star visible
 * next to a repository with ninety-seven.
 */
export function buildActivitySeries(repos: Repo[]): ActivitySeries {
  const dated = repos
    .map((repo) => ({ repo, year: repoYear(repo) }))
    .filter((entry): entry is { repo: Repo; year: number } => entry.year !== null)
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year
      }

      const aTime = new Date(a.repo.created_at ?? a.repo.updated_at).getTime()
      const bTime = new Date(b.repo.created_at ?? b.repo.updated_at).getTime()

      return aTime - bTime || a.repo.name.localeCompare(b.repo.name)
    })

  const maxStars = dated.reduce((peak, entry) => Math.max(peak, entry.repo.stargazers_count), 0)
  const scale = maxStars > 0 ? Math.log(maxStars + 1) : 0

  const points: ActivityPoint[] = dated.map(({ repo, year }) => ({
    repo,
    year,
    amplitude: scale > 0 ? Math.log(repo.stargazers_count + 1) / scale : 0,
  }))

  const markers: YearMarker[] = []
  points.forEach((point, index) => {
    if (markers.length === 0 || markers[markers.length - 1].year !== point.year) {
      markers.push({ year: point.year, index })
    }
  })

  return {
    points,
    markers,
    maxStars,
    usesCreationDates: dated.length > 0 && dated.every(({ repo }) => Boolean(repo.created_at)),
  }
}
