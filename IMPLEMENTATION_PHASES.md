# HexY Iterative Delivery Phases

Status: APPROVED by the user on 2026-10-28, together with `AGENTS.md` and
`REVIEW.md`. The phased developer/reviewer process is authorized, subject to
the operational boundaries and any blockers in the handoff below.

`PLAN.md` remains the product specification. These phases organize delivery;
they do not reduce its final scope. Interim builds may use explicitly labeled
starter packs, but final delivery still requires 36 packs / 1,008 entries.

## Execution and review loop

For each implementation phase:

1. The coordinator marks the next eligible phase in progress and records its
   starting snapshot, scope and any decisions needed.
2. Launch one developer subagent/session with the full phase objective, relevant
   product requirements, coding instructions and acceptance criteria. Give it
   a bounded objective: implement this phase, verify it, and stop for review.
3. The developer implements and tests only that phase. Maintain one writer at a
   time. No autonomous release or unrelated refactoring.
4. Stop edits and launch a fresh independent reviewer session with `REVIEW.md`,
   phase criteria, the changed-file set and verification evidence. Every phase
   includes usability, readability, OOP and design-pattern review.
5. Persist the review report. If changes are required, return concrete findings
   to the same phase developer, rerun affected checks and request re-review from
   the independent reviewer. Repeat until cleared or genuinely blocked.
6. After the reviewer clears the final snapshot, rerun formatting/lint, type
   checking, the complete existing unit suite, the build, phase-specific data
   checks and all relevant browser journeys. This post-review verification is
   mandatory, even if those checks passed before review.
7. If a post-review check fails, return to implementation and independent
   re-review; a previous clearance does not cover subsequent fixes.
8. Only a CLEARED review plus passing post-review checks on the same final
   snapshot allows the coordinator to mark the phase cleared and begin the next
   phase. Record the post-review commands/results in the phase report.
9. Commit the phase implementation, documentation and review evidence, then push
   the commit to the verified intended remote branch. Include the required
   Copilot co-author trailer. Do not amend or force-push. Verify the remote branch
   contains the new commit before beginning the next phase; a failed push is a
   delivery blocker, not a reason to discard or rewrite local work.

Use a fresh bounded developer session for the next phase, with the durable
handoff; keep follow-up messages within the current phase. This avoids an
ever-growing context and does not require simultaneous developer sessions.

Do not prelaunch later phases or a large multi-agent workflow. A developer and
an independent reviewer are enough; additional delegation needs a concrete
bounded reason. No arbitrary retry count substitutes for a passing gate.
If repeated attempts make no progress or a decision/access is missing, record
the blockage and ask the user rather than looping, reducing scope or declaring
success. Report each cleared phase briefly before proceeding.

Approval authorizes progression through development phases without asking again
at every successful gate. The user explicitly requested committing and pushing
the approved plans before implementation, and committing and pushing after every
cleared phase. Stage only work belonging to that delivery; exclude unrelated
changes. This does not authorize unresolved product changes, new external
services or unreviewed shared-server modifications. Public deployment requires
approval of the concrete hosting arrangement.

## Persistent phase record

Update this ledger and the corresponding real review report after each gate.
Use the Git revision when available; include uncommitted/untracked files and
their content hashes when identifying a review snapshot. Never create a commit
solely to obtain a revision without permission.

| Phase | Deliverable | Prerequisite | Status | Review |
| --- | --- | --- | --- | --- |
| 0 | Instructions and phased plan approved | User review | Cleared | User approved 2026-10-28 |
| 1 | Tested domain foundation and contracts | 0 | Cleared and pushed: `0155d7c` | [CLEARED](reviews/phase-01.md) |
| 2 | Playable local quiz with keyboard duels | 1 cleared | Cleared and pushed: `fbee41d` | [CLEARED after fixes](reviews/phase-02.md) |
| 3 | Pack preparation and host answer sheets | 2 cleared | Cleared; commit/push pending | [CLEARED after fixes](reviews/phase-03.md) |
| 4 | Recovery, controllers and tablet readiness | 3 cleared | Not started | Not started |
| 5 | General knowledge, Nature, Geography content | 4 cleared | Not started | Not started |
| 6 | History, Politics, Science content | 5 cleared | Not started | Not started |
| 7 | Programming, Arts, Entertainment content | 6 cleared | Not started | Not started |
| 8 | Integrated release and approved deployment | 7 cleared | Not started | Not started |

For each active phase, maintain a short handoff here: current snapshot, changed
files, commands/results, report link, unresolved findings, decisions and exact
next action. Do not claim a pending phase is partially cleared because one test
passed.

## Phase 0: Instruction approval

Deliverables: these phase instructions, coding instructions and review contract.

Gate: user has reviewed and approved them, including proposed size/complexity
limits and the developer/reviewer loop. No application scaffolding before this.

## Phase 1: Domain foundation and data contracts

Deliver a minimal buildable application shell and tested pure game engine:

- Establish approved tooling, scripts, type checking, linting and formatting.
- Define versioned pack/save contracts and typed state/action shapes.
- Implement board geometry, adjacency, edge membership and winner detection.
- Implement normal turns, opponent attempts, host overrides and duel transitions
  as domain logic, independent of DOM/input devices.
- Implement answer normalization and validation for both board alphabets.
- Define clock/randomness boundaries and stale-event protection.
- Resolve active-round/post-win host correction semantics and timer boundaries
  before implementation; ask the user where behavior requires a product choice.
- Add original small test fixtures, not a purported complete content library.

Gate: build, types, lint and engine tests pass; all three turn examples, connected
edge wins, corner handling, overrides, deadline boundaries and rejected/stale
actions are verified. No DOM/storage/device coupling in pure rules. Data contracts
can represent all agreed content, host workflows and interruption states.

