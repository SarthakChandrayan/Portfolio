import { LinkExternalIcon, MarkGithubIcon } from '@primer/octicons-react'
import { useState, type CSSProperties } from 'react'
import { skills, type Repo } from '../data/profile'
import { projectsUsing, usedAtWork } from '../lib/skills'

const allSkills = [
  ...skills.core.map((item) => item.name),
  ...skills.groups.flatMap((group) => group.items),
]
const usage = new Map(allSkills.map((name) => [name, projectsUsing(name)]))

export function SkillsPanel() {
  const [picked, setPicked] = useState<string | null>(null)
  const [shown, setShown] = useState<string | null>(null)
  const pick = (name: string) => {
    const next = picked === name ? null : name
    setPicked(next)
    if (next) setShown(next)
  }
  const used = shown ? (usage.get(shown) ?? []) : []
  const atWork = shown ? usedAtWork(shown) : false

  return (
    <section className="rounded-3xl border border-border bg-canvas-overlay/60 p-5 md:p-7">
      <p className="text-[14px] text-fg-muted">
        TypeScript · Node · React · React Native · Next.js · Python · PostgreSQL · MongoDB
      </p>
      <p className="mt-1 text-[12px] text-fg-subtle">
        Pick a skill to see where I&apos;ve used it.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {skills.core.map((item, index) => {
          const on = picked === item.name
          const count = usage.get(item.name)?.length ?? 0
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => pick(item.name)}
              className={`rise-in inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[14px] font-medium transition ${
                on
                  ? 'border-white bg-white text-black'
                  : 'border-border bg-canvas-subtle text-fg hover:border-white/40'
              }`}
              style={{ '--i': index * 0.5 } as CSSProperties}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: on ? '#111' : item.color,
                  boxShadow: on ? undefined : `0 0 8px ${item.color}88`,
                }}
              />
              {item.name}
              {count > 0 && (
                <span
                  className={`font-mono text-[11px] ${on ? 'text-black/50' : 'text-fg-subtle'}`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className={`expand ${picked ? 'is-open' : ''}`} inert={!picked}>
        <div>
          {shown && (
            <div
              key={shown}
              className="mt-5 rounded-2xl border border-white/20 bg-white/5 p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[15px] font-semibold text-fg">{shown}</p>
                <p className="font-mono text-[12px] text-fg-muted">
                  {used.length
                    ? `${used.length} project${used.length > 1 ? 's' : ''}`
                    : 'no public project yet'}
                  {atWork && ' · used at work'}
                </p>
              </div>
              {used.length > 0 ? (
                <ul className="stagger mt-3 grid gap-2 sm:grid-cols-2">
                  {used.map((repo, i) => (
                    <UsedIn key={repo.name} repo={repo} index={i} />
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[13px] text-fg-muted">
                  {atWork
                    ? 'This one shows up in my day-to-day work rather than a public repo.'
                    : 'Not in a public project yet. Ask me about it.'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-7 divide-y divide-border border-t border-border">
        {skills.groups.map((group) => (
          <div
            key={group.title}
            className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:gap-6"
          >
            <h3 className="w-[88px] shrink-0 text-[12px] font-medium tracking-wide text-fg-muted uppercase">
              {group.title}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => {
                const on = picked === item
                const count = usage.get(item)?.length ?? 0
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => pick(item)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] transition ${
                      on
                        ? 'border-white bg-white text-black'
                        : 'border-border text-fg hover:border-white/40 hover:bg-white/5'
                    }`}
                  >
                    {item}
                    {count > 0 && (
                      <span
                        className={`font-mono text-[10px] ${on ? 'text-black/50' : 'text-fg-subtle'}`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function UsedIn({ repo, index }: { repo: Repo; index: number }) {
  const link = repo.href ?? repo.github
  const body = (
    <>
      {repo.logo ? (
        <img
          src={repo.logo}
          alt=""
          className={
            repo.wideLogo
              ? 'h-5 w-auto shrink-0 object-contain object-left'
              : 'h-5 w-5 shrink-0 rounded-md object-cover'
          }
        />
      ) : (
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: repo.languageColor }}
        />
      )}
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-fg">
        {repo.name}
      </span>
      {repo.href ? (
        <LinkExternalIcon size={12} className="text-[#3fb950]" />
      ) : repo.github ? (
        <MarkGithubIcon size={12} className="text-fg-muted" />
      ) : (
        <span className="text-[11px] text-fg-subtle">
          {repo.private ? 'private' : 'no link'}
        </span>
      )}
    </>
  )

  return (
    <li style={{ '--i': index } as CSSProperties}>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-xl border border-border bg-canvas px-3 py-2 no-underline transition hover:border-white/40 hover:no-underline"
        >
          {body}
        </a>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-canvas px-3 py-2">
          {body}
        </div>
      )}
    </li>
  )
}
