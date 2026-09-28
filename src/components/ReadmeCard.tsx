import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { PlayIcon } from '@primer/octicons-react'
import { TiltCard, useDesktopLayout } from './Motion'
import { experience, profile, repos, stack } from '../data/profile'
import { projectsUsing, usedAtWork } from '../lib/skills'
import { copyText } from '../lib/toast'

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
  const textRef = useRef<HTMLParagraphElement>(null)

  const followLight = (e: MouseEvent) => {
    const el = textRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--tx', `${e.clientX - r.left}px`)
    el.style.setProperty('--ty', `${e.clientY - r.top}px`)
  }

  return (
    <TiltCard tilt={false} className="rounded-3xl border border-border bg-canvas-overlay/80">
      <div
        className="p-5 md:p-6"
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => setHot(false)}
        onMouseMove={followLight}
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
        <p
          ref={textRef}
          className={`flashlight mt-3 text-[15px] text-fg-muted ${desktop && hot ? 'is-on' : ''}`}
        >
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
          . {profile.summary}
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
              Focused on end-to-end{' '}
              <Tech lit={lit} color="#79c0ff">TypeScript</Tech>:{' '}
              <Tech lit={lit} color="#58a6ff">React</Tech>,{' '}
              <Tech lit={lit} color="#f0f6fc">Next.js</Tech>,{' '}
              <Tech lit={lit} color="#f85149">Angular</Tech>, and{' '}
              <Tech lit={lit} color="#61dafb">React Native</Tech> on the front;{' '}
              <Tech lit={lit} color="#3fb950">Node.js</Tech>,{' '}
              <Tech lit={lit} color="#68a063">Express</Tech>, and{' '}
              <Tech lit={lit} color="#009688" skill="FastAPI">
                Python/FastAPI
              </Tech>{' '}
              on the back;{' '}
              <Tech lit={lit} color="#336791">PostgreSQL</Tech> and{' '}
              <Tech lit={lit} color="#3fa037">MongoDB</Tech> underneath
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

function Tech({
  lit,
  color,
  skill,
  children,
}: {
  lit: boolean
  color: string
  skill?: string
  children: string
}) {
  const [open, setOpen] = useState(false)
  const name = skill ?? children
  const used = open ? projectsUsing(name) : []
  const atWork = open && usedAtWork(name)

  return (
    <span
      className="relative inline-block cursor-help"
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
    >
      <span
        className="underline decoration-white/20 decoration-dotted underline-offset-4"
        style={{ color: lit ? color : undefined }}
      >
        {children}
      </span>
      {open && (
        <span
          role="tooltip"
          className="fade-in absolute bottom-full left-1/2 z-30 block -translate-x-1/2 pb-2"
        >
          <span className="block w-max max-w-[260px] rounded-xl border border-border bg-black/95 p-2.5 text-left text-[12px] leading-normal text-fg-muted shadow-2xl backdrop-blur">
            <span className="flex items-center gap-2 font-medium text-fg">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: color, boxShadow: `0 0 8px ${color}` }}
              />
              {name}
              <span className="ml-auto pl-3 font-mono text-[11px] font-normal text-fg-subtle">
                {used.length
                  ? `${used.length} project${used.length > 1 ? 's' : ''}`
                  : atWork
                    ? 'at work'
                    : 'no public project yet'}
              </span>
            </span>
            {used.length > 0 && (
              <span className="mt-2 flex flex-wrap gap-1">
                {used.map((repo) => {
                  const link = repo.href ?? repo.github
                  const chip = (
                    <>
                      {repo.logo && !repo.wideLogo ? (
                        <img src={repo.logo} alt="" className="h-3.5 w-3.5 rounded-sm" />
                      ) : (
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: repo.languageColor }}
                        />
                      )}
                      {slug(repo.name)}
                    </>
                  )
                  const chipClass =
                    'inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-fg-muted no-underline'
                  return link ? (
                    <a
                      key={repo.name}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className={`${chipClass} transition hover:border-white/40 hover:text-fg hover:no-underline`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {chip}
                    </a>
                  ) : (
                    <span key={repo.name} className={chipClass}>
                      {chip}
                    </span>
                  )
                })}
              </span>
            )}
            {atWork && used.length > 0 && (
              <span className="mt-1.5 block text-fg-subtle">also used at work</span>
            )}
          </span>
        </span>
      )}
    </span>
  )
}

