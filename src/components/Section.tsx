import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { SectionId } from '../data/profile'

type Props = {
  id: SectionId
  index: number
  title?: string
  kicker?: string
  aside?: ReactNode
  children: ReactNode
}

/** A numbered page section that blurs/rises in the first time it scrolls into view. */
export function Section({ id, index, title, kicker, aside, children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setSeen(true)
        io.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      id={id}
      ref={ref}
      className={`reveal scroll-mt-24 ${seen ? 'is-visible' : ''}`}
    >
      {/* Motion lives on this inner box so the section's scroll target never shifts. */}
      <div className="reveal-body">
        {title && (
          <header className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
            <div>
              <p className="section-kicker font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
                <span className="text-[#3fb950]">{String(index).padStart(2, '0')}</span>
                <span className="mx-2 text-border">/</span>
                {kicker ?? id}
              </p>
              <h2 className="section-title mt-1.5 text-[28px] leading-none font-semibold tracking-tight text-fg md:text-[34px]">
                {title}
              </h2>
            </div>
            {aside}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
