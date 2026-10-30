# Phase 10 developer handoff

Baseline: `4cd16af9e8f9a40dab5163d3f65a2af3ce58f894`.
Owner-approved narrow follow-up, not another redesign or public release.
Coordinator PLAN/phase-ledger amendments are preserved.

**Initial candidate received CHANGES REQUIRED; corrections are under verification.**
The initial evidence below is retained; see the developer response at the end.
No commit, push, deployment, dependency, shared-service or question-content change.

## Acceptance map

| Requirement                                    | Implementation and evidence                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New generated mixes are temporary              | `Preparation.accept()` no longer inserts proposals into `custom`. Explicit editor saves/imports still do. `workspace.test.js` and `final-export.test.js` verify acceptance/start/recovery/export/exit with an empty saved-pack list, then explicit import persistence.                                                                                |
| Safe legacy cleanup                            | Owner-approved selective removal in Options and preparation; no inferred automatic deletion. Existing export/confirmation/reinclude controls are reused. Only the selected copy is removed from the stored library; it remains exportable in memory until reload.                                                                                     |
| Preserve unrelated data and failures           | Library raw-byte comparison rejects concurrent replacement. Failed removal rolls back the inclusion choice. Startup malformed/newer/read failures never authorize writes. Tests retain other custom packs, bundled packs, preferences and game recovery through removal, quota, denied-read and changed-record cases.                                 |
| Final export for both finished and early exits | Three actions: Save and return, Return without saving, Cancel. Save processes the click-time deadline transition, initiates complete JSON download, then clears recovery. Download/deletion failures retain game and localized dialog. Tests include won-state host reopening, expired questions, retry and actual browser download/reimport.         |
| Protected recovery                             | Ordinary departure requires `Recovery`'s private write permission and compares stored bytes. Repeated exit cannot delete a protected original. Recovery's separately explicit Discard stored game path remains available, including startup without an active game. Save-time comparison prevents an overdue tick overwriting another tab's record.   |
| Dialog/lifecycle safety                        | Existing `mountGameDialog` owns final departure. Input settings separately abort their owned handlers and revoke readiness synchronously before native close. Disposed callbacks cannot export/delete. Existing P9-IR1 native close-gap and fresh-release regressions remain intact. Timers continue behind the modal.                                |
| Back/Controls spacing                          | A targeted 1rem margin on `.device-controls`; browser geometry verifies at least 12px separation. No layout redesign.                                                                                                                                                                                                                                 |
| Two simple recorded bindings                   | Exactly two player rows, current binding, Record, status/cancel, concise errors and safe edge feedback. No key dropdown, device selector or button-index input. Physical Left/Right Shift remain distinct defaults.                                                                                                                                   |
| Fresh capture and replacement                  | One keyboard-or-gamepad union per player; recording displaces the prior kind. Held/repeated/stale events and the initiating Enter/Space do not record. Escape, blur, hidden state, disconnect and disposal cancel. Duplicate rejection retains the old binding and remains visible after release. No capture timeout was introduced.                  |
| Portable controls and rebind                   | Input preferences and complete-game envelopes are v2. Valid v1 keyboard records/files migrate without changing names/colors/progress/deadlines. Controller choice stores a button, never a connection identity. Reload/import/disconnect require explicit re-recording; touch remains usable.                                                         |
| Board navigation                               | Any connected standard-mapped pad can navigate without a duel assignment. D-pad/left stick share native keyboard row-major focus semantics; A/Enter confirm playable cells. Neutral/phase/modal/focus gates, hysteresis and bounded repeat prevent hold replay. No navigation during answering/duels/victory or while form/header controls own focus. |
| Existing presentation/rules/content            | Guided UI, themes/languages, deadline rules, ownership, continuous seven-symbol duels and full-initial flips remain. All 36 packs / 1,008 entries are byte-identical to baseline.                                                                                                                                                                     |

## Historical provenance decision

The original library schema stores `{schemaVersion: 1, packs, preferences}`.
Pack validation stores no automatic-versus-explicit library origin.
Historical `Preparation.accept()` called the same `add()` used by import and
editor save. Exporting and explicitly reimporting a generated pack produces
identical serialized library packs, including question attribution.

Baseline executable equality proof:
`.artifacts/phase-10-origin-probe.log` — one passing test, run before changes.
The scratch probe was removed; `final-export.test.js` retains the equality
fixture and selective-preservation regression.

