// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import {
  I18nProvider,
  getRoleDescription,
  getRoleLines,
} from '../../../lib/i18n'
import { getRoleWikiUrl, ROLE_WIKI_PAGES } from '../../../lib/roles/wiki'
import { RoleCard } from './index'
import { PlayerFacingScreen } from '../../layouts/PlayerFacingScreen'

let root: Root
let host: HTMLDivElement
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  localStorage.clear()
  localStorage.setItem('grimoire_language', 'pt-BR')
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(() => {
  act(() => root.unmount())
  host.remove()
  vi.restoreAllMocks()
})
function render(roleId: string, own = false) {
  act(() =>
    root.render(
      <I18nProvider>
        {own ? (
          <PlayerFacingScreen>
            <RoleCard roleId={roleId} context='own' />
          </PlayerFacingScreen>
        ) : (
          <RoleCard roleId={roleId} />
        )}
      </I18nProvider>,
    ),
  )
}
function click(text: string) {
  const button = [...document.querySelectorAll('button')].find((el) =>
    el.textContent?.includes(text),
  )!
  act(() => button.click())
}
it('keeps complete ability and curated facts on card, with extensive Imp rules only in a static dialog', () => {
  render('imp')
  expect(host.querySelector('details')).toBeNull()
  expect(host.textContent).toContain(getRoleDescription('imp', 'pt-BR'))
  expect(host.textContent).not.toContain(getRoleLines('imp', 'pt-BR')[3].text)
  localStorage.setItem('unrelated-input', 'unchanged')
  const storage = JSON.stringify(localStorage)
  click('Ver regras')
  const dialog = document.querySelector('[role=dialog]')!
  for (const line of getRoleLines('imp', 'pt-BR'))
    expect(dialog.textContent).toContain(line.text)
  expect(dialog.textContent).not.toContain('Escolha um novo Diabrete')
  const link = dialog.querySelector('a')!
  expect(link.href).toBe(getRoleWikiUrl('imp'))
  expect(link.rel).toBe('noopener noreferrer')
  expect(link.getAttribute('referrerpolicy')).toBe('no-referrer')
  expect(JSON.stringify(localStorage)).toBe(storage)
})
it('keeps long names complete and grouped into unbroken words', () => {
  render('librarian')
  expect(host.querySelector('h1')?.textContent).toBe('Bibliotecário')
  expect(host.querySelector('h1 .whitespace-nowrap')?.textContent).toBe(
    'Bibliotecário',
  )
})
it('does not remount or clear an adjacent unfinished input when rules close', () => {
  act(() =>
    root.render(
      <I18nProvider>
        <input aria-label='draft' defaultValue='unfinished' />
        <RoleCard roleId='imp' />
      </I18nProvider>,
    ),
  )
  const input = host.querySelector('input')!
  input.value = 'edited draft'
  click('Ver regras')
  act(() => window.dispatchEvent(new PopStateEvent('popstate')))
  expect(host.querySelector('input')).toBe(input)
  expect(input.value).toBe('edited draft')
})
it.each(['en', 'es', 'pt-BR'] as const)(
  'makes Butler voting optional in %s',
  (language) => {
    localStorage.setItem('grimoire_language', language)
    render('butler')
    expect(host.textContent).toContain(getRoleLines('butler', language)[2].text)
    expect(host.textContent).toContain(getRoleDescription('butler', language))
  },
)
it('intercepts browser Back before the parent privacy handler, and restores trigger focus', () => {
  render('librarian', true)
  const parentBack = vi.fn()
  window.addEventListener('popstate', parentBack)
  try {
    click('Ver regras')
    expect(document.querySelector('[role=dialog]')).not.toBeNull()
    act(() => window.dispatchEvent(new PopStateEvent('popstate')))
    expect(parentBack).not.toHaveBeenCalled()
    expect(document.querySelector('[role=dialog]')).toBeNull()
    expect(host.querySelector('h1')?.textContent).toBe('Bibliotecário')
    expect(host.textContent).not.toContain('Grimório')
  } finally {
    window.removeEventListener('popstate', parentBack)
  }
})
it('maps all 22 official characters and never invents custom or inherited pages', () => {
  expect(Object.keys(ROLE_WIKI_PAGES)).toHaveLength(22)
  for (const [id, page] of Object.entries(ROLE_WIKI_PAGES))
    expect(getRoleWikiUrl(id)).toBe(
      `https://wiki.bloodontheclocktower.com/${page}`,
    )
  expect(getRoleWikiUrl('fortune_teller')).toBe(
    'https://wiki.bloodontheclocktower.com/Fortune_Teller',
  )
  expect(getRoleWikiUrl('scarlet_woman')).toBe(
    'https://wiki.bloodontheclocktower.com/Scarlet_Woman',
  )
  expect(getRoleWikiUrl('villager')).toBeUndefined()
  expect(getRoleWikiUrl('toString')).toBeUndefined()
  render('villager')
  click('Ver regras')
  expect(document.querySelector('[role=dialog] a')).toBeNull()
})
