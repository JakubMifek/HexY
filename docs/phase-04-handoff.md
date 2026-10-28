# Phase 4 developer handoff

2026-10-28. Baseline: `9dfa3bcff2d4c90e60bc88b56ad85e6ed2e0abb5`.
**Pre-review candidate; implementation frozen for a fresh independent reviewer.
This is not phase clearance or post-review verification.**

Only phase 4 was implemented. Coordinator starting changes in `PLAN.md` and the
phase ledger are preserved. No instruction-rule changes, commits, pushes,
deployment, dependencies, nested delegation or shared-system configuration changes.
Both reviewed starter JSON files are unchanged: 2 packs / 56 entries.

## Acceptance map and reproductions

| Requirement                             | Implementation and evidence                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Save/recover the authoritative game     | `runtime/recovery.js` delegates to existing `domain/saves.js`, storing the Game object directly in `hexy.game.v1`; `App` saves each accepted transition before rendering. `tests/recovery.test.js`, `tests/resilience-ui.test.js`, `browser/resilience.spec.js` recover question/opponent/selecting/won states with fresh scopes.                                                      |
| Original deadlines and clock boundaries | Real reload tests at deadline −1 ms, exactly deadline and +1 ms; opponent recovery happens once, including export/import after expiry. Modal/fullscreen/focus operations retain the same deadline. Runtime display/action high-water checks and recovery’s persisted `lastNow` reject detected rollback.                                                                               |
| Interrupted duel recovery               | All preview/active/interrupted variants reload interrupted with unchanged cells/chooser. Separate readiness plus keyboard/touch releases and neutral assigned controllers are required. Actual browser reload and stale/held/focus tests exercise the real engine.                                                                                                                     |
| Locked content / corrections            | Recovered `state.pack` is never replaced with library data. Preparation locks for recovered/imported games, including wins. Win reload, post-win removal, independent chooser and original-question reuse are covered. All original host-restriction tests remain.                                                                                                                     |
| Failure-preserving recovery             | Corrupt/newer/unread records cannot be overwritten. Raw/current exports, retry and confirmed discard are UI actions. Changed-record comparison protects discard. Quota failures report unsaved state and preserve the previous string. Both-language Chromium denied-read, corrupt/version and real library-quota journeys pass.                                                       |
| Keyboard remapping                      | `DuelKeyboard` validates distinct physical Shift sides, Space and A–Z positions. Holds/repeats/preview presses are suppressed; remapping requires releases and cannot deadlock on an obsolete unmapped held code. Focused ordinary controls retain keyboard use. `hexy.inputs.v1` is independent of game/library persistence.                                                          |
| Gamepads and safe test                  | `DuelGamepads` owns polling, connection tokens and explicit player/button assignments. Same-slot reconnection never autoassigns. Held-at-assignment, neutral rearming, conflict/bounds, denied/unsupported APIs, identity replacement/disconnection and cleanup have deterministic tests; mocked browser Gamepad events use the real engine.                                           |
| Tablet local buzzers                    | `DuelTouch` tracks pointer IDs/players across view replacement. Separate ≥72 px-high A/B targets, simultaneous ties, holds, cancellation and touch-based restart are tested. Chromium native multi-touch via CDP and real `.tap()` supplement synthetic pointer-boundary tests. No physical-device claim.                                                                              |
| Shared timing and cleanup               | `BuzzerBatch` retains the existing 8 ms window across all input types; one gamepad sample has one timestamp. Boundaries cancel pending batches. Listener/timer/dialog/download disposal and superseded saved-file reads are covered. New-game removal precedes clearing runtime state.                                                                                                 |
| Layout, focus, accessibility            | Native glossy SVG and below-board panel retained; reduced motion, no flashing, non-color cues, visible focus and state announcements retained. Input-test dialog has a visible sticky close action, bounded vertical scrolling, and focus return. All four required viewports, both languages/themes, are captured and exercised. Fullscreen success/failure has DOM/browser coverage. |
| Prior phase behavior                    | All 59 earlier browser journeys remain, including 35 phase-2 + 20 preparation + 4 storage-fix journeys. The two real-quota journeys now assert the recovered locked question, explicitly start a new game, then retain all original source-library assertions. No assertion was weakened to hide a regression.                                                                         |

