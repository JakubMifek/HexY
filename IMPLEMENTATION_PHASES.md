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
| 1 | Tested domain foundation and contracts | 0 | Starting | Not started |
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
Only planning/instruction Markdown files have been created or changed.
No developer/reviewer sessions, installations, application code, commits or
deployment have started.

The user has now explicitly requested: commit and push the plans, start
implementation, thoroughly test each phase after review, and commit and push
each cleared phase before moving to the next.

The directory/tool blocker was resolved on 2026-10-28 after the session working
directory changed to `/home/jakubmifek/github/HexY`. A shell check verified this
directory, branch `main`, and origin `https://github.com/JakubMifek/HexY.git`.

Next action: commit and push the approved planning/instruction files, record the
starting snapshot and launch the phase-1 developer. Use the required Copilot
co-author trailer on commits.
