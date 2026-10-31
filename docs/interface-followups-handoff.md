# Catalog and game interaction follow-ups

Owner-authorized parallel amendments to the delivered `a2cdfd6` baseline:
compact catalog folders, return flips/original sound, and explicit half-time
opponent attempts. Developed in an isolated worktree while the primary
coordinator exclusively continues the phase-12 content expansion.

**Status: independently CLEARED; all three findings resolved and coordinator
post-review gates PASSED. Owner-authorized separate delivery is in progress.
See `reviews/interface-followups.md`.
Not yet committed, pushed or deployed.**

## Acceptance and ownership

- Catalog: closed native folders, left-aligned checkboxes and text, category/count
  headers without redundant instructions, folder icons and colored difficulty
  symbols. Bundled display names normalize to Category · Difficulty · NN and
  sort by difficulty then natural name. Original/custom pack titles and exported
  bytes are preserved. Mixed levels sort by the easiest included difficulty;
  all levels remain indicated. Phase-12 additions retain existing display names.
- Effects: selected cells stay enlarged through the offer and opponent answer.
  A second flip reveals the actual recipient/black face while shrinking back;
  ownership, chooser and victory update immediately. Reduced motion shows the
  final state without a flip. Transient resources never enter saves.
- Sounds: original native synthesis for selection, award, black, deadline ticks,
  timeout/give-up and game end. Local Options toggle, trusted-gesture activation,
  explicit localized failure/suspension feedback and lifecycle cleanup.
- Opponent: an untimed explicit offer has no answer/judging controls. Accepting
  starts half the configured duration with unlimited attempts and spends the
  opponent's turn, even on give-up or expiry. Original chooser selects next after
  acceptance unless victory ends the game. Declining blackens the cell and lets
  the opponent choose next.

Nested Game format advances to v3; portable envelope remains v2. Recovery keeps
exact initial/accepted-opponent deadlines. Compatible old untimed opponent saves
become offers, never an invented expired attempt. Original legacy-symbol
provenance is a runtime-only receipt to preserve the existing safe browser pool
upgrade after domain-version migration. Invalid packs/saves remain protected.

Catalog developer: `f0b16f1d-ae3a-4cfd-8791-dbe7cd6cc7e2`.
Effects developer: `2e2849f9-09fa-48f3-8bb7-575a88b9924a`.
Opponent/domain coordinator: `2c082695-5deb-4ae1-b577-c025ad30b0a3`.
All source writers are disjoint; one isolated heavy runner operates at a time.
The sole primary-checkout integrator retains all phase-12 content ownership.

## Verification recorded before combined review

Commands run from the isolated checkout with Node heap limited to 2048 MiB,
worktree-local temporary/cache directories and browser workers=1. Installed
dependencies/browsers were reused; no shared-server settings were changed.
Detailed commands and failure artifacts are retained in ignored
`.artifacts/catalog-handoff.md` and `.artifacts/game-effects-handoff.md`.

| Evidence                                                 | Observed result                                                           |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| Catalog unit/preparation selector                        | 164 passed                                                                |
| Catalog Chromium/Firefox selector                        | 90 passed; desktop/tablet screenshots inspected                           |
| Opponent/domain/recovery/UI unit selector                | 190 passed                                                                |
| Full unit coverage run                                   | 939 passed / 39 files; all 63 runtime modules included                    |
| Critical coverage, 35 files                              | Lines 99.81%, statements 99.81%, functions 98.71%, branches 96.88%        |
| Remaining coverage, 28 files                             | Lines 99.17%, statements 99.20%, functions 97.69%, branches 94.81%        |
| Full lint/types and production build                     | Passed; existing bundle-size warning retained                             |
| Final effects native selector                            | 16 passed                                                                 |
| Adapted flip/countdown native selector                   | 36 passed                                                                 |
| New opponent native selector                             | 18 passed                                                                 |
| Initial broad gameplay regression                        | 248 passed / 128 failed before sound-notice CSS correction                |
| Maximum-text/clock-error matrix after layout correction  | 244 passed, including four stronger full-box offer-fit regressions        |
| Complete requested gameplay regression after corrections | 376 passed; no skipped/flaky/failed cases                                 |
| Coordinator pre-review complete quality gate             | Formatting, lint, types, 939 units, both coverage groups and build passed |

The broad failure output is retained, not replaced by successful reruns.
A misplaced sound-notice rule was corrected and the notice moved into the header.
A bounded rerun then passed 41 cases with three maximum-text offer-fit failures.
Heading wrapping reduced those to two. Native geometry identified excess floated
host-card exclusion as the remaining cause: the hosted offer alone now reserves
160px rather than 200px, retaining clearance for its measured 127.8–135.8px
read-only host card. Timed questioning retains the original reservation.
Stronger regressions verify complete role-box clearance, all 600 question
characters, 30-character unbroken names and 44px decision buttons; assertions
were not weakened. Full broad rerun and coordinator pre-review quality now pass.

The coordinator's exact pre-review quality command was:

```sh
npm run format:check && npm run lint && npm run typecheck &&
node node_modules/vitest/vitest.mjs run --config .artifacts/effects-vitest.config.js --configLoader runner --no-cache --maxWorkers=1 --no-file-parallelism tests --coverage &&
node scripts/check-coverage.js &&
node node_modules/vite/bin/vite.js build --config .artifacts/effects-vite.config.js --configLoader runner
```

Output is retained in `.artifacts/combined-quality.log`. Isolated runner configs
change cache/output paths and browser port, not source inclusion or coverage
thresholds. These results precede independent review and are not post-review
clearance. The independent review subsequently passed 262 focused units and 48
native cases but identified two requirement-level defects through additional
native probes: Shift-before-click can strand audio initialization, and responsive
board growth can make the return physically grow. Both are now corrected and
await independent re-review; passing developer checks does not close findings.

Corrective quality now passes 957 units/40 files and all 63 runtime-module gates.
Critical coverage is 99.81/99.81/98.72/97.17%; remaining is
99.61/99.63/97.69/95.35%. All 382 distinct native correction/layout cases have
passing latest results. Full retained evidence and the single test-only
floating-point tolerance correction are described in the review history and
`.artifacts/effects-review-fixes-handoff.md`.

Actual browser activation now gates audio initialization, and fresh activating
gestures can retry pending resumes without stale status/cue replay. Highlight
scale is proportional to the resting-board geometry before resolution, using
native CSS length ratios with padding to enclose enlarged edge tiles.
Return geometry comes from the actual rendered face, preserving position and
size even when selection resolves mid-flip. In both engines the 1280×720
cell-28 return now shrinks about 18%, with no endpoint relayout jump. This is
measured screen-space behavior, not only a final-transform assertion.

IF-03 subsequently exposed intermediate-length ordinary offers that covered
bottom-row highlights. Ordinary active panels now reserve their own intrinsic
grid row and the inactive board adapts to remaining space, keeping the initial
full-sized with proportional clearance. The >240-character exception is
unchanged. The published 189-character wording and exact 240-character boundary
now pass across five viewports, both engines/modes, bottom corners and valid
name lengths, with 466 distinct native correction/regression passes.
Production JavaScript and the resolved audio/shrink fixes are unchanged.
See `.artifacts/effects-if03-handoff.md` and the retained review history.

Chromium's native audio context ran and scheduled expected tones. Headless
Firefox remained suspended after a real trusted gesture/resume attempt; explicit
fallback and unchanged timing were verified, not audible playback. Physical
speakers/tablets/controllers, human screen-reader use and Safari/WebKit remain
unverified. No metric exception, coverage exclusion or content re-review waiver
is introduced.

## Integration gate

Final independent receipt and all historical findings are retained in
`reviews/interface-followups.md`. The reviewer verified the complete 77-file
seal and passed 80 native cases plus eight additional Czech/dark journeys.
Coordinator post-review checks on that same snapshot passed:

```sh
npm run format:check && npm run lint && npm run typecheck &&
node node_modules/vitest/vitest.mjs run --config .artifacts/effects-vitest.config.js --configLoader runner --no-cache --maxWorkers=1 --no-file-parallelism tests --coverage &&
node scripts/check-coverage.js &&
node node_modules/vite/bin/vite.js build --config .artifacts/effects-vite.config.js --configLoader runner

EFFECTS_RUN=interface-postreview node node_modules/@playwright/test/cli.js test \
  browser/catalog-presentation.spec.js browser/phase-eleven.spec.js \
  browser/game-effects.spec.js browser/tile-flip.spec.js browser/tile-countdown.spec.js \
  browser/offer-layout.spec.js browser/ordinary-offer-layout.spec.js \
  browser/return-geometry.spec.js browser/opponent-turn.spec.js browser/game.spec.js \
  browser/resilience.spec.js browser/review-fixes.spec.js browser/guided-ui.spec.js \
  browser/clock-error-fit.spec.js browser/release.spec.js \
  browser/preparation-storage.spec.js browser/phase-ten.spec.js \
  --config .artifacts/effects-playwright.config.js
```

Full quality passes 957 units/40 files and both unchanged 63-module coverage
groups. Native result: 664 expected, zero unexpected/skipped/flaky, 29.5 minutes.
Logs: `.artifacts/interface-postreview-quality.log`,
`.artifacts/interface-postreview-native.log`; JSON:
`.artifacts/.artifacts/effects-interface-postreview.json`.
All 77 reviewed hashes still matched after the run; port 4197 was closed.
Receipt/status documentation alone was subsequently updated.

The owner chose **“Publish now with a controlled Phase 12 pause.”** The primary
coordinator stopped gracefully; all 34 dirty Phase-12 files were preserved in
a byte-hashed archive and a named stash before any primary source change.
Ignored content/review artifacts remain untouched. Delivery must exclude this
unfinished content expansion and resume its original coordinator afterward.

Do not apply an unfinished worktree to an active primary checkout.
Integration must preserve later phase-12 catalog/content changes, adapt conflicts
without dropping accepted receipts and independently verify the combined result.
Main/private revisions must be checked after authorized commit/push; a patch
handoff alone is not deployment or evidence that the coordinator consumed it.
