# Weekend playtest release — W01

Branch: `release/weekend-2026-10-31`, based on original Task 007
`64ff60b428859ec992f2a227737bfaacbd9b8199`.

## Deployment

This branch alone triggers its Pages workflow. Main, the rebuild branch and PR #2
are preserved. Set repository Settings → Pages → Build and deployment → Source
to GitHub Actions. If the github-pages environment restricts deployment branches,
allow `release/weekend-2026-10-31`. The workflow uses Node 22, npm ci, the full
suite, typecheck, and a production build at `/Blood-on-the-Clocktower/`.

Expected URL: https://gwen-silva.github.io/Blood-on-the-Clocktower/
A URL is only considered released after a successful deployment and browser check.

Local development uses `/` as before. To reproduce the Pages build in PowerShell:

```powershell
$env:VITE_BASE_PATH='/Blood-on-the-Clocktower/'
npm ci
npm run tc
npm test
npm run build
npm run preview -- --host 127.0.0.1
```

The PWA caches the application shell and icons. Service-worker updates wait for
all application windows to close; there is no forced refresh or new update UI.
Keep this release frozen during a live session unless a blocking defect requires
a fix. Game data remains local to the browser profile and origin; use the same
installed app and device. No save format or storage changes were made.

## Android installation and preflight

1. Open the release URL in Chrome on Android while online.
2. Wait for the page to finish loading. Use Chrome menu → Add to home screen →
   Install (wording varies). Launch Grimorium from its new icon.
3. Before the real session, make a disposable five-player Trouble Brewing game;
   complete review, role reveals and handback, night actions, day, nomination,
   vote and execution. Return to the menu and reopen it.
4. Reload and verify the privacy gate, then close the application. Enable airplane
   mode, launch the installed app again, reopen the sample and continue playing.
5. Confirm the app works offline on the actual device before depending on it.
   Restore connectivity after the preflight. Keep the device charged.

Do not clear site data, switch profiles/origins, or uninstall during the session.

## Known limitations

- Transferable Backup/Restore is absent. Browser storage is the only copy of games.
- Android hardware, touch gestures, OS installation and offline cold launch need
  an actual-device preflight; desktop checks cannot establish these.
- Interface languages are English and Spanish; no PT-BR release is added here.
- Existing Task 004 pointer-write limitation remains; no broad gameplay changes.
- Google Fonts is an existing optional network dependency; offline uses CSS
  fallback fonts. No telemetry, login, backend or game networking was added.
- npm ci reports 21 dependency audit findings (4 low, 5 moderate, 11 high,
  1 critical). No emergency dependency upgrade or claim of a clean audit.
- Existing unit tests emit dialog-description and nested-button warnings; tests
  still pass. This release does not claim complete rules or accessibility coverage.

## Validation checkpoint

- npm ci: PASS using the committed lockfile.
- npm run tc: PASS.
- npm test: 655 tests / 64 files PASS (includes legacy placeholder tests; the
  total is not a claim that each test provides substantive behavior coverage).
- npm run build: PASS at root and the Pages project path.
- Formatting and git diff --check: PASS.
- Deployed browser, manifest, service-worker and offline checks: recorded in the
  final W01 delivery report, after the deployment is available.
