import { parseSavedGames, serializeGames } from './saveFormat'
import { getAllGames, replaceGamesFromBackup, getRawGames } from './storage'
import { isAudienceProtected } from './audienceProtection'
import { ROLES } from './roles'
import { EFFECTS } from './effects'
import { SCRIPTS } from './scripts'
import type { Game } from './types'

export type BackupPreview = {
  games: Game[]
  existing: Game[]
  snapshot: string | null
}
export type ConflictChoice = 'replace' | 'both'
function assertPrivateAccess() {
  if (isAudienceProtected()) throw new Error('Protected audience session')
}
function validGames(games: unknown): Game[] {
  const parsed = parseSavedGames(JSON.stringify({ version: 1, games }))
  for (const game of parsed) {
    if (
      !Number.isFinite(new Date(game.createdAt).getTime()) ||
      game.history[0].type !== 'game_created' ||
      !game.id.trim() ||
      !Object.hasOwn(SCRIPTS, game.scriptId) ||
      new Set(game.history.map((entry) => entry.id)).size !==
        game.history.length
    )
      throw new Error('Invalid game identity')
    for (const entry of game.history) {
      if (
        !entry.id.trim() ||
        !Number.isFinite(new Date(entry.timestamp).getTime())
      )
        throw new Error('Invalid history identity')
      for (const player of entry.stateAfter.players) {
        if (
          !player.id.trim() ||
          !Object.hasOwn(ROLES, player.roleId) ||
          new Set(player.effects.map((effect) => effect.id)).size !==
            player.effects.length ||
          player.effects.some(
            (effect) =>
              !effect.id.trim() || !Object.hasOwn(EFFECTS, effect.type),
          )
        )
          throw new Error('Unsupported player or effect')
      }
    }
  }
  return parsed
}
export function createGameBackup(): string {
  assertPrivateAccess()
  const games = validGames(getAllGames())
  return JSON.stringify(
    { format: 'grimorium-backup', version: 1, exportedAt: Date.now(), games },
    null,
    2,
  )
}
export function previewGameBackup(raw: string): BackupPreview {
  assertPrivateAccess()
  const value: unknown = JSON.parse(raw)
  if (
    !value ||
    typeof value !== 'object' ||
    !('format' in value) ||
    value.format !== 'grimorium-backup' ||
    !('version' in value) ||
    value.version !== 1 ||
    !('exportedAt' in value) ||
    typeof value.exportedAt !== 'number' ||
    !Number.isFinite(new Date(value.exportedAt).getTime()) ||
    !('games' in value)
  )
    throw new Error('Unsupported backup')
  const games = validGames(value.games)
  const snapshot = getRawGames()
  const existing = snapshot === null ? [] : parseSavedGames(snapshot)
  return { games, existing, snapshot }
}
export function restoreGameBackup(
  preview: BackupPreview,
  choices: Record<string, ConflictChoice>,
): void {
  assertPrivateAccess()
  const incoming = validGames(preview.games)
  const result = preview.existing.map((game) => game)
  const reserved = new Set([...result, ...incoming].map((game) => game.id))
  for (const game of incoming) {
    const index = result.findIndex((existing) => existing.id === game.id)
    if (index < 0) result.push(game)
    else if (choices[game.id] === 'replace') result[index] = game
    else if (choices[game.id] === 'both') {
      let id: string
      do {
        id = crypto.randomUUID()
      } while (reserved.has(id))
      reserved.add(id)
      result.push({ ...game, id })
    } else throw new Error('Explicit conflict choice required')
  }
  // Validate every item again before a single atomic storage write.
  const serialized = serializeGames(validGames(result))
  assertPrivateAccess()
  replaceGamesFromBackup(preview.snapshot, serialized)
}
export function backupFile(raw: string): File {
  return new File(
    [raw],
    `grimorium-backup-${new Date().toISOString().replaceAll(':', '-')}.json`,
    { type: 'application/json' },
  )
}
export function downloadGameBackup(file: File): void {
  assertPrivateAccess()
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
