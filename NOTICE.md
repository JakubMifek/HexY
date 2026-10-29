# Rights and distribution notices

Copyright © 2026 HexY contributors.

- **Original application code and developer documentation:** [MIT](LICENSE).
- **Original question wording and original artwork:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
  Credit **HexY contributors**, link to [this repository](https://github.com/JakubMifek/HexY)
  and the license, and indicate modifications. Suggested credit:
  “HexY contributors — HexY, CC BY 4.0; modified by [your name]” with those links.
  Do not describe third-party imports as relicensed under CC BY 4.0.
- **Artwork origin:** the hexagon/Y mark in `src/ui/header.js`, board SVG in
  `src/ui/board.js`, CSS styling and standard geometric duel symbols are original
  application artwork. System fonts are used; no font files, stock images,
  television artwork, sound recordings or music are distributed.
- **Facts and references:** the 36 JSON packs contain original question wording,
  not copied source passages or quiz-bank material. Factual citation pages keep
  their own rights. The [source ledger](docs/content-sources.md) and
  [independent reviews](IMPLEMENTATION_PHASES.md) record provenance and corrections.
  Exported packs and answer sheets preserve authors, licenses and origin chains.
- **Build-generated code:** Vite's modulepreload helper is included in the
  production JavaScript. Its MIT copyright notice is
  “Copyright (c) 2019-present, VoidZero Inc. and Vite contributors”, as recorded
  in the installed, lockfile-pinned Vite package's `LICENSE.md`.
  The production `index.html` carries that notice, the MIT permission/warranty
  text and the original-content attribution. Preserve it when redistributing
  the built site, along with its matching assets.
- **Development and hosting tools:** there are no npm runtime dependencies.
  Vite, Vitest, Playwright, ESLint, TypeScript, Prettier, jsdom and transitive
  packages retain their upstream license files in their package distributions.
  They are development tools, not wholesale bundled into the site. Browser
  executables, local test libraries and the separately operated NGINX image
  retain their own notices; none is part of `dist/`. Recheck licenses and emitted
  helpers when dependencies change; this is not a blanket license for npm.

No affiliation with or endorsement by Česká televize, AZ-kviz, cited sources or
other Hexy-named products is claimed. Copyright licenses do not grant trademark
rights. The selected **HexY** name is **not cleared**; see the preliminary
[naming evidence and release decisions](docs/release-readiness.md).
