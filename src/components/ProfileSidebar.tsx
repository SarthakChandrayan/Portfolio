import {
  CopyIcon,
  LinkIcon,
  LocationIcon,
  MailIcon,
  MarkGithubIcon,
  OrganizationIcon,
} from '@primer/octicons-react'
import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { copyText } from '../lib/toast'
import type { GithubUser } from '../lib/github'
import { CountUp, Magnetic } from './Motion'

type Props = {
  user: GithubUser | null
}

export function ProfileSidebar({ user }: Props) {
  const now = useIstTime()

  return (
    <aside className="md:w-[280px] md:shrink-0">
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
          <IstClock now={now} />
        </div>

        <div className="mt-3 min-w-0 md:mt-5">
          <h1 className="text-[24px] leading-tight font-semibold tracking-tight text-fg md:text-[26px]">
            {profile.name}
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

      <Magnetic className="mt-4 block w-full">
        <a
          href={`mailto:${profile.email}`}
          className="btn-solid flex h-10 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-black no-underline hover:bg-neutral-200 hover:no-underline"
        >
          Get in touch
        </a>
      </Magnetic>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <StatChip label="followers" value={user?.followers ?? 1} />
        <StatChip label="following" value={user?.following ?? 1} />
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

function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-canvas-subtle px-3 py-2 text-center">
      <div className="text-[18px] font-semibold">
        <CountUp value={value} />
      </div>
      <div className="text-[11px] text-fg-muted">{label}</div>
    </div>
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

function istParts(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now)
  const num = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0)
  return { h: num('hour'), m: num('minute'), s: num('second') }
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

function IstClock({ now }: { now: Date }) {
  const { h, m, s } = istParts(now)
  const label = `Bengaluru time ${formatIst(now)} IST`

  return (
    <div
      className="clock-face absolute right-1 bottom-1 h-8 w-8 rounded-full border border-border bg-canvas md:right-2 md:bottom-2 md:h-10 md:w-10"
      title={label}
      aria-label={label}
    >
      {[0, 90, 180, 270].map((deg) => (
        <span
          key={deg}
          className="pointer-events-none absolute inset-0 flex justify-center"
          style={{ transform: `rotate(${deg}deg)` }}
        >
          <span className="mt-[3px] h-[2px] w-[2px] rounded-full bg-fg-subtle md:mt-1" />
        </span>
      ))}
      <span
        className="clock-hand clock-hand-h"
        style={{ transform: `rotate(${(h % 12) * 30 + m * 0.5}deg)` }}
      />
      <span
        className="clock-hand clock-hand-m"
        style={{ transform: `rotate(${m * 6 + s * 0.1}deg)` }}
      />
      <span
        className="clock-hand clock-hand-s"
        style={{ transform: `rotate(${s * 6}deg)` }}
      />
      <span className="clock-center" />
    </div>
  )
}