type Paint = (lit: boolean) => ReactNode
type Entry = { id: number; cmd: string; output: Paint | null }
type Result = {
  output: Paint | null
  effect?: () => void
  action?: 'clear' | 'replay'
}

const INTRO = ['whoami', 'cat focus.md', 'ls stack']

const HELP: [string, string][] = [
  ['whoami', 'who is this'],
  ['cat focus.md', 'what I care about'],
  ['ls stack', 'tools I use'],
  ['ls projects', 'things I have built'],
  ['open <name>', 'open a project, github, or linkedin'],
  ['experience', 'where I have worked'],
  ['contact', 'copy my email'],
  ['clear', 'clear the screen'],
  ['replay', 'rerun the intro'],
]

const slug = (name: string) => name.split(' ')[0].toLowerCase()

const COMPLETIONS = [
  'help',
  'whoami',
  'cat focus.md',
  'ls stack',
  'ls projects',
  'experience',
  'contact',
  'socials',
  'date',
  'clear',
  'replay',
  'sudo hire-me',
  'open github',
  'open linkedin',
  ...repos
    .filter((repo) => repo.href || repo.github)
    .map((repo) => `open ${slug(repo.name)}`),
]

let nextId = 0
const entry = (cmd: string, output: Paint | null): Entry => ({
  id: nextId++,
  cmd,
  output,
})

const tint = (lit: boolean, color: string) => ({
  color: lit ? color : undefined,
})

function commonPrefix(words: string[]) {
  let prefix = words[0] ?? ''
  for (const word of words) {
    while (!word.startsWith(prefix)) prefix = prefix.slice(0, -1)
  }
  return prefix
}

