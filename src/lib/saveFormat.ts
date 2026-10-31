import { validateVoteHistoryMetadata } from './voteHistory'
import type { Game } from './types'

const phases = new Set(['setup', 'night', 'day', 'ended'])
const teams = new Set(['townsfolk', 'outsider', 'minion', 'demon'])
const events = new Set([
  'game_created',
  'night_started',
  'starting_info',
  'role_revealed',
  'night_action',
  'night_skipped',
  'night_resolved',
  'day_started',
  'nomination',
  'vote',
  'vote_corrected',
  'execution',
  'virgin_execution',
  'virgin_spent',
  'slayer_shot',
  'effect_added',
  'effect_removed',
  'effect_corrected',
  'role_changed',
  'role_change_revealed',
  'setup_action',
  'game_ended',
])
const record = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x)
const text = (x: unknown): x is string => typeof x === 'string'
const number = (x: unknown): x is number =>
  typeof x === 'number' && Number.isFinite(x)

function validMessage(x: unknown): boolean {
  if (!record(x)) return false
  switch (x.type) {
    case 'text':
      return text(x.content)
    case 'player':
      return text(x.playerId)
    case 'role':
      return text(x.roleId)
    case 'effect':
      return text(x.effectType)
    case 'i18n':
      return (
        text(x.key) &&
        (x.params === undefined ||
          (record(x.params) &&
            Object.values(x.params).every((v) => text(v) || number(v))))
      )
    default:
      return false
  }
}

function validState(x: unknown): boolean {
  return (
    record(x) &&
    text(x.phase) &&
    phases.has(x.phase) &&
    number(x.round) &&
    Number.isInteger(x.round) &&
    x.round >= 0 &&
    (x.winner === null || (text(x.winner) && teams.has(x.winner))) &&
    Array.isArray(x.players) &&
    x.players.every(
      (p) =>
        record(p) &&
        text(p.id) &&
        text(p.name) &&
        text(p.roleId) &&
        Array.isArray(p.effects) &&
        p.effects.every(
          (e) =>
            record(e) &&
            text(e.id) &&
            text(e.type) &&
            (e.data === undefined || record(e.data)) &&
            (e.sourcePlayerId === undefined || text(e.sourcePlayerId)) &&
            (e.expiresAt === undefined ||
              ['end_of_night', 'end_of_day', 'never'].includes(
                String(e.expiresAt),
              )),
        ),
    ) &&
    new Set(x.players.map((p) => p.id)).size === x.players.length
  )
}

export function isSavedGame(x: unknown): x is Game {
  return (
    record(x) &&
    text(x.id) &&
    text(x.name) &&
    text(x.scriptId) &&
    number(x.createdAt) &&
    Array.isArray(x.history) &&
    x.history.length > 0 &&
    x.history.every(
      (e) =>
        record(e) &&
        text(e.id) &&
        number(e.timestamp) &&
        text(e.type) &&
        events.has(e.type) &&
        record(e.data) &&
        Array.isArray(e.message) &&
        e.message.every(validMessage) &&
        validState(e.stateAfter),
    ) &&
    validateVoteHistoryMetadata(x as Game)
  )
}

// Accept the original array format without modifying it on read. New writes
// have an explicit version; unknown versions must not be silently overwritten.
export function parseSavedGames(raw: string): Game[] {
  const value: unknown = JSON.parse(raw)
  const games = Array.isArray(value)
    ? value
    : record(value) && value.version === 1
      ? value.games
      : null
  if (
    !Array.isArray(games) ||
    !games.every(isSavedGame) ||
    new Set(games.map((g) => g.id)).size !== games.length
  ) {
    throw new Error('Unsupported or invalid game save')
  }
  return games
}

export function serializeGames(games: Game[]): string {
  if (!games.every(isSavedGame)) throw new Error('Invalid game state')
  return JSON.stringify({ version: 1, games })
}