This is a foundation gate, not a claim that the game is playable. Review
developer usability of contracts/error messages even though player UI is absent.

## Phase 2: First playable local game

Deliver a complete in-browser game loop using original starter content:

- Setup for players, starter, time limit, board mode and answer mode.
- Number and fixed-letter boards; hosted and automatic answer flows.
- Glossy SVG board, question panel below, HexY logo concept, both themes and
  both UI languages; configurable colors with secondary ownership cues.
- Visible active player, timer, feedback, win display and new-game flow.
- Host cell/turn overrides with the phase-1 correction semantics.
- Keyboard lightning rounds including false starts, ties, missed targets,
  required release and guaranteed eventual target.
- At least one complete original Czech pack and one English pack, clearly
  labeled starter content; include them in the final content inventory.
- Accessible keyboard interaction and reduced-motion behavior from the start.

Gate: browser tests demonstrate each core flow in both modes and languages;
the real timer does not reset or pause on ordinary UI actions. Manually inspect
both themes and board/question readability. No production release claim yet:
pack editing, persistent recovery and controller support arrive next.

## Phase 3: Preparation, custom packs and answer sheets

Deliver the full host preparation workflow:

- Select/upload packs; generate number games from selected sources only.
- Accept, regenerate and manually edit the proposed game.
- Preserve fixed authored letter-board placement; edit via custom copies.
- Lock questions/answers and placement once a game starts. Editing, import or
  regeneration must not alter that game, including after recovery/host resets.
- Validate imported data without destroying existing work.
- Download/reimport every supported pack, including generated/edited packs.
- Produce printable/downloadable HTML answer sheets matching the locked board.
- Local custom-pack/settings storage with explicit failure reporting and
  documented backup/export behavior.
- Document schemas and local-only data handling.

Gate: export/import round trips preserve content and placement; number games
contain 28 eligible non-repeated questions; fixed packs preserve all 28 labels.
Both-language preparation journeys work. Printed sheets match board IDs/answers
exactly and omit game controls. Invalid imports/storage failures have actionable
messages and preserve prior valid data.

## Phase 4: Recovery, input devices and tablet readiness

Deliver the remaining runtime resilience and supported-device flows:

- Save/recover games and original question deadlines across reload.
- Explicit restart of interrupted duels without awards or turn changes.
- Remappable keyboard controls and Gamepad API player/button assignment.
- Input test screen, repeat/hold suppression and connection/disconnection UX.
- Tablet touch interaction and a usable local buzzer input path. Finalize
  simultaneous-touch/controller expectations before claiming tablet support.
- Layout/focus/accessibility refinement, long-text behavior and fullscreen.
- Document supported browsers, device limitations and local storage behavior.

Gate: deterministic recovery, clock-boundary, stale-event and input tests pass.
Browser flows cover reload, hidden tab, expired deadline and device loss.
Inspect at least 1280x720 and 1920x1080 desktop layouts plus 1024x768 and 768x1024
tablet viewports, without clipped essential controls or unintended horizontal
scrolling. Check both themes/languages.

Gamepad mocks and tablet emulation may clear software behavior, but physical
Xbox/tablet checks must remain explicitly pending for phase 8 if hardware is
unavailable. Never claim these tests occurred.

## Shared content-phase gate (phases 5-7)

Each bundle covers three categories, two languages and two packs per
category/language: 12 packs and 336 entries. Starter packs count toward their
category's quota, not as extras or substitutes.

For every entry:

- Independently written question, supported factual answer and explicit initial.
- Natural Czech/English phrasing, precise scope and useful accepted aliases.
- Sources/provenance sufficient for the reviewer to check the fact.
- Correct fixed board placement and category/language metadata.
- No copied TV/commercial-bank wording or fabricated citations.

Automated checks enforce counts, IDs, alphabets, placement, schema and duplicate
detection. The independent reviewer also checks each entry's factual and
linguistic quality; automated validation or spot checks alone are insufficient.
Record findings by pack/question ID. Each cleared pack must work as a fixed game
and as a source for number generation.

If a constrained letter cannot support a natural, defensible question, raise
that content conflict rather than inventing a fact or changing the board.

## Phase 5: First full content bundle

Categories: General knowledge; Nature; Geography and travel.

Deliver and review 12 packs / 336 entries under the shared content gate.
Also validate the full catalog filtering/browsing experience with this first
substantial inventory; avoid changing existing pack IDs.

## Phase 6: Second full content bundle

Categories: History; Politics and diplomacy; Science and technology.

Deliver and review another 12 packs / 336 entries. Prefer stable political facts;
date any time-sensitive claims explicitly. Verify historical questions have
unambiguous geographic/time context.

## Phase 7: Final full content bundle

Categories: Programming; Arts and literature; Entertainment.

Deliver and review another 12 packs / 336 entries. Specify language/version
context where a programming answer depends on it. Use original question wording,
not protected excerpts as decorative clues.

Gate also includes final inventory: nine categories, 36 packs, 1,008 reviewed
entries, both languages, and two packs per category/language. Check duplicates
and mixed-source generation across the complete library.

## Phase 8: Integrated release and deployment

- Run the complete agreed automated suite and full local user journeys.
- Independent review of cross-phase integration, not just the latest diff.
- Review both themes/languages, keyboard and touch flows, print output,
  accessibility, resource cleanup and production asset loading.
- Complete available physical controller/tablet verification or explicitly
  obtain a user decision about release limitations; never silently waive it.
- Finish README, usage instructions, license scopes, attribution and notices.
- Research HexY naming conflicts; report evidence and legal uncertainty.
  An unresolved material conflict requires a user decision before publication.
- Inspect the existing server arrangement and obtain approval of concrete
  domain/path/configuration changes without disturbing other applications.
