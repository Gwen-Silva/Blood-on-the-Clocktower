import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeGameWithHistory, makeStandardPlayers } from './helpers'
import {
  createGameBackup,
  previewGameBackup,
  restoreGameBackup,
} from '../gameBackup'
import { getAllGames, saveGame } from '../storage'
import { parseSavedGames } from '../saveFormat'
import { getCurrentState } from '../types'
import { startNight } from '../game'

const key = 'grimoire_games'
let values: Map<string, string>
function fixture() {
  const players = makeStandardPlayers()
  players[0].effects.push({
    id: 'effect-stable',
    type: 'poisoned',
    sourcePlayerId: players[4].id,
    data: { nested: { original: true } },
    expiresAt: 'end_of_day',
  })
  const game = makeGameWithHistory(
    [
      { type: 'game_created' },
      { type: 'day_started', stateOverrides: { phase: 'day', round: 3 } },
      {
        type: 'vote',
        data: {
          voterId: players[0].id,
          targetId: players[1].id,
          votes: [players[2].id],
        },
      },
    ],
    { phase: 'setup', round: 0, winner: null, players },
  )
  game.name = 'Weekend'
  return game
}
beforeEach(() => {
  values = new Map([
    ['grimoire_language', 'es'],
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
function roundTrip() {
  const game = fixture()
  saveGame(game)
  const raw = createGameBackup()
  values.delete(key)
  return { game, raw }
}
describe('Task 016 backup transaction', () => {
  it('exports every snapshot, character, effect and internal identifier without writing', () => {
    const game = fixture()
    values.set(key, JSON.stringify([game]))
    const before = new Map(values)
    expect(JSON.parse(createGameBackup()).games).toEqual([game])
    expect(values).toEqual(before)
    expect(localStorage.setItem).not.toHaveBeenCalled()
  })
  it('restores in an empty browser and continues exactly from the last committed state', () => {
    const { game, raw } = roundTrip()
    const preview = previewGameBackup(raw)
    restoreGameBackup(preview, {})
    expect(getAllGames()).toEqual([game])
    expect(getCurrentState(getAllGames()[0])).toEqual(getCurrentState(game))
    expect(getCurrentState(startNight(getAllGames()[0]))).toEqual(
      getCurrentState(startNight(game)),
    )
    expect(values.get('grimoire_current_game')).toBe('selected')
    expect(values.get('grimoire_language')).toBe('es')
  })
  it('imports multiple games in one write and retains unrelated existing games', () => {
    const games = [fixture(), fixture(), fixture()]
    games.forEach(saveGame)
    const raw = createGameBackup()
    const other = fixture()
    values.set(key, JSON.stringify([other]))
    const preview = previewGameBackup(raw)
    vi.mocked(localStorage.setItem).mockClear()
    restoreGameBackup(preview, {})
    expect(getAllGames()).toEqual([other, ...games])
    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, expect.any(String))
  })
  it('replaces only an explicitly confirmed conflicting game', () => {
    const { game, raw } = roundTrip()
    const old = { ...game, name: 'Older local version' }
    saveGame(old)
    restoreGameBackup(previewGameBackup(raw), { [game.id]: 'replace' })
    expect(getAllGames()).toEqual([game])
  })
  it('keeps both by changing only the imported game id, never nested references', () => {
    const { game, raw } = roundTrip()
    saveGame(game)
    restoreGameBackup(previewGameBackup(raw), { [game.id]: 'both' })
    const [original, copy] = getAllGames()
    expect(original).toEqual(game)
    expect(copy.id).not.toBe(game.id)
    expect({ ...copy, id: game.id }).toEqual(game)
  })
  it('does not default to overwriting on conflict', () => {
    const { game, raw } = roundTrip()
    saveGame(game)
    const before = new Map(values)
    expect(() => restoreGameBackup(previewGameBackup(raw), {})).toThrow()
    expect(values).toEqual(before)
  })
  it('preview and cancel leave even legacy raw bytes unchanged', () => {
    const game = fixture()
    values.set(key, JSON.stringify([game], null, 4))
    const before = new Map(values)
    const raw = createGameBackup()
    previewGameBackup(raw)
    expect(values).toEqual(before)
    expect(localStorage.setItem).not.toHaveBeenCalled()
  })
  it('rejects stale previews instead of losing changes made after preview', () => {
    const { raw } = roundTrip()
    const preview = previewGameBackup(raw)
    saveGame(fixture())
    const before = new Map(values)
    expect(() => restoreGameBackup(preview, {})).toThrow()
    expect(values).toEqual(before)
  })
  it('preserves every previous byte on quota failure without an unsafe retry', () => {
    const { raw } = roundTrip()
    values.set(key, JSON.stringify([fixture()], null, 2))
    const preview = previewGameBackup(raw),
      before = new Map(values)
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new DOMException('Quota', 'QuotaExceededError')
    })
    expect(() => restoreGameBackup(preview, {})).toThrow()
    expect(values).toEqual(before)
  })
  it('does not treat unreadable local data as an empty destination', () => {
    const { raw } = roundTrip()
    values.set(key, 'broken')
    const before = new Map(values)
    expect(() => previewGameBackup(raw)).toThrow()
    expect(values).toEqual(before)
  })
  it('denies export, preview and commit while the durable audience latch is set', () => {
    const { raw } = roundTrip()
    const preview = previewGameBackup(raw)
    values.set('grimoire_audience_protected', '1')
    const before = new Map(values)
    expect(() => createGameBackup()).toThrow()
    expect(() => previewGameBackup(raw)).toThrow()
    expect(() => restoreGameBackup(preview, {})).toThrow()
    expect(values).toEqual(before)
  })
  it.each([
    'garbage',
    '{}',
    '[]',
    '{"format":"grimorium-backup","version":99,"games":[]}',
    '{"version":1,"games":[]}',
  ])('rejects malformed/unknown envelopes: %s', (raw) => {
    expect(() => previewGameBackup(raw)).toThrow()
    expect(values.has(key)).toBe(false)
  })
  it.each([
    'missingHistory',
    'missingPlayer',
    'missingEffect',
    'unknownRole',
    'unknownEffect',
    'unknownScript',
    'duplicateGame',
    'duplicateHistory',
    'duplicatePlayer',
    'invalidSnapshot',
    'missingBeginning',
    'invalidDate',
  ])('validates all history and games before any write: %s', (corruption) => {
    const good = fixture(),
      bad = fixture()
    const envelope = {
      format: 'grimorium-backup',
      version: 1,
      exportedAt: Date.now(),
      games: [good, bad],
    }
    const state = bad.history[0].stateAfter
    switch (corruption) {
      case 'missingBeginning':
        bad.history[0].type = 'vote'
        break
      case 'invalidDate':
        bad.createdAt = 1e300
        break
      case 'missingHistory':
        bad.history = []
        break
      case 'missingPlayer':
        delete (state.players[0] as { roleId?: string }).roleId
        break
      case 'missingEffect':
        delete (state.players[0].effects[0] as { id?: string }).id
        break
      case 'unknownRole':
        state.players[0].roleId = 'future-role'
        break
      case 'unknownEffect':
        state.players[0].effects[0].type = 'future-effect'
        break
      case 'unknownScript':
        bad.scriptId = 'future-script'
        break
      case 'duplicateGame':
        bad.id = good.id
        break
      case 'duplicateHistory':
        bad.history[1].id = bad.history[0].id
        break
      case 'duplicatePlayer':
        state.players[1].id = state.players[0].id
        break
      case 'invalidSnapshot':
        state.round = -1
        break
    }
    expect(() => previewGameBackup(JSON.stringify(envelope))).toThrow()
    expect(localStorage.setItem).not.toHaveBeenCalled()
  })
  it('preserves the version-1 local save format', () => {
    const { raw } = roundTrip()
    restoreGameBackup(previewGameBackup(raw), {})
    expect(JSON.parse(values.get(key)!).version).toBe(1)
    expect(parseSavedGames(values.get(key)!)).toHaveLength(1)
  })
})
