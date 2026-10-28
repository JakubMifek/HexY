# Phase 4 independent review

Date: 2026-10-28. Final verdict: **CLEARED after fixes**.
Initial review and first re-review: **CHANGES REQUIRED**, preserved below.
Reviewer: `c74220e4-298d-42e3-bb31-8bd2e648d709`.
Developer: `096dc4e8-ead2-4ae3-bda1-c65ea3939dc8`.
Baseline: `9dfa3bcff2d4c90e60bc88b56ad85e6ed2e0abb5`.

All 27 changed/new files and relevant integration were reviewed; developer
manifest fingerprint:
`025f825829e842ad4f3362cd0e03d000913d1f0d558c309cd844ee64a90cf567`.
Hashes matched before and after review. No implementation/test/config/report
edits, installs, delegation, commits, publishing or shared-service changes.

## Findings

| ID    | Severity | Location                                                                                | Finding and correction                                                                                                                                                                                                                                                                  |
| ----- | -------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P4-R1 | Major    | `src/runtime/recovery.js:68-86`, `src/app.js:257-265`                                   | Changed-record warning does not revoke write permission. Following its retry instruction overwrites the replacement save. Revoke write permission/saved status, inspect and preserve replacement on retry, expose raw export and require explicit resolution before replacement writes. |
| P4-R2 | Major    | `src/runtime/recovery.js:23-37,91-105`, `src/app.js:278-286`, `src/ui/round.js:169-181` | Accepted saved-game symbols can crash rendering after persistence. Enforce browser-renderable compatibility before adoption/persistence with localized feedback and original preservation, or safely support all accepted symbols.                                                      |
| P4-R3 | Minor    | `src/runtime/inputs.js:38-46,118-122,153-177`, `src/runtime/gamepad.js:160-165`         | Safe gamepad test remains "Pressed" after release. Propagate release feedback without generating gameplay presses; verify both players/languages.                                                                                                                                       |

### Reproductions and impact

P4-R1: start a game, open New game, replace `hexy.game.v1` with a different valid
record before confirmation, then confirm. Deletion is correctly refused, but
"Retry recovery / saving" overwrites that protected record with the current game.
The independent probe observed `retained: true` before retry and `false` afterward.
Subsequent gameplay can also write because `discard()` leaves write permission
enabled. This concerns the explicitly promised changed-record protection, not a
demand for multi-tab merging. Test valid, corrupt and newer replacements; retry
and gameplay must preserve exact bytes until explicit resolution.

P4-R2: export a selecting game; change duel symbols to `["hexagon","diamond"]`
and cell 1 to black; start a new game/import the JSON; select cell 1. Domain
validation accepts these distinct nonempty symbols, but the browser renderer
supports four hardcoded shapes. Observed uncaught `Unsupported duel symbol`,
visible selecting stage, persisted duel-preview stage and no recovery feedback.
Aborted old handlers leave the UI unusable. Test startup and file recovery,
including selecting/interrupted states, with no uncaught error, dead interface
or premature replacement persistence.

P4-R3: assign a controller button in the input test, sample neutral, press,
release and sample again. The visible status stays `A · Pressed`; the press
callback updates feedback, but release invokes only `padChanged()`.

## Acceptance and review lenses

Verified: separate authoritative game storage; original deadlines at -1/0/+1 ms,
repeated reload and dialogs; opponent/selecting/won recovery; locked original
content and host restrictions; interrupted-duel recovery/readiness; keyboard
remapping/repeats/rearming; explicit gamepad assignment/disconnect/reconnect/
identity handling; native Chromium multi-touch and touch-only restart; modal
focus/sticky close/fullscreen; all previous 59 browser journeys.

Save-preservation/render compatibility and gamepad diagnostics remain blocked
by P4-R1 through P4-R3.

- **Correctness:** broad transition/lifecycle coverage, but two important
  recovery sequences remain unsafe and release diagnostics incomplete.
- **Usability/accessibility:** both languages/themes, below-board panel,
  glossy/non-color cues, long Czech text, touch targets, reduced motion,
  modal navigation/focus and contrast inspected. Input diagnostics need P4-R3.
