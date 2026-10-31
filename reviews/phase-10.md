# Phase 10 independent review

## Initial verdict: CHANGES REQUIRED

Reviewer `ad7e33a9-be45-4efe-ae3b-a9406e2ee2de` (report identity
`P10-IR-20261030`), independent of developer
`a00bdfde-8f0c-4582-bf04-c316d4df7b3d`.
Baseline `4cd16af9e8f9a40dab5163d3f65a2af3ce58f894`.
All 50 changed/new files matched `.artifacts/phase-10-snapshot.sha256` before
and after review; fingerprint
`a934d955da9b114c3680f7bdd81ae6b28368c2e2a6228e133e98fac4327dada7`.
This coordinator-persisted summary retains the findings and measured results
from `.artifacts/phase-10-independent-report.md`, which contains the complete
acceptance matrix, exact file membership and visual evidence inventory.

## Findings

| ID      | Severity | Frozen-snapshot location                                                 | Defect and smallest correction                                                                                                                                                                                                                                                                                                                |
| ------- | -------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P10-IR1 | Major    | `src/runtime/binding-recorder.js:38–41,80–106`                           | Recording uses pre-capture controller history. A button held between the last poll and Record can replace/persist the existing binding without a fresh press. Establish a capture-session baseline/neutral requirement; preserve duplicate/device/disconnect guards and require release then new press.                                       |
| P10-IR2 | Major    | `src/runtime/recovery.js:93–98,174–188`; `src/ui/recovery.js:65–72`      | Write-time replacement detection revokes writes but leaves `original` referring to the earlier game. Export protected original downloads that earlier game, not the protected replacement. Retain the actually observed replacement bytes or withhold the misleading export, without enabling overwrite/deletion or adopting the replacement. |
| P10-IR3 | Minor    | `src/messages.js:119–121`; `src/ui/preparation-strings.js:75–81,176–182` | Full-storage guidance references removed “Exclude from local saving” actions in both languages. Point to the actual Saved decks / Remove this saved copy actions, preserving the warning against clearing site storage.                                                                                                                       |
| P10-IR4 | Minor    | `docs/contracts.md:3–4`                                                  | Current portable v2 description contradicts “inside version-1 complete-game envelopes.” State pack/library v1 and input/portable/domain v2 consistently; label v1 envelopes legacy reads.                                                                                                                                                     |

P10-IR1 reproduction: in real Options/Controls with neutral standard controllers,
allow a poll, then hold button 0 and click Record A in one browser task before
the next poll. That poll replaces Left Shift with Controller 1 / Button 0.
Only the Gamepad API boundary is mocked. Both engines reproduce it.

P10-IR2 reproduction: start an automatic game, replace `hexy.game.v1` with
pretty-printed bytes of another valid complete game, select a field to trigger
normal save comparison, then download Export protected original from recovery.
Both engines download the earlier game. The replacement remains intact in
storage; this is a misleading backup, not demonstrated data corruption.
Cover valid/corrupt/newer/null replacements, repeated departure, subsequent
replacement comparisons and actual raw downloads.

Executable probes: `.artifacts/phase-10-reviewer.spec.mjs:13–28,165–180`.
Actual downloads, screenshots and traces are under
`.artifacts/phase-10-reviewer-probes/`. These are current independent failures,
not old developer-iteration results.

## Acceptance and all six lenses

- **Correctness:** temporary generated packs, preserved ambiguous legacy copies,
  selective removal, click-time final export, failure-retaining departure,
  validated format migration and shared board navigation largely pass.
  Recording freshness and protected-record export remain P10-IR1/P10-IR2.
  Existing native-dialog, timing, recovery and duel regressions pass.
- **Usability/accessibility:** actual keyboard/modal/download journeys and both
  engines' screenshots inspected. Two recording rows, at least 12px Options
  button separation and laptop/portrait reachability verified. Fix stale quota
  guidance. Color-only ownership remains the approved exception.
