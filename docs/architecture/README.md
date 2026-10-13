# Architecture map

Read the document for the subsystem a task touches, then inspect its source types and relevant definitions. These documents describe the current app; [the roadmap](../roadmap.md) lists future work.

| Task area                                              | Document                                                       | Source entry points                                                                                                     |
| ------------------------------------------------------ | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| State, history, actions, interactions or perception    | [Game engine](game-engine.md)                                  | `src/lib/types.ts`, `game.ts`, `gameAction.ts`, `pipeline/`                                                             |
| Save format, storage failures or interrupted decisions | [Persistence](persistence.md)                                  | `src/lib/storage.ts`, `saveFormat.ts`, `src/components/StorageBoundary.tsx`, `src/App.tsx`                              |
| Player reveals, night steps or public information      | [Privacy and audiences](privacy-and-audiences.md)              | `src/components/layouts/`, `context/PlayerFacingContext.tsx`, `screens/GameScreen.tsx`, `screens/DeathRevealScreen.tsx` |
| Characters, effects, scripts or translations           | [Characters, effects and i18n](characters-effects-and-i18n.md) | `src/lib/roles/`, `effects/`, `scripts/`, `i18n/`                                                                       |

Use [testing and verification](../development/testing-and-verification.md) for checks and [task briefs](../tasks/README.md) for implementation contracts. Source paths are relative to the repository root; abbreviated paths in a row share its directory prefix.
