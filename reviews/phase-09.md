# Phase 9 independent review

**Current verdict: CLEARED after corrections.** Complete coordinator post-review
gates also passed. Initial findings and their evidence are preserved below;
see [re-review and final verification](#independent-re-review-cleared).

## Initial verdict: CHANGES REQUIRED

Reviewer: `9778527f-5fa3-4f2f-b037-b3a28cb0892c`
(report identity `P9-IR-20261029`), independent of developer
`af9c7e73-f5fa-4145-bfc3-8c44c5d33d56`.
Baseline: `b757e872fb2c8b350d8cea73a74adbb923812de1`.
All 78 changed/new files matched `.artifacts/phase-09-snapshot.sha256` before and
after review, fingerprint
`b5101ee29bda79841252b0724649849f6384a148862303c13d35e0d6bb7e6727`.
This is the coordinator-persisted summary of the full independent report at
`.artifacts/phase-09-independent-report.md`, including its reproduced findings.

## Findings

| ID     | Severity | Frozen-snapshot location                                                                                                 | Finding and required correction                                                                                                                                                                                                                                                                                                                                                                                   |
| ------ | -------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P9-IR1 | Major    | `src/runtime/inputs.js:139–173`, `src/app.js:153–155,254–255`, `src/ui/header.js:61,72–78`, `src/ui/recovery.js:124–131` | Native dialog closure clears `open` synchronously but dispatches `close` later. Modal-era readiness can start a preview in that gap; the late close handler then interrupts it and discards a fresh gesture. Make closure/readiness invalidation an atomic lifecycle boundary, exclude modal/closing readiness and prevent delayed callbacks from changing a later opportunity. Preserve all input safety guards. |
| P9-IR2 | Minor    | `src/studio.css:395–403`                                                                                                 | Fixed bottom `#error` overlaps required controls. At 768×1024 an ordinary English automatic-question clock-error banner obscures answer, submit and give-up centers; hosted mode obscures give-up. Reserve error space or use fitted status presentation without hiding actions.                                                                                                                                  |

P9-IR1 reproduction: interrupt a black-field duel, open Exit confirmation,
press/release both real Shifts inside it, click Keep playing and promptly perform
fresh A/B gestures. Native Chromium telemetry (without fake time) showed A
prematurely enter preview using stale B readiness, then the delayed close event
interrupt it. B's fresh gesture did not restart. A deterministic real-dialog
probe reproduced preview after only A between `close()` and its event, with and
without browser clock control. The DOM test's synchronous dialog-close stub
concealed that gap. Cover Exit and recovery paths, unchanged cells/chooser,
no premature save/revision and exactly one safe restart.

P9-IR2 reproduction: at 768×1024, select an ordinary English automatic question,
simulate OS-clock rollback by 1,000 ms and click Give up. Actual rectangles and
`elementFromPoint` show the alert over controls despite zero scroll overflow.
Add ordinary/maximum question failure-state text/bounds/hit-testing across
supported viewports, languages and host modes; retain readable error and
original deadline, including recovery when time becomes valid.

Evidence: `.artifacts/phase-09-reviewer-dialog-probe.{mjs,log}`,
`phase-09-reviewer-dialog-first.log`, `phase-09-reviewer-probe-initial.log`,
and `phase-09-reviewer-visual/measurements.json` plus
`clock-alert-{automatic,hosted}-768.png`. Waiting for dialog detachment in the
broader probe was diagnostic only, not a product fix.

## Acceptance and six review lenses

- **Correctness:** authoritative domain rules, bounded continuous duels,
  validated portable metadata, absolute deadlines, locked packs and protected
  recovery remain substantive. Menu/wizard, hosted download gating, full saves,
  native flips and ordinary fresh-input restart pass; modal lifecycle P9-IR1
  remains uncleared.
- **Usability/accessibility:** actual both-engine UI, keyboard, touch emulation,
  native animation and representative screenshots inspected. Five sizes × both
  languages/themes/host modes passed maximum-text cases; additional failure
  hit-testing found P9-IR2. Color-only ownership is the explicit approved
  exception, not an invented finding or general WCAG claim.
- **Readability:** all candidate source/test changes reviewed. Production maxima
  299 module lines, 60 function lines, complexity 10, nesting 3; no exceptions
  or silent ignores. Migrated navigation tests preserve gameplay/print assertions.
- **OOP:** App owns authoritative game transitions, Navigation preparation,
  Recovery protected writes, Inputs subscriptions/readiness. No demonstrated
  god-object defect; correct the concrete modal lifecycle race.
- **Patterns:** bounded permutations, shared batching and scoped deferred restart
  serve present requirements. No framework/runtime dependency/generic wizard
  added. Do not remove guards to fix the race.
- **Content/rights/delivery:** all 36 packs / 1,008 entries are byte-identical.
  Exact answer-sheet/PDF/source assertions and license notices retained.
  Deployment/dependencies unchanged. Public/name/device follow-ups stay deferred,
  not new phase-9 blockers; no deployment or physical-device claim.

The full acceptance matrix and file-level coverage membership are preserved in
the independent report. Apart from the two findings, it accounts for stable
player defaults/back navigation, unified language, removed fullscreen/gameplay
settings, host placement/phase guards, color-only cells, full import/save
roundtrips and failure preservation, legacy migration, seven fixed-target
continuous symbols, bounded time/state and full-initial/reduced-motion flips.

## Independent verification actually executed

```sh
TMPDIR="$PWD/.artifacts" npm run check
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser -- --output=.artifacts/phase-09-reviewer-chromium
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config playwright.cross-browser.config.js --project=firefox --output=.artifacts/phase-09-reviewer-firefox
node .artifacts/phase-09-coverage-probes.mjs
git --no-pager diff --check b757e872fb2c8b350d8cea73a74adbb923812de1
sha256sum -c .artifacts/phase-09-snapshot.sha256
```

PASS: formatting/lint/types/build; **327 tests / 23 files**, including 35 preview
unit tests; **266 Chromium journeys**, **123 Firefox journeys**, 52 actual
suite PDFs and **14 negative coverage probes**. Logs use
`.artifacts/phase-09-reviewer-{check,browser,firefox,coverage-probes}.log`.
All runners sequential; no skipped failure or installation.

| Scope               | Lines              | Statements         | Functions      | Branches          |
| ------------------- | ------------------ | ------------------ | -------------- | ----------------- |
| Critical, 29 files  | 3183/3188 (99.84%) | 3222/3227 (99.85%) | 229/229 (100%) | 984/1010 (97.43%) |
| Remaining, 22 files | 2817/2827 (99.65%) | 2856/2866 (99.65%) | 98/100 (98%)   | 446/465 (95.91%)  |

All 51 runtime JS modules included; only type-only `src/domain/types.js`
excluded. Thresholds remain critical 95/95/95/90, remaining 85/85/85/80.
Reviewer fractions above are observed, not copied from the developer report.
Negative probes restore report bytes, fingerprint
`fab2ffc6420967c5e71224ee0ec41c6a4f85b8446c595fa31b15d02d3408a11e`.

Additional real production interaction/dialog probes uncovered the findings;
they are **not all-pass evidence**. The reviewer opened menu/options/player/deck,
maximum-question/recovery, actual seven-symbol, digraph-flip and print screenshots
from both engines; exact inventory/scripts are in the full report. Screenshots
supplement real interaction, decoded PDF and hit-testing evidence.

## Handoff

P9-IR1 and P9-IR2 remain open. No clearance or metric exception. Return focused
corrections to the same developer and re-review the new frozen snapshot.
Coordinator post-review gates remain due after clearance.

No physical Xbox/tablet, human screen-reader, remote Edge or WebKit verification
claimed. Owned browser/server processes stopped; port 4182 refused connections.
Live 4183/4184/admin and Docker/systemd/Tailscale configuration untouched.

## Independent re-review: CLEARED

The same independent reviewer `9778527f-5fa3-4f2f-b037-b3a28cb0892c` cleared
the corrected 82-file snapshot `.artifacts/phase-09-rereview.sha256`, fingerprint
`d5dcfdc527bd3b83887bbf402d83ccfd6611419cc5758bde2fd0ce9f8bf9535b`.
Full report: `.artifacts/phase-09-rereview-report.md`. Ten files changed and four
were added relative to the original snapshot; the other 68 were unchanged.
Original manifests, findings and initial review evidence remain intact.

| Finding | Independent outcome                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P9-IR1  | **Fixed.** Shared `src/ui/game-dialog.js` dismissal revokes readiness synchronously before releasing dialog ownership; input/modal ownership and identity/generation guards exclude closing-interval and stale-callback readiness. Original unmodified native-key and deterministic same-task gap probes pass. Both Exit/recovery and Chromium/Firefox verify unchanged bytes after modal gestures and A alone, then exactly one preview save/revision after fresh B, with identical cells/chooser. |
| P9-IR2  | **Fixed.** Gameplay errors occupy the reserved feedback strip rather than overlaying actions. Eighty ordinary/maximum-question layouts per engine verify scroll/text bounds and hit-testing across five viewports, languages, themes and host modes. Original portrait clock-error probes report no obscured controls, clipped text or alert overlap. Correcting time retains the original deadline.                                                                                                |

No new findings or exceptions. All six review lenses pass within the approved
private phase-9 scope. The helper resolves duplicated concrete lifecycle risk
without a framework; App/Inputs/domain responsibilities remain intact. Maximum
production metrics: 298 module lines / 60 function lines / complexity 10 /
nesting 3. All 36 packs / 1,008 entries remain byte-identical.

Reviewer commands (sequential, logs `phase-09-rereviewer-*`):

```sh
TMPDIR="$PWD/.artifacts" npm run check
node .artifacts/phase-09-rereview-coverage-probes.mjs
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test browser/modal-readiness.spec.js browser/clock-error-fit.spec.js --output=.artifacts/phase-09-rereviewer-chromium
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config playwright.cross-browser.config.js --project=firefox browser/modal-readiness.spec.js browser/clock-error-fit.spec.js --output=.artifacts/phase-09-rereviewer-firefox
```

Independent results: **331 unit tests / 23 files**, **88 cases per browser
engine**, **15 coverage probes**, original native-clock/controlled-clock
reproductions, **8/8** independent two-engine modal checks and **22/22** original
integrated geometry observations passed. Actual corrective screenshots opened
in both engines; full text/actions and native focus placement inspected.
These scoped re-review runs retain the initial integrated review evidence for
unchanged journeys; developer full-suite runs are not mislabeled reviewer runs.

| Scope               | Lines              | Statements         | Functions        | Branches          |
| ------------------- | ------------------ | ------------------ | ---------------- | ----------------- |
| Critical, 29 files  | 3187/3192 (99.84%) | 3226/3231 (99.85%) | 229/230 (99.57%) | 986/1013 (97.33%) |
| Remaining, 23 files | 2828/2838 (99.65%) | 2867/2877 (99.65%) | 99/101 (98.02%)  | 447/467 (95.72%)  |

All **52 executable production JS modules** included: the original 51-file
membership plus `src/ui/game-dialog.js` in remaining scope. Full membership is
in the handoff and independent report; only truly type-only `types.js` excluded.
Both original scope thresholds remain enforced. Report byte restoration:
`5c0f3e2700e741a8df5c6c0affb849ee7821791cd35a862b4836f99747404758`.

All 82 hashes remained unchanged; owned browsers/server stopped. No dependency,
shared-service or publication changes. Physical-device, WebKit/Edge and human
screen-reader gaps remain the owner's existing follow-ups, not claimed passes.

## Coordinator complete post-review verification

On the identical cleared snapshot, the coordinator executed sequentially:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-09-post-review-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-09-post-review-browser.log 2>&1
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config playwright.cross-browser.config.js --project=firefox > .artifacts/phase-09-post-review-firefox.log 2>&1
node .artifacts/phase-09-rereview-coverage-probes.mjs > .artifacts/phase-09-post-review-coverage-probes.log 2>&1
sha256sum --check --quiet .artifacts/phase-09-rereview.sha256
git diff --check
ss -H -ltn 'sport = :4182'
```

**PASS:** formatting/lint/types/build, **331 tests / 23 files**,
**354 Chromium journeys**, **211 Firefox journeys**, and **15 enforcement
probes**. Coverage matches the fractions above; negative probes restored exactly
the same report hash. No snapshot drift or whitespace errors; port 4182 closed.
Only factual status/review documentation changed after this final run.

Phase 9 is cleared for the previously authorized phased private delivery.
Public exposure and original release follow-ups remain out of scope.
