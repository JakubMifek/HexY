# Phase 6 developer handoff

Date: 2026-10-28. Baseline: `5efcd7445202c67104d35d61e095f2bc5b8cb77a`.
**FROZEN correction candidate for same-reviewer re-review; NOT CLEARED.**
The P6-R1–R4 developer response and verification evidence are appended below.
The original snapshot is preserved in `.artifacts/phase-06-before-review-fixes/`;
the correction manifests are `.artifacts/phase-06-review-fixes-snapshot.sha256`
and `.artifacts/phase-06-snapshot.sha256`.
No commit, push, deployment, dependency installation or shared configuration
change was made. Only phase 6 was implemented.

## Delivered scope and acceptance evidence

- Twelve new fixed-letter packs: History, Politics and diplomacy, Science and
  technology; two packs per category per language, 28 entries each. The complete
  catalog is **24 packs / 672 entries**, with 336 unique question IDs, normalized
  prompts and canonical answers in each language.
- All twelve previously reviewed General/Nature/Geography JSON files are
  byte-for-byte unchanged from the baseline. Their 336 IDs, facts, aliases,
  source references and phase-5 corrections are preserved. Evidence:
  `.artifacts/phase-06-preserved.sha256`.
- Both fixed alphabets come from the existing domain constants; no alphabet,
  answer-normalization, gameplay, persistence or export-format change.
  Canonical answers follow the actual Czech/English initial sequences.
- Existing metadata filtering and bilingual labels now include all six
  categories. Merely browsing or filtering does not change the prepared board,
  original files or one-starter default selection.
- Every one of the 24 packs receives real-UI fixed JSON export/reimport,
  selected-only 28-distinct-question number generation/reimport, recovery and
  host-reset question-lock checks. All twelve new fixed packs additionally
  receive actual standalone HTML and Chromium PDF source-appendix checks.
- Two new mixed-source journeys explicitly select Geography plus all three new
  categories in Czech/English. They verify hidden selections, exactly those four
  source pack IDs, 28 distinct questions, author/license origins, HTML/PDF
  numbering and citations, export/reimport, reload recovery and the actual
  first question. The original 143 browser flows remain; 18 flows were added.
- Four new complete-catalog journeys check totals, all category labels/filters,
  default immutability and layout in Czech/English and light/dark. The earlier
  16 catalog keyboard/layout journeys retain all four approved viewports.

## Full factual and linguistic audit

The [source ledger](content-sources.md) binds **all 672 entries** to exact pack
hashes, canonical answers, initials and per-entry supporting URLs/locations.
Its phase-6 section covers **every new entry**, not a sample: 336 questions,
280 retrieved primary URLs, and now five additional distinct official/reference
URLs, for **285 distinct URLs shipped by the corrected new packs** (284 in the
initial snapshot).

The developer read substantive definitions, historical sections, infoboxes and
tables. HTTP success and answer-token presence were not treated as verification.
Detailed follow-up checked dates, geographic scope, people, legal procedures,
physical definitions and relevant qualifiers. The initial primary-source cache is
`.artifacts/phase-06-research/` with an `index.json` mapping URLs to local files.
The Czech Constitution was decoded as Windows-1250 before reading Articles
15–16, 27 and 53; UN, ombudsman, NIST, RSC and National Archives material was
also read. References retain their own rights; no source prose was copied.

The ledger distinguishes independently cleared phase-5 content from the new
developer audit. It records discarded unavailable exploratory URLs and the
unchanged earlier BCcampus access limitation separately. Every final new source
was retrieved successfully. The initial reviewer examined **all 336 complete
prompts, canonical answers, useful aliases and supporting facts**. The four
corrections and continuity of the other entries now require same-reviewer
re-review; passing automated checks does not close the findings.

Editorial decisions:

- Stable institutions and concepts dominate Politics. Xi's appointment is
  explicitly November 2012; the EU voting-rule question dates its introduction
  to 2014. No undated current-officeholder quiz is introduced.
- Menes and Solomon are explicitly traditional/biblical accounts. Historical
  events have dates and places where needed. The 1086 Domesday survey is
  distinguished from disputed manuscript compilation dating.
- Czech `Unitární stát`, `Mandát` and `Řemenice` use sources supporting those
  actual concepts. Agrément is not confused with accreditation. Constrained
  initials do not justify substituting Ú for U or inventing Czech spellings.
