# Reconstruction progress

| Checkpoint                | Status      | Remote HEAD verified                       | Tests/build                              | Notes                                             |
| ------------------------- | ----------- | ------------------------------------------ | ---------------------------------------- | ------------------------------------------------- |
| Initial delivery contract | DONE        | Pending final verification in setup        | Not applicable (no product code changed) | Original source not recovered; baseline `1eea438` |
| Task 001                  | DONE        | `35e2d088f7a5d6ffe8b12e44551705fd362ed737` | 455 tests; typecheck/build passed        | Stable setup identity                             |
| Task 002                  | DONE        | `2c7c485b191a0ebf52fbbea8b69a3026db896e80` | 478 tests; typecheck/build passed        | Protected handback                                |
| Task 003                  | DONE        | `d06a4b843065cc401a9e415c0ecbe842832004f8` | 524 tests; typecheck/build passed        | First-night revelation gates                      |
| Task 004                  | DONE        | `63290afc20e60bfa3125759f41d5c0c1ade82d0a` | 546 tests; typecheck/build passed        | Final setup review                                |
| Task 005                  | DONE        | `a8412533b0d2cf27d6a4446a25ad55ab41412621` | 589 tests; typecheck/build passed        | Core interaction hardening                        |
| Tasks 006–011             | NOT STARTED | —                                          | —                                        | Public surfaces/Almanac                           |
| Tasks 012–016             | NOT STARTED | —                                          | —                                        | Corrections/backup                                |
| Tasks 017–020             | NOT STARTED | —                                          | —                                        | PT-BR/Android/CI                                  |
| Task 021                  | BLOCKED     | —                                          | —                                        | Only after 001–020 restored and pushed            |

For each delivered checkpoint, record task numbers, test totals, build status, local commit SHA, remote branch SHA after push, and any missing real-device/CI execution. No local-only completion may be marked DONE.

## Task 001 — stable setup identity (implementation checkpoint)

Status: DONE — published and remote SHA verified.

- Setup players retain generated IDs through backward navigation, reordering,
  independent assignments for duplicate names, and game creation. Clockwise seat
  order remains the player-array order. Assignment rows display seat numbers.
- Existing name-only game creation remains compatible; duplicate explicit IDs
  are rejected. Existing saved games are not rewritten.
- Clean baseline `6c7df0c5d01e69dfd9ce65ff7e0dc693f2d30efe`:
  451 tests / 54 files passed; typecheck passed (isolated source archive).
- Changed code: targeted 19 tests passed; full 455 tests / 55 files passed;
  typecheck, production/PWA build, Prettier and diff whitespace check passed.
- Browser/native validation and hosted CI: not run at this checkpoint.
- Next: Task 002 protected handback, with the same mandatory push/SHA verification.

### Publication blocker — implementation stopped

Task 001 status: BLOCKED (tested implementation, not remotely delivered).
Implementation commit: `d07f08bad81048b270f3243e2e80a51ca9c3600e`.
`git push origin rebuild/tasks-001-020` failed:
`fatal: could not read Username for 'https://github.com': No such device or address`.
No Task 002 or later implementation was started. The clean baseline production
build also passed. A self-contained bundle of this branch is being preserved as
`grimorium-rebuild-task001.bundle` outside the repository and verified by cloning.
Next checkpoint: restore authenticated Git publication, push this branch without
force, verify matching local/remote SHA, then mark Task 001 DONE and begin 002.

### Publication blocker resolved

Official GitHub CLI web authentication completed as `Gwen-Silva`.
Configured terminal Git authentication with `gh auth setup-git`.
Normal push to `origin/rebuild/tasks-001-020` succeeded without force.
Verified local HEAD and remote branch via `git ls-remote` both equal
`35e2d088f7a5d6ffe8b12e44551705fd362ed737` before marking Task 001 DONE.
The original `grimorium-rebuild-task001.bundle` remains unchanged and verified.
No Task 001 implementation was repeated. No product changes were made while
resolving authentication. Next implementation checkpoint: Task 002.

## Task 002 — protected Storyteller handback

Status: DONE — normal push and GitHub publication verified.
Implementation commit: `685a00f` (Protect player handback to Storyteller).
Starting HEAD: `38a05d89e64d6ee0034eb17ac7ed49aa05d25e0f`.

- Shared neutral return requires a continuous 1,000 ms hold for mouse, touch,
  Space or Enter. Clicks do nothing. Release/cancellation, leaving bounds,
  capture loss, blur, hidden page and unmount cancel and reset pending attempts.
- Private information unmounts before neutral return. Callback runs once only
  after successful hold. Missing-context and nameless-wrapper immediate-return
  fallbacks removed. Storyteller overlays close before private content appears.
- Targeted: 42 tests / 3 files passed (23 handback/privacy + 19 setup regression).
- Full suite: 478 tests / 56 files passed. Typecheck, production/PWA build,
  Prettier check and git diff --check passed.
- Browser/native validation: NOT RUN. No local Chromium installation detected;
  React DOM/jsdom tests do not constitute real-browser or native validation.
- Hosted CI not claimed. Existing Radix description and build-size/Browserslist
  warnings recorded in the task document; no failing verification.
