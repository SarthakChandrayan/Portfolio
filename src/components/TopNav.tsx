import { MarkGithubIcon, SearchIcon } from '@primer/octicons-react'
import { profile, tabs, type TabId } from '../data/profile'
import { Magnetic } from './Motion'

type Props = {
  active: TabId
  onChange: (id: TabId) => void
  onSearch: () => void
}

export function TopNav({ active, onChange, onSearch }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-black md:bg-black/80 md:backdrop-blur-xl">
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

        <nav className="ml-2 hidden items-center rounded-full border border-border bg-canvas-subtle p-1 lg:flex">
          {tabs.map((tab) => {
            const isActive = tab.id === active
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                className={`rounded-full px-3 py-1.5 text-[13px] transition ${
                  isActive
                    ? 'bg-btn text-fg shadow-sm'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                {tab.label}
                {tab.count != null && (
                  <span className="ml-1.5 text-fg-subtle">{tab.count}</span>
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
            className="avatar-photo h-8 w-8 rounded-full border border-border object-cover object-center"
          />
          <Magnetic>
            <a
              href={`mailto:${profile.email}`}
              className="btn-solid hidden h-8 items-center rounded-full bg-white px-3 text-[13px] font-semibold text-black no-underline hover:bg-neutral-200 hover:no-underline sm:inline-flex"
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
