# Phase 7 developer handoff — 2026-10-29

**Developer candidate; independent review pending. Not phase clearance or a
public release.** Baseline: `d717e2d45c0438a108528afdabdf2c0da245fb39`.
No commit, push, deployment, dependency installation or shared-service change.
The coordinator's initial phase-start edits in `PLAN.md` and the phase ledger
are preserved and extended with factual candidate status.

## Scope and acceptance mapping

| Requirement                            | Candidate evidence                                                                                                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Final twelve packs / 336 entries       | Programming, Arts/literature, Entertainment; four packs / 112 entries each                                                                                                                  |
| Final quota                            | 36 packs / 1,008 entries; nine categories × two languages × two packs; 504 entries per language                                                                                             |
| Preserve reviewed material             | All 24 prior JSON files compared byte-for-byte with `git show HEAD:<path>`; unchanged, including IDs and both starters                                                                      |
| Exact authored alphabets               | Existing `ALPHABETS` / `validatePack`; every pack has all 28 labels in original authored order                                                                                              |
| Natural, factual, original content     | Actual source sections read for every new entry; per-entry ledger and decisions below; independent examination of all 336 still required                                                    |
| Complete-library duplicates            | Unique normalized prompts and canonical answers per language; full-library reciprocal/source candidate comparison and editorial examination                                                 |
| Fixed and selected-source modes        | All 36 data-driven catalog journeys; every new fixed and individual number pack exported/reimported and recovered with its running pack locked                                              |
| Mixed old/new and full-library sources | Four new Czech/English UI journeys, plus retained earlier flows; unique 28, selected sources only, preserved questions/origins and recovered exports                                        |
| Real answer sheets                     | Each new fixed and individual number pack, plus four mixed/full selections, downloaded to standalone HTML and actual Chromium PDF; all 28 rows, aliases, citations and attribution verified |
| Catalog usability                      | Nine localized categories, 36-pack help, original defaults; both languages/themes at desktop/tablet sizes, filters not changing selection, no answer search                                 |
| Regression/quality gates               | 285 tests, 204 browser journeys, format/lint/types/build, both coverage groups and negative enforcement probes pass                                                                         |
| Final editorial gate                   | **Pending:** developer evidence is not independent review of the final 1,008-entry inventory                                                                                                |

## Exact changed/new files

New content (every file has 28 questions):

```text
src/content/programming-cs-01.json
src/content/programming-cs-02.json
src/content/programming-en-01.json
src/content/programming-en-02.json
src/content/arts-cs-01.json
src/content/arts-cs-02.json
src/content/arts-en-01.json
src/content/arts-en-02.json
src/content/entertainment-cs-01.json
src/content/entertainment-cs-02.json
src/content/entertainment-en-01.json
src/content/entertainment-en-02.json
```

Other changes:

```text
src/content/catalog.js
src/ui/preparation-strings.js
src/ui/strings.js
tests/catalog.test.js
tests/content.test.js
browser/catalog.spec.js
browser/phase-six.spec.js
browser/phase-seven.spec.js
README.md
docs/content-inventory.md
docs/content-sources.md
docs/phase-07-handoff.md
PLAN.md
IMPLEMENTATION_PHASES.md
```

Only three runtime modules changed: explicit catalog registration, category
translations and shorter final-inventory help. No new abstraction, state owner,
dependency, format version, CSS, gameplay transition or deployment behavior.
The existing concrete resource owners and pure domain functions remain intact.
Prior browser assertions were preserved; phase-six capacity expectations now
reflect 36 total / 18 per language / ten category options including “all”.

## Sources and editorial decisions

