// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { beforeEach, afterEach, expect, it, vi } from 'vitest'
import { I18nProvider } from '../../lib/i18n'
import en from '../../lib/i18n/translations/en'
import es from '../../lib/i18n/translations/es'
import { makeGame, makePlayer, makeState } from '../../lib/__tests__/helpers'
import { GameScreen } from './GameScreen'
import { NightGuidance } from '../layouts/NightGuidance'
import type { RoleId } from '../../lib/roles/types'

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
function click(text: string) {
  const target = [...container.querySelectorAll('button')].find(
    (el) => el.textContent?.includes(text) || el.title === text,
  )
  expect(target, text).toBeTruthy()
  expect(target?.disabled).toBe(false)
  act(() => target!.click())
}
function game(outsider = false) {
  const ids: RoleId[] = ['librarian', 'chef', 'soldier', 'scarlet_woman', 'imp']
  if (outsider) ids.push('saint')
  return makeGame(
    makeState({
      phase: 'night',
      round: 1,
      players: ids.map((roleId, i) =>
        makePlayer({ roleId, name: `Private seat ${i + 1}` }),
      ),
    }),
  )
}
function renderGame(outsider = false) {
  const initialGame = game(outsider)
  act(() =>
    root.render(
      <I18nProvider>
        <GameScreen initialGame={initialGame} onMainMenu={vi.fn()} />
      </I18nProvider>,
    ),
  )
  return initialGame
}

it('puts contextual controls in an action region and unmounts it for public browsing', () => {
  renderGame()
  const nav = container.querySelector('nav[aria-label="Game tools"]')!
  expect(nav.textContent).toContain(en.playerReference.title)
  expect(nav.querySelector('[title="Grimoire"]')).toBeTruthy()
  click(en.playerReference.title)
  expect(container.querySelector('nav[aria-label="Game tools"]')).toBeNull()
  expect(
    container.querySelector('[title="Grimoire"], [title="History"]'),
  ).toBeNull()
  expect(container.textContent).not.toContain('Private seat')
  expect(container.textContent).not.toContain(en.nightGuide.title)
})
it('explains Librarian zero and candidate results while keeping registration notes private', () => {
  const initialGame = renderGame()
  click('Librarian')
  click(en.game.stepSelectPlayers)
  expect(container.textContent).toContain('No Outsiders')
  expect(container.querySelector('details')?.open).toBe(false)
  expect(container.textContent).toContain('Spy may register as an Outsider')
  expect(container.textContent).toContain('Baron changes setup')
  expect(container.textContent).toContain('Drunkenness or poisoning')
  expect(localStorage.getItem('grimoire_games')).toBeNull()
  click(en.game.showToPlayer)
  expect(container.textContent).not.toContain(en.nightGuide.title)
  click(en.game.tapWhenReady)
  expect(container.textContent).toContain('zero Outsiders')
  expect(container.textContent).toContain('Alice or Bob')
  expect(container.textContent).not.toContain('Spy may register')
  expect(
    container.querySelector('[title="Grimoire"], [title="History"]'),
  ).toBeNull()
  expect(initialGame.history).toHaveLength(1)
  expect(localStorage.getItem('grimoire_games')).toBeNull()
})
it('shows candidate selection guidance when an Outsider is eligible, without inventing a result', () => {
  renderGame(true)
  click('Librarian')
  click(en.game.stepSelectPlayers)
  expect(container.textContent).toContain(en.game.selectTwoPlayers)
  expect(container.textContent).toContain('Private seat 6')
  expect(container.textContent).toContain('select two candidates')
  expect(container.textContent).not.toContain(
    'There are no Outsiders in this game',
  )
  expect(
    [...container.querySelectorAll('button')].find((el) =>
      el.textContent?.includes(en.common.confirm),
    )?.disabled,
  ).toBe(true)
  expect(localStorage.getItem('grimoire_games')).toBeNull()
})
it('Back from a provisional night action keeps the saved game and pending order unchanged', () => {
  const initialGame = renderGame()
  const snapshot = JSON.stringify(initialGame)
  click('Librarian')
  click(en.game.stepSelectPlayers)
  click(en.common.back)
  expect(container.textContent).toContain(en.game.nightDashboardDescription)
  expect(container.textContent).toContain(en.game.nextAction)
  expect(JSON.stringify(initialGame)).toBe(snapshot)
  expect(localStorage.getItem('grimoire_games')).toBeNull()
})
it.each(['en', 'es'])(
  'renders localized static player guidance without private instructions in %s',
  (language) => {
    localStorage.setItem('grimoire_language', language)
    const copy = language === 'en' ? en : es
    const roles = [
      'washerwoman',
      'librarian',
      'investigator',
      'chef',
      'empath',
      'fortune_teller',
      'spy',
      'poisoner',
      'monk',
      'ravenkeeper',
      'undertaker',
      'butler',
      'imp',
    ]
    act(() =>
      root.render(
        <I18nProvider>
          {roles.map((roleId) => (
            <NightGuidance key={roleId} roleId={roleId} audience='player' />
          ))}
        </I18nProvider>,
      ),
    )
    expect(container.querySelectorAll('section')).toHaveLength(13)
    expect(container.textContent).not.toContain(copy.nightGuide.title)
    expect(container.textContent).not.toContain(
      copy.nightGuide.roles.librarian.note,
    )
    expect(container.textContent).toContain(
      copy.nightGuide.roles.librarian.player,
    )
    expect(container.textContent).toContain(
      copy.nightGuide.roles.librarian.example,
    )
  },
)
