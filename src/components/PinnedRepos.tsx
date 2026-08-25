import {
  ChevronDownIcon,
  LinkExternalIcon,
  LockIcon,
  RepoIcon,
} from '@primer/octicons-react'
import { useState } from 'react'
import { repos, type Repo } from '../data/profile'
import { TiltCard } from './Motion'

type Props = {
  query?: string
  language?: string
  compact?: boolean
}

export function PinnedRepos({
  query = '',
  language = 'all',
  compact = false,
}: Props) {
  const filtered = repos.filter((repo) => {
    const q = query.trim().toLowerCase()
    const langOk = language === 'all' || repo.language === language
    if (!langOk) return false
    if (!q) return true
    return (
      repo.name.toLowerCase().includes(q) ||
      repo.description.toLowerCase().includes(q) ||
      repo.language.toLowerCase().includes(q) ||
      repo.topics.some((t) => t.includes(q))
    )
  })

  return (
    <section>
      {!compact && (
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[18px] font-semibold tracking-tight text-fg">
            Featured work
          </h2>
          <span className="text-[12px] text-fg-muted">
            {filtered.length} projects · click a card
          </span>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
        {filtered.length === 0 && (
          <p className="text-fg-muted">No projects matched that search.</p>
        )}
      </div>
    </section>
  )
}

const topicColors: Record<string, string> = {
  nextjs: '#58a6ff',
  langchain: '#a371f7',
  prisma: '#3fb950',
  rag: '#d2a8ff',
  vercel: '#f0f6fc',
  react: '#58a6ff',
  nodejs: '#3fb950',
  subscriptions: '#79c0ff',
  marketplace: '#f0f6fc',
  mongodb: '#3fb950',
  api: '#79c0ff',
  leaderboard: '#d2a8ff',
}

function RepoCard({ repo }: { repo: Repo }) {
  const [open, setOpen] = useState(false)
  const [hot, setHot] = useState(false)
  const [topicHover, setTopicHover] = useState<string | null>(null)

  return (
    <TiltCard className="rounded-3xl border border-border bg-canvas-overlay/70">
      <article
        className="p-4"
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => {
          setHot(false)
          setTopicHover(null)
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full text-left"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {repo.private ? (
                <span style={{ color: hot ? '#d29922' : '#9198a1' }}>
                  <LockIcon size={16} />
                </span>
              ) : (
                <span style={{ color: hot ? '#58a6ff' : '#9198a1' }}>
                  <RepoIcon size={16} />
                </span>
              )}
              <span
                className="truncate text-[15px] font-semibold"
                style={{ color: hot ? '#58a6ff' : '#f0f6fc' }}
              >
                {repo.name}
              </span>
            </div>
            <span
              className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]"
              style={{
                borderColor: hot ? 'rgba(88,166,255,0.45)' : '#3d444d',
                color: hot ? '#79c0ff' : '#9198a1',
              }}
            >
              {repo.private ? 'Private' : 'Public'}
              <ChevronDownIcon
                size={12}
                className={`transition ${open ? 'rotate-180' : ''}`}
              />
            </span>
          </div>
          <p className="mt-2 text-[13px] text-fg-muted">{repo.description}</p>
        </button>

        {open && (
          <ul className="mt-3 space-y-1.5 border-t border-border pt-3 text-[13px] text-fg">
            {repo.highlights.map((item) => (
              <li key={item} className="flex gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: hot ? '#3fb950' : '#f0f6fc' }}
                />
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-fg-muted">
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{
                background: hot ? repo.languageColor : 'rgba(240,246,252,0.7)',
              }}
            />
            <span style={{ color: hot ? repo.languageColor : undefined }}>
              {repo.language}
            </span>
          </span>
          {repo.topics.slice(0, 3).map((topic) => {
            const color = topicColors[topic] ?? '#79c0ff'
            const on = hot || topicHover === topic
            return (
              <span
                key={topic}
                className="rounded-full border px-2 py-0.5 text-[11px] font-medium"
                style={{
                  borderColor: on ? `${color}66` : 'rgba(255,255,255,0.15)',
                  background: on ? `${color}18` : 'rgba(255,255,255,0.05)',
                  color: on ? color : '#9198a1',
                }}
                onMouseEnter={() => setTopicHover(topic)}
                onMouseLeave={() => setTopicHover(null)}
              >
                {topic}
              </span>
            )
          })}
          {repo.href && (
            <a
              href={repo.href}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1 no-underline"
              style={{ color: hot ? '#3fb950' : '#9198a1' }}
              onClick={(e) => e.stopPropagation()}
            >
              <LinkExternalIcon size={12} />
              Live
            </a>
          )}
        </div>
      </article>
    </TiltCard>
  )
}
