# Phase 5 independent review

Final verdict: **CLEARED after fixes**.
Initial verdict: **CHANGES REQUIRED**, preserved below. Reviewer:
`f9089207-b931-4419-b334-b0bb1f62771d`; developer:
`676ea2e9-a587-48f9-990f-7cdced8eca99`.
Baseline: `92659db1660856ade7c00b81952936f66d4c43e8`.
Frozen manifest: `.artifacts/phase-05-snapshot.sha256`, fingerprint
`bad7c69f3e7605cfc3156547b3e7a9ba519ec125946a63ef04cdde5a6110282f`.

All 28 changed/new deliverables, both unchanged starters and relevant generation,
answer-sheet, application, recovery, persistence and UI integration reviewed.
No implementation/test/content/config/documentation edits, installations,
delegation, commits, pushes or deployment changes by the reviewer.

## Findings

All four minor findings require correction before clearance.

| ID    | Severity | Location                                                         | Reproduction, impact and correction                                                                                                                                                                                                                                                                                                                                                                     |
| ----- | -------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P5-R1 | Minor    | `nature-cs-01-14`                                                | Asking what the **soužití** of a fungus and alga/cyanobacterium is called admits `lichenismus`, which the checker rejects, while accepting `Lišejník`. The cited Lišejník article distinguishes community from relationship. Ask unambiguously for the organism/community forming the thallus; preserve ID/placement and add a focused regression.                                                      |
| P5-R2 | Minor    | `general-cs-02-08`, `general-en-02-24`                           | The English-loanword question accepts native Czech `branka`, already inflected in its prompt; the brand-name question accepts generic `hook-and-loop fastener` variants. Actual checker acceptance reproduced; Gól and Velcro citations support the distinction. Remove scope-incompatible aliases or coherently rewrite without giveaways. Test canonical acceptance and incompatible-alias rejection. |
| P5-R3 | Minor    | `src/ui/answer-sheet.js`, `answerSheet()` / `sheetAttribution()` | Exported sheets omit all factual source citations, despite retaining answers/aliases and authors/license/origins. Both Geography 02 HTML/PDF sheets omit sources for 28/28 rows; JSON retains them. Add a safely escaped source appendix mapped to cells/question IDs, preserving numbering, rights and readable printing. Verify fixed/generated HTML/PDF exports and hostile imported source text.    |
| P5-R4 | Minor    | `geography-cs-01-19`                                             | “Kolínem nad Rýnem” gives away canonical `Rýn` in declined form; exact-string checks miss it. Use a clue such as “Kolínem v Německu”; preserve ID/placement and add a focused regression, without generalized stemming machinery.                                                                                                                                                                       |

Checker reproductions: `.artifacts/phase-05-independent-content-findings.json`.

## Acceptance accounting

Approved inventory, category/language quotas, IDs and fixed alphabets pass:
12 packs / 336 entries, with ten new packs / 280 entries and unchanged starters.
Every entry was reviewed; findings above remain. Every pack works fixed and as
a selected number source, drawing 28 unique eligible questions. Metadata-only
catalog search/category/language/origin filters preserve selections and accepted
content, with explicit hidden selections and original starter-only defaults.

Real JSON export/reimport, rejected-import preservation, immutable recovery and
host-reset locks passed. Source/license/origins survive JSON; HTML/PDF factual
sources need P5-R3. Both-language/theme desktop/tablet presentation, keyboard,
caret/focus and hostile-content interactions were independently exercised.
Inventory/source ledger/contracts/handoff and phase scope reviewed; no later
categories or release claim.

## All-entry editorial accounting

Individual independent record:
`.artifacts/phase-05-independent-editorial.json`, SHA-256
`6a5f8bd0a66a24b40ee41a85f15a2d35ff35eded42f89fd5dca4064d5434529e`.
It records 336 unique question IDs, pack hashes, positions, initials, aliases,
individual judgments, citations/access evidence and finding references.

| Pack              | Reviewed | Individual findings                                    |
| ----------------- | -------- | ------------------------------------------------------ |
| `general-cs-01`   | 28/28    | None                                                   |
| `general-cs-02`   | 28/28    | `-08`: P5-R2                                           |
| `general-en-01`   | 28/28    | None                                                   |
| `general-en-02`   | 28/28    | `-24`: P5-R2                                           |
| `nature-cs-01`    | 28/28    | `-14`: P5-R1                                           |
| `nature-cs-02`    | 28/28    | None                                                   |
| `nature-en-01`    | 28/28    | None                                                   |
| `nature-en-02`    | 28/28    | None                                                   |
| `geography-cs-01` | 28/28    | `-19`: P5-R4                                           |
| `geography-cs-02` | 28/28    | None                                                   |
| `geography-en-01` | 28/28    | None                                                   |
| `geography-en-02` | 28/28    | None                                                   |
| Total             | 336/336  | Four affected entries; 332 without individual findings |

