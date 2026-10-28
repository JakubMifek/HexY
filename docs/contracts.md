# Domain and playable-adapter contracts

These are version 1 JSON contracts, backed by JSDoc in `src/domain/types.js` and
runtime validators. Phase 3 adds a versioned local custom-pack/settings library;
running-game storage/recovery remains a phase-4 adapter task. JSON serialization
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

Phase 3 adds one **optional, additive version-1 field** on questions:
`origins: [{packId, questionId, authors, license}]`. When present it is a nonempty
list; all strings and each author list must be nonempty. These are the source
pack's declared authors/rights, not independent verification of legal ownership.
Existing v1 packs without `origins` remain valid and round-trip unchanged.
Unknown extra fields are discarded; only documented fields round-trip.
Pre-phase-3 readers do not preserve this extension: use this version or newer
for attribution-preserving edits/exports, and keep original JSON backups.

Starting a game reconstructs its own pack snapshot. Later changes to the source
pack cannot edit that game; there are no question/answer/pack editing actions.
Host resets reuse the same assigned content. The saved game includes this locked
snapshot; recovery must not substitute a newer source pack. The preparation UI
must lock content editing once play starts, including after a win that the host
could correct away.

## Preparation, generation and editing

`generateNumbers(sources, language, random, id, title)` validates selected packs,
requires all to match the chosen language, and shuffles with injected randomness.
It never reads the catalog or adds unselected fallback content. Exactly 28
questions are drawn after deduplication; fewer than 28 yields
`insufficientQuestions`. There is no arbitrary source-count/question-count cap.

Question identity is preserved, not rewritten to positional IDs:

- Across selected packs, the same question ID with different validated content
  (including aliases/category/factual sources) is rejected with
  `conflictingQuestionId`. Select one version, or assign distinct IDs to truly
  different questions in imported JSON.
- Equal IDs/content are deduplicated. Actual question text also uses the existing
  case/diacritic/whitespace normalization to remove repeats with different IDs.
  This is conservative textual deduplication, not a claim of semantic fact matching.
- The first eligible occurrence in stable library order wins (bundled catalog,
  then custom insertion order); no random choice resolves identity conflicts.
  Its retained provenance is exported. Questions may recur in different games.
- `attributedCopy` preserves prior `origins`, appending the current source pack's
  declared metadata when not already represented. Generated authors/license text
  aggregates selected sources; question origins identify the applicable source
  declarations instead of assigning CC BY to private imports.

`Preparation` owns source selection, proposal, accepted snapshot, editor draft
and content revision. It is distinct from `Game`. Initial fixed starters are
ready without an extra acceptance step; other proposals require explicit
acceptance. Fixed boards never shuffle. Imported prepared number boards can be
used unchanged. `validatePlayable` also rejects normalized repeated question text
before acceptance/start/sheet export; ordinary source banks may contain repeats.

Editing creates an attributed custom copy with a fresh pack ID. The native editor
changes question text, canonical answer, aliases, category and factual sources;
number/source initials and ordering; pack ID/title/authors/license. Stable
question IDs and the pack language/mode are retained; fixed initials/order
remain authored. Validation uses the same `validatePack`, not a parallel schema.
All edits invalidate acceptance. Invalid saves retain the draft and previous
valid proposal. Saved copies and accepted generated packs join the local library;
different content may not overwrite an existing/bundled pack ID. A duplicate
import of identical validated content is idempotent. Multi-file import is atomic
in memory: validate/conflict-check the entire batch before adding anything.

Starting snapshots the accepted pack through `createGame`, then locks preparation
mutators and removes every editing/import/regeneration control. No win or host
correction unlocks content. New-game confirmation is required to return to setup.
Pending file reads carry both import sequence and content revision; later imports,
selection/editor changes, start and disposal invalidate stale success/failure
callbacks. Canceling a file chooser is not reported as a successful import.

## Local library, exports and print

`LocalLibrary` owns the storage availability/write-permission boundary. The
localStorage key `hexy.library.v1` contains:

```json
{
  "schemaVersion": 1,
  "packs": [],
  "preferences": {
    "language": "en",
    "theme": "dark",
    "setup": {
      "players": {
        "A": { "name": "A", "color": "#0891b2" },
        "B": { "name": "B", "color": "#d97706" }
      },
      "language": "en",
      "mode": "letters",
      "answerMode": "hosted",
      "starter": "A",
      "seconds": 30
    }
  }
}
```

Pack entries use the existing contract and have unique pack IDs. Preferences
validate language/theme/modes/starter, nonempty names up to 30 characters,
six-digit hex colors and integer seconds 1–3,600. Invalid transient setup inputs
do not replace the last valid stored configuration. No runtime resources, unsaved
editor drafts, proposals or games enter this record.

Imports, saved copies, accepted generated boards and valid preference changes
write the complete validated snapshot. The small synchronous, atomic localStorage
adapter was chosen over an additional database layer; quotas are browser-owned,
and concurrent-tab merging is not supported. Read/access, malformed/version,
quota and other write failures have distinct localized feedback. Corrupt/newer
records block subsequent writes until reload after explicit external repair;
the app never silently deletes them. Write failure preserves the prior stored
record and current valid in-memory work. Export JSON, not browser-local data
alone, is the backup. See README for preservation/retry steps.