The owner explicitly approved: **“Preserve ambiguous old entries; provide
selective removal (recommended)”**. PLAN records this superseding decision.
There is deliberately no destructive migration, title heuristic or deletion
based on question origins. This is a known format limitation, not an unimplemented
automatic-cleanup promise. Confirmed game departure never removes a library pack:
new mixes were never inserted, while an older matching pack might be an explicit
custom copy. Removal from Saved decks actually writes the smaller storage record;
it is not merely hiding an entry.

## Formats, controls and resource ownership

- Library/pack schemas remain v1. Domain games remain v2. Existing localStorage
  key names remain unchanged; their validated envelope versions distinguish data.
- `hexy.inputs.v1` now contains `{schemaVersion: 2, bindings: {A, B}}`.
  Each binding is `{kind: "keyboard", code}` or `{kind: "gamepad", button}`.
  Complete `hexy-game` v2 uses the same `bindings`; v1 `keys` remain readable.
  Gamepad button indexes are integers 0–63; the actual connected button must
  exist when recorded. Duplicate keyboard codes or the same live pad/button
  cannot bind both players. Separate controllers may use the same button.
- Keyboard recording accepts physical letters, digits, punctuation, Shift,
  Space and ordinary numpad keys. Tab, Enter, arrows, Escape, function keys
  and Ctrl/Alt/Meta shortcuts are reserved. Browser commands and editable inputs
  are not intercepted outside explicit capture.
- Controller connection tokens exist only in `DuelGamepads`, never preferences,
  portable files or recovery. A missing controller offers a small **Record**
  action in the interrupted duel, opening the same two-row dialog. This avoids
  the dead end of leaving to Options and importing a file that correctly clears
  connection identity again. Fresh press/release readiness is required afterward;
  neither recording nor rearming awards a tile. Touch can rearm/play without
  restoring the controller.
- Standard mapping: D-pad 12/14 backward, 13/15 forward; axes 0/1 use dominant
  left-stick direction, activation 0.6/release 0.3. Initial repeat delay 350ms,
  subsequent delay 110ms, observed on the existing 16ms poll. A/button 0 confirms
  only a focused playable cell; without a focused cell it first focuses one.
  All pads' edges are updated before at most one action per poll. Nonstandard
  mappings can record duel buttons but cannot navigate.
- `BindingRecorder` owns capture subscriptions/snapshots; `InputSettings` owns
  binding preferences and its modal; `BoardNavigation` consumes the existing
  injected-clock poll and shares `moveBoardSelection` with keyboard input.
  There is no second polling loop, new dependency or generic input framework.
  `Navigation` owns departure orchestration instead of growing `App` further.
- Download initiation is observable; successful disk storage is not. Concurrent
  replacement is detected by raw-byte comparison, not merged. Use one editing tab.

## Verification

Final production code is unchanged after these targeted corrections:
initial browser probes exposed the separate startup-recovery discard callback
and test assumptions about localized text/poll quantization. The startup callback
now uses the explicit protected-original path; regression coverage includes
startup without a game. Repeat tests allow the next 16ms observation after the
350ms threshold, and rebind tests explicitly supply a neutral observation after
modal closure. Existing P9-IR1 tests still exercise the native close gap without
waiting it away.

The first complete Chromium attempt exposed two older catalog journeys that
implicitly reused an accepted mix after confirmed exit. That attempt was stopped.
The related five catalog/preparation/editorial journeys now explicitly reselect
saved copies or reimport their actual exported file before acceptance; exact
question/answer/rights assertions remain. They also verify a temporary mix is not
relisted before import. All five focused regressions pass. Production code did
not change for this test-contract correction.

The next complete Chromium run finished **362 passing / 3 failing** journeys.
Two quota-recovery tests expected a failed reinclusion to remain included,
contrary to the new safe rollback; they now assert that the copy stays excluded
and the durable library remains unchanged. One custom-color journey likewise
assumed an exited number proposal survived and now explicitly regenerates and
accepts it. These three focused regressions pass without production changes.
The failed run is retained in
`.artifacts/phase-10-chromium-contract-failures.log`.

Commands actually completed:

