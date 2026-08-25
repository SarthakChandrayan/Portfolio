type Listener = (message: string) => void

const listeners = new Set<Listener>()

export function toast(message: string) {
  listeners.forEach((listener) => listener(message))
}

export function subscribeToasts(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export async function copyText(value: string, message: string) {
  try {
    await navigator.clipboard.writeText(value)
    toast(message)
  } catch {
    toast('Could not copy')
  }
}
