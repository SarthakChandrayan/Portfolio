import { MarkGithubIcon, SearchIcon } from '@primer/octicons-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { profile, tabs, type TabId } from '../data/profile'
import { Magnetic } from './Motion'

function placeOver(el: HTMLElement | null, tab: HTMLElement | null | undefined) {
  if (!el || !tab) return
  el.style.transform = `translateX(${tab.offsetLeft}px)`
  el.style.width = `${tab.offsetWidth}px`
}

type Props = {
  active: TabId
  onChange: (id: TabId) => void
  onSearch: () => void
}

export function TopNav({ active, onChange, onSearch }: Props) {
  const [hot, setHot] = useState<TabId | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const ghostRef = useRef<HTMLSpanElement>(null)
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({})

  useLayoutEffect(() => {
    const nav = navRef.current
    const pill = pillRef.current
    if (!nav || !pill) return
    const sync = () => placeOver(pill, tabRefs.current[active])
    sync()
    const ready = requestAnimationFrame(() => pill.classList.add('is-ready'))
    const ro = new ResizeObserver(sync)
    ro.observe(nav)
    return () => {
      cancelAnimationFrame(ready)
      ro.disconnect()
    }
  }, [active])

  const showGhost = (id: TabId) => {
    setHot(id)
    const ghost = ghostRef.current
    if (!ghost) return
    if (!ghost.classList.contains('is-on')) {
      placeOver(ghost, tabRefs.current[id])
      void ghost.offsetWidth
      ghost.classList.add('is-on')
      return
    }
    placeOver(ghost, tabRefs.current[id])
  }

  const hideGhost = () => {
    setHot(null)
    ghostRef.current?.classList.remove('is-on')
  }

  return (
    <header className="page-fade sticky top-0 z-40 border-b border-border/80 bg-black md:bg-black/80 md:backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3 md:px-8">
        <button
          type="button"
          onClick={() => onChange('overview')}
          className="flex items-center gap-2.5 text-fg"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-canvas-subtle font-semibold tracking-tight">
            SC
          </span>
          <span className="hidden font-semibold tracking-tight sm:inline">
            sarthak
            <span className="text-fg-muted">.dev</span>
          </span>
        </button>

        <nav
          ref={navRef}
          onMouseLeave={hideGhost}
          className="relative ml-2 hidden items-center rounded-full border border-border bg-canvas-subtle p-1 lg:flex"
        >
          <span
            ref={ghostRef}
            aria-hidden
            className="nav-ghost pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-white/10"
          />
          <span
            ref={pillRef}
            aria-hidden
            className="nav-pill pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.25)]"
          />
          {tabs.map((tab) => {
            const isActive = tab.id === active
            const isHot = hot === tab.id
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el
                }}
                type="button"
                onClick={() => onChange(tab.id)}
                onMouseEnter={() => showGhost(tab.id)}
                className={`relative z-10 rounded-full px-3 py-1.5 text-[13px] transition-colors duration-200 ${
                  isActive
                    ? 'font-medium text-black'
                    : isHot
                      ? 'text-fg'
                      : 'text-fg-muted'
                }`}
              >
                {tab.label}
                {tab.count != null && (
                  <span
                    className={`ml-1.5 transition-colors duration-150 ${
                      isActive
                        ? 'text-black/45'
                        : isHot
                          ? 'text-fg-muted'
                          : 'text-fg-subtle'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onSearch}
            className="flex items-center gap-2 rounded-full border border-border bg-canvas px-3 py-1.5 text-[13px] text-fg-muted hover:border-fg-subtle hover:text-fg"
          >
            <SearchIcon size={14} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-border px-1.5 font-mono text-[11px] text-fg-subtle sm:inline">
              /
            </kbd>
          </button>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="grid h-8 w-8 place-items-center rounded-full border border-border text-fg no-underline hover:bg-btn hover:no-underline"
            aria-label="GitHub"
          >
            <MarkGithubIcon size={16} />
          </a>
          <img
            src={profile.avatar}
            alt={profile.name}
            width={64}
            height={64}
            className="avatar-photo h-8 w-8 rounded-full border border-border object-cover object-center max-sm:!hidden"
          />
          <Magnetic>
            <a
              href={`mailto:${profile.email}`}
              className="btn-solid inline-flex h-8 items-center rounded-full bg-white px-3 text-[13px] font-semibold text-black no-underline hover:bg-neutral-200 hover:no-underline"
            >
              Hire me
            </a>
          </Magnetic>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden gh-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] ${
              tab.id === active
                ? 'bg-white font-medium text-black'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  )
}
