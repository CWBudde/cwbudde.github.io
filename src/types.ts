export interface Repo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  homepage: string | null
  has_pages: boolean
  /**
   * Added to the catalog after the initial release, so older cached payloads
   * and fixtures may omit it. Callers fall back to `updated_at`.
   */
  created_at?: string
  updated_at: string
  fork: boolean
  readme_summary?: string | null
}

export type SortOption =
  | 'stars-desc'
  | 'stars-asc'
  | 'updated-desc'
  | 'updated-asc'
  | 'name-asc'
  | 'name-desc'
