import { Game } from './types'
import { parseSavedGames, serializeGames } from './saveFormat'

const STORAGE_KEY = 'grimoire_games'
const CURRENT_GAME_KEY = 'grimoire_current_game'

export class GameStorageError extends Error {
  constructor(
    public readonly kind: 'read' | 'invalid' | 'write',
    public readonly backup?: string,
    public readonly retry?: () => void,
  ) {
    super(`Game storage: ${kind}`)
    this.name = 'GameStorageError'
  }
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    throw new GameStorageError('read')
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    throw new GameStorageError(
      'write',
      key === STORAGE_KEY ? value : undefined,
      () => write(key, value),
    )
  }
}

function persistGames(games: Game[]): void {
  let serialized: string
  try {
    serialized = serializeGames(games)
  } catch {
    throw new GameStorageError('invalid', JSON.stringify(games))
  }
  write(STORAGE_KEY, serialized)
}

// ============================================================================
// GAME STORAGE
// ============================================================================

export function saveGame(game: Game): void {
  const games = getAllGames()
  const existingIndex = games.findIndex((g) => g.id === game.id)

  if (existingIndex >= 0) {
    games[existingIndex] = game
  } else {
    games.push(game)
  }

  persistGames(games)
}

export function getAllGames(): Game[] {
  const data = read(STORAGE_KEY)
  if (data === null) return []
  try {
    return parseSavedGames(data)
  } catch {
    throw new GameStorageError('invalid', data)
  }
}

export function getGame(gameId: string): Game | undefined {
  const games = getAllGames()
  return games.find((g) => g.id === gameId)
}

export function deleteGame(gameId: string): void {
  const games = getAllGames().filter((g) => g.id !== gameId)
  persistGames(games)

  // Clear current game if it was deleted
  if (getCurrentGameId() === gameId) {
    clearCurrentGame()
  }
}

// ============================================================================
// CURRENT GAME
// ============================================================================

export function setCurrentGameId(gameId: string): void {
  write(CURRENT_GAME_KEY, gameId)
}

export function getCurrentGameId(): string | null {
  return read(CURRENT_GAME_KEY)
}

export function clearCurrentGame(): void {
  try {
    localStorage.removeItem(CURRENT_GAME_KEY)
  } catch {
    throw new GameStorageError('write', undefined, clearCurrentGame)
  }
}

export function getCurrentGame(): Game | undefined {
  const gameId = getCurrentGameId()
  if (!gameId) return undefined
  return getGame(gameId)
}

// ============================================================================
// GAME LIST HELPERS
// ============================================================================

export type GameSummary = {
  id: string
  name: string
  createdAt: number
  playerCount: number
  phase: string
  round: number
}

export function getLastGamePlayers(): string[] {
  const games = getAllGames()
  if (games.length === 0) return []

  const sorted = [...games].sort((a, b) => b.createdAt - a.createdAt)
  const lastGame = sorted[0]
  const lastEntry = lastGame.history.at(-1)
  if (!lastEntry?.stateAfter?.players) return []

  return lastEntry.stateAfter.players.map((p) => p.name)
}

export function getGameSummaries(): GameSummary[] {
  const games = getAllGames()

  return games
    .map((game) => {
      const lastEntry = game.history.at(-1)
      const state = lastEntry?.stateAfter

      return {
        id: game.id,
        name: game.name,
        createdAt: game.createdAt,
        playerCount: state?.players.length ?? 0,
        phase: state?.phase ?? 'unknown',
        round: state?.round ?? 0,
      }
    })
    .sort((a, b) => b.createdAt - a.createdAt)
}

/** Import/correction transaction: compare the snapshot and commit the whole collection.
 * localStorage.setItem is atomic on failure. Do not delete, migrate or retry a
 * stale import, and never touch the current-game, language or audience keys. */
export function getRawGames(): string | null {
  return read(STORAGE_KEY)
}
export function replaceGamesFromBackup(
  expected: string | null,
  serialized: string,
): void {
  parseSavedGames(serialized)
  if (read(STORAGE_KEY) !== expected)
    throw new Error('Saved games changed since preview')
  try {
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch {
    throw new GameStorageError('write')
  }
}

/** Persist a correction only if the stored game is still the version confirmed
 * by the Storyteller. No stale retry and no writes to selection or preferences. */
export function saveGameIfUnchanged(game: Game, expected: Game): void {
  const snapshot = read(STORAGE_KEY)
  if (snapshot === null) throw new Error('Missing game')
  const games = parseSavedGames(snapshot)
  const index = games.findIndex((item) => item.id === expected.id)
  if (
    index < 0 ||
    game.id !== expected.id ||
    JSON.stringify(games[index]) !== JSON.stringify(expected)
  )
    throw new Error('Game changed since confirmation')
  games[index] = game
  replaceGamesFromBackup(snapshot, serializeGames(games))
}
