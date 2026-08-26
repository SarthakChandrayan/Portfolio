import { useState } from 'react'
import { skills } from '../data/profile'
import { TiltCard } from './Motion'

export function SkillsPanel() {
  const [active, setActive] = useState(skills.languages[0]?.name ?? '')

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-canvas-overlay/60 p-5 md:p-8">
        <h2 className="text-[28px] font-semibold tracking-tight text-fg md:text-[32px]">
          Languages
        </h2>
        <p className="mt-1 mb-8 text-[16px] text-fg-muted">
          <span className="md:hidden">Tap a language to highlight it.</span>
          <span className="hidden md:inline">Click a language to highlight it.</span>
        </p>

        <div className="space-y-6">
          {skills.languages.map((lang) => {
            const on = active === lang.name
            return (
              <button
                key={lang.name}
                type="button"
                onClick={() => setActive(lang.name)}
                className={`block w-full rounded-2xl border p-4 text-left transition md:p-5 ${
                  on
                    ? 'border-white bg-white/10'
                    : 'border-border hover:border-white/40'
                }`}
              >
                <div className="mb-3 flex items-end justify-between gap-4">
                  <span className="text-[22px] font-semibold tracking-tight md:text-[26px]">
                    {lang.name}
                  </span>
                  <span className="font-mono text-[20px] text-fg-muted md:text-[24px]">
                    {lang.pct}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10 md:h-4">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: on ? `${lang.pct}%` : `${Math.max(lang.pct - 8, 12)}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <TopicBlock title="Frameworks & libraries" items={skills.frameworks} />
      <TopicBlock title="Backend & APIs" items={skills.backend} />
      <TopicBlock title="Frontend" items={skills.frontend} />
      <TopicBlock title="AI & data" items={skills.ai} />
      <TopicBlock title="Databases & ORM" items={skills.data} />
      <TopicBlock title="Developer tools" items={skills.tools} />
      <TopicBlock title="Product & QA" items={skills.product} />
    </div>
  )
}

function TopicBlock({ title, items }: { title: string; items: string[] }) {
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <section className="rounded-3xl border border-border bg-canvas-overlay/60 p-5 md:p-8">
      <h2 className="mb-6 text-[28px] font-semibold tracking-tight text-fg md:text-[32px]">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const on = picked === item
          return (
            <TiltCard
              key={item}
              tilt={false}
              className={`rounded-2xl border ${on ? 'border-white' : 'border-border'}`}
            >
              <button
                type="button"
                onClick={() => setPicked(on ? null : item)}
                className={`flex min-h-[88px] w-full items-center justify-center px-5 py-6 text-[18px] font-semibold tracking-tight transition md:min-h-[104px] md:text-[20px] ${
                  on ? 'bg-white text-black' : 'bg-transparent text-fg hover:bg-white/5'
                }`}
              >
                {item}
              </button>
            </TiltCard>
          )
        })}
      </div>
      {picked && (
        <p className="mt-5 text-[16px] text-fg-muted">
          Selected <span className="text-fg">{picked}</span> — part of the daily
          toolkit at Thravos.
        </p>
      )}
    </section>
  )
}
