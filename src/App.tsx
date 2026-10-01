import { useEffect, useLayoutEffect, useState } from 'react'
import { CommandPalette } from './components/CommandPalette'
import { ContactSection } from './components/ContactSection'
import { ContributionGraph } from './components/ContributionGraph'
import { Dock } from './components/Dock'
import { ExperiencePanel } from './components/ExperiencePanel'
import { Intro } from './components/Intro'
import { Ambient, ScrollProgress, Toaster } from './components/Motion'
import { PinnedRepos, ProjectFilters } from './components/PinnedRepos'
import { ProfileSidebar } from './components/ProfileSidebar'
import { ProjectDrawer } from './components/ProjectDrawer'
import { ReadmeCard } from './components/ReadmeCard'
import { Section } from './components/Section'
import { Shortcuts } from './components/Shortcuts'
import { SkillsPanel } from './components/SkillsPanel'
import { TopNav } from './components/TopNav'
import { profile, sections } from './data/profile'
import { useGithubData } from './hooks/useGithubData'
import { useScrollSpy } from './hooks/useScrollSpy'
import { shouldPlayIntro } from './lib/intro'
import { isSection, scrollToSection, stepSection } from './lib/nav'
import type { RepoFilter } from './lib/repo'

// Hashes from the old tabbed layout, so shared links keep working.
const LEGACY_HASH: Record<string, string> = {
  overview: 'about',
  repositories: 'work',
}

export default function App() {
  const { contributions, loading, live, error, reload } = useGithubData()
  const [searchOpen, setSearchOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [project, setProject] = useState({ open: false, index: 0 })
  const [filter, setFilter] = useState<RepoFilter>('all')
  const [intro] = useState(shouldPlayIntro)
  const active = useScrollSpy()

  const openProject = (index: number) => setProject({ open: true, index })
  const closeProject = () => setProject((p) => ({ ...p, open: false }))
  const showProject = (index: number) => setProject({ open: true, index })

  // Entrance animations are held while the intro plays.
  useLayoutEffect(() => {
    if (intro) document.documentElement.classList.add('intro-playing')
  }, [intro])

  const onReveal = () => document.documentElement.classList.remove('intro-playing')

  // Deep links: /#work, /#experience, …
  useEffect(() => {
    const go = () => {
      const raw = window.location.hash.slice(1)
      const hash = LEGACY_HASH[raw] ?? raw
      if (isSection(hash) && hash !== 'about') {
        requestAnimationFrame(() => scrollToSection(hash))
      }
    }
    go()
    window.addEventListener('hashchange', go)
    return () => window.removeEventListener('hashchange', go)
  }, [])

  const modalOpen = searchOpen || shortcutsOpen || project.open

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
        return
      }
      if (inField || modalOpen || e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === '/') {
        e.preventDefault()
        setSearchOpen(true)
      } else if (e.key === '?') {
        e.preventDefault()
        setShortcutsOpen(true)
      } else if (/^[1-9]$/.test(e.key) && sections[Number(e.key) - 1]) {
        scrollToSection(sections[Number(e.key) - 1].id)
      } else if (e.key === 'j' || e.key === 'J') {
        stepSection(active, 1)
      } else if (e.key === 'k' || e.key === 'K') {
        stepSection(active, -1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen, active])

  return (
    <div className="relative min-h-svh bg-canvas text-fg">
      <Ambient />
      <ScrollProgress />
      <div className="relative z-10">
        <TopNav
          onSearch={() => setSearchOpen(true)}
          onShortcuts={() => setShortcutsOpen(true)}
        />

        <main className="mx-auto max-w-[1280px] px-4 pt-8 pb-32 md:px-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <ProfileSidebar />

            <div className="min-w-0 flex-1 space-y-20 md:space-y-28">
              <Section id="about" index={1}>
                <ReadmeCard />
              </Section>

              <Section
                id="work"
                index={2}
                kicker="work"
                title="Things I've built"
                aside={<ProjectFilters value={filter} onChange={setFilter} />}
              >
                <PinnedRepos filter={filter} onOpen={openProject} />
              </Section>

              <Section id="experience" index={3} kicker="experience" title="Where I've worked">
                <ExperiencePanel />
              </Section>

              <Section id="skills" index={4} kicker="skills" title="What I work with">
                <SkillsPanel />
              </Section>

              <Section id="activity" index={5} kicker="activity" title="Shipping, daily">
                <ContributionGraph
                  data={contributions}
                  loading={loading}
                  live={live}
                  error={error}
                  onRetry={reload}
                />
              </Section>

              <Section id="contact" index={6} kicker="contact" title="Say hello">
                <ContactSection />
              </Section>
            </div>
          </div>
        </main>

        <footer className="border-t border-border pb-20 text-[13px] text-fg-muted md:pb-24">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-4 sm:justify-between md:px-8">
            <p>
              {profile.name} · built with React &amp; Tailwind
            </p>
            <p className="hidden font-mono text-[12px] text-fg-subtle md:block">
              press{' '}
              <kbd className="rounded border border-border px-1.5 text-fg-muted">?</kbd>{' '}
              for shortcuts · or type <span className="text-fg-muted">help</span> in
              the terminal
            </p>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="group inline-flex items-center gap-1.5 hover:text-fg"
            >
              Back to top
              <span className="transition-transform group-hover:-translate-y-0.5">↑</span>
            </button>
          </div>
        </footer>
      </div>

      <Dock active={active} onSearch={() => setSearchOpen(true)} />

      <ProjectDrawer
        open={project.open}
        index={project.index}
        onClose={closeProject}
        onIndex={showProject}
      />
      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={scrollToSection}
        onOpenProject={openProject}
        onShortcuts={() => setShortcutsOpen(true)}
      />
      <Shortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <Toaster />
      {intro && <Intro onReveal={onReveal} />}
    </div>
  )
}
