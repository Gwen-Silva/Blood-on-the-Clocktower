// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { I18nProvider } from '../../lib/i18n'
import { AboutAndUpdates } from './AboutAndUpdates'
import { activateWaitingUpdate } from '../../lib/pwaUpdate'
import pt from '../../lib/i18n/translations/pt-BR'

vi.mock('../../lib/pwaUpdate', () => ({
  hasWaitingUpdate: () => true,
  subscribeToUpdate: () => () => {},
  checkForUpdate: vi.fn(async () => {}),
  activateWaitingUpdate: vi.fn(async () => false),
}))
let root: Root, container: HTMLDivElement
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  localStorage.clear()
  localStorage.setItem('grimoire_games', 'saved game sentinel')
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  vi.clearAllMocks()
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
})
async function open(allowActivation: boolean) {
  act(() =>
    root.render(
      <I18nProvider>
        <AboutAndUpdates allowActivation={allowActivation} />
      </I18nProvider>,
    ),
  )
  act(() =>
    [...container.querySelectorAll('button')]
      .find((el) => el.textContent === pt.about.title)!
      .click(),
  )
}
function updateButton() {
  return [...document.querySelectorAll<HTMLButtonElement>('button')].find(
    (el) => el.textContent === pt.about.activate,
  )!
}
it('disables activation during setup and keeps pending work and saves intact', async () => {
  await open(false)
  expect(updateButton().disabled).toBe(true)
  act(() => updateButton().click())
  expect(activateWaitingUpdate).not.toHaveBeenCalled()
  expect(document.body.textContent).toContain(pt.about.finishSetup)
  expect(localStorage.getItem('grimoire_games')).toBe('saved game sentinel')
})
it('refuses activation if another window establishes a protected audience latch', async () => {
  await open(true)
  localStorage.setItem('grimoire_audience_protected', '1')
  await act(async () => updateButton().click())
  expect(activateWaitingUpdate).not.toHaveBeenCalled()
  expect(document.body.textContent).toContain(pt.about.closeWindows)
  expect(localStorage.getItem('grimoire_audience_protected')).toBe('1')
  expect(localStorage.getItem('grimoire_games')).toBe('saved game sentinel')
})
it('requests activation only from the idle unprotected menu and handles refusal without resetting data', async () => {
  await open(true)
  await act(async () => updateButton().click())
  expect(activateWaitingUpdate).toHaveBeenCalledTimes(1)
  expect(document.body.textContent).toContain(pt.about.closeWindows)
  expect(localStorage.getItem('grimoire_games')).toBe('saved game sentinel')
  expect(
    document.querySelector('[data-build-sha]')?.getAttribute('data-build-sha'),
  ).toMatch(/^[a-f0-9]{40}$/)
})
