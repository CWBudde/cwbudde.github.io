import { describe, expect, it } from 'vitest'

import { getLiveDemoUrl } from '@/lib/liveDemo'
import type { Repo } from '@/types'

function repo(overrides: Partial<Repo> = {}): Repo {
  return {
    id: 1,
    name: 'algo-drum',
    full_name: 'CWBudde/algo-drum',
    html_url: 'https://github.com/CWBudde/algo-drum',
    description: null,
    language: 'Go',
    stargazers_count: 0,
    homepage: null,
    has_pages: true,
    updated_at: '2026-07-11T00:00:00Z',
    fork: false,
    ...overrides,
  }
}

describe('getLiveDemoUrl', () => {
  it('prefers an explicitly configured homepage', () => {
    expect(getLiveDemoUrl(repo({ homepage: ' https://example.com/demo ' }))).toBe(
      'https://example.com/demo',
    )
  })

  it('builds the standard URL for a verified project site', () => {
    expect(getLiveDemoUrl(repo())).toBe('https://cwbudde.github.io/algo-drum/')
  })

  it('uses the root URL for the user site repository', () => {
    expect(getLiveDemoUrl(repo({ name: 'cwbudde.github.io' }))).toBe(
      'https://cwbudde.github.io/',
    )
  })

  it('does not advertise an unverified or unavailable Pages deployment', () => {
    expect(getLiveDemoUrl(repo({ name: 'FlashSR' }))).toBeNull()
    expect(getLiveDemoUrl(repo({ name: 'no-pages', has_pages: false }))).toBeNull()
  })
})
