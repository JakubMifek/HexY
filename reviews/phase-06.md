# Phase 6 independent review

Final verdict: **CLEARED after fixes**.
Initial verdict: **CHANGES REQUIRED**, preserved below. Original reviewer:
`87f51b18-97a7-424f-bd5e-e42a3b9cc3a0`; developer:
`d00e159d-1e1c-4b3d-924d-862d2649e719`.
Baseline: `5efcd7445202c67104d35d61e095f2bc5b8cb77a`.
No implementation/content/test/config/tracked-document edits by reviewer.

All 25 changed deliverables (including 14 untracked files), relevant integration,
336 new entries and prior content continuity reviewed. Before/after manifests:

- Phase: `f247651a5c96fea880b084d0f2bcc457bb05d7e1cd27bca3e291c68bcb8a4fbe`.
- Full: `652dd6163a6b355f256935c8a2c78ed9252e12cd0acd95b93b6bd88013a32340`.

Final integrity: 25/25 phase files, 153/153 full files and 12/12 prior packs
unchanged. Coordinator also verified the full freeze before recording this report.

## Findings

All four are minor, mandatory editorial corrections under `REVIEW.md`.

| ID    | Severity | Entry               | Defect and smallest correction                                                                                                                                                                                                                                                        |
| ----- | -------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P6-R1 | Minor    | `politics-cs-02-06` | Clue discloses alias `výkonná moc` through “výkonnou … moci”; real automatic play awards it. Remove the disclosed alias or rewrite. Verify Exekutiva remains accepted with a focused regression.                                                                                      |
| P6-R2 | Minor    | `history-en-01-23`  | Clue explicitly asks for an English term but accepts German `Unterseeboot`. Source distinguishes English U-boat from the German source word. Remove the out-of-scope alias, preserving U-boat/U boat, or deliberately revise scope and re-review.                                     |
| P6-R3 | Minor    | `politics-en-02-14` | “What parliamentary proposal tests whether a government still has the support needed to remain in office?” equally permits motion of confidence, rejected in real play. Narrow to a proposal declaring the government no longer supported/fit to remain; verify all retained aliases. |
| P6-R4 | Minor    | `history-cs-01-26`  | Standard Czech `Vestfálský mír` is rejected; canonical Westfálský mír has no alias. Accept the V spelling and provide credible Czech-language support for retained W canonical, or replace the W entry. Aliases need not share canonical initial.                                     |

These are real incorrect-answer/giveaway effects, not wording preferences.
For P6-R3, rejected Motion of confidence leaves the field unclaimed/question
active; both inverse proposals fit the original clue and M initial.
P6-R4 does not assert every historical W form is invalid: source support and
acceptance of standard modern spelling are required.

Reproductions: `.artifacts/phase-06-independent-ui.mjs`,
`phase-06-independent-ui.json`, associated screenshots/log.

## Acceptance and every-entry accounting

Verified exact new bundle: History, Politics/diplomacy, Science/technology,
12 packs / 336 entries; total 24 packs / 672 entries, six categories with two
packs per language. Prior 12 packs / 336 entries are byte-identical to baseline.
Domain alphabets, digraph positions, all fixed placements/IDs preserved.
Source ledger maps all 672 IDs with hashes/locations. All new entries individually
reviewed, but the four findings block content clearance.

| New pack         | Individually reviewed | Findings |
| ---------------- | --------------------- | -------- |
| `history-cs-01`  | 28/28                 | P6-R4    |
| `history-cs-02`  | 28/28                 | None     |
| `history-en-01`  | 28/28                 | P6-R2    |
| `history-en-02`  | 28/28                 | None     |
| `politics-cs-01` | 28/28                 | None     |
| `politics-cs-02` | 28/28                 | P6-R1    |
| `politics-en-01` | 28/28                 | None     |
| `politics-en-02` | 28/28                 | P6-R3    |
| `science-cs-01`  | 28/28                 | None     |
| `science-cs-02`  | 28/28                 | None     |
| `science-en-01`  | 28/28                 | None     |
| `science-en-02`  | 28/28                 | None     |

