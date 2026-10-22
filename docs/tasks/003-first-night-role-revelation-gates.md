# Task 003 — First-Night Role Revelation Gates

Status: VERIFIED LOCALLY — publication pending.
Baseline: `313f211e8b024bdbea022e77739c3bd7b3ee4840` on
`rebuild/tasks-001-020`.

## Requirements and implementation

- Initial role revelation is derived exclusively from committed `role_revealed`
  history and current player IDs, independent of duplicate display names.
- `getRoleRevelationProgress` supplies both screen and controller with revealed
  IDs/count, remaining count and completion. Primary Start Night 1 is disabled
  with an explicit explanation while players remain unrevealed. GameScreen also
  rejects ordinary premature calls, wrong phases/screens and private audience
  stages. Existing persistent audience protection is reused unchanged.
- Separate Skip Role Revelation opens the existing application dialog primitive.
  EN/ES singular/plural copy states the current remaining count and explains
  that confirmation starts Night 1 without showing those roles. Cancel, Escape
  and dialog close only dismiss UI. They do not save or append history.
- Confirmed skip follows normal startNight/processAutoSkips and save-before-UI
  publication, without marking unrevealed players complete. One-shot guards
  prevent duplicate transition on repeated activation. Skip disappears after all
  current players are revealed; ordinary start then needs no extra confirmation.
- Revealed rows explicitly offer re-show. All views retain preparation, private
  reveal, neutral return and one-second hold. `markRoleRevealed` is idempotent;
  re-show does not append history or re-save unchanged game data.
- New revelations commit only after protected hold and successful save. Reload
  rebuilds progress from saved history, dismisses transient confirmation and uses
  the existing persistent audience guard if private revelation was interrupted.
- No assignments, save format, night abilities, Android packaging or PT-BR changed.

## Automated verification

- 20 new React DOM tests exercise zero/partial/all progress, duplicate names and
  history duplicates/unknown IDs, direct premature handler invocation, stale
  start/skip callbacks during private reveal, singular/plural EN/ES dialogs,
  cancel/escape/reload without mutation, current counts after another revelation,
  one transition on double confirm, save-before-publish, protected new/repeat
  revelation, private reload and failure to save ordinary start/skip/revelation.
- Targeted: 88 tests passed across 6 files including Tasks 001/002 regressions.
- Full suite: 524 tests passed across 59 files.
- Typecheck, production/PWA build, Prettier and git diff --check passed.
- Browser validation: NOT RUN — no Chromium/Chrome executable installed locally.
  Tests use real React DOM/jsdom components and fake timers; they are not native
  or Chromium validation. Hosted CI execution not claimed.
- Existing non-fatal Radix description, Browserslist age and large-chunk warnings
  remain unchanged. No failing checks.

Remote publication must be verified before marking DONE. Evidence is recorded
in `docs/rebuild/PROGRESS.md`. Task 004 is not started by this checkpoint.
