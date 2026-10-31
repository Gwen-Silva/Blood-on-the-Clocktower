import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import {
  makeGame,
  makeState,
  makeStandardPlayers,
  addEffectTo,
} from './helpers'
import {
  addHistoryEntry,
  nominate,
  resolveVote,
  getBlockStatus,
  getVoteBenchmark,
  executeAtEndOfDay,
  getNomineesToday,
  getNominatorsToday,
  startNight,
} from '../game'
import {
  correctLatestVote,
  getEligibleVoteOperation,
  getPendingVoteCorrection,
  getEffectiveVoteHistory,
  recordVoteOperation,
} from '../voteHistory'
import { getCurrentState, type Game } from '../types'
import { serializeGames, parseSavedGames, isSavedGame } from '../saveFormat'
import { projectPublicGameState } from '../publicGameState'
import { saveGame, saveGameIfUnchanged, getAllGames } from '../storage'
import {
  createGameBackup,
  previewGameBackup,
  restoreGameBackup,
} from '../gameBackup'
function day() {
  const players = makeStandardPlayers()
  let game = makeGame(makeState({ phase: 'setup', round: 0, players }))
  return addHistoryEntry(
    game,
    { type: 'day_started', data: { round: 2 }, message: [] },
    { phase: 'day', round: 2 },
  )
}
function vote(
  game: Game,
  nominee = 'p2',
  ids = ['p1', 'p2', 'p3'],
  nominator = 'p1',
) {
  const nominated = nominate(game, nominator, nominee)
  return recordVoteOperation(
    nominated,
    resolveVote(nominated, nominee, ids.length, ids),
  )
}
function correct(game: Game) {
  return correctLatestVote(game, getEligibleVoteOperation(game)!.operationId)
}
let values: Map<string, string>
beforeEach(() => {
  values = new Map([
    ['grimoire_language', 'es'],
    ['grimoire_current_game', 'selected'],
  ])
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((k: string) => values.get(k) ?? null),
    setItem: vi.fn((k: string, v: string) => {
      values.set(k, v)
    }),
    removeItem: vi.fn((k: string) => {
      values.delete(k)
    }),
  })
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
describe('Task013 logical vote correction and effective audit', () => {
  it('keeps legacy records readable but rejects an impossible prior block as a correction baseline', () => {
    const legacy = addHistoryEntry(day(), {
      type: 'vote',
      message: [],
      data: {
        nomineeId: 'missing',
        nomineeName: 'Unknown',
        voteCount: 3,
        threshold: 3,
        meetsThreshold: true,
        replacesBlock: true,
        clearsBlock: false,
      },
    })
    expect(isSavedGame(legacy)).toBe(true)
    const nominated = nominate(legacy, 'p1', 'p2'),
      before = structuredClone(nominated)
    expect(() =>
      recordVoteOperation(
        nominated,
        resolveVote(nominated, 'p2', 4, ['p1', 'p2', 'p3', 'p4']),
      ),
    ).toThrow()
    expect(nominated).toEqual(before)
  })

  it('zero votes is a meaningful recorded operation even though the player snapshot is unchanged', () => {
    const zero = vote(day(), 'p2', []),
      restored = correct(zero)
    expect(getPendingVoteCorrection(restored)?.voteCount).toBe(0)
    const repeated = recordVoteOperation(
      restored,
      resolveVote(restored, 'p2', 3, ['p1', 'p2', 'p3']),
    )
    expect(getBlockStatus(repeated)?.playerId).toBe('p2')
    expect(
      repeated.history.filter((e) => e.type === 'nomination'),
    ).toHaveLength(1)
  })

  it('corrects a leading vote with exact snapshot and append-only event references', () => {
    const initial = day(),
      changed = vote(initial),
      raw = structuredClone(changed),
      op = getEligibleVoteOperation(changed)!,
      result = correct(changed)
    expect(getBlockStatus(changed)?.playerId).toBe('p2')
    expect(getVoteBenchmark(changed)).toBe(3)
    expect(result.history.slice(0, -1)).toEqual(raw.history)
    expect(changed).toEqual(raw)
    expect(result.history.at(-1)).toMatchObject({
      type: 'vote_corrected',
      data: {
        operationId: op.operationId,
        eventIds: op.eventIds,
        nominationEventId: op.nominationEventId,
      },
    })
    expect(getCurrentState(result)).toStrictEqual(op.beforeState)
    expect(getBlockStatus(result)).toBeNull()
    expect(getVoteBenchmark(result)).toBe(0)
    expect(getEligibleVoteOperation(result)).toBeNull()
    expect(getPendingVoteCorrection(result)?.nomineeId).toBe('p2')
  })
  it('corrects an unsuccessful tally without changing the previous lead', () => {
    const first = vote(day()),
      failed = vote(first, 'p3', ['p2'], 'p2'),
      restored = correct(failed)
    expect(getBlockStatus(restored)).toEqual(getBlockStatus(first))
    expect(getVoteBenchmark(restored)).toBe(3)
  })
  it('treats both tie entries as one operation and removes the phantom tie from gameplay', () => {
    const first = vote(day()),
      tied = vote(first, 'p3', ['p2', 'p3', 'p4'], 'p2'),
      op = getEligibleVoteOperation(tied)!
    expect(op.eventIds).toHaveLength(2)
    expect(getBlockStatus(tied)).toBeNull()
    expect(getVoteBenchmark(tied)).toBe(3)
    const corrected = correct(tied)
    expect(corrected.history.slice(0, -1)).toEqual(tied.history)
    expect(
      op.eventIds.every(
        (id) => !getEffectiveVoteHistory(corrected).some((e) => e.id === id),
      ),
    ).toBe(true)
    expect(getBlockStatus(corrected)).toEqual(getBlockStatus(first))
    expect(getVoteBenchmark(corrected)).toBe(3)
    const execution = executeAtEndOfDay(corrected)
    expect(
      getCurrentState(execution)
        .players.find((p) => p.id === 'p2')!
        .effects.some((e) => e.type === 'dead'),
    ).toBe(true)
    expect(
      getCurrentState(execution)
        .players.find((p) => p.id === 'p3')!
        .effects.some((e) => e.type === 'dead'),
    ).toBe(false)
  })
  it.each([1, 4])(
    'corrects a replacing lead and re-records %i votes against the restored benchmark',
    (count) => {
      const first = vote(day()),
        changed = vote(first, 'p3', ['p1', 'p2', 'p3', 'p4'], 'p2'),
        restored = correct(changed)
      expect(getBlockStatus(restored)?.playerId).toBe('p2')
      expect(getVoteBenchmark(restored)).toBe(3)
      const ids = ['p1', 'p2', 'p3', 'p4'].slice(0, count),
        recorded = recordVoteOperation(
          restored,
          resolveVote(restored, 'p3', count, ids),
        )
      expect(getBlockStatus(recorded)?.playerId).toBe(count === 4 ? 'p3' : 'p2')
      expect(getVoteBenchmark(recorded)).toBe(count === 4 ? 4 : 3)
      expect(
        recorded.history.filter((e) => e.type === 'nomination'),
      ).toHaveLength(2)
    },
  )
  it('restores a dead voter exact effects, then spends a legitimate ghost vote only once', () => {
    let initial = day()
    const state = getCurrentState(initial)
    state.players[3] = addEffectTo(
      state.players[3],
      'dead',
      { cause: 'original' },
      'never',
    )
    const beforeEffects = structuredClone(state.players[3].effects),
      changed = vote(initial, 'p2', ['p1', 'p2', 'p4'])
    expect(
      getCurrentState(changed).players[3].effects.filter(
        (e) => e.type === 'used_dead_vote',
      ),
    ).toHaveLength(1)
    const restored = correct(changed)
    expect(getCurrentState(restored).players[3].effects).toStrictEqual(
      beforeEffects,
    )
    const repeated = recordVoteOperation(
      restored,
      resolveVote(restored, 'p2', 3, ['p1', 'p2', 'p4']),
    )
    expect(
      getCurrentState(repeated).players[3].effects.filter(
        (e) => e.type === 'used_dead_vote',
      ),
    ).toHaveLength(1)
    const another = nominate(repeated, 'p2', 'p3')
    expect(() =>
      recordVoteOperation(another, resolveVote(another, 'p3', 1, ['p4'])),
    ).toThrow()
  })
  it('preserves the original nomination, nominator use and nominee use through repeated correction', () => {
    const original = vote(day()),
      restored = correct(original),
      repeated = recordVoteOperation(
        restored,
        resolveVote(restored, 'p2', 2, ['p1', 'p2']),
      )
    expect(getNominatorsToday(repeated)).toEqual(new Set(['p1']))
    expect(getNomineesToday(repeated)).toEqual(new Set(['p2']))
    expect(repeated.history.filter((e) => e.type === 'nomination')).toEqual(
      original.history.filter((e) => e.type === 'nomination'),
    )
    expect(() =>
      correctLatestVote(
        repeated,
        getPendingVoteCorrection(restored)!.operationId,
      ),
    ).toThrow()
    const second = correct(repeated)
    expect(
      second.history.filter((e) => e.type === 'vote_corrected'),
    ).toHaveLength(2)
    expect(getVoteBenchmark(second)).toBe(0)
  })
  it('keeps Butler restrictions when re-recording individual votes', () => {
    const initial = day(),
      s = getCurrentState(initial)
    s.players[0] = addEffectTo(s.players[0], 'butler_master', {
      masterId: 'p2',
    })
    const recorded = vote(initial),
      restored = correct(recorded)
    expect(() =>
      recordVoteOperation(restored, resolveVote(restored, 'p2', 1, ['p1'])),
    ).toThrow()
    const repeated = recordVoteOperation(
      restored,
      resolveVote(restored, 'p2', 2, ['p1', 'p2']),
    )
    expect(repeated.history.at(-1)!.data.votedIds).toEqual(['p1', 'p2'])
  })
  it.each([
    'night_action',
    'nomination',
    'effect_added',
    'effect_corrected',
    'role_revealed',
    'day_started',
    'night_started',
    'execution',
    'game_ended',
  ] as const)('refuses after a later independent %s event', (type) => {
    const original = vote(day()),
      op = getEligibleVoteOperation(original)!,
      later = addHistoryEntry(original, { type, data: {}, message: [] })
    expect(getEligibleVoteOperation(later)).toBeNull()
    expect(() => correctLatestVote(later, op.operationId)).toThrow()
  })
  it('legacy votes remain readable/effective but never gain correction eligibility', () => {
    const nominated = nominate(day(), 'p1', 'p2'),
      legacy = resolveVote(nominated, 'p2', 3, ['p1', 'p2', 'p3'])
    expect(parseSavedGames(serializeGames([legacy]))).toHaveLength(1)
    expect(getBlockStatus(legacy)?.playerId).toBe('p2')
    expect(getEligibleVoteOperation(legacy)).toBeNull()
  })
  it.each([
    'missingPart',
    'missingFirst',
    'wrongPart',
    'wrongOperation',
    'wrongIds',
    'wrongNomination',
    'wrongPredecessor',
    'wrongVersion',
    'wrongTally',
    'wrongNominee',
    'wrongFlags',
    'wrongState',
    'wrongGhost',
    'newDay',
    'extraMember',
    'duplicateIds',
  ])('rejects inconsistent tie metadata: %s', (kind) => {
    let changed = structuredClone(
      vote(vote(day()), 'p3', ['p2', 'p3', 'p4'], 'p2'),
    )
    const first = changed.history.at(-2)!,
      last = changed.history.at(-1)!,
      m = last.data.voteOperation as Record<string, unknown>
    switch (kind) {
      case 'missingPart':
        changed.history.pop()
        break
      case 'missingFirst':
        changed.history.splice(-2, 1)
        break
      case 'wrongPart':
        m.partIndex = 0
        break
      case 'wrongOperation':
        m.operationId = 'other'
        break
      case 'wrongIds':
        m.eventIds = ['other']
        break
      case 'wrongNomination':
        m.nominationEventId = 'other'
        break
      case 'wrongPredecessor':
        m.previousEventId = 'other'
        break
      case 'wrongVersion':
        m.version = 2
        break
      case 'wrongTally':
        first.data.voteCount = 2
        break
      case 'wrongNominee':
        last.data.nomineeId = 'p5'
        break
      case 'wrongFlags':
        last.data.clearsBlock = false
        break
      case 'wrongState':
        last.stateAfter.players[1].name = 'Changed'
        break
      case 'wrongGhost':
        first.stateAfter.players[0].effects.push({
          id: 'fake',
          type: 'used_dead_vote',
        })
        break
      case 'newDay':
        last.stateAfter.round++
        break
      case 'extraMember':
        ;(m.eventIds as string[]).push('extra')
        break
      case 'duplicateIds':
        last.id = first.id
        break
    }
    expect(getEligibleVoteOperation(changed)).toBeNull()
    expect(isSavedGame(changed)).toBe(false)
  })
  it.each([
    'wrongRefs',
    'wrongState',
    'unknownVersion',
    'double',
    'unrelatedTarget',
  ])('rejects forged correction: %s', (kind) => {
    const changed = correct(vote(day())),
      last = changed.history.at(-1)!
    switch (kind) {
      case 'wrongRefs':
        last.data.eventIds = ['other']
        break
      case 'wrongState':
        last.stateAfter.players[0].name = 'Other'
        break
      case 'unknownVersion':
        last.data.version = 2
        break
      case 'double':
        changed.history.push({
          ...structuredClone(last),
          id: 'second-correction',
        })
        break
      case 'unrelatedTarget':
        last.data.operationId = 'other'
        break
    }
    expect(isSavedGame(changed)).toBe(false)
    expect(() => getEffectiveVoteHistory(changed)).toThrow()
    expect(projectPublicGameState(changed).voting).toBeNull()
  })
  it('public projection and saved reloads ignore cancelled tallies without exposing metadata', () => {
    const first = vote(day()),
      restored = correct(vote(first, 'p3', ['p1', 'p2', 'p3', 'p4'], 'p2')),
      loaded = parseSavedGames(serializeGames([restored]))[0]
    expect(getBlockStatus(loaded)).toEqual(getBlockStatus(first))
    expect(getVoteBenchmark(loaded)).toBe(3)
    expect(projectPublicGameState(loaded).voting).toEqual(
      projectPublicGameState(first).voting,
    )
    expect(JSON.stringify(projectPublicGameState(loaded))).not.toMatch(
      /voteOperation|vote_corrected|eventIds|votedIds/,
    )
    expect(getCurrentState(startNight(loaded)).phase).toBe('night')
  })
  it('a cancelled winning vote does not cause execution at day end', () => {
    const restored = correct(vote(day()))
    expect(executeAtEndOfDay(restored)).toBe(restored)
  })
  it('backs up and restores both raw vote records and their cancellation, preserving preferences', () => {
    const corrected = correct(vote(vote(day()), 'p3', ['p2', 'p3', 'p4'], 'p2'))
    saveGame(corrected)
    const raw = createGameBackup()
    values.delete('grimoire_games')
    restoreGameBackup(previewGameBackup(raw), {})
    const loaded = getAllGames()[0]
    expect(loaded).toEqual(JSON.parse(JSON.stringify(corrected)))
    expect(getBlockStatus(loaded)?.playerId).toBe('p2')
    expect(getVoteBenchmark(loaded)).toBe(3)
    expect(values.get('grimoire_language')).toBe('es')
    expect(values.get('grimoire_current_game')).toBe('selected')
  })
  it('refuses a stale expected operation and duplicate correction', () => {
    const first = vote(day()),
      op = getEligibleVoteOperation(first)!,
      next = vote(first, 'p3', ['p2'], 'p2')
    expect(() => correctLatestVote(next, op.operationId)).toThrow()
    expect(() => correctLatestVote(correct(first), op.operationId)).toThrow()
  })
  it('save failure preserves every prior byte and stale storage cannot be overwritten', () => {
    const changed = vote(day())
    saveGame(changed)
    const corrected = correct(changed),
      before = new Map(values)
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new DOMException('Quota', 'QuotaExceededError')
    })
    expect(() => saveGameIfUnchanged(corrected, changed)).toThrow()
    expect(values).toEqual(before)
    values.set(
      'grimoire_games',
      serializeGames([
        addHistoryEntry(changed, {
          type: 'night_action',
          data: {},
          message: [],
        }),
      ]),
    )
    expect(() => saveGameIfUnchanged(corrected, changed)).toThrow()
  })
})
