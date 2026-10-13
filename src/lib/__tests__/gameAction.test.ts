import { describe, expect, it } from 'vitest'
import { createGame, getNightRolesStatus, startDay, startNight } from '../game'
import { getCurrentState, isAlive } from '../types'
import { resolveNightAction } from '../gameAction'
import type { NightActionResult } from '../roles/types'

function scenario(targetRole = 'mayor') {
  let game = createGame('Test', 'trouble-brewing', [
    { name: 'Demon', roleId: 'imp' },
    { name: 'Target', roleId: targetRole },
    { name: 'Other', roleId: 'chef' },
    { name: 'Monk', roleId: 'monk' },
    { name: 'Minion', roleId: 'poisoner' },
  ])
  game = startNight(startDay(startNight(game)))
  const [imp, target, other] = getCurrentState(game).players
  const action: NightActionResult = {
    entries: [
      {
        type: 'night_action',
        message: [],
        data: {
          roleId: 'imp',
          playerId: imp.id,
          targetId: target.id,
          action: 'kill',
        },
      },
    ],
    intent: {
      type: 'kill',
      sourceId: imp.id,
      targetId: target.id,
      cause: 'demon',
    },
  }
  return { game, imp, target, other, action }
}

describe('night action transaction', () => {
  it('leaves the committed save pending while the Mayor decision is unresolved', () => {
    const { game, imp, action } = scenario()
    const saved = JSON.stringify(game)
    const result = resolveNightAction(game, action)
    expect(result.type).toBe('needs_input')
    expect(JSON.stringify(game)).toBe(saved)
    const restored = JSON.parse(saved)
    expect(
      getNightRolesStatus(restored).find((p) => p.playerId === imp.id)?.status,
    ).toBe('pending')
    expect(getCurrentState(restored).players.every(isAlive)).toBe(true)
  })

  it('commits the original action and redirected death together', () => {
    const { game, imp, target, other, action } = scenario()
    const pending = resolveNightAction(game, action)
    expect(pending.type).toBe('needs_input')
    if (pending.type !== 'needs_input')
      throw new Error('Expected Mayor decision')
    const complete = pending.resume(other.id)
    expect(complete.type).toBe('complete')
    if (complete.type !== 'complete')
      throw new Error('Expected completed action')
    const restored = JSON.parse(JSON.stringify(complete.game))
    expect(
      getNightRolesStatus(restored).find((p) => p.playerId === imp.id)?.status,
    ).toBe('done')
    const players = getCurrentState(restored).players
    expect(isAlive(players.find((p) => p.id === target.id)!)).toBe(true)
    expect(isAlive(players.find((p) => p.id === other.id)!)).toBe(false)
    expect(
      restored.history.filter(
        (e: { data: { playerId?: string; action?: string } }) =>
          e.data.playerId === imp.id && e.data.action === 'kill',
      ),
    ).toHaveLength(1)
    expect(getCurrentState(game).players.every(isAlive)).toBe(true)
  })

  it('records a protected attempt without killing the Soldier', () => {
    const { game, imp, target, action } = scenario('soldier')
    const result = resolveNightAction(game, action)
    if (result.type !== 'complete')
      throw new Error('Expected protection resolution')
    expect(
      getNightRolesStatus(result.game).find((p) => p.playerId === imp.id)
        ?.status,
    ).toBe('done')
    expect(
      isAlive(
        getCurrentState(result.game).players.find((p) => p.id === target.id)!,
      ),
    ).toBe(true)
  })

  it('completes an action with no intent, including misinformation', () => {
    const { game, imp, action } = scenario()
    delete action.intent
    const result = resolveNightAction(game, action)
    if (result.type !== 'complete') throw new Error('Expected completed action')
    expect(
      getNightRolesStatus(result.game).find((p) => p.playerId === imp.id)
        ?.status,
    ).toBe('done')
    expect(getCurrentState(result.game).players.every(isAlive)).toBe(true)
  })

  it('keeps all choices provisional across chained Mayor redirects', () => {
    const { game, action, target, other } = scenario('mayor')
    // A custom game can contain more than one Mayor.
    const player = getCurrentState(game).players.find((p) => p.id === other.id)!
    player.roleId = 'mayor'
    player.effects = [{ id: 'second-deflect', type: 'deflect' }]
    const saved = JSON.stringify(game)
    const first = resolveNightAction(game, action)
    if (first.type !== 'needs_input') throw new Error('Expected first choice')
    const second = first.resume(other.id)
    expect(second.type).toBe('needs_input')
    expect(JSON.stringify(game)).toBe(saved)
    if (second.type !== 'needs_input') throw new Error('Expected second choice')
    const final = second.resume(other.id)
    if (final.type !== 'complete') throw new Error('Expected completed action')
    expect(
      isAlive(
        getCurrentState(final.game).players.find((p) => p.id === other.id)!,
      ),
    ).toBe(false)
    expect(
      isAlive(
        getCurrentState(final.game).players.find((p) => p.id === target.id)!,
      ),
    ).toBe(true)
  })
})
