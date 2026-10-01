import { useEffect, useRef, type RefObject } from 'react'
import {
  contributionPhrase,
  GITHUB_GREEN,
  type ContributionDay,
  type WeekCell,
} from '../lib/github'

const GRAY = ['#141414', '#3a3a3a', '#6b6b6b', '#a8a8a8', '#f5f5f5']
const ROWS = 7
const FOOT = 0.78
const MAX_H = 8
const TILT = 0.46
const VERT = 0.9
const YAW_LIMIT = (22 * Math.PI) / 180
const BASE_YAW = (-14 * Math.PI) / 180
// The idle sway runs for a while after the graph builds (or the pointer leaves),
// then the canvas stops redrawing so an on-screen graph costs nothing while idle.
const SWAY_MS = 6000
const SWAY_AFTER_LEAVE_MS = 2500

type Props = {
  weeks: WeekCell[][]
  labels: string[]
  loading?: boolean
  selected: ContributionDay | null
  replayKey: number
  alwaysLit?: boolean
  revealRoot: RefObject<HTMLElement | null>
  onSelect: (day: ContributionDay) => void
}

type Point = [number, number]
type Bar = {
  day: ContributionDay | null
  x: number
  z: number
  h: number
  depth: number
  polys: Point[][]
}

const hexRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const GRAY_RGB = GRAY.map(hexRgb)
const GREEN_RGB = GITHUB_GREEN.map(hexRgb)
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const ease = (v: number) => 1 - (1 - v) ** 3
const shade = (c: number[], k: number) =>
  `rgb(${c.map((v) => Math.min(255, Math.round(v * k))).join(',')})`

function inside(p: Point, poly: Point[]) {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) {
      hit = !hit
    }
  }
  return hit
}

