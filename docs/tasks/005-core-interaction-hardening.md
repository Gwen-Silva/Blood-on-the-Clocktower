# Task 005 — Core Interaction Hardening

Status: DONE — published and independently confirmed on GitHub.
Baseline: `fdd000c1f068c81b290d48711c50905e30c37938`.
Implementation: `1b7cdcbc9f587d73fbafb2ed44ee85410bfc15a2`.

## End Day confirmation

Day's End Day control now requests a Storyteller-only application dialog. EN/ES
copy identifies the blocked player or explicitly states no execution is scheduled,
explains existing resolution/victory behavior and names current Day/next Night.
`getNextNightRound` is shared with startNight, preserving its exact numbering.

Opening/cancel/Escape/close change only UI state. Confirmation is bound to the
same game and Day screen snapshot, is consumed before resolution and rejects
stale/repeated callbacks. Existing execution, victory, startNight/auto-skips and
save-before-publication paths remain unchanged. Failed saves do not publish the
proposed death or Night UI. No history marker/new persistence format is added.

## Unbiased shuffle

One small non-mutating Fisher–Yates utility accepts a controlled RNG. Both random
comparator sorts in role assignment and generator pool sampling now use it.
Player seats, manual assignments, multiplicities, random Demon guarantee,
official distributions, custom pools, chaos scoring and preset min/mid/max
selection remain intact. The separate Demon recipient selection is unchanged.

## Done · Review

Completed night-action rows offer Done · Review / Hecho · Revisar only when the
current-night recorded summary contains meaningful content. Empty/whitespace
summaries remain Done and disabled; pending actions cannot expose old summaries.
Review uses the existing Storyteller-only dialog and never reruns an action,
mutates state or saves history. Starting-information/follow-up lifecycle remains
unchanged. Existing audience protection still excludes the dashboard during
player-facing stages; public death/dawn stages do not expose floating private
controls or action-review UI.

## Public deaths

`PublicDeathEntry` has only `playerId` and `playerName`. `toPublicDeaths` explicitly
projects these two fields without spreads. All four controller paths use it:
night deaths, Virgin nomination execution, deferred End Day execution and day
action pipeline deaths. DeathRevealScreen accepts no role/effects/history data.
Authoritative private roles remain intact. Existing flip timing and progression
are retained. This does not introduce the broader PublicGameState/Task 006 flow.

## Verification

- New targeted coverage: 43 tests / 2 files passed (27 React DOM interaction/DTO
  tests and 16 shuffle/generator tests).
- Full Vitest: 589 tests / 62 files passed, including all Tasks 001–004 regressions.
- Typecheck, production/PWA build, Prettier and git diff --check passed.
- Confirmation coverage: blocked/unblocked, current/next rounds, cancel/Escape/
  close no-ops, double confirmation, retained callback after leaving/returning to
  Day, save failure/order, EN/ES, execution victory and peaceful Mayor victory.
- Shuffle coverage: frozen inputs, multiplicities, deterministic order, all six
  equally weighted three-item permutation paths, official 5–15-player pool
  distribution/chaos/presets, manual IDs/seats, Demon and larger custom pools.
- Review coverage: recorded summary, no rerun/save, empty/whitespace output,
  pending prior-night exclusion, EN/ES, starting info/follow-ups, audience guard.
- Public DTO coverage: hostile private markers, exact runtime keys on all four
  actual controller paths, type-level key allowlist, private role preservation,
  no Storyteller controls, death flip and sequential progression.
- Real browser/native validation NOT RUN: no Chromium/Chrome executable available;
  React/jsdom is not Chromium E2E or native execution. Hosted CI not claimed.
- Existing non-fatal warnings remain: nested custom role-selection buttons,
  Grimoire dialog description, Browserslist age and advisory large bundle size.
  The separately tracked Task 004 pointer-write risk was not refactored.

Publish implementation/documentation and verify matching local/remote HEAD plus
GitHub access before marking DONE. PR #2 stays draft; Task 006 is not started.

Publication verified before DONE: local and remote checkpoint SHA
`a8412533b0d2cf27d6a4446a25ad55ab41412621`; GitHub file retrieval and draft PR #2
metadata independently confirmed this SHA. Status-only follow-up is separately
pushed and verified. No product changes after successful validation.