Individual audit: `.artifacts/phase-06-independent-editorial-audit.json`;
SHA-256 `0b34153e6d4a4c5ba562fba30d18e6bb544a36baff3b854cfbaae3114d6360f0`.
Records each of 336 IDs, prompt/canonical/all aliases, individual judgments,
pack/source-cache hashes and passage locators, plus prior 336 IDs/continuity.
332 new entries had no observed defect. All 672 prompts/canonicals/aliases read
for semantic overlap; no additional substantive reciprocal duplicates found.

Historical/scientific scope individually checked: traditional versus documented
narratives, dates/titles, ideal gases, units, reaction versus electrode polarity.
Politics stability/date qualifiers checked, including the 2014 EU rule.
All 284 unique shipped new-source URLs independently retrieved; actual passages,
not HTTP status/keywords, supported review.

Catalog native labels/filtering/defaults and explicit selection pass in both
languages. All 24 packs work fixed and as selected-only number sources through
export/reimport, recovery and host-reset locking. Twelve new fixed plus two
mixed-source actual PDFs/HTML preserve 28 rows, answers/aliases, rights and
mapped citations. Mixed Geography/History/Politics/Science journeys preserve
exact selected origins. No phase-7 content/dependencies/schema/gameplay/storage
or deployment changes.

## Six mandatory lenses

- Correctness: catalog/export/recovery integration passes; prior timing,
  stale-input, host corrections and lifecycle regressions retained. Four content
  findings block completeness.
- Usability/accessibility: fresh Czech/English light desktop/dark portrait tablet
  screenshots and real keyboard/selection/recovery/preparation inspected.
  Labels/focus/wrapping readable, no clipping. Four findings reproduced in UI;
  no physical-device/assistive certification.
- Readability: direct imports/localized metadata; prior assertions retained and
  number export/reimport strengthened. No unnecessary wrappers, silent fallback
  or metric exception.
- OOP: Preparation owns selection/proposal/lock state; filtering/generation
  remain pure and game state authoritative. Existing resource cleanup unchanged;
  no artificial classes needed.
- Patterns: no new framework/bus/service locator; existing transitions/concrete
  adapters and shared generation/export prevent catalog-specific divergence.
- Content/rights/delivery: all new entries reviewed substantively, no observed
  fabricated citation or copied bank wording; attribution/CC BY 4.0 survives
  actual exports. No trademark/legal-ownership/public-release clearance.

## Observed verification

