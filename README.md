# HexY

Playable local quiz for two players sharing a screen. **Phases 1–7 are independently
cleared: 36 packs / 1,008 reviewed questions. Not yet a production release.**
That historical library supported both languages, catalog filtering and
source-preserving printable answer sheets.
See [phase status](IMPLEMENTATION_PHASES.md) and [contracts](docs/contracts.md).
The [phase-6 review](reviews/phase-06.md) records editorial coverage, corrections
and independent/post-review verification. See the
[phase-7 review](reviews/phase-07.md) for final content clearance.
The owner has **closed the implementation plan and accepted private delivery**.
The [phase-8 review](reviews/phase-08.md) found no implementation defects.
Public release remains deferred; naming, public hosting and remaining device/
browser/accessibility verification are [follow-up work](docs/release-readiness.md#follow-up-work).
The owner-approved phase-9 guided redesign is independently cleared after fixes,
with complete coordinator post-review checks passed. See the
[phase-9 review](reviews/phase-09.md). It does not reopen public-release scope.
The owner-approved phase-10 follow-up adds temporary mixes, final export and
recorded controls; its [developer handoff](docs/phase-10-handoff.md) records
verification; phase 10 is cleared and privately delivered as `54b34b1`.

**Phase 11 is independently cleared with complete post-review gates passed:**
the catalog
has **132 decks / 3,696 questions**, eleven categories with exactly two decks
per language/difficulty. Version-2 difficulty, language-scoped folders and
protected old-record exports are implemented. All retained classifications and
2,800 added entries have complete independent editorial reviews and accepted
whole-deck ratings, including narrow correction rechecks. Final integrated
review and 1,433 native post-review cases are complete; authorized private
commit/push/HTTPS delivery is recorded in the continuation handoff.
See [the handoff](docs/phase-11-handoff.md), [review history](reviews/phase-11.md)
and [source receipts](docs/content-sources.md). Historical failures remain
preserved, not silently cleared.

Games, Movies/Series and Sports replace Entertainment in the bundled catalog.
The four old packs remain [byte-bound archives](docs/phase-11-entertainment-retirement.json),
not extra quota. Compatible imports and saved games retain their complete old
questions, aliases, title scopes and deadlines; catalog retirement does not
rewrite browser data. The old US-only Zootopia question still rejects
Zootropolis, while the separately reviewed new regional-title question accepts it.

The owner broadened **Computing and Programming / Informatika a programování**
while retaining general-adult difficulty and all quotas. The category ID remains
`programming` for compatibility. Forty accepted Czech judgments and source
receipts are preserved; all 72 prior category-fit findings were independently
reassessed and resolved under that scope. Factual, alias, disclosure and
difficulty corrections passed separate rechecks, not automatic clearance.

## Play

Fresh entry opens **Menu**: **New Game**, **Options**, or **Import Game**.
Options sets one language for both interface and questions, question duration
(default 30 seconds, 1–3,600 seconds), starter (default random), and input controls.
New Game opens editable player names/colors and human/digital host selection,
then Number/Alphabetical tiles and deck preparation. Default player names are
distinct randomly selected Lord of the Rings character names; no artwork or
narrative is included. Back preserves choices. The header sun/moon button changes
theme without rerolling names, regenerating content or resetting time.

- Connect one group of your fields to all three edges. Corners touch two edges.
- Fixed-letter boards preserve their authored placement. Number boards propose
  28 distinct questions from only your selected, same-language source packs.
- Selecting a question tile flips it to its full answer initial (`Ch`, `CH` and
  `SH` stay intact). The initial remains through the opponent's opportunity.
  Reduced motion reveals immediately. This animation never delays the timer,
  replays on theme/reload, or changes black-duel identifiers.
- **Spoken:** a host judges answers. Incorrect initial answers leave the original
  timer running. **Typed:** case, spacing and missing diacritics are ignored;
  explicit aliases are accepted, but not fuzzy spelling corrections.
- Timeout or **Give up** gives the opponent exactly one untimed attempt. A failed
  opponent attempt makes the field black. Answers appear only after resolution.
- The opposite player to the actual recipient chooses next. If neither succeeds,
  the opposite player to the original chooser goes next.
- Select black fields for reaction duels: default keys are **Left Shift** for A
  and **Right Shift** for B. In Options, **Duel controls** has one **Record** row
  per player: press a fresh key or controller button to replace that player's
  previous binding. Escape cancels. Duplicate bindings are rejected.
  Memorize the target, release held keys, then press only when the target appears.
  Wrong symbols award the other player. The exact pool is circle, star, square,
  triangle, hexagon, heart and sun. One target stays fixed throughout uninterrupted
  play. Randomized seven-symbol cycles continue indefinitely; missing a target
  never stops rotation or changes turns. Ties start another active cycle with
  the same target. Each cycle guarantees every symbol, including the target.
- Losing focus, opening Exit/recovery controls, losing an assigned controller, or reloading
  interrupts duels without an award or chooser change. Return and **press and
  release both mapped keys or both touch buzzers in this window**. Release all
  assigned controller buttons. The preview restarts automatically after both
  players' fresh press-and-release gestures; no checkbox or restart click.
  Assigned controller buttons can also rearm. Rearming cannot capture; losing focus
  again revokes readiness. A lone release does not authorize restart. The release
  status explains when inputs are ready. Questions never pause.
- Hosted corrections exist only between rounds or after a win. Cell changes and
  chooser changes are independent. Resetting a cell reuses its original question.
  Corrections immediately recompute victory and can reopen a won game.
- **Exit Game**, both before and after victory, offers **Save and return to menu**,
  **Return without saving**, and **Cancel**. Save initiates a complete JSON download
  before clearing recovery; it cannot verify that the file reached disk.
  Failed downloads/deletions keep the game and show an actionable error. Victory
  alone never deletes recovery or disables valid host corrections.
  The dialog does not pause question time;
  opening it during a duel invalidates that duel, rather than allowing unseen
  input to award a field.
- Theme changes preserve an unsent typed draft only in its current
  question opportunity. Handover, resolution and the next question clear it.
  Language settings remain preparation-only. Disconnected/imported controller
  bindings can also be recorded from the duel's **Record** action; this interrupts
  the duel and requires fresh press/release readiness afterward.

Use Tab and Enter/Space for controls. Arrow keys move through selectable fields in
row-major order. Won fields use player colors only; black fields retain their
original identifiers without ×. Accessible cell names still state ownership,
and winning connections retain feedback. Color-only ownership is an explicit
owner-approved color-vision accessibility exception, not a universal WCAG claim.
Questions normally remain below the board; maximum-length questions can overlap
part of the board while required text and actions remain visible without scrolling.
Desktop/laptop and tablet
layouts are implemented, including separate A/B touch buzzers during duels;
physical tablet support remains unverified/experimental.

**A successfully saved game recovers on reload, including its original deadline.**
Expired initial answers become the opponent's single opportunity. Selecting and
won games recover unchanged; every saved duel recovers interrupted. Content stays
locked after recovery and host resets. Unsent typed drafts are not saved.
Static downloaded content is inspectable: this is friendly local play, not anti-cheat.

### Local input compatibility

Desktop/laptop setup: two players share a keyboard. The unverified/experimental
tablet setup uses one finger each on the separate A/B buzzers. A host uses
the ordinary judging controls. Both players should preferably use the same input
type. Gameplay has no outer or internal scrolling at tested 1280×720, 1366×768,
1920×1080, 1024×768 and 768×1024 viewports. Preparation can scroll. Phones and
smaller viewports are not supported. Imported questions allow up to 600 UTF-16
code units, canonical answers 120, and player names 30; invalid lengths produce
localized errors before adoption. Long questions use 18px type; ordinary questions
use 20px. These bounds do not alter the 1,008 reviewed entries.

- Physical keyboard mappings: separate `ShiftLeft`/`ShiftRight`, `Space`,
  letters, digits, punctuation and ordinary numpad positions. Labels describe physical positions, not a translated
  keyboard character. Conflicts are rejected; Tab/Enter/arrows remain ordinary
  navigation keys. Escape, modifier shortcuts and function keys cannot be recorded.
  Holds, repeats and presses begun in preview cannot capture.
  Mapped keys do not steal input from editable form controls; ordinary buttons
  do not swallow duel input after keyboard navigation.
- Touch/mouse: press a buzzer, then lift/release before the next press. Buzzers
  are at least 48 px high; simultaneous rising edges replay ties. Pointer
  cancellation interrupts and requires fresh rearming. Gestures cannot scroll/repeat.
- Gamepads: use a browser exposing `navigator.getGamepads` (HTTPS or localhost
  recommended). Connect and press a controller button so the browser exposes it,
  then click **Record** and press the desired button. Two controllers or two
  distinct buttons on one controller work. Each player has exactly one keyboard
  **or** controller binding, never both. Touch buzzers remain available.
  Held/newly exposed buttons must be released before recording. Connection
  identities are session-only: reload, import and disconnect leave controller
  bindings unassigned, with explicit re-record guidance. In a duel, **Record**
  reconnects them; touch can also rearm and play without a controller.
- Any connected **standard-mapped** controller can navigate while selecting:
  D-pad buttons 12–15 or left stick axes 0/1 move through the same selectable
  row-major cells as keyboard arrows; A (button 0) confirms, like Enter.
  First A focuses a field if none is focused. Navigation does not require a duel
  assignment and never overrides focused form/header controls. It is disabled
  during questions, duels, victory, modals and hidden/unfocused tabs.
  Neutral samples gate transitions; stick thresholds are 0.6/0.3, with a 350 ms
  initial hold delay and 110 ms repeats, observed on the 16 ms poll.
  Nonstandard mappings may record duel buttons but do not navigate.
- **Duel controls** is a two-row modal with safe edge feedback.
  Escape cancels an active recording; otherwise it closes the dialog.
- Use browser **F11** if desired; the application has no fullscreen controls/API.
- Events within **8 ms** share the existing tie window. Controllers are polled
  every 16 ms and both players in one sample share a timestamp. Keyboard/pointer
  dispatch, polling and OS/device latency differ: perfect cross-device timing
  fairness is not promised. There is no flashing animation or sound cue.

Chromium software behavior is tested with real UI/engine, native emulated
multi-touch and mocked Gamepad boundaries; selected real journeys also pass in
Firefox. **Controller/tablet support is unverified/experimental.** The owner
authorized a future limited initial release with these limitations, not a claim
of hardware verification or permission to publish. Human screen-reader,
Safari/WebKit and remote Windows Edge verification are also unavailable.
Screenshots/emulation and headless Firefox do not establish physical-device
support. See [release readiness and decisions](docs/release-readiness.md).

## Prepare packs and private answer sheets

Both spoken and typed games use the same preparation workflow:

1. Choose question language and board mode. The matching bundled fixed-letter
   starter is initially ready. Changing language/mode resets the preparation to
   that language's **single starter**, not all catalog packs, and never translates
   custom questions.
2. Browse expandable category folders; uploaded/custom decks have a separate
   folder. **Origin** and **Difficulty** are the only filters. Options determines
   the question language; clearing filters never adds other-language questions.
   Each deck shows its localized difficulty. A folder checkbox selects/deselects
   only its currently matching decks, shows selected/matching counts and a
   partial-selection state. The summary opens/closes with Enter/Space; the separate
   checkbox also works when the folder is closed. Filters only change what
   you see: **hidden selected sources remain selected**, and the selected-source
   summary always lists them. Filtering never edits or invalidates an accepted
   board. Use **Clear source selection** before choosing a different fixed pack;
   **Clear catalog filters** only restores the current-language list.
   A whole folder does not become a valid multi-deck alphabetical game: select
   exactly one fixed deck before preparing it. Filters/folder expansion are
   session-only, not saved.
   Select packs, or **Import JSON files** (one or several). Imports stay in your
   browser; there is no remote upload. A batch with any invalid/conflicting file
   is rejected without replacing the existing library, proposal or editor draft.
3. For letters, select exactly one authored letter pack and **Use selected fixed
   board**. For numbers, select same-language sources and **Generate / regenerate
   28 numbers**, then **Accept this board**. Insufficient distinct questions,
   mixed languages and conflicting question IDs produce actionable errors.
   **Use selected number board unchanged** restores an imported/prepared order.
4. **Edit selected pack as a copy** or **Edit proposal as a copy** opens the
   actual question/answer/alias/category/source and pack title/ID/authors/license/difficulty
   editor. Lists use one entry per line. Question IDs stay stable; fixed initials
   and their authored order cannot move. Number/source positions can move.
   Choosing a difficulty explicitly reclassifies all questions in that custom
   copy. Leaving a generated mixture unchanged preserves its source levels.
   **Validate and save custom copy**, then accept the final board.
5. **Download pack JSON** exports every supported pack, including generated and
   edited versions. **Export selected packs** downloads each selected source;
   your browser may ask permission for multiple downloads. Reimport JSON to
   restore the exact documented content and placement.
6. For a human host, **Download answers and play** must initiate the exact
   accepted board's HTML answer-sheet download before play starts. Failure leaves
   preparation intact. The browser cannot confirm a disk write: verify the file.
   Digital host mode does not offer a sheet. Open the
   self-contained downloaded file separately and use browser Print / Save as
   PDF. It contains all 28 row-major cell numbers, question IDs, explicit initials,
   questions, answers and aliases, without game controls or external fonts.
   A factual-source appendix maps every citation/note to its exact cell number
   and question ID, including shuffled number games. Sources are printed as
   inert text, not clickable/executable URLs. Authors, licenses and source-pack
   attribution remain included. The appendix begins on a separate printed page.
   Keep it on paper or another private device, not the players' shared screen.
7. Starting locks content, even after a win or a host field reset. During play,
   **Save Game** is the only content export; there is no library/editor/sheet access.

Prepare before players gather: the editor intentionally shows answers. Opening
an editor, changing source selection or regenerating invalidates acceptance and
sheet availability. Discard older downloaded sheets and download the newly
accepted version; downloads are independent snapshots, not live documents.
Each edited/generated board gets a new pack ID by default, displayed in setup
and on its sheet. Imported text is rendered as text, never executable markup.

### Local storage and backups

The versioned `hexy.library.v1` localStorage record contains validated custom
version-2 packs and interface/game-setup preferences. Explicit imports and saved editor
copies are persisted. Generated mixes are temporary, even after acceptance/start;
the complete active-game recovery/save still includes its locked pack.
Bundled assets are never modified. Unsaved editor drafts/proposals are not persisted.
Older auto-saved mixes cannot be distinguished from explicit imports: both used
the same record without origin metadata. They are preserved, not guessed from
titles or question attribution. The owner approved selective removal instead.
`localStorage` is sufficient for this small static, single-browser library:
synchronous atomic replacement makes complete-record validation and
failure-preservation straightforward, without a database framework or dependency.
There is no app-imposed pack-count limit; browser quotas vary.

**Browser-local storage is not a backup. Export JSON and keep copies elsewhere.**
Private browsing, site-data clearing, a different browser/profile/origin or quota
limits can make this data unavailable. Errors are shown in the current UI
language; a failed write leaves the current pack/game usable in memory and the
previous stored value intact.

**Difficulty compatibility:** imported packs require `schemaVersion: 2` and a
declared `difficulty` (`easy`, `medium`, `hard`). Missing difficulty and older
packs are rejected without replacing valid work. No Unrated level or inferred
import classification exists. Mixed number boards preserve each question's
level and export the exact sorted union of selected levels; this is not a fourth
editorial difficulty. See [the full format](docs/contracts.md#packs).

Old browser libraries containing pre-difficulty packs block replacement writes.
In Options, **Export protected original library JSON** downloads the exact
observed record, including whitespace. Preserve it, extract/edit a copy's pack
metadata in a JSON editor and use the correct declared difficulty before
reimporting individual packs. The application does not modify the old record.
Old active games with incompatible packs likewise stay protected: use the
recovery export before explicitly discarding. Export the game separately before
any manual site-data removal. Existing outer library/input/game format versions
have not changed; nested packs have. There is no automatic legacy migration.

- **Older mixes / full storage / unwanted copies:** in Options or preparation,
  use **Saved decks** to export a copy. **Delete** is beside **Download pack JSON**;
  it opens a confirmation with **Cancel** and **Delete** (Czech: **Smazat**).
  Confirmation immediately retries saving only the included copies/settings.
  Exclusion does not remove content from the current session: selected sources,
  accepted preparation and a locked running game remain unchanged and exportable.
  After a successful save, excluded copies disappear on reload; keep their JSON.
  **Include again and retry saving** reverses the exclusion during this session.
  If a write fails, stored data and the inclusion selection remain intact. Do not clear
  site storage to solve an oversized pack: it would not shrink the in-memory
  library. Bundled packs cannot be excluded/deleted.
- **Read access denied at startup:** saving is blocked to protect unread data,
  even after access is restored. Export your in-memory copies, allow site storage,
  reload to validate the original library, then reimport your exports. Retrying
  edits without reloading cannot save. Game storage is separate; inspect its
  own saved/unsaved status before reloading.
- **Write access denied after a successful read:** allow site storage and retry
  saving (for example, a setting change), or export your copies first.

Exclusion is a session-only, per-pack-ID saving choice, not a content edit or
format change. An explicitly saved editor copy/import is included by default; generated
mixes are not added. Library
management is preparation-only; export a running game before exiting to manage it.

Corrupt/incompatible libraries are never silently overwritten or cleared.
Preserve the raw `hexy.library.v1` value using browser site-storage tools before
repairing/removing that site's data; use a compatible application for a newer
format. Until then, work in memory and export. This is not running-game recovery.
Use one editing tab: writes compare the last-read record and reject concurrent
replacement rather than overwriting it. Concurrent-tab merging is not implemented.

### Saved-game recovery and backups

`hexy.game.v1` is separate from the library: it stores the versioned complete-game envelope,
including locked questions/aliases/placement, board, chooser, phase and original
deadline, names, colors, language, host/time/board settings and duel bindings.
Every accepted game transition saves synchronously **before rendering**.
Library saving inclusion/exclusion never edits that snapshot. `hexy.inputs.v1`
separately stores version-2 keyboard-or-controller binding choices, without
durable controller identities. Version-1 keyboard preferences and portable games
remain readable; new complete-game envelopes are version 2 (domain games stay v2).

- During play, **! Not saved** opens **Game recovery** controls in a readable
  dialog rather than covering the question/board. Close returns to play; timers
  never pause, and interrupted duels require new gestures after closing.
  **Not saved** means the current state is only in
  memory, even if an earlier game remains in storage. Quota/access failures never
  claim success. Save Game before exiting to reduce library storage, or
  use **Retry recovery / saving** after restoring access.
- **Save Game** downloads the current full game; recovery controls export the raw
  protected original when recovery failed. If playing in memory over an unread/
  invalid original, **Export protected original save** keeps that original too.
  Failed exports are reported; do not leave until the needed download succeeds.
- Corrupt, incompatible, unread or backward-clock saves are never overwritten.
  Retry after restoring storage access/the clock, or export the original and
  explicitly **Discard stored game…** followed by confirmation. Cancel is safe.
  No DevTools are required for these game-recovery paths. A different stored
  value detected at confirmation is neither deleted nor overwritten by later
  gameplay/retries: saving is blocked and the replacement is available as a raw
  export. Retry inspects it without replacing it with the in-memory game.
  Export current work and reload to recover that replacement, or export it and
  use recovery's **Discard stored game…** to explicitly remove it. Ordinary Exit
  never deletes a protected original, even after a second click. Close other tabs first.
  If a retry cannot read storage, saving stays blocked even if storage was last
  observed empty. Retry can resume memory-game saving only after a successful
  current read establishes that no stored game remains.
- You may start an in-memory game while recovery is blocked, but it cannot replace
  the protected original automatically. Export that in-memory game before reload
  to recover the original. Alternatively, export both, confirm discard, and import
  the desired game. Read access restoration alone never overwrites unseen data.
- After confirmed discard/with empty game storage, **Import saved game JSON**
  validates and recovers an exported game. Invalid or superseded reads cannot
  replace current play. Importing an expired question does not give extra time.
  Menu **Import Game** restores directly, without the setup wizard. Human-host
  imports require the exact sheet download first. Active duels import interrupted;
  questions keep their absolute deadlines. All metadata is validated before adoption.
  Complete files are limited to 2,000,000 UTF-8 bytes, including reserved space
  for later rounds. Exports use compact JSON so formatting cannot exceed the
  import limit. Theme and runtime controller
  assignments are not portable. Export other custom library packs separately.
  Legacy raw local games still recover using browser player preferences; saving
  upgrades them to the complete envelope. Legacy raw game exports and question-pack
  JSON are rejected by Import Game with guidance, not silently guessed/migrated.
  Keep originals; use a compatible version to recover an old raw game locally.
- New domain-v2 games use exactly `circle`, `star`, `square`, `triangle`,
  `hexagon`, `heart` and `sun`. Historical domain-v1 saves using the original
  four-symbol alphabet are validated under their original rules, then upgraded
  to seven-symbol continuous rotation. Active duels become interrupted; ownership
  and question deadlines remain unchanged. Other symbols are rejected,
  even between turns or during an interrupted duel. The original stays intact:
  keep its export and use a compatible version, or explicitly discard it. Config
  invalid symbols are never silently substituted. The generic domain accepts other
  alphabets; the browser additionally enforces the supported versioned pool.
- Confirmed **Exit Game** removes the saved game before returning to Menu. If removal
  fails, the current game stays open with an error rather than silently resurrecting
  an older game on reload.

Keep the device clock correct. Backward timestamps earlier than the runtime's
last observed reading or a saved transition are rejected; the original deadline
is never reset. A static offline application has no trusted external clock to
authenticate clock changes across browser/device shutdown. Browser storage is
not a backup, and clearing this site's data removes all three separate records.

Original and imported rights remain distinct. Mixed boards preserve each
question's source-pack attribution chain in the documented optional `origins`
field, plus factual `sources`; generated license text does not relicense imports.
See [format and duplicate-resolution rules](docs/contracts.md).

## Content catalog

The integrated phase-11 catalog has **132 packs / 3,696 questions**:
General knowledge, Nature, Geography and travel, History, Politics and diplomacy,
Science and technology, Computing and Programming, Arts and literature, Games,
Movies/Series and Sports. Each has twelve decks / 336 questions, exactly two at
each difficulty in each language. The [inventory](docs/content-inventory.md)
separates the 896 retained entries from 2,800 independently reviewed additions.
The four archived Entertainment packs contribute no current quota.

The historical independently cleared library contains **36 packs / 1,008 entries**: two fixed 28-question
packs per category and language for General knowledge, Nature, Geography
and travel, History, Politics and diplomacy, Science and technology, Computing and Programming,
Arts and literature, and Entertainment.
All inherited question objects and provenance remain unchanged, including the
original starters `general-cs-01` and `general-en-01`; phase 11 changes their
schema/difficulty metadata, not their facts.
Phase 7 added its final twelve packs / 336 questions, including the reviewed
P7-01 surname-scope correction. Every inherited entry passed independent factual and
linguistic review; earlier findings and re-reviews remain recorded. Each pack also works as a
selected number-game source. Questions can recur across games; neither filtering
nor generation promises permanent novelty.

See the [inventory and editorial policy](docs/content-inventory.md) and the
[1,008-entry source-check ledger](docs/content-sources.md). Original Czech and
English questions use their own fixed alphabets, not forced translations.
New sources were read during authoring on 2026-10-29; the ledger identifies
the corrected source/adaptation choices and the earlier temporarily unavailable
BCcampus starter citation with its verified corroboration.
Tests cover every pack's counts, category/language quota, identity, schema,
prefix order, duplicate text/answers and fixed/number/export integration.
Those checks do not replace independent factual and linguistic review of
**every entry**.

## Development

Requires Node.js 20.19+ (or a newer Vite-supported Node release) and npm.
No runtime dependencies, backend, external fonts, analytics or remote imports.

```sh
npm ci
npm run dev
```

Vite prints its loopback URL. On a shared machine with exhausted file watchers,
use `CHOKIDAR_USEPOLLING=1 npm run dev` instead of changing system limits.

```sh
npm run format        # format source, tests and usage docs
npm run format:check  # check without writing
npm run lint         # ESLint, including approved code-size/complexity ceilings
npm run typecheck    # strict JSDoc JavaScript checking, no emitted TypeScript
npm test             # behavior/unit/DOM tests, no watch mode
npm run test:coverage # measured V8 coverage + separate enforced scope gates
npm run build        # static output in dist/
npm run check        # format, lint, types, coverage tests and build
npm run preview      # serve the production build on loopback
```

Browser tooling is development-only:

```sh
mkdir -p .artifacts
PLAYWRIGHT_BROWSERS_PATH=.artifacts/browsers TMPDIR="$PWD/.artifacts" npx playwright install chromium
npm run test:browser
```

Install the browser's OS prerequisites using your environment's approved method
if Playwright reports missing libraries. The phase-2 environment instead used
locally extracted Debian libraries, **without changing the shared system**:

```sh
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser
```

Playwright builds and serves the real production application at
`http://127.0.0.1:4182`, fails if the port is occupied, and stops its server on
completion. Browser reports, screenshots and failure traces are in
`.artifacts/browser-report/` and `.artifacts/playwright/`. No server must be
started manually. Browser tests use Playwright's clock and seeded randomness
at browser boundaries, never a substituted game engine.

PDF tests require local fonts covering every printed alias, including Japanese,
Chinese and Korean. On a font-limited test host, licensed Noto CJK fonts can be
kept in an artifact-only directory and exposed to the test process with
`FONTCONFIG_FILE` pointing to an artifact-local Fontconfig configuration. Preserve
the font license; do not change global fonts or add runtime font downloads.
PDF extraction uses each embedded font's code width and ignores only the exact
localized repeated table heading when an oversized row spans pages. Ordered
questions, every alias, source citations and rights credits remain required.

The portable cross-engine subset uses the same real game, duel, recovery,
keyboard, layout and accessibility journeys:

```sh
PLAYWRIGHT_BROWSERS_PATH=.artifacts/browsers TMPDIR="$PWD/.artifacts" PLAYWRIGHT_SKIP_BROWSER_GC=1 npx playwright install firefox webkit
npx playwright test --config playwright.cross-browser.config.js --project firefox
npx playwright test --config playwright.cross-browser.config.js --project webkit
```

Only run an engine once its required libraries are available through an approved
local/environment setup. The separate configuration intentionally excludes
Chromium-only CDP multi-touch and PDF generation, rather than skipping failures
or claiming those APIs exist in other engines. Full Chromium remains mandatory.
See the [phase-8 handoff](docs/phase-08-handoff.md) for what actually ran here.

### Coverage gates

`vitest.config.js` includes **all `src/**/*.js`**, including untested files;
only the type-only `src/domain/types.js` is excluded. JSON content/generated
outputs are not production JavaScript. `scripts/check-coverage.js` independently
enumerates production files, fails on missing coverage, and reports exact counts:

| Separate group | Included files                                                           | Lines/statements/functions | Branches |
| -------------- | ------------------------------------------------------------------------ | -------------------------- | -------- |
| Critical       | `src/domain/*.js`, `src/runtime/*.js`, `src/app.js`, `src/workspace.js`  | ≥95% each                  | ≥90%     |
| Remaining      | All other production JS, including UI, entry point, catalog and messages | ≥85% each                  | ≥80%     |

Coverage HTML and machine-readable metrics are in `coverage/`. The critical group
includes application orchestration because it owns state, timing and input
lifetime. DOM tests run the real engine using jsdom; only unavailable browser
dialog/scroll primitives are adapted. Real modality, SVG keyboard interaction,
layout and screenshots are verified separately in Chromium. Passing browser
journeys is **not** counted as statement coverage. Phase 1 did not measure coverage.

## Implementation boundaries

- `src/domain/`: pure engine, geometry, normalization, selected-source generation,
  settings validation and versioned pack/save contracts.
- `src/app.js`: application lifecycle, captured action contexts and state-to-view
  orchestration; no gameplay rules duplicated here.
- `src/workspace.js`: preparation I/O, localized errors, persistence and view
  coordination, separate from authoritative running-game state.
- `src/runtime/`: deadline scheduling, shared 8 ms input batching, keyboard,
  controller/touch lifecycles and input-test coordination, game recovery storage,
  preparation invariants, local-library writes and download URL lifetimes.
- `src/ui/`: setup, native SVG board, question/duel panel, host controls and
  Czech/English labels, preparation editor and escaped print-ready HTML.
  No UI framework or graphics dependency.
- `tests/`, `browser/`: deterministic engine/adapter/DOM behavior and real-browser
  journeys, including both languages, themes, answer modes and board modes.

No physical Xbox/tablet or screen-reader-device verification is claimed.
The complete content inventory is independently cleared. Naming decisions,
physical-device/assistive-technology evidence and approved public hosting remain
release gates. Passing tests alone never clears a phase.

## Private preview operations

The private Tailscale `/hexy/` preview is running and follows pushed `main` using an
isolated Docker static server and user timer, without changing the separate
8443 admin application. Updates are checked 60 seconds after the preceding
check/build finishes; failed updates keep the last working release. Already-open
games are not forcibly reloaded. See [installation, safety gates, status and rollback](docs/private-preview.md)
and the [interlude handoff](docs/private-preview-handoff.md).
This is not phase-8 public release clearance.

## Rights

Original code is [MIT licensed](LICENSE). Original question wording and artwork
are [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/):
attribute “HexY contributors”, link to the source repository and license, and
indicate changes. Factual source pages keep their own rights; source citations
do not relicense those pages. Imported third-party content keeps its declared
rights. Dependencies retain their licenses and notices.

The hexagon/Y logo and SVG artwork are original; no television assets are used.
See [rights, asset origins and dependency notices](NOTICE.md).
The built HTML includes MIT and CC BY attribution notices, including Vite's
bundled modulepreload helper. Preserve that document with its matching assets
when distributing `dist/`. “HexY” name/trademark clearance remains pending;
existing game/software uses require the [release naming decision](docs/release-readiness.md).
