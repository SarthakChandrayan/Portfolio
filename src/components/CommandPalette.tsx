import {
  BookIcon,
  BriefcaseIcon,
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  LinkExternalIcon,
  MarkGithubIcon,
  RepoIcon,
  SearchIcon,
  XIcon,
  type Icon,
} from '@primer/octicons-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { profile, repos, type TabId } from '../data/profile'
import { copyText } from '../lib/toast'

type Props = {
  open: boolean
  onClose: () => void
  onSelectTab: (id: TabId) => void
}

type Action = {
  id: string
  group: 'Navigate' | 'Projects' | 'Contact'
  label: string
  hint: string
  icon: Icon
  run: () => void
}

function fuzzy(label: string, query: string): number[] | null {
  const text = label.toLowerCase()
  const start = text.indexOf(query)
  if (start !== -1) return Array.from(query, (_, i) => start + i)
  const hits: number[] = []
  let from = 0
  for (const ch of query) {
    const at = text.indexOf(ch, from)
    if (at === -1) return null
    hits.push(at)
    from = at + 1
  }
  return hits
}

function Highlight({ text, hits }: { text: string; hits: number[] }) {
  if (!hits.length) return <>{text}</>
  const marked = new Set(hits)
  const runs: { text: string; on: boolean }[] = []
  Array.from(text).forEach((ch, i) => {
    const on = marked.has(i)
    const last = runs[runs.length - 1]
    if (last && last.on === on) last.text += ch
    else runs.push({ text: ch, on })
  })
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {runs.map((run, i) =>
          run.on ? (
            <mark
              key={i}
              className="bg-transparent font-semibold text-white underline decoration-white/40 underline-offset-2"
            >
              {run.text}
            </mark>
          ) : (
            <span key={i}>{run.text}</span>
          ),
        )}
      </span>
    </>
  )
}

export function CommandPalette({ open, onClose, onSelectTab }: Props) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

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
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const actions = useMemo(() => {
    const base: Action[] = [
      {
        id: 'overview',
        group: 'Navigate',
        label: 'Go to Overview',
        hint: 'Tab',
        icon: BookIcon,
        run: () => onSelectTab('overview'),
      },
      {
        id: 'repositories',
        group: 'Navigate',
        label: 'Go to Work',
        hint: 'Tab',
        icon: RepoIcon,
        run: () => onSelectTab('repositories'),
      },
      {
        id: 'experience',
        group: 'Navigate',
        label: 'Go to Experience',
        hint: 'Tab',
        icon: BriefcaseIcon,
        run: () => onSelectTab('experience'),
      },
      {
        id: 'skills',
        group: 'Navigate',
        label: 'Go to Skills',
        hint: 'Tab',
        icon: CodeIcon,
        run: () => onSelectTab('skills'),
      },
      ...repos.map(
        (repo): Action => ({
          id: `repo-${repo.name}`,
          group: 'Projects',
          label: repo.name,
          hint: repo.href ? 'Live' : repo.github ? 'GitHub' : repo.language,
          icon: repo.href ? LinkExternalIcon : RepoIcon,
          run: () => {
            onSelectTab('repositories')
            const link = repo.href ?? repo.github
            if (link) window.open(link, '_blank')
          },
        }),
      ),
      {
        id: 'github',
        group: 'Contact',
        label: 'Open GitHub profile',
        hint: 'External',
        icon: MarkGithubIcon,
        run: () => window.open(profile.github, '_blank'),
      },
      {
        id: 'linkedin',
        group: 'Contact',
        label: 'Open LinkedIn',
        hint: 'External',
        icon: LinkExternalIcon,
        run: () => window.open(profile.linkedin, '_blank'),
      },
      {
        id: 'resume',
        group: 'Contact',
        label: 'Open résumé (PDF)',
        hint: 'Resume',
        icon: DownloadIcon,
        run: () => window.open(encodeURI(profile.resume), '_blank'),
      },
      {
        id: 'email',
        group: 'Contact',
        label: `Copy ${profile.email}`,
        hint: 'Clipboard',
        icon: CopyIcon,
        run: () => void copyText(profile.email, 'Email copied'),
      },
    ]
    const q = query.trim().toLowerCase()
    if (!q) return base.map((action) => ({ action, hits: [] as number[] }))
    return base
      .map((action) => ({ action, hits: fuzzy(action.label, q) }))
      .filter(
        (item) => item.hits !== null || item.action.hint.toLowerCase().includes(q),
      )
      .map((item) => ({ action: item.action, hits: item.hits ?? [] }))
  }, [onSelectTab, query])

  if (!open) return null

  const runAt = (index: number) => {
    const item = actions[index]
    if (!item) return
    item.action.run()
    onClose()
  }

  return (
    <div className="fade-in fixed inset-0 z-50 flex items-start justify-center bg-[#010409cc] p-4 pt-[12vh] backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close search"
        onClick={onClose}
      />
      <div className="palette-in relative w-full max-w-[640px] overflow-hidden rounded-xl border border-border bg-canvas-overlay shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)]">
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
              if (e.key === 'Enter') {
                e.preventDefault()
                runAt(active)
              }
            }}
            placeholder="Search tabs, projects, contact…"
            spellCheck={false}
            autoComplete="off"
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
        <ul ref={listRef} className="gh-scrollbar max-h-[360px] overflow-auto py-2">
          {actions.map(({ action, hits }, index) => {
            const Icon = action.icon
            const isActive = index === active
            const newGroup = index === 0 || actions[index - 1].action.group !== action.group
            return (
              <li key={action.id}>
                {newGroup && (
                  <p className="px-4 pt-2 pb-1 font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
                    {action.group}
                  </p>
                )}
                <button
                  type="button"
                  data-index={index}
                  onMouseMove={() => setActive(index)}
                  onClick={() => runAt(index)}
                  className={`relative flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    isActive ? 'bg-btn' : 'hover:bg-btn'
                  }`}
                >
                  <span
                    className={`absolute top-1.5 bottom-1.5 left-0 w-[2px] rounded-full bg-white transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <Icon size={16} className={isActive ? 'text-fg' : 'text-fg-muted'} />
                  <span className="flex-1 text-[14px] text-fg-muted">
                    <span className={isActive ? 'text-fg' : undefined}>
                      <Highlight text={action.label} hits={hits} />
                    </span>
                  </span>
                  <span className="text-[12px] text-fg-subtle">{action.hint}</span>
                  <kbd
                    className={`rounded border border-border px-1.5 font-mono text-[11px] text-fg-muted transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    ↵
                  </kbd>
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
        <div className="hidden items-center gap-4 border-t border-border px-4 py-2 font-mono text-[11px] text-fg-subtle sm:flex">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
          <span className="ml-auto">⌘K / Ctrl+K</span>
        </div>
      </div>
    </div>
  )
}
