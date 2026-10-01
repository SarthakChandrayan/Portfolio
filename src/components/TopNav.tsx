import { MarkGithubIcon, SearchIcon } from '@primer/octicons-react'
import { profile } from '../data/profile'
import { scrollToSection } from '../lib/nav'
import { Magnetic } from './Motion'

type Props = {
  onSearch: () => void
  onShortcuts: () => void
}

export function TopNav({ onSearch, onShortcuts }: Props) {
  return (
    <header className="page-fade sticky top-0 z-40 border-b border-border/80 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3 md:px-8">
        <button
          type="button"
          onClick={() => scrollToSection('about')}
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
          <button
            type="button"
            onClick={onShortcuts}
            className="hidden h-8 w-8 place-items-center rounded-full border border-border font-mono text-[13px] text-fg-muted hover:border-fg-subtle hover:text-fg md:grid"
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts (?)"
          >
            ?
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
    </header>
  )
}
