// @vitest-environment jsdom
import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { beforeEach, afterEach, expect, it, vi } from 'vitest'
import { useState } from 'react'
import {
  I18nProvider,
  useI18n,
  getLocale,
  getRoleName,
  getEffectName,
  getRoleDescription,
  getEffectDescription,
  interpolate,
} from '../i18n'
import type { Language } from '../i18n'
import pt from '../i18n/translations/pt-BR'
import en from '../i18n/translations/en'
import es from '../i18n/translations/es'
import { getAllRoles } from '../roles'
import { getAllEffects } from '../effects'
import { formatRoleQuantity } from '../roleDisplay'
import { EndDayConfirmation } from '../../components/screens/EndDayConfirmation'
import { HistoryView } from '../../components/screens/HistoryView'
import { GameScreen } from '../../components/screens/GameScreen'
import { makeGame, makeState, makePlayer } from './helpers'
import { saveGame } from '../storage'
import { ReturnDeviceScreen } from '../../components/layouts/ReturnDeviceScreen'

const modules: Record<string, unknown> = {
  ...import.meta.glob('../roles/definition/**/i18n/*.ts', {
    eager: true,
    import: 'default',
  }),
  ...import.meta.glob('../effects/definition/**/i18n/*.ts', {
    eager: true,
    import: 'default',
  }),
  ...import.meta.glob('../i18n/translations/*.ts', {
    eager: true,
    import: 'default',
  }),
}
let root: Root, container: HTMLDivElement
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  localStorage.clear()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
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
  act(() => root.render(<I18nProvider>{node}</I18nProvider>))
}
function click(text: string) {
  const target = [
    ...container.querySelectorAll<HTMLButtonElement>('button'),
  ].find((el) => el.textContent === text)
  expect(target, text).toBeTruthy()
  act(() => target!.click())
}
function Probe() {
  const { language, setLanguage, t } = useI18n()
  const [count, setCount] = useState(0)
  return (
    <>
      <output>
        {language}:{t.common.continue}:{count}
      </output>
      <button onClick={() => setCount((x) => x + 1)}>Count</button>
      {(['pt-BR', 'en', 'es'] as Language[]).map((code) => (
        <button key={code} onClick={() => setLanguage(code)}>
          {code}
        </button>
      ))}
    </>
  )
}
it.each([null, '', 'fr', 'pt', 'pt_BR', 'en', 'es', 'pt-BR'])(
  'resolves persisted preference %s without browser guessing',
  (stored) => {
    if (stored !== null) localStorage.setItem('grimoire_language', stored)
    render(<Probe />)
    const expected =
      stored === 'en' || stored === 'es' || stored === 'pt-BR'
        ? stored
        : 'pt-BR'
    expect(container.querySelector('output')?.textContent).toContain(
      expected + ':',
    )
    expect(document.documentElement.lang).toBe(expected)
  },
)
it('persists all explicit selections across remounts without resetting child state', () => {
  render(<Probe />)
  click('Count')
  for (const code of ['en', 'es', 'pt-BR']) {
    click(code)
    expect(localStorage.getItem('grimoire_language')).toBe(code)
    expect(container.querySelector('output')?.textContent).toMatch(/:1$/)
  }
  act(() => root.unmount())
  root = createRoot(container)
  render(<Probe />)
  expect(container.querySelector('output')?.textContent).toBe(
    'pt-BR:Continuar:0',
  )
})
it('changes the language of an actual saved game without altering its identity, phase or history', () => {
  const game = makeGame(
    makeState({
      phase: 'day',
      players: ['soldier', 'mayor', 'slayer', 'spy', 'imp'].map((roleId, i) =>
        makePlayer({ roleId, name: `Pessoa ${i + 1}` }),
      ),
    }),
  )
  saveGame(game)
  const before = localStorage.getItem('grimoire_games')
  render(
    <>
      <Probe />
      <GameScreen initialGame={game} onMainMenu={vi.fn()} />
    </>,
  )
  expect(container.textContent).toContain(pt.game.newNomination)
  click('en')
  expect(container.textContent).toContain(en.game.newNomination)
  click('es')
  expect(container.textContent).toContain(es.game.newNomination)
  click('pt-BR')
  expect(localStorage.getItem('grimoire_games')).toBe(before)
  expect(before).toContain('Pessoa 1')
  expect(container.textContent).toContain(pt.game.newNomination)
})
function leaves(value: unknown, path = ''): Record<string, string> {
  if (typeof value === 'string') return { [path]: value }
  return Object.fromEntries(
    Object.entries(value as object).flatMap(([k, v]) =>
      Object.entries(leaves(v, path + '.' + k)),
    ),
  )
}
it('has complete physical PT-BR modules, exact keys/placeholders and no em dash in all three locales', () => {
  const sources = Object.keys(modules).filter((p) => /en\.ts$/.test(p))
  expect(sources).toHaveLength(41)
  let copyCount = 0
  for (const source of sources) {
    const english = leaves(modules[source])
    for (const locale of ['es', 'pt-BR']) {
      const file = source.replace(/en\.ts$/, locale + '.ts')
      expect(modules[file], file).toBeTruthy()
      const translated = leaves(modules[file])
      expect(Object.keys(translated).sort(), file).toEqual(
        Object.keys(english).sort(),
      )
      for (const key in english) {
        expect(
          (translated[key].match(/\{\w+\}/g) ?? []).sort(),
          file + key,
        ).toEqual((english[key].match(/\{\w+\}/g) ?? []).sort())
        expect(translated[key], file + key).not.toContain('—')
        if (locale === 'pt-BR' && !key.endsWith('.type')) {
          copyCount++
          expect(translated[key].trim(), file + key).not.toBe('')
          if (
            /[A-Za-z]/.test(english[key].replace(/\{\w+\}/g, '')) &&
            !['Grimorium', 'Trouble Brewing', 'Manual'].includes(english[key])
          )
            expect(translated[key], file + key).not.toBe(english[key])
        }
      }
    }
    for (const text of Object.values(english)) expect(text).not.toContain('—')
  }
  expect(copyCount).toBeGreaterThanOrEqual(819)
})
it('localizes every registered character and effect, retaining stable internal IDs', () => {
  expect(getAllRoles()).toHaveLength(23)
  expect(getAllEffects()).toHaveLength(17)
  for (const role of getAllRoles()) {
    expect(getRoleName(role.id, 'pt-BR')).not.toBe(role.id)
    expect(getRoleDescription(role.id, 'pt-BR').length).toBeGreaterThan(20)
    expect(getRoleDescription(role.id, 'pt-BR')).not.toMatch(/noite\s*\*/)
  }
  for (const effect of getAllEffects()) {
    expect(getEffectName(effect.id, 'pt-BR')).not.toBe(effect.id)
    expect(getEffectDescription(effect.id, 'pt-BR').length).toBeGreaterThan(20)
  }
  expect(getRoleName('imp', 'pt-BR')).toBe('Diabrete')
})
it('formats Brazilian dates and times independently of the game language at creation', () => {
  expect(getLocale('pt-BR')).toBe('pt-BR')
  expect(getLocale('en')).toBe('en-US')
  expect(getLocale('es')).toBe('es-ES')
  expect(
    new Date(2026, 9, 30, 14, 5).toLocaleDateString(getLocale('pt-BR')),
  ).toBe('30/10/2026')
  expect(
    new Date(2026, 9, 30, 14, 5).toLocaleTimeString(getLocale('pt-BR'), {
      hour: '2-digit',
      minute: '2-digit',
    }),
  ).toBe('14:05')
})
it.each([
  ['Diabrete', 1, 'Diabrete'],
  ['Diabrete', 2, 'Diabrete ×2'],
])('formats %s quantity %s as %s', (name, count, expected) => {
  expect(formatRoleQuantity(String(name), Number(count))).toBe(expected)
})
it.each(['pt-BR', 'en', 'es'] as Language[])(
  'puts explicit End Day confirmation before Cancel in %s',
  (locale) => {
    localStorage.setItem('grimoire_language', locale)
    const t = locale === 'en' ? en : locale === 'es' ? es : pt
    render(
      <EndDayConfirmation
        open
        round={1}
        nextRound={2}
        blockedPlayerName='Alice'
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    const texts = [...document.querySelectorAll('button')].map(
      (el) => el.textContent,
    )
    expect(texts.indexOf(t.game.confirmEndDay)).toBeLessThan(
      texts.indexOf(t.common.cancel),
    )
  },
)
it('renders dynamic Portuguese history while preserving user-entered em dashes', () => {
  const player = makePlayer({ name: 'Alice—Bob', roleId: 'imp' })
  const game = makeGame(makeState({ players: [player] }))
  game.history.push({
    ...game.history[0],
    id: 'execution',
    type: 'execution',
    message: [
      { type: 'i18n', key: 'history.executed', params: { player: player.id } },
    ],
    data: { playerId: player.id, died: false },
  })
  render(<HistoryView game={game} onClose={vi.fn()} />)
  expect(container.textContent).toContain('Alice—Bob recebeu uma execução.')
  expect(container.textContent).toContain('Alice—Bob não morreu.')
  expect(interpolate(pt.game.goesOnBlock, { player: 'Alice' })).toBe(
    'Alice está prestes a morrer.',
  )
})
it('keeps the uninterrupted handback hold and callback count when locale changes mid-hold', () => {
  vi.useFakeTimers()
  const ready = vi.fn()
  render(
    <>
      <Probe />
      <ReturnDeviceScreen onReady={ready} />
    </>,
  )
  const control = [...container.querySelectorAll('button')].find((el) =>
    el.textContent?.includes(pt.game.returnDeviceReady),
  )!
  const event = new MouseEvent('pointerdown', { bubbles: true, button: 0 })
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    pointerType: { value: 'touch' },
    isPrimary: { value: true },
  })
  act(() => control.dispatchEvent(event))
  act(() => vi.advanceTimersByTime(500))
  click('en')
  expect(ready).not.toHaveBeenCalled()
  act(() => vi.advanceTimersByTime(499))
  expect(ready).not.toHaveBeenCalled()
  act(() => vi.advanceTimersByTime(1))
  expect(ready).toHaveBeenCalledTimes(1)
})
