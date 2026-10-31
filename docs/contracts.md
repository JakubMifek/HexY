# Domain and playable-adapter contracts

Packs are version 2; the library envelope remains version 1. Input preferences,
portable complete-game envelopes and domain games remain version 2.
Version-1 input preferences and complete-game envelopes remain supported legacy
reads **only when their nested pack satisfies the current pack contract**.
Pre-difficulty packs are rejected, not assigned an inferred level.
Contracts are backed by `src/domain/types.js` and
runtime validators. Phase 3 added the local custom-pack/settings library;
phase 4 adds a separate game-recovery adapter and input preferences. JSON serialization
is `JSON.stringify`; pack import is `importPack`, saved-game parsing and recovery
is `recoverGame`. Validators reconstruct owned data and never mutate the supplied
value or overwrite a caller's current valid game/pack.

Invalid external values throw `DomainError` with `code` and a field `path`.
Use `message('cs' | 'en', error.code)` at the UI boundary; paths are structural
identifiers, not translated content. Syntax, unsupported versions, content
validation and stale input are distinguished. Stale/inactive valid actions return
`{ state: originalState, outcome: 'ignored', reason }`, not a user-facing error.

## Packs

| Field           | Contract                                                                                        |
| --------------- | ----------------------------------------------------------------------------------------------- |
| `schemaVersion` | Exactly `2`; older/unknown versions are rejected                                                |
| `id`, `title`   | Nonempty strings                                                                                |
| `language`      | `cs` or `en`                                                                                    |
| `mode`          | `source`, `numbers`, or `letters`                                                               |
| `difficulty`    | `easy`, `medium`, `hard`; mixed numbers may use the sorted distinct union array described below |
| `authors`       | Nonempty list of nonempty attribution strings                                                   |
| `license`       | Nonempty rights statement, preserved without relicensing                                        |
| `questions`     | Nonempty ordered array; IDs unique within the pack                                              |

Every question has nonempty `id`, `text`, `initial`, `answer`, `category`;
`language` equal to the pack language; `aliases` (possibly empty string array);
and nonempty `sources` (source URLs or human-readable provenance notes).
Each alias itself must be nonempty. Provenance validation checks structure, not
factual accuracy. Category is an extensible text identifier for custom content.
The bundled Computing and Programming category keeps the stable `programming`
identifier; localized display names are "Computing and Programming" /
"Informatika a programování". Its practical computer-literacy and programming
scope does not change the general-adult difficulty rubric or serialized IDs.
Question text is limited to 600 UTF-16 code units and canonical answers to 120.
The same boundary validates imports, custom edits and recovered packs. Existing
reviewed content fits unchanged. Oversized older custom data is explicitly rejected,
preserved for export and must be shortened in a compatible editor; never truncated.

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

Phase 3 introduced the optional attribution field, retained in version 2:
`origins: [{packId, questionId, authors, license}]`. When present it is a nonempty
list; all strings and each author list must be nonempty. These are the source
pack's declared authors/rights, not independent verification of legal ownership.
Version-2 packs without `origins` remain valid and round-trip unchanged.
Unknown extra fields are discarded; only documented fields round-trip.
Pre-phase-3 readers do not preserve this extension: use this version or newer
for attribution-preserving edits/exports, and keep original JSON backups.

Difficulty is mandatory pack metadata. Authored fixed-letter and source decks
have one level. A question may explicitly repeat that level; a conflicting
level is invalid. The audience is general adults: Easy common general knowledge,
Medium informed general knowledge, Hard specialist but fair and unambiguous.
These are editorial judgments, not schema-validation results.

A generated number board may contain several source levels. Its `difficulty`
is then the distinct union in `easy`, `medium`, `hard` order (two or three
members); every question must have its explicit `difficulty`, and the union
must exactly match those questions. A one-level number board uses a scalar.
There is no `mixed`/Unrated fourth level in the data or filter. Generation writes
the inherited source level on each selected question and computes the union
from the actual 28 questions, not all candidate packs. Validation/export,
editing, persistence, portable saves and print headers use this same contract.

