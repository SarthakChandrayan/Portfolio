import {
  ArrowUpRightIcon,
  CopyIcon,
  DownloadIcon,
  FileIcon,
  MailIcon,
  MarkGithubIcon,
} from '@primer/octicons-react'
import type { ReactNode } from 'react'
import { profile } from '../data/profile'
import { copyText } from '../lib/toast'
import { LinkedInIcon } from './LinkedInIcon'
import { Magnetic, TiltCard } from './Motion'

const linkedinHandle = profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//, '')

export function ContactSection() {
  return (
    <TiltCard tilt={false} className="rounded-3xl border border-border bg-canvas-overlay/80">
      <div className="grid gap-6 p-5 md:p-6 xl:grid-cols-[1fr_1.15fr] xl:gap-8">
        <div className="flex flex-col">
          <p className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3fb950] shadow-[0_0_8px_#3fb950]" />
            Open to full-stack roles
          </p>
          <h3 className="mt-2 text-[22px] font-semibold tracking-tight text-fg">
            Let&apos;s build something.
          </h3>
          <p className="mt-2 text-[15px] text-fg-muted">
            Have a role, a project, or want to talk shop about APIs and AI tooling?
            Email is the quickest way to reach me.
          </p>
          <div className="mt-5 xl:mt-auto xl:pt-5">
            <Magnetic className="inline-block">
              <a
                href={`mailto:${profile.email}`}
                className="btn-solid inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-semibold text-black no-underline hover:bg-neutral-200 hover:no-underline"
              >
                Say hello
                <ArrowUpRightIcon size={16} />
              </a>
            </Magnetic>
          </div>
        </div>

        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-canvas">
          <Row
            icon={<MailIcon size={16} className="text-fg-muted" />}
            label="Email"
            value={profile.email}
            action={
              <button
                type="button"
                onClick={() => void copyText(profile.email, 'Email copied')}
                className="grid h-7 w-7 place-items-center rounded-md text-fg-muted transition hover:bg-btn hover:text-fg"
                aria-label="Copy email"
                title="Copy email"
              >
                <CopyIcon size={14} />
              </button>
            }
            href={`mailto:${profile.email}`}
          />
          <Row
            icon={<LinkedInIcon size={16} />}
            label="LinkedIn"
            value={linkedinHandle}
            href={profile.linkedin}
            external
          />
          <Row
            icon={<MarkGithubIcon size={16} className="text-fg" />}
            label="GitHub"
            value={`@${profile.username}`}
            href={profile.github}
            external
          />
          <Row
            icon={<FileIcon size={16} className="text-fg-muted" />}
            label="Résumé"
            value="PDF"
            href={encodeURI(profile.resume)}
            external
            trailing={<DownloadIcon size={14} />}
          />
        </ul>
      </div>
    </TiltCard>
  )
}

function Row({
  icon,
  label,
  value,
  href,
  external = false,
  action,
  trailing = <ArrowUpRightIcon size={14} />,
}: {
  icon: ReactNode
  label: string
  value: string
  href: string
  external?: boolean
  action?: ReactNode
  trailing?: ReactNode
}) {
  return (
    <li className="group flex items-center gap-1 pr-2 transition-colors hover:bg-white/[0.04]">
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-4 text-fg no-underline hover:no-underline"
      >
        <span className="grid w-4 shrink-0 place-items-center">{icon}</span>
        <span className="w-[68px] shrink-0 text-[13px] text-fg-muted">{label}</span>
        <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-fg">{value}</span>
        {!action && (
          <span className="shrink-0 text-fg-subtle transition group-hover:text-fg">
            {trailing}
          </span>
        )}
      </a>
      {action}
    </li>
  )
}
