// @vitest-environment jsdom
import { act, type ComponentProps, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  it,
  vi,
} from 'vitest'
import App from '../../App'
import { I18nProvider, getRoleName, getRoleDescription } from '../../lib/i18n'
import en from '../../lib/i18n/translations/en'
import es from '../../lib/i18n/translations/es'
import { SCRIPTS, type ScriptId } from '../../lib/scripts'
import { getRole, getAllRoles } from '../../lib/roles'
import { getCurrentState } from '../../lib/types'
import * as engine from '../../lib/game'
import * as storage from '../../lib/storage'
import { isAudienceProtected } from '../../lib/audienceProtection'
import * as projection from '../../lib/publicGameState'
import * as reference from './PlayerReference'
import { GameScreen } from './GameScreen'
import * as nightDashboard from './NightDashboard'
import { PlayerFacingScreen } from '../layouts/PlayerFacingScreen'
import { StorageBoundary } from '../StorageBoundary'
import { router } from '../../lib/router'

let root: Root, container: HTMLDivElement
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.useFakeTimers()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
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
  const found = [
    ...document.querySelectorAll<HTMLButtonElement>('button,a'),
  ].find(
    (el) =>
      el.textContent?.trim() === text ||
      el.title === text ||
      el.querySelector('.font-tarot')?.textContent?.trim() === text,
  )
  expect(found, `Missing ${text}`).toBeTruthy()
  return found!
}
function showCategoryForRole(roleId: string) {
  const category = getRole(roleId)!.team
  act(() => {
    const picker = container.querySelector('select')
    if (picker) {
      picker.value = category
      picker.dispatchEvent(new Event('change', { bubbles: true }))
    } else
      container
        .querySelector<HTMLButtonElement>(`[data-category="${category}"]`)!
        .click()
  })
}
function click(text: string) {
  const language = (localStorage.getItem('grimoire_language') ?? 'en') as
    | 'en'
    | 'es'
    | 'pt-BR'
  const role = getAllRoles().find(
    (role) => getRoleName(role.id, language) === text,
  )
  if (role && !container.querySelector(`[data-role-id="${role.id}"]`))
    showCategoryForRole(role.id)
  act(() => button(text).click())
  act(() => vi.advanceTimersByTime(10))
}
function hold(ms = 1000) {
  act(() =>
    button(en.game.returnDeviceReady).dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
    ),
  )
  act(() => vi.advanceTimersByTime(ms))
}
function release() {
  act(() =>
    button(en.game.returnDeviceReady).dispatchEvent(
      new KeyboardEvent('keyup', { key: ' ', bubbles: true }),
    ),
  )
}
function catalog(
  scriptId: ComponentProps<
    typeof reference.PlayerReference
  >['scriptId'] = 'trouble-brewing',
  onReturnToStoryteller = vi.fn(),
) {
  render(
    <PlayerFacingScreen>
      <reference.PlayerReference
        scriptId={scriptId}
        onReturnToStoryteller={onReturnToStoryteller}
      />
    </PlayerFacingScreen>,
  )
  return onReturnToStoryteller
}
function fixture(
  phase: 'setup' | 'night' | 'day' = 'day',
  scriptId: ScriptId = 'trouble-brewing',
) {
  let game = engine.createGame('SECRET_GAME', scriptId, [
    { id: 'a', name: 'SECRET_SAME_NAME', roleId: 'soldier' },
    { id: 'b', name: 'SECRET_SAME_NAME', roleId: 'chef' },
    { id: 'c', name: 'SECRET_C', roleId: 'monk' },
    { id: 'd', name: 'SECRET_D', roleId: 'poisoner' },
    { id: 'e', name: 'SECRET_E', roleId: 'imp' },
  ])
  if (phase !== 'setup') game = engine.startNight(game)
  if (phase === 'day') game = engine.startDay(game)
  return game
}
function mountGame(game = fixture()) {
  storage.saveGame(game)
  render(<GameScreen initialGame={game} onMainMenu={vi.fn()} />)
  return game
}
function mountApp(game = fixture()) {
  storage.saveGame(game)
  storage.setCurrentGameId(game.id)
  router.replace(`/game/${game.id}`)
  render(<App />)
  return game
}
function reload() {
  act(() => root.unmount())
  root = createRoot(container)
  render(<App />)
}
function noPrivateControls() {
  expect(document.querySelector('[title="Grimoire"]')).toBeNull()
  expect(document.querySelector('[title="History"]')).toBeNull()
  expect(document.querySelector('[role="dialog"]')).toBeNull()
  expect(container.textContent).not.toContain('SECRET_')
}

