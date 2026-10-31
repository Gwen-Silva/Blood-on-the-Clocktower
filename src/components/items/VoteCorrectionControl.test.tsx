// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { I18nProvider, interpolate } from '../../lib/i18n'
import en from '../../lib/i18n/translations/en'
import es from '../../lib/i18n/translations/es'
import pt from '../../lib/i18n/translations/pt-BR'
import {
  makeGame,
  makeState,
  makeStandardPlayers,
} from '../../lib/__tests__/helpers'
import { addHistoryEntry, nominate, resolveVote } from '../../lib/game'
import {
  recordVoteOperation,
  correctLatestVote,
  getEligibleVoteOperation,
} from '../../lib/voteHistory'
import { VoteCorrectionControl } from './VoteCorrectionControl'
let root: Root, container: HTMLDivElement
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  localStorage.clear()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.restoreAllMocks()
})
function fixture() {
  const base = addHistoryEntry(
    makeGame(
      makeState({ phase: 'setup', round: 0, players: makeStandardPlayers() }),
    ),
    { type: 'day_started', data: { round: 2 }, message: [] },
    { phase: 'day', round: 2 },
  )
  const nominated = nominate(base, 'p1', 'p2')
  return recordVoteOperation(
    nominated,
    resolveVote(nominated, 'p2', 3, ['p1', 'p2', 'p3']),
  )
}
function button(label: string) {
  const found = [...document.querySelectorAll('button')].find(
    (b) => b.textContent === label,
  )
  expect(found).toBeTruthy()
  return found!
}
for (const [language, t] of Object.entries({ en, es, 'pt-BR': pt }))
  it(`${language} explains the nominee, tally, prior status and exact restoration before explicit confirmation`, () => {
    localStorage.setItem('grimoire_language', language)
    const game = fixture(),
      confirm = vi.fn(() => true)
    act(() =>
      root.render(
        <I18nProvider>
          <VoteCorrectionControl
            game={game}
            onConfirm={confirm}
            onResume={vi.fn()}
          />
        </I18nProvider>,
      ),
    )
    act(() => button(t.voteCorrection.action).click())
    expect(document.body.textContent).toContain(
      interpolate(t.voteCorrection.summary, { player: 'Bob', votes: 3 }),
    )
    expect(document.body.textContent).toContain(t.voteCorrection.restore)
    expect(document.body.textContent).toContain(t.voteCorrection.limit)
    expect(document.body.textContent).toContain(
      interpolate(t.voteCorrection.none, { votes: 0 }),
    )
    act(() => button(t.common.cancel).click())
    expect(confirm).not.toHaveBeenCalled()
    act(() => button(t.voteCorrection.action).click())
    const trigger = button(t.voteCorrection.confirm)
    act(() => {
      trigger.click()
      trigger.click()
    })
    expect(confirm).toHaveBeenCalledTimes(1)
    expect(confirm).toHaveBeenCalledWith(
      getEligibleVoteOperation(game)!.operationId,
    )
  })
it('a failed save leaves the confirmation uncompleted and disables stale retry', () => {
  localStorage.setItem('grimoire_language', 'en')
  const confirm = vi.fn(() => false)
  act(() =>
    root.render(
      <I18nProvider>
        <VoteCorrectionControl
          game={fixture()}
          onConfirm={confirm}
          onResume={vi.fn()}
        />
      </I18nProvider>,
    ),
  )
  act(() => button(en.voteCorrection.action).click())
  act(() => button(en.voteCorrection.confirm).click())
  expect(document.querySelector('[role=alert]')?.textContent).toBe(
    en.voteCorrection.error,
  )
  expect(button(en.voteCorrection.confirm).disabled).toBe(true)
})
it('a saved cancellation offers resume rather than a second correction', () => {
  localStorage.setItem('grimoire_language', 'en')
  const original = fixture(),
    game = correctLatestVote(
      original,
      getEligibleVoteOperation(original)!.operationId,
    ),
    resume = vi.fn(),
    confirm = vi.fn()
  act(() =>
    root.render(
      <I18nProvider>
        <VoteCorrectionControl
          game={game}
          onConfirm={confirm}
          onResume={resume}
        />
      </I18nProvider>,
    ),
  )
  expect(document.body.textContent).not.toContain(en.voteCorrection.action)
  act(() => button(en.voteCorrection.resume).click())
  expect(resume).toHaveBeenCalledTimes(1)
  expect(confirm).not.toHaveBeenCalled()
})
it('does not show vote correction for legacy voting events', () => {
  localStorage.setItem('grimoire_language', 'en')
  const game = fixture()
  delete game.history.at(-1)!.data.voteOperation
  act(() =>
    root.render(
      <I18nProvider>
        <VoteCorrectionControl
          game={game}
          onConfirm={vi.fn()}
          onResume={vi.fn()}
        />
      </I18nProvider>,
    ),
  )
  expect(document.querySelector('button')).toBeNull()
})
