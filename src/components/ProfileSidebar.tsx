import {
  CopyIcon,
  DownloadIcon,
  LinkIcon,
  LocationIcon,
  MailIcon,
  MarkGithubIcon,
  OrganizationIcon,
} from '@primer/octicons-react'
import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { copyText } from '../lib/toast'
import { Magnetic, ScrambleText } from './Motion'

export function ProfileSidebar() {
  const now = useIstTime()

  return (
    <aside className="page-in md:w-[280px] md:shrink-0 md:self-start [@media(min-width:768px)_and_(min-height:820px)]:sticky [@media(min-width:768px)_and_(min-height:820px)]:top-24">
      <div className="flex flex-col items-center text-center md:block">
        <div className="relative w-[120px] shrink-0 md:mx-auto md:w-[196px]">
          <div className="relative p-[3px]">
            <div className="avatar-ring absolute inset-0 rounded-full" aria-hidden />
            <img
              src={profile.avatar}
              alt={profile.name}
              width={800}
              height={800}
              decoding="async"
              className="avatar-photo aspect-square w-full rounded-full border border-canvas bg-canvas object-cover object-center"
            />
          </div>
        </div>

        <div className="mt-3 min-w-0 md:mt-5">
          <h1 className="cursor-default text-[24px] leading-tight font-semibold tracking-tight text-fg md:text-[26px]">
            <ScrambleText text={profile.name} />
          </h1>
          <p className="font-mono text-[13px] text-fg-muted">
            @{profile.username}
          </p>
        </div>
      </div>

      <p className="mt-4 text-center text-[14px] text-fg-muted">{profile.bio}</p>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-border bg-canvas-subtle/80 px-3 py-2 text-[13px]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        <span className="font-mono text-fg">
          Bengaluru · {formatIst(now)} IST
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <Magnetic className="block flex-1">
          <a
            href={`mailto:${profile.email}`}
            className="btn-solid flex h-10 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-black no-underline hover:bg-neutral-200 hover:no-underline"
          >
            Get in touch
          </a>
        </Magnetic>
        <a
          href={encodeURI(profile.resume)}
          target="_blank"
          rel="noreferrer"
          className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-border px-4 text-[14px] font-medium text-fg no-underline transition hover:border-fg-subtle hover:bg-btn hover:no-underline"
        >
          <DownloadIcon size={16} />
          Résumé
        </a>
      </div>

      <ul className="mt-5 space-y-2.5 text-[13px] text-fg md:text-[13px]">
        <li className="flex items-center gap-2">
          <OrganizationIcon size={16} className="text-fg-muted" />
          <a href={profile.companyUrl} target="_blank" rel="noreferrer">
            {profile.company}
          </a>
        </li>
        <li className="flex items-center gap-2">
          <LocationIcon size={16} className="text-fg-muted" />
          {profile.location}
        </li>
        <li className="flex items-center gap-2">
          <MailIcon size={16} className="text-fg-muted" />
          <button
            type="button"
            className="truncate text-accent hover:underline"
            onClick={() => copyText(profile.email, 'Email copied')}
          >
            {profile.email}
          </button>
          <button
            type="button"
            className="text-fg-muted hover:text-fg"
            onClick={() => copyText(profile.email, 'Email copied')}
            aria-label="Copy email"
          >
            <CopyIcon size={14} />
          </button>
        </li>
        <li className="flex items-center gap-2">
          <LinkIcon size={16} className="text-fg-muted" />
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </li>
        <li className="flex items-center gap-2">
          <MarkGithubIcon size={16} className="text-fg-muted" />
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </li>
      </ul>
    </aside>
  )
}

function useIstTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return now
}

function formatIst(now: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)
}
