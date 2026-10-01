import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { profile } from '../data/profile'
import { INTRO_DONE, INTRO_SEEN_KEY } from '../lib/intro'

// Timeline (ms). Skipping jumps straight to SPLIT.
const SPLIT = 1720
const DONE = SPLIT + 800

const BOOT = [
  'booting sarthak.dev',
  'loading stack: typescript · node · react · react-native · next',
  'fetching github contributions',
  'ready',
]

export function Intro({ onReveal }: { onReveal: () => void }) {
  const [phase, setPhase] = useState<'show' | 'split' | 'done'>('show')
  const [pct, setPct] = useState(0)
  const revealed = useRef(false)

  const reveal = () => {
    if (revealed.current) return
    revealed.current = true
    setPhase('split')
    onReveal()
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    } catch {
      /* storage unavailable: intro simply plays again next time */
    }
    window.setTimeout(() => {
      setPhase('done')
      window.dispatchEvent(new Event(INTRO_DONE))
    }, DONE - SPLIT)
  }

  const revealRef = useRef(reveal)
  useLayoutEffect(() => {
    revealRef.current = reveal
  })

  useEffect(() => {
    const start = performance.now()
    let raf = requestAnimationFrame(function tick(now) {
      const p = Math.min(1, (now - start) / (SPLIT - 350))
      setPct(Math.round((1 - (1 - p) ** 2) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    })
    const skip = () => revealRef.current()
    const id = window.setTimeout(skip, SPLIT)
    window.addEventListener('keydown', skip)
    window.addEventListener('wheel', skip, { passive: true })
    window.addEventListener('touchmove', skip, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(id)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchmove', skip)
    }
  }, [])

  if (phase === 'done') return null

  let letter = 0
  const words = profile.name.split(' ')

  return (
    <div
      className={`intro ${phase === 'split' ? 'is-split' : ''}`}
      onClick={reveal}
      aria-hidden
    >
      <div className="intro-panel intro-panel-top" />
      <div className="intro-panel intro-panel-bottom" />
      <div className="intro-scan" />

      <div className="intro-content">
        <div className="absolute top-6 left-5 space-y-1 font-mono text-[11px] text-fg-subtle md:top-8 md:left-8 md:text-[12px]">
          {BOOT.map((line, i) => (
            <p
              key={line}
              className="intro-line"
              style={{ '--i': i } as CSSProperties}
            >
              <span className={i === BOOT.length - 1 ? 'text-[#3fb950]' : ''}>
                {'>'} {line}
              </span>
            </p>
          ))}
        </div>

        <div className="absolute top-6 right-5 font-mono text-[11px] text-fg-subtle tabular-nums md:top-8 md:right-8 md:text-[12px]">
          {String(pct).padStart(3, '0')}%
        </div>

        <h1 className="intro-name flex flex-wrap justify-center gap-x-[0.28em] px-4 text-center text-[clamp(44px,10vw,132px)] leading-[0.95] font-semibold tracking-tight text-fg">
          {words.map((word) => (
            <span key={word} className="inline-flex">
              {Array.from(word).map((ch) => (
                <span
                  key={letter}
                  className="intro-letter"
                  style={{ '--i': letter++ } as CSSProperties}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="absolute right-5 bottom-6 left-5 flex justify-between font-mono text-[11px] tracking-widest text-fg-subtle uppercase md:right-8 md:bottom-8 md:left-8 md:text-[12px]">
          <span className="intro-line" style={{ '--i': 2 } as CSSProperties}>
            {profile.title}
          </span>
          <span className="intro-line" style={{ '--i': 3 } as CSSProperties}>
            click to skip
          </span>
        </div>
      </div>
    </div>
  )
}
