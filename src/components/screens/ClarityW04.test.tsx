// @vitest-environment jsdom
import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { beforeEach, afterEach, expect, it, vi } from 'vitest'
import {
  I18nProvider,
  getRoleTranslations,
  getEffectTranslations,
} from '../../lib/i18n'
import en from '../../lib/i18n/translations/en'
import es from '../../lib/i18n/translations/es'
import { getAllRoles, getRole } from '../../lib/roles'
import { getAllEffects } from '../../lib/effects'
import { makeGame, makePlayer, makeState } from '../../lib/__tests__/helpers'
import { GameScreen } from './GameScreen'
import { VotingPhase } from './VotingPhase'
import { HistoryView } from './HistoryView'
import { RoleCard } from '../items/RoleCard'

let root: Root, container: HTMLDivElement
beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  localStorage.clear()
  localStorage.setItem('grimoire_language', 'en')
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.useRealTimers()
  vi.restoreAllMocks()
})
function render(node: ReactNode) {
  act(() => root.render(<I18nProvider>{node}</I18nProvider>))
}
function click(text: string) {
  const el = [
    ...container.querySelectorAll<HTMLButtonElement>('button,a'),
  ].find((el) => el.textContent?.includes(text))
  expect(el, text).toBeTruthy()
  act(() => el!.click())
}
function privateOnly() {
  expect(
    container.querySelector(
      '[title="Grimoire"],[title="History"],[role="dialog"]',
    ),
  ).toBeNull()
}
function hold() {
  const el = [...container.querySelectorAll('button')].find((el) =>
    el.textContent?.includes(en.game.returnDeviceReady),
  )!
  const event = new MouseEvent('pointerdown', { bubbles: true, button: 0 })
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    pointerType: { value: 'touch' },
    isPrimary: { value: true },
  })
  act(() => el.dispatchEvent(event))
  act(() => vi.advanceTimersByTime(999))
  expect(localStorage.getItem('grimoire_games')).toBeNull()
  act(() => vi.advanceTimersByTime(1))
}
it('opens several Spy details immediately and never queues a Storyteller modal or saves before handback', () => {
  const players = ['spy', 'soldier', 'mayor', 'slayer', 'imp'].map(
    (roleId, i) => makePlayer({ roleId, name: `Seat ${i + 1}` }),
  )
  players[1].effects = [
    { id: 'dead', type: 'dead', expiresAt: 'never' },
    { id: 'poisoned', type: 'poisoned', expiresAt: 'end_of_day' },
  ]
  const game = makeGame(makeState({ players }))
  const before = JSON.stringify(game)
  render(<GameScreen initialGame={game} onMainMenu={vi.fn()} />)
  click('Seat 1')
  click(en.game.stepViewGrimoire)
  click(en.game.tapWhenReady)
  privateOnly()
  click('Seat 2')
  expect(container.querySelector('h1')?.textContent).toBe('Seat 2')
  expect(container.textContent).toContain('Soldier')
  expect(container.textContent).toContain(en.clarity.reference)
  expect(container.textContent).toContain('Dead')
  expect(container.textContent).toContain('Poisoned')
  expect(
    [...container.querySelectorAll('button')].some((el) =>
      /Edit Effects|Add Effect/.test(el.textContent ?? ''),
    ),
  ).toBe(false)
  expect(container.textContent).not.toContain(en.clarity.yourAbility)
  privateOnly()
  click(en.clarity.spyBack)
  click('Seat 3')
  expect(container.querySelector('h1')?.textContent).toBe('Seat 3')
  act(() => window.dispatchEvent(new PopStateEvent('popstate')))
  expect(container.textContent).toContain(en.clarity.spyInspect)
  expect(JSON.stringify(game)).toBe(before)
  expect(localStorage.getItem('grimoire_games')).toBeNull()
  click(en.common.continue)
  privateOnly()
  expect(container.textContent).not.toContain('Seat 3')
  hold()
  expect(localStorage.getItem('grimoire_games')).toContain('view_grimoire')
  expect(container.querySelector('[role="dialog"]')).toBeNull()
  expect(container.querySelector('[title="Grimoire"]')).toBeTruthy()
})
it('browser Back at the Spy list starts protected handback', () => {
  const players = ['spy', 'soldier', 'imp'].map((roleId) =>
    makePlayer({ roleId }),
  )
  render(
    <GameScreen
      initialGame={makeGame(makeState({ players }))}
      onMainMenu={vi.fn()}
    />,
  )
  click(players[0].name)
  click(en.game.stepViewGrimoire)
  click(en.game.tapWhenReady)
  act(() => window.dispatchEvent(new PopStateEvent('popstate')))
  expect(container.textContent).toContain(en.game.returnDeviceReady)
  privateOnly()
  expect(localStorage.getItem('grimoire_games')).toBeNull()
})
it.each(['investigator', 'librarian'])(
  '%s result puts names before the shown character without assigning its ability',
  (roleId) => {
    const target = roleId === 'investigator' ? 'spy' : 'saint'
    const players = [
      makePlayer({ roleId, name: 'Reader' }),
      makePlayer({ roleId: target, name: 'Alice' }),
      makePlayer({ roleId: 'soldier', name: 'Bob' }),
      makePlayer({ roleId: 'imp', name: 'Demon' }),
    ]
    render(
      <GameScreen
        initialGame={makeGame(makeState({ players }))}
        onMainMenu={vi.fn()}
      />,
    )
    click('Reader')
    click(en.game.stepSelectPlayers)
    click('Alice')
    click('Bob')
    act(() =>
      [...container.querySelectorAll<HTMLButtonElement>('button')]
        .find((el) =>
          el.textContent?.trim().startsWith(target === 'spy' ? 'Spy' : 'Saint'),
        )!
        .click(),
    )
    click(en.common.confirm)
    click(en.game.stepShowResult)
    click(en.game.tapWhenReady)
    expect(container.querySelector('h1')?.textContent).toBe('Alice or Bob')
    expect(container.querySelector('h2')?.textContent).toBe(
      `One is the ${target === 'spy' ? 'Spy' : 'Saint'}.`,
    )
    expect(container.querySelector('details')?.open).toBe(false)
    expect(container.textContent).not.toContain(en.clarity.yourAbility)
    privateOnly()
    expect(localStorage.getItem('grimoire_games')).toBeNull()
  },
)
it('uses explicit ownership only for an own-role card', () => {
  render(<RoleCard roleId='spy' />)
  expect(container.textContent).not.toContain(en.clarity.yourAbility)
  render(<RoleCard roleId='spy' context='own' />)
  expect(container.textContent).toContain(en.clarity.yourAbility)
})
it('distinguishes nominee red from affirmative checked green and current vote state', () => {
  const players = ['Alice', 'Bob', 'Chris', 'Dana', 'Eli'].map((name) =>
    makePlayer({ name }),
  )
  render(
    <VotingPhase
      state={makeState({ phase: 'day', players })}
      nomineeId={players[0].id}
      blockStatus={null}
      voteBenchmark={0}
      onVoteComplete={vi.fn()}
      onCancel={vi.fn()}
    />,
  )
  const row = container.querySelector('[role="group"][aria-label="Alice"]')!
  expect(row.className).toContain('red')
  const vote = row.querySelector('button')!
  expect(vote.getAttribute('aria-pressed')).toBe('false')
  expect(vote.textContent).toContain(en.game.dontVote)
  act(() => vote.click())
  expect(vote.getAttribute('aria-pressed')).toBe('true')
  expect(vote.className).toContain('emerald')
  expect(vote.textContent).toContain(en.game.voteAction)
  expect(container.textContent).toContain(en.game.notEnoughVotes)
})
it.each([true, false])(
  'history separately reports actual execution death=%s',
  (died) => {
    const player = makePlayer({ name: 'Alice' })
    const game = makeGame(makeState({ players: [player] }))
    game.history.push({
      ...game.history[0],
      id: 'execution',
      type: 'execution',
      message: [
        {
          type: 'i18n',
          key: 'history.executed',
          params: { player: player.id },
        },
      ],
      data: { playerId: player.id, died },
    })
    render(<HistoryView game={game} onClose={vi.fn()} />)
    expect(container.textContent).toContain('was executed')
    expect(container.textContent).toContain(
      died ? 'Alice died.' : 'Alice did not die.',
    )
  },
)
it.each([
  [3, 0, 'about'],
  [3, 3, 'tie'],
  [2, 0, 'below'],
] as const)(
  'previews %s votes against benchmark %s without declaring death',
  (count, benchmark, outcome) => {
    const players = ['Alice', 'Bob', 'Chris', 'Dana', 'Eli'].map((name) =>
      makePlayer({ name }),
    )
    const complete = vi.fn()
    render(
      <VotingPhase
        state={makeState({ phase: 'day', players })}
        nomineeId={players[0].id}
        blockStatus={null}
        voteBenchmark={benchmark}
        onVoteComplete={complete}
        onCancel={vi.fn()}
      />,
    )
    for (const vote of [
      ...container.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'),
    ].slice(0, count))
      act(() => vote.click())
    expect(container.textContent).toContain(
      outcome === 'about'
        ? 'Alice is about to die.'
        : outcome === 'tie'
          ? en.game.tiedNoExecution
          : en.game.notEnoughVotes,
    )
    expect(container.textContent).not.toContain('Alice died.')
    click(en.game.confirmVotes)
    expect(complete).toHaveBeenCalledWith(count, expect.any(Array))
  },
)
it.each(['ravenkeeper', 'undertaker'])(
  '%s shows the observed name and character before optional ability details',
  (roleId) => {
    const reader = makePlayer({ roleId, name: 'Reader' }),
      target = makePlayer({ roleId: 'soldier', name: 'Alice' })
    const state = makeState({ round: 2, players: [reader, target] })
    const game = makeGame(state)
    game.history.unshift(
      {
        ...game.history[0],
        id: 'day',
        type: 'day_started',
        message: [],
        data: {},
      },
      {
        ...game.history[0],
        id: 'execution',
        type: 'execution',
        message: [],
        data: { playerId: target.id, died: true },
      },
    )
    const Action = getRole(roleId)!.NightAction!
    render(
      <Action game={game} state={state} player={reader} onComplete={vi.fn()} />,
    )
    if (roleId === 'ravenkeeper') {
      click(en.game.stepSelectPlayer)
      click('Alice')
      click(en.common.confirm)
    }
    click(en.game.stepShowRole)
    click(en.game.tapWhenReady)
    expect(container.querySelector('h1')?.textContent).toBe('Alice')
    expect(container.querySelector('h2')?.textContent).toBe('Soldier')
    expect(container.querySelector('details')?.open).toBe(false)
    expect(container.textContent).not.toContain(en.clarity.yourAbility)
  },
)
function leaves(value: unknown, path = ''): Record<string, string> {
  if (typeof value === 'string') return { [path]: value }
  return Object.fromEntries(
    Object.entries(value as object).flatMap(([k, v]) =>
      Object.entries(leaves(v, path + '.' + k)),
    ),
  )
}
it('keeps all registered EN/ES keys and placeholders aligned', () => {
  const pairs: [unknown, unknown][] = [
    [en, es],
    ...getAllRoles().map(
      (r) =>
        [getRoleTranslations(r.id, 'en'), getRoleTranslations(r.id, 'es')] as [
          unknown,
          unknown,
        ],
    ),
    ...getAllEffects().map(
      (e) =>
        [
          getEffectTranslations(e.id, 'en'),
          getEffectTranslations(e.id, 'es'),
        ] as [unknown, unknown],
    ),
  ]
  expect(getAllRoles()).toHaveLength(23)
  for (const [a, b] of pairs) {
    const left = leaves(a),
      right = leaves(b)
    expect(Object.keys(left).sort()).toEqual(Object.keys(right).sort())
    for (const key in left)
      expect([...(left[key].match(/\{\w+\}/g) ?? [])].sort(), key).toEqual(
        [...(right[key].match(/\{\w+\}/g) ?? [])].sort(),
      )
  }
})