Pack v1 import compatibility was expressly declined. No migration infers
arbitrary imported difficulty, including by title, ID or bundled-looking content.
An incompatible stored library denies writes and exposes exact original-byte
download in Options/preparation. An incompatible active game denies adoption
and replacement saving, retains original bytes and uses the existing recovery
export/explicit-discard flow. The outer library/game keys and envelopes remain
unchanged because their structure did not change; nested pack versions make
the incompatibility explicit. Known-bundled automatic migration is not implemented.

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

The catalog's Origin/Difficulty filters are a transient projection
of the source library. They do not select sources, invalidate acceptance, alter
content revisions, or enter persisted preferences. The Options language is
always applied, independently of filter reset. There are no language/category/
search filters. Bundled decks are grouped in category folders; all custom decks
have a separate folder even when their questions span several categories.
Folder selection operates on visible matching decks only, preserving hidden
selection. Counts and native checkbox indeterminacy describe matching decks.
Expansion does not select or invalidate content; selection does. The
selected-source summary includes filtered-out packs, but foreign-language,
unknown and duplicate IDs cannot enter selection.
Changing setup language/mode selects only the original matching starter even
when the catalog contains many packs. The generator still receives only explicit
selected sources, never the current filter results.

Editing creates an attributed custom copy with a fresh pack ID. The native editor
changes question text, canonical answer, aliases, category and factual sources;
number/source initials and ordering; pack ID/title/authors/license/difficulty. Choosing
a new scalar difficulty explicitly reclassifies every question in that copy;
leaving mixed metadata unchanged preserves its original question levels. Stable
question IDs and the pack language/mode are retained; fixed initials/order
remain authored. Validation uses the same `validatePack`, not a parallel schema.
All edits invalidate acceptance. Invalid saves retain the draft and previous
valid proposal. Explicitly saved copies and imports join the local library;
accepted generated packs remain temporary;
different content may not overwrite an existing/bundled pack ID. A duplicate
import of identical validated content is idempotent. Multi-file import is atomic
in memory: validate/conflict-check the entire batch before adding anything.

Starting snapshots the accepted pack through `createGame`, then locks preparation
mutators and removes every editing/import/regeneration control. No win or host
correction unlocks content. Confirmed Exit Game is required to return to Menu.
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

Imports, saved copies and valid preference changes
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
writes leave both the old stored record and inclusion choice intact. Exclusion flags need not be
serialized: successfully excluded copies are absent from the saved `packs`
array. No schema change, content deletion, cap or database migration is involved.

Options exposes the same selective-removal controls as preparation. Historical
automatic acceptance and explicit import used identical `add`/validation paths,
without an origin field; their serialized packs are indistinguishable. The owner
approved preserving ambiguous entries instead of automatic migration. Titles and
question origins are never deletion criteria. `.artifacts/phase-10-origin-probe.log`
records the baseline equality proof; `final-export.test.js` retains the regression.
Every library write compares current raw storage with the last successfully read/
written bytes; a mismatch blocks writing and reports `storageChanged`.
It also retains the actually observed replacement bytes for protected-original
export, without adopting them or allowing their deletion/overwrite.

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
Every sheet also includes a factual-source appendix in the same question-array
order. Each entry identifies its cell number and stable question ID and retains
all `sources` strings, including non-URL host notes, as escaped plain text.
No source string becomes an HTML link or executable URL. The appendix starts
on a separate printed page, wraps long citations and keeps ordinary entries
together; it does not add or renumber question-table rows.
When origins exist, an attribution appendix preserves each source pack's declared
authors/license with its applicable cell numbers, including original credits
after an editor changes the custom pack's top-level authors/license.
Print CSS repeats table headers, avoids splitting ordinary rows, hides explanatory
screen-only text, and includes no app controls. The application itself is hidden
when printing: use the downloaded private sheet instead.

