# Task 002 — Protected Storyteller Handback

Status: DONE — published to rebuild/tasks-001-020 and verified on GitHub.

## Scope

Require at least 1,000 ms of continuous mouse, touch or keyboard pressure on
ReturnDeviceScreen. Ordinary clicks must never execute the return callback.
Early release, pointer cancellation, leaving the target, lost pointer capture,
focus loss, window blur, visibility changes and unmount cancel pending attempts.
Each attempt starts from zero; completion fires once. Use real elapsed time for
enforcement, with visible progress and explicit EN/ES instructions.

Preserve the centralized preparation → private content → neutral return →
protected hold → Storyteller lifecycle. Remove private content before return.
Keep Storyteller controls/overlays inaccessible throughout the private stages.
Audit callback fallbacks; fail closed where the private boundary is missing.
Preserve Task 001, game rules and save-before-publication behavior.

## Implementation

- Local handback hook enforces elapsed monotonic time, cancellation and one-shot
  completion; Space/Enter use the same threshold as pointer input.
- Return control retains native button semantics with a filling background,
  native progress indicator and explicit localized instructions/status.
- PlayerFacingScreen always routes handback through ReturnDeviceScreen, even
  when no player name/preparation screen is supplied. Missing HandbackContext
  raises an integration error instead of immediately executing private callbacks.
- Audience registration occurs before paint. GameScreen hides privileged controls,
  closes retained overlays and prevents the Grimoire opening during handback.
- No per-role hold implementation, engine/persistence change or gameplay feature.
- jsdom is a development-only dependency for real React DOM interaction tests.

## Verification

- Targeted: 42 tests passed across handback, setup identity and assignment files
  (23 handback/privacy tests, 19 Task 001 regressions).
- Full Vitest: 478 tests passed across 56 files.
- Typecheck, production/PWA build, Prettier and git diff --check passed.
- Interaction coverage: clicks/taps, 999/1,000 ms boundary, reset, cancellation,
  bounds/capture, blur, hidden page, unmount, repeat attempts, touch/mouse,
  Space/Enter, missing provider, nameless wrapper, EN/ES instructions.
- Integration coverage uses the real role reveal and Empath night action;
  GameScreen saves completion only after valid hold, hides private content first,
  and closes a previously opened Grimoire throughout the private lifecycle.
- Browser validation: NOT RUN — no local Chromium installation detected.
- Native validation: NOT RUN; Android packaging is outside this task.
- Existing warnings: Grimoire Radix dialog lacks a description; production build
  reports outdated Browserslist data and a large application chunk. No test,
  typecheck or build failure.

Publication evidence is recorded in docs/rebuild/PROGRESS.md. Task 003 must not
start before this checkpoint is pushed and its remote SHA verified.

Published checkpoint verified: local and remote
`2c7c485b191a0ebf52fbbea8b69a3026db896e80`. The implementation commit was
independently confirmed through GitHub file retrieval before marking DONE.

## Corrective review checkpoint — durable audience protection

Status: VERIFIED LOCALLY — publication pending. Original Task 002 delivery above
was incomplete with respect to reload/resume privacy (PR #2 review 6331273512).

A separate minimal localStorage latch now survives React unmount, reload and
app restart. It is verified before mounting player content and is cleared only
by protected hold. Route-level and fresh-game guards restore a neutral screen
while it is pending. No interrupted action is committed and no game/history is
modified by recovery. Storage errors fail closed. A global latch intentionally
protects the device across Main Menu, Continue and unrelated routes.

The accompanying Task 001 corrections reject explicit invalid IDs, unknown
manual targets and incomplete assignments, while keeping omitted legacy IDs.
The real setup wizard regression covers duplicate names, touch reorder, rename,
backward navigation, independent assignments and persisted seating/identity.

Verification: 68 targeted and 504 total tests passed; typecheck, production/PWA
build, Prettier and diff check passed. No real-browser or native validation was
performed. Publication evidence and final status belong in PROGRESS.md.
