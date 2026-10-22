// @vitest-environment jsdom
import { act, type ReactNode, type ComponentProps } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import {
  beforeEach,
  afterEach,
  describe,
  it,
  expect,
  vi,
  expectTypeOf,
} from 'vitest'
import { I18nProvider, interpolate } from '../../lib/i18n'
import en from '../../lib/i18n/translations/en'
import es from '../../lib/i18n/translations/es'
import { GameScreen } from './GameScreen'
import * as day from './DayPhase'
import * as night from './NightDashboard'
import * as deaths from './DeathRevealScreen'
import * as dawn from './DawnScreen'
import * as nomination from './NominationScreen'
import * as endDay from './EndDayConfirmation'
import * as engine from '../../lib/game'
import * as storage from '../../lib/storage'
import { getCurrentState, hasEffect, type Game } from '../../lib/types'
import { toPublicDeaths, type PublicDeathEntry } from '../../lib/publicDeath'
import { makePlayer, addEffectTo } from '../../lib/__tests__/helpers'
import { StorageBoundary } from '../StorageBoundary'
import { protectAudience } from '../../lib/audienceProtection'

let root: Root, container: HTMLDivElement
beforeEach(() => {
  vi.useFakeTimers()
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  localStorage.clear()
  localStorage.setItem('grimoire_language', 'en')
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
    ...document.querySelectorAll<HTMLButtonElement>('button'),
  ].find((el) => el.textContent?.includes(text))
  expect(found, `Missing ${text}`).toBeTruthy()
  return found!
}
function click(text: string) {
  act(() => button(text).click())
}
function fixture(block = false, round = 2) {
  let game = engine.createGame('Test', 'trouble-brewing', [
    { id: 'chef', name: 'Alex', roleId: 'chef' },
    { id: 'virgin', name: 'Bea', roleId: 'virgin' },
    { id: 'slayer', name: 'Chris', roleId: 'slayer' },
    { id: 'recluse', name: 'Dana', roleId: 'recluse' },
    { id: 'imp', name: 'Eli', roleId: 'imp' },
  ])
  game = engine.addHistoryEntry(
    game,
    { type: 'day_started', data: { round }, message: [] },
    { phase: 'day', round },
  )
  return block ? engine.resolveVote(game, 'chef', 3) : game
}
function mountGame(game: Game) {
  storage.saveGame(game)
  render(<GameScreen initialGame={game} onMainMenu={vi.fn()} />)
}
function endButton(game: Game, copy = en) {
  const block = engine.getBlockStatus(game)
  return block
    ? interpolate(copy.game.endDayExecute, { player: block.playerName })
    : copy.game.endDayNoExecution
}
function watchDeaths() {
  const Original = deaths.DeathRevealScreen
  let captured: ComponentProps<typeof Original> | undefined
  vi.spyOn(deaths, 'DeathRevealScreen').mockImplementation((props) => {
    captured = props
    return <Original {...props} />
  })
  return () => {
    expect(captured).toBeDefined()
    return captured!
  }
}

