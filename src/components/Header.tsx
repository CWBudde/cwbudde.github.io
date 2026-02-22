import { Github } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 md:p-8">
      <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-36 w-36 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">Portfolio</p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50 md:text-5xl">Christian-W. Budde</h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-300 md:text-base">
            Public projects, experiments, and deployable demos from GitHub.
          </p>
        </div>

        <Button asChild variant="outline" className="w-fit border-zinc-700 bg-zinc-900/70 text-zinc-100 hover:bg-zinc-800">
          <a href="https://github.com/CWBudde" target="_blank" rel="noreferrer">
            <Github className="size-4" />
            GitHub Profile
          </a>
        </Button>
      </div>
    </header>
  )
}
