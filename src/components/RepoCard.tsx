import { useEffect, useState } from 'react'
import { ArrowUpRight, Star } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { fetchReadmeSummary } from '@/lib/readmeSummary'
import type { Repo } from '@/types'

interface RepoCardProps {
  repo: Repo
  featured?: boolean
}

function getLiveDemoUrl(repo: Repo): string | null {
  if (repo.homepage && repo.homepage.trim().length > 0) {
    return repo.homepage
  }

  if (repo.has_pages) {
    return `https://cwbudde.github.io/${repo.name}/`
  }

  return null
}

const languageColor: Record<string, string> = {
  TypeScript: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
  JavaScript: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  Go: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30',
  Rust: 'bg-orange-500/15 text-orange-300 border-orange-400/30',
  Python: 'bg-lime-500/15 text-lime-300 border-lime-400/30',
}

function getLanguageClass(language: string | null): string {
  if (!language) {
    return 'bg-zinc-500/10 text-zinc-300 border-zinc-400/20'
  }

  return languageColor[language] ?? 'bg-violet-500/15 text-violet-300 border-violet-400/30'
}

export function RepoCard({ repo, featured = false }: RepoCardProps) {
  const liveDemoUrl = getLiveDemoUrl(repo)
  const hasDemo = Boolean(liveDemoUrl)
  const [description, setDescription] = useState(repo.description)
  const [usesReadmeFallback, setUsesReadmeFallback] = useState(false)
  const [isReadmeFallbackLoading, setIsReadmeFallbackLoading] = useState(false)

  useEffect(() => {
    setDescription(repo.description)
    setUsesReadmeFallback(false)
    setIsReadmeFallbackLoading(false)

    if (repo.description && repo.description.trim().length > 0) {
      return
    }

    const controller = new AbortController()
    let isActive = true
    setIsReadmeFallbackLoading(true)

    void fetchReadmeSummary(repo.full_name, controller.signal).then((summary) => {
      if (!isActive) {
        return
      }

      if (summary && summary.trim().length > 0) {
        setDescription(summary)
        setUsesReadmeFallback(true)
      }
      setIsReadmeFallbackLoading(false)
    })

    return () => {
      isActive = false
      controller.abort()
    }
  }, [repo.description, repo.full_name])

  return (
    <Card
      className={[
        'h-full border-zinc-800/80 bg-zinc-950/60 backdrop-blur transition hover:border-zinc-600/80 hover:shadow-lg hover:shadow-black/20',
        featured ? 'ring-1 ring-emerald-400/25' : '',
      ].join(' ')}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg tracking-tight">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-emerald-300"
            >
              {repo.name}
              <ArrowUpRight className="size-4" />
            </a>
          </CardTitle>
          <div className="inline-flex shrink-0 items-center gap-2">
            <Badge variant="outline" className={getLanguageClass(repo.language)}>
              {repo.language ?? 'Unknown'}
            </Badge>
            <div className="inline-flex items-center gap-1 text-sm text-zinc-300">
              <Star className="size-4 text-amber-300" />
              {repo.stargazers_count}
            </div>
            {repo.fork ? (
              <span
                className="text-sm text-zinc-300"
                title="Forked repository"
                aria-label="Forked repository"
              >
                🍴
              </span>
            ) : null}
          </div>
        </div>
        <CardDescription className="min-h-10 text-zinc-400">
          {description ? (
            usesReadmeFallback ? (
              <div className="line-clamp-2">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <span>{children}</span>,
                    strong: ({ children }) => <strong className="font-semibold text-zinc-200">{children}</strong>,
                    em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
                    code: ({ children }) => (
                      <code className="rounded bg-zinc-800/80 px-1 py-0.5 text-xs text-zinc-200">{children}</code>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-300 underline decoration-emerald-600/70 underline-offset-2"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {description}
                </ReactMarkdown>
              </div>
            ) : (
              <span className="line-clamp-2">{description}</span>
            )
          ) : (
            (isReadmeFallbackLoading ? 'Loading README...' : 'No description provided.')
          )}
        </CardDescription>
      </CardHeader>

      <CardFooter className="mt-auto justify-end gap-2">
        {hasDemo ? (
          <Button asChild size="sm" className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400">
            <a href={liveDemoUrl ?? undefined} target="_blank" rel="noreferrer">
              Live Demo
            </a>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}
