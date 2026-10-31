# Phase 11 — bounded developer handoffs

Baseline: `54b34b1505a6ff3087269bdaae4a4ca790ea4f18`.
**Phase11 independently CLEARED; complete coordinator postreview gates PASS.
Authorized private commit/push/HTTPS delivery follows, with its actual revision
recorded in continuation STATUS. Phase12 retained preparation is paused.**
The full phase-11 gate remains exactly 132 decks / 3,696 questions.

## Final coordinator gate — complete, private promotion next

Independent full report/seal: `phase11-final-review/reviewer-v3-low-memory/`,
REPORT SHA `a615cb5bd5f840ca9f4213a2c594c5b2fb235cb2d24334b2d85873f618dc5848`.
Tracked six-lens summary and all historical findings: `reviews/phase-11.md`.
Reviewed production/tests/content bytes remain unchanged; subsequent tracked
changes only record truthful clearance/delivery metadata.

All commands below use `python3 .artifacts/continuation/low-memory-runner.py
<log-name> <command...>`, verifying available memory and cgroup limits before
each heavy operation; exact vectors/peaks are appended to the requested JSONL.

| Gate                   | Actual command / outcome                                                                                                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Quality                | `npm run check`: PASS867tests/34files, formatting/lint/types/build;57runtime modules in both enforced coverage scopes.                                                                                                                    |
| Native                 | `node node_modules/@playwright/test/cli.js test --config .artifacts/continuation/phase11-postreview-browser.config.js --workers=1`: **1433PASS**, full original scope plus both-engine PDF regressions; no retries/skips/timeouts raised. |
| Coverage rejection     | `node .artifacts/phase-10-coverage-probes.mjs`:65PASS; report byte-for-byte restored, SHA `7f46686ecffa3862e79976bbc5902cb55dbbdd4ac7149596022f4f76e3208a8a`.                                                                             |
| Private before-upgrade | `node .artifacts/continuation/phase11-private-upgrade-canary.mjs capture 54b34b1505a6ff3087269bdaae4a4ca790ea4f18`:PASS actual HTTPS, isolated v1 game/library/custom colors/original deadline captured.                                  |

Named logs: `p11-postreview-{quality,native,probes}.log`,
`p11-private-before-fixed.log`. Initial canary launch failed because imported
Playwright cached its browser path before the script assigned it; this failure
remains in `p11-private-before.log`. The verified empty newly created canary
profile alone was removed, then the installed browser path was set before Node.
No install/user-data/global-cache change. Native/canary commands use the existing
artifact browser binaries and both documented artifact native-library roots,
with artifact-local FONTCONFIG_FILE/XDG_CACHE_HOME before startup.
Observed service peak6444453888bytes; no heap/limit increase or competing runner.
Private after-push protected-data and actual served-SHA checks remain delivery
receipts, not invented pre-push successes.

## Low-memory delivery recovery — 2026-10-31 07:09 local

Owner authorized bounded recovery at 07:08. Actual sole coordinator session:
`8bcfc276-2d9b-4c1a-bfb9-911a6eda1686`; retired coordinator
`ea64fe80-7798-4ec3-aee5-f18088088c8c` is dead and is not resumed.
Durable output: `.artifacts/continuation/low-memory-output.jsonl`; current
ownership is recorded in `.artifacts/continuation/STATUS.md`.
Phase12 artifacts remain retained and paused, not assigned to historical IDs.
General remains independently ACTIVE and exclusively owned by session
`c2ac2e6b-4ed1-4997-8d19-d766f1fff057` in its separate preparation service.

Before this documentation-only recovery amendment, the actual 341-file
correction manifest verified exact SHA256
`e6e482fa85bc92c8f768d9b7179e5951fa541ac5bc7f784ba0566552fe155f1a`,
HEAD, complete path set and four Entertainment absences. The original 340-file
predecessor and accepted review receipts remain preserved. All 132 packs and
eleven source ledgers are unchanged. Reviewer-v2's interrupted 44 successes
are not a completed native review. Focused 36 cases mean 16 real UI journeys
and 20 PDF extraction regressions, not 36 user journeys.

Actual coordinator service limits: MemoryHigh 6GiB, MemoryMax 8GiB,
MemorySwapMax 1GiB; inherited Node heap 2048MiB. Initial available memory
12709MiB; observed service peak 339431424 bytes. One independent reviewer and
one central heavy command at a time; browser workers=1. Check available memory
before each heavy operation, with bounded waiting below 4GiB. Native font/cache
environment is artifact-local and set before Node/browser startup. The eager
reviewer-v2 inventory screen is a working-set suspect, not proven OOM cause;
its replacement must stream records into disk-backed indexes and preserve
full source scope, parser errors, validated inheritance and incremental receipts.

Final independent native/delta review and same-snapshot postreview gates remain
pending; no clearance, commit, push or delivery is claimed. After phase11
delivery, adopt the exact independently reviewed visual patch `88d2b3ad`
with separate integration review and delivery gates, then stop before phase12.

## Complete content integration — 132 decks, final phase gates pending

All100 new decks/2,800 entries and all new whole-deck adult ratings have complete
independent editorial acceptance. Retained32/896 plus additions100/2800 =
**132/3696**,66/1848perlanguage; everycategory12/336/two per language/difficulty.
Final Computing8/Games12/Movies12/Sports12 integration waited finalMovies
b04-v2 FOUR-only CLEARED84 by originalb5d15e34. All80 unaffected whole objects/
84originalsupportchains/129placements/379cachefiles/154readings/three ratings/
accepted retirement/sense judgments are unchanged; six exact finite aliases
are independently accepted. No full factual review is silently repeated/waived.

Final formatted ledgers:

| Category                  | Added entries | SHA256                                                             |
| ------------------------- | ------------: | ------------------------------------------------------------------ |
| Computing and Programming |           224 | `f05676e38f870f925cdbabe697afd0a80993403b0466dfb232ef965d59934631` |
| Games                     |           336 | `49f9895b683c7ad6822ee51d1b9167879c2c2a95d38360dff046886061cfd12e` |
| Movies/Series             |           336 | `19604ea919a7f2bc8e75952e25898417324e733b2a139c42abcd4b103f1d3233` |
| Sports                    |           336 | `c162a659253919540356386d6eb184f74d200da39d5c1cdaf0aa7f52c164c36b` |

Four old Entertainment JSONs moved byte-for-byte into `docs/retired/`, removed
atomically from runtime imports/rows. Their112 historical factual receipts,
actual oldscope/year regressions and full compatible save/import behavior remain.
`phase-11-entertainment-retirement.json` binds four exact archive hashes,
accepted old/new mappings and formatting-only mapping continuity. Archives
contribute zero final quota. No saved-format or recovery-engine change is needed:
portable/recovery validation uses the complete embedded pack, not a catalog ID.

Catalog285nonblanklines stays under300; original starters remainpositions0/1
and all other surviving prior rows preserve relative order. Tests require all132
shipped JSON registrations, all11quotas, all3,696 IDs/prompts, exact38 canonical
groups, complete1232 final source/pack bindings, focused final corrections and
actual archived-pack import/recovery. `npx vitest run tests/content.test.js
tests/final-library-content.test.js tests/retired-content.test.js`:
**349tests/3files PASS**. Finalaudit132/3696 passes with56preserved parallel-input
packs/four authorized title-only amendments;89aliasgroups/44sourceoverlap groups
are semantic nominations, not automatically approved by that audit.

New native retired-pack journeys cover real import, JSON/HTML/PDF, gameplay,
reload/fullsave import and exact original deadline. Complete `TMPDIR="$PWD/.artifacts"
npm run check` PASS:867tests/34files, formatting, lint, types and build. Both
measured coverage groups include all57runtime modules: critical33 L/S/F/B
99.79/99.79/98.58/96.88%; remaining24 99.56/99.58/98.18/95.19%.
`node .artifacts/phase-10-coverage-probes.mjs`:65negativeprobes PASS, exact report
restoration. Original failed lint/stale projections and aggregate132-sheet
5334ms/5000mstimeout remain preserved. All print assertions now execute as132
independently named actual-pack cases; no timeout increase or weaker assertion.
Nativebrowser runs, final independent integration review, same-snapshot
coordinator post-review gates and private delivery still pending. No commit/
push/deployment. Primary remains based on54b34b1. Phase12 preparation stays
isolated; visual adoption remains immediately after phase11 delivered.

## Historical resumed checkpoint — Computing scope approved, Arts integrated

Owner17:15 broadened Computing and Programming / Informatika a programování,
stable `programming` ID and general-adult difficulty/quotas unchanged.
The prior scope-choice blocker is resolved, not the72 category findings or
phaseclearance. All40 accepted judgments/source receipts remain; affected
category/difficulty judgments and concrete defects require independent recheck.
Unavailable prior agents were queried before isolated replacements; actual IDs,
bounded ownership and reading limits are in continuation STATUS.

Arts b01-v2/b02-v2/b03-v2 independently accepted224/8ratings and integrated
byte-for-byte. LedgerSHA59d581f50c4e04c8a8490609e2648c0f8c281d9a887c0a6cca91bf4552db173b.
Actual catalog92/2576,46/1288perlanguage;sevencompletecategories,44finaldecks/
1232questions remain. Four inherited Computing pack titles alone follow the
owner rename, bound by `phase-11-computing-metadata.json`; no question/evidence
change. Folder localization and printable categories share the existing strings.

Integrated quality628tests/32filesPASS, format/lint/types/build. Critical33
L/S/F/B99.79/99.79/98.58/96.88%; remaining24
99.55/99.56/98.18/95.38%; all57runtime modules included. Actual logs in
continuation `arts-computing-check-final.log`. Initial two staleArtsprojection
expectations and aggregate5000msdisclosuretesttimeout preserved; per-pack
identical assertion cases now scale with library size without weakened checks.
Arts native-browser runner and final phase gates remain separately recorded.

Visual exact independently cleared baseline-relative patch adoption is queued
after phase11delivery, without waiting for phase12completion (owner17:19).
Generalphase12 remains exclusively active in separate preparation session.

## Historical checkpoint — Programming bank blocked, 84 packs verified

Actual catalog: **84 packs / 2,352 questions**, 42 / 1,176 per language.
Six categories have exact 12 / 336 quotas. Four transitional Entertainment packs
are excluded; 80 final candidates exist and 52 decks / 1,456 questions remain.
Science and Politics final formatted packs are integrated byte-for-byte after
same-reviewer object/evidence continuity clearance. Politics final versions:
b01-v4 / b02-v5 / b03-v4. Aggregated ledger SHA-256:
`b65e5e6b203b9231fa956d3db1de191206e3e8192d64385a6ea2a58a0b76c7ca`.