- Build and deploy static files; verify the actual HTTPS URL, subpath asset
  loading if relevant, refresh behavior and caching/update policy.
- Preserve a rollback path and verify it is documented without overwriting
  unrelated server configuration.

Gate: all product acceptance criteria in `PLAN.md` are accounted for; no unresolved
review defects; production behavior is verified at the approved public URL.
Deployment is part of this phase, so local build success alone cannot clear it.

## Current handoff

Phase 0 cleared by user approval: "Looks good. ... These are approved."
The approved planning/instruction files were committed and pushed to `main` as
`5ca1f732c3d54103cac84356148b06596914cefd`; the remote SHA was verified.
Phase 1 starts from that snapshot. No deployment has started.

The user has now explicitly requested: commit and push the plans, start
implementation, thoroughly test each phase after review, and commit and push
each cleared phase before moving to the next.

The directory/tool blocker was resolved on 2026-10-28 after the session working
directory changed to `/home/jakubmifek/github/HexY`. A shell check verified this
directory, branch `main`, and origin `https://github.com/JakubMifek/HexY.git`.

### Phase 1 developer handoff — 2026-10-28

Starting revision: `5ca1f732c3d54103cac84356148b06596914cefd`. All implementation
is uncommitted; no commit, push or deployment was performed. No later phase was
started. Independent review has not occurred; this phase is **not cleared**.

Changed files: `package.json`/lockfile, JavaScript/format/lint configuration,
`.gitignore`, `.prettierignore`, `index.html`, `src/main.js`, `src/style.css`,
`src/messages.js`, `src/domain/*.js`, `tests/*.js`, `README.md`, `LICENSE`,
`docs/contracts.md`, and factual progress updates in this ledger/`PLAN.md`.
Instruction rules and review criteria were not changed.

Acceptance mapping:

- Tooling/minimal shell: Vite, npm lockfile, strict JSDoc JavaScript checking,
  ESLint metric ceilings and Prettier; no runtime dependencies or framework.
- Geometry: 28 row-major cells, shared-side adjacency, seven cells per edge,
  corner edge membership and connected-component wins; `tests/board.test.js`.
- Turns: all three required chooser examples, unlimited initial guesses, one
  untimed opponent attempt, late/stale rejection and immutable transitions;
  `tests/game.test.js`.
- Corrections: any cell can be reset/blackened/awarded between rounds; chooser
  can be overridden; victory is recomputed after corrections, including after
  a prior win. Active-round corrections are explicitly blocked pending the
  decision below. This is an incomplete gate, not a reduced product scope.
- Duels: injected bounded randomness, guaranteed target, correct/wrong-symbol
  capture, atomic tie replay, missed-target replay, explicit interruption/restart,
  symbol-context revisions and lightning wins; `tests/duels.test.js`.
- Packs/answers: both exact fixed alphabets, normalization/aliases, explicit
  initial validation, source/prepared pack contracts and invalid data rejection;
  `tests/answers-packs.test.js`.
- Saves: original question deadlines, selecting/opponent/won states and interrupted
  duels, cross-field validation and fresh runtime session scopes on recovery;
  `tests/saves.test.js`.
- Boundary developer UX: actionable Czech/English codes with structural paths,
  clock/random contracts, strict config/action inputs; `tests/boundaries.test.js`.

Verification on the handoff snapshot:

- `npm run format`: passed.
- `npm run check` (`format:check`, `lint`, `typecheck`, `test`, `build`): passed;
  six Vitest files, 69 tests. No skipped tests or metric exceptions.
- `git diff --check`: passed.
- `npm run preview -- --port 4179 --strictPort`, followed by
  `curl --fail --silent http://127.0.0.1:4179/` and Node `fetch` checks of the
  generated JS/CSS links: shell and both assets returned HTTP 200. Preview
  process was stopped. This is HTTP/build evidence, not visual/browser gameplay
  or deployment verification.

Design: pure public transitions clone serializable state; small internal helpers
operate only on that clone. No stateful resources require an artificial class.
`DomainError` owns boundary error code/path. Time, randomness and unique runtime
session IDs are supplied by callers. A session ID plus revision rejects queued
events across rounds, corrections, recovery and new games. Timers must rebind to
new revisions without changing original deadlines. Duel input adapters must
provide normalized rising edges and atomic ties; physical input is not implemented.

Host behavior already implemented: corrections themselves preserve the chooser
unless the host overrides it; they recompute connected victory. Removing a win
returns to selection with the existing chooser. They preserve question identity.
No controls or pause action exist. Exact contracts are in `docs/contracts.md`.

**Original decision blocker (resolved below):** active-cell reset must make the question fresh/selectable,
but a new selection could grant fresh time, while ordinary controls must never
pause/reset deadlines. Approve an explicit destructive-correction policy before
implementing it. Proposed policy (not implemented): editing the active cell
cancels its current opportunity; unrelated-cell/chooser changes preserve the
current question and deadline; correction-created victory cancels any current
round; removing victory returns to selection; chooser remains independently
controlled. Clarify whether an active-cell award instead advances chooser by the
recipient rule, and whether a chooser override affects only later selection.
Until resolved, active-round corrections throw `correctionPolicyPending`.
The contracts document the precise alternatives; this is not silent fallback.

Limitations: shell only; no gameplay/browser/visual/device verification, storage
adapter, preparation/editor/print UI, or content library. Fixtures are original
synthetic test data only. Final duel timing/symbols remain caller configuration.
Punctuation/hyphens stay significant unless an explicit alias is supplied;
broader equivalence has not been approved. Name clearance and hosting remain
later-phase work.

