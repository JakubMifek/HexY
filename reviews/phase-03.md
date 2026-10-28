# Phase 3 independent review

Date: 2026-10-28. Current verdict: **CLEARED after re-review**.
The initial CHANGES REQUIRED findings and evidence remain below.
Reviewer: `7fa31573-f8b3-496d-9e4a-4f196ada4c13`.
Developer: `878460af-cfa3-4337-b8c9-6c813c69d5d9`.
Baseline: `fbee41da9bb02390a3cbc72e9dca0109b302e4cf`.

All 33 changed/new files in the developer manifest and their integration paths
were inspected. Manifest fingerprint:
`9d1156c690e0f9d688c785eadf3aa8a15626b0d7702eb998dca81f6e788780d1`.
Hashes matched before and after review. No implementation/test/config/doc writes,
installs or deployment; reviewer preview stopped.

## Findings

| ID    | Severity | Location                                                                                                                | Issue and required correction                                                                                                                                                                                                                                       |
| ----- | -------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P3-R1 | Major    | `src/runtime/preparation.js:166-182`, `src/workspace.js:55-61`, `src/ui/preparation.js:67-110`, `src/messages.js:63-65` | Quota recovery cannot reduce the oversized library: custom packs are append-only and every retry resaves all copies. Add a safe explicit removal/exclusion path, preserving exports and locked game content, and successfully retry a smaller record.               |
| P3-R2 | Minor    | `src/runtime/library.js:35-44,60-62`, `src/workspace.js:64-69`, `src/messages.js:55-61`                                 | Initial read-access failure advertises an edit retry that cannot succeed because writes remain blocked. Distinguish read/write failures and provide accurate export/reload/reimport instructions or a validated reread/retry. Do not overwrite unread/corrupt data. |

P3-R1 was reproduced in Chromium with real quota exhaustion, not only a mocked
write failure: save an ordinary pack, import a valid pack with an approximately
6 MiB provenance note, observe quota failure, follow the suggestion to clear
external site storage, then retry via a setting change. The entire oversized
in-memory library fails again; there is no way to save just retained copies.
The stored record is now absent, although in-memory work survives.

This does not require IndexedDB, multi-tab synchronization or an arbitrary
import cap. Verify exporting/removing the oversized copy, saving/reloading the
retained pack and preserving locked-game content.

P3-R2: fail initial `getItem`, restore access, then edit/save a custom copy. The
UI still says to allow storage and retry an edit, but no save is possible.
Verify accurate recovery in both languages without bypassing validation.

Evidence: `.artifacts/phase-03-review-quota.log`,
`phase-03-review-quota-retry.png`, `phase-03-review-probes.log` and
`phase-03-review-storage-retry.png`.

## Acceptance and review lenses

Verified: atomic pack imports and conflicts, selected-source generation of 28
distinct eligible questions, fixed order and custom copies, useful editor,
source/fixed/generated/edited round trips, asynchronous content lock, host-reset
integration, escaped private sheets with 28 matching rows and attribution,
normal settings/library persistence, themes/languages and keyboard editor focus.
Storage recovery usability remains incomplete due to P3-R1/R2.

- **Correctness:** required preparation flows and prior game regressions pass;
  recovery findings prevent clearance.
- **Usability/accessibility:** real editor/validation/download/print journeys and
  light/dark desktop/tablet screenshots inspected; recovery defects are material.
- **Readability:** direct modules, useful invariant comments and all enforced
  metrics pass. No exceptions.
- **OOP:** App, Workspace, Preparation, LocalLibrary and Downloads have separate
  responsibilities; no demonstrated god object or resource/state confusion.
- **Patterns:** pure generation/validation and concrete adapters are proportionate;
  no runtime dependency, framework or speculative hierarchy.
- **Content/rights:** both starter JSON files unchanged from phase-2 factual
  review. Origins retain compatibility and attribution through derived JSON and
  printed sheets. No imported-rights reassignment or deployment clearance claim.

## Observed verification

Sequential commands:

```sh
TMPDIR="$PWD/.artifacts" npm run check
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser
git diff --check
```

All passed: formatting/lint/types, 131 tests in 13 files, enforced coverage,
production build and 55 Chromium journeys (including all prior 35).
Coverage-negative probes for either scope and missing workspace source exited 1.
Additional browser probes verified source round trips, invalid editor feedback,
restored storage access and actual quota exhaustion. Both downloaded three-page
PDFs were decoded and every ordered row matched to the corresponding pack,
normalizing only font ligatures/whitespace.