function Link({ lit, href }: { lit: boolean; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={tint(lit, '#58a6ff')}
      onClick={(e) => e.stopPropagation()}
    >
      {href.replace(/^https?:\/\//, '').replace(/\/$/, '')}
    </a>
  )
}

function StackList({ lit }: { lit: boolean }) {
  const [hover, setHover] = useState<string | null>(null)
  return (
    <span className="flex flex-wrap gap-x-3 gap-y-1">
      {stack.map((item) => (
        <span
          key={item.name}
          className="cursor-default"
          style={{ color: hover === item.name || lit ? item.color : undefined }}
          onMouseEnter={() => setHover(item.name)}
          onMouseLeave={() => setHover(null)}
        >
          {item.name}
        </span>
      ))}
    </span>
  )
}

const text = (value: ReactNode): Result => ({ output: () => value })

const projectsOutput: Paint = (lit) => (
  <span className="block space-y-0.5">
    {repos.map((repo) => {
      const status = repo.href
        ? ['live', '#3fb950']
        : repo.github
          ? ['source', '#a3a3a3']
          : repo.private
            ? ['private', '#d29922']
            : ['no link', '#737373']
      return (
        <span key={repo.name} className="flex gap-3">
          <span className="min-w-[21ch]" style={tint(lit, '#58a6ff')}>
            {slug(repo.name)}
          </span>
          <span style={tint(lit, status[1])}>{status[0]}</span>
        </span>
      )
    })}
    <span className="block pt-1 text-fg-subtle">
      try <span style={tint(lit, '#79c0ff')}>open pedit</span>
    </span>
  </span>
)

function run(raw: string): Result {
  const [cmd = '', ...rest] = raw.trim().split(/\s+/)
  const arg = rest.join(' ')

  switch (cmd.toLowerCase()) {
    case '':
      return { output: null }

    case 'help':
      return {
        output: (lit) => (
          <span className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
            {HELP.map(([name, about]) => (
              <Fragment key={name}>
                <span style={tint(lit, '#79c0ff')}>{name}</span>
                <span>{about}</span>
              </Fragment>
            ))}
          </span>
        ),
      }

    case 'whoami':
      return {
        output: (lit) => (
          <>
            <span style={tint(lit, '#3fb950')}>{profile.name}</span>
            {' — '}
            <span style={tint(lit, '#79c0ff')}>{profile.title}</span>
            {' @ '}
            <span style={tint(lit, '#d2a8ff')}>{profile.company}</span>
          </>
        ),
      }

    case 'cat':
      if (arg === 'focus.md') {
        return {
          output: (lit) => (
            <span style={tint(lit, '#a5d6ff')}>
              Scalable frontends · API-driven systems · clean architecture ·
              mobile + web in sync · performance · AI & RAG tooling
            </span>
          ),
        }
      }
      return text(`cat: ${arg || '?'}: No such file or directory`)

    case 'ls':
      if (arg === 'stack') return { output: (lit) => <StackList lit={lit} /> }
      if (arg === 'projects') return { output: projectsOutput }
      if (!arg) {
        return {
          output: (lit) => (
            <span className="flex gap-4">
              <span style={tint(lit, '#79c0ff')}>stack/</span>
              <span style={tint(lit, '#79c0ff')}>projects/</span>
              <span>focus.md</span>
            </span>
          ),
        }
      }
      return text(`ls: ${arg}: No such file or directory`)

    case 'projects':
      return { output: projectsOutput }

    case 'open': {
      const q = arg.toLowerCase()
      if (!q) return text('usage: open <name>. try `ls projects`')
      let url: string | undefined
      if (q === 'github') url = profile.github
      else if (q === 'linkedin') url = profile.linkedin
      else {
        const repo = repos.find((r) => slug(r.name).startsWith(q))
        if (!repo) return text(`open: no project called "${arg}". try \`ls projects\``)
        url = repo.href ?? repo.github
        if (!url) return text(`${slug(repo.name)} has no public link yet`)
      }
      const target = url
      return {
        effect: () => window.open(target, '_blank', 'noopener'),
        output: (lit) => (
          <>
            opening <Link lit={lit} href={target} />
          </>
        ),
      }
    }

    case 'experience':
      return {
        output: (lit) => (
          <span className="block space-y-0.5">
            {experience.map((role) => (
              <span key={role.period} className="block">
                <span style={tint(lit, '#d2a8ff')}>{role.period}</span>
                {'  '}
                <span style={tint(lit, '#f0f6fc')}>{role.title}</span>
                {' @ '}
                {role.company}
              </span>
            ))}
          </span>
        ),
      }

    case 'contact':
    case 'email':
      return {
        effect: () => void copyText(profile.email, 'Email copied'),
        output: (lit) => (
          <>
            <span style={tint(lit, '#79c0ff')}>{profile.email}</span> copied to
            clipboard
          </>
        ),
      }

    case 'socials':
      return {
        output: (lit) => (
          <span className="block space-y-0.5">
            <span className="block">
              github <Link lit={lit} href={profile.github} />
            </span>
            <span className="block">
              linkedin <Link lit={lit} href={profile.linkedin} />
            </span>
          </span>
        ),
      }

    case 'date': {
      const now = new Date().toString()
      return text(now)
    }

    case 'echo':
      return text(arg)

    case 'clear':
      return { output: null, action: 'clear' }

    case 'replay':
      return { output: null, action: 'replay' }

    case 'sudo':
      if (arg.includes('hire')) {
        return {
          effect: () => void copyText(profile.email, 'Email copied'),
          output: (lit) => (
            <span className="block">
              <span className="block">[sudo] password for recruiter: ********</span>
              <span className="block" style={tint(lit, '#3fb950')}>
                access granted. email copied:{' '}
                <span style={tint(lit, '#79c0ff')}>{profile.email}</span>
              </span>
            </span>
          ),
        }
      }
      return text(
        'visitor is not in the sudoers file. This incident will be reported. (try sudo hire-me)',
      )

    case 'rm':
      return text(
        arg.includes('-rf')
          ? 'nice try. this portfolio is load-bearing.'
          : 'rm: permission denied',
      )

    case 'cd':
      return text('cd: this is a one-page site. try `ls`')

    case 'exit':
      return text('there is no exit. only `help`.')

    default:
      return {
        output: (lit) => (
          <>
            zsh: command not found:{' '}
            <span style={tint(lit, '#f85149')}>{cmd}</span>. try{' '}
            <span style={tint(lit, '#79c0ff')}>help</span>
          </>
        ),
      }
  }
}

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const introLog = () => INTRO.map((cmd) => entry(cmd, run(cmd).output))

function TerminalCard() {
  const [log, setLog] = useState<Entry[]>(() =>
    reducedMotion() ? introLog() : [],
  )
  const [intro, setIntro] = useState(() =>
    reducedMotion() ? INTRO.length : 0,
  )
  const [typed, setTyped] = useState('')
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)
  const [hot, setHot] = useState(false)
  const [focused, setFocused] = useState(false)
  const desktop = useDesktopLayout()
  const lit = desktop ? hot || focused : true
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const history = useRef<string[]>([])
  const cursor = useRef(-1)
  const [streaming, setStreaming] = useState<number | null>(null)
  const [take, setTake] = useState(0)
  const running = intro < INTRO.length

  useEffect(() => {
    void take
    if (intro >= INTRO.length) return
    const cmd = INTRO[intro]
    let i = 0
    let id = 0
    let show = 0
    const start = window.setTimeout(
      () => {
        id = window.setInterval(() => {
          i += 1
          setTyped(cmd.slice(0, i))
          if (i < cmd.length) return
          window.clearInterval(id)
          show = window.setTimeout(() => {
            const next = entry(cmd, run(cmd).output)
            setTyped('')
            setStreaming(next.id)
            setLog((l) => [...l, next])
          }, 380)
        }, 105)
      },
      intro === 0 ? 500 : 850,
    )
    return () => {
      window.clearTimeout(start)
      window.clearInterval(id)
      window.clearTimeout(show)
    }
  }, [intro, take])

  const scrollToEnd = () => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }

  const finishStream = () => {
    setStreaming(null)
    setIntro((n) => n + 1)
  }

  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [log, typed, running, streaming])

  const focusInput = () => {
    if (window.getSelection()?.toString()) return
    if (running) {
      setLog(introLog())
      setTyped('')
      setStreaming(null)
      setIntro(INTRO.length)
    }
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }))
  }

  const replay = () => {
    setTyped('')
    setStreaming(null)
    if (reducedMotion()) {
      setLog(introLog())
      setIntro(INTRO.length)
      return
    }
    setLog([])
    setIntro(0)
    setTake((t) => t + 1)
  }

  const submit = () => {
    const raw = value
    setValue('')
    setTouched(true)
    cursor.current = -1
    if (raw.trim()) history.current.push(raw.trim())
    const result = run(raw)
    result.effect?.()
    if (result.action === 'clear') {
      setLog([])
      return
    }
    if (result.action === 'replay') {
      replay()
      return
    }
    setLog((l) => [...l, entry(raw, result.output)].slice(-60))
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
      return
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const past = history.current
      if (!past.length) return
      e.preventDefault()
      const from = cursor.current === -1 ? past.length : cursor.current
      const next = from + (e.key === 'ArrowUp' ? -1 : 1)
      if (next >= past.length) {
        cursor.current = -1
        setValue('')
        return
      }
      cursor.current = Math.max(0, next)
      setValue(past[cursor.current])
      return
    }

    if (e.key === 'Tab') {
      const typedSoFar = value.trimStart().toLowerCase()
      if (!typedSoFar) return
      e.preventDefault()
      const matches = COMPLETIONS.filter((c) => c.startsWith(typedSoFar))
      if (!matches.length) return
      const prefix = matches.length === 1 ? matches[0] : commonPrefix(matches)
      if (prefix.length > typedSoFar.length) {
        setValue(prefix)
        return
      }
      setLog((l) => [
        ...l,
        entry(value, () => (
          <span className="flex flex-wrap gap-x-4">
            {matches.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </span>
        )),
      ])
      return
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLog([])
      return
    }

    if (e.key === 'Escape') inputRef.current?.blur()
  }

  return (
    <article
      className="overflow-hidden rounded-3xl border border-border bg-black"
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
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
        <button
          type="button"
          onClick={replay}
          className="-my-1.5 ml-auto inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-[12px] leading-5 text-fg-muted transition hover:border-fg-subtle hover:text-fg"
        >
          <PlayIcon size={12} />
          Replay
        </button>
      </div>

      <div
        ref={bodyRef}
        onClick={focusInput}
        className="gh-scrollbar max-h-[380px] cursor-text space-y-4 overflow-y-auto px-4 py-5 font-mono text-[13px] md:text-[14px]"
      >
        {log.map((item) => (
          <div key={item.id}>
            <PromptLine text={item.cmd} hot={lit} />
            {item.output && (
              <div className="mt-1 break-words text-fg-muted">
                {item.id === streaming ? (
                  <Typewriter onType={scrollToEnd} onDone={finishStream}>
                    {item.output(lit)}
                  </Typewriter>
                ) : (
                  item.output(lit)
                )}
              </div>
            )}
          </div>
        ))}

        {streaming !== null ? null : running ? (
          <PromptLine text={typed} caret hot={lit} />
        ) : (
          <div>
            <p className="flex items-center">
              <span style={{ color: '#3fb950' }}>➜</span>
              <span
                className="ml-[1ch]"
                style={{ color: lit ? '#79c0ff' : '#8b949e' }}
              >
                ~
              </span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                aria-label="Terminal command"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="ml-[1ch] min-w-0 flex-1 bg-transparent text-[16px] outline-none md:text-[14px]"
                style={{
                  color: lit ? '#d2a8ff' : '#f0f6fc',
                  caretColor: '#3fb950',
                }}
              />
            </p>
            {!touched && (
              <p className="mt-2 text-[12px] text-fg-subtle">
                type <span style={tint(lit, '#79c0ff')}>help</span> · tab
                completes · ↑ for history
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function Typewriter({
  children,
  onType,
  onDone,
}: {
  children: ReactNode
  onType: () => void
  onDone: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const handlers = useRef({ onType, onDone })

  useLayoutEffect(() => {
    handlers.current = { onType, onDone }
  })

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const parts: { node: Text; full: string }[] = []
    while (walker.nextNode()) {
      const node = walker.currentNode as Text
      parts.push({ node, full: node.data })
      node.data = ''
    }

    const caret = document.createElement('span')
    caret.className = 'caret ml-0.5 inline-block w-[7px] align-middle'
    caret.style.background = '#3fb950'
    caret.textContent = '\u00a0'

    let part = 0
    let char = 0
    const id = window.setInterval(() => {
      while (part < parts.length && char >= parts[part].full.length) {
        part += 1
        char = 0
      }
      if (part >= parts.length) {
        window.clearInterval(id)
        caret.remove()
        handlers.current.onDone()
        return
      }
      const { node, full } = parts[part]
      char += 1
      node.data = full.slice(0, char)
      node.after(caret)
      handlers.current.onType()
    }, 36)

    return () => {
      window.clearInterval(id)
      caret.remove()
      for (const { node, full } of parts) node.data = full
    }
  }, [])

  return <div ref={ref}>{children}</div>
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