User resolution: host edits (cell ownership/state and chooser) are allowed only
while choosing the next cell or after a win, never during an active question,
opponent attempt or duel. Cell edits and chooser selection remain independent.
Evaluate wins immediately after each edit; removing a win resumes cell selection.
The offered active-round cancellation policy was NOT approved.

Coordinator follow-up: the runtime does not support follow-up messages to the
synchronous developer session, so the coordinator completed the small policy
update directly; the independent reviewer remains separate from both authors.
The pending-policy error was replaced with the approved unavailable-during-round
contract. Tests cover every active stage, post-win corrections, source-pack
isolation and content preservation after resetting an owned field.

Pre-review checks on the final candidate: `npm run format`, `npm run check`
(format/lint/types, 71 tests in six files, build) and `git diff --check` all passed.
Questions/answers are locked by the domain action contract and an isolated pack
snapshot; the preparation UI must enforce the same rule in phase 3.

Independent reviewer `0bfa91d1-db40-4ec5-987d-08e62e9c2316` cleared the phase
without findings or exceptions; report: `reviews/phase-01.md`. All frozen file
hashes matched after review. Mandatory post-review `npm run check` and
`git diff --check` passed: formatting, lint, types, 71 tests and build.

Phase 1 committed and pushed as `0155d7c0e095fda640ae49319a304f72fdb440c8`;
the remote `main` SHA was verified. The implementation is still a nonplayable
foundation; no later phase is claimed.

### Phase 2 starting snapshot

While phase 2 was in progress, the user approved separate enforced coverage
groups from this phase onward: critical rules/validation/timing/recovery
>=95% lines/statements/functions and >=90% branches; remaining production JS
>=85% lines/statements/functions and >=80% branches. Include untested production
files; only generated outputs, content data and type-only declarations may be
excluded. `test:coverage` joins the phase gate; browser journeys remain separate.
No phase-1 coverage was measured or retroactively claimed.

Baseline: `0155d7c0e095fda640ae49319a304f72fdb440c8`. Next action: a fresh
phase-2 developer implements the playable interface, starter content and keyboard
duels, runs applicable checks, then stops for an independent reviewer. No pack
editor, persistent recovery or gamepad support is claimed at this phase.

### Phase 2 developer handoff — 2026-10-28

Baseline remains `0155d7c0e095fda640ae49319a304f72fdb440c8`; candidate changes
are uncommitted. **Not cleared: stop edits for independent review.** No commit,
push, deployment, nested agents or shared-server configuration changes occurred.
Coordinator starting edits were preserved. `AGENTS.md`/`REVIEW.md` changed only
to record the subsequent explicit user approval of coverage gates.

Acceptance/evidence mapping:

| Requirement | Implementation and evidence |
| --- | --- |
| Complete setup and local loop | `src/ui/setup.js`, `src/app.js`; names/colors, manual/random starter, default 30 s/configurable 1–3,600 s, both board/answer modes; `browser/game.spec.js` exercises all eight language/board/answer combinations |
| Correct turns and timer | Existing domain engine unchanged; captured revisions, deadline-based `RoundClock`, unlimited initial attempts, exactly one untimed opponent attempt and all recipient/chooser cases; engine, DOM and browser tests |
| Content lock and corrections | No running-game content edits. `src/ui/host.js` renders corrections only in selecting/won; black/reset/award/chooser controls, immediate wins and reopened selection. Browser test restores the original assigned question |
| Visual identity and usability | Native beveled/glossy SVG triangle and original hexagon/Y logo; both themes/languages, panel below board, names/actions/timer together, A/B marks, × on black fields, dashed winning component, semantic keyboard controls and focus |
| Keyboard duels | `src/runtime/keyboard.js`, `src/ui/round.js`; held/repeat filtering, fresh releases across preview, wrong symbols, guaranteed targets, missed targets/ties replay, stale symbol contexts and interruption/readiness |
| Starter factual content | Two real general-knowledge pack-01 JSON files, cs/en, 28 unique original entries each in exact fixed order, aliases and sources. Number mode shuffles only its selected starter. `tests/content.test.js`; 56 entries count toward eventual 36 packs/1,008 entries |
| Accessibility/layout | Keyboard SVG activation/arrows, localized errors, no answer hints/ARIA leaks, reduced-motion CSS, readable long Czech text, controls/hexagons at least 44 px in tested layouts, both-theme screenshots and actual browser interaction |
| Lifecycle | Aborted view/input listeners, owned timeouts, captured processing context and disposed-session rejection; no animation frames. Focus/visibility/new-game overlay invalidates duels without awards; modal never pauses question time. Real pagehide and adapter tests |
| Coverage | All 25 production JS files measured, plus membership enforcement; only type-only `src/domain/types.js` excluded. Separate critical and remaining thresholds enforced, not combined |

Relevant changed files:

- `src/app.js`, `src/main.js`, `src/style.css`, `index.html`.
- `src/ui/{dom,strings,setup,board,game,round,host,header}.js`.
- `src/runtime/{clock,keyboard}.js`.
- `src/content/catalog.js`, `general-cs-01.json`, `general-en-01.json`.
- `src/messages.js` / `tests/boundaries.test.js`: remove obsolete foundation-only
  shell message; domain rules were not modified.
- `tests/{content,keyboard,runtime,ui}.test.js`, `browser/{helpers,game.spec,duels.spec,visual.spec}.js`.
- `package.json`/lockfile, `vitest.config.js`, `playwright.config.js`,
  `scripts/check-coverage.js`, README/contracts/plan/ledger and the approved
  coverage-only additions to coding/review instructions.

Final code-bearing verification (run sequentially, not concurrent build writers):

- `npm run format`: passed.
- `npm run check`: passed formatting, lint/metrics, strict JSDoc types, **95 tests
  in 10 Vitest files**, enforced coverage, and Vite production build.
