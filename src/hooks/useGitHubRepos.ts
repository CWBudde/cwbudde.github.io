import { useCallback, useEffect, useState } from 'react'

import type { Repo } from '@/types'

interface UseGitHubReposResult {
  repos: Repo[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

const REPOS_URL =
  'https://api.github.com/users/CWBudde/repos?per_page=100&sort=stars'
const CACHE_KEY = 'cwbudde.repos.cache.v1'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

interface CachedReposPayload {
  repos: Repo[]
  fetchedAt: number
}

function readCachedRepos(): CachedReposPayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as CachedReposPayload
    if (!Array.isArray(parsed.repos) || typeof parsed.fetchedAt !== 'number') {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function writeCachedRepos(payload: CachedReposPayload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    // Ignore cache write failures (e.g. private mode/storage limits).
  }
}

export function useGitHubRepos(): UseGitHubReposResult {
  const [repos, setRepos] = useState<Repo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const cached = readCachedRepos()
    const isForceRefresh = refreshToken > 0

    if (cached) {
      setRepos(cached.repos)
      setIsLoading(false)
      setError(null)
    }

    const hasFreshCache =
      cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS

    if (hasFreshCache && !isForceRefresh) {
      return () => {
        controller.abort()
      }
    }

    async function loadRepos() {
      if (!cached) {
        setIsLoading(true)
      }
      setError(null)

      try {
        const response = await fetch(REPOS_URL, {
          signal: controller.signal,
          headers: {
            Accept: 'application/vnd.github+json',
          },
        })

        if (!response.ok) {
          throw new Error(`GitHub request failed (${response.status})`)
        }

        const data = (await response.json()) as Repo[]
        setRepos(data)
        writeCachedRepos({ repos: data, fetchedAt: Date.now() })
      } catch (err) {
        if (controller.signal.aborted) {
          return
        }

        if (!cached) {
          const message =
            err instanceof Error ? err.message : 'Failed to fetch repositories'
          setError(message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadRepos()

    return () => {
      controller.abort()
    }
  }, [refreshToken])

  const refetch = useCallback(() => {
    setRefreshToken((value) => value + 1)
  }, [])

  return { repos, isLoading, error, refetch }
}
