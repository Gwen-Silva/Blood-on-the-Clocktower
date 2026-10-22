# Reconstruction progress

| Checkpoint                | Status      | Remote HEAD verified                | Tests/build                              | Notes                                             |
| ------------------------- | ----------- | ----------------------------------- | ---------------------------------------- | ------------------------------------------------- |
| Initial delivery contract | DONE        | Pending final verification in setup | Not applicable (no product code changed) | Original source not recovered; baseline `1eea438` |
| Tasks 001–005             | NOT STARTED | —                                   | —                                        | Gameplay/setup safety                             |
| Tasks 006–011             | NOT STARTED | —                                   | —                                        | Public surfaces/Almanac                           |
| Tasks 012–016             | NOT STARTED | —                                   | —                                        | Corrections/backup                                |
| Tasks 017–020             | NOT STARTED | —                                   | —                                        | PT-BR/Android/CI                                  |
| Task 021                  | BLOCKED     | —                                   | —                                        | Only after 001–020 restored and pushed            |

For each delivered checkpoint, record task numbers, test totals, build status, local commit SHA, remote branch SHA after push, and any missing real-device/CI execution. No local-only completion may be marked DONE.

## Task 001 — stable setup identity (implementation checkpoint)

Status: IMPLEMENTED; publication verification pending.

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
- Next: verify this commit remotely, then Task 002 protected handback.

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
