import { useEffect, useState } from 'react'
import { TiltCard, useDesktopLayout } from './Motion'
import { profile, stack } from '../data/profile'

export function ReadmeCard() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <AboutCard />
      <TerminalCard />
    </div>
  )
}

function AboutCard() {
  const [hot, setHot] = useState(false)
  const desktop = useDesktopLayout()
  const lit = desktop ? hot : true

  return (
    <TiltCard tilt={false} className="rounded-3xl border border-border bg-canvas-overlay/80">
      <div
        className="p-5 md:p-6"
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => setHot(false)}
      >
        <p
          className="font-mono text-[11px] tracking-widest uppercase"
          style={{ color: lit ? '#79c0ff' : '#737373' }}
        >
          About
        </p>
        <h2 className="mt-1 text-[24px] font-semibold tracking-tight">
          Hi, I&apos;m{' '}
          <span style={{ color: lit ? '#58a6ff' : undefined }}>Sarthak</span>
        </h2>
        <p className="mt-3 text-[15px] text-fg-muted">
          <strong style={{ color: lit ? '#79c0ff' : '#f5f5f5' }}>
            {profile.title}
          </strong>{' '}
          at{' '}
          <a
            href={profile.companyUrl}
            target="_blank"
            rel="noreferrer"
            style={{ color: lit ? '#d2a8ff' : undefined }}
          >
            {profile.company}
          </a>
          . {profile.bio} {profile.summary}
        </p>
        <ul className="mt-4 space-y-2 text-[14px] text-fg">
          <li className="flex gap-2">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: lit ? '#3fb950' : '#f5f5f5' }}
            />
            <span>
              Currently building across backend APIs and the mobile, web, and
              admin apps at{' '}
              <span style={{ color: lit ? '#d2a8ff' : undefined }}>Thravos</span>
            </span>
          </li>
          <li className="flex gap-2">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: lit ? '#3fb950' : '#f5f5f5' }}
            />
            <span>
              Focused on{' '}
              <span style={{ color: lit ? '#58a6ff' : undefined }}>React</span>
              ,{' '}
              <span style={{ color: lit ? '#f0f6fc' : undefined }}>Next.js</span>
              ,{' '}
              <span style={{ color: lit ? '#f85149' : undefined }}>Angular</span>
              ,{' '}
              <span style={{ color: lit ? '#3fb950' : undefined }}>Node.js</span>
              ,{' '}
              <span style={{ color: lit ? '#79c0ff' : undefined }}>
                TypeScript
              </span>
              , and{' '}
              <span style={{ color: lit ? '#61dafb' : undefined }}>
                React Native
              </span>
            </span>
          </li>
          <li className="flex gap-2">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: lit ? '#3fb950' : '#f5f5f5' }}
            />
            <span>
              <span style={{ color: lit ? '#79c0ff' : undefined }}>
                {profile.email}
              </span>
              {' · '}
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{ color: lit ? '#58a6ff' : undefined }}
              >
                LinkedIn
              </a>
            </span>
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
  const desktop = useDesktopLayout()
  const lit = desktop ? hot : true

  const commands = [
    {
      q: 'whoami',
      output: (
        <>
          <span style={{ color: lit ? '#3fb950' : undefined }}>
            {profile.name}
          </span>
          {' — '}
          <span style={{ color: lit ? '#79c0ff' : undefined }}>
            {profile.title}
          </span>
          {' @ '}
          <span style={{ color: lit ? '#d2a8ff' : undefined }}>
            {profile.company}
          </span>
        </>
      ),
    },
    {
      q: 'cat focus.md',
      output: (
        <span style={{ color: lit ? '#a5d6ff' : undefined }}>
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
                  stackHover === item.name || lit ? item.color : undefined,
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
            <PromptLine text={item.q} hot={lit} />
            <p className="mt-1 text-fg-muted">{item.output}</p>
          </div>
        ))}

        <div>
          <PromptLine text={typed} caret hot={lit} />
          {done && <p className="mt-1 text-fg-muted">{current.output}</p>}
        </div>

        {done && step < commands.length - 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="rounded-full border border-border px-3 py-1 text-[12px] text-fg-muted"
            style={lit ? { borderColor: '#3fb950', color: '#3fb950' } : undefined}
          >
            run next command →
          </button>
        )}

        {done && step === commands.length - 1 && (
          <button
            type="button"
            className="text-[12px] text-fg-muted"
            style={lit ? { color: '#58a6ff' } : undefined}
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