- **Readability:** cohesive traceable modules, no unjustified suppressions.
  Existing tests omitted the failing sequences; new regressions are needed.
- **OOP:** purposeful resource adapters and serializable authoritative state;
  pure rules remain separate. No demonstrated god object.
- **Patterns:** shared batching/input composition solve present needs without
  framework, bus, speculative hierarchy or dependency.
- **Content/rights:** starter JSON unchanged, still 2 packs/56 entries. No new
  asset/dependency licensing issue; no deployment/name-clearance claim.

## Observed verification

Sequentially:

```sh
TMPDIR="$PWD/.artifacts" npm run check
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser
git diff --check
```

Passed: formatting/lint/types/build, 167 tests in 16 files and 94 Chromium
journeys. All 27 snapshot hashes unchanged. Negative coverage probes for zeroed
groups and missing recovery source exited 1 without modifying real reports.

| Scope                 | Lines              | Statements         | Functions      | Branches         |
| --------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 25 modules  | 2788/2799 (99.61%) | 2817/2828 (99.61%) | 205/205 (100%) | 859/880 (97.61%) |
| Remaining, 20 modules | 2260/2274 (99.38%) | 2264/2278 (99.39%) | 78/80 (97.50%) | 324/344 (94.19%) |

All 45 runtime modules included; only type-only `domain/types.js` excluded.
Critical: app/workspace, executable domain modules, all runtime adapters.
Remaining: main/messages/content catalog and all UI modules.
Independent metric maxima: module 297 lines, function 60 lines, complexity 10,
nesting 3. No exceptions required.

Additional browser probes covered held touch across capture/rerender/release,
touch-only interrupted restart, Tab/Escape/focus return and scrolled close,
question expiry while input controls stay open followed by opponent capture,
and a mocked visibility boundary cancelling a pending press without an award.
Actual hidden-tab behavior is not inferred from lifecycle freezing.

Both contact sheets/all 16 viewport-language-theme combinations and full-size
duel/tablet/long-text images were inspected.

Artifacts: `.artifacts/phase-04-independent-{check,browser,probes,interactions,
hidden-boundary,coverage-probes,metrics}.log` and
`phase-04-review-{changed-record,unsupported-symbol,dialog-bottom}.png`.
All reviewer browsers/preview stopped; port 4182 confirmed closed.

## Limitations and next gate

Physical Xbox/tablet, additional browser engines and screen-reader devices remain
explicit phase-8 pending checks. Single-editing-tab, offline-clock and 8 ms
batching/16 ms polling limits are disclosed, not claims of perfect fairness or
authenticated time.

All three findings remain open. Same-developer fixes, same-reviewer re-review,
then mandatory coordinator post-review checks precede clearance and commit/push.

## First independent re-review

Verdict: **CHANGES REQUIRED**. The original three reproductions passed after
fixes, but an additional recovery-permission sequence exposed P4-R4 below.
Reviewer verified manifest
`6382bf2f02e0eb54dfa0d60831839054a4bfbdf8164055f37b314893fe49d90e`
before/after review, without source/report changes.

- P4-R1 original valid/corrupt/newer replacement cases survived retry, gameplay,
  raw export and canceled confirmation; explicit resolution worked. Related
  permission safety remains blocked by P4-R4.
- P4-R2 resolved: startup/file selecting/interrupted incompatible games rejected
  before adoption/persistence, bytes exportable, live controls and later normal
  duels work. Shared `runtime/symbols.js` prevents browser-compatibility drift
  without changing general domain validation or substituting defaults.
- P4-R3 resolved: both players show actual press/release in both languages;
  safe dialog over an interrupted duel changes no ownership, chooser or save.

### P4-R4: Major — failed reread can enable writes from stale empty-state knowledge

Location: `src/app.js:258-265`, especially line 263, interacting with
`src/runtime/recovery.js:24-38,81-85`.

