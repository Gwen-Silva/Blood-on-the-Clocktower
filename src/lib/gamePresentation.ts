import {
  getLocale,
  interpolate,
  type Language,
  type Translations,
} from './i18n'
import type { GameSummary } from './storage'

export function formatGamePhase(game: GameSummary, t: Translations) {
  if (game.phase === 'ended') return t.mainMenu.completed
  if (game.phase === 'setup') return t.mainMenu.settingUp
  const phase =
    game.phase === 'night'
      ? t.game.night
      : game.phase === 'day'
        ? t.game.day
        : t.ui.unknown
  return `${t.mainMenu.round} ${game.round} · ${phase}`
}

/** Display only: recognize the exact old date title, never write into a save. */
export function displayGameName(
  game: GameSummary,
  language: Language,
  t: Translations,
) {
  const date = new Date(game.createdAt)
  const generated = ['en-US', 'en-GB', 'es-ES', 'pt-BR'].some((locale) =>
    ['Game', 'Partida'].some(
      (prefix) => game.name === `${prefix} ${date.toLocaleDateString(locale)}`,
    ),
  )
  return generated
    ? interpolate(t.clarity.gameName, {
        date: date.toLocaleDateString(getLocale(language)),
      })
    : game.name
}
