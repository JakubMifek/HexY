# Phase 5 developer handoff — 2026-10-28

**Frozen for independent review. NOT CLEARED. No commit, push or deployment.**

Latest submission: [P5-R1–R4 review corrections](#review-corrections).
The original developer handoff below is retained as initial-snapshot history;
the appended correction section records the current code, verification and
same-reviewer handoff. Initial independent review covered all 336 entries.

Baseline: `92659db1660856ade7c00b81952936f66d4c43e8` on `main`.
The coordinator's initial factual `PLAN.md` / phase-ledger updates were
preserved and extended. This developer was the sole implementation writer;
no nested implementation delegation, dependency installation, shared-service
change, browser installation or system-setting change was performed.

## Acceptance mapping

| Phase-5 criterion                                                            | Implementation and evidence                                                                                       | State                                                    |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| General knowledge, Nature, Geography/travel only                             | Exact inventory in [content-inventory.md](content-inventory.md)                                                   | Developer complete                                       |
| Two packs/category/language, 12 packs / 336 entries                          | Ten new 28-question packs; two unchanged starters count toward General                                            | Developer complete; editorial review pending             |
| Original wording, natural scope, useful aliases, supported canonical answers | Individually authored Czech/English; all-entry [source ledger](content-sources.md), 339 distinct in-pack URLs     | Every entry awaits independent factual/linguistic review |
| Stable globally unique IDs, correct alphabets/placement/metadata/schema      | All 336 IDs checked; actual `ALPHABETS` and `validatePack` used; preserved starter bytes and IDs                  | Automated checks pass                                    |
| No duplicate question text or canonical answer within a language             | 168 unique normalized prompts and canonical answers per language; candidate reciprocal facts revised              | Text checks pass; semantic editorial review pending      |
| Every pack works fixed and as a number source                                | Parameterized domain/export tests and 12 real-UI pack journeys; exact exported/recovered content                  | Pass                                                     |
| Full catalog browsing/filtering                                              | Metadata search, category/language/origin, no-results/count, explicit hidden selections, separate clear actions   | DOM and Chromium checks pass                             |
| Selected-source-only generation and content locks                            | Existing generation/transitions unchanged; mixed-category games and all-pack recovery/reset regressions           | Pass                                                     |
| Provenance and licensing                                                     | Original content CC BY 4.0; author/source metadata and generated origins preserved; no copied source prose/assets | Developer documented; independent review pending         |
| Software gate and visible evidence                                           | Commands, exact coverage and artifact paths below                                                                 | Pass; not phase clearance                                |

No phase-6/7 content or phase-8 release work is included. There are **12 current
packs, not 36**. No alphabet change, schema change or unresolved product decision
was needed.

## Exact changed/new files

New content:

- `src/content/general-cs-02.json`
- `src/content/general-en-02.json`
- `src/content/nature-cs-01.json`
- `src/content/nature-cs-02.json`
- `src/content/nature-en-01.json`
- `src/content/nature-en-02.json`
- `src/content/geography-cs-01.json`
- `src/content/geography-cs-02.json`
- `src/content/geography-en-01.json`
- `src/content/geography-en-02.json`

Runtime/UI:

- `src/content/catalog.js` — explicit 12-pack catalog and pure metadata filter.
- `src/runtime/preparation.js` — transient filters and one-starter default.
- `src/ui/catalog.js` — new cohesive source-browser view.
- `src/ui/preparation.js` — delegates source selection display to that view.
- `src/ui/preparation-strings.js` — bilingual catalog labels/messages.
- `src/style.css` — responsive catalog controls.
- `src/ui/strings.js`, `src/ui/setup.js` — accurate catalog/help copy.

Tests:

- `tests/content.test.js` — 21 total content tests, including original regressions.
- `tests/catalog.test.js` — nine new catalog DOM/model cases.
- `browser/catalog.spec.js` — 30 new real-browser journeys.

Documentation:

- `README.md`
- `docs/contracts.md`
- `docs/content-inventory.md`
- `docs/content-sources.md`
- `docs/phase-05-handoff.md`
- `PLAN.md`
- `IMPLEMENTATION_PHASES.md`

Both starter JSON files are unchanged. No dependencies, lockfile, coverage
configuration, build configuration, storage/recovery/input adapter or game
transition was changed. Ignored research/build/browser artifacts are not source
deliverables or additions to the production bundle.

## Implementation decisions and preserved behavior

The existing preparation object already owns the source selection and accepted
content; it now also holds a small transient filter record. `filterPacks` is a
pure projection of metadata. The view updates results in place while typing,
preserving search focus/caret rather than rebuilding the workspace.
Listeners use the existing AbortSignal lifetime, with one delegated selection
listener rather than accumulating listeners per filtered checkbox.

Filters never select/deselect, revise content, invalidate acceptance or enter
storage. A mixed-category custom pack matches any of its question categories.
Known category labels are localized; arbitrary imported categories/titles are
rendered as inert text. Category names such as `constructor`, `toString` and
`__proto__` are treated as author text, not inherited dictionary properties.
Search ignores case/diacritics and examines only pack
title/ID, not hidden question/answer content. The selected-source summary always
names filtered-out selections; clear filters and clear sources are distinct.

With six packs per language, the former “select every matching bundled pack”
default would break fixed-mode preparation. Configuration now chooses only the
first matching original starter for either mode, preserving earlier behavior.
It does not auto-select all matching filters or reset custom questions to a
translated substitute.

The real game engine, generation and storage boundaries remain authoritative.
Started/recovered games have no catalog/editor controls, preserve their exact
pack after recovery and host field reset, and never adopt filtered sources.
The full prior suite preserves failed-read `undefined` versus empty `null`,
Recovery-owned write permission, exact protected replacement bytes, separate
storage keys, draft/exclusion policies and unsupported-duel-symbol rejection.
No stale-event, input, clock or host-correction behavior was redesigned.

Screenshot inspection revealed old setup text promising recovery/controllers
only in future phases. The directly visible footer was corrected to describe
successful saved-game recovery and the need for export backups. This is a
tightly related copy correction, not a new recovery feature.

## Editorial/source handoff

Read [the inventory policy](content-inventory.md) first, then review each actual
JSON question/alias alongside [its ledger entry](content-sources.md). The ledger
contains every stable ID, answer, initial, shipped source link and article
location; SHA-256 values bind it to the exact twelve authored JSON files.
A test detects missing entries/citations and changed pack bytes. Neither that
test nor source HTTP success proves factual or linguistic correctness.

The developer retrieved sources and inspected definitions, relevant paragraphs,
tables and specialist references. There are 339 distinct in-pack URLs:
337 succeeded via curl; UNESCO's Zelená Hora page was instead verified through
web-fetch. The unchanged BCcampus basalt starter URL returned an error (HTTP 530
through web-fetch), but its existing Basalt reference supports the actual
question. Additional verified Greeley Philharmonic and Pacific Ocean references
in the ledger corroborate starter instrument-size and ocean-boundary details
without altering starter files. Sources are citations, not copied question
banks or redistributed article passages.

Examples of concrete authoring corrections:

- `general-en-02-02`: Bagel replaced a reciprocal badminton/shuttlecock clue.
- `geography-en-01-23`, `geography-en-01-24`, `geography-en-02-18` and
  `nature-en-02-10`: removed accepted-answer giveaways from the prompts.
- `nature-cs-01-26`: defensible Czech **Wollemie vznešená**, supported by
  BOTANY.cz's discovery/date narrative, rather than dubious forced spelling.
- `geography-cs-02-05`, `nature-cs-02-21`, `general-cs-02-27`: replaced
  disambiguation/incorrect article paths with the specific Dover, sépie and
  zdrhovadlo sources.
- `geography-cs-02-28`: verified UNESCO's actual site record instead of an
  unavailable candidate article URL.
- Scientific-name aliases appearing in a prompt were omitted. Redundant
  normalized aliases were removed from new packs; meaningful spelling/name
  variants remain. Canonical answers alone must match fixed prefixes.

These are pre-review developer edits, not an independent review verdict.
Review **all 336 entries**, including the previously cleared starter entries,
and record any findings by stable question ID. Live references may subsequently
change; the evidence documents this authoring pass, not permanent availability.

## Verification and results

Environment: existing Node 20.19.2 / npm 9.2.0 dependencies and existing local
Chromium/library extraction. The approved production-preview Playwright
configuration avoids the host's exhausted inotify watches; no dev server,
dependency reinstall or shared configuration workaround was introduced.

Final commands, run sequentially:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-05-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-05-browser.log 2>&1
node .artifacts/phase-05-coverage-probes.mjs > .artifacts/phase-05-coverage-probes.log
git diff --check
```

- `npm run check`: **PASS** — Prettier, ESLint/metrics, JSDoc type checking,
  Vitest V8, separate coverage gates and Vite production build.
- **209 tests / 17 files pass**, up from 184 / 16.
- **139 Chromium journeys pass in 4.6 minutes**, up from 109; no skipped,
  weakened or replaced prior regression cases.
- `git diff --check`: **PASS**.
- Ten negative coverage probes: **PASS** (each deliberately returns exit 1);
  original coverage report restored byte-for-byte and its baseline checker
  rerun successfully. The script uses `finally` for restoration.
- Production build: 62 transformed modules; JS 190.80 kB / 58.16 kB gzip and
  CSS 7.01 kB / 2.42 kB gzip.
- Preview port 4182: **closed**, TCP connection returns `ECONNREFUSED`.
  All source-fetch/probe sessions and the Playwright-owned preview have exited.

### Coverage membership and exact denominators

All **47 executable runtime modules** are discovered: **26 critical** and
**21 remaining**. `src/ui/catalog.js` is newly included in remaining;
`src/content/catalog.js` stays there. Only genuinely type-only
`src/domain/types.js` is excluded. No runtime source exclusion or threshold
change was added.

| Group     | Measure    | Covered / total | Result  | Required |
| --------- | ---------- | --------------- | ------- | -------- |
| Critical  | Lines      | 2831 / 2842     | 99.61%  | 95%      |
| Critical  | Statements | 2860 / 2871     | 99.62%  | 95%      |
| Critical  | Functions  | 211 / 211       | 100.00% | 95%      |
| Critical  | Branches   | 880 / 901       | 97.67%  | 90%      |
| Remaining | Lines      | 2474 / 2484     | 99.60%  | 85%      |
| Remaining | Statements | 2489 / 2499     | 99.60%  | 85%      |
| Remaining | Functions  | 84 / 86         | 97.67%  | 85%      |
| Remaining | Branches   | 357 / 373       | 95.71%  | 80%      |

The negative probes reduce each of the four measures in each group separately
(eight failures), then omit `src/app.js` and `src/ui/catalog.js` coverage
membership separately (two failures). They mutate only the report, never
production source, tests or checker configuration. Restored report SHA-256:
`60dc286586ea84917d8bb2efec8b0b231150f252e8df333a4b634ea3d8243703`.

### Size/complexity discipline

Existing ESLint limits remain enforced: module 300, function 60 nonblank/
noncomment lines, complexity 10, nesting 3. No exceptions or disable comments.
Read-only ESLint diagnostics with zero-limit overrides measured actual maxima:
294 module lines, 60 function lines, complexity 10, nesting 3 across production.
The new `src/ui/catalog.js` has 152 counted module lines; its longest function
is 56 lines. `src/content/catalog.js` has 43 counted lines and maximum
complexity 8. The diagnostic overrides were not saved to project configuration.
Details: `.artifacts/phase-05-metrics.json`.

### Iteration failures and limitations disclosed

- Initial catalog filter construction exceeded the 60-line function limit
  (80 lines); split controls from their cohesive field definitions.
- The initial large browser test exceeded that limit (75 lines); reused the
  existing print helper and extracted the actual choose/accept interaction.
- A final implementation inspection found that unknown category names matching
  Object prototype properties displayed the inherited value. Three focused
  regression cases first failed as expected (six existing catalog cases passed),
  then passed after both label lookups used `Object.hasOwn`. Evidence:
  `.artifacts/phase-05-category-regression-before.log`. The final targeted
  `TMPDIR="$PWD/.artifacts" npx vitest run tests/content.test.js tests/catalog.test.js`
  passed 30/30 in two files; complete code and browser gates were rerun afterward.
- Source retrieval initially hit unavailable `python`, Python3 HTTP 403 and
  Node fetch failures. Curl with bounded concurrency succeeded; early
  extraction of the first Wikipedia wrapper missed paragraphs, so extraction
  was corrected before evidence generation. Candidate 404/disambiguation
  URLs and factual/wording weaknesses were corrected, not silently ignored.
- The attempted focused command through `npm test -- ...` still ran all tests
  because the existing npm script supplies `tests`; it passed all 206. Earlier
  targeted catalog browser validation passed 30/30 before the final full run.
- No final gate failed. Earlier successful iteration logs are supplemental,
  not substitutes for the final commands above.

## Reproduction and inspectable artifacts

Use the normal README preview commands or let Playwright start/stop the existing
production preview. Do not change shared services to reproduce these tests.

1. Open preparation in either language. Only that language's original General
   starter is selected/accepted. Search `geography`, filter question language;
   two matching packs appear while the hidden starter remains explicitly listed.
   Clear filters: all twelve return without invalidating the accepted board.
2. Clear source selection, choose `geography-<language>-02`, use the fixed board,
   accept and export JSON/private HTML. Fixed initials and 1–28 sheet numbering
   agree. Start, reload, reset a field: the exact pack stays locked.
3. Choose Numbers, clear sources, select `nature-<language>-02`; filter to
   Geography and also select `geography-<language>-02`. Search a nonexistent
   title. Generate/accept/export: all 28 unique questions come only from those
   explicit hidden selections, with source origins. Play an automatic answer.
4. Use keyboard Tab/Enter and native selects at 1280×720, 1920×1080, 1024×768,
   768×1024 in both themes/languages. Search retains focus; no horizontal
   overflow. New filters/buttons and source label targets meet 44 CSS px.

The new suite produces **62 catalog artifacts** under `.artifacts/playwright`:
38 JSON exports, four HTML sheets, two print PDFs and 18 PNGs (16 catalog
screenshots plus two print screenshots). Exact paths are indexed in
`.artifacts/phase-05-browser-artifacts.txt`; browser reruns overwrite that output.

Visually inspected final representatives (paths relative to `.artifacts/playwright/`):

- English dark desktop:
  `catalog-catalog-1280x720-e-95f40-yboard-filtering-and-layout/catalog-full.png`
- English light desktop:
  `catalog-catalog-1280x720-e-8dd3e-yboard-filtering-and-layout/catalog-full.png`
- Czech dark desktop:
  `catalog-catalog-1280x720-c-62479-yboard-filtering-and-layout/catalog-full.png`
- Czech dark large display:
  `catalog-catalog-1920x1080--3bae0-yboard-filtering-and-layout/catalog-full.png`
- English light landscape:
  `catalog-catalog-1024x768-e-02d14-yboard-filtering-and-layout/catalog-full.png`
- Czech light portrait:
  `catalog-catalog-768x1024-c-8a787-yboard-filtering-and-layout/catalog-full.png`
- Czech dark portrait:
  `catalog-catalog-768x1024-c-aa1d6-yboard-filtering-and-layout/catalog-full.png`
- English dark portrait:
  `catalog-catalog-768x1024-e-4f44d-yboard-filtering-and-layout/catalog-full.png`

Final copy, selected-source summary, readable wrapping and visible focus were
inspected. Both final geography print screenshots were inspected: all 28
rows/initials/aliases are present, with no unrelated game controls:

- English: `catalog-catalog-geography--0e430-ecovery-and-host-reset-lock/`
- Czech: `catalog-catalog-geography--854d2-ecovery-and-host-reset-lock/`

Those directories contain `fixed-sheet.html`, `answer-sheet.pdf`,
`answer-sheet-print.png` and the actual fixed/number/recovered JSON exports.
The two mixed-source directories contain `chosen-mix.json` and
`chosen-mix.html`. Test assertions inspect the real exported formats and the
real game UI; no game-engine replacement is used. Existing deterministic
randomness is used at the browser boundary.

Source research artifacts: `.artifacts/phase-05-source-audit.json`,
`phase-05-source-fetch.json`, `phase-05-source-probes.json` and their final logs.
These are developer reference aids; tracked per-entry evidence is authoritative
for the review scope, and live independent factual checking is still required.

## Freeze and next action

After all source/test/documentation writes, create and verify
`.artifacts/phase-05-snapshot.sha256` over **all changed/new nonignored files**,
including this handoff and the coordinator's initial documents. Ignored builds,
coverage reports, research helpers and screenshots are not included. There are
no deleted source files. The final developer response confirms manifest
creation; no further implementation writes occur during independent review.

Next: the coordinator requests an independent review of that snapshot,
including every question. Findings must be corrected and re-reviewed before
the coordinator's post-review full tests, authorized commit/push and remote
verification. No later phase starts before that verified push.

Actual Xbox/controller hardware, physical tablets, other browser engines and
screen-reader devices remain unverified; viewport/device-boundary automation
does not claim physical verification. Name/trademark clearance, release
acceptance and public deployment remain phase-8 work. External-source outages
are disclosed above. Passing this developer gate is not independent clearance.

## Review corrections

**P5-R1–R4 implemented; frozen for re-review, NOT CLEARED.**
Initial findings and every-entry accounting in [the review report](../reviews/phase-05.md)
are preserved. The developer response is appended, not substituted for the
reviewer's verdict. Only the coordinator/same independent reviewer can clear
the corrected snapshot.

### Findings and precise corrections

- **P5-R1 — `nature-cs-01-14`:** asks for the community of fungus and alga or
  cyanobacterium forming a shared thallus, not the name of their relationship.
  Actual checker: `Lišejník` accepts; `lichenismus` rejects. The regression
  checks the new community/thallus scope and absence of “soužití”.
- **P5-R2 — `general-cs-02-08`:** removed `branka` from the English-loanword
  question's aliases. `Gól` accepts; `branka` rejects.
  **`general-en-02-24`:** removed both generic hook-and-loop aliases from the
  brand-name question. `Velcro` accepts; `hook-and-loop fastener` and
  `hook and loop fastener` reject. Prompts and canonical answers are unchanged.
- **P5-R4 — `geography-cs-01-19`:** uses “Kolínem v Německu”, not “Kolínem nad
  Rýnem”. The focused regression excludes that declined giveaway and confirms
  `Rýn`/`Rhein` still accept. No general stemming or answer-normalization change.
- **P5-R3 — shared answer-sheet export:** appended one source section per
  question, in exact exported array order, explicitly labeled with the cell
  number and stable question ID. All `sources` strings are escaped plain text,
  including host notes, markup-looking strings and JavaScript-looking URLs.
  No clickable URLs, executable markup or network dependencies are created.
  Existing localized source/number/ID labels are reused; no translation fallback.
  Print CSS starts the appendix on a separate page, wraps long references and
  avoids splitting ordinary source entries. The original table still contains
  exactly 28 complete rows, and authors/license/origins remain intact.

The corrected content changes **only two question texts and two alias arrays**.
`.artifacts/phase-05-review-fixes-preservation.mjs` reconstructs the original
authored bytes, verifies them against the independent review's twelve pack
hashes, then checks each complete question and all pack metadata. Result:
**332 full entries unchanged**, four permitted field corrections; all IDs,
positions, initials, canonical answers, categories, languages and sources
unchanged. Both starter files match their prior exact hashes.
The four corrected pack hashes are in [content-sources.md](content-sources.md).

Raw actual-checker evidence:
`.artifacts/phase-05-review-fixes-content-checks.json`.
Original independent editorial accounting remains byte-identical, SHA-256:
`6a5f8bd0a66a24b40ee41a85f15a2d35ff35eded42f89fd5dca4064d5434529e`.

### Correction file scope

Changes relative to the first reviewed implementation:

- Four JSON packs: `nature-cs-01`, `general-cs-02`, `general-en-02`,
  `geography-cs-01` under `src/content/`.
- `src/ui/answer-sheet.js`: concrete source appendix and print styling.
- `tests/content.test.js`: four focused editorial cases.
- New `tests/answer-sheet.test.js`: both-language fixed/generated source,
  ordering, rights and hostile-text checks.
- `browser/preparation-helpers.js`: verify all exact source associations and
  invoke actual PDF checks while retaining the complete 28-row assertions.
- New `browser/pdf-helpers.js`: native Chromium PDF Unicode-map decoding,
  checking every complete ordered row, each cell/ID/citation association,
  pack rights and all origin credits. Whitespace and font ligatures alone are
  normalized; no dropped-row or source-only shortcut.
- New `browser/answer-sheet.spec.js`: four real import/prepare/export journeys
  for both languages and both fixed/generated modes, with hostile source text.
- README, contracts, content inventory/source ledger, this handoff, PLAN,
  phase ledger and appended review response.

No dependency, schema, coverage threshold/configuration, storage/input/recovery
behavior, general normalization or game transition change. No additional
runtime module: the appendix belongs to the existing concrete sheet renderer.

### Verification

Focused commands:

```sh
TMPDIR="$PWD/.artifacts" npx vitest run tests/content.test.js tests/answer-sheet.test.js tests/workspace.test.js > .artifacts/phase-05-review-fixes-focused.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test browser/answer-sheet.spec.js browser/preparation.spec.js browser/catalog.spec.js > .artifacts/phase-05-review-fixes-focused-browser.log 2>&1
```

Results: **43/43 tests in three files**, **39/39 focused Chromium journeys**.
Then the complete required gate ran sequentially:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-05-review-fixes-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-05-review-fixes-browser.log 2>&1
node .artifacts/phase-05-review-fixes-coverage-probes.mjs > .artifacts/phase-05-review-fixes-coverage-probes.log
node .artifacts/phase-05-review-fixes-preservation.mjs > .artifacts/phase-05-review-fixes-preservation.log
git diff --check
```

**PASS:** format, lint/metrics, JSDoc types, **215 tests / 18 files**,
separate coverage gates, production build, **143 Chromium journeys (4.7m)**,
content preservation and diff checks. No skipped or weakened prior tests.
Build: 62 modules; JS 191.23 kB / 58.30 kB gzip, CSS unchanged.

All **47 runtime modules** remain included: **26 critical / 21 remaining**.
Only genuinely type-only `domain/types.js` is excluded. The modified
`ui/answer-sheet.js` is included and exercised; browser helpers/tests are not
claimed as runtime statement coverage.

| Group     | Measure    | Covered / total | Percentage | Required |
| --------- | ---------- | --------------- | ---------- | -------- |
| Critical  | Lines      | 2831 / 2842     | 99.61%     | 95%      |
| Critical  | Statements | 2860 / 2871     | 99.62%     | 95%      |
| Critical  | Functions  | 211 / 211       | 100.00%    | 95%      |
| Critical  | Branches   | 880 / 901       | 97.67%     | 90%      |
| Remaining | Lines      | 2488 / 2498     | 99.60%     | 85%      |
| Remaining | Statements | 2503 / 2513     | 99.60%     | 85%      |
| Remaining | Functions  | 85 / 87         | 97.70%     | 85%      |
| Remaining | Branches   | 360 / 376       | 95.74%     | 80%      |

**Eleven negative probes** succeeded: every measure deficient in each group
(eight), plus missing membership for `app.js`, `ui/catalog.js` and explicitly
`ui/answer-sheet.js` (three). Each returned exit 1 as required. Original report
restored exactly in `finally`; successful baseline rerun. Report SHA-256:
`73e749d94f76e4d0d868802f4ce48660f0be7e23559bb0328625b00fd70eeab4`.

Measured production maxima remain **294 module lines / 60 function lines /
complexity 10 / nesting 3**, without exceptions. The complete sheet module
measures **87 / 44 / 4 / 1**, respectively. Evidence:
`.artifacts/phase-05-review-fixes-metrics.json`. No lint override was saved.

Iteration failures are retained, not hidden:

- The first full correction check stopped at JSDoc errors for possibly missing
  `.find()` fixtures in new tests. Explicit missing-fixture guards corrected
  the tests; the subsequent complete gate passed. Log:
  `.artifacts/phase-05-review-fixes-type-failure.log`.
- The first preservation audit used a nonrepository 76-column formatting
  option and correctly failed its byte-hash check. Removing that option and
  using repository-default JSON formatting reproduced all original hashes,
  proving the four-field scope. Log:
  `.artifacts/phase-05-review-fixes-preservation-format-failure.log`.

### Actual export evidence and limitations

Eight actual PDFs were decoded and verified, not merely their input HTML:
four new hostile-source fixed/generated exports (both languages), both
Geography 02 fixed exports and both existing edited fixed exports.
Each has six printed pages in the current Chromium setup, **all 28 complete
ordered question rows plus 28 complete cell/ID-mapped source entries**, and
pack/origin rights. `.artifacts/phase-05-review-fixes-pdf.log` records each file.

Final print-media screenshots were inspected for Czech fixed and English
generated sheets: readable main rows and appended references, explicit
cell/ID labels, retained credits and inert markup/URL text. Generated source
entries follow shuffled positions, not original fixed positions.
The four new real-export directories under `.artifacts/playwright/` are:

- `answer-sheet-P5-R3-cs-lett-deb7a-ay-inert-in-actual-HTML-PDF`
- `answer-sheet-P5-R3-cs-numb-e8e81-ay-inert-in-actual-HTML-PDF`
- `answer-sheet-P5-R3-en-lett-a51ff-ay-inert-in-actual-HTML-PDF`
- `answer-sheet-P5-R3-en-numb-9fc86-ay-inert-in-actual-HTML-PDF`

Each contains `sheet-pack.json`, `source-sheet.html`, `answer-sheet.pdf` and
`answer-sheet-print.png`. The existing catalog Geography directories retain
their `fixed.json`, `fixed-sheet.html`, PDF and screenshot, now with citations.
To reproduce, import a fixed pack with markup/URL-looking `sources` notes,
prepare/accept in either mode, download JSON and HTML, and Print / Save as PDF.
Compare each citation entry against the actual exported array position and ID.

The PDF decoder checks Chromium's emitted font maps, not every possible PDF
producer. Browser print-media screenshots are not physical print verification.
Physical Xbox/tablet, other engines, screen-reader devices, legal name clearance
and public deployment remain pending phase-8 gates. Source-access limitations
from the independent report remain disclosed; no factual reference changed.

### Re-review freeze

Before correction writes, the original manifest was copied to
`.artifacts/phase-05-before-review-fixes-snapshot.sha256`; its fingerprint remains
`bad7c69f3e7605cfc3156547b3e7a9ba519ec125946a63ef04cdde5a6110282f`.
The initial review text is also preserved at
`.artifacts/phase-05-initial-review.md`; the final report retains those exact
bytes as its prefix, with only the developer response appended.

After all code/test/documentation writes, the final response confirms generated
and verified identical `.artifacts/phase-05-review-fixes-snapshot.sha256` and
`.artifacts/phase-05-snapshot.sha256` manifests over all changed/new nonignored
deliverables. Preview 4182 is closed; no developer browser/preview remains.
Stop writing for same-reviewer re-review. No commit/push or self-clearance.