Reproduction: start a game/open New game, remove the saved record before
confirmation, then confirm. Changed-record protection blocks writing and stores
the last observation as `original === null`. Place a newer-format record in
storage, deny `getItem` for the game key but permit writes, then Retry recovery.
The app claims saving succeeded and overwrites the unread newer record.

`Recovery.load()` correctly denies writes after the failed read, but the app
then sets `writable = original === null` based on an earlier observation. A
failed read must never authorize writes. Preserve the actual successful-read/
write-permission result; allow saving only when a successful current read
established emptiness. Do not infer permission from stale cached content.

Add a focused regression for changed-to-empty followed by failed reread; exact
unread bytes and read-error/unsaved feedback must survive. Keep successful
retry after a genuinely successful empty read working.

Evidence: `.artifacts/phase-04-rereview-read-failure.{log,png}`.

### Re-review checks and lenses

Full check and browser suite passed: 177 unit/DOM tests, 103 Chromium journeys,
format/lint/types/build, snapshot and whitespace checks. Independent production
probes found P4-R4 despite those passes. Coverage-negative probes worked.
Critical: 2819/2830 lines (99.61%), 2848/2859 statements (99.62%),
209/209 functions (100%), 877/898 branches (97.66%).
Remaining: 2253/2263 lines and 2257/2267 statements (99.56%), 77/79 functions
(97.47%), 322/338 branches (95.27%). The reviewer branch count differed slightly
from the developer report; these are the reviewer's measured numbers.
All 46 runtime files included; only type-only declarations excluded.

All six lenses revisited: original feedback/compatibility fixes are focused,
purposeful and usable, but P4-R4 is both a data-preservation and misleading-success
defect. It also demonstrates why application orchestration must not reconstruct
the adapter's write permission from cached data. No metric exceptions:
maxima 298 module lines, 60 function lines, complexity 10, nesting 3.
Starter content unchanged; prior hardware/browser-engine/screen-reader/name/
deployment limitations remain. Reviewer preview and browsers stopped.

Next action: same-developer P4-R4 correction, focused same-reviewer verification,
then mandatory post-review tests before any phase-4 delivery.

## Developer response — P4-R1 / P4-R2 / P4-R3, 2026-10-28

All three findings have narrow corrections and focused regression evidence.
**This is not clearance.** The initial findings and CHANGES REQUIRED verdict
remain above; same-reviewer re-review is required.

### P4-R1: persistent changed-record protection

`Recovery.discard()` now revokes write permission and saved status immediately
when it observes changed bytes. It retains the actual replacement string for
raw export. Existing active-game retry inspection cannot authorize replacement
writes; subsequent normal gameplay remains in memory. Export/reload can recover
the replacement, or a new explicit discard confirmation can remove that newly
observed record. Cancel preserves it. No multi-tab merge was added.

DOM and Chromium regressions cover valid, malformed and newer-version replacement
records, preserving their exact bytes (including whitespace) after detection,
normal selection/answer actions, retry, raw export and canceled confirmation.
They then prove confirmed removal and starting a new saved game work normally.

### P4-R2: browser compatibility before adoption

New `runtime/symbols.js` is the single browser symbol definition used by default
game configuration, renderer glyph/name lookup, and recovery compatibility
validation. Startup recovery and file import validate every configured symbol
before returning any state for adoption. Persistence also enforces compatibility.
The domain schema remains unchanged and accepts its general symbol contract.

Unsupported alphabets produce localized `duelCompatibility` feedback without
adoption, persistence or silent config substitution. Original stored bytes remain
exportable; rejected file input leaves existing state/storage unchanged.
Regression cases cover startup/file recovery and selecting/interrupted saves;
each rejected flow retains live controls and can start a normal playable duel.
Browser tests collect page errors and require none. Domain-valid unsupported
and inherited-object property names are explicitly rejected by the compatibility
boundary.

### P4-R3: actual gamepad release diagnostics

`DuelGamepads` now reports changed held/released edges through a diagnostic
callback, separately from gameplay rising edges. Initial assignment captures
the current sampled hold rather than fabricating a held state; first-neutral
arming updates readiness without inventing a release. `Inputs` forwards real
edges into its existing localized feedback.

