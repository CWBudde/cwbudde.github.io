import { FeaturedSection } from '@/components/FeaturedSection'
import { Header } from '@/components/Header'
import { RepoGrid } from '@/components/RepoGrid'
import { Button } from '@/components/ui/button'
import { useGitHubRepos } from '@/hooks/useGitHubRepos'
import { sortRepos } from '@/lib/filter'

function isLiveDemoRepo(repo: { homepage: string | null; has_pages: boolean; fork: boolean }) {
  return !repo.fork && (repo.has_pages || Boolean(repo.homepage && repo.homepage.trim()))
}

export default function App() {
  const { repos, isLoading, error, refetch } = useGitHubRepos()

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const recentLiveDemoRepos = sortRepos(
    repos.filter(
      (repo) => isLiveDemoRepo(repo) && new Date(repo.updated_at).getTime() >= sixMonthsAgo.getTime(),
    ),
    'updated-desc',
  ).slice(0, 8)
  const regularRepos = repos.filter((repo) => !isLiveDemoRepo(repo))

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(14,116,144,0.18),transparent_35%),#09090b] px-4 py-8 text-zinc-100 md:px-6 md:py-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <Header />

        {error ? (
          <section className="rounded-xl border border-red-800/60 bg-red-950/40 p-5">
            <p className="text-sm text-red-200">{error}</p>
            <Button onClick={refetch} className="mt-3 bg-red-300 text-red-950 hover:bg-red-200">
              Retry Fetch
            </Button>
          </section>
        ) : null}

        <FeaturedSection repos={recentLiveDemoRepos} isLoading={isLoading} />
        <RepoGrid repos={regularRepos} isLoading={isLoading} />

        {!isLoading && repos.length > 0 ? (
          <p className="text-center text-xs text-zinc-500">
            Live Demo links are shown for repositories with GitHub Pages enabled (or a homepage URL).
          </p>
        ) : null}
      </main>
    </div>
  )
}
