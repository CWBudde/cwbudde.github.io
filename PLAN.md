# cwbudde.github.io — Implementation Plan

Dark-themed React portfolio site that catalogs CWBudde's public GitHub repos.
Full design doc: `docs/plans/2026-02-21-portfolio-site-design.md`
Detailed step-by-step plan: `docs/plans/2026-02-21-portfolio-site.md`

---

## Stack

- **React 19 + Vite 6 + Bun** — build tooling
- **TypeScript** — strict types throughout
- **Tailwind CSS v4** — utility styling, dark theme
- **shadcn/ui** — Card, Badge, Button components (copied into source)
- **lucide-react** — icons
- **Vitest** — unit tests for filter/sort logic
- **GitHub Actions** — CI: test → build → deploy to Pages

---

## What Gets Built

### Page layout
```
┌─────────────────────────────────────────────────────┐
│  Header: "CWBudde" · tagline · GitHub icon link     │
├─────────────────────────────────────────────────────┤
│  ★ Featured  (repos with a homepage/demo URL set)   │
│  [Card] [Card] [Card]   ← larger cards, Live Demo   │
├─────────────────────────────────────────────────────┤
│  All Repos  [Search ____] [Lang ▼] [Sort ▼]         │
│  [Card] [Card] [Card]                               │
│  [Card] [Card] [Card]   ← 2–3 col responsive grid   │
└─────────────────────────────────────────────────────┘
```

### Data
- Fetched live from `https://api.github.com/users/CWBudde/repos?per_page=100&sort=stars`
- **Featured section** = repos that have a `homepage` URL set on GitHub (= web demos)
- **All Repos section** = everything else, filterable by search / language / sort

### Repo card
- Name (links to GitHub repo)
- Description (truncated to 2 lines)
- Language badge (color-coded per language)
- ⭐ star count
- "Live Demo" link (only when `homepage` is set)

---

## Tasks

### Setup (sequential)
- [ ] **Task 1** — Scaffold: `bun create vite . --template react-ts` + `bun install`
- [ ] **Task 2** — Vite config: set `base: '/'`, add `@` path alias
- [ ] **Task 3** — Tailwind CSS v4: `bun add -d tailwindcss @tailwindcss/vite`, dark body styles
- [ ] **Task 4** — shadcn/ui: `bunx shadcn@latest init` (Zinc/Default/CSS vars) + add card, badge, button

### Core logic
- [ ] **Task 5** — `src/types.ts` (Repo interface) + `src/lib/filter.ts` (filterRepos, sortRepos) + Vitest tests
- [ ] **Task 6** — `src/hooks/useGitHubRepos.ts` — fetch with cancellation, loading/error state

### GitHub config
- [ ] **Task 7** — Ensure repos with demos have `homepage` set on GitHub:
  ```bash
  gh repo edit CWBudde/<repo> --homepage "https://cwbudde.github.io/<repo>/"
  ```

### Components (can be done in parallel)
- [ ] **Task 8** — `src/components/RepoCard.tsx` — card with language badge, stars, optional Live Demo link
- [ ] **Task 9** — `src/components/SkeletonCard.tsx` — animated loading placeholder
- [ ] **Task 10** — `src/components/FeaturedSection.tsx` — spotlight grid with skeleton fallback
- [ ] **Task 11** — `src/components/RepoGrid.tsx` — full grid with search, language filter, sort
- [ ] **Task 12** — `src/components/Header.tsx` — name, tagline, GitHub icon link

### Wiring
- [ ] **Task 13** — `src/App.tsx` — wire useGitHubRepos → split featured/other → render sections

### Deployment
- [ ] **Task 14** — `.github/workflows/deploy.yml` — bun install → test → build → deploy-pages
- [ ] **Task 15** — Create `cwbudde.github.io` repo on GitHub, push, enable Pages (source: GitHub Actions)

---

## Key Files

```
cwbudde.github.io/
├── .github/workflows/deploy.yml
├── src/
│   ├── types.ts                  # Repo interface (incl. homepage field)
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                 # Tailwind + dark theme base
│   ├── hooks/
│   │   └── useGitHubRepos.ts
│   ├── lib/
│   │   ├── filter.ts             # filterRepos, sortRepos
│   │   └── filter.test.ts        # Vitest tests
│   └── components/
│       ├── ui/                   # shadcn copies (card, badge, button)
│       ├── Header.tsx
│       ├── RepoCard.tsx
│       ├── SkeletonCard.tsx
│       ├── FeaturedSection.tsx
│       └── RepoGrid.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Deployment Notes

- Repo must be named exactly `cwbudde.github.io` (GitHub requirement for root Pages)
- In repo Settings → Pages → Source: set to **GitHub Actions**
- The `deploy.yml` workflow runs tests before every deploy — a failing test blocks deployment
- `vite.config.ts` uses `base: '/'` (not a subpath like `/algo-dsp/`)
- Featured section is automatic: just set the `homepage` field on any repo in GitHub Settings

---

## Featured Repos (seed list — set homepage on each)

These are good candidates to set a demo homepage on:

| Repo | Suggested homepage |
|------|--------------------|
| algo-dsp | https://cwbudde.github.io/algo-dsp/ |
| Pascal-HTML5-Canvas | https://cwbudde.github.io/Pascal-HTML5-Canvas/ |
| Cards | https://cwbudde.github.io/Cards/ |
| WebSofa | https://cwbudde.github.io/WebSofa/ |

Any repo with a Pages deployment can be added — just set its homepage URL on GitHub.
