import { describe, expect, it } from 'vitest'
import { resolveIdentifiedRoleAssignments } from '../roleAssignment'
import { createGame } from '../game'
import { getCurrentState } from '../types'

const players = [
  { id: 'seat-a', name: 'Alex' },
  { id: 'seat-b', name: 'Alex' },
  { id: 'seat-c', name: 'Bea' },
  { id: 'seat-d', name: 'Chris' },
  { id: 'seat-e', name: 'Dana' },
]
const selectedRoles = ['imp', 'chef', 'monk', 'saint', 'soldier']

describe('setup identity and clockwise seating', () => {
  it('assigns duplicate names independently and preserves clockwise identity', () => {
    const assignments = resolveIdentifiedRoleAssignments({
      players,
      selectedRoles,
      manualAssignments: { 'seat-a': 'chef', 'seat-b': 'imp' },
    })
    expect(assignments.map(({ id }) => id)).toEqual(players.map(({ id }) => id))
    expect(assignments[0]).toEqual({ ...players[0], roleId: 'chef' })
    expect(assignments[1]).toEqual({ ...players[1], roleId: 'imp' })
    const game = createGame('Duplicate names', 'trouble_brewing', assignments)
    const restored = JSON.parse(JSON.stringify(game))
    expect(
      getCurrentState(restored).players.map(({ id, name }) => ({ id, name })),
    ).toEqual(players)
  })

  it('preserves reordered seats while randomizing roles without mutating inputs', () => {
    const reordered = [
      players[3],
      players[1],
      players[4],
      players[0],
      players[2],
    ]
    const before = JSON.stringify({ reordered, selectedRoles })
    const assignments = resolveIdentifiedRoleAssignments({
      players: reordered,
      selectedRoles,
      manualAssignments: {},
    })
    expect(assignments.map(({ id }) => id)).toEqual(
      reordered.map(({ id }) => id),
    )
    expect(assignments.map(({ roleId }) => roleId).sort()).toEqual(
      [...selectedRoles].sort(),
    )
    expect(JSON.stringify({ reordered, selectedRoles })).toBe(before)
  })

  it('rejects duplicate identities rather than silently merging players', () => {
    expect(() =>
      resolveIdentifiedRoleAssignments({
        players: [players[0], players[0]],
        selectedRoles,
        manualAssignments: {},
      }),
    ).toThrow('Duplicate player IDs')
    expect(() =>
      createGame('Invalid', 'trouble_brewing', [
        { ...players[0], roleId: 'chef' },
        { ...players[0], roleId: 'imp' },
      ]),
    ).toThrow('Duplicate player IDs')
  })

  it('keeps legacy name-only game creation compatible with distinct generated IDs', () => {
    const game = createGame('Legacy', 'trouble_brewing', [
      { name: 'Alex', roleId: 'chef' },
      { name: 'Alex', roleId: 'imp' },
    ])
    expect(
      new Set(getCurrentState(game).players.map(({ id }) => id)).size,
    ).toBe(2)
  })
})
