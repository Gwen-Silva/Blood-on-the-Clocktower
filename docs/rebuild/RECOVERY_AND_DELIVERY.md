# Recovery and durable-delivery contract — Tasks 001–020

Status: REBUILD REQUIRED. The original local commits are unavailable. This branch starts from the authenticated upstream `main` SHA `1eea4381a8138fcfea181b9f256d33185d737d83`. It is **not** a recovered implementation.

## Non-negotiable delivery rule

**A task is not DONE when a local commit exists.** For each bounded feature or checkpoint:

1. Implement it with meaningful regression coverage.
2. Run targeted tests, `npm run tc`, `npm test`, `npm run build`, Prettier on changed files, and `git diff --check`. Add native checks when applicable.
3. Commit the changes, including a brief progress record.
4. Push to `origin/rebuild/tasks-001-020` (or an explicitly agreed durable remote feature branch).
5. Fetch/inspect the remote branch and compare `git rev-parse HEAD` to `git ls-remote origin refs/heads/rebuild/tasks-001-020`. Report both hashes.
6. Only **after hashes match**, mark the checkpoint DONE.

If push/remote verification fails, mark the checkpoint BLOCKED, preserve a verified self-contained Git bundle accessible to the user if possible, and stop further implementation. **Never report a task complete when only its local commit exists.** Do not silently change remote or continue developing in an ephemeral unpushed checkout.

Keep `main` untouched. No force pushes, destructive resets, automatic merges, or replacement of remote history. Keep a draft PR against `main` as a durable review entry point.

## Recovery constraints

- Check once for any accessible authentic source snapshots/diffs, including the reported `botc-partial-recovery.zip`, before reimplementation. This artifact is partial and not a complete baseline.
- If exact historical source cannot be recovered, **reimplement equivalent requirements**. Do not claim the original commits or code were restored.
- Treat the old SHA `4fb8bc42f3c6861c0e3ca6784d582f11c2e3555c` only as historical evidence, not an attainable checkout ref.
- Work from the actual checked-out code. Never apply undocumented patches speculatively.

## Product invariants

Storyteller-first, local/offline Grimorium fork. Trouble Brewing 5–15 players. Keep existing artistic style. Preserve EN/ES and add complete PT-BR. The Brazilian translation for Imp is **Diabrete**. Game engine state and full audit history are private; public surfaces use strict allowlist projections. Private/public device handback must be protected with an intentional one-second press-and-hold before the Storyteller UI can reappear. Fail closed at audience boundaries.

Maintain stable player identity separate from name, fixed clockwise seating, save-before-UI-publication, validated versioned saves, compatibility with supported legacy saves and non-mutating recovery when storage is unreadable. Corrections append audit records and restore authoritative snapshots; no generic destructive undo. Never infer missing correction metadata in historical saves. No new gameplay editions, cloud state, tracking or Companion/network mode.

## Ordered rebuild milestones

Implement in small independently pushed checkpoints. The itemized feature requirements below summarize the original project plan; consult any available original task reports/specifications before implementing each area.

### Wave A — Core private gameplay reliability (Tasks 001–005)

1. **001 Stable player identity and clockwise order:** immutable player IDs independent of duplicate names, consistent seating and navigation.
2. **002 Protected handback:** one-second intentional press-and-hold to reveal Storyteller-only UI again; preparation/player-facing/return states remain private.
3. **003 First-night role revelation gates:** complete initial role reveal before entering the first night, without accidental information leakage.
4. **004 Setup final review:** explicit confirmation of assignments before start; changes/save safety tested.
5. **005 Flow/UI hardening:** explicit End Day confirmation, shuffle and setup-review completion safeguards, public death DTO with no roles/secret fields.

### Wave B — Strictly public information and Storyteller tools (Tasks 006–011)

6. **006 PublicGameState:** positive allowlist DTO projector, never expose roles, assignment, effects, private histories or raw game snapshots.
7. **007 Player Reference:** list full script character references, *not* player-to-character assignments.
8. **008 Quick Rules:** safe public game explanation.
9. **009 Town Square:** public alive/dead status, current block/vote benchmark, nominations and ghost-vote status from public DTO only.
10. **010 Public History:** sanitized chronology, deduplicated tied outcomes, no secret/private event leaks, protected return.
11. **011 Storyteller Almanac V1:** Storyteller-private script/character reference with limited game context, no claim of complete rulings.