| Group               | Lines              | Statements         | Functions      | Branches         |
| ------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 20 files  | 2052/2058 (99.71%) | 2077/2083 (99.71%) | 140/140 (100%) | 585/599 (97.66%) |
| Remaining, 15 files | 1771/1785 (99.22%) | 1775/1789 (99.22%) | 67/68 (98.53%) | 255/275 (92.73%) |

Critical includes app/workspace, all executable domain modules and all runtime
adapters. Remaining includes content/catalog, main, messages and all UI modules.
All 35 runtime JS files included; only type-only domain/types excluded.
No substituted engine or E2E-as-coverage counting.

Review logs: `.artifacts/phase-03-review-{check,browser,probes,quota,pdf-check}.log`.
Print-media screenshots accompanied decoded PDFs because headless-shell PDF
viewing was unavailable. No physical printer/tablet/controller/screen-reader
verification, game recovery, later content or deployment is claimed.

## Re-review

P3-R1 and P3-R2 remain open. Same-reviewer re-review and coordinator post-review
verification are required before phase clearance or commit/push.

## Developer response — P3-R1 / P3-R2, 2026-10-28

Both findings are implemented for the same reviewer's re-review.
**This is a developer response, not clearance.** The initial findings/verdict
above are preserved; their Markdown formatting was normalized because the
coordinator-added report initially failed `format:check`.

### P3-R1: confirmed exclusion from persistence

`src/ui/library.js` adds **Manage local saving** in both setup and play. Each
custom copy is identified by title and pack ID and has its own JSON export.
**Exclude from local saving** opens an explicit confirmation with export/reload
warnings and a cancel action. Confirmation filters only the next persistence
snapshot and immediately retries the smaller record. **Include again and retry
saving** reverses the session-only choice.

`Workspace.excluded` never changes the in-memory pack collection, selected
sources, accepted proposal, editor or locked `Game.pack`; no content replacement
or new-game unlock occurs. Thus still-identical preparation remains accepted.
Excluded copies remain exportable for the session. After a successful save,
reload omits them; if saving fails, the prior stored value remains intact.
Bundled/nonexistent IDs and disposed-workspace calls cannot change inclusion.
No schema/cap/database/multi-tab changes were introduced.

`browser/storage-recovery.spec.js` reproduces **real Chromium quota exhaustion**
in both languages using a valid source pack with a 6 MiB provenance note; no
`setItem` or quota mocking is used. It proves:

- The retained normal pack's stored record survives the failed import.
- The oversized copy exports completely; canceling exclusion leaves the failure.
- Confirmed exclusion saves only the normal copy; re-including genuinely fails
  quota again, and excluding it again recovers.
- JSON of the locked played pack is identical before/after; content controls
  remain absent and host reset reuses its original question.
- Reload retains the normal pack unchanged and omits the intentionally excluded
  oversized copy. DOM tests also preserve selected acceptance and exports and
  reject attempts to exclude bundled copies or act after disposal.

### P3-R2: truthful read-access recovery

`LocalLibrary.load()` now reports `storageReadUnavailable`, distinct from the
existing write-access error. Both languages accurately instruct:
**export in-memory packs → enable storage → reload → reimport exports**.
They explicitly say edit retries without reloading cannot save. Previously
unread or corrupt records are not overwritten; there is no unsafe reread/merge
or success-shaped fallback.

Both-language browser and DOM tests deny initial `getItem`, restore access, retry
an edit, verify the unchanged original stored record and accurate guidance, then
reload through the real validator and reimport the exported working copy.
Another reload contains the original and imported copies unchanged. Only the
access-denial boundary is simulated; storage, validation and import are real.
Existing incompatible/corrupt-record and write-access tests still pass.

### Verification and frozen evidence

Sequential final gates:

```sh
TMPDIR="$PWD/.artifacts" npm run check
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser
git diff --check
```

Passed: formatting, lint/metrics, types, **134 unit/DOM tests in 13 files**,
separate coverage gates, production build and **59 Chromium journeys** (all
55 prior journeys plus four both-language recovery regressions).

| Group               | Lines              | Statements         | Functions      | Branches         |
| ------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 20 files  | 2075/2081 (99.71%) | 2100/2106 (99.72%) | 141/141 (100%) | 597/611 (97.71%) |
| Remaining, 16 files | 1868/1882 (99.26%) | 1872/1886 (99.26%) | 69/70 (98.57%) | 270/290 (93.10%) |

