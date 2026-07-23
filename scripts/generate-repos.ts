import { extractReadmeFirstParagraph, normalizeRepoDescription } from '../src/lib/readmeSummary'
import type { Repo } from '../src/types'

const API_BASE_URL = 'https://api.github.com'
const REPOSITORY_OWNER = 'CWBudde'
const OUTPUT_PATH = new URL('../public/repos.json', import.meta.url)
const README_CONCURRENCY = 6

const token = process.env.GITHUB_TOKEN

if (!token) {
  throw new Error('GITHUB_TOKEN is required to generate the repository catalog')
}

const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'User-Agent': 'cwbudde-portfolio-catalog-generator',
  'X-GitHub-Api-Version': '2022-11-28',
}

async function request(path: string, accept = headers.Accept): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { ...headers, Accept: accept },
  })

  if (!response.ok && response.status !== 404) {
    const remaining = response.headers.get('x-ratelimit-remaining')
    throw new Error(
      `GitHub request failed (${response.status}) for ${path}; rate limit remaining: ${remaining ?? 'unknown'}`,
    )
  }

  return response
}

async function fetchRepositories(): Promise<Repo[]> {
  const repos: Repo[] = []

  for (let page = 1; ; page += 1) {
    const response = await request(
      `/users/${REPOSITORY_OWNER}/repos?per_page=100&sort=updated&page=${page}`,
    )
    const pageRepos = (await response.json()) as Repo[]
    repos.push(...pageRepos)

    if (pageRepos.length < 100) {
      return repos
    }
  }
}

async function fetchReadmeSummary(fullName: string): Promise<string | null> {
  const path = `/repos/${fullName}/readme`
  const response = await request(path, 'application/vnd.github.raw+json')

  if (response.status === 404) {
    return null
  }

  return extractReadmeFirstParagraph(await response.text())
}

async function buildCatalog(repos: Repo[]) {
  const catalog = new Array<Repo>(repos.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < repos.length) {
      const index = nextIndex
      nextIndex += 1
      const repo = repos[index]
      const description = normalizeRepoDescription(repo.description)

      catalog[index] = {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        homepage: repo.homepage,
        has_pages: repo.has_pages,
        updated_at: repo.updated_at,
        fork: repo.fork,
        readme_summary: description
          ? null
          : await fetchReadmeSummary(repo.full_name),
      }
    }
  }

  await Promise.all(
    Array.from({ length: README_CONCURRENCY }, () => worker()),
  )

  return catalog
}

const repositories = await fetchRepositories()
const catalog = await buildCatalog(repositories)

await Bun.write(OUTPUT_PATH, `${JSON.stringify(catalog, null, 2)}\n`)
console.log(`Generated ${catalog.length} repositories in public/repos.json`)