```sh
TMPDIR="$PWD/.artifacts" npm run check
node .artifacts/phase-10-coverage-probes.mjs
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" \
  npx playwright test browser/phase-ten.spec.js \
  browser/phase-ten-recovery.spec.js browser/modal-readiness.spec.js
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" \
  npm run test:browser
TMPDIR="$PWD/.artifacts" \
  LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" \
  npx playwright test --config playwright.cross-browser.config.js --project=firefox
sha256sum --check --quiet .artifacts/phase-10-tested-code.sha256
git diff --check
git diff --exit-code 4cd16af9e8f9a40dab5163d3f65a2af3ce58f894 -- src/content
```

- Formatting, ESLint, JavaScript type checking, build and **351 unit tests /
  25 files** passed. Log: `.artifacts/phase-10-check.log`.
- Final focused Chromium: **19 passed**, including native modal races and
  controller rebind/portable-file journeys. Log:
  `.artifacts/phase-10-browser-final-focused.log`.
- Explicit-reuse regressions: **5 passed**;
  `.artifacts/phase-10-preparation-regressions.log`. Focused Firefox:
  **11 passed**; `.artifacts/phase-10-firefox-focused.log`.
- Quota rollback/custom-color regressions: **3 passed**;
  `.artifacts/phase-10-storage-visual-regressions.log`.
- **63 negative probes passed**: each of eight group/metric thresholds and
  removal of every one of the 55 production coverage entries is rejected.
  The measured report was restored byte-for-byte; SHA-256
  `31f4dcb8cc32682cf10218ad98638061a12f00d5602f180007f0f71eab4a61b0`.
  Log: `.artifacts/phase-10-coverage-probes.log`.
- Complete final Chromium: **365 passed (11.7m)**;
  `.artifacts/phase-10-chromium.log`.
- Complete final Firefox: **222 passed (9.0m)**;
  `.artifacts/phase-10-firefox.log`.
- These final quality/probe/Chromium/Firefox commands ran sequentially, with
  unchanged implementation/test bytes. The owned preview responded HTTP 200
  during each engine's run and port 4182 was closed after normal teardown.

### Coverage and structural limits

All **55 runtime modules** are included, including untested sources. The only
source exclusion is type-only `src/domain/types.js`; content JSON/build outputs
are not runtime JavaScript. No runtime exclusions or coverage ignores were added.
Browser success is not claimed as statement coverage.

| Scope               | Lines              | Statements         | Functions        | Branches           |
| ------------------- | ------------------ | ------------------ | ---------------- | ------------------ |
| Critical, 32 files  | 3639/3647 = 99.78% | 3677/3685 = 99.78% | 272/276 = 98.55% | 1162/1200 = 96.83% |
| Remaining, 23 files | 2824/2838 = 99.51% | 2863/2877 = 99.51% | 100/102 = 98.04% | 457/480 = 95.21%   |

Critical membership:

```text
src/app.js
src/domain/actions.js
src/domain/answers.js
src/domain/board.js
src/domain/config.js
src/domain/controls.js
src/domain/duels.js
src/domain/errors.js
src/domain/game.js
src/domain/generation.js
src/domain/outcomes.js
src/domain/packs.js
src/domain/portable.js
src/domain/preferences.js
src/domain/saves.js
src/domain/validation.js
src/runtime/binding-recorder.js
src/runtime/board-navigation.js
src/runtime/buzzer.js
src/runtime/clock.js
src/runtime/downloads.js
src/runtime/gamepad.js
src/runtime/input-settings.js
src/runtime/inputs.js
src/runtime/keyboard.js
src/runtime/library.js
src/runtime/navigation.js
src/runtime/preparation.js
src/runtime/recovery.js
src/runtime/symbols.js
src/runtime/touch.js
src/workspace.js
```

Remaining membership:

```text
src/content/catalog.js
src/main.js
src/messages.js
src/ui/answer-sheet.js
src/ui/application.js
src/ui/board.js
src/ui/catalog.js
src/ui/device-strings.js
src/ui/dom.js
src/ui/editor.js
src/ui/game-dialog.js
src/ui/game.js
src/ui/header.js
src/ui/host.js
src/ui/inputs.js
src/ui/library.js
src/ui/menu.js
src/ui/preparation-strings.js
src/ui/preparation.js
src/ui/recovery.js
src/ui/round.js
src/ui/setup.js
src/ui/strings.js
```

No size/complexity/nesting exceptions: lint enforces production modules ≤300
nonblank/noncomment lines, functions ≤60, complexity ≤10, nesting ≤3.

## Browser and visual evidence

