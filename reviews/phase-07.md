# Phase 7 independent review

Final verdict: **CLEARED after correction**.
Initial verdict: **CHANGES REQUIRED**, one minor finding, preserved below.
Reviewer: `9027f5f9-bb72-48b3-88f6-1b1e85776bed`.
Developer: `d8821a19-f386-48dd-a766-aea84162159c`.
Baseline: `d717e2d45c0438a108528afdabdf2c0da245fb39`.
Full returned report: `.artifacts/phase-07-independent-report.md`.

All 26 changed/new deliverables and relevant integration reviewed; before/after
phase manifest SHA-256:
`50761eae1185726c6fc33e85db4251b97f191607eebd163be07f531aa24ece7f`.
Full 168-file name set and hashes verified, fingerprint
`936541a0700ab5aa0f6ffc92480cf6468776eeaccdf91f1c32d1b0e46f01ed21`.
All 24 previous packs / 672 entries independently byte-compared with baseline.
No implementation/content/test/config/tracked-document changes by reviewer.

## Finding

| ID    | Severity | Location                                               | Defect and smallest correction                                                                                                                                                                                                                                                                                                                |
| ----- | -------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P7-01 | Minor    | `src/content/arts-en-01.json:164–171`, `arts-en-01-16` | The question asks which author used the pen name, so Eric Arthur Blair correctly identifies him, but automatic play accepts only Orwell/George Orwell. Explicitly ask for the publishing surname, or accept Eric Arthur Blair/Eric Blair. Update ledger hash and focused actual-matching/export evidence; do not broaden the matching engine. |

Shipped George Orwell source identifies Eric Arthur Blair and both novels.
Independent cache `.artifacts/phase-07-independent/43e783d441ea043d.txt`,
lines 345/455, supports this. Real automatic fixed-board cell 16 rejects Blair
and awards Orwell. Evidence: `.artifacts/phase-07-independent-alias-repro.json`,
`phase-07-independent/arts-en-01-16-rejected-real-name.png` (visually inspected).
O placement does not excuse rejecting a correct author identification: aliases
may start with a different letter, as George Orwell already does.

## Acceptance and every-entry accounting

Final 36 packs / 1,008 entries / nine categories / 504 per language verified,
two fixed packs per category/language and exact 28-position alphabets. IDs,
old starters/defaults and prior 672 entries unchanged. All nine localized
categories, metadata-only search, hidden selections and accepted-board
immutability pass. All 36 catalog workflows, export/reimport, recovery and host
reset locks pass; no category-balancing rule introduced.

Every new prompt/canonical/alias, initial/category and supporting fact reviewed
individually. Eleven new packs have 28/28 passing entries; `arts-en-01` has
27 passing plus P7-01. Total 336 individually reviewed, 335 without a defect.
Prior 672 judgments inherited only after independent byte continuity.
All 1,008 question/answer/alias sets also read for semantic/reciprocal overlap;
no new substantive same-language duplicate found. Related concepts remain
distinct (error/exception, generator/yield, different works by the same creator,
writing versus porcupine quills); bilingual counterparts are separate pools.

Individual audit: `.artifacts/phase-07-independent/entry-audit.json`, SHA-256
`bd7314c6e9e405fb2322a26a7dd5fa9d763bee66b5961450c9143c474cd38664`.
All 336 IDs include full wording, alias judgments, fact-specific reasoning,
pack hashes, source/cache hashes and passage locators. Navigation hints were
not treated as proof. Independent source index:
`.artifacts/phase-07-independent/index.json`, SHA-256
`b9ae1c3365e3529e5c14124bab7d4f320c789797ad2277dbc93cb76ace916e22`.

## Six mandatory lenses

- **Correctness:** direct catalog/label expansion; authoritative generation
  still validates/deduplicates/shuffles selected single-language sources and
  takes 28, without balancing categories. Previous 168 browser cases retained;
  final 204 pass. Content schema/hash checks do not prove editorial correctness.
- **Usability/accessibility:** opened fresh Czech/English light/dark desktop/
  tablet catalog screenshots and actual rejection view. Readable wrapping,
  visible controls and no horizontal clipping. Sixteen additional real keyboard/
  filter/automatic-answer journeys covered all twelve new packs, useful aliases
  and scoped translation rejections. Blair rejection was defect reproduction,
  not successful product behavior. No browser errors. Auxiliary harness phase
  name corrected from answering to question without product edits.
- **Readability:** explicit 36-pack registration, reused helpers, no unnecessary
  abstraction/dependency. Independent maxima: module 294, function 60,
  complexity 10, nesting 3; no exceptions or persistent rule overrides.
- **OOP:** catalog data needs no class; pure filtering/generation stay separate
  from DOM/storage, listeners retain AbortSignal cleanup and game state remains
  authoritative/serializable.
- **Patterns:** direct imports/translations and shared transitions/export paths
  solve current requirements without factories/buses/speculative frameworks.