- Boyle's law specifies ideal gas; anode/cathode are defined by reaction, not
  fixed polarity. Zirconium's neutron-absorption claim is not narrowed beyond
  the inspected support. Science covers physics, chemistry and engineering,
  not phase-7 programming or duplicated biological definitions.
- Same-language exact/normalized duplicate IDs, prompts and canonical answers
  are rejected. An additional reciprocal full-answer cross-check found no
  candidates involving new entries; this is a heuristic, not semantic proof.
  Related facts and independently composed cross-language counterparts remain
  permissible under the inventory policy.
- A final Czech inflection check caught `odpor` as an alias disclosed by
  `odporu` in the resistor clue. That alias was removed; a focused regression
  checks acceptance of `rezistor` and rejection of the revealed property word.
  Redundant accent aliases, subset aliases and other literal giveaways were
  removed during authoring rather than weakening normalization or tests.

## Relevant changed files

- `src/content/history-{cs,en}-{01,02}.json`
- `src/content/politics-{cs,en}-{01,02}.json`
- `src/content/science-{cs,en}-{01,02}.json`
- `src/content/catalog.js`, `src/ui/preparation-strings.js`,
  `src/ui/strings.js`: explicit imports and localized category/inventory copy.
- `tests/content.test.js`, `tests/catalog.test.js`: exact full-catalog quotas,
  per-entry source rows/hashes, bilingual catalog/default tests and regression.
- `browser/catalog.spec.js`, new `browser/phase-six.spec.js`: real pack
  roundtrips, actual print outputs, mixed-source and catalog journeys.
- `README.md`, `docs/content-inventory.md`, `docs/content-sources.md`,
  this handoff, `PLAN.md`, `IMPLEMENTATION_PHASES.md`. Initial coordinator
  phase-6 start edits are preserved; the developer appends freeze status.

No schema changed, so existing format contracts remain applicable. No runtime
abstraction, adapter, class, dependency, alternate catalog implementation or
phase-7 pack was introduced. Runtime changes are limited to metadata imports
and localized strings; existing pure filtering/generation remains authoritative.

## Initial-snapshot verification commands and observations

Final code gate, followed sequentially by the full browser gate:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-06-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-06-browser.log 2>&1
git diff --check
```

- `npm run check`: **PASS**, formatting, ESLint, JavaScript type checking,
  **265 tests / 19 files**, V8 coverage membership/threshold checks and build.
  Includes the unchanged 35 deployment unit tests. No real deployment
  integration was rerun because deployment code/configuration was untouched.
- Final browser run: **PASS, 161 tests (5.4 minutes)**, including the final
  resistor-alias correction. No skipped or failed tests; Playwright's final
  result records `status: passed` and an empty failure list.
- Final production bundle: 74 transformed modules; JavaScript 290.63 kB
  (83.25 kB gzip), CSS 7.01 kB (2.42 kB gzip). Build assets remain ignored.
- Earlier focused catalog/content verification passed 48 tests before the
  final additional regression; focused Chromium verification passed 48 flows.
  Early draft checks found redundant normalized aliases, an incomplete source
  ledger and two oversized browser test callbacks. These were fixed through
  content corrections, completing evidence and cohesive helper extraction.
  An unavailable `python` invocation was rerun with installed `python3`;
  nothing was installed. No failures were skipped or assertions weakened.

### Coverage scope and negative probes

All **47 runtime JavaScript files** are included. Only the genuinely type-only
`src/domain/types.js` is excluded; JSON packs are data, not omitted runtime code.

| Group               | Lines              | Statements         | Functions      | Branches         |
| ------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 files  | 2831/2842 (99.61%) | 2860/2871 (99.62%) | 211/211 (100%) | 880/901 (97.67%) |
| Remaining, 21 files | 2518/2528 (99.60%) | 2545/2555 (99.61%) | 85/87 (97.70%) | 360/376 (95.74%) |

Required critical thresholds remain 95/95/95/90%; remaining 85/85/85/80%.
Membership is explicit in the check/probe logs:

```text
critical:
src/app.js
src/domain/{actions,answers,board,config,duels,errors,game,generation,
  outcomes,packs,preferences,saves,validation}.js
src/runtime/{buzzer,clock,downloads,gamepad,inputs,keyboard,library,
  preparation,recovery,symbols,touch}.js