Latest integrated `TMPDIR="$PWD/.artifacts" npm run check`: **525 tests /
31 files PASS**, format/lint/types/build and both coverage scopes. Critical33
L/S/F/B: 99.79/99.79/98.58/96.88%; remaining24:
99.54/99.56/98.17/95.33%. All57 runtime modules included, only type-only
types.js excluded. `node .artifacts/phase-10-coverage-probes.mjs`:
65 negative probes PASS, exact report restoration. Politics native config
passes 28 flows, 14 Chromium / 14 Firefox, serialized. Actual Chromium PDFs
decoded against JSON; Firefox actual HTML, not PDFs. Representative actual
Politics question screenshots inspected: readable, unclipped panel below board,
active player/actions and no answer disclosure. Port4182 closed afterward.
Logs under `.artifacts/continuation/politics-integrated-{check,coverage-probes,browser}.log`.
These bounded checks do not substitute for final independent/post-review gates.

Programming current bank is independently BLOCKED: 40 accepted Czech judgments
preserved; 72 category-fit defects (55 Easy / 17 Medium), no complete replacement.
Reviewer `9f67b594-e4ad-474f-80f9-24e8a62080e6` assessed actual reasoning samples
and source contexts, not just the author's claim. Six promising sketches do not
prove a full bank; nor does this finite failed attempt prove product impossibility.
Owner choices: explicitly broaden to Computing and Programming; explicitly allow
novice-programmer-relative Easy with disclosure/recalibration; or retain current
requirements and require a materially different viable bank. No policy exception
is needed merely to author accessible program-reasoning questions. No option has
been selected and no original defect is waived. Full independent assessment:
`.artifacts/continuation/bundles/reviews/p11/programming/b01-v1/FEASIBILITY-FOLLOWUP.md`.

Owned authors and phase-12 Nature/Geography/History have safe idle checkpoints
with reservations, caches and exact reading limits. Arts224, Sports168 and
Movies84 are accepted staged, not integrated. Other review backlog is recorded
in continuation STATUS. Separately owned General/visual preparation retains its
own service/worktree/review ownership; do not duplicate or stop it. No new
commit/push/preview delivery: HEAD remains phase10 `54b34b1`.

## Science integrated checkpoint — bounded verification passed

All three immutable Science batch versions are independently accepted:
b01-v3 (84 entries, two fresh / 82 unchanged), b02-v4 (84, three / 81) and
b03-v4 (56, three / 53). All 224 initial entry judgments and eight difficulty
ratings are preserved; eight affected entries received narrow fresh judgments.
The exact eight pack bytes and all reviewed entry/evidence objects are integrated.
The aggregated source ledger binds those three immutable inputs.
Central formatting reopened the preceding content-cleared versions: ignored
artifact CLI checks had been no-ops. The original author published format-only
successors and each same reviewer verified all question/entire-evidence objects,
metadata and caches unchanged, actual production-path formatted text and refreshed
pack hashes. Those final reviewed bytes are now adopted; old versions remain.
At the Science checkpoint the catalog was 76 / 2,128, 38 packs / 1,064 entries per language. Five categories
have their exact 12 / 336 quotas; 60 final decks / 1,680 questions remain.
Four transitional Entertainment packs remain excluded from final quotas.

The first targeted integration check correctly exposed an overstrict old
canonical-string-uniqueness expectation: physical versus Python generators and
chemical versus Python yield are independently reviewed distinct senses. The
test now permits only those three exact ID pairs and still rejects every
unexpected canonical collision; normalized prompts remain globally unique.
No accepted fact or alias was changed to satisfy that proxy.
Targeted content/catalog/Science tests pass 153 / 3 files, and affected lint passes.
Full integrated quality subsequently passed 499 tests / 30 files and all
format/lint/types/coverage/build gates. Science native-browser journeys passed
46 (23 per engine), including 13 corrected-answer cases per engine, all eight
additions and two mixtures. Evidence:
`.artifacts/continuation/science-integrated-check-final.log` and
`science-integrated-browser.log`. No final phase or delivery is claimed.

## History v3 integrated verification

The same independent reviewer cleared History's three alias corrections and
three subsequent prompt-only disclosure corrections, preserving the original
224 factual judgments and eight difficulty ratings through exact question and
evidence continuity. All eight v3 pack bytes and the final source ledger were
integrated unchanged. Actual catalog: 68 packs / 1,904 questions, 34 per language;
four accepted categories each have 12 / 336. The four transitional Entertainment
packs are not final candidates; 68 final decks / 1,904 questions remain.

`TMPDIR="$PWD/.artifacts" npm run check` passed 479 tests / 29 files,
formatting, lint, types, separate coverage gates and build. All 57 runtime
modules are included (33 critical, 24 remaining); only genuinely type-only
`src/domain/types.js` is excluded. Coverage L/S/F/B:
critical 99.79/99.79/98.58/96.88%; remaining 99.54/99.55/98.17/95.33%.
The History native browser configuration passed 36 flows, 18 Chromium and
18 Firefox, with serialized runners: all eight additions, both-language
new-only mixtures and eight corrected-alias/disclosure cases. Real Chromium
PDFs were decoded against 28 ordered JSON rows, aliases, citations and rights;
Firefox checks real HTML only. The preview closed afterward.

Evidence: `.artifacts/continuation/history-integrated-check.log`,
`history-integrated-browser.log`, `history-integrated-browser/`, final History
`corrections/v3/READY.json` and preserved independent `reviews/p11/history/REPORT.md`.
No phase-11 final integration clearance, coordinator final gate, commit, push or
private delivery is claimed by this bounded checkpoint.

## Parallel category production — owner amendment

Recovery 2026-10-30 15:57: the coordinator exited at 15:19 on the default
600-second background timeout, not task completion. The launcher now supplies
86400 seconds; no coordinator service/host changes. All nine prior task IDs are
unavailable, so one replacement per isolated author directory and one independent
History reviewer recover actual durable drafts/caches/receipts. No duplicate
authors, refetch restart or lost accepted evidence. STATUS records replacement IDs.
Adopt the owner-approved immutable 2–4-deck batches, full first-deck review and
early difficulty calibration at each level, and changed-question/evidence-only
correction review with exact unchanged question AND evidence hashes. The already
frozen History category keeps its existing review progress.

The recovered shared baseline passes full quality: 465 tests / 28 files,
format/lint/types/build, all 57 runtime modules and separate coverage gates;
65 negative enforcement probes and sixteen affected native browser flows
(eight Chromium, eight Firefox) pass, serialized. Coverage L/S/F/B:
critical 99.79/99.79/98.58/96.88%; remaining 99.54/99.55/98.17/95.34%.
Initial format and callback-size failures from prior test preparation are retained
in logs and fixed without weakening assertions. All 60 existing pack bytes and
four accepted source/classification ledgers verified unchanged. Port 4182 closed.
Detailed commands/logs are in STATUS; this is not final-phase clearance.

The owner approved meaningful isolated author/reviewer parallelism on return.
The coordinator remains sole shared-file integrator; full editorial, independent
final-phase and coordinator post-review gates are unchanged. Central builds,
coverage, browser runners and private previews stay serialized.

Four authors started: History `84548d77-86db-4891-bfd0-8d97de592a77`,
Politics `60846f1a-98f9-41e6-a649-a1144c8cdae2`,
Science `8c8aa029-3412-4a2e-842e-e72462b9148d`, and
Programming `7e085b5d-d654-4ff4-93db-858a14ae7346`.
Each owns only its ignored category staging bundle. The fixed author input
contains 60 validated packs / 1,680 questions, SHA-256
`f43842008acdbd54f6b305a59b187eadfd4fb6a205982f3d76d8a9985a2d9711`.
All currently accepted pack/evidence bytes remain preserved.

The interrupted History task did persist 224 draft entries and actual source
caches (final fetch log 224/224, 1,121 cache files). No old active agent/process
or listener remained. Its assigned author recovers this work rather than
duplicating it; no History pack is integrated or editorially cleared yet.
Arts and Games/Movies/Sports follow as author capacity becomes available.
Independent reviewers receive frozen category manifests only; unrelated category
authors can continue. Changes return to their original author, followed by
changed-entry re-review and exact unchanged-object hash continuity.

The shared data-driven browser journeys now discover all eleven final categories
and calculate new-only mixture levels from their actual source decks, including
Programming's Easy/Medium-only additions. This is test preparation, not evidence
that any unintegrated category shipped or passed review.

Coordinator preparation checks passed: 140 focused unit tests, then sixteen
native browser flows (eight Chromium, eight Firefox) on the current 60-pack
checkpoint, serialized. This covers data-driven new-deck fixed/numbers print
and reimport, new-only Geography mixtures, native folder keyboard/guard,
actual complete-language catalog selection, source identity/exact drawn content,
and inherited catalog layouts/defaults. Real Chromium PDFs were decoded against
the downloaded JSON; Firefox checks actual HTML only. No final-phase quality,
coverage, independent integration review or delivery is claimed.

Catalog counts in the shared browser fixtures derive from every shipped JSON;
the separate exact final inventory/level gates are not weakened. The full-catalog
mix now genuinely selects all current-language packs instead of only historical
IDs. It checks every drawn question against its selected original, rather than
incorrectly requiring every eligible category to appear in a random 28-question
draw. Individual-pack journeys still exercise each source separately.
Logs/artifacts: `.artifacts/continuation/parallel-coordinator-targeted.log`,
`parallel-browser-expanded.log`, `parallel-browser-results.json` and
`parallel-browser/`; port 4182 closed after the managed runner.

## Historical Geography authoring checkpoint

The sole bounded Geography/travel developer added eight original 28-entry decks:
two Easy, one Medium and one Hard per language. Geography now has exactly
**12 decks / 336 questions**, two per language/difficulty. All **224 additions
and eight ratings await fresh independent review**. All 52 preceding pack bytes,
accepted General/Nature/classification ledgers, older manifests/reports and the
coordinator's review summary are preserved. Baseline/live remains `54b34b1`.

Actual catalog: **60 decks / 1,680 questions**, 30 decks per language.
Final candidates: **56 / 1,568**, plus four transitional Entertainment decks /
112 entries excluded. **76 final decks / 2,128 entries remain** toward the
uncleared 132/3,696 gate. Phase 12 is not started; no owner decision blocker.

| Language | Easy                                           | Medium                                      | Hard                                      |
| -------- | ---------------------------------------------- | ------------------------------------------- | ----------------------------------------- |
| Czech    | `geography-cs-easy-01`, `geography-cs-easy-02` | `geography-cs-01`, `geography-cs-medium-01` | `geography-cs-02`, `geography-cs-hard-01` |
| English  | `geography-en-easy-01`, `geography-en-easy-02` | `geography-en-01`, `geography-en-medium-01` | `geography-en-02`, `geography-en-hard-01` |

