# Task 004 — Final Setup Review

Status: DONE — published and independently confirmed on GitHub.
Baseline: `f878144db24a43f9a00802e3b06dea0c5c684a8a`.

## Behavior

The Storyteller setup wizard now follows Players → Script → Characters →
Assignments → Review Setup → Create Game. A small shared wizard plan holds
stable player IDs, clockwise seats, selected script/pool and manual assignments.
RoleAssignment emits manual choices rather than resolving random roles.

Review displays localized script/player totals, numbered seats, character counts
by team, exact selection versus larger custom pool, all-random/mixed/all-manual
mode and each seat's manual role or explicit pending-random status. Opening,
leaving or revisiting review does not resolve assignments, create or save games.

Edit actions return to the existing wizard steps. Rename/reorder preserve IDs and
compatible manual roles. Player-count changes clear characters and manual choices;
script changes clear both; character changes retain only assignments whose roles
and multiplicity still fit. Deleted IDs are removed from the assignment plan.
Returning from Assignments also preserves its manual edits. Existing character
selection is restored when revisiting that step.

Only Create Game validates and resolves the final plan. Validation checks player
identity/count, known script characters, pool/manual capacities and official
script distribution using existing composition helpers. The existing resolution
algorithm is unchanged, including custom pools and random Demon guarantees.
A synchronous submission latch prevents resolving/creating twice. Game save
precedes current-game pointer and navigation. Storage failures use the existing
recovery boundary and preserve earlier games. A pointer-write failure may leave
the new game successfully saved, but does not navigate or change the old pointer.

Existing persistent audience guard, protected hold and first-night revelation
gates remain in place. No persistence format or gameplay rules were changed.
EN/ES review text and interpolation are included. PT-BR/Android are out of scope.

## Verification

- 22 new tests; existing real wizard identity regression updated to explicitly
  pass through Review and Create Game.
- Targeted: 110 tests / 7 files passed, including Tasks 001–003 regressions.
- Full Vitest: 546 tests / 60 files passed.
- Typecheck, production/PWA build, Prettier and git diff --check passed.
- React DOM coverage includes localized composition/counts/seats/team grouping,
  pending random seats, all three modes, larger custom pools, invalid plans,
  repeated review without resolver/create/save calls, assignment preservation,
  actual touch reorder and rename from Review, player deletion, script/character
  invalidation, final ID/role mapping, custom Demon guarantee, double submission,
  successful role-revelation gating, game/pointer write failures and operation
  ordering, plus review exclusion while the audience latch is pending.
- Browser/native validation NOT RUN: no Chromium/Chrome executable installed.
  These are React/jsdom tests, not real-browser or Android execution.
- Existing warnings: custom RoleSelection contains nested buttons; the existing
  Grimoire dialog lacks a description; Browserslist data is old and the main
  production chunk exceeds Vite's advisory size. Checks pass; no broad UI changes
  were made to address unrelated warnings. Hosted CI execution not claimed.

Publication evidence belongs in docs/rebuild/PROGRESS.md. Mark DONE only after
normal push and matching local/remote SHA. Task 005 remains NOT STARTED.

Verified implementation: `4571e93144b4ca0d1591492f34e8f3c0874e704d`.
Published checkpoint local/remote SHA: `63290afc20e60bfa3125759f41d5c0c1ade82d0a`.
GitHub file retrieval and draft PR #2 metadata independently confirmed publication
before marking DONE. Final status documentation is pushed and verified separately.
