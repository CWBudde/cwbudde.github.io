# CWBudde projects

The source for [cwbudde.github.io](https://cwbudde.github.io/), a searchable
portfolio of CWBudde's public GitHub repositories and live demos.

The site fetches repository metadata from GitHub's public API, highlights
recent verified demos, and lets visitors filter the remaining repositories by
name and language.

## Development

Requirements: [Bun](https://bun.sh/) and a current browser.

```bash
bun install
bun run dev
```

Useful checks:

```bash
bun run test
bun run lint
bun run build
```

## Live demo links

An explicit GitHub repository homepage is used when one is available. GitHub
Pages fallbacks are maintained in `src/lib/liveDemo.ts` and only included after
their public URL has been verified. This avoids presenting a broken link when
GitHub's `has_pages` metadata remains true after an unavailable deployment.

## Deployment

Pushes to `main` run `.github/workflows/deploy.yml`, which tests and builds the
site before publishing the `dist` artifact with GitHub Pages.
