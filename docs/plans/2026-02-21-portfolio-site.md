# cwbudde.github.io Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a dark-themed React portfolio site that fetches and displays CWBudde's public GitHub repos with a curated spotlight section and filterable full list.

**Architecture:** Single-page React 19 app (Vite 6 + Bun). Repo data fetched client-side from the GitHub REST API on mount. Featured repos are auto-derived from repos that have a `homepage` URL set (web demos); filtering/sorting runs entirely client-side on the fetched array. Repo cards with a demo URL show a "Live Demo" button.

**Tech Stack:** React 19, Vite 6, Bun, TypeScript, Tailwind CSS v4, shadcn/ui, Vitest, GitHub Actions

---

### Task 1: Scaffold the Vite + React + Bun project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`

**Step 1: Scaffold with Bun**

```bash
cd /mnt/projekte/Code/cwbudde.github.io
bun create vite . --template react-ts
```

When prompted "Current directory is not empty. Please choose how to proceed" → select **Ignore files and continue**.

**Step 2: Install dependencies**

```bash
bun install
```

**Step 3: Verify dev server starts**

```bash
bun run dev
```

Expected: Vite dev server running at `http://localhost:5173`. Press `q` to quit.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: scaffold vite react-ts project"
```

---

### Task 2: Configure Vite for GitHub Pages

**Files:**
- Modify: `vite.config.ts`

**Step 1: Update vite.config.ts**

Replace the entire file content with:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 2: Verify build succeeds**

```bash
bun run build
```

Expected: `dist/` folder created, no errors.

**Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "feat: configure vite for github pages root deployment"
```

---

### Task 3: Install and configure Tailwind CSS

**Files:**
- Create: `tailwind.config.js`, `src/index.css`
- Modify: `src/main.tsx`

**Step 1: Install Tailwind**

```bash
bun add -d tailwindcss @tailwindcss/vite
```

**Step 2: Add Tailwind plugin to vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 3: Replace `src/index.css` with**

```css
@import "tailwindcss";

:root {
  color-scheme: dark;
}

body {
  @apply bg-zinc-950 text-zinc-100 min-h-screen;
}
```

**Step 4: Ensure `src/main.tsx` imports the CSS**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Step 5: Replace `src/App.tsx` with a smoke test**

```tsx
export default function App() {
  return (
    <div className="p-8 text-zinc-100">
      <h1 className="text-3xl font-bold">Hello Tailwind</h1>
    </div>
  )
}
```

**Step 6: Verify**

```bash
bun run dev
```

Expected: Dark background, white "Hello Tailwind" text.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: install and configure tailwind css v4"
```

---

### Task 4: Install shadcn/ui

shadcn/ui copies component source into your repo — no runtime library dependency.

**Step 1: Install shadcn CLI and peer deps**

```bash
bun add -d @shadcn/ui
bunx shadcn init
```

When prompted:
- Style: **Default**
- Base color: **Zinc**
- CSS variables: **Yes**

This creates `components.json` and updates `src/index.css`.

**Step 2: Add the components we need**

```bash
bunx shadcn add card badge button
```

Expected: Files created under `src/components/ui/` (card.tsx, badge.tsx, button.tsx).

**Step 3: Verify build still passes**

```bash
bun run build
```

Expected: No errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: install shadcn/ui with card, badge, button components"
```

---

### Task 5: Install Vitest and write tests for filter/sort utilities

**Files:**
- Create: `src/lib/filter.ts`, `src/lib/filter.test.ts`
- Modify: `package.json` (test script), `vite.config.ts`

**Step 1: Install Vitest**

```bash
bun add -d vitest @vitest/ui happy-dom
```

**Step 2: Add test config to `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
```

**Step 3: Add test script to `package.json`**

