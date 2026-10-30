// @vitest-environment jsdom
import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import App from './App'
import { I18nProvider, interpolate } from './lib/i18n'
import en from './lib/i18n/translations/en'
import es from './lib/i18n/translations/es'
import { SetupReview } from './components/screens/SetupReview'
import * as assignments from './lib/roleAssignment'
import * as engine from './lib/game'
import * as storage from './lib/storage'
import { getCurrentState } from './lib/types'
import { router } from './lib/router'
import { StorageBoundary } from './components/StorageBoundary'
import { protectAudience } from './lib/audienceProtection'
import { type SetupPlan, validateSetupPlan } from './lib/setupPlan'

let root: Root
let container: HTMLDivElement
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.useFakeTimers()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 400,
    bottom: 60,
    width: 400,
    height: 60,
    toJSON() {},
  })
  HTMLElement.prototype.scrollIntoView = vi.fn()
  localStorage.clear()
  localStorage.setItem('grimoire_language', 'en')
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
function button(text: string) {
  const found = [
    ...document.querySelectorAll<HTMLButtonElement>('button'),
  ].find((el) => el.textContent?.includes(text))
  expect(found, `Missing ${text}`).toBeTruthy()
  return found!
}
function click(text: string) {
  act(() => button(text).click())
}
function back() {
  act(() =>
    container
      .querySelector<HTMLButtonElement>(
        `button[aria-label="${en.common.back}"]`,
      )!
      .click(),
  )
}
function inputs() {
  return [...container.querySelectorAll<HTMLInputElement>('input[type="text"]')]
}
function input(el: HTMLInputElement, value: string) {
  act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )!.set!.call(el, value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
  })
}
const roleNames = ['Chef', 'Monk', 'Soldier', 'Poisoner']
function start(count = 5, custom = false) {
  render()
  if (document.querySelector(`[aria-label="${en.mainMenu.tapToOpen}"]`)) {
    click(en.mainMenu.tapToOpen)
    act(() => vi.advanceTimersByTime(700))
  }
  click(en.mainMenu.newGame)
  if (count === 6) click(en.newGame.addPlayer)
  inputs().forEach((el, i) =>
    input(el, ['Alex', 'Alex', 'Bea', 'Chris', 'Dana', 'Eli'][i]),
  )
  click(en.newGame.nextSelectRoles)
  click(en.scripts[custom ? 'custom' : 'trouble-brewing'])
  if (!custom) click(en.scripts.manual)
  roleNames.forEach(click)
  if (count === 6) click('Saint')
  click(en.newGame.nextAssignRoles)
}
function toReview() {
  click(en.setupReview.reviewSetup)
}
function assign(seat: string, role: string) {
  click(seat)
  click(role)
}
function mixed() {
  click(en.newGame.customizeAssignments)
  assign('1. Alex', 'Chef')
  assign('2. Alex', 'Imp')
}
function reviewSection(label: string) {
  return document.querySelector<HTMLElement>(`[aria-label="${label}"]`)!
}
function sample(
  manualAssignments: SetupPlan['manualAssignments'] = {},
  custom = false,
): SetupPlan {
  return {
    players: ['a', 'b', 'c', 'd', 'e'].map((id, i) => ({
      id,
      name: ['Alex', 'Alex', 'Bea', 'Chris', 'Dana'][i],
    })),
    scriptId: custom ? 'custom' : 'trouble-brewing',
    selectedRoles: [
      'imp',
      'chef',
      'monk',
      'soldier',
      'poisoner',
      ...(custom ? ['saint'] : []),
    ],
    manualAssignments,
  }
}

