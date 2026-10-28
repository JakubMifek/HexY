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
| 1 | Tested domain foundation and contracts | 0 | Cleared; commit/push pending | [CLEARED](reviews/phase-01.md) |
| 2 | Playable local quiz with keyboard duels | 1 cleared | Not started | Not started |
| 3 | Pack preparation and host answer sheets | 2 cleared | Not started | Not started |
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

Next action: commit/push phase 1 and verify the remote SHA, then start phase 2.
The implementation remains a nonplayable foundation; no later phase is claimed.