describe('static public catalog', () => {
  it.each(['trouble-brewing', 'custom'] as const)(
    'lists the complete %s catalog grouped with accurate team counts',
    (scriptId) => {
      catalog(scriptId)
      const roles = SCRIPTS[scriptId].roles
      expect(container.querySelectorAll('[data-category]')).toHaveLength(4)
      expect(container.textContent).toContain(en.playerReference.introduction)
      for (const team of ['townsfolk', 'outsider', 'minion', 'demon']) {
        const expected = roles.filter((id) => getRole(id)!.team === team)
        showCategoryForRole(expected[0])
        expect(container.querySelectorAll('[data-role-id]')).toHaveLength(
          expected.length,
        )
        for (const roleId of expected) {
          expect(button(getRoleName(roleId, 'en'))).toBeTruthy()
          expect(container.textContent).toContain(
            getRoleDescription(roleId, 'en'),
          )
        }
      }
      expect(isAudienceProtected()).toBe(true)
    },
  )
  it.each(['en', 'es'] as const)(
    '%s uses registered localized names, abilities and explanatory copy',
    (language) => {
      localStorage.setItem('grimoire_language', language)
      catalog()
      const copy = language === 'en' ? en : es
      expect(container.textContent).toContain(copy.playerReference.title)
      expect(container.textContent).toContain(copy.playerReference.introduction)
      click(getRoleName('imp', language))
      expect(container.querySelector('h1')?.textContent).toBe(
        getRoleName('imp', language),
      )
      expect(container.textContent).toContain(
        getRoleDescription('imp', language),
      )
      click(copy.common.back)
      expect(container.textContent).toContain(copy.library.demon)
    },
  )
  it.each([null, 'UNKNOWN_SCRIPT' as never])(
    'unknown script %s never guesses a role pool',
    (scriptId) => {
      catalog(scriptId)
      expect(container.textContent).toContain(en.playerReference.unavailable)
      expect(container.textContent).not.toContain(
        getRoleDescription('imp', 'en'),
      )
      click(en.playerReference.returnToStoryteller)
      expect(container.textContent).toContain(en.game.returnDeviceReady)
    },
  )
  it('details return to the public list before protected handback', () => {
    const done = catalog()
    click(getRoleName('chef', 'en'))
    expect(container.querySelector('h1')?.textContent).toBe(
      getRoleName('chef', 'en'),
    )
    expect(container.textContent).not.toContain(en.game.returnDeviceReady)
    click(en.common.back)
    expect(container.textContent).toContain(en.library.townsfolk)
    expect(done).not.toHaveBeenCalled()
    click(en.playerReference.returnToStoryteller)
    expect(container.textContent).not.toContain(
      getRoleDescription('chef', 'en'),
    )
    click(en.game.returnDeviceReady)
    expect(done).not.toHaveBeenCalled()
    hold()
    expect(done).toHaveBeenCalledTimes(1)
  })
  it('main-menu Roles Library retains categorized navigation without an audience latch', () => {
    act(() => router.replace('/roles'))
    render(<App />)
    expect(container.textContent).toContain(en.mainMenu.rolesLibrary)
    click(getRoleName('chef', 'en'))
    expect(container.querySelector('h1')?.textContent).toBe(
      getRoleName('chef', 'en'),
    )
    click(en.common.back)
    expect(container.textContent).toContain(en.library.townsfolk)
    expect(isAudienceProtected()).toBe(false)
  })
})

