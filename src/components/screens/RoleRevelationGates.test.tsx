// @vitest-environment jsdom
import { act, type ComponentProps, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'
import { I18nProvider, interpolate } from '../../lib/i18n'
import en from '../../lib/i18n/translations/en'
import es from '../../lib/i18n/translations/es'
import { GameScreen } from './GameScreen'
import * as revelation from './RoleRevelationScreen'
import { StorageBoundary } from '../StorageBoundary'
import { makeGame, makePlayer, makeState } from '../../lib/__tests__/helpers'
import { getRoleRevelationProgress, markRoleRevealed } from '../../lib/game'
import { getCurrentState, type Game } from '../../lib/types'
import { getGame, saveGame, setCurrentGameId } from '../../lib/storage'
import { isAudienceProtected } from '../../lib/audienceProtection'
import { router } from '../../lib/router'

let container: HTMLDivElement
let root: Root
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
function render(node: ReactNode) {
  act(() =>
    root.render(
      <I18nProvider>
        <StorageBoundary>{node}</StorageBoundary>
      </I18nProvider>,
    ),
  )
}
function button(text: string) {
  const el = [...document.querySelectorAll<HTMLButtonElement>('button,a')].find(
    (node) => node.textContent?.includes(text),
  )
  expect(el, `Missing control ${text}`).toBeTruthy()
  return el!
}
function click(text: string) {
  act(() => button(text).click())
}
function hold(ms = 1000) {
  act(() =>
    button(en.game.returnDeviceReady).dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: ' ' }),
    ),
  )
  act(() => vi.advanceTimersByTime(ms))
}
function fixture(revealed = 0) {
  let game = makeGame(
    makeState({
      phase: 'setup',
      round: 0,
      players: [
        makePlayer({ id: 'a', name: 'Alex', roleId: 'soldier' }),
        makePlayer({ id: 'b', name: 'Alex', roleId: 'chef' }),
        makePlayer({ id: 'c', name: 'Bea', roleId: 'monk' }),
        makePlayer({ id: 'd', name: 'Chris', roleId: 'poisoner' }),
        makePlayer({ id: 'e', name: 'Dana', roleId: 'imp' }),
      ],
    }),
  )
  for (const player of getCurrentState(game).players.slice(0, revealed))
    game = markRoleRevealed(game, player.id)
  return game
}
function mountGame(game: Game) {
  saveGame(game)
  render(<GameScreen initialGame={game} onMainMenu={vi.fn()} />)
}
function mountApp(game: Game) {
  saveGame(game)
  setCurrentGameId(game.id)
  router.replace(`/game/${game.id}`)
  render(<App />)
}
function reloadApp() {
  act(() => root.unmount())
  root = createRoot(container)
  render(<App />)
}
function revealFirstPlayer() {
  click('Alex')
  click(en.game.tapWhenReady)
  click(en.common.iUnderstandMyRole)
}
function quietExpectedFailure(action: () => void) {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const listener = (event: ErrorEvent) => event.preventDefault()
  window.addEventListener('error', listener)
  try {
    action()
  } finally {
    window.removeEventListener('error', listener)
  }
}

