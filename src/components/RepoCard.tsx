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
import { useTranslation } from '@/i18n/useTranslation'
import { getLiveDemoUrl } from '@/lib/liveDemo'
import { normalizeRepoDescription } from '@/lib/readmeSummary'
import type { Repo } from '@/types'

interface RepoCardProps {
  repo: Repo
  featured?: boolean
}

/** Each entry carries a light pair and a dark pair; the tints differ too much between themes to share one value. */
const languageColor: Record<string, string> = {
  TypeScript:
    'bg-sky-500/10 text-sky-700 border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-400/30',
  JavaScript:
    'bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/30',
  Go: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/30 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-400/30',
  Rust: 'bg-orange-500/10 text-orange-700 border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-400/30',
  Python:
    'bg-lime-600/10 text-lime-700 border-lime-600/30 dark:bg-lime-500/15 dark:text-lime-300 dark:border-lime-400/30',
}

const NEUTRAL_LANGUAGE =
  'bg-muted text-muted-foreground border-border dark:bg-zinc-500/10 dark:text-zinc-300 dark:border-zinc-400/20'

const OTHER_LANGUAGE =
  'bg-violet-500/10 text-violet-700 border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-400/30'

function getLanguageClass(language: string | null): string {
  if (!language) {
    return NEUTRAL_LANGUAGE
  }

  return languageColor[language] ?? OTHER_LANGUAGE
}

export function RepoCard({ repo, featured = false }: RepoCardProps) {
  const { t, formatNumber } = useTranslation()
  const liveDemoUrl = getLiveDemoUrl(repo)
  const hasDemo = Boolean(liveDemoUrl)
  const repoDescription = normalizeRepoDescription(repo.description)
  const readmeFallback = normalizeRepoDescription(repo.readme_summary ?? null)
  const description = repoDescription || readmeFallback
  const usesReadmeFallback = !repoDescription && Boolean(readmeFallback)

  return (
    <Card
      className={[
        // min-w-0 stops a long unbreakable name or description from pushing the
        // card past its grid track and scrolling the whole page sideways.
        'h-full min-w-0 border-border bg-card transition hover:border-ring/60 hover:shadow-md',
        featured ? 'ring-1 ring-brand/30' : '',
      ].join(' ')}
    >
      <CardHeader>
        {/*
          CardHeader is a grid, so its children need min-w-0 to shrink; without
          it an unbreakable name like CosineBasedPaletteGenerator sets the card's
          min-content width and scrolls the whole page sideways on mobile.
        */}
        <div className="flex min-w-0 items-start justify-between gap-3">
          <CardTitle className="min-w-0 text-lg tracking-tight">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-w-0 items-start gap-1 hover:text-brand"
            >
              <span className="min-w-0 [overflow-wrap:anywhere]">{repo.name}</span>
              <ArrowUpRight className="mt-1 size-4 shrink-0" aria-hidden="true" />
            </a>
          </CardTitle>
          <div className="inline-flex shrink-0 items-center gap-2">
            <Badge variant="outline" className={getLanguageClass(repo.language)}>
              {repo.language ?? t.unknownLanguage}
            </Badge>
            <div className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="size-4 text-amber-500 dark:text-amber-300" aria-hidden="true" />
              {formatNumber(repo.stargazers_count)}
            </div>
            {repo.fork ? (
              <span className="text-sm" title={t.card.fork} aria-label={t.card.fork}>
                🍴
              </span>
            ) : null}
          </div>
        </div>
        <CardDescription className="min-h-10 min-w-0 [overflow-wrap:anywhere] text-muted-foreground">
          {description ? (
            usesReadmeFallback ? (
              <div className="line-clamp-2">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <span>{children}</span>,
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ children }) => (
                      <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">
                        {children}
                      </code>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand underline decoration-brand/60 underline-offset-2"
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
            t.card.noDescription
          )}
        </CardDescription>
      </CardHeader>

      <CardFooter className="mt-auto justify-end gap-2">
        {hasDemo ? (
          <Button asChild size="sm">
            <a href={liveDemoUrl ?? undefined} target="_blank" rel="noreferrer">
              {t.card.liveDemo}
            </a>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}
