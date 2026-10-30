import {
  getCurrentState,
  isAlive,
  type Game,
  type GameState,
  type PlayerState,
} from './types'
import {
  findLastEventIndex,
  getBlockStatus,
  getVoteBenchmark,
  getVoteThreshold,
} from './game'

// Deliberately independent of private engine unions and extensible dictionaries.
export type PublicPhase = 'setup' | 'night' | 'day' | 'ended'
export type PublicPlayerState = {
  id: string
  name: string
  seat: number
  alive: boolean | null
}
export type PublicBlock = { playerId: string; voteCount: number }
export type PublicVotingState = {
  threshold: number
  benchmark: number
  block: PublicBlock | null
}
export type PublicGameState = {
  id: string
  scriptId: 'trouble-brewing' | 'custom' | null
  phase: PublicPhase
  round: number
  players: PublicPlayerState[]
  voting: PublicVotingState | null
  winner: 'good' | 'evil' | null
}

export class PublicProjectionError extends Error {
  constructor() {
    super('Cannot project public game state')
    this.name = 'PublicProjectionError'
  }
}

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const text = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0
const count = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0

function validState(value: unknown): value is GameState {
  return (
    record(value) &&
    typeof value.phase === 'string' &&
    ['setup', 'night', 'day', 'ended'].includes(value.phase) &&
    count(value.round) &&
    Array.isArray(value.players) &&
    value.players.every(
      (player) =>
        record(player) && text(player.id) && typeof player.name === 'string',
    ) &&
    new Set(value.players.map((player) => player.id)).size ===
      value.players.length
  )
}
function publicAlive(player: PlayerState | undefined): boolean | null {
  if (
    !player ||
    !Array.isArray(player.effects) ||
    !player.effects.every(
      (effect) => record(effect) && typeof effect.type === 'string',
    )
  )
    return null
  return isAlive(player)
}
function boundary(game: Game, type: string): number {
  // The canonical scanner expects records. Do not guess across corrupt entries.
  if (
    !game.history.every(
      (entry) => record(entry) && typeof entry.type === 'string',
    )
  )
    return -1
  return findLastEventIndex(game, type)
}
function publicLifePlayers(game: Game, state: GameState): PlayerState[] {
  if (state.phase !== 'night') return state.players
  const index = boundary(game, 'night_started')
  if (index < 0) return []
  const snapshot = game.history[index].stateAfter
  // Night deaths are private until dawn; use the committed start-of-night state.
  return validState(snapshot) &&
    snapshot.phase === 'night' &&
    snapshot.round === state.round
    ? snapshot.players
    : []
}
function projectVoting(game: Game, state: GameState): PublicVotingState | null {
  if (
    state.phase !== 'day' ||
    state.players.some((player) => publicAlive(player) === null)
  )
    return null
  const start = boundary(game, 'day_started')
  if (start < 0) return null
  const day = game.history[start].stateAfter
  if (!validState(day) || day.phase !== 'day' || day.round !== state.round)
    return null
  const ids = new Set(state.players.map((player) => player.id))
  for (const entry of game.history.slice(start + 1)) {
    if (entry.type !== 'vote') continue
    const data = entry.data
    const snapshot = entry.stateAfter
    if (
      !record(data) ||
      !text(data.nomineeId) ||
      !ids.has(data.nomineeId) ||
      !count(data.voteCount) ||
      data.voteCount > state.players.length ||
      !count(data.threshold) ||
      typeof data.meetsThreshold !== 'boolean' ||
      typeof data.replacesBlock !== 'boolean' ||
      typeof data.clearsBlock !== 'boolean' ||
      (data.replacesBlock && data.clearsBlock) ||
      ((data.replacesBlock || data.clearsBlock) && !data.meetsThreshold) ||
      data.meetsThreshold !== data.voteCount >= data.threshold ||
      !validState(snapshot) ||
      snapshot.phase !== 'day' ||
      snapshot.round !== state.round ||
      snapshot.players.some((player) => publicAlive(player) === null) ||
      data.threshold !== getVoteThreshold(snapshot)
    )
      return null
  }
  const candidate = getBlockStatus(game)
  const benchmark = getVoteBenchmark(game)
  const threshold = getVoteThreshold(state)
  if (
    !count(benchmark) ||
    benchmark > state.players.length ||
    !count(threshold)
  )
    return null
  if (
    candidate &&
    (!text(candidate.playerId) ||
      !ids.has(candidate.playerId) ||
      !count(candidate.voteCount) ||
      candidate.voteCount !== benchmark)
  )
    return null
  return {
    threshold,
    benchmark,
    block: candidate
      ? { playerId: candidate.playerId, voteCount: candidate.voteCount }
      : null,
  }
}

/** Pure, fresh allowlist projection of committed snapshots; never project pending action data. */
export function projectPublicGameState(game: Game): PublicGameState {
  if (!record(game) || !text(game.id) || !Array.isArray(game.history))
    throw new PublicProjectionError()
  if (game.history.length > 0 && !record(game.history.at(-1)))
    throw new PublicProjectionError()
  const state = getCurrentState(game)
  if (!validState(state)) throw new PublicProjectionError()
  const lifePlayers = publicLifePlayers(game, state)
  return {
    id: game.id,
    scriptId:
      game.scriptId === 'trouble-brewing' || game.scriptId === 'custom'
        ? game.scriptId
        : null,
    phase: state.phase,
    round: state.round,
    players: state.players.map((player, index) => ({
      id: player.id,
      name: player.name,
      seat: index + 1,
      alive: publicAlive(
        lifePlayers.find((candidate) => candidate.id === player.id),
      ),
    })),
    voting: projectVoting(game, state),
    winner:
      state.phase === 'ended'
        ? state.winner === 'townsfolk'
          ? 'good'
          : state.winner === 'demon'
            ? 'evil'
            : null
        : null,
  }
}