- `LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser`:
  **29 passed**, Chromium, real production bundle, port **4182**. The managed
  server was stopped after the run. `git diff --check`: passed.
- `.artifacts/check.log` and `.artifacts/browser.log` contain exact final output.
  `coverage/index.html` / `coverage/coverage-summary.json` contain measured
  per-file coverage; no browser success was counted as statement coverage.

Measured coverage on the candidate:

| Group | Lines | Statements | Functions | Branches |
| --- | --- | --- | --- | --- |
| Critical: domain, runtime, application orchestration (14 files) | 1324/1330 = **99.55%** | 1342/1348 = **99.55%** | 79/79 = **100%** | 364/375 = **97.07%** |
| Remaining: all UI, entry point, catalog, messages (11 files) | 1129/1143 = **98.78%** | 1134/1148 = **98.78%** | 49/50 = **98%** | 174/189 = **92.06%** |

Full group membership is printed in `.artifacts/check.log`. jsdom tests exercise
the real app/engine; only missing dialog and scroll browser primitives are
adapted there. Chromium independently verifies real modal/SVG/focus/layout
behavior. Phase-1 coverage was never measured or claimed.
Negative gate checks also passed: zeroing either scope group's measured counts,
or omitting a runtime file, caused exit 1 each time. The genuine coverage report
was restored byte-for-byte; evidence: `.artifacts/coverage-enforcement.log`.

Visual/factual evidence (local ignored artifacts, not publication):

- `.artifacts/browser-report/index.html`; `.artifacts/playwright/visual-*`
  contains full-page/viewport question screenshots and captured boards for
  **1280×720, 1920×1080, 1024×768 and 768×1024**, in both themes.
- Representative inspected images:
  `visual-1280x720-dark-reada-6d462-long-question-and-ownership/question-viewport.png`,
  `visual-1024x768-light-read-d4e31-long-question-and-ownership/question-full.png`,
  `visual-768x1024-dark-reada-814c1-long-question-and-ownership/question-viewport.png`
  (all beneath `.artifacts/playwright/`).
- English setup/custom-white-player-color/number-board/black-field/duel images:
  `.artifacts/playwright/visual-English-hosted-numb-cf322-lack-fields-distinguishable/`.
- Win image:
  `.artifacts/playwright/game-host-corrections-crea-77c01-he-original-locked-question/winning-connection.png`.
- `.artifacts/content-audit.json`: all 56 question IDs/answers/prefixes and
  **57 accessed factual URLs**, checked 2026-10-28, Wikipedia/NASA/NOAA/CDC.
  Question wording is original; every shipped entry still needs independent
  factual/linguistic review rather than relying on schema validity.
- `.artifacts/phase-02-snapshot.sha256` records all changed/untracked source
  snapshot hashes for the independent review.

Design/tuning decisions:

- Domain engine untouched; the application orchestrates one authoritative state.
  Pure rendering helpers remain functions. `App`, `RoundClock` and
  `DuelKeyboard` own actual resource lifetimes; no generic framework, runtime
  dependency or speculative abstraction was introduced.
- 2 s preview, 900 ms cadence, at most five circle/triangle/square/star symbols.
  Stationary shapes with no flashing/animation/sound provide readable, restrained
  timing. A target always occurs. Presses within 8 ms form an indistinguishable
  tie batch; boundaries cancel pending input. This avoids keyboard-order bias,
  but does not claim perfect cross-device timing fairness.
- In-memory focus/visibility interruption is included for basic correctness.
  Opening new-game confirmation similarly invalidates a duel, never awards an
  unseen field, and does not reset/pause question time. Navigation loses the game;
  returning through the browser's page cache starts a fresh page.
- Scroll the below-board question into view as needed; repeat active player in
  its heading so the actor remains clear even when the board header scrolls out.
- No metric exceptions. Buttons/selects/text inputs are at least 44 px high;
  readiness checkboxes have larger clickable labels. Measured field widths also
  exceed 44 px at every inspected viewport.

Environment limitations resolved without server changes:

- The initial Vite dev-server browser run hit exhausted shared file watchers.
  Browser verification now builds and uses Vite preview, requiring no watchers.
- Chromium was initially missing; Playwright's Node downloader timed out.
  The matching Chrome-for-Testing headless archive was downloaded with `curl`
  from Google's public storage and extracted locally into `.artifacts/browsers/`.
- Missing Debian browser libraries were downloaded with `apt-get download` and
  extracted using `dpkg-deb -x` into `.artifacts/browser-libs/`; no global package
  install, sudo, sysctl, service or shared configuration change was made.

Actual remaining scope/limitations: independent phase review and mandatory
coordinator post-review gates; only two starter packs rather than the full
library; no persistence/reload recovery, editor/import/export/printing, remapping,
gamepads or touchscreen buzzer support. Layouts are browser emulation, not
physical tablet/Xbox verification. Screen-reader-device testing, name clearance
and deployment remain pending later gates. No production release claim.

### Phase 2 independent review and fixes

Reviewer `a91c7cd7-25a2-448f-aaab-84a487c35802` returned CHANGES REQUIRED.
Full initial report: `reviews/phase-02.md`. Findings:

- P2-01: missed Shift keyup after blur can silently block duel restart.
- P2-02: theme/language switching discards an in-progress answer draft.
- P2-03: basalt question overstates its share of the oceanic crust.
- P2-04: light-theme input border contrast is below 3:1.

All initial automated checks passed, but they did not detect these defects.
Next action: same developer fixes all four with regression evidence, then the
same independent reviewer rechecks the frozen candidate. Only after clearance
will the coordinator run mandatory post-review checks and commit/push.

### Phase 2 finding corrections — developer handoff, 2026-10-28

