# Privacy and audiences

## Device and information boundaries

The Storyteller holds and operates the device, showing selected screens to players. This is one local application, not separate player accounts or networked clients. Saves and recovery downloads contain secrets, not public game representations.

| Audience       | Appropriate information                                                                    |
| -------------- | ------------------------------------------------------------------------------------------ |
| Storyteller    | Actual state, Grimoire, effects, history, registration choices and configuration           |
| Private player | Their character or ability result, including deliberately misleading information           |
| Public table   | Announced deaths/public events without hidden characters, effects or Storyteller reasoning |

Construct results for their recipient rather than exposing a Storyteller view. Explicit ability-specific exceptions, such as the Spy's read-only Grimoire, must stay constrained to their intended view.

## Private reveal lifecycle

`src/components/layouts/PlayerFacingScreen.tsx` signals `PlayerFacingContext`, hiding floating Grimoire/history controls in `GameScreen.tsx`. With `playerName`, it manages:

1. Preparation through `HandDeviceScreen` before revealing information.
2. Private content with `HandbackContext` available to children.
3. Hidden information behind `ReturnDeviceScreen` after `requestHandback(callback)`.
4. The stored callback only after Storyteller confirmation.

Without `playerName`, the wrapper signals a player-facing view but supplies no preparation/handback interstitials. Use the full lifecycle for private reveals requiring those steps. Hidden floating buttons do not make other secrets or open overlays safe.

Never expose Grimoire/history navigation during a private view. Resolution-input screens also hide floating controls to prevent unrelated edits while actions are provisional. Keep player instructions separate from Storyteller configuration and implementation details.

## Night-step audiences

`NightStepListLayout` presents the step list before an action. `NightStepDefinition` and layout steps use:

| Value           | Interaction                                              |
| --------------- | -------------------------------------------------------- |
| `narrator`      | Storyteller decision; default when omitted               |
| `player_choice` | Player chooses verbally; Storyteller operates the screen |
| `player_reveal` | Player sees private content through the reveal lifecycle |

Metadata renders labels/icons, not privacy enforcement. Action components must use the reveal wrapper/handback behavior. The step-list header can name a character and is a Storyteller screen, not a public reference.

## Public deaths

`startDay()` in `src/lib/game.ts` finds players alive at night start who are now dead and records announcements by player identity. `DeathRevealScreen.tsx` displays names/death status on both card faces. Its input type includes `roleId`, but the public presentation does not render it. Do not add character names, role art, team indicators or private causes to announcements.

These boundaries also constrain future reference, public-table and Android work; this documentation does not implement those features. See [testing and verification](../development/testing-and-verification.md) for validating recipient-specific information.
