# Phase 2 independent review

Date: 2026-10-28. Current verdict: **CLEARED after re-review**.
The initial CHANGES REQUIRED verdict and findings are preserved below.
Reviewer agent: `a91c7cd7-25a2-448f-aaab-84a487c35802`.
Developer agent: `98026d51-7169-48a4-ac9d-5f450e459613`.
Baseline: `0155d7c0e095fda640ae49319a304f72fdb440c8`.

The reviewer inspected all 38 changed/new files in the developer manifest,
including untracked code/tests/tooling/content/docs and relevant existing domain
integration. Manifest fingerprint:
`cf9248f912db26e092f33a0753a6fffed7fc0f249bf5ffc48e6a50ad0032aaf3`.
All entries matched before and after review. The reviewer did not edit
implementation, install dependencies, commit, deploy or delegate.

## Findings

| ID    | Severity | Location                                                                       | Issue and required correction                                                                                                                                                                                                                                                   |
| ----- | -------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2-01 | Major    | `src/runtime/keyboard.js:23-42`, `src/app.js:90-94`, `src/ui/round.js:187-208` | A Shift release outside the unfocused page leaves a stale held-key entry; interrupted-duel restart silently stalls despite both readiness boxes being checked. Provide safe explicit release-rearming and actionable localized feedback; retain held/repeat capture protection. |
| P2-02 | Minor    | `src/app.js:131-160`, `src/ui/round.js:105-107`                                | Theme/language changes erase an in-progress typed answer while the deadline continues. Preserve the draft for presentation-only changes within the same question/opportunity; never transfer it to another opportunity.                                                         |
| P2-03 | Minor    | `src/content/general-en-01.json:21-28`, `general-en-01-02`                     | Basalt characterizes the volcanic upper oceanic crust, not most of the crust, whose thicker lower portion is principally gabbro. Narrow the question to ocean-floor lava or the volcanic layer and verify its source.                                                           |
| P2-04 | Minor    | `src/style.css:15,66-70`                                                       | Empty light-theme inputs have white interiors on white panels and a 2.274:1 identifying border, below 3:1 non-text contrast. Improve the boundary and test actual computed styles in both themes.                                                                               |

P2-01 reproduction: start a duel, hold Left Shift, blur the page, miss the
outside-page keyup, return, check both ready boxes and restart. It stays
interrupted without explanation until another observed Shift release.
Chromium reproduction injected the blur boundary because native headless tab
switching did not generate the necessary blur. This is not physical focus/device
verification. Simply clearing held keys on blur is not adequate held-input safety.

P2-02 reproduction: automatic English question 1, type `Athens`, toggle theme;
the input empties. Retype and change UI language; it empties again. Verify both
initial and opponent opportunities after the fix.

P2-03 independent sources:

- https://opentextbc.ca/physicalgeology2ed/chapter/18-2-the-geology-of-the-oceanic-crust/
- https://en.wikipedia.org/wiki/Oceanic_crust

P2-04 measured light input/panel RGB(255,255,255), border RGB(154,174,197):
2.274:1. Dark equivalent measured 3.875:1.

## Acceptance and review lenses

Setup, both starters/answer modes/board modes/languages, recipient turns,
unlimited initial guesses, single untimed opponent attempt, deadline preservation,
answer concealment, locked content, host restrictions, win/removal/reset,
glossy SVG/logo and below-board panel were verified.

Keyboard navigation, ownership cues, reduced motion and the core duel rules
were verified, with the findings above preventing clearance. Later-phase
editor/import/export/print/persistence/gamepad work is not missing phase-2 scope.

- **Correctness:** core transitions, revisions and cleanup are well covered;
  missed-keyup recovery and draft preservation need fixes.
- **Usability/accessibility:** reviewer inspected both themes/languages and
  desktop/tablet layouts, long Czech text, focus, non-color cues and wins.
  Recovery feedback, draft loss and light-input contrast remain defects.
- **Readability:** cohesive modules, meaningful tests and traceable transitions.
  Size/complexity/nesting checks pass; no metric suppressions or exceptions.
- **OOP:** `App`, `RoundClock` and `DuelKeyboard` own real resources/state;
  pure domain logic and serializable state remain separate. No god-controller
  or forced-class finding.
- **Patterns:** explicit state stages, injected time/randomness and contextual
  events serve present needs. No unnecessary framework/bus/runtime dependency.
  Broad DOM rebuilding is relevant because of P2-02, not a style objection alone.
- **Content/rights:** every one of the 56 Czech/English starter entries was
  examined for fact, wording, aliases and prefix. All 57 source URLs were
  independently fetched and supporting passages examined. Only P2-03 was
  identified as a factual defect. No copied question-bank/TV assets identified;
  this is not comprehensive legal clearance.

## Initial verification

