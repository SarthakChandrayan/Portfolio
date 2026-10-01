import { sections, type SectionId } from '../data/profile'

export function isSection(value: string): value is SectionId {
  return sections.some((section) => section.id === value)
}

const smooth = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

export function scrollToSection(id: SectionId) {
  if (id === 'about') {
    window.scrollTo({ top: 0, behavior: smooth() })
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: smooth(), block: 'start' })
  }
  window.history.replaceState(null, '', `#${id}`)
}

export function stepSection(from: SectionId, delta: 1 | -1) {
  const index = sections.findIndex((section) => section.id === from)
  const next = sections[Math.min(sections.length - 1, Math.max(0, index + delta))]
  scrollToSection(next.id)
}
