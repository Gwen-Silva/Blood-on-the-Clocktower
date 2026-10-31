import type { PlayerState, GameState } from './types'
import { getEffect } from './effects'
export function canPlayerVote(
  player: PlayerState,
  state: GameState,
  votes?: Record<string, boolean>,
): boolean {
  for (const effect of player.effects) {
    const definition = getEffect(effect.type)
    if (!definition?.preventsVoting) continue
    if (!definition.canVote || !definition.canVote(player, state, votes))
      return false
  }
  return true
}
