import { useState } from 'react'
import { skills } from '../data/profile'

export function SkillsPanel() {
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <section className="rounded-3xl border border-border bg-canvas-overlay/60 p-5 md:p-7">
      <h2 className="text-[22px] font-semibold tracking-tight text-fg md:text-[26px]">
        Stack
      </h2>
      <p className="mt-1 text-[14px] text-fg-muted">
        TypeScript · Node · React Native · Next.js · MongoDB · Stripe
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {skills.core.map((item) => {
          const on = picked === item.name
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => setPicked(on ? null : item.name)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[14px] font-medium transition ${
                on
                  ? 'border-white bg-white text-black'
                  : 'border-border bg-canvas-subtle text-fg hover:border-white/40'
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: on ? '#111' : item.color }}
              />
              {item.name}
            </button>
          )
        })}
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
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPicked(on ? null : item)}
                    className={`rounded-full border px-2.5 py-1 text-[13px] transition ${
                      on
                        ? 'border-white bg-white text-black'
                        : 'border-border text-fg hover:border-white/40 hover:bg-white/5'
                    }`}
                  >
                    {item}
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