Before play, only accepted content can produce a sheet. Editing/selection/
regeneration removes that availability and invalidates acceptance; previously
downloaded documents cannot be revoked and must be replaced by the new accepted
sheet. Fresh copy/generation IDs distinguish snapshots. Human-host start/import
must initiate that exact sheet's download; failures block adoption. Browser APIs
cannot confirm a disk write. Digital mode offers no sheet. During play only
complete Save Game is available, using `state.pack`, not the preparation library.
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

The browser supplies a 2,000 ms preview and 900 ms symbol cadence with exactly
circle, star, square, triangle, hexagon, heart and sun. One preselected target
stays fixed until resolution or interruption. Each bounded random cycle is a
permutation of all seven; cycles repeat indefinitely without preview/readiness.
Missed targets do not award or change turns. Ties begin another active random
cycle with the same target. There are no flashes or sound cues.
Test fixtures also use artificial 100 ms timings
solely for deterministic domain tests.

The domain game object is:

- `schemaVersion: 2`, complete `pack`, `config`, and 28 `cells`, each `unclaimed`,
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
    `symbolMs`. The target appears exactly once at a randomized position in each
    complete permutation. `length` equals the symbol count. At cycle rollover,
    `startsAt` advances by complete cycle durations and only the current new
    permutation is retained. A delayed tick skips elapsed cycles in constant
    work, preserving cadence; it does not allocate elapsed history.
  - `duel-interrupted`, with `round: {cell, originalChooser}` only.
  - `won`, with `winner` and the sorted IDs of its connected `winningCells`.

Save validation cross-checks round ownership, chooser, deadlines, sequence timing
and actual connected victories, not just field types. A black cell retains its
pack position/ID and prefix. Owned cells also keep identity in data; the UI
hides their labels and uses color alone (the approved accessibility exception).
Runtime resources and DOM objects never enter saves.

`hexy.game.v1` and Save Game now use the same complete portable envelope:

```json
{
  "format": "hexy-game",
  "schemaVersion": 2,
  "game": { "schemaVersion": 2 },
  "settings": {
    "players": {
      "A": { "name": "Frodo", "color": "#0891b2" },
      "B": { "name": "Samwise", "color": "#d97706" }
    },
    "language": "en",
    "mode": "letters",
    "answerMode": "hosted",
    "starter": "random",
    "seconds": 30
  },
  "bindings": {
    "A": { "kind": "keyboard", "code": "ShiftLeft" },
    "B": { "kind": "gamepad", "button": 0 }
  }
}
```

The abbreviated `game` above must contain every domain field described here.
`validatePortable` reconstructs and validates game, settings and distinct supported
keyboard-or-gamepad bindings before adoption. Envelope-v1 `keys` migrate to keyboard
bindings without changing game progress, names, colors or deadlines. Gamepad choices
store only an integer button 0–63, never connection IDs/tokens; recovery/import
requires explicit re-recording. Language/board/host/time must match the game;
starter must be random or match its configured starter. Names allow 30 UTF-16
code units, colors require six-digit hex. Complete JSON is limited to 2,000,000
UTF-8 bytes, including an early File-size check. Validation reserves at least
512 bytes for round data (more for larger generic symbol alphabets), full-width
future counters/timestamps and a fresh UUID. This prevents a valid pack from
becoming unexportable when progress grows. Exports are compact JSON, not a
larger pretty-printed file that would violate the import limit.
Theme, unsent answers, unrelated
library packs and runtime controller assignments are not portable.

Tile-flip presentation is also not serialized. An accepted selecting→question
transition emits a one-render cue for a 480-ms native SVG/CSS flip. The board
derives the full authored initial from the active question/opponent state,
including existing alphabet digraphs, and therefore recovers it without replay.
The deadline starts in the domain transition, not at animation completion;
there are no animation callbacks driving state. Reduced motion immediately
reveals the initial. Owned tiles remain color-only; black tiles retain their
original board identifier. Existing alphabet validation bounds initials without
adding another text limit or modifying reviewed content.

