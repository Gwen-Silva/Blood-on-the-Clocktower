// @vitest-environment jsdom
import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '../../lib/i18n'
import en from '../../lib/i18n/translations/en'
import es from '../../lib/i18n/translations/es'
import { ReturnDeviceScreen } from './ReturnDeviceScreen'
import { PlayerFacingScreen } from './PlayerFacingScreen'
import { HandbackButton } from './HandbackWrappers'
import { GameScreen } from '../screens/GameScreen'
import { makeGame, makePlayer, makeState } from '../../lib/__tests__/helpers'
import { getRole } from '../../lib/roles'
import { useHandback } from '../context/PlayerFacingContext'

let root: Root
let container: HTMLDivElement
beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  localStorage.clear()
  localStorage.setItem('grimoire_language', 'en')
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    value: false,
  })
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
function button(text = en.game.returnDeviceReady) {
  const found = [...document.querySelectorAll('button, a')].find((el) =>
    el.textContent?.includes(text),
  )
  expect(found, `Missing control: ${text}`).toBeTruthy()
  return found as HTMLButtonElement
}
function click(el: Element) {
  act(() => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
}
function pointer(
  el: Element,
  type: string,
  pointerId = 1,
  x = 10,
  y = 10,
  pointerType = 'mouse',
) {
  const event = new MouseEvent(type, {
    bubbles: true,
    button: 0,
    clientX: x,
    clientY: y,
  })
  Object.defineProperties(event, {
    pointerType: { value: pointerType },
    pointerId: { value: pointerId },
    isPrimary: { value: true },
  })
  act(() => {
    el.dispatchEvent(event)
  })
}
function key(el: Element, type: string, value = ' ', repeat = false) {
  act(() => {
    el.dispatchEvent(
      new KeyboardEvent(type, { bubbles: true, key: value, repeat }),
    )
  })
}
function advance(ms: number) {
  act(() => vi.advanceTimersByTime(ms))
}
function hold(el = button()) {
  pointer(el, 'pointerdown')
  advance(1000)
}
function progress() {
  const fill = button().querySelector<HTMLSpanElement>(
    'span[aria-hidden="true"]',
  )!
  return Number.parseFloat(fill.style.width) / 100
}
function noStorytellerControls() {
  expect(document.querySelector(`[title="${en.game.grimoire}"]`)).toBeNull()
  expect(document.querySelector(`[title="${en.common.history}"]`)).toBeNull()
  expect(document.querySelector('[role="dialog"]')).toBeNull()
}

describe('protected return interaction', () => {
  it('keeps a continuous touch hold through the native long-press contextmenu', () => {
    const ready = vi.fn()
    render(<ReturnDeviceScreen onReady={ready} />)
    pointer(button(), 'pointerdown', 1, 10, 10, 'touch')
    advance(500)
    const menu = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    })
    act(() => {
      button().dispatchEvent(menu)
    })
    expect(menu.defaultPrevented).toBe(true)
    advance(499)
    expect(ready).not.toHaveBeenCalled()
    advance(1)
    expect(ready).toHaveBeenCalledTimes(1)
    pointer(button(), 'pointerup', 1, 10, 10, 'touch')
    click(button())
    advance(2000)
    expect(ready).toHaveBeenCalledTimes(1)
  })
  it('suppresses contextmenu without starting a hold or unlocking', () => {
    const ready = vi.fn()
    render(<ReturnDeviceScreen onReady={ready} />)
    const menu = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    })
    act(() => {
      button().dispatchEvent(menu)
    })
    expect(menu.defaultPrevented).toBe(true)
    advance(2000)
    expect(progress()).toBe(0)
    expect(ready).not.toHaveBeenCalled()
  })
  it('uses only the in-button fill and retains accessible hold instructions', () => {
    render(<ReturnDeviceScreen onReady={vi.fn()} />)
    expect(container.querySelector('progress, [role="progressbar"]')).toBeNull()
    const descriptions = button()
      .getAttribute('aria-describedby')!
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent)
      .join(' ')
    expect(descriptions).toContain(en.game.returnDeviceHoldHint)
    pointer(button(), 'pointerdown')
    advance(500)
    expect(progress()).toBe(0.5)
  })
  it('rejects ordinary and synthetic clicks, including rapid taps', () => {
    const ready = vi.fn()
    render(<ReturnDeviceScreen onReady={ready} />)
    for (let i = 0; i < 10; i++) {
      pointer(button(), 'pointerdown')
      advance(80)
      pointer(button(), 'pointerup')
      click(button())
    }
    advance(2000)
    expect(ready).not.toHaveBeenCalled()
    expect(progress()).toBe(0)
  })
  it.each(['mouse', 'touch'])(
    'does not complete below 1000ms and resets on early %s release',
    (pointerType) => {
      const ready = vi.fn()
      render(<ReturnDeviceScreen onReady={ready} />)
      pointer(button(), 'pointerdown', 1, 10, 10, pointerType)
      advance(999)
      expect(ready).not.toHaveBeenCalled()
      expect(progress()).toBeGreaterThan(0)
      pointer(button(), 'pointerup', 1, 10, 10, pointerType)
      expect(progress()).toBe(0)
      advance(1000)
      expect(ready).not.toHaveBeenCalled()
      pointer(button(), 'pointerdown', 1, 10, 10, pointerType)
      advance(999)
      expect(ready).not.toHaveBeenCalled()
      advance(1)
      expect(ready).toHaveBeenCalledTimes(1)
    },
  )
  it('completes at 1000ms exactly once despite later input', () => {
    const ready = vi.fn()
    render(<ReturnDeviceScreen onReady={ready} />)
    hold()
    expect(progress()).toBe(1)
    expect(ready).toHaveBeenCalledTimes(1)
    expect(container.textContent).toContain(en.game.returnDeviceComplete)
    pointer(button(), 'pointerup')
    click(button())
    hold()
    key(button(), 'keydown', 'Enter')
    advance(2000)
    expect(ready).toHaveBeenCalledTimes(1)
  })
  it.each(
    ['pointercancel', 'pointerout', 'lostpointercapture'].flatMap((event) =>
      ['mouse', 'touch'].map((pointerType) => [event, pointerType]),
    ),
  )('%s cancels and resets for %s', (event, pointerType) => {
    const ready = vi.fn()
    render(<ReturnDeviceScreen onReady={ready} />)
    pointer(button(), 'pointerdown', 1, 10, 10, pointerType)
    advance(700)
    pointer(button(), event, 1, 10, 10, pointerType)
    expect(progress()).toBe(0)
    advance(1500)
    expect(ready).not.toHaveBeenCalled()
    hold()
    expect(ready).toHaveBeenCalledTimes(1)
  })
  it.each(['mouse', 'touch'])(
    'captured %s movement outside the button cancels',
    (pointerType) => {
      const ready = vi.fn()
      render(<ReturnDeviceScreen onReady={ready} />)
      vi.spyOn(button(), 'getBoundingClientRect').mockReturnValue({
        left: 0,
        right: 100,
        top: 0,
        bottom: 50,
      } as DOMRect)
      pointer(button(), 'pointerdown', 1, 10, 10, pointerType)
      advance(500)
      pointer(button(), 'pointermove', 1, 101, 20, pointerType)
      expect(progress()).toBe(0)
      advance(2000)
      expect(ready).not.toHaveBeenCalled()
    },
  )
  it.each(['blur', 'visibilitychange'])(
    '%s cancels a pending hold',
    (event) => {
      const ready = vi.fn()
      render(<ReturnDeviceScreen onReady={ready} />)
      pointer(button(), 'pointerdown')
      advance(500)
      act(() =>
        (event === 'blur' ? window : document).dispatchEvent(new Event(event)),
      )
      expect(progress()).toBe(0)
      advance(2000)
      expect(ready).not.toHaveBeenCalled()
    },
  )
  it('never starts while hidden and checks visibility at completion', () => {
    const ready = vi.fn()
    render(<ReturnDeviceScreen onReady={ready} />)
    Object.defineProperty(document, 'hidden', { value: true })
    hold()
    expect(ready).not.toHaveBeenCalled()
    Object.defineProperty(document, 'hidden', { value: false })
    pointer(button(), 'pointerdown')
    advance(980)
    Object.defineProperty(document, 'hidden', { value: true })
    advance(20)
    expect(ready).not.toHaveBeenCalled()
    expect(progress()).toBe(0)
  })
  it('unmount clears timers and prevents a delayed callback', () => {
    const ready = vi.fn()
    render(<ReturnDeviceScreen onReady={ready} />)
    pointer(button(), 'pointerdown')
    advance(500)
    act(() => root.render(null))
    advance(2000)
    expect(ready).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })
  it.each([' ', 'Enter'])(
    'requires the same continuous keyboard hold for %j',
    (value) => {
      const ready = vi.fn()
      render(<ReturnDeviceScreen onReady={ready} />)
      key(button(), 'keydown', value)
      advance(700)
      key(button(), 'keyup', value)
      expect(progress()).toBe(0)
      advance(1000)
      expect(ready).not.toHaveBeenCalled()
      key(button(), 'keydown', value)
      advance(999)
      expect(ready).not.toHaveBeenCalled()
      key(button(), 'keydown', value, true)
      advance(1)
      expect(ready).toHaveBeenCalledTimes(1)
      key(button(), 'keyup', value)
      click(button())
      expect(ready).toHaveBeenCalledTimes(1)
    },
  )
  it('auto-repeat alone and focus loss cannot unlock', () => {
    const ready = vi.fn()
    render(<ReturnDeviceScreen onReady={ready} />)
    key(button(), 'keydown', ' ', true)
    advance(1200)
    expect(ready).not.toHaveBeenCalled()
    key(button(), 'keydown')
    advance(600)
    act(() =>
      button().dispatchEvent(new FocusEvent('focusout', { bubbles: true })),
    )
    advance(1200)
    expect(ready).not.toHaveBeenCalled()
    expect(progress()).toBe(0)
  })
  it.each(['mouse', 'touch'])(
    'enforces the full duration for %s pointers',
    (pointerType) => {
      const ready = vi.fn()
      render(<ReturnDeviceScreen onReady={ready} />)
      pointer(button(), 'pointerdown', 1, 10, 10, pointerType)
      advance(999)
      expect(ready).not.toHaveBeenCalled()
      advance(1)
      expect(ready).toHaveBeenCalledTimes(1)
    },
  )
  it('repeated pointer downs do not accumulate time or queue callbacks', () => {
    const ready = vi.fn()
    render(<ReturnDeviceScreen onReady={ready} />)
    pointer(button(), 'pointerdown')
    advance(500)
    pointer(button(), 'pointerdown', 2)
    advance(499)
    expect(ready).not.toHaveBeenCalled()
    pointer(button(), 'pointerup', 1)
    advance(1000)
    expect(ready).not.toHaveBeenCalled()
    hold()
    expect(ready).toHaveBeenCalledTimes(1)
  })
  it('uses Spanish instructions with the canonical Cuentacuentos term', () => {
    localStorage.setItem('grimoire_language', 'es')
    render(<ReturnDeviceScreen onReady={vi.fn()} />)
    expect(button(es.game.returnDeviceReady)).toBeTruthy()
    expect(container.textContent).toContain(es.game.returnDeviceHoldHint)
  })
})

