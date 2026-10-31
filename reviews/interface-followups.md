# Independent review: catalog and game interaction follow-ups

## Initial review — CHANGES REQUIRED

Reviewer: `92b2fe23-2dea-4ac2-87d6-91d65b95b420`.
Baseline: `a2cdfd6f56b744c7ffe87bc56d2b5ca91503c459`.
All 73 sealed files reviewed: 30 source, 22 browser, 16 unit-test and five
documentation files, including complete diffs and new files.
Manifest `.artifacts/interface-review-snapshot.json` SHA-256:
`cd14fc56e1d76f6427493ef04a0aa644998bf9fcaa17eaf31bdc248997cb517c`.
All hashes matched before and after review; no unsealed changes.

| ID    | Severity | Location                                                        | Finding and required correction                                                                                                                                                                                                                                    |
| ----- | -------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| IF-01 | Major    | `src/runtime/sound-player.js:59–82`                             | A trusted non-activating key can initialize suspended audio with a pending resume; the `resuming` flag then blocks a genuinely activating click. Require actual browser activation and permit a fresh activating gesture to recover without replaying queued cues. |
| IF-02 | Major    | `src/ui/tile-return.js:45–60`; `src/studio.css:210–221,253–266` | Responsive board growth makes the return start below scale one, so the tile physically grows rather than shrinks. Reconcile highlighted size and destination geometry; verify screen-space shrinkage and continuity at supported viewports.                        |

### Independent reproductions

**IF-01:** native Chromium, fresh page, press/release Shift before clicking
Options and Back. Context remained suspended and `resume()` was called only
once. A control calling `resume()` directly during the next trusted click
immediately changed the same context to running. This is an application defect,
not the separately disclosed headless Firefox playback limitation.

**IF-02:** hosted number game, 1280×720, select cell 28 and judge correctly.
Calculated return scale was 0.642105 → 1. Chromium polygon height grew from
38.60 → 60.11 CSS pixels, approximately 56%; Firefox grew from 42.75 → 66.57.
Existing final-transform/recipient-face assertions did not measure the actual
screen-space shrink requirement.

### Acceptance and all six review lenses

| Lens                     | Evidence and outcome                                                                                                                                                                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Correctness/completeness | Opponent decisions, unlimited attempts, configured half-duration, turn spending, expiry and recovery passed. Native legacy-v1/v2 offers, finite-symbol upgrades and exact-byte invalid-original protection verified in both engines. IF-01/02 remain unresolved.                                 |
| Usability/accessibility  | Actual keyboard/browser interactions and screenshots inspected across languages/themes. Sixteen additional hosted maximum-text viewport/language cases checked whole role-box clearance and host/text intersections without overlap. Reduced motion and immediate recipient presentation passed. |
| Maintainability          | Independent lint/types/formatting passed, including module/function/complexity ceilings. No additional significant finding.                                                                                                                                                                      |
| OOP/resources            | Domain/runtime separation and ordinary mute/hide/disposal cleanup passed; pending resume ownership is defective as IF-01 describes.                                                                                                                                                              |
| Proportional patterns    | Explicit gameplay stages and concrete adapters remain proportionate. No additional significant finding.                                                                                                                                                                                          |
| Content/rights/delivery  | Bundled content, dependencies and license files unchanged. Oscillator synthesis introduces no downloaded audio assets. Historical clearance is not candidate clearance; private-preview scope only.                                                                                              |

Catalog checks passed: closed folders, alignment, keyboard selection, normalized
display names, natural difficulty/name ordering, mixed-level badges, filter
stability, original exports and simulated phase-12 numbering continuity.

### Commands and results

Executed from the isolated checkout with the prescribed local cache/temp paths,
2048-MiB Node heap and one browser worker:

```sh
npm run lint
npm run typecheck
npm run format:check
node scripts/check-coverage.js
node node_modules/vitest/vitest.mjs run \
  --config .artifacts/effects-vitest.config.js --configLoader runner \
  --no-cache --maxWorkers=1 --no-file-parallelism \
  tests/catalog-names.test.js tests/catalog.test.js \
  tests/opponent-turn.test.js tests/game-effects.test.js \
  tests/sound-player.test.js tests/recovery.test.js \
  tests/portable.test.js tests/continuous-duels.test.js
EFFECTS_RUN=independent-review node node_modules/@playwright/test/cli.js test \
  browser/catalog-presentation.spec.js browser/game-effects.spec.js \
  browser/offer-layout.spec.js browser/opponent-turn.spec.js \
  --config .artifacts/effects-playwright.config.js
```