Sequential reviewer commands:

```sh
npm run check
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser
git diff --check
sha256sum -c .artifacts/phase-02-snapshot.sha256
```

Formatting, lint/metrics, strict JSDoc types, 95 tests in 10 files, production
build and 29 Chromium browser tests passed. All manifest hashes matched.
Preview was stopped and port 4182 confirmed closed.

| Scope     | Lines              | Statements         | Functions    | Branches         |
| --------- | ------------------ | ------------------ | ------------ | ---------------- |
| Critical  | 1324/1330 (99.55%) | 1342/1348 (99.55%) | 79/79 (100%) | 364/375 (97.07%) |
| Remaining | 1129/1143 (98.78%) | 1134/1148 (98.78%) | 49/50 (98%)  | 174/189 (92.06%) |

Critical membership (14): app; domain actions/answers/board/config/duels/errors/
game/outcomes/packs/saves/validation; runtime clock/keyboard.
Remaining (11): main, messages, content/catalog; UI board/dom/game/header/host/
round/setup/strings. All 25 production runtime JS files included; only truly
type-only domain/types excluded. No coverage-ignore directives or engine mocks.

Reviewer fault-injected coverage reads in memory: every scope/metric failure
and a missing runtime file correctly caused exit 1. Browser success was not
substituted for coverage.

Additional evidence: unmocked-clock two-second answering journey with presentation
changes/new-game dialog; English tablet opponent capture and accessibility
snapshot without answers; screenshots at 1280x720, 1920x1080, 1024x768 and 768x1024.
Artifacts are local under `.artifacts/`, including `reviewer-stuck-restart.png`,
`reviewer-draft-{before,after}.png`, `reviewer-en-tablet-dark.png` and
`reviewer-content-sources.json`.

No physical tablet/controller, screen-reader-device, persistence/editor/printing,
deployment or trademark clearance claimed. No accepted metric exceptions.

## Re-review and post-review gate

Pending fixes and same-reviewer re-review of P2-01 through P2-04.
No phase clearance, post-clearance verification, phase commit or push yet.

## Developer response — 2026-10-28

All four findings have implementation changes and focused regression evidence.
**This is a developer response, not a clearance decision.** The initial findings
and CHANGES REQUIRED verdict above remain the review history; same-reviewer
re-review is requested.

| Finding | Implemented correction                                                                                                                                                                                                                                                                                                                                                                                               | Regression evidence                                                                                                                                                                                                                                                                                         |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2-01   | Every duel interruption requires observed in-window releases of both Shift keys, including another blur while already interrupted. The UI explicitly asks for press/release of each key to recover missed outside keyups. Restart checks focus, visibility, release confirmations and currently held keys, with a localized adjacent alert if blocked. No blind held-set reset; rearming has no active duel context. | `tests/keyboard.test.js`, `tests/ui.test.js`, `browser/review-fixes.spec.js`: missed keyup, outside/hidden releases, repeats, partial rearming, re-held key, repeated interruption, stale restart, successful fresh press after restart; Czech/English real-browser journeys.                               |
| P2-02   | `App.changePresentation()` captures unsent DOM input locally and restores it only across a theme/language render with the exact same immutable game/opportunity object. Drafts are not game-state fields and no canonical answer/alias is used. Transition renders clear them.                                                                                                                                       | Unit and browser tests for initial and opponent drafts, both presentation controls, expiry at the unchanged deadline, untimed opponent persistence, empty handover and next question, and no canonical-answer leakage.                                                                                      |
| P2-03   | `general-en-01-02` now asks which rock typically forms as erupted mid-ocean-ridge lava cools. B/Basalt and fixed placement are retained; the crust-volume claim is removed. Added BCcampus _Physical Geology_, section 18.2, whose text and layer-depth figure distinguish upper volcanic rocks from thicker gabbroic layers.                                                                                        | `tests/content.test.js` fixes the intended factual scope, source, identity, prefix and answer. Browser draft regression selects the corrected question. `.artifacts/content-audit.json` now records the correction and 58 accessed sources for 56 entries.                                                  |
| P2-04   | Light boundary color is now `#6f8299`; dark remains `#7288a3`.                                                                                                                                                                                                                                                                                                                                                       | Chromium computes borders, width, interiors and nearest painted surrounding surfaces for name, duration, setup/header selects and answer inputs. Every inside/outside ratio is ≥3. Measured panel ratios: light **3.940749:1**, dark **3.875206:1**; header outer ratios **3.373936:1** and **4.703012:1**. |

Final sequential commands/results:

```sh
npm run format
npm run check
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser
git diff --check
```

Formatting, metric lint, strict JSDoc types, **100 tests in 10 Vitest files**,
both enforced coverage groups and production build passed. **35 Chromium tests
passed** against the actual built application. No engine mocks, skipped tests,
threshold reductions, coverage exclusions or metric exceptions were introduced.
No dependencies were installed for these fixes.

