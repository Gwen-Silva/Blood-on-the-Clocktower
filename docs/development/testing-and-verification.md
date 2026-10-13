# Testing and verification

## Commands

Install with `npm ci` and the committed lockfile. Vitest runs in Node (`vite.config.ts`); component-named tests are not automatically browser journeys. There is no ESLint command, browser journey suite or Android package.

| Purpose                 | Command                                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Development server      | `npm run dev`                                                                                              |
| One test file           | `npm test -- src/lib/__tests__/gameAction.test.ts`                                                         |
| Selected test name      | `npm test -- src/lib/__tests__/gameAction.test.ts -t 'Mayor'`                                              |
| Watch tests             | `npm run test:watch`                                                                                       |
| Format changed Markdown | `npx --no-install prettier --write AGENTS.md docs/architecture/*.md docs/development/*.md docs/tasks/*.md` |
| Check that formatting   | `npx --no-install prettier --check AGENTS.md docs/architecture/*.md docs/development/*.md docs/tasks/*.md` |
| Type check              | `npm run tc`                                                                                               |
| Full test suite         | `npm test`                                                                                                 |
| Production build        | `npm run build`                                                                                            |

Adapt formatting paths to changed files; do not reformat unrelated source. Existing scripts support targeted/full verification; no extra script is needed. Build runs TypeScript/Vite and copies the built index to `404.html`. `.github/workflows/deploy.yml` runs tests/build before Pages deployment from `main`.

## Behavior and interactions

Test outcomes and boundaries rather than mirroring implementation. Reuse `src/lib/__tests__/helpers.ts`. Cover relevant disabled abilities, death, timing, wrong registration and competing effects; happy paths alone may miss actual behavior.

Behavior entirely implemented in an effect belongs in that effect's tests. Role tests verify setup, result construction or role-specific logic when present. Shared regressions belong with engine/pipeline/perception tests. Do not add placeholders, bare `expect(true)` calls or assertions that cannot fail. Existing placeholders are not evidence of coverage.

For information/UI changes, verify intended-recipient content, preparation/handback, restricted controls and public-death secrecy. Static/unit assertions cover only properties they inspect, not a complete reveal journey.

## Persistence changes

Follow [persistence](../architecture/persistence.md) and cover:

- Complete versus interrupted decisions, successive input and prevented intents. Bookkeeping must not persist before consequences finish.
- Legacy arrays/current envelopes without migration writes on read.
- Malformed JSON, invalid structure, duplicate IDs and unknown versions. Rejected data must remain available rather than becoming an empty collection.
- Read/write failures, preserved old data, attempted-state copies and retry failure/success.
- Save-before-publish: failed writes must stop UI transitions.

Existing regressions are `src/lib/__tests__/gameAction.test.ts` and `storage.test.ts`. Run related behavior tests when changing formats/action boundaries.

## Finishing a task

Run targeted tests during development. Before committing, inspect the complete diff, format supported changed files, check links/package configuration when relevant, then run `npm run tc`, `npm test` and `npm run build`. If package scripts change, exercise affected commands. Check `git diff --check` and `git status --short` for errors/unrelated tracked changes.

Record exactly what ran and any failures. Claim browser/device validation only after exercising those environments. Unit tests/build do not establish browser reloads, backgrounding, Android process termination, system back, keyboard handling or secret protection during app switching.
