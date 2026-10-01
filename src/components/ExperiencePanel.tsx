import { ChevronDownIcon } from '@primer/octicons-react'
import { useState, type CSSProperties } from 'react'
import { experience } from '../data/profile'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function monthIndex(label: string, now: Date) {
  if (/present/i.test(label)) return now.getFullYear() * 12 + now.getMonth()
  const [month = '', year = ''] = label.trim().split(/\s+/)
  return Number(year) * 12 + MONTHS.indexOf(month.slice(0, 3))
}

function span(period: string, now: Date) {
  const [from = '', to = ''] = period.split(/\s*[–-]\s*/)
  return { start: monthIndex(from, now), end: monthIndex(to, now) }
}

function formatMonths(months: number) {
  if (!Number.isFinite(months) || months <= 0) return ''
  const years = Math.floor(months / 12)
  const rest = months % 12
  return [
    years && `${years} yr${years > 1 ? 's' : ''}`,
    rest && `${rest} mo${rest > 1 ? 's' : ''}`,
  ]
    .filter(Boolean)
    .join(' ')
}

export function ExperiencePanel() {
  const [open, setOpen] = useState(
    experience[0] ? `${experience[0].title}-${experience[0].period}` : '',
  )
  const now = new Date()
  const spans = experience.map((role) => span(role.period, now))
  const total = formatMonths(
    Math.max(...spans.map((s) => s.end)) - Math.min(...spans.map((s) => s.start)) + 1,
  )

  return (
    <div className="space-y-8">
      <section>
        {total && (
          <p className="mb-4 font-mono text-[12px] text-fg-muted">
            {total} of professional experience
          </p>
        )}
        <ol className="relative space-y-4 pl-6">
          <span
            aria-hidden
            className="timeline-draw absolute top-2 bottom-2 left-0 w-px bg-linear-to-b from-white via-border to-border"
          />
          {experience.map((role, index) => {
            const id = `${role.title}-${role.period}`
            const expanded = open === id
            const { start, end } = spans[index]
            const length = formatMonths(end - start + 1)
            const order = { '--i': index } as CSSProperties
            return (
              <li key={id} className="rise-in relative" style={order}>
                <span
                  className="dot-pop absolute top-3 -left-[29.5px] flex h-3 w-3"
                  style={order}
                >
                  {role.current && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
                  )}
                  <span
                    className={`relative h-3 w-3 rounded-full border-2 ${
                      role.current
                        ? 'border-white bg-white shadow-[0_0_12px_rgba(255,255,255,0.55)]'
                        : expanded
                          ? 'border-white bg-canvas'
                          : 'border-border bg-canvas'
                    }`}
                  />
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? '' : id)}
                  className={`w-full rounded-3xl border bg-canvas-overlay/70 p-4 text-left transition-colors tap-press hover:border-fg-subtle ${
                    expanded ? 'border-white/30' : 'border-border'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-[12px] text-fg-muted">
                        {role.period}
                        {length && (
                          <span className="text-fg-subtle"> · {length}</span>
                        )}
                      </div>
                      <h3 className="text-[16px] font-semibold text-fg">
                        {role.title}
                        <span className="font-normal text-fg-muted"> · </span>
                        <a
                          href={role.companyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {role.company}
                        </a>
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {role.current && (
                        <span className="rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-[12px] text-fg">
                          Now
                        </span>
                      )}
                      <ChevronDownIcon
                        size={16}
                        className={`text-fg-muted transition duration-300 ${expanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                  <div className={`expand ${expanded ? 'is-open' : ''}`} inert={!expanded}>
                    <div>
                      <div className="stagger mt-3 space-y-1.5 border-t border-border pt-3">
                        {role.summary && (
                          <p className="pb-1.5 text-[14px] text-fg-muted">{role.summary}</p>
                        )}
                        {role.bullets.map((bullet, i) => (
                          <p
                            key={bullet}
                            className="flex gap-2 text-[14px] text-fg"
                            style={{ '--i': i + (role.summary ? 1 : 0) } as CSSProperties}
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                            {bullet}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
