import { describe, expect, it, vi, afterEach } from 'vitest'
import { shuffle } from '../shuffle'
import { resolveIdentifiedRoleAssignments } from '../roleAssignment'
import { generateRolePools, selectPresetPools } from '../scripts/generator'
import { SCRIPTS } from '../scripts'
import { validateSetupPlan } from '../setupPlan'
import { getRole } from '../roles'

afterEach(() => vi.restoreAllMocks())
function seeded(seed = 7) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
}

describe('Fisher–Yates shuffle', () => {
  it('does not mutate frozen input and preserves exact multiplicities', () => {
    const input = Object.freeze(['a', 'b', 'a', 'c', 'c'])
    const result = shuffle(input, seeded())
    expect(result).not.toBe(input)
    expect([...result].sort()).toEqual([...input].sort())
    expect(input).toEqual(['a', 'b', 'a', 'c', 'c'])
  })
  it('uses controlled RNG for a deterministic expected order', () => {
    const random = vi.fn(() => 0)
    expect(shuffle(['a', 'b', 'c', 'd'], random)).toEqual(['b', 'c', 'd', 'a'])
    expect(random).toHaveBeenCalledTimes(3)
    expect(shuffle([1, 2, 3], () => 0.999)).toEqual([1, 2, 3])
  })
  it('all six permutations of three elements have one equally weighted choice path', () => {
    const permutations = []
    for (const first of [0, 1 / 3, 2 / 3])
      for (const second of [0, 1 / 2]) {
        const values = [first, second]
        permutations.push(shuffle([1, 2, 3], () => values.shift()!).join(','))
      }
    expect(new Set(permutations).size).toBe(6)
  })
  it('empty and single-item arrays do not consume randomness', () => {
    const random = vi.fn()
    expect(shuffle([], random)).toEqual([])
    expect(shuffle(['a'], random)).toEqual(['a'])
    expect(random).not.toHaveBeenCalled()
  })
  it.each([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])(
    'generated official pools retain distribution/scoring at %i players',
    (count) => {
      vi.spyOn(Math, 'random').mockImplementation(seeded(count))
      const pools = generateRolePools(SCRIPTS['trouble-brewing'], count, 6)
      expect(pools).toHaveLength(6)
      for (const pool of pools) {
        expect(() =>
          validateSetupPlan({
            players: Array.from({ length: count }, (_, i) => ({
              id: `p${i}`,
              name: `Player ${i}`,
            })),
            scriptId: 'trouble-brewing',
            selectedRoles: pool.roles,
            manualAssignments: {},
          }),
        ).not.toThrow()
        expect(pool.totalChaos).toBe(
          pool.roles.reduce((sum, id) => sum + (getRole(id)?.chaos ?? 0), 0),
        )
      }
      const sorted = [...pools].sort((a, b) => a.totalChaos - b.totalChaos)
      const presets = selectPresetPools(pools)!
      expect(presets.simple).toBe(sorted[0])
      expect(presets.interesting).toBe(sorted[3])
      expect(presets.chaotic).toBe(sorted[5])
    },
  )
  it('larger custom pools preserve manual assignments, Demon guarantee and clockwise identities', () => {
    vi.spyOn(Math, 'random').mockImplementation(seeded())
    const players = Array.from({ length: 5 }, (_, i) => ({
      id: `p${i}`,
      name: 'Alex',
    }))
    const selectedRoles = [
      'chef',
      'chef',
      'monk',
      'soldier',
      'saint',
      'imp',
      'poisoner',
    ]
    const input = { players, selectedRoles, manualAssignments: { p3: 'chef' } }
    const before = JSON.stringify(input)
    const result = resolveIdentifiedRoleAssignments(input)
    expect(result.map((p) => p.id)).toEqual(players.map((p) => p.id))
    expect(result[3].roleId).toBe('chef')
    expect(result.some((p) => p.roleId === 'imp')).toBe(true)
    for (const role of new Set(selectedRoles))
      expect(
        result.filter((p) => p.roleId === role).length,
      ).toBeLessThanOrEqual(selectedRoles.filter((id) => id === role).length)
    expect(JSON.stringify(input)).toBe(before)
  })
})
