import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function SkeletonCard() {
  return (
    <Card className="h-full border-zinc-800/80 bg-zinc-950/50">
      <CardHeader className="space-y-3">
        <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-700/60" />
        <div className="h-4 w-full animate-pulse rounded bg-zinc-800/70" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-800/70" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-5 w-24 animate-pulse rounded-full bg-zinc-700/60" />
      </CardContent>
    </Card>
  )
}
