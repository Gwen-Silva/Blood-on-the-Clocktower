# Task 006 — Strict PublicGameState Projection

Status: DONE — normal push and independent GitHub verification completed.

Baseline: `f804315f3e6617d843622d402d5ace5906156940` on
`rebuild/tasks-001-020`. Reconstructed implementation; no recovery claim for
original lost commits. No Task 007 work.

## Exact public contract

`src/lib/publicGameState.ts` exports public types independently of private engine
unions. Consumers can import these types without importing Game/GameState.

```ts
type PublicPhase = 'setup' | 'night' | 'day' | 'ended'
type PublicPlayerState = {
  id: string
  name: string
  seat: number
  alive: boolean | null
}
type PublicBlock = { playerId: string; voteCount: number }
type PublicVotingState = {
  threshold: number
  benchmark: number
  block: PublicBlock | null
}
type PublicGameState = {
  id: string
  scriptId: 'trouble-brewing' | 'custom' | null
  phase: PublicPhase
  round: number
  players: PublicPlayerState[]
  voting: PublicVotingState | null
  winner: 'good' | 'evil' | null
}
```

Every field and nested object is constructed explicitly. No private object
spreads, filtering serializers, generic data dictionaries or shared references.
Projection reads committed snapshots only; it has no storage, timer or RNG side
effects. There is no new public screen/context/navigation payload in this task.

## Authoritative derivation

| Field                | Source and validation                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| id                   | Nonempty game ID; game name/dates are excluded                                                                         |
| scriptId             | Known script allowlist; unknown values become null                                                                     |
| phase, round         | getCurrentState; known phase and nonnegative safe integer                                                              |
| players.id/name/seat | Explicit scalar copies in canonical player-array order; seats start at 1; duplicate names remain distinct by unique ID |
| players.alive        | isAlive over validated effects; unknown effects shape gives null                                                       |
| voting.threshold     | getVoteThreshold over current committed Day state                                                                      |
| voting.benchmark     | getVoteBenchmark over validated current-Day history                                                                    |
| voting.block         | getBlockStatus, copied to playerId/voteCount only                                                                      |
| winner               | Ended only; townsfolk becomes good, demon becomes evil, otherwise null                                                 |

During Night, life status comes from the matching committed night_started
snapshot located by the existing canonical findLastEventIndex scanner (now
exported). Private night deaths/resurrections are not announced early. Missing
or malformed matching boundary gives unknown life (`null`), not a guessed result.
Day start exposes the new committed life status. Phase/round do not expose night
steps, action completion or information delivery.

Voting is available only during Day with valid life information and a matching
day_started boundary. Current-Day vote records must contain canonical numeric
counts/thresholds, known nominee IDs, valid flags and compatible Day snapshots.
Unknown/incomplete/corrupt optional vote records make the entire voting summary
null. Validation does not reconstruct block logic: canonical helpers remain the
source of results. A tie correctly yields block null and a retained benchmark.
New Day boundaries reset previous voting results normally.

Invalid required identity/state structure throws a generic PublicProjectionError
without embedding confidential input. Empty history retains the engine's empty
setup defaults. No save format, persistence, voting or nomination rule changes.

## Exclusions and existing public displays

No assigned roles, individual teams, raw effects/source IDs, ability targets,
choices/results, poison/drunk/protection, Demon bluffs, registration, private
messages/params, history, stateAfter snapshots, audit data, votedIds, arbitrary
metadata, living-player canVote or private night status are returned. Public
winner does not reveal individual team membership. Game name is not public.

Ghost-vote state and nomination participation are intentionally deferred to Task
009 rather than publishing speculative values in this foundational DTO. Town
Square, Public History, Player Reference and Quick Rules are not implemented.
This UI/data boundary is not encryption against deliberate localStorage access.

DawnScreen previously accepted the entire private GameState merely to resolve
names. It now accepts PublicDeathEntry[] (playerId/playerName), round and its
existing continuation callback. GameScreen projects deaths through the existing
toPublicDeaths allowlist. DeathRevealScreen and all four Task 005 construction
paths retain their strict DTO. Private state and existing display/progression
remain intact.

## Verification

- 43 new projector tests: exact runtime key sets and serialization; hostile role,
  team, effect/source/target/result/choice, private rich text/params, bluffs,
  snapshots and nested metadata sentinels; late private role/effect changes;
  independent duplicate-name seats; all phases; Night death confidentiality;
  thresholds, block, ties/retained benchmark; unknown and incomplete records;
  winner normalization; deep-freeze/no mutation; fresh references; deterministic
  output; no storage/RNG/timers; canonical saved-game JSON round trip.
- 2 new React/jsdom tests verify the real GameScreen dawn boundary, hidden
  Storyteller controls, duplicate-name announcements and normal continuation.
- Targeted run: 72 passing tests across publicGameState/CoreHardening (45 new,
  27 retained Task 005 tests). Full suite: 634 tests / 63 files passed. Typecheck, production/PWA build,
  Prettier and git diff --check passed.
- Browser/Chromium and Android/native validation NOT RUN. jsdom is not browser
  E2E. No installed Chromium/Chrome in this environment; this task adds no UI.
- Existing unrelated warnings (large bundle, stale Browserslist and pre-existing
  nested-button/dialog warnings) are not fixed speculatively. Task 004 partial
  pointer-write limitation remains separately tracked.

## Delivery

Implementation SHA: `0fe2e5361362b7de2efe9551dcf2e09946b83500`.
Documentation and remote verification SHAs are recorded in
`docs/rebuild/PROGRESS.md`. DONE requires normal push, exact local/remote SHA
comparison and independent GitHub confirmation. PR #2 remains draft; main is not
modified and no merge/force-push is performed.

Published checkpoint: `b205e684b06f0e31e18ea3f58a21432a2ac644e3`.
Local HEAD and git ls-remote matched exactly. GitHub returned publicGameState.ts
at that exact commit; PR #2 metadata independently confirmed the same head and
draft=true. This status-only follow-up is also pushed and SHA-verified.
