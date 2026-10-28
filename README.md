# HexY

Phase 1 foundation, **independently reviewed but not yet playable**.
The host correction policy is resolved and post-review checks passed.
See [phase status](IMPLEMENTATION_PHASES.md) and [contracts](docs/contracts.md).

## Development

Requires Node.js 20.19+ (or a newer Vite-supported Node release) and npm.
No runtime dependencies, backend, external fonts, analytics or remote imports.

```sh
npm ci
npm run dev
```

The local Vite server prints its loopback URL. The shell only displays a
foundation-status message; it is not a playable quiz or a visual-design preview.

```sh
npm run format        # format implementation, tests and related docs
npm run format:check  # check formatting without writing
npm run lint         # ESLint plus size, complexity and nesting ceilings
npm run typecheck    # strict JSDoc JavaScript checking, no emitted TypeScript
npm test             # all Vitest tests, no watch mode
npm run build        # static output in dist/
npm run check        # all five phase-gate checks, without rewriting files
npm run preview      # serve the built shell on loopback
```

The approved instruction files are excluded from formatting. Production functions
are limited to 60 nonblank/noncomment lines, modules to 300, cyclomatic complexity
to 10, and control-flow nesting to three. Test-file length is exempt; individual
test functions retain the function limits.

## Foundation

- `src/domain/board.js`: immutable seven-row geometry, adjacency and connected wins.
- `src/domain/game.js`: explicit pure transitions; hosted/typed answers and deadlines.
- `src/domain/duels.js`: injected randomness, guaranteed target, ties and interruptions.
- `src/domain/packs.js`, `saves.js`: versioned, validated JSON contracts.
- `src/domain/types.js`: JSDoc state/action/data types.
- `src/messages.js`: Czech/English boundary messages.
- `tests/`: original synthetic fixtures and deterministic behavior tests.

`npm test` covers turn ownership, all cells and three edges, normalization,
fixed prefixes, stale/late events, duel results, recovery schemas and invalid
input. Tests use synthetic repeated board fixtures, **not a reviewed content
library**. Physical controllers, touch devices, browser gameplay, printing and
local persistence are not implemented or claimed. Playwright journeys start
with the playable UI in phase 2; device/storage adapters arrive later.

The approved host policy, exact verification evidence and handoff are
recorded in `IMPLEMENTATION_PHASES.md`. Passing tests do not clear a phase.

## Rights

Original code is [MIT licensed](LICENSE). Original question wording and artwork
are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/);
attribute “HexY contributors”, link to the source repository and license, and
indicate changes. This currently covers only original synthetic fixture wording;
no production question library or artwork is shipped. Imported third-party
content keeps its own declared rights and is not automatically relicensed.
Dependencies retain their licenses and notices.

No television assets are included. “HexY” name/trademark clearance remains
pending; these licenses do not grant rights to third-party brands or material.
