# Phase 5 per-entry factual source ledger

## Review corrections

The [initial independent review](../reviews/phase-05.md) checked all 336 entries.
P5-R1/R2/R4 corrections affect only `nature-cs-01-14` (community, not relationship),
`general-cs-02-08` and `general-en-02-24` (scope-compatible aliases only), and
`geography-cs-01-19` (no declined answer in the city clue). Their references,
canonical answers, IDs and initials are unchanged. The four affected pack hashes
below identify the corrected candidate; re-review is pending.

Developer source checks: **2026-10-28**. Independent review is pending.
This ledger covers all **12 packs / 336 entries**, including the 56 unchanged
starter entries. Every entry has its exact stable ID, canonical answer, fixed
initial and all URLs shipped in its `sources` array. Open the linked pack to
inspect the original question and aliases together with the cited references.
Locations identify article definitions, factual tables or relevant body sections;
they are not quotations or an assertion that an HTTP response proves a fact.

The developer inspected introductory definitions and targeted factual sections,
correcting wording and ambiguous article URLs during authoring. This ledger is
evidence for a separate full editorial review, not self-clearance. Every actual
question, including each qualifying clause and useful alias, must be reviewed;
random sampling or automated validity checks do not satisfy the phase gate.

There are **339 distinct in-pack URLs**. All except the two noted below
were retrieved successfully with curl and their relevant content inspected.
UNESCO's page was readable through the web-fetch tool despite curl failing.
The unchanged BCcampus starter citation returned an error (HTTP 530 on web
retrieval); its existing Basalt citation independently supports the same
fine-grained erupted-lava fact. No citation was invented or silently counted as
success. External pages can change; the hashes below bind this ledger to the
exact authored JSON reviewed here, not to future website revisions.

### Additional starter corroboration (no starter file changes)

