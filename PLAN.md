# cwbudde.github.io — Implementation Plan

Dark-themed React portfolio site that catalogs CWBudde's public GitHub repos.
Full design doc: `docs/plans/2026-02-21-portfolio-site-design.md`
Detailed step-by-step plan: `docs/plans/2026-02-21-portfolio-site.md`

---

## Stack

- **React 19 + Vite + Bun** — build tooling
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
│  ★ Featured  (repos listed in src/featured.ts)      │
│  [Card] [Card] [Card]   ← larger cards, Live Demo   │
├─────────────────────────────────────────────────────┤
│  All Repos  [Search ____] [Lang ▼] [Sort ▼]         │
│  [Card] [Card] [Card]                               │
│  [Card] [Card] [Card]   ← 2–3 col responsive grid   │
└─────────────────────────────────────────────────────┘
```

### Data
- Fetched live from `https://api.github.com/users/CWBudde/repos?per_page=100&sort=stars`
- **Featured section** = repos listed by name in `src/featured.ts`
- **All Repos section** = everything else, filterable by search / language / sort

### Repo card
- Name (links to GitHub repo)
- Description (truncated to 2 lines)
- Language badge (color-coded per language)
- ⭐ star count
- "Live Demo" link (only when `homepage` is set)

---

## Tasks

### Current status (as of 2026-07-11)
- Completed: 15 / 15 tasks
- Remaining: 0 / 15 tasks

### Setup
- [x] **Task 1** — Scaffold: `bun create vite . --template react-ts` + `bun install`
- [x] **Task 2** — Vite config: set `base: '/'`, add `@` path alias
- [x] **Task 3** — Tailwind CSS v4: `bun add -d tailwindcss @tailwindcss/vite`, dark body styles
- [x] **Task 4** — shadcn/ui: init + add card, badge, button

### Core logic
- [x] **Task 5** — `src/types.ts` + `src/featured.ts` + `src/lib/filter.ts` + Vitest tests
- [x] **Task 6** — `src/hooks/useGitHubRepos.ts` with cancellation, loading/error state

### GitHub config
- [x] **Task 7** — Provide verified homepage URLs for repositories with live demos
  - Explicit repository homepages remain authoritative.
  - Verified GitHub Pages fallbacks live in `src/lib/liveDemo.ts`.
  - Repositories whose Pages metadata is stale do not get broken demo links.

### Components
- [x] **Task 8** — `src/components/RepoCard.tsx`
- [x] **Task 9** — `src/components/SkeletonCard.tsx`
- [x] **Task 10** — `src/components/FeaturedSection.tsx`
- [x] **Task 11** — `src/components/RepoGrid.tsx`
- [x] **Task 12** — `src/components/Header.tsx`

### Wiring
- [x] **Task 13** — `src/App.tsx` wired to hook + featured split + sections

### Deployment
- [x] **Task 14** — `.github/workflows/deploy.yml` added (test → build → deploy-pages)
- [x] **Task 15** — Create/push/enable Pages for `cwbudde.github.io`
  - Verified live at `https://cwbudde.github.io/` on 2026-07-11.

---

## Recent Changes Noted (2026-02-22)

- Featured logic now follows `src/featured.ts` (hardcoded featured repo names).
- Added filtering/sorting utility + tests.
- Added `useGitHubRepos` fetch hook with abort handling and retry path.
- Added all planned page components and complete App wiring.
- Added Vitest config in `vite.config.ts` and test scripts in `package.json`.
- Added GitHub Pages deploy workflow.
- Verified locally:
  - `bun run test` passed (6 tests)
  - `bun run build` passed

## Completion Update (2026-07-11)

- Verified all non-fork repositories advertising GitHub Pages.
- Added a tested live-demo URL resolver, including the special root URL for
  `cwbudde.github.io`.
- Excluded stale Pages metadata that currently resolves to a 404.
- Added the standard `actions/configure-pages` deployment step.
- Replaced the Vite scaffold README and page title with project-specific copy.

---

## Key Files

```
cwbudde.github.io/
├── .github/workflows/deploy.yml
├── src/
│   ├── types.ts
│   ├── featured.ts
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── hooks/
│   │   └── useGitHubRepos.ts
│   ├── lib/
│   │   ├── filter.ts
│   │   ├── filter.test.ts
│   │   └── utils.ts
│   └── components/
│       ├── ui/
│       │   ├── card.tsx
│       │   ├── badge.tsx
│       │   └── button.tsx
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

## Maintenance

When a new demo is deployed, verify its public URL and add the repository name
to `VERIFIED_PAGES_REPOS` in `src/lib/liveDemo.ts`. Prefer setting an explicit
repository homepage when the demo uses a custom or external URL.
