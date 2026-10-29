# HexY

Playable local quiz for two players sharing a screen. **Phases 1–6 are independently
cleared, with 24 packs / 672 questions. Not a production release.**
General knowledge, Nature, Geography, History, Politics/diplomacy and
Science/technology support both languages, catalog filtering and
source-preserving printable answer sheets.
See [phase status](IMPLEMENTATION_PHASES.md) and [contracts](docs/contracts.md).
The [phase-6 review](reviews/phase-06.md) records editorial coverage, corrections
and independent/post-review verification.

## Play

Choose interface language and light/dark theme at the top. Setup selects player
names/colors, starter (A, B or random), question duration (default 30 seconds,
1–3,600 seconds), board, answer mode and question language.

- Connect one group of your fields to all three edges. Corners touch two edges.
- Fixed-letter boards preserve their authored placement. Number boards propose
  28 distinct questions from only your selected, same-language source packs.
- **Spoken:** a host judges answers. Incorrect initial answers leave the original
  timer running. **Typed:** case, spacing and missing diacritics are ignored;
  explicit aliases are accepted, but not fuzzy spelling corrections.
- Timeout or **Give up** gives the opponent exactly one untimed attempt. A failed
  opponent attempt makes the field black. Answers appear only after resolution.
- The opposite player to the actual recipient chooses next. If neither succeeds,
  the opposite player to the original chooser goes next.
- Select black fields for reaction duels: default keys are **Left Shift** for A
  and **Right Shift** for B. **Input controls and test** changes physical keys,
  assigns controller buttons, and tests inputs without awarding a field.
  Memorize the target, release held keys, then press only when the target appears.
  Wrong symbols award the other player. Ties and missed targets replay.
- Losing focus, opening input controls, losing an assigned controller, or reloading
  interrupts duels without an award or chooser change. Return and **press and
  release both mapped keys or both touch buzzers in this window**. Release all
  assigned controller buttons. Then both players confirm readiness and restart.
  Rearming cannot capture; losing focus again requires new releases. The release
  status explains when inputs are ready. Questions never pause.
- Hosted corrections exist only between rounds or after a win. Cell changes and
  chooser changes are independent. Resetting a cell reuses its original question.
  Corrections immediately recompute victory and can reopen a won game.
- **New game** asks before discarding. Its dialog does not pause question time;
  opening it during a duel invalidates that duel, rather than allowing unseen
  input to award a field.
- Theme/language changes preserve an unsent typed draft only in its current
  question opportunity. Handover, resolution and the next question clear it.

Use Tab and Enter/Space for controls. Arrow keys move through selectable fields in
row-major order. Ownership has A/B marks, black fields retain identifiers with ×,
and winning connections have dashed outlines. Questions remain below the board;
the question panel scrolls into view when necessary. Desktop/laptop and tablet
layouts are supported, including separate A/B touch buzzers during duels.

**A successfully saved game recovers on reload, including its original deadline.**
Expired initial answers become the opponent's single opportunity. Selecting and
won games recover unchanged; every saved duel recovers interrupted. Content stays
locked after recovery and host resets. Unsent typed drafts are not saved.
Static downloaded content is inspectable: this is friendly local play, not anti-cheat.

### Local input compatibility

Supported software setup: two players share a desktop/laptop keyboard, or a
multi-touch tablet with one finger each on the separate A/B buzzers. A host uses
the ordinary judging controls. Both players should preferably use the same input
type. Tablet portrait and landscape layouts allow vertical scrolling; phones
are not supported.

- Physical keyboard mappings: separate `ShiftLeft`/`ShiftRight`, `Space`, or
  `KeyA`–`KeyZ` positions. Labels describe physical positions, not a translated
  keyboard character. Conflicts are rejected; Tab/Enter/arrows remain ordinary
  navigation keys. Holds, repeats and presses begun in preview cannot capture.
  Mapped keys do not steal input from ordinary focused form controls/buttons;
  focus the board/question or a buzzer to play.
- Touch/mouse: press a buzzer, then lift/release before the next press. Buzzers
  are at least 72 px high; simultaneous rising edges replay ties. Pointer
  cancellation clears pending input. Gestures on buzzers cannot scroll/repeat;
  ordinary controls and page scrolling remain available elsewhere.
