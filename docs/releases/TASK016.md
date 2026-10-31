# Task 016 — Backup & Restore de Partidas

Recovered functionality on `release/weekend-2026-10-31`.
Baseline: `4f92008cc82b87f0d3f8f49cf78ee289a6cf0dc3` (W08).

## Use

Open the main menu and choose **Backup de partidas / Game backup / Copia de partidas**.
The screen warns that the JSON contains secret characters and game information.
Download creates a local file; Share uses Web Share with files when available and
falls back to downloading. Nothing is uploaded automatically. OS share cancellation
does not change games.

Choose **Restaurar backup** and select a backup JSON. The preview shows only game
name, creation date, player count, phase and round. Conflicts require an explicit
Replace or Keep both choice for each game. Confirm restore is a separate action;
Cancel performs no writes. Nonconflicting games are added normally.

## Integrity and privacy

The portable envelope is `{ format: 'grimorium-backup', version: 1, exportedAt,
games }`. It contains complete Game objects including every history snapshot,
rich message, event data, player, effect and internal ID. It contains no language,
current-game or audience-protection preferences. The on-device save format remains
unchanged: legacy arrays are read without migration writes, and successful imports
write the existing `{ version: 1, games }` format.

The entire file is validated before preview. Invalid JSON, unknown backup versions,
missing required fields/history, missing initial game creation, duplicate identities,
invalid dates/snapshots and unsupported script/role/effect IDs are rejected.
An unknown format is not converted by casting or partially salvaged.

The import builds and revalidates the complete resulting collection in memory,
checks the original raw storage still matches the preview, then performs exactly
one localStorage.setItem. It never deletes games first. Atomic setItem failure
leaves the prior data intact, and no stale automatic retry is offered. An error
requires selecting the file again. Existing selection and language are untouched.
Keep both changes only the imported game ID using a collision-checked UUID;
player, effect, event and history IDs/references remain unchanged.

This route is mounted inside AudienceRecoveryBoundary. No entry is added to
player-facing screens. Export, preview and commit independently refuse access
while the durable latch is set. The file cannot clear that latch or import
preferences, and the existing 1,000 ms protected handback is unchanged.

## Verification

Unit coverage includes full round trip and continued play, multiple games, empty
destination, both conflict choices, cancel/preview without writes, explicit-choice
requirement, stale previews, malformed files, unknown versions, incomplete/invalid
snapshots and quota failure preserving previous raw bytes and preferences.

Chromium uses Pixel 7 touch emulation at 320×568, 360×800, 390×844 and 412×915,
plus desktop 1400×900. The browser suite downloads a real JSON, opens a separate
storage-isolated browser context, uses filechooser to select that exact file,
compares restored games, and advances Day 3 to Night 4 while preserving prior
history and character identities. It also covers replace/keep/cancel, failed
storage, invalid files, privacy/reload/Back and the Web Share adapter with a stub.
The actual Android OS share sheet is not validated by that stub.

Run npm ci, npm run tc, npm test, npm run build, Prettier, git diff --check and the
full Chromium suite. Publication uses normal HTTPS Git push on the release branch,
then exact remote SHA, GitHub commit, Pages workflow and public build verification.
Physical Android and installed standalone PWA validation: **NOT RUN**.

This restores Task 016 functionality in the current release; it does not recover
or recreate lost original Git commits or advance other historical tasks. Main,
rebuild and draft PR #2 remain untouched. Final SHA, test totals, deployment and
public validation evidence are in the delivery report.