Interactive reproduction: start a hosted game, select a field and reload; its
original time continues. Give up twice, select the black field and reload; both
players must rearm and confirm readiness. Open **Input controls and test** to
remap/assign/test without capture. Export a game, confirm **New game**, then
**Import saved game JSON** to recover it. Recovery errors offer original export,
retry and explicit discard; no browser site-data tools are required for games.

## Exact verification

Run sequentially on the final source/test candidate:

```sh
TMPDIR="$PWD/.artifacts" npm run check
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser
git diff --check
```

All passed: format, ESLint size/complexity/nesting limits, strict JSDoc checking,
**167 unit/DOM tests in 16 files**, enforced measured coverage, production build,
and **94 Chromium journeys**. No skips, metric exceptions, new exclusions or
engine mocks. Logs: `.artifacts/phase-04-check.log`,
`.artifacts/phase-04-browser.log`. Preview used port 4182 without development
watchers and was stopped by Playwright; a subsequent HTTP probe found it closed.
The auxiliary screenshot contact-sheet browser was also closed.

Coverage is Vitest/V8, not inferred from browser passes:

| Scope               | Lines                  | Statements             | Functions          | Branches             |
| ------------------- | ---------------------- | ---------------------- | ------------------ | -------------------- |
| Critical, 25 files  | 2788/2799 = **99.61%** | 2817/2828 = **99.61%** | 205/205 = **100%** | 859/880 = **97.61%** |
| Remaining, 20 files | 2260/2274 = **99.38%** | 2264/2278 = **99.39%** | 78/80 = **97.50%** | 324/344 = **94.19%** |

All 45 runtime JS modules are included. Only type-only `domain/types.js` is
excluded; JSON data and generated outputs are not production JS. Independently
zeroing either group and removing `runtime/recovery.js` from a generated report
each caused checker exit 1. The genuine report was restored byte-for-byte.
Evidence: `.artifacts/phase-04-coverage-enforcement.log`.

Full critical membership:

```text
app.js, workspace.js
domain/{actions,answers,board,config,duels,errors,game,generation,outcomes,
        packs,preferences,saves,validation}.js
runtime/{buzzer,clock,downloads,gamepad,inputs,keyboard,library,preparation,
         recovery,touch}.js
```

Full remaining membership:

```text
content/catalog.js, main.js, messages.js
ui/{answer-sheet,application,board,device-strings,dom,editor,game,header,host,
    inputs,library,preparation,preparation-strings,recovery,round,setup,strings}.js
```

## Visual and format evidence

- `.artifacts/playwright/resilience-visual-*/duel-viewport.png`, `duel-full.png`
  and `input-controls.png`: **1280×720, 1920×1080, 1024×768 and 768×1024**, each
  with cs/en and light/dark. Every combination includes actual touch capture,
  recovery and dialog/focus interaction, not only a screenshot.
- Inspected contact sheets of all 16 combinations:
  `.artifacts/phase-04-duel-viewport-contact.png` and
  `.artifacts/phase-04-input-controls-contact.png`.
- Representative full-size inspected images:
  `resilience-visual-1280x720-c424b-focus-recovery-and-controls/duel-viewport.png`
  (English dark), `resilience-visual-1280x720-dd4fd-focus-recovery-and-controls/duel-viewport.png`
  (Czech dark), and
  `resilience-visual-1024x768-c9fcd-focus-recovery-and-controls/input-controls.png`
  (Czech dark tablet), beneath `.artifacts/playwright/`.
- Existing `visual-*`, `preparation-visual-*`, `review-fixes-*` and preparation
  print/download artifacts retain both themes, long Czech text, contrast,
  typed-draft, source/JSON and exact answer-sheet evidence.
- `resilience-*-corrupt-*` artifact directories contain exported original invalid/
  newer strings; `resilience-game-export-*` contains an actual recovered-game JSON
  export. `.artifacts/browser-report/index.html` indexes all browser results.
- `.artifacts/phase-04-artifacts.json` inventories final local evidence paths.
  `coverage/index.html` and `coverage/coverage-summary.json` contain actual metrics.

## Design decisions and limitations

- Rules and saved-game validation remain pure and unchanged. App retains one
  authoritative Game; `ui/application.js` only projects it and captures action
  context. Concrete `Recovery`, keyboard/gamepad/touch lifecycles and the small
  shared batch have distinct state/resource ownership. No generic state-machine,
  event bus, framework, service container or runtime dependency was introduced.
