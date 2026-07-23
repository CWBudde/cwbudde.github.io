import type { Repo } from '@/types'

const GITHUB_PAGES_BASE_URL = 'https://cwbudde.github.io'

// GitHub's `has_pages` flag also stays true for Pages sites whose latest
// deployment is unavailable. Keep this list limited to URLs verified to serve
// successfully so the portfolio does not advertise broken demos.
export const VERIFIED_PAGES_REPOS = new Set([
  'Aconiq',
  'Agogo-Web',
  'Cards-React',
  'Saftladen',
  'WaterColorMap',
  'agg_go',
  'algo-acoustics',
  'algo-drum',
  'algo-dsp',
  'algo-fft',
  'algo-glockenspiel',
  'algo-pde',
  'algo-piano',
  'cwbudde.github.io',
  'gll-tools',
  'go-citygml',
  'go-dws',
  'go-dws-primer',
  'go-microgpt',
  'go-pocket-tts',
  'go-sq-tool',
  'goulder-dash',
  'hangman-claude',
  'hangman-gemini',
  'huhu',
  'jigsaw-react-app',
  'justgohtml',
  'lgln-citygml-proxy',
  'lvrsrc',
  'matplotlib-go',
  'mnstrstdtrlly',
  'prototype-demo',
  'racing_game_kimi',
])

export function getLiveDemoUrl(repo: Repo): string | null {
  const homepage = repo.homepage?.trim()
  if (homepage) {
    return homepage
  }

  if (!repo.has_pages || !VERIFIED_PAGES_REPOS.has(repo.name)) {
    return null
  }

  if (repo.name === 'cwbudde.github.io') {
    return `${GITHUB_PAGES_BASE_URL}/`
  }

  return `${GITHUB_PAGES_BASE_URL}/${repo.name}/`
}
