# cwbudde.github.io — Portfolio Site Design

**Date:** 2026-02-21

## Goal

A personal GitHub Pages site at `cwbudde.github.io` that catalogs public GitHub repositories as a portfolio. The user has a separate personal website; this page serves as a developer-facing project index.

## Stack

- **Runtime:** React 19 + Vite 6, bundled with Bun
- **Styling:** Tailwind CSS + shadcn/ui (Card, Badge, Button)
- **Theme:** Dark / developer aesthetic
- **Deployment:** GitHub Actions → GitHub Pages (root repo `cwbudde.github.io`)

## Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Header: "CWBudde" · tagline · GitHub link icon     │
├─────────────────────────────────────────────────────┤
│  ★ FEATURED (3-6 pinned repos, larger cards)        │
│  [Card] [Card] [Card]                               │
├─────────────────────────────────────────────────────┤
│  All Repos  [Search ____] [Lang ▼] [Sort ▼]         │
│  Grid of repo cards (2-3 cols on desktop)           │
│  [Card] [Card] [Card]                               │
│  [Card] [Card] [Card]                               │
└─────────────────────────────────────────────────────┘
```

### Repo Card contents
- Repository name (links to GitHub repo)
- Description
- Language badge (colored per language)
- Star count (⭐)

### Featured section
Featured repos are hardcoded in `src/featured.ts` as a list of repo names. They appear in a larger-card spotlight row above the full list.

## Data Flow

1. On mount: `GET https://api.github.com/users/CWBudde/repos?per_page=100&sort=stars`
2. Show skeleton loading cards during fetch
3. Separate featured repos from full list by matching against `src/featured.ts`
4. Search, language filter, and sort run client-side — no additional API calls
5. Rate limit: GitHub unauthenticated API allows 60 req/hour per IP, sufficient for a portfolio

## Filtering & Sorting

- **Search:** filter by name/description substring
- **Language filter:** dropdown populated dynamically from fetched repos
- **Sort:** stars (default), name A–Z, recently updated

## Deployment

GitHub Actions workflow at `.github/workflows/deploy.yml`:
1. Trigger: push to `main`
2. Steps: `bun install` → `bun run build` → deploy `dist/` to GitHub Pages
3. `vite.config.ts` sets `base: "/"` (root pages repo, not a subpath)

## Out of Scope

- No server-side rendering
- No authentication / GitHub token (public repos only, unauthenticated API)
- No blog or non-repo content
- No analytics
