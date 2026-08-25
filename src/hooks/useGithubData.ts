import { useEffect, useState } from 'react'
import {
  fetchContributions,
  fetchGithubUser,
  peekCachedContributions,
  type ContributionPayload,
  type GithubUser,
} from '../lib/github'

export function useGithubData() {
  const cached = peekCachedContributions()
  const [contributions, setContributions] = useState<ContributionPayload | null>(
    cached,
  )
  const [user, setUser] = useState<GithubUser | null>(null)
  const [loading, setLoading] = useState(!cached)
  const [live, setLive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setError(null)
    if (!peekCachedContributions()) setLoading(true)

    void Promise.allSettled([fetchContributions(), fetchGithubUser()]).then(
      ([contribResult, userResult]) => {
        if (contribResult.status === 'fulfilled') {
          setContributions(contribResult.value)
          setLive(true)
          setError(null)
        } else if (!peekCachedContributions()) {
          setError('Could not load live contributions from GitHub.')
        }
        if (userResult.status === 'fulfilled') {
          setUser(userResult.value)
        }
        setLoading(false)
      },
    )
  }

  useEffect(() => {
    load()
  }, [])

  return { contributions, user, loading, live, error, reload: load }
}