P5-R3 is shared export behavior, separate from entry judgments. Review covered
factual scope/supporting passages, natural wording, ambiguity, all aliases,
category, initials, placement, giveaways, duplicate/reciprocal facts and
original wording. No additional factual or same-language reciprocal-duplicate
defect identified; sampling/HTTP success/token matches were not clearance.

### Source evidence and access limitations

Independently requested 339 distinct shipped URLs; 337 yielded nonempty article
bodies. Relevant passages and follow-up sections were examined. UNESCO returned
403 via curl, but its actual Brief synthesis was independently retrieved and
supports Žďár nad Sázavou. BCcampus remained inaccessible (403); the existing
Basalt reference independently supports the starter's ridge-lava fact.

Supplementary Greeley Philharmonic, Pacific Ocean boundaries and Nairobi
National Park checks supported the questions. Official KWS was unavailable;
the park article corroborated location. No essential claim remained blocked
solely by access failure. Evidence: `.artifacts/phase-05-independent-sources/`.
No substantial copied prose identified; this is not legal/name clearance.

## Six review lenses

- **Correctness:** catalog/domain selection invariants, generation, import
  rejection, immutable recovery/reset and prior gameplay regressions hold.
  Recovery privately owns permission and distinguishes failed/empty reads.
  Content and sheet findings prevent completeness.
- **Usability/accessibility:** native labeled filters, focus and explicit hidden
  selections work; mid-string edits preserve caret. Tablet layouts have no
  horizontal overflow/page errors. Measured relevant text contrast ≥7.41:1,
  boundaries ≥3.88:1, focus ≥7.81:1. Not hardware/assistive certification.
- **Readability:** cohesive traceable changes and behavior tests; pure metadata
  filtering does not search answers. No broad catch, silent fallback, material
  dead code or unexplained metric exception identified.
- **OOP:** Preparation appropriately owns transient filters/content selection;
  recovery owns write safety. DOM/pure rules remain separate; delegated
  listeners have lifecycle cleanup. No new god object/inheritance.
- **Patterns:** native controls, pure filtering and delegated events solve
  present requirements without speculative frameworks/services/dependencies.
  UI does not duplicate generation rules.
- **Content/rights/delivery:** all 336 entries reviewed with auditable provenance;
  source appendix missing from standalone sheets. Public deployment and naming
  remain later gates, not inferred from build success.

## Independent verification