Sequentially:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-06-independent-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-06-independent-browser.log 2>&1
git diff --check
```

All passed: format/lint/types, **265 tests / 19 files**, **161 Chromium journeys**
(prior 143 plus 18), production build (74 modules), final whitespace check.
Ten negative scope/membership probes rejected altered reports; restored report
matches SHA-256 `064b16887ed8cb3d160b6fea0c8844e4b61eaa40fb89f2e6bfb4036a8e3d8e5e`.

| Scope               | Lines              | Statements         | Functions      | Branches         |
| ------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 files  | 2831/2842 (99.61%) | 2860/2871 (99.62%) | 211/211 (100%) | 880/901 (97.67%) |
| Remaining, 21 files | 2518/2528 (99.60%) | 2545/2555 (99.61%) | 85/87 (97.70%) | 360/376 (95.74%) |

All 47 runtime modules included: app/workspace, executable domain and runtime
adapters critical; main/messages/catalog/UI remaining. Sole runtime-source
exclusion is genuinely type-only domain/types; JSON is data. Thresholds
unchanged. No browser-as-statement-coverage claim.
Independent maxima: module 294 (app), function 60 (editorView), complexity 10
(restoreFocus), nesting 3 (generation). No exceptions required or accepted.

## Sources and print evidence

Independent corpus: `.artifacts/phase-06-independent-research/index.json`.
All 284 shipped new unique URLs returned 200; substantive passages examined.
Official Czech Constitution decoded Windows-1250, Articles 15/16/27/53 checked.
UN treaty glossary/Vienna Convention Articles 4/14, National Archives Domesday,
NIST base units, RSC zirconium/cladding and Josephson DC/AC scope inspected.
Supplementary Council/UK Parliament requests returned 403; accessible shipped
references supported claims. These failures are not reported as successes.
Prior BCcampus access limitation unchanged.

Independently checked 14 actual new fixed/mixed PDFs with `verifyPrintedSheet`:
392 complete ordered rows, aliases, mapped citations/rights, recovery equality
and selected-only origins. Evidence:
`.artifacts/phase-06-independent-pdf-audit.json`, fresh
`.artifacts/playwright/phase-six-*/phase-six-catalog.png`, and both mixed
`phase-six-phase-six-{cs,en}-old-*` directories. Mixed print-layout PNGs are
HTML print-media screenshots, not PDF rasterizations; actual bytes separately
decoded with the inspected Chromium-specific helper.

## Next gate

P6-R1–R4 remain open. Same developer fixes, same reviewer rechecks frozen
correction, then coordinator runs mandatory post-review gates before commit/
push. No owned browser/preview left; 4182 closed. Live 4183/4184, admin 8443,
Docker/updater/Tailscale and shared configuration untouched. Phase 7 and final
physical-device/public-release/legal gates remain outside this review.

## Developer response — P6-R1–R4 correction candidate

The initial verdict, findings, every-entry accounting and evidence above are
preserved. These are developer corrections, **not an independent resolution or
phase clearance**; the same reviewer must recheck the frozen candidate.

| Finding | Developer correction                                                                                                                                                                                                                                                                          |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P6-R1   | Removed `výkonná moc` from `politics-cs-02-06`. The canonical-focused clue remains; Exekutiva is accepted, the inflected giveaway is not.                                                                                                                                                     |
| P6-R2   | Removed German `Unterseeboot` from the English-term clue `history-en-01-23`. U-boat and U boat remain accepted.                                                                                                                                                                               |
| P6-R3   | `politics-en-02-14` now explicitly asks for a motion declaring that the government no longer has the legislature's support to remain in office. Retains Motion of no confidence / no-confidence motion; removes vote of no confidence because a vote is distinct from the requested proposal. |
| P6-R4   | Used the permitted single-entry replacement: `history-cs-01-26` is now Washington, alias George Washington, asking who became the first US president in 1789. Stable ID, W position and History category remain. No unsupported Czech W spelling or normalization exception remains.          |

Two bounded searches did not locate defensible Czech W-form support for the old
peace-treaty answer; this does not assert that every historical W form is invalid.
Rather than preserve an unsupported canonical spelling, the replacement uses
the natural Czech-attested surname Washington. The new
[Czech reference](https://cs.wikipedia.org/wiki/George_Washington) was retrieved:
its introduction identifies the first US president and its infobox dates the
term from 30 April 1789. The retrieved
[US National Archives account](https://www.archives.gov/milestone-documents/president-george-washingtons-first-inaugural-speech)
describes the first inauguration and oath on that date. These support the actual
question, canonical surname and full-name alias.

For P6-R2 the retrieved U-boat introduction distinguishes the English term and
German source word. For P6-R3 the retrieved Motion of no confidence introduction
explicitly distinguishes the motion, its vote and the positive inverse.
Current per-entry citations/locations and all four affected pack hashes are in
`docs/content-sources.md`. The corrected new packs contain 285 distinct source
URLs; original source-audit accounting above remains historical evidence.

Preserved original snapshot and all 24 pre-correction packs:
`.artifacts/phase-06-before-review-fixes/`. Comparison proves exactly these four
entries changed; **332 other new entries and all 336 old entries are unchanged**.
The twelve prior packs are byte-identical. Metadata, IDs, alphabets and placement
are unchanged. Evidence: `.artifacts/phase-06-review-fixes-continuity.json`.
The original independent editorial-audit SHA-256 remains
`0b34153e6d4a4c5ba562fba30d18e6bb544a36baff3b854cfbaae3114d6360f0`.

Four focused actual-answer-checker regressions were first run against original
data: all four failed as intended. After correction, the content/catalog suite
passes **53 tests**. Seven isolated real-UI automatic-play cases cover every
corrected canonical and retained alias, and verify that rejected answers leave
the field unclaimed/question active before a correct answer awards it. Those
seven focused browser cases pass with a deterministic clock; no game engine is
mocked. Full correction-gate results and the final freeze are recorded below
and in the developer handoff before requesting re-review.

### Developer correction verification and freeze

Sequential full correction gates pass: format/lint/types, **269 tests / 19
files**, coverage gates and production build; **168 Chromium journeys**
(all prior 161 plus seven new automatic-answer cases); `git diff --check`.
Logs: `.artifacts/phase-06-review-fixes-check.log` and
`.artifacts/phase-06-review-fixes-browser.log`.

All 47 runtime files remain included with the original 26/21 group membership.
Coverage is unchanged: critical 2831/2842 lines, 2860/2871 statements, 211/211
functions, 880/901 branches; remaining 2518/2528, 2545/2555, 85/87, 360/376.
Ten negative probes pass; restored coverage report SHA-256 remains
`064b16887ed8cb3d160b6fea0c8844e4b61eaa40fb89f2e6bfb4036a8e3d8e5e`.
Measured production maxima remain 294/60 lines, complexity 10, nesting 3.
No threshold, membership or rule exception was introduced.

The four affected actual fixed JSON/PDF exports were inspected again, including
the new Washington references. Per-finding real-UI award screenshots were
visually inspected. The full suite retains all pack roundtrips, source-preserving
HTML/PDF, mixed-source and recovery/lock checks. No physical-device claim.
Owned 4182 preview is closed; live 4183/4184 and admin 8443 remain untouched.

**FROZEN FOR SAME-REVIEWER RE-REVIEW; NOT CLEARED.** Manifests:
`.artifacts/phase-06-review-fixes-snapshot.sha256` and
`.artifacts/phase-06-snapshot.sha256`, created after final writes and including
this complete report. Original manifest and all 24 pre-correction packs remain
in `.artifacts/phase-06-before-review-fixes/`. Original phase-manifest hash:
`f247651a5c96fea880b084d0f2bcc457bb05d7e1cd27bca3e291c68bcb8a4fbe`.
Full reproduction/failure history/source rationale:
`docs/phase-06-handoff.md`. No commit/push/deployment; reviewer resolution and
coordinator post-review verification remain required.

## Independent correction re-review — CLEARED

Replacement reviewer `e6325ff0-1dc8-420c-89e6-02a256df2bcf` was used because
the original reviewer/developer sessions were no longer available. No code,
content, tests, configuration or tracked documentation edits by the reviewer.
P6-R1–R4 resolved; no remaining findings or accepted exceptions.

Verified before/after: 26/26 phase files, fingerprint
`1aa8b97c8e84ee8da6a315bf4921febaf34848672d7e4dad7d2790aadb209be6`;
154/154 full files, fingerprint
`34901d04ca85865c7a2d33ced29e9f857eae841e569dd908791d9febab7e6076`.
Original independent audit retains SHA-256
`0b34153e6d4a4c5ba562fba30d18e6bb544a36baff3b854cfbaae3114d6360f0`;
original report and ledger history remain unchanged prefixes.

| Finding | Fresh independent resolution                                                                                                                                                                                                |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P6-R1   | Exekutiva awards the field; disclosed výkonná moc and diacritic-free variant rejected.                                                                                                                                      |
| P6-R2   | Source distinguishes English U-boat/U boat from German Unterseeboot; English forms accepted, German rejected.                                                                                                               |
| P6-R3   | Revised clue explicitly declares lost legislative support. Retained motion names fit; positive motion and distinct vote correctly excluded.                                                                                 |
| P6-R4   | Natural Czech Washington/George Washington replacement supported by fresh Czech reference and US National Archives first-inauguration evidence, 30 April 1789. Stable W position, no new giveaway or substantive duplicate. |

### Editorial continuity and acceptance

All 336 new entries accounted for: 332 preserve individually documented
independent judgments with exact question, pack-context and source identity;
four freshly reviewed. All 284 original source-cache hashes/passages/mappings
verified against the preserved audit. Previous twelve packs/336 entries remain
byte-identical. Ledger maps all 672 entries/current hashes, with 285 distinct
new-pack source URLs. Washingtonská smlouva is NATO's 1949 treaty, not a
duplicate presidential fact.

Accounting: `.artifacts/phase-06-rereview-accounting.json`, SHA-256
`596e2a9f74b7af686f2549fc5fe2924e941db4e572bfe15056c7cce1e6a5ee9c`.
Exact 24-pack inventory, categories/languages/alphabets/placement, all-pack
fixed/number workflows, imports, recovery and host-reset locks pass.
No phase-7, engine, normalization, dependency or deployment changes.

### Verification and six lenses

Full sequential check and documented Chromium suite passed: **269 tests /
19 files**, **168 journeys**, formatting/lint/types/coverage/build/whitespace.
Focused content/catalog: 53 passed. Four original-failing/current-passing
predicates checked actual answers; independent real-engine UI probe passed
7/7 canonical/alias cases with keyboard submission, normalization variants
and accessibility-tree answer-concealment checks. Ten negative scope/membership
probes rejected deficient reports and restored bytes exactly.

Exact coverage remains the initial table above, including all 47 runtime modules
(26 critical, 21 remaining); only type-only domain/types excluded. Thresholds
unchanged. Metrics 294 module lines, 60 function lines, complexity 10, nesting 3;
no exceptions. Continuity-script ledger/link parsing needed correction during
review, not product changes.

All six lenses clear: content/integration correctness and existing lifecycle
regressions; real keyboard/answer concealment/localized layout usability;
direct readable imports and focused tests; clear Preparation ownership with
pure authoritative domain rules; reused generation/validation/export without
speculative abstractions; full editorial/provenance continuity in actual exports.
No legal/public-release clearance inferred.

Independent decoding of 14 fresh actual PDFs verified 392 ordered rows,
answers/aliases, mapped sources, attribution and recovery equality, including
all four corrected packs and Washington references. Actual JSON/HTML checked.
Czech/English light desktop/dark tablet screenshots show readable wrapping,
focus and phase feedback without clipping. Print PNGs are HTML print-media
views; actual PDF bytes separately checked.

Evidence: `.artifacts/phase-06-rereview-{check,browser,coverage-probes}.log`,
`phase-06-rereview-{pdf-audit,ui}.json`, `phase-06-rereview-P6-R*-{question,awarded}.png`,
`phase-06-rereview-washington-{cs,archives}.html`, and fresh Playwright artifacts.
Original supplementary-source 403s/BCcampus limitation remain disclosed;
fresh correction-source requests succeeded.

Owned browsers stopped and 4182 closed; live 4183/4184/admin/shared settings
untouched. Physical Xbox/tablet/assistive certification, naming/legal and final
public-release gates remain phase 8.

## Coordinator post-review verification

Full frozen hashes matched before/after sequential:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-06-post-review-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-06-post-review-browser.log 2>&1
git diff --check
```

All passed: **269 tests**, **168 browser journeys**, format/lint/types/build
and both coverage groups. Actual fractions exactly match the reviewed table;
all 47 runtime files included. No implementation/content/test edits after
clearance; only factual delivery updates. Authorized commit/push, remote and
automatic live-preview revision verification precede phase 7.
