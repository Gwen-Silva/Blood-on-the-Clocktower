import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import {
  projectPublicGameState,
  PublicProjectionError,
  type PublicGameState,
} from '../publicGameState'
import * as engine from '../game'
import { getCurrentState, type Game } from '../types'
import { addEffectTo } from './helpers'
import { serializeGames, parseSavedGames } from '../saveFormat'
import { toPublicDeaths } from '../publicDeath'

afterEach(() => vi.restoreAllMocks())
function setup() {
  return engine.createGame('PRIVATE GAME NAME', 'trouble-brewing', [
    { id: 'a', name: 'Alex', roleId: 'chef' },
    { id: 'b', name: 'Alex', roleId: 'imp' },
    { id: 'c', name: 'Bea', roleId: 'monk' },
    { id: 'd', name: 'Chris', roleId: 'soldier' },
    { id: 'e', name: 'Dana', roleId: 'poisoner' },
  ])
}
function day() {
  return engine.startDay(engine.startNight(setup()))
}
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze)
    Object.freeze(value)
  }
  return value
}
const secret = [
  'SECRET_ROLE',
  'SECRET_TEAM',
  'SECRET_POISON',
  'SECRET_DRUNK',
  'SECRET_PROTECTION',
  'SECRET_SOURCE',
  'SECRET_TARGET',
  'SECRET_RESULT',
  'SECRET_CHOICES',
  'SECRET_RICH_TEXT',
  'SECRET_RICH_PARAM',
  'SECRET_SNAPSHOT',
  'SECRET_NESTED',
  'SECRET_BLUFF',
]
function hostile(): Game {
  const game = day()
  const state = getCurrentState(game)
  const players = state.players.map((player, index) => ({
    ...player,
    roleId: secret[0] + index,
    team: secret[1],
    effects: [
      {
        id: secret[2],
        type: 'poisoned',
        sourcePlayerId: secret[5],
        data: { targetId: secret[6], secret: secret[2] },
      },
      { id: secret[3], type: 'drunk', data: { actualRole: secret[3] } },
      { id: secret[4], type: 'safe', data: { nested: { value: secret[12] } } },
    ],
    arbitrary: { secret: secret[12] },
  }))
  const updated = engine.addHistoryEntry(
    game,
    {
      type: 'night_action',
      message: [
        { type: 'text', content: secret[9] },
        { type: 'i18n', key: 'history.secret', params: { result: secret[10] } },
        { type: 'role', roleId: secret[0] },
        { type: 'effect', effectType: secret[2] },
      ],
      data: {
        playerId: 'a',
        targetId: secret[6],
        result: secret[7],
        choices: secret[8],
        bluffs: [secret[13]],
        nested: { secret: secret[12] },
      },
    },
    { players },
  )
  Object.assign(updated, { privateMetadata: secret[12] })
  Object.assign(getCurrentState(updated), { privateState: secret[11] })
  return updated
}

