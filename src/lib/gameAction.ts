import type { FC } from 'react'
import { Game, GameState, getCurrentState } from './types'
import { applyNightAction } from './game'
import { applyPipelineChanges, resolveIntent } from './pipeline'
import type {
  Intent,
  PipelineInputProps,
  PipelineResult,
} from './pipeline/types'
import type { NightActionResult } from './roles/types'

export type GameAction =
  | { type: 'complete'; game: Game }
  | {
      type: 'needs_input'
      Component: FC<PipelineInputProps>
      intent: Intent
      state: GameState
      resume: (answer: unknown) => GameAction
    }

// Keep changes provisional until every interaction has finished. Callers may
// save only a complete result; pending callbacks are deliberately not saved.
export function resolveGameAction(
  game: Game,
  result: PipelineResult,
): GameAction {
  if (result.type !== 'needs_input') {
    return {
      type: 'complete',
      game: applyPipelineChanges(game, result.stateChanges),
    }
  }
  return {
    type: 'needs_input',
    Component: result.UIComponent,
    intent: result.intent,
    state: getCurrentState(game),
    resume: (answer) => resolveGameAction(game, result.resume(answer)),
  }
}

export function resolveNightAction(
  game: Game,
  action: NightActionResult,
): GameAction {
  const stagedGame = applyNightAction(game, action)
  if (!action.intent) return { type: 'complete', game: stagedGame }
  return resolveGameAction(
    stagedGame,
    resolveIntent(action.intent, getCurrentState(stagedGame), stagedGame),
  )
}