Only local recovery accepts historical raw domain games. Domain-v1 finite saves
are first validated with their original sequence/timing rules, then browser
recovery upgrades known old circle/triangle/square/star configurations to v2 and
the exact seven-symbol pool. Active duels recover interrupted, preserving board,
chooser and deadlines; the next safe preview chooses a new target. No shape-name
substitution is needed. Unknown legacy symbols or invalid v2 pools fail explicitly.
Future versions are rejected. Raw game files/question-pack JSON are not complete
portable games and are rejected by Menu Import Game with actionable guidance.

`recoverGame(json, now, freshSessionId)` preserves original question deadlines,
transfers already-expired questions to the opponent, and converts preview/active
duels to `duel-interrupted`. It never awards an interrupted field. Explicit
`restart` represents both players being ready; the adapter must collect that
readiness. Recovery changes the session scope and revision, so old input cannot
apply even when numeric revisions happen to coincide. Keep the original file on
validation failure. Browser-local data is not a backup.

`Recovery.load` revokes write permission before reading and delegates all parsing
and recovery to `recoverPortable`/`recoverGame`. The app immediately saves a successfully recovered
state with its fresh scope, before rendering. Each subsequent applied transition
saves before rendering too, including initial selection/deadline, wrong answers,
host edits and victory. Failure changes only explicit persistence feedback, not
the valid game or original stored record. The adapter distinguishes denied reads,
denied writes, quota, unsupported versions, malformed data and backwards clocks.

The original raw string is retained for export, including invalid/newer records.
Read failure never authorizes writes. Memory-only play may continue, but a retry
cannot silently replace an existing protected game with that in-memory game.
The UI offers retry, current/original export and confirmed discard; discarding
compares the current raw record with the observed one before removal. Failed
removal keeps play open. This is protection against accidental changed-record
deletion, not multi-tab merging; only one editing tab is supported.
In gameplay, an explicit unsaved/recovery header action opens these controls
in a modal instead of obscuring required question text or playable fields.
The dialog does not pause question time; its export reads the current game,
not its opening snapshot. Neither this dialog nor Exit confirmation permits
automatic duel restart while open; closing revokes readiness again.

When discard detects different bytes, it immediately revokes write permission
and saved status and retains those replacement bytes for raw export. Subsequent
gameplay is memory-only. An active-game retry reads/validates the replacement but
does not adopt it or authorize overwriting it. Export current work and reload to
recover the replacement, or use recovery's explicit **Discard stored game…**
confirmation against the newly observed record. A further change triggers the
same protection again. Ordinary final departure uses `discardCurrent`, which
cannot remove a protected/unread original. Writes also compare current bytes
before replacement, so a deadline tick cannot erase a concurrent save.

Final departure has Save and return, Return without saving and Cancel paths for
both won and unfinished games. Save first processes the click-time tick using the
authoritative transition/deadline, then initiates portable JSON download; only a
successful initiation permits cleanup. Download or deletion failure retains
the game and localized dialog. This cannot guarantee a disk write. Victory and
Cancel do not clear recovery. Successful departure stops the round timer, clears
input context/readiness and temporary preparation, then renders a fresh menu.
Native dialog ownership remains `mountGameDialog`, including synchronous
readiness revocation and aborted late-close callbacks.

`Recovery` owns write permission; orchestration can read but cannot assign it.
Its `retrySave` authorizes blocked memory-game saving only when the current
`load` succeeds with an empty result, never from cached `original` content.
A failed reread retains the read error and unsaved/denied status, including when
the previous successful observation was empty. A failed discard reread also
revokes previously granted permission. Once access returns, nonempty records
remain protected/exportable; a successful empty read permits memory-game saving.

Saved-game file import is available with empty, writable game storage. It uses
the same recovery validator and a fresh runtime ID, not an alternate engine.
Reads carry a generation invalidated by save/load/discard/disposal and later
imports; obsolete success/failure callbacks are ignored. Imported content locks
preparation like a locally started/recovered game. Hosted imports wait for the
exact sheet download without entering the setup wizard. Confirmed Exit Game removal
precedes clearing runtime state; old callbacks cannot resave that game.

