import { GITHUB_USER } from '../data/profile'

export type ContributionDay = {
  date: string
  count: number
  level: number
}

export type ContributionPayload = {
  total: Record<string, number>
  contributions: ContributionDay[]
}

export type GithubUser = {
  login: string
  name: string | null
  avatar_url: string
  followers: number
  following: number
  public_repos: number
  created_at: string
  html_url: string
}

const CONTRIB_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}`
const USER_URL = `https://api.github.com/users/${GITHUB_USER}`
const CACHE_KEY = `gh-contrib:${GITHUB_USER}`
const CACHE_TTL = 1000 * 60 * 30

type CacheShape = {
  savedAt: number
  data: ContributionPayload
}

function readCache(): ContributionPayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CacheShape
    if (Date.now() - parsed.savedAt > CACHE_TTL) return parsed.data
    return parsed.data
  } catch {
    return null
  }
}

function writeCache(data: ContributionPayload) {
  try {
    const payload: CacheShape = { savedAt: Date.now(), data }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore quota */
  }
}

async function fetchJson<T>(url: string, timeoutMs = 9000): Promise<T> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`Request failed (${res.status})`)
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchContributions(): Promise<ContributionPayload> {
  const cached = readCache()
  const data = await fetchJson<ContributionPayload>(CONTRIB_URL)
  if (!data?.contributions?.length) {
    if (cached) return cached
    throw new Error('No contribution data returned')
  }
  writeCache(data)
  return data
}

export function peekCachedContributions(): ContributionPayload | null {
  return readCache()
}

export async function fetchGithubUser(): Promise<GithubUser> {
  return fetchJson<GithubUser>(USER_URL)
}

export function formatCount(n: number) {
  return n.toLocaleString('en-US')
}

export function formatDayLabel(iso: string) {
  const date = new Date(`${iso}T00:00:00`)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function contributionPhrase(count: number, iso: string) {
  const when = formatDayLabel(iso)
  if (count === 0) return `No contributions on ${when}`
  if (count === 1) return `1 contribution on ${when}`
  return `${formatCount(count)} contributions on ${when}`
}

export type WeekCell = ContributionDay | null

export function toWeeks(days: ContributionDay[]): WeekCell[][] {
  if (!days.length) return []
  const first = new Date(`${days[0].date}T00:00:00`)
  const pad = first.getDay()
  const cells: WeekCell[] = [...Array<WeekCell>(pad).fill(null), ...days]
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: WeekCell[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function monthLabels(weeks: WeekCell[][]): string[] {
  const labels: string[] = []
  let lastLabeled = -10
  weeks.forEach((week, index) => {
    const day = week.find((cell) => cell)
    if (!day) {
      labels.push('')
      return
    }
    const month = new Date(`${day.date}T00:00:00`).getMonth()
    let show = index === 0
    if (!show) {
      const prev = weeks[index - 1]?.find((cell) => cell)
      if (prev) {
        const prevMonth = new Date(`${prev.date}T00:00:00`).getMonth()
        show = prevMonth !== month
      }
    }
    if (show && index - lastLabeled >= 2 && weeks.length - index >= 2) {
      labels.push(MONTHS[month])
      lastLabeled = index
    } else {
      labels.push('')
    }
  })
  return labels
}

function isoDate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function byDate(a: ContributionDay, b: ContributionDay) {
  if (a.date < b.date) return -1
  if (a.date > b.date) return 1
  return 0
}

export function lastYearDays(all: ContributionDay[], now = new Date()) {
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const start = new Date(end)
  start.setFullYear(start.getFullYear() - 1)
  const from = isoDate(start)
  const to = isoDate(end)
  return all.filter((d) => d.date >= from && d.date <= to).sort(byDate)
}

export function yearDays(all: ContributionDay[], year: number) {
  const from = `${year}-01-01`
  const to = `${year}-12-31`
  return all.filter((d) => d.date >= from && d.date <= to).sort(byDate)
}

export function sumCounts(days: ContributionDay[]) {
  return days.reduce((sum, d) => sum + d.count, 0)
}

export function streaks(days: ContributionDay[]) {
  let longest = 0
  let current = 0
  let run = 0
  for (const day of days) {
    if (day.count > 0) {
      run += 1
      longest = Math.max(longest, run)
    } else {
      run = 0
    }
  }
  for (let i = days.length - 1; i >= 0; i -= 1) {
    if (days[i].count > 0) current += 1
    else break
  }
  return { current, longest }
}

export const LEVEL_COLORS = [
  'var(--color-contrib-0)',
  'var(--color-contrib-1)',
  'var(--color-contrib-2)',
  'var(--color-contrib-3)',
  'var(--color-contrib-4)',
]

export const GITHUB_GREEN = [
  '#161b22',
  '#0e4429',
  '#006d32',
  '#26a641',
  '#39d353',
]
