# Phase 1 contracts

These are version 1 JSON contracts, backed by JSDoc in `src/domain/types.js` and
runtime validators. No browser storage adapter is implemented. JSON serialization
is `JSON.stringify`; pack import is `importPack`, saved-game parsing and recovery
is `recoverGame`. Validators reconstruct owned data and never mutate the supplied
value or overwrite a caller's current valid game/pack.

Invalid external values throw `DomainError` with `code` and a field `path`.
Use `message('cs' | 'en', error.code)` at the UI boundary; paths are structural
identifiers, not translated content. Syntax, unsupported versions, content
validation and stale input are distinguished. Stale/inactive valid actions return
`{ state: originalState, outcome: 'ignored', reason }`, not a user-facing error.

## Packs

| Field           | Contract                                                 |
| --------------- | -------------------------------------------------------- |
| `schemaVersion` | Exactly `1`; unknown versions are rejected               |
| `id`, `title`   | Nonempty strings                                         |
| `language`      | `cs` or `en`                                             |
| `mode`          | `source`, `numbers`, or `letters`                        |
| `authors`       | Nonempty list of nonempty attribution strings            |
| `license`       | Nonempty rights statement, preserved without relicensing |
| `questions`     | Nonempty ordered array; IDs unique within the pack       |

Every question has nonempty `id`, `text`, `initial`, `answer`, `category`;
`language` equal to the pack language; `aliases` (possibly empty string array);
and nonempty `sources` (source URLs or human-readable provenance notes).
Each alias itself must be nonempty. Provenance validation checks structure, not
factual accuracy. Category is an extensible text identifier for custom content.

`source` is a source bank of any positive size, not a playable board.
`numbers` and `letters` are locked preparations with exactly 28 questions;
array index + 1 is the immutable row-major cell ID and answer-sheet number.
Numbers preserve their prepared order. Letters require this exact prefix order:

```text
cs: A B C Č D E F G H Ch I J K L M N O P R Ř S Š T U V W Z Ž
en: A B C CH D E F G H I J K L M N O P Q R S SH T U V W X Y Z
```

Canonical answers must start with the explicitly assigned prefix after NFC
normalization and case folding **without removing diacritics**. A `Ch`/`CH`/`SH`
prefix is explicit; it is never inferred from one character. Aliases need not
start with the prefix. Typed matching removes combining diacritics, ignores case,
trims and collapses whitespace. Punctuation/hyphens stay significant; no fuzzy
matching or unapproved punctuation equivalence is introduced. Broader punctuation
handling remains a product choice; authors can supply explicit aliases meanwhile.

Unknown extra fields are not part of version 1 and are discarded on validation.
Only documented fields round-trip. No generation/editor/export UI is included.

Starting a game reconstructs its own pack snapshot. Later changes to the source
pack cannot edit that game; there are no question/answer/pack editing actions.
Host resets reuse the same assigned content. The saved game includes this locked
snapshot; recovery must not substitute a newer source pack. The preparation UI
must lock content editing once play starts, including after a win that the host
could correct away.

## Game and save

`createGame(pack, config, now, sessionId)` accepts a validated prepared board.
`config` requires:

- `answerMode`: `hosted` or `automatic`.
- `timeLimitMs`: positive safe integer; exported default is 30,000 milliseconds.
- `starter`: `A` or `B`; call `randomStarter(random)` for a random selection.
- `duel`: positive integer `previewMs`, `symbolMs`, `length` and at least two
  distinct nonempty `symbols`. `length` is at most 1,000, a resource safety bound,
  not a recommended game duration.

Final symbol set and tuning are **not chosen**: the caller supplies them.
Test fixtures use artificial 100 ms timings solely for deterministic tests.

The save is the game object itself:

- `schemaVersion: 1`, complete `pack`, `config`, and 28 `cells`, each `unclaimed`,
  `black`, `A` or `B`.
- `sessionId`: caller-supplied unique runtime scope; never reuse it for another
  game or recovery. A later browser adapter can supply `crypto.randomUUID()`.
