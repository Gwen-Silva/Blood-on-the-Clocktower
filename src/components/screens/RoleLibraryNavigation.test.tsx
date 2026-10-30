// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import App from '../../App'
import { I18nProvider } from '../../lib/i18n'
import { router } from '../../lib/router'

let root: Root, host: HTMLDivElement
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.useFakeTimers()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  localStorage.clear()
  localStorage.setItem('grimoire_language', 'pt-BR')
  router.replace('/roles')
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(() => {
  act(() => root.unmount())
  host.remove()
  vi.useRealTimers()
  vi.restoreAllMocks()
})
function render() {
  act(() =>
    root.render(
      <I18nProvider>
        <App />
      </I18nProvider>,
    ),
  )
}
function click(selector: string) {
  act(() => {
    const button = host.querySelector<HTMLButtonElement>(selector)
    if (button) button.click()
    else {
      const picker = host.querySelector('select')!
      picker.value = selector.match(/data-category=\"([^\"]+)/)![1]
      picker.dispatchEvent(new Event('change', { bubbles: true }))
    }
  })
  act(() => vi.advanceTimersByTime(10))
}
function back() {
  click('.screen-navigation button')
}
it('starts with four public categories, then filters and restores scroll/focus across routed remounts', () => {
  render()
  expect(
    host.querySelectorAll('.role-category-grid [data-category]'),
  ).toHaveLength(4)
  expect(host.querySelectorAll('[data-role-id]')).toHaveLength(0)
  const counts = [...host.querySelectorAll('.role-category-grid button')].map(
    (el) => el.textContent,
  )
  expect(counts).toEqual(
    expect.arrayContaining([
      expect.stringContaining('13'),
      expect.stringContaining('4'),
      expect.stringContaining('1'),
    ]),
  )
  click('[data-category="townsfolk"]')
  expect(host.querySelectorAll('[data-role-id]')).toHaveLength(13)
  expect(host.querySelector('[data-role-id="imp"]')).toBeNull()
  const region = host.querySelector<HTMLElement>('.role-library-scroll')!
  act(() => {
    region.scrollTop = 225
    region.dispatchEvent(new Event('scroll', { bubbles: true }))
  })
  const stored = JSON.stringify(localStorage)
  click('[data-role-id="mayor"]')
  expect(router.getPath()).toBe('/roles/mayor')
  back()
  expect(router.getPath()).toBe('/roles')
  expect(
    host.querySelector<HTMLElement>('.role-library-scroll')?.scrollTop,
  ).toBe(225)
  expect(document.activeElement?.getAttribute('data-role-id')).toBe('mayor')
  expect(JSON.stringify(localStorage)).toBe(stored)
  back()
  expect(host.querySelector('.role-category-grid')).not.toBeNull()
  expect(document.activeElement?.getAttribute('data-category')).toBe(
    'townsfolk',
  )
})
it('infers a sensible category for direct links, including custom Villager', () => {
  router.replace('/roles/villager')
  render()
  expect(host.querySelector('h1')?.textContent).toBe('Aldeão')
  back()
  expect(host.querySelectorAll('[data-role-id]')).toHaveLength(14)
  expect(host.querySelector('[data-role-id="villager"]')).not.toBeNull()
  back()
  expect(host.querySelector('.role-category-grid')).not.toBeNull()
})
it('retains each category position while switching and confines arrows to that category', () => {
  render()
  click('[data-category="townsfolk"]')
  const region = host.querySelector<HTMLElement>('.role-library-scroll')!
  act(() => {
    region.scrollTop = 180
    region.dispatchEvent(new Event('scroll', { bubbles: true }))
  })
  click('[data-category="minion"]')
  click('[data-category="townsfolk"]')
  expect(
    host.querySelector<HTMLElement>('.role-library-scroll')?.scrollTop,
  ).toBe(180)
  click('[data-category="demon"]')
  click('[data-role-id="imp"]')
  expect(
    host.querySelector<HTMLButtonElement>('[aria-label="Próximo personagem"]')
      ?.disabled,
  ).toBe(true)
})
