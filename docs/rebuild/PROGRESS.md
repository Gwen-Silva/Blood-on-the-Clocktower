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
