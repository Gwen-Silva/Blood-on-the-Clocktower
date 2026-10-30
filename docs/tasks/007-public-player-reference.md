# Task 007 — Public Player Reference

Status: BLOCKED — implementation verified locally; GitHub terminal authentication unavailable.

Baseline: `f1ed58315107a58fffd227254ae21fcbadb05b44` on
`rebuild/tasks-001-020`. Preserves reconstructed Tasks 001–006; no Task 008 work.

## Static public content and contract

PlayerReference receives exactly:

```ts
{
  scriptId: PublicGameState['scriptId']
  onReturnToStoryteller: () => void
}
```

GameScreen obtains scriptId from projectPublicGameState(game). No Game,
GameState, players, history, assignments, selected pool, effects or game-action
callback is passed to the reference. Its one completion callback only closes the
presentation after the shared handback. Public script membership never indicates
an assigned identity or a character confirmed in play.

The reusable RolesLibrary reads SCRIPTS[scriptId].roles and static registered role
metadata/translations. Trouble Brewing displays all 22 catalog characters and
Custom all 23 registered catalog characters (including Villager), regardless of
setup selections or current assignments. Four team groups, per-team counts and
total count remain static. Unknown/null script IDs show localized unavailable
copy, with protected return and no guessed catalog.

Existing RoleCard presentation is reused. The reference adds complete localized
ability description text in detail, list/detail/back and previous/next-character
navigation. Explicit EN/ES introduction explains that possible characters are
not confirmed characters in play. All new labels are translated; Spanish uses
the existing Cuentacuentos term. Main-menu RolesLibrary retains its ordinary
route-based browsing and does not acquire an audience latch.

## Audience and navigation

- Labeled entry on normal setup-action overview, initial revelation overview,
  Night dashboard and Day, plus their private History view when applicable.
  No entry during an active setup/night/day action, nomination/voting, pending
  pipeline, private handoff, dawn/death announcement or game-over screen.
- Reference is local presentation state, not a new browser route. Opening clears
  Grimoire, History and pending End Day confirmation, then unmounts privileged
  controls/overlays. The underlying game and screen remain unchanged.
- Uses existing PlayerFacingScreen with no playerName. Its layout effect writes
  and verifies the persistent global audience latch before mounting public
  content. No separate hold timer or immediate-return fallback exists.
- Detail Back returns to the catalog. Catalog Return requests shared neutral
  ReturnDeviceScreen, removing catalog content before handback. Only its valid
  continuous 1,000 ms hold invokes the presentation-close callback.
- Reload, app remount, browser popstate and route changes encounter existing
  App/GameScreen AudienceRecoveryBoundary before mounting Storyteller content.
  Recovery is neutral, not an automatic continuation of an interrupted action.
- Protected return restores the previous in-memory Storyteller screen. Reload
  intentionally restores the normal committed game screen after recovery hold.
  Previously opened overlays stay closed in both cases.

Browsing writes only the pre-existing protection marker. It does not save games,
change current-game identity, append history, advance phases, resolve abilities,
mark revelation or alter player roles/effects. No persistence format or game-rule
changes. This is the existing audience UI boundary, not localStorage encryption.

## Verification

21 new React/jsdom tests cover:

- Complete Trouble Brewing/Custom catalog, four team counts, localized EN/ES
  names/ability descriptions/introduction, safe unknown-script fallback.
- Detail/list/handback navigation and standalone RolesLibrary regression.
- Actual GameScreen setup/revelation, pre-setup-action, Night and Day entry;
  unavailable entry while a real night-action screen is pending.
- Runtime prop keys and TypeScript prop contract; script ID comes through the
  public projector. Hostile duplicate-name players, effects/source/config,
  secret history messages, bluffs and targets never appear in public DOM/props.
  Unselected/unassigned characters remain present in the public catalog.
- Grimoire/History close before browsing and remain closed after return;
  Storyteller controls are absent through list, detail and neutral handback.
- Ordinary click rejected, 980 ms release rejected/reset, 1,000 ms succeeds;
  earlier screen restored with identical saved game/history and zero save calls.
- Reload during catalog and handback; popstate to menu, navigation to Roles and
  back to Continue's game route cannot bypass the durable marker. Recovery hold
  does not commit interrupted actions or save the game.

Results:

- Targeted: 84 tests / 3 files passed (21 new PlayerReference, 20 existing
  revelation gates, 43 existing public projector tests).
- Full suite: 655 tests / 64 files passed, preserving all 634 prior tests.
- Typecheck, production/PWA build, Prettier and git diff --check: passed.
- Chromium/Chrome browser validation: NOT RUN; no installed browser executable.
  jsdom tests do not establish real-browser layout or E2E validation.
- Android/native validation: NOT RUN; no native work in this task.
- Hosted CI: not executed/claimed. Existing stale Browserslist, bundle-size and
  unrelated pre-existing test warnings remain outside this task. The separately
  tracked Task 004 partial pointer-write limitation is unchanged.

## Publication

Implementation SHA: `64442823c2cd07b263b72fe965625f323cc96d65`.

Implementation and documentation are separate commits. Delivery evidence goes in
`docs/rebuild/PROGRESS.md` after normal push, exact local/remote SHA comparison and
independent GitHub file/PR verification. Task stays pending until then. PR #2
remains draft; main is untouched; no force-push or merge.

### Publication blocker

Normal push failed with `fatal: could not read Username for 'https://github': No
such device or address`. GitHub CLI 2.103.0 reports no logged-in GitHub hosts.
Implementation is not published and must not be considered DONE. Independent
PR #2 lookup confirms remote HEAD is still the Task 006 baseline
`f1ed58315107a58fffd227254ae21fcbadb05b44`, with draft=true.

Implementation commit: `64442823c2cd07b263b72fe965625f323cc96d65`.
Documentation checkpoint: `befe828b60dcdccee4159ec286fe2c0a5e567190`.
A verified self-contained `grimorium-rebuild-task007.bundle` preserves the branch,
including this blocker record and all Tasks 001–007 commits. No Task 008 started.
Resume delivery using authenticated normal push and matching-SHA/GitHub checks;
do not recreate the implementation or force-push.
