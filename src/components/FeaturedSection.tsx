import type { Repo } from '@/types'

import { RepoCard } from '@/components/RepoCard'
import { SkeletonCard } from '@/components/SkeletonCard'
import { useTranslation } from '@/i18n/useTranslation'

interface FeaturedSectionProps {
  repos: Repo[]
  isLoading: boolean
}

export function FeaturedSection({ repos, isLoading }: FeaturedSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="space-y-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand">
          {t.featured.eyebrow}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t.featured.title}</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, idx) => (
            <SkeletonCard key={`featured-skeleton-${idx}`} />
          ))}
        </div>
      ) : repos.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          {t.featured.empty}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} featured />
          ))}
        </div>
      )}
    </section>
  )
}