Both-player/both-language DOM and Chromium tests assert Pressed → Released,
unchanged gameplay and no extra gameplay press on release. Mutation observers
verify repeated stable polling does not rewrite/live-announce the diagnostic
status. Prior held, assignment and neutral-release tests are retained.

Focused commands passed: lint, type checking, 43 unit/DOM tests in the three
affected suites, and 13 Chromium recovery/device journeys. Focused browser log:
`.artifacts/phase-04-fixes-focused-browser.log`. Full candidate gate evidence is
recorded below after the complete sequential run.

### Full fix-candidate verification and re-review handoff

Sequential commands all passed:

```sh
TMPDIR="$PWD/.artifacts" npm run check
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser
git diff --check
```

Results: formatting, lint/metrics, types, **177 unit/DOM tests in 16 files**,
production build, both enforced coverage groups and **103 Chromium journeys**.
All prior 94 browser journeys remain; seven recovery-compatibility/protection
and two localized release-diagnostic journeys were added. No skipped tests,
weakened assertions, threshold reductions, dependency changes or metric exceptions.

| Scope                 | Lines              | Statements         | Functions      | Branches         |
| --------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 modules  | 2819/2830 (99.61%) | 2848/2859 (99.62%) | 209/209 (100%) | 877/898 (97.66%) |
| Remaining, 20 modules | 2253/2263 (99.56%) | 2257/2267 (99.56%) | 77/79 (97.47%) | 321/337 (95.25%) |

All **46 runtime modules** are covered. Critical membership is unchanged plus
`src/runtime/symbols.js`; remaining membership is unchanged. Only the existing
type-only `domain/types.js` exclusion remains. Negative probes zeroing either
group or omitting the new symbols module all exited 1; genuine measured coverage
was restored byte-for-byte afterward.

Evidence:

- `.artifacts/phase-04-review-fixes-{check,browser,coverage-enforcement}.log`.
- `.artifacts/playwright/recovery-review-changed-*/protected-replacement.json`
  and `protected-replacement.png`: actual exact-byte exported replacement and
  visible blocked/unsaved status, including valid/corrupt/newer variants.
- `.artifacts/playwright/recovery-review-{startup,file}-*/unsupported-symbols.png`:
  localized pre-adoption compatibility feedback for both save phases.
- `.artifacts/playwright/devices-{en,cs}-safe-gamepad-*/released-status.png`:
  observed released status. DOM and browser mutation observers prove quiet
  stable polling; these are Gamepad boundary mocks, not physical hardware tests.
- Representative English protected-record, Czech unsupported-symbol and Czech
  released-status screenshots were visually inspected. Full-suite screenshots
  again cover all original viewport/theme/language combinations.
- `.artifacts/phase-04-review-fixes-snapshot.sha256` and canonical
  `.artifacts/phase-04-snapshot.sha256` identify the fixed candidate after all
  source/document writing. The initial manifest is preserved separately.
  Source membership/metrics and browser artifacts are inventoried in
  `.artifacts/phase-04-source-inventory.json` and `phase-04-artifacts.json`.

Fix-specific implementation: `runtime/recovery.js`, new `runtime/symbols.js`,
`runtime/gamepad.js`, `runtime/inputs.js`, `app.js`, `ui/round.js`, `messages.js`.
Tests: `tests/{recovery,resilience-ui}.test.js`,
`browser/{recovery-review,devices}.spec.js`. README/contracts document the
protected replacement resolution and explicit browser alphabet compatibility.
Only factual response/handoff/ledger updates accompany these changes.

No commits, pushes, installs, deployment, shared-server changes, other-agent
messages or delegation occurred. Preview 4182 is stopped. Physical-device and
offline-clock limitations are unchanged. **Edits stopped for the same reviewer
`c74220e4-298d-42e3-bb31-8bd2e648d709`; no finding or phase is self-cleared.**

## Developer response to P4-R4 — 2026-10-28

**Implemented and frozen for the same reviewer; not self-cleared.** The original
findings, first developer response and first independent re-review above remain
unchanged.