262 unit tests/eight files and 48 Chromium/Firefox browser cases passed.
Additional inline native probes confirmed both findings and the recovery/layout
evidence. Existing coverage independently recalculated: critical
99.81/99.81/98.71/96.88%; remaining 99.17/99.20/97.69/94.81%, all 63 runtime
modules included. Coordinator build/full-unit evidence inspected, not claimed
as independently rerun. Two initial ad-hoc probes had reviewer fixture/selector
errors; corrected probes completed without changing candidate files.

Physical audibility/devices, human screen-reader use and Safari/WebKit remain
unverified. The approved color-only ownership exception remains. No
full-1451-suite, deployment or naming-clearance claim. Owned preview stopped;
port 4197 verified closed.

Both findings require correction and independent re-review before the
coordinator's post-review gate and later safe primary integration.

## Corrective developer handoff — awaiting independent re-review

Developer `019546aa-7d3f-4081-a416-653de84c369f` corrected both findings and
froze eight owned source/test files. The original findings above remain open
until the independent reviewer verifies the replacement snapshot.

- IF-01: require actual native activation and eligible trusted input before
  initializing audio; modifier/repeat/composing keys do not unlock. A fresh
  activating gesture can retry a pending resume. Attempt IDs prevent obsolete
  settlements from overwriting newer status; mute/hide/dispose invalidate them.
  Native Chromium Shift-before-click now creates no context until activation,
  then plays only the accepted selection/award frequencies, without queued cues.
- IF-02: proportionally size the active highlight relative to resting-board
  geometry before resolution; preserve enlarged edge enclosure with SVG padding.
  Capture actual rendered face geometry for continuous return coordinates/scales,
  including interrupted selection and Firefox's transform-origin behavior.
  Native 1280×720 cell-28 heights now decrease 73.34→66.73→60.11px in Chromium
  and 81.22→73.90→66.57px in Firefox. The final footprint does not jump afterward.

Developer evidence: 957 units/40 files, full formatting/lint/types/build and
all 63 runtime-module coverage gates pass. Critical coverage
99.81/99.81/98.72/97.17%; remaining 99.61/99.63/97.69/95.35%.
All 382 distinct browser cases have passing latest results across two final
runs, including five viewports, both board modes, edge/top cells, all return
outcomes, 600-character questions and 30-character names. One test-only
Firefox floating-point exact-equality failure was corrected to seven-decimal
precision; all affected flip cases passed the subsequent 262-case run, with
production unchanged. Full original logs are retained.

Detailed commands, hashes, screenshots, numeric traces and limitations:
`.artifacts/effects-review-fixes-handoff.md`. Headless Firefox's genuinely
suspended audio device remains explicitly disclosed; this is not playback
evidence or an excuse for IF-01. No independent closure is claimed here.

## First independent re-review — CHANGES REQUIRED

Same reviewer: `92b2fe23-2dea-4ac2-87d6-91d65b95b420`.
The 76-file `.artifacts/interface-rereview-snapshot.json` seal has SHA-256
`ed8b2c0ce2afcf3f34a6e752721503d03433b85ccc51bee6ca5c127c9d85f1f1`.
All 76 hashes matched before/after, with no unsealed changes. All eight
corrective source/test files and documentation changes reviewed; 64 files
retain exact initial-review hashes.

| Finding | Independent disposition                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IF-01   | **Resolved.** Native Shift-first creates no context; activated Chromium interaction initializes audio and schedules expected selection/award notes. Fresh retries and obsolete-settlement rejection verified.                      |
| IF-02   | **Original growth defect resolved.** Native screen-space shrinking, positional continuity, stable endpoints, in-flight selection, reduced motion and stale/recovery behavior passed. Enlarged highlighting introduced IF-03 below. |
| IF-03   | **Major, open.** `src/studio.css:220–240`: ordinary opponent-offer layout does not reserve enough room for enlarged bottom-row tiles, obscuring the tile and potentially its initial.                                              |

### IF-03 reproduction and evidence

At 1024×768, import a number game with the published 189-character wording from
`sports-en-hard-01-04` at cell 22. Select it, then give up. Test Ada/Boris and
valid 30-character names, in both hosted/automatic modes. `.long-question`
remains absent, so the approved unusually-long-question overlap exception
does not apply.

