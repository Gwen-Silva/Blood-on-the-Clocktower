// @vitest-environment jsdom
import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'
import { I18nProvider } from '../../lib/i18n'
import en from '../../lib/i18n/translations/en'
import { StorageBoundary } from '../StorageBoundary'
import { saveGame, setCurrentGameId } from '../../lib/storage'
import { makeGame, makePlayer, makeState } from '../../lib/__tests__/helpers'
import {
  isAudienceProtected,
  protectAudience,
} from '../../lib/audienceProtection'
import { router } from '../../lib/router'
import { PlayerFacingScreen } from './PlayerFacingScreen'
import { HandbackButton } from './HandbackWrappers'
import { GameScreen } from '../screens/GameScreen'

const MARKER = 'grimoire_audience_protected'
let root: Root
let container: HTMLDivElement
beforeEach(() => {
  vi.useFakeTimers()
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  localStorage.clear()
  localStorage.setItem('grimoire_language', 'en')
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    value: false,
  })
  router.replace('/')
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.restoreAllMocks()
  vi.useRealTimers()
})
function render(node: ReactNode = <App />) {
  act(() =>
    root.render(
      <I18nProvider>
        <StorageBoundary>{node}</StorageBoundary>
      </I18nProvider>,
    ),
  )
}
function reboot() {
  act(() => root.unmount())
  root = createRoot(container)
  render()
}
function button(text: string) {
  const el = [...document.querySelectorAll('button,a')].find((el) =>
    el.textContent?.includes(text),
  )
  expect(el, `Missing ${text}`).toBeTruthy()
  return el!
}
function click(text: string) {
  act(() => {
    button(text).dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
}
function tick(ms: number) {
  act(() => vi.advanceTimersByTime(ms))
}
function hold(ms = 1000) {
  const el = button(en.game.returnDeviceReady)
  act(() => {
    el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: ' ' }))
  })
  tick(ms)
}
function neutral() {
  expect(container.textContent).toContain(en.game.returnDeviceReady)
  expect(container.textContent).not.toContain('Alex')
  expect(container.textContent).not.toContain('Soldier')
  expect(container.textContent).not.toContain(en.game.roleRevelation)
  expect(container.textContent).not.toContain(en.mainMenu.continueGame)
  expect(document.querySelector('[title="Grimoire"]')).toBeNull()
  expect(document.querySelector('[title="History"]')).toBeNull()
}
function fixture(phase: 'setup' | 'night' = 'setup') {
  const game = makeGame(
    makeState({
      phase,
      round: phase === 'night' ? 1 : 0,
      players: [
        makePlayer({
          name: 'Alex',
          roleId: phase === 'night' ? 'empath' : 'soldier',
        }),
        makePlayer({ name: 'Bea', roleId: 'imp' }),
        makePlayer({ name: 'Chris', roleId: 'monk' }),
        makePlayer({ name: 'Dana', roleId: 'saint' }),
        makePlayer({ name: 'Eli', roleId: 'soldier' }),
      ],
    }),
  )
  saveGame(game)
  setCurrentGameId(game.id)
  router.replace(`/game/${game.id}`)
  return game
}