The [source ledger](content-sources.md#phase-7-developer-source-audit--2026-10-29)
has all **1,008 ID/answer/initial/source rows** and exact pack-byte hashes.
Its new twelve sections identify each of the **336** questions and supporting
locations. The preceding 672 entries and their review judgments are preserved.
Open the linked JSON for each precise question/alias scope.

All **233 distinct final in-pack URLs** for this bundle were retrieved and their
actual definitions, named documentation sections, plot/cast passages,
publication lists or relevant body text read. This is not an HTTP-only or
keyword-only check. Programming primarily cites official Python 3/tool/language
documentation, MDN, cppreference, Unicode, JSON.org and the YAML specification.
General cultural facts use public encyclopedic sources, including Czech sources
for localized names and titles. Cached source HTML/extractions and their index
are in `.artifacts/phase-07-research/`; the per-entry developer evidence is also
in `.artifacts/phase-07-editorial-audit.json`.

Research changed actual content, not merely the bibliography:

- The intended Czech `Řbitov zviřátek` is the 2019 adaptation, not the 1989 film.
  The initial wrong URL returned 404; the corrected clue names the 2019 directors
  and year and cites the successfully read page.
- An exploratory Merriam-Webster xylography reference returned 403 and is not
  shipped. The clue uses the supported woodcut technique, not unverified Greek
  etymology. No final new-pack reference remained inaccessible during authoring.
- Disney produced Snow White; the clue does not incorrectly credit Disney as
  its original distributor. Raskolnikov is described as a former student.
  Unneeded disputed/unsupported qualifiers were removed rather than guessed.
- Python prompts explicitly identify Python 3. JavaScript, C and C++ contexts
  are supplied when behavior depends on the language. Czech technical answers
  use actual common terms, names or keywords, not invented alphabet spellings.
- Avoided `.zig`, `AssertionError` and the full XML expansion as answer
  giveaways. Removed reciprocal module/import and function/return clue examples.
- Original/US/English-title questions reject disclosed translations such as
  Počátek, VALL-I and Zootropolis when outside the requested scope. Explicit
  punctuation, author-name and standard transliteration aliases remain useful;
  existing case/diacritic normalization is unchanged.
- Emily Brontë's clue uses Wuthering Heights, avoiding a reciprocal fact with
  the separate Jane Eyre clue. Related facts about the same creator, fictional
  universe or discipline are not automatically duplicate facts.

The complete 1,008-entry library was included in the duplicate comparison:
253,512 within-language pairs. Final normalized canonical/prompt duplicates
and reciprocal-stem candidates: zero. One shared-source candidate among new
entries remains intentionally distinct: `programming-cs-01-10` asks the generic
error concept, while `programming-cs-01-25` asks the handled runtime exception.
The developer examined candidate meanings as well as strings; the automated
heuristic cannot prove absence of all semantic duplicates or inflected
giveaways. Independent review must examine every new entry, not a sample.
Evidence: `.artifacts/phase-07-overlap.json`.

No protected passages, lyrics, images, logos or quiz-bank prose were imported.
CC BY 4.0 applies to original HexY question wording, not source websites'
copyrighted text/assets or third-party trademarks. Source links are factual
references, not transfers of their licensing. No naming/legal release clearance
is asserted.

## Exact verification and iteration record

Final full gates, run sequentially:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-07-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-07-browser.log 2>&1
git diff --check
```

- `check`: format, ESLint, JavaScript type checker, **19 test files / 285 tests**,
  V8 coverage/scoped enforcement and production build all passed.
- The unchanged **35 private-preview unit tests** remain included. No deployment
  code changed; no Docker/service integration or live deployment test was run.
- Browser suite: **204/204 passed**, no skips or retries masking failures.
  This retains all prior 168 journeys and adds twelve catalog instances and
  24 dedicated phase-seven journeys.
- Production build: 86 transformed modules; generated JavaScript 388.49 kB,
  106.99 kB gzip. JSON content is bundled, not counted as runtime source coverage.
- Final documentation formatting and whitespace checks passed after this
  evidence/status handoff was written.

Additional verification:

```sh
npx vitest run tests/content.test.js tests/catalog.test.js
node .artifacts/phase-05-coverage-probes.mjs
node .artifacts/phase-07-metrics.mjs
sha256sum -c .artifacts/phase-07-preserved.sha256
sha256sum -c .artifacts/phase-07-snapshot.sha256
```

Focused content/catalog run: 69 passed. Negative coverage probes: ten passed
(each of four metrics in each scope, plus missing critical/UI membership);
the generated summary was restored byte-for-byte. Restored SHA256:
`3321543333f050072038e6d784b3715f2b1ecbdf2aa042449af7909520f766bb`.
The original phase-five probe script was reused unchanged.

Failures during iteration are preserved, not omitted from the evidence:

- The first two content runs each had 63 passes / two failures: an incomplete
  source ledger plus XML, then Zig, clue giveaways. The ledger was completed and
  actual wording corrected; regression tests now cover the identified patterns.
- A new assertion needed an explicit missing-question guard for JSDoc checking.
- First focused browser run: 34 passed / two failures. Constant `Math.random`
  input did not sample every category; production promises source membership,
  not category balancing. Replaced that test input with a deterministic seeded
  sequence that exercises all categories; did not change the generator or relax
  the category assertion. All four mixed/full flows then passed.
- Initial full `check` stopped at a 63-line test callback. Expressed its
  equivalent expected-category set directly from selected IDs, within the
  existing 60-line limit; the subsequent complete gate passed.
- One research invocation used unavailable `python`; reran with installed
  `python3`. Navigation-heavy source extractions were replaced with precise
  section/body reads. No dependency was installed.

Logs: `.artifacts/phase-07-focused*.log`,
`.artifacts/phase-07-browser-focused.log`,
`.artifacts/phase-07-browser-seed-fix.log`,
`.artifacts/phase-07-check-initial.log`, and the final logs above.
Initial browser failure traces/screenshots are retained in
`.artifacts/phase-07-focused-failures/`.

## Coverage and reviewable limits

V8 statement coverage is measured separately from browser journey success:

| Scope               | Lines              | Statements         | Functions      | Branches         |
| ------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 files  | 2831/2842 (99.61%) | 2860/2871 (99.62%) | 211/211 (100%) | 880/901 (97.67%) |
| Remaining, 21 files | 2548/2558 (99.61%) | 2587/2597 (99.61%) | 85/87 (97.70%) | 360/376 (95.74%) |
| Required critical   | 95%                | 95%                | 95%            | 90%              |
| Required remaining  | 85%                | 85%                | 85%            | 80%              |

All **47 runtime JavaScript files** are included, including untested files in the
denominators. Only truly type-only `src/domain/types.js`, data and generated
outputs are excluded. No runtime exclusion, blanket ignore or threshold change.

Critical members:

```text
src/app.js
src/domain/actions.js       src/domain/answers.js
src/domain/board.js         src/domain/config.js
src/domain/duels.js         src/domain/errors.js
src/domain/game.js          src/domain/generation.js
src/domain/outcomes.js      src/domain/packs.js
src/domain/preferences.js   src/domain/saves.js
src/domain/validation.js
src/runtime/buzzer.js       src/runtime/clock.js
src/runtime/downloads.js    src/runtime/gamepad.js
src/runtime/inputs.js       src/runtime/keyboard.js
src/runtime/library.js      src/runtime/preparation.js
src/runtime/recovery.js     src/runtime/symbols.js
src/runtime/touch.js
src/workspace.js
```

Remaining members:

```text
src/content/catalog.js
src/main.js                src/messages.js
src/ui/answer-sheet.js     src/ui/application.js
src/ui/board.js            src/ui/catalog.js
src/ui/device-strings.js   src/ui/dom.js
src/ui/editor.js           src/ui/game.js
src/ui/header.js           src/ui/host.js
src/ui/inputs.js           src/ui/library.js
src/ui/preparation-strings.js
src/ui/preparation.js      src/ui/recovery.js
src/ui/round.js            src/ui/setup.js
src/ui/strings.js
```

Measured production maxima remain: **294** nonblank/noncomment module lines
(`src/app.js`), **60** function lines (`editorView`), complexity **10**
(`restoreFocus`), nesting **3** (`uniqueQuestions`). No exception required.
Full metrics/membership evidence: `.artifacts/phase-07-metrics.json`,
`.artifacts/phase-07-coverage-probes.log` and the full check log.

## Browser, print and visual evidence

All new fixed and individual number boards were downloaded, reimported, started,
reloaded and verified locked. Host claim/reset did not regenerate the current
questions. The mixed/full tests exercise selected hidden sources and preserve
actual question fields and provenance through exports and recovery.

`browser/preparation-helpers.js` and the unchanged reviewed
`browser/pdf-helpers.js` check every row of standalone HTML and actual Chromium
PDF, including numbering/order, question IDs, initials, question prose,
canonical/alias text and factual-source/attribution appendices. PDFs are produced
by Chromium; the parser is deliberately Chromium-specific, not a universal PDF
parser or evidence for a physical printer.

Fresh screenshots were opened and visually inspected:

| View                        | Artifact under `.artifacts/playwright/`                                               |
| --------------------------- | ------------------------------------------------------------------------------------- |
| Czech light, 1920×1080      | `phase-seven-phase-seven-ca-0a8a0-categories-no-answer-search/full-catalog.png`       |
| Czech dark, 1024×768        | `phase-seven-phase-seven-ca-6d038-categories-no-answer-search/full-catalog.png`       |
| English dark, 1920×1080     | `phase-seven-phase-seven-ca-95707-categories-no-answer-search/full-catalog.png`       |
| English light, 1024×768     | `phase-seven-phase-seven-ca-3f164-categories-no-answer-search/full-catalog.png`       |
| Czech fixed arts print      | `catalog-catalog-arts-cs-01-58f90-ecovery-and-host-reset-lock/answer-sheet-print.png` |
| Czech full-library print    | `phase-seven-phase-seven-cs-b576e-s-export-print-and-recovery/answer-sheet-print.png` |
| English old/new mixed print | `phase-seven-phase-seven-en-c1f33-s-export-print-and-recovery/answer-sheet-print.png` |

The full catalog is a long scrollable form, not a claim that 36 sources fit in
one viewport. Labels, all nine categories, selection summary, controls and final
rows are readable without horizontal overflow in the inspected captures; filters
reduce the list without changing selected sources. The private answer-sheet
screenshots show all 28 numbered rows and their source appendix, without game
controls. No new visual design or device-support change was needed.

Sibling artifacts in each print directory contain the actual exported JSON,
standalone HTML and `answer-sheet.pdf`. All new-pack directories and 302
catalog/phase-seven JSON/HTML/PDF/image artifacts are indexed with byte hashes in
`.artifacts/phase-07-export-evidence.json`. The full HTML test report is
`.artifacts/browser-report/index.html`. Existing visual journeys additionally
passed 1280×720, 1920×1080, 1024×768 and 768×1024 board/game layouts.

To reproduce manually, build and use the local preview or the existing
Playwright-managed production preview on 4182. Select interface/question
language, filter each new category, select one fixed pack and download both
JSON and the private sheet. For numbers, clear selection, select one new source
or an old/new combination, prepare and accept, then repeat downloads/import.
Start, reload, export again, and host-claim/reset a cell; its question remains
the locked prepared question. Never substitute a live-service restart for this
local reproduction.

## Freeze, limitations and next action

All 24 prior pack hashes pass; direct baseline comparison and final quotas are
recorded in `.artifacts/phase-07-inventory-verification.json`.
After all tracked/new-file writes, `.artifacts/phase-07-snapshot.sha256` records
the complete **26-file** candidate including this handoff and coordinator docs.
Verify it before independent review. Research scripts/caches and test evidence
remain ignored artifacts, not shipped application content.

No actual Xbox controller, physical tablet, assistive-technology session or
printer was tested; browser/device simulations are not hardware clearance.
No public-release, naming/legal or deployment gate was attempted. Live private
preview ports 4183/4184, Tailscale, the updater and the separate 8443 admin service
were untouched. The owned Playwright 4182 preview stopped after its suite.

**Developer stops writing here.** A fresh independent reviewer must inspect this
snapshot, every one of the 336 new questions and supporting facts, aliases,
full-library overlap and the runtime/test/doc changes. The coordinator then
persists the real review, returns any findings to this developer, and runs
post-review checks before any clearance or delivery. No phase-8 work starts
from this developer handoff.

## P7-01 correction handoff — 2026-10-29

**This is the follow-up candidate; the sections above record the initial
snapshot. Same-reviewer re-review is pending, not clearance.**
The initial independent review examined all 336 new entries (335 passed, one
minor finding) and the entire 1,008-entry library for semantic/reciprocal overlap.
The original finding is preserved in [the review](../reviews/phase-07.md);
only a developer response is appended there.

### Minimal correction and continuity

Only `arts-en-01-16.text` changed:

> Under which surname did Eric Arthur Blair publish Animal Farm and Nineteen
> Eighty-Four?

Unlike the original author-identity question, this explicitly requests the
publishing surname. `Orwell` and `George Orwell` remain accepted; the disclosed
real name and its variants are not answers to the new scoped question.
The full pen name contains the requested surname and remains a useful alias.
Canonical answer, aliases, O position/cell 16, stable ID, category/language and
source are unchanged. No engine/normalizer/dependency/deployment change.

The unchanged George Orwell source's introduction identifies Eric Arthur Blair,
his pen name and both novels; its Writing section corroborates the novels.
These passages were reread from the independent source cache
`.artifacts/phase-07-independent/43e783d441ea043d.txt`, lines 345–346 and 455.
No new factual claim or citation was invented.

Affected pack hashes:

- Original: `bd6a8145deced9aa6a7a3820132839f896b25125aa6a8f923117fd88f7d798d5`.
- Corrected: `4bdd57a7dadc6fc800b45382d8453bccc324100f87eb3da39d667b5a5dcd98ac`.

All 36 pre-fix pack bytes are retained in
`.artifacts/phase-07-review-fixes-before/content/`. The audit proves the corrected
file equals the original bytes with exactly that one prompt replacement; every
other pack is byte-identical. This preserves **335 other new entries and all
672 old entries**, including the other 27 objects within the affected pack.
The old 24 packs were also compared directly with baseline Git bytes.

The original `.artifacts/phase-07-snapshot.sha256` remains unchanged, SHA256
`50761eae1185726c6fc33e85db4251b97f191607eebd163be07f531aa24ece7f`.
Independent `entry-audit.json` and source `index.json` retain their original
SHA256 values `bd7314c6e9e405fb2322a26a7dd5fa9d763bee66b5961450c9143c474cd38664`
and `b9ae1c3365e3529e5c14124bab7d4f320c789797ad2277dbc93cb76ace916e22`.
They remain historical independent evidence, not rewritten developer judgments.

Correction-round files: `src/content/arts-en-01.json`, `tests/content.test.js`,
`browser/phase-seven.spec.js`, `docs/content-sources.md`, this handoff,
`reviews/phase-07.md` (response only), `PLAN.md` and `IMPLEMENTATION_PHASES.md`
(current status). No other application/content changes in this round.

### Focused regression and real exports

Before editing, the actual `acceptsAnswer` checker reproduced the finding:
the old author-identity prompt rejected Eric Arthur Blair / Eric Blair while
accepting Orwell / George Orwell. Evidence:
`.artifacts/phase-07-review-fixes-original-matching.json`.
The new unit regression was run against the original content first and failed
on its imprecise wording; after correction it passed. It checks the explicit
scope, original position, canonical/alias acceptance, normal whitespace/case
matching, rejected real-name variants and absence of an Orwell giveaway.

```sh
npx vitest run tests/content.test.js -t P7-01
npx vitest run tests/content.test.js tests/catalog.test.js
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test browser/phase-seven.spec.js browser/catalog.spec.js --grep 'P7-01| arts-en-01:'
```

Final focused results: **70 tests and four browser journeys pass**. The first
targeted red run and subsequent green run are retained as
`.artifacts/phase-07-review-fixes-red.log` and `-green.log`; nonmatching tests
were excluded only by the explicit focused selector, not disabled.
Full focused logs use `-focused.log` and `-browser-focused.log`.

Two added UI cases exercise fixed letters and individual-source numbers:
download/reimport, exact corrected wording/initial, actual HTML/PDF, two
out-of-scope real-name submissions leaving the cell unclaimed, then award to A
for Orwell (fixed) or George Orwell (numbers). Existing recovery/reset flows for
the affected pack still pass. The fixed slot remains 16; the deterministic
shuffled number board places the same question at slot 15.

Fresh actual gameplay and print-media screenshots were opened and inspected:

- `.artifacts/playwright/phase-seven-P7-01-letters--1070e-tic-play-and-actual-exports/`
- `.artifacts/playwright/phase-seven-P7-01-numbers--b36dd-tic-play-and-actual-exports/`

Each directory contains `surname-scope.png`, `answer-sheet-print.png`,
`corrected.json`, `corrected.html` and `answer-sheet.pdf`. The corrected prompt
is readable below the board and in its proper printed row; canonical/alias
columns and source appendix remain intact. PNGs are browser/HTML print-media
captures, not PDF rasterizations.
The unchanged PDF helper verified all 28 actual PDF rows and source/attribution
data in both cases (56 ordered rows), again in the correction audit, not merely
HTML/file existence. All other full-suite print validations also pass.
Continuity, actual matching and export hashes:
`.artifacts/phase-07-review-fixes-audit.json`.

### Full gates and measured limits

Run sequentially after focused correction:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-07-review-fixes-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-07-review-fixes-browser.log 2>&1
git diff --check
node .artifacts/phase-05-coverage-probes.mjs > .artifacts/phase-07-review-fixes-coverage-probes.log
node .artifacts/phase-07-review-fixes-metrics.mjs > .artifacts/phase-07-review-fixes-metrics.log
node .artifacts/phase-07-review-fixes-audit.mjs > .artifacts/phase-07-review-fixes-audit.log
```

All pass: format/lint/types, **286 tests / 19 files**, build and **206 browser
journeys** (6.8 minutes), including all prior tests/journeys and the unchanged
35 private-preview unit tests. No installs, skipped failures or weakened
assertions. Production build: 86 modules, JavaScript 388.48 kB / gzip 106.99 kB.
Final documentation formatting and whitespace checks also pass.

| Scope               | Lines              | Statements         | Functions      | Branches         |
| ------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 files  | 2831/2842 (99.61%) | 2860/2871 (99.62%) | 211/211 (100%) | 880/901 (97.67%) |
| Remaining, 21 files | 2548/2558 (99.61%) | 2587/2597 (99.61%) | 85/87 (97.70%) | 360/376 (95.74%) |

All **47 runtime files** remain included with exactly the membership listed in
the initial handoff above; exclusions and separate 95/95/95/90 and 85/85/85/80
thresholds are unchanged. Ten negative metric/membership probes passed and
restored the generated report byte-for-byte to SHA256
`3321543333f050072038e6d784b3715f2b1ecbdf2aa042449af7909520f766bb`.
Measured production maxima remain **294 module lines / 60 function lines /
complexity 10 / nesting 3**, with no exceptions. Browser success is not being
substituted for statement coverage.

### Correction freeze

After all writes, new manifests cover the full phase candidate including the
persisted review report:

- `.artifacts/phase-07-review-fixes-snapshot.sha256`: 27 changed/new files.
- `.artifacts/phase-07-review-fixes-canonical.sha256`: complete 169-file
  tracked/nonignored-untracked name set.

Both manifests are verified; the original manifest is retained, not replaced.
The independent finding remains open until the same reviewer evaluates the
correction. Reviewer: `9027f5f9-bb72-48b3-88f6-1b1e85776bed`.
The owned 4182 preview stopped; live 4183/4184/admin/Tailscale/updater services
were untouched. No commit, push, deployment, hardware/public-release clearance
or phase-8 work. **Developer stops writing for same-reviewer re-review.**