describe('strict runtime public allowlist', () => {
  it('has exact root/player keys and only public primitives from hostile fixtures', () => {
    const game = hostile()
    const dto = projectPublicGameState(game)
    expect(Object.keys(dto).sort()).toEqual(
      [
        'id',
        'scriptId',
        'phase',
        'round',
        'players',
        'voting',
        'winner',
      ].sort(),
    )
    for (const player of dto.players)
      expect(Object.keys(player).sort()).toEqual(
        ['id', 'name', 'seat', 'alive'].sort(),
      )
    expect(Object.keys(dto.voting!).sort()).toEqual(
      ['threshold', 'benchmark', 'block'].sort(),
    )
    const serialized = JSON.stringify(dto)
    for (const marker of secret) expect(serialized).not.toContain(marker)
    for (const forbidden of [
      'roleId',
      'effects',
      'sourcePlayerId',
      'history',
      'stateAfter',
      'votedIds',
      'targetId',
      'privateMetadata',
      'PRIVATE GAME NAME',
      'createdAt',
      'role_revealed',
      'night_action',
    ])
      expect(serialized).not.toContain(forbidden)
    expectTypeOf<keyof PublicGameState>().toEqualTypeOf<
      'id' | 'scriptId' | 'phase' | 'round' | 'players' | 'voting' | 'winner'
    >()
  })
  it('preserves clockwise IDs and duplicate names as independent numbered seats', () => {
    const dto = projectPublicGameState(setup())
    expect(dto.players).toEqual([
      { id: 'a', name: 'Alex', seat: 1, alive: true },
      { id: 'b', name: 'Alex', seat: 2, alive: true },
      { id: 'c', name: 'Bea', seat: 3, alive: true },
      { id: 'd', name: 'Chris', seat: 4, alive: true },
      { id: 'e', name: 'Dana', seat: 5, alive: true },
    ])
  })
  it('keeps dead players seated without leaking effects or role-specific vote restrictions', () => {
    let game = day()
    const state = getCurrentState(game)
    game = engine.addHistoryEntry(
      game,
      { type: 'effect_added', message: [], data: {} },
      {
        players: state.players.map((p) =>
          p.id === 'c'
            ? addEffectTo(addEffectTo(p, 'used_dead_vote'), 'dead')
            : p,
        ),
      },
    )
    const dto = projectPublicGameState(game)
    expect(dto.players[2]).toEqual({
      id: 'c',
      name: 'Bea',
      seat: 3,
      alive: false,
    })
    expect(dto.players).toHaveLength(5)
    expect(dto.voting!.threshold).toBe(2)
    expect(JSON.stringify(dto)).not.toMatch(
      /used_dead_vote|canVote|butler|master|effects/,
    )
  })
  it('fresh output never retains private arrays, nested snapshots or references', () => {
    const game = freeze(hostile())
    const before = JSON.stringify(game)
    const dto = projectPublicGameState(game)
    const other = projectPublicGameState(game)
    expect(dto).toEqual(other)
    expect(dto).not.toBe(other)
    expect(dto.players).not.toBe(other.players)
    expect(dto.players).not.toBe(getCurrentState(game).players)
    dto.players[0].name = 'Changed in public copy'
    dto.players.reverse()
    expect(JSON.stringify(game)).toBe(before)
    expect(projectPublicGameState(game)).toEqual(other)
  })
  it('does not consume timers, randomness or browser storage during projection', () => {
    const game = day()
    const random = vi.spyOn(Math, 'random').mockImplementation(() => {
      throw new Error('Randomness forbidden')
    })
    const timeout = vi
      .spyOn(globalThis, 'setTimeout')
      .mockImplementation(() => {
        throw new Error('Timer forbidden')
      })
    const storage = {
      getItem: vi.fn(() => {
        throw new Error('Storage forbidden')
      }),
      setItem: vi.fn(() => {
        throw new Error('Storage forbidden')
      }),
    }
    vi.stubGlobal('localStorage', storage)
    try {
      expect(() => projectPublicGameState(game)).not.toThrow()
      expect(random).not.toHaveBeenCalled()
      expect(timeout).not.toHaveBeenCalled()
      expect(storage.getItem).not.toHaveBeenCalled()
      expect(storage.setItem).not.toHaveBeenCalled()
    } finally {
      vi.unstubAllGlobals()
    }
  })
  it('projects canonical JSON-restored saved games identically', () => {
    const game = engine.resolveVote(day(), 'a', 3)
    expect(
      projectPublicGameState(parseSavedGames(serializeGames([game]))[0]),
    ).toEqual(projectPublicGameState(game))
  })
  it('later private role/effect/result changes cannot introduce new output fields or secrets', () => {
    const before = engine.startNight(setup())
    const privateState = getCurrentState(hostile())
    const after = engine.addHistoryEntry(
      before,
      {
        type: 'night_action',
        message: [{ type: 'text', content: secret[9] }],
        data: { roleId: secret[0], target: secret[6] },
      },
      { players: privateState.players },
    )
    expect(projectPublicGameState(after)).toEqual(
      projectPublicGameState(before),
    )
  })
})

