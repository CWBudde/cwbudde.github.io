# Christian-W. Budde's Portfolio

A responsive portfolio for exploring [CWBudde's public GitHub
repositories](https://github.com/CWBudde). Repository data is loaded directly
from the GitHub API, so project details stay current without requiring a
separate backend.

**Live site:** [cwbudde.github.io](https://cwbudde.github.io)

## Features

- Highlights up to eight recently updated repositories with live demos
- Searches repositories by name and description
- Filters by programming language
- Sorts by stars, update date, or name
- Links directly to source repositories and available demos
- Uses the first useful README paragraph when a repository has no description
- Caches repository data in the browser for 24 hours to reduce GitHub API usage
- Provides loading, empty, error, and retry states

## Tech Stack

- [React 19](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) and [Bun](https://bun.sh/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) components
- [Lucide](https://lucide.dev/) icons
- [Vitest](https://vitest.dev/)
- [GitHub Actions](https://github.com/features/actions) and GitHub Pages

## Local Development

### Prerequisites

- [Bun](https://bun.sh/) installed

### Setup

```bash
git clone https://github.com/MeKo-Christian/cwbudde.github.io.git
cd cwbudde.github.io
bun install
bun run dev
```

Vite prints the local development URL, typically
[`http://localhost:5173`](http://localhost:5173).

No environment variables or GitHub token are required. The application uses
GitHub's public, unauthenticated API, so its requests are subject to GitHub's
anonymous rate limits.

## Available Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the Vite development server |
| `bun run build` | Type-check and create a production build in `dist/` |
| `bun run preview` | Preview the production build locally |
| `bun run test` | Run the unit test suite once |
| `bun run test:watch` | Run tests in watch mode |
| `bun run lint` | Check the codebase with ESLint |

## How It Works

The `useGitHubRepos` hook requests up to 100 public repositories from the
GitHub REST API. Successful responses are stored in `localStorage` for 24
hours. Repositories with GitHub Pages enabled or a homepage URL are treated as
live demos; demos updated within the last six months appear in the featured
section.

Repositories without a GitHub description trigger a second request for their
README. The first meaningful paragraph is extracted and displayed as a
fallback. Search, language filtering, and sorting all run in the browser.

## Project Structure

```text
src/
|-- components/          Page sections, repository cards, and UI primitives
|-- hooks/               GitHub data fetching and browser cache
|-- lib/                 Filtering, sorting, and README summary utilities
|-- App.tsx              Page composition and featured-demo selection
|-- index.css            Tailwind setup, theme tokens, and global styles
`-- types.ts             Shared repository and sorting types
```

## Testing and Production Builds

Before submitting changes, run:

```bash
bun run lint
bun run test
bun run build
```

Unit tests cover repository filtering, sorting, and README summary extraction.

## Deployment

Pushes to `main` trigger
[the deployment workflow](.github/workflows/deploy.yml), which installs locked
dependencies, runs the tests, builds the app, and publishes `dist/` to GitHub
Pages. The workflow can also be started manually from the Actions tab.
