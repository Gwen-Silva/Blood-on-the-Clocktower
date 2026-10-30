let registration: ServiceWorkerRegistration | undefined
let waiting = false
let started = false
const listeners = new Set<() => void>()
function refresh() {
  waiting = !!registration?.waiting
  listeners.forEach((listener) => listener())
}
export function subscribeToUpdate(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
export function hasWaitingUpdate() {
  return waiting
}
export async function checkForUpdate() {
  await registration?.update()
  refresh()
}
export function registerPwa() {
  if (started || !import.meta.env.PROD || !('serviceWorker' in navigator))
    return
  started = true
  const register = async () => {
    try {
      registration = await navigator.serviceWorker.register(
        `${import.meta.env.BASE_URL}sw.js`,
        { scope: import.meta.env.BASE_URL, updateViaCache: 'none' },
      )
      refresh()
      registration.addEventListener('updatefound', () => {
        registration?.installing?.addEventListener('statechange', refresh)
      })
      // Discover an already waiting release and check for a newer one on reconnect.
      await checkForUpdate()
      window.addEventListener('online', () => {
        void checkForUpdate().catch(() => {})
      })
    } catch {
      /* Offline first launch keeps the current app usable. */
    }
  }
  if (document.readyState === 'complete') void register()
  else
    window.addEventListener(
      'load',
      () => {
        void register()
      },
      { once: true },
    )
}
export async function activateWaitingUpdate(): Promise<boolean> {
  const worker = registration?.waiting
  if (!worker) return false
  return new Promise((resolve) => {
    const channel = new MessageChannel()
    const timer = window.setTimeout(() => {
      channel.port1.close()
      resolve(false)
    }, 10000)
    channel.port1.onmessage = (event) => {
      clearTimeout(timer)
      channel.port1.close()
      resolve(event.data?.accepted === true)
    }
    worker.postMessage({ type: 'ACTIVATE_WHEN_SAFE' }, [channel.port2])
  })
}
