import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeGame } from './helpers'
import {
  getAllGames,
  getGame,
  saveGame,
  deleteGame,
  GameStorageError,
} from '../storage'
import { parseSavedGames, serializeGames } from '../saveFormat'

const key = 'grimoire_games'
let values: Map<string, string>
beforeEach(() => {
  values = new Map()
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
afterEach(() => vi.unstubAllGlobals())

describe('saved game validation and recovery', () => {
  it('reads legacy saves without rewriting and upgrades them only on the next save', () => {
    const game = makeGame()
    const legacy = JSON.stringify([game])
    values.set(key, legacy)
    expect(getGame(game.id)).toEqual(game)
    expect(values.get(key)).toBe(legacy)
    saveGame({ ...game, name: 'Updated' })
    expect(JSON.parse(values.get(key)!)).toMatchObject({ version: 1 })
    expect(getGame(game.id)?.name).toBe('Updated')
  })

  it('preserves other games when updating or deleting one', () => {
    const one = makeGame(),
      two = makeGame()
    saveGame(one)
    saveGame(two)
    saveGame({ ...one, name: 'Changed' })
    expect(getAllGames()).toHaveLength(2)
    deleteGame(one.id)
    expect(getAllGames()).toEqual([two])
  })

  it.each(['', '{broken', '{}', 'null', '[{}]', '{"version":99,"games":[]}'])(
    'does not overwrite invalid stored data: %s',
    (raw) => {
      values.set(key, raw)
      expect(() => getAllGames()).toThrow(GameStorageError)
      expect(() => saveGame(makeGame())).toThrow(GameStorageError)
      expect(() => deleteGame('anything')).toThrow(GameStorageError)
      expect(values.get(key)).toBe(raw)
      try {
        getAllGames()
      } catch (error) {
        expect((error as GameStorageError).backup).toBe(raw)
      }
    },
  )

  it('rejects malformed nested snapshots and duplicate game IDs', () => {
    const game = makeGame()
    const invalid = JSON.parse(JSON.stringify(game))
    invalid.history[0].stateAfter.players = [
      { id: 'x', name: 'x', roleId: 'imp', effects: null },
    ]
    expect(() => parseSavedGames(JSON.stringify([invalid]))).toThrow()
    expect(() => parseSavedGames(JSON.stringify([game, game]))).toThrow()
  })

  it('preserves the old save and offers the attempted save as a recoverable copy on quota failure', () => {
    const game = makeGame()
    saveGame(game)
    const before = values.get(key)
    const next = { ...game, name: 'Latest change' }
    vi.mocked(localStorage.setItem).mockImplementationOnce(() => {
      throw new Error('QuotaExceededError')
    })
    let failure: GameStorageError | undefined
    try {
      saveGame(next)
    } catch (error) {
      failure = error as GameStorageError
    }
    expect(failure?.kind).toBe('write')
    expect(values.get(key)).toBe(before)
    expect(parseSavedGames(failure!.backup!)).toEqual([next])
    failure!.retry!()
    expect(getGame(game.id)).toEqual(next)
  })

  it('surfaces blocked storage rather than pretending there are no games', () => {
    vi.mocked(localStorage.getItem).mockImplementation(() => {
      throw new Error('SecurityError')
    })
    expect(() => getAllGames()).toThrow(GameStorageError)
  })

  it('only treats an absent key as an empty library', () => {
    expect(getAllGames()).toEqual([])
    expect(parseSavedGames(serializeGames([]))).toEqual([])
  })
})
