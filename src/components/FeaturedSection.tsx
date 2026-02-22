import type { Repo } from '@/types'

import { RepoCard } from '@/components/RepoCard'
import { SkeletonCard } from '@/components/SkeletonCard'

interface FeaturedSectionProps {
  repos: Repo[]
  isLoading: boolean
}

export function FeaturedSection({ repos, isLoading }: FeaturedSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">Live Demos</p>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Recent repositories with live demos
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, idx) => (
            <SkeletonCard key={`featured-skeleton-${idx}`} />
          ))}
        </div>
      ) : repos.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 text-sm text-zinc-400">
          No recent repositories with live demos found (last 6 months).
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
