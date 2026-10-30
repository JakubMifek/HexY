# HexY Coding Instructions

Status: APPROVED by the user on 2026-10-28, together with `REVIEW.md` and
`IMPLEMENTATION_PHASES.md`. Follow the phase gates and operational permissions.

## Start here

Read `PLAN.md`, `IMPLEMENTATION_PHASES.md`, and `REVIEW.md` before working.
The product plan defines behavior; this file defines implementation standards.
If instructions conflict or a product decision is unresolved, surface the conflict
instead of silently choosing a different requirement.

Implement only the current approved phase and fixes needed to clear its gate.
The user has approved starting the phased developer/reviewer process. Check the
phase ledger for blockers before launching work; approval does not override
tool permissions or authorize deployment changes.

## Standard of quality

Every module, function, class, dependency and comment must serve a present
requirement. Prefer direct code that a new contributor can trace without opening
several layers of wrappers. Correctness, usability and clarity outrank cleverness.

Avoid speculative features, placeholder abstractions, duplicate implementations,
dead code, commented-out code, decorative documentation, and invented extension
points. Do not trade maintainability for the appearance of an architecture.

## Approved stack and boundaries

- Vanilla JavaScript ES modules, JSDoc type checking, Vite, npm and a lockfile.
- Native SVG and CSS; no UI framework or graphics library.
- Vitest for behavior tests; Playwright for browser flows.
- Versioned JSON packs and printable HTML answer sheets.
- Static hosting, local play and local persistence; no accounts or backend.

Use the approved tools. Any additional runtime dependency must solve an actual
need better than a small native implementation and have compatible licensing.
Do not add a dependency merely to avoid a short, clear function.

Establish formatting, linting and JavaScript type-checking commands in phase 1.
Use ESLint, a consistent formatter and TypeScript's JavaScript checker as
development tooling; do not convert the application to TypeScript.
Record exact working commands in the repository README once created.

## Object-oriented design and patterns

- Use OOP where an object owns state, invariants or resource lifetime. Examples
  include an input subscription or storage adapter with a clear lifecycle.
- Prefer pure functions for board geometry, answer normalization, validation,
  win detection and deterministic state transitions.
- Keep serializable game state separate from runtime resources and DOM objects.
- Prefer composition and explicit dependencies over inheritance or global access.
- Use a small explicit state machine for game phases. Do not build a generic
  state-machine framework to support one game.
- Inject time, randomness and external I/O at the relevant boundary so behavior
  is testable; do not introduce a dependency-injection container.
- Keep adapters small and concrete. An interface or base class requires a real
  substitution need, not a hypothetical future implementation.
- Do not add singleton services, global event buses, factories, repositories or
  strategy hierarchies unless the current problem genuinely warrants them.
- Do not wrap pure functions in static-method classes to satisfy an OOP quota.

Judge a pattern by the coupling or duplication it removes, not by its name.
Explain a non-obvious design choice in the phase handoff, not in essays beside
the code. Avoid an all-knowing game/controller/UI class.

## Size, naming and control flow

Approved reviewable limits:

- Aim for functions of 10-40 nonblank, noncomment lines; maximum 60.
- Production modules: maximum 300 nonblank, noncomment lines.
- Cyclomatic complexity: maximum 10 per production function.
- Nesting: maximum three control-flow levels inside a function.

These are ceilings, not targets or reasons to compress statements onto one line.
Keep individual test cases comparably small; test suite declaration callbacks,
declarative fixtures, translations and question JSON are not production function
or module-size violations.

An exception requires a specific reason recorded in the phase review and reviewer
acceptance. Do not disable rules silently. Prefer cohesive decomposition; do not
split code into meaningless one-line forwarding helpers to satisfy metrics.

Use domain names, explicit units and verbs that describe effects. Replace magic
values with meaningful constants when their meaning is not obvious. Favor guard
clauses, explicit state variants and exhaustive handling over nested conditionals
and unrelated boolean flags.

## State and asynchronous work

- Maintain one authoritative game state. UI and storage project that state;
  they do not independently decide ownership, turns or wins.
- Route gameplay and host corrections through explicit validated transitions.
- State transitions must account for the original chooser and actual recipient.
- Use deadlines, not decrement-only intervals, for question time.
- Timeouts, input events and delayed work must carry enough context to reject
  stale events after a correction, new question, recovery or completed game.
- Clean up listeners, timers and animation frames when their owner is disposed.
- Distinguish cancellation, expected stale input and actual failures.
- No extra answering time from focus loss, reload or opening host controls.
- Never award a field twice or reveal an answer before the opponent is finished.

Resolve host corrections during active rounds and after victory before wiring
those controls. Ask for approval if the resolution changes agreed gameplay.

## Data, types and errors

