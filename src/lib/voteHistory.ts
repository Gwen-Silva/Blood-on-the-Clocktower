import { isSavedGame } from './saveFormat'
import {
  getCurrentState,
  hasEffect,
  type Game,
  type GameState,
  type HistoryEntry,
} from './types'
import { sameSavedValue } from './correctionShared'
import { canPlayerVote } from './votingEligibility'

export type VoteBlock = {
  playerId: string
  playerName: string
  voteCount: number
} | null
export type VoteOperation = {
  operationId: string
  eventIds: string[]
  nominationEventId: string
  nomineeId: string
  nomineeName: string
  nominatorId: string
  voteCount: number
  votedIds: string[]
  beforeState: GameState
  previousBlock: VoteBlock
  previousBenchmark: number
}
type VoteMetadata = {
  version: 1
  source: 'narrator'
  operationId: string
  eventIds: string[]
  partIndex: number
  previousEventId: string
  nominationEventId: string
}
type Inspection = {
  cancelled: Set<string>
  operations: Map<string, VoteOperation>
  latest: VoteOperation | null
  pending: VoteOperation | null
  block: VoteBlock
  benchmark: number
}
const object = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v)
const id = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0
const count = (v: unknown): v is number =>
  Number.isSafeInteger(v) && (v as number) >= 0
const fail = (): never => {
  throw new Error('Invalid vote operation or correction')
}

function readOperation(
  history: HistoryEntry[],
  start: number,
  day: HistoryEntry | undefined,
  nomination: HistoryEntry | undefined,
  block: VoteBlock,
  benchmark: number,
  tallied: Set<string>,
): VoteOperation {
  const first = history[start],
    previous = history[start - 1],
    m = first.data.voteOperation
  if (
    !object(m) ||
    m.version !== 1 ||
    m.source !== 'narrator' ||
    !id(m.operationId) ||
    !Array.isArray(m.eventIds) ||
    !m.eventIds.every(id) ||
    ![1, 2].includes(m.eventIds.length) ||
    m.partIndex !== 0 ||
    !previous ||
    m.previousEventId !== previous.id ||
    !day ||
    !nomination ||
    m.nominationEventId !== nomination.id ||
    tallied.has(nomination.id)
  )
    return fail()
  const events = history.slice(start, start + m.eventIds.length)
  if (
    events.length !== m.eventIds.length ||
    new Set(m.eventIds).size !== m.eventIds.length ||
    !sameSavedValue(
      events.map((e) => e.id),
      m.eventIds,
    )
  )
    return fail()
  for (let i = 0; i < events.length; i++) {
    const e = events[i],
      meta = e.data.voteOperation
    if (
      e.type !== 'vote' ||
      !object(meta) ||
      !sameSavedValue({ ...meta, partIndex: 0 }, m) ||
      meta.partIndex !== i
    )
      return fail()
  }
  const before = previous.stateAfter,
    after = first.stateAfter,
    d = first.data
  const nominee = before.players.find((p) => p.id === d.nomineeId),
    nominator = nomination.stateAfter.players.find(
      (p) => p.id === nomination.data.nominatorId,
    )
  if (
    before.phase !== 'day' ||
    before.round !== day.stateAfter.round ||
    day.stateAfter.phase !== 'day' ||
    nomination.stateAfter.phase !== 'day' ||
    nomination.stateAfter.round !== before.round ||
    !nominee ||
    !nominator ||
    hasEffect(nominator, 'dead') ||
    nomination.data.nomineeId !== nominee.id ||
    d.nomineeName !== nominee.name ||
    !count(d.voteCount) ||
    !Array.isArray(d.votedIds) ||
    !d.votedIds.every(id) ||
    new Set(d.votedIds).size !== d.votedIds.length ||
    d.votedIds.length !== d.voteCount
  )
    return fail()
  const votedIds = d.votedIds as string[],
    selected = Object.fromEntries(votedIds.map((v) => [v, true]))
  if (
    votedIds.some((v) => {
      const p = before.players.find((p) => p.id === v)
      return !p || !canPlayerVote(p, before, selected)
    })
  )
    return fail()
  const threshold = Math.ceil(
      before.players.filter((p) => !hasEffect(p, 'dead')).length / 2,
    ),
    meets = d.voteCount >= threshold,
    replaces = meets && d.voteCount > benchmark,
    clears = meets && benchmark > 0 && d.voteCount === benchmark
  if (
    d.threshold !== threshold ||
    d.meetsThreshold !== meets ||
    d.replacesBlock !== replaces ||
    d.clearsBlock !== clears ||
    events.length !== (clears ? 2 : 1)
  )
    return fail()
  const existingIds = new Set(
      before.players.flatMap((p) => p.effects.map((e) => e.id)),
    ),
    addedIds = new Set<string>()
  const expected: GameState = {
    ...before,
    players: before.players.map((p) => {
      if (!votedIds.includes(p.id) || !hasEffect(p, 'dead')) return p
      const next = after.players.find((n) => n.id === p.id),
        added = next?.effects.filter(
          (e) => !p.effects.some((old) => old.id === e.id),
        )
      if (!added || added.length !== 1) return fail()
      const effect = added[0]
      if (
        !id(effect.id) ||
        existingIds.has(effect.id) ||
        addedIds.has(effect.id) ||
        effect.type !== 'used_dead_vote' ||
        effect.data !== undefined ||
        effect.sourcePlayerId !== undefined ||
        effect.expiresAt !== undefined
      )
        return fail()
      addedIds.add(effect.id)
      return { ...p, effects: [...p.effects, effect] }
    }),
  }
  if (!sameSavedValue(expected, after)) return fail()
  if (clears) {
    const tie = events[1]
    if (
      !sameSavedValue(tie.stateAfter, after) ||
      !sameSavedValue(
        { ...tie.data, voteOperation: undefined },
        {
          nomineeId: nominee.id,
          nomineeName: nominee.name,
          voteCount: d.voteCount,
          threshold,
          meetsThreshold: true,
          replacesBlock: false,
          clearsBlock: true,
        },
      )
    )
      return fail()
  }
  return {
    operationId: m.operationId,
    eventIds: [...m.eventIds] as string[],
    nominationEventId: nomination.id,
    nomineeId: nominee.id,
    nomineeName: nominee.name,
    nominatorId: nominator.id,
    voteCount: d.voteCount,
    votedIds: [...votedIds],
    beforeState: before,
    previousBlock: block ? { ...block } : null,
    previousBenchmark: benchmark,
  }
}