describe('history-derived first-night gate', () => {
  it.each([0, 2, 5])(
    '%i revealed players determine primary disabled state and count',
    (count) => {
      const game = fixture(count)
      mountGame(game)
      expect(button(en.game.startFirstNight).disabled).toBe(count !== 5)
      expect(container.textContent).toContain(`${count} / 5`)
      if (count !== 5) {
        expect(container.textContent).toContain(en.game.revealAllFirst)
        click(en.game.startFirstNight)
        expect(getCurrentState(getGame(game.id)!).phase).toBe('setup')
      } else {
        expect(container.textContent).not.toContain(en.game.skipRoleRevelation)
        click(en.game.startFirstNight)
        expect(getCurrentState(getGame(game.id)!).phase).toBe('night')
        expect(document.querySelector('[role="dialog"]')).toBeNull()
      }
    },
  )
  it('uses player IDs despite duplicate names, duplicate entries and unrelated IDs', () => {
    const game = fixture(1)
    const entry = game.history.at(-1)!
    game.history.push(
      { ...entry, id: 'duplicate' },
      { ...entry, id: 'unknown', data: { playerId: 'absent' } },
    )
    expect(getRoleRevelationProgress(game).revealedCount).toBe(1)
    mountGame(game)
    expect(container.textContent).toContain('1 / 5')
    expect(
      [...container.querySelectorAll('button')].filter((node) =>
        node.getAttribute('aria-label')?.includes(en.game.revealedShowAgain),
      ),
    ).toHaveLength(1)
    expect(button(en.game.startFirstNight).disabled).toBe(true)
  })
  it('GameScreen rejects direct invocation of ordinary start before all players are revealed', () => {
    const Original = revelation.RoleRevelationScreen
    let captured!: ComponentProps<typeof Original>
    vi.spyOn(revelation, 'RoleRevelationScreen').mockImplementation((props) => {
      captured = props
      return <Original {...props} />
    })
    const game = fixture(2)
    mountGame(game)
    const before = localStorage.getItem('grimoire_games')
    act(() => captured.onStartNight())
    expect(localStorage.getItem('grimoire_games')).toBe(before)
    expect(container.textContent).toContain(en.game.roleRevelation)
  })
  it('stale start and skip handlers cannot bypass an active private handoff', () => {
    const Original = revelation.RoleRevelationScreen
    let captured!: ComponentProps<typeof Original>
    vi.spyOn(revelation, 'RoleRevelationScreen').mockImplementation((props) => {
      captured = props
      return <Original {...props} />
    })
    const game = fixture(5)
    mountGame(game)
    const before = localStorage.getItem('grimoire_games')
    const callbacks = captured
    click('Alex')
    click(en.game.tapWhenReady)
    act(() => {
      callbacks.onStartNight()
      callbacks.onSkipRevelation()
    })
    expect(isAudienceProtected()).toBe(true)
    expect(container.textContent).toContain(en.common.iUnderstandMyRole)
    expect(localStorage.getItem('grimoire_games')).toBe(before)
  })
})

describe('intentional skip confirmation', () => {
  it.each([
    ['en', 4, en.game.skipRevelationOne],
    ['en', 2, en.game.skipRevelationMany],
    ['es', 4, es.game.skipRevelationOne],
    ['es', 2, es.game.skipRevelationMany],
  ] as const)(
    '%s copy for %i revealed players uses current singular/plural count',
    (language, count, message) => {
      localStorage.setItem('grimoire_language', language)
      const copy = language === 'en' ? en : es
      const game = fixture(count)
      mountGame(game)
      const before = localStorage.getItem('grimoire_games')
      click(copy.game.skipRoleRevelation)
      expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
        interpolate(message, { count: 5 - count }),
      )
      expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
        copy.game.skipRevelationExplanation,
      )
      expect(localStorage.getItem('grimoire_games')).toBe(before)
      click(copy.common.cancel)
      expect(document.querySelector('[role="dialog"]')).toBeNull()
      expect(localStorage.getItem('grimoire_games')).toBe(before)
    },
  )
  it('confirms exactly once, saves before publishing and does not invent revelations', () => {
    const game = fixture(2)
    mountGame(game)
    click(en.game.skipRoleRevelation)
    const confirm = button(en.game.confirmSkipRevelation)
    const write = Storage.prototype.setItem
    let checked = false
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === 'grimoire_games') {
        expect(container.textContent).toContain(en.game.roleRevelation)
        expect(container.textContent).not.toContain(en.game.nightDashboard)
        checked = true
      }
      return write.call(this, key, value)
    })
    act(() => {
      confirm.click()
      confirm.click()
    })
    const saved = getGame(game.id)!
    expect(checked).toBe(true)
    expect(
      saved.history.filter((entry) => entry.type === 'night_started'),
    ).toHaveLength(1)
    expect(
      saved.history.filter((entry) => entry.type === 'role_revealed'),
    ).toHaveLength(2)
    expect(getCurrentState(saved).phase).toBe('night')
  })
  it('reload dismisses the dialog and preserves saved partial progress', () => {
    const game = fixture(2)
    mountApp(game)
    click(en.game.skipRoleRevelation)
    const before = localStorage.getItem('grimoire_games')
    reloadApp()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(container.textContent).toContain('2 / 5')
    expect(button(en.game.startFirstNight).disabled).toBe(true)
    expect(localStorage.getItem('grimoire_games')).toBe(before)
  })
  it('later skip dialogs use the updated unrevealed count', () => {
    const game = fixture(3)
    mountGame(game)
    click(en.game.skipRoleRevelation)
    click(en.common.cancel)
    // Chris is the fourth player; first three have committed revelation.
    click('Chris')
    click(en.game.tapWhenReady)
    click(en.common.iUnderstandMyRole)
    hold()
    expect(container.textContent).toContain('4 / 5')
    click(en.game.skipRoleRevelation)
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
      interpolate(en.game.skipRevelationOne, { count: 1 }),
    )
  })
  it('dialog is keyboard dismissible without saving', () => {
    const game = fixture(0)
    mountGame(game)
    const before = localStorage.getItem('grimoire_games')
    click(en.game.skipRoleRevelation)
    act(() =>
      document.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }),
      ),
    )
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(localStorage.getItem('grimoire_games')).toBe(before)
  })
})