- `general-en-01-03`: [Greeley Philharmonic, Instruments of the Orchestra](https://www.greeleyphil.org/instruments),
  String Family / Cello and Double Bass. Its cello explanation establishes the
  size relative to viola and the seated floor-peg posture; the following bass
  explanation establishes that the double bass is larger. Retrieved and read
  through web-fetch on 2026-10-28.
- `general-en-01-17`: [Pacific Ocean](https://en.wikipedia.org/wiki/Pacific_Ocean),
  introduction: the largest ocean, with Asia/Australia west and the Americas
  east. Retrieved and read through web-fetch on 2026-10-28; corroborates the
  NOAA citation without modifying the previously reviewed starter.

Source pages retain their rights. This document links facts and section names,
not copied article passages. See [inventory, authorship and license scope](content-inventory.md).

## general-cs-01

[Všeobecné znalosti · úvodní sada 01](../src/content/general-cs-01.json) — cs, general, 28 entries.

Source JSON SHA-256: `f9aed941187d3a573380af15788463a546fa73cb5faf4872310fefdaddbcc625`.

- `general-cs-01-01` — **Amazonka** (`A`). [1](https://en.wikipedia.org/wiki/Amazon_River); [2](https://cs.wikipedia.org/wiki/Amazonka). Locate: 1: Introduction / definition and descriptive body · 2: Introduction / definition and descriptive body.
- `general-cs-01-02` — **Berlín** (`B`). [1](https://en.wikipedia.org/wiki/Berlin). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-01-03` — **Cín** (`C`). [1](https://cs.wikipedia.org/wiki/C%C3%ADn). Locate: 1: Introduction / infobox.
- `general-cs-01-04` — **Čapek** (`Č`). [1](https://en.wikipedia.org/wiki/Karel_%C4%8Capek). Locate: 1: Introduction / infobox.
- `general-cs-01-05` — **Dunaj** (`D`). [1](https://en.wikipedia.org/wiki/Danube). Locate: 1: Introduction / infobox.
- `general-cs-01-06` — **Everest** (`E`). [1](https://en.wikipedia.org/wiki/Mount_Everest). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-01-07` — **Fotosyntéza** (`F`). [1](https://cs.wikipedia.org/wiki/Fotosynt%C3%A9za). Locate: 1: Introduction / infobox.
- `general-cs-01-08` — **Gravitační síla** (`G`). [1](https://spaceplace.nasa.gov/what-is-gravity/en/). Locate: 1: Gravity in our universe; Introduction / infobox.
- `general-cs-01-09` — **Housle** (`H`). [1](https://cs.wikipedia.org/wiki/Housle). Locate: 1: Introduction / infobox; Trup.
- `general-cs-01-10` — **Chlor** (`Ch`). [1](https://cs.wikipedia.org/wiki/Chlor); [2](https://www.cdc.gov/drinking-water/about/about-water-disinfection-with-chlorine-and-chloramine.html). Locate: 1: Introduction / infobox · 2: Overview and Terms to know: chlorine disinfects drinking water.
- `general-cs-01-11` — **Inkoust** (`I`). [1](https://cs.wikipedia.org/wiki/Inkoust). Locate: 1: Introduction / infobox.
- `general-cs-01-12` — **Japonsko** (`J`). [1](https://en.wikipedia.org/wiki/Japan). Locate: 1: Introduction / infobox.
- `general-cs-01-13` — **Klokan** (`K`). [1](https://cs.wikipedia.org/wiki/Klokan). Locate: 1: Pohyb; Vývoj a život.
- `general-cs-01-14` — **Lev** (`L`). [1](https://en.wikipedia.org/wiki/Lion). Locate: 1: Introduction / infobox.
- `general-cs-01-15` — **Merkur** (`M`). [1](https://science.nasa.gov/mercury/facts/). Locate: 1: Orbit and Rotation.
- `general-cs-01-16` — **Neutron** (`N`). [1](https://en.wikipedia.org/wiki/Neutron). Locate: 1: Discovery; Introduction / infobox.
- `general-cs-01-17` — **Ottawa** (`O`). [1](https://en.wikipedia.org/wiki/Ottawa). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-01-18` — **Praha** (`P`). [1](https://cs.wikipedia.org/wiki/Karl%C5%AFv_most). Locate: 1: Introduction / infobox.
- `general-cs-01-19` — **Renesance** (`R`). [1](https://en.wikipedia.org/wiki/Renaissance). Locate: 1: Introduction / infobox.
- `general-cs-01-20` — **Řím** (`Ř`). [1](https://en.wikipedia.org/wiki/Colosseum). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-01-21` — **Sahara** (`S`). [1](https://en.wikipedia.org/wiki/Sahara). Locate: 1: Introduction / infobox.
- `general-cs-01-22` — **Šachy** (`Š`). [1](https://cs.wikipedia.org/wiki/%C5%A0achy). Locate: 1: Pravidla hry; Introduction / infobox.
- `general-cs-01-23` — **Tichý oceán** (`T`). [1](https://oceanservice.noaa.gov/facts/biggestocean.html); [2](https://cs.wikipedia.org/wiki/Tich%C3%BD_oce%C3%A1n). Locate: 1: Opening fact: largest ocean; Pacific geography corroboration below · 2: Introduction / definition and descriptive body.
- `general-cs-01-24` — **Uhlík** (`U`). [1](https://cs.wikipedia.org/wiki/Uhl%C3%ADk). Locate: 1: Introduction / infobox.
- `general-cs-01-25` — **Vltava** (`V`). [1](https://en.wikipedia.org/wiki/Vltava). Locate: 1: Introduction / infobox; Course.
- `general-cs-01-26` — **Watt** (`W`). [1](https://en.wikipedia.org/wiki/Watt). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-01-27` — **Zebra** (`Z`). [1](https://en.wikipedia.org/wiki/Zebra). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-01-28` — **Železo** (`Ž`). [1](https://cs.wikipedia.org/wiki/%C5%BDelezo). Locate: 1: Introduction / infobox.

## general-cs-02

[Všeobecné znalosti · 02](../src/content/general-cs-02.json) — cs, general, 28 entries.

Source JSON SHA-256: `d50cac6b01e5dfb5e7a5c7a917818a0f45cf0b19c6366d1f5e8795ead9e03ac4`.

- `general-cs-02-01` — **Akordeon** (`A`). [1](https://cs.wikipedia.org/wiki/Akordeon). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-02` — **Bumerang** (`B`). [1](https://cs.wikipedia.org/wiki/Bumerang). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-03` — **Cukr** (`C`). [1](https://cs.wikipedia.org/wiki/Cukr). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-04` — **Červen** (`Č`). [1](https://cs.wikipedia.org/wiki/%C4%8Cerven). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-05` — **Domino** (`D`). [1](https://cs.wikipedia.org/wiki/Domino). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-06` — **Ementál** (`E`). [1](https://cs.wikipedia.org/wiki/Ement%C3%A1l). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-07` — **Fujara** (`F`). [1](https://cs.wikipedia.org/wiki/Fujara). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-08` — **Gól** (`G`). [1](https://cs.wikipedia.org/wiki/G%C3%B3l). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-09` — **Hektar** (`H`). [1](https://cs.wikipedia.org/wiki/Hektar). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-10` — **Chléb** (`Ch`). [1](https://cs.wikipedia.org/wiki/Chl%C3%A9b). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-11` — **Iglú** (`I`). [1](https://cs.wikipedia.org/wiki/Igl%C3%BA). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-12` — **Judo** (`J`). [1](https://cs.wikipedia.org/wiki/Judo). Locate: 1: Introduction / infobox.
- `general-cs-02-13` — **Kompas** (`K`). [1](https://cs.wikipedia.org/wiki/Kompas). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-14` — **Lupa** (`L`). [1](https://cs.wikipedia.org/wiki/Lupa). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-15` — **Maraton** (`M`). [1](https://cs.wikipedia.org/wiki/Maratonsk%C3%BD_b%C4%9Bh). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-16` — **Nůžky** (`N`). [1](https://cs.wikipedia.org/wiki/N%C5%AF%C5%BEky); [2](https://en.wikipedia.org/wiki/Scissors). Locate: 1: Introduction: cutting tool; English corroboration explains blade pivot · 2: Introduction: pivoted blades closed by squeezing handles.
- `general-cs-02-17` — **Origami** (`O`). [1](https://cs.wikipedia.org/wiki/Origami). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-18` — **Pesto** (`P`). [1](https://cs.wikipedia.org/wiki/Pesto). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-19` — **Ragby** (`R`). [1](https://cs.wikipedia.org/wiki/Ragby). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-20` — **Říjen** (`Ř`). [1](https://cs.wikipedia.org/wiki/%C5%98%C3%ADjen). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-21` — **Sudoku** (`S`). [1](https://cs.wikipedia.org/wiki/Sudoku). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-22` — **Šestiúhelník** (`Š`). [1](https://cs.wikipedia.org/wiki/%C5%A0esti%C3%BAheln%C3%ADk). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-23` — **Termoska** (`T`). [1](https://cs.wikipedia.org/wiki/Termoska). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-24` — **Ukulele** (`U`). [1](https://cs.wikipedia.org/wiki/Ukulele). Locate: 1: Základní informace.
- `general-cs-02-25` — **Volejbal** (`V`). [1](https://cs.wikipedia.org/wiki/Volejbal). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-26` — **Wok** (`W`). [1](https://cs.wikipedia.org/wiki/Wok); [2](https://en.wikipedia.org/wiki/Wok). Locate: 1: Introduction / definition and descriptive body · 2: Introduction: round-bottomed pan originating in China.
- `general-cs-02-27` — **Zip** (`Z`). [1](https://cs.wikipedia.org/wiki/Zdrhovadlo). Locate: 1: Introduction / definition and descriptive body.
- `general-cs-02-28` — **Žolík** (`Ž`). [1](https://cs.wikipedia.org/wiki/%C5%BDol%C3%ADk). Locate: 1: Introduction / definition and descriptive body.

## general-en-01

[General knowledge · starter 01](../src/content/general-en-01.json) — en, general, 28 entries.

Source JSON SHA-256: `09060dfbe622a1baecc1374546b3cd7d23bf6db1a1bc0d732e484e63f7d279b7`.

- `general-en-01-01` — **Athens** (`A`). [1](https://en.wikipedia.org/wiki/Athens). Locate: 1: Introduction / definition and descriptive body.
- `general-en-01-02` — **Basalt** (`B`). [1](https://opentextbc.ca/physicalgeology2ed/chapter/18-2-the-geology-of-the-oceanic-crust/); [2](https://en.wikipedia.org/wiki/Basalt). Locate: 1: Unavailable in this pass; existing Basalt citation corroborates the same question · 2: Introduction / infobox; Types.
- `general-en-01-03` — **Cello** (`C`). [1](https://en.wikipedia.org/wiki/Cello). Locate: 1: Tuning (endpin); see Greeley Philharmonic corroboration below for relative sizes.
- `general-en-01-04` — **Chess** (`CH`). [1](https://en.wikipedia.org/wiki/Chess). Locate: 1: Introduction / infobox.
- `general-en-01-05` — **Diamond** (`D`). [1](https://en.wikipedia.org/wiki/Mohs_scale). Locate: 1: Reference minerals.
- `general-en-01-06` — **Equator** (`E`). [1](https://en.wikipedia.org/wiki/Equator). Locate: 1: Introduction / definition and descriptive body.
- `general-en-01-07` — **Finland** (`F`). [1](https://en.wikipedia.org/wiki/Finland). Locate: 1: Introduction / definition and descriptive body.
- `general-en-01-08` — **Gutenberg** (`G`). [1](https://en.wikipedia.org/wiki/Gutenberg_Bible). Locate: 1: Introduction / infobox.
- `general-en-01-09` — **Hydrogen** (`H`). [1](https://en.wikipedia.org/wiki/Hydrogen). Locate: 1: Introduction / definition and descriptive body.
- `general-en-01-10` — **Iris** (`I`). [1](<https://en.wikipedia.org/wiki/Iris_(anatomy)>). Locate: 1: Introduction / infobox.
- `general-en-01-11` — **Jupiter** (`J`). [1](https://science.nasa.gov/jupiter/facts/). Locate: 1: Our Solar System.
- `general-en-01-12` — **Koala** (`K`). [1](https://en.wikipedia.org/wiki/Koala). Locate: 1: Introduction and Feeding: eucalyptus leaves as the main diet.
- `general-en-01-13` — **Louvre** (`L`). [1](https://en.wikipedia.org/wiki/Louvre). Locate: 1: Introduction / infobox.
- `general-en-01-14` — **Mars** (`M`). [1](https://science.nasa.gov/mars/facts/). Locate: 1: The Largest Volcano.
- `general-en-01-15` — **Nile** (`N`). [1](https://en.wikipedia.org/wiki/Nile). Locate: 1: Introduction / infobox.
- `general-en-01-16` — **Octopus** (`O`). [1](https://en.wikipedia.org/wiki/Octopus). Locate: 1: Introduction / definition and descriptive body.
- `general-en-01-17` — **Pacific Ocean** (`P`). [1](https://oceanservice.noaa.gov/facts/biggestocean.html). Locate: 1: Opening fact: largest ocean; Pacific geography corroboration below.
- `general-en-01-18` — **Quartz** (`Q`). [1](https://en.wikipedia.org/wiki/Quartz). Locate: 1: Identification infobox (Mohs hardness 7); introduction (silicon dioxide).
- `general-en-01-19` — **Rome** (`R`). [1](https://en.wikipedia.org/wiki/Rome). Locate: 1: Introduction / definition and descriptive body.
- `general-en-01-20` — **Saturn** (`S`). [1](https://science.nasa.gov/saturn/facts/). Locate: 1: Our Solar System; Introduction.
- `general-en-01-21` — **Shakespeare** (`SH`). [1](https://en.wikipedia.org/wiki/William_Shakespeare). Locate: 1: Introduction / infobox.
- `general-en-01-22` — **Triangle** (`T`). [1](https://en.wikipedia.org/wiki/Triangle). Locate: 1: Introduction / definition and descriptive body.
- `general-en-01-23` — **Uranium** (`U`). [1](https://en.wikipedia.org/wiki/Uranium). Locate: 1: Introduction / definition and descriptive body.
- `general-en-01-24` — **Venus** (`V`). [1](https://science.nasa.gov/venus/facts/). Locate: 1: Our Solar System.
- `general-en-01-25` — **Watt** (`W`). [1](https://en.wikipedia.org/wiki/Watt). Locate: 1: Introduction / definition and descriptive body.
- `general-en-01-26` — **Xylophone** (`X`). [1](https://en.wikipedia.org/wiki/Xylophone). Locate: 1: Introduction / definition and descriptive body.
- `general-en-01-27` — **Yen** (`Y`). [1](https://en.wikipedia.org/wiki/Japanese_yen). Locate: 1: Introduction / definition and descriptive body.
- `general-en-01-28` — **Zinc** (`Z`). [1](https://en.wikipedia.org/wiki/Zinc). Locate: 1: Introduction / definition and descriptive body.

## general-en-02

[General knowledge · 02](../src/content/general-en-02.json) — en, general, 28 entries.

Source JSON SHA-256: `bac9ca25ec8454f5a04d2a95998a6dc42b7c83d5d273c48f31a7e99a6e3bfc57`.

- `general-en-02-01` — **Accordion** (`A`). [1](https://en.wikipedia.org/wiki/Accordion). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-02` — **Bagel** (`B`). [1](https://en.wikipedia.org/wiki/Bagel). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-03` — **Compass** (`C`). [1](https://en.wikipedia.org/wiki/Compass). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-04` — **Chopsticks** (`CH`). [1](https://en.wikipedia.org/wiki/Chopsticks). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-05` — **Dominoes** (`D`). [1](https://en.wikipedia.org/wiki/Dominoes). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-06` — **Espresso** (`E`). [1](https://en.wikipedia.org/wiki/Espresso). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-07` — **Fahrenheit** (`F`). [1](https://en.wikipedia.org/wiki/Fahrenheit). Locate: 1: Definition and conversion: water freezing at 32 °F.
- `general-en-02-08` — **Gondola** (`G`). [1](https://en.wikipedia.org/wiki/Gondola). Locate: 1: Current design.
- `general-en-02-09` — **Hourglass** (`H`). [1](https://en.wikipedia.org/wiki/Hourglass). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-10` — **Igloo** (`I`). [1](https://en.wikipedia.org/wiki/Igloo). Locate: 1: Nomenclature.
- `general-en-02-11` — **Jigsaw puzzle** (`J`). [1](https://en.wikipedia.org/wiki/Jigsaw_puzzle). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-12` — **Karaoke** (`K`). [1](https://en.wikipedia.org/wiki/Karaoke). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-13` — **Lasso** (`L`). [1](https://en.wikipedia.org/wiki/Lasso). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-14` — **Marathon** (`M`). [1](https://en.wikipedia.org/wiki/Marathon). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-15` — **Nori** (`N`). [1](https://en.wikipedia.org/wiki/Nori). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-16` — **Origami** (`O`). [1](https://en.wikipedia.org/wiki/Origami). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-17` — **Pesto** (`P`). [1](https://en.wikipedia.org/wiki/Pesto). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-18` — **Quilt** (`Q`). [1](https://en.wikipedia.org/wiki/Quilt). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-19` — **Rugby** (`R`). [1](https://en.wikipedia.org/wiki/Rugby_football). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-20` — **Sudoku** (`S`). [1](https://en.wikipedia.org/wiki/Sudoku). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-21` — **Shuttlecock** (`SH`). [1](https://en.wikipedia.org/wiki/Shuttlecock). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-22` — **Thermos** (`T`). [1](https://en.wikipedia.org/wiki/Vacuum_flask). Locate: 1: History.
- `general-en-02-23` — **Ukulele** (`U`). [1](https://en.wikipedia.org/wiki/Ukulele). Locate: 1: Introduction / infobox.
- `general-en-02-24` — **Velcro** (`V`). [1](https://en.wikipedia.org/wiki/Velcro). Locate: 1: Introduction / definition and descriptive body.
- `general-en-02-25` — **Wok** (`W`). [1](https://en.wikipedia.org/wiki/Wok). Locate: 1: Introduction: round-bottomed pan originating in China.
- `general-en-02-26` — **X-ray** (`X`). [1](https://en.wikipedia.org/wiki/X-ray). Locate: 1: Advances in radiology.
- `general-en-02-27` — **Yoga** (`Y`). [1](https://en.wikipedia.org/wiki/Yoga). Locate: 1: Earliest references (1000–500 BCE).
- `general-en-02-28` — **Zipper** (`Z`). [1](https://en.wikipedia.org/wiki/Zipper). Locate: 1: Description.

## geography-cs-01

[Zeměpis a cestování · 01](../src/content/geography-cs-01.json) — cs, geography, 28 entries.

Source JSON SHA-256: `5c7e5c1561e1d88dbab645c7fc9acd5ddd579e1d65b9dc46d2b40e09de3c0df0`.

- `geography-cs-01-01` — **Andy** (`A`). [1](https://cs.wikipedia.org/wiki/Andy). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-02` — **Bangkok** (`B`). [1](https://cs.wikipedia.org/wiki/Bangkok). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-03` — **Canberra** (`C`). [1](https://cs.wikipedia.org/wiki/Canberra). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-04` — **Čad** (`Č`). [1](https://cs.wikipedia.org/wiki/%C4%8Cad). Locate: 1: Introduction / infobox.
- `geography-cs-01-05` — **Dublin** (`D`). [1](https://cs.wikipedia.org/wiki/Dublin). Locate: 1: Historie.
- `geography-cs-01-06` — **Ekvádor** (`E`). [1](https://cs.wikipedia.org/wiki/Galap%C3%A1gy). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-07` — **Fjord** (`F`). [1](https://cs.wikipedia.org/wiki/Fjord). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-08` — **Grónsko** (`G`). [1](https://cs.wikipedia.org/wiki/Gr%C3%B3nsko). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-09` — **Himálaj** (`H`). [1](https://cs.wikipedia.org/wiki/Him%C3%A1laj). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-10` — **Chile** (`Ch`). [1](https://cs.wikipedia.org/wiki/Chile). Locate: 1: Introduction / infobox.
- `geography-cs-01-11` — **Island** (`I`). [1](https://cs.wikipedia.org/wiki/Hekla). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-12` — **Jadran** (`J`). [1](https://cs.wikipedia.org/wiki/Jadersk%C3%A9_mo%C5%99e). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-13` — **Kilimandžáro** (`K`). [1](https://cs.wikipedia.org/wiki/Kilimand%C5%BE%C3%A1ro). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-14` — **Lisabon** (`L`). [1](https://cs.wikipedia.org/wiki/Lisabon). Locate: 1: Mosty.
- `geography-cs-01-15` — **Madagaskar** (`M`). [1](https://cs.wikipedia.org/wiki/Madagaskar). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-16` — **Nairobi** (`N`). [1](https://cs.wikipedia.org/wiki/Nairobi). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-17` — **Oslo** (`O`). [1](https://cs.wikipedia.org/wiki/Oslo). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-18` — **Peru** (`P`). [1](https://cs.wikipedia.org/wiki/Machu_Picchu). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-19` — **Rýn** (`R`). [1](https://cs.wikipedia.org/wiki/R%C3%BDn). Locate: 1: Využití; Introduction / infobox.
- `geography-cs-01-20` — **Řecko** (`Ř`). [1](https://cs.wikipedia.org/wiki/Kr%C3%A9ta). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-21` — **Sicílie** (`S`). [1](https://cs.wikipedia.org/wiki/Sic%C3%ADlie). Locate: 1: Introduction / infobox.
- `geography-cs-01-22` — **Šanghaj** (`Š`). [1](https://cs.wikipedia.org/wiki/%C5%A0anghaj). Locate: 1: Introduction / infobox.
- `geography-cs-01-23` — **Temže** (`T`). [1](https://cs.wikipedia.org/wiki/Tem%C5%BEe). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-24` — **Ulánbátar** (`U`). [1](https://cs.wikipedia.org/wiki/Ul%C3%A1nb%C3%A1tar). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-25` — **Vídeň** (`V`). [1](https://cs.wikipedia.org/wiki/Sch%C3%B6nbrunn). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-26` — **Wellington** (`W`). [1](https://cs.wikipedia.org/wiki/Wellington). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-27` — **Zambezi** (`Z`). [1](https://cs.wikipedia.org/wiki/Viktoriiny_vodop%C3%A1dy). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-01-28` — **Ženeva** (`Ž`). [1](https://cs.wikipedia.org/wiki/%C5%BDeneva). Locate: 1: Introduction / definition and descriptive body.

## geography-cs-02

[Zeměpis a cestování · 02](../src/content/geography-cs-02.json) — cs, geography, 28 entries.

Source JSON SHA-256: `afd8b23873161e5b4b96a57934b7d4d25f5eb07c15156694df3b8400b1fa6b52`.

- `geography-cs-02-01` — **Amsterdam** (`A`). [1](https://cs.wikipedia.org/wiki/Amsterdam). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-02` — **Bajkal** (`B`). [1](https://cs.wikipedia.org/wiki/Bajkal). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-03` — **Curych** (`C`). [1](https://cs.wikipedia.org/wiki/Curych). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-04` — **Černá Hora** (`Č`). [1](https://cs.wikipedia.org/wiki/%C4%8Cern%C3%A1_Hora). Locate: 1: Introduction / infobox.
- `geography-cs-02-05` — **Dover** (`D`). [1](<https://cs.wikipedia.org/wiki/Dover_(Anglie)>). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-06` — **Edinburgh** (`E`). [1](https://cs.wikipedia.org/wiki/Edinburgh). Locate: 1: Místopis.
- `geography-cs-02-07` — **Fidži** (`F`). [1](https://cs.wikipedia.org/wiki/Fid%C5%BEi). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-08` — **Gibraltar** (`G`). [1](https://cs.wikipedia.org/wiki/Gibraltar). Locate: 1: Geografie.
- `geography-cs-02-09` — **Helsinky** (`H`). [1](https://cs.wikipedia.org/wiki/Helsinky). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-10` — **Chomutov** (`Ch`). [1](https://cs.wikipedia.org/wiki/Chomutov). Locate: 1: Introduction / infobox.
- `geography-cs-02-11` — **Istanbul** (`I`). [1](https://cs.wikipedia.org/wiki/Istanbul). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-12` — **Jordánsko** (`J`). [1](<https://cs.wikipedia.org/wiki/Petra_(m%C4%9Bsto)>). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-13` — **Káthmándú** (`K`). [1](https://cs.wikipedia.org/wiki/K%C3%A1thm%C3%A1nd%C3%BA). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-14` — **Lamanšský průliv** (`L`). [1](https://cs.wikipedia.org/wiki/Laman%C5%A1sk%C3%BD_pr%C5%AFliv). Locate: 1: Překonávání průlivu.
- `geography-cs-02-15` — **Mekong** (`M`). [1](https://cs.wikipedia.org/wiki/Mekong). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-16` — **Nový Zéland** (`N`). [1](https://cs.wikipedia.org/wiki/Nov%C3%BD_Z%C3%A9land). Locate: 1: Reliéf.
- `geography-cs-02-17` — **Orinoko** (`O`). [1](https://cs.wikipedia.org/wiki/Orinoko). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-18` — **Panamský průplav** (`P`). [1](https://cs.wikipedia.org/wiki/Panamsk%C3%BD_pr%C5%AFplav). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-19` — **Reykjavík** (`R`). [1](https://cs.wikipedia.org/wiki/Reykjav%C3%ADk). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-20` — **Řezno** (`Ř`). [1](https://cs.wikipedia.org/wiki/%C5%98ezno). Locate: 1: Historie.
- `geography-cs-02-21` — **Singapur** (`S`). [1](https://cs.wikipedia.org/wiki/Singapur). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-22` — **Šikoku** (`Š`). [1](https://cs.wikipedia.org/wiki/%C5%A0ikoku). Locate: 1: Introduction / infobox.
- `geography-cs-02-23` — **Tasmánie** (`T`). [1](https://cs.wikipedia.org/wiki/Tasm%C3%A1nie). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-24` — **Uruguay** (`U`). [1](https://cs.wikipedia.org/wiki/Uruguay). Locate: 1: Introduction / infobox.
- `geography-cs-02-25` — **Varšava** (`V`). [1](https://cs.wikipedia.org/wiki/Var%C5%A1ava). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-26` — **Winnipeg** (`W`). [1](https://cs.wikipedia.org/wiki/Winnipeg). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-27` — **Zanzibar** (`Z`). [1](https://cs.wikipedia.org/wiki/Zanzibar). Locate: 1: Introduction / definition and descriptive body.
- `geography-cs-02-28` — **Žďár nad Sázavou** (`Ž`). [1](https://whc.unesco.org/en/list/690/). Locate: 1: Brief synthesis: pilgrimage church at Zelená Hora near Žďár nad Sázavou.

## geography-en-01

[Geography and travel · 01](../src/content/geography-en-01.json) — en, geography, 28 entries.

Source JSON SHA-256: `72372e3b18ca37d384f1f162ee5be69787c51aad7a47c58d6e51c057f4e995e9`.

- `geography-en-01-01` — **Andes** (`A`). [1](https://en.wikipedia.org/wiki/Andes). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-02` — **Bangkok** (`B`). [1](https://en.wikipedia.org/wiki/Bangkok). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-03` — **Canberra** (`C`). [1](https://en.wikipedia.org/wiki/Canberra). Locate: 1: Introduction / infobox.
- `geography-en-01-04` — **Chile** (`CH`). [1](https://en.wikipedia.org/wiki/Chile). Locate: 1: Introduction / infobox.
- `geography-en-01-05` — **Danube** (`D`). [1](https://en.wikipedia.org/wiki/Danube). Locate: 1: Introduction / infobox.
- `geography-en-01-06` — **Edinburgh** (`E`). [1](https://en.wikipedia.org/wiki/Edinburgh). Locate: 1: Etymology.
- `geography-en-01-07` — **Fiji** (`F`). [1](https://en.wikipedia.org/wiki/Fiji). Locate: 1: Introduction / infobox.
- `geography-en-01-08` — **Greenland** (`G`). [1](https://en.wikipedia.org/wiki/Greenland). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-09` — **Himalayas** (`H`). [1](https://en.wikipedia.org/wiki/Himalayas). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-10` — **Iceland** (`I`). [1](https://en.wikipedia.org/wiki/Hekla). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-11` — **Jakarta** (`J`). [1](https://en.wikipedia.org/wiki/Jakarta). Locate: 1: Batavia under Dutch rule.
- `geography-en-01-12` — **Kilimanjaro** (`K`). [1](https://en.wikipedia.org/wiki/Mount_Kilimanjaro). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-13` — **Lisbon** (`L`). [1](https://en.wikipedia.org/wiki/Lisbon). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-14` — **Madagascar** (`M`). [1](https://en.wikipedia.org/wiki/Madagascar). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-15` — **Nairobi** (`N`). [1](https://en.wikipedia.org/wiki/Nairobi). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-16` — **Oslo** (`O`). [1](https://en.wikipedia.org/wiki/Oslo). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-17` — **Peru** (`P`). [1](https://en.wikipedia.org/wiki/Machu_Picchu). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-18` — **Quito** (`Q`). [1](https://en.wikipedia.org/wiki/Quito). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-19` — **Reykjavík** (`R`). [1](https://en.wikipedia.org/wiki/Reykjav%C3%ADk). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-20` — **Singapore** (`S`). [1](https://en.wikipedia.org/wiki/Singapore). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-21` — **Shanghai** (`SH`). [1](https://en.wikipedia.org/wiki/Shanghai). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-22` — **Thames** (`T`). [1](https://en.wikipedia.org/wiki/River_Thames). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-23` — **Ulaanbaatar** (`U`). [1](https://en.wikipedia.org/wiki/Ulaanbaatar). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-24` — **Vancouver** (`V`). [1](https://en.wikipedia.org/wiki/Vancouver). Locate: 1: Geography.
- `geography-en-01-25` — **Wellington** (`W`). [1](https://en.wikipedia.org/wiki/Wellington). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-26` — **Xi'an** (`X`). [1](https://en.wikipedia.org/wiki/Terracotta_Army). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-27` — **Yangon** (`Y`). [1](https://en.wikipedia.org/wiki/Yangon). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-01-28` — **Zambezi** (`Z`). [1](https://en.wikipedia.org/wiki/Victoria_Falls). Locate: 1: Introduction / definition and descriptive body.

## geography-en-02

[Geography and travel · 02](../src/content/geography-en-02.json) — en, geography, 28 entries.

Source JSON SHA-256: `3303899b59f723dc7c37baf8494ae7fc0d1ea44f762976885a007cc6f2e4e160`.

- `geography-en-02-01` — **Adriatic Sea** (`A`). [1](https://en.wikipedia.org/wiki/Adriatic_Sea). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-02` — **Borneo** (`B`). [1](https://en.wikipedia.org/wiki/Borneo). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-03` — **Caspian Sea** (`C`). [1](https://en.wikipedia.org/wiki/Caspian_Sea). Locate: 1: Introduction / infobox.
- `geography-en-02-04` — **Channel Tunnel** (`CH`). [1](https://en.wikipedia.org/wiki/Channel_Tunnel). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-05` — **Dead Sea** (`D`). [1](https://en.wikipedia.org/wiki/Dead_Sea). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-06` — **Ecuador** (`E`). [1](https://en.wikipedia.org/wiki/Gal%C3%A1pagos_Islands). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-07` — **Fjord** (`F`). [1](https://en.wikipedia.org/wiki/Fjord). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-08` — **Gibraltar** (`G`). [1](https://en.wikipedia.org/wiki/Gibraltar). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-09` — **Honolulu** (`H`). [1](https://en.wikipedia.org/wiki/Honolulu). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-10` — **Istanbul** (`I`). [1](https://en.wikipedia.org/wiki/Istanbul). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-11` — **Jordan** (`J`). [1](https://en.wikipedia.org/wiki/Petra). Locate: 1: Introduction / infobox.
- `geography-en-02-12` — **Kathmandu** (`K`). [1](https://en.wikipedia.org/wiki/Kathmandu). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-13` — **Lake Baikal** (`L`). [1](https://en.wikipedia.org/wiki/Lake_Baikal). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-14` — **Mekong** (`M`). [1](https://en.wikipedia.org/wiki/Mekong). Locate: 1: Introduction / infobox.
- `geography-en-02-15` — **New Zealand** (`N`). [1](https://en.wikipedia.org/wiki/New_Zealand). Locate: 1: Geography.
- `geography-en-02-16` — **Orinoco** (`O`). [1](https://en.wikipedia.org/wiki/Orinoco). Locate: 1: Introduction / infobox.
- `geography-en-02-17` — **Panama Canal** (`P`). [1](https://en.wikipedia.org/wiki/Panama_Canal). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-18` — **Quebec** (`Q`). [1](https://en.wikipedia.org/wiki/Quebec). Locate: 1: Introduction / infobox.
- `geography-en-02-19` — **Rhine** (`R`). [1](https://en.wikipedia.org/wiki/Rhine). Locate: 1: Introduction / infobox.
- `geography-en-02-20` — **Sicily** (`S`). [1](https://en.wikipedia.org/wiki/Sicily). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-21` — **Shikoku** (`SH`). [1](https://en.wikipedia.org/wiki/Shikoku). Locate: 1: Introduction / infobox.
- `geography-en-02-22` — **Tasmania** (`T`). [1](https://en.wikipedia.org/wiki/Tasmania). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-23` — **Uruguay** (`U`). [1](https://en.wikipedia.org/wiki/Uruguay). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-24` — **Vienna** (`V`). [1](https://en.wikipedia.org/wiki/Vienna). Locate: 1: Introduction / infobox.
- `geography-en-02-25` — **Warsaw** (`W`). [1](https://en.wikipedia.org/wiki/Warsaw). Locate: 1: Introduction / definition and descriptive body.
- `geography-en-02-26` — **Xiamen** (`X`). [1](https://en.wikipedia.org/wiki/Xiamen). Locate: 1: Introduction / infobox.
- `geography-en-02-27` — **Yellowstone** (`Y`). [1](https://en.wikipedia.org/wiki/Yellowstone_National_Park). Locate: 1: Introduction / infobox.
- `geography-en-02-28` — **Zanzibar** (`Z`). [1](https://en.wikipedia.org/wiki/Zanzibar). Locate: 1: Introduction / definition and descriptive body.

## nature-cs-01

[Příroda · 01](../src/content/nature-cs-01.json) — cs, nature, 28 entries.

Source JSON SHA-256: `2310f5793085bc5f5eafdf6ca55f9be64892ba1d6e0ae88b10cd608fa4107de5`.

- `nature-cs-01-01` — **Albatros** (`A`). [1](https://cs.wikipedia.org/wiki/Albatrosovit%C3%AD). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-01-02` — **Bobr** (`B`). [1](https://cs.wikipedia.org/wiki/Bobr). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-01-03` — **Cvrček** (`C`). [1](https://cs.wikipedia.org/wiki/Cvr%C4%8Dek_poln%C3%AD). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-01-04` — **Čáp bílý** (`Č`). [1](https://cs.wikipedia.org/wiki/%C4%8C%C3%A1p_b%C3%ADl%C3%BD). Locate: 1: Introduction, Popis and photograph caption: bill clattering, red bill/legs, nests.
- `nature-cs-01-05` — **Datel černý** (`D`). [1](https://cs.wikipedia.org/wiki/Datel_%C4%8Dern%C3%BD). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-01-06` — **Echolokace** (`E`). [1](https://cs.wikipedia.org/wiki/Echolokace). Locate: 1: Introduction / infobox.
- `nature-cs-01-07` — **Fretka** (`F`). [1](https://cs.wikipedia.org/wiki/Fretka_dom%C3%A1c%C3%AD). Locate: 1: Chov.
- `nature-cs-01-08` — **Gorila** (`G`). [1](https://cs.wikipedia.org/wiki/Gorila). Locate: 1: Introduction / infobox.
- `nature-cs-01-09` — **Hibernace** (`H`). [1](https://cs.wikipedia.org/wiki/Zimn%C3%AD_sp%C3%A1nek). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-01-10` — **Chameleon** (`Ch`). [1](https://cs.wikipedia.org/wiki/Chameleonovit%C3%AD); [2](https://en.wikipedia.org/wiki/Chameleon). Locate: 1: Charakteristika: projectile tongue; see the English corroboration for eyes/tail · 2: Introduction and Description: independent eyes, projectile tongue, prehensile tail.
- `nature-cs-01-11` — **Ibis** (`I`). [1](https://cs.wikipedia.org/wiki/Ibis_posv%C3%A1tn%C3%BD). Locate: 1: Introduction / infobox.
- `nature-cs-01-12` — **Ježek** (`J`). [1](https://cs.wikipedia.org/wiki/Je%C5%BEek_z%C3%A1padn%C3%AD). Locate: 1: Popis; Chování.
- `nature-cs-01-13` — **Kolibřík** (`K`). [1](https://cs.wikipedia.org/wiki/Kolib%C5%99%C3%ADkovit%C3%AD). Locate: 1: Introduction / infobox; Potrava.
- `nature-cs-01-14` — **Lišejník** (`L`). [1](https://cs.wikipedia.org/wiki/Li%C5%A1ejn%C3%ADk). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-01-15` — **Medvěd lední** (`M`). [1](https://cs.wikipedia.org/wiki/Medv%C4%9Bd_ledn%C3%AD). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-01-16` — **Netopýr** (`N`). [1](https://cs.wikipedia.org/wiki/Letouni). Locate: 1: Introduction / infobox.
- `nature-cs-01-17` — **Orchidej** (`O`). [1](https://cs.wikipedia.org/wiki/Vstava%C4%8Dovit%C3%A9). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-01-18` — **Pavouk** (`P`). [1](https://cs.wikipedia.org/wiki/Pavouci). Locate: 1: Introduction / infobox.
- `nature-cs-01-19` — **Rosnatka** (`R`). [1](https://cs.wikipedia.org/wiki/Rosnatka). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-01-20` — **Řasy** (`Ř`). [1](https://cs.wikipedia.org/wiki/%C5%98asy). Locate: 1: Introduction / infobox.
- `nature-cs-01-21` — **Sasanka** (`S`). [1](https://cs.wikipedia.org/wiki/Sasanky). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-01-22` — **Štika obecná** (`Š`). [1](https://cs.wikipedia.org/wiki/%C5%A0tika_obecn%C3%A1). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-01-23` — **Tučňák** (`T`). [1](https://cs.wikipedia.org/wiki/Tu%C4%8D%C5%88%C3%A1kovit%C3%AD). Locate: 1: Morfologie a anatomie.
- `nature-cs-01-24` — **Užovka obojková** (`U`). [1](https://cs.wikipedia.org/wiki/U%C5%BEovka_obojkov%C3%A1). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-01-25` — **Vydra říční** (`V`). [1](https://cs.wikipedia.org/wiki/Vydra_%C5%99%C3%AD%C4%8Dn%C3%AD). Locate: 1: Fyzické vlastnosti.
- `nature-cs-01-26` — **Wollemie vznešená** (`W`). [1](https://botany.cz/cs/wollemia-nobilis/). Locate: 1: Rozšíření and Poznámka: Wollemi discovery in 1994, David Noble.
- `nature-cs-01-27` — **Zmije obecná** (`Z`). [1](https://cs.wikipedia.org/wiki/Zmije_obecn%C3%A1). Locate: 1: Introduction / infobox.
- `nature-cs-01-28` — **Žirafa** (`Ž`). [1](https://cs.wikipedia.org/wiki/%C5%BDirafa). Locate: 1: Introduction / definition and descriptive body.

## nature-cs-02

[Příroda · 02](../src/content/nature-cs-02.json) — cs, nature, 28 entries.

Source JSON SHA-256: `076643437f6d0da2dfc34f218c2688045fed6fb072ce5076b39b488ee15d77bc`.

- `nature-cs-02-01` — **Axolotl mexický** (`A`). [1](https://cs.wikipedia.org/wiki/Axolotl_mexick%C3%BD). Locate: 1: Popis.
- `nature-cs-02-02` — **Blatouch bahenní** (`B`). [1](https://cs.wikipedia.org/wiki/Blatouch_bahenn%C3%AD). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-03` — **Cibetka africká** (`C`). [1](https://cs.wikipedia.org/wiki/Cibetka_africk%C3%A1). Locate: 1: Zajímavosti; Popis.
- `nature-cs-02-04` — **Čmelák** (`Č`). [1](https://cs.wikipedia.org/wiki/%C4%8Cmel%C3%A1k). Locate: 1: Introduction / infobox.
- `nature-cs-02-05` — **Dub** (`D`). [1](https://cs.wikipedia.org/wiki/Dub). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-06` — **Eukalyptus** (`E`). [1](https://cs.wikipedia.org/wiki/Blahovi%C4%8Dn%C3%ADk); [2](https://en.wikipedia.org/wiki/Koala). Locate: 1: Interakce se živočichy · 2: Introduction and Feeding: eucalyptus leaves as the main diet.
- `nature-cs-02-07` — **Fenykl obecný** (`F`). [1](https://cs.wikipedia.org/wiki/Fenykl_obecn%C3%BD). Locate: 1: Introduction / infobox.
- `nature-cs-02-08` — **Gekon** (`G`). [1](https://cs.wikipedia.org/wiki/Gekoni). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-09` — **Hřib smrkový** (`H`). [1](https://cs.wikipedia.org/wiki/H%C5%99ib_smrkov%C3%BD). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-10` — **Chobotnice** (`Ch`). [1](https://cs.wikipedia.org/wiki/Chobotnice). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-11` — **Impala** (`I`). [1](https://cs.wikipedia.org/wiki/Impala). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-12` — **Jepice** (`J`). [1](https://cs.wikipedia.org/wiki/Jepice). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-13` — **Korál** (`K`). [1](https://cs.wikipedia.org/wiki/Kor%C3%A1li). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-14` — **Lenochod** (`L`). [1](https://cs.wikipedia.org/wiki/Lenochodi). Locate: 1: Výskyt; Chování.
- `nature-cs-02-15` — **Mlok skvrnitý** (`M`). [1](https://cs.wikipedia.org/wiki/Mlok_skvrnit%C3%BD). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-16` — **Nosorožec** (`N`). [1](https://cs.wikipedia.org/wiki/Nosoro%C5%BEcovit%C3%AD). Locate: 1: Roh.
- `nature-cs-02-17` — **Okapi** (`O`). [1](https://cs.wikipedia.org/wiki/Okapi). Locate: 1: Nohy.
- `nature-cs-02-18` — **Pštros** (`P`). [1](https://cs.wikipedia.org/wiki/P%C5%A1tros_dvouprst%C3%BD). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-19` — **Rys ostrovid** (`R`). [1](https://cs.wikipedia.org/wiki/Rys_ostrovid). Locate: 1: Introduction / infobox.
- `nature-cs-02-20` — **Řebříček obecný** (`Ř`). [1](https://cs.wikipedia.org/wiki/%C5%98eb%C5%99%C3%AD%C4%8Dek_obecn%C3%BD). Locate: 1: Popis rostliny.
- `nature-cs-02-21` — **Sépie** (`S`). [1](<https://cs.wikipedia.org/wiki/S%C3%A9pie_(%C5%99%C3%A1d)>). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-22` — **Šimpanz učenlivý** (`Š`). [1](https://cs.wikipedia.org/wiki/%C5%A0impanz_u%C4%8Denliv%C3%BD). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-23` — **Tasemnice** (`T`). [1](https://cs.wikipedia.org/wiki/Tasemnice). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-24` — **Urzon kanadský** (`U`). [1](https://cs.wikipedia.org/wiki/Urzon_kanadsk%C3%BD). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-25` — **Vážka** (`V`). [1](https://cs.wikipedia.org/wiki/V%C3%A1%C5%BEky). Locate: 1: Dospělec: two pairs of wings; introduction and Larva: aquatic development.
- `nature-cs-02-26` — **Wapiti** (`W`). [1](https://cs.wikipedia.org/wiki/Wapiti). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-27` — **Zubr evropský** (`Z`). [1](https://cs.wikipedia.org/wiki/Zubr_evropsk%C3%BD). Locate: 1: Introduction / definition and descriptive body.
- `nature-cs-02-28` — **Žížala** (`Ž`). [1](https://cs.wikipedia.org/wiki/%C5%BD%C3%AD%C5%BEala). Locate: 1: Popis.

## nature-en-01

[Nature · 01](../src/content/nature-en-01.json) — en, nature, 28 entries.

Source JSON SHA-256: `09340b286621222d3ee66ec12aeed2d9469e3786d5837988e9f98bd91ac71f24`.

- `nature-en-01-01` — **Aardvark** (`A`). [1](https://en.wikipedia.org/wiki/Aardvark). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-02` — **Beaver** (`B`). [1](https://en.wikipedia.org/wiki/Beaver). Locate: 1: Introduction / infobox.
- `nature-en-01-03` — **Caterpillar** (`C`). [1](https://en.wikipedia.org/wiki/Caterpillar). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-04` — **Cheetah** (`CH`). [1](https://en.wikipedia.org/wiki/Cheetah). Locate: 1: Introduction / infobox.
- `nature-en-01-05` — **Dragonfly** (`D`). [1](https://en.wikipedia.org/wiki/Dragonfly). Locate: 1: Introduction / infobox.
- `nature-en-01-06` — **Echolocation** (`E`). [1](https://en.wikipedia.org/wiki/Animal_echolocation). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-07` — **Fern** (`F`). [1](https://en.wikipedia.org/wiki/Fern). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-08` — **Gills** (`G`). [1](https://en.wikipedia.org/wiki/Gill). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-09` — **Hummingbird** (`H`). [1](https://en.wikipedia.org/wiki/Hummingbird). Locate: 1: Introduction / infobox.
- `nature-en-01-10` — **Insect** (`I`). [1](https://en.wikipedia.org/wiki/Insect). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-11` — **Jellyfish** (`J`). [1](https://en.wikipedia.org/wiki/Jellyfish). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-12` — **Kelp** (`K`). [1](https://en.wikipedia.org/wiki/Kelp). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-13` — **Lichen** (`L`). [1](https://en.wikipedia.org/wiki/Lichen). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-14` — **Marsupial** (`M`). [1](https://en.wikipedia.org/wiki/Marsupial). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-15` — **Nectar** (`N`). [1](https://en.wikipedia.org/wiki/Nectar). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-16` — **Owl** (`O`). [1](https://en.wikipedia.org/wiki/Owl). Locate: 1: Anatomy.
- `nature-en-01-17` — **Platypus** (`P`). [1](https://en.wikipedia.org/wiki/Platypus). Locate: 1: Introduction / infobox; Ecology and behaviour.
- `nature-en-01-18` — **Quills** (`Q`). [1](https://en.wikipedia.org/wiki/Porcupine). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-19` — **Ruminant** (`R`). [1](https://en.wikipedia.org/wiki/Ruminant). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-20` — **Stomata** (`S`). [1](https://en.wikipedia.org/wiki/Stoma). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-21` — **Shark** (`SH`). [1](https://en.wikipedia.org/wiki/Shark). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-22` — **Tadpole** (`T`). [1](https://en.wikipedia.org/wiki/Tadpole). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-23` — **Urchin** (`U`). [1](https://en.wikipedia.org/wiki/Sea_urchin). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-24` — **Vulture** (`V`). [1](https://en.wikipedia.org/wiki/Vulture). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-25` — **Whale shark** (`W`). [1](https://en.wikipedia.org/wiki/Whale_shark). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-26` — **Xylem** (`X`). [1](https://en.wikipedia.org/wiki/Xylem). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-01-27` — **Yeast** (`Y`). [1](https://en.wikipedia.org/wiki/Yeast). Locate: 1: History.
- `nature-en-01-28` — **Zooplankton** (`Z`). [1](https://en.wikipedia.org/wiki/Zooplankton). Locate: 1: Overview.

## nature-en-02

[Nature · 02](../src/content/nature-en-02.json) — en, nature, 28 entries.

Source JSON SHA-256: `fc27818a40097f89114b43af25cf9ffa59cbbeb56f31dae072b06151047eff50`.

- `nature-en-02-01` — **Anemone** (`A`). [1](https://en.wikipedia.org/wiki/Sea_anemone). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-02` — **Bat** (`B`). [1](https://en.wikipedia.org/wiki/Bat). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-03` — **Coral** (`C`). [1](https://en.wikipedia.org/wiki/Coral). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-04` — **Chlorophyll** (`CH`). [1](https://en.wikipedia.org/wiki/Chlorophyll). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-05` — **Deciduous** (`D`). [1](https://en.wikipedia.org/wiki/Deciduous). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-06` — **Earthworm** (`E`). [1](https://en.wikipedia.org/wiki/Earthworm). Locate: 1: Introduction and Benefits: organic food, soil mixing, aeration.
- `nature-en-02-07` — **Fungi** (`F`). [1](https://en.wikipedia.org/wiki/Fungus). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-08` — **Gecko** (`G`). [1](https://en.wikipedia.org/wiki/Gecko). Locate: 1: Introduction / infobox.
- `nature-en-02-09` — **Hibernation** (`H`). [1](https://en.wikipedia.org/wiki/Hibernation). Locate: 1: Obligate hibernation.
- `nature-en-02-10` — **Ibis** (`I`). [1](https://en.wikipedia.org/wiki/Ibis). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-11` — **Jaguar** (`J`). [1](https://en.wikipedia.org/wiki/Jaguar). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-12` — **Kiwi** (`K`). [1](<https://en.wikipedia.org/wiki/Kiwi_(bird)>). Locate: 1: Introduction / infobox.
- `nature-en-02-13` — **Lemur** (`L`). [1](https://en.wikipedia.org/wiki/Lemur). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-14` — **Mangrove** (`M`). [1](https://en.wikipedia.org/wiki/Mangrove). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-15` — **Narwhal** (`N`). [1](https://en.wikipedia.org/wiki/Narwhal). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-16` — **Orchid** (`O`). [1](https://en.wikipedia.org/wiki/Orchid). Locate: 1: Flavours and aromas.
- `nature-en-02-17` — **Pollen** (`P`). [1](https://en.wikipedia.org/wiki/Pollen). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-18` — **Quokka** (`Q`). [1](https://en.wikipedia.org/wiki/Quokka). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-19` — **Root** (`R`). [1](https://en.wikipedia.org/wiki/Root). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-20` — **Seahorse** (`S`). [1](https://en.wikipedia.org/wiki/Seahorse). Locate: 1: Reproduction.
- `nature-en-02-21` — **Shrew** (`SH`). [1](https://en.wikipedia.org/wiki/Shrew). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-22` — **Termite** (`T`). [1](https://en.wikipedia.org/wiki/Termite). Locate: 1: Introduction and Neoisoptera: social insects, cellulose and gut symbionts.
- `nature-en-02-23` — **Understorey** (`U`). [1](https://en.wikipedia.org/wiki/Understory). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-24` — **Venom** (`V`). [1](https://en.wikipedia.org/wiki/Venom). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-25` — **Wombat** (`W`). [1](https://en.wikipedia.org/wiki/Wombat). Locate: 1: Characteristics.
- `nature-en-02-26` — **Xerophyte** (`X`). [1](https://en.wikipedia.org/wiki/Xerophyte). Locate: 1: Introduction / definition and descriptive body.
- `nature-en-02-27` — **Yew** (`Y`). [1](https://en.wikipedia.org/wiki/Taxus). Locate: 1: Morphology.
- `nature-en-02-28` — **Zygote** (`Z`). [1](https://en.wikipedia.org/wiki/Zygote). Locate: 1: Introduction / definition and descriptive body.