Browser adoption additionally validates renderability of **all configured duel
symbols**, including selecting/interrupted saves with no currently visible symbol.
`runtime/symbols.js` defines the exact seven-symbol
glyph alphabet; initial configuration, localized rendering and the recovery
compatibility check all use it. Domain validation still accepts arbitrary distinct
nonempty symbols, but an unsupported browser alphabet reports `duelCompatibility`
before adoption/persistence. There is no config substitution or catch-and-continue
render fallback. Startup keeps the exact original stored bytes; rejected file
imports leave current state/storage untouched.

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
Wrong-symbol presses award the opponent; missed targets keep rotating. Preview presses
are ignored. A symbol boundary advances state/revision before accepting further
presses, rejecting queued input from the old visual context. An interruption
takes priority even exactly at a symbol or replay boundary.
Render the active symbol at index `floor((state.lastNow - startsAt) / symbolMs)`;
advance via `tick` rather than independently changing the visible symbol.

The keyboard adapter defaults to Left Shift for A and Right Shift for B. It
tracks held keys across preview, visual revisions and focus loss. Every interruption
(including repeated focus loss while already interrupted) requires fresh in-window,
focused/visible presses followed by releases from both players. Lone keyups cannot
authorize restart. A nonrepeating fresh keydown can recover a missed outside keyup;
physical autorepeat cannot. Rearming presses occur with no active
duel context, cannot award fields, and never blindly clear the held-key filter.
Presses with timestamps within 8 ms are
treated as indistinguishable and delivered atomically after an 8 ms collection
window. Order does not favor either player. A boundary or interruption cancels
pending input; timestamps classify ties but never replace the injected processing
clock. This is a practical keyboard precision tolerance, not a claim of perfect
device fairness. `BuzzerBatch` is the one shared collection boundary for keyboard,
gamepad and touch; it never adjudicates the result independently of `transition`.

`RoundClock` owns one timeout, captures each scheduled state's session/revision,
and rebinds after accepted actions without changing the engine deadline. Timer
text is derived from the deadline (100 ms refresh, rounded up to seconds), not a
decremented counter. Each rendered control captures the presented action context;
replaced listeners are aborted. `App.dispose()` stops clocks, aborts keyboard and
view listeners, closes dialogs and rejects queued work. No animation frames exist.

Focus/visibility loss, assigned-controller loss and Exit Game
confirmation invalidate duels while leaving question deadlines unchanged.
Restart is automatic, deferred to a generation- and state-scoped microtask after
both players' matching fresh press/release gestures. No mapped key,
touch pointer or assigned controller button may remain held; controllers require
an observed neutral sample too. Failed restarts have actionable localized
feedback. Repeated interruption, disposal, focus loss or state changes invalidate
queued restart work. No corrections are exposed during interruption. Recovery similarly
invalidates preview/active duels, never awarding a field or changing the chooser.

`DuelKeyboard.remap` accepts distinct supported physical codes or null for a
player whose sole binding is a controller. Supported codes include separate
Shifts, Space, letters, digits, punctuation and numpad operations/digits.
Navigation, Escape, function keys and Ctrl/Alt/Meta shortcuts are reserved.
It requires new releases and drops only irrelevant
unmapped held codes, preventing an old missed keyup from deadlocking new bindings.
Mapping errors leave the previous mapping intact, including the displayed value.
Mapped keys do not capture while an editable form control has focus;
the board/question and dedicated buzzers remain keyboard input surfaces.
`hexy.inputs.v1` now stores `{schemaVersion: 2, bindings: {A: binding, B: binding}}`,
using the portable union above. Version-1 `{keys: {A: code, B: code}}` records
are validated and migrated in memory, then written as v2 on explicit recording.
This is separate from
game/library keys. Read/validation failure protects the original and reports
session-only mappings; allow storage and reload before saving after a read
failure. Write failures report session-only changes and permit a later retry.
Raw-byte comparison prevents overwriting concurrent changes.