describe('review presentation without resolving a plan', () => {
  it.each(['en', 'es'] as const)(
    'localized %s script, count, team distribution and numbered duplicate-name seats',
    (language) => {
      localStorage.setItem('grimoire_language', language)
      const t = language === 'en' ? en : es
      render(
        <SetupReview plan={sample()} onEdit={vi.fn()} onConfirm={vi.fn()} />,
      )
      const composition = reviewSection(t.setupReview.composition)
      expect(composition.textContent).toContain(t.scripts['trouble-brewing'])
      expect(composition.textContent).toContain(
        interpolate(t.setupReview.playerCount, { count: 5 }),
      )
      expect(
        [...composition.querySelectorAll('li')].map((el) => el.textContent),
      ).toEqual(['1. Alex', '2. Alex', '3. Bea', '4. Chris', '5. Dana'])
      const characters = reviewSection(t.setupReview.characters)
      expect(characters.textContent).toContain(`${t.teams.townsfolk.name} (3)`)
      expect(characters.textContent).toContain(`${t.teams.minion.name} (1)`)
      expect(characters.textContent).toContain(`${t.teams.demon.name} (1)`)
      expect(characters.textContent).toContain(
        interpolate(t.setupReview.selectedCount, { count: 5, players: 5 }),
      )
      expect(button(t.setupReview.createGame).disabled).toBe(false)
    },
  )
  it.each([
    [{}, en.setupReview.allRandom],
    [{ a: 'chef', b: 'imp' }, en.setupReview.mixed],
    [
      { a: 'chef', b: 'imp', c: 'monk', d: 'soldier', e: 'poisoner' },
      en.setupReview.allManual,
    ],
  ] as const)(
    'shows the assignment mode %s without speculative outcomes',
    (manual, label) => {
      render(
        <SetupReview
          plan={sample(manual)}
          onEdit={vi.fn()}
          onConfirm={vi.fn()}
        />,
      )
      const section = reviewSection(en.setupReview.assignments)
      expect(section.textContent).toContain(label)
      const rows = [...section.querySelectorAll('li')]
      const count = Object.keys(manual).length
      expect(
        rows.filter((row) =>
          row.textContent?.includes(en.setupReview.awaitingRandom),
        ),
      ).toHaveLength(5 - count)
      if (count) {
        expect(rows[0].textContent).toContain('1. AlexChef')
        expect(rows[1].textContent).toContain('2. AlexImp')
      }
    },
  )
  it('larger custom pools explicitly distinguish options from final assigned composition', () => {
    render(
      <SetupReview
        plan={sample({}, true)}
        onEdit={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )
    expect(container.textContent).toContain(
      interpolate(en.setupReview.largerPool, { count: 6, players: 5 }),
    )
    expect(reviewSection(en.setupReview.assignments).textContent).not.toContain(
      'Chef',
    )
  })
  it.each<SetupPlan['manualAssignments']>([
    { a: 'missing' },
    { a: 'chef', b: 'chef' },
    { ghost: 'imp' },
  ])('invalid manual plan cannot be confirmed: %j', (manual) => {
    render(
      <SetupReview
        plan={sample(manual)}
        onEdit={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )
    expect(button(en.setupReview.createGame).disabled).toBe(true)
    expect(() => validateSetupPlan(sample(manual))).toThrow()
  })
})

describe('actual wizard planning, editing and creation', () => {
  it('entering and revisiting review never resolves roles, creates games or saves', () => {
    const resolve = vi.spyOn(assignments, 'resolveIdentifiedRoleAssignments')
    const create = vi.spyOn(engine, 'createGame')
    const save = vi.spyOn(storage, 'saveGame')
    start()
    toReview()
    expect(container.textContent).toContain(en.setupReview.allRandom)
    click(en.setupReview.editAssignments)
    toReview()
    back()
    toReview()
    expect(resolve).not.toHaveBeenCalled()
    expect(create).not.toHaveBeenCalled()
    expect(save).not.toHaveBeenCalled()
    expect(storage.getAllGames()).toHaveLength(0)
  })
  it('editing assignments preserves compatible choices and leaving that screen backwards preserves edits', () => {
    start()
    mixed()
    toReview()
    click(en.setupReview.editAssignments)
    click(en.newGame.customizeAssignments)
    expect(button('1. Alex').textContent).toContain('Chef')
    assign('3. Bea', 'Monk')
    back()
    click(en.newGame.nextAssignRoles)
    toReview()
    expect(reviewSection(en.setupReview.assignments).textContent).toContain(
      '3. BeaMonk',
    )
    expect(storage.getAllGames()).toHaveLength(0)
  })
  it('Review → Edit Players retains IDs and role mapping through rename and actual touch reorder', () => {
    const resolve = vi.spyOn(assignments, 'resolveIdentifiedRoleAssignments')
    start()
    mixed()
    toReview()
    click(en.setupReview.editPlayers)
    input(inputs()[0], 'Renamed Alex')
    const handle = inputs()[0].previousElementSibling!
    const touch = (type: string, y: number) => {
      const point = {
        identifier: 1,
        target: handle,
        clientX: 10,
        clientY: y,
        pageX: 10,
        pageY: y,
        screenX: 10,
        screenY: y,
        force: 1,
        radiusX: 1,
        radiusY: 1,
        rotationAngle: 0,
      } as Touch
      act(() =>
        handle.dispatchEvent(
          new TouchEvent(type, {
            bubbles: true,
            cancelable: true,
            touches: type === 'touchend' ? [] : [point],
            changedTouches: [point],
            targetTouches: type === 'touchend' ? [] : [point],
          }),
        ),
      )
    }
    touch('touchstart', 0)
    touch('touchmove', 6)
    touch('touchmove', 150)
    touch('touchend', 150)
    click(en.newGame.nextSelectRoles)
    click(en.scripts['trouble-brewing'])
    click(en.newGame.nextAssignRoles)
    toReview()
    const section = reviewSection(en.setupReview.assignments)
    expect(section.textContent).toContain('1. AlexImp')
    expect(section.textContent).toContain('3. Renamed AlexChef')
    expect(resolve).not.toHaveBeenCalled()
    click(en.setupReview.createGame)
    const plan = resolve.mock.calls[0][0]
    const saved = getCurrentState(storage.getAllGames()[0]).players
    expect(saved.map(({ id }) => id)).toEqual(plan.players.map(({ id }) => id))
    expect(saved[0].roleId).toBe('imp')
    expect(saved[2].roleId).toBe('chef')
  })
  it('deleting a player clears downstream choices and stale assignments', () => {
    start(6, true)
    mixed()
    toReview()
    click(en.setupReview.editPlayers)
    // Remove the first player, who had the manually assigned Chef.
    act(() =>
      inputs()[0].nextElementSibling!.dispatchEvent(
        new MouseEvent('click', { bubbles: true }),
      ),
    )
    click(en.newGame.nextSelectRoles)
    click(en.scripts.custom)
    expect(button(en.newGame.nextAssignRoles).disabled).toBe(true)
    roleNames.forEach(click)
    click(en.newGame.nextAssignRoles)
    toReview()
    expect(container.textContent).toContain(en.setupReview.allRandom)
    expect(reviewSection(en.setupReview.composition).textContent).toContain(
      '5 players',
    )
  })
  it('changing script invalidates character pool and all manual assignments', () => {
    start()
    mixed()
    toReview()
    click(en.setupReview.editScript)
    click(en.scripts.custom)
    expect(button(en.newGame.nextAssignRoles).disabled).toBe(true)
    roleNames.forEach(click)
    click(en.newGame.nextAssignRoles)
    toReview()
    expect(container.textContent).toContain(en.setupReview.allRandom)
    expect(reviewSection(en.setupReview.composition).textContent).toContain(
      en.scripts.custom,
    )
  })
  it('changing characters removes unsupported assignments while preserving compatible ones', () => {
    start()
    mixed()
    toReview()
    click(en.setupReview.editCharacters)
    click('Chef')
    click('Empath')
    click(en.newGame.nextAssignRoles)
    toReview()
    const section = reviewSection(en.setupReview.assignments)
    expect(section.textContent).toContain(
      `1. Alex${en.setupReview.awaitingRandom}`,
    )
    expect(section.textContent).toContain('2. AlexImp')
  })
  it('final double confirmation resolves and persists once, then enters role revelation gated by Task 003', () => {
    const resolve = vi.spyOn(assignments, 'resolveIdentifiedRoleAssignments')
    const create = vi.spyOn(engine, 'createGame')
    const save = vi.spyOn(storage, 'saveGame')
    start()
    mixed()
    toReview()
    const confirm = button(en.setupReview.createGame)
    act(() => {
      confirm.click()
      confirm.click()
    })
    expect(resolve).toHaveBeenCalledTimes(1)
    expect(create).toHaveBeenCalledTimes(1)
    expect(save).toHaveBeenCalledTimes(1)
    const games = storage.getAllGames()
    expect(games).toHaveLength(1)
    const players = getCurrentState(games[0]).players
    expect(players[0].roleId).toBe('chef')
    expect(players[1].roleId).toBe('imp')
    expect(storage.getCurrentGameId()).toBe(games[0].id)
    expect(container.textContent).toContain(en.game.roleRevelation)
    expect(button(en.game.startFirstNight).disabled).toBe(true)
  })
  it('a larger custom pool stays unresolved until confirmation and retains the Demon guarantee', () => {
    const resolve = vi.spyOn(assignments, 'resolveIdentifiedRoleAssignments')
    start(5, true)
    toReview()
    click(en.setupReview.editCharacters)
    click('Saint')
    click(en.newGame.nextAssignRoles)
    toReview()
    expect(container.textContent).toContain(
      interpolate(en.setupReview.largerPool, { count: 6, players: 5 }),
    )
    expect(resolve).not.toHaveBeenCalled()
    click(en.setupReview.createGame)
    expect(resolve).toHaveBeenCalledTimes(1)
    expect(resolve.mock.calls[0][0].selectedRoles).toHaveLength(6)
    const players = getCurrentState(storage.getAllGames()[0]).players
    expect(players).toHaveLength(5)
    expect(players.some(({ roleId }) => roleId === 'imp')).toBe(true)
  })
  it('all-manual confirmation preserves exactly the confirmed roles', () => {
    start()
    mixed()
    assign('3. Bea', 'Monk')
    assign('4. Chris', 'Soldier')
    assign('5. Dana', 'Poisoner')
    toReview()
    expect(container.textContent).toContain(en.setupReview.allManual)
    click(en.setupReview.createGame)
    expect(
      getCurrentState(storage.getAllGames()[0]).players.map(
        ({ roleId }) => roleId,
      ),
    ).toEqual(['chef', 'imp', 'monk', 'soldier', 'poisoner'])
  })
  it.each(['game write', 'pointer write'])(
    'failed %s preserves existing games and does not navigate or announce success',
    (failure) => {
      const existing = engine.createGame('Existing', 'trouble-brewing', [
        { name: 'Existing player', roleId: 'imp' },
      ])
      storage.saveGame(existing)
      storage.setCurrentGameId(existing.id)
      start()
      toReview()
      const before = localStorage.getItem('grimoire_games')
      const write = Storage.prototype.setItem
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
        this: Storage,
        key,
        value,
      ) {
        if (
          key ===
          (failure === 'game write'
            ? 'grimoire_games'
            : 'grimoire_current_game')
        )
          throw new Error('disk full')
        return write.call(this, key, value)
      })
      vi.spyOn(console, 'error').mockImplementation(() => {})
      const onError = (event: ErrorEvent) => event.preventDefault()
      window.addEventListener('error', onError)
      try {
        click(en.setupReview.createGame)
      } finally {
        window.removeEventListener('error', onError)
      }
      expect(router.getPath()).toBe('/')
      expect(document.querySelector('[role="alert"]')).not.toBeNull()
      expect(container.textContent).not.toContain(en.game.roleRevelation)
      expect(storage.getCurrentGameId()).toBe(existing.id)
      expect(storage.getGame(existing.id)).toEqual(existing)
      if (failure === 'game write')
        expect(localStorage.getItem('grimoire_games')).toBe(before)
    },
  )
  it('saves the game before updating its pointer and publishing its UI', () => {
    start()
    toReview()
    const writes: string[] = []
    const write = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (
        (key === 'grimoire_games' || key === 'grimoire_current_game') &&
        writes.length < 2
      ) {
        expect(container.textContent).toContain(en.setupReview.reviewSetup)
        expect(router.getPath()).toBe('/')
        writes.push(key)
      }
      return write.call(this, key, value)
    })
    click(en.setupReview.createGame)
    expect(writes.slice(0, 2)).toEqual([
      'grimoire_games',
      'grimoire_current_game',
    ])
  })
  it('pending audience protection keeps the Storyteller review flow inaccessible', () => {
    protectAudience()
    render()
    expect(container.textContent).toContain(en.game.returnDeviceReady)
    expect(container.textContent).not.toContain(en.setupReview.reviewSetup)
    expect(container.textContent).not.toContain(en.mainMenu.newGame)
  })
})