`Recovery` now owns a private write-permission field with a read-only accessor.
`App.retryRecovery` delegates to `Recovery.retrySave`; it no longer reconstructs
permission from cached `original`. When saving was blocked, only a successful
current `load` returning empty can grant permission to save the memory game.
An unsuccessful read returns no successful empty result, retains `recoveryRead`
and unsaved status, and cannot authorize either retry or later gameplay writes.
A readable nonempty replacement still remains protected and raw-exportable,
without adoption or silent replacement.

The other permission assignments were inspected: recovery load, discard and
retry are now the only grant sites; library grants follow successful empty or
validated reads, input-preference grants follow their constructor-time read, and
workspace only revokes permission. The related discard reread failure now also
revokes previously granted permission/saved status, rather than allowing later
gameplay to write after a denied inspection. No library/input behavior, domain
rules, timing, storage keys or compatibility definitions were changed.

### Regression evidence

- Adapter regressions reproduce changed-to-empty confirmation followed by an
  unread valid/corrupt/newer replacement with writes still available. Retry and
  subsequent save make **no storage write**, preserve exact bytes and report
  `recoveryRead`/unsaved/blocked. Restored access protects and exports each
  replacement; a successful fresh empty read then saves correctly.
- Real App/DOM regressions reproduce all three variants through confirmation,
  retry and an actual question award. The memory game remains usable, while
  Czech read-error/unsaved feedback and exact unread bytes survive.
- Six new real-browser journeys cover all three variants in both languages.
  They verify bytes and localized feedback immediately after retry and after
  gameplay, raw export after read access returns, canceled confirmation, then
  successful empty-read retry and an actual reload preserving the memory award.
  Only the `Storage.getItem` boundary is denied; writes remain available and
  the real engine/UI run throughout.
- A focused adapter regression covers denied discard rereads starting with
  previously granted permission. Disposed retry behavior is also covered.
- Original P4-R1/R2/R3 regressions and all prior 103 browser journeys remain.

Focused lint/type checking, **42 unit/DOM tests** in the affected suites and
**13 Chromium recovery-review journeys** passed. The final sequential commands:

```sh
TMPDIR="$PWD/.artifacts" npm run check
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser
git diff --check
```

All passed: format/lint/metrics/types/build, **184 unit/DOM tests in 16 files**,
**109 Chromium journeys** and both coverage groups.

| Scope                 | Lines              | Statements         | Functions      | Branches         |
| --------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 modules  | 2829/2840 (99.61%) | 2858/2869 (99.62%) | 211/211 (100%) | 880/901 (97.67%) |
| Remaining, 20 modules | 2253/2263 (99.56%) | 2257/2267 (99.56%) | 77/79 (97.47%) | 321/337 (95.25%) |

These are this run's observed counts; the first re-review independently measured
322/338 remaining branches. No fixed denominator or browser statement coverage
is asserted. All **46 runtime sources** remain included, with only the existing
type-only exclusion. No threshold reductions, skipped tests, assertion weakening
or metric exceptions. Three negative coverage probes (zero critical, zero
remaining, missing recovery module) exited 1; measured coverage was restored
byte-for-byte.

Evidence: `.artifacts/phase-04-r4-{check,browser,coverage-enforcement}.log`;
`.artifacts/playwright/recovery-review-{en,cs}-unread-*/unread-replacement.{png,json}`.
English and Czech screenshots were visually inspected: actionable read failure
and explicitly unsaved status, without success feedback. The full suite
regenerated the existing layout/device/recovery evidence. Browser read denial is
an explicit boundary mock, not a claim about physical-device verification.

Changed in this correction: `src/{app.js,runtime/recovery.js}`,
`tests/{recovery,resilience-ui}.test.js`, `browser/recovery-review.spec.js`,
README/contracts and factual review/handoff/ledger additions. The complete
changed/new manifest, after all writing, is
`.artifacts/phase-04-r4-snapshot.sha256`, also copied to
`.artifacts/phase-04-snapshot.sha256`. Source membership/metrics and artifact
inventories are regenerated; previous manifests and independent evidence remain.

