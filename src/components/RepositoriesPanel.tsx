import { RepoIcon, SearchIcon } from '@primer/octicons-react'
import { useMemo, useState } from 'react'
import { repos } from '../data/profile'
import { PinnedRepos } from './PinnedRepos'

export function RepositoriesPanel() {
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('all')

  const languages = useMemo(
    () => ['all', ...Array.from(new Set(repos.map((r) => r.language)))],
    [],
  )

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <SearchIcon
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a project…"
            className="h-8 w-full rounded-md border border-border bg-canvas-inset py-1 pr-3 pl-9 text-[14px] text-fg outline-none focus:border-accent"
          />
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="h-8 rounded-md border border-border bg-btn px-2 text-[14px] text-fg"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang === 'all' ? 'Language' : lang}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 flex items-center gap-2 text-[14px] text-fg-muted">
        <RepoIcon size={16} />
        {repos.length} projects · live contribution graph from GitHub
      </div>

      <PinnedRepos query={query} language={language} compact />
    </div>
  )
}