describe('public phase, life and winner semantics', () => {
  it.each(['setup', 'night', 'day', 'ended'] as const)(
    'keeps %s and its canonical round distinct',
    (phase) => {
      const game =
        phase === 'setup'
          ? setup()
          : phase === 'night'
            ? engine.startNight(setup())
            : phase === 'day'
              ? day()
              : engine.endGame(day(), 'townsfolk')
      const dto = projectPublicGameState(game)
      expect(dto.phase).toBe(phase)
      expect(dto.round).toBe(getCurrentState(game).round)
      if (phase !== 'day') expect(dto.voting).toBeNull()
    },
  )
  it('does not announce private Night deaths before dawn', () => {
    const night = engine.startNight(setup())
    const state = getCurrentState(night)
    const killed = engine.addHistoryEntry(
      night,
      { type: 'night_action', message: [], data: { targetId: 'a' } },
      {
        players: state.players.map((p) =>
          p.id === 'a' ? addEffectTo(p, 'dead') : p,
        ),
      },
    )
    expect(projectPublicGameState(killed).players[0].alive).toBe(true)
    expect(
      projectPublicGameState(engine.startDay(killed)).players[0].alive,
    ).toBe(false)
  })
  it('does not disclose private Night resurrection, removal of dead effect or role change', () => {
    const base = day()
    const state = getCurrentState(base)
    const dead = engine.addHistoryEntry(
      base,
      { type: 'effect_added', message: [], data: {} },
      {
        players: state.players.map((p) =>
          p.id === 'a' ? addEffectTo(p, 'dead') : p,
        ),
      },
    )
    const night = engine.startNight(dead)
    const changed = engine.addHistoryEntry(
      night,
      { type: 'role_changed', message: [], data: { roleId: secret[0] } },
      {
        players: getCurrentState(night).players.map((p) =>
          p.id === 'a' ? { ...p, roleId: secret[0], effects: [] } : p,
        ),
      },
    )
    expect(projectPublicGameState(changed).players[0].alive).toBe(false)
  })
  it('missing or malformed Night boundary reports unknown life instead of guessing', () => {
    const game = setup()
    getCurrentState(game).phase = 'night'
    getCurrentState(game).round = 2
    expect(
      projectPublicGameState(game).players.every((p) => p.alive === null),
    ).toBe(true)
  })
  it.each(['townsfolk', 'demon'] as const)(
    'normalizes ended %s winner only after game end',
    (winner) => {
      const game = day()
      getCurrentState(game).winner = winner
      expect(projectPublicGameState(game).winner).toBeNull()
      expect(projectPublicGameState(engine.endGame(game, winner)).winner).toBe(
        winner === 'townsfolk' ? 'good' : 'evil',
      )
    },
  )
  it('unknown winner and script identifiers are not copied as arbitrary strings or objects', () => {
    const game = engine.endGame(day(), 'townsfolk')
    game.scriptId = secret[0]
    Object.assign(getCurrentState(game), { winner: { secret: secret[1] } })
    const dto = projectPublicGameState(game)
    expect(dto.scriptId).toBeNull()
    expect(dto.winner).toBeNull()
    expect(JSON.stringify(dto)).not.toContain('SECRET')
  })
})

describe('canonical public voting with conservative validation', () => {
  it('reports no block/zero benchmark and canonical threshold on a fresh Day', () => {
    const game = day()
    expect(projectPublicGameState(game).voting).toEqual({
      threshold: engine.getVoteThreshold(getCurrentState(game)),
      benchmark: 0,
      block: null,
    })
  })
  it('projects only public block ID/tally, excluding names and private helper extras', () => {
    const game = engine.resolveVote(day(), 'a', 3)
    const dto = projectPublicGameState(game)
    expect(dto.voting).toEqual({
      threshold: 3,
      benchmark: 3,
      block: { playerId: 'a', voteCount: 3 },
    })
    expect(Object.keys(dto.voting!.block!).sort()).toEqual([
      'playerId',
      'voteCount',
    ])
  })
  it('tie bookkeeping clears the block while retaining its benchmark; a later tally must beat it', () => {
    let game = engine.resolveVote(day(), 'a', 3)
    game = engine.resolveVote(game, 'c', 3)
    expect(projectPublicGameState(game).voting).toEqual({
      threshold: 3,
      benchmark: 3,
      block: null,
    })
    game = engine.resolveVote(game, 'd', 2)
    expect(projectPublicGameState(game).voting!.block).toBeNull()
    game = engine.resolveVote(game, 'e', 4)
    expect(projectPublicGameState(game).voting!.block).toEqual({
      playerId: 'e',
      voteCount: 4,
    })
    expect(projectPublicGameState(game).voting!.benchmark).toBe(
      engine.getVoteBenchmark(game),
    )
  })
  it('copies neither raw helper block fields nor voted IDs', () => {
    const game = engine.resolveVote(day(), 'a', 3, ['b', 'd', 'e'])
    const original = engine.getBlockStatus(game)!
    vi.spyOn(engine, 'getBlockStatus').mockReturnValue(
      Object.assign(original, { secret: secret[12], effects: [secret[2]] }),
    )
    expect(projectPublicGameState(game).voting!.block).toEqual({
      playerId: 'a',
      voteCount: 3,
    })
    expect(JSON.stringify(projectPublicGameState(game))).not.toMatch(
      /SECRET|votedIds|effects|playerName/,
    )
  })
  it('a new Day resets voting rather than exposing yesterday’s block', () => {
    const game = engine.startDay(
      engine.startNight(engine.resolveVote(day(), 'a', 4)),
    )
    expect(projectPublicGameState(game).voting).toEqual({
      threshold: 3,
      benchmark: 0,
      block: null,
    })
  })
  it.each([
    { voteCount: NaN },
    { voteCount: -1 },
    { voteCount: 999 },
    { nomineeId: 'absent' },
    { nomineeId: { secret: secret[0] } },
    { threshold: 'secret' },
    { threshold: 1 },
    { meetsThreshold: 'yes' },
    { replacesBlock: true, clearsBlock: true },
  ])(
    'incomplete/corrupt vote data %j yields no official public voting result',
    (invalid) => {
      const game = engine.resolveVote(day(), 'a', 3)
      Object.assign(game.history.at(-1)!.data, invalid)
      expect(projectPublicGameState(game).voting).toBeNull()
    },
  )
  it('legacy incomplete votes and malformed history entries never fabricate a result', () => {
    const game = engine.addHistoryEntry(day(), {
      type: 'vote',
      message: [],
      data: { nomineeId: 'a', voteCount: 3 },
    })
    expect(projectPublicGameState(game).voting).toBeNull()
    const malformed = day()
    malformed.history.splice(1, 0, null as never)
    expect(projectPublicGameState(malformed).voting).toBeNull()
  })
})

