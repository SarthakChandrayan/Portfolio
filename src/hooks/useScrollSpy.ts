import { useEffect, useState } from 'react'
import { sections, type SectionId } from '../data/profile'

/** The section crossing the upper-middle of the viewport is the active one. */
export function useScrollSpy() {
  const [active, setActive] = useState<SectionId>('about')

  useEffect(() => {
    const els = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => Boolean(el))
    const visible = new Set<string>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        // At the very bottom the last section may never reach the band.
        const atEnd =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
        const next = atEnd
          ? sections[sections.length - 1]
          : sections.find((section) => visible.has(section.id))
        if (next) setActive(next.id)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))

    const onScroll = () => {
      const atEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atEnd) setActive(sections[sections.length - 1].id)
      else if (window.scrollY < 80) setActive('about')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return active
}
