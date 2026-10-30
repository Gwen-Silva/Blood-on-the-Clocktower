# W03 — Mobile UX and night guidance

Release branch: `release/weekend-2026-10-31`.
Baseline: `6e0f7d3a657c3965b7646b317a753f5059da6dd8` (W02).

## Mobile operation

Player Reference, Grimoire, History and language selection now occupy a dedicated
layout row. The game uses the remaining viewport with its own scrolling region;
secondary tools no longer float over character rows or primary buttons. Setup
and the main-menu library also reserve space for language selection.

Back controls have localized accessible names and 44px minimum targets. Public
reference list and detail navigation is above the title/card. Details offer Back
to the catalog and an explicitly labelled Return to Storyteller. Character arrows
occupy a separate row instead of overlaying the card. Returning still requires
the unchanged W02 one-second hold and durable audience latch.

Night-action Back returns to the dashboard without committing provisional
selections. Continue/Confirm remains the way to record an action. Modal headers
reserve room for Close, and modal bodies account for the bottom safe area.
Mobile cards can grow with their text instead of clipping at a fixed aspect ratio.
Artwork, backgrounds and the visual palette are preserved.

## Night guidance

The dashboard explains Next, Done and Proceed to Day. Each active character's
steps and private choice/configuration screens provide operational instructions,
an explicit next step and expandable registration/malfunction notes. Player
reveals and public role cards receive a separate static ability explanation.
No actual players, alignments, effects or assigned roles are passed to public
guidance. No new scheduling or resolution code is introduced.

English and Spanish guidance covers Washerwoman, Librarian, Investigator, Chef,
Empath, Fortune Teller, Spy, Poisoner, Monk, Ravenkeeper, Undertaker, Butler and
Imp. Later-night and triggered abilities are described as such. The existing
wake order, evil starting information, mechanics and history are untouched.

For the Librarian:

1. Open Select Players in private.
2. If eligible Outsiders exist, choose two candidates and the permitted Outsider
   character, then confirm. Otherwise review the offered No Outsiders result.
3. Wake the Librarian and show only the prepared player-facing result.
4. Complete protected handback, put the player to sleep and continue with Next.

The static fictional example is “One of Alice or Bob is the Saint.” It is clearly
labelled as an example, never a result invented for the current game. Five players
normally start with zero Outsiders, but Baron setup, Spy/Recluse registration and
drunkenness/poisoning must be considered. Follow only options actually offered by
the engine. The existing picker may not expose every legal optional registration
or zero-result combination; the private note identifies this as a separate
Storyteller ruling rather than promising automatic support. Do not change real
roles or fabricate saved information to work around an unavailable option.

Rule checks used the existing role definitions, InfoRoleNightAction, perception
and malfunction handling, plus the official character pages:

- https://wiki.bloodontheclocktower.com/Librarian
- https://wiki.bloodontheclocktower.com/Spy
- https://wiki.bloodontheclocktower.com/Washerwoman
- https://wiki.bloodontheclocktower.com/Investigator
- https://wiki.bloodontheclocktower.com/Chef
- https://wiki.bloodontheclocktower.com/Empath
- https://wiki.bloodontheclocktower.com/Fortune_Teller
- https://wiki.bloodontheclocktower.com/Poisoner
- https://wiki.bloodontheclocktower.com/Monk
- https://wiki.bloodontheclocktower.com/Ravenkeeper
- https://wiki.bloodontheclocktower.com/Undertaker
- https://wiki.bloodontheclocktower.com/Butler
- https://wiki.bloodontheclocktower.com/Imp

## Validation

npm ci, typecheck, 669 tests in 65 files, the Pages-path production build,
Prettier and git diff --check pass. Six new tests cover shared tools/public
unmounting, Librarian zero and candidate guidance, provisional Back/save safety,
and separate localized player instructions. Existing W02 hold, audience recovery,
legacy saves, player identity and role reveal tests remain green. Old wizard tests
now target the accessible Back control instead of assuming the first button is Back.

Real Chromium 149 mobile emulation at 360x800, 390x844 and 412x915 exercises setup,
all role reveals, reference list/details/handback, History, Grimoire/player details/
effect editor, Night 1 Librarian zero information and Chef, Day 1 nomination/voting/
execution, Night 2, saved-state reload and browser Back privacy. Screenshots and
hit-testing verify CTA access, >=44px targets and absence of horizontal overflow.
A separate six-player browser game checks actual Librarian candidate selection
and a public-safe result. Spanish desktop static-reference rendering is checked.
Publication evidence and final production browser results are recorded in the W03
delivery report after GitHub Pages deployment; a local build alone is not delivery.

## Android preflight and limits

Physical Android validation and installed-PWA presentation for W03: NOT RUN.
W02 handback success on the physical device is reported by the user, not a new
agent-run device test. Desktop Chromium emulation cannot establish Android behavior.

1. Between sessions, close every Grimorium window and reopen online to activate
   the new waiting service worker. No forced reload was added.
2. Check that tools are above the screen and do not obscure Start Night or Proceed
   to Day; scroll through all players and confirm Back/Return positions.
3. In a disposable game, follow Librarian Select Players, the appropriate result
   and protected handback. Inspect registration notes before making an edge ruling.
4. Test early release and a full one-second touch hold. Browse the public reference,
   use browser Back and reload; verify the privacy gate remains enforced.
5. Reopen a saved game and test offline launch on the actual device.

Do not clear site data or uninstall: transferable Backup/Restore remains absent.
Existing dependency audit findings, optional online Google Fonts (offline falls
back to system fonts), known pointer-write limitation and existing React test
warnings are unchanged. No PT-BR locale or Tasks 008–020 work is included.