`Workspace.excluded` is a session-only set of custom pack IDs. A localized
two-step confirmation excludes a copy from the **next saved record**, then
retries the smaller record; canceling leaves persistence unchanged. Each custom
copy has its own JSON export and explicit re-include/retry control. Filtering
occurs only at the persistence boundary, never in `Preparation.packs`, selected
sources, proposal/acceptance, editor drafts or `Game.pack`. Therefore exclusion
does not invalidate a still-identical selected preparation or unlock a running
game. Bundled/nonexistent IDs and disposed-workspace requests are ignored.
Successful exclusion leaves the copy exportable in memory until reload; failed
writes still leave the old stored record intact. Exclusion flags need not be
serialized: successfully excluded copies are absent from the saved `packs`
array. No schema change, content deletion, cap or database migration is involved.

`storageReadUnavailable` distinguishes initial access/read failure from
`storageUnavailable` after a validated read followed by a write failure. Initial
read failure keeps writes blocked, including after access is restored or copies
are excluded. The UI explicitly requires export → enable storage → reload
(validated read) → reimport; it no longer promises an edit-only retry can save.
This avoids overwriting unread existing copies. Corrupt/newer-library protection
is unchanged. Write-access failures can be retried normally because the existing
library was already read and validated.

`Downloads` owns generated Blob URLs and revokes them on disposal. JSON exports
validate/reconstruct the pack; filenames sanitize filesystem punctuation without
changing the ID inside JSON. HTML sheets validate the accepted/played board,
escape every imported string, require no scripts/fonts/network resources, and
contain a header plus a row for each question in exact array order:
cell number, question ID, initial, text, canonical answer, aliases.
When origins exist, an attribution appendix preserves each source pack's declared
authors/license with its applicable cell numbers, including original credits
after an editor changes the custom pack's top-level authors/license.
Print CSS repeats table headers, avoids splitting ordinary rows, hides explanatory
screen-only text, and includes no app controls. The application itself is hidden
when printing: use the downloaded private sheet instead.

Before play, only accepted content can produce a sheet. Editing/selection/
regeneration removes that availability and invalidates acceptance; previously
downloaded documents cannot be revoked and must be replaced by the new accepted
sheet. Fresh copy/generation IDs distinguish snapshots. During play both exports
use `state.pack` exclusively, preserving exact content after host resets/wins.
Downloading or changing presentation preserves a typed draft only while the same
game opportunity remains current; it does not reset deadlines or reveal aliases
on the shared screen.

## Game and save

`createGame(pack, config, now, sessionId)` accepts a validated prepared board.
`config` requires:

- `answerMode`: `hosted` or `automatic`.
- `timeLimitMs`: positive safe integer; exported default is 30,000 milliseconds.
- `starter`: `A` or `B`; call `randomStarter(random)` for a random selection.
- `duel`: positive integer `previewMs`, `symbolMs`, `length` and at least two
  distinct nonempty `symbols`. `length` is at most 1,000, a resource safety bound,
  not a recommended game duration.

The phase-2 browser supplies a 2,000 ms preview, 900 ms symbol cadence and a
maximum five-symbol sequence, using circle, triangle, square and star. There
are no flashes, animated transitions or sound cues; the target is always last,
at a uniformly selected position from one to five. This is conservative readable
tuning, not new gameplay rules. Test fixtures also use artificial 100 ms timings
solely for deterministic domain tests.

The save is the game object itself:

- `schemaVersion: 1`, complete `pack`, `config`, and 28 `cells`, each `unclaimed`,
  `black`, `A` or `B`.
- `sessionId`: caller-supplied unique runtime scope; never reuse it for another
  game or recovery. The browser supplies `crypto.randomUUID()`.
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
pack position/ID and prefix. Owned cells also keep identity in data; the UI
hides their labels and displays A/B ownership marks. Runtime resources and DOM
objects never enter saves.

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

The phase-2 keyboard adapter binds Left Shift to A and Right Shift to B. It
tracks held keys across preview, visual revisions and focus loss, requiring an
observed release before a fresh press. Every interruption (including repeated
focus loss while already interrupted) requires an in-window, focused and visible
keyup for each Shift key before restart. Users explicitly press/release both
keys to recover missed outside keyups. Rearming presses occur with no active
duel context, cannot award fields, and never blindly clear the held-key filter.
Presses with timestamps within 8 ms are
treated as indistinguishable and delivered atomically after an 8 ms collection
window. Order does not favor either player. A boundary or interruption cancels
pending input; timestamps classify ties but never replace the injected processing
clock. This is a practical keyboard precision tolerance, not a claim of perfect
device fairness. Remapping/gamepads arrive later.

`RoundClock` owns one timeout, captures each scheduled state's session/revision,
and rebinds after accepted actions without changing the engine deadline. Timer
text is derived from the deadline (100 ms refresh, rounded up to seconds), not a
decremented counter. Each rendered control captures the presented action context;
replaced listeners are aborted. `App.dispose()` stops clocks, aborts keyboard and
view listeners, closes dialogs and rejects queued work. No animation frames exist.

Focus/visibility loss invalidates a duel in memory. Restart requires separate
readiness checkboxes, both observed Shift releases, no currently held Shift key,
and a focused, visible document. Failed restart attempts give actionable localized
feedback beside the readiness controls. New
game confirmation also invalidates duels while leaving question deadlines
unchanged. It does not expose host corrections during interruption. Reload
recovery/game storage is deliberately not implemented until phase 4. Phase-3
custom-pack/settings storage is separate and cannot restore a running game.

Unsent answer text is presentation-only DOM state, not part of the authoritative
game. Theme/language changes briefly capture and restore it only if the exact
immutable game/opportunity object remains current. Transition renders do not
restore it: a handover, resolved answer, new question or new game starts empty.
No canonical answer or alias is used to populate an input.

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