| Names              | Chromium overlap | Firefox overlap |
| ------------------ | ---------------: | --------------: |
| Ada / Boris        |          21.98px |         28.42px |
| 30-character names |          41.98px |         50.42px |

With long names, hit-testing the answer initial's center returns the covering
question panel. A browser-only control restoring previous sizing made it
visible again. Existing ordinary geometry fixtures were too short; long names
occurred only in the 600-character cases whose tile-overlap checks are exempt.
Reserve sufficient space for ordinary offers, including longer bundled wording
and valid names, without losing physical shrinkage, roles, readability or touch
targets. Add this intermediate-length regression in both engines.

### Re-review evidence and six lenses

Correctness: IF-01/02 corrected, authoritative state/deadlines preserved; IF-03
blocks clearance. Usability: interactions/screenshots across languages/themes
and five viewports, plus opposite-edge probes exposed IF-03. Maintainability:
lint/types/formatting and ceilings passed. OOP: attempt ownership, cancellation,
cleanup and obsolete settlements verified. Patterns: concrete lifecycle and
measured geometry remain proportionate. Content/rights/delivery: content and
original synthesis unchanged, honest pending status, no delivery/name clearance.

```sh
EFFECTS_RUN=independent-rereview node node_modules/@playwright/test/cli.js test \
  browser/game-effects.spec.js browser/tile-flip.spec.js \
  browser/offer-layout.spec.js browser/return-geometry.spec.js \
  --grep 'game-effects|tile-flip|maximum offer|1280x720 numbers cell 28|1366x768 numbers cell 1 |1920x1080 letters cell 28|1024x768 letters cell 1 |768x1024 numbers cell 28|immediate judgment' \
  --config .artifacts/effects-playwright.config.js
node node_modules/vitest/vitest.mjs run \
  --config .artifacts/effects-vitest.config.js --configLoader runner \
  --no-cache --maxWorkers=1 --no-file-parallelism \
  tests/sound-player.test.js tests/tile-return.test.js \
  tests/game-effects.test.js tests/tile-flip.test.js
npm run lint
npm run typecheck
npm run format:check
node scripts/check-coverage.js
git --no-pager diff --check
```

64 native cases and 45 unit tests passed. Additional native edge/layout probes
confirmed IF-03. Critical coverage recalculated at
99.81/99.81/98.72/97.17%; remaining 99.61/99.63/97.69/95.35%, all 63 modules.
A preliminary inline probe failed on Node JSON-import syntax before browser
execution; corrected fixture loading succeeded. Full developer build/suite
evidence inspected, not claimed as independently rerun.

No candidate edits, installs, other agents, commits or deployment changes.
Preview stopped and port 4197 closed. Physical audio/devices, human screen
readers and Safari/WebKit remain unverified; color-only and unusually-long-text
exceptions unchanged. IF-03 needs correction and re-review before post-review
gates and safe integration.

## IF-03 developer correction — awaiting independent recheck

The same corrective developer changed only `src/studio.css`,
`browser/return-geometry.spec.js` and new
`browser/ordinary-offer-layout.spec.js`. All production JavaScript remains
byte-identical, including the independently resolved IF-01/02 fixes.

Ordinary question/offer/opponent panels now occupy their own intrinsic grid
row; the board yields remaining space rather than the panel covering an
independently sized board. Highlight size uses the actual SVG content height
via its size container, with proportional edge clearance. Neither the

> 240-character exception threshold nor fonts, roles or touch targets changed.
> The selecting board and final tile footprint are unchanged. The inactive
> board becomes more compact when ordinary text wraps; the active initial stays
> full-sized. Return origin is measured immediately before resolution in the
> actual offer/accepted stage, not the earlier question-stage position.

The published 189-character fixture first reproduced eight native failures.
After correction, 120 ordinary cases pass across five viewports, both engines,
answer modes, bottom corners, name lengths and the exact 240-character
ordinary boundary. All 360 stage initial-center hit tests reach the tile.
At the reported 1024×768 long-name offer, clearance is +36.99px Chromium and
+31.75px Firefox instead of overlap. Across the matrix, minimum clearances
are +27.32px question, +18.72px offer and +23.77px accepted answer.