- Game/library/input preference keys are separate. Gamepad assignments deliberately
  are not restored automatically: a reconnect/reload requires explicit assignment.
  Saved-game exports contain gameplay, not display/library preferences.
- Supported local setup is one shared keyboard or a multi-touch tablet with
  separate player buzzers; explicit gamepad/button assignments are optional where
  available. Both players should prefer the same input type. Polling at 16 ms and
  OS/event latency limit cross-device fairness; the 8 ms replay policy is unchanged.
- Vertical scrolling is intentional for long preparation/control content; there
  is no required horizontal scrolling. Input-test close remains reachable at the
  top/sticky position. Timer ticks are not live-announced.
- Correct system time is a prerequisite. Runtime rollback is checked against the
  last display/action reading; reload is checked against saved `lastNow`. The
  original deadline is never changed. A static offline app cannot authenticate
  arbitrary clock changes across shutdown without an external trusted clock.
- One editing tab is supported, not concurrent merging. Local storage is not a
  backup. Corrupt library/input preferences retain their existing protected-record
  policy; the new in-app raw export/discard paths specifically address game saves.
- **Physical Xbox/tablet, additional-browser and screen-reader-device checks remain
  pending for phase 8.** Emulation/mocks clear software behavior only. Content
  authorship phases 5–7, name clearance and deployment remain out of scope.

## Frozen source inventory and next action

Changed/new implementation:
`src/app.js`, `src/messages.js`, `src/style.css`,
`src/runtime/{buzzer,gamepad,inputs,keyboard,recovery,touch}.js`,
`src/ui/{application,device-strings,inputs,recovery,strings}.js`.

Changed/new tests:
`tests/{devices,recovery,resilience-ui,workspace}.test.js`,
`browser/{devices,resilience,resilience-visual,storage-recovery}.spec.js`.
The workspace test title now states independent storage rather than implying
running games are not persisted.

Documentation: README, contracts, this handoff and appended factual phase-ledger
status; coordinator `PLAN.md`/starting-ledger changes are included and preserved.
No previous review reports were edited.

`.artifacts/phase-04-snapshot.sha256` is the complete changed/new tracked and
untracked source/doc/test manifest, generated **after all writing**.
`.artifacts/phase-04-source-inventory.json` contains all runtime membership,
coverage totals and baseline/source metadata.

Next action: coordinator arranges the fresh independent review on this snapshot.
Return findings to this developer for focused fixes. Only after independent
clearance may the coordinator run the mandatory thorough post-review checks and
consider commit/push authorization. No phase clearance is claimed here.

## Review-fix addendum — 2026-10-28

Independent reviewer `c74220e4-298d-42e3-bb31-8bd2e648d709` requested three
corrections. Initial findings and detailed developer responses are preserved in
`reviews/phase-04.md`. **The fixed candidate is frozen for that same reviewer;
this addendum does not clear the findings or phase.**

- **P4-R1:** detected changed records now revoke saved/write status immediately
  and replace only the adapter's protected raw-export buffer, never storage.
  Retry and ordinary gameplay preserve exact replacement bytes until explicit
  resolution. Valid/corrupt/newer records, exports, cancel and confirmed discard
  are covered in DOM and real-browser regressions.
- **P4-R2:** `runtime/symbols.js` centralizes the actual supported glyph alphabet.
  Defaults, rendering and recovery compatibility share it. Unsupported configs
  are rejected before startup/file adoption or persistence, including selecting
  and interrupted saves. Original data and live UI are preserved. No domain
  schema restriction, silent substitution or render fallback was introduced.
- **P4-R3:** gamepad diagnostic callbacks carry real held/released edges
  independently of gameplay presses. Initial assignment snapshots the actual
  held value; neutral arming is not a fabricated release. Both players/languages
  and mutation-observed quiet polling are verified.

Final sequential `TMPDIR="$PWD/.artifacts" npm run check`, documented Chromium
command and `git diff --check` passed: **177 tests**, **103 browser journeys**,
format/lint/types/build and both coverage gates.

| Scope               | Lines              | Statements         | Functions      | Branches         |
| ------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 files  | 2819/2830 = 99.61% | 2848/2859 = 99.62% | 209/209 = 100% | 877/898 = 97.66% |
| Remaining, 20 files | 2253/2263 = 99.56% | 2257/2267 = 99.56% | 77/79 = 97.47% | 321/337 = 95.25% |