/** Raw audit is never changed. Only supported, validated cancellations affect
 * effective voting. Malformed metadata throws instead of silently cancelling. */
export function inspectVoteHistory(history: HistoryEntry[]): Inspection {
  const result: Inspection = {
    cancelled: new Set(),
    operations: new Map(),
    latest: null,
    pending: null,
    block: null,
    benchmark: 0,
  }
  let day: HistoryEntry | undefined, nomination: HistoryEntry | undefined
  const tallied = new Set<string>()
  if (
    history.some(
      (e) => e.type === 'vote_corrected' || e.data.voteOperation !== undefined,
    ) &&
    new Set(history.map((e) => e.id)).size !== history.length
  )
    return fail()
  const apply = (e: HistoryEntry) => {
    if (!day) return
    if (e.data.replacesBlock === true)
      result.block = {
        playerId: e.data.nomineeId as string,
        playerName: e.data.nomineeName as string,
        voteCount: e.data.voteCount as number,
      }
    else if (e.data.clearsBlock === true) result.block = null
    if (e.data.meetsThreshold === true)
      result.benchmark = Math.max(result.benchmark, e.data.voteCount as number)
  }
  for (let i = 0; i < history.length; i++) {
    const e = history[i]
    if (e.type === 'day_started') {
      day = e
      nomination = undefined
      tallied.clear()
      result.block = null
      result.benchmark = 0
    }
    if (e.type === 'vote' && e.data.voteOperation !== undefined) {
      const op = readOperation(
        history,
        i,
        day,
        nomination,
        result.block,
        result.benchmark,
        tallied,
      )
      if (result.operations.has(op.operationId)) return fail()
      result.operations.set(op.operationId, op)
      tallied.add(op.nominationEventId)
      for (let j = 0; j < op.eventIds.length; j++) apply(history[i + j])
      i += op.eventIds.length - 1
      result.latest = op
      result.pending = null
      continue
    }
    if (e.type === 'vote_corrected') {
      const d = e.data,
        op = result.latest
      if (
        !op ||
        d.version !== 1 ||
        d.source !== 'narrator' ||
        d.operationId !== op.operationId ||
        !sameSavedValue(d.eventIds, op.eventIds) ||
        d.nominationEventId !== op.nominationEventId ||
        d.nomineeId !== op.nomineeId ||
        d.voteCount !== op.voteCount ||
        history[i - 1]?.id !== op.eventIds.at(-1) ||
        op.eventIds.some((eventId) => result.cancelled.has(eventId)) ||
        !sameSavedValue(e.stateAfter, op.beforeState)
      )
        return fail()
      op.eventIds.forEach((eventId) => result.cancelled.add(eventId))
      tallied.delete(op.nominationEventId)
      result.block = op.previousBlock
      result.benchmark = op.previousBenchmark
      result.pending = op
      result.latest = null
      continue
    }
    result.latest = null
    result.pending = null
    if (e.type === 'nomination' && day) nomination = e
    if (e.type === 'vote') {
      apply(e)
      if (nomination && e.data.nomineeId === nomination.data.nomineeId)
        tallied.add(nomination.id)
    }
  }
  return result
}
export function validateVoteHistoryMetadata(game: Game): boolean {
  try {
    inspectVoteHistory(game.history)
    return true
  } catch {
    return false
  }
}
export function getEffectiveVoteHistory(game: Game): HistoryEntry[] {
  const { cancelled } = inspectVoteHistory(game.history)
  return game.history.filter((e) => !cancelled.has(e.id))
}
export function getEligibleVoteOperation(game: Game): VoteOperation | null {
  try {
    if (!isSavedGame(game)) return null
    const r = inspectVoteHistory(game.history),
      s = getCurrentState(game)
    return s.phase === 'day' &&
      r.latest &&
      r.latest.beforeState.round === s.round
      ? r.latest
      : null
  } catch {
    return null
  }
}
export function getPendingVoteCorrection(game: Game): VoteOperation | null {
  try {
    return isSavedGame(game) ? inspectVoteHistory(game.history).pending : null
  } catch {
    return null
  }
}