- Use JSDoc for contracts and meaningful types, not redundant prose.
- Check JavaScript types; avoid `any`, blanket ignores and unsafe assertions.
- Treat imported JSON, saved state and external device data as untrusted.
- Validate at boundaries; keep internal invariants clear rather than scattering
  repeated defensive checks throughout the application.
- Render imported content as text, never executable HTML.
- Catch errors at a boundary that can explain or recover from them. Never use
  broad catches, silent fallback data or success-shaped failures.
- Preserve the current valid game/pack when an import fails.
- Report actionable localized errors for invalid packs, unavailable storage,
  incompatible saves, failed exports and unavailable/disconnected input devices.
- Do not log full question packs, user imports or unnecessary personal data.
- Expected ignored key repeats/stale events are not user-facing failures.

Version persisted/exported formats. Do not silently discard incompatible saves
or promise browser-local data is a backup. Keep bundled assets immutable.

## Usability, accessibility and visual implementation

- Honor both themes, both UI languages, desktop/laptop and tablet.
- Keep the question panel below the triangle; preserve the approved glossy
  hexagon style without copying television assets.
- Make active player, current phase, remaining time and required action clear.
- Do not reveal accepted answers through visible hints or accessibility labels
  before the answer opportunity is resolved.
- Use semantic controls, keyboard navigation, visible focus and appropriate
  accessible names for the SVG board and host controls.
- Distinguish ownership and black/unclaimed states by more than color alone.
  Phase 9 has an explicit owner-approved exception: no visible owner symbols or
  player-specific border styles, and no black ×. Preserve accessible ownership
  names, focus and win feedback; disclose the reduced color-vision accessibility
  as specified in `PLAN.md`.
- Target WCAG 2.2 AA contrast; controls should have at least 44 CSS-pixel touch
  targets where feasible. Record and justify any constrained exception.
- Respect reduced motion. Do not announce every timer tick to screen readers.
- All user-facing strings, including validation and recovery messages, belong in
  the localization mechanism; no mixed-language fallback labels.
- Keep printing free of unrelated controls and verify answer-sheet numbering.
- Do not claim physical Xbox/tablet verification based only on browser mocks.

## Comments and documentation

Comment only a non-obvious invariant, external constraint, surprising tradeoff or
workaround. Explain why, not what the next statement plainly does.

No narrating ordinary loops, generated-style function summaries, repeated type
descriptions, decorative section banners or comments that excuse confusing code.
Prefer clearer names and structure. Remove stale comments when behavior changes.
Do not document unimplemented behavior as complete.

Update directly relevant usage instructions, data format documentation and phase
status. Keep longer design rationale outside production source.

## Tests and verification

User-approved coverage gates (2026-10-28), applicable from phase 2 onward:
critical game rules, validation, timing and recovery require at least 95% lines,
95% statements, 95% functions and 90% branches. Remaining production JavaScript
requires at least 85% lines, 85% statements, 85% functions and 80% branches.
Measure and enforce these as separate scope groups so core coverage cannot mask
untested UI. Include untested production files in denominators; exclude only
generated outputs, content data and truly type-only declarations such as
`src/domain/types.js`. No runtime-module exclusions or blanket coverage ignores.
Use meaningful behavior/invariant tests, without mocking away the engine to
chase percentages. Run `test:coverage` as part of the phase gate and browser
journeys separately. Browser-based coverage must genuinely instrument and merge
executed sources; E2E success is not statement coverage. Report exact metrics
and full file inclusion. Phase 1 did not measure coverage; do not claim otherwise.

- Test behavior and invariants, not private implementation details.
- Use deterministic clocks/randomness and isolated fixtures. Avoid real sleeps.
- Cover happy paths, boundaries, rejected input and lifecycle cleanup.
- A regression fix includes a focused test demonstrating the original failure.
- Browser tests must exercise the real UI, not replace the game engine with mocks.
- Mock browser/device boundaries when needed and disclose their limitations.
- Test export/reimport and recovery against actual formats.
- Pack schema validity is not proof of factual accuracy or natural wording.
- No skipped failing tests, weakened assertions or snapshot updates without
  explaining the intended change.

Run focused checks while iterating and the applicable phase-gate suite before
handoff. Record exact commands and results, including limitations. Formatting,
lint, types, unit tests and build must pass at every code-bearing phase gate;
browser coverage grows with the playable application.

## Developer handoff and working discipline

Work in the actual checkout `/home/jakubmifek/github/HexY`. Inspect current changes
before editing; preserve unrelated work. Do not run competing writers.

Before requesting review, provide:

- Current phase, completed acceptance criteria and relevant changed files.
- Exact verification commands/results and reproduction instructions.
- Decisions made, justified metric exceptions, and known gaps.
- Evidence for visible UI behavior and factual content where applicable.

Stop editing while the independent reviewer inspects the snapshot. Address
findings in small coherent changes; do not self-declare the phase cleared.
Never commit, push, change shared-server configuration or publish without the
appropriate user authorization. Do not put secrets in source or logs.
