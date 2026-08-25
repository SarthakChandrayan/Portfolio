import { ChevronDownIcon } from '@primer/octicons-react'
import { useState } from 'react'
import { experience } from '../data/profile'

export function ExperiencePanel() {
  const [open, setOpen] = useState(
    experience[0] ? `${experience[0].title}-${experience[0].period}` : '',
  )

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-[18px] font-semibold tracking-tight text-fg">
          Timeline
        </h2>
        <ol className="relative space-y-4 border-l border-border pl-6">
          {experience.map((role) => {
            const id = `${role.title}-${role.period}`
            const expanded = open === id
            return (
              <li key={id} className="relative">
                <span
                  className={`absolute top-3 -left-[29px] h-3 w-3 rounded-full border-2 ${
                    role.current
                      ? 'border-white bg-white shadow-[0_0_12px_rgba(255,255,255,0.55)]'
                      : 'border-border bg-canvas'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? '' : id)}
                  className="w-full rounded-3xl border border-border bg-canvas-overlay/70 p-4 text-left hover:border-fg-subtle"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-[12px] text-fg-muted">{role.period}</div>
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
                        className={`text-fg-muted transition ${expanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                  {expanded && (
                    <ul className="mt-3 space-y-1.5 border-t border-border pt-3 text-[14px] text-fg">
                      {role.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
