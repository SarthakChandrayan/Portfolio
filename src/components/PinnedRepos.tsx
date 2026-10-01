import {
  ArrowRightIcon,
  LinkExternalIcon,
  LockIcon,
  MarkGithubIcon,
  RepoIcon,
} from '@primer/octicons-react'
import { useState, type CSSProperties } from 'react'
import { repos, type Repo } from '../data/profile'
import { repoFilters, repoStatus, topicColors, type RepoFilter } from '../lib/repo'
import { TiltCard, useDesktopLayout } from './Motion'

export function ProjectFilters({
  value,
  onChange,
}: {
  value: RepoFilter
  onChange: (value: RepoFilter) => void
}) {
  return (
    <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-1.5">
      {repoFilters.map((filter) => {
        const on = value === filter.id
        const count = repos.filter(filter.test).length
        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(filter.id)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] transition ${
              on
                ? 'border-white bg-white font-medium text-black'
                : 'border-border text-fg-muted hover:border-white/40 hover:text-fg'
            }`}
          >
            {filter.label}
            <span className={`font-mono text-[11px] ${on ? 'text-black/45' : 'text-fg-subtle'}`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function PinnedRepos({
  filter,
  onOpen,
}: {
  filter: RepoFilter
  onOpen: (index: number) => void
}) {
  const test = repoFilters.find((f) => f.id === filter)?.test ?? (() => true)
  const shown = repos
    .map((repo, index) => ({ repo, index }))
    .filter(({ repo }) => test(repo))

  return (
    <div key={filter} className="grid gap-4 md:grid-cols-2">
      {shown.map(({ repo, index }, order) => (
        <RepoCard
          key={repo.name}
          repo={repo}
          order={order}
          onOpen={() => onOpen(index)}
        />
      ))}
    </div>
  )
}

export function RepoTitle({ name }: { name: string }) {
  const match = name.match(/^(.*?)(\s*\(.*\))$/)
  if (!match) return name
  return (
    <>
      {match[1]}
      <span className="font-normal text-fg-muted">{match[2]}</span>
    </>
  )
}

function RepoCard({
  repo,
  order,
  onOpen,
}: {
  repo: Repo
  order: number
  onOpen: () => void
}) {
  const [hot, setHot] = useState(false)
  const [topicHover, setTopicHover] = useState<string | null>(null)
  const desktop = useDesktopLayout()
  const lit = desktop ? hot : true
  const status = repoStatus(repo)

  return (
    <TiltCard
      className="rise-in group/card rounded-3xl border border-border bg-canvas-overlay/70 transition-colors hover:border-white/25"
      style={{ '--i': order } as CSSProperties}
    >
      <article
        className="relative flex h-full flex-col p-4"
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => {
          setHot(false)
          setTopicHover(null)
        }}
      >
        {/* Whole-card hit area; the GitHub/Live links sit above it. */}
        <button
          type="button"
          onClick={onOpen}
          className="absolute inset-0 z-0 rounded-3xl"
          aria-label={`Open ${repo.name} details`}
        />

        <div className="pointer-events-none relative flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {repo.logo ? (
              <img
                src={repo.logo}
                alt=""
                className={
                  repo.wideLogo
                    ? 'h-6 w-auto shrink-0 object-contain object-left'
                    : 'h-6 w-6 shrink-0 rounded-md object-cover'
                }
              />
            ) : repo.private ? (
              <span style={{ color: lit ? '#d29922' : '#9198a1' }}>
                <LockIcon size={16} />
              </span>
            ) : (
              <span style={{ color: lit ? '#58a6ff' : '#9198a1' }}>
                <RepoIcon size={16} />
              </span>
            )}
            <span
              className="truncate text-[15px] font-semibold"
              style={{ color: lit ? '#58a6ff' : '#f0f6fc' }}
            >
              <RepoTitle name={repo.name} />
            </span>
          </div>
          <span
            className="shrink-0 rounded-full border px-2 py-0.5 text-[11px]"
            style={{
              borderColor: lit ? `${status.color}66` : '#3d444d',
              color: lit ? status.color : '#9198a1',
            }}
          >
            {status.label}
          </span>
        </div>
        <p className="pointer-events-none relative mt-2 text-[13px] text-fg-muted">
          {repo.description}
        </p>

        <div className="pointer-events-none relative mt-auto flex flex-wrap items-center gap-2 pt-4 text-[12px] text-fg-muted">
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{
                background: lit ? repo.languageColor : 'rgba(240,246,252,0.7)',
              }}
            />
            <span style={{ color: lit ? repo.languageColor : undefined }}>
              {repo.language}
            </span>
          </span>
          {repo.topics.slice(0, 3).map((topic) => {
            const color = topicColors[topic] ?? '#79c0ff'
            const on = lit || topicHover === topic
            return (
              <span
                key={topic}
                className="pointer-events-auto cursor-pointer rounded-full border px-2 py-0.5 text-[11px] font-medium"
                onClick={onOpen}
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
          <span className="ml-auto inline-flex items-center gap-3">
            {repo.github && (
              <a
                href={repo.github}
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto inline-flex items-center gap-1 no-underline"
                style={{ color: lit ? '#f0f6fc' : '#9198a1' }}
                aria-label={`${repo.name} on GitHub`}
              >
                <MarkGithubIcon size={12} />
                <span className="max-sm:hidden">GitHub</span>
              </a>
            )}
            {repo.href && (
              <a
                href={repo.href}
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto inline-flex items-center gap-1 no-underline"
                style={{ color: lit ? '#3fb950' : '#9198a1' }}
                aria-label={`${repo.name} live site`}
              >
                <LinkExternalIcon size={12} />
                <span className="max-sm:hidden">Live</span>
              </a>
            )}
            <span
              className="inline-flex items-center gap-1 text-fg transition-all md:translate-x-[-4px] md:opacity-0 md:group-hover/card:translate-x-0 md:group-hover/card:opacity-100"
            >
              Details
              <ArrowRightIcon size={12} />
            </span>
          </span>
        </div>
      </article>
    </TiltCard>
  )
}
