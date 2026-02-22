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
  updated_at: string
  fork: boolean
}

export type SortOption =
  | 'stars-desc'
  | 'stars-asc'
  | 'updated-desc'
  | 'updated-asc'
  | 'name-asc'
  | 'name-desc'