Add to the `scripts` object:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 4: Create the failing tests at `src/lib/filter.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { filterRepos, sortRepos } from './filter'
import type { Repo } from '../types'

const repos: Repo[] = [
  { id: 1, name: 'alpha', description: 'first', language: 'Pascal', stargazers_count: 10, html_url: '', updated_at: '2024-01-01' },
  { id: 2, name: 'beta', description: 'second', language: 'Go', stargazers_count: 5, html_url: '', updated_at: '2025-01-01' },
  { id: 3, name: 'gamma', description: null, language: 'Pascal', stargazers_count: 20, html_url: '', updated_at: '2023-01-01' },
]

describe('filterRepos', () => {
  it('returns all repos when search is empty and language is all', () => {
    expect(filterRepos(repos, '', 'all')).toHaveLength(3)
  })

  it('filters by name substring (case-insensitive)', () => {
    expect(filterRepos(repos, 'ALPHA', 'all')).toHaveLength(1)
    expect(filterRepos(repos, 'ALPHA', 'all')[0].name).toBe('alpha')
  })

  it('filters by description substring', () => {
    expect(filterRepos(repos, 'second', 'all')).toHaveLength(1)
  })

  it('handles null description without crashing', () => {
    expect(() => filterRepos(repos, 'anything', 'all')).not.toThrow()
  })

  it('filters by language', () => {
    expect(filterRepos(repos, '', 'Pascal')).toHaveLength(2)
    expect(filterRepos(repos, '', 'Go')).toHaveLength(1)
  })

  it('combines search and language filter', () => {
    expect(filterRepos(repos, 'alpha', 'Pascal')).toHaveLength(1)
    expect(filterRepos(repos, 'alpha', 'Go')).toHaveLength(0)
  })
})

describe('sortRepos', () => {
  it('sorts by stars descending', () => {
    const sorted = sortRepos([...repos], 'stars')
    expect(sorted[0].stargazers_count).toBe(20)
    expect(sorted[2].stargazers_count).toBe(5)
  })

  it('sorts by name ascending', () => {
    const sorted = sortRepos([...repos], 'name')
    expect(sorted[0].name).toBe('alpha')
    expect(sorted[2].name).toBe('gamma')
  })

  it('sorts by updated_at descending (most recent first)', () => {
    const sorted = sortRepos([...repos], 'updated')
    expect(sorted[0].name).toBe('beta') // 2025
    expect(sorted[2].name).toBe('gamma') // 2023
  })
})
```

**Step 5: Run tests to verify they fail**

```bash
bun run test
```

Expected: FAIL — `Cannot find module './filter'`

**Step 6: Create `src/types.ts`**

```ts
export interface Repo {
  id: number
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  html_url: string
  homepage: string | null   // set on GitHub = live demo URL
  updated_at: string
}
```

**Step 7: Create `src/lib/filter.ts`**

```ts
import type { Repo } from '../types'

export type SortKey = 'stars' | 'name' | 'updated'

export function filterRepos(repos: Repo[], search: string, language: string): Repo[] {
  const q = search.toLowerCase()
  return repos.filter((r) => {
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      (r.description ?? '').toLowerCase().includes(q)
    const matchesLang = language === 'all' || r.language === language
    return matchesSearch && matchesLang
  })
}

export function sortRepos(repos: Repo[], sort: SortKey): Repo[] {
  return repos.sort((a, b) => {
    if (sort === 'stars') return b.stargazers_count - a.stargazers_count
    if (sort === 'name') return a.name.localeCompare(b.name)
    if (sort === 'updated') return b.updated_at.localeCompare(a.updated_at)
    return 0
  })
}
```

**Step 8: Run tests to verify they pass**

```bash
bun run test
```

Expected: All 8 tests PASS.

**Step 9: Commit**

```bash
git add -A
git commit -m "feat: add filter/sort utilities with tests"
```

---

### Task 6: Create the GitHub API hook

**Files:**
- Create: `src/hooks/useGitHubRepos.ts`

**Step 1: Create `src/hooks/useGitHubRepos.ts`**

