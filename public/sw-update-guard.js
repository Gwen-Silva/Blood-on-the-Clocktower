// The interface requests activation only from the idle main menu.
// Require a single application window so another game window is never displaced.
self.addEventListener('message', (event) => {
  if (event.data?.type !== 'ACTIVATE_WHEN_SAFE') return
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      const ownWindows = windows.filter((client) =>
        client.url.startsWith(self.registration.scope),
      )
      const accepted =
        ownWindows.length === 1 && ownWindows[0].id === event.source?.id
      event.ports[0]?.postMessage({ accepted })
      if (accepted) await self.skipWaiting()
    })(),
  )
})