describe('shared private boundary', () => {
  it('requires protected handback even without a preparation name', () => {
    const ready = vi.fn()
    render(
      <PlayerFacingScreen>
        <p>SECRET</p>
        <HandbackButton onClick={ready}>Dismiss</HandbackButton>
      </PlayerFacingScreen>,
    )
    click(button('Dismiss'))
    expect(container.textContent).not.toContain('SECRET')
    click(button())
    advance(1200)
    expect(ready).not.toHaveBeenCalled()
    hold()
    expect(ready).toHaveBeenCalledTimes(1)
  })
  it('has no immediate callback fallback outside the boundary', () => {
    const ready = vi.fn()
    let failure: unknown
    function Unwrapped() {
      try {
        const { requestHandback } = useHandback()
        requestHandback(ready)
      } catch (error) {
        failure = error
      }
      return null
    }
    render(<Unwrapped />)
    expect(failure).toBeInstanceOf(Error)
    expect((failure as Error).message).toBe(
      'Private handback requires PlayerFacingScreen',
    )
    expect(ready).not.toHaveBeenCalled()
  })
  it('role revelation removes private content and commits only after handback', () => {
    const game = makeGame(
      makeState({
        phase: 'setup',
        round: 0,
        players: [
          makePlayer({ name: 'Alex', roleId: 'soldier' }),
          makePlayer({ name: 'Bea', roleId: 'imp' }),
        ],
      }),
    )
    render(<GameScreen initialGame={game} onMainMenu={vi.fn()} />)
    click(button('Alex'))
    noStorytellerControls()
    click(button(en.game.tapWhenReady))
    noStorytellerControls()
    expect(container.textContent).toContain(en.common.iUnderstandMyRole)
    click(button(en.common.iUnderstandMyRole))
    noStorytellerControls()
    expect(container.textContent).not.toContain('Soldier')
    expect(localStorage.getItem('grimoire_games')).toBeNull()
    click(button())
    pointer(button(), 'pointerdown')
    advance(999)
    noStorytellerControls()
    expect(localStorage.getItem('grimoire_games')).toBeNull()
    advance(1)
    const saved = localStorage.getItem('grimoire_games')!
    expect(saved).toContain('role_revealed')
    expect(game.history).toHaveLength(1)
    expect(
      document.querySelector(`[title="${en.game.grimoire}"]`),
    ).not.toBeNull()
  })
  it('a real Empath night reveal holds completion behind neutral handback', () => {
    const player = makePlayer({ roleId: 'empath', name: 'Alex' })
    const state = makeState({
      players: [
        player,
        makePlayer({ roleId: 'imp' }),
        makePlayer({ roleId: 'soldier' }),
      ],
    })
    const NightAction = getRole('empath')!.NightAction!
    const complete = vi.fn()
    render(
      <NightAction
        game={makeGame(state)}
        state={state}
        player={player}
        onComplete={complete}
      />,
    )
    click(button(en.game.stepShowResult))
    noStorytellerControls()
    click(button(en.game.tapWhenReady))
    expect(container.textContent).toContain("Empath's Information")
    click(button(en.common.continue))
    expect(container.textContent).not.toContain("Empath's Information")
    expect(container.textContent).not.toContain('Alex')
    click(button())
    advance(1200)
    expect(complete).not.toHaveBeenCalled()
    pointer(button(), 'pointerdown')
    advance(999)
    expect(complete).not.toHaveBeenCalled()
    noStorytellerControls()
    advance(1)
    expect(complete).toHaveBeenCalledTimes(1)
  })
  it('closes an existing Grimoire overlay when the night result becomes private', () => {
    const player = makePlayer({ roleId: 'empath', name: 'Alex' })
    const game = makeGame(
      makeState({
        players: [
          player,
          makePlayer({ roleId: 'imp', name: 'Bea' }),
          makePlayer({ roleId: 'soldier', name: 'Chris' }),
          makePlayer({ roleId: 'saint', name: 'Dana' }),
          makePlayer({ roleId: 'monk', name: 'Eli' }),
        ],
      }),
    )
    render(<GameScreen initialGame={game} onMainMenu={vi.fn()} />)
    click(button('Alex'))
    const showResult = button(en.game.stepShowResult)
    click(document.querySelector(`[title="${en.game.grimoire}"]`)!)
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    click(showResult)
    noStorytellerControls()
    click(button(en.game.tapWhenReady))
    noStorytellerControls()
    click(button(en.common.continue))
    noStorytellerControls()
    expect(container.textContent).not.toContain("Empath's Information")
    expect(localStorage.getItem('grimoire_games')).toBeNull()
    pointer(button(), 'pointerdown')
    advance(999)
    noStorytellerControls()
    expect(localStorage.getItem('grimoire_games')).toBeNull()
    advance(1)
    expect(localStorage.getItem('grimoire_games')).toContain('night_action')
    expect(
      document.querySelector(`[title="${en.game.grimoire}"]`),
    ).not.toBeNull()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })
})
