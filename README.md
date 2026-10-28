# HexY

Playable local quiz for two players sharing a screen. **Phase 2 independently
reviewed and verified, not yet a production release.**
See [phase status](IMPLEMENTATION_PHASES.md) and [contracts](docs/contracts.md).

## Play

Choose interface language and light/dark theme at the top. Setup selects player
names/colors, starter (A, B or random), question duration (default 30 seconds,
1–3,600 seconds), board, answer mode and question language.

- Connect one group of your fields to all three edges. Corners touch two edges.
- Fixed-letter boards preserve the authored alphabet; number boards shuffle all
  28 questions from the selected language's starter pack, without repeats.
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

**No persistence yet:** reload/navigation loses the game. This phase has no
editor, import/export, answer-sheet printing, gamepads or remapping. Static
downloaded content is inspectable; this is friendly local play, not anti-cheat.

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
| Critical       | `src/domain/*.js`, `src/runtime/*.js`, `src/app.js`                      | ≥95% each                  | ≥90%     |
| Remaining      | All other production JS, including UI, entry point, catalog and messages | ≥85% each                  | ≥80%     |

Coverage HTML and machine-readable metrics are in `coverage/`. The critical group
includes application orchestration because it owns state, timing and input
lifetime. DOM tests run the real engine using jsdom; only unavailable browser
dialog/scroll primitives are adapted. Real modality, SVG keyboard interaction,
layout and screenshots are verified separately in Chromium. Passing browser
journeys is **not** counted as statement coverage. Phase 1 did not measure coverage.

## Implementation boundaries

- `src/domain/`: unchanged pure engine, geometry, normalization and versioned
  pack/save contracts.
- `src/app.js`: application lifecycle, captured action contexts and state-to-view
  orchestration; no gameplay rules duplicated here.
- `src/runtime/`: deadline scheduling and release-filtered keyboard input.
- `src/ui/`: setup, native SVG board, question/duel panel, host controls and
  Czech/English labels. No UI framework or graphics dependency.
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