describe('empty/invalid states and deferred public fields', () => {
  it('empty history has conservative setup defaults and no voting', () => {
    const game = setup()
    game.history = []
    expect(projectPublicGameState(game)).toEqual({
      id: game.id,
      scriptId: 'trouble-brewing',
      phase: 'setup',
      round: 0,
      players: [],
      voting: null,
      winner: null,
    })
  })
  it.each([
    { phase: 'SECRET_PHASE' },
    { phase: { secret: secret[0] } },
    { round: NaN },
    { round: -1 },
    { players: null },
    {
      players: [
        { id: 'same', name: 'Alex', effects: [] },
        { id: 'same', name: 'Alex', effects: [] },
      ],
    },
  ])(
    'invalid foundational state %j fails closed without exposing it',
    (invalid) => {
      const game = day()
      Object.assign(getCurrentState(game), invalid)
      expect(() => projectPublicGameState(game)).toThrow(PublicProjectionError)
      expect(() => projectPublicGameState(game)).toThrow(
        'Cannot project public game state',
      )
    },
  )
  it('a missing latest snapshot is not treated as a new empty setup', () => {
    const game = day()
    game.history.push(null as never)
    expect(() => projectPublicGameState(game)).toThrow(PublicProjectionError)
  })
  it('corrupt effect records yield unknown life and no voting, never raw effect data', () => {
    const game = day()
    Object.assign(getCurrentState(game).players[0], {
      effects: { secret: secret[2] },
    })
    const dto = projectPublicGameState(game)
    expect(dto.players[0].alive).toBeNull()
    expect(dto.voting).toBeNull()
    expect(JSON.stringify(dto)).not.toContain('SECRET')
  })
  it('unknown private events and optional data are omitted by default', () => {
    const game = day()
    const unknown = engine.addHistoryEntry(game, {
      type: 'night_action',
      message: [],
      data: { secret: secret[0] },
    })
    Object.assign(unknown.history.at(-1)!, { type: 'NEW_SECRET_EVENT' })
    expect(projectPublicGameState(unknown)).toEqual(
      projectPublicGameState(game),
    )
  })
  it('nomination and ghost-vote details remain explicitly deferred, while death DTO stays strict', () => {
    const game = day()
    const dto = projectPublicGameState(game)
    expect(JSON.stringify(dto)).not.toMatch(
      /hasNominated|hasBeenNominated|deadVote|ghost|canVote/,
    )
    const death = toPublicDeaths(getCurrentState(game).players, ['a'])
    expect(death).toEqual([{ playerId: 'a', playerName: 'Alex' }])
    expect(Object.keys(death[0]).sort()).toEqual(['playerId', 'playerName'])
  })
})
