import { ActivityChart } from '@/components/ActivityChart'
import { FeaturedSection } from '@/components/FeaturedSection'
import { Header } from '@/components/Header'
import { RepoGrid } from '@/components/RepoGrid'
import { StatsBar } from '@/components/StatsBar'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n/useTranslation'
import { useGitHubRepos } from '@/hooks/useGitHubRepos'
import { sortRepos } from '@/lib/filter'
import { getLiveDemoUrl } from '@/lib/liveDemo'

function isLiveDemoRepo(repo: Parameters<typeof getLiveDemoUrl>[0]) {
  return !repo.fork && getLiveDemoUrl(repo) !== null
}

export default function App() {
  const { repos, isLoading, error, refetch } = useGitHubRepos()
  const { t } = useTranslation()

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const recentLiveDemoRepos = sortRepos(
    repos.filter(
      (repo) =>
        isLiveDemoRepo(repo) && new Date(repo.updated_at).getTime() >= sixMonthsAgo.getTime(),
    ),
    'updated-desc',
  ).slice(0, 8)
  const regularRepos = repos.filter((repo) => !isLiveDemoRepo(repo))

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground md:px-6 md:py-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <Header />

        {error ? (
          <section className="rounded-xl border border-destructive/40 bg-destructive/10 p-5">
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={refetch} variant="destructive" className="mt-3">
              {t.errors.retry}
            </Button>
          </section>
        ) : null}

        <StatsBar repos={repos} isLoading={isLoading} />

        <FeaturedSection repos={recentLiveDemoRepos} isLoading={isLoading} />

        <ActivityChart repos={repos} isLoading={isLoading} />

        <RepoGrid repos={regularRepos} isLoading={isLoading} />

        {!isLoading && repos.length > 0 ? (
          <p className="text-center text-xs text-muted-foreground">{t.footer.note}</p>
        ) : null}
      </main>
    </div>
  )
}