- Task 003 not started. Next: normal push and exact local/remote SHA comparison,
  inspect published commit on GitHub, then record DONE in a verified follow-up.

### Task 002 remote delivery evidence

- Implementation SHA: `685a00f` (full SHA available in Git history).
- Published checkpoint local HEAD: `2c7c485b191a0ebf52fbbea8b69a3026db896e80`.
- `git ls-remote origin refs/heads/rebuild/tasks-001-020` returned exactly
  `2c7c485b191a0ebf52fbbea8b69a3026db896e80` after the normal push.
- GitHub file API confirmed `src/components/layouts/useHandbackHold.ts` exists
  at the published implementation ref `685a00f` before marking DONE.
- This status-only follow-up will also be pushed and SHA-checked; product code
  and the successful verification results remain unchanged. Task 003 not started.

## Corrective checkpoint — Tasks 001 and 002 review

Status: DONE — normal push and GitHub publication verified.
Baseline local/remote: `8244663dfd7629759d051bfbd7e1e020e59a31b8`.
Read PR #2 review comments `6331168405` and `6331273512` before implementation.

### Corrections

- A durable global device latch (`grimoire_audience_protected`, value `1` only)
  is written and read back before PlayerFacingScreen mounts any private content
  or preparation information. No IDs, names, roles, effects or snapshots are
  copied into it. Unmount/reload never clears it.
- App route entries and fresh GameScreen mounts check the latch before mounting
  privileged children. A pending or unknown non-null marker restores only the
  existing neutral ReturnDeviceScreen. A fresh 1,000 ms hold is required.
- Back/popstate, Main Menu/Continue-equivalent navigation and other routes cannot
  bypass the latch; changing routes during recovery resets the hold.
- Interrupted actions/callbacks are discarded. Recovery does not change the game
  or audit history. Normal completion still uses existing save-before-publish.
- Marker read, write, read-back and release failures fail closed through the
  existing storage boundary. Recovery offers no automatic marker-clear retry.
- Explicit blank/non-string/undefined/null/padded player IDs and duplicate IDs
  are rejected. Omitted IDs remain compatible with legacy creation. Identified
  assignments reject unknown targets and incomplete output rather than creating
  phantom players or silently dropping seats.

### Verification

- Targeted: 68 tests / 5 files passed (new recovery/setup tests plus previous
  handback, identity and assignment regressions).
- Full Vitest: 504 tests / 58 files passed.
- Typecheck, production/PWA build, Prettier and git diff --check passed.
- React DOM coverage: reload during role reveal/ReturnDevice and private night
  reveal/ReturnDevice; restart with marker; route/back/menu/continue protection;
  recovery hold cancellation; unchanged saved game/history; marker read/write/
  silent-write/read-back/release failures; unknown marker; invalid/duplicate/
  unknown IDs. Actual setup components use touch events for reorder, duplicate
  names, rename, backward navigation and independent persisted assignments.
- Browser validation: NOT RUN — no Chromium/Chrome executable installed locally.
  React/jsdom remounts simulate reload/restart, not native runtime validation.
- Hosted CI and native validation: not executed/claimed. Existing Radix dialog
  description, Browserslist age and bundle-size warnings remain non-fatal.
- Task 003 NOT STARTED. Mark this checkpoint DONE only after normal push,
  matching local/remote HEAD and GitHub retrieval of the published commit.

### Corrective checkpoint publication evidence

Implementation/local HEAD: `ba6e9ef4fa0da11217f96543f284fefdaca99086`.
Verified remote branch SHA after normal push:
`ba6e9ef4fa0da11217f96543f284fefdaca99086`.
GitHub file retrieval at that exact commit confirmed the durable audience
protection implementation before marking DONE. This follow-up records status
only and is also pushed/verified. Task 003 remains NOT STARTED. No merge or
force-push; the original Task 001 bundle and previous commits remain intact.

## Task 003 — first-night role revelation gates

Status: DONE — normal push and GitHub publication verified.
Starting local/remote HEAD: `313f211e8b024bdbea022e77739c3bd7b3ee4840`.

- Shared history-based progress by stable player ID gates both primary button
  and GameScreen handler; unrevealed players have an explicit disabled reason.
- Separate skip dialog gives current remaining count with EN/ES singular/plural
  copy, cancel and explicit confirmation. Cancel/reload does not modify saves.
  Confirmation uses normal save-before-publish transition exactly once and does
  not create false revelation records. Private/stale callbacks cannot bypass the
  existing persistent audience guard.
- Re-show is explicit, uses protected handback and records no duplicate history
  or unchanged save. New revelation remains committed only after hold/save.
- Added 20 focused React DOM tests. Targeted: 88 tests / 6 files passed.
  Full suite: 524 tests / 59 files passed. Typecheck, production/PWA build,
  Prettier and git diff --check passed.
- Browser/native validation NOT RUN: Chromium/Chrome not installed; no actual
  native runtime execution. Hosted CI not claimed. Existing non-fatal warnings
  unchanged. Tasks 001/002 regression suite preserved.