- Gamepads: use a browser exposing `navigator.getGamepads` (HTTPS or localhost
  recommended). Connect and press a controller button so the browser exposes it,
  then explicitly assign a connected device and **zero-based button index** to
  each player. Two controllers or two distinct buttons on one controller work.
  No automatic player assignment, button capture or reconnect reassignment occurs.
  Assignment requires a neutral observed sample before a press. Assignments are
  session-only: reassign after reload/disconnection. Unsupported, denied and
  disconnected states are reported; keyboard/touch remain explicit alternatives.
- **Input controls and test** is a modal safe test, not a playable duel.
  Opening it interrupts duels but never pauses a question. Close it or press
  Escape to return; rearm and confirm readiness before restarting a duel.
- **Fullscreen** uses the browser's Fullscreen API. Failure is reported; browser
  fullscreen is an alternative. Fullscreen never changes a question deadline.
- Events within **8 ms** share the existing tie window. Controllers are polled
  every 16 ms and both players in one sample share a timestamp. Keyboard/pointer
  dispatch, polling and OS/device latency differ: perfect cross-device timing
  fairness is not promised. There is no flashing animation or sound cue.

Chromium software behavior is tested with real UI/engine, native emulated
multi-touch and mocked Gamepad boundaries. **Physical Xbox/tablet and other
browser verification remain pending for phase 8**; screenshots/emulation are not
hardware verification.

## Prepare packs and private answer sheets

Both spoken and typed games use the same preparation workflow:

1. Choose question language and board mode. The matching bundled fixed-letter
   starter is initially ready. Changing language/mode resets the preparation to
   that language's **single starter**, not all catalog packs, and never translates
   custom questions.
2. Browse by category, question language and bundled/custom origin, or search
   pack titles/IDs (case and diacritics are ignored). Filters only change what
   you see: **hidden selected sources remain selected**, and the selected-source
   summary always lists them. Filtering never edits or invalidates an accepted
   board. Use **Clear source selection** before choosing a different fixed pack;
   **Clear catalog filters** only restores the full list. Mixed-category custom
   packs match each of their categories. Filters are session-only, not saved.
   Select packs, or **Import JSON files** (one or several). Imports stay in your
   browser; there is no remote upload. A batch with any invalid/conflicting file
   is rejected without replacing the existing library, proposal or editor draft.
3. For letters, select exactly one authored letter pack and **Use selected fixed
   board**. For numbers, select same-language sources and **Generate / regenerate
   28 numbers**, then **Accept this board**. Insufficient distinct questions,
   mixed languages and conflicting question IDs produce actionable errors.
   **Use selected number board unchanged** restores an imported/prepared order.
4. **Edit selected pack as a copy** or **Edit proposal as a copy** opens the
   actual question/answer/alias/category/source and pack title/ID/authors/license
   editor. Lists use one entry per line. Question IDs stay stable; fixed initials
   and their authored order cannot move. Number/source positions can move.
   **Validate and save custom copy**, then accept the final board.
5. **Download pack JSON** exports every supported pack, including generated and
   edited versions. **Export selected packs** downloads each selected source;
   your browser may ask permission for multiple downloads. Reimport JSON to
   restore the exact documented content and placement.
6. After acceptance, **Download private answer sheet (HTML)**. Open the
   self-contained downloaded file separately and use browser Print / Save as
   PDF. It contains all 28 row-major cell numbers, question IDs, explicit initials,
   questions, answers and aliases, without game controls or external fonts.
   A factual-source appendix maps every citation/note to its exact cell number
   and question ID, including shuffled number games. Sources are printed as
   inert text, not clickable/executable URLs. Authors, licenses and source-pack
   attribution remain included. The appendix begins on a separate printed page.
   Keep it on paper or another private device, not the players' shared screen.
7. **Start game** locks content, even after a win or a host field reset. In-game
   JSON/sheet downloads use the played snapshot, not the preparation library.

Prepare before players gather: the editor intentionally shows answers. Opening
an editor, changing source selection or regenerating invalidates acceptance and
sheet availability. Discard older downloaded sheets and download the newly
accepted version; downloads are independent snapshots, not live documents.
Each edited/generated board gets a new pack ID by default, displayed in setup
and on its sheet. Imported text is rendered as text, never executable markup.

