# HexY: Product and Implementation Plan

## Status and instructions for the next session

Last updated: 2026-10-30.

**Owner category decision, 2026-10-30 17:15:** broaden Programming to
**Computing and Programming**, retaining the **general-adult Easy / Medium /
Hard** rubric. The selected option was: "Broaden to Computing and Programming;
keep general-adult difficulty". This includes general computing and practical
computer literacy as well as genuine programming; it does not make difficulty
relative to novice programmers. Keep the existing `programming` category ID
for format compatibility, with localized display names "Computing and
Programming" / "Informatika a programování". Apply the scope consistently to
both languages, all three levels and phases 11/12; retain all quotas.
The coordinator must reassess affected category-fit judgments and any remaining
factual, alias, disclosure or difficulty findings under this explicit amendment.
Preserve accepted factual evidence through exact hash continuity; do not
auto-clear the previously rejected questions or discard the historical review.
The scope-decision blocker is resolved, not the phase gate. Resume paused
bounded work from its checkpoints; General phase 12 and the visual bundle
remain exclusively owned by the separate preparation session.

**Owner scheduling amendment, 2026-10-30 16:03:** phase-12 preparation may
overlap phase 11 for already accepted categories; the bundled visual changes
may be developed in an isolated worktree concurrently. Phase-11 review and
separate integration/delivery gates remain mandatory. Check both phases'
accepted and staged questions, canonical answers, aliases and semantic facts
for duplication before authoring and again at integration. The original
coordinator remains sole main-checkout integrator. A bounded preparation
session reserves phase-12 General knowledge and the visual bundle; do not
duplicate those assignments. Read the operational ownership and safeguards in
`.artifacts/continuation/CROSS-PHASE-PARALLELISM.md` and its linked status before
launching phase-12 or visual work. This supersedes sequential-start statements
below, not the library quotas or review standards.

This is the handoff document for a new, publicly hosted, browser-based quiz
inspired by the mechanics of the Czech television show AZ-kviz. The selected
project name is **HexY**. Name/trademark availability has not been cleared.

GitHub repository: https://github.com/JakubMifek/HexY

The repository was renamed from JakubMifek/azquiz with the user's approval.
The local checkout was also renamed with the user's approval and is now at
/home/jakubmifek/github/HexY. Its origin remote points to the renamed repository.

The repository was empty when planning began. Phase 1 established a tested
domain foundation; phase 2 now has an independently reviewed playable local game.
This document
records the conversation's decisions; do not assume that proposals below have
been approved.

