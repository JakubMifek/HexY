# HexY: Product and Implementation Plan

## Status and instructions for the next session

Last updated: 2026-10-28.

This is the handoff document for a new, publicly hosted, browser-based quiz
inspired by the mechanics of the Czech television show AZ-kviz. The selected
project name is **HexY**. Name/trademark availability has not been cleared.

GitHub repository: https://github.com/JakubMifek/HexY

The repository was renamed from JakubMifek/azquiz with the user's approval.
The local checkout was also renamed with the user's approval and is now at
/home/jakubmifek/github/HexY. Its origin remote points to the renamed repository.

The repository was empty when planning began. Phase 1 now contains a minimal
shell and tested domain foundation, not a playable application. This document
records the conversation's decisions; do not assume that proposals below have
been approved.

**Current stage: phase 1 foundation cleared by independent review and post-review
checks; commit/push pending before phase 2.**
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
5. Programming
6. Geography and travel
7. Arts and literature
8. Entertainment
9. Science and technology

Proposed editorial distinction: Science and technology focuses on physics,
chemistry, engineering and inventions, rather than duplicating Nature or
Programming. Prefer stable political institutions/concepts over changing
officeholders.

### Authored letter packs: confirmed scope

- Two deliberately authored 28-question packs per category per language.
- Nine categories x two packs x two languages = **36 packs / 1,008 entries**.
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
- Decide whether difficulty and editorial verification dates are needed.
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

Phase 1 has installed the approved development tooling and a lockfile; there
are no runtime dependencies. Browser storage and deployment details remain open.

Remaining technical design work:

- SVG board construction, accessibility and event handling.
- Local storage approach and save-format migration.
- Browser/device support, Gamepad API limitations and HTTPS requirements.
- Self-hosted or system fonts, icon assets and their licenses.
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
reduce the final 36-pack / 1,008-entry scope. Preserve the phase ledger and actual
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
- 36 authored packs and 1,008 reviewed entries exist across the nine categories
  and two languages.
- Generated games contain 28 eligible non-repeated questions and respect selections.
- Export/reimport preserves generated and custom packs; invalid data produces
  actionable errors without corrupting existing state.
- Downloaded answer sheet matches the prepared board exactly.
- No copied television assets or undisclosed third-party content.
- Static public deployment works under the selected hosting path with no login.

## Deployment and operational boundaries

The user wants hosting on the current server, but domain, document root, reverse
proxy, existing web server and deployment mechanism have NOT been investigated
or selected. Do not invent these details or modify other hosted applications.

When deployment is approved, inspect the existing arrangement, propose the
smallest compatible setup, use HTTPS where available, and verify the actual
public URL. A local development server alone is not public deployment.

The user authorized committing and pushing the approved plans, starting phased
implementation, and committing and pushing every phase after independent review
and thorough post-review testing. Service changes and deployment still require
approval of the concrete hosting arrangement. See `IMPLEMENTATION_PHASES.md`
for the latest handoff.
