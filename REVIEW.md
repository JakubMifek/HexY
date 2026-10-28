# HexY Independent Review Instructions

Status: APPROVED by the user on 2026-10-28, together with `AGENTS.md` and
`IMPLEMENTATION_PHASES.md`.

## Role and independence

Read `PLAN.md`, `AGENTS.md` and the current phase in `IMPLEMENTATION_PHASES.md`.
Review the implementation against the agreed product, not personal preferences
or the original television rules.

The phase reviewer must be a separate agent/session from its developer. Start a
fresh reviewer for each phase; follow-up reviews of fixes may retain that same
reviewer. The reviewer must not author the code being approved.

Review read-only: do not edit application code, tests, configuration or content.
You may execute safe local checks and produce test artifacts. Return a report
for the coordinator to persist. Do not install dependencies, mutate snapshots,
commit, deploy, contact external parties or alter shared services.

Review the complete phase change, including untracked files, and relevant
integration paths. Do not rely solely on the developer's summary or passing
tests. Use a fixed snapshot; if files change during review, invalidate the
affected conclusions and review the new snapshot.

## Mandatory review lenses

Every phase report covers each lens below. Mark a lens not applicable only with
a concrete explanation, such as a foundation-only phase without browser UI.

### 1. Correctness and phase completeness

- Map every phase acceptance criterion to implementation and evidence.
- Check game transitions, victory detection, host overrides, deadlines,
  interruption recovery and input races where applicable.
- Check failure behavior, invalid imports/saves and cleanup of resources.
- Confirm tests prove the actual requirement, not merely a convenient proxy.
- From phase 2, verify the user-approved separate coverage gates: critical rules,
  validation, timing and recovery >=95% lines/statements/functions and >=90%
  branches; remaining production JS >=85% lines/statements/functions and >=80%
  branches. Require exact measured metrics, full file inclusion (including
  untested files), justified exclusions limited to generated outputs/content
  data/type-only declarations, and enforced failures below either group's gate.
  Do not accept E2E success as statement coverage or meaningless tests replacing
  real behavior. Phase 1 coverage was not measured.
- Detect missing scope, misleading completion claims and regressions.

### 2. Usability and accessibility

- Walk through applicable user journeys in the actual browser.
- Check whether a new player/host can tell whose turn it is and what to do next.
- Inspect keyboard/focus behavior, touch targets, contrast and non-color state
  cues, both themes, both languages, validation and recovery feedback.
- Check approved desktop/tablet layouts, long questions and Czech text.
- Ensure host controls cannot be mistaken for player actions or expose answers.
- Test print output and preparation flows when they are part of the phase.
- Use screenshots plus interaction evidence; screenshots alone do not prove
  keyboard, timing or screen-reader usability.
- Distinguish tested browser emulation from actual physical-device verification.

### 3. Readability and maintainability

- Trace key behavior without excessive indirection.
- Inspect naming, size/complexity ceilings, cohesive functions and module scope.
- Flag duplicate logic, dead code, mysterious flags and implicit coupling.
- Evaluate comments: useful reasons/constraints only, no obvious narration.
- Check tests are understandable and avoid overmocking or fragile internals.
- Verify error handling exposes failures instead of hiding them.
- Require a concrete improvement, not a vague accusation of "AI slop."

### 4. OOP and responsibilities

- Where classes exist, verify clear ownership, encapsulation, invariants and
  lifecycle cleanup; identify god objects or unnecessary inheritance.
- Verify pure domain logic is not forced into classes without benefit.
- Check composition and dependency direction; keep DOM, storage and devices
  out of pure rules.
- Evaluate whether state can be serialized/recovered without runtime objects.
- Do not demand a class, interface or abstraction just to satisfy an OOP label.

### 5. Design patterns and proportionality

- Verify the explicit state machine represents actual gameplay stages.
- Assess whether each adapter/strategy/factory removes a current problem.
- Flag generic frameworks, global buses, service locators and speculative
  extension points where a direct function or module would suffice.
- Also flag missing shared logic where duplication causes behavioral divergence.
- Explain the concrete coupling, complexity or correctness consequence.
- Review dependencies and file count for purpose, not arbitrary minimalism.

### 6. Content, rights and delivery

- For content phases, review every shipped entry for factual correctness,
  source support, unambiguous wording, natural language, useful aliases and
  matching board initial. Sampling alone does not clear an entire pack.
- Check category/language/pack counts and fixed placement, not just JSON syntax.
- Do not let an obscure letter force fabricated facts or unnatural answers.
- Check original wording, provenance and applicable license notices.
- For release, inspect deployment behavior and public URL evidence, not merely
  a successful local development server.
- Keep legal ownership/name clearance limitations explicit; do not claim a
  trademark is cleared because a web search returned no matches.

## Evidence and findings

For each finding report:

1. Identifier and severity: blocker, major, minor or suggestion.
2. Exact file/line range or content entry ID.
3. Reproduction steps or a concise, verifiable reasoning chain.
4. User/maintenance impact and the violated requirement.
5. Smallest reasonable correction and a way to verify it.

Severity definitions:

- **Blocker:** prevents required operation or reliable validation, corrupts data,
  or fundamentally violates the phase/product contract.
- **Major:** significant incorrect behavior, unusable required flow, or a
  substantial readability/OOP/design defect with demonstrated consequences.
- **Minor:** concrete localized defect, including an unjustified size violation
  or useless comment. Still needs resolution before clearance.
- **Suggestion:** optional preference or improvement without a present defect.
  Must not force scope creep or block the phase.

Do not inflate severity for taste. A convention or metric exception can be
accepted only with a documented reason. The reviewer cannot waive product
requirements or downgrade a defect merely because it is expensive to fix.

## Verdict and clearance

Return one verdict:

- **CLEARED:** all phase criteria verified; no unresolved blocker/major/minor
  findings; any accepted exceptions are explicit and justified.
- **CHANGES REQUIRED:** concrete findings need implementation changes.
- **BLOCKED:** evidence, access, a product decision or required hardware is
  unavailable. State what is missing; do not label untested work as passed.

Every lens must be covered, and all mandatory checks must pass. If a hardware
or environment gap applies only to a later release gate, it may be recorded as
that later dependency; never pretend the current phase verified it.

Suggestions may remain without implementation. Genuine scope reduction or
defect deferral requires explicit user approval and a documented follow-up,
not unilateral developer/reviewer agreement.

Reviewer clearance is followed by the coordinator's mandatory post-review test
run on the same snapshot. A failure reopens the phase and requires fixes and
re-review. Record those final test results before the phase is committed and
pushed; the next phase cannot start until that push is verified.

## Report format

Return a concise Markdown report containing:

- Phase and reviewed snapshot/revision, relevant file set and reviewer session ID
  when available.
- Verdict.
- Acceptance-criteria checklist with evidence.
- Findings table: ID, severity, location, issue, verification/fix.
- Notes for all six lenses, including justified not-applicable cases.
- Commands actually run and observed results; browser/device evidence.
- Known limitations and accepted exceptions.
- Re-review outcome for each previously reported finding.

The coordinator saves the report as `reviews/phase-NN.md` after implementation
begins. Keep each phase's initial findings and re-review outcomes in that report
so a new session can understand why the phase was cleared. Do not create empty
review reports before actual reviews occur.
