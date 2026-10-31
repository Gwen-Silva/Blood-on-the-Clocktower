import type { Game, GameState, EffectInstance } from './types'
import { getCurrentState, removeEffectsFromInactiveSources } from './types'
import { isSavedGame } from './saveFormat'
import { EFFECTS } from './effects'

export type ManualEffectOperation = 'add' | 'remove' | 'update'
type Metadata = {
  version: 1
  operation: ManualEffectOperation
  previousEventId: string
  beforeEffects: EffectInstance[]
  afterEffects: EffectInstance[]
}
export type EligibleEffectEdit = {
  eventId: string
  playerId: string
  playerName: string
  effectType: string
  operation: ManualEffectOperation
  previousState: GameState
}
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
// Saves contain JSON values. Object order is not semantic; effect/player order is.
export function sameSavedValue(a: unknown, b: unknown): boolean {
  const canonical = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(canonical)
    if (record(value))
      return Object.fromEntries(
        Object.keys(value)
          .sort()
          .filter((key) => value[key] !== undefined)
          .map((key) => [key, canonical(value[key])]),
      )
    return value
  }
  return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b))
}
const copy = <T>(value: T): T => structuredClone(value)

/** No scan backwards, legacy inference, snapshot rewriting or general Undo. */
export function getEligibleEffectEdit(game: Game): EligibleEffectEdit | null {
  try {
    if (
      !isSavedGame(game) ||
      game.history.length < 2 ||
      new Set(game.history.map((entry) => entry.id)).size !==
        game.history.length
    )
      return null
    const entry = game.history.at(-1)!,
      previous = game.history.at(-2)!
    const { playerId, effectType, source, manualEffectEdit } = entry.data
    if (
      source !== 'narrator' ||
      typeof playerId !== 'string' ||
      typeof effectType !== 'string' ||
      !Object.hasOwn(EFFECTS, effectType) ||
      !record(manualEffectEdit)
    )
      return null
    const m = manualEffectEdit
    if (
      m.version !== 1 ||
      typeof m.operation !== 'string' ||
      !['add', 'remove', 'update'].includes(m.operation) ||
      m.previousEventId !== previous.id
    )
      return null
    const operation = m.operation as ManualEffectOperation
    if (
      entry.type !==
        (operation === 'remove' ? 'effect_removed' : 'effect_added') ||
      (operation === 'update'
        ? entry.data.action !== 'update'
        : entry.data.action !== undefined)
    )
      return null
    const before = previous.stateAfter,
      after = entry.stateAfter
    const player = before.players.find((p) => p.id === playerId),
      next = after.players.find((p) => p.id === playerId)
    if (
      !player ||
      !next ||
      !sameSavedValue(m.beforeEffects, player.effects) ||
      !sameSavedValue(m.afterEffects, next.effects)
    )
      return null
    if (
      new Set(player.effects.map((e) => e.id)).size !== player.effects.length ||
      new Set(next.effects.map((e) => e.id)).size !== next.effects.length
    )
      return null
    let effects: EffectInstance[]
    if (operation === 'add') {
      const added = next.effects.filter(
        (e) => !player.effects.some((old) => old.id === e.id),
      )
      if (
        added.length !== 1 ||
        added[0].type !== effectType ||
        added[0].expiresAt !== 'never' ||
        added[0].sourcePlayerId !== undefined
      )
        return null
      effects = [...player.effects, added[0]]
    } else if (operation === 'remove') {
      if (!player.effects.some((e) => e.type === effectType)) return null
      effects = player.effects.filter((e) => e.type !== effectType)
    } else {
      const index = player.effects.findIndex((e) => e.type === effectType)
      if (index < 0) return null
      const old = player.effects[index],
        updated = next.effects.find((e) => e.id === old.id)
      if (
        !updated ||
        !record(updated.data) ||
        Object.keys(old.data ?? {}).some(
          (key) => !Object.hasOwn(updated.data!, key),
        )
      )
        return null
      effects = player.effects.map((e, i) =>
        i === index ? { ...e, data: updated.data } : e,
      )
    }
    const expected = removeEffectsFromInactiveSources(before, {
      ...before,
      players: before.players.map((p) =>
        p.id === playerId ? { ...p, effects } : p,
      ),
    })
    if (!sameSavedValue(expected, after) || sameSavedValue(before, after))
      return null
    return {
      eventId: entry.id,
      playerId,
      playerName: player.name,
      effectType,
      operation,
      previousState: copy(before),
    }
  } catch {
    return null
  }
}

/** Called only by the private Storyteller manual-effect handlers. The anchor
 * points to an existing complete snapshot; only effect arrays are duplicated. */
export function recordManualEffectEdit(
  before: Game,
  after: Game,
  operation: ManualEffectOperation,
): Game {
  if (after === before) return before
  if (
    after.history.length !== before.history.length + 1 ||
    !sameSavedValue(after.history.slice(0, -1), before.history)
  )
    throw new Error('Invalid manual effect operation')
  const entry = after.history.at(-1)!,
    playerId = entry.data.playerId
  const old = getCurrentState(before).players.find((p) => p.id === playerId),
    next = entry.stateAfter.players.find((p) => p.id === playerId)
  if (!old || !next) return after
  const metadata: Metadata = {
    version: 1,
    operation,
    previousEventId: before.history.at(-1)!.id,
    beforeEffects: copy(old.effects),
    afterEffects: copy(next.effects),
  }
  const candidate = {
    ...after,
    history: [
      ...after.history.slice(0, -1),
      { ...entry, data: { ...entry.data, manualEffectEdit: metadata } },
    ],
  }
  // A no-op/ambiguous edit remains an ordinary event, never a correction target.
  return getEligibleEffectEdit(candidate) ? candidate : after
}

export function correctLatestEffectEdit(
  game: Game,
  expectedEventId: string,
): Game {
  const target = getEligibleEffectEdit(game)
  if (!target || target.eventId !== expectedEventId)
    throw new Error('Ineligible or stale manual edit')
  let id: string
  do {
    id = crypto.randomUUID()
  } while (game.history.some((entry) => entry.id === id))
  return {
    ...game,
    history: [
      ...game.history,
      {
        id,
        timestamp: Date.now(),
        type: 'effect_corrected',
        message: [
          {
            type: 'i18n',
            key: 'effectCorrection.history',
            params: { player: target.playerId, effect: target.effectType },
          },
        ],
        data: {
          source: 'narrator',
          originalEventId: target.eventId,
          playerId: target.playerId,
          effectType: target.effectType,
          operation: target.operation,
        },
        // Do not run effect cleanup or reconstruct instances during restoration.
        stateAfter: target.previousState,
      },
    ],
  }
}