- **Content/rights/delivery:** all 233 new shipped URLs independently retrieved
  and actual substantive passages read, including official language/project
  references. Programming qualifications and cultural titles/roles/versions
  checked. Original prose, no lyrics/protected excerpts or quiz-bank copying
  identified. CC BY/source/origin rights preserved; no legal/name clearance.

Source checks included Python 3/assert/iteration, JavaScript semantics, C/C++
scope/lifetime, Unicode versus glyphs/UTF-8; original versus regional titles,
Disney producer versus distributor, Raskolnikov as former student, haiku sound
units, and the 2019 Pet Sematary adaptation. Two optional external lookups
returned 403 and were not used as evidence; no essential shipped claim blocked.

## Observed verification

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-07-independent-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-07-independent-browser.log 2>&1
git diff --check
```

All passed: format/lint/types, **285 tests / 19 files**, **204 Chromium journeys**
(6.7 minutes), build (86 modules), whitespace. No installs/skips/weakened tests.

| Scope               | Lines              | Statements         | Functions      | Branches         |
| ------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 files  | 2831/2842 (99.61%) | 2860/2871 (99.62%) | 211/211 (100%) | 880/901 (97.67%) |
| Remaining, 21 files | 2548/2558 (99.61%) | 2587/2597 (99.61%) | 85/87 (97.70%) | 360/376 (95.74%) |

All 47 runtime files included (app/workspace/domain/adapters critical,
main/messages/catalog/UI remaining). Only genuinely type-only domain/types
excluded from JS coverage; JSON is data. Thresholds remain 95/95/95/90 and
85/85/85/80. Eight negative metric/scope and two membership probes rejected
deficient reports; summary restored exactly to SHA-256
`3321543333f050072038e6d784b3715f2b1ecbdf2aa042449af7909520f766bb`.
Logs: `.artifacts/phase-07-independent-coverage-probes.log`.

## Actual visual and print evidence

Fresh actual catalog PNGs opened for both languages/themes and desktop/tablet,
plus Czech arts fixed and English full-library print-media views. PNGs are
HTML print-media screenshots, not PDF rasterizations.

Of 50 PDFs generated by the full suite, 28 are required new-phase outputs:
12 fixed, 12 individual-source numbers, four old/new/full mixes. Independently
decoded all 28 actual PDF byte streams/font maps against exported JSON:
784 ordered rows with correct IDs/initials/questions/answers/aliases, mapped
sources and authors/license/origins. Not merely HTML inspection/file counts.
Audit `.artifacts/phase-07-independent/pdf-audit.json`, SHA-256
`65750e5346bd8b03e767442174c9c48476c5e26c0a7067cd6a2b937d6ef9d93f`.
Sixteen-journey UI result SHA-256:
`e82f6f1e4ebf034be33beb2273a1ab379a69d53a83e8da1c163bbab23467172d`.
Inventory evidence: `phase-07-independent/inventory-continuity.json`.

## Next gate and limitations

P7-01 remains open. Same-developer correction and same-reviewer re-review must
precede coordinator post-review checks and delivery. Review browsers/preview
stopped; 4182 closed; live 4183/4184/admin/updater untouched. No hardware,
screen-reader, physical-print, legal/name or public-release clearance.
No exceptions or defect deferrals accepted.

## Developer response to P7-01 — 2026-10-29

**Correction implemented; same-reviewer re-review pending, not clearance.**
The initial report/findings above and the independent report/audit/source index
are preserved unchanged.

Changed only `arts-en-01-16.text` to:
“Under which surname did Eric Arthur Blair publish Animal Farm and Nineteen
Eighty-Four?” The question now requests the publishing surname rather than
the author's identity. Existing `Orwell` / `George Orwell` answers remain
appropriate; the disclosed real name is not an alias. Original O/cell-16
placement, ID, aliases and cited source are unchanged. The source introduction
and Writing section were reread and support the real name, pen name and novels.
No matching-engine or normalization change.

Before editing, all 36 pack files and the original manifest were preserved.
The other 35 files are byte-identical; the affected file differs only by that
single prompt replacement. Thus all other 335 new and all 672 prior entries
are unchanged. New arts-en-01 hash:
`4bdd57a7dadc6fc800b45382d8453bccc324100f87eb3da39d667b5a5dcd98ac`.
The source ledger now identifies these exact bytes and the correction.

The actual checker reproduced the original identity rejection; the new focused
regression failed on the old prompt and passed after the scope correction.
It covers the new wording, O placement, accepted surname/full pen name,
normalization and rejected disclosed real-name variants. Two added real-UI
journeys check fixed/number automatic play and actual JSON/HTML/PDF exports.

Focused checks: **70 tests / four browser flows passed**. Full sequential
gates: **286 tests / 206 browser journeys passed**, format/lint/types/build and
both coverage scopes pass with all 47 runtime sources. Ten negative probes
passed with byte-exact coverage restoration; production maxima remain
294/60/10/3. No skipped failing tests, weakened assertions or new exceptions.

Details, exact commands/fractions, continuity proof, inspected screenshots,
PDF row validation and new frozen manifests:
[P7-01 correction handoff](../docs/phase-07-handoff.md#p7-01-correction-handoff--2026-10-29).
Developer stopped writing. Return to the same reviewer; initial CHANGES REQUIRED
stands until independent re-review and coordinator post-review verification.

## Same-reviewer correction review — CLEARED

Reviewer `9027f5f9-bb72-48b3-88f6-1b1e85776bed` cleared P7-01 with no new
findings or exceptions. Full returned addendum:
`.artifacts/phase-07-rereview-report.md`. No reviewer source/test/docs edits.

All manifests verified before/after:

- 27 phase files: `6ff8c03e968f855ac753ea6320130e7e7acdf8d51956513864088fb86b1894a7`.
- 169 full files: `71919fc520869677d70f0c3b0b60e5ae75f3c875e1d1305afdf52f2457b2e350`.
- Developer canonical: `114f16c642b1300ccd3eec1426829b0e13ef3295f6473a29942066ea974f6118`.

Canonical manifests have identical path/hash mappings. Initial review prefix
preserved. Removing only added regression cases reproduces original test-file
hashes; no prior assertions removed or weakened.

Revised question explicitly asks: “Under which surname did Eric Arthur Blair
publish Animal Farm and Nineteen Eighty-Four?” Orwell and the expanded pen name
George Orwell fit; disclosed real-name forms do not. ID, O slot 16, aliases and
source unchanged. Fresh source reading supports names and novels; actual matcher
accepts canonical/alias/normalization and rejects Blair variants and Orwel typo.
No accepted-answer giveaway or matching-engine exception.

### Complete editorial continuity

All 36 pre-fix packs verified against original independent hashes: 35 files
identical, affected file differs only by one prompt string. Every original
new-entry audit compared with preserved full content; prior 24 packs again
byte-compared to baseline. Thus 335 other new judgments and 672 prior judgments
remain applicable; the one freshly reviewed correction passes.
Final **36 packs / 1,008 entries / nine categories / 504 per language** all
accounted for. Whole-library semantic duplicate review remains applicable.

Original audit/source-index/report hashes preserved. New pack hash:
`4bdd57a7dadc6fc800b45382d8453bccc324100f87eb3da39d667b5a5dcd98ac`.
Evidence `.artifacts/phase-07-rereview-continuity.json`;
editorial addendum SHA-256
`634eded2ca5285afe1e7441bf0bc93097368c0ceb2f504255c928fc1422ff2d8`.
Fresh source cache `.artifacts/phase-07-rereview/george-orwell.{html,txt}`.

### Six lenses and verification

All six lenses pass: precise scope and real-engine integration; actual keyboard
play/readable layout/answer concealment in visible text and accessibility;
proportionate one-string fix and focused tests; unchanged clear ownership and
pure matcher; reused helpers without special-casing; full inherited editorial
identity plus fresh source/provenance proof. No public/legal/hardware clearance.

Full sequential check/browser/diff passed: **286 tests / 19 files**, **206
Chromium journeys**, format/lint/types/build (86 modules). Exact coverage
fractions match the initial table above, all 47 runtime files included; ten
negative probes rejected deficient reports and restored bytes exactly.
Metrics remain 294/60 lines, complexity 10, nesting 3, no exceptions.

Independent fixed light/tablet and number dark/desktop flows tested source
selection/export/reimport, exact corrected prompt at fixed slot 16/shuffled
slot 15, three rejected real-name forms with concealed answers, then real awards
for Orwell/George Orwell. Two actual PDFs decoded against JSON/HTML: 56 ordered
rows, corrected prompt, all answers/aliases, mapped citations/rights/origins.
All four gameplay/print-media PNGs opened. PNGs are not PDF rasterizations.
No page errors. Full suite also produced 52 actual PDF outputs.

Evidence: `.artifacts/phase-07-rereview-{check,browser,coverage-probes,metrics,ui}.log`,
`phase-07-rereview-matching.json`, `phase-07-rereview/{letters,numbers}/`.
Own UI/PDF audit SHA-256:
`de0561ea2d47568de1a25e5737fc53e7814e6e7daa14f937ba558b345a4688db`.
All owned browsers/preview stopped, 4182 closed; live services untouched.

## Coordinator post-review verification

Full frozen hashes matched before/after sequential:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-07-post-review-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-07-post-review-browser.log 2>&1
git diff --check
```

Passed **286 tests**, **206 browser journeys**, format/lint/types/build and both
coverage groups with the same exact fractions as the independent review.
No implementation/content/test edits followed clearance; factual delivery docs
only. Commit/push and actual automatic-preview revision verification precede
phase 8. Physical-device, assistive-technology, legal/name and public-hosting
acceptance remain separate release gates.
