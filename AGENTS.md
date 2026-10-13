# Working on Grimorium

Gwen's personal fork of csansoon/grimorium is a Blood on the Clocktower Storyteller companion built with React, TypeScript, Vite, Tailwind CSS and Radix UI. Android packaging is not implemented.

## Constraints

- Keep the existing visual design and game data local unless explicitly requested otherwise. This fork has no analytics integration.
- Implement the assigned task only. Do not turn a small change into a subsystem redesign.
- Save a completed game change successfully before publishing it to the UI. Pending resolutions stay provisional; failed saves stop the transition. See [persistence](docs/architecture/persistence.md).
- Protect player information: retain preparation, private reveal and handback; never expose Storyteller controls during a private view or characters in public death announcements. See [audiences](docs/architecture/privacy-and-audiences.md).
- Keep character-specific behavior in roles and effects, not new branches in the main game controller. Use the intent pipeline for interceptable actions.
- Put user-facing text through i18n in both supported languages, English and Spanish.
- Describe current behavior and limitations plainly. Preserve original-project attribution without presenting the original author's experiences as Gwen's.

## Repository map

| Area                        | Entry points                                                                | Read when changing                                                               |
| --------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Game state and resolution   | `src/lib/types.ts`, `game.ts`, `gameAction.ts`, `pipeline/`                 | [Game engine](docs/architecture/game-engine.md)                                  |
| Saves and recovery          | `src/lib/storage.ts`, `saveFormat.ts`, `src/components/StorageBoundary.tsx` | [Persistence](docs/architecture/persistence.md)                                  |
| Screen flow and information | `src/components/screens/GameScreen.tsx`, `src/components/layouts/`          | [Privacy and audiences](docs/architecture/privacy-and-audiences.md)              |
| Abilities, scripts and text | `src/lib/roles/`, `effects/`, `scripts/`, `i18n/`                           | [Characters, effects and i18n](docs/architecture/characters-effects-and-i18n.md) |

The [architecture index](docs/architecture/README.md) helps select context. [Task briefs](docs/tasks/README.md) define implementation scope; use the [template](docs/tasks/TEMPLATE.md) for new tasks. Read the relevant subsystem document rather than loading every document. Abbreviated source paths in a table row share its directory prefix.

## Verification

Use `npm ci` with the committed lockfile. `npm run dev` starts Vite. Format changed supported files with the installed Prettier and run targeted behavior tests during development; no placeholder tests. Before committing, run `npm run tc`, `npm test` and `npm run build`, review the diff and exclude unrelated changes. No ESLint command is configured.

See [testing and verification](docs/development/testing-and-verification.md) for commands and coverage expectations. Unit tests do not establish browser or Android validation.