describe('revelation completion, resume and failed saves', () => {
  it('new revelation commits only after protected handback and enables start when the final player returns', () => {
    const game = fixture(4)
    mountGame(game)
    const before = localStorage.getItem('grimoire_games')
    click('Dana')
    click(en.game.tapWhenReady)
    click(en.common.iUnderstandMyRole)
    hold(999)
    expect(localStorage.getItem('grimoire_games')).toBe(before)
    act(() => vi.advanceTimersByTime(1))
    expect(container.textContent).toContain('5 / 5')
    expect(button(en.game.startFirstNight).disabled).toBe(false)
    expect(container.textContent).not.toContain(en.game.skipRoleRevelation)
  })
  it('viewing an already revealed player uses protected handback without duplicate history or save', () => {
    const game = fixture(1)
    mountGame(game)
    const before = localStorage.getItem('grimoire_games')
    expect(button('Alex').textContent).not.toContain(en.game.revealedShowAgain)
    expect(button('Alex').getAttribute('aria-label')).toContain(
      en.game.revealedShowAgain,
    )
    expect(button('Alex').querySelector('.text-emerald-500 svg')).not.toBeNull()
    revealFirstPlayer()
    expect(document.querySelector('[title="Grimoire"]')).toBeNull()
    expect(container.textContent).not.toContain(en.game.roleRevelation)
    expect(isAudienceProtected()).toBe(true)
    hold()
    expect(localStorage.getItem('grimoire_games')).toBe(before)
    expect(
      getGame(game.id)!.history.filter(
        (entry) => entry.type === 'role_revealed',
      ),
    ).toHaveLength(1)
    expect(container.textContent).toContain('1 / 5')
    expect(markRoleRevealed(game, 'a')).toBe(game)
  })
  it('reload during new private revelation requires recovery hold and never marks the interrupted player', () => {
    const game = fixture(2)
    mountApp(game)
    click('Bea')
    click(en.game.tapWhenReady)
    const before = localStorage.getItem('grimoire_games')
    reloadApp()
    expect(container.textContent).toContain(en.game.returnDeviceReady)
    expect(container.textContent).not.toContain(en.game.roleRevelation)
    hold()
    expect(container.textContent).toContain('2 / 5')
    expect(button(en.game.startFirstNight).disabled).toBe(true)
    expect(localStorage.getItem('grimoire_games')).toBe(before)
    // Already revealed roles remain selectable after recovery.
    revealFirstPlayer()
    hold()
    expect(localStorage.getItem('grimoire_games')).toBe(before)
  })
  it.each(['ordinary start', 'confirmed skip', 'new revelation'])(
    'failed save for %s leaves the committed game unchanged',
    (flow) => {
      const game = fixture(flow === 'ordinary start' ? 5 : 0)
      mountGame(game)
      const before = localStorage.getItem('grimoire_games')
      const write = Storage.prototype.setItem
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
        this: Storage,
        key,
        value,
      ) {
        if (key === 'grimoire_games') throw new Error('disk full')
        return write.call(this, key, value)
      })
      quietExpectedFailure(() => {
        if (flow === 'ordinary start') click(en.game.startFirstNight)
        else if (flow === 'confirmed skip') {
          click(en.game.skipRoleRevelation)
          click(en.game.confirmSkipRevelation)
        } else {
          revealFirstPlayer()
          hold()
        }
      })
      expect(localStorage.getItem('grimoire_games')).toBe(before)
      expect(getCurrentState(getGame(game.id)!).phase).toBe('setup')
      expect(document.querySelector('[role="alert"]')).not.toBeNull()
      expect(container.textContent).not.toContain(en.game.nightDashboard)
    },
  )
})
