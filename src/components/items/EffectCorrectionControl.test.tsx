// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { I18nProvider } from '../../lib/i18n'
import en from '../../lib/i18n/translations/en'
import es from '../../lib/i18n/translations/es'
import pt from '../../lib/i18n/translations/pt-BR'
import { EffectCorrectionControl } from './EffectCorrectionControl'
import { HistoryView } from '../screens/HistoryView'
import { makeGame, makePlayer, makeState } from '../../lib/__tests__/helpers'
import { addEffectToPlayer } from '../../lib/game'
import {
  recordManualEffectEdit,
  correctLatestEffectEdit,
} from '../../lib/manualEffectCorrection'
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
function changed() {
  const original = makeGame(
    makeState({
      phase: 'day',
      round: 2,
      players: [makePlayer({ id: 'alice', name: 'Alice' })],
    }),
  )
  return recordManualEffectEdit(
    original,
    addEffectToPlayer(original, 'alice', 'poisoned'),
    'add',
  )
}
function button(label: string) {
  const el = [...document.querySelectorAll('button')].find(
    (el) => el.textContent === label,
  )
  expect(el).toBeTruthy()
  return el!
}
for (const [language, t] of Object.entries({ en, es, 'pt-BR': pt }))
  it(`${language} explains the operation, requires confirmation and renders append-only history`, () => {
    localStorage.setItem('grimoire_language', language)
    const game = changed(),
      confirm = vi.fn(() => true),
      corrected = correctLatestEffectEdit(game, game.history.at(-1)!.id)
    act(() =>
      root.render(
        <I18nProvider>
          <EffectCorrectionControl game={game} onConfirm={confirm} />
          <HistoryView game={corrected} onClose={() => {}} />
        </I18nProvider>,
      ),
    )
    expect(confirm).not.toHaveBeenCalled()
    act(() => button(t.effectCorrection.action).click())
    expect(document.body.textContent).toContain('Alice')
    expect(document.body.textContent).toContain(t.effectCorrection.limit)
    expect(document.body.textContent).toContain(
      t.effectCorrection.history.split('{effect}')[0],
    )
    act(() => button(t.common.cancel).click())
    expect(confirm).not.toHaveBeenCalled()
    act(() => button(t.effectCorrection.action).click())
    const trigger = button(t.effectCorrection.confirm)
    act(() => {
      trigger.click()
      trigger.click()
    })
    expect(confirm).toHaveBeenCalledTimes(1)
    expect(confirm).toHaveBeenCalledWith(game.history.at(-1)!.id)
  })
it('keeps failed correction visibly uncompleted, shows a clear error and disables stale retry', () => {
  localStorage.setItem('grimoire_language', 'en')
  const game = changed(),
    before = structuredClone(game),
    confirm = vi.fn(() => false)
  act(() =>
    root.render(
      <I18nProvider>
        <EffectCorrectionControl game={game} onConfirm={confirm} />
      </I18nProvider>,
    ),
  )
  act(() => button(en.effectCorrection.action).click())
  act(() => button(en.effectCorrection.confirm).click())
  expect(document.querySelector('[role=alert]')?.textContent).toBe(
    en.effectCorrection.error,
  )
  expect(button(en.effectCorrection.confirm).disabled).toBe(true)
  expect(game).toEqual(before)
})
it('does not render a control for an ambiguous legacy effect operation', () => {
  localStorage.setItem('grimoire_language', 'en')
  const game = changed()
  delete game.history.at(-1)!.data.manualEffectEdit
  act(() =>
    root.render(
      <I18nProvider>
        <EffectCorrectionControl game={game} onConfirm={vi.fn()} />
      </I18nProvider>,
    ),
  )
  expect(document.querySelector('button')).toBeNull()
})