describe('durable audience privacy latch', () => {
  it.each(['private reveal', 'ReturnDevice'])(
    'reload during %s restores neutral handback, never committed revelation',
    (stage) => {
      fixture()
      const saved = localStorage.getItem('grimoire_games')
      render()
      click('Alex')
      expect(isAudienceProtected()).toBe(true)
      click(en.game.tapWhenReady)
      if (stage === 'ReturnDevice') click(en.common.iUnderstandMyRole)
      reboot()
      neutral()
      click(en.game.returnDeviceReady)
      tick(1200)
      neutral()
      hold(999)
      neutral()
      expect(localStorage.getItem('grimoire_games')).toBe(saved)
      tick(1)
      expect(isAudienceProtected()).toBe(false)
      expect(container.textContent).toContain(en.game.roleRevelation)
      expect(localStorage.getItem('grimoire_games')).toBe(saved)
    },
  )
  it('app restart on another route remains neutral and stores no secret marker data', () => {
    fixture()
    protectAudience()
    expect(localStorage.getItem(MARKER)).toBe('1')
    router.replace('/roles')
    render()
    neutral()
    reboot()
    neutral()
    hold()
    expect(isAudienceProtected()).toBe(false)
  })
  it('Back → Main Menu → Continue cannot bypass handback', () => {
    const game = fixture()
    render()
    click('Alex')
    click(en.game.tapWhenReady)
    act(() => {
      window.history.replaceState(null, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    neutral()
    // Even a direct Continue-equivalent URL cannot mount the game behind the guard.
    act(() => router.navigate(`/game/${game.id}`))
    neutral()
    act(() => router.navigate('/'))
    neutral()
    hold()
    if (document.querySelector(`[aria-label="${en.mainMenu.tapToOpen}"]`)) {
      click(en.mainMenu.tapToOpen)
      tick(700)
    }
    expect(container.textContent).toContain(en.mainMenu.continueGame)
    click(en.mainMenu.continueGame)
    expect(container.textContent).toContain(en.game.roleRevelation)
    expect(localStorage.getItem('grimoire_games')).not.toContain(
      'role_revealed',
    )
  })
  it.each(['private reveal', 'ReturnDevice'])(
    'reloading a night %s does not complete or save the provisional action',
    (stage) => {
      fixture('night')
      const saved = localStorage.getItem('grimoire_games')
      render()
      click('Alex')
      click(en.game.stepShowResult)
      click(en.game.tapWhenReady)
      expect(container.textContent).toContain("Empath's Information")
      if (stage === 'ReturnDevice') click(en.common.continue)
      reboot()
      neutral()
      hold()
      expect(container.textContent).not.toContain(en.game.returnDeviceReady)
      expect(localStorage.getItem('grimoire_games')).toBe(saved)
      expect(localStorage.getItem('grimoire_games')).not.toContain(
        'night_action',
      )
    },
  )
  it('navigation during a recovery hold resets the timer rather than releasing on the new route', () => {
    fixture()
    protectAudience()
    render()
    hold(999)
    act(() => router.navigate('/roles'))
    tick(1)
    neutral()
    expect(isAudienceProtected()).toBe(true)
    hold()
    expect(isAudienceProtected()).toBe(false)
  })
  it('failed release on restored app never mounts Storyteller controls', () => {
    fixture()
    protectAudience()
    render()
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const onError = (event: ErrorEvent) => event.preventDefault()
    window.addEventListener('error', onError)
    try {
      hold()
      expect(document.querySelector('[role="alert"]')).not.toBeNull()
      expect(container.textContent).not.toContain('Alex')
      expect(isAudienceProtected()).toBe(true)
    } finally {
      window.removeEventListener('error', onError)
    }
  })
  it('direct GameScreen restoration is protected before its children mount', () => {
    const game = fixture()
    protectAudience()
    render(<GameScreen initialGame={game} onMainMenu={vi.fn()} />)
    neutral()
    hold(999)
    neutral()
    tick(1)
    expect(container.textContent).toContain(en.game.roleRevelation)
  })
  it('unknown non-null marker values fail closed without rewriting saves', () => {
    fixture()
    const saved = localStorage.getItem('grimoire_games')
    localStorage.setItem(MARKER, 'corrupted marker')
    render()
    neutral()
    expect(localStorage.getItem('grimoire_games')).toBe(saved)
  })
  it.each(['throw', 'silently drop', 'verification read fails'])(
    'failed marker registration (%s) exposes no private content',
    (mode) => {
      const ready = vi.fn()
      const write = Storage.prototype.setItem
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
        this: Storage,
        key,
        value,
      ) {
        if (key === MARKER && mode === 'throw') throw new Error('disk full')
        if (key === MARKER && mode === 'silently drop') return
        write.call(this, key, value)
      })
      if (mode === 'verification read fails')
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (
          this: Storage,
          key,
        ) {
          if (key === MARKER) throw new Error('unreadable')
          return null
        })
      vi.spyOn(console, 'error').mockImplementation(() => {})
      const onError = (event: ErrorEvent) => event.preventDefault()
      window.addEventListener('error', onError)
      try {
        render(
          <PlayerFacingScreen>
            <p>PRIVATE SECRET</p>
            <HandbackButton onClick={ready}>Done</HandbackButton>
          </PlayerFacingScreen>,
        )
        expect(container.textContent).not.toContain('PRIVATE SECRET')
        expect(document.querySelector('[role="alert"]')).not.toBeNull()
        expect(ready).not.toHaveBeenCalled()
      } finally {
        window.removeEventListener('error', onError)
      }
    },
  )
  it('unreadable marker blocks all routes before privileged UI is rendered', () => {
    fixture()
    const read = Storage.prototype.getItem
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (
      this: Storage,
      key,
    ) {
      if (key === MARKER) throw new Error('unreadable')
      return read.call(this, key)
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const onError = (event: ErrorEvent) => event.preventDefault()
    window.addEventListener('error', onError)
    try {
      render()
      expect(document.querySelector('[role="alert"]')).not.toBeNull()
      expect(container.textContent).not.toContain('Alex')
      expect(container.textContent).not.toContain(en.game.roleRevelation)
    } finally {
      window.removeEventListener('error', onError)
    }
  })
  it('failed release leaves the marker protected and never commits the callback', () => {
    const ready = vi.fn()
    render(
      <PlayerFacingScreen>
        <HandbackButton onClick={ready}>Done</HandbackButton>
      </PlayerFacingScreen>,
    )
    click('Done')
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('read only')
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const onError = (event: ErrorEvent) => event.preventDefault()
    window.addEventListener('error', onError)
    try {
      hold()
      expect(ready).not.toHaveBeenCalled()
      expect(isAudienceProtected()).toBe(true)
      expect(document.querySelector('[role="alert"]')).not.toBeNull()
    } finally {
      window.removeEventListener('error', onError)
    }
  })
})