- `chooser`: player choosing the current/next cell.
- `revision`: nonnegative safe integer, incremented after accepted transitions.
- `lastNow`: nonnegative safe integer timestamp of the last accepted transition.
- `stage`: one explicit variant:
  - `selecting`.
  - `question` or `opponent`, with `round: {cell, originalChooser, startedAt,
deadline}`. Deadline is exactly start + configured limit, even in opponent
    phase; opponent has no countdown.
  - `duel-preview` or `duel-active`, with `round: {cell, originalChooser, target,
sequence, startsAt}`. Preview ends at `startsAt`; each sequence symbol lasts
    `symbolMs`. The target appears once at the final position, chosen randomly
    between one and `length`; prior symbols exclude the target.
  - `duel-interrupted`, with `round: {cell, originalChooser}` only.
  - `won`, with `winner` and the sorted IDs of its connected `winningCells`.

Save validation cross-checks round ownership, chooser, deadlines, sequence timing
and actual connected victories, not just field types. A black cell retains its
pack position/ID and prefix. Owned cells also keep identity in data; eventual UI
must hide their labels. Runtime resources and DOM objects never enter saves.

`recoverGame(json, now, freshSessionId)` preserves original question deadlines,
transfers already-expired questions to the opponent, and converts preview/active
duels to `duel-interrupted`. It never awards an interrupted field. Explicit
`restart` represents both players being ready; the adapter must collect that
readiness. Recovery changes the session scope and revision, so old input cannot
apply even when numeric revisions happen to coincide. Keep the original file on
validation failure. Browser-local data is not a backup.

## Actions, time and input

`transition(state, action, {now, random})` returns a new state only when applied.
`action` always carries the **rendered/captured** `sessionId` and `revision`;
never replace those fields with the latest state at callback execution.
After each applied transition, adapters must bind pending callbacks to the new
revision without changing deadlines. This includes wrong initial guesses.

Actions: `select(cell)`, `answer(player,text)`, `judge(correct)`, `give-up`,
`tick`, `press(players)`, `interrupt`, `restart`, `set-cell(cell,owner)` and
`set-chooser(player)`. Hosted judgments and typed answers are mode-specific;
only hosted mode permits corrections.

`now` is injected current processing time in integer milliseconds on one
nondecreasing epoch-compatible clock. It must persist meaning across reload.
Backwards clock movement fails explicitly; it must not silently extend time.
Do not pass a queued event's older timestamp as the processing clock.
`random` is injected and must return a finite number in `[0, 1)`.
Pure rules never call `Date.now`, `Math.random`, timers, storage or device APIs.

At `now >= deadline`, expiry precedes input. A late initial answer cannot become
an opponent answer; the caller must render the new revision first. Wrong initial
guesses remain unlimited. The opponent gets exactly one untimed opportunity.
Capture switches chooser to the actual recipient's opponent; double failure
switches relative to the original chooser.

The duel input boundary accepts one player's **fresh rising edge** or an atomic
two-player batch for indistinguishable ties. Release/repeat/held-button filtering,
timestamp grouping, keyboard mappings and gamepad polling belong to phase-2/4
adapters, not raw domain actions. A tie replays regardless of player array order.
Wrong-symbol presses award the opponent; missed targets replay. Preview presses
are ignored. A symbol boundary advances state/revision before accepting further
presses, rejecting queued input from the old visual context. An interruption
takes priority even exactly at a symbol or replay boundary.
Render the active symbol at index `floor((state.lastNow - startsAt) / symbolMs)`;
advance via `tick` rather than independently changing the visible symbol.

There is no pause action. A clock refresh with no transition returns the same
state; `remainingMs(state, now)` computes display time from the deadline.
Neither opening future controls nor losing focus grants extra question time.

## Host corrections

- Between rounds, set any cell to any owner, black or fresh/unclaimed, preserving
  its original question and identifier. Set chooser independently.
- Recompute connected victory after a cell correction; a created win ends play.
- After a win, a correction retaining a winning component retains victory.
  Removing the winning connection returns to selection with the existing chooser;
  the host can independently set another chooser.
- Every applied correction changes revision and invalidates queued actions.
- Edits are allowed only in `selecting` or `won`. During a question, opponent
  attempt or any duel phase, host edits fail with `correctionUnavailable`.
  Controls must be unavailable during those stages; no cancellation or timer
  reset is offered.
- Manual cell edits preserve the chooser. There are no mid-round pending chooser
  overrides; normal gameplay retains recipient-based next-player rules.