describe('real GameScreen public session', () => {
  it.each(['setup', 'night', 'day'] as const)(
    'opens from %s and restores the same committed screen only after full hold',
    (phase) => {
      const game = mountGame(fixture(phase))
      const before = container.textContent
      const stored = localStorage.getItem('grimoire_games')
      const save = vi.spyOn(storage, 'saveGame')
      click(en.playerReference.title)
      noPrivateControls()
      expect(container.textContent).toContain(en.playerReference.introduction)
      click(getRoleName('imp', 'en'))
      noPrivateControls()
      click(en.common.back)
      click(en.playerReference.returnToStoryteller)
      noPrivateControls()
      click(en.game.returnDeviceReady)
      hold(980)
      expect(container.textContent).toContain(en.game.returnDeviceReady)
      release()
      hold(1000)
      expect(container.textContent).toBe(before)
      expect(isAudienceProtected()).toBe(false)
      expect(save).not.toHaveBeenCalled()
      expect(localStorage.getItem('grimoire_games')).toBe(stored)
      expect(storage.getGame(game.id)).toEqual(game)
    },
  )
  it('is available before setup actions without executing one', () => {
    const game = fixture('setup')
    getCurrentState(game).players[0].roleId = 'fortune_teller'
    mountGame(game)
    const stored = localStorage.getItem('grimoire_games')
    click(en.playerReference.title)
    expect(container.textContent).toContain(en.playerReference.introduction)
    click(en.playerReference.returnToStoryteller)
    hold()
    expect(localStorage.getItem('grimoire_games')).toBe(stored)
  })
  it('is not offered while a night action is pending', () => {
    const Original = nightDashboard.NightDashboard
    let props!: ComponentProps<typeof Original>
    vi.spyOn(nightDashboard, 'NightDashboard').mockImplementation((value) => {
      props = value
      return <Original {...value} />
    })
    mountGame(fixture('night'))
    act(() => props.onOpenNightAction('b', 'chef'))
    expect(
      [...container.querySelectorAll('button')].some(
        (b) => b.textContent === en.playerReference.title,
      ),
    ).toBe(false)
    expect(container.textContent).not.toContain(en.playerReference.introduction)
  })
  it('strict props receive only the projected script ID and public navigation callback despite hostile history/effects', () => {
    let game = fixture()
    game = engine.addHistoryEntry(
      game,
      {
        type: 'night_action',
        message: [{ type: 'text', content: 'SECRET_MESSAGE' }],
        data: { bluffs: ['SECRET_BLUFF'], target: 'SECRET_TARGET' },
      },
      {
        players: getCurrentState(game).players.map((p) => ({
          ...p,
          effects: [
            {
              id: 'SECRET_EFFECT',
              type: 'poisoned',
              sourcePlayerId: 'SECRET_SOURCE',
              data: { secret: 'SECRET_CONFIG' },
            },
          ],
        })),
      },
    )
    const Original = reference.PlayerReference
    let props!: ComponentProps<typeof Original>
    vi.spyOn(reference, 'PlayerReference').mockImplementation((value) => {
      props = value
      return <Original {...value} />
    })
    const project = vi.spyOn(projection, 'projectPublicGameState')
    mountGame(game)
    click(en.playerReference.title)
    expectTypeOf<keyof ComponentProps<typeof Original>>().toEqualTypeOf<
      'scriptId' | 'onReturnToStoryteller'
    >()
    expect(Object.keys(props).sort()).toEqual([
      'onReturnToStoryteller',
      'scriptId',
    ])
    expect(props.scriptId).toBe('trouble-brewing')
    expect(project).toHaveBeenCalledWith(game)
    expect(JSON.stringify(props)).toBe('{"scriptId":"trouble-brewing"}')
    noPrivateControls()
    // Unassigned and unselected characters are still present; no player-role mapping.
    showCategoryForRole('washerwoman')
    expect(button(getRoleName('washerwoman', 'en'))).toBeTruthy()
    showCategoryForRole('baron')
    expect(button(getRoleName('baron', 'en'))).toBeTruthy()
  })
  it('Custom game reference includes its full registered catalog, not only assigned characters', () => {
    mountGame(fixture('day', 'custom'))
    click(en.playerReference.title)
    for (const role of SCRIPTS.custom.roles) {
      showCategoryForRole(role)
      expect(button(getRoleName(role, 'en'))).toBeTruthy()
    }
  })
  it.each(['Grimoire', 'History'])(
    'opening closes previously mounted %s overlay and it stays closed after return',
    (title) => {
      mountGame()
      const entry = button(en.playerReference.title)
      click(title)
      if (title === 'History') click(en.playerReference.title)
      else act(() => entry.click())
      noPrivateControls()
      expect(container.textContent).toContain(en.playerReference.introduction)
      click(en.playerReference.returnToStoryteller)
      hold()
      expect(document.querySelector('[role="dialog"]')).toBeNull()
      expect(container.textContent).not.toContain(en.game.gameHistory)
      expect(document.querySelector('[title="Grimoire"]')).not.toBeNull()
    },
  )
  it('private reveal cannot open a second public session', () => {
    mountGame(fixture('setup'))
    const entry = button(en.playerReference.title)
    act(() =>
      [...container.querySelectorAll('button')]
        .find((b) => b.textContent?.includes('SECRET_SAME_NAME'))!
        .click(),
    )
    expect(container.textContent).toContain(en.game.tapWhenReady)
    act(() => entry.click())
    expect(container.textContent).not.toContain(en.playerReference.introduction)
    expect(container.textContent).toContain(en.game.tapWhenReady)
  })
  it.each(['catalog', 'handback'] as const)(
    'reload during %s restores only neutral protection, without saving actions',
    (stage) => {
      const game = mountApp()
      const before = localStorage.getItem('grimoire_games')
      click(en.playerReference.title)
      if (stage === 'handback') click(en.playerReference.returnToStoryteller)
      const save = vi.spyOn(storage, 'saveGame')
      reload()
      noPrivateControls()
      expect(container.textContent).toContain(en.game.returnDeviceReady)
      expect(container.textContent).not.toContain(
        en.playerReference.introduction,
      )
      click(en.game.returnDeviceReady)
      expect(isAudienceProtected()).toBe(true)
      hold()
      expect(document.querySelector('[title="Grimoire"]')).not.toBeNull()
      expect(storage.getGame(game.id)).toEqual(game)
      expect(save).not.toHaveBeenCalled()
      expect(localStorage.getItem('grimoire_games')).toBe(before)
    },
  )
  it('browser popstate, menu/Continue and another route cannot bypass the device latch', () => {
    const game = mountApp()
    const before = localStorage.getItem('grimoire_games')
    click(en.playerReference.title)
    act(() => {
      window.history.pushState(null, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    noPrivateControls()
    expect(container.textContent).toContain(en.game.returnDeviceReady)
    expect(container.textContent).not.toContain(en.mainMenu.continueGame)
    act(() => router.navigate('/roles'))
    expect(container.textContent).toContain(en.game.returnDeviceReady)
    act(() => router.navigate(`/game/${game.id}`))
    noPrivateControls()
    expect(container.textContent).toContain(en.game.returnDeviceReady)
    hold()
    expect(document.querySelector('[title="Grimoire"]')).not.toBeNull()
    expect(localStorage.getItem('grimoire_games')).toBe(before)
  })
})
