# Working on Grimorium

This is Gwen's personal fork of csansoon/grimorium, a Blood on the Clocktower Storyteller companion. Keep the existing visual design. The current app is React and TypeScript; Android packaging is planned, not implemented.

## Commands

```sh
npm ci
npm run dev
npm test
npm run tc
npm run build
```

Use the committed npm lockfile. There is no configured ESLint command. Format changed files with Prettier, then run relevant regression tests and the production build. CI runs tests and the build before deployment.

## Where things live

- `src/lib/game.ts`: game creation, history, phases, voting and victory checks.
- `src/lib/types.ts`: game state and history types.
- `src/lib/gameAction.ts`: provisional action resolution; only complete results may be committed.
- `src/lib/storage.ts` and `saveFormat.ts`: local saves, format validation and recoverable storage errors.
- `src/lib/roles/definition/`: character definitions, their UI and translations.
- `src/lib/effects/definition/`: effects, interaction handlers and translations.
- `src/lib/pipeline/`: intent resolution, perception and available actions.
- `src/lib/scripts/`: supported scripts, composition and suggested sets.
- `src/components/screens/GameScreen.tsx`: game screen transitions and committed saves.
- `src/components/StorageBoundary.tsx`: recovery when storage cannot be read or written.
- `src/lib/i18n/translations/`: English and Spanish interface text.

## Rules and state

Keep character-specific behavior in characters and effects. Do not add character branches to the game controller to implement a new ability.

Use intents for actions that other abilities can intercept, including kills, nominations and executions. Effects return changes; they do not mutate the input game. Handler priorities are part of each interaction: check the existing definitions and rules instead of assuming all redirects must precede protection.

Information abilities use `perceive()` and the perception helpers. Use `getAmbiguousPlayers()` and `applyPerceptionOverrides()` when the Storyteller chooses a registration. Those temporary perceptions must not replace the character's actual state. Use `isMalfunctioning()` for drunkenness and poisoning. Information given in those conditions may be true or false.

The history contains full snapshots, not a replay-only event log. Some pipeline changes still replace the last snapshot when there is no new entry. Do not assume an undo system exists. Preserve older snapshots and record significant actions.

Never save the bookkeeping part of a night action before its intent resolves. Use `resolveNightAction()` and commit only its complete result. A pending result contains callbacks in memory; closing the app before completion returns to the last committed action. Do not allow unrelated game edits while a resolution is pending.

Save before publishing a new game state to the UI. Propagate failed saves to the recovery boundary and stop the transition. Do not treat unreadable or invalid storage as an empty collection, and do not overwrite it. Legacy array saves are read without migration writes; new saves use a versioned envelope. An unknown version requires an explicit migration, not a forced cast.

## Player information

The Storyteller holds the device. Use `PlayerFacingScreen` for private information and retain its preparation and handback steps. Never expose the Grimoire or history while showing information to players.

Night actions use `NightStepListLayout` before the action. Set the step audience to distinguish a Storyteller decision, a player's choice and a private reveal. Public death announcements must not reveal characters.

## Adding characters and effects

Check the current types in `roles/types.ts`, `effects/types.ts` and `pipeline/types.ts`; do not copy outdated type examples from documentation.

Register new characters in `roles/index.ts`, their ID union and the appropriate script. Register effects in `effects/index.ts` and its ID union. Reuse effects for passive abilities. Use `pending_role_reveal` when a changed character must be revealed.

Character and effect translations are registered by their modules, in adjacent `i18n/en.ts` and `i18n/es.ts` files. Shared UI text belongs in the top-level translation files and `Translations` type. Add both supported languages. Do not hardcode user-facing English in React components.

## Verification

Test behavior and interactions, including disabled abilities, death, timing and wrong registration. Reuse helpers in `src/lib/__tests__/helpers.ts`.

For a character whose behavior lives entirely in an effect, test that effect. Do not add placeholder tests or assertions that cannot fail. Existing placeholder tests are not evidence of coverage.

For persistence changes, cover interrupted decisions, legacy saves, malformed data, unknown versions and failed writes. Check that old data remains intact and that a failed save can be recovered. Do not claim browser or Android validation from unit tests alone.

## Writing

Describe what the app currently does, where it needs a Storyteller decision and what is unsupported. Avoid slogans, claims of complete rules coverage and promises that every game will be balanced. Keep player instructions separate from implementation details. Preserve attribution to the original project without presenting the original author's experiences as Gwen's.

This fork has no analytics integration. Keep game state local unless the user explicitly changes that requirement. The visual design stays unchanged unless requested.

## Mandatory remote delivery gate (rebuild branch)

For any task on `rebuild/tasks-001-020`, first read `docs/rebuild/RECOVERY_AND_DELIVERY.md`. **Local commits are not deliverables.** Every checkpoint MUST be committed, pushed to `origin/rebuild/tasks-001-020` and confirmed by comparing the local `git rev-parse HEAD` with the actual remote `git ls-remote origin refs/heads/rebuild/tasks-001-020`. Never report DONE if the hashes differ, if pushing fails, or if the changes only exist in an ephemeral Codex workspace. If blocked, make and verify a transferable Git bundle when possible, and stop. Do not force-push or alter `main`. Update `docs/rebuild/PROGRESS.md` with the verification evidence. The reconstruction is not recovery of the original lost commit history.
