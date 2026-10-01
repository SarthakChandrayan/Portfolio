export const INTRO_SEEN_KEY = 'intro-seen'
export const INTRO_DONE = 'intro:done'

export function shouldPlayIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) !== '1'
  } catch {
    return true
  }
}