P2-01 through P2-04 are implemented and regression-tested. **Not cleared: stop
edits for the same reviewer** (`a91c7cd7-25a2-448f-aaab-84a487c35802`).
The original review verdict/findings remain preserved; per-finding developer
responses are appended to `reviews/phase-02.md`.

- P2-01: explicit press/release rearming for both Shift keys after every duel
  interruption, including another focus loss while already interrupted. Only
  focused/visible observed keyups satisfy it. Held/repeat filtering remains;
  rearming cannot capture. Blocked restarts now give actionable cs/en feedback
  beside the readiness controls. Stale restart actions stay silent.
- P2-02: preserve unsent typed drafts only during presentation changes for the
  same exact opportunity. Drafts stay outside authoritative game state. Handover,
  resolution and next-question renders do not inherit text.
- P2-03: narrow English B/Basalt to cooled erupted mid-ocean-ridge lava, retain
  fixed identity/placement, add the verified BCcampus geology source. Audit now
  includes 58 accessed URLs; the original volume claim is explicitly corrected.
- P2-04: light identifying border `#6f8299`, with actual computed border/interior/
  surroundings contrast checks in both themes. Panel ratios 3.940749:1 light and
  3.875206:1 dark; header exterior ratios 3.373936:1 and 4.703012:1.

Changed implementation in this correction round:
`src/app.js`, `src/runtime/keyboard.js`, `src/ui/{round,strings}.js`,
`src/style.css`, `src/content/general-en-01.json`. Tests:
`tests/{keyboard,ui,content}.test.js`, `browser/duels.spec.js`,
`browser/review-fixes.spec.js`. Documentation: README, contracts, this ledger and
appended developer response in the review report. No instruction rules, domain
rules, dependencies or unrelated implementation were changed.

Final sequential `npm run format`, `npm run check`,
`LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser`
and `git diff --check` passed: formatting, lint/metrics, types, **100 tests in
10 Vitest files**, enforced coverage, build, and **35 Chromium tests**. No skips
or exceptions. No new browser/dependency installation was needed; preview port
4182 is stopped.

| Group | Lines | Statements | Functions | Branches |
| --- | --- | --- | --- | --- |
| Critical (14 files) | 1365/1369 = 99.71% | 1383/1387 = 99.71% | 83/83 = 100% | 392/399 = 98.25% |
| Remaining (11 files) | 1135/1149 = 98.78% | 1140/1154 = 98.79% | 49/50 = 98% | 174/189 = 92.06% |

All 25 runtime JS files remain included; only type-only `src/domain/types.js`
is excluded. Coverage evidence is `.artifacts/review-fixes-check.log` and
`coverage/`. Browser output is `.artifacts/review-fixes-browser.log`; new
screenshots are `.artifacts/playwright/review-fixes-*/`. Recorded computed
styles/ratios are `.artifacts/review-fixes-control-contrast.json`; source
correction evidence is `.artifacts/content-audit.json`. Detailed reproductions
and artifact names are in the appended review response. The new frozen
candidate manifest is `.artifacts/phase-02-snapshot.sha256`.

Headless blur/missed-keyup boundaries are simulated explicitly, not claimed as
physical focus/device verification. The original later-phase scope limitations
remain. No commit, push, deployment or shared-system changes. Next action is
same-reviewer re-review, then coordinator-owned post-clearance checks.

### Phase 2 clearance and post-review verification

The same reviewer cleared all four findings without new issues or metric
exceptions. Report and original review history: `reviews/phase-02.md`.
Coordinator verified the frozen manifest, then reran `npm run check`, the
documented Chromium command and `git diff --check`: all passed, including
100 unit tests, 35 browser journeys and both separate coverage gates.
Critical coverage: 99.71% lines/statements, 100% functions, 98.25% branches.
Remaining: 98.78% lines, 98.79% statements, 98% functions, 92.06% branches.

Phase 2 committed and pushed as `fbee41da9bb02390a3cbc72e9dca0109b302e4cf`;
remote `main` SHA verified. No public deployment or later-phase feature claimed.

### Phase 3 starting snapshot

Baseline: `fbee41da9bb02390a3cbc72e9dca0109b302e4cf`. Next action: fresh
developer implements preparation, validated imports/editor/generation/exports,
answer sheets and custom-pack/settings storage, with both coverage gates and
real browser tests. Lock started-game content and preserve all phase-2 flows.

### Phase 3 developer handoff — 2026-10-28

Baseline: `fbee41da9bb02390a3cbc72e9dca0109b302e4cf`. The candidate is
uncommitted. **Implementation stopped for independent review; not cleared.**
Coordinator phase-start changes are preserved. No commit, push, deployment,
dependency installation, nested agent, shared-server change or phase-4 feature
was performed. `reviews/phase-02.md`, `AGENTS.md` and `REVIEW.md` are unchanged.

Acceptance and evidence:

| Requirement | Implementation / evidence |
| --- | --- |
| Both-language/theme host and automatic preparation | Composed setup → source selection → proposal/editor → acceptance → start; `src/ui/{setup,preparation,editor,preparation-strings}.js`. Keyboard focus moves into a new editor and back to acceptance after saving; large labeled file-import target avoids browser-language file-control text. Eight preparation layout/theme journeys plus existing gameplay layouts |
| Selected-source number generation | Pure `src/domain/generation.js`: 28 distinct normalized question texts, injected shuffle, no catalog fallback, mixed-language/insufficient-content/ID-conflict errors. `tests/preparation.test.js` and actual multi-file browser imports |
| Fixed authored order and custom copies | `Preparation` owns validated drafts/accepted snapshots; fixed labels/order never shuffle. Question IDs stay stable, original assets remain unchanged. Number/source questions can move. Actual metadata/question/answer/alias/source editing is covered in DOM and Chromium tests |
| Export/reimport and rights | Existing v1 validator plus optional, documented `origins` attribution extension. Existing packs remain compatible. Every supported pack exports via the same validator; generated and edited round trips retain IDs/order/content/aliases and original plus editor attribution. Conflicting pack IDs never overwrite existing content |
| Content lock | Start uses a reconstructed accepted pack and locks preparation mutations; all content controls disappear for every game phase, including won. Async imports carry revision/sequence and reject stale results. Existing host corrections remain selecting/won only; reset/recovery-domain tests preserve the original pack |
| Exact private printable sheet | Accepted or played snapshot only; escaped, self-contained HTML with all 28 row-major cell IDs/question IDs/initials/questions/answers/aliases. Downloads contain no executable imported markup, controls or external fonts. Real downloaded HTML was opened in Chromium, checked row-for-row and printed to PDF; active-screen downloads reveal no aliases or editor |
| Local library/settings and failures | `LocalLibrary` validates the complete `hexy.library.v1` record before atomic localStorage replacement. Read/version/corruption failures block writes; quota/access failures preserve stored and in-memory work. Imports, saved copies, accepted generated boards and valid preferences persist. Explicit cs/en errors and JSON backup instructions; DOM/Chromium tests exercise unavailable, corrupt, incompatible and full storage |
| Existing behavior/lifecycle | All prior domain/duel/focus-rearming/draft tests retained. Downloads now share opportunity-scoped draft preservation without touching deadlines. Aborted view handlers, stale file reads and Blob URL disposal are covered. No gameplay recovery/controller/touch implementation |

Relevant changed/new files (complete hashes are in
`.artifacts/phase-03-snapshot.sha256`):

- `src/app.js`, `src/workspace.js`, `src/style.css`, `src/messages.js`.
- `src/domain/{types,packs,generation,preferences}.js`,
  `src/runtime/{preparation,library,downloads}.js`, `src/content/catalog.js`.
- `src/ui/{setup,strings,preparation,preparation-strings,editor,answer-sheet}.js`.
- `tests/{content,ui,preparation,library,workspace}.test.js`,
  `browser/helpers.js`, `browser/preparation{,-storage,-visual}.spec.js`,
  `browser/preparation-helpers.js`, `scripts/check-coverage.js`.
- README, contracts, factual PLAN updates and this handoff. The two bundled
  question JSON files are unchanged; content remains 2 packs / 56 starters.

Exact final verification:

- `npx prettier --write src tests browser/preparation*.js README.md docs/contracts.md PLAN.md IMPLEMENTATION_PHASES.md`:
  formatted only the named implementation/test/progress-document scope.
- `npm run check`: passed format, ESLint ceilings, strict JSDoc types,
  **131 tests in 13 files**, separate measured coverage gates and Vite build.
- `LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser`:
  **55 Chromium journeys passed**, including all 35 phase-2 journeys and
  20 preparation/storage/print/visual journeys. Browser-managed build/preview
  ran sequentially after check, on existing port 4182; no dev watcher/sysctl
  change, browser/library reinstall or competing build writer.
- `git diff --check`: passed. Logs: `.artifacts/phase-03-check.log`,
  `.artifacts/phase-03-browser.log`; report `.artifacts/browser-report/index.html`.

Coverage on this candidate:

| Group | Lines | Statements | Functions | Branches |
| --- | --- | --- | --- | --- |
| Critical (20 files) | 2052/2058 = **99.71%** | 2077/2083 = **99.71%** | 140/140 = **100%** | 585/599 = **97.66%** |
| Remaining (15 files) | 1771/1785 = **99.22%** | 1775/1789 = **99.22%** | 67/68 = **98.53%** | 255/275 = **92.73%** |

All 35 runtime JS files are included, including any untested paths. Only the
type-only `src/domain/types.js` is excluded; JSON data/generated build outputs
are not runtime JS. The checker now explicitly includes `workspace.js` in the
critical group, alongside `app.js`, all runtime adapters and all domain modules.
Remaining membership is catalog, entry point, messages and every UI module
(answer-sheet, board, dom, editor, game, header, host, preparation,
preparation-strings, round, setup, strings). Per-file/group membership and counts
are in the final check log and `coverage/coverage-summary.json`; high core
coverage cannot hide UI failures. Browser results are not statement coverage.
Negative enforcement checks zeroed each scope separately and omitted
`workspace.js`: each correctly exited 1; the original report was restored.
Evidence: `.artifacts/phase-03-coverage-enforcement.log`.

Inspected local artifacts (not publication):

- `.artifacts/playwright/preparation-visual-prepara-3947d-ch-targets-bilingual-editor/preparation.png`:
  Czech dark portrait preparation, spaced touch targets, visible acceptance,
  private-sheet guidance and start after preparation.
- `preparation-visual-prepara-d204f-ch-targets-bilingual-editor/editor-viewport.png`
  and `preparation-visual-prepara-55ef0-ch-targets-bilingual-editor/editor-viewport.png`
  beneath the same artifact directory: English light editor, readable long text,
  preserved stable identity and visible keyboard focus.
- `preparation-{en-fixed-custo-e55a4,cs-fixed-custo-62048}-print-mapping-and-game-lock/`:
  edited and played JSON/HTML, `answer-sheet-print.png`, `answer-sheet.pdf`.
  Both 28-row sheets were visually inspected; imported markup is literal text.
- `preparation-multi-source-n-455d9-hts-through-edited-reimport/`:
  `generated.json`, `edited-numbers.json`, `numbers-sheet.html`.
- `preparation-storage-{quota--75171,unavai-d3399}-ever-destroys-a-custom-pack/unsaved-copy.json`:
  successful real downloads despite failed storage.