Browser tests operate the real UI/engine with native keyboard input and mocked
Gamepad API boundaries. They cover Enter/Space recording initiation, Escape,
duplicates, held/repeated controls, modal closing, two-controller selection,
owned-cell exclusion, stick hysteresis/repeat, A-as-duel-binding, disconnect,
unassigned portable bindings, actual JSON downloads/reimports, legacy files,
expired deadlines and selective legacy removal.

Opened and visually inspected during final focused Chromium verification:

- `.artifacts/phase-10-options-en-light.png` — visible Back/Controls gap.
- `.artifacts/phase-10-controls-en-light.png` — two compact rows, 1280×720.
- `.artifacts/phase-10-controls-cs-dark.png` — localized portrait layout.
- `.artifacts/phase-10-controller-rebind.png` — 1024×768 real interrupted duel,
  touch alternatives and explicit rebind action; fit/hit-target checks passed.
- `.artifacts/phase-10-final-export-en.png` — three departure actions while
  the deadline has already handed the question to the opponent.
- `.artifacts/phase-10-final-export-cs.png` — localized failed-download dialog
  in 768×1024 dark mode, with reachable actions and readable error.

The controls/options screenshot matrix also includes both other language/theme
combinations. Final full-suite images are preserved separately in
`.artifacts/phase-10-chromium/` and `.artifacts/phase-10-firefox/`.
After the final runs, opened and inspected Chromium's Czech dark controls,
English light Options and English departure dialog, and Firefox's Czech dark
controls, Options and failed-download departure dialog. The two-row controls,
button separation and readable/reachable modal actions fit the pictured
1280×720 and 768×1024 viewports without clipping.

### Reproduction

1. Generate/accept a number mix, start and exit. Cancel preserves the game;
   Save and return downloads its complete file before returning to a fresh menu.
   Reload/reimport the download to recover its locked questions and controls.
2. In Options, use Saved decks to export and selectively remove a legacy copy;
   unrelated copies remain. Open Duel controls, choose either Record row and
   press a fresh key/button; Escape cancels, duplicates retain the old binding.
3. During board selection, use arrows/Enter or a standard controller's
   D-pad/left stick/A. Hold A across a modal/round boundary to verify no replay.
   During a duel, use the recorded binding or the existing touch alternative.

## Initial frozen snapshot

`.artifacts/phase-10-snapshot.sha256` covers **50 changed/new nonignored files**,
including the coordinator's PLAN/phase-ledger amendments and this handoff.
Only documentation changed after the final complete gates. Final
`npm run format:check`, whitespace, tested-code hashes and unchanged-content
checks passed before freezing; formatting log:
`.artifacts/phase-10-final-format.log`.
Verify the frozen bytes with:

```sh
sha256sum --check --quiet .artifacts/phase-10-snapshot.sha256
```

## Limits and next action

No physical Xbox/controller/tablet, human screen-reader, Safari/WebKit or remote
Windows verification is claimed. The phase-8 naming/public-hosting/device/browser/
accessibility follow-ups remain unchanged. The owner-approved color-only ownership
exception remains; no content or legal clearance is expanded.

Independent review and coordinator post-review verification are still required.
The developer stopped editing the initial candidate for review, then resumed
only after the owner's bounded correction request.

## Developer response to initial review

The initial **CHANGES REQUIRED** verdict remains in `reviews/phase-10.md`.
No finding has been independently cleared. Original reviewer executable/config,
probe results and `.artifacts/phase-10-snapshot.sha256` are preserved.

| Finding                   | Bounded correction and regression                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P10-IR1                   | Record synchronously refreshes the existing Gamepad API owner before arming capture. It snapshots current buttons with the existing connection tokens, never creates another poll loop or accepts an edge during that baseline. A between-polls held button retains the old binding until release and a fresh press. Existing keyboard initiator, cancellation, duplicate and disconnect paths remain.                                                                                      |
| P10-IR2                   | A mismatched write-time read now retains the exact observed bytes, including null, while revoking write permission. It does not adopt the replacement game, overwrite it, or grant deletion. Unit cases cover valid/corrupt/future/null replacements, repeated ordinary cleanup and later replacement comparisons. Real browser downloads compare raw bytes directly after write detection, not after Retry or discard.                                                                     |
| P10-IR3 + owner amendment | Quota guidance now names actual Saved decks / Delete and Uložené balíčky / Smazat actions, retaining the no-site-storage-clearing warning. The owner additionally requested a plain Delete/Smazat button beside JSON download, replacing the disclosure. A native confirmation has Cancel/Delete (Zrušit/Smazat), Escape/focus return, and cancellation/navigation-disposal guards. No storage write occurs before confirmation; existing private/read/concurrent/quota protections remain. |
| P10-IR4                   | The contract introduction consistently states pack/library v1, input/portable/domain v2, and supported legacy v1 input/envelope reads.                                                                                                                                                                                                                                                                                                                                                      |