describe('explicit End Day confirmation', () => {
  it.each([false, true])(
    'requires confirmation with block=%s and uses canonical round numbering',
    (block) => {
      const game = fixture(block, 3)
      mountGame(game)
      const before = localStorage.getItem('grimoire_games')
      click(endButton(game))
      const dialog = document.querySelector('[role="dialog"]')!
      expect(dialog.textContent).toContain(
        interpolate(en.game.confirmEndDayTitle, { round: 3 }),
      )
      expect(dialog.textContent).toContain(
        interpolate(
          block ? en.game.confirmEndDayBlocked : en.game.confirmEndDayEmpty,
          {
            player: 'Alex',
            round: 3,
            nextRound: engine.getNextNightRound(getCurrentState(game)),
          },
        ),
      )
      expect(localStorage.getItem('grimoire_games')).toBe(before)
      click(en.common.cancel)
      expect(document.querySelector('[role="dialog"]')).toBeNull()
      expect(localStorage.getItem('grimoire_games')).toBe(before)
    },
  )
  it.each(['Escape', 'close'])(
    '%s dismisses without saves, execution or history changes',
    (mode) => {
      const game = fixture(true)
      mountGame(game)
      const save = vi.spyOn(storage, 'saveGame')
      const execute = vi.spyOn(engine, 'executeAtEndOfDay')
      const start = vi.spyOn(engine, 'startNight')
      const before = JSON.stringify(game)
      click(endButton(game))
      if (mode === 'Escape')
        act(() =>
          document.dispatchEvent(
            new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }),
          ),
        )
      else click(en.ui.close)
      expect(document.querySelector('[role="dialog"]')).toBeNull()
      expect(save).not.toHaveBeenCalled()
      expect(execute).not.toHaveBeenCalled()
      expect(start).not.toHaveBeenCalled()
      expect(JSON.stringify(storage.getGame(game.id))).toBe(before)
    },
  )
  it.each([false, true])(
    'double confirm performs one existing resolution for block=%s',
    (block) => {
      const game = fixture(block)
      mountGame(game)
      click(endButton(game))
      const confirm = button(en.game.confirmEndDay)
      act(() => {
        confirm.click()
        confirm.click()
      })
      const saved = storage.getGame(game.id)!
      expect(getCurrentState(saved).phase).toBe('night')
      expect(getCurrentState(saved).round).toBe(3)
      expect(
        saved.history.filter((e) => e.type === 'night_started'),
      ).toHaveLength(1)
      expect(saved.history.filter((e) => e.type === 'execution')).toHaveLength(
        block ? 1 : 0,
      )
      expect(hasEffect(getCurrentState(saved).players[0], 'dead')).toBe(block)
    },
  )
  it('rejects a retained confirmation after leaving Day, including returning to Day later', () => {
    const Original = day.DayPhase
    const OriginalDialog = endDay.EndDayConfirmation
    const OriginalNomination = nomination.NominationScreen
    let captured!: ComponentProps<typeof Original>
    let dialog!: ComponentProps<typeof OriginalDialog>
    let form!: ComponentProps<typeof OriginalNomination>
    vi.spyOn(day, 'DayPhase').mockImplementation((props) => {
      captured = props
      return <Original {...props} />
    })
    vi.spyOn(endDay, 'EndDayConfirmation').mockImplementation((props) => {
      dialog = props
      return <OriginalDialog {...props} />
    })
    vi.spyOn(nomination, 'NominationScreen').mockImplementation((props) => {
      form = props
      return <OriginalNomination {...props} />
    })
    const game = fixture()
    mountGame(game)
    click(endButton(game))
    const staleConfirm = dialog.onConfirm
    const before = localStorage.getItem('grimoire_games')
    act(() => captured.onNominate())
    act(() => staleConfirm())
    expect(localStorage.getItem('grimoire_games')).toBe(before)
    act(() => form.onBack())
    act(() => staleConfirm())
    expect(localStorage.getItem('grimoire_games')).toBe(before)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })
  it('save failure does not publish the proposed Night or execution', () => {
    const game = fixture(true)
    mountGame(game)
    click(endButton(game))
    const before = localStorage.getItem('grimoire_games')
    const write = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === 'grimoire_games') throw new Error('disk full')
      write.call(this, key, value)
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const onError = (event: ErrorEvent) => event.preventDefault()
    window.addEventListener('error', onError)
    try {
      click(en.game.confirmEndDay)
    } finally {
      window.removeEventListener('error', onError)
    }
    expect(localStorage.getItem('grimoire_games')).toBe(before)
    expect(document.querySelector('[role="alert"]')).not.toBeNull()
    expect(container.textContent).not.toContain(en.game.nightDashboard)
  })
  it('saves before publishing the Night UI', () => {
    const game = fixture()
    mountGame(game)
    const write = Storage.prototype.setItem
    let checked = false
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === 'grimoire_games') {
        expect(container.textContent).toContain(en.game.day)
        expect(container.textContent).not.toContain(en.game.nightDashboard)
        checked = true
      }
      write.call(this, key, value)
    })
    click(endButton(game))
    click(en.game.confirmEndDay)
    expect(checked).toBe(true)
  })
  it.each([false, true])(
    'Spanish confirmation with block=%s states the round and consequences',
    (block) => {
      localStorage.setItem('grimoire_language', 'es')
      const game = fixture(block)
      mountGame(game)
      click(endButton(game, es))
      expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
        interpolate(
          block ? es.game.confirmEndDayBlocked : es.game.confirmEndDayEmpty,
          { player: 'Alex', round: 2, nextRound: 3 },
        ),
      )
      click(es.common.cancel)
    },
  )
  it('preserves the Mayor end-of-day win without execution or another Night', () => {
    let game = engine.createGame('Mayor', 'trouble-brewing', [
      { id: 'mayor', name: 'Mayor player', roleId: 'mayor' },
      { id: 'soldier', name: 'Soldier player', roleId: 'soldier' },
      { id: 'imp', name: 'Imp player', roleId: 'imp' },
    ])
    game = engine.addHistoryEntry(
      game,
      { type: 'day_started', data: { round: 3 }, message: [] },
      { phase: 'day', round: 3 },
    )
    mountGame(game)
    click(endButton(game))
    click(en.game.confirmEndDay)
    const saved = storage.getGame(game.id)!
    expect(getCurrentState(saved).winner).toBe('townsfolk')
    expect(
      saved.history.filter(
        (entry) => entry.type === 'execution' || entry.type === 'night_started',
      ),
    ).toHaveLength(0)
  })
  it('preserves game-ending execution behavior without starting another Night', () => {
    let game = fixture()
    game = engine.resolveVote(game, 'imp', 3)
    mountGame(game)
    click(endButton(game))
    click(en.game.confirmEndDay)
    const saved = storage.getGame(game.id)!
    expect(getCurrentState(saved).phase).toBe('ended')
    expect(getCurrentState(saved).winner).toBe('townsfolk')
    expect(saved.history.filter((e) => e.type === 'game_ended')).toHaveLength(1)
    expect(
      saved.history.filter((e) => e.type === 'night_started'),
    ).toHaveLength(0)
  })
})

