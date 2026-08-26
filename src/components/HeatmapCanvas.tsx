import { useEffect, useRef, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import {
  contributionPhrase,
  GITHUB_GREEN,
  type ContributionDay,
  type WeekCell,
} from '../lib/github'

const GRAY = ['#141414', '#3a3a3a', '#6b6b6b', '#a8a8a8', '#f5f5f5']
const GAP = 3
const ROWS = 7
const SPOT_R = 88

type Props = {
  weeks: WeekCell[][]
  loading?: boolean
  selected: ContributionDay | null
  replayKey: number
  revealRoot: RefObject<HTMLElement | null>
  onSelect: (day: ContributionDay) => void
  fullColor?: boolean
}

export function HeatmapCanvas({
  weeks,
  loading = false,
  selected,
  replayKey,
  revealRoot,
  onSelect,
  fullColor = false,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const latest = useRef({ weeks, loading, selected, onSelect, replayKey, fullColor })
  latest.current = { weeks, loading, selected, onSelect, replayKey, fullColor }

  const api = useRef<{
    rebuild: () => void
    paint: () => void
    replay: () => void
  } | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const gray = document.createElement('canvas')
    const green = document.createElement('canvas')
    const scratch = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const gctx = gray.getContext('2d')
    const cctx = green.getContext('2d')
    const sctx = scratch.getContext('2d')
    if (!ctx || !gctx || !cctx || !sctx) return

    const spot = { x: -999, y: -999, on: false }
    const replay = { active: false, x: 0, raf: 0 }
    let cssW = 0
    let cssH = 70
    let cell = 10
    let cols = 53
    let dpr = 1
    let paintRaf = 0
    let hover: { col: number; row: number; day: ContributionDay } | null = null

    const grid = (): WeekCell[][] => {
      const { weeks: next, loading: busy } = latest.current
      if (busy && !next.length) {
        return Array.from({ length: 53 }, () => Array.from({ length: ROWS }, () => null))
      }
      return next
    }

    const sizeBuffers = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(cssW * dpr))
      const h = Math.max(1, Math.round(cssH * dpr))
      for (const surface of [canvas, gray, green, scratch]) {
        if (surface.width === w && surface.height === h) continue
        surface.width = w
        surface.height = h
      }
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      wrap.style.height = `${cssH}px`
    }

    const measure = () => {
      const width = wrap.clientWidth
      if (width < 8) return false
      const data = grid()
      cols = Math.max(data.length, 1)
      cell = Math.max(0, (width - GAP * Math.max(cols - 1, 0)) / cols)
      cssW = width
      cssH = cell * ROWS + GAP * (ROWS - 1)
      sizeBuffers()
      return true
    }

    const cellAt = (col: number, row: number) => ({
      x: col * (cell + GAP),
      y: row * (cell + GAP),
    })

    const drawLayer = (
      target: CanvasRenderingContext2D,
      colors: readonly string[],
    ) => {
      target.setTransform(dpr, 0, 0, dpr, 0, 0)
      target.clearRect(0, 0, cssW, cssH)
      const data = grid()
      const busy = latest.current.loading && !latest.current.weeks.length
      for (let col = 0; col < data.length; col += 1) {
        const week = data[col]
        for (let row = 0; row < ROWS; row += 1) {
          const day = week[row]
          if (!day && !busy) continue
          const { x, y } = cellAt(col, row)
          const level = day ? Math.min(day.level, 4) : 0
          target.fillStyle = colors[level]
          target.beginPath()
          target.roundRect(x, y, cell, cell, 2)
          target.fill()
          target.strokeStyle = 'rgba(255,255,255,0.06)'
          target.lineWidth = 1
          target.stroke()
        }
      }
    }

    const findDayPos = (day: ContributionDay | null) => {
      if (!day) return null
      const data = grid()
      for (let col = 0; col < data.length; col += 1) {
        for (let row = 0; row < ROWS; row += 1) {
          if (data[col][row]?.date === day.date) return { col, row, day: data[col][row]! }
        }
      }
      return null
    }

    const hit = (px: number, py: number) => {
      const data = grid()
      const col = Math.floor(px / (cell + GAP))
      const row = Math.floor(py / (cell + GAP))
      if (col < 0 || row < 0 || col >= data.length || row >= ROWS) return null
      const { x, y } = cellAt(col, row)
      if (px > x + cell || py > y + cell) return null
      const day = data[col][row]
      if (!day) return null
      return { col, row, day }
    }

    let tipW = 220
    let tipH = 32

    const hideTip = () => {
      const tip = tipRef.current
      if (tip) tip.style.opacity = '0'
      hover = null
    }

    const showTip = (day: ContributionDay, clientX: number, clientY: number) => {
      const tip = tipRef.current
      if (!tip) return
      const text = contributionPhrase(day.count, day.date)
      if (tip.textContent !== text) {
        tip.textContent = text
        tipW = tip.offsetWidth || 220
        tipH = tip.offsetHeight || 32
      }
      const pad = 10
      let left = clientX - tipW / 2
      let top = clientY - tipH - 14
      if (left + tipW > window.innerWidth - pad) left = window.innerWidth - tipW - pad
      if (left < pad) left = pad
      if (top < pad) top = clientY + 18
      tip.style.opacity = '1'
      tip.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`
    }

    const outline = (
      target: CanvasRenderingContext2D,
      col: number,
      row: number,
      color: string,
    ) => {
      const { x, y } = cellAt(col, row)
      target.strokeStyle = color
      target.lineWidth = 1.5
      target.beginPath()
      target.roundRect(x + 0.5, y + 0.5, Math.max(cell - 1, 0), Math.max(cell - 1, 0), 2)
      target.stroke()
    }

    const paint = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cssW, cssH)

      const full = latest.current.fullColor
      if (full) {
        ctx.drawImage(green, 0, 0, cssW, cssH)
      } else {
        ctx.drawImage(gray, 0, 0, cssW, cssH)
      }

      const pinned = findDayPos(latest.current.selected)
      if (pinned && !full) {
        const { x, y } = cellAt(pinned.col, pinned.row)
        ctx.fillStyle = GITHUB_GREEN[Math.min(pinned.day.level, 4)]
        ctx.beginPath()
        ctx.roundRect(x, y, cell, cell, 2)
        ctx.fill()
      }

      if (!full && (spot.on || replay.active)) {
        sctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        sctx.globalCompositeOperation = 'source-over'
        sctx.clearRect(0, 0, cssW, cssH)
        sctx.drawImage(green, 0, 0, cssW, cssH)
        sctx.globalCompositeOperation = 'destination-in'
        if (replay.active) {
          const grad = sctx.createLinearGradient(replay.x - 80, 0, replay.x + 80, 0)
          grad.addColorStop(0, 'rgba(255,255,255,0)')
          grad.addColorStop(0.4, '#fff')
          grad.addColorStop(0.6, '#fff')
          grad.addColorStop(1, 'rgba(255,255,255,0)')
          sctx.fillStyle = grad
        } else {
          const grad = sctx.createRadialGradient(
            spot.x,
            spot.y,
            SPOT_R * 0.32,
            spot.x,
            spot.y,
            SPOT_R,
          )
          grad.addColorStop(0, '#fff')
          grad.addColorStop(0.5, '#fff')
          grad.addColorStop(1, 'rgba(255,255,255,0)')
          sctx.fillStyle = grad
        }
        sctx.fillRect(0, 0, cssW, cssH)
        sctx.globalCompositeOperation = 'source-over'
        ctx.drawImage(scratch, 0, 0, cssW, cssH)
      }

      if (pinned) outline(ctx, pinned.col, pinned.row, '#39d353')
      if (hover) outline(ctx, hover.col, hover.row, 'rgba(255,255,255,0.7)')
    }

    const requestPaint = () => {
      if (paintRaf) return
      paintRaf = requestAnimationFrame(() => {
        paintRaf = 0
        paint()
      })
    }

    const setRevealing = (on: boolean) => {
      revealRoot.current?.classList.toggle('is-revealing', on)
    }

    const rebuild = () => {
      if (!measure()) return
      drawLayer(gctx, GRAY)
      drawLayer(cctx, GITHUB_GREEN)
      if (latest.current.fullColor) setRevealing(true)
      paint()
    }

    const pinched = () => (window.visualViewport?.scale ?? 1) > 1.02

    const startReplay = () => {
      if (replay.raf) cancelAnimationFrame(replay.raf)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        replay.active = false
        requestPaint()
        return
      }
      const start = performance.now()
      replay.active = true
      const tick = (now: number) => {
        const t = Math.min((now - start) / 850, 1)
        replay.x = t * (cssW + 160) - 80
        paint()
        if (t < 1) replay.raf = requestAnimationFrame(tick)
        else {
          replay.active = false
          replay.raf = 0
          paint()
        }
      }
      replay.raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      if (!e.isPrimary || pinched() || latest.current.fullColor) return
      const rect = canvas.getBoundingClientRect()
      spot.x = e.clientX - rect.left
      spot.y = e.clientY - rect.top
      spot.on = true
      setRevealing(true)
      const next = hit(spot.x, spot.y)
      hover = next
      if (next) showTip(next.day, e.clientX, e.clientY)
      else hideTip()
      requestPaint()
    }

    const onLeave = () => {
      if (latest.current.fullColor) {
        hideTip()
        return
      }
      spot.on = false
      setRevealing(false)
      hideTip()
      requestPaint()
    }

    const onClick = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const next = hit(e.clientX - rect.left, e.clientY - rect.top)
      if (next) latest.current.onSelect(next.day)
    }

    const ro = new ResizeObserver(() => {
      if (pinched()) return
      const width = wrap.clientWidth
      if (cssW > 0 && Math.abs(width - cssW) < 1) return
      rebuild()
    })
    ro.observe(wrap)
    canvas.addEventListener('pointermove', onMove, { passive: true })
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('click', onClick)
    rebuild()

    api.current = { rebuild, paint: requestPaint, replay: startReplay }

    return () => {
      ro.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('click', onClick)
      if (paintRaf) cancelAnimationFrame(paintRaf)
      if (replay.raf) cancelAnimationFrame(replay.raf)
      api.current = null
    }
  }, [revealRoot])

  useEffect(() => {
    api.current?.rebuild()
  }, [weeks, loading, fullColor])

  useEffect(() => {
    api.current?.paint()
  }, [selected])

  useEffect(() => {
    if (replayKey) api.current?.replay()
  }, [replayKey])

  return (
    <>
      <div ref={wrapRef} className="relative w-full min-w-0">
        <canvas
          ref={canvasRef}
          className={`block w-full cursor-crosshair ${
            fullColor ? 'touch-manipulation' : 'touch-pan-y'
          }`}
          aria-label={
            fullColor
              ? 'Contribution heatmap. Swipe to see earlier months, tap a day to pin it.'
              : 'Contribution heatmap. Move the cursor to reveal GitHub greens.'
          }
        />
      </div>
      {createPortal(
        <div
          ref={tipRef}
          className="pointer-events-none fixed top-0 left-0 z-[200] rounded-lg border border-border bg-black px-2.5 py-1.5 font-mono text-[12px] whitespace-nowrap text-fg shadow-2xl"
          style={{ opacity: 0, transform: 'translate3d(-999px,-999px,0)' }}
        />,
        document.body,
      )}
    </>
  )
}
