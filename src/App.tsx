import { useEffect, useState, type CSSProperties } from 'react'
import { CommandPalette } from './components/CommandPalette'
import { ContributionGraph } from './components/ContributionGraph'
import { ExperiencePanel } from './components/ExperiencePanel'
import { Ambient, ScrollProgress, Toaster } from './components/Motion'
import { PinnedRepos } from './components/PinnedRepos'
import { ProfileSidebar } from './components/ProfileSidebar'
import { ReadmeCard } from './components/ReadmeCard'
import { RepositoriesPanel } from './components/RepositoriesPanel'
import { SkillsPanel } from './components/SkillsPanel'
import { TopNav } from './components/TopNav'
import { profile, tabs, type TabId } from './data/profile'
import { useGithubData } from './hooks/useGithubData'

function isTab(value: string): value is TabId {
  return tabs.some((tab) => tab.id === value)
}

export default function App() {
  const { contributions, loading, live, error, reload } = useGithubData()
  const [tab, setTab] = useState<TabId>('overview')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (isTab(hash)) setTab(hash)
  }, [])

  useEffect(() => {
    window.history.replaceState(null, '', `#${tab}`)
  }, [tab])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const inField =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        Boolean(target?.isContentEditable)

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === '/' && !inField && !searchOpen) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen])

  return (
    <div className="relative min-h-svh bg-canvas text-fg">
      <Ambient />
      <ScrollProgress />
      <div className="relative z-10">
        <TopNav
          active={tab}
          onChange={setTab}
          onSearch={() => setSearchOpen(true)}
        />

        <main className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <ProfileSidebar />

            <div
              className="page-in min-w-0 flex-1"
              style={{ '--i': 1 } as CSSProperties}
            >
              <div key={tab} className="tab-in space-y-6">
                {tab === 'overview' && (
                  <>
                    <ReadmeCard />
                    <ContributionGraph
                      data={contributions}
                      loading={loading}
                      live={live}
                      error={error}
                      onRetry={reload}
                    />
                    <PinnedRepos />
                  </>
                )}
                {tab === 'repositories' && <RepositoriesPanel />}
                {tab === 'experience' && <ExperiencePanel />}
                {tab === 'skills' && <SkillsPanel />}
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-border text-[13px] text-fg-muted">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-4 sm:justify-between md:px-8">
            <p>
              {profile.name} · built with React &amp; Tailwind
            </p>
            <p className="hidden font-mono text-[12px] text-fg-subtle md:block">
              press{' '}
              <kbd className="rounded border border-border px-1.5 text-fg-muted">/</kbd>{' '}
              to search · or type <span className="text-fg-muted">help</span> in
              the terminal
            </p>
            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth',
                })
              }
              className="group inline-flex items-center gap-1.5 hover:text-fg"
            >
              Back to top
              <span className="transition-transform group-hover:-translate-y-0.5">↑</span>
            </button>
          </div>
        </footer>
      </div>

      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTab={setTab}
      />
      <Toaster />
    </div>
  )
}