export function Skyline(props: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const latest = useRef(props)
  const api = useRef<{ draw: () => void; regrow: () => void } | null>(null)

  useEffect(() => {
    latest.current = props
  })

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const tip = tipRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !canvas || !tip || !ctx) return

    const live = latest
    const reveal = latest.current.revealRoot.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let dpr = 1
    let unit = 10
    let ox = 0
    let oy = 0
    let yaw = BASE_YAW
    let interacted = false
    let pointerIn = false
    let litMix = latest.current.alwaysLit ? 1 : 0
    let growStart = performance.now()
    let swayUntil = growStart + SWAY_MS
    // Sway phase advances only while swaying, so resuming never jumps.
    let swayClock = 0
    let lastFrame = 0
    let visible = true
    let raf = 0
    let bars: Bar[] = []
    let hover: Bar | null = null
    let drag: { x: number; yaw: number; moved: boolean } | null = null

    const grid = (): WeekCell[][] => {
      const { weeks, loading } = latest.current
      if (loading && !weeks.length) {
        return Array.from({ length: 53 }, () => Array<WeekCell>(ROWS).fill(null))
      }
      return weeks
    }

    const measure = () => {
      width = wrap.clientWidth
      height = Math.round(Math.min(360, Math.max(240, width * 0.42)))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      const cols = Math.max(grid().length, 1)
      const zspan = cols * Math.sin(YAW_LIMIT) + ROWS * Math.cos(YAW_LIMIT)
      unit = Math.min(
        (width * 0.94) / Math.hypot(cols, ROWS),
        (height * 0.84) / (zspan * TILT + MAX_H * VERT),
      )
      ox = width / 2
      oy = height / 2 + (MAX_H * VERT * unit) / 2 - 8
    }

    const litTarget = () => (latest.current.alwaysLit || pointerIn ? 1 : 0)

    const draw = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const frame = (now: number) => {
      raf = 0
      const { labels, selected } = latest.current
      const data = grid()
      const cols = Math.max(data.length, 1)
      const target = litTarget()
      litMix += (target - litMix) * 0.16
      if (Math.abs(target - litMix) < 0.01) litMix = target
      const swaying = !interacted && !reduced && (pointerIn || now < swayUntil)
      if (swaying && !drag) {
        swayClock += Math.min(now - (lastFrame || now), 50)
        yaw = BASE_YAW + Math.sin(swayClock / 4200) * 0.1
      }
      lastFrame = now

      const cos = Math.cos(yaw)
      const sin = Math.sin(yaw)
      const project = (x: number, z: number, y: number): Point => [
        ox + (x * cos - z * sin) * unit,
        oy + (x * sin + z * cos) * TILT * unit - y * VERT * unit,
      ]

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const bx = cols / 2 + 0.4
      const bz = ROWS / 2 + 0.4
      const board = [
        project(-bx, -bz, 0),
        project(bx, -bz, 0),
        project(bx, bz, 0),
        project(-bx, bz, 0),
      ]
      ctx.beginPath()
      board.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)))
      ctx.closePath()
      ctx.fillStyle = '#070707'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'
      ctx.lineWidth = 1
      ctx.stroke()

      let max = 1
      for (const week of data) for (const day of week) if (day) max = Math.max(max, day.count)
      const busy = latest.current.loading && !latest.current.weeks.length
      const growFor = cols * 14 + ROWS * 10 + 700

      bars = []
      for (let col = 0; col < data.length; col += 1) {
        for (let row = 0; row < ROWS; row += 1) {
          const day = data[col][row]
          if (!day && !busy) continue
          const x = col - (cols - 1) / 2
          const z = row - (ROWS - 1) / 2
          const grow = reduced
            ? 1
            : ease(clamp((now - growStart - col * 14 - row * 10) / 650))
          const full =
            day && day.count > 0 ? 0.35 + Math.sqrt(day.count / max) * (MAX_H - 0.35) : 0.1
          bars.push({
            day,
            x,
            z,
            h: Math.max(0.06, full * grow),
            depth: x * sin + z * cos,
            polys: [],
          })
        }
      }
      bars.sort((a, b) => a.depth - b.depth)

      const half = FOOT / 2
      for (const bar of bars) {
        const x0 = bar.x - half
        const x1 = bar.x + half
        const z0 = bar.z - half
        const z1 = bar.z + half
        const h = bar.h
        const level = bar.day && bar.day.count > 0 ? Math.min(bar.day.level, 4) : 0
        const base = GRAY_RGB[level].map((v, i) => v + (GREEN_RGB[level][i] - v) * litMix)
        const isHover = hover?.day != null && hover.day === bar.day
        const isPinned = selected != null && bar.day?.date === selected.date

        const faces: [Point[], number][] = []
        const zFace = cos > 0 ? z1 : z0
        faces.push([
          [project(x0, zFace, 0), project(x1, zFace, 0), project(x1, zFace, h), project(x0, zFace, h)],
          0.6,
        ])
        const xFace = sin > 0 ? x1 : x0
        faces.push([
          [project(xFace, z0, 0), project(xFace, z1, 0), project(xFace, z1, h), project(xFace, z0, h)],
          0.42,
        ])
        const top: Point[] = [
          project(x0, z0, h),
          project(x1, z0, h),
          project(x1, z1, h),
          project(x0, z1, h),
        ]
        faces.push([top, isHover ? 1.35 : 1])

        for (const [poly, k] of faces) {
          ctx.beginPath()
          poly.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)))
          ctx.closePath()
          ctx.fillStyle = shade(base, k)
          ctx.fill()
        }
        if (isPinned || isHover) {
          ctx.beginPath()
          top.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)))
          ctx.closePath()
          ctx.strokeStyle = isPinned ? '#39d353' : 'rgba(255,255,255,0.85)'
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
        bar.polys = faces.map(([poly]) => poly)
      }

      ctx.font = '10px "IBM Plex Mono", ui-monospace, monospace'
      ctx.fillStyle = '#737373'
      ctx.textAlign = 'left'
      labels.forEach((label, col) => {
        if (!label) return
        const [lx, ly] = project(col - (cols - 1) / 2 - half, ROWS / 2 + 1.1, 0)
        ctx.fillText(label, lx, ly + 4)
      })

      const busyAnimating =
        target !== litMix ||
        swaying ||
        now - growStart < growFor
      if (visible && busyAnimating) draw()
    }

    const hit = (e: PointerEvent): Bar | null => {
      const rect = canvas.getBoundingClientRect()
      const p: Point = [e.clientX - rect.left, e.clientY - rect.top]
      for (let i = bars.length - 1; i >= 0; i -= 1) {
        if (bars[i].day && bars[i].polys.some((poly) => inside(p, poly))) return bars[i]
      }
      return null
    }

    const showTip = (bar: Bar | null, e: PointerEvent) => {
      if (!bar?.day) {
        tip.style.opacity = '0'
        return
      }
      tip.textContent = contributionPhrase(bar.day.count, bar.day.date)
      const rect = wrap.getBoundingClientRect()
      const tw = tip.offsetWidth
      let left = e.clientX - rect.left - tw / 2
      left = Math.max(0, Math.min(rect.width - tw, left))
      tip.style.opacity = '1'
      tip.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(e.clientY - rect.top - 44)}px, 0)`
    }

    const setReveal = () => {
      reveal?.classList.toggle('is-revealing', litTarget() === 1)
    }

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointerIn = true
      setReveal()
      draw()
    }

    const onMove = (e: PointerEvent) => {
      if (drag) {
        const dx = e.clientX - drag.x
        if (Math.abs(dx) > 3) drag.moved = true
        yaw = Math.max(-YAW_LIMIT, Math.min(YAW_LIMIT, drag.yaw + dx * 0.006))
        tip.style.opacity = '0'
        draw()
        return
      }
      const next = hit(e)
      if (next?.day !== hover?.day) {
        hover = next
        draw()
      }
      canvas.style.cursor = next ? 'pointer' : 'grab'
      showTip(next, e)
    }

    const onDown = (e: PointerEvent) => {
      interacted = true
      drag = { x: e.clientX, yaw, moved: false }
      canvas.setPointerCapture(e.pointerId)
    }

    const onUp = (e: PointerEvent) => {
      if (drag && !drag.moved) {
        const bar = hit(e)
        if (bar?.day) latest.current.onSelect(bar.day)
      }
      drag = null
    }

    const onCancel = () => {
      drag = null
    }

    const onLeave = () => {
      pointerIn = false
      swayUntil = performance.now() + SWAY_AFTER_LEAVE_MS
      hover = null
      tip.style.opacity = '0'
      setReveal()
      draw()
    }

    const ro = new ResizeObserver(() => {
      measure()
      draw()
    })
    ro.observe(wrap)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) draw()
    })
    io.observe(canvas)

    canvas.addEventListener('pointerenter', onEnter)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onCancel)
    canvas.addEventListener('pointerleave', onLeave)
    measure()
    setReveal()
    draw()

    api.current = {
      draw,
      regrow: () => {
        growStart = performance.now()
        swayUntil = growStart + SWAY_MS
        measure()
        draw()
      },
    }

    return () => {
      cancelAnimationFrame(raf)
      reveal?.classList.toggle('is-revealing', Boolean(live.current.alwaysLit))
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointerenter', onEnter)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onCancel)
      canvas.removeEventListener('pointerleave', onLeave)
      api.current = null
    }
  }, [])

  const { weeks, loading, selected, replayKey, alwaysLit } = props

  useEffect(() => {
    api.current?.regrow()
  }, [weeks, loading, replayKey])

  useEffect(() => {
    api.current?.draw()
  }, [selected, alwaysLit])

  return (
    <div ref={wrapRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        className="block w-full touch-pan-y select-none"
        style={{ cursor: 'grab' }}
        aria-label="3D contribution skyline. Drag to rotate, click a bar to pin that day."
      />
      <div
        ref={tipRef}
        className="pointer-events-none absolute top-0 left-0 z-10 rounded-lg border border-border bg-black px-2.5 py-1.5 font-mono text-[12px] whitespace-nowrap text-fg opacity-0 shadow-2xl transition-opacity"
      />
    </div>
  )
}
