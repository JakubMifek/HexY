# Phase 9 developer handoff

**Coordinator disposition:** independently CLEARED after P9-IR1/P9-IR2 fixes;
complete post-review gates passed (331 tests, 354 Chromium and 211 Firefox
journeys, 15 coverage probes). See [review and final verification](../reviews/phase-09.md#independent-re-review-cleared).
The developer snapshots and their original pending-review wording below are
preserved as historical evidence.

Baseline: `b757e872fb2c8b350d8cea73a74adbb923812de1`.
The owner-approved guided redesign includes the subsequent exact seven-symbol,
continuous-duel and tile-initial-flip amendments. **Initial review: CHANGES
REQUIRED; bounded corrections await independent re-review.** This is not
public-release clearance or deployment authorization. The original
`.artifacts/phase-09-snapshot.sha256` (78 changed/new nonignored files) is
immutable; the corrected candidate uses `.artifacts/phase-09-rereview.sha256`.
See the [developer correction response](#developer-response-to-initial-review).

## Acceptance map

| Owner requirement                                         | Implementation and verification                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Simple fresh Menu; active reload recovery; confirmed Exit | Explicit `Navigation` pages separate from authoritative `App.state`. New Game, Options and Import Game are the three entry actions. Exit removes the observed save before returning to Menu; unread/corrupt/changed records retain existing consent protections. Reload restores an active game, never an exited one.                                                                                                                                                          |
| Options and header                                        | Default 30 seconds and random starter; one language controls UI and newly selected questions. Input configuration is preparation-only. Header theme is an accessible, localized sun/moon button without visible text. Fullscreen implementation and controls are removed; browser F11 remains external.                                                                                                                                                                        |
| Player form and stable defaults                           | Injected-random, distinct Lord of the Rings character names, editable names/colors and human/digital host. Theme-appropriate cyan/amber defaults. Only names are used, not third-party artwork/narrative. Back/theme/render do not reroll names, regenerate a board or replace draft choices.                                                                                                                                                                                  |
| Final board/deck preparation                              | Primary Number and Alphabetical visual tiles reveal the existing source catalog, acceptance, import/editor/library capabilities. Matching-language catalog defaults, separate title/metadata cards and selected-source summary. Fixed placement and selected-source-only number generation remain unchanged.                                                                                                                                                                   |
| Exact human-host sheet gate                               | Start/import must successfully initiate the accepted/locked board's HTML download. A synchronous initiation failure leaves preparation/import pending. The UI explicitly cannot confirm disk saving. Digital host offers no sheet. Existing row-for-row HTML/PDF/provenance assertions run through hosted preparation.                                                                                                                                                         |
| Focused gameplay                                          | Centered board, Exit Game and complete Save Game actions; no New Game, fullscreen, input settings or question-library access. Hosted judgments/corrections sit right; chooser overrides are in player cards. Correction restrictions remain selecting/won only; judgments remain current hosted opportunities.                                                                                                                                                                 |
| Color-only tiles                                          | Captured tiles have no visible owner symbols or per-player border patterns. Black tiles keep original identifiers without ×. Accessible ownership names, keyboard focus and winning-group feedback remain. This is the explicit owner-approved color-vision exception, not universal WCAG compliance.                                                                                                                                                                          |
| Selected tile flips to its initial                        | A 480-ms native SVG/CSS flip reveals the complete authored initial on accepted question selection, including `Ch`/`CH`/`SH` on either board type. Initial stays through opponent opportunity; black-duel identifiers and captured color-only tiles remain unchanged. A consumed render cue prevents replay on theme/render/recovery. Reduced motion reveals immediately. Actual CSS-transform/opacity, keyboard, deadline, recovery and reset regressions cover the amendment. |
| No gameplay scrolling                                     | Five required viewports × both languages/themes × both host modes exercise maximum accepted text, names, custom/default colors, required controls and actual storage-failure UI. Tests inspect scroll dimensions, element bounds/hit-testing and question text line rectangles, not overflow hiding. Long questions can cover much of the board; player cards and required actions remain visible.                                                                             |
| Safe recovery UI                                          | Unsaved/error status opens explicit recovery controls in a fitted modal, rather than obscuring question text or playable fields. Timers continue. Its export reads current state, including deadline expiry after opening. Neither recovery nor Exit dialogs permit hidden duel restart; closing revokes readiness again.                                                                                                                                                      |
| Automatic interruption restart                            | Both players must freshly press and release controls; no checkbox/restart button. Real Left/Right Shift, remapped keys, touch and mocked controllers are covered. Lone keyup, stale readiness, repeat/hold, repeated interruption, missing assigned controllers, disposal and queued callbacks cannot resume or award.                                                                                                                                                         |
| Exact continuous duel amendment                           | Circle, star, square, triangle, hexagon, heart and sun. One target is shown before play and stays fixed across missed targets and ties. Random bounded permutations contain all seven, continuing indefinitely without missed-target preview/readiness. Ties restart an active cycle without award. Wrong-symbol awards, 8-ms fairness, 2-second preview and 900-ms cadence remain.                                                                                            |
| Bounded timing/save behavior                              | Only the current seven-symbol cycle is saved. Delayed ticks skip elapsed cycles in bounded work while preserving cadence and rejecting old-context presses. Deterministic multi-cycle and delayed-clock tests prove fixed target, complete pool, no automatic capture/turn change, serialization bounds and interrupted recovery.                                                                                                                                              |
| Complete portable games                                   | `hexy-game` envelope v1 carries domain game v2, exact locked pack/progress, names/colors, language/board/host/time/starter settings and keyboard mappings. All fields and cross-field consistency are validated before adoption. Menu import restores directly; hosted import only adds its sheet gate. Active duels import interrupted; answering deadlines never reset.                                                                                                      |
| Failure preservation and limits                           | Wrong format, future version, invalid/inconsistent metadata, unsupported symbols and oversized files preserve existing data. Complete files are limited to 2,000,000 UTF-8 bytes with room reserved for later state growth. Compact exports avoid pretty-print expansion beyond the import limit; near-limit export/reimport has a regression test.                                                                                                                            |
| Content, architecture and scope                           | All 36 reviewed JSON packs / 1,008 entries remain byte-identical. Vanilla modules/native SVG/CSS; no runtime dependency, framework, backend or deployment change. Existing phase-8 naming/public/device follow-ups remain deferred.                                                                                                                                                                                                                                            |

## Format and compatibility decisions

- Packs, library records and keyboard-preference formats remain v1.
- Domain game **v2** explicitly distinguishes infinite permutation cycles from
  historical v1 finite, target-last sequences. V1 validation still checks the
  original sequence/timing invariants before migration; invalid old data is not
  reinterpreted as a valid new game.
- Browser recovery upgrades valid historical circle/triangle/square/star
  configurations to the exact seven-symbol pool. Active legacy duels are
  interrupted first; board, chooser and absolute question deadline are preserved.
  No shape-name substitution is necessary. Unknown old shapes and invalid new
  pools are rejected before adoption, including between turns.
- Old raw **local** saves remain recoverable; unavailable display metadata uses
  existing browser preferences. Saving upgrades them to the complete envelope.
  Menu Import Game rejects raw old game exports and pack JSON with guidance,
  rather than guessing missing player/settings metadata. Preserve originals and
  use a compatible application for old raw-file recovery.
- Theme and connection-specific controller assignments are deliberately not
  portable. Imported keyboard mappings apply to the restored game. A disconnected
  assigned controller blocks restart: Save → Exit → reassign in Options → Import.
- Questions allow 600 UTF-16 code units, canonical answers 120 and player names 30. Existing reviewed maxima are only 183/41. Maximum-width repeated glyphs
  were measured, not merely ordinary prose. Long questions use 18px text,
  ordinary questions 20px. Existing oversized custom data is explicitly rejected
  and preserved for export, never truncated or silently deleted.
- File-size validation reserves at least 512 bytes for round data, more for a
  larger generic domain alphabet, plus full-width counters/timestamps and a new
  runtime UUID. Exact formats and failure paths are in [contracts](contracts.md).

## Root causes and design

The old interruption UI collected checkboxes and a separate restart click.
Keyboard release feedback alone could not request a restart, and a lone keyup
could previously clear release requirements. The new adapter records matching
fresh press/release ownership per player. Restart is deferred to a microtask
capturing generation and state, outside the releasing adapter callback. This
prevents rearming or another queued input in that batch from entering a new duel.
Fresh nonrepeating keydown also recovers genuinely missed outside keyups without
requiring an unexplained second press cycle; autorepeat remains blocked.

Controller edges must be neutral-armed before they count as fresh readiness.
A button first observed held after focus returns is not a new handshake.
Dialog closure, renewed focus loss and disposal invalidate queued readiness.
The domain engine remains the only award/chooser/victory authority.

`Navigation` owns preparation pages and pending hosted import, not gameplay.
`Recovery` continues privately owning write permission and protected originals.
Input-control/buzzer DOM projections live in `ui/inputs.js`, while `Inputs`
owns subscriptions, held/readiness state and lifecycle. These are concrete
responsibilities, not a generic wizard or service framework.

The finite duel previously selected a new target and preview at sequence
exhaustion. Domain-v2 cycle rollover now replaces only a bounded permutation
and advances its epoch. Ties retain the same target and active rotation.
No elapsed-history array, unbounded random generation or decrementing clock
was introduced.

Visual inspection caught two deficiencies beyond the initial bounding checks:
maximum text could cover player cards, and ordinary duel panels could cover the
board's bottom row. The final layout preserves the cards, explicitly sizes the
inactive question/duel board above ordinary panels, and tests the board's full
bottom edge rather than just comparing panel and board top coordinates.
Only unusually long questions use the approved overlap. Storage failures use
an explicit modal instead of a floating panel over required gameplay content.
Firefox additionally placed a maximum-length unbroken word entirely below the
host-reserving float. Explicit long-question word breaking prevents that extra
blank block; the same real bounds/hit-testing regressions pass without reducing
accepted limits. Root backgrounds no longer repeat at short preparation-page
boundaries.

Tile animation transforms an inner SVG face, leaving cell positioning and
keyboard semantics on the outer group. The authoritative selection starts the
deadline immediately. Only fresh selecting→question feedback carries the
one-render flip cue; question/opponent labels derive from state independently.
No timers, animation callbacks, saved presentation fields or new initial limits
are introduced. Browser tests seek real native animations at front/edge/back
positions and verify both opacity and transform, rather than merely checking
that an animation class exists.

## Initial-candidate verification

The initial complete `TMPDIR="$PWD/.artifacts" npm run check` passed formatting,
ESLint size/complexity/nesting ceilings, JSDoc type checking, **327 tests in
23 files**, separately enforced coverage and production build.
Log: `.artifacts/phase-09-check.log`.

| Scope               | Lines              | Statements         | Functions       | Branches          |
| ------------------- | ------------------ | ------------------ | --------------- | ----------------- |
| Critical, 29 files  | 3183/3188 = 99.84% | 3222/3227 = 99.85% | 229/229 = 100%  | 982/1008 = 97.42% |
| Remaining, 22 files | 2817/2827 = 99.65% | 2856/2866 = 99.65% | 98/100 = 98.00% | 446/465 = 95.91%  |

All **51 runtime JavaScript modules** are included, including untested paths.
Only the existing genuinely type-only `src/domain/types.js` is excluded.
No metric exceptions, runtime exclusions or coverage-threshold reductions.
Browser success is not reported as statement coverage.

Critical membership:

- `src/{app,workspace}.js`
- `src/domain/{actions,answers,board,config,controls,duels,errors,game,generation,outcomes,packs,portable,preferences,saves,validation}.js`
- `src/runtime/{buzzer,clock,downloads,gamepad,inputs,keyboard,library,navigation,preparation,recovery,symbols,touch}.js`

Remaining membership:

- `src/content/catalog.js`, `src/main.js`, `src/messages.js`
- `src/ui/{answer-sheet,application,board,catalog,device-strings,dom,editor,game,header,host,inputs,library,menu,preparation-strings,preparation,recovery,round,setup,strings}.js`

`node .artifacts/phase-09-coverage-probes.mjs` passed **14 negative probes**:
each of four metrics in both scopes, plus missing app/catalog and all four new
runtime-module memberships. The measured report was restored byte-for-byte.
Evidence: `.artifacts/phase-09-coverage-enforcement.log`.
Restored report SHA256:
`a8450064de47a389688b2a5b82fd49e854ef26811dda6bef27e005c9abaa51d5`.

The first complete continuous-duel Chromium pass had 256 successes and one
obsolete finite-tie assertion. The subsequently expanded recovery-layout run
passed all 40 maximum layouts and device flows; nine recovery journeys needed
explicit dialog-navigation corrections. Those 13 protected-save journeys then
passed together. These iteration results are not substitutes for final gates.
The pre-flip complete Chromium gate passed 257 journeys. Firefox then exposed
eight hosted maximum-word layout failures (106 journeys passed); those eight
passed after the word-breaking correction. The expanded nine flip journeys
also passed in Firefox before the final combined run.

The final candidate passed **266 Chromium journeys (10.0 minutes)**.
The final production code passed **123 Firefox journeys (6.6 minutes)**.
Its dark preparation pages were opened and inspected after correcting a legacy
theme shorthand that overrode the first background-repeat fix. Explicit
theme-local `fixed no-repeat` backgrounds and a browser regression now cover it.
The complete Chromium gate was repeated after that final paint correction.
The shared layout assertions moved into the existing `guided-fit.js` helper to
keep the spec below 300 lines without weakening or deleting checks. All **44
Firefox guided journeys passed (1.8 minutes)** after that test-only extraction.

Exact browser commands:

```sh
TMPDIR="$PWD/.artifacts" \
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" \
npm run test:browser

TMPDIR="$PWD/.artifacts" \
LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" \
npx playwright test --config playwright.cross-browser.config.js --project=firefox

# Recheck every affected Firefox journey after layout-helper extraction:
TMPDIR="$PWD/.artifacts" \
LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" \
npx playwright test --config playwright.cross-browser.config.js --project=firefox browser/guided-ui.spec.js
```

Logs: `.artifacts/phase-09-browser-final.log`,
`.artifacts/phase-09-firefox.log`,
`.artifacts/phase-09-firefox-layout-final.log`.
The full quality gate includes the unchanged **35 private-preview unit tests**.
No deployment integration rerun is required for this UI-only phase:
`git diff b757e872fb2c8b350d8cea73a74adbb923812de1 -- deploy` is empty.
Content byte-comparison/hash evidence is `.artifacts/phase-09-content-check.log`.
Playwright version: **1.64.1**. All owned preview processes have exited; port
4182 is released. Final documentation formatting and `git diff --check` pass.

## Inspected visual evidence

Stable copies are under `.artifacts/phase-09-visual/`; original per-test outputs
and interaction/bounds assertions remain in the Playwright reports.
Representative images were **opened and visually judged**, not merely generated:

- `menu-firefox.png`, `options-firefox.png`, `players-firefox.png`,
  `board-choices-firefox.png`, `decks-firefox.png`: simple entry, spaced player
  form, distinct board choices and matching-language deck cards. Preparation
  scrolling remains allowed. The corrected dark background has no restart seam.
  The corresponding `menu.png`, `options.png`, `players.png`,
  `board-choices.png` and `decks.png` retain final Chromium views too.
- `question-whole-board-1280x720-light.png` and
  `duel-whole-board-1280x720-dark.png`: the entire inactive board stays above
  ordinary panels; required text and controls are readable.
- `maximum-1280x720-en-light-hosted-{question,answer,recovery}.png`,
  `maximum-1024x768-cs-light-hosted-question.png`,
  `maximum-1024x768-cs-light-hosted-firefox.png`,
  `maximum-1366x768-en-dark-hosted-question.png`,
  `maximum-1920x1080-cs-light-custom-question.png`,
  `maximum-1280x720-en-dark-custom-answer.png`,
  `maximum-768x1024-cs-dark-custom-{question,answer,recovery}.png`:
  maximum text wraps without covering player names/roles or host/player actions.
  Long questions intentionally cover much of the inactive board. Recovery's
  modal remains fully visible; white/custom ownership retains the approved
  color-only presentation.
- `symbol-{Circle,Star,Square,Triangle,Hexagon,Heart,Sun}.png`: all seven native
  glyphs were inspected; star and sun are meaningfully different.
- `number-flip.png`, `number-Ch-firefox.png`, `number-SH-firefox.png`,
  `reduced-motion.png`: visible full tile initials, native flip and immediate
  reduced-motion projection. Animated behavior is additionally verified through
  actual transform/opacity seeking and deadline/recovery assertions.

## Initial changed-file scope

- Coordinator-preserved amendments: `AGENTS.md`, `PLAN.md`,
  `IMPLEMENTATION_PHASES.md`; PLAN additionally records the owner's later duel
  and tile-flip amendments. README/contracts and this handoff describe implemented behavior.
- Root/UI styling: `src/{app,workspace,main,messages}.js`,
  `src/{style,studio}.css`.
- Domain: `src/domain/{config,controls,duels,game,packs,portable,saves,types}.js`.
- Runtime: `src/runtime/{gamepad,inputs,keyboard,navigation,preparation,recovery,symbols}.js`.
- UI: `src/ui/{application,board,catalog,device-strings,game,header,host,inputs,menu,preparation,recovery,round,setup,strings}.js`.
- Unit/DOM: `tests/{catalog,continuous-duels,devices,duels,guided-ui,library,portable,preparation,recovery,resilience-ui,tile-flip,ui,workspace}.test.js`,
  `tests/{fixtures,ui-helpers}.js`.
- Browser: `browser/{answer-sheet,catalog,devices,duels,game,guided-ui,phase-seven,phase-six,preparation-storage,preparation-visual,preparation,recovery-review,resilience-visual,resilience,review-fixes,storage-recovery,tile-flip,visual}.spec.js`,
  `browser/{guided-fit,helpers,preparation-helpers}.js`,
  `playwright.cross-browser.config.js`.

The original snapshot enumerated every changed/new nonignored file, rather than
relying only on this grouped inventory. All 78 hashes matched before/after the
initial review. It is historical evidence, not the corrected-source manifest.

## Reproduction

1. On an unused browser profile, open Menu → Options. Check 30 seconds/random,
   unified language, accessible theme toggle and preparation-only controls.
2. New Game → edit player names/colors → Next. Switch Number/Alphabetical tiles,
   select a deck, go Back and return: choices remain. Human host initiates the
   exact answer sheet before play; digital host offers no sheet.
3. Select a numbered tile by pointer or keyboard. Observe the flip to its full
   initial while the timer already runs. Toggle theme or hand over to the
   opponent: the initial remains without replay. Resolve the field: owned tiles
   are color-only; a black field returns to its original number.
4. Select a black field. Keep the target in mind and wait through several cycles:
   all seven symbols recur, the target stays fixed and no tile is awarded merely
   for missing it. Blur/refocus, then press/release both Shifts to restart
   automatically. A lone release, held input or repeated blur cannot rearm.
5. Save Game, Exit and confirm; reload stays at Menu. Import the saved JSON:
   configuration/content/progress return directly (human host gets only the
   sheet gate). Import a pack JSON or invalid metadata: actionable error, no
   adoption. Reload an active question: its original deadline remains.
6. Run `browser/guided-ui.spec.js` for all 40 maximum-text layouts and recovery
   actions; `browser/tile-flip.spec.js` for native animation, full digraphs,
   reduced motion and cancellation/recovery. Preparation may scroll; gameplay
   must not. The browser specs use the real UI and engine.

## Limitations and permissions

No physical Xbox/tablet, human screen-reader, remote Windows Edge or Safari/
WebKit verification is claimed. Controller boundaries are mocked and touch is
browser-emulated. Existing WebKit host-library limitations remain; no host
provisioning was attempted. Native download initiation is testable, disk-write
confirmation is not. Static local content is inspectable, not anti-cheat.

No agents were delegated, dependencies installed, commits/pushes made, public
URLs exposed, deployment sources changed or shared services modified. Owned
production previews use only port 4182; no Vite watcher or live 4183/4184/admin
8443 changes. Original private-delivery history and public/naming/device
follow-ups remain unchanged. Independent reviewer clearance and coordinator
post-review verification are still required.

## Developer response to initial review

The independent [CHANGES REQUIRED report](../reviews/phase-09.md) and its
original evidence remain intact. This response addresses only **P9-IR1** and
**P9-IR2**, not a new redesign or a developer-issued clearance.

### P9-IR1 — atomic native-dialog readiness boundary

Native `dialog.close()` clears `open` immediately but delivers `close` later.
The original Inputs accepted modal-era readiness; a fresh A gesture could
combine with stale B in that gap, then the delayed interruption discarded A.
The synchronous DOM close stub concealed this real browser ordering.

The concrete shared `src/ui/game-dialog.js` owns Exit/recovery dismissal.
Cancel, Escape and discard synchronously revoke readiness, abort owned
listeners and clear modal ownership before returning. Native `close` remains a
fallback for external closure; closing-but-owned dialogs still block input.
An old detached dialog's event cannot affect its replacement. Inputs checks
modal availability for both readiness collection and restart authorization.
Existing focus, held-input, controller-neutrality, state-identity, generation,
disposal and queued-callback guards remain; no domain transition was bypassed.

`browser/modal-readiness.spec.js` exercises eight real-native-dialog journeys
without fake clocks: both launchers, actual Shift edges, a deterministic
same-task close/event gap, stale events against a replacement dialog, queued
restart cancellation, Escape, and a key held through dismissal. One fresh
gesture must leave the entire save/revision unchanged; both fresh gestures
produce exactly one preview save with unchanged ownership/chooser.
DOM regressions now defer native-close delivery and cover fallback/disposal.
Pad/touch-source feedback cannot authorize modal or post-modal restart without
both fresh gestures; existing actual-adapter mocked-device tests remain.

### P9-IR2 — readable error in the reserved feedback strip

The old fixed alert's vertical padding/full border exceeded the gameplay
feedback space and covered answer/submit/give-up despite zero scroll overflow.
The alert now uses readable 14px/1.3 text, horizontal padding and a left accent,
without extra vertical padding. Blocking errors take priority over existing
DOM feedback in that strip; `app.feedback` and the game remain untouched.
A valid rerender restores the retained result. No text limit, question size,
deadline, touch target or overflow rule was weakened.

`browser/clock-error-fit.spec.js` exercises 80 cases: five required viewports ×
both languages × both host modes × both themes × ordinary/600-unit question.
Both names use their 30-unit maximum. Each rolls time back by 1,000 ms, triggers
the real rejected action, checks byte-identical persisted state, actual text
rectangles, control hit-testing and scroll dimensions, then restores valid
time and verifies the opponent transition with the original deadline.

Corrected screenshots are preserved under `.artifacts/phase-09-fix-visual/`.
The following were opened and visually inspected, not merely generated:

- `clock-error-fit-clock-erro-f6f3c-en-automatic-light-ordinary.png`:
  portrait 768×1024, full error below answer/submit/give-up.
- `clock-error-fit-clock-error-768x1024-cs-hosted-dark-ordinary.png`:
  portrait Czech hosted mode, readable error, accessible give-up/judgments.
- `clock-error-fit-clock-error-1024x768-cs-hosted-dark-maximum.png`:
  maximum text above the error, host controls and give-up unobstructed.
- `firefox/{1280x720,768x1024}-en-automatic-dark-maximum.png`:
  Firefox maximum text and full English error remain readable, with all answer
  actions visible; the long question intentionally covers part of the board.

### Correction verification and scope

Before production changes, both native-dialog gap cases and the portrait
automatic clock-error case failed as expected:
`.artifacts/phase-09-fix-repros-before.log` (**3 failures**).
After correction, focused Chromium passed **86** journeys; final focused
Firefox passed **88**, adding the two held-key cases. Final focused units passed
**66 tests / 4 files**, and lint/types passed. Logs:
`.artifacts/phase-09-fix-{focused,focused-firefox,units,lint,types}.log`.

Exact final focused commands:

```sh
npm run lint
npm run typecheck
TMPDIR="$PWD/.artifacts" npx vitest run tests/guided-ui.test.js tests/devices.test.js tests/recovery.test.js tests/resilience-ui.test.js
TMPDIR="$PWD/.artifacts" \
LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" \
npx playwright test --config playwright.cross-browser.config.js --project=firefox browser/modal-readiness.spec.js browser/clock-error-fit.spec.js
```

The corrected full quality gate passed **331 tests / 23 files**, including all
35 private-preview tests, formatting, lint, types and production build.
Log: `.artifacts/phase-09-rereview-check.log`.

The final complete browser gates passed **354 Chromium journeys (11.3 minutes)**
and **211 Firefox journeys (8.3 minutes)**. The Chromium suite produced all
**52 actual answer-sheet PDFs**. Each full suite ran once after the corrections
stabilized, sequentially; no skipped failure or installation. Logs:
`.artifacts/phase-09-rereview-{chromium,firefox}.log`.

Exact full-gate commands:

```sh
TMPDIR="$PWD/.artifacts" npm run check
TMPDIR="$PWD/.artifacts" \
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" \
npm run test:browser
TMPDIR="$PWD/.artifacts" \
LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" \
npx playwright test --config playwright.cross-browser.config.js --project=firefox
node .artifacts/phase-09-rereview-coverage-probes.mjs
```

| Scope               | Lines              | Statements         | Functions        | Branches          |
| ------------------- | ------------------ | ------------------ | ---------------- | ----------------- |
| Critical, 29 files  | 3187/3192 = 99.84% | 3226/3231 = 99.85% | 229/230 = 99.57% | 986/1013 = 97.33% |
| Remaining, 23 files | 2828/2838 = 99.65% | 2867/2877 = 99.65% | 99/101 = 98.02%  | 447/467 = 95.72%  |

All **52 executable JavaScript files** are included. Critical membership is
unchanged from the initial list above; remaining membership adds
`src/ui/game-dialog.js` to its original 22 files. Only genuinely type-only
`src/domain/types.js` is excluded. No metric exception or threshold change.
`node .artifacts/phase-09-rereview-coverage-probes.mjs` passed **15 negative
probes**, adding missing-dialog-module detection. Report bytes were restored:
`5c0f3e2700e741a8df5c6c0affb849ee7821791cd35a862b4836f99747404758`.
Log: `.artifacts/phase-09-rereview-coverage-enforcement.log`.

Delta from the first frozen manifest:

- Changed: `PLAN.md`, `IMPLEMENTATION_PHASES.md`, this handoff,
  `playwright.cross-browser.config.js`, `src/app.js`, `src/runtime/inputs.js`,
  `src/studio.css`, `src/ui/header.js`, `src/ui/recovery.js`,
  `tests/guided-ui.test.js`.
- Added: `src/ui/game-dialog.js`, `browser/modal-readiness.spec.js`,
  `browser/clock-error-fit.spec.js`, coordinator-owned `reviews/phase-09.md`
  (formatting only; independent verdict/history preserved).

All 36 reviewed packs / 1,008 entries, deployment sources and dependencies
remain unchanged. The original 78-file manifest's SHA256 remains
`b5101ee29bda79841252b0724649849f6384a148862303c13d35e0d6bb7e6727`.
The corrected 82-file manifest includes the original scope and four new files.
Physical-device/WebKit/screen-reader/remote-Edge gaps and original public/naming
follow-ups remain as documented; neither finding required a new product decision.

Only documentation changed after final code-bearing verification. Final
`npm run format:check` and `git --no-pager diff --check` passed.
The owned preview on 4182 stopped after the browser gates; no shared service was
touched. The developer has stopped editing. Verify the corrected snapshot with
`sha256sum -c .artifacts/phase-09-rereview.sha256`, then return it to the same
independent reviewer. Coordinator post-review gates remain due after clearance.
