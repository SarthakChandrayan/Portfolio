import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { subscribeToasts } from '../lib/toast'

export function CountUp({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  const [n, setN] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setN(value)
      return
    }
    const start = performance.now()
    const from = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 780)
      const eased = 1 - (1 - p) ** 3
      setN(Math.round(from + (value - from) * eased))
      if (p < 1) requestAnimationFrame(tick)
    }
    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [value])

  return <span className={className}>{n.toLocaleString('en-US')}</span>
}

export function TiltCard({
  children,
  className = '',
  tilt = true,
}: {
  children: ReactNode
  className?: string
  tilt?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    if (!tilt) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.style.transform = `perspective(900px) rotateX(${(y - 0.5) * -8}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-2px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt-card light-up ${className}`}
    >
      {children}
    </div>
  )
}

export function Magnetic({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    el.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block transition-transform duration-150 ${className}`}
    >
      {children}
    </div>
  )
}

export function Toaster() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let hide: number | undefined
    return subscribeToasts((next) => {
      setMessage(next)
      window.clearTimeout(hide)
      hide = window.setTimeout(() => setMessage(null), 1800)
    })
  }, [])

  if (!message) return null

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-canvas-overlay px-4 py-2 text-[13px] text-fg shadow-2xl">
      {message}
    </div>
  )
}

export function Ambient() {
  const [pos, setPos] = useState({ x: 40, y: 20 })

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      setPos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          background:
            'radial-gradient(circle, rgba(255,255,255,0.22), rgba(255,255,255,0.05), transparent 68%)',
        }}
      />
      <div className="ambient-grid absolute inset-0" />
      <div className="grain absolute inset-0" />
    </div>
  )
}

export function ScrollProgress() {
  const [p, setP] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setP(max > 0 ? el.scrollTop / max : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 z-50 h-[2px] w-full bg-transparent">
      <div
        className="h-full"
        style={{
          width: `${p * 100}%`,
          background: '#ffffff',
        }}
      />
    </div>
  )
}
