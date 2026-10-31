# Task 013 — Safe Vote Correction

Release baseline: `9cc88ac24039c8f70244b1e4088f5a78867579cb` on
`release/weekend-2026-10-31`.

## Private Storyteller workflow

History → **Correct latest vote / Corrigir última votação / Corregir última votación**.
Review the nominee, recorded tally, previous execution lead/benchmark and exact
restoration explanation. Cancel writes nothing. Explicit confirmation saves the
correction first, then reopens the existing VotingPhase for the same nominee.
The original nomination remains recorded and is not consumed again.

Voters start unselected so the Storyteller explicitly reviews individual votes.
Existing ghost-vote and Butler validation is shared unchanged with the domain
validator. Lowering the master's hand still lowers the living Butler's hand.
A ghost vote spent by a cancelled tally is restored, with all original previous
effect instances intact. Re-recording a genuine ghost vote consumes it once.

A saved pending correction resumes the same nominee after reload or backup
restore. Back opens the private audit with a Resume action; it does not create
another nomination or silently reinstate the cancelled tally. Independent day
controls are unavailable until this replacement tally is completed.

## Logical operations and strict eligibility

The private completed-vote handler tags new records with version 1 narrator
metadata: operation ID, ordered constituent event IDs, part index, predecessor
and original nomination ID. The normal tally plus its optional tie event are
one complete operation. Both tie entries must match the metadata, flags, count,
threshold, nominee and resulting snapshot exactly.

Eligibility requires the latest complete operation with no subsequent event,
the same day, a validated original nomination and nominee, valid unique voter
IDs and unchanged preceding state. Before/after snapshots are validated against
the exact vote transition, including only the proper ghost-vote markers. Missing,
unknown, inconsistent, partial or duplicated metadata is rejected; no backwards
search or legacy inference is performed. Legacy votes remain readable/effective
but never become automatically correctable.

A correction appends `vote_corrected`, identifying its logical operation and all
constituent event IDs, then restores an independent exact clone of the pre-vote
snapshot. Raw history is never truncated, reordered or rewritten. The correction
is not itself correctable; a newly recorded replacement vote is a distinct
operation and may qualify independently.

## Raw audit versus effective gameplay

`inspectVoteHistory` validates supported operations/corrections in order and
excludes cancelled vote consequences from the effective lead and qualifying
benchmark. `getBlockStatus`, `getVoteBenchmark`, execution at day end, UI previews
and public voting projection use this effective result. The redundant raw tie
scanner at execution was removed so a cancelled tie cannot suppress execution.
Nomination-use scanners keep the original raw nominations. The private history
retains and displays the original tally, tie and correction for audit.

Malformed cancellation records never cause arbitrary history to be ignored.
Save validation rejects invalid supported metadata; public projections fail
closed. Public output does not include voter IDs, private effects or correction
metadata, and existing night privacy boundaries remain unchanged.

## Shared safety and compatibility

Task 012 and Task 013 reuse the same confirmation component, persisted-value
equality and `saveGameIfUnchanged` atomic save path. A correction and a repeated
tally refuse to overwrite a changed stored game. No visible correction, new
voting screen or new tally is published before a successful save. Quota failure
leaves previous bytes and current displayed correction state intact; the error
requires reload/review rather than an automatic stale retry.

Controls are confined to private stable Storyteller history, with live game/screen,
audience latch, pipeline and unresolved-confirmation checks. Public Reference,
private character reveals and Spy sessions have no correction controls. Duplicate
submissions and stale operation IDs are refused.

The version-1 save/backup envelope is unchanged. Existing saves and Task 016
backups remain importable. New backups preserve original vote/tie records,
cancellation metadata, restored effects and pending replacement voting. Reading
legacy data performs no migration write. Backups containing the new event require
this release or a later compatible reader; older builds reject unknown events.
Language and current-game preference keys are not written by corrections/import.

## Validation and publication

Unit coverage includes leading/failed/tied/replacing votes, lower/higher replacement
tallies, exact ghost restoration and one-time reuse, Butler restrictions,
nomination preservation, later events, malformed groups/cancellations, duplicate
correction, stale storage, simulated quota failure, public projection, effective
execution, reload and backup round trips. All Task 012 tests remain in the suite.
Chromium mobile tests run at 360×800, 390×844 and 412×915 and exercise actual
nomination/voter controls, confirmation/cancel, reload/resume, effective tie
execution, stale confirmation/submission, failure, backup and public privacy.

Run npm ci, the full unit suite, typecheck, production build, Prettier and diff
checks, then the complete Chromium regression suite. Publish normally only to the
release branch; verify local/remote SHA, independent GitHub retrieval, successful
Pages workflow and the public build identifier/assets. Physical Android and an
installed standalone PWA on the user's device are **NOT RUN**.

Tasks 014 and 015 are not implemented. Nomination and End Day corrections remain
outside scope; execution reads were changed only to respect cancelled votes.