Sequential commands:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-05-independent-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-05-independent-browser.log 2>&1
git diff --check
```

All passed: formatting, lint/metrics, JSDoc types, production build,
**209 tests / 17 files**, **139 Chromium journeys**, including 30 catalog flows.

| Group                 | Lines              | Statements         | Functions      | Branches         |
| --------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 modules  | 2831/2842 (99.61%) | 2860/2871 (99.62%) | 211/211 (100%) | 880/901 (97.67%) |
| Remaining, 21 modules | 2474/2484 (99.60%) | 2489/2499 (99.60%) | 84/86 (97.67%) | 357/373 (95.71%) |

All 47 executable modules included, including new `ui/catalog.js`. Sole source
exclusion: type-only `domain/types.js`. Eight deficient-measure and two missing-
module probes failed as required; coverage restored byte-for-byte. Thresholds
unchanged at 95/95/95/90 and 85/85/85/80; browser passes are not statement coverage.
Measured maxima: module 294, function 60 lines, complexity 10, nesting 3.
No exceptions.

Both languages/themes and desktop/tablet screenshots/print views inspected.
Independent interactions confirmed caret/keyboard behavior, inert hostile
imports, inherited-property categories and unchanged accepted boards. Actual
fixed/generated/recovered JSON and HTML inspected. Actual Czech/English
Geography 02 PDFs independently decoded: three pages each, all 28 ordered rows
with numbers, IDs, initials, questions, answers and aliases verified (only
whitespace/font ligatures normalized).

Evidence: `.artifacts/phase-05-independent-ui-results.json`,
`.artifacts/phase-05-independent-pdf.log`, `.artifacts/playwright/`.

## Handoff

P5-R1–R4 remain open. Same-developer fixes, updated affected source hashes/tests,
new frozen snapshot and same-reviewer re-review are required. Coordinator
post-review gates must pass before commit/push and phase 6.

All 28 snapshot hashes, both starters and manifest fingerprint unchanged;
coordinator also verified its full frozen snapshot. Reviewer-owned browsers
and previews stopped; port 4182 closed. Physical Xbox/tablet, other browser
engines, screen-reader devices, name/legal clearance and public deployment
remain phase-8 gates. No exceptions accepted.

## Developer response — P5-R1–R4 corrections

Submitted for the same reviewer's re-review; **NOT CLEARED**. The initial
findings, all-entry accounting and verdict above remain authoritative history.
The complete correction handoff is
[docs/phase-05-handoff.md](../docs/phase-05-handoff.md#review-corrections).

- **P5-R1:** the lichen clue now asks for the thallus-forming community, not
  the relationship. Actual checker accepts `Lišejník`, rejects `lichenismus`.
- **P5-R2:** removed `branka` from the loanword question and both generic
  hook-and-loop aliases from the brand-name question. Canonical answers accept;
  all incompatible alternatives reject in focused checker regressions.
- **P5-R4:** replaced the declined Rhine giveaway with “Kolínem v Německu”.
  `Rýn`/`Rhein` still accept; no stemming machinery or normalization changes.
- **P5-R3:** standalone sheets now append escaped plain-text citations/notes,
  mapped to each exact cell number and stable question ID. Both languages,
  fixed/generated ordering, hostile imported text and preserved rights are
  checked in actual HTML and decoded PDFs. The original 28-row requirement
  remains, with all questions, answers, aliases and attribution retained.

Original independently reviewed pack hashes were reproduced before comparing
the corrected data: exactly four fields across four entries changed; all
other 332 full entries, IDs, positions, metadata, references and starter bytes
remain unchanged. The source ledger contains the four updated pack hashes.
Original independent editorial JSON still hashes to
`6a5f8bd0a66a24b40ee41a85f15a2d35ff35eded42f89fd5dca4064d5434529e`.

Verification: 43 focused unit/DOM tests, 39 focused browser journeys, then the
complete sequential gate: **215 tests / 18 files**, **143 Chromium journeys
(4.7m)**, formatting/lint/types/build and `git diff --check` pass.
All 47 runtime modules remain included (26 critical, 21 remaining); no threshold
or exclusion changes. Critical coverage: 2831/2842 lines, 2860/2871 statements,
211/211 functions, 880/901 branches. Remaining: 2488/2498, 2503/2513, 85/87,
360/376 respectively. Eleven deficient-measure/missing-membership probes pass;
coverage restored exactly. Metrics remain within 300/60/10/3, without exceptions.

Eight actual six-page PDFs preserve every complete ordered question row and
every mapped source entry plus rights. Final screenshots and export paths,
exact commands/denominators and the corrected initial test-type/audit-format
failures are detailed in the handoff; logs use `.artifacts/phase-05-review-fixes-*`.

Original frozen manifest retained at
`.artifacts/phase-05-before-review-fixes-snapshot.sha256`.
Corrected manifests are generated after all writing at
`.artifacts/phase-05-review-fixes-snapshot.sha256` and
`.artifacts/phase-05-snapshot.sha256`. Preview 4182 is closed.
No delegation, dependency installation, commit/push or deployment.
Ready for the same independent reviewer; hardware/release limitations remain.

## Final independent re-review — CLEARED

Same reviewer `f9089207-b931-4419-b334-b0bb1f62771d` cleared P5-R1–R4.
No new mandatory findings or accepted exceptions. Reviewed all corrections and
integration in the 34-file snapshot. Both manifests verified before/after:

- Corrected/canonical manifest fingerprint:
  `aa96f65c3d8718a6d25a94c0db48aec15fee47ea26cbb2806b264c1d22f6cbda`.
- Coordinator full-manifest fingerprint:
  `ab894609aaeecae658ea851c1196239c95bdaad1fbe39b6b9372bd2f161f6224`.

| Finding | Independent outcome                                                                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P5-R1   | Resolved: natural Czech explicitly asks for the community forming a shared thallus. Source and checker support Lišejník, not lichenismus.                   |
| P5-R2   | Resolved: canonical answers accepted; branka and both generic hook-and-loop alternatives rejected in the narrowly scoped questions.                         |
| P5-R3   | Resolved: localized escaped plain-text sources map exactly to cells/IDs in actual HTML/PDF, preserving rows, authors, licenses and applicable origin cells. |
| P5-R4   | Resolved: “Kolínem v Německu” removes the giveaway; remaining clues accurate and Rýn/Rhein accepted.                                                        |

### All-entry continuity and source evidence

Original 336-entry independent evidence retains SHA-256
`6a5f8bd0a66a24b40ee41a85f15a2d35ff35eded42f89fd5dca4064d5434529e`.
The reviewer independently reversed only the four permitted fields using its
preserved originals and reproduced all twelve original pack hashes. Therefore
332 previously reviewed entries and all other metadata/citations/placement
remain unchanged; the four corrected entries were directly rechecked.
Each pack still accounts for 28/28 entries. Corrected ledger hashes and every
question's source mapping verified.

Re-review accounting: `.artifacts/phase-05-rereview-editorial.json`, SHA-256
`e2a7aeacf9be8495c39a47c75f8839bc5743268f126c9c5ba87335fbaed81958`.
Relevant independently retrieved passages re-examined. Initial substantive
source review and disclosed UNESCO/BCcampus access limitations remain applicable;
no essential claim blocked and no new legal/name clearance claim.

### Six lenses and verification

All six lenses pass for phase 5. Correctness: exact inventory and every-entry
accounting, selected-source generation, imports, recovery/reset locks and
source-preserving sheets verified. Usability: fresh Czech dark tablet/English
light desktop and print screenshots inspected, readable cell/source references,
no overflow and separate-page appendix. Readability: small concrete exporter
addition, unchanged prior assertions plus actual PDF-byte checks, no broad
catches/dependencies/metric exceptions. OOP: exporter stays a pure projection;
preparation/recovery responsibilities unchanged. Patterns: direct source
rendering and test-only Chromium PDF decoder without a framework or claim of
universal PDF support. Content/rights: all 336 entries and actual exported
rights/origins verified; no future-category or release claim.

Independent full sequential checks:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-05-rereview-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-05-rereview-browser.log 2>&1
git diff --check
```