- `.artifacts/phase-03-artifacts.json` inventories the final browser artifacts;
  `.artifacts/phase-03-snapshot.sha256` is generated after all source/docs writing.

Design decisions / limitations:

- `App` retains the authoritative game/lifecycle; `Workspace` handles preparation
  I/O and feedback, `Preparation` owns preparation invariants, and pure generation
  reuses normalization/validation. Resource-owning library/download classes are
  concrete; no framework, generic form/state-machine system or runtime dependency.
  No metric exceptions or new input/resource caps.
- localStorage was chosen for a small static library and atomic whole-record
  writes. Browser quotas vary; exports are the backup. One editing tab is
  supported, not concurrent-tab merging. Corrupt data requires preserving and
  repairing/removing it externally before reload; the app never silently repairs
  or replaces it.
- Text deduplication is deterministic normalization, not semantic fact analysis.
  Source conflicts are rejected rather than silently reidentified/relicensed.
  Optional v1 origins are backward-compatible for old data, but pre-phase-3
  readers discard the extension; use this version for rights-preserving editing.
- Editor drafts/proposals and games are not recovered on reload. Downloaded
  sheets cannot be revoked; changes invalidate acceptance/availability and require
  a newly downloaded sheet. Browser print/PDF and emulated tablet layout were
  verified, not a physical printer/tablet/Xbox or screen-reader device.
- Full content, recovery, remapping/gamepads/touch buzzers, name clearance and
  deployment remain later-phase scope. There is no independent phase-3 clearance
  or post-review coordinator verification yet.

The sheet also prints original/source attribution grouped by applicable cells,
so replacing a custom copy's top-level author/license does not strip its original
credits. A storage reread revokes old write permission before validation; a newly
corrupt record cannot be overwritten using a previously successful read.

Next action: independent reviewer inspects this frozen candidate and complete
manifest under `REVIEW.md`. Return concrete findings to this same developer;
only the coordinator may mark clearance after review and post-review checks.

### Phase 3 independent review

Reviewer `7fa31573-f8b3-496d-9e4a-4f196ada4c13` returned CHANGES REQUIRED;
report: `reviews/phase-03.md`. Main workflows and automated gates passed, but:

- P3-R1: no way to reduce an oversized custom library after a real quota failure.
- P3-R2: read-access failure advertises a retry that cannot save.

Next action: same developer implements safe, usable recovery and regression
evidence, then same-reviewer re-review. No phase-3 commit/push or progression yet.

### Phase 3 storage findings — developer re-review handoff

P3-R1 and P3-R2 are implemented; **not cleared, edits stopped for the same
reviewer** `7fa31573-f8b3-496d-9e4a-4f196ada4c13`.
The initial review and original handoff remain historical evidence. Developer
responses and reproductions are appended to `reviews/phase-03.md`.

- P3-R1: explicit per-custom-copy export, confirmed exclusion from the next local
  save, cancellation and re-inclusion/retry. Filtering affects persistence only;
  in-memory copies, selected/accepted preparation and locked gameplay are
  unchanged. Successful saves omit excluded copies on reload; failed saves
  preserve the old stored record. No bundled deletion, arbitrary cap, schema
  change or new database. Real 6 MiB provenance-note quota failures in Chromium
  recover by excluding the exported copy and reloading the unchanged normal pack.
- P3-R2: distinct initial-read denial guidance in cs/en requires export, enabled
  storage, validated reload and reimport. It no longer advertises impossible
  edit-only retries. Both-language tests restore access, verify unread records
  remain unchanged during retries, and complete the documented recovery.

Final sequential commands:
`TMPDIR="$PWD/.artifacts" npm run check`,
`LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser`,
`git diff --check`: all passed. **134 unit/DOM tests**, **59 Chromium journeys**,
lint/format/types/build and both coverage groups. Logs:
`.artifacts/phase-03-storage-fixes-check.log` and
`.artifacts/phase-03-storage-fixes-browser.log`.

| Group | Lines | Statements | Functions | Branches |
| --- | --- | --- | --- | --- |
| Critical (20 files) | 2075/2081 = 99.71% | 2100/2106 = 99.72% | 141/141 = 100% | 597/611 = 97.71% |
| Remaining (16 files) | 1868/1882 = 99.26% | 1872/1886 = 99.26% | 69/70 = 98.57% | 270/290 = 93.10% |

All 36 runtime JS files are included; only type-only `domain/types.js` is
excluded. New `ui/library.js` is remaining UI, while filtering remains in critical
`workspace.js`. No metric exceptions or runtime dependencies.

Changed finding-specific scope and exact artifact paths are in the appended
review response. The complete candidate manifest is
`.artifacts/phase-03-snapshot.sha256`, regenerated after all writing; final browser
evidence is inventoried in `.artifacts/phase-03-artifacts.json`.
Initial reviewer probes, phase-2 history, instructions and bundled JSON are
preserved. No installs, other agents, commits/pushes or deployment. Running-game
recovery remains phase 4; exclusion is not gameplay editing or an unlock.

Next action: same-reviewer re-review, followed only after clearance by the
coordinator's post-review gates. This response does not clear either finding.

### Phase 3 clearance and post-review verification

Same independent reviewer cleared both storage findings without new issues or
metric exceptions. Initial findings, fixes and final outcome are preserved in
`reviews/phase-03.md`. Coordinator verified all frozen hashes, then sequentially
reran full `npm run check`, the documented Chromium suite and `git diff --check`.
All passed: 134 tests, 59 browser journeys, format/lint/types/build and both
coverage gates. No code changed after re-review.

Next action: commit/push phase 3 and verify the remote SHA before phase 4.
No running-game recovery, gamepad/touch support or public deployment is claimed.
