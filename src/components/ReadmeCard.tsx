import { useEffect, useState } from 'react'
import { TiltCard } from './Motion'
import { profile } from '../data/profile'

const stack = [
  { name: 'React', color: '#58a6ff' },
  { name: 'Next.js', color: '#f0f6fc' },
  { name: 'Angular', color: '#f85149' },
  { name: 'Node.js', color: '#3fb950' },
  { name: 'TypeScript', color: '#79c0ff' },
  { name: 'Prisma', color: '#a371f7' },
  { name: 'MongoDB', color: '#3fb950' },
]

export function ReadmeCard() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <AboutCard />
      <TerminalCard />
    </div>
  )
}

function AboutCard() {
  return (
    <TiltCard tilt={false} className="rounded-3xl border border-border bg-canvas-overlay/80">
      <div className="p-5 md:p-6">
        <p className="font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
          About
        </p>
        <h2 className="mt-1 text-[24px] font-semibold tracking-tight">
          Hi, I&apos;m Sarthak
        </h2>
        <p className="mt-3 text-[15px] text-fg-muted">
          <strong className="text-fg">{profile.title}</strong> at{' '}
          <a href={profile.companyUrl} target="_blank" rel="noreferrer">
            {profile.company}
          </a>
          . {profile.bio} {profile.summary}
        </p>
        <ul className="mt-4 space-y-2 text-[14px] text-fg">
          <li>
            Currently building marketplace, coaching, and athlete-engagement
            systems at Thravos
          </li>
          <li>
            Focused on React, Next.js, Angular, Node.js, and high-performance
            frontend architecture
          </li>
          <li>
            {profile.email} ·{' '}
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </TiltCard>
  )
}

function TerminalCard() {
  const [step, setStep] = useState(0)
  const [typed, setTyped] = useState('')
  const [hot, setHot] = useState(false)
  const [stackHover, setStackHover] = useState<string | null>(null)

  const commands = [
    {
      q: 'whoami',
      output: (
        <>
          <span style={{ color: hot ? '#3fb950' : undefined }}>
            {profile.name}
          </span>
          {' — '}
          <span style={{ color: hot ? '#79c0ff' : undefined }}>
            {profile.title}
          </span>
          {' @ '}
          <span style={{ color: hot ? '#d2a8ff' : undefined }}>
            {profile.company}
          </span>
        </>
      ),
    },
    {
      q: 'cat focus.md',
      output: (
        <span style={{ color: hot ? '#a5d6ff' : undefined }}>
          Scalable frontends · API-driven systems · clean architecture
        </span>
      ),
    },
    {
      q: 'ls stack',
      output: (
        <span className="flex flex-wrap gap-x-3 gap-y-1">
          {stack.map((item) => (
            <span
              key={item.name}
              className="cursor-default"
              style={{
                color:
                  stackHover === item.name || hot ? item.color : undefined,
              }}
              onMouseEnter={() => setStackHover(item.name)}
              onMouseLeave={() => setStackHover(null)}
            >
              {item.name}
            </span>
          ))}
        </span>
      ),
    },
  ]

  const current = commands[step]

  useEffect(() => {
    setTyped('')
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setTyped(current.q.slice(0, i))
      if (i >= current.q.length) window.clearInterval(id)
    }, 42)
    return () => window.clearInterval(id)
  }, [current.q, step])

  const done = typed === current.q

  return (
    <article
      className="overflow-hidden rounded-3xl border border-border bg-black"
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => {
        setHot(false)
        setStackHover(null)
      }}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: '#ff5f57' }}
        />
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: '#febc2e' }}
        />
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: '#28c840' }}
        />
        <span className="ml-2 font-mono text-[12px] text-fg-muted">
          sarthak — zsh
        </span>
      </div>

      <div className="space-y-4 px-4 py-5 font-mono text-[13px] md:text-[14px]">
        {commands.slice(0, step).map((item) => (
          <div key={item.q}>
            <PromptLine text={item.q} hot={hot} />
            <p className="mt-1 text-fg-muted">{item.output}</p>
          </div>
        ))}

        <div>
          <PromptLine text={typed} caret hot={hot} />
          {done && <p className="mt-1 text-fg-muted">{current.output}</p>}
        </div>

        {done && step < commands.length - 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="rounded-full border border-border px-3 py-1 text-[12px] text-fg-muted"
            style={hot ? { borderColor: '#3fb950', color: '#3fb950' } : undefined}
          >
            run next command →
          </button>
        )}

        {done && step === commands.length - 1 && (
          <button
            type="button"
            className="text-[12px] text-fg-muted"
            style={hot ? { color: '#58a6ff' } : undefined}
            onClick={() => {
              setStep(0)
              setTyped('')
            }}
          >
            replay
          </button>
        )}
      </div>
    </article>
  )
}

function PromptLine({
  text,
  caret = false,
  hot,
}: {
  text: string
  caret?: boolean
  hot: boolean
}) {
  return (
    <p>
      <span style={{ color: '#3fb950' }}>➜</span>{' '}
      <span style={{ color: hot ? '#79c0ff' : '#8b949e' }}>~</span>{' '}
      <span style={{ color: hot ? '#d2a8ff' : '#f0f6fc' }}>{text}</span>
      {caret && (
        <span
          className="caret ml-0.5 inline-block w-[7px] align-middle"
          style={{ background: hot ? '#3fb950' : '#f0f6fc' }}
        >
          &nbsp;
        </span>
      )}
    </p>
  )
}