Membership is the original list above plus critical `runtime/symbols.js`:
**46 runtime files**, only the existing type-only exclusion. All three negative
coverage/membership probes failed as intended and the genuine report was restored.

Full logs: `.artifacts/phase-04-review-fixes-{check,browser,coverage-enforcement}.log`.
New screenshots and exact-byte exports: `.artifacts/playwright/recovery-review-*/`;
localized release screenshots: `.artifacts/playwright/devices-*-safe-gamepad-*/`.
The detailed review response identifies inspected examples and reproduction steps.
All previous 94 browser journeys remain; the full run regenerated their evidence.

New/changed fix scope is listed in the review response. New source files since
the first manifest are `runtime/symbols.js` and `browser/recovery-review.spec.js`;
`ui/round.js` now uses the centralized symbols. The real review report and these
appended responses are also included in the complete frozen manifest.

After all writing, the same-review candidate manifests are
`.artifacts/phase-04-review-fixes-snapshot.sha256` and
`.artifacts/phase-04-snapshot.sha256`. Full source membership/metrics and final
artifact inventories were regenerated. The initial manifest and independent
review evidence are preserved. No commits/pushes/deployment, dependencies,
shared-system changes or delegation. Preview is stopped. All original release
limitations remain; next action is same-reviewer re-review followed, only after
clearance, by coordinator-owned post-review verification.

## P4-R4 correction handoff — 2026-10-28

The first independent re-review confirmed the original three reproductions fixed,
but found a stale-empty permission grant after a failed game-storage reread.
The complete review history and detailed correction response are preserved in
`reviews/phase-04.md`. **Frozen for the same reviewer, not cleared.**

`Recovery` now exclusively owns write permission through a private field/read-only
accessor. The app delegates memory-game retry to `retrySave`; only a successful
current empty read grants previously blocked saving. Cached null content cannot
override read failure. Failed discard rereads likewise revoke saved/write status.
Readable replacements remain protected/exportable. No new schema, dependencies,
adjudication, runtime modules or changes to the original three fixes.

Seven new unit/DOM cases and six bilingual browser journeys cover exact unread
valid/corrupt/newer bytes, failed retry plus normal gameplay, actionable unsaved
feedback, raw export after access restoration, safe cancellation, successful empty
read retry and real reload. Original tests are retained. All permission assignments
were inspected; no app-owned game permission assignment remains.

Sequential full check, documented browser command and `git diff --check` passed:
**184 unit/DOM tests**, **109 Chromium journeys**, format/lint/types/build.

| Scope               | Lines              | Statements         | Functions      | Branches         |
| ------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 files  | 2829/2840 = 99.61% | 2858/2869 = 99.62% | 211/211 = 100% | 880/901 = 97.67% |
| Remaining, 20 files | 2253/2263 = 99.56% | 2257/2267 = 99.56% | 77/79 = 97.47% | 321/337 = 95.25% |

Actual observed denominators are reported; the reviewer previously measured
322/338 remaining branches. Membership remains all 46 sources listed above,
with only the existing type-only exclusion. Negative group/missing-recovery
coverage probes rejected altered reports; genuine coverage was restored exactly.
No metrics exceptions or weakened thresholds/assertions.

Logs: `.artifacts/phase-04-r4-{check,browser,coverage-enforcement}.log`.
New evidence: `.artifacts/playwright/recovery-review-{en,cs}-unread-*/`
contains `unread-replacement.png` and exact-byte `unread-replacement.json` exports.
Representative English/Czech read-error screenshots were visually inspected.
The complete suite regenerated original UI/input/viewport evidence.

Correction scope: `src/{app.js,runtime/recovery.js}`,
`tests/{recovery,resilience-ui}.test.js`, `browser/recovery-review.spec.js`,
README/contracts and factual review/handoff/ledger additions.
After all writing: `.artifacts/phase-04-r4-snapshot.sha256` and canonical
`.artifacts/phase-04-snapshot.sha256`. Full membership/metrics and artifacts
are inventoried in the existing JSON inventory files. Previous manifests preserved.

No commits, pushes, installs, deployment, shared-server changes or delegation;
preview is stopped. Existing release/device/clock limitations remain unchanged.
Next: same-reviewer P4-R4 recheck, then mandatory coordinator post-review checks.
