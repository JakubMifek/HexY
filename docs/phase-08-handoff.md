# Phase 8 developer handoff — 2026-10-29

**Subsequent owner disposition:** the plan is finished and commit/push authorized
for private delivery. Remaining publication and verification requirements are
[follow-up work](release-readiness.md#follow-up-work), not completed checks.
The developer snapshot and independent review history below are preserved.

**Historical developer snapshot; independent review completed with BLOCKED verdict.**
The [review](../reviews/phase-08.md) found no implementation defects. After this
snapshot was frozen, the owner retained private-only hosting and HexY pending
proper conflict assessment, and authorized a future limited release with
controller/tablet support unverified/experimental and stated browser/accessibility
gaps. No physical verification or publication authorization is implied.
The evidence and pending-decision wording below describe the original developer
handoff; current decisions are in [release readiness](release-readiness.md).

**Original handoff: ready for independent cross-phase review; public release BLOCKED.**
Baseline: `aa465b980eb0ec17d53fa89be8db1806ed2556d0`, already pushed and
privately served before this work. This candidate is uncommitted. No deployment,
public exposure, service/configuration change, commit, push or delegation.
Coordinator phase-start edits were preserved. No phase-8 review is fabricated.

## Changes and demonstrated fixes

- **Missing built-distribution notices:** the previous production `index.html`
  and minified JS contained no MIT permission text or Vite helper attribution.
  `index.html` now carries the complete original-code MIT notice, Vite's exact
  installed-package copyright and MIT scope, and original-content CC BY/source
  attribution. It survives root and `/hexy/` builds. A real production-response
  regression failed before this change and passes afterward.
- **Stale completion claims:** README still described final content as awaiting
  review; inventory/ledger headers contradicted their cleared reviews; the
  summary phase table still called the completed private preview blocked.
  Those current-status statements now match preserved review/correction history.
- **Release verification:** five new real-browser cases check distribution
  notices plus both-language/theme keyboard answering, answer concealment in the
  accessibility tree, non-announcing timer, same-origin production requests and
  recovered ownership. A separate cross-engine configuration reuses 63 existing
  portable journeys plus these five; it does not weaken the full Chromium suite.
- **Decision evidence:** naming research includes actual public products and a
  potentially relevant EU class-9 record displayed by TMview, with explicit
  source/status limitations. The dedicated public-host proposal preserves the
  private preview/admin and requires specific owner approval.

No gameplay, runtime JavaScript, content JSON, dependency manifest/lockfile,
server implementation or installed runtime changed. JS/CSS output hashes match
the current private release exactly; only the HTML distribution notice changes.
The installed preview's strict build validator accepts this candidate without a
migration: notices are in the existing index, not an unsupported new static route.

Exact changed/new files, including inherited coordinator edits:

```text
IMPLEMENTATION_PHASES.md
PLAN.md
README.md
NOTICE.md
index.html
docs/content-inventory.md
docs/content-sources.md
docs/release-readiness.md
docs/phase-08-handoff.md
browser/release.spec.js
playwright.cross-browser.config.js
```

## Whole-product acceptance map

“Software verified” means the current automated/actual-browser evidence passed;
it is not independent phase clearance or a substitute for the missing gates.
The tests use the real domain engine and actual saved/imported/exported formats.

| PLAN acceptance criterion                                                                | Implementation and current evidence                                                                                                                                                                    | Status                                                                                            |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| 28 adjacent cells; seven per edge                                                        | `domain/board.js`, `tests/board.test.js`; SVG count/layout journeys                                                                                                                                    | Software verified                                                                                 |
| All three chooser/recipient examples                                                     | `domain/game.js`, `outcomes.js`, `tests/game.test.js`; eight `browser/game.spec.js` language/board/answer combinations                                                                                 | Software verified                                                                                 |
| Unlimited initial attempts                                                               | `game.test.js`, real wrong-answer then capture flows; initial deadline unchanged                                                                                                                       | Software verified                                                                                 |
| One opponent opportunity; no early answer disclosure                                     | Engine/DOM tests, `game.spec.js`, new accessibility snapshots before and during opponent opportunity                                                                                                   | Software verified                                                                                 |
| Exact timer expiry/reset/end; no extra time after focus/reload                           | `runtime/clock.js`, `runtime.test.js`, `saves.test.js`, `resilience.spec.js` reload at −1/0/+1 ms; modal/theme/focus cases                                                                             | Software verified                                                                                 |
| One connected component touching three sides; corners/branches/disconnected groups       | `board.test.js`, `game.test.js`, `duels.test.js`; host-created/reopened visible winning connection                                                                                                     | Software verified                                                                                 |
| Normal/lightning recipient-based next chooser                                            | `game.test.js`, `duels.test.js`, `browser/game.spec.js`, `browser/duels.spec.js`                                                                                                                       | Software verified                                                                                 |
| Host reset/award/blacken every cell; independent chooser                                 | Explicit transitions in `domain/actions.js`; tests and real between-round/post-win edits; no active-round controls                                                                                     | Software verified                                                                                 |
| Correction victory/persistence and stale callbacks                                       | `game.test.js`, `runtime.test.js`, `resilience.spec.js`, `recovery-review.spec.js`; recovered host-reset original question                                                                             | Software verified                                                                                 |
| Reload/restoration; explicit interrupted-duel restart without award                      | `saves.js`, `runtime/recovery.js`; unit boundaries and preview/active/interrupted browser recovery cases                                                                                               | Software verified                                                                                 |
| Wrong symbol/holds/ties/missed targets                                                   | `duels.test.js`, `keyboard.test.js`, `devices.test.js`; real engine keyboard/pointer, native Chromium multi-touch                                                                                      | Software verified; physical latency/fairness not claimed                                          |
| Distinct Left/Right Shift; validated mappings/controller assignment                      | `runtime/keyboard.js`, `gamepad.js`, `inputs.js`; adapter and browser device-loss/release cases                                                                                                        | Software verified with mocked Gamepad API; physical Xbox gate pending                             |
| Both themes/custom colors/non-color cues                                                 | UI/visual tests; A/B marks, black ×, win outlines, same-white player colors; computed control-border contrast ≥3:1                                                                                     | Software verified; no universal WCAG/assistive certification                                      |
| Czech Ch / English CH, SH                                                                | Exact `ALPHABETS`, every fixed pack's order/schema, both-language actual boards                                                                                                                        | Software verified                                                                                 |
| Agreed normalization, aliases, no fuzzy matching                                         | `answers-packs.test.js`, content tests, real automatic play; punctuation/hyphens remain significant unless aliased                                                                                     | Software verified                                                                                 |
| All 28 labels exactly once per fixed pack                                                | `content.test.js`, `catalog.test.js`; every shipped JSON included                                                                                                                                      | Software verified                                                                                 |
| 36 authored packs / 1,008 reviewed entries; nine categories, two packs/language/category | Full quotas and ID/hash ledger checks; byte comparison of **all 36** files to cleared baseline; `reviews/phase-05.md` through `phase-07.md` preserve full independent editorial review and corrections | Verified continuity, not a new factual re-review                                                  |
| Generated games: 28 eligible non-repeats, only selected sources                          | `preparation.test.js`, `content.test.js`; full-library/mixed-source Czech/English browser generation, exact source origins and locked recoveries                                                       | Software verified                                                                                 |
| Export/reimport custom/generated packs; actionable failures preserve state               | `workspace.test.js`, `library.test.js`, `recovery.test.js`; preparation/storage/recovery browser suites, actual JSON downloads, invalid imports/read/write/quota errors                                | Software verified                                                                                 |
| Downloaded sheet exactly matches prepared board                                          | `answer-sheet.test.js`; actual standalone HTML and **52 real PDFs**, decoded row IDs/initials/questions/answers/aliases/citations/origins in order                                                     | Software verified; physical printer not tested                                                    |
| No copied TV assets/undisclosed third-party material                                     | Original native SVG/CSS/system-font sources; full original-question provenance/reviews; `NOTICE.md` documents Vite's emitted helper and scope                                                          | Provenance/notice evidence present; naming remains unresolved                                     |
| Static public no-login deployment under selected path                                    | Local production root and `/hexy/` real play/refresh; current private HTTPS headers/version/assets read; prior private automatic-update/rollback review retained                                       | **BLOCKED: public hostname/config approval and actual public HTTPS/update/rollback proof absent** |

Additional phase-8 acceptance:

- All four required viewports (1280×720, 1920×1080, 1024×768, 768×1024),
  both themes/languages, touch-target/layout/scroll, keyboard focus and
  reduced-motion checks remain in the full suite. Essential question/duel
  controls stay reachable; intentional vertical scrolling is not clipping.
- Timer/listener/pending-edge disposal is covered by adapter tests and actual
  page-lifecycle browser cases in both tested engines.
- README usage, storage/backup limitations, license scopes and asset/tool
  attribution are current. No automatic-mode host correction or pause added.
- Physical Xbox/tablet, actual screen reader and remote Windows Edge access
  remain unverified. Emulated multi-touch, mocked device APIs and accessibility
  snapshots are explicitly not physical/human verification.
- Fresh independent **cross-phase** review and coordinator post-review runs
  remain next, not just a review of this small diff.

## Commands and exact results

Final complete gates were sequential (no competing application test servers):

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-08-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-08-browser.log 2>&1
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config playwright.cross-browser.config.js --project=firefox > .artifacts/phase-08-firefox.log 2>&1
git diff --check
```

- Full check **PASS**: format, lint, JSDoc types, **286 tests / 19 files**,
  scoped V8 coverage enforcement and build. The unchanged **35 private-preview
  tests** are included. No deployment implementation changed, so no additional
  Docker/service integration or mutation was warranted.
- Full Chromium **211/211 PASS** (retained 206 plus five new cases), no skips.
  Chromium **156.0.8078.4**, Playwright **1.64.1**.
- Portable Firefox **68/68 PASS**, no skips. Firefox **157.0**, Linux/headless,
  not a claim about a physical tablet or all stable browser versions.
- Production build **86 modules**; JS **388.48 kB**, gzip **106.99 kB**;
  CSS **7.01 kB**; index with notices **2.15 kB**.
- Ten unchanged negative coverage probes passed and restored the summary
  byte-for-byte, SHA256
  `3321543333f050072038e6d784b3715f2b1ecbdf2aa042449af7909520f766bb`.
  Command: `node .artifacts/phase-05-coverage-probes.mjs`; current log:
  `.artifacts/phase-08-coverage-probes.log`.
- Production metric maxima remain **294 module lines / 60 function lines /
  complexity 10 / nesting 3**, no exceptions. Measured using ESLint against
  every `src/**/*.js`; `.artifacts/phase-08-metrics.{json,log}`.
- Canonical `/hexy/` build accepted by `deploy/releases.js:validateBuild`;
  real local subpath play/capture/reload kept exact locked pack and ownership,
  zero page/request failures, asset requests only `/hexy/assets/`.
  Initial responses 200; normal Vite reload revalidation 304. This is not NGINX
  cache-policy or public HTTPS evidence.

Subpath reproduction after all browser suites stop:

```sh
TMPDIR="$PWD/.artifacts" npx vite build --base=/hexy/ --outDir=.artifacts/phase-08-dist
node --input-type=module -e 'import {resolve} from "node:path"; import {validateBuild} from "./deploy/releases.js"; console.log(validateBuild(resolve(".artifacts/phase-08-dist")));'
TMPDIR="$PWD/.artifacts" npx vite preview --host 127.0.0.1 --port 4182 --strictPort --base=/hexy/ --outDir=.artifacts/phase-08-dist
```

Open `http://127.0.0.1:4182/hexy/`, start hosted play, capture a field and
reload; stop only that owned preview afterward. Artifacts:
`phase-08-subpath-{build,browser}.json`, corresponding logs and
`phase-08-subpath-recovered.png`.

### Browser provisioning and failed attempts

The initial launch probe succeeded for Chromium but reported missing Firefox
and WebKit executables. Only then were local browser downloads attempted.
Playwright's downloader timed out; its garbage collector removed the previously
installed Chromium. It was restored from the official **same-version** archive
using curl; no engine version or package lock changed. README now documents
`PLAYWRIGHT_SKIP_BROWSER_GC=1` for additional engine installs.

Official matching Firefox/WebKit archives were retrieved with curl, extracted
under `.artifacts/browsers` (including WebKit's actual symlinks), never globally.
Firefox initially lacked GTK/Pango/Cairo. Twenty-three missing dependency
packages were downloaded with `apt-get download` and **extracted, not installed**,
under `.artifacts/phase-08-browser-libs`; existing `.artifacts/browser-libs`
was not overwritten. Firefox then launched and passed the full selected suite.
Download archives/package scratch copies were removed after verification.

WebKit **27.2 / build 2370 could not launch**: the actual process reported missing
`libatk-1.0.so.0`; its bundled launcher replaces `LD_LIBRARY_PATH`, and direct
dependency inspection listed 39 unavailable dependencies including GStreamer,
Flite, AVIF/JXL and other libraries. No global installation, `sudo`, shared
library/config change or patched browser launcher was attempted.
`phase-08-webkit-{probe,missing}.log` and
`phase-08-engine-runtime-probe.log` record the exact failures. The optional
WebKit project remains reproducible on an appropriately provisioned machine,
but **no WebKit/Safari pass is claimed**. Firefox supplied a feasible independent
engine instead of pretending hardware/Safari coverage.

Other iteration failures, not hidden by retries/skips:

- Initial Firefox: 63 passed / five failed. The missing-notice case demonstrated
  the actual distribution defect. Four new test cases incorrectly assumed
  initial focus went straight to the input; the existing accessible behavior
  focuses the phase heading, then Tab reaches the answer. Corrected the new
  test to exercise that native path, not the application. Focused five then
  passed before the final 68. Initial failure artifacts are retained in
  `.artifacts/phase-08-firefox-initial-evidence/`.
- A focused CLI invocation placed the file after variadic `--project`; it was
  corrected to `test browser/release.spec.js ... --project=firefox`.
- An artifact-only build-validation probe used a relative path instead of the
  documented canonical absolute path; corrected to `resolve(...)`.
- An artifact-only local refresh check initially expected all assets to return
  200; observed legitimate 304 revalidation was explicitly verified instead.
- Registry fetches/first UI probes had transport/access/initialization and
  selector errors. A later real TMview search succeeded, but detail retrieval
  failed. The decision brief reports that final evidence, not “no matches.”

## Coverage scope and limits

| Scope               | Lines              | Statements         | Functions      | Branches         |
| ------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 files  | 2831/2842 (99.61%) | 2860/2871 (99.62%) | 211/211 (100%) | 880/901 (97.67%) |
| Remaining, 21 files | 2548/2558 (99.61%) | 2587/2597 (99.61%) | 85/87 (97.70%) | 360/376 (95.74%) |
| Critical gate       | 95%                | 95%                | 95%            | 90%              |
| Remaining gate      | 85%                | 85%                | 85%            | 80%              |

All **47 runtime JavaScript files** included, with untested files in the
denominators; only type-only `src/domain/types.js`, content data and generated
outputs excluded. No coverage ignore, threshold change or runtime exclusion.
Browser success is **not** counted as statement coverage.

```text
Critical:
src/app.js                         src/workspace.js
src/domain/actions.js              src/domain/answers.js
src/domain/board.js                src/domain/config.js
src/domain/duels.js                src/domain/errors.js
src/domain/game.js                 src/domain/generation.js
src/domain/outcomes.js             src/domain/packs.js
src/domain/preferences.js          src/domain/saves.js
src/domain/validation.js
src/runtime/buzzer.js              src/runtime/clock.js
src/runtime/downloads.js           src/runtime/gamepad.js
src/runtime/inputs.js              src/runtime/keyboard.js
src/runtime/library.js             src/runtime/preparation.js
src/runtime/recovery.js            src/runtime/symbols.js
src/runtime/touch.js

Remaining:
src/content/catalog.js            src/main.js
src/messages.js                   src/ui/answer-sheet.js
src/ui/application.js              src/ui/board.js
src/ui/catalog.js                  src/ui/device-strings.js
src/ui/dom.js                      src/ui/editor.js
src/ui/game.js                     src/ui/header.js
src/ui/host.js                     src/ui/inputs.js
src/ui/library.js                  src/ui/preparation-strings.js
src/ui/preparation.js              src/ui/recovery.js
src/ui/round.js                    src/ui/setup.js
src/ui/strings.js
```

## Visual, editorial and operational evidence

Full Chromium output contains **217 PNGs and 52 actual PDFs**. Existing print
helpers validate actual decoded PDF text against the exported JSON and standalone
HTML, not a PDF-shaped success flag. PNGs are print-media/browser screenshots,
**not rasterized PDFs**; no physical printer was used.

Directly opened and inspected representative evidence:

- `visual-1280x720-dark-reada-6d462-long-question-and-ownership/question-viewport.png`
  and `visual-768x1024-light-read-06046-long-question-and-ownership/question-viewport.png`:
  Czech long questions, glossy board above panel, readable controls.
- `release-release-en-dark-ke-38d03-vacy-and-same-origin-assets/opponent-accessible.png`
  and `release-release-cs-light-k-b99b8-vacy-and-same-origin-assets/opponent-accessible.png`:
  clear answering player/opportunity, visible keyboard focus, no accepted answer.
- `resilience-visual-1024x768-c9fcd-focus-recovery-and-controls/duel-viewport.png`
  and `resilience-visual-768x1024-8c8f8-focus-recovery-and-controls/duel-viewport.png`:
  separate large A/B buzzers, target/instructions and release status.
- `phase-seven-P7-01-letters--1070e-tic-play-and-actual-exports/answer-sheet-print.png`
  and `phase-seven-phase-seven-en-e0d88-s-export-print-and-recovery/answer-sheet-print.png`:
  exact fixed/mixed-number rows, corrected surname clue, aliases and mapped
  provenance; matching PDFs exist beside them.

Those paths are under `.artifacts/playwright/`. Also opened Firefox
`.artifacts/playwright-cross-browser/visual-1024x768-dark-reada-f7f47-long-question-and-ownership-firefox/question-viewport.png`.
Full interaction/layout matrices, not those selected images alone, establish
the tested combinations. New accessibility snapshots are attached to the reports.

`.artifacts/phase-08-content-continuity.json` records every baseline byte/hash,
source-ledger ID/hash and count: all 36 / 1,008 unchanged. Existing schema,
quotas, duplicate/source-selection tests passed. No source was reworded, no
editorial judgment was replaced and no 1,008-entry factual re-review is claimed.

Read-only private observations: active/enabled timer, read-only UID 101 Docker,
loopback current/candidate ports, private Serve only, correct actual HTTPS
revision and asset hashes/headers. `.artifacts/phase-08-private-http.json`
records responses. They do not prove external Windows Edge access, public
availability, a new automatic update or rollback. Prior private-update proof
remains in `reviews/private-preview.md`.

Naming artifacts: `phase-08-hexy-studio.html`, `phase-08-tmview-results.txt`,
`phase-08-tmview-details.{txt,log,png}` and register-probe logs. The
[decision brief](release-readiness.md) cites public URLs and accurately limits
TMview summary status/class evidence versus unavailable authoritative goods.
No confidential host information was sent to public research services.

## Freeze, blockers and next action

The owner needs the three decisions in [release readiness](release-readiness.md):
name assessment/alternative, physical-device verification or explicitly approved
limitations, and exact public hostname/isolated deployment permission. Human
assistive-technology and remote-client evidence are also not established.
Only after those decisions and actual public proof can the complete phase gate
be considered; passing software alone cannot clear it.

No new state owner, wrapper hierarchy, runtime dependency or metric exception
was introduced. Existing pure rules, concrete resource lifetimes and storage
boundaries remain unchanged. Review those cross-phase paths afresh, not just
these document/notice changes.

Final snapshot: `.artifacts/phase-08-snapshot.sha256`, generated after all writes,
covering every changed/new nonignored file above. Owned test/browser resources
are stopped and 4182 closed; live 4183/4184/admin remain untouched.
**Developer stops writing for independent review.** Coordinator must preserve
the review result and run post-review checks on the identical reviewed snapshot;
neither developer readiness nor an approval of limited scope is automatic
public-release clearance.