```ts
import { useState, useEffect } from 'react'
import type { Repo } from '../types'

interface UseGitHubReposResult {
  repos: Repo[]
  loading: boolean
  error: string | null
}

export function useGitHubRepos(username: string): UseGitHubReposResult {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchRepos() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=stars`
        )
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
        const data: Repo[] = await res.json()
        if (!cancelled) setRepos(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchRepos()
    return () => { cancelled = true }
  }, [username])

  return { repos, loading, error }
}
```

**Step 2: Verify TypeScript compiles**

```bash
bun run build
```

Expected: No errors.

**Step 3: Commit**

```bash
git add src/hooks/useGitHubRepos.ts
git commit -m "feat: add useGitHubRepos hook"
```

---

### Task 7: Featured repos logic

Featured repos are **auto-derived** from repos that have a `homepage` URL set on GitHub (i.e. a live web demo). No config file needed — set the homepage field on any repo in GitHub Settings and it will appear in the spotlight automatically.

To set a homepage on a repo you can use:
```bash
gh repo edit CWBudde/<repo-name> --homepage "https://cwbudde.github.io/<repo-name>/"
```

No files to create for this task — the derivation logic lives in `App.tsx` (Task 13). Confirm at least one repo (e.g. `algo-dsp`) has a homepage set so the section is non-empty.

**Step 1: Verify algo-dsp has a homepage set**

```bash
gh repo view CWBudde/algo-dsp --json homepageUrl
```

Expected: `{ "homepageUrl": "https://cwbudde.github.io/algo-dsp/" }` (or similar). If empty, set it:

```bash
gh repo edit CWBudde/algo-dsp --homepage "https://cwbudde.github.io/algo-dsp/"
```

**Step 2: No commit needed** — this task is informational / configuration only.

---

### Task 8: Build the RepoCard component

**Files:**
- Create: `src/components/RepoCard.tsx`

**Step 1: Create `src/components/RepoCard.tsx`**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, ExternalLink } from 'lucide-react'
import type { Repo } from '../types'

// Language → color mapping (extend as needed)
const LANG_COLORS: Record<string, string> = {
  Pascal: 'bg-blue-700 text-blue-100',
  Go: 'bg-cyan-700 text-cyan-100',
  TypeScript: 'bg-sky-700 text-sky-100',
  JavaScript: 'bg-yellow-600 text-yellow-100',
  Python: 'bg-green-700 text-green-100',
  'Objective-C': 'bg-orange-700 text-orange-100',
  Java: 'bg-red-700 text-red-100',
  'C++': 'bg-purple-700 text-purple-100',
  Delphi: 'bg-blue-800 text-blue-100',
  HTML: 'bg-rose-700 text-rose-100',
}

function langColor(lang: string | null): string {
  return lang ? (LANG_COLORS[lang] ?? 'bg-zinc-600 text-zinc-100') : 'bg-zinc-700 text-zinc-300'
}

interface RepoCardProps {
  repo: Repo
  featured?: boolean
}

export function RepoCard({ repo, featured = false }: RepoCardProps) {
  return (
    <div className={`
      h-full bg-zinc-900 border border-zinc-800 rounded-xl
      transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800/80
      flex flex-col
      ${featured ? 'border-zinc-700' : ''}
    `}>
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Name links to GitHub repo */}
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-mono font-semibold text-zinc-100 hover:text-white leading-tight ${featured ? 'text-lg' : 'text-base'}`}
        >
          {repo.name}
        </a>
        {repo.description && (
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 flex-1">
            {repo.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-auto pt-2">
          {repo.language && (
            <Badge className={`text-xs font-medium px-2 py-0.5 rounded ${langColor(repo.language)}`}>
              {repo.language}
            </Badge>
          )}
          <span className="flex items-center gap-1 text-zinc-400 text-xs ml-auto">
            <Star className="w-3 h-3" />
            {repo.stargazers_count}
          </span>
        </div>
      </div>
      {/* Demo link — only shown when homepage is set */}
      {repo.homepage && (
        <div className="px-4 pb-4">
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
          >
            <ExternalLink className="w-3 h-3" />
            Live Demo
          </a>
        </div>
      )}
    </div>
  )
}
```

**Step 2: Install lucide-react (for the Star icon)**

```bash
bun add lucide-react
```

**Step 3: Verify build**

```bash
bun run build
```

Expected: No errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add RepoCard component"
```

---

### Task 9: Build the SkeletonCard component

**Files:**
- Create: `src/components/SkeletonCard.tsx`

**Step 1: Create `src/components/SkeletonCard.tsx`**

```tsx
export function SkeletonCard() {
  return (
    <div className="h-36 rounded-xl bg-zinc-800/60 border border-zinc-800 animate-pulse" />
  )
}
```

**Step 2: Commit**

```bash
git add src/components/SkeletonCard.tsx
git commit -m "feat: add SkeletonCard loading placeholder"
```

---

### Task 10: Build the FeaturedSection component

**Files:**
- Create: `src/components/FeaturedSection.tsx`

**Step 1: Create `src/components/FeaturedSection.tsx`**

```tsx
import { Star } from 'lucide-react'
import { RepoCard } from './RepoCard'
import { SkeletonCard } from './SkeletonCard'
import type { Repo } from '../types'

interface FeaturedSectionProps {
  repos: Repo[]
  loading: boolean
}

export function FeaturedSection({ repos, loading }: FeaturedSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-300 mb-4">
        <Star className="w-4 h-4 text-yellow-400" />
        Featured
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : repos.map((repo) => <RepoCard key={repo.id} repo={repo} featured />)
        }
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/FeaturedSection.tsx
git commit -m "feat: add FeaturedSection component"
```

---

### Task 11: Build the RepoGrid component (with search/filter/sort)

**Files:**
- Create: `src/components/RepoGrid.tsx`

**Step 1: Create `src/components/RepoGrid.tsx`**

```tsx
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { RepoCard } from './RepoCard'
import { SkeletonCard } from './SkeletonCard'
import { filterRepos, sortRepos, type SortKey } from '../lib/filter'
import type { Repo } from '../types'

interface RepoGridProps {
  repos: Repo[]
  loading: boolean
}

export function RepoGrid({ repos, loading }: RepoGridProps) {
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('all')
  const [sort, setSort] = useState<SortKey>('stars')

  const languages = useMemo(() => {
    const langs = new Set(repos.map((r) => r.language).filter(Boolean) as string[])
    return Array.from(langs).sort()
  }, [repos])

  const displayed = useMemo(
    () => sortRepos(filterRepos(repos, search, language), sort),
    [repos, search, language, sort]
  )

  return (
    <section>
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
        <h2 className="text-lg font-semibold text-zinc-300 mr-auto">All Repos</h2>
        <div className="flex gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-44"
            />
          </div>
          {/* Language filter */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="py-1.5 px-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="all">All languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="py-1.5 px-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="stars">Stars</option>
            <option value="name">Name</option>
            <option value="updated">Recently updated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : displayed.length === 0 ? (
        <p className="text-zinc-500 text-sm py-8 text-center">No repos match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
        </div>
      )}
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/RepoGrid.tsx
git commit -m "feat: add RepoGrid with search, language filter, and sort"
```

---

### Task 12: Build the Header component

**Files:**
- Create: `src/components/Header.tsx`

**Step 1: Create `src/components/Header.tsx`**

```tsx
import { Github } from 'lucide-react'

export function Header() {
  return (
    <header className="mb-12 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-mono text-zinc-100 tracking-tight">
            CWBudde
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Open-source Pascal, Delphi &amp; Go projects
          </p>
        </div>
        <a
          href="https://github.com/CWBudde"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors text-sm"
        >
          <Github className="w-5 h-5" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
      <div className="mt-4 h-px bg-zinc-800" />
    </header>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add Header component"
```

---

### Task 13: Wire everything together in App.tsx

**Files:**
- Modify: `src/App.tsx`

**Step 1: Replace `src/App.tsx`**

Featured repos are those with a `homepage` set — no config file needed.

```tsx
import { useMemo } from 'react'
import { Header } from './components/Header'
import { FeaturedSection } from './components/FeaturedSection'
import { RepoGrid } from './components/RepoGrid'
import { useGitHubRepos } from './hooks/useGitHubRepos'

export default function App() {
  const { repos, loading, error } = useGitHubRepos('CWBudde')

  // Repos with a homepage set = have a live web demo → spotlight
  const featuredRepos = useMemo(
    () => repos.filter((r) => r.homepage),
    [repos]
  )

  // Everything else goes in the full grid (demo repos still appear there too)
  const otherRepos = useMemo(
    () => repos.filter((r) => !r.homepage),
    [repos]
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Header />
      {error ? (
        <p className="text-red-400 text-sm text-center py-8">
          Failed to load repos: {error}
        </p>
      ) : (
        <>
          {(loading || featuredRepos.length > 0) && (
            <FeaturedSection repos={featuredRepos} loading={loading} />
          )}
          <RepoGrid repos={otherRepos} loading={loading} />
        </>
      )}
    </div>
  )
}
```

**Step 2: Run dev server and visually verify**

```bash
bun run dev
```

Expected: Dark page with header, featured section (6 skeleton cards fading to real cards), and all-repos grid with working search/filter/sort.

**Step 3: Run tests**

```bash
bun run test
```

Expected: All tests PASS.

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire up App with featured and full repo grid"
```

---

### Task 14: Create the GitHub Actions deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Run tests
        run: bun run test

      - name: Build
        run: bun run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: Commit**

```bash
git add .github/
git commit -m "feat: add github actions deployment workflow"
```

---

### Task 15: Create the GitHub repo and push

**Step 1: Create the remote repo via gh CLI**

```bash
gh repo create cwbudde.github.io --public --description "Personal GitHub Pages portfolio"
```

**Step 2: Add remote and push**

```bash
git remote add origin https://github.com/CWBudde/cwbudde.github.io.git
git push -u origin main
```

**Step 3: Enable GitHub Pages in repo settings**

```bash
gh api repos/CWBudde/cwbudde.github.io/pages \
  --method POST \
  --field source='{"branch":"gh-pages","path":"/"}' 2>/dev/null || true

# The deploy workflow uses Actions/Pages directly, so enable via:
gh api repos/CWBudde/cwbudde.github.io \
  --method PATCH \
  --field has_pages=true
```

Then in the GitHub UI: **Settings → Pages → Source → GitHub Actions** (this is required for the `deploy-pages` action to work).

**Step 4: Verify the Actions workflow runs**

```bash
gh run list --repo CWBudde/cwbudde.github.io
```

Expected: A workflow run in progress or completed. After it completes, `https://cwbudde.github.io` is live.

---

### Task 16: Final verification

**Step 1: Check live site**

Open `https://cwbudde.github.io` in a browser.

Expected:
- Dark background
- Header with "CWBudde" and GitHub link
- 6 featured repo cards
- Full repo grid below with working search, language filter, and sort

**Step 2: Test filtering**

- Type "dw" in search → should show DWScript, DWScriptExpert, etc.
- Select "Go" in language filter → should show ~3 repos
- Select "Name" sort → repos in alphabetical order

**Step 3: Done!**
