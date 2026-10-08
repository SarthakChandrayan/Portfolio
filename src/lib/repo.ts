import type { Repo } from '../data/profile'

export const topicColors: Record<string, string> = {
  nextjs: '#58a6ff',
  langchain: '#a371f7',
  prisma: '#3fb950',
  rag: '#d2a8ff',
  vercel: '#f0f6fc',
  react: '#58a6ff',
  'react-native': '#61dafb',
  nodejs: '#3fb950',
  stripe: '#635bff',
  mongodb: '#3fa037',
  api: '#79c0ff',
  leaderboard: '#d2a8ff',
  fastapi: '#009688',
  ollama: '#d2a8ff',
  express: '#68a063',
  neon: '#00e599',
  flask: '#f0f6fc',
  sqlite: '#58a6ff',
  ocr: '#ff7b54',
  fastembed: '#d2a8ff',
}

export type RepoFilter = 'all' | 'live' | 'source' | 'client'

export const repoFilters: { id: RepoFilter; label: string; test: (repo: Repo) => boolean }[] = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'live', label: 'Live', test: (repo) => Boolean(repo.href) },
  { id: 'source', label: 'Open source', test: (repo) => Boolean(repo.github) },
  { id: 'client', label: 'Client work', test: (repo) => repo.private },
]

export function repoStatus(repo: Repo): { label: string; color: string } {
  if (repo.private) return { label: 'Client work', color: '#d29922' }
  if (repo.href) return { label: 'Live', color: '#3fb950' }
  if (repo.github) return { label: 'Open source', color: '#58a6ff' }
  return { label: 'Project', color: '#a3a3a3' }
}
