# Phase 5 content inventory and provenance

Authored on 2026-10-28; **independently cleared after corrections**.
The reviewer checked all 336 entries, then rechecked four corrected entries
and verified the other 332 unchanged. P5-R3 also cleared after verifying factual
citations in actual standalone HTML/PDF exports. See [review](../reviews/phase-05.md).
The two phase-2 starters retain their exact files, pack IDs and question IDs.
Ten new packs add 280 entries. No phase-6 or phase-7 categories are included.

| Category                           | Czech packs                          | English packs                        | Entries |
| ---------------------------------- | ------------------------------------ | ------------------------------------ | ------- |
| General knowledge (`general`)      | `general-cs-01`, `general-cs-02`     | `general-en-01`, `general-en-02`     | 112     |
| Nature (`nature`)                  | `nature-cs-01`, `nature-cs-02`       | `nature-en-01`, `nature-en-02`       | 112     |
| Geography and travel (`geography`) | `geography-cs-01`, `geography-cs-02` | `geography-en-01`, `geography-en-02` | 112     |
| Total                              | 6 packs                              | 6 packs                              | 336     |

Each file is `src/content/<pack-id>.json`. Its question IDs run from
`<pack-id>-01` through `<pack-id>-28`, in the fixed row-major order enforced by
`ALPHABETS` in `src/domain/answers.js` and `validatePack`. The catalog preserves
the two starter positions for backwards-compatible initial preparation.
All 12 packs can be played unchanged as letters or selected as number sources.
The final product target remains 36 packs / 1,008 entries, not the current
inventory.

## Authorship and review method

All question prose is newly composed for HexY, not copied from television,
commercial question banks, encyclopedic passages or the supplied visual
references. Czech and English are independently adapted: for example, Czech
Nature W uses _Wollemie vznešená_, supported by a Czech botanical reference;
English Nature X uses _Xylem_ and _Xerophyte_. Common facts can have counterparts
in both languages. They are not separate promises of cross-language novelty.

Public factual references were retrieved and their definitions, article
introductions, relevant body sections or factual tables inspected during
authoring. Wikipedia provides general reference coverage; NASA, NOAA, CDC,
BOTANY.cz and UNESCO supply topic-specific corroboration. The
[source ledger](content-sources.md) maps **all 336 IDs**, including starters, to
their canonical answers, citations and source locations. It is developer
evidence, not an independent review verdict. The reviewer must check every
question's actual wording, scope, answer, aliases and supporting references.

The bibliography uses factual sources, not copied questions. No images, logos,
article passages or downloadable source datasets were imported into packs.
The BCcampus textbook URL in the unchanged English B starter temporarily
returned an error during this phase; the same question's existing Basalt
reference supports the fact. This is disclosed in the ledger, not disguised as
a successful new fetch.

## Editorial decisions

- Scientific names sometimes delimit a species precisely; aliases already
  written in a question are not accepted answers. New questions do not
  literally contain an accepted answer. Tests check this, but cannot recognize
  all semantic giveaways.
- Explicit aliases cover useful alternative spellings, common names and word
  order. Redundant case/diacritic variants are omitted from new packs because
  normalization already accepts them. Prefixes constrain canonical answers,
  not aliases. No fuzzy or new punctuation normalization is introduced.
- No repeated normalized canonical answer or question text occurs within
  either language's 168 entries. During editing, reciprocal badminton and
  shuttlecock clues were avoided, as were reciprocal Iceland/capital clues.
  Tests enforce textual/answer uniqueness; semantic fact review remains human
  editorial work. New and previously reviewed facts may still be related.
- Questions use stable geography and biological definitions rather than
  current officeholders, changing population counts or travel restrictions.
  Jakarta is identified geographically, not by its evolving capital status.
  Territorial descriptions distinguish countries from autonomous territories.
- The default preparation remains one General starter. Merely having six
  same-language packs available must not silently select them all or break
  fixed-letter setup. Filtering is browsing, not a content-selection operation.

## Rights

Copyright © 2026 HexY contributors. Original question wording in the twelve
bundled JSON packs is licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribute
“HexY contributors”, link to
[the source repository](https://github.com/JakubMifek/HexY) and the license,
retain notices, and identify your modifications.

Factual source pages retain their publishers' rights and licenses. Linking
them does not relicense them, their images, trademarks or their prose under
HexY's content license. Imported private packs retain their declared rights.
Generated and edited packs preserve source attribution through `origins`.
Code and supporting documentation remain MIT licensed; no new artwork,
runtime dependency or third-party asset is introduced in phase 5.
