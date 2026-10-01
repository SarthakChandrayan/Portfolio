import { XIcon } from '@primer/octicons-react'
import { useEffect } from 'react'
import { sections } from '../data/profile'

const groups: { title: string; rows: [string[], string][] }[] = [
  {
    title: 'Move around',
    rows: [
      ...sections.map((s, i): [string[], string] => [[String(i + 1)], s.label]),
      [['J'], 'Next section'],
      [['K'], 'Previous section'],
    ],
  },
  {
    title: 'Anywhere',
    rows: [
      [['/'], 'Search everything'],
      [['Ctrl', 'K'], 'Search everything'],
      [['?'], 'This sheet'],
    ],
  },
  {
    title: 'In a project',
    rows: [
      [['←', '→'], 'Previous / next project'],
      [['Esc'], 'Close'],
    ],
  },
]

export function Shortcuts({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close shortcuts"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-label="Keyboard shortcuts"
        className="palette-in relative w-full max-w-[560px] rounded-3xl border border-border bg-canvas-overlay p-6 shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-tight text-fg">
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-fg-muted hover:text-fg"
            aria-label="Close"
          >
            <XIcon size={16} />
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.title} className={group.title === 'Move around' ? 'sm:row-span-2' : ''}>
              <p className="mb-2 font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
                {group.title}
              </p>
              <ul className="space-y-1.5">
                {group.rows.map(([keys, label]) => (
                  <li
                    key={keys.join('+') + label}
                    className="flex items-center justify-between gap-3 text-[14px] text-fg-muted"
                  >
                    {label}
                    <span className="flex gap-1">
                      {keys.map((key) => (
                        <kbd
                          key={key}
                          className="min-w-[24px] rounded-md border border-border bg-black px-1.5 py-0.5 text-center font-mono text-[12px] text-fg"
                        >
                          {key}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