export function recordVoteOperation(before: Game, after: Game): Game {
  const entries = after.history.slice(before.history.length),
    previous = before.history.at(-1)
  if (
    !previous ||
    ![1, 2].includes(entries.length) ||
    entries.some((e) => e.type !== 'vote') ||
    !sameSavedValue(
      after.history.slice(0, before.history.length),
      before.history,
    )
  )
    return fail()
  const nomination = [...before.history]
    .reverse()
    .find((e) => e.type === 'nomination')
  if (!nomination) return fail()
  const metadata: Omit<VoteMetadata, 'partIndex'> = {
    version: 1,
    source: 'narrator',
    operationId: crypto.randomUUID(),
    eventIds: entries.map((e) => e.id),
    previousEventId: previous.id,
    nominationEventId: nomination.id,
  }
  const result = {
    ...after,
    history: [
      ...before.history,
      ...entries.map((e, partIndex) => ({
        ...e,
        data: { ...e.data, voteOperation: { ...metadata, partIndex } },
      })),
    ],
  }
  if (!getEligibleVoteOperation(result)) return fail()
  return result
}
export function correctLatestVote(game: Game, operationId: string): Game {
  const op = getEligibleVoteOperation(game)
  if (!op || op.operationId !== operationId) return fail()
  let eventId: string
  do {
    eventId = crypto.randomUUID()
  } while (game.history.some((e) => e.id === eventId))
  return {
    ...game,
    history: [
      ...game.history,
      {
        id: eventId,
        timestamp: Date.now(),
        type: 'vote_corrected',
        data: {
          version: 1,
          source: 'narrator',
          operationId: op.operationId,
          eventIds: [...op.eventIds],
          nominationEventId: op.nominationEventId,
          nomineeId: op.nomineeId,
          voteCount: op.voteCount,
        },
        message: [
          {
            type: 'i18n',
            key: 'voteCorrection.history',
            params: { player: op.nomineeId, votes: op.voteCount },
          },
        ],
        stateAfter: structuredClone(op.beforeState),
      },
    ],
  }
}