**Current stage, bounded recovery 2026-10-31: phase11 independently CLEARED,
complete coordinator postreview gates passed; authorized private delivery is
next.** Exact catalog132/3696, all eleven categories12/336/two per language/
difficulty; all2,800 additions/ratings and historical corrections retain complete
independent acceptance. Four Entertainment archives contribute zero quota.
Final review preserves original findings, sealed factual/support/semantic
receipts and all accepted aliases. Fullquality867tests/34files, both57-module
coverage groups, format/lint/types/build, **1433nativecases** and65negative
coverage probes pass. Private pre-difficulty upgrade canary is captured on actual
HTTPS before promotion; incompatible original data must remain byte-for-byte
exportable, not automatically migrated.
Sole integrator is new low-memory session `8bcfc276-2d9b-4c1a-bfb9-911a6eda1686`;
retired coordinator/worker IDs are historical, not active. Phase12 retained work
is paused; General's independently ACTIVE originalsessionc2ac2e6b remains its
exclusive owner. No category fanout or quota reduction is authorized.
After phase11 delivery, adopt exact reviewed visualpatch88d2b3ad through separate
integration/review/postreview/private delivery, then stop before phase12.
See [current handoff](docs/phase-11-handoff.md) and
[review history](reviews/phase-11.md).
Phase 9 passed independent review and complete
coordinator post-review gates. The initial
CHANGES REQUIRED verdict and subsequent clearance are preserved in
[the phase-9 review](reviews/phase-09.md). Phase 8 was accepted for
private delivery, with public-release work retained as follow-ups.
On 2026-10-29 the owner instructed: "commit and push. keep these as followup work.
Plan is finished". This explicitly closes the current plan and authorizes delivery
without claiming the original public-release gate passed. The independent review
found no implementation defects; its historical BLOCKED verdict is preserved.
See the [follow-up register](docs/release-readiness.md#follow-up-work).
The requested private automatic-main Tailscale preview is now operational:
actual HTTPS and automatic-after-push updates were verified without disrupting
an open game. This is not phase-8 public-release clearance. See
`reviews/phase-07.md` for the final source audit and verification evidence.
The historical 36 packs / 1,008 entries were independently cleared in phases 5–7;
that clearance does not cover the new phase-11 entries. The owner chose to keep
the preview private and retain HexY pending a proper conflict assessment.
The owner authorized a future limited initial release with controller/tablet
support explicitly unverified/experimental and the stated browser/accessibility
gaps. This does not claim physical Xbox/tablet, human screen-reader, Safari/WebKit
or remote Windows client verification, or authorize publication.
The [phase-8 review](reviews/phase-08.md) found no implementation defects;
public-hosting evidence and naming assessment remain future publication gates,
not blockers to the owner-authorized private delivery.
The [release decision brief](docs/release-readiness.md) records concrete
Hexy-name uses and a potentially relevant EU class-9 record reported by TMview,
with register/scope limitations; naming is not cleared. It also proposes an
isolated public hostname/path for approval without exposing the private preview.
The [phase-8 handoff](docs/phase-08-handoff.md) accounts for all acceptance
criteria and distinguishes software evidence from blocked public/human gates.
The name, broad visual direction, logo concept, stack, core rules, host overrides
and recovery policy are selected. The user requested iterative development with
a developer session and independent usability/readability/OOP/design-pattern
reviews after each phase. On 2026-10-28 the user approved the instruction files
and phased approach, authorizing that process.

Read these companion documents:

- `AGENTS.md`: coding standards, architecture discipline and developer handoff.
- `REVIEW.md`: independent review lenses, findings and clearance rules.
- `IMPLEMENTATION_PHASES.md`: bundled phases, acceptance gates and progress ledger.

All three are approved. Follow the phase gates; the session-directory blocker
is resolved. See the phase ledger for the current foundation handoff.
Name clearance, deployment details and technical refinements remain below.
The user explicitly requested this order:

1. Record a plan that an independent session can pick up.
2. Discuss and agree on branding and visual identity.
3. Discuss and agree on technology choices.
4. Only then proceed to implementation following the plan.

The requested instruction-review gate is complete. Update this document as
decisions are made. Inspect the worktree before editing;
preserve unrelated changes. Ask for product decisions with context, not for the
user to perform development tasks.

## Product constraints: confirmed

### Phase 10: temporary mixes and simple controls — approved 2026-10-30

- Stop automatically saving generated mixed decks into the local library.
  Preserve ambiguous historical entries and provide explicit selective removal,
  while preserving all unselected custom decks, bundled content, settings and
  active game recovery. The owner approved this fallback on 2026-10-30: legacy
  automatic acceptance and explicit reimport produce identical stored records
  without an origin flag. Do not infer deletion from titles or question provenance.
- Owner amendment during review: place **Delete / Smazat** beside each saved
  copy's JSON download, without an expandable removal header. Require an
  explicit localized confirmation; cancellation and storage failures preserve
  protected data.
- Victory retains its screen and valid host corrections until the user leaves.
  For both finished and early-exited games, offer Save and return to menu,
  Return without saving, and Cancel. Save initiates a complete portable JSON
  download before cleanup; failed initiation must not discard the game.
  Only confirmed departure clears the current game's local recovery and
  temporary mix. Reload before departure still restores the game.
- Add visible spacing between Back and Controls in Options.
- Replace the verbose controls editor with two duel-binding rows, one per
  player. Click Record, then press a keyboard key or controller button.
  Recording replaces that player's previous binding, including its device
  kind; keep only one keyboard-or-controller binding per player. Retain the
  on-screen touch buzzers as the existing accessible alternative.
- Escape cancels capture; reject duplicate bindings with localized feedback.
  Opening/closing/cancelling recording must not capture the initiating click,
  a held/repeated input, stale input, or trigger gameplay. Preserve safe fresh
  press/release duel rearming and device-disconnect handling.
- Keyboard arrows and controller D-pad/left stick move the board selection;
  Enter and controller A confirm it. Navigation is active only when selecting
  playable cells, never while typing, in a modal, during a question or duel.
  Require neutral/release edges and suitable stick deadzone/repeat handling.
  Both controller and keyboard paths use the same board selection semantics.
- Version and validate changed control preferences and portable-game metadata;
  preserve compatible legacy saves and explicit failure reporting. Browser
  controller connections are not durable device identities; do not silently
  assign a replacement device or claim physical-device verification.

The owner explicitly chose temporary generated mixes with historical cleanup,
the final-export dialog for both finish and early exit, one replacement binding
per player, and both D-pad/left-stick navigation. Prior public-release follow-ups
remain deferred. Use the existing developer/reviewer/post-review delivery loop.

### Phases 11 and 12: difficulty library and folder catalog — approved 2026-10-30

Owner follow-up, 2026-10-30 15:37: publish immutable completed 2–4-deck review
batches, with full first-deck entry review and early difficulty calibration at
each level. Preserve already frozen category reviews rather than restart them.
Corrections require fresh judgment only on changed questions/evidence, with
exact unchanged question AND supporting-evidence hash continuity; expand scope
where a shared source/rubric change invalidates prior judgments. All-entry initial
review and complete category/final phase gates remain mandatory.

After phases 11 and 12 are delivered, one approved visual phase bundles enlarged
selected tiles during their existing initial-reveal flip, a full-to-empty clockwise
countdown in the answering player's configured color derived from the authoritative
deadline, and consistent defaults A `#129FB5` / B `#FBA123` in both themes.
Preserve explicit custom and saved/imported colors, reduced motion, focus/fit,
untimed opponent/duel behavior and timing/recovery/stale-resource invariants.

Owner scheduling amendment, 2026-10-30: remaining category authors and independent
frozen-bundle reviewers may run meaningfully in parallel in category-specific
ignored staging directories. The coordinator remains the sole shared-checkout
integrator; authors must not edit shared source/catalog/tests/docs. Start with
approximately four authors, adjust to observed throughput and review backlog.
Reuse complete accepted reviews through exact hash continuity. Central quality,
coverage, build and preview runners remain serialized. Integrate reviewed bundles
only; complete per-entry factual/editorial review and final independent phase and
coordinator post-review gates remain mandatory. Phase 12 production starts only
after phase-11 delivery. This supersedes older serial-content scheduling, not
quality, data, private-hosting or scope constraints. No spending ceiling supplied.

Begin phase 11 only after phase-10 reviewed delivery. Keep the eight categories
other than Entertainment; replace Entertainment with exactly Games,
Movies/Series and Sports, giving eleven categories. Games includes video, board
and card games; Movies/Series includes animation. Do not add Music.

Use localized Easy, Medium and Hard levels for a general adult audience:
common general knowledge, informed general knowledge, and specialist but fair,
unambiguous knowledge respectively. Do not fabricate or force obscure clues
to satisfy initials. Phase 11 delivers exactly **132 decks / 3,696 questions**:
11 categories × 3 difficulties × 2 decks × 2 languages, 28 questions per deck.
After phase-11 reviewed delivery, phase 12 adds three decks per combination,
giving exactly **330 decks / 9,240 questions** (five per combination).
Existing reviewed entries may be retained and reclassified; changed category,
difficulty or wording requires explicit review and ledger accounting.
Every shipped new entry requires complete factual-source, natural-language,
initial, alias and independent editorial review, not sampling or schema checks.

Use expandable category folders instead of a category filter, with whole-folder
or individual-deck selection, matching counts, partial-selection state and clear
difficulty markings. Put manually uploaded/custom decks in a separate folder.
Folder selection affects only decks matching the current visible filters.
Alphabetical mode still requires exactly one authored deck; number mode mixes
eligible selected sources. Folder selection must not enable an invalid
multi-deck alphabetical start.

The only main filters are **Origin and Difficulty**. Remove the Language filter:
questions are prefiltered by the unified game/UI language chosen in Options.
These latest decisions supersede the earlier queued Language/Origin/Difficulty
wording.

Imported decks must declare difficulty; missing difficulty is an actionable
localized validation error. The owner declined Unrated and legacy import
compatibility. This does not authorize deleting old browser records or
invalidating active games without explicit protected recovery/export.
Known bundled legacy snapshots may have an explicit migration; never guess
difficulty for arbitrary uploads. Document format compatibility deliberately.
No phase-11/12 implementation or content clearance is implied by this approval.

### Phase 9: guided UI redesign — approved 2026-10-29

This amendment supersedes conflicting earlier presentation requirements and
the finite duel rotation described below, not other game rules, immutable started
content, timing safeguards or quality gates.
The original plan's public-release follow-ups remain deferred.

- Fresh entry shows a simple menu: New Game, Options, Import Game. Reload of an
  active game still restores it. Options contains question duration (30 seconds
  by default), starting player (random by default), game controls and a single
  game language applied to both UI and newly selected questions.
- Keep the theme toggle in its existing header position, using sun/moon icons
  with no visible text; retain a localized accessible name. Remove fullscreen
  controls everywhere; users can use the browser's own fullscreen shortcut.
- New Game opens player setup: A/B names default to distinct randomly chosen
  Lord of the Rings character names; colors default appropriately for the theme.
  Allow names/colors and human or digital host selection.
- Next is board/deck setup: two visual choices, Number tiles (primary) and
  Alphabetical tiles, followed by a dynamic, polished deck-selection form.
  This is the last setup page; preserve eligible-source generation and fixed
  authored placement. No question-set access during gameplay.
- A human-host session must initiate its exact HTML answer-sheet download before
  starting; digital-host sessions do not offer it. A browser cannot verify
  whether the user actually saved a download to disk.
- Import Game accepts a complete saved-game JSON, not question-pack JSON, and
  restores players, settings, board and progress directly without setup.
  Validate the complete portable format, preserve current valid data on failure,
  keep original deadlines and explicitly restart imported interrupted duels.
- Gameplay is centered. Header actions are Exit Game and Save Game (complete
  portable JSON download), with no input-controls or fullscreen button.
  Exit confirms ending the game and returns to the menu; use the downloaded
  save to resume later. Reload continues to recover an active local game.
- Human-host commands sit to the right of the grid. Put the host's chooser
  override in each player's name box; preserve existing phase restrictions.
  Questions remain below the board in ordinary layouts.
- No page or panel scrolling in gameplay. Define generous validated text limits
  and supported viewport constraints; unusually long questions may cover part
  of the board instead of clipping text or hiding actions. Test actual fitting
  at supported laptop/tablet viewports, not just overflow suppression.
- Use exactly circle, star, square, triangle, hexagon, heart and sun in duels.
  Preselect and show one target before the duel. Keep that target fixed throughout
  uninterrupted random rotation, including missed targets and ties. Randomized
  bounded cycles include all seven symbols and continue indefinitely without
  returning to readiness/preview when a target is missed. A tie restarts a random
  active cycle without an award; a real interruption requires fresh readiness.
  Preserve the 2-second preview, 900-ms cadence, wrong-symbol awards, tie window
  and stale-event protection. Bound saved state and guarantee target appearances;
  do not pre-generate an unbounded sequence. Version/validate new saves and
  explicitly handle the earlier four-symbol saved-game format.
  Remove verbose duel instructions;
  retain target/current-symbol presentation, concise control hints, on-screen
  buzzers and necessary localized failure/status feedback.
- Restart the preview automatically once both players press and release their
  assigned controls after an interruption. No readiness checkboxes or extra
  restart click. Preserve release/hold suppression, focus/device safety and stale
  event guards; the rearming press must never award a tile.
- Won tiles show only their owner's color, with no A/B symbols or player-specific
  border styles. Black tiles retain their identifier without the ×. The owner
  explicitly accepts reduced color-vision accessibility for this presentation;
  retain accessible ownership names, keyboard focus and winning-group feedback.
- Selecting an unclaimed question tile flips it to reveal its full authored
  answer initial on the tile, including Czech `Ch` and English `CH`/`SH`.
  Alphabetical tiles also flip, retaining their known initial. The initial stays
  throughout the question and opponent opportunity. Black-duel selection keeps
  the original identifier; resolved owned/black tiles retain the rules above.
  Native presentational animation must not delay the question/deadline or drive
  game transitions. Renders, theme changes, ticks and recovery do not replay it;
  reduced motion reveals immediately. Pointer and keyboard selection both work.

These behaviors were confirmed with the owner, including full-save-only import,
automatic press/release restart, color-only ownership, non-scrolling layouts with
generous text constraints/board overlap, and reload recovery versus confirmed exit.
Implementation must include focused regressions, real browser visual evidence,
independent review and coordinator post-review gates before private delivery.

- One static JavaScript-based webpage, organized into multiple files.
- Public source repository and public hosting on the user's existing server.
- No sign-in required.
- Two local players sharing one computer/screen, using a keyboard or locally
  connected wired/wireless controllers. Internet multiplayer is not in v1.
- Support both number-board and answer-initial-board gameplay in v1.
- Support both host-judged spoken answers and automatically checked typed answers.
- Original public branding and assets, not the television show's branding.
- Both light and dark themes.
- Glossy game-show hexagons with pronounced bevels, highlights and borders.
- Modern quiz-studio personality: polished, tactile and restrained.
- Question panel below the triangle board.
- Cyan and amber default player colors; allow player color configuration.
- Czech and English question content.
- Czech and English interface, with a language switch.
- Desktop/laptop and tablet support. Phones are out of scope for v1, including
  preparation-only phone support; they may be considered later.
- No pause during answers. Players take breaks between questions by not
  selecting the next hexagon.
- MIT license for original code; CC BY 4.0 for original question content/artwork.
- No application backend is required by the agreed local-play scope.

Static hosting does not conceal answers: users can inspect downloaded data and
source files. Design for friendly local play, not cheat-resistant competition.
Local imports must not be described as public uploads.

## Confirmed game rules

### Board and setup

- Filled triangular board with seven hexagons on each edge.
- Seven rows of lengths 1 through 7: 28 cells total.
- Number mode identifies unclaimed cells uniquely as 1 through 28.
- Letter mode shows answer initials before selection.
- Each player has an assigned color.
- Starting player can be selected manually or chosen randomly.
- Question time limit is configurable; default 30 seconds.
- Timer starts immediately when the question appears, in both answer modes.

### Question turn

1. The active player chooses an available cell.
2. Reveal the question and its answer initial. In letter mode, the initial was
   already visible on the board.
3. The active player can try any number of answers within the time limit.
4. A wrong initial attempt does NOT immediately hand over the question.
5. A correct answer awards the cell to that player. It takes their color and
   loses its number/letter.
6. Timeout or giving up hands the same question to the opponent.
7. The opponent gets exactly one attempt, with no specified countdown.
8. A correct opponent answer awards them the cell; otherwise it becomes black.
9. After a capture, the opponent of the receiving player chooses next.
10. If neither player captures it, turns switch relative to the original chooser.
11. Check for victory after every capture, including lightning-round captures.

Required turn examples:

| Original chooser | Outcome | Next chooser |
| --- | --- | --- |
| A | A answers correctly | B |
| A | A fails, B answers incorrectly; cell turns black | B |
| A | A fails, B answers correctly | A |

Do not reveal the correct answer to players while the opponent's opportunity is
still available.

### Black fields and lightning rounds

- Selecting a black field starts a symbol-reaction duel.
- Show the players the target symbol, then show a sequence of random symbols.
- Once the target appears, the first valid player button press wins the field.
- A press on a wrong symbol awards the field to the opponent.
- Default keyboard bindings: Left Shift and Right Shift; bindings configurable.
- Support locally connected Xbox controllers where the browser supports them,
  with configurable player/button assignments.
- Capture and subsequent turn follow the same ownership-based rules as above.
- Black cells retain their original visible number/letter for selection.

Confirmed fallback rules:

- Require release before a new press; ignore key repeat and held buttons.
- Replay indistinguishable ties rather than systematically favoring a player.
- Repeat the sequence if neither player responds to the target.
- The target must eventually appear.

Still to define:

- Confirm target preview duration, symbol cadence, target display duration,
  and symbol set. Tune timing/difficulty during playtesting.
- Implement interruption recovery as specified below; define any explicit
  cancellation control separately.
- Explain that keyboard events and polled gamepads have different timing
  characteristics; do not claim perfect cross-device timing fairness.

### Victory interpretation

Confirmed boundary semantics:

- One connected component of a player's cells must touch all three board edges.
- Neighboring hexagons connect only across shared sides.
- Corner cells count toward both incident board edges.
- Disconnected groups collectively touching three sides do not win.
- End the game immediately after a winning capture and visibly identify the
  winning connected group.

### Interruptions and recovery: confirmed

- Manual pause during answers is explicitly excluded.
- Save game state locally and support recovery after reload.
- Timed questions keep their original deadline across focus loss and
  reload, rather than granting more answering time.
- A lightning duel interrupted by focus loss or controller loss is
  invalidated and explicitly restarted once both players are ready, without
  awarding the field or changing the chooser.
- Reload during a lightning duel follows the same invalidation/restart policy.
- Between questions, recovery restores the board and current chooser.

### Host overrides: confirmed

The user chose explicit host overrides instead of the proposed last-turn undo:

- In hosted mode, the host can manually set any hexagon to:
  - Default/unclaimed: fresh and selectable for its question again.
  - Player A or Player B: owned by that player.
  - Black: selectable for a lightning round.
- The host can independently override whose turn it is.
- Returning a cell to default makes its assigned question available again; it
  does not imply drawing a replacement question or changing the answer sheet.
- These controls are not requested for automatic mode.
- Preserve consistency of ownership, visible identifiers, eligibility, saved
  state and victory detection after changes.
- Protect corrections against stale timer callbacks and queued input events.
- Host cell and chooser edits are available only while choosing the next cell
  or after a declared win. No edits during an active question, opponent attempt,
  or duel (including preview/interruption/restart readiness).
- Manual cell edits preserve the chooser; changing the chooser is an independent
  host action. Ordinary gameplay still follows the recipient-based turn rules.
- Evaluate winning conditions immediately after every host change. Removing a
  winning connection after victory resumes cell selection, not an old round.
- Returning a cell to default between rounds allows its question to be selected
  again normally; host controls cannot pause/reset an active deadline.

## Answer modes

### Hosted mode: confirmed direction

- The host prepares/selects the game before play.
- Provide a downloadable answer sheet for the exact prepared game.
- The host decides how to keep that sheet on a device or medium not visible to
  players. The app does not need a separate private host window.
- The host judges spoken answers through appropriate game controls.
- Incorrect initial attempts must leave the active player's timer running;
  timeout/give-up hands over. Incorrect opponent attempts resolve to black.
- Do not add speech recognition.

Use the approved print-friendly HTML answer sheet with browser printing / Save
as PDF. A separate PDF-generation dependency is not approved.

### Automatic mode: confirmed

- Players type answers; the application compares them with known accepted answers.
- Ignore case, leading/trailing and repeated whitespace, and missing diacritics.
- Accept explicitly supplied answer aliases.
- Do not use fuzzy typo matching.
- Preserve language-specific board labels even though typed answer matching is
  diacritic-insensitive.
- Czech Ch and English CH/SH must be explicitly represented in pack data rather
  than inferred as one-character initials.

Still to define: punctuation/hyphen normalization and answer-vs-initial validation.
Host correction controls are scoped to hosted mode, not automatic mode.

## Question content and pack workflows

### Categories: confirmed

1. General knowledge
2. Nature
3. Politics and diplomacy
4. History
5. Computing and Programming (`programming`; Informatika a programování)
6. Geography and travel
7. Arts and literature
8. Science and technology
9. Games (video, board and card)
10. Movies/Series (including animation)
11. Sports

Proposed editorial distinction: Science and technology focuses on physics,
chemistry, engineering and inventions, rather than duplicating Nature or
Computing and Programming, which includes practical computer literacy as well
as programming under the same general-adult difficulty rubric. Prefer stable political institutions/concepts over changing
officeholders.

### Authored letter packs: confirmed scope

- Phase 11: two deliberately authored 28-question packs per category,
  difficulty and language: **132 packs / 3,696 entries**.
- Phase 12: five per combination: **330 packs / 9,240 entries** total.
- The prior nine-category, 36-pack / 1,008-entry inventory is the reviewed
  phases-1–7 baseline, not the phase-11 completion gate. Entertainment is replaced
  by exactly Games, Movies/Series and Sports; no Music category.
- Earlier discussion said 896 entries for eight categories. The user subsequently
  split Arts/literature and Entertainment into separate categories, increasing
  the total to nine; 1,008 is the resulting scope, not an additional content tier.
- Each pack is a fixed, single-run experience with predetermined cell placement.
- Do not randomly shuffle or draw questions for a bundled letter-board game.
- Czech and English packs are independently adapted. Translation alone generally
  cannot preserve answer initials.
- Questions must be independently written and fact-checked, not copied from the
  TV show or commercial quiz banks.

Czech board labels, in row-major order:

```text
A
B C
C-with-caron D E
F G H Ch
I J K L M
N O P R R-with-caron S
S-with-caron T U V W Z Z-with-caron
```

The descriptive ASCII spellings above mean the actual Czech characters
U+010C, U+0158, U+0160 and U+017D respectively. Render actual Czech letters in
the application. The authoritative visual order is also shown in reference 2
below.

English labels are A-Z plus CH and SH, with CH after C and SH after S:

```text
A
B C
CH D E
F G H I
J K L M N
O P Q R S SH
T U V W X Y Z
```

CH/SH are answer prefixes, not separate English alphabet letters. Each pack
explicitly assigns the answer to its intended label.

### Number-mode preparation: confirmed

- A host uploads their own pack or selects one or more bundled packs.
- From selected source packs, create and propose one randomized game pack.
- The host can accept, regenerate or manually modify the proposal.
- All packs, including generated ones, can be downloaded and reuploaded.
- Starting a game locks its questions, answers, accepted aliases, initials and
  prepared placement. Editing, regeneration or imports must not replace the
  running game's content. This lock survives recovery and host corrections.
- Host cell resets reuse the original question; they do not enable content edits.
  Edit a separate preparation for a new game, not an already-started game.
- Reuse authored letter-pack questions as the initial source banks for number
  games; no separate number-only question collection is required.
- Questions reused across game modes can be familiar to returning players;
  do not promise permanent cross-game novelty.

Proposed invariants:

- Generate 28 questions without repeats within a game.
- Combine only content in the selected language.
- Lock the prepared board before producing its matching answer sheet.
- Editing a bundled fixed pack creates a custom copy, not a mutation of the
  bundled original.
- Import/export preserves question identity, labels/placement where applicable,
  answers/aliases, language, category and provenance.
- Explain insufficient question counts or missing letter coverage explicitly;
  never silently mix in unselected categories.

### Editor, data and persistence: proposed design

- Built-in question/pack editor with validated JSON import/export.
- Versioned data format, with human-readable validation errors.
- Question fields: ID, question, initial/prefix, canonical answer, accepted
  aliases, category, language, and factual source/provenance.
- Pack fields: schema version, ID/title, language, board mode/placement where
  applicable, authorship, license and questions.
- Difficulty is mandatory and localized as Easy/Medium/Hard. Version-2 packs
  reject missing difficulty; preserve protected legacy browser records and
  provide exact-byte recovery/export rather than guessing imported levels.
- Treat imported text as text, never executable HTML.
- Imported private content retains its own rights; do not automatically apply
  CC BY 4.0 to arbitrary third-party imports.
- Browser-local preferences and custom packs; saved-game recovery is approved.
- No accounts, analytics or remote custom-pack publishing are proposed.
- User data is not safely backed up merely because it exists in browser storage;
  provide explicit export and document local-storage limits.

## Branding and visual identity

Confirmed:

- Project name: **HexY**, following the user's approval to rename the repository.
- Original public name, logo and visual identity; no TV assets.
- Light and dark themes.
- Modern quiz-studio personality: polished, tactile and restrained.
- Glossy game-show depth: pronounced hexagon bevels and highlights, with borders.
- Question panel below the triangle board, not a question overlay.
- Cyan/amber defaults and configurable player colors.
- Czech and English UI with a language switch.
- Logo concept: original hexagon containing a Y-shaped connection and a HexY
  wordmark.

Not yet decided:

- Availability/conflict checks for HexY (including case-insensitive "Hexy").
- Whether the HexY name serves both languages without a localized subtitle.
- Exact logo/wordmark artwork.
- Exact typography, palettes, textures, animation and sound direction.
- Detailed layout hierarchy and density for desktop/laptop and tablet.

The user asked whether "AZ Quiz" is too close to the show name. It is NOT an
approved name. Recommendation: avoid it for this independently branded release.
Changing the spelling/translation or dropping the hyphen is not a reliable way
to distinguish the brand from AZ-kviz. This is a risk assessment, not a finding
of infringement or a verified trademark clearance. The user subsequently proposed
HexY and approved renaming the repository to match.

Approved HexY logo concept: a hexagon containing a Y-shaped
connection, referencing the objective of connecting three sides, paired with a
HexY wordmark. The capital Y is a visual motif, not a way to distinguish the name
legally from an existing "Hexy" brand.

Design proposals:

- Large, central board with readable labels and a clearly visible active player.
- Compact player panels and restrained cyan/amber accents.
- Light theme: pearl surfaces on a cool gray background.
- Dark theme: pale neutral hexagons on a deep navy background.
- TV/projector-friendly typography, fullscreen mode and responsive layout.
- Neutral cells remain distinguishable from black/unanswered cells in both themes.
- Ownership communicated by more than color alone.
- Reduced-motion support and keyboard-operable controls.
- Restrained selection/capture animations; avoid needless persistent motion.
- Prevent player color choices that make states unusable, or provide warnings
  and accessible secondary indicators.

Visual references are inspiration only; do not ship, trace or copy their artwork:

1. Number board:
   https://ctfs.ceskatelevize.cz/porady-s3/episode/648834435453c7d165001d86/card/az-kviz-tentokrat-s-fortunou-19-1714580443.jpg
2. Czech letter board:
   https://decko.ceskatelevize.cz/cms/ct-src/video/e322291310080030/uni.jpg

## Technology choices: approved stack

The user approved the recommended stack:

- Vanilla JavaScript ES modules with JSDoc and development-time type checking:
  no UI framework needed for this board/state-machine-driven application.
- Vite for development and production builds; output remains static files.
- npm for dependency management, with a committed lockfile.
- Native SVG board and CSS themes/animation; no graphics library.
- Vitest for engine, timer, normalization and pack-validation tests.
- Playwright for browser flows, keyboard input, visual checks and responsive UI.
- Versioned JSON question packs and import/export.
- Print-friendly HTML answer sheet with browser printing / Save as PDF, rather
  than introducing a PDF-generation dependency.
- Initially use system fonts and original vector artwork to avoid external
  font requests and additional asset licensing dependencies.

Phase 1 installed the approved development tooling and a lockfile; there are
still no runtime dependencies. The application uses a validated, versioned
localStorage library for custom packs/settings, with explicit failures and JSON
backups. Phase 4 adds running-game recovery with original deadlines and protected
unread records. Public deployment remains phase-8 work.

On 2026-10-28 the user approved enforced coverage gates from phase 2 onward:
critical rules/validation/timing/recovery >=95% lines, statements and functions,
>=90% branches; remaining production JS separately >=85% lines, statements and
functions, >=80% branches. Include all production files, even untested ones;
exclude only generated outputs, content data and type-only declarations. These
are measured code-coverage gates in addition to behavior and real-browser gates.
Phase 1 did not measure coverage. See `AGENTS.md` and `REVIEW.md` for evidence rules.

Remaining technical design work:

- Release-level accessibility and physical browser/device verification;
  the SVG board, persistence, recovery and input adapters are implemented.
- Compatibility policy for future save versions; unsupported records are
  currently rejected and preserved, not silently migrated.
- Deployment under a root path versus subdirectory and cache/update behavior.

Proposed architectural boundaries, not a mandatory file tree:

- Pure board geometry, adjacency and edge-membership functions.
- Explicit game state machine, separate from DOM rendering.
- Question-pack validation, generation and answer normalization.
- Timer lifecycle driven by a reliable clock, not decrement-only intervals.
- Keyboard/gamepad input adapters.
- UI rendering, settings and local persistence.

Main state flow:

```text
setup -> choose field -> active answer -> optional opponent attempt
      -> resolve -> next choice or victory

choose black field -> target preview -> symbol duel
                   -> resolve -> next choice or victory
```

Guard against stale timers, double awards, repeated input events, actions from
inactive states and events arriving after game completion.

## Legal and licensing research

Preliminary research only; this is not legal advice or a clearance opinion.

### Findings

- Czech Copyright Act section 2(6) excludes ideas, procedures, principles and
  methods as such from copyright protection. Independent mechanics are not the
  same as copying creative expression.
- Original graphics, question wording, music and audiovisual assets can be
  protected. Question collections can also involve database rights.
- Free access, attribution, a public repository and an "unofficial" disclaimer do
  not themselves grant permission to reuse protected assets or branding.
- Trademark rights are separate from copyright, including national, EU and
  relevant international marks.
- CT publishes the official show, but this does not prove that it owns every
  associated format, logo or asset right.
- A live trademark-record lookup could not be completed. Exact AZ-kviz registered
  proprietor, scope and status remain UNVERIFIED.
- The project's chosen direction avoids dependence on TV branding permission:
  use an original identity, original assets and original question wording.
- Any shortlisted new public name still needs a reasonable conflict check.
- MIT covers our original code; CC BY 4.0 covers our original content/artwork.
  Keep scopes explicit, preserve dependency notices and do not claim these
  licenses grant rights in third-party material.
- A close branded recreation would require further rights research and suitable
  Czech IP-law review. No rights-holder permission has been requested or obtained.

### Sources checked during planning

- Czech Copyright Act, especially sections 2 and 12:
  https://www.zakonyprolidi.cz/cs/2000-121
- Czech Trademark Act, especially sections 2 and 8:
  https://www.zakonyprolidi.cz/cs/2003-441
- Official Czech Industrial Property Office trademark explanation:
  https://upv.gov.cz/prumyslova-prava/ochranne-znamky
- Official search entry covering Czech, EU and relevant international marks:
  https://upv.gov.cz/informacni-zdroje/narodni-databaze/databaze-ochrannych-znamek
- Official programme:
  https://www.ceskatelevize.cz/porady/1097147804-az-kviz/
- Official TV rules:
  https://www.ceskatelevize.cz/porady/1097147804-az-kviz/2286-pravidla/
- CT contact route if permission or ownership confirmation becomes necessary:
  https://www.ceskatelevize.cz/vse-o-ct/kontakty/

The TV rules differ from this project's rules, including black-field resolution
and allowed answer corrections. The user's rules in this plan take precedence;
do not silently substitute the television rules.

## Iterative implementation after instruction approval

The approved execution plan and authoritative phase status are in
`IMPLEMENTATION_PHASES.md`. Its bundles are:

1. Tested domain foundation and data contracts.
2. Playable local game, both answer/board modes and keyboard lightning rounds.
3. Custom-pack preparation, import/export and host answer sheets.
4. Recovery, controllers and tablet readiness.
5. General knowledge, Nature, Geography content: 12 packs / 336 entries.
6. History, Politics, Science content: 12 packs / 336 entries.
7. Programming, Arts, Entertainment content: 12 packs / 336 entries.
8. Integrated release verification and approved public deployment.

With the instructions approved, use a bounded developer session for
each phase and a separate independent reviewer. Fix findings and re-review until
the phase is cleared, then thoroughly rerun the phase's checks after review.
Commit and push each successfully verified phase before proceeding. Review
usability, readability, OOP and
design-pattern choices at every gate; do not mistake unnecessary abstractions
for clean OOP.

Early playable phases may use clearly identified starter packs. This does not
reduce the approved phase-11 132-pack / 3,696-entry scope. Preserve the phase ledger and actual
review evidence so another session can resume without reconstructing the chat.

## Acceptance criteria

- Exactly 28 correctly adjacent cells and seven cells per edge.
- All three documented turn examples pass.
- Unlimited initial attempts do not accidentally trigger handover.
- Opponent gets only one answer opportunity; answer stays hidden until safe.
- Correct timer behavior at expiry, reset and game end; focus loss/reload never
  extends the original answering deadline.
- Winner must have one connected component touching all three sides; corners,
  branching groups and disconnected false positives are tested.
- Correct capture/next-turn logic after both normal and lightning captures.
- Host overrides can reset, award or blacken every cell and independently set
  the chooser; reset cells can be answered again.
- Host corrections update victory detection and persistence without stale events
  modifying the corrected state.
- Reload restores games; interrupted lightning duels require an explicit restart
  without awarding a field or changing the chooser.
- Wrong-symbol penalties, held inputs and the approved tie policy behave reliably.
- Left/Right Shift are distinct; mappings and controller assignment are validated.
- Both themes and custom player colors preserve usable state distinctions.
- Czech Ch and English CH/SH labels and pack assignments work correctly.
- Answer normalization accepts agreed variants without fuzzy matching.
- Every bundled fixed pack has all 28 required labels, exactly once.
- Phase 11: 132 authored packs and 3,696 reviewed entries exist across the eleven
  categories, three adult difficulties and two languages; exactly two per combination.
- Generated games contain 28 eligible non-repeated questions and respect selections.
- Export/reimport preserves generated and custom packs; invalid data produces
  actionable errors without corrupting existing state.
- Downloaded answer sheet matches the prepared board exactly.
- No copied television assets or undisclosed third-party content.
- Static public deployment works under the selected hosting path with no login.

## Deployment and operational boundaries

The user approved bringing a private preview forward: pushed `main` is to remain
available through Tailscale and refresh automatically after pushes. Reuse the
existing server's Docker approach, but keep its separate LAN-only 8443 admin UI
unchanged. Use an isolated HexY container behind private Tailscale HTTPS at
`/hexy/`, with a persistent remote-main check every minute plus build time.
Build separately from the development worktree and switch atomically only after
success; retain the last working release if an update fails. Do not enable
public Funnel or claim this preview satisfies the final public-release gate.

Private-preview implementation and independent review precede activation.
Verify the actual Tailscale HTTPS route, revision, assets and automatic updates.
The final public domain/hosting arrangement still requires separate approval;
a local or tailnet-only preview is not public deployment.

The user authorized committing and pushing the approved plans, starting phased
implementation, and committing and pushing every phase after independent review
and thorough post-review testing. Service changes and deployment still require
approval of the concrete hosting arrangement. See `IMPLEMENTATION_PHASES.md`
for the latest handoff.

### Current phase-11 Geography correction checkpoint

The complete independent Geography review accepted 219 unaffected additions and
all eight adult difficulty assignments. P11-GEO-R1–R4 require five localized
corrections: Britain/stream aliases, explicit glacial landform clues in Czech
and English, and a landform clue fitting both Inselberg and monadnock.
The corrected five entries await independent narrow recheck; this does not
reopen accepted General/Nature content or the 32 retained classifications.
Current catalog 60/1,680; Geography 12/336; 76 final decks/2,128 questions remain
toward 132/3,696. Full phase 11 is **NOT CLEARED**; phase 12 has not started.
Original manifests, source bodies and independent reports remain immutable.