Preview 4182 is stopped. No commits/pushes/deployment, dependency changes,
shared-server changes, other-agent messages or delegation. Existing physical
Xbox/tablet, browser-engine, screen-reader and offline-clock limitations remain.
Next: **same-reviewer P4-R4 recheck**, then coordinator-owned post-review
verification only after clearance. The phase remains uncleared.

## Final independent re-review — CLEARED

Reviewer `c74220e4-298d-42e3-bb31-8bd2e648d709` verified the final snapshot
unchanged before/after review. Developer manifest:
`.artifacts/phase-04-r4-snapshot.sha256`, fingerprint
`3e12b77e583adef179e65e94344a08091bb75101c18d7616605bd511c7670b67`.
Coordinator frozen-manifest fingerprint:
`2c115a9dc847b39b783ae14c4123abf8e0f3f9f7649edb5c3bbd698df57c7408`.

All four findings are resolved; no new blocker, major or minor finding.

| Finding | Final outcome                                                                                                                                                                                   |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P4-R1   | Changed replacement saves remain protected through retry/gameplay and exportable for explicit resolution.                                                                                       |
| P4-R2   | Unsupported browser symbols are rejected before adoption/persistence; original bytes and working UI survive.                                                                                    |
| P4-R3   | Both players' gamepad diagnostics report actual press/release in both languages without gameplay effects.                                                                                       |
| P4-R4   | Failed rereads grant no permission. Independent valid/corrupt/newer-record probes observed zero writes and exact-byte preservation; successful fresh empty reads still save and survive reload. |

All six review lenses cleared. Recovery encapsulates its permission invariant,
and App no longer reconstructs it from stale cached content. The correction is
focused and traceable, with explicit localized failure/unsaved feedback and no
new abstraction or dependency. Original gameplay, input, layout, preparation and
content-lock acceptance evidence remains valid. Starter content/rights unchanged;
no content expansion or deployment was claimed.

The reviewer ran the full check and Chromium commands documented above:
**184 unit/DOM tests in 16 files**, **109 Chromium journeys**, formatting, lint,
types and build passed. Negative coverage/membership probes rejected invalid
reports. All 46 runtime sources included; only type-only declarations excluded.
Metric maxima: module 294 lines, function 60 lines, complexity 10, nesting 3;
no exceptions.

| Scope                 | Lines              | Statements         | Functions      | Branches         |
| --------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 modules  | 2829/2840 (99.61%) | 2858/2869 (99.62%) | 211/211 (100%) | 880/901 (97.67%) |
| Remaining, 20 modules | 2253/2263 (99.56%) | 2257/2267 (99.56%) | 77/79 (97.47%) | 321/337 (95.25%) |

Independent evidence:
`.artifacts/phase-04-r4-independent-{check,browser,enforcement,probes}.log`
and `.artifacts/phase-04-r4-independent-{valid,corrupt,newer}-{raw.json,unread.png}`.
Reviewer browsers/preview stopped; port 4182 closed. Physical Xbox/tablet,
additional engines, screen-reader devices, name clearance and public deployment
remain phase-8 dependencies, not verified hardware/release claims.

## Coordinator post-review verification

Frozen snapshot hashes matched before and after these sequential commands:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-04-post-review-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-04-post-review-browser.log 2>&1
git diff --check
```

All passed: **184 tests in 16 files**, **109 Chromium journeys**, format/lint,
types, build and both enforced coverage groups. No code changed after review.

| Scope                 | Lines              | Statements         | Functions      | Branches         |
| --------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 modules  | 2829/2840 (99.61%) | 2858/2869 (99.62%) | 211/211 (100%) | 879/900 (97.67%) |
| Remaining, 20 modules | 2253/2263 (99.56%) | 2257/2267 (99.56%) | 77/79 (97.47%) | 322/338 (95.27%) |

These are actual coordinator measurements; small V8 branch-denominator variation
from review does not change inclusion or gate results. All 46 executable sources
are included. Factual delivery-document updates follow verification; commit/push
and remote verification are still required before the next phase starts.
