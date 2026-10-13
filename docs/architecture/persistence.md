# Persistence and recovery

## Commit boundary

`GameScreen.tsx` saves through `updateGame()` before calling `setGame()`. Failed saves set an error and return false; callers stop the screen transition. `App.tsx` similarly promotes storage errors into render for `StorageBoundary`. Save successfully before publishing new game state to the UI.

Only complete [action results](game-engine.md#provisional-actions-and-pending-input) may be saved. Bookkeeping and intent consequences commit together. Pending components, staged games and callbacks exist in memory and are not serialized. Closing/reloading during a decision restores the last committed game, leaving the action available to perform again; it does not restore the unfinished choice. Do not persist a `night_action` entry before its intent finishes. Unrelated edits must stay unavailable while resolution is pending.

## Keys and format

`src/lib/storage.ts` stores the whole collection under `grimoire_games` in `localStorage`; `grimoire_current_game` stores the selected game ID separately. `saveGame()` reads, replaces/appends by ID, validates and writes the collection. The two keys are separate writes, not a multi-key transaction.

`src/lib/saveFormat.ts` owns parsing and serialization:

- Reads accept legacy bare `Game[]` and `{ version: 1, games: Game[] }`.
- Reading legacy data performs no migration write. The next normal save uses version 1.
- Parsing checks game/history/state/message structure, event/phase/team values, finite numbers and duplicate game/player IDs. It is not complete rules validation: role/effect/script IDs are checked as strings, not against registries.
- Malformed JSON, invalid structures and unknown envelope versions are rejected. Unknown versions need explicit migration support, never a forced cast.
- Missing collection storage (`null`) means no games. Unreadable or invalid storage does not mean an empty collection.

Do not overwrite rejected data or silently discard invalid entries to make a save succeed.

## Errors and recovery

`GameStorageError` distinguishes `read`, `invalid` and `write` errors, with optional backup text and retry callback. Read-access failures surface as errors. Invalid collection data is preserved as backup. Failed collection writes carry the attempted serialized collection and a callback retrying that write; the previously stored value remains intact in covered failed-write scenarios. Current-game-key failures do not carry a collection backup.

`src/components/StorageBoundary.tsx` displays localized recovery UI. Available backup text can be downloaded as JSON. Retry runs the failed operation and reloads on success; another failure keeps recovery visible. Errors without a retry offer reload. Recovery does not silently reset storage.

Recovery copies contain private history and characters. The download is a safeguard, not a general import/export feature. Corrupt data is not automatically repaired and no general import UI currently exists.

Game data remains local, with no analytics integration. Preserve that requirement unless explicitly changed. Cover the edge cases in [testing and verification](../development/testing-and-verification.md#persistence-changes).