All 36 runtime files are classified. New `src/ui/library.js` belongs to the
remaining UI group; persistence filtering stays in critical `workspace.js`.
Only type-only `domain/types.js` remains excluded. No metric exceptions.

Evidence:

- `.artifacts/phase-03-storage-fixes-{check,browser}.log` and the full
  `.artifacts/browser-report/index.html`.
- `.artifacts/playwright/storage-recovery-{en-real-q-474b9,cs-real-q-4f747}-y-and-preserves-locked-play/`:
  `oversized-export.json`, identical `locked-before.json` / `locked-after.json`,
  `quota-recovered.png`.
- `.artifacts/playwright/storage-recovery-{en-restor-a3670,cs-restor-420a3}-out-overwriting-unread-data/`:
  `unread-memory-copy.json`, `read-access-guidance.png`.
- English quota recovery and Czech read-guidance screenshots were visually
  inspected. Exclusion is nonmodal; timers and keyboard duels are not paused.
- `.artifacts/phase-03-snapshot.sha256` is regenerated after all source/docs
  writing; `.artifacts/phase-03-artifacts.json` inventories the final browser
  artifacts. Original reviewer probe artifacts/history are retained.

Source scope since the initial review: `src/workspace.js`,
`src/runtime/library.js`, `src/ui/library.js`, `src/ui/preparation-strings.js`,
`src/messages.js`, `src/style.css`; tests in `tests/{library,workspace}.test.js`,
`browser/preparation-storage.spec.js` and `browser/storage-recovery.spec.js`;
README/contracts and factual review/phase handoff updates.

No installs, commits, pushes, deployments, other agents or later-phase features.
No running-game recovery or physical-device verification is claimed.
**Stop edits for reviewer `7fa31573-f8b3-496d-9e4a-4f196ada4c13`.**

## Independent re-review

The same reviewer cleared the final 36-entry candidate manifest:
`584391c78d71f97507f9d1589687c2e7f1a32bee73208598368f97a6f4b6f069`.
Hashes matched before and after re-review. Both findings are resolved; no new
mandatory findings or metric exceptions.

- P3-R1: real 6 MiB quota exhaustion, prior-record preservation, oversized-copy
  export, confirmed exclusion, re-inclusion failure and smaller-library reload
  passed in both languages. `workspace.js` filters persistence only; `ui/library.js`
  makes exports, confirmation/cancellation and inclusion status explicit.
- P3-R2: initial read denial is distinguished from write failure; accurate
  bilingual export/restore-access/reload/reimport flows completed without
  overwriting unread packs or enabling writes to corrupt/incompatible data.

Independent keyboard probes verified accepted preparation, selected sources and
unsaved editor drafts survive inclusion changes. Excluding the currently played
pack preserves exported content, typed draft and the original deadline; timeout
still occurs exactly. Reload retains only intentionally included copies.

All six lenses were revisited. Saving policy remains a session-local Workspace
responsibility rather than gameplay editing. No new schema, database, dependency
or abstraction was required. Original starter content, attribution/download/sheet
modules and prior PDF/factual evidence retain their verified scope.

Reviewer reran full check and Chromium suite sequentially: all 134 tests,
59 browser journeys, formatting/lint/types/build and coverage passed. Critical
coverage: 99.71% lines, 99.72% statements, 100% functions, 97.71% branches.
Remaining: 99.26% lines/statements, 98.57% functions, 93.10% branches.
All 36 runtime JS files are included, only type-only declarations excluded.
Preview stopped and port closure verified.

Fresh evidence: `.artifacts/phase-03-rereview-{check,browser,probes}.log`,
`phase-03-rereview-tablet-exclusion.png`, and the focused storage-recovery browser
artifacts. No physical device/printer/screen-reader or later-phase clearance.

## Coordinator post-review verification

The full frozen manifest was verified unchanged after review; fingerprint:
`d8347242526a79cb9c6654feb70a9d59615587abdd4b42846d07db98e9806b4b`.

Coordinator then ran sequentially:

```sh
TMPDIR="$PWD/.artifacts" npm run check
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser
git diff --check
```

All passed: 134 tests, 59 browser journeys, both coverage groups at the
re-reviewed figures, formatting, lint, type checks and build. Logs:
`.artifacts/phase-03-post-review-{check,browser}.log`.
No implementation changed after re-review; only factual delivery documentation.

Phase 3 is cleared for commit/push. Verify the remote commit before phase 4.