| Scope                    | Lines                  | Statements             | Functions        | Branches             |
| ------------------------ | ---------------------- | ---------------------- | ---------------- | -------------------- |
| Critical, same 14 files  | 1365/1369 (**99.71%**) | 1383/1387 (**99.71%**) | 83/83 (**100%**) | 392/399 (**98.25%**) |
| Remaining, same 11 files | 1135/1149 (**98.78%**) | 1140/1154 (**98.79%**) | 49/50 (**98%**)  | 174/189 (**92.06%**) |

Evidence:

- `.artifacts/review-fixes-check.log`, `.artifacts/review-fixes-browser.log`;
  full measured file inclusion remains in the former.
- `.artifacts/review-fixes-control-contrast.json`: computed measurements
  extracted from the browser report's actual attachments, not inferred from CSS.
- `.artifacts/playwright/review-fixes-{cs,en}-*/release-rearming-feedback.png`;
  `.artifacts/playwright/review-fixes-{question,opponent}-*/preserved-draft.png`;
  `.artifacts/playwright/review-fixes-{light,dark}-*/input-boundaries.png`.
  Developer inspected representative screenshots after the final run.
- `.artifacts/browser-report/index.html`, `coverage/coverage-summary.json`,
  and `coverage/index.html` contain the final browser/coverage reports.
- Updated README/contracts explain release rearming and opportunity-scoped drafts.
- Regenerated freeze manifest: `.artifacts/phase-02-snapshot.sha256`, after all
  implementation and handoff writing.

The missed-outside-keyup browser regression deliberately injects blur and
suppresses one keyup event, matching the reviewer's reproducible headless
boundary. It then uses real keyboard events and the real engine to demonstrate
safe recovery. This is not physical device/focus verification. Phase-2 deferred
scope and hardware limitations are unchanged. Port 4182 is stopped; no commit,
push, deployment or shared-system change occurred.

## Independent re-review

The same independent reviewer rechecked the final 40-file snapshot with manifest
fingerprint `149ccfe4a7c0d43986e70b67d5357e6e93ae0967d86b98edef1d7b320d4c5f73`.
All manifest hashes matched before and after review. Verdict: **CLEARED**;
P2-01 through P2-04 resolved, no new mandatory findings, no metric exceptions.

- P2-01: independently replayed reverse-order rearming and repeated interruption.
  Both focused/visible releases were required again; held/repeated input did not
  capture; a subsequent fresh press did. Localized adjacent feedback is actionable.
- P2-02: independently switched presentation at 1,900 ms of a 2,000 ms question.
  Original expiry still applied and opponent input was empty. Both switches
  preserve the current draft, without transferring it to the next opportunity.
- P2-03: independently reopened Physical Geology section 18.2 and verified
  basaltic mid-ocean-ridge eruptions. Reread all 56 current records; other entries
  retain their previously reviewed wording, placement and aliases.
- P2-04: independently measured live light borders at 3.940749:1 against panels
  and 3.373936:1 against headers; dark ratios 3.875206:1 and 4.703012:1.

All six original review lenses were revisited as applicable. Fixes are focused,
release invariants stay in the keyboard adapter, drafts remain presentation state,
and no generic abstraction or alternate game implementation was introduced.
Reviewer ran sequential full `npm run check` and the documented Chromium suite:
100/100 unit tests, 35/35 browser tests, lint/types/format/build and separate
coverage gates passed. Coverage matches the final developer table above, with all
25 runtime production files included and only type-only declarations excluded.
No engine substitutions, coverage ignores, reduced thresholds or skipped tests.
Reviewer preview was stopped and port 4182 confirmed closed.

Fresh evidence includes release-rearming feedback, preserved-draft and
input-boundary screenshots under `.artifacts/playwright/review-fixes-*`, plus
`.artifacts/reviewer-rereview-tablet.png`. Physical-device and later-phase
limitations remain unchanged.

## Mandatory coordinator post-review verification

After independent clearance, every file in the coordinator's full frozen manifest
was verified unchanged. Manifest fingerprint:
`8b67ec140b69f64c00de32618cdb8951822a51970d77ba2762802e4bad0915c1`.

Then the coordinator ran, sequentially:

```sh
npm run check
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser
git diff --check
```

All passed: 100 tests, 35 Chromium journeys, formatting, lint/metrics, types,
both coverage groups at the final reported figures, and production build.
Logs: `.artifacts/phase-02-post-review-check.log` and
`.artifacts/phase-02-post-review-browser.log`. No implementation changes followed
re-review. Only this factual outcome and phase status documentation were added.

Phase 2 is cleared for commit/push. Phase 3 may start only after the push is
verified; this is still not a production release.
