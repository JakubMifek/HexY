# Phase 8 independent integrated review

**Current disposition:** owner accepted private delivery and closed the plan,
retaining unmet release requirements as follow-ups. The historical independent
verdict below is unchanged; see [closure and delivery](#owner-authorized-closure-and-delivery).

**Verdict: BLOCKED. No implementation defects found.**

Reviewer: `e836edad-5c5a-40f3-b644-6c5c1fad4846`, separate from the developer.
Baseline: `aa465b980eb0ec17d53fa89be8db1806ed2556d0`.
This coordinator-persisted report summarizes the full independent report at
`.artifacts/phase-08-independent-report.md`. It is not phase clearance or
permission to commit, push or publish.

## Snapshot and acceptance

All eleven changed/new candidate files matched before and after review:
`IMPLEMENTATION_PHASES.md`, `PLAN.md`, `README.md`, `NOTICE.md`, `index.html`,
`browser/release.spec.js`, `playwright.cross-browser.config.js`,
`docs/content-inventory.md`, `docs/content-sources.md`,
`docs/phase-08-handoff.md` and `docs/release-readiness.md`.

Candidate manifest `.artifacts/phase-08-snapshot.sha256` fingerprint:
`c4683c28e28eca8f42f8fe2f6ecf0b4fe818e2db884b3d502f29303faa263d8b`.
The full 174-file manifest `.artifacts/phase-08-reviewer-full.sha256` also matched,
fingerprint `d6d42ffa6a2e01146ce0d8c4d40bccf3a52052a0cf5cbe63b9fd6abedaf24b30`.

| Acceptance area                                                       | Independent result                                                                                                                                                                                              |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Game rules, victory, host corrections and chooser/recipient semantics | Pure transitions and real bilingual board/answer-mode journeys verified, including corners, disconnected groups and post-win correction.                                                                        |
| Timing, recovery, immutable content and stale events                  | Deadline boundaries, failure-preserving storage, interruption/rearming and cleanup verified against actual state and formats.                                                                                   |
| Preparation, generation, export and printing                          | Selected-source generation, invalid inputs, roundtrips and all 52 suite PDFs checked: 1,456 ordered rows with answers, aliases, citations and rights. Four additional direct PDFs passed.                       |
| Content inventory and editorial continuity                            | All 36 packs / 1,008 entries match the relevant cleared phase-5/6/7 commits; full ledger/quotas and prior corrections retained. Not a new factual re-review.                                                    |
| UI, keyboard, touch and accessibility                                 | Both languages/themes, four required viewports, focus, non-color cues, contrast checks, reduced motion and concealed answers verified. Native emulated touch and mocked gamepads are not physical-device proof. |
| Notices and production assets                                         | Actual emitted MIT/Vite notices and content attribution verified; root/subpath build bytes, loading, refresh and recovery pass without external runtime requests.                                               |
| Physical-device release scope                                         | Owner explicitly authorized a future limited release with unverified/experimental controller/tablet support and stated browser/accessibility gaps. No physical testing claimed.                                 |
| Naming and actual public deployment                                   | BLOCKED as below; private/local evidence does not satisfy public acceptance.                                                                                                                                    |

## Findings and blockers

No blocker/major/minor implementation defect, metric exception or defect
deferral was established.

| ID    | Classification / location in frozen snapshot                                                                       | Evidence and required action                                                                                                                                                                                                                           |
| ----- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P8-B1 | Release permission/evidence blocker; `IMPLEMENTATION_PHASES.md:245–254`, `docs/release-readiness.md:15–20,111–137` | Owner retains private-only hosting; no public hostname or actual public HTTPS acceptance. Remain private until specific approval, then verify external access, assets, refresh/cache policy, open-game preservation and rollback.                      |
| P8-B2 | Naming assessment blocker; `IMPLEMENTATION_PHASES.md:243–244`, `docs/release-readiness.md:13,22–86`                | Existing Hexy uses and TMview class-9 record require assessment; authoritative scope/status unresolved. Owner retains HexY but withholds public release pending proper conflict assessment. Search results are not clearance or proof of infringement. |

## Six review lenses

- **Correctness/completeness:** traced authoritative state, pure transitions,
  recipient resolution, absolute deadlines, validated recovery and revision
  guards. Tests exercise behavior and failure preservation. Public criteria
  remain unmet.
- **Usability/accessibility:** actual Chromium/Firefox interactions plus direct
  root/subpath keyboard, timeout, privacy, reload, modal, touch and print journeys.
  Screenshots inspected at required viewports; timer does not announce ticks.
  No human screen-reader or physical-device certification.
- **Readability/maintainability:** cohesive rule/adaptor/UI boundaries, no
  weakened tests or silent ignores. Measured maxima: 294 module lines,
  60 function lines, complexity 10, nesting 3; no exceptions.
- **OOP/responsibilities:** concrete state/resource owners compose pure rules;
  serialized state excludes DOM/timers. Disposal, generation guards and URL/input
  lifetimes have behavior evidence; no demonstrated god-object defect.
- **Patterns/proportionality:** explicit game variants and shared input batching
  serve current needs; no new runtime dependency or speculative framework.
  HTML notices preserve the existing strict build contract.
- **Content/rights/delivery:** full cleared-content byte continuity and source
  mapping verified. License/helper attribution inspected against installed Vite.
  Naming evidence reviewed against retained artifacts, not fresh official
  register requests. Private deployment evidence is not public-release proof.

## Commands actually executed by the reviewer

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-08-reviewer-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser -- --output=.artifacts/phase-08-reviewer-chromium > .artifacts/phase-08-reviewer-browser.log 2>&1
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config playwright.cross-browser.config.js --project=firefox --output=.artifacts/phase-08-reviewer-firefox > .artifacts/phase-08-reviewer-firefox.log 2>&1
node .artifacts/phase-05-coverage-probes.mjs > .artifacts/phase-08-reviewer-coverage-probes.log 2>&1
git diff --check
sha256sum -c .artifacts/phase-08-snapshot.sha256
sha256sum -c .artifacts/phase-08-reviewer-full.sha256
```

PASS: formatting/lint/types/build, **286 tests / 19 files** including 35 preview
tests, **211 Chromium** and **68 Firefox** journeys without skipped/retried
failures. Chromium 156.0.8078.4, Firefox 157.0, Playwright 1.64.1.
Ten negative probes reject deficient metrics in both scopes and missing
critical/UI membership; coverage-summary bytes restored exactly.

| Scope               | Lines              | Statements         | Functions      | Branches         |
| ------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 files  | 2831/2842 (99.61%) | 2860/2871 (99.62%) | 211/211 (100%) | 880/901 (97.67%) |
| Remaining, 21 files | 2548/2558 (99.61%) | 2587/2597 (99.61%) | 85/87 (97.70%) | 360/376 (95.74%) |

All 47 executable production JavaScript modules included; only inspected,
type-only `src/domain/types.js` excluded. Full per-file membership is retained in
the developer handoff and original independent report. Required thresholds are
95/95/95/90 critical and 85/85/85/80 remaining. Browser passes are not statement
coverage. Deployment unit checks are not misrepresented as app coverage.

Additional reviewer root/subpath builds and production interactions passed:
4/4 bilingual/theme journeys, four decoded PDFs, no page/request errors.
Exact commands, scripts, results and screenshots remain in the full report and
`.artifacts/phase-08-reviewer-{root,subpath}-interaction/`. Build: 86 modules,
388.48 kB JS (106.99 kB gzip), 7.01 kB CSS, 2.15 kB notice-bearing HTML.
Both owned servers were verified responsive and stopped; port 4182 closed.
Live services untouched.

## Limitations, prior findings and disposition

Physical Xbox/tablet, human screen reader, Safari/WebKit, Windows Edge remote
client and public deployment remain unverified. WebKit launch was attempted and
failed on missing host libraries; no dependencies or shared services changed.
Print screenshots are not rasterized PDFs; actual PDF content was separately
decoded. No physical printer test or legal assurance claimed.

Prior phase-2 through phase-7 findings were rechecked through source continuity
and passing focused/full regressions, including recovery write protection,
source-safe sheets and all editorial corrections. PV-A1 retains its prior
independently reviewed private service/update proof; unchanged deployment code
did not warrant new service mutation.

Owner decisions received during the freeze: retain HexY pending proper conflict
assessment; authorize a future limited initial release with controller/tablet
support unverified/experimental and stated browser/accessibility gaps; keep
private preview only with public hostname undecided.

After the reviewer stopped, the coordinator reconciled only decision/status
documentation and persisted this report. Historical manifests remain intact.
No runtime, test, content or configuration change followed review.
**No clearance, commit, push or deployment.** Mandatory coordinator post-review
gates remain due on the eventual cleared snapshot; reviewer execution is not
represented as that final run. Reopen release work only after the remaining
naming/hosting decisions and evidence permit it.

## Owner-authorized closure and delivery

On 2026-10-29 the owner instructed: "commit and push. keep these as followup work.
Plan is finished". This expressly authorizes private delivery despite the original
public-release blockers. It does not convert the independent verdict to CLEARED,
claim physical verification or authorize public hosting.

The coordinator updated only status/decision documentation after review;
implementation, tests, configuration and content remain the reviewed candidate.
The [follow-up register](../docs/release-readiness.md#follow-up-work) retains naming,
public-hosting acceptance and device/browser/accessibility gaps.

Coordinator post-review verification **PASS**, sequentially:

```sh
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/phase-08-post-review-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/phase-08-post-review-browser.log 2>&1
TMPDIR="$PWD/.artifacts" LD_LIBRARY_PATH="$PWD/.artifacts/phase-08-browser-libs/usr/lib/x86_64-linux-gnu:$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npx playwright test --config playwright.cross-browser.config.js --project=firefox > .artifacts/phase-08-post-review-firefox.log 2>&1
node .artifacts/phase-05-coverage-probes.mjs > .artifacts/phase-08-post-review-coverage-probes.log 2>&1
git diff --check
grep -v '\.md$' .artifacts/phase-08-reviewer-full.sha256 | sha256sum --check --quiet
ss -H -ltn 'sport = :4182'
```

All quality gates, **286 tests / 19 files**, **211 Chromium journeys** and
**68 Firefox journeys** passed. All ten negative coverage probes passed and
restored the report byte-for-byte. Both groups retain the exact metrics and full
47-file inclusion recorded above. All non-Markdown reviewed files match the
independent snapshot; only decision/status/report documentation changed.
The test port has no remaining listener. Commit/push is owner-authorized;
the existing private automatic-main preview will receive that pushed revision.
No public-release claim or new hosting configuration is included.
