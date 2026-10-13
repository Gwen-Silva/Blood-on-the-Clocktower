# Game engine

## State and history

`src/lib/types.ts` defines `Game`, `GameState`, players, effects and history entries. A game stores metadata and history; `getCurrentState()` reads the final entry's `stateAfter`. State contains phase, round, players and winner. The players array supplies circular seating order. A player's identity/status use `roleId` and effect instances; death is the `dead` effect.

`src/lib/game.ts` handles creation, setup, phases, action bookkeeping, voting and victory. `GameScreen.tsx` also has a screen state machine: voting does not require a separate game phase. Night completion is determined from history, so recording an action changes more than its displayed log.

History contains full snapshots, not a replay-only event log. `addHistoryEntry()` appends entries. `applyPipelineChanges()` applies changes with the first new entry; changes without entries can replace the final snapshot. Preserve earlier snapshots and record significant actions. There is no general undo system or guarantee that every change can be reconstructed from events.

## Intents and effects

`src/lib/pipeline/types.ts` defines `kill`, `nominate` and `execute` intents and `StateChanges`. Use intents for actions other abilities can intercept. Effects return changes rather than mutating the input game. See [characters and effects](characters-effects-and-i18n.md) for extension points.

`resolveIntent()` collects matching handlers from living, non-malfunctioning players and sorts them by ascending numeric priority. `appliesTo()` determines participation. A handler can allow, prevent, redirect or request UI. Redirects recollect handlers and restart resolution while retaining accumulated changes. `resolvers.ts` supplies default changes if no handler prevents resolution. Priorities encode particular interactions; do not assume every redirect precedes every protection.

The runner accumulates changes until application. Earlier proposed changes are not automatically applied to the state passed to later handlers. Inspect concrete handlers and the runner before changing an interaction.

## Provisional actions and pending input

`src/lib/gameAction.ts` bridges resolution and the controller. `resolveNightAction()` stages `applyNightAction()` bookkeeping and resolves its optional intent against that provisional game. `resolveGameAction()` returns either a complete game or `needs_input` with a React component, intent, state and `resume()` callback. Resuming can return further pending input.

The staged game stays separate from the controller's committed state. The current API still references React; it is not a presentation-independent engine. Saving, interruptions and restrictions during pending input are specified in [persistence](persistence.md#commit-boundary).

## Perception, registration and malfunction

`src/lib/pipeline/perception.ts` starts `perceive()` from the target's role/team/alignment, then applies matching effect modifiers. Context is `alignment`, `team` or `role`; modifiers can restrict observer roles.

`canRegisterAs` declares possible alternative registrations. `resolveCanRegisterAs()` prefers instance data to the definition. `getAmbiguousPlayers()` identifies targets needing a Storyteller choice. `applyPerceptionOverrides()` returns a local state copy with chosen `perceiveAs` data for that calculation. Temporary perceptions do not replace actual player state or emit game events.

Use `isMalfunctioning()` for drunkenness/poisoning. Effects with `poisonsAbility` disable passive handlers; optional misregistration is disabled on malfunctioning targets. Information given to a malfunctioning observer may be true or false. Not every perception modifier disappears: the Drunk's actual identity modifier still applies.

The Drunk's setup changes `roleId` to an out-of-play Townsfolk they believe they are and stores `actualRole: 'drunk'` in a permanent `drunk` effect. The believed role drives night UI/order; the effect supplies malfunction and actual Drunk/Outsider perception. A raw `roleId` lookup is not always actual identity.

## Role changes and follow-ups

Setup/night action results and pipeline changes can change roles and add/remove effects. `removeEffectsFromInactiveSources()` removes effects tied to a source that dies or changes character. Inspect the specific ability's replacement effects and history entries; changing a string alone is not a complete ability transition.

Effects expose conditional day actions, night follow-ups and victory checks. Use `pending_role_reveal` when a changed character needs a private reveal. Its follow-up remains available until resolved; protect it using the [audience flow](privacy-and-audiences.md).