function nightFixture(message = 'Recorded Empath result') {
  let game = engine.createGame('Night', 'trouble-brewing', [
    { id: 'a', name: 'Alex', roleId: 'empath' },
    { id: 'b', name: 'Bea', roleId: 'imp' },
    { id: 'c', name: 'Chris', roleId: 'soldier' },
    { id: 'd', name: 'Dana', roleId: 'monk' },
    { id: 'e', name: 'Eli', roleId: 'chef' },
  ])
  game = engine.startNight(game)
  return engine.addHistoryEntry(game, {
    type: 'night_action',
    message: message ? [{ type: 'text', content: message }] : [],
    data: { playerId: 'a', roleId: 'empath' },
  })
}
function renderDashboard(game: Game, onOpen = vi.fn()) {
  render(
    <night.NightDashboard
      game={game}
      state={getCurrentState(game)}
      onOpenNightAction={onOpen}
      onOpenStartingInfo={vi.fn()}
      onOpenNightFollowUp={vi.fn()}
      onStartDay={vi.fn()}
      onMainMenu={vi.fn()}
    />,
  )
  return onOpen
}

describe('Done · Review', () => {
  it('opens the recorded summary read-only and never reopens the completed action', () => {
    const game = nightFixture()
    const before = JSON.stringify(game)
    const open = renderDashboard(game)
    expect(button('Alex').textContent).toContain(en.game.actionDoneReview)
    click('Alex')
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
      'Recorded Empath result',
    )
    click(en.ui.close)
    expect(open).not.toHaveBeenCalled()
    expect(JSON.stringify(game)).toBe(before)
    expect(localStorage.getItem('grimoire_games')).toBeNull()
  })
  it.each(['', '   '])(
    'empty summary %j does not offer unavailable review',
    (message) => {
      const game = nightFixture(message)
      renderDashboard(game)
      expect(button('Alex').textContent).toContain(en.game.actionDone)
      expect(button('Alex').textContent).not.toContain(en.game.actionDoneReview)
      expect(button('Alex').disabled).toBe(true)
      click('Alex')
      expect(document.querySelector('[role="dialog"]')).toBeNull()
    },
  )
  it('pending actions do not expose earlier-night summaries', () => {
    const game = engine.startNight(nightFixture('OLD SECRET SUMMARY'))
    const open = renderDashboard(game)
    expect(button('Alex').textContent).not.toContain(en.game.actionDoneReview)
    click('Alex')
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(container.textContent).not.toContain('OLD SECRET SUMMARY')
    expect(open.mock.calls.length).toBeLessThanOrEqual(1)
  })
  it('Spanish completed action has a clear review affordance', () => {
    localStorage.setItem('grimoire_language', 'es')
    renderDashboard(nightFixture())
    expect(button('Alex').textContent).toContain(es.game.actionDoneReview)
  })
  it('starting-information rows retain their lifecycle instead of becoming action reviews', () => {
    const game = engine.startNight(
      engine.createGame('Seven', 'trouble-brewing', [
        { name: 'Minion', roleId: 'poisoner' },
        { name: 'Demon', roleId: 'imp' },
        ...Array.from({ length: 5 }, (_, i) => ({
          name: `Good ${i}`,
          roleId: 'soldier',
        })),
      ]),
    )
    const info = vi.fn()
    render(
      <night.NightDashboard
        game={game}
        state={getCurrentState(game)}
        onOpenNightAction={vi.fn()}
        onOpenStartingInfo={info}
        onOpenNightFollowUp={vi.fn()}
        onStartDay={vi.fn()}
        onMainMenu={vi.fn()}
      />,
    )
    click(en.game.minionStartingInfo)
    expect(info).toHaveBeenCalledTimes(1)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(button(en.game.minionStartingInfo).textContent).not.toContain(
      en.game.actionDoneReview,
    )
  })
  it('role-change follow-ups remain pending handoff actions, not completed summaries', () => {
    const base = nightFixture()
    const state = getCurrentState(base)
    const game = engine.addHistoryEntry(
      base,
      { type: 'effect_added', message: [], data: {} },
      {
        players: state.players.map((player) =>
          player.id === 'd'
            ? addEffectTo(player, 'pending_role_reveal')
            : player,
        ),
      },
    )
    const followUp = vi.fn()
    render(
      <night.NightDashboard
        game={game}
        state={getCurrentState(game)}
        onOpenNightAction={vi.fn()}
        onOpenStartingInfo={vi.fn()}
        onOpenNightFollowUp={followUp}
        onStartDay={vi.fn()}
        onMainMenu={vi.fn()}
      />,
    )
    click(en.game.yourRoleHasChanged)
    expect(followUp).toHaveBeenCalledTimes(1)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(button(en.game.yourRoleHasChanged).textContent).not.toContain(
      en.game.actionDoneReview,
    )
  })
  it('pending audience guard prevents dashboard/review controls from mounting', () => {
    protectAudience()
    render(
      <GameScreen initialGame={nightFixture('SECRET')} onMainMenu={vi.fn()} />,
    )
    expect(container.textContent).toContain(en.game.returnDeviceReady)
    expect(container.textContent).not.toContain(en.game.actionDoneReview)
    expect(container.textContent).not.toContain('SECRET')
  })
})

