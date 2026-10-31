import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeGameWithHistory, makeStandardPlayers } from './helpers'
import {
  addEffectToPlayer,
  removeEffectFromPlayer,
  updateEffectData,
  addHistoryEntry,
  startNight,
  resolveVote,
  getBlockStatus,
} from '../game'
import { getCurrentState, type Game } from '../types'
import {
  recordManualEffectEdit,
  getEligibleEffectEdit,
  correctLatestEffectEdit,
  type ManualEffectOperation,
} from '../manualEffectCorrection'
import { saveGame, saveGameIfUnchanged, getAllGames } from '../storage'
import {
  createGameBackup,
  previewGameBackup,
  restoreGameBackup,
} from '../gameBackup'
import { parseSavedGames, serializeGames } from '../saveFormat'
import { projectPublicGameState } from '../publicGameState'

function fixture() {
  const players = makeStandardPlayers()
  players[0].effects = [
    {
      id: 'original-poison',
      type: 'poisoned',
      data: { nested: { targets: ['p3', 'p4'] }, chosen: 'p2' },
      sourcePlayerId: 'p5',
      expiresAt: 'end_of_day',
    },
    {
      id: 'other-poison',
      type: 'poisoned',
      data: { reason: 'second instance' },
      sourcePlayerId: 'p2',
      expiresAt: 'end_of_night',
    },
  ]
  players[1].effects = [
    {
      id: 'unrelated-safe',
      type: 'safe',
      data: { by: 'p1' },
      sourcePlayerId: 'p1',
      expiresAt: 'never',
    },
  ]
  return makeGameWithHistory(
    [
      { type: 'game_created' },
      { type: 'day_started', stateOverrides: { phase: 'day', round: 2 } },
    ],
    { phase: 'setup', round: 0, winner: null, players },
  )
}
function edit(game: Game, operation: ManualEffectOperation) {
  return recordManualEffectEdit(
    game,
    operation === 'add'
      ? addEffectToPlayer(game, 'p1', 'drunk', { exact: ['a', 'b'] })
      : operation === 'remove'
        ? removeEffectFromPlayer(game, 'p1', 'poisoned')
        : updateEffectData(game, 'p1', 'poisoned', {
            chosen: 'p3',
            added: { deep: true },
          }),
    operation,
  )
}
let values: Map<string, string>
beforeEach(() => {
  values = new Map([
    ['grimoire_language', 'pt-BR'],
    ['grimoire_current_game', 'selected'],
  ])
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value)
    }),
    removeItem: vi.fn((key: string) => {
      values.delete(key)
    }),
  })
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('latest explicit manual effect correction', () => {
  it('preserves previous votes and block status when correcting only a subsequent effect edit', () => {
    const voted = resolveVote(fixture(), 'p2', 3)
    const changed = edit(voted, 'add'),
      corrected = correctLatestEffectEdit(changed, changed.history.at(-1)!.id)
    expect(corrected.history.slice(0, voted.history.length)).toEqual(
      voted.history,
    )
    expect(getBlockStatus(corrected)).toEqual(getBlockStatus(voted))
    expect(getCurrentState(corrected)).toStrictEqual(getCurrentState(voted))
  })

  it('preserves optional undefined fields in the live previous snapshot without mutating it', () => {
    const original = fixture()
    original.history.at(-1)!.stateAfter.players[1].effects.push({
      id: 'optional-fields',
      type: 'drunk',
      data: undefined,
      sourcePlayerId: undefined,
    })
    const changed = edit(original, 'add'),
      corrected = correctLatestEffectEdit(changed, changed.history.at(-1)!.id)
    expect(getCurrentState(corrected)).toStrictEqual(getCurrentState(original))
  })

  it.each(['add', 'remove', 'update'] as const)(
    'corrects %s with exact previous state and append-only history',
    (operation) => {
      const original = fixture(),
        before = structuredClone(original),
        changed = edit(original, operation),
        audit = structuredClone(changed.history)
      const target = getEligibleEffectEdit(changed)!
      expect(target.operation).toBe(operation)
      const corrected = correctLatestEffectEdit(changed, target.eventId)
      expect(original).toEqual(before)
      expect(changed.history).toEqual(audit)
      expect(corrected.history.slice(0, -1)).toEqual(audit)
      expect(getCurrentState(corrected)).toEqual(getCurrentState(original))
      expect(corrected.history.at(-1)).toMatchObject({
        type: 'effect_corrected',
        data: {
          originalEventId: target.eventId,
          playerId: 'p1',
          effectType: operation === 'add' ? 'drunk' : 'poisoned',
          operation,
        },
      })
      expect(corrected.history.at(-1)!.message).toHaveLength(1)
      expect(getEligibleEffectEdit(corrected)).toBeNull()
      expect(() => correctLatestEffectEdit(corrected, target.eventId)).toThrow()
      expect(getCurrentState(corrected).players[1]).toEqual(
        getCurrentState(original).players[1],
      )
    },
  )
  it('restores every removed instance, original IDs, nested data, expiration, source and order', () => {
    const original = fixture(),
      changed = edit(original, 'remove'),
      corrected = correctLatestEffectEdit(changed, changed.history.at(-1)!.id)
    expect(getCurrentState(corrected).players[0].effects).toEqual(
      getCurrentState(original).players[0].effects,
    )
    expect(
      getCurrentState(corrected).players[0].effects.map((e) => e.id),
    ).toEqual(['original-poison', 'other-poison'])
  })
  it('restores collateral source cleanup caused by a manual dead effect, without rerunning cleanup', () => {
    const original = fixture(),
      changed = recordManualEffectEdit(
        original,
        addEffectToPlayer(original, 'p1', 'dead'),
        'add',
      )
    expect(getCurrentState(changed).players[1].effects).toEqual([])
    const corrected = correctLatestEffectEdit(
      changed,
      changed.history.at(-1)!.id,
    )
    expect(getCurrentState(corrected)).toEqual(getCurrentState(original))
    expect(projectPublicGameState(corrected).players[0].alive).toBe(true)
  })
  it.each([
    'night_action',
    'role_revealed',
    'vote',
    'nomination',
    'night_started',
    'day_started',
    'starting_info',
    'effect_added',
    'game_ended',
  ] as const)('refuses to cross a later %s event', (type) => {
    const changed = edit(fixture(), 'add'),
      later = addHistoryEntry(changed, { type, message: [], data: {} })
    expect(getEligibleEffectEdit(later)).toBeNull()
    expect(() =>
      correctLatestEffectEdit(later, changed.history.at(-1)!.id),
    ).toThrow()
  })
  it('only corrects the newest manual edit, never an earlier eligible event', () => {
    const first = edit(fixture(), 'add'),
      second = edit(first, 'remove')
    expect(() =>
      correctLatestEffectEdit(second, first.history.at(-1)!.id),
    ).toThrow()
    expect(
      getCurrentState(
        correctLatestEffectEdit(second, second.history.at(-1)!.id),
      ),
    ).toEqual(getCurrentState(first))
  })
  it('permits a new adjustment after a correction without making the original correctable again', () => {
    const first = edit(fixture(), 'add'),
      corrected = correctLatestEffectEdit(first, first.history.at(-1)!.id),
      next = edit(corrected, 'update')
    const result = correctLatestEffectEdit(next, next.history.at(-1)!.id)
    expect(result.history.slice(0, corrected.history.length)).toEqual(
      corrected.history,
    )
    expect(getCurrentState(result)).toEqual(getCurrentState(corrected))
  })
  it.each(['add', 'remove', 'update'] as const)(
    'refuses legacy narrator %s records without metadata',
    (operation) => {
      const original = fixture(),
        legacy =
          operation === 'add'
            ? addEffectToPlayer(original, 'p1', 'drunk')
            : operation === 'remove'
              ? removeEffectFromPlayer(original, 'p1', 'poisoned')
              : updateEffectData(original, 'p1', 'poisoned', { chosen: 'p3' })
      expect(legacy.history.at(-1)!.data.source).toBe('narrator')
      expect(getEligibleEffectEdit(legacy)).toBeNull()
    },
  )
  it.each([
    'unknownVersion',
    'wrongAnchor',
    'wrongOperation',
    'arrayOperation',
    'automatic',
    'wrongEvent',
    'changedTarget',
    'changedOtherPlayer',
    'changedPhase',
    'invalidPrevious',
    'duplicateHistory',
    'missingMetadata',
  ])('rejects ambiguous metadata/state: %s', (corruption) => {
    const changed = structuredClone(edit(fixture(), 'add')),
      last = changed.history.at(-1)!,
      metadata = last.data.manualEffectEdit as Record<string, unknown>
    switch (corruption) {
      case 'unknownVersion':
        metadata.version = 2
        break
      case 'wrongAnchor':
        metadata.previousEventId = 'other'
        break
      case 'wrongOperation':
        metadata.operation = 'vote'
        break
      case 'arrayOperation':
        metadata.operation = ['add']
        break
      case 'automatic':
        last.data.source = 'pipeline'
        break
      case 'wrongEvent':
        last.type = 'night_action'
        break
      case 'changedTarget':
        last.stateAfter.players[0].effects.at(-1)!.data = { different: true }
        break
      case 'changedOtherPlayer':
        last.stateAfter.players[1].name = 'Other'
        break
      case 'changedPhase':
        last.stateAfter.round++
        break
      case 'invalidPrevious':
        changed.history.at(-2)!.stateAfter.round = -1
        break
      case 'duplicateHistory':
        last.id = changed.history[0].id
        break
      case 'missingMetadata':
        delete last.data.manualEffectEdit
        break
    }
    expect(getEligibleEffectEdit(changed)).toBeNull()
    expect(() => correctLatestEffectEdit(changed, last.id)).toThrow()
  })
  it('does not turn no-op removal or configuration updates into correction targets', () => {
    const game = fixture()
    expect(
      getEligibleEffectEdit(
        recordManualEffectEdit(
          game,
          removeEffectFromPlayer(game, 'p1', 'drunk'),
          'remove',
        ),
      ),
    ).toBeNull()
    expect(
      getEligibleEffectEdit(
        recordManualEffectEdit(
          game,
          updateEffectData(game, 'p1', 'poisoned', {}),
          'update',
        ),
      ),
    ).toBeNull()
  })
  it('detects unrecorded snapshot rewrites rather than restoring over unrelated work', () => {
    const changed = edit(fixture(), 'add'),
      mutated = structuredClone(changed)
    mutated.history
      .at(-1)!
      .stateAfter.players[1].effects.push({ id: 'later-effect', type: 'drunk' })
    expect(getEligibleEffectEdit(mutated)).toBeNull()
  })
  it('survives saved reloads and continues from the exact restored state', () => {
    const original = fixture(),
      changed = edit(original, 'update'),
      corrected = correctLatestEffectEdit(changed, changed.history.at(-1)!.id)
    const loaded = parseSavedGames(serializeGames([corrected]))[0]
    expect(loaded).toEqual(JSON.parse(JSON.stringify(corrected)))
    expect(getCurrentState(startNight(loaded))).toEqual(
      getCurrentState(startNight(original)),
    )
  })
  it('imports pre-Task012 backups and preserves correction history in new backup round trips', () => {
    const original = fixture()
    const old = JSON.stringify({
      format: 'grimorium-backup',
      version: 1,
      exportedAt: Date.now(),
      games: [original],
    })
    restoreGameBackup(previewGameBackup(old), {})
    expect(getAllGames()).toEqual([original])
    const changed = edit(original, 'remove'),
      corrected = correctLatestEffectEdit(changed, changed.history.at(-1)!.id)
    saveGame(changed)
    saveGameIfUnchanged(corrected, changed)
    const raw = createGameBackup()
    values.delete('grimoire_games')
    restoreGameBackup(previewGameBackup(raw), {})
    expect(getAllGames()).toEqual([corrected])
    expect(getAllGames()[0].history.at(-1)!.type).toBe('effect_corrected')
  })
  it('preserves original raw data on save failure and never writes selection or language', () => {
    const changed = edit(fixture(), 'remove')
    saveGame(changed)
    const before = new Map(values)
    const corrected = correctLatestEffectEdit(
      changed,
      changed.history.at(-1)!.id,
    )
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new DOMException('Quota', 'QuotaExceededError')
    })
    expect(() => saveGameIfUnchanged(corrected, changed)).toThrow()
    expect(values).toEqual(before)
    expect(getCurrentState(changed).players[0].effects).toEqual([])
  })
  it('rejects stale storage and duplicate saves of the same correction', () => {
    const changed = edit(fixture(), 'update')
    saveGame(changed)
    const corrected = correctLatestEffectEdit(
      changed,
      changed.history.at(-1)!.id,
    )
    saveGameIfUnchanged(corrected, changed)
    const before = new Map(values)
    expect(() => saveGameIfUnchanged(corrected, changed)).toThrow()
    expect(values).toEqual(before)
  })
  it('keeps private effect metadata and correction controls out of public projections', () => {
    const original = fixture(),
      changed = edit(original, 'add'),
      corrected = correctLatestEffectEdit(changed, changed.history.at(-1)!.id)
    expect(projectPublicGameState(corrected)).toEqual(
      projectPublicGameState(original),
    )
    const projection = JSON.stringify(projectPublicGameState(corrected))
    for (const secret of [
      'manualEffectEdit',
      'beforeEffects',
      'afterEffects',
      'originalEventId',
      'poisoned',
      'effect_corrected',
    ])
      expect(projection).not.toContain(secret)
  })
})
