import guardSource from '../../../public/sw-update-guard.js?raw'
import { expect, it, vi } from 'vitest'

it.each([
  ['sole', true],
  ['other-window', false],
  ['wrong-source', false],
])('requires a single matching app window: %s', async (mode, accepted) => {
  let listener: (event: unknown) => void = () => {}
  const skipWaiting = vi.fn(),
    reply = vi.fn()
  let pending: Promise<unknown> = Promise.resolve()
  const clients = [{ id: 'home', url: 'https://example.com/app/' }]
  if (mode === 'other-window')
    clients.push({ id: 'game', url: 'https://example.com/app/game/private' })
  const worker = {
    addEventListener: (_name: string, fn: typeof listener) => {
      listener = fn
    },
    clients: { matchAll: async () => clients },
    registration: { scope: 'https://example.com/app/' },
    skipWaiting,
  }
  new Function('self', guardSource)(worker)
  listener({
    data: { type: 'ACTIVATE_WHEN_SAFE' },
    source: { id: mode === 'wrong-source' ? 'other' : 'home' },
    ports: [{ postMessage: reply }],
    waitUntil: (promise: Promise<unknown>) => {
      pending = promise
    },
  })
  await pending
  expect(reply).toHaveBeenCalledWith({ accepted })
  expect(skipWaiting).toHaveBeenCalledTimes(accepted ? 1 : 0)
})
