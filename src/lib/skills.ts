import { experience, repos, type Repo } from '../data/profile'

const ALIASES: Record<string, string[]> = {
  'Node.js': ['nodejs', 'express'],
  PostgreSQL: ['neon', 'postgres'],
}

const norm = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function projectsUsing(skill: string): Repo[] {
  const keys = new Set([norm(skill), ...(ALIASES[skill] ?? [])])
  const mention = new RegExp(`\\b${escape(skill)}\\b`, 'i')
  return repos.filter(
    (repo) =>
      keys.has(norm(repo.language)) ||
      repo.topics.some((topic) => keys.has(norm(topic))) ||
      mention.test(repo.description),
  )
}

const workText = experience
  .flatMap((role) => [role.summary ?? '', ...role.bullets])
  .join(' ')

export function usedAtWork(skill: string) {
  const base = skill.replace(/\.js$/i, '')
  return (
    new RegExp(`\\b${escape(skill)}\\b`, 'i').test(workText) ||
    new RegExp(`\\b${escape(base)}\\b`).test(workText)
  )
}
