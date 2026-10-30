# W02 — Android touch handback hotfix

Baseline: a7b1eceea8b2d19813a50b91796d76ce49b1e471.

The W01 contextmenu handler prevented the native menu but also canceled an
active hold. A contextmenu at 500 ms therefore reset progress and prevented
completion. The new regression fails on W01 and passes with this change.

Real desktop Chromium 149.0.7827.55 with Pixel 7 Android/touch emulation confirms
the failure with a real touch plus an explicitly injected contextmenu: W01
never completes; W02 completes exactly once after at least 1000 ms. Plain native
emulated long press succeeds on both versions and does not generate contextmenu
in this Chromium build. Thus the cancellation defect is reproduced in a browser,
but the physical Android event sequence remains unconfirmed.

Changes are limited to the hold hook, return screen and regressions:

- Prevent contextmenu without treating it as finger release.
- Keep pointer capture, out-of-bounds checks and all release/cancel/capture-loss,
  blur, visibility and unmount cancellation. Prevent focus-induced scrolling.
- Disable native WebKit callouts/selection on the control, retaining touch-action
  none and user-select none.
- Remove the separate progress element. Keep the in-button visual fill and
  associate the one-second hold hint with the button for assistive technology.
- Keep the duration at 1000 ms and the once-only callback guard. No click bypass.

Validation: npm ci, typecheck, all 663 tests across 64 files, production Pages-path
build, Prettier and git diff --check pass. ProtectedHandback now has 31 tests
(previously 23), including touch + contextmenu, no standalone progress, menu
alone, early touch release, touch cancellation, capture loss and out-of-bounds
movement. Existing role reveal, player reference and reload protection pass.

Real Chromium emulation also passes touch cancellation, early release, outside
movement, explicit capture release, mouse and Space/Enter hold checks. Test
fixtures are temporary and excluded from the release; no browser test route is
published. No game rules, saves, storage or player data are changed.

Physical Android installed-PWA verification: NOT RUN. The reporter must still
confirm that the installed app advances past handback on the affected device.
If Chromium emits a real pointercancel, cancellation intentionally remains safe;
this patch does not turn a canceled contact into a successful hold.

After deployment, close all Grimorium windows and reopen online to let the
waiting service worker activate. If still seeing the old extra progress bar,
close all windows and reopen again. Do not clear site data or uninstall: saves
are local and Backup/Restore is still unavailable. Check a disposable game,
including an early release and a full one-second touch, before resuming play.
