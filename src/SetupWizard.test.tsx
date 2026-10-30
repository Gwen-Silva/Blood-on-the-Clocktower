// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import App from './App'
import { I18nProvider } from './lib/i18n'
import en from './lib/i18n/translations/en'
import * as types from './lib/types'
import { getAllGames } from './lib/storage'
import { router } from './lib/router'

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
function clickElement(el: Element) {
  act(() => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
}
function click(text: string) {
  const el = [...container.querySelectorAll('button')].find((el) =>
    el.textContent?.includes(text),
  )
  expect(el, `Missing ${text}`).toBeTruthy()
  clickElement(el!)
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
function back() {
  clickElement(
    container.querySelector(`button[aria-label="${en.common.back}"]`)!,
  )
}

it('real setup keeps duplicate-name identities across touch reorder, rename, back and persisted assignments', () => {
  const ids = vi.spyOn(types, 'generateId')
  act(() =>
    root.render(
      <I18nProvider>
        <App />
      </I18nProvider>,
    ),
  )
  if (container.querySelector(`[aria-label="${en.mainMenu.tapToOpen}"]`)) {
    click(en.mainMenu.tapToOpen)
    act(() => vi.advanceTimersByTime(700))
  }
  click(en.mainMenu.newGame)
  const initialIds = ids.mock.results.slice(-5).map((result) => result.value)
  const names = ['Alex', 'Alex', 'Bea', 'Chris', 'Dana']
  inputs().forEach((el, i) => input(el, names[i]))
  const handle = inputs()[0].previousElementSibling!
  const touch = (type: string, y: number) => {
    const point = {
      identifier: 1,
      force: 1,
      radiusX: 1,
      radiusY: 1,
      rotationAngle: 0,
      screenX: 10,
      screenY: y,
      target: handle,
      clientX: 10,
      clientY: y,
      pageX: 10,
      pageY: y,
    } as Touch
    act(() => {
      handle.dispatchEvent(
        new TouchEvent(type, {
          bubbles: true,
          cancelable: true,
          touches: type === 'touchend' ? [] : [point],
          changedTouches: [point],
          targetTouches: type === 'touchend' ? [] : [point],
        }),
      )
    })
  }
  touch('touchstart', 0)
  touch('touchmove', 6)
  touch('touchmove', 150)
  touch('touchend', 150)
  expect(inputs().map((el) => el.value)).toEqual([
    'Alex',
    'Bea',
    'Alex',
    'Chris',
    'Dana',
  ])
  click(en.newGame.nextSelectRoles)
  back()
  input(inputs()[2], 'Alex renamed')
  const expectedNames = ['Alex', 'Bea', 'Alex renamed', 'Chris', 'Dana']
  click(en.newGame.nextSelectRoles)
  click(en.scripts['trouble-brewing'])
  back()
  back()
  expect(inputs().map((el) => el.value)).toEqual(expectedNames)
  click(en.newGame.nextSelectRoles)
  click(en.scripts['trouble-brewing'])
  click(en.scripts.manual)
  for (const name of ['Chef', 'Monk', 'Soldier', 'Poisoner']) click(name)
  const next = [
    ...container.querySelectorAll<HTMLButtonElement>('button'),
  ].find((el) => el.textContent?.includes(en.newGame.nextAssignRoles))!
  expect(next.disabled).toBe(false)
  clickElement(next)
  click(en.newGame.customizeAssignments)
  click('1. Alex')
  click('Imp')
  click('3. Alex renamed')
  click('Chef')
  click(en.setupReview.reviewSetup)
  expect(getAllGames()).toHaveLength(0)
  click(en.setupReview.createGame)
  const games = getAllGames()
  expect(games).toHaveLength(1)
  const seated = types.getCurrentState(games[0]).players
  expect(seated.map(({ name }) => name)).toEqual(expectedNames)
  expect(seated.map(({ id }) => id)).toEqual([
    initialIds[1],
    initialIds[2],
    initialIds[0],
    initialIds[3],
    initialIds[4],
  ])
  expect(seated[0].roleId).toBe('imp')
  expect(seated[2].roleId).toBe('chef')
  expect(new Set(seated.map(({ id }) => id)).size).toBe(5)
})