All 224 actual source contexts were developer-read, including naming variants
and qualifiers. The [source index](content-sources.md#phase-11-bounded-geography-addition--independent-review-pending)
documents quality, 241 evidence placements, rejected responses and exact hashes.
The [Geography ledger](phase-11-geography-sources.json) binds every accepted set,
claim and actual cached context to eight exact pack hashes. Its SHA-256 is
`fc4798b0f1800169f040942424af05e97341c80b5d244df37097b4318b3377f6`.
General's ledger remains `d7c67ea8e4a92760ebaf3636f0e9ebded8aa8c54690a1852426687ad5c058a2b`;
Nature's remains `56d4e21794ceda9bcdc7df27f40ce624c7c306dd20941b95e235c0a0aaf15e19`.
The historical 36-pack classification generator was not rerun or weakened.

Easy is dominated by familiar countries/cities/landscape terms, Medium by informed
regional geography, Hard by specialist geomorphology/navigation. Real rare-initial
outliers are disclosed, not fabricated or used to disguise deck difficulty.
Full-corpus semantic screening distinguishes the Washington city/person and
map/chromosome X overlaps from reused facts. No canonical uniqueness assertion
or matching rule was relaxed. Explicit Turkish ASCII and apostrophe variants
work through the existing literal normalizer; no engine change was made.

Integration reuses the existing catalog and data-driven browser helpers:
all eight new decks, fixed/numbers, selected-source mixtures, actual-draw
difficulty, JSON export/reimport, recovery, immutable host-reset content and
28-row private HTML/native Chromium PDF checks. Affected catalog projections
retain language-prefiltered Origin/Difficulty-only native folders and visible
matching-selection semantics. The static catalog data moved to module-level
`bundledSources` to preserve the 60-line function ceiling; per-call validation
and cloning are unchanged. No metric exception or matching change was needed.

### Geography developer verification

`TMPDIR=$PWD/.artifacts npm run check` **PASS: 458 tests / 28 files**,
formatting, lint, JavaScript/JSDoc types, separate coverage and production build.
`TMPDIR=$PWD/.artifacts node .artifacts/phase-10-coverage-probes.mjs`
**PASS: 65 negative probes**, including all 57 runtime membership checks,
with byte-for-byte report restoration. Focused iteration: **137 tests / 3 files**.
Final logs: `.artifacts/phase11-geography-check-verified.log` and
`.artifacts/phase11-geography-coverage-probes-verified.log`.

| Scope               | Lines              | Statements         | Functions        | Branches           |
| ------------------- | ------------------ | ------------------ | ---------------- | ------------------ |
| Critical, 33 files  | 3771/3779 (99.79%) | 3811/3819 (99.79%) | 278/282 (98.58%) | 1211/1250 (96.88%) |
| Remaining, 24 files | 3012/3026 (99.54%) | 3076/3090 (99.55%) | 107/109 (98.17%) | 490/514 (95.33%)   |

All executable production modules, including untested sources, are denominators;
only type-only `src/domain/types.js` is excluded. Thresholds remain critical
95/95/95/90 and remaining 85/85/85/80. The restored coverage report SHA-256 is
`e41e14261f1df3f3320daff25b4df9f7ff29f5749431ca24bed9419b0f121ef7`.
Production limits remain 300/60/10/3 without exception. The existing Vite chunk
warning is disclosed, not suppressed: 599.56 kB JS / 160.85 kB gzip.

Initial failed checks and the complete first Chromium run (44 PASS / 16 stale
inventory-assertion failures) remain preserved. A subsequent early rerun was
interrupted after identifying one remaining reset-catalog count; its evidence
also remains. Exact catalog assertions now require 30 language-prefiltered packs,
six Easy choices and completed Geography folders. Full quality/probes were
rerun after the final assertion correction; no production defect or weakened
assertion was hidden.

Sequential production native runs **PASS: Chromium 60/60 (1.9m), Firefox
60/60 (2.7m)**, using the existing helpers and these bounded configs:

```sh
TMPDIR=$PWD/.artifacts \
LD_LIBRARY_PATH=$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu \
npx playwright test --config .artifacts/phase11-geography-chromium.config.js
# After Chromium exits and 4182 closes, repeat the same environment:
npx playwright test --config .artifacts/phase11-geography-firefox.config.js
node .artifacts/phase11-geography-browser-audit.mjs
node .artifacts/phase11-geography-audit.mjs
git diff --check
```

Final logs: `.artifacts/phase11-geography-{chromium,firefox}-final.log`.
The post-native audit reopens and decodes **18 real Chromium PDFs**, verifies
**18 exact 28-row HTML sheets and 36 exact JSON export/recovery files per
engine**, plus 28 screenshot receipts per engine. All eight new decks and two
new-only mixtures are covered, including actual difficulty/origin identity and
complete answer aliases, rights and citations. Firefox verifies HTML/print
screenshots, not PDF. Evidence hashes:
`.artifacts/phase11-geography-browser-evidence.json`; audit log:
`.artifacts/phase11-geography-browser-audit-final.log`.

All eight actual question and fixed print screenshots were visually inspected
in **both engines**. Questions remain below the triangle; active player, time
and action are visible, with no revealed answer. All 28 numbered print rows,
wrapping aliases, rights and mapped source appendices remain legible and intact.
This is software evidence, not physical-device or human screen-reader clearance.
Both managed previews returned HTTP 200 while active; 4182 closed after each.
No owned process remains or shared preview/admin service was changed.

The source audit passes all 224 receipts / 241 placements / 476 cached body/text
bindings, all 52 prior pack bytes and preserved accepted ledgers/review summary.
Final freeze, containing **all changed/untracked nonignored files**, including
inherited work: `.artifacts/phase-11-geography-candidate.sha256`. Older manifests
remain untouched. Detailed source, iteration, visual-path and exact verification
evidence: `.artifacts/continuation/phase11-geography-developer-checkpoint.md`.
**Developer STOPPED for fresh complete independent review of all 224 additions,
accepted sets and eight ratings; not phase clearance.** Full-library independent,
full browser and coordinator gates remain. No commit/push/deploy or phase-12 work.

## Historical Nature bounded content checkpoint

Nature now contains **12 decks / 336 questions**: exactly two of every
Czech/English × Easy/Medium/Hard combination. The eight additions / **224 new
entries are developer-authored and source-inspected, NOT independently accepted**.
The four inherited Nature files and all 44 previous pack bytes are unchanged.
General's 224 additions and eight corrected entries are independently accepted
in `.artifacts/phase11-general-correction-independent-report.md`; the General
ledger remains SHA-256
`d7c67ea8e4a92760ebaf3636f0e9ebded8aa8c54690a1852426687ad5c058a2b`.

| Language | Easy                                     | Medium                                | Hard                                     |
| -------- | ---------------------------------------- | ------------------------------------- | ---------------------------------------- |
| Czech    | `nature-cs-easy-01`, `nature-cs-easy-02` | `nature-cs-01`, `nature-cs-medium-01` | `nature-cs-02`, `nature-cs-hard-01`      |
| English  | `nature-en-easy-01`, `nature-en-easy-02` | `nature-en-01`, `nature-en-02`        | `nature-en-hard-01`, `nature-en-hard-02` |

Actual catalog: **52 decks / 1,456 questions**, 26 per language. There are **48
final candidates / 1,344 questions** plus four transitional Entertainment decks /
112 questions excluded from final quotas. **84 final decks / 2,352 entries
remain**. Full phase 11 is **NOT CLEARED**; phase 12 is not started.

The [Nature receipt ledger](phase-11-nature-sources.json) contains all 224 exact
claims, answers, useful aliases, initials, shipped URLs, actual retrieval dates,
claim-bearing paragraph excerpts, cached-body/extracted-text hashes and eight
final pack hashes. The [source index](content-sources.md#phase-11-bounded-nature-addition--independent-review-pending)
describes quality and rejected lookups. The 36-pack historical classification
ledger remains separate and unchanged; its generation guard was not bypassed.
Tests assert all historical hashes, General's exact 224 receipts and Nature's
exact 224 receipts, rather than dynamically accepting arbitrary pack totals.

Difficulty is general-adult deck dominance, not identical per-clue difficulty:
Easy predominantly uses familiar organisms and anatomy; Medium informed ecology
and biology; Hard specialist biological structures, processes and relationships
with precise clues. Rare-initial Wistárie/Xanthophyll/Shorea are genuine sourced
terms. Nature concerns organisms/environment/biology, not physics/engineering.
The new-only Czech mix uses its actual Easy/Medium/Hard draws; the English mix
contains only Easy/Hard because its two inherited Medium decks are unselected.
No new Music category or unrelated-category authoring was performed.

Source research read all 224 contexts beyond HTTP/substring checks. Encyclopedia
support is honestly labelled secondary, with eight institutional and three
specialist editorial corroboration placements. Empty dictionary and PMC
browser-check responses are excluded. Factual qualifiers were corrected before
handoff: neoteny versus broader paedomorphosis, Wallacea's transitional position,
historical Urochordata, and genuine Czech Wistárie spelling. Úhoř was replaced
with sourced Uzlina because Ú does not satisfy the existing literal U initial
contract; no validator change was made.
All new facts were compared with the complete preceding 1,232 questions and each
other. Queen bee's useful _queen_ alias shares a string, not a fact, with the
band Queen. No near-identical template padding is accepted as novelty.

### Remaining final-category matrix

Current after accepted History, Science, Politics and Arts integration, not the historical
Geography/Nature snapshots. Counts are integrated final candidates.
Triples are Easy / Medium / Hard; every final language triple must be 2 / 2 / 2.

| Final category            | Current cs    | Current en    | Outstanding decks | Outstanding entries |
| ------------------------- | ------------- | ------------- | ----------------: | ------------------: |
| General knowledge         | 2 / 2 / 2     | 2 / 2 / 2     |                 0 |                   0 |
| Nature                    | 2 / 2 / 2     | 2 / 2 / 2     |                 0 |                   0 |
| Geography                 | 2 / 2 / 2     | 2 / 2 / 2     |                 0 |                   0 |
| History                   | 2 / 2 / 2     | 2 / 2 / 2     |                 0 |                   0 |
| Computing and Programming | 0 / 0 / 2     | 0 / 0 / 2     |                 8 |                 224 |
| Arts                      | 2 / 2 / 2     | 2 / 2 / 2     |                 0 |                   0 |
| Politics                  | 2 / 2 / 2     | 2 / 2 / 2     |                 0 |                   0 |
| Science                   | 2 / 2 / 2     | 2 / 2 / 2     |                 0 |                   0 |
| Games                     | 0 / 0 / 0     | 0 / 0 / 0     |                12 |                 336 |
| Movies/Series             | 0 / 0 / 0     | 0 / 0 / 0     |                12 |                 336 |
| Sports                    | 0 / 0 / 0     | 0 / 0 / 0     |                12 |                 336 |
| Total                     | 44 candidates | 44 candidates |                44 |               1,232 |

### Nature verification, evidence and frozen review input

Final code/content quality: **420 tests / 26 files PASS**, formatting, lint,
JavaScript types, both coverage groups and production build PASS. Exact commands:

```sh
TMPDIR=$PWD/.artifacts npx vitest run tests/content.test.js tests/catalog.test.js
TMPDIR=$PWD/.artifacts LD_LIBRARY_PATH=$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu npm run check
TMPDIR=$PWD/.artifacts node .artifacts/phase-10-coverage-probes.mjs
TMPDIR=$PWD/.artifacts LD_LIBRARY_PATH=$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu npx playwright test --config .artifacts/phase11-nature-chromium.config.js
TMPDIR=$PWD/.artifacts LD_LIBRARY_PATH=$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu npx playwright test --config .artifacts/phase11-nature-firefox.config.js
node .artifacts/phase11-nature-audit.mjs
node .artifacts/phase11-nature-browser-audit.mjs
```

Focused checks: **112 PASS**. Coverage negative probes: **65 PASS**, report
byte-for-byte restored. Native production browsers ran sequentially:
**137/137 Chromium and 137/137 Firefox PASS**, no retries/skips/flaky results.
Both previews returned HTTP 200 on permitted port 4182 and are closed.
These are affected bounded journeys, not the full 132-deck phase-final gate.

| Scope               | Lines              | Statements         | Functions        | Branches           |
| ------------------- | ------------------ | ------------------ | ---------------- | ------------------ |
| Critical, 33 files  | 3771/3779 (99.79%) | 3811/3819 (99.79%) | 278/282 (98.58%) | 1212/1251 (96.88%) |
| Remaining, 24 files | 2995/3009 (99.53%) | 3051/3065 (99.54%) | 107/109 (98.17%) | 491/515 (95.34%)   |

All 57 runtime modules remain included, with only type-only `domain/types.js`
excluded; full membership is printed in the quality logs. Thresholds remain
95/95/95/90 and 85/85/85/80. No metric exception or engine mock was introduced.
Vite's >500 kB chunk warning is disclosed, not hidden by a limit change.

The generic catalog journeys exercise all 52 actual packs as fixed exports,
selected-only numbers, export/reimport, recovery and host-reset immutability.
Nature-specific ten journeys per engine cover eight additions and two new-only
mixtures, actual source levels, automatic play and private printing. The actual
18 Nature Chromium PDFs were reopened/decoded for all 28 ordered rows,
aliases, citations and rights. Firefox checks actual 28-row HTML and print
screenshots, not unsupported Firefox PDF output. Supplementary audit verified
36 real JSON exports/recoveries per engine and HTML authors/license.

All eight final Nature question screenshots in each engine were opened and
inspected: native Czech/English, tablet/desktop, original readable prompts,
clear timer/player/actions, panel below triangle and no early answer disclosure.
Fresh Czech Easy01/Medium and English Hard01 print screenshots were inspected,
including the precise Šidélko páskované/scientific alias and source appendix.
This does not claim physical tablet/Xbox, human screen-reader, physical printing,
PDF rasterization or public-release verification.

Final-stop quality/probe logs:
`.artifacts/phase11-nature-{quality,coverage-probes}-final-stop.log`
(restored coverage summary SHA-256
`a2ce31b5216bca028ca42feb02f4c7588b1d170d100ae43b42867dea762f2d5f`).
The earlier snapshot logged remaining branches 490/514 (95.33%); the final-stop
run recorded 491/515 (95.34%), with identical 57-file scope and other fractions.
Other current logs:
`.artifacts/phase11-nature-{chromium,firefox}-final.log`,
`.artifacts/phase11-nature-{audit-final,browser-audit}.log`.
Evidence hashes: `.artifacts/phase11-nature-browser-evidence.json`.
Screenshots/downloads: `.artifacts/.artifacts/phase11-nature-{chromium,firefox}/`.
Earlier invalid draft/fetch, initial validation, lint, interrupted browser and
four obsolete Easy-count failures remain preserved, not reported as full passes.
Two final Czech editorial refinements removed a bean-answer stem hint and an
awkward damselfly epithet fragment; complete fresh gates passed on final bytes.

Nature ledger SHA-256:
`487e66afa759dc1467d4c844f668ee4574c462f379843a6f65ad5609f646ea97`.
Detailed all-224-ID/source audit and exact reproduction evidence:
`.artifacts/continuation/phase11-nature-developer-checkpoint.md`.
After all writes, every changed/untracked nonignored file is frozen in
`.artifacts/phase-11-nature-candidate.sha256`. Previous manifests/reports,
General receipts and coordinator review summary remain unchanged.
**Writer STOPPED for fresh independent all-224-entry and eight-difficulty
review.** Full phase 11 remains **NOT CLEARED**, with 84/2,352 outstanding.

## General knowledge bounded content checkpoint

General knowledge now contains **12 decks / 336 questions**: exactly two decks
for every Czech/English × Easy/Medium/Hard combination. The eight additions
contain **224 individually independently reviewed canonical facts**, with all
eight difficulty assignments accepted. P11-GR1/GR2 corrections affect eight
entries and passed narrow independent recheck; the other 216 entries are unchanged.
The existing four General IDs, questions, answers, aliases, initials and sources
are unchanged. P11-IR1 remains independently resolved; this bundle does not reopen
the accepted inherited classifications or imply a fresh inherited factual audit.

| Language | Easy                                  | Medium                                  | Hard                                       |
| -------- | ------------------------------------- | --------------------------------------- | ------------------------------------------ |
| Czech    | `general-cs-01`, `general-cs-easy-01` | `general-cs-02`, `general-cs-medium-01` | `general-cs-hard-01`, `general-cs-hard-02` |
| English  | `general-en-02`, `general-en-easy-01` | `general-en-01`, `general-en-medium-01` | `general-en-hard-01`, `general-en-hard-02` |

At the General-only checkpoint the catalog had **44 decks / 1,232 questions**, including four transitional
Entertainment decks / 112 questions, excluded from final quotas. Retained 32
plus eight new decks give **40 final candidates / 1,120 questions**.
**92 final decks / 2,576 questions remained.** No other category was authored in that bundle.
The final target remains eleven categories / 132 decks / 3,696 questions,
with Games, Movies/Series and Sports replacing Entertainment; no Music category.
Phase 12 has not started. Full phase 11 is **NOT CLEARED**.

### Source and editorial evidence

[`phase-11-general-sources.json`](phase-11-general-sources.json) contains all
224 exact entry IDs, claims, canonical answers, aliases, inspected source
passages, actual retrieval timestamps and extracted-source hashes, together
with all eight exact pack hashes. Every shipped source URL is represented.
The original 36-pack source/classification ledgers remain separate historical
evidence; tests assert their complete inherited subset and the complete new
224-entry set independently. The metadata-only classification generator was
not rerun after authoring.

Most references are public secondary encyclopedia articles, read beyond HTTP
status and schema. Institutional corroboration includes ECB, IFAB, NIST, NASA,
NIH/NIDDK/MedlinePlus, Stanford Encyclopedia of Philosophy, St Andrews university
mathematical history and a Charles University botanical syllabus. The latter's PDF text operators were decoded
and inspected without installing tools. Wikipedia is not represented as a
primary source. Failed or non-supporting Britannica/RSC/CERN/ÚJČ lookups were
not accepted as evidence. Full fetched extracts and actual retrieval receipts
are preserved in `.artifacts/phase11-general-sources/`; the durable tracked
ledger contains claim-bearing passages, not merely links to those artifacts.

Wording was composed for HexY, not copied from commercial quizzes or source
prose. Answers were compared with the whole inherited library; normalized
same-language prompt/answer uniqueness was enforced across 616 entries per
language at that checkpoint (728 now). Cross-language counterparts and related but distinct facts are
allowed. Aliases cover useful spellings, names and word orders, not redundant
case/diacritic variants already handled by normalization. Initial placement
uses the unchanged 28-position alphabets, including Czech Ch and English CH/SH.

The independent reviewer accepted all eight dominant general-adult difficulty assignments:
Easy uses familiar objects, foods, everyday geography and basic school facts;
Medium uses informed adult vocabulary, institutions, named techniques and
specific landmarks; Hard uses specialist but defined concepts such as
abiogenesis, epact, phyllotaxis, demiurge, birefringence and taphonomy. Unusual
initials use genuine established terms, not fabricated words. General knowledge
can span arts/science/history without duplicating an existing same-language
answer or mass-rephrasing one template. The complete independent factual,
Czech/English language, ambiguity, alias, initial and semantic-overlap review
found six standard-alias omissions and two word-count inconsistencies, not
unsupported canonical facts. The corrections below subsequently passed independent recheck.

### Historical General-only remaining matrix

Counts are authored candidates, not independent factual acceptance.
Triples are Easy / Medium / Hard; every final language triple must be 2 / 2 / 2.

| Final category    | Current cs    | Current en    | Outstanding decks | Outstanding entries |
| ----------------- | ------------- | ------------- | ----------------: | ------------------: |
| General knowledge | 2 / 2 / 2     | 2 / 2 / 2     |                 0 |                   0 |
| Nature            | 0 / 1 / 1     | 0 / 2 / 0     |                 8 |                 224 |
| Geography         | 0 / 1 / 1     | 0 / 1 / 1     |                 8 |                 224 |
| History           | 0 / 2 / 0     | 0 / 0 / 2     |                 8 |                 224 |
| Programming       | 0 / 0 / 2     | 0 / 0 / 2     |                 8 |                 224 |
| Arts              | 0 / 2 / 0     | 0 / 0 / 2     |                 8 |                 224 |
| Politics          | 0 / 1 / 1     | 0 / 0 / 2     |                 8 |                 224 |
| Science           | 0 / 1 / 1     | 0 / 0 / 2     |                 8 |                 224 |
| Games             | 0 / 0 / 0     | 0 / 0 / 0     |                12 |                 336 |
| Movies/Series     | 0 / 0 / 0     | 0 / 0 / 0     |                12 |                 336 |
| Sports            | 0 / 0 / 0     | 0 / 0 / 0     |                12 |                 336 |
| Total             | 20 candidates | 20 candidates |                92 |               2,576 |

Current verification and final freeze evidence are recorded below after the
historical checkpoint. Full phase-final browser gates wait for all 132 decks;
bounded checkpoint journeys do not substitute for those gates.

## Historical first software checkpoint — implemented

- Pack v2 requires adult Easy/Medium/Hard difficulty. Invalid/missing metadata
  has localized actionable errors; imports remain atomic and preserve valid work.
- Mixed number boards preserve each drawn question's source level and declare
  their actual sorted union. No fourth difficulty, arbitrary inference or
  unselected fallback. Fixed/source decks have one declared level.
- Validator, generator, editor, JSON exports, library, locked-game/portable
  recovery and print headers preserve the same metadata. Editor reclassification
  is explicit and applies to the whole custom copy; unchanged mixtures retain
  their original levels. IDs, sources and fixed placement remain intact.
- Origin/Difficulty are the only catalog filters. Language comes solely from
  Options and cannot be cleared with filters. Selection rejects foreign,
  duplicate and unknown IDs without invalidating accepted content.
- Native expandable category folders, separate uploaded/custom folder,
  whole-folder/individual selection, selected/matching counts, native partial
  state, retained expansion and focus. Folder actions affect only matching decks.
  Hidden selected sources remain explicit. Multi-deck alphabetical preparation
  is rejected; number generation uses explicit selected sources.
- Pre-difficulty libraries/games are rejected and protected, never migrated or
  deleted automatically. Library original-byte download is now available in
  Options/preparation, including whitespace. Recovery's existing raw export and
  explicit discard remain. Write-time replacement detection retains observed
  replacement bytes for original-library export without adopting them.

The outer library v1, portable v2, domain-game v1/v2 and input v1/v2 envelopes
are unchanged. Their **nested packs must be v2**. No legacy imported difficulty
compatibility or known-bundled migration is implemented. Unsupported active games
do not continue silently: they remain protected/exportable until explicit action.
See [contracts](contracts.md#packs) and README for recovery steps.

## Historical software-only content and remaining work

At that original checkpoint, no new factual entries had been authored. All 1,008 existing
question bodies, answers, aliases, initials, categories, IDs and source lists
are semantically unchanged. The only authored JSON changes are schema version
and proposed deck difficulty. Original factual checks remain in
`content-sources.md` and phase-5–7 reviews; no new source fetch is claimed.

`phase-11-classification.json` explicitly lists all affected entry IDs under
their proposed deck level, old/new pack SHA-256 and unchanged-question SHA-256.
Each inherited entry classification requires independent review. The ledger
does not assert fresh source inspection, factual re-clearance or phase clearance.
`node scripts/record-phase11-classification.js` reproducibly verifies that only
these metadata fields differ from the baseline before generating that ledger.
Do not rerun it after authoring new wording; its assertion intentionally fails.

| Inventory                                                   | Decks | Questions | Status                                                              |
| ----------------------------------------------------------- | ----: | --------: | ------------------------------------------------------------------- |
| Current development catalog                                 |    36 |     1,008 | Proposed classifications, unreviewed                                |
| Eight retained categories                                   |    32 |       896 | Potential phase-11 contributions, pending classification review     |
| Legacy Entertainment                                        |     4 |       112 | Transitional only; must be replaced, not counted in the 132         |
| Required new/adapted final-content decks beyond retained 32 |   100 |     2,800 | Outstanding; all-entry source/editorial/independent review required |
| Required final phase-11 total                               |   132 |     3,696 | Not complete                                                        |

This checkpoint intentionally preserves the prior Entertainment files until
replacement bundles exist; it does **not** implement the eleven-category final
inventory or claim that retaining Entertainment satisfies that requirement.
There is no new Music category. Games, Movies/Series and Sports labels are ready,
but their complete authored decks are outstanding.

Difficulty proposals were made after reading all retained prompts/answers, not
by assigning the entire old inventory one level. Decks target an audience rather
than asserting every clue has identical individual difficulty:

- General cs-01 Easy (common capitals, planets, everyday school knowledge);
  cs-02 Medium (fujara, named foods/instruments and specific sports terms).
  General en-01 Medium (basalt/quartz/Mohs and Gutenberg context);
  en-02 Easy (familiar objects, food, games and everyday vocabulary).
- Nature cs-01 Medium (common recognition and informed school biology, with one
  specialist Wollemia outlier); cs-02 Hard (specialist organism identification);
  en-01/02 Medium (school biology, tissues, reproduction and common organisms).
- Geography cs/en-01 Medium (world landmarks/capitals); cs/en-02 Hard
  (Winnipeg/Shikoku/Žďár or Xiamen and regional geography).
- History cs-01/02 Medium (informed Czech adult school-history context);
  en-01/02 Hard (Ashoka/Edict of Milan/Yorkists or Umayyads/Xinhai/quipu).
- Programming all Hard for general adults (language-specific keywords,
  iteration/generators, encoding and data-structure knowledge).
- Arts cs-01/02 Medium (informed Czech literature/art vocabulary);
  en-01/02 Hard (ekphrasis/xylography or Xenia/Yellow Book/Zadig).
- Politics cs-01 Medium (civic institutions and informed political vocabulary);
  cs-02 and en-01/02 Hard (agrément/chargé d'affaires, legal and diplomatic
  vocabulary, historical political movements).
- Science cs-01 Medium (school science and electrical units);
  cs-02/en-01/en-02 Hard (inductance/superconductivity, yield strength/Zener diode,
  Josephson effect/Wheatstone bridge/crystallography).
- Transitional Entertainment cs-01/en-01/en-02 Medium; cs-02 Hard for its specific
  Czech titles, original-title distinctions and casts. These labels preserve
  software round trips only; none of those four decks substitutes for new categories.

The next bounded objective at that checkpoint was General knowledge to twelve decks.
Four existing candidate decks supply one Easy and one Medium per language;
eight additional decks (224 entries) remain: one Easy, one Medium and two Hard
per language. Then continue the ten other category bundles, retaining appropriate
reviewed entries without forced obscure initials or copied questions.
Maintain exact per-combination counts and real inspected source evidence.

Historical category accounting before the eight General additions, conditional on acceptance of every retained
classification below. Triples are Easy / Medium / Hard deck counts; each final
language triple must be `2 / 2 / 2`. These are content-work counts, not approval:

| Final category    | Retained cs | Retained en | Outstanding decks | Outstanding entries |
| ----------------- | ----------- | ----------- | ----------------: | ------------------: |
| General knowledge | 1 / 1 / 0   | 1 / 1 / 0   |                 8 |                 224 |
| Nature            | 0 / 1 / 1   | 0 / 2 / 0   |                 8 |                 224 |
| Geography         | 0 / 1 / 1   | 0 / 1 / 1   |                 8 |                 224 |
| History           | 0 / 2 / 0   | 0 / 0 / 2   |                 8 |                 224 |
| Programming       | 0 / 0 / 2   | 0 / 0 / 2   |                 8 |                 224 |
| Arts              | 0 / 2 / 0   | 0 / 0 / 2   |                 8 |                 224 |
| Politics          | 0 / 1 / 1   | 0 / 0 / 2   |                 8 |                 224 |
| Science           | 0 / 1 / 1   | 0 / 0 / 2   |                 8 |                 224 |
| Games             | 0 / 0 / 0   | 0 / 0 / 0   |                12 |                 336 |
| Movies/Series     | 0 / 0 / 0   | 0 / 0 / 0   |                12 |                 336 |
| Sports            | 0 / 0 / 0   | 0 / 0 / 0   |                12 |                 336 |
| Total             | 16 retained | 16 retained |               100 |               2,800 |

## Verification

Initial development evidence (not final phase gates):

- `TMPDIR="$PWD/.artifacts" npm run lint`: PASS, including module/function/
  complexity/nesting ceilings, no exceptions.
- `TMPDIR="$PWD/.artifacts" npm run typecheck`: PASS.
- `TMPDIR="$PWD/.artifacts" npm run test:coverage`: PASS, 377 tests / 26 files
  before the additional mixed-editor regression. All 57 runtime JS modules
  included: 33 critical, 24 remaining; only type-only `domain/types.js` excluded.
- `TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test browser/phase-eleven.spec.js`:
  7 Chromium PASS, native controls/keyboard/focus, both languages/themes,
  desktop/tablet emulation, actual imports/downloads/reload, exact raw bytes.
- Same environment with
  `npx playwright test --config playwright.cross-browser.config.js --project=firefox browser/phase-eleven.spec.js`:
  7 Firefox PASS.

Initial logs: `.artifacts/phase-11-{coverage-first,browser-chromium-first,browser-firefox-first}.log`.
Complete final bundle evidence is appended after the remaining checks.
Earlier failing iterations are preserved in phase-11 logs; no skipped assertions
or production coverage exclusions were introduced.

Historical catalog browser tests were adapted to the approved removal of
Language/Category/search controls and to distinguish folder checkboxes from deck
checkboxes. Their original fixed/number export, source-only generation,
provenance, printing and recovery assertions remain.

Final software-quality snapshot:

- `TMPDIR="$PWD/.artifacts" npm run check`: PASS, formatting, ESLint and size/
  complexity limits, JSDoc checking, **378 tests / 26 files**, coverage and build
  (97 transformed modules). No rule exceptions or new dependencies.
- `node .artifacts/phase-10-coverage-probes.mjs`: **65 negative probes PASS**;
  final coverage report restored byte for byte, SHA-256
  `77c37dd69fc06780247e2b1ac4ed5d52d484a4a2415070d980e1a7c9b2afa6f3`.
  The existing probe discovers both new runtime modules automatically.
- All **57 runtime modules** included: critical 33, remaining 24; only the
  truly type-only `src/domain/types.js` excluded. Browser success is not counted
  as JavaScript statement coverage.

| Scope     | Lines              | Statements         | Functions        | Branches           |
| --------- | ------------------ | ------------------ | ---------------- | ------------------ |
| Critical  | 3771/3779 = 99.79% | 3811/3819 = 99.79% | 278/282 = 98.58% | 1212/1251 = 96.88% |
| Remaining | 2963/2977 = 99.53% | 3003/3017 = 99.54% | 107/109 = 98.17% | 490/514 = 95.33%   |

Final logs: `.artifacts/phase-11-check-final.log` and
`.artifacts/phase-11-coverage-enforcement-final.log`.
The earlier affected Chromium run preserved 111 passes and two obsolete browser
contracts: the old corrupt-library substring and selection of a now-hidden Czech
source in English Options. Tests now assert the new actionable preservation
message and that imported Czech data remains stored but unavailable for English
selection. Insufficient-source, duplicate-text, conflicting-ID and no-game-on-
failure assertions remain. Final affected browser reruns are recorded below.

Final sequential native browser verification:

```sh
export TMPDIR="$PWD/.artifacts"
export LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu"
npx playwright test browser/phase-eleven.spec.js browser/catalog.spec.js browser/phase-six.spec.js browser/phase-seven.spec.js browser/preparation.spec.js browser/preparation-storage.spec.js --output=.artifacts/phase-11-playwright-chromium-final --reporter=list
npx playwright test --config playwright.cross-browser.config.js --project=firefox browser/phase-eleven.spec.js --output=.artifacts/phase-11-playwright-firefox-final --reporter=list
```

- **113 Chromium PASS (3.7m)**, **8 Firefox PASS (21.1s)**.
- Logs: `.artifacts/phase-11-browser-{chromium,firefox}-final.log`.
- New cases cover native keyboard folder expansion/selection/focus, matching/
  partial/filter scope, both languages/themes and desktop/portrait emulation;
  transactional missing-difficulty errors, editor/custom folder/export/reimport;
  exact old-game/library bytes; actual mixed JSON/HTML and active deadline reload.
- Actual final screenshots inspected: Chromium Czech dark and English light,
  Firefox Czech light and English dark folders, plus both mixed answer sheets.
  Final artifact roots:
  `.artifacts/phase-11-playwright-{chromium,firefox}-final/`.
  Their `phase-eleven-phase-eleven--{2f49a,50ab2,90439,a2879}-d-selection-and-fixed-guard*`
  folders contain `folder-filter-keyboard.png`; the `09c0c` folder contains
  `mixed-print.png` and actual mixed JSON/HTML downloads. Readable controls,
  matching counts and difficulty, no horizontal clipping, rows 1–28 intact.
- A read-only Node audit additionally verified all 36 baseline/current ledger
  hashes, all 1,008 exact entry IDs and question objects, source-ledger hashes and
  metadata-only changes: `.artifacts/phase-11-classification-audit-final.log`.
  This verifies continuity, not factual accuracy or classification approval.
- Both previews returned HTTP 200 while active and closed afterward; no remaining
  preview/browser/build writer. `git diff --check`: PASS.

The final complete phase browser suites have **not** been run for this bounded
checkpoint. The 113/8 results must not be presented as complete phase-final
Chromium/Firefox totals or independent clearance. Before eventual phase delivery,
finish the content and all full final checks/review/coordinator gates.

## Boundaries and next gate

No dependency, commit, push, deployment, service or installation operations.
No nested agents/workflows. Coordinator's preexisting phase-10 delivery changes
were preserved. No independent review report has been fabricated.
Physical devices, human screen readers and deferred public-release gates remain
unverified. Preview tests use only production port 4182.

The next gate is coordinator continuation of this bounded bundle and independent
review of software/metadata proposals, not phase clearance. Full phase-final
checks and every-entry review of all 132 decks remain required before delivery.

## Initial bounded review and correction

Independent reviewer `e4d0ba51-2716-47c7-8704-eaed2966aa94` found no software
defect, accepted 31 retained classifications and requested P11-IR1: Czech
Nature 1 is predominantly common/basic biology, not Hard. All 896 retained
entries were read for classification; inherited factual clearance is not
represented as a new fact/source audit. Full history: `reviews/phase-11.md`.

The synchronous developer could not receive follow-up; coordinator corrected
only `nature-cs-01.difficulty` to Medium and its ledger/source hashes, rationale
and conditional counts. All question objects remain identical. Regression checks
Medium filtering, Hard exclusion, generated levels, JSON and printed metadata.
Full quality **379 tests / 26 files** and focused native Chromium **8/8**,
Firefox **8/8** pass. Logs `.artifacts/phase-11-ir1-*`. No remaining-content scope
change; new Nature needs 2 Easy / 1 Medium / 1 Hard in Czech and 2 Easy /
0 Medium / 2 Hard in English. A narrow replacement independent correction
review follows; full phase remains pending.

## General checkpoint verification and review input

These are new developer results for the bounded General bundle, not historical
software-only results or independent review:

- `TMPDIR="$PWD/.artifacts" npx vitest run tests/content.test.js tests/difficulty.test.js tests/catalog.test.js`:
  **99/99 PASS**. Subsequent precise Gnómon wording/source and Živce grammatical
  changes are included in the complete check below.
- `TMPDIR="$PWD/.artifacts" npm run check`: **PASS, 390 tests / 26 files**,
  formatting, ESLint including 300/60/10/3 ceilings, JSDoc, separate coverage
  groups and production build (**105 transformed modules**). No dependencies,
  exceptions, weakened thresholds or runtime-module coverage exclusions.
- `node .artifacts/phase-10-coverage-probes.mjs`: **65/65 PASS**, automatically
  discovering all 57 runtime members. Report restored byte-for-byte, SHA-256
  `e86b229ee098f095527b06998dc09348d2448bf3d620e8a4068a0cbdfb257dfd`.
- `node .artifacts/phase11-general-audit.mjs`: **PASS**. All 36 inherited packs /
  1,008 exact question objects match Git baseline; inherited metadata/hash
  receipts including corrected Nature match. All eight additions / 224 exact
  IDs, claims, aliases, initials, URLs, source-body hashes and pack hashes match
  the new ledger; source passages match cached bodies. The university PDF
  receipt separately binds original PDF and inspected decoded streams.
  Complete audit: `.artifacts/phase11-general-audit.json`; this is integrity
  evidence, not an automated factual or difficulty verdict.

| Scope               | Lines              | Statements         | Functions        | Branches           |
| ------------------- | ------------------ | ------------------ | ---------------- | ------------------ |
| Critical, 33 files  | 3771/3779 = 99.79% | 3811/3819 = 99.79% | 278/282 = 98.58% | 1212/1251 = 96.88% |
| Remaining, 24 files | 2979/2993 = 99.53% | 3027/3041 = 99.54% | 107/109 = 98.17% | 490/514 = 95.33%   |

All **57 production JavaScript modules** are included, including untested-file
denominators; only genuinely type-only `src/domain/types.js` is excluded.
Exact membership and gate output are in `.artifacts/phase11-general-check-pass.log`.
Browser success is not counted as JavaScript statement coverage.
Other logs: `.artifacts/phase11-general-{focused-final,coverage-enforcement-pass,audit-final}.log`.

The initial General browser iteration exposed a test-only nonexistent
`spoken` option (actual value `hosted`); it was corrected without an application
workaround. The next 10 journeys passed. A wider affected iteration found one
remaining historical reset count 18 instead of actual 22; that owned iteration
was stopped, evidence retained and the expectation corrected. Its orphaned
owned preview was explicitly identified and closed before final runners.
The first complete wider rerun passed 130/131; its old two-level mixed-deck
regression selected the now-six-deck General folder but still expected the
original two levels. It now explicitly selects the two original source decks,
preserving every original metadata/print/deadline assertion. The new General
journeys separately verify all three actual drawn levels from new-only sources.
No application behavior or assertion was weakened.
The final snapshot also improves vertical-rod scope in Gnómon, the natural
group answer Živce with singular alias, and exact claim-bearing source anchors.
Earlier logs/traces are retained, not represented as final passing results.

### Final sequential browser results and frozen stop

```sh
export TMPDIR="$PWD/.artifacts"
export LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu"
npx playwright test browser/phase-eleven-general.spec.js browser/phase-eleven.spec.js browser/catalog.spec.js browser/phase-six.spec.js browser/phase-seven.spec.js browser/preparation.spec.js browser/preparation-storage.spec.js --output=.artifacts/phase11-general-chromium-pass --reporter=list
npx playwright test --config .artifacts/phase11-general-firefox.config.js
```

- **131/131 Chromium PASS (4.5m)**, then **16/16 Firefox PASS (48.7s)**.
  Logs: `.artifacts/phase11-general-{chromium,firefox}-pass.log`.
- Chromium includes every catalog pack and all ten new General journeys:
  eight fixed/number generation/export/actual JSON reimport/HTML/PDF/recovery
  paths plus Czech/English new-only three-level mixtures, real automatic play,
  exact source levels and their sorted actual union.
- New General evidence retains **18 actual PDFs**: eight fixed, eight numeric
  and two mixtures. Every printed row and source appendix is checked by the
  existing real-PDF glyph decoder, not a mock. Distinct filenames preserve both
  fixed and number sheets. Hashed artifacts and production-equal fixed exports:
  `.artifacts/phase11-general-browser-evidence.json`.
- Firefox covers all eight new decks' real fixed/numeric JSON/reimport/recovery/
  locked-content journeys plus eight folder/filter/keyboard/import/protected-
  bytes/mixed-print/deadline regressions. Real PDFs are a **Chromium** assertion;
  Firefox does not provide Playwright's PDF API. No Firefox PDF claim is made.
- Actual eight new question screenshots were inspected across Czech dark tablet
  and English light desktop, together with fixed/numeric Czech/English sheets
  and both new-only mixture sheets. Final corrected Gnómon/source and Živce
  rows and both final mixture prints were inspected again. Rows 1–28, initials,
  aliases, attribution and source appendix remain readable, with question panels
  below the triangle and no answer leakage. Final Firefox Czech/English native
  folder screenshots and the two-level print were also inspected.
- Final artifact roots: `.artifacts/phase11-general-chromium-pass/` and
  `.artifacts/phase11-general-firefox-final/`. Native catalog layout cases cover
  both themes/languages and desktop/portrait emulation; these are not physical
  tablet/controller or human screen-reader verification.

Both owned production previews returned HTTP 200 while active, ran sequentially
on 4182 only, and closed afterward. Final whitespace and integrity checks pass;
no owned preview/browser/build writer remains. No installation, nested agent/
workflow, commit, push, deployment or shared-service operation.

The final **90-file** review input, including inherited dirty software/metadata
and phase-10 delivery documentation, is
`.artifacts/phase-11-general-candidate.sha256` (all changed/untracked nonignored
files). Prior manifests/reports remain preserved. The complete continuation
record is `.artifacts/continuation/phase11-general-developer-checkpoint.md`.
The developer has **STOPPED editing for independent review**. Review all 224 new
entries and all eight difficulty proposals; no developer factual self-clearance.
General is authored 12/336, actual catalog 44/1,232, remaining 92/2,576. Full phase 11
is **NOT CLEARED**; full final browser/content/coordinator gates wait for all 132.

## P11-GR1/P11-GR2 bounded developer correction handoff

The independent review `.artifacts/phase11-general-independent-report.md`
individually examined all **224** new canonical facts and accepted all eight
dominant difficulty assignments. Its original **CHANGES REQUIRED** verdict
remains in force until independent correction recheck. This replacement
developer authored only its two minor findings, not an independent review.

### Exact correction and continuity

| Entry                     | Changed field | Correction                                                   |
| ------------------------- | ------------- | ------------------------------------------------------------ |
| `general-cs-easy-01-13`   | text          | Remove “jedním slovem”; retain Kolo, jízdní kolo and bicykl  |
| `general-cs-medium-01-16` | aliases       | Add numizmatika                                              |
| `general-cs-hard-02-18`   | aliases       | Add pandantiv; existing normalization also accepts pandántiv |
| `general-en-hard-01-07`   | aliases       | Add Foucault's pendulum and Foucault’s pendulum              |
| `general-en-hard-01-09`   | text          | Remove “two-word”; retain Hapax legomenon and hapax          |
| `general-en-hard-01-16`   | aliases       | Add ogam                                                     |
| `general-en-hard-02-21`   | aliases       | Add sheqel                                                   |
| `general-en-hard-02-26`   | aliases       | Add zebec, retaining chebec                                  |

Only these eight question objects in **five packs** changed, with exactly the
listed fields. All **216 other new entries**, all **1,008 inherited question
objects**, every initial/ID/position/source URL/canonical answer and all
classification/software/runtime code remain unchanged. The other three new
packs are byte-identical to the original candidate; Nature Medium is preserved.
The original dirty coordinator summary is preserved, with formatting only and
an appended developer response. No metadata-only classification script was run.

The source ledger has exact revised claims/aliases and only five updated pack
hashes. The six naming leads are bound to their actual cached bodies; no source
body, URL or original retrieval timestamp was invented or refreshed.
Hapax's actual abbreviation passage is also now explicit. The additional ÚJČ
numizmatika observation is attributed to the independent reviewer's actual
retrieval and report hash, **not** a fresh developer fetch/body receipt.
The quoted pandantiv books remain references reported by the article, not books
independently retrieved by this developer. Curly Foucault is a local typographic
equivalent, not a global normalization change.
Per-entry source `reviewStatus` preserves the original developer submission;
the ledger's top-level `independentReview` records the later actual disposition.

| Affected pack        | Corrected SHA256                                                   |
| -------------------- | ------------------------------------------------------------------ |
| general-cs-easy-01   | `6cc60f9030af2071ad5348dac5e445d52a4a13593f510fa86c0669878e388931` |
| general-cs-medium-01 | `c5ff23fc8576567b50a17f66346f1e48cca4344ef591ecf41b2b74517303aa4d` |
| general-cs-hard-02   | `f825617c52b526fbbfdf72872af10b7df525d9ed18c0bb33c24dc71f2a7ee01a` |
| general-en-hard-01   | `364ac038ece99ff06d8d63b11137d43587887f850f83840d87da72825eb306b5` |
| general-en-hard-02   | `978471d2b862b5325b6bc093cee85d2ccd8dcf01d21b8b3df76cce2c6f373af4` |

Corrected source-ledger SHA256:
`d7c67ea8e4a92760ebaf3636f0e9ebded8aa8c54690a1852426687ad5c058a2b`.

### Actually executed correction verification

```sh
TMPDIR="$PWD/.artifacts" npx vitest run tests/content.test.js tests/answers-packs.test.js
TMPDIR="$PWD/.artifacts" npm run check
node .artifacts/phase-10-coverage-probes.mjs
node .artifacts/phase11-general-corrections-audit.mjs
node .artifacts/phase11-general-corrections-evidence.mjs
git diff --check
```

- Focused **99/99 / two files PASS**. Added 16 regressions cover real
  `acceptsAnswer` canonical/all variants/wrong terms, both removed word-count
  restrictions and all six naming-passage/source hashes.
- Complete quality **406/406 tests / 26 files PASS**, formatting, lint/metrics,
  JSDoc, separately enforced coverage and production build. Production limits,
  57-module membership and thresholds are unchanged; no exceptions.
- **65/65 negative probes PASS**, measured report restored byte-for-byte,
  SHA256 `e86b229ee098f095527b06998dc09348d2448bf3d620e8a4068a0cbdfb257dfd`.
- Exact baseline audit PASS: immutable original candidate fingerprint,
  eight-entry/five-pack delta, 216 new + 1,008 actual-Git inherited objects
  unchanged, three other new packs byte-identical, all **233** cached source
  receipts and all eight new pack hashes coherent. It demonstrates the six
  former standard-equivalent rejections against original saved candidate data,
  and their acceptance by the real unchanged answer checker after correction.

| Measured scope      | Lines              | Statements         | Functions        | Branches           |
| ------------------- | ------------------ | ------------------ | ---------------- | ------------------ |
| Critical, 33 files  | 3771/3779 (99.79%) | 3811/3819 (99.79%) | 278/282 (98.58%) | 1212/1251 (96.88%) |
| Remaining, 24 files | 2979/2993 (99.53%) | 3027/3041 (99.54%) | 107/109 (98.17%) | 490/514 (95.33%)   |

All 57 runtime files, including untested sources, are in the denominator;
only existing truly type-only `src/domain/types.js` is excluded. Exact full
membership is printed in `.artifacts/phase11-general-corrections-check-pass.log`.
Browser results are not statement coverage.

Sequential native production browser commands:

```sh
export TMPDIR="$PWD/.artifacts"
export LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu"
npx playwright test --config .artifacts/phase11-general-corrections-chromium.config.js
npx playwright test --config .artifacts/phase11-general-corrections-firefox.config.js
```

**Chromium 8/8 PASS (25.2s), then Firefox 8/8 PASS (35.7s).** Every affected
entry completes actual fixed JSON download/reimport, exact 28-row HTML print,
automatic game/reload, wrong-concept rejection followed by corrected-answer
capture, and a complete saved-game download retaining the exact source pack.
No engine mock, synthetic question rewrite or injected saved state is used.
The eight Chromium PDFs are actual files; all were reopened with the existing
glyph decoder and checked for ordered complete rows, aliases, source mapping
and attribution. Firefox verifies actual HTML print DOM/screenshots, not PDF.
Both languages are covered. Evidence and hashes:
`.artifacts/phase11-general-corrections-browser-evidence.json`.

All eight Chromium question screenshots were opened and inspected: revised
Czech and English prompts are readable, actions/time/player remain visible,
panel stays below the triangle and no canonical answer is shown. Czech Easy
and English Hard01 Chromium print screenshots and the corresponding Firefox
Czech question/English print were opened: ordered 28 rows, useful aliases,
corrected word scope, citation appendix and attribution remain legible without
unrelated controls. Screenshot roots:
`.artifacts/phase11-general-corrections-{chromium,firefox}/`.
This is emulated tablet/desktop evidence, not physical-device or screen-reader
verification, PDF rasterization or physical printing.

All fresh logs use `.artifacts/phase11-general-corrections-*`, preserving old
artifacts. The first quality attempt stopped on formatting of the preexisting
dirty coordinator review; its content was preserved and formatted before the
successful full gate. The first supplementary export-audit iteration assumed
`stage.kind`; actual serialized state uses `stage.phase`. That ignored harness
was corrected and all real exports then passed. Both earlier failure logs are
preserved; neither is reported as a successful run or production defect.

### Frozen stop and next gate

All changed/untracked nonignored files are frozen after final writes in
`.artifacts/phase-11-general-corrections.sha256`. The original 90-file manifest
and its fingerprint `baef3a561698305f703079b31d958cdb1e6014c02ae6006d64d306224ef16282`
remain immutable, as do earlier manifests and independent reports. The corrected
manifest intentionally supersedes affected hashes; the original is not claimed
to validate the corrected files.

**STOPPED editing for narrow independent recheck of these eight entries.**
No General clearance is self-declared; full phase 11 is **NOT CLEARED**.
Actual catalog **44/1,232**, General **12/336**, remaining **92 final decks /
2,576 entries**, full target **132/3,696**. After successful independent recheck,
the coordinator may continue remaining category bundles and their full review.
This writer does not start Nature, any other category, phase 12 or delivery.
No agents, installs, commits, pushes, service/deployment/shared-configuration
changes occurred. Both owned previews returned HTTP 200 on 4182 sequentially;
all owned runners are complete and 4182 is closed.

## P11-NR1/P11-NR2 bounded developer correction handoff

The immutable independent Nature report
`.artifacts/phase11-nature-independent-report.md` reviewed all 224 additions,
accepted **211 entries and all eight difficulty assignments**, and reported
two minor findings affecting thirteen entries. This replacement developer
implements only those corrections; no independent clearance is self-declared.
The preceding Nature submission/pending-review statements are historical.

### Exact thirteen-entry delta

| Entry                    | Changed field | Explicit addition or replacement                                                                    |
| ------------------------ | ------------- | --------------------------------------------------------------------------------------------------- |
| `nature-cs-easy-01-02`   | aliases       | bříza bradavičnatá; bříza bílá                                                                      |
| `nature-cs-easy-01-04`   | aliases       | česnek setý                                                                                         |
| `nature-cs-easy-02-02`   | aliases       | sosna                                                                                               |
| `nature-cs-easy-02-10`   | aliases       | špargl                                                                                              |
| `nature-cs-medium-01-03` | aliases       | celulosa                                                                                            |
| `nature-en-easy-01-03`   | aliases       | cactuses                                                                                            |
| `nature-en-easy-01-10`   | aliases       | European ivy                                                                                        |
| `nature-en-easy-01-15`   | aliases       | bird's nest; bird’s nest                                                                            |
| `nature-en-easy-01-22`   | aliases       | bole                                                                                                |
| `nature-en-easy-02-22`   | aliases       | terrapin                                                                                            |
| `nature-en-easy-02-25`   | aliases       | spiderweb; spider's web; spider’s web; cobweb                                                       |
| `nature-en-hard-01-19`   | aliases       | rootstalk; creeping rootstalk                                                                       |
| `nature-en-hard-01-23`   | text          | Which group of marine chordates, ranked as a subphylum, includes sea squirts, salps and larvaceans? |

Exactly **twelve alias arrays plus one text field**, in **six pack files**.
All eighteen added variants use ordinary word spacing. All prior aliases,
canonicals, IDs, initials, positions, sources and metadata remain intact.
The other **211 new Nature question objects**, two unaffected new packs, all
**44 preceding pack bytes**, actual-Git inherited 1,008 objects, accepted
General ledger and historical classification are unchanged. No runtime,
normalization, difficulty, catalog, engine or other-category edits.

Exact pre-correction copies of all eight new packs and the source ledger/review
are saved in `.artifacts/phase11-nature-corrections-baseline/`, with eight-pack
`packs.sha256`, complete working-tree, cache and immutable-evidence fingerprints.
This is necessary because those new pack files do not exist at Git HEAD.
Original 100-file candidate manifest remains immutable, fingerprint
`bc325ab3122f423789ad04459b00ab637e23339fcf37f3e2e8ce45a39d916995`.
The original review reports and coordinator's existing summary remain preserved.

### Source scope and corrected hashes

All **235 evidence placements** retain original URLs, actual original retrieval
dates and full body/text hashes; all **936 cached files** are byte-unchanged.
The twelve existing naming leads already explicitly support the finite useful
variants. Possessive apostrophe shapes are explicit local spelling alternatives,
not claims of two source spellings or global punctuation normalization.
For NR2, actual cached Tunicate paragraphs identify the same marine animal group,
distinguish current Tunicata from former Urochordata/Urochorda, and describe
salps, larvaceans and sea squirts. The prompt no longer demands a historical
designation. Urochordata remains canonical, and Tunicata/tunicates/Urochorda
remain useful accepted alternatives. Two cached animal/common-name paragraphs
are appended to that entry's selected excerpt only; no new fetch is claimed.
All 211 unaffected source receipts are object-identical. Per-entry reviewStatus
retains the original developer submission; the top-level status records the
actual independent disposition and pending correction recheck.

| Pack                  | Corrected SHA-256                                                  |
| --------------------- | ------------------------------------------------------------------ |
| `nature-cs-easy-01`   | `3b95c9220029f15e09b72193fa1ea64ac82bd7d8fb53fa01a73913a9745440df` |
| `nature-cs-easy-02`   | `7006b2d44881b981f4193367e67c0a09cf54361e7f137df88941d5d2c7d1232a` |
| `nature-cs-medium-01` | `b33f8e35237717a4bcb525fd0bd982bc49fc046966fb1a789a1aa6586c0eb185` |
| `nature-en-easy-01`   | `27999cca5bf0c0088658e1cff12fec4468b2092c41bed05eff6281ab185bfd5b` |
| `nature-en-easy-02`   | `1db8d6220f3baf22ba0631301ca08f7dc8653a37c0cb999498a4b8d7c106aeec` |
| `nature-en-hard-01`   | `6c1ea761b3ee3fea00cbff1c9f98cf1ec9ca5116d1eb4dd658b25417307e351d` |

Corrected source ledger SHA-256:
`56d4e21794ceda9bcdc7df27f40ce624c7c306dd20941b95e235c0a0aaf15e19`.
Unchanged packs: cs-hard-01
`97be9b7c107ded69702f155a212c51e71726f1a99a793fa9d4591f642c1eee93`,
en-hard-02 `372638507ac8766d65ebdf98e9e3164c3c3c3135c0458ba4e4a19eee3a9c6ba3`.

### Correction verification

All commands use existing dependencies only:

```sh
export TMPDIR="$PWD/.artifacts"
export LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu"
npx vitest run tests/content.test.js tests/catalog.test.js tests/nature-corrections.test.js
npm run check
node .artifacts/phase-10-coverage-probes.mjs
node .artifacts/phase11-nature-corrections-audit.mjs
npx playwright test --config .artifacts/phase11-nature-corrections-chromium.config.js
npx playwright test --config .artifacts/phase11-nature-corrections-firefox.config.js
node .artifacts/phase11-nature-corrections-evidence.mjs
git --no-pager diff --check
```

Focused **125/125 tests / three files PASS**. New regressions use real
`acceptsAnswer` for canonicals, all prior aliases, all eighteen explicit variants,
curly apostrophes, wrong concepts and unlisted concatenated/punctuation variants.
NR2 explicitly asserts the new prompt, unchanged accepted set and source's
former/current distinction. Real export/reimport remains exact.
Full quality **433/433 tests / 27 files PASS**, formatting, lint/300/60/10/3,
JSDoc types, separately enforced V8 coverage and production build. **65 negative
probes PASS**, coverage bytes restored exactly. Existing >500 kB chunk warning
is disclosed, not suppressed or treated as a build failure.

| Measured scope      | Lines              | Statements         | Functions        | Branches           |
| ------------------- | ------------------ | ------------------ | ---------------- | ------------------ |
| Critical, 33 files  | 3771/3779 (99.79%) | 3811/3819 (99.79%) | 278/282 (98.58%) | 1212/1251 (96.88%) |
| Remaining, 24 files | 2995/3009 (99.53%) | 3051/3065 (99.54%) | 107/109 (98.17%) | 490/514 (95.33%)   |

All **57 runtime modules**, including untested sources, remain in denominators;
only genuinely type-only `src/domain/types.js` is excluded. No threshold,
membership, metric exception or dependency change. Full membership is printed
in the correction quality log; browser success is not statement coverage.

Sequential managed production journeys: **Chromium 13/13 PASS (53.5s)**, then
**Firefox 13/13 PASS (1.2m)**. All eighteen NR1 variants and the NR2 canonical/
three-alias set were submitted through the real automatic UI, with wrong-concept
rejection. Every affected entry downloads/reimports exact JSON, checks a real
28-row/citation/alias HTML sheet, recovers the locked hosted pack and tests its
host ownership-reset lock, then recovers an automatic game and its captured cell.
Additional variants start fresh games through native controls; no injected
game state or engine replacement.

The supplementary artifact audit reopens all **26 JSON/HTML/recovery receipts**
and **13 actual Chromium PDFs** with the existing glyph decoder. Every PDF's
28 ordered rows, accepted aliases, source mappings and rights match actual JSON.
Firefox produces **no PDFs**; its real HTML print DOM/media/screenshots are tested.
There are 52 screenshots, not a claim of 52 visual inspections. Representative
Chromium question screenshots (Czech birch, English web, revised NR2) and all six
affected-pack Chromium print sheets were opened and inspected. Firefox Czech
birch/English NR2 question screenshots and English Easy01/Hard01 print sheets
were also opened: prompt below the triangle, timer/player/action readable, no
answer disclosure, all 28 numbered print rows/aliases/appendix legible.
Evidence hashes: `.artifacts/phase11-nature-corrections-browser-evidence.json`.

The initial Chromium harness wrongly attempted hosted correction controls in an
automatic game and timed out. That unfinished run was stopped; its owned orphan
preview PID was explicitly terminated and 4182 closure verified. Failure logs/
artifacts are preserved under `phase11-nature-corrections-chromium-initial-failure*`.
The helper now checks host-reset lock in hosted play and starts fresh automatic
games for additional aliases. No application behavior or assertion was weakened.
Final complete runs above use this corrected helper, one worker and managed
production 4182, with HTTP 200 recorded during each run and closure afterward.
No concurrent build/server/browser, shared4183/4184/admin8443 or service action.

### Frozen stop and required independent recheck

The correction freeze `.artifacts/phase-11-nature-corrections.sha256` includes all
changed/untracked nonignored files after documentation/format writes. Original
manifests/reports are immutable historical evidence, not asserted to validate
the new corrected bytes. Full baseline/delta/source and final command receipts:
`.artifacts/continuation/phase11-nature-corrections-checkpoint.md`.

**Writer STOPPED for a fresh narrow independent recheck of all thirteen corrected
entries**, their source receipts/hashes and affected integration evidence.
P11-NR1/P11-NR2 remain pending; this is not independent acceptance. No owned
runner/preview remains, and 4182 is closed. Actual52/1,456, Nature12/336,
remaining84/2,352 toward132/3,696: **full phase 11 NOT CLEARED**.
No Geography/other category, phase12, install, agent/workflow, commit/push,
deployment or shared-service change. Full all-catalog/final132 browser review
is later work, not repeated or claimed here. Cached sources are not fresh
retrievals; emulated viewports are not physical Xbox/tablet, human screen-reader,
Safari, PDF rasterization, physical printing, legal or deployment verification.

## P11-GEO-R1–R4 bounded developer correction handoff

Replacement sole developer; coordinator paused, no competing writer. The full
immutable independent report `.artifacts/phase11-geography-independent-report.md`
accepted 219 unaffected entries and all eight Geography difficulty assignments.
These five corrections await a fresh independent narrow recheck, not resolution
by their author. Original candidate fingerprint:
`73c9f50a7d9c255dd0ac71ad97cbd950f7dd5cd88e109fe9328edba3c0b15e3e`.
All eight exact original new-pack files plus the source ledger and manifest are
saved in `.artifacts/phase11-geography-corrections-baseline/`; `receipt.json`
binds each saved byte hash to the 112-file original candidate for delta audit.
The coordinator's previous review text is saved byte-for-byte; all wording is
preserved before the appended developer response. Prettier only aligns its
previously unformatted findings table; the audit verifies that sole whitespace
change rather than allowing changes to the review's text.

### Five-entry delta and source binding

| Finding | Entry                     | Exact permitted change                                                          |
| ------- | ------------------------- | ------------------------------------------------------------------------------- |
| R1      | `geography-en-easy-02-23` | Add Britain to aliases, not Great Britain.                                      |
| R2      | `geography-en-easy-01-19` | Add stream to aliases; River/R and the broad natural-watercourse prompt remain. |
| R3      | `geography-en-hard-01-14` | Ask for a landform, often ridge/mound, made of unsorted glacial debris.         |
| R3      | `geography-cs-hard-01-15` | Natural Czech equivalent asks for the landform, not merely its material.        |
| R4      | `geography-en-hard-01-10` | Remove the German-literal clause; retain Inselberg and monadnock.               |

Two alias arrays/three prompts in four packs only. All other 219 new question
objects and all 52 preceding pack bytes are unchanged, including accepted
General/Nature and retained classifications. IDs, initials, order, canonicals,
source URLs and all eight difficulty assignments are unchanged. No engine,
normalization, runtime, dependency or architecture change.
Till/glacial till are not added as interchangeable landform names; “often”
does not teach that every moraine is a ridge or mound.

The corrected source ledger is SHA-256
`f2d8d7b52d908efeb3c97e4370ac00b29e1b193c6eaa46ef08e715b61a6d424e`.
Its exact texts/claims/aliases and eight pack hashes match the shipped JSON.
Full UK naming and Inselberg Abenaki naming paragraphs extend two selected
excerpts. The original River definition and full Moraine material/landform
contexts already supply the other required evidence. All 241 source placements,
actual original 2026-10-30 timestamps and 476 body/text files are unchanged.
No fresh fetch or invented naming authority is claimed. Encyclopedia evidence
remains secondary; references retain their rights. Historical reports/manifests/
receipts are untouched. `docs/content-sources.md` contains all eight current hashes.

### Verification and next gate

Focused regression tests exercise real `acceptsAnswer`, every canonical/alias,
Great Britain/England, artificial canal/canal, till/glacial till and Czech
material-term rejection, exact scoped prompts and export/reimport.
Native journeys reuse existing helpers and the real PDF decoder for all five
affected entries, every accepted answer and both wrong alternatives, download/
reimport, hosted reset lock, automatic answering and exact locked recovery.
Production previews use only 4182, one engine at a time; Firefox evidence is
HTML, not PDF. Detailed command/results/hash/delta/visual evidence is recorded in
`.artifacts/continuation/phase11-geography-corrections-checkpoint.md`.

Final developer verification PASS: focused **145 tests / 3 files**; full
`npm run check` **465 tests / 28 files**, formatting, lint, JSDoc types, all
57 runtime modules in enforced coverage and production build. **65 negative
coverage probes** pass; report restored byte-for-byte. Critical L/S/F/B:
**99.79/99.79/98.58/96.88%**; remaining:
**99.54/99.55/98.17/95.35%**, unchanged thresholds 95/95/95/90 and 85/85/85/80.
Only type-only `src/domain/types.js` is excluded. Production size/complexity/
nesting ceilings remain 300/60/10/3; no exception or disabled rule.
Build: 121 modules, JS599.60kB/gzip160.88kB; existing >500kB advisory retained.

Sequential native Chromium **5/5** (28.7s), Firefox **5/5** (38.7s), zero
unexpected/flaky/skipped. Both HTTP200 previews closed afterward. Per engine:
five complete 28-row HTML keys, ten exact pack/locked-game JSON exports, ten
screenshots. All five Chromium PDFs reopened and genuinely glyph/text decoded
against every ordered row/alias/citation/rights record; Firefox has zero PDFs.
All five question screenshots and four distinct affected-pack print screenshots
were opened and visually inspected in both engines: panel below triangle,
readable player/action/time, no answer leakage, natural Czech wrapping and
legible 28-row keys/aliases/source appendices. No physical printing or PDF
rasterization is claimed. Evidence hashes:
`.artifacts/phase11-geography-corrections-browser-evidence.json`.

Final source/delta audit PASS: five exact changed objects, 219 unchanged,
52 preceding byte-identical packs, 241 unchanged source placements and 476
unchanged bound body/text files. All eight original packs/ledger are bound to
the original candidate; all other candidate runtime/catalog/config bytes are
unchanged. Initial nested-test insertion, missing refreshed hash index,
61-line test callback, overstrict whitespace-prefix audit and reporter-path
audit failures are preserved in distinct correction logs, not counted as passes.
No native journey failed. The callback was shortened by moving the finite
five-ID fixture outside it; no threshold/assertion was weakened.

New freeze: `.artifacts/phase-11-geography-corrections.sha256`, all changed and
untracked nonignored bytes after final writes; older manifests remain immutable.
Writer stops for independent narrow recheck of all five entries/source bindings/
delta/integration. Subsequent coordinator tests on the identical reviewed
snapshot and the eventual full 132-deck gate remain outstanding. Current60/1,680,
Geography12/336, remaining76/2,128 toward132/3,696: **phase11 NOT CLEARED**;
phase12 not started. No agents/workflows/installs/commit/push/deploy/services,
new category, public-release, physical-device or screen-reader claims.