- **Readability:** complete candidate reviewed, including nine untracked files.
  Migrated tests retain substantive storage/content assertions. No metric
  disables; maxima 288 module lines / 60 function lines / complexity 10 /
  nesting 3. P10-IR4 is a concrete contract documentation inconsistency.
- **OOP:** recorder owns input snapshots; input settings owns preferences/modal;
  board navigation consumes the existing poll; Recovery owns protected writes.
  Fix invariants in those owners, without new hierarchy.
- **Patterns:** explicit unions, shared movement and existing modal lifecycle
  are proportional. No second poll timer, framework, dependency or global bus.
- **Content/rights/delivery:** catalog and all 36 packs / 1,008 entries match
  baseline. Source ledgers/rights unchanged; 52 actual Chromium answer-sheet
  PDFs retain their assertions. No live/public deployment or physical-device
  verification claimed; owner-deferred follow-ups stay deferred.

The approved legacy-data fallback is honored: old automatic and explicit
generated-pack copies cannot be distinguished reliably. Preservation plus
selective removal is not a finding. New generated mixes are no longer persisted
automatically; explicit imports/edits remain durable.

## Independent verification

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-10-reviewer-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser -- --output=.artifacts/phase-10-reviewer-chromium > .artifacts/phase-10-reviewer-browser.log 2>&1
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config playwright.cross-browser.config.js --project=firefox --output=.artifacts/phase-10-reviewer-firefox > .artifacts/phase-10-reviewer-firefox.log 2>&1
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config .artifacts/phase-10-reviewer.config.mjs > .artifacts/phase-10-reviewer-probes.log 2>&1
node .artifacts/phase-10-coverage-probes.mjs > .artifacts/phase-10-reviewer-coverage-probes.log 2>&1
sha256sum --check --quiet .artifacts/phase-10-snapshot.sha256
git diff --check
git diff --exit-code 4cd16af9e8f9a40dab5163d3f65a2af3ce58f894 -- src/content
```

Quality gates and **351 unit tests / 25 files**, **365 Chromium** journeys,
**222 Firefox** journeys and **63 negative coverage probes** passed.
Independent extra probes: **10 passed / 4 failed**, two defects per engine.
The successful additional cases cover failed deletion/retry/reimport,
replacement/expired-tick/exit protection, controller-to-keyboard replacement,
legacy key migration/cancel/stale input and post-win correction/export/reimport.

| Scope               | Lines              | Statements         | Functions        | Branches           |
| ------------------- | ------------------ | ------------------ | ---------------- | ------------------ |
| Critical, 32 files  | 3639/3647 (99.78%) | 3677/3685 (99.78%) | 272/276 (98.55%) | 1163/1201 (96.84%) |
| Remaining, 23 files | 2824/2838 (99.51%) | 2863/2877 (99.51%) | 100/102 (98.04%) | 457/480 (95.21%)   |

All **55 executable production JS modules** included; only type-only
`src/domain/types.js` excluded. Thresholds remain critical 95/95/95/90 and
remaining 85/85/85/80. Eight deficient-metric probes plus removal of every
runtime member fail as required; report bytes restored, fingerprint
`9dd919c49759ce940b25c6fe9f0a8077112f3aba75939bb47be91e59c3b17891`.
Fractions are the independent measured run, not developer quotations.
Browser passes are not statement coverage.

## Handoff

All four findings remain open. No clearance or waiver. The same developer must
provide bounded corrections, then this reviewer rechecks the frozen snapshot.
Final coordinator gates follow eventual clearance.

All 50 candidate hashes remained unchanged; owned preview 4182 is closed.
Live services and shared configuration untouched. No physical Xbox/tablet,
WebKit/remote Edge or human screen-reader verification claimed.

## Replacement independent correction review: CLEARED

Fresh replacement identity **P10-REPLACEMENT-IR-20261030**, independent of the
developer and coordinator. The original reviewer was not resumed after the
owner-authorized logout; original findings/history above remain unchanged.
Complete report retained in
`.artifacts/phase-10-replacement-rereview-report.md`.

Reviewed 53-file `.artifacts/phase-10-rereview.sha256`, fingerprint
`633cad361d39134c055852714f1114ffcfe67d1c5d46ee392031e09b9bcef553`.
All hashes/membership match before and after review. Relative to the original:
32 unchanged files, 18 changed, three added, none removed. All 173 tested-code
entries and original probe/config/manifest hashes match. No implementation,
test, configuration, content or tracked-document edits by the reviewer.

| Finding                       | Independent disposition                                                                                                                                                                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P10-IR1                       | Resolved: synchronous existing-adapter sample precedes capture arming; unchanged between-polls reproduction passes in both engines, release/new press required. No extra poll loop.                                                             |
| P10-IR2                       | Resolved: exact observed replacement bytes, including null, are retained without adopting data or granting writes/deletion. Actual protected downloads and repeated-departure tests cover valid/corrupt/future/removed records in both engines. |
| P10-IR3                       | Resolved: quota guidance matches Saved decks / Delete and Uložené balíčky / Smazat; real quota flows in both languages and engines preserve data.                                                                                               |
| P10-IR4                       | Resolved: pack/library v1 and input/portable/domain v2 consistently documented; v1 inputs/envelopes explicitly legacy reads.                                                                                                                    |
| Owner Delete/Smazat amendment | Pass: plain adjacent download/delete actions, no disclosure, native localized confirmation, initial Cancel focus, Escape/Tab/Enter/Space, stale/view-abort guards, safe failed/concurrent writes and selected-only deletion.                    |

No new blocker/major/minor findings, waivers or metric exceptions.
Acceptance coverage includes temporary mixes, exact recovery/export/reimport,
legacy-copy preservation, both departure paths, failed export/delete retention,
original deadlines, post-win corrections, recorded replacement bindings, touch
fallback, shared keyboard/controller navigation and prior native-modal races.

All six lenses pass: correctness and completeness through boundary/regression
evidence; usability through real native keyboard/dialog/download/geometry and
inspected laptop/portrait bilingual/theme screenshots; readable cohesive changes
with maxima 288 module lines / 60 function lines / complexity 10 / nesting 3;
resource-owning recorder/gamepad/recovery/view lifetimes with pure rules retained;
proportional reuse of existing polling and concrete adapters without framework
or dependency; unchanged 36 packs / 1,008 entries, rights and delivery boundaries.
No new factual or public-release clearance is implied.

Independently executed, sequentially:

```sh
TMPDIR="$PWD/.artifacts" npm run check
node .artifacts/phase-10-coverage-probes.mjs
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config .artifacts/phase-10-reviewer.config.mjs --output .artifacts/phase-10-replacement-probes
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config .artifacts/phase-10-replacement-focused.config.mjs --project=chromium --output .artifacts/phase-10-replacement-focused-chromium
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config .artifacts/phase-10-replacement-focused.config.mjs --project=firefox --output .artifacts/phase-10-replacement-focused-firefox
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config .artifacts/phase-10-replacement-native.config.mjs
```

Quality passed **357 tests / 25 files**, format/lint/types/build. Negative
coverage probes **63/63**; original unchanged browser probes **14/14**;
focused Chromium **29/29**, Firefox **29/29**; additional independent native
Delete probes **4/4**. Ignored focused wrapper imports unchanged test bodies and
remaps screenshots only, preserving original evidence. Logs/configs/output
directories use `.artifacts/phase-10-replacement-*`.

| Scope               | Lines              | Statements         | Functions        | Branches           |
| ------------------- | ------------------ | ------------------ | ---------------- | ------------------ |
| Critical, 32 files  | 3650/3658 (99.78%) | 3688/3696 (99.78%) | 273/277 (98.56%) | 1166/1204 (96.84%) |
| Remaining, 23 files | 2855/2869 (99.51%) | 2894/2908 (99.52%) | 102/104 (98.08%) | 463/486 (95.27%)   |

All 55 executable modules listed in `docs/phase-10-handoff.md` remain included;
only type-only `src/domain/types.js` excluded. Enforced thresholds unchanged.
Report restored byte-for-byte, SHA-256
`5c44f7abd18ef8a0e07214206b61dea247d110d703bd2b5b85d3844b5b19337a`.
Browser results are not statement coverage. Full corrected browser logs
(371 Chromium / 228 Firefox) were inspected as inherited evidence, not claimed
as replacement-reviewer runs or coordinator post-clearance checks.

Both-engine reviewer screenshots and actual raw protected/current/final JSON
downloads inspected. HTTP 200 observed during all browser runners; port 4182
closed between runs and after teardown. No physical controller/tablet, human
screen-reader, WebKit/remote Windows, public/live release verification or
shared-service changes. Deferred phase-8 limitations remain.

Coordinator complete post-review gates and authorized private delivery remain
required on unchanged code; phases 11/12 are not started.

## Coordinator mandatory post-review verification

The new sole coordinator reran the complete gates after the replacement
clearance, sequentially, with unchanged implementation/test bytes:

```sh
TMPDIR="$PWD/.artifacts" npm run check
node .artifacts/phase-10-coverage-probes.mjs
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config .artifacts/phase-10-reviewer.config.mjs --output .artifacts/phase-10-coordinator-post-review-probes
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config playwright.cross-browser.config.js --project=firefox
sha256sum --check --quiet .artifacts/phase-10-rereview-tested-code.sha256
sha256sum --check --quiet .artifacts/phase-10-review-inputs.sha256
git diff --check
```

All passed: **357 tests / 25 files**, format/lint/types/build, **63 negative
coverage probes**, **14 original independent probes**, **371 Chromium journeys
(11.9m)** and **228 Firefox journeys (9.2m)**. Logs:
`.artifacts/phase-10-coordinator-post-review-{check,coverage-probes,probes,chromium,firefox}.log`.
Both full-browser previews returned HTTP 200 while running; owned port 4182
closed after teardown. No implementation/content/test/config changes after
clearance; only review/status evidence was appended.

| Scope               | Lines              | Statements         | Functions        | Branches           |
| ------------------- | ------------------ | ------------------ | ---------------- | ------------------ |
| Critical, 32 files  | 3650/3658 (99.78%) | 3688/3696 (99.78%) | 273/277 (98.56%) | 1166/1204 (96.84%) |
| Remaining, 23 files | 2855/2869 (99.51%) | 2894/2908 (99.52%) | 102/104 (98.08%) | 464/487 (95.28%)   |

All 55 production modules remain included, with the same sole type-only
exclusion; enforcement reports restored exactly. The minor V8 branch fraction
difference from the independent run is reported as actually measured.
**Phase 10 clears its implementation gate.** Authorized scoped commit/push,
remote SHA and actual automatic private-preview verification follow.

## Authorized delivery and actual private verification

Committed and pushed as `54b34b1505a6ff3087269bdaae4a4ca790ea4f18`;
remote `refs/heads/main` matched. The unchanged existing automatic updater served
that exact revision at private `https://mcp.tail2a1a27.ts.net/hexy/version.json`.
No manual restart, installed-runtime change or public exposure.

The coordinator exercised the actual HTTPS production app in a fresh isolated
browser context: recorded KeyQ replacement, temporary generated number pack
with empty durable custom library, keyboard selection, active-question reload
with identical original deadline and locked pack, correct capture, cancelled
departure, complete final download before local cleanup, and actual final-file
reimport preserving ownership. No page errors. Both played/reimported screenshots
were opened and inspected. Owner/browser data in other contexts was not touched.

```sh
PLAYWRIGHT_BROWSERS_PATH="$PWD/.artifacts/browsers" TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" node .artifacts/continuation/verify-phase10-private.mjs 54b34b1505a6ff3087269bdaae4a4ca790ea4f18
```

PASS. Evidence: `.artifacts/continuation/phase10-served-version.json`,
`phase10-private-verification.log` and `phase10-private/` (actual downloaded
JSON, screenshots and result). This is private software delivery, not physical
hardware, public-release or naming clearance. Phase 11 may now begin.
