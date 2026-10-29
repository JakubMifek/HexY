# Content inventory and provenance — phase 6

Authored on 2026-10-28. **Phases 5 and 6 are independently cleared after
corrections, with 672 reviewed entries.**
The phase-5 reviewer checked all 336 earlier entries, then rechecked four corrected entries
and verified the other 332 unchanged. P5-R3 also cleared after verifying factual
citations in actual standalone HTML/PDF exports. See [review](../reviews/phase-05.md).
The two phase-2 starters retain their exact files, pack IDs and question IDs.
Ten phase-5 packs added 280 entries. Phase 6 adds twelve packs / 336 entries.
No phase-7 categories are included, and none of the twelve reviewed phase-5
JSON files or their IDs has changed.
The initial phase-6 reviewer examined all 336 new entries. A replacement
independent reviewer checked the four corrected entries and verified complete
continuity of the other 332 entries and their source evidence; see the
[review and correction history](../reviews/phase-06.md).

| Category                            | Czech packs                          | English packs                        | Entries |
| ----------------------------------- | ------------------------------------ | ------------------------------------ | ------- |
| General knowledge (`general`)       | `general-cs-01`, `general-cs-02`     | `general-en-01`, `general-en-02`     | 112     |
| Nature (`nature`)                   | `nature-cs-01`, `nature-cs-02`       | `nature-en-01`, `nature-en-02`       | 112     |
| Geography and travel (`geography`)  | `geography-cs-01`, `geography-cs-02` | `geography-en-01`, `geography-en-02` | 112     |
| History (`history`)                 | `history-cs-01`, `history-cs-02`     | `history-en-01`, `history-en-02`     | 112     |
| Politics and diplomacy (`politics`) | `politics-cs-01`, `politics-cs-02`   | `politics-en-01`, `politics-en-02`   | 112     |
| Science and technology (`science`)  | `science-cs-01`, `science-cs-02`     | `science-en-01`, `science-en-02`     | 112     |
| Total                               | 12 packs                             | 12 packs                             | 672     |

Each file is `src/content/<pack-id>.json`. Its question IDs run from
`<pack-id>-01` through `<pack-id>-28`, in the fixed row-major order enforced by
`ALPHABETS` in `src/domain/answers.js` and `validatePack`. The catalog preserves
the two starter positions for backwards-compatible initial preparation.
All 24 packs can be played unchanged as letters or selected as number sources.
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
BOTANY.cz and UNESCO supply topic-specific corroboration. Phase 6 additionally
uses the Czech Constitution and ombudsman office, UN treaty glossary, NIST,
Royal Society of Chemistry and The National Archives. The
[source ledger](content-sources.md) maps **all 672 IDs**, including starters, to
their canonical answers, citations and source locations. It is developer
evidence, not an independent review verdict. The reviewer must check every
question's actual wording, scope, answer, aliases and supporting references.

The bibliography uses factual sources, not copied questions. No images, logos,
article passages or downloadable source datasets were imported into packs.
The BCcampus textbook URL in the unchanged English B starter temporarily
returned an error during phase 5; the same question's existing Basalt
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
  The resistor clue does not accept the property word `odpor`, whose inflected
  form appears in the question; a focused regression covers this Czech giveaway.
- No repeated normalized canonical answer or question text occurs within
  either language's 336 entries. During phase-5 editing, reciprocal badminton and
  shuttlecock clues were avoided, as were reciprocal Iceland/capital clues.
  Tests enforce textual/answer uniqueness; semantic fact review remains human
  editorial work. New and previously reviewed facts may still be related.
- History identifies dates, places, rulers and conflicts rather than treating
  traditional narratives as established archaeology: Solomon and Menes are
  explicitly attributed to tradition. English/Czech adaptations can share a
  fact, but same-language reciprocal clues are avoided. For example, the
  English Kublai clue concerns Marco Polo, not the founding of a dynasty used
  as another answer.
- Politics centres on institutions, legal instruments and defined concepts.
  The Xi Jinping question asks about the explicitly dated November 2012
  appointment, not who currently holds office. The EU voting rule is dated to
  its 2014 introduction; constitutional seat counts name the relevant chamber.
  Constitutional or treaty terminology must not be confused with the powers
  of a particular present officeholder.
- Science concerns physical quantities, chemistry, materials and engineering,
  not Nature's biological definitions or phase-7 programming. Electrode
  definitions use oxidation/reduction rather than assuming a fixed sign.
  Battery includes modern single-cell usage; nuclear fission and fusion remain
  distinct. Technical definitions are facts, not copied textbook questions.
- Questions use stable geography and biological definitions rather than
  current officeholders, changing population counts or travel restrictions.
  Jakarta is identified geographically, not by its evolving capital status.
  Territorial descriptions distinguish countries from autonomous territories.
- The default preparation remains one General starter. Merely having twelve
  same-language packs available must not silently select them all or break
  fixed-letter setup. Filtering is browsing, not a content-selection operation.

## Rights

Copyright © 2026 HexY contributors. Original question wording in the twenty-four
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
runtime dependency or third-party asset is introduced in phase 6.
