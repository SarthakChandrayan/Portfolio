import {
  BriefcaseIcon,
  DownloadIcon,
  GraphIcon,
  MailIcon,
  PersonIcon,
  RepoIcon,
  SearchIcon,
  ToolsIcon,
  type Icon,
} from '@primer/octicons-react'
import { useRef, type MouseEvent } from 'react'
import { profile, sections, type SectionId } from '../data/profile'
import { scrollToSection } from '../lib/nav'

const icons: Record<SectionId, Icon> = {
  about: PersonIcon,
  work: RepoIcon,
  experience: BriefcaseIcon,
  skills: ToolsIcon,
  activity: GraphIcon,
  contact: MailIcon,
}

// Magnification: items within RANGE px of the cursor grow up to 1 + BOOST.
const RANGE = 130
const BOOST = 0.55

type Props = {
  active: SectionId
  onSearch: () => void
}

export function Dock({ active, onSearch }: Props) {
  const barRef = useRef<HTMLDivElement>(null)
  const centers = useRef<number[]>([])

  const items = () =>
    Array.from(barRef.current?.querySelectorAll<HTMLElement>('[data-dock-item]') ?? [])

  const onEnter = () => {
    // Measure resting positions once so growing items don't feed back into the math.
    centers.current = items().map((el) => {
      const r = el.getBoundingClientRect()
      return r.left + r.width / 2
    })
  }

  const onMove = (e: MouseEvent) => {
    items().forEach((el, i) => {
      const d = Math.abs(e.clientX - (centers.current[i] ?? 0))
      const t = Math.max(0, 1 - d / RANGE)
      el.style.setProperty('--s', String(1 + BOOST * Math.sin((t * Math.PI) / 2)))
    })
  }

  const onLeave = () => items().forEach((el) => el.style.setProperty('--s', '1'))

  return (
    <nav
      aria-label="Sections"
      className="dock-in fixed inset-x-0 bottom-0 z-40 flex justify-center md:bottom-5"
    >
      <div
        ref={barRef}
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="dock flex w-full items-end justify-around border-t border-border bg-black/85 px-1 pt-1.5 pb-[max(6px,env(safe-area-inset-bottom))] backdrop-blur-xl md:w-auto md:justify-center md:gap-1 md:rounded-[22px] md:border md:bg-black/60 md:px-2 md:pt-2 md:pb-2 md:shadow-[0_20px_60px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        {sections.map((section, i) => {
          const IconCmp = icons[section.id]
          const on = section.id === active
          return (
            <button
              key={section.id}
              type="button"
              data-dock-item
              onClick={() => scrollToSection(section.id)}
              aria-current={on ? 'true' : undefined}
              aria-label={section.label}
              className={`dock-item group ${on ? 'is-active' : ''}`}
            >
              <span className="dock-icon">
                <IconCmp size={18} />
              </span>
              <span className="dock-label md:hidden">{section.label}</span>
              <span className="dock-tip" role="tooltip">
                {section.label}
                <kbd>{i + 1}</kbd>
              </span>
              <span className="dock-dot" aria-hidden />
            </button>
          )
        })}

        <span className="mx-1 hidden h-8 w-px self-center bg-border md:block" aria-hidden />

        <button
          type="button"
          data-dock-item
          onClick={onSearch}
          aria-label="Search"
          className="dock-item group max-md:!hidden"
        >
          <span className="dock-icon">
            <SearchIcon size={18} />
          </span>
          <span className="dock-tip" role="tooltip">
            Search
            <kbd>/</kbd>
          </span>
        </button>
        <a
          href={encodeURI(profile.resume)}
          target="_blank"
          rel="noreferrer"
          data-dock-item
          aria-label="Résumé"
          className="dock-item group no-underline hover:no-underline max-md:!hidden"
        >
          <span className="dock-icon">
            <DownloadIcon size={18} />
          </span>
          <span className="dock-tip" role="tooltip">
            Résumé
          </span>
        </a>
      </div>
    </nav>
  )
}
