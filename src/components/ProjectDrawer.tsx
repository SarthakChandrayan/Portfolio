import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadIcon,
  LinkExternalIcon,
  LockIcon,
  MarkGithubIcon,
  RepoIcon,
  XIcon,
} from '@primer/octicons-react'
import { useEffect, useRef, type CSSProperties } from 'react'
import { repos } from '../data/profile'
import { repoStatus, topicColors } from '../lib/repo'
import { RepoTitle } from './PinnedRepos'

type Props = {
  open: boolean
  index: number
  onClose: () => void
  onIndex: (index: number) => void
}

const wrap = (i: number) => (i + repos.length) % repos.length

export function ProjectDrawer({ open, index, onClose, onIndex }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const repo = repos[index]
  const prev = repos[wrap(index - 1)]
  const next = repos[wrap(index + 1)]
  const status = repoStatus(repo)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex(wrap(index + 1))
      if (e.key === 'ArrowLeft') onIndex(wrap(index - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, index, onClose, onIndex])

  useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = overflow
    }
  }, [open])

  return (
    <div className={`drawer ${open ? 'is-open' : ''}`} inert={!open}>
      <button
        type="button"
        className="drawer-backdrop"
        aria-label="Close project"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={repo.name}
        tabIndex={-1}
        className="drawer-panel outline-none"
      >
        <div className="drawer-grip md:hidden" aria-hidden />
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <span className="font-mono text-[12px] text-fg-subtle">
            project {String(index + 1).padStart(2, '0')}
            <span className="text-border"> / </span>
            {String(repos.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-border text-fg-muted transition hover:border-fg-subtle hover:text-fg"
            aria-label="Close"
          >
            <XIcon size={16} />
          </button>
        </div>

        <div key={index} className="drawer-body gh-scrollbar flex-1 overflow-y-auto px-5 py-6 md:px-7">
          <div className="drawer-swap" style={{ '--i': 0 } as CSSProperties}>
            <div className="flex items-center gap-3">
              {repo.logo ? (
                <img
                  src={repo.logo}
                  alt=""
                  className={
                    repo.wideLogo
                      ? 'h-9 w-auto object-contain object-left'
                      : 'h-11 w-11 rounded-xl object-cover'
                  }
                />
              ) : (
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-canvas-subtle text-fg-muted">
                  {repo.private ? <LockIcon size={20} /> : <RepoIcon size={20} />}
                </span>
              )}
              <span
                className="rounded-full border px-2.5 py-0.5 text-[12px] font-medium"
                style={{
                  color: status.color,
                  borderColor: `${status.color}55`,
                  background: `${status.color}14`,
                }}
              >
                {status.label}
              </span>
            </div>
            <h3 className="mt-4 text-[28px] leading-tight font-semibold tracking-tight text-fg md:text-[32px]">
              <RepoTitle name={repo.name} />
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-fg-muted">
              {repo.description}
            </p>
          </div>

          <div className="drawer-swap mt-7" style={{ '--i': 1 } as CSSProperties}>
            <p className="font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
              What I built
            </p>
            <ul className="mt-3 space-y-3">
              {repo.highlights.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] text-fg">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3fb950] shadow-[0_0_8px_#3fb950]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="drawer-swap mt-7" style={{ '--i': 2 } as CSSProperties}>
            <p className="font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
              Stack
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px]"
                style={{
                  color: repo.languageColor,
                  borderColor: `${repo.languageColor}66`,
                  background: `${repo.languageColor}18`,
                }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: repo.languageColor }} />
                {repo.language}
              </span>
              {repo.topics.map((topic) => {
                const color = topicColors[topic] ?? '#79c0ff'
                return (
                  <span
                    key={topic}
                    className="rounded-full border px-3 py-1 text-[13px]"
                    style={{ color, borderColor: `${color}55`, background: `${color}12` }}
                  >
                    {topic}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="drawer-swap mt-8 flex flex-wrap gap-2" style={{ '--i': 3 } as CSSProperties}>
            {repo.href && (
              <a
                href={repo.href}
                target="_blank"
                rel="noreferrer"
                className="btn-solid inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-semibold text-black no-underline hover:bg-neutral-200 hover:no-underline"
              >
                <LinkExternalIcon size={16} />
                Visit live site
              </a>
            )}
            {repo.download && (
              <a
                href={repo.download.href}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-5 text-[14px] font-medium text-fg no-underline transition hover:border-fg-subtle hover:bg-btn hover:no-underline"
              >
                <DownloadIcon size={16} />
                {repo.download.label}
              </a>
            )}
            {repo.github && (
              <a
                href={repo.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-5 text-[14px] font-medium text-fg no-underline transition hover:border-fg-subtle hover:bg-btn hover:no-underline"
              >
                <MarkGithubIcon size={16} />
                View source
              </a>
            )}
            {!repo.href && !repo.github && (
              <p className="text-[14px] text-fg-muted">
                {repo.private
                  ? "Private client work, so there's no public link. Happy to walk through it in a conversation."
                  : 'No public link yet. Happy to walk through it in a conversation.'}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-border">
          <button
            type="button"
            onClick={() => onIndex(wrap(index - 1))}
            className="group flex items-center gap-3 px-5 py-4 text-left transition hover:bg-white/5"
          >
            <ArrowLeftIcon size={16} className="shrink-0 text-fg-muted transition group-hover:-translate-x-0.5 group-hover:text-fg" />
            <span className="min-w-0">
              <span className="block font-mono text-[11px] text-fg-subtle">prev · ←</span>
              <span className="block truncate text-[14px] font-medium text-fg">{prev.name}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => onIndex(wrap(index + 1))}
            className="group flex items-center justify-end gap-3 border-l border-border px-5 py-4 text-right transition hover:bg-white/5"
          >
            <span className="min-w-0">
              <span className="block font-mono text-[11px] text-fg-subtle">next · →</span>
              <span className="block truncate text-[14px] font-medium text-fg">{next.name}</span>
            </span>
            <ArrowRightIcon size={16} className="shrink-0 text-fg-muted transition group-hover:translate-x-0.5 group-hover:text-fg" />
          </button>
        </div>
      </div>
    </div>
  )
}