Passed: **215 tests / 18 files**, **143 Chromium journeys**, formatting,
lint/metrics, types, build and whitespace. Additional coverage/editorial/export
probes recorded in `.artifacts/phase-05-rereview-{coverage-probes,editorial,exports}.log`.

| Group                 | Lines              | Statements         | Functions      | Branches         |
| --------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 modules  | 2831/2842 (99.61%) | 2860/2871 (99.62%) | 211/211 (100%) | 880/901 (97.67%) |
| Remaining, 21 modules | 2488/2498 (99.60%) | 2503/2513 (99.60%) | 85/87 (97.70%) | 360/376 (95.74%) |

All 47 executable sources included; sole exclusion remains type-only
`domain/types.js`. Eleven negative threshold/membership probes rejected deficient
reports; coverage restored byte-for-byte. Thresholds unchanged. Independent
zero-limit metric diagnostics: global 294/60/10/3, sheet module 87/44/4/1;
no saved overrides or exceptions.

### Actual export evidence

Ten export sets inspected: four hostile-source fixed/generated, two Geography
fixed, two edited fixed and two independently printed mixed-source generated.
Each actual PDF has six pages. Independent decoding verified all 28 complete
ordered question rows and exact 28 cell/ID/source associations plus rights and
origin attribution. No executable elements/links, subresource requests, dialogs,
page errors, PDF URI/JavaScript/launch actions or source horizontal overflow.
Shuffled generated mappings and main-table numbering preserved.

Evidence: `.artifacts/phase-05-rereview-exports.json`, its log/screenshots and
independently generated mixed-source PDFs. Screenshots are print-media views,
not physical-print certification. Both starters/dependencies/policies unchanged.
Reviewer made no source/docs edits and stopped all owned browsers/previews;
port 4182 closed.

## Coordinator post-review verification

Full frozen hashes verified before and after:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-05-post-review-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-05-post-review-browser.log 2>&1
git diff --check
```

All passed: **215 tests / 18 files**, **143 Chromium journeys**, formatting,
lint/types/build and both coverage gates. Coordinator measured exactly the
fractions in the final reviewer table above, with all 47 sources included.
No implementation/content/test changes followed clearance; only factual
delivery documentation. Commit/push and remote verification precede new work.

Physical Xbox/tablet, other browser engines, screen-reader devices and final
name/public-release clearance remain pending. The user subsequently requested
an earlier private Tailscale preview; that operational change is separate from
this reviewed content snapshot and does not constitute phase-8 release.
