import {
  BookIcon,
  BriefcaseIcon,
  CodeIcon,
  CopyIcon,
  LinkExternalIcon,
  MarkGithubIcon,
  RepoIcon,
  SearchIcon,
  XIcon,
} from '@primer/octicons-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { profile, repos, type TabId } from '../data/profile'
import { copyText } from '../lib/toast'

type Props = {
  open: boolean
  onClose: () => void
  onSelectTab: (id: TabId) => void
}

export function CommandPalette({ open, onClose, onSelectTab }: Props) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      window.setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const actions = useMemo(() => {
    const base = [
      {
        id: 'overview',
        label: 'Go to Overview',
        hint: 'Tab',
        icon: BookIcon,
        run: () => onSelectTab('overview'),
      },
      {
        id: 'repositories',
        label: 'Go to Work',
        hint: 'Tab',
        icon: RepoIcon,
        run: () => onSelectTab('repositories'),
      },
      {
        id: 'experience',
        label: 'Go to Experience',
        hint: 'Tab',
        icon: BriefcaseIcon,
        run: () => onSelectTab('experience'),
      },
      {
        id: 'skills',
        label: 'Go to Skills',
        hint: 'Tab',
        icon: CodeIcon,
        run: () => onSelectTab('skills'),
      },
      {
        id: 'github',
        label: 'Open GitHub profile',
        hint: 'External',
        icon: MarkGithubIcon,
        run: () => window.open(profile.github, '_blank'),
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        hint: 'External',
        icon: LinkExternalIcon,
        run: () => window.open(profile.linkedin, '_blank'),
      },
      {
        id: 'email',
        label: `Copy ${profile.email}`,
        hint: 'Clipboard',
        icon: CopyIcon,
        run: () => void copyText(profile.email, 'Email copied'),
      },
      ...repos.map((repo) => ({
        id: `repo-${repo.name}`,
        label: repo.name,
        hint: repo.language,
        icon: RepoIcon,
        run: () => {
          onSelectTab('repositories')
          if (repo.href) window.open(repo.href, '_blank')
        },
      })),
    ]
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q),
    )
  }, [onSelectTab, query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#010409cc] p-4 pt-[12vh]">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close search"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[640px] overflow-hidden rounded-xl border border-border bg-canvas-overlay shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border px-3">
          <SearchIcon size={16} className="text-fg-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((i) => Math.min(actions.length - 1, i + 1))
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((i) => Math.max(0, i - 1))
              }
              if (e.key === 'Enter' && actions[active]) {
                e.preventDefault()
                actions[active].run()
                onClose()
              }
            }}
            placeholder="Search tabs, projects, contact…"
            className="h-12 flex-1 bg-transparent text-[16px] text-fg outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-fg-muted hover:text-fg"
            aria-label="Close"
          >
            <XIcon size={16} />
          </button>
        </div>
        <ul className="max-h-[360px] overflow-auto py-2">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <li key={action.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => {
                    action.run()
                    onClose()
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${
                    index === active ? 'bg-btn' : 'hover:bg-btn'
                  }`}
                >
                  <Icon size={16} className="text-fg-muted" />
                  <span className="flex-1 text-[14px] text-fg">
                    {action.label}
                  </span>
                  <span className="text-[12px] text-fg-subtle">{action.hint}</span>
                </button>
              </li>
            )
          })}
          {actions.length === 0 && (
            <li className="px-4 py-6 text-center text-fg-muted">
              No results for “{query}”
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