`BindingRecorder` owns key subscriptions and observed gamepad button snapshots.
It captures only during explicit recording, rejects held/repeated/stale events,
and cancels on Escape, blur, hidden state, disconnect or modal disposal. Rejected
duplicates/reserved keys retain the prior binding. `InputSettings` owns the union,
storage and native modal lifetime; closing aborts handlers and revokes readiness
synchronously before native close can dispatch. An imported/disconnected
controller has a concise re-record action in the duel; touch remains available.
Changed bindings update complete-game metadata, not domain ownership/rules.

`BoardNavigation` consumes the existing injected-clock gamepad poll, with no second
timer. Any standard-mapped pad may navigate selectable cells, using the same DOM
focus function as keyboard arrows. D-pad 12/14 moves backward, 13/15 forward;
left-stick axes 0/1 use dominant direction, 0.6 activation/0.3 release hysteresis,
350 ms initial and 110 ms subsequent repeats. A/button 0 confirms one focused
playable field. No focused field means first A only focuses the first field.
All pad edges are sampled before at most one action per poll. Phase/state changes,
modal dismissal, blur/hidden state and unsupported mappings require neutral again.
Questions, duels, won states and ordinary form/header focus never accept navigation.

`DuelGamepads` polls `getGamepads` every 16 ms, with injectable samples and
high-resolution sample timestamps. All edges in one poll share a timestamp.
Each observed connection has a fresh token. Assignments bind a player to that
connection and a valid zero-based button index; two players cannot share one
button. Controllers must be explicitly assigned and observed neutral before
rising edges can enter `BuzzerBatch`. Assignments are never persisted or
automatically recreated after reload/disconnection/index reuse. Device loss
removes affected assignments and interrupts any duel. Unsupported/denied,
connected, unassigned and disconnected states are visible in input controls;
duels also show assignments/loss and release status.

Diagnostic feedback receives actual changed held/released edges separately from
the gameplay rising-edge callback. Releases cannot dispatch a gameplay press.
Initial assignment uses the sampled held state; the first neutral sample arms
the assignment without inventing a release event. Unchanged polling samples do
not rewrite or live-announce the input-test status.

`DuelTouch` tracks pointer IDs and per-player holds across view replacements.
Only fresh primary-button pointerdowns on dedicated A/B buzzers enter the shared
batch. Global pointerup releases; pointercancel cancels pending input and does
not certify restart readiness and interrupts the duel. Touch actions on the buzzers suppress native
scroll/gesture repetition, not normal page navigation elsewhere. Emulated
Chromium multi-touch and real `.tap()` UI paths are covered separately from
synthetic pointer-boundary edge tests.

`Inputs` composes these concrete lifetimes and owns the safe input-test dialog.
The preparation-only dialog binds no game input context and cleans up listeners.
Normal keyboard/tab/touch
focus is retained; close returns focus to its launcher. Presentation rerenders
cannot reconnect old batches. There is no application fullscreen API.

Polling, OS/controller latency and keyboard/pointer event dispatch differ.
The 8 ms tie window is retained, not a promise of perfect cross-device fairness.
Prefer the same input type for both players. Physical Xbox/tablet verification
remains a phase-8 dependency; only software emulation/mocks are claimed here.

Unsent answer text is presentation-only DOM state, not part of the authoritative
game. Theme/language changes briefly capture and restore it only if the exact
immutable game/opportunity object remains current. Transition renders do not
restore it: a handover, resolved answer, new question or new game starts empty.
No canonical answer or alias is used to populate an input.

There is no pause action. A clock refresh with no transition returns the same
state; `remainingMs(state, now)` computes display time from the deadline.
Neither opening future controls nor losing focus grants extra question time.
The app also rejects clock readings earlier than its previous display/action
reading, even if no gameplay transition happened in between; it never increases
the displayed countdown after detecting rollback. Across reload the validated
`lastNow` is the saved lower bound. Keep system clocks correct: an offline static
app cannot authenticate clock adjustments across shutdown without trusted time.

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