describe('public death allowlist and construction paths', () => {
  it('projects hostile player data to exactly two fields without mutating private state', () => {
    expectTypeOf<keyof PublicDeathEntry>().toEqualTypeOf<
      'playerId' | 'playerName'
    >()
    const player = addEffectTo(
      makePlayer({ id: 'p', name: 'Alex', roleId: 'imp' }),
      'poisoned',
      { secret: 'HIDDEN' },
    )
    const before = JSON.stringify(player)
    const projected = toPublicDeaths([player], ['p', 'unknown'])
    expect(projected).toEqual([{ playerId: 'p', playerName: 'Alex' }])
    expect(JSON.stringify(projected)).not.toMatch(
      /roleId|imp|poison|HIDDEN|effects/,
    )
    expect(JSON.stringify(player)).toBe(before)
  })
  it('end-of-day execution sends only allowlisted death fields and no Storyteller controls', () => {
    const captured = watchDeaths()
    const game = fixture(true)
    mountGame(game)
    click(endButton(game))
    click(en.game.confirmEndDay)
    expect(captured().deaths).toEqual([
      { playerId: 'chef', playerName: 'Alex' },
    ])
    expect(Object.keys(captured().deaths[0]).sort()).toEqual([
      'playerId',
      'playerName',
    ])
    expect(getCurrentState(storage.getGame(game.id)!).players[0].roleId).toBe(
      'chef',
    )
    expect(document.querySelector('[title="Grimoire"]')).toBeNull()
    expect(container.textContent).not.toContain(en.game.actionDoneReview)
  })
  it('night-death announcement path supplies only the public DTO', () => {
    const captured = watchDeaths()
    const Original = night.NightDashboard
    let dashboard!: ComponentProps<typeof Original>
    vi.spyOn(night, 'NightDashboard').mockImplementation((props) => {
      dashboard = props
      return <Original {...props} />
    })
    const base = engine.startNight(fixture())
    const state = getCurrentState(base)
    const game = engine.addHistoryEntry(
      base,
      {
        type: 'effect_added',
        message: [],
        data: { playerId: 'chef', effectType: 'dead' },
      },
      {
        players: state.players.map((p) =>
          p.id === 'chef' ? addEffectTo(p, 'dead') : p,
        ),
      },
    )
    mountGame(game)
    act(() => dashboard.onStartDay())
    expect(captured().deaths).toEqual([
      { playerId: 'chef', playerName: 'Alex' },
    ])
    expect(Object.keys(captured().deaths[0]).sort()).toEqual([
      'playerId',
      'playerName',
    ])
  })
  it('Virgin nomination execution path supplies only the public DTO', () => {
    const captured = watchDeaths()
    const Original = nomination.NominationScreen
    let form!: ComponentProps<typeof Original>
    vi.spyOn(nomination, 'NominationScreen').mockImplementation((props) => {
      form = props
      return <Original {...props} />
    })
    mountGame(fixture())
    click(en.game.newNomination)
    act(() => form.onNominate('chef', 'virgin'))
    expect(captured().deaths).toEqual([
      { playerId: 'chef', playerName: 'Alex' },
    ])
    expect(Object.keys(captured().deaths[0]).sort()).toEqual([
      'playerId',
      'playerName',
    ])
  })
  it('day-action pipeline path supplies only the public DTO', () => {
    const captured = watchDeaths()
    const game = fixture()
    mountGame(game)
    click(en.game.slayerAction)
    click('Dana')
    click(en.game.confirmSlayerShot)
    click(en.game.registerAsDemon)
    click(en.common.confirm)
    expect(captured().deaths).toEqual([
      { playerId: 'recluse', playerName: 'Dana' },
    ])
    expect(Object.keys(captured().deaths[0]).sort()).toEqual([
      'playerId',
      'playerName',
    ])
    expect(JSON.stringify(captured().deaths)).not.toMatch(
      /roleId|effects|cause|registeredAsDemon/,
    )
  })
  it('death animation and sequential progression remain functional without private props', () => {
    const done = vi.fn()
    render(
      <deaths.DeathRevealScreen
        deaths={[
          { playerId: '1', playerName: 'Alex' },
          { playerId: '2', playerName: 'Bea' },
        ]}
        onContinue={done}
      />,
    )
    expect(button(en.game.deathRevealNextDeath).disabled).toBe(true)
    act(() => vi.advanceTimersByTime(1200))
    expect(
      document
        .querySelector('.death-card-inner')
        ?.classList.contains('is-flipped'),
    ).toBe(true)
    click(en.game.deathRevealNextDeath)
    expect(container.textContent).toContain('Bea')
    expect(button(en.game.deathRevealContinue).disabled).toBe(true)
    act(() => vi.advanceTimersByTime(1200))
    click(en.game.deathRevealContinue)
    expect(done).toHaveBeenCalledTimes(1)
  })
})