### Local storage and backups

The versioned `hexy.library.v1` localStorage record contains validated custom
packs and interface/game-setup preferences. Imports, saved editor copies and
accepted generated boards are saved automatically. Bundled assets are never
modified. Unsaved editor drafts/proposals are not persisted.
`localStorage` is sufficient for this small static, single-browser library:
synchronous atomic replacement makes complete-record validation and
failure-preservation straightforward, without a database framework or dependency.
There is no app-imposed pack-count limit; browser quotas vary.

**Browser-local storage is not a backup. Export JSON and keep copies elsewhere.**
Private browsing, site-data clearing, a different browser/profile/origin or quota
limits can make this data unavailable. Errors are shown in the current UI
language; a failed write leaves the current pack/game usable in memory and the
previous stored value intact.

- **Full storage / oversized copies:** use **Manage local saving** to export a
  custom copy, open **Exclude from local saving**, then confirm exclusion.
  Confirmation immediately retries saving only the included copies/settings.
  Exclusion does not remove content from the current session: selected sources,
  accepted preparation and a locked running game remain unchanged and exportable.
  After a successful save, excluded copies disappear on reload; keep their JSON.
  **Include again and retry saving** reverses the exclusion during this session.
  If a write still fails, previously stored data remains intact. Do not clear
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
format change. A newly edited/generated copy is included by default. The storage
management controls also remain available during play without unlocking content.

Corrupt/incompatible libraries are never silently overwritten or cleared.
Preserve the raw `hexy.library.v1` value using browser site-storage tools before
repairing/removing that site's data; use a compatible application for a newer
format. Until then, work in memory and export. This is not running-game recovery.
Use one editing tab: concurrent-tab merging is not implemented.

### Saved-game recovery and backups

`hexy.game.v1` is separate from the library: it stores the validated domain game,
including locked questions/aliases/placement, board, chooser, phase and original
deadline. Every accepted game transition saves synchronously **before rendering**.
Library saving inclusion/exclusion never edits that snapshot. `hexy.inputs.v1`
separately stores versioned keyboard mappings; it does not contain gamepad assignments.

- Check **Game recovery**: **not saved** means the current state is only in
  memory, even if an earlier game remains in storage. Quota/access failures never
  claim success. Export the game, reduce the custom library using its existing
  confirmed exclusion controls, then **Retry recovery / saving**.
- **Export game / original save** downloads the current full game, or the raw
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
  confirm discard again to explicitly remove it. Close other tabs first.
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
  Game exports contain gameplay, not library or display preferences; names/colors
  use this browser's setup preferences. Export custom packs separately as needed.
- This browser version renders duel symbols named `circle`, `triangle`, `square`
  and `star`. A save using other symbols is rejected before adoption or saving,
  even between turns or during an interrupted duel. The original stays intact:
  keep its export and use a compatible version, or explicitly discard it. Config
  symbols are never silently substituted. This is a browser compatibility check,
  not a change to the general domain save schema.
- Confirmed **New game** removes the saved game before leaving play. If removal
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

The phase-6 candidate contains **24 packs / 672 entries**: two fixed 28-question
packs per category and language for General knowledge, Nature, Geography
and travel, History, Politics and diplomacy, and Science and technology.
The twelve reviewed phase-5 packs remain byte-for-byte unchanged, including
the original starters `general-cs-01` and `general-en-01`.
Phase 6 adds twelve packs / 336 questions; all new entries await independent
factual and linguistic review. Programming, Arts/literature and Entertainment
remain planned for phase 7, not delivered. Each pack also works as a
selected number-game source. Questions can recur across games; neither filtering
nor generation promises permanent novelty.

See the [inventory and editorial policy](docs/content-inventory.md) and the
[672-entry source-check ledger](docs/content-sources.md). Original Czech and
English questions use their own fixed alphabets, not forced translations.
Sources were checked during authoring on 2026-10-28; the ledger identifies the
temporarily unavailable BCcampus starter citation and its verified corroboration.
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
Name/trademark clearance, complete content inventory and public hosting
remain later-phase work. Passing tests alone never clears a phase.

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
“HexY” name/trademark clearance remains pending.
