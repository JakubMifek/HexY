# HexY

Playable local quiz for two players sharing a screen. **Phase 3 preparation,
library and answer sheets are independently reviewed, not a production release.**
See [phase status](IMPLEMENTATION_PHASES.md) and [contracts](docs/contracts.md).

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
- Select black fields for keyboard duels: A uses **Left Shift**, B **Right Shift**.
  Memorize the target, release held keys, then press only when the target appears.
  Wrong symbols award the other player. Ties and missed targets replay.
- Losing focus interrupts duels without an award. Return and **press and release
  Left Shift, then Right Shift in this window**, even if you released them
  outside it. These rearming presses cannot capture a field. Have both players
  confirm readiness, then restart. A blocked restart explains the release/focus
  requirement; losing focus again requires both releases again. Questions never
  pause.
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
layouts are supported; keyboard duels still require a physical keyboard.

**Reload/navigation still loses the running game.** Custom packs and settings
are stored locally; game recovery, gamepads, remapping and touch buzzers belong
to phase 4. Static downloaded content is inspectable; this is friendly local
play, not anti-cheat.

## Prepare packs and private answer sheets

Both spoken and typed games use the same preparation workflow:

1. Choose question language and board mode. The matching bundled fixed-letter
   starter is initially ready. Changing language/mode resets the preparation to
   that language's starter selection, never translates custom questions.
2. Select packs, or **Import JSON files** (one or several). Imports stay in your
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
modified. Unsaved editor drafts/proposals and running games are not persisted.
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
  edits without reloading cannot save. Running games still cannot survive reload.
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

Original and imported rights remain distinct. Mixed boards preserve each
question's source-pack attribution chain in the documented optional `origins`
field, plus factual `sources`; generated license text does not relicense imports.
See [format and duplicate-resolution rules](docs/contracts.md).

## Starter content

`src/content/general-cs-01.json` and `general-en-01.json` contain 28 original
questions each, with explicit aliases and factual source URLs. They are
independently adapted general-knowledge starter packs, not a full library.
They count as **2 of the planned 36 packs / 56 of 1,008 entries**. Every source
was accessed on 2026-10-28 (Wikipedia, NASA, NOAA, CDC and the BCcampus
_Physical Geology_ textbook); source checks do not replace
the independent review of every question's wording and factual accuracy.
Both fixed alphabets and all 56 entries are validated by tests.

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
- `src/runtime/`: deadline scheduling, release-filtered keyboard input,
  preparation invariants, local-library writes and download URL lifetimes.
- `src/ui/`: setup, native SVG board, question/duel panel, host controls and
  Czech/English labels, preparation editor and escaped print-ready HTML.
  No UI framework or graphics dependency.
- `tests/`, `browser/`: deterministic engine/adapter/DOM behavior and real-browser
  journeys, including both languages, themes, answer modes and board modes.

No phase-2 physical Xbox/tablet or screen-reader-device verification is claimed.
Name/trademark clearance, complete content inventory, recovery and public hosting
remain later-phase work. Passing tests alone never clears a phase.

## Rights

Original code is [MIT licensed](LICENSE). Original question wording and artwork
are [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/):
attribute “HexY contributors”, link to the source repository and license, and
indicate changes. Factual source pages keep their own rights; source citations
do not relicense those pages. Imported third-party content keeps its declared
rights. Dependencies retain their licenses and notices.

The hexagon/Y logo and SVG artwork are original; no television assets are used.
“HexY” name/trademark clearance remains pending.