describe('public dawn boundary', () => {
  it('GameScreen passes only public deaths and round to DawnScreen', () => {
    const OriginalDashboard = night.NightDashboard
    let dashboard!: ComponentProps<typeof OriginalDashboard>
    vi.spyOn(night, 'NightDashboard').mockImplementation((props) => {
      dashboard = props
      return <OriginalDashboard {...props} />
    })
    const OriginalDawn = dawn.DawnScreen
    let captured!: ComponentProps<typeof OriginalDawn>
    vi.spyOn(dawn, 'DawnScreen').mockImplementation((props) => {
      captured = props
      return <OriginalDawn {...props} />
    })
    const game = engine.startNight(fixture())
    mountGame(game)
    act(() => dashboard.onStartDay())
    expect(Object.keys(captured).sort()).toEqual([
      'deaths',
      'onContinue',
      'round',
    ])
    expect(captured.deaths).toEqual([])
    expect(captured.round).toBe(getCurrentState(game).round)
    expect(document.querySelector('[title="Grimoire"]')).toBeNull()
    expect(container.textContent).toContain(en.game.dawnNoDeaths)
    click(en.game.continueToDay)
    expect(document.querySelector('[title="Grimoire"]')).not.toBeNull()
  })
  it('renders duplicate public names by ID without private role/effect data and retains progression', () => {
    const players = [
      makePlayer({ roleId: 'chef', id: 'one', name: 'Alex' }),
      makePlayer({ roleId: 'imp', id: 'two', name: 'Alex' }),
    ]
    const entries = toPublicDeaths(players, ['one', 'two'])
    const onContinue = vi.fn()
    render(
      <dawn.DawnScreen deaths={entries} round={2} onContinue={onContinue} />,
    )
    expect(entries).toEqual([
      { playerId: 'one', playerName: 'Alex' },
      { playerId: 'two', playerName: 'Alex' },
    ])
    expect(container.textContent).not.toContain('Chef')
    expect(container.textContent).not.toContain('Imp')
    click(en.game.continueToDay)
    expect(onContinue).toHaveBeenCalledTimes(1)
  })
})