- Task 004 NOT STARTED. Publish normally, compare local/remote SHA and retrieve
  the commit through GitHub before marking Task 003 DONE.

### Task 003 remote delivery evidence

Implementation/local HEAD: `d06a4b843065cc401a9e415c0ecbe842832004f8`.
After normal push, `git ls-remote origin refs/heads/rebuild/tasks-001-020`
returned exactly `d06a4b843065cc401a9e415c0ecbe842832004f8`.
GitHub file retrieval at this exact SHA independently confirmed the published
RoleRevelationScreen implementation before marking DONE. This documentation-only
follow-up is also pushed and SHA-verified. Task 004 remains NOT STARTED.

## Task 004 — final setup review

Status: DONE — normal push and GitHub publication verified.
Implementation commit: `4571e93`.
Starting local/remote HEAD: `f878144db24a43f9a00802e3b06dea0c5c684a8a`.

- Storyteller review summarizes localized script/count, numbered clockwise seats,
  team composition, custom pool versus selected roles, and manual/random plan.
- Assignment planning is separate from resolution. No resolve/create/save on
  opening, leaving or revisiting review. Only explicit final confirmation runs
  the unchanged resolver, creates once and saves before pointer/navigation.
- Edit actions preserve stable IDs and compatible assignments; count/script
  changes clear downstream choices, character changes prune incompatible roles
  and deleted players cannot leave stale assignments. Back from Assignments
  preserves manual edits. Task 003 gating and persistent audience guard retained.
- Added 22 tests and updated existing real wizard identity coverage. Targeted:
  110 tests / 7 files passed. Full suite: 546 tests / 60 files passed.
- Typecheck, production/PWA build, Prettier and git diff --check passed.
- Tested double submission, final ID/role correspondence, larger custom pools,
  Demon guarantee, actual touch reorder/rename, edits/invalidation, all assignment
  modes, EN/ES placeholders, game/pointer persistence failure and save ordering.
- Browser/native validation NOT RUN: no Chromium/Chrome executable installed.
  React/jsdom tests are not real-browser/native validation. Hosted CI not claimed.
- Existing warnings documented in the task: custom RoleSelection nested buttons,
  Grimoire description, old Browserslist data and advisory large bundle size.
- Task 005 NOT STARTED. Publish and verify local/remote SHA plus GitHub access
  before marking Task 004 DONE.

### Task 004 remote delivery evidence

Implementation SHA: `4571e93144b4ca0d1591492f34e8f3c0874e704d`.
Published local HEAD and verified remote branch SHA:
`63290afc20e60bfa3125759f41d5c0c1ade82d0a`.
GitHub file retrieval at this exact commit confirmed setupPlan.ts; PR #2 metadata
independently confirmed the same head SHA and draft status before marking DONE.
This documentation-only follow-up is also pushed and SHA-verified. No Task 005
work started, no main changes, merge or force-push.

## Task 005 — core interaction hardening

Status: DONE — normal push and GitHub publication verified.
Baseline local/remote: `fdd000c1f068c81b290d48711c50905e30c37938`.
Implementation: `1b7cdcbc9f587d73fbafb2ed44ee85410bfc15a2`.

- Explicit EN/ES End Day dialog covers blocked/unblocked outcomes and canonical
  current/next rounds. Cancel/dismiss saves nothing; snapshot-bound one-shot
  confirmation rejects stale callbacks, preserves resolution/victory and saves
  before publishing. No execution/history/persistence model rewrite.
- Shared non-mutating Fisher–Yates replaces both random-comparator sorts while
  preserving generator distribution/scoring/presets, manual roles, multiplicity,
  Demon guarantee, custom pools and clockwise player identities.
- Done · Review is offered only for completed meaningful current-night summaries;
  existing read-only dialog remains private and never reopens completed actions.
  Starting information and follow-ups retain their original lifecycle.
- PublicDeathEntry/toPublicDeaths allow only playerId/playerName for all four
  death callers. Private authoritative roles remain intact; animation/progression
  retained; no broad PublicGameState feature introduced. Floating Storyteller
  controls remain hidden during public death/dawn display.
- Added 43 targeted tests / 2 files; full suite 589 tests / 62 files passed.
  Typecheck, production/PWA build, Prettier and git diff --check passed.
- Browser/native validation NOT RUN: no installed Chromium/Chrome; jsdom is not
  native/E2E validation. Hosted CI not claimed. Existing non-fatal warnings and
  separately tracked Task 004 pointer-write risk recorded in task document.
- Task 006 NOT STARTED. Next: push normally, compare exact local/remote SHA,
  retrieve published commit on GitHub, then record DONE in verified follow-up.

### Task 005 remote delivery evidence

Implementation SHA: `1b7cdcbc9f587d73fbafb2ed44ee85410bfc15a2`.
Published checkpoint local and remote branch SHA both equal:
`a8412533b0d2cf27d6a4446a25ad55ab41412621`.
GitHub file retrieval confirmed publicDeath.ts at that exact commit, and PR #2
metadata independently returned the same head SHA with draft status true before
marking DONE. This documentation-only follow-up is also pushed/SHA-verified.
No Task 006 work, main change, merge or force-push.
