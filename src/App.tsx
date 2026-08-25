import { useEffect, useState } from 'react'
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
  const { contributions, user, loading, live, error, reload } = useGithubData()
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
            <ProfileSidebar user={user} />

            <div key={tab} className="tab-in min-w-0 flex-1 space-y-6">
              {tab === 'overview' && (
                <>
                  <ContributionGraph
                    data={contributions}
                    loading={loading}
                    live={live}
                    error={error}
                    onRetry={reload}
                  />
                  <ReadmeCard />
                  <PinnedRepos />
                </>
              )}
              {tab === 'repositories' && <RepositoriesPanel />}
              {tab === 'experience' && <ExperiencePanel />}
              {tab === 'skills' && <SkillsPanel />}
            </div>
          </div>
        </main>

        <footer className="border-t border-border py-4 text-center text-[13px] text-fg-muted">
          <p>{profile.name}</p>
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