### Wave C — Safe limited corrections and backups (Tasks 012–016)

12. **012 Manual effect/edit correction:** only eligible most recent simple manual edit, append-only correction and exact prior snapshot, save-before-publish.
13. **013 Vote correction:** correct latest eligible vote and its consequences; recompute public block/benchmark without truncating audit.
14. **014 Nomination correction:** latest eligible simple nomination, release consumed participants and restore nomination state; fail closed for unsupported historical records.
15. **015 End Day correction:** explicit `day_closed` boundary for newly recorded transitions; restore entire end-day batch, including execution consequences, game-over/night-start/automatic skips. Ineligible after subsequent real night action/information delivery. Filter corrected events from effective history *and* public projections while preserving raw audit.
16. **016 Backup & Restore:** canonical JSON export for all saved games; import validation, preview, explicit Replace / Keep Both / Cancel; one atomic batch write; new game ID only for conflicts, internal player/history/correction IDs unchanged, current-game pointer preserved.

### Wave D — Localized Android distribution foundation (Tasks 017–020)

17. **017 PT-BR:** complete central and distributed UI/role/effect localization for all currently registered content (original report: 23 roles and 17 effects), locale-aware dates, browser language mapping, structural keys and placeholder parity. Use **Diabrete**, not Capeta.
18. **018 Android Capacitor foundation:** Capacitor core/Android/CLI **8.5.3**, app ID `com.gwensilva.grimorium`, app name `Grimorium`, bundled `dist` assets, no remote `server.url`, generated tracked `android/` project, reproducible `cap sync android`, existing Web/PWA intact.
19. **019 Android runtime hardening:** protected native Back, safe areas/SystemBars, keep-awake during GameScreen, native JSON share export using cache; preserve Web export/import. Reported plugin versions: App 8.1.2, Filesystem 8.1.4, Share 8.0.3, Keep Awake 8.0.1. No broad storage permission. Simulated native tests cannot substitute for runtime.
20. **020 Android compile and CI:** Node 22+ (Node 24 also acceptable), JDK 21, SDK/platform 36, debug `assembleDebug`, Android lint, clean-checkout reproducibility and CI on pushes/PRs. The previous run reported 716 Vitest passes and successful native compile, but all device/emulator smoke scenarios were **NOT RUN**. Do not claim device validation without an actual Android device/emulator.

### Then — Task 021 (not part of restoration baseline)

Only once the reimplemented Tasks 001–020 are **all pushed, remotely verified, and regression-green**, implement real Chromium Playwright E2E, mobile responsive inspection, UI privacy checks, backups and CI. Do not substitute browser tests for native Android device validation.

## Required engineering discipline

- Inspect current code and tests before each wave. Use feature-local code and minimal refactoring.
- For history corrections, test effective history semantics, snapshot restoration, vote/nominations, abilities reading history (including Mayor, Undertaker, Ravenkeeper), game-over boundaries and save failures.
- For public state, test non-disclosure with hostile private fixtures; test no private data reaches serialized DTOs or public history.
- For persistence, test legacy/unknown version, interrupted writes, import conflicts, errors and atomicity.
- For i18n, test complete translations, roles/effects and placeholder parity in EN/ES/PT-BR.
- For native: compile/lint in actual supported SDK/JDK; report emulator/device smoke checks as PASS/FAIL/NOT RUN and leave release readiness blocked if NOT RUN.
- Do not chase an exact test count by creating empty tests. Original completed report was ~716 tests over 72 files; reimplementation quality matters more than matching this number.

## Progress and final reporting

Update `docs/rebuild/PROGRESS.md` for each pushed checkpoint with: scope, tests, compile/build status, local SHA, **matching remote SHA**, CI status (configured vs actually executed), and known gaps. Commit/push this progress record with the checkpoint or as a verified immediate follow-up.

At the end, report a linked draft PR, branch HEAD with confirmed remote SHA, final test counts, native build/lint outcome, exact remaining Android runtime gaps and a clear statement that the features were **reconstructed**, not that missing historical commits were recovered.
