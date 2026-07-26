import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useTranslation } from '@/i18n/useTranslation'
import { buildActivitySeries } from '@/lib/activity'
import { useTheme } from '@/theme/useTheme'
import type { Repo } from '@/types'

interface ActivityChartProps {
  repos: Repo[]
  isLoading: boolean
}

const HORIZONTAL_PADDING = 14
const VERTICAL_INSET = 20
/** Minimum gap between year labels so thin years do not stack their text. */
const MIN_LABEL_GAP = 22

function readColors(element: HTMLElement) {
  const styles = getComputedStyle(element)
  const read = (name: string) => styles.getPropertyValue(name).trim()

  return {
    trace: read('--chart-trace'),
    traceMuted: read('--chart-trace-muted'),
    cursor: read('--chart-cursor'),
    grid: read('--chart-grid'),
    axis: read('--chart-axis'),
  }
}

export function ActivityChart({ repos, isLoading }: ActivityChartProps) {
  const { t, formatNumber } = useTranslation()
  const { resolved } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const series = useMemo(() => buildActivitySeries(repos), [repos])
  const { points, markers, usesCreationDates } = series

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || points.length === 0) {
      return
    }

    const { width, height } = canvas.getBoundingClientRect()
    if (width === 0 || height === 0) {
      return
    }

    const ratio = window.devicePixelRatio || 1
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, width, height)

    const colors = readColors(canvas)
    const slotWidth = (width - HORIZONTAL_PADDING * 2) / points.length
    const middle = height / 2
    const half = height / 2 - VERTICAL_INSET

    // Year gridlines: the Pascal-to-Go shift is only legible with them.
    context.font = '10px "IBM Plex Mono", monospace'
    context.textBaseline = 'top'
    let lastLabelX = Number.NEGATIVE_INFINITY

    markers.forEach((marker) => {
      const x = HORIZONTAL_PADDING + marker.index * slotWidth
      context.strokeStyle = colors.grid
      context.lineWidth = 1
      context.beginPath()
      context.moveTo(x, 8)
      context.lineTo(x, height - 8)
      context.stroke()

      if (x - lastLabelX < MIN_LABEL_GAP) {
        return
      }
      lastLabelX = x
      context.fillStyle = colors.axis
      context.fillText(String(marker.year).slice(2), x + 4, height - 17)
    })

    context.strokeStyle = colors.grid
    context.beginPath()
    context.moveTo(0, middle)
    context.lineTo(width, middle)
    context.stroke()

    points.forEach((point, index) => {
      const x = HORIZONTAL_PADDING + index * slotWidth
      const amplitude = Math.max(1.5, point.amplitude * half)
      const isActive = index === activeIndex

      context.strokeStyle = isActive
        ? colors.cursor
        : point.repo.fork
          ? colors.traceMuted
          : colors.trace
      context.lineWidth = Math.max(1, Math.min(2.4, slotWidth * 0.62))
      context.beginPath()
      context.moveTo(x, middle - amplitude)
      context.lineTo(x, middle + amplitude)
      context.stroke()

      if (isActive) {
        context.strokeStyle = colors.cursor
        context.lineWidth = 1
        context.globalAlpha = 0.4
        context.beginPath()
        context.moveTo(x, 6)
        context.lineTo(x, height - 6)
        context.stroke()
        context.globalAlpha = 1
      }
    })
  }, [points, markers, activeIndex])

  // Redraw on data, cursor, theme and size changes. Theme matters because the
  // canvas samples its colours from CSS custom properties.
  useEffect(() => {
    draw()
  }, [draw, resolved])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const observer = new ResizeObserver(() => draw())
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [draw])

  const measureAt = useCallback(
    (clientX: number) => {
      const canvas = canvasRef.current
      if (!canvas || points.length === 0) {
        return
      }

      const rect = canvas.getBoundingClientRect()
      const slotWidth = (rect.width - HORIZONTAL_PADDING * 2) / points.length
      const index = Math.round((clientX - rect.left - HORIZONTAL_PADDING) / slotWidth)

      setActiveIndex(Math.max(0, Math.min(points.length - 1, index)))
    },
    [points.length],
  )

  const onKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (points.length === 0) {
      return
    }

    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (step === 0) {
      return
    }

    event.preventDefault()
    setActiveIndex((current) => {
      const next = (current ?? 0) + step
      return Math.max(0, Math.min(points.length - 1, next))
    })
  }

  const active = activeIndex !== null ? points[activeIndex] : null

  return (
    <section className="space-y-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand">{t.activity.eyebrow}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t.activity.title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.activity.description}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-border px-4 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-chart-trace">
            {t.activity.axisY}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {usesCreationDates ? t.activity.axisX : t.activity.axisXFallback}
          </span>
        </div>

        {isLoading || points.length === 0 ? (
          <div className="h-[200px] animate-pulse bg-muted/40" aria-hidden="true" />
        ) : (
          <canvas
            ref={canvasRef}
            tabIndex={0}
            role="img"
            aria-label={t.activity.canvasLabel}
            onMouseMove={(event) => measureAt(event.clientX)}
            onMouseLeave={() => setActiveIndex(null)}
            onTouchMove={(event) => measureAt(event.touches[0].clientX)}
            onKeyDown={onKeyDown}
            className="block h-[200px] w-full cursor-crosshair touch-pan-y focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring sm:h-[230px]"
          />
        )}

        <div
          aria-live="polite"
          className="grid grid-cols-2 items-baseline gap-x-5 gap-y-1 border-t border-border bg-brand-soft px-4 py-2.5 text-sm sm:grid-cols-[1fr_auto_auto_auto]"
        >
          {active ? (
            <>
              <a
                href={active.repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="col-span-2 truncate font-semibold text-brand hover:underline sm:col-span-1"
              >
                {active.repo.name}
                {active.repo.fork ? (
                  <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                    {t.activity.fork}
                  </span>
                ) : null}
              </a>
              <Readout label={t.activity.stars} value={formatNumber(active.repo.stargazers_count)} />
              <Readout label={t.activity.language} value={active.repo.language ?? '—'} />
              <Readout
                label={usesCreationDates ? t.activity.created : t.activity.updated}
                value={String(active.year)}
              />
            </>
          ) : (
            <span className="col-span-2 text-muted-foreground sm:col-span-4">{t.activity.hint}</span>
          )}
        </div>
      </div>
    </section>
  )
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <span className="whitespace-nowrap">
      <span className="mr-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="font-mono tabular-nums text-foreground">{value}</span>
    </span>
  )
}