src/workspace.js

remaining:
src/content/catalog.js
src/{main,messages}.js
src/ui/{answer-sheet,application,board,catalog,device-strings,dom,editor,
  game,header,host,inputs,library,preparation-strings,preparation,recovery,
  round,setup,strings}.js
```

```sh
node .artifacts/phase-05-coverage-probes.mjs > .artifacts/phase-06-coverage-probes.log 2>&1
node .artifacts/phase-06-metrics.mjs > .artifacts/phase-06-metrics.log
```

The existing probe harness was reused unchanged. **10 negative probes pass**:
each of four measures fails independently when zeroed in each group; deleting
`src/app.js` or `src/ui/catalog.js` from the report fails explicit membership.
Every deficient invocation exits 1. Only the generated coverage report is
mutated; its original bytes are restored in `finally`, checked byte-for-byte,
and the restored baseline gate passes. Restored report SHA-256:
`064b16887ed8cb3d160b6fea0c8844e4b61eaa40fb89f2e6bfb4036a8e3d8e5e`.

Measured production maxima with the existing ESLint counting rules:
**294 module lines** (`src/app.js`), **60 function lines**
(`editorView`, `src/ui/editor.js`), **complexity 10**
(`restoreFocus`, `src/app.js`), **nesting 3** (`src/domain/generation.js`).
Details: `.artifacts/phase-06-metrics.json`. No metric exception or rule change.

## Browser evidence and reproduction

Use the existing Playwright production-preview configuration on **4182**, not a
Vite development server. Dependencies and local Chromium libraries were already
installed. Focused reproduction:

```sh
TMPDIR="$PWD/.artifacts" npx vitest run tests/content.test.js tests/catalog.test.js
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test browser/catalog.spec.js browser/phase-six.spec.js
```

Generated artifacts are under `.artifacts/playwright/`:

- `phase-six-phase-six-full-c-*/phase-six-catalog.png`: Czech/English light
  desktop 1280×720 and dark tablet portrait 768×1024, showing the science filter
  after each test has checked all six categories and the full 24-pack count.
- `catalog-catalog-{history,politics,science}-*/`: `fixed.json`, `numbers.json`,
  `recovered-fixed.json`, `fixed-sheet.html`, `answer-sheet.pdf`,
  `answer-sheet-print.png`. All twelve new packs have these actual exports.
- `phase-six-phase-six-{cs,en}-old-*/`: `phase-six-mixed.json`,
  `phase-six-recovered.json`, `phase-six-mixed.html`, actual PDF and print image.
  PDF tests decode printed text and check all 28 numbered question IDs,
  factual source strings, canonical answers, authors and license origins.

Manual reproduction: open preparation, filter by language/category and choose
one new fixed pack; prepare/accept, export/reimport JSON and download the answer
sheet. For numbers, clear sources and explicitly select Geography, History,
Politics and Science `-02` packs of one language; hide them with an unmatched
search and generate. Selection remains explicit and generated origins must
belong only to those packs. Start, reload, and reset a host-owned field: its
original question remains locked.

All four final catalog screenshots were visually inspected: localized copy,
wrapping, visible focus, labels and controls remain readable with no observed
horizontal clipping. The screenshot directory suffixes map as follows:
`2c1af` Czech/light, `6d291` Czech/dark, `33bca` English/light, `ecc1f`
English/dark. The two mixed-source print images were also visually inspected:
28 numbered rows, appropriate initials, authors/license origins and a separate
per-cell factual-source appendix; no unrelated game controls.

After the final run, the twelve actual new fixed-pack JSON/HTML/PDF artifacts
and both mixed-source exports were inspected again. Decoded PDFs retained all
rows, source strings and credits; both recovered JSON exports exactly matched
their generated originals and contained only the four explicitly selected
source pack IDs. Documentation-only final updates were followed by formatting,
focused content/catalog checks (**49 tests passed**) and `git diff --check`.
Final documentation-check logs: `.artifacts/phase-06-final-format.log` and
`.artifacts/phase-06-final-focused.log`.

The owned Playwright preview exited normally; **4182 is closed**. A read-only
port/container check found the existing live preview on **4183 and 4184**, with
4183 returning HTTP 200, and the unchanged admin listener on **8443**.
Evidence: `.artifacts/phase-06-port-check.log`. No service stop/restart or
deployment write was performed.

## Review boundary and next action

No physical Xbox, tablet, screen-reader, public-release or name/trademark
clearance is claimed. Viewports, controller boundaries and Chromium PDF printing
are software evidence only. No live preview/container, Tailscale setting, admin
service on 8443, updater, installed control or release state was modified.
Worktree changes are not the deployed candidate; the coordinator's eventual
reviewed push follows the existing automatic update process.

After final verification, `.artifacts/phase-06-snapshot.sha256` identifies
every changed/new nonignored source, test and document, including coordinator
plan changes. Ignored research/build/test outputs are supporting artifacts,
not part of that source snapshot. The writer is stopped. Next: a fresh
independent review applying all phase-6 and `REVIEW.md` criteria. Review and
coordinator full post-review tests are mandatory before clearance/commit/push.

## P6-R1–R4 developer correction handoff

The [initial independent report and appended developer response](../reviews/phase-06.md)
retain the original CHANGES REQUIRED verdict, four findings and complete
336-entry accounting. Only the four reported entries changed:

| Finding / ID                | Correction and expected automatic answers                                                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P6-R1 / `politics-cs-02-06` | Retain canonical-focused clue; accept Exekutiva, reject the disclosed `výkonná moc` alias.                                                                                                                                     |
| P6-R2 / `history-en-01-23`  | Accept U-boat and U boat; reject German Unterseeboot because the clue explicitly asks for English.                                                                                                                             |
| P6-R3 / `politics-en-02-14` | Explicit negative motion declaring loss of legislative support to remain in office; accept Motion of no confidence / no-confidence motion. Reject the positive Motion of confidence and the distinct vote of no confidence.    |
| P6-R4 / `history-cs-01-26`  | Replace the unsupported W-spelling entry with Washington, alias George Washington: first US president in 1789. Keep ID, W placement and History category. The old peace-treaty answers do not answer the replacement question. |

Two bounded searches did not establish defensible Czech use of the old W form;
this is not a categorical claim that every historical W spelling is invalid.
The permitted replacement avoids forced spelling rather than changing the
alphabet or normalizer. The actual
[Czech article](https://cs.wikipedia.org/wiki/George_Washington) establishes
Washington's natural Czech-attested name and first presidency; its infobox
dates the term from 30 April 1789. The retrieved
[US National Archives account](https://www.archives.gov/milestone-documents/president-george-washingtons-first-inaugural-speech)
describes the first inauguration and oath that day. Both are now shipped
references for the replacement. Cached HTML:
`.artifacts/phase-06-review-fixes-research/washington-cs.html` and
`washington-nara.html`.

The retrieved U-boat introduction distinguishes the English term from its German
source word. The retrieved motion definition explicitly distinguishes proposal,
vote and positive inverse; its HTML is
`.artifacts/phase-06-review-fixes-research/no-confidence.html`.
Removing the vote alias is tightly coupled to asking specifically for a motion,
not an unrelated editorial change. The source ledger updates exactly the
affected rows/hashes and records the new 285-URL total.

Continuity proof compares all 24 pre-correction packs from
`.artifacts/phase-06-before-review-fixes/` against current files:
**668 questions unchanged**, comprising the other 332 new entries and all 336
old entries; exactly the four listed IDs differ. All twelve old packs remain
byte-for-byte identical; all pack metadata/IDs/placements remain unchanged.
Evidence: `.artifacts/phase-06-review-fixes-continuity.json`. Full-catalog tests
again enforce 672 IDs, per-language prompt/canonical uniqueness, quotas and
every source-ledger row/hash. The original independent audit retains SHA-256
`0b34153e6d4a4c5ba562fba30d18e6bb544a36baff3b854cfbaae3114d6360f0`.

### Correction validation

Four new answer-checker regressions deliberately failed against the original
data (`phase-06-review-fixes-red.log`; other tests were excluded by the `-t`
selector, not disabled). After fixes, focused content/catalog tests pass
**53/53**. Seven new isolated real-UI tests use a deterministic clock and the
actual game engine: each rejected answer leaves the question active/field
unclaimed, and each corrected canonical or retained alias awards the field.
All **7/7** focused automatic-play cases pass.

```sh
TMPDIR="$PWD/.artifacts" npx vitest run tests/content.test.js tests/catalog.test.js > .artifacts/phase-06-review-fixes-focused.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test browser/phase-six.spec.js --grep 'P6-R' > .artifacts/phase-06-review-fixes-browser-focused-r2.log 2>&1
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-06-review-fixes-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-06-review-fixes-browser.log 2>&1
git diff --check
```

Full `npm run check`: **PASS, 269 tests / 19 files**, format/lint/types, V8
scope/threshold gates and production build. Build: 74 modules; JavaScript
290.65 kB (83.25 kB gzip), CSS 7.01 kB (2.42 kB gzip).
The complete browser correction run **PASS: 168 tests in 5.5 minutes**,
retaining all prior 161 journeys and adding seven automatic-answer cases.
No failed/skipped tests remain in the full run. `git diff --check` passes.

No failed test was hidden. During regression implementation, lint caught an
accidentally nested browser-test declaration; it was moved to module scope.
The first focused browser run passed 49 cases and failed three because the
new test tried to use host-only reset controls during automatic play. Those
test cases were replaced with isolated fixtures for every accepted answer
(not weaker assertions or a production change), and all seven pass.
The failed run remains in `phase-06-review-fixes-browser-focused.log`.

Coverage remains exactly the 47 runtime files listed above, 26 critical and
21 remaining; no membership or threshold change:

| Group     | Lines     | Statements | Functions | Branches |
| --------- | --------- | ---------- | --------- | -------- |
| Critical  | 2831/2842 | 2860/2871  | 211/211   | 880/901  |
| Remaining | 2518/2528 | 2545/2555  | 85/87     | 360/376  |

Ten negative probes were rerun with the original harness, each rejecting its
threshold/missing-file mutation with exit 1. The original report was restored
byte-for-byte and the baseline gate passed; restored SHA-256 remains
`064b16887ed8cb3d160b6fea0c8844e4b61eaa40fb89f2e6bfb4036a8e3d8e5e`.
Observed production maxima remain 294 module lines / 60 function lines /
complexity 10 / nesting 3, with no exception. Exact commands/artifacts:

```sh
node .artifacts/phase-05-coverage-probes.mjs > .artifacts/phase-06-review-fixes-coverage-probes.log 2>&1
node .artifacts/phase-06-metrics.mjs > .artifacts/phase-06-review-fixes-metrics.log
cp .artifacts/phase-06-metrics.json .artifacts/phase-06-review-fixes-metrics.json
```

No deployment integration was rerun: runtime implementation, deployment,
dependencies, shared configuration and live services were not changed.
Correction scope is four JSON entries, focused tests and directly related
source/inventory/review/handoff/phase documentation. The original reviewer
report is preserved byte-for-byte as an unchanged prefix with a developer
response appended; no findings or initial accounting are rewritten.

### Correction evidence and freeze

The four affected actual fixed-pack JSON exports were compared with current
files and their actual PDFs decoded again with `verifyPrintedSheet`; all rows,
aliases, citations and rights survived. The full run also covers all 24 fixed
and selected-only number packs, all twelve new fixed HTML/PDF appendices, and
both four-category mixed-source recovery/print journeys.

Per-finding final UI screenshots were visually inspected in
`.artifacts/playwright/phase-six-P6-*/P6-R*-corrected.png`: the correct cell is
owned by A, the next chooser is B, and the localized award shows the expected
canonical answer. Existing bilingual/theme catalog evidence is retained by the
complete suite. These are software/browser checks, not physical hardware or
screen-reader clearance.

The owned preview exited normally: **4182 closed**. Read-only inspection found
the existing live container serving **4183/4184**, 4183 responding HTTP 200,
and admin **8443** still listening. See
`.artifacts/phase-06-review-fixes-port-check.log`. No live service or shared
configuration was stopped, restarted or modified; no commit/push/deployment.

Preserved original phase manifest SHA-256:
`f247651a5c96fea880b084d0f2bcc457bb05d7e1cd27bca3e291c68bcb8a4fbe`.
After final documentation formatting and focused ledger checks, both correction
manifests cover all 26 changed/new nonignored deliverables, including this
handoff, the complete authoritative review plus appended response, and the
phase ledger. Initial review and pre-correction ledger remain byte-identical
prefixes. The writer stops here; the same reviewer must recheck the correction
snapshot before the coordinator's mandatory full post-review gates. No finding
or phase is self-cleared.
