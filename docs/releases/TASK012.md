# Task 012 — Safe Manual Effect Correction

Release baseline: `36afa7e9d46b470e08f1f0cdc384255efadf5cbe` on
`release/weekend-2026-10-31`.

## Supported scope

The private Storyteller manual-effect handlers now attach versioned metadata to
new additions, removals and configuration updates. This records the operation,
preceding event ID and target player's exact effect arrays before/after the edit.
Complete prior game state remains in the existing preceding history snapshot;
it is not reconstructed from effect names or inferred for legacy events.

Open private **History → Correct latest adjustment**, review the player, effect,
restoration explanation and latest-only restriction, then explicitly confirm.
PT-BR: **Histórico → Corrigir último ajuste**. EN, ES and PT-BR labels, explanations,
errors and correction history messages are localized.

Only the very last event can qualify. Eligibility requires a recognized manual
operation/version, narrator source, matching event type, valid prior snapshot,
matching predecessor and before/after effect arrays. The resulting state must be
exactly the expected manual operation, including existing engine cleanup of
source-dependent effects when a manual dead marker is added. Any unrelated
snapshot change, later event, ambiguous metadata or no-op makes it ineligible.
There is no backwards search and no generic Undo.

Legacy events without this explicit metadata remain readable but uncorrectable.
Repeated correction is refused: the appended correction event is not itself an
eligible manual effect edit. A subsequent new manual adjustment may qualify.
A latest manual dead marker may cause a computed victory summary after reload;
its existing private History entry can still correct that marker when no
game-ended event was recorded, then returns to the restored phase. A recorded
game-ended event is never corrected.
Votes, nominations and End Day are not correction targets; Tasks 013–015 are out
of scope. Earlier events, votes and block state remain intact.

## Append-only restoration

Confirmation appends a new `effect_corrected` event identifying the original
manual event, player, effect and operation. Existing entries are never removed,
reordered or rewritten. The new state is an independent exact clone of the prior
snapshot, retaining original effect IDs, configuration, expiration, source,
ordering and unrelated state. Restoration does not run effect cleanup again or
invent replacement instances. The ordinary history renderer displays both the
original adjustment and its correction. Existing public projection uses the
corrected state while retaining night privacy boundaries; metadata is not public.

## Save and privacy safety

Before saving, the current stored game must still match the game the Storyteller
confirmed. The complete collection is saved in one atomic storage write before
publishing the corrected game to React. Failure leaves the displayed game and
prior stored bytes intact, shows a localized error and disables stale retry.
There is no deferred automatic retry. Current-game selection and language are
not written by this flow.

The action is provided only by GameScreen's private history branch in stable
Storyteller views. Pending pipelines, player-facing screens, public Reference,
private role reveals, Spy viewing and a set audience latch cannot offer or commit
a correction. Confirmation also checks the live game/screen and privacy latch.
The control does not add an action to the shared Spy Grimoire component.

## Save/backup compatibility

Existing save envelope version 1 and legacy arrays are unchanged; no migration
write is performed on read. The recognized event union adds `effect_corrected`.
Task 016 backups from before Task 012 remain importable. New backups preserve
manual metadata, the complete original audit trail and the corrected snapshot.
A backup containing the new event requires a release that recognizes it; older
application builds safely reject that unknown event rather than coercing it.

## Verification and publication

Coverage includes add/remove/update, duplicate effect instances, exact optional
fields in live snapshots, IDs/data/source/expiration/order, collateral source
cleanup, stale confirmation/storage, no-op edits, malformed/unknown metadata,
legacy refusal, every later event type, repeated correction, prior votes/block,
quota failure, reload/continued play, old/new backup round trips, localized
confirmation/history, duplicate clicks and public projection privacy.

Real Chromium mobile tests exercise the actual private effect editor, explicit
confirmation/cancel, append-only history, saved reloads, failure before visible
completion, later End Day eligibility rejection, real backup download/restoration,
public Reference, private role reveal and Spy viewing/reload privacy. The matrix
uses 320×568, 360×800, 390×844, 412×915 and desktop 1400×900. Physical Android
and installed standalone PWA testing are **NOT RUN**.

Run npm ci, full tests, TypeScript, production build, Prettier and diff checks.
Publish only the release branch using normal HTTPS Git push; verify exact local
and remote SHAs, independent GitHub retrieval, successful Pages deployment and
public build/assets. Preserve main, rebuild and draft PR #2. Final test counts,
commit and deployment evidence are in the delivery report.
