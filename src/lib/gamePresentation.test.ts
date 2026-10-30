import { describe, expect, it } from 'vitest'
import { displayGameName, formatGamePhase } from './gamePresentation'
import en from './i18n/translations/en'
import es from './i18n/translations/es'
import pt from './i18n/translations/pt-BR'
import type { GameSummary } from './storage'

const game: GameSummary = {
  id: 'unchanged',
  name: 'Game 30/10/2026',
  createdAt: new Date(2026, 9, 30, 12).getTime(),
  phase: 'night',
  round: 2,
  playerCount: 5,
}
describe('saved-game presentation', () => {
  it.each([
    ['en', en],
    ['es', es],
    ['pt-BR', pt],
  ] as const)(
    'localizes every phase in %s including unknown values',
    (_, t) => {
      expect(formatGamePhase(game, t)).toContain(t.game.night)
      expect(formatGamePhase({ ...game, phase: 'day' }, t)).toContain(
        t.game.day,
      )
      expect(formatGamePhase({ ...game, phase: 'setup' }, t)).toBe(
        t.mainMenu.settingUp,
      )
      expect(formatGamePhase({ ...game, phase: 'ended' }, t)).toBe(
        t.mainMenu.completed,
      )
      expect(formatGamePhase({ ...game, phase: 'future' }, t)).toContain(
        t.ui.unknown,
      )
    },
  )
  it('localizes exact legacy date titles without mutating summaries or custom titles', () => {
    const before = JSON.stringify(game)
    expect(displayGameName(game, 'pt-BR', pt)).toBe('Partida 30/10/2026')
    expect(displayGameName(game, 'en', en)).toBe('Game 10/30/2026')
    for (const name of [
      'Game Night',
      'Game 31/10/2026',
      'Partida da Gwen',
      'Game 30/10/2026 final',
    ]) {
      expect(displayGameName({ ...game, name }, 'pt-BR', pt)).toBe(name)
    }
    expect(JSON.stringify(game)).toBe(before)
  })
})