Saved-copy confirmation belongs to the preparation/Options view, where no active
game input is mounted. Its subscriptions and dialog are revoked with that view's
abort signal. The existing active-game `mountGameDialog` helper is unchanged.
Native keyboard adjacency, non-expandable rows, cancellation, exact labels and
actual localStorage deletion are covered in both languages.

Before fixes, the unchanged independent probes reproduced **10 passing /
4 failing** cases in both engines; log `.artifacts/phase-10-rereview-before.log`,
artifacts `.artifacts/phase-10-rereview-before/`. Five newly added focused unit
cases also failed on the original code (one capture case plus four replacement
variants); `.artifacts/phase-10-rereview-unit-before.log`. Selector-excluded tests
were not run in that demonstration; no test is permanently skipped.

### Correction verification completed after disconnect

The new sole coordinator verified the disconnect/tested-code/review-input
manifests before taking ownership. The interrupted browser log is preserved.
Full correction gates were rerun from the beginning, sequentially:

- Chromium: **371 passed (11.9m)**,
  `.artifacts/phase-10-rereview-chromium-final.log`.
- Firefox: **228 passed (9.2m)**,
  `.artifacts/phase-10-rereview-firefox.log`.
- Both owned previews returned HTTP 200 during their runs; port 4182 was closed
  after teardown. Tested-code/review-input hashes and unchanged content passed.
- Before disconnect, the same correction code passed full quality:
  **357 tests / 25 files**, formatting/lint/types/build, **63 negative coverage
  probes**, original independent probes **14/14**, focused Chromium **29/29**
  and Firefox **25/25**. Exact commands/logs and before-fix failures are preserved
  in `.artifacts/phase-10-disconnect-handoff.md`; these runs are developer
  evidence, not coordinator post-review evidence.

| Scope               | Lines              | Statements         | Functions        | Branches           |
| ------------------- | ------------------ | ------------------ | ---------------- | ------------------ |
| Critical, 32 files  | 3650/3658 (99.78%) | 3688/3696 (99.78%) | 273/277 (98.56%) | 1166/1204 (96.84%) |
| Remaining, 23 files | 2855/2869 (99.51%) | 2894/2908 (99.52%) | 102/104 (98.08%) | 463/486 (95.27%)   |

All 55 modules listed above remain included; no new exclusion or exception.
Complete-run Delete screenshots are preserved under
`.artifacts/phase-10-rereview-{chromium,firefox}/`. The coordinator opened
Chromium English and Firefox Czech confirmation screenshots: adjacent actions,
localized labels, visible focus and reachable confirmation match the interaction
and geometry assertions. Browser mocks do not establish physical-device support.

Final correction manifest: `.artifacts/phase-10-rereview.sha256`, covering all
53 changed/new nonignored files after documentation writes. Original and
disconnect manifests remain immutable. The correction delta and owner amendment
require independent re-review; no clearance, commit/push or deployment yet.
The prior reviewer's session is not reused across the logout handoff: a fresh
replacement receives the preserved original report, probes, hashes and delta.
The coordinator must run complete post-review gates after clearance.

PLAN and the phase ledger now record the owner's latest exact phase-11/12
decisions, superseding older queued wording. No later-phase implementation,
content authoring or factual clearance has started.

### Independent clearance and coordinator final gates

Replacement independent review **P10-REPLACEMENT-IR-20261030** cleared all
P10-IR1–4 corrections and the Delete/Smazat amendment with no new findings or
metric exceptions. The complete original findings, replacement scope, all six
lenses and measured evidence are preserved in `reviews/phase-10.md`.

The coordinator subsequently passed complete sequential post-review gates:
357 tests / 25 files, format/lint/types/build, 63 negative coverage probes,
14 original independent probes, 371 Chromium and 228 Firefox journeys.
All 55 modules included; exact final coverage/commands/logs are in that report.
Implementation/test/code-input hashes stayed unchanged; content stayed identical
to baseline. Only factual status/review documentation followed clearance.
Owned previews were responsive and torn down. Authorized delivery and actual
automatic private-preview verification follow before phase 11.