Full return/countdown/max-text/clock-error regression adds 346 passing cases,
for 466 distinct native passes, followed by 12 repeated screenshot cases.
45 focused units and full formatting/lint/types/build pass. No runtime JS
changed; coverage was not rerun or newly claimed. The previous 957-unit and
63-module metrics remain applicable.

Commands, source seal, original failures, numeric traces, screenshots and
limitations are retained in `.artifacts/effects-if03-handoff.md`. The
return-test change retains X/Y/width/height continuity and monotonic shrink
assertions while comparing the immediately preceding stage. IF-03 remains
open until independent recheck; no deployment clearance is implied.

## Final independent recheck — CLEARED (isolated candidate only)

Reviewer `92b2fe23-2dea-4ac2-87d6-91d65b95b420` explicitly cleared IF-03,
retained IF-01/02 closure, and reported **no new findings**. Full structured
receipt: `.artifacts/interface-clearance.json`.

The 77-file `.artifacts/interface-if03-snapshot.json` manifest SHA-256 is
`ca1d208493651582b06ed4cd13e07b5104082cf7d5469b4c888bc7c4e0b9a83f`.
77/77 hashes matched before/during/after, with no unsealed changes. Prior seals
retained their recorded hashes. 71 files matched the previous review, and all
production JavaScript remained byte-identical.

The reviewer independently exercised the 189-character published wording,
240-character ordinary boundary, original cell-22 reproduction, both engines,
both answering modes and long names. Selected cases covered all five supported
viewports and both bottom corners. Native stages retained initial hit-testing,
board/panel separation, whole player/host clearance, no scrolling, 20px question
text and at least 44px controls. Return continuity, shrinking, stable endpoints,
in-flight judgment and native Shift-first audio regression passed again.

**80 native cases passed**, no failures or skips. An additional eight
Czech/dark journeys and 24 stage checks passed across both engines/modes,
1024×768 and 1280×720, 240-character text and long names; minimum clearance
18.72px. Fresh Chromium offer and Firefox accepted-stage screenshots were
inspected under `.artifacts/effects-independent-if03/`.

```sh
EFFECTS_RUN=independent-if03 node node_modules/@playwright/test/cli.js test \
  browser/ordinary-offer-layout.spec.js browser/return-geometry.spec.js \
  browser/game-effects.spec.js browser/offer-layout.spec.js \
  --grep '1024x768|1280x720 automatic cell 28|1366x768 hosted cell 22|1920x1080 automatic cell 28|768x1024 hosted cell 28|1280x720 numbers cell 28|immediate judgment|native Shift|reduced motion|maximum offer' \
  --config .artifacts/effects-playwright.config.js
npm run lint
npm run typecheck
npm run format:check
node scripts/check-coverage.js
git --no-pager diff --check
```

All passed. Existing 63-module coverage independently recalculated unchanged.
No unit/build suite was independently rerun in this CSS-only recheck; earlier
45-unit verification and developer 957-unit/build evidence remain distinguished.
All six lenses cleared: correctness, ordinary-layout accessibility, maintainable
intrinsic sizing, unchanged runtime ownership/cleanup, proportionate native
layout, and unchanged content/original audio. No threshold exception broadened,
framework/dependency added or public/name clearance inferred.

Both reviewer previews stopped; final port 4197 check returned ECONNREFUSED111.
Physical audio/devices, human screen readers and Safari/WebKit remain unverified.
The headless Firefox suspended-audio limitation and approved ownership/text
exceptions remain explicit.

## Coordinator post-review gate — PASSED

On the exact cleared 77-file snapshot: full formatting, lint, types,
**957 units/40 files**, both coverage groups across all **63 runtime modules**,
and build passed. Critical coverage: 99.81/99.81/98.72/97.17%;
remaining: 99.61/99.63/97.69/95.35%.

The combined Chromium/Firefox native gate passed **664/664**, no skipped,
unexpected or flaky cases, in 29.5 minutes. All 77 hashes still matched afterward
and the managed preview was stopped. Exact commands and logs are recorded in
`docs/interface-followups-handoff.md`. Only receipt/status documentation was
then updated; no reviewed implementation/test file changed.

The owner subsequently authorized a controlled Phase-12 pause for separate
delivery, preserving its uncommitted files and review evidence and resuming it
afterward. This section records isolated readiness, not a claim that primary
integration or deployment has already happened.
