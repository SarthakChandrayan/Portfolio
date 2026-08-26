import { PlayIcon, SyncIcon } from '@primer/octicons-react'
import { useMemo, useRef, useState } from 'react'
import {
  contributionPhrase,
  formatCount,
  lastYearDays,
  LEVEL_COLORS,
  GITHUB_GREEN,
  monthLabels,
  streaks,
  sumCounts,
  toWeeks,
  yearDays,
  type ContributionDay,
  type ContributionPayload,
} from '../lib/github'
import { HeatmapCanvas } from './HeatmapCanvas'
import { CountUp, useDesktopLayout } from './Motion'

type YearKey = 'last' | number

type Props = {
  data: ContributionPayload | null
  loading: boolean
  live: boolean
  error: string | null
  onRetry: () => void
}

export function ContributionGraph({
  data,
  loading,
  live,
  error,
  onRetry,
}: Props) {
  const years = useMemo(() => {
    if (!data) return []
    return Object.keys(data.total)
      .map(Number)
      .filter((y) => !Number.isNaN(y))
      .sort((a, b) => b - a)
  }, [data])

  const [year, setYear] = useState<YearKey>('last')
  const [selected, setSelected] = useState<ContributionDay | null>(null)
  const [replayKey, setReplayKey] = useState(0)
  const heatRef = useRef<HTMLDivElement>(null)
  const desktop = useDesktopLayout()
  const light = useRef({ raf: 0, x: 0, y: 0, el: null as HTMLElement | null })

  const days = useMemo(() => {
    if (!data) return []
    if (year === 'last') return lastYearDays(data.contributions)
    return yearDays(data.contributions, year)
  }, [data, year])

  const weeks = useMemo(() => toWeeks(days), [days])
  const labels = useMemo(() => monthLabels(weeks), [weeks])
  const cols = Math.max(weeks.length, 1)
  const total = sumCounts(days)
  const { current, longest } = streaks(days)
  const bestYear = years.reduce(
    (best, y) =>
      (data?.total[String(y)] ?? 0) > (data?.total[String(best)] ?? 0) ? y : best,
    years[0] ?? 0,
  )

  const heading =
    year === 'last' ? 'contributions in the last year' : `contributions in ${year}`

  const pickYear = (next: YearKey) => {
    setYear(next)
    setSelected(null)
  }

  return (
    <section
      className="light-up overflow-hidden rounded-3xl border border-border bg-canvas-overlay/60 p-4 md:p-5"
      onMouseMove={(e) => {
        const t = e.currentTarget
        light.current.el = t
        light.current.x = e.clientX
        light.current.y = e.clientY
        if (light.current.raf) return
        light.current.raf = requestAnimationFrame(() => {
          light.current.raf = 0
          const el = light.current.el
          if (!el) return
          const r = el.getBoundingClientRect()
          el.style.setProperty(
            '--mx',
            `${((light.current.x - r.left) / r.width) * 100}%`,
          )
          el.style.setProperty(
            '--my',
            `${((light.current.y - r.top) / r.height) * 100}%`,
          )
        })
      }}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
            Live activity
          </p>
          <h2 className="text-[17px] font-semibold tracking-tight text-fg md:text-[20px]">
            <CountUp value={total} /> {heading}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {live ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[12px] text-fg">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              Live
            </span>
          ) : loading ? (
            <span className="text-[12px] text-fg-muted">Syncing…</span>
          ) : error ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 text-[12px] text-danger hover:underline"
            >
              <SyncIcon size={12} />
              Retry
            </button>
          ) : (
            <span className="text-[12px] text-fg-muted">Cached</span>
          )}
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="hidden items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[12px] text-fg-muted hover:border-fg-subtle hover:text-fg md:inline-flex"
          >
            <PlayIcon size={12} />
            Replay
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1 max-md:flex-nowrap max-md:overflow-x-auto max-md:px-1 max-md:pb-1">
        <YearButton
          active={year === 'last'}
          onClick={() => pickYear('last')}
          label="Last year"
        />
        {years.map((y) => (
          <YearButton
            key={y}
            active={year === y}
            onClick={() => pickYear(y)}
            label={String(y)}
          />
        ))}
      </div>

      <div
        ref={heatRef}
        className={`contrib-heatmap ${desktop ? '' : 'is-revealing'}`}
      >
        {desktop ? (
          <div className="grid w-full grid-cols-[28px_minmax(0,1fr)] gap-x-2">
            <div />
            <div
              className="mb-1 grid text-[10px] text-fg-muted"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              }}
            >
              {labels.map((label, i) => (
                <span
                  key={`m-${i}`}
                  className="pointer-events-none w-0 overflow-visible whitespace-nowrap"
                >
                  {label}
                </span>
              ))}
            </div>
            <Weekdays />
            <HeatmapCanvas
              weeks={weeks}
              loading={loading && !days.length}
              selected={selected}
              replayKey={replayKey}
              revealRoot={heatRef}
              fullColor={false}
              onSelect={(day) =>
                setSelected((prev) => (prev?.date === day.date ? null : day))
              }
            />
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex w-7 shrink-0 flex-col">
              <div className="mb-1 h-[14px] shrink-0" aria-hidden />
              <Weekdays className="min-h-0 flex-1" />
            </div>
            <div
              className="gh-scrollbar graph-scroll min-w-0 flex-1 overflow-x-auto overscroll-x-contain pb-2"
              dir="rtl"
            >
              <div className="min-w-[680px]" dir="ltr">
                <div
                  className="mb-1 grid text-[10px] text-fg-muted"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  }}
                >
                  {labels.map((label, i) => (
                    <span
                      key={`m-${i}`}
                      className="pointer-events-none w-0 overflow-visible whitespace-nowrap"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <HeatmapCanvas
                  weeks={weeks}
                  loading={loading && !days.length}
                  selected={selected}
                  replayKey={replayKey}
                  revealRoot={heatRef}
                  fullColor
                  onSelect={(day) =>
                    setSelected((prev) => (prev?.date === day.date ? null : day))
                  }
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-fg-muted">
          <p className="md:hidden">Swipe for earlier months · tap a day</p>
          <p className="hidden md:block">
            Sweep the graph to reveal GitHub greens · click a day to pin
          </p>
          <div className="flex items-center gap-1">
            Less
            <span className="legend-gray flex items-center gap-1">
              {LEVEL_COLORS.map((color, i) => (
                <span
                  key={`bw-${i}`}
                  className="contrib-cell contrib-cell-legend"
                  style={{ background: color, animation: 'none' }}
                  title={`Level ${i}`}
                />
              ))}
            </span>
            <span className="legend-green flex items-center gap-1">
              {GITHUB_GREEN.map((color, i) => (
                <span
                  key={`g-${i}`}
                  className="contrib-cell contrib-cell-legend"
                  style={{ background: color, animation: 'none' }}
                  title={`Level ${i}`}
                />
              ))}
            </span>
            More
          </div>
        </div>
      </div>

      {selected && (
        <div className="mt-3 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-[13px] text-fg">
          <div className="font-medium">
            {contributionPhrase(selected.count, selected.date)}
          </div>
          <div className="mt-1 text-fg-muted">
            Intensity level {selected.level} of 4 ·{' '}
            <span className="md:hidden">tap again to unpin</span>
            <span className="hidden md:inline">click again to unpin</span>
          </div>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] sm:grid-cols-3">
        <Stat label="Current streak" value={`${current}d`} />
        <Stat label="Longest streak" value={`${longest}d`} />
        <Stat
          label="Best year"
          value={
            years.length
              ? `${bestYear} · ${formatCount(data?.total[String(bestYear)] ?? 0)}`
              : '—'
          }
        />
      </div>

      {error && !data && (
        <p className="mt-3 text-[13px] text-danger">{error}</p>
      )}
    </section>
  )
}

function YearButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 shrink-0 rounded-full px-3 text-[12px] transition ${
        active
          ? 'bg-white text-black'
          : 'text-fg-muted hover:bg-btn hover:text-fg'
      }`}
    >
      {label}
    </button>
  )
}

function Weekdays({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex flex-col justify-between py-[1px] text-[10px] leading-none text-fg-muted ${className}`}
    >
      <span />
      <span>Mon</span>
      <span />
      <span>Wed</span>
      <span />
      <span>Fri</span>
      <span />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-canvas px-3 py-2">
      <div className="text-fg-muted">{label}</div>
      <div className="text-[15px] font-semibold text-fg">{value}</div>
    </div>
  )
}
