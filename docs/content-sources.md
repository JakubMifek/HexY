# Per-entry factual source ledger — phases 5 and 6

The full phase-6 candidate contains **24 packs / 672 entries**. The first
twelve packs / 336 entries retain their exact phase-5 files and independent
clearance. The twelve additional History, Politics/diplomacy and
Science/technology packs below are **developer-checked, not independently
cleared**. Each new entry must receive a fresh factual and linguistic review.
Hashes identify exact JSON bytes; they are not evidence of factual truth.

## Review corrections

The [initial independent review](../reviews/phase-05.md) checked all 336 entries.
P5-R1/R2/R4 corrections affect only `nature-cs-01-14` (community, not relationship),
`general-cs-02-08` and `general-en-02-24` (scope-compatible aliases only), and
`geography-cs-01-19` (no declined answer in the city clue). Their references,
canonical answers, IDs and initials are unchanged. The four affected pack hashes
below identify the independently cleared phase-5 corrections.

Phase-5 developer source checks: **2026-10-28**; independent review cleared.
The phase-5 portion below covers **12 packs / 336 entries**, including the 56 unchanged
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

The phase-5 packs have **339 distinct in-pack URLs**. All except the two noted below
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

## Phase-6 developer source audit — corrections await re-review

The following **12 new packs / 336 original entries** add three categories.
All 336 prompts, canonical answers and aliases were checked against retrieved
public source content, including relevant dates, definitions, body sections,
infoboxes and tables—not just HTTP status or an answer-token match.
The initial candidate shipped **284 distinct source URLs**. The 280 primary URLs
were fetched and cached locally; the four additional distinct corroborating
references (Czech Constitution, NIST, RSC and The National Archives) were
retrieved and their relevant passages read separately. The Constitution’s
Windows-1250 encoding was decoded before reading Articles 15–16, 27 and 53.

Introductory definitions support most institutional and scientific terms;
the more specific locations below identify the additional historical and
technical evidence. English-language sources do not certify natural Czech:
the Czech Mandát, Unitární stát and Řemenice articles and official ombudsman
page additionally verify those Czech concepts. All translations and question
prose are newly composed; no source passages or commercial quiz text are copied.

Source-driven refinements before review: separate agrément from accreditation;
use the elected-representative meaning of mandát; avoid treating an emperor’s
nickname or an excavation-team attribution marked as needing citation as a
necessary clue; distinguish the 1086 survey from disputed manuscript dating;
qualify Boyle’s law for ideal gas; avoid unsupported thermal-neutron narrowing;
date the Xi appointment and EU voting rule explicitly. School reform is stated
as a requirement for children’s education, not universal practical attendance.
Existing phase-5 question files and corrections are byte-for-byte unchanged.

All final new references were successfully retrieved. Exploratory Czech
Wikipedia titles Akreditace (diplomacie) and Všeobecný školní řád returned 404
and were discarded, not shipped or counted as factual support. Generic
accreditation and mandate references were replaced when their substantive
scope did not support the intended question. External sources can change;
the local research cache and exact pack hashes aid the fresh independent
review, but neither a developer audit nor automated tests clear this phase.

### P6-R1–R4 correction source checks

The corrected candidate ships **285 distinct new-pack URLs**. Exactly four
entries changed; the other 332 new entries and all 336 prior entries are
unchanged. Current hashes and entry rows below identify the correction candidate,
not the initial reviewed bytes. The original snapshot and all packs are preserved
in `.artifacts/phase-06-before-review-fixes/`.

- P6-R1, `politics-cs-02-06`: retain the executive-branch definition and canonical
  Exekutiva; remove `výkonná moc`, disclosed through inflection in the clue.
- P6-R2, `history-en-01-23`: the U-boat article's introduction distinguishes
  the English term from the German source word Unterseeboot. The latter is
  no longer an accepted answer to an explicitly English-term question.
- P6-R3, `politics-en-02-14`: the retrieved Motion of no confidence introduction
  distinguishes the proposal, the vote on it, and their positive inverses.
  The clue now explicitly declares lack of support to remain in office.
  `no-confidence motion` remains an alias; `vote of no confidence` does not,
  because the revised question specifically requests a motion.
- P6-R4, `history-cs-01-26`: no defensible Czech W-form support was found in the
  bounded search; that is not a claim that the form never occurs historically.
  Rather than retain an unsupported spelling, replace this one W entry with
  Washington's first presidency in 1789. The retrieved Czech article's
  introduction identifies him as the first US president and its infobox dates
  his term from 30 April 1789. The US National Archives' explanatory account
  describes the first inauguration and oath on that date. These substantively
  support the original Czech prompt, natural W surname, and `George Washington`
  alias. The old Peace of Westphalia URL is replaced, not offered as support for
  the new fact. Stable ID, W placement and category remain unchanged.

The two Washington references and motion definition were retrieved and cached
in `.artifacts/phase-06-review-fixes-research/`; the U-boat introduction was
retrieved and read through web-fetch. See the [developer response](../reviews/phase-06.md)
and [handoff](phase-06-handoff.md). Findings remain pending independent re-review.

## history-cs-01

[Historie · 01](../src/content/history-cs-01.json) — cs, history, 28 entries.

Source JSON SHA-256: `6d9ff2ae5704561a7745f099e8457963dd1fd55472d5e7f2ad16f55e6450a671`.

- `history-cs-01-01` — **Atentát v Sarajevu** (`A`). [1](https://en.wikipedia.org/wiki/Assassination_of_Archduke_Franz_Ferdinand). Locate: 1: Introduction: victims, Sarajevo, date and assassin.
- `history-cs-01-02` — **Bílá hora** (`B`). [1](https://en.wikipedia.org/wiki/Battle_of_White_Mountain). Locate: 1: Introduction: date, location and defeated Bohemian estates.
- `history-cs-01-03` — **Cyril** (`C`). [1](https://en.wikipedia.org/wiki/Saints_Cyril_and_Methodius). Locate: 1: Early life; Journey to Rome: Constantine, monastic name and alphabet.
- `history-cs-01-04` — **Čingischán** (`Č`). [1](https://en.wikipedia.org/wiki/Genghis_Khan). Locate: 1: Introduction; Mongol Empire / Kurultai: title adopted in 1206.
- `history-cs-01-05` — **Dekret kutnohorský** (`D`). [1](https://en.wikipedia.org/wiki/Decree_of_Kutn%C3%A1_Hora). Locate: 1: Introduction: 1409 university voting decree.
- `history-cs-01-06` — **Eliška Přemyslovna** (`E`). [1](<https://en.wikipedia.org/wiki/Elizabeth_of_Bohemia_(1292%E2%80%931330)>). Locate: 1: Introduction; Marriage to John of Luxembourg: dynasty and marriage.
- `history-cs-01-07` — **František Palacký** (`F`). [1](https://en.wikipedia.org/wiki/Franti%C5%A1ek_Palack%C3%BD). Locate: 1: Joining the Czech national movement: history-book title and author.
- `history-cs-01-08` — **Gaugaméla** (`G`). [1](https://en.wikipedia.org/wiki/Battle_of_Gaugamela). Locate: 1: Introduction: Alexander, Darius III and 331 BC battle.
- `history-cs-01-09` — **Husité** (`H`). [1](https://en.wikipedia.org/wiki/Hussites). Locate: 1: Moderates: Four Articles of Prague and 1420 programme.
- `history-cs-01-10` — **Chammurapi** (`Ch`). [1](https://en.wikipedia.org/wiki/Hammurabi). Locate: 1: Introduction; King of justice: reign and law-code stele.
- `history-cs-01-11` — **Inkvizice** (`I`). [1](https://en.wikipedia.org/wiki/Inquisition). Locate: 1: Introduction: ecclesiastical institutions against heresy.
- `history-cs-01-12` — **Jan Žižka** (`J`). [1](https://en.wikipedia.org/wiki/Battle_of_V%C3%ADtkov_Hill). Locate: 1: Introduction; Battle: Žižka and 1420 defence.
- `history-cs-01-13` — **Karel IV.** (`K`). [1](https://en.wikipedia.org/wiki/Charles_University). Locate: 1: History / Medieval university: foundation in 1348.
- `history-cs-01-14` — **Ludvík Jagellonský** (`L`). [1](https://en.wikipedia.org/wiki/Louis_II_of_Hungary). Locate: 1: War with the Ottomans: flight and drowning in 1526.
- `history-cs-01-15` — **Marie Terezie** (`M`). [1](https://en.wikipedia.org/wiki/Maria_Theresa). Locate: 1: Education: December 1774 reform and education ages six to twelve.
- `history-cs-01-16` — **Napoleon Bonaparte** (`N`). [1](https://en.wikipedia.org/wiki/Napoleon). Locate: 1: Introduction: imperial title and death on Saint Helena.
- `history-cs-01-17` — **Ostrakismus** (`O`). [1](https://en.wikipedia.org/wiki/Ostracism). Locate: 1: Introduction; Procedure: sherds and ten-year expulsion.
- `history-cs-01-18` — **Přemysl Otakar II.** (`P`). [1](https://en.wikipedia.org/wiki/Ottokar_II_of_Bohemia). Locate: 1: Introduction; Path to the final battle: nickname and 1278 death.
- `history-cs-01-19` — **Rudolf II.** (`R`). [1](https://en.wikipedia.org/wiki/Rudolf_II,_Holy_Roman_Emperor). Locate: 1: Personal life; Patronage of arts: court moved in 1583.
- `history-cs-01-20` — **Řehoř VII.** (`Ř`). [1](https://en.wikipedia.org/wiki/Pope_Gregory_VII). Locate: 1: Conflict with Henry IV; Walk to Canossa: 1077 reconciliation.
- `history-cs-01-21` — **Sametová revoluce** (`S`). [1](https://en.wikipedia.org/wiki/Velvet_Revolution). Locate: 1: Introduction: nonviolent Czechoslovak transition in 1989.
- `history-cs-01-22` — **Šalomoun** (`Š`). [1](https://en.wikipedia.org/wiki/Solomon). Locate: 1: Death and succession: First Temple attributed to Solomon in the biblical account.
- `history-cs-01-23` — **Terezín** (`T`). [1](https://en.wikipedia.org/wiki/Terez%C3%ADn). Locate: 1: Etymology; History: foundation and dedication to Maria Theresa.
- `history-cs-01-24` — **Urbán II.** (`U`). [1](https://en.wikipedia.org/wiki/Pope_Urban_II). Locate: 1: Introduction: Clermont appeal in 1095.
- `history-cs-01-25` — **Velká Morava** (`V`). [1](https://en.wikipedia.org/wiki/Great_Moravia). Locate: 1: Introduction; History: Svatopluk and ninth-century polity.
- `history-cs-01-26` — **Washington** (`W`). [1](https://cs.wikipedia.org/wiki/George_Washington); [2](https://www.archives.gov/milestone-documents/president-george-washingtons-first-inaugural-speech). Locate: 1: Introduction / presidential-term infobox: Czech name, first presidency and 1789 start · 2: First inaugural address overview and oath-of-office account: 30 April 1789.
- `history-cs-01-27` — **Zlatá bula sicilská** (`Z`). [1](https://en.wikipedia.org/wiki/Golden_Bull_of_Sicily). Locate: 1: Introduction: 1212 charter and hereditary Bohemian kingship.
- `history-cs-01-28` — **Železná opona** (`Ž`). [1](https://en.wikipedia.org/wiki/Iron_Curtain). Locate: 1: Introduction: Churchill’s Fulton speech in 1946.

## history-cs-02

[Historie · 02](../src/content/history-cs-02.json) — cs, history, 28 entries.

Source JSON SHA-256: `34451b005e4af94a3650a98208d9c4a0877a088d1ee128024cbaa4029ad4f6df`.

- `history-cs-02-01` — **Alexandr Veliký** (`A`). [1](https://en.wikipedia.org/wiki/Alexander_the_Great). Locate: 1: Introduction: Aristotle and death in Babylon in 323 BC.
- `history-cs-02-02` — **Byzantská říše** (`B`). [1](https://en.wikipedia.org/wiki/Byzantine_Empire). Locate: 1: Introduction: eastern Roman polity and Constantinople.
- `history-cs-02-03` — **Caesar** (`C`). [1](https://en.wikipedia.org/wiki/Julius_Caesar). Locate: 1: Introduction; Civil war: Rubicon crossing in 49 BC.
- `history-cs-02-04` — **Československo** (`Č`). [1](https://en.wikipedia.org/wiki/Czechoslovakia). Locate: 1: Infobox; Origins: 28 October 1918 and first president.
- `history-cs-02-05` — **Defenestrace** (`D`). [1](https://en.wikipedia.org/wiki/Defenestration). Locate: 1: Introduction: throwing from a window and Prague in 1618.
- `history-cs-02-06` — **Egypt** (`E`). [1](https://en.wikipedia.org/wiki/Menes). Locate: 1: Introduction: traditional unifier of Upper and Lower Egypt.
- `history-cs-02-07` — **Ferdinand Magellan** (`F`). [1](https://en.wikipedia.org/wiki/Ferdinand_Magellan). Locate: 1: Introduction: 1519 expedition, death and Elcano’s completion.
- `history-cs-02-08` — **Gilgameš** (`G`). [1](https://en.wikipedia.org/wiki/Gilgamesh). Locate: 1: Introduction: legendary Uruk king and search for immortality.
- `history-cs-02-09` — **Habsburkové** (`H`). [1](https://en.wikipedia.org/wiki/Habsburg_monarchy). Locate: 1: Origins: Ferdinand I’s election in Bohemia in 1526.
- `history-cs-02-10` — **Charta 77** (`Ch`). [1](https://en.wikipedia.org/wiki/Charter_77). Locate: 1: Introduction; Founding and political aims: January 1977 declaration.
- `history-cs-02-11` — **Isabela Kastilská** (`I`). [1](https://en.wikipedia.org/wiki/Isabella_I_of_Castile). Locate: 1: Introduction: joint sponsorship of Columbus in 1492.
- `history-cs-02-12` — **Johana z Arku** (`J`). [1](https://en.wikipedia.org/wiki/Joan_of_Arc). Locate: 1: Introduction; Trial and execution: Orléans and Rouen in 1431.
- `history-cs-02-13` — **Kleopatra VII.** (`K`). [1](https://en.wikipedia.org/wiki/Cleopatra). Locate: 1: Introduction: Cleopatra VII and end of Ptolemaic rule.
- `history-cs-02-14` — **Lenní systém** (`L`). [1](https://en.wikipedia.org/wiki/Feudalism). Locate: 1: Introduction: land holding for service and loyalty.
- `history-cs-02-15` — **Mnichovská dohoda** (`M`). [1](https://en.wikipedia.org/wiki/Munich_Agreement). Locate: 1: Introduction; Immediate response: 1938 agreement and exclusion of Czechoslovakia.
- `history-cs-02-16` — **Neolit** (`N`). [1](https://en.wikipedia.org/wiki/Neolithic). Locate: 1: Introduction; Lithic technology: agriculture and polished stone.
- `history-cs-02-17` — **Oktavián Augustus** (`O`). [1](https://en.wikipedia.org/wiki/Augustus). Locate: 1: Introduction; Heir to Caesar: adoption and first emperor.
- `history-cs-02-18` — **Pražské jaro** (`P`). [1](https://en.wikipedia.org/wiki/Prague_Spring). Locate: 1: Introduction: Dubček and Czechoslovak reform in 1968.
- `history-cs-02-19` — **Reformace** (`R`). [1](https://en.wikipedia.org/wiki/Reformation). Locate: 1: Introduction: sixteenth-century religious movement and Luther.
- `history-cs-02-20` — **Říjnová revoluce** (`Ř`). [1](https://en.wikipedia.org/wiki/October_Revolution). Locate: 1: Introduction: Russian event and Julian-calendar dating.
- `history-cs-02-21` — **Spartakus** (`S`). [1](https://en.wikipedia.org/wiki/Spartacus). Locate: 1: Introduction: revolt from 73 to 71 BC.
- `history-cs-02-22` — **Španělská občanská válka** (`Š`). [1](https://en.wikipedia.org/wiki/Spanish_Civil_War). Locate: 1: Introduction: 1936–1939 conflict and Franco’s victory.
- `history-cs-02-23` — **Trojspolek** (`T`). [1](<https://en.wikipedia.org/wiki/Triple_Alliance_(1882)>). Locate: 1: Introduction: 1882 alliance and its three states.
- `history-cs-02-24` — **Uhersko** (`U`). [1](https://en.wikipedia.org/wiki/Kingdom_of_Hungary). Locate: 1: Introduction: Stephen I’s kingdom around 1000.
- `history-cs-02-25` — **Věstonická venuše** (`V`). [1](https://en.wikipedia.org/wiki/Venus_of_Doln%C3%AD_V%C4%9Bstonice). Locate: 1: Introduction; History: ceramic statuette, southern Moravia and 1925 discovery.
- `history-cs-02-26` — **Winton** (`W`). [1](https://en.wikipedia.org/wiki/Nicholas_Winton). Locate: 1: Introduction: 669 children rescued from Czechoslovakia.
- `history-cs-02-27` — **Zikmund Lucemburský** (`Z`). [1](https://en.wikipedia.org/wiki/Sigismund,_Holy_Roman_Emperor). Locate: 1: Introduction; Early life: Charles IV’s son, Hungarian king in 1387, emperor in 1433.
- `history-cs-02-28` — **Žoldnéř** (`Ž`). [1](https://en.wikipedia.org/wiki/Mercenary). Locate: 1: Introduction: soldier hired for personal reward.

## history-en-01

[History · 01](../src/content/history-en-01.json) — en, history, 28 entries.

Source JSON SHA-256: `0644cbacc82d41777cefc413ad5d96a5f2d1bfb4b710b5fdc6cc5b61b7b2634a`.

- `history-en-01-01` — **Ashoka** (`A`). [1](https://en.wikipedia.org/wiki/Ashoka). Locate: 1: Introduction: Ashoka, Kalinga and Buddhism.
- `history-en-01-02` — **Bastille** (`B`). [1](https://en.wikipedia.org/wiki/Storming_of_the_Bastille). Locate: 1: Introduction: 14 July 1789 fortress storming.
- `history-en-01-03` — **Carthage** (`C`). [1](https://en.wikipedia.org/wiki/Carthage). Locate: 1: Introduction; Ancient history: Punic rival of Rome.
- `history-en-01-04` — **Charlemagne** (`CH`). [1](https://en.wikipedia.org/wiki/Charlemagne). Locate: 1: Introduction; Imperial coronation: Christmas Day 800 and Leo III.
- `history-en-01-05` — **Domesday Book** (`D`). [1](https://en.wikipedia.org/wiki/Domesday_Book); [2](https://www.nationalarchives.gov.uk/education/teaching-resources/what-does-domesday-book-tell-us/). Locate: 1: Introduction: record of the 1086 survey, distinguishing survey from manuscript compilation · 2: Background information / Domesday survey: survey in 1086 and written record.
- `history-en-01-06` — **Edict of Milan** (`E`). [1](https://en.wikipedia.org/wiki/Edict_of_Milan). Locate: 1: Introduction: 313 agreement and Christian toleration.
- `history-en-01-07` — **Fall of Constantinople** (`F`). [1](https://en.wikipedia.org/wiki/Fall_of_Constantinople). Locate: 1: Introduction: Mehmed II’s capture of Constantinople on 29 May 1453.
- `history-en-01-08` — **Gallipoli** (`G`). [1](https://en.wikipedia.org/wiki/Gallipoli_campaign). Locate: 1: Introduction: Allied peninsula landings and Dardanelles campaign in 1915.
- `history-en-01-09` — **Hannibal** (`H`). [1](https://en.wikipedia.org/wiki/Hannibal). Locate: 1: Introduction; Overland journey to Italy: Hannibal’s crossing of the Alps in 218 BC.
- `history-en-01-10` — **Inca Empire** (`I`). [1](https://en.wikipedia.org/wiki/Inca_Empire). Locate: 1: Introduction: Andean empire and Cusco.
- `history-en-01-11` — **Joan of Arc** (`J`). [1](https://en.wikipedia.org/wiki/Joan_of_Arc). Locate: 1: Introduction; Trial and execution; Legacy: Rouen in 1431 and canonization in 1920.
- `history-en-01-12` — **Kublai Khan** (`K`). [1](https://en.wikipedia.org/wiki/Kublai_Khan). Locate: 1: Introduction; Emperor of the Yuan dynasty: founder and Marco Polo.
- `history-en-01-13` — **Louis XIV** (`L`). [1](https://en.wikipedia.org/wiki/Louis_XIV). Locate: 1: Introduction; Patronage of the arts: court transferred to Versailles in 1682.
- `history-en-01-14` — **Magna Carta** (`M`). [1](https://en.wikipedia.org/wiki/Magna_Carta). Locate: 1: Introduction: 1215 charter and John.
- `history-en-01-15` — **Norman Conquest** (`N`). [1](https://en.wikipedia.org/wiki/Norman_Conquest). Locate: 1: Introduction: 1066 conquest, not an assertion that the invasion began at Hastings.
- `history-en-01-16` — **Ottoman Empire** (`O`). [1](https://en.wikipedia.org/wiki/Ottoman_Empire). Locate: 1: Introduction; Defeat and dissolution: empire joining the Central Powers.
- `history-en-01-17` — **Peloponnesian War** (`P`). [1](https://en.wikipedia.org/wiki/Peloponnesian_War). Locate: 1: Introduction: Athens, Sparta and war from 431 to 404 BC.
- `history-en-01-18` — **Qin Shi Huang** (`Q`). [1](https://en.wikipedia.org/wiki/Qin_Shi_Huang). Locate: 1: Introduction; Terracotta Army: first emperor and funerary army.
- `history-en-01-19` — **Rosetta Stone** (`R`). [1](https://en.wikipedia.org/wiki/Rosetta_Stone). Locate: 1: Introduction: multilingual decree and decipherment.
- `history-en-01-20` — **Silk Road** (`S`). [1](https://en.wikipedia.org/wiki/Silk_Road). Locate: 1: Introduction: Eurasian trade network linking China with the west.
- `history-en-01-21` — **Shogun** (`SH`). [1](https://en.wikipedia.org/wiki/Shogun). Locate: 1: Introduction: hereditary military rulers of Japan.
- `history-en-01-22` — **Treaty of Versailles** (`T`). [1](https://en.wikipedia.org/wiki/Treaty_of_Versailles). Locate: 1: Introduction: 1919 treaty and most Allied powers.
- `history-en-01-23` — **U-boat** (`U`). [1](https://en.wikipedia.org/wiki/U-boat). Locate: 1: Introduction: English submarine term distinguished from its German source word.
- `history-en-01-24` — **Viking** (`V`). [1](https://en.wikipedia.org/wiki/Vikings). Locate: 1: Introduction; Viking Age: Scandinavian raids, trading and 793–1066 period.
- `history-en-01-25` — **Waterloo** (`W`). [1](https://en.wikipedia.org/wiki/Battle_of_Waterloo). Locate: 1: Introduction: 1815 final defeat of Napoleon.
- `history-en-01-26` — **Xerxes I** (`X`). [1](https://en.wikipedia.org/wiki/Xerxes_I). Locate: 1: Introduction: Persian king and 480 BC invasion.
- `history-en-01-27` — **Yorkists** (`Y`). [1](https://en.wikipedia.org/wiki/House_of_York). Locate: 1: Introduction: Yorkist supporters in Wars of the Roses.
- `history-en-01-28` — **Zimmermann Telegram** (`Z`). [1](https://en.wikipedia.org/wiki/Zimmermann_Telegram). Locate: 1: Introduction: 1917 German alliance proposal to Mexico.

## history-en-02

[History · 02](../src/content/history-en-02.json) — en, history, 28 entries.

Source JSON SHA-256: `4f08ba7d24e40f9733c1857e8731fbb8fb643aa7f12499a57042e9da8b02913b`.

- `history-en-02-01` — **Actium** (`A`). [1](https://en.wikipedia.org/wiki/Battle_of_Actium). Locate: 1: Introduction: Octavian’s fleet, Antony and Cleopatra at Actium in 31 BC.
- `history-en-02-02` — **Boudica** (`B`). [1](https://en.wikipedia.org/wiki/Boudica). Locate: 1: Introduction: Iceni queen’s rebellion around 60–61 AD.
- `history-en-02-03` — **Cuneiform** (`C`). [1](https://en.wikipedia.org/wiki/Cuneiform). Locate: 1: Introduction: wedge-shaped Mesopotamian writing on clay.
- `history-en-02-04` — **Chichen Itza** (`CH`). [1](https://en.wikipedia.org/wiki/Chichen_Itza). Locate: 1: Introduction; Site description / El Castillo: Maya site and pyramid.
- `history-en-02-05` — **Dreyfus affair** (`D`). [1](https://en.wikipedia.org/wiki/Dreyfus_affair). Locate: 1: Introduction: wrongful treason conviction in France in 1894.
- `history-en-02-06` — **Emancipation Proclamation** (`E`). [1](https://en.wikipedia.org/wiki/Emancipation_Proclamation). Locate: 1: Introduction: Lincoln’s order effective 1 January 1863, limited designated areas.
- `history-en-02-07` — **Franks** (`F`). [1](https://en.wikipedia.org/wiki/Franks). Locate: 1: Introduction: Merovingian and Carolingian rulers.
- `history-en-02-08` — **Great Fire of London** (`G`). [1](https://en.wikipedia.org/wiki/Great_Fire_of_London). Locate: 1: Introduction: Pudding Lane bakery and London fire in September 1666.
- `history-en-02-09` — **Hatshepsut** (`H`). [1](https://en.wikipedia.org/wiki/Hatshepsut). Locate: 1: Introduction; Building projects: Deir el-Bahari mortuary temple.
- `history-en-02-10` — **Indus Valley Civilisation** (`I`). [1](https://en.wikipedia.org/wiki/Indus_Valley_Civilisation). Locate: 1: Introduction: Harappa and Mohenjo-daro in the Bronze Age Indus civilization.
- `history-en-02-11` — **Jamestown** (`J`). [1](https://en.wikipedia.org/wiki/Jamestown,_Virginia). Locate: 1: Introduction: Jamestown, Virginia, in 1607 and permanent English settlement.
- `history-en-02-12` — **Korean War** (`K`). [1](https://en.wikipedia.org/wiki/Korean_War). Locate: 1: Introduction: peninsula war beginning in 1950.
- `history-en-02-13` — **Long March** (`L`). [1](https://en.wikipedia.org/wiki/Long_March). Locate: 1: Introduction: Chinese Communist strategic retreat in 1934–1935.
- `history-en-02-14` — **Meiji Restoration** (`M`). [1](https://en.wikipedia.org/wiki/Meiji_Restoration). Locate: 1: Introduction: 1868 restoration.
- `history-en-02-15` — **Nuremberg trials** (`N`). [1](https://en.wikipedia.org/wiki/Nuremberg_trials). Locate: 1: Introduction: trials starting in November 1945.
- `history-en-02-16` — **Opium Wars** (`O`). [1](https://en.wikipedia.org/wiki/Opium_Wars). Locate: 1: Introduction: Qing China’s wars of 1839–1842 and 1856–1860.
- `history-en-02-17` — **Peter the Great** (`P`). [1](https://en.wikipedia.org/wiki/Peter_the_Great). Locate: 1: Introduction; Great Northern War: Saint Petersburg founded in 1703.
- `history-en-02-18` — **Quipu** (`Q`). [1](https://en.wikipedia.org/wiki/Quipu). Locate: 1: Introduction: Andean knotted-cord records.
- `history-en-02-19` — **Reconquista** (`R`). [1](https://en.wikipedia.org/wiki/Reconquista). Locate: 1: Introduction: Christian territorial expansion in Iberia ending at Granada in 1492.
- `history-en-02-20` — **Suez Crisis** (`S`). [1](https://en.wikipedia.org/wiki/Suez_Crisis). Locate: 1: Introduction: canal nationalization and invasion of Egypt in 1956.
- `history-en-02-21` — **Sherman** (`SH`). [1](https://en.wikipedia.org/wiki/Sherman's_March_to_the_Sea). Locate: 1: Introduction: Sherman’s 1864 march from Atlanta to Savannah.
- `history-en-02-22` — **Thirty Years' War** (`T`). [1](https://en.wikipedia.org/wiki/Thirty_Years'_War). Locate: 1: Introduction: European war from 1618 to 1648 and Bohemian revolt.
- `history-en-02-23` — **Umayyad Caliphate** (`U`). [1](https://en.wikipedia.org/wiki/Umayyad_Caliphate). Locate: 1: Introduction: Damascus-based caliphate from 661 to 750.
- `history-en-02-24` — **Verdun** (`V`). [1](https://en.wikipedia.org/wiki/Battle_of_Verdun). Locate: 1: Introduction: Franco-German battle from February to December 1916.
- `history-en-02-25` — **Winter War** (`W`). [1](https://en.wikipedia.org/wiki/Winter_War). Locate: 1: Introduction: Soviet–Finnish war from November 1939 to March 1940.
- `history-en-02-26` — **Xinhai Revolution** (`X`). [1](https://en.wikipedia.org/wiki/1911_Revolution). Locate: 1: Introduction: 1911 Chinese revolution ending the Qing dynasty.
- `history-en-02-27` — **Yalta Conference** (`Y`). [1](https://en.wikipedia.org/wiki/Yalta_Conference). Locate: 1: Introduction: 1945 Allied conference.
- `history-en-02-28` — **Ziggurat** (`Z`). [1](https://en.wikipedia.org/wiki/Ziggurat). Locate: 1: Introduction: terraced Mesopotamian temple tower.

## politics-cs-01

[Politika a diplomacie · 01](../src/content/politics-cs-01.json) — cs, politics, 28 entries.

Source JSON SHA-256: `e470947133d7a39cab455f74a4fd61308f83e4ddd45b3717b1580e5e1e017a19`.

- `politics-cs-01-01` — **Amnestie** (`A`). [1](https://en.wikipedia.org/wiki/Amnesty). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-02` — **Bikameralismus** (`B`). [1](https://en.wikipedia.org/wiki/Bicameralism). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-03` — **Cenzura** (`C`). [1](https://en.wikipedia.org/wiki/Censorship). Locate: 1: Introduction: suppression of information by authority.
- `politics-cs-01-04` — **Červený kříž** (`Č`). [1](https://en.wikipedia.org/wiki/International_Committee_of_the_Red_Cross). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-05` — **Demokracie** (`D`). [1](https://en.wikipedia.org/wiki/Democracy). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-06` — **Embargo** (`E`). [1](https://en.wikipedia.org/wiki/Economic_sanctions). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-07` — **Federalismus** (`F`). [1](https://en.wikipedia.org/wiki/Federalism). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-08` — **Gerrymandering** (`G`). [1](https://en.wikipedia.org/wiki/Gerrymandering). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-09` — **Hlasování** (`H`). [1](https://en.wikipedia.org/wiki/Voting). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-10` — **Charta OSN** (`Ch`). [1](https://en.wikipedia.org/wiki/Charter_of_the_United_Nations). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-11` — **Imunita** (`I`). [1](https://en.wikipedia.org/wiki/Parliamentary_immunity); [2](https://www.psp.cz/docs/laws/constitution.html). Locate: 1: Introduction: legislative immunity; Czech rule corroborated by Constitution Article 27 · 2: Constitution Article 27: voting, speech and prosecution safeguards.
- `politics-cs-01-12` — **Jednokomorový parlament** (`J`). [1](https://en.wikipedia.org/wiki/Unicameralism); [2](https://www.psp.cz/docs/laws/constitution.html). Locate: 1: Introduction / definition and explanatory body · 2: Constitution Article 15(2): Czech Parliament’s two chambers.
- `politics-cs-01-13` — **Koalice** (`K`). [1](https://en.wikipedia.org/wiki/Coalition_government). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-14` — **Lobbying** (`L`). [1](https://en.wikipedia.org/wiki/Lobbying). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-15` — **Monarchie** (`M`). [1](https://en.wikipedia.org/wiki/Monarchy). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-16` — **Neutralita** (`N`). [1](https://en.wikipedia.org/wiki/Neutral_country). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-17` — **Ombudsman** (`O`). [1](https://www.ochrance.cz/o-nas/). Locate: 1: Opening definition: ombudsman is the Czech veřejný ochránce práv.
- `politics-cs-01-18` — **Poslanecká sněmovna** (`P`). [1](https://en.wikipedia.org/wiki/Chamber_of_Deputies_of_the_Czech_Republic); [2](https://www.psp.cz/docs/laws/constitution.html). Locate: 1: Introduction / composition: 200 members and four-year term · 2: Constitution Articles 15–16: two chambers and 200 deputies / four years.
- `politics-cs-01-19` — **Referendum** (`R`). [1](https://en.wikipedia.org/wiki/Referendum). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-20` — **Řád Bílého lva** (`Ř`). [1](https://en.wikipedia.org/wiki/Order_of_the_White_Lion). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-21` — **Senát** (`S`). [1](https://en.wikipedia.org/wiki/Senate_of_the_Czech_Republic); [2](https://www.psp.cz/docs/laws/constitution.html). Locate: 1: Introduction / composition: 81 members, six-year term, one third elected every two years · 2: Constitution Article 16(2): 81 senators / six years / renewal of thirds.
- `politics-cs-01-22` — **Švýcarská konfederace** (`Š`). [1](https://en.wikipedia.org/wiki/Switzerland). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-23` — **Teokracie** (`T`). [1](https://en.wikipedia.org/wiki/Theocracy). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-24` — **Unitární stát** (`U`). [1](https://cs.wikipedia.org/wiki/Unit%C3%A1rn%C3%AD_st%C3%A1t). Locate: 1: Introduction: undivided sovereignty and delegated territorial powers.
- `politics-cs-01-25` — **Veto** (`V`). [1](https://en.wikipedia.org/wiki/Veto). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-26` — **Westminsterský systém** (`W`). [1](https://en.wikipedia.org/wiki/Westminster_system). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-27` — **Zákonodárná moc** (`Z`). [1](https://en.wikipedia.org/wiki/Separation_of_powers). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-01-28` — **Ženevské úmluvy** (`Ž`). [1](https://en.wikipedia.org/wiki/Geneva_Conventions). Locate: 1: Introduction / definition and explanatory body.

## politics-cs-02

[Politika a diplomacie · 02](../src/content/politics-cs-02.json) — cs, politics, 28 entries.

Source JSON SHA-256: `6c4d0536a4cf31f18e30b664538789f805c633084bee01a5f3341cc0b9d9ca30`.

- `politics-cs-02-01` — **Agrément** (`A`). [1](https://en.wikipedia.org/wiki/Agr%C3%A9ment). Locate: 1: Introduction: receiving-state consent before diplomatic appointment.
- `politics-cs-02-02` — **Bílá kniha** (`B`). [1](https://en.wikipedia.org/wiki/White_paper). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-03` — **Císař** (`C`). [1](https://en.wikipedia.org/wiki/Emperor_of_Japan). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-04` — **Článek 5** (`Č`). [1](https://en.wikipedia.org/wiki/North_Atlantic_Treaty). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-05` — **Diplomacie** (`D`). [1](https://en.wikipedia.org/wiki/Diplomacy). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-06` — **Exekutiva** (`E`). [1](<https://en.wikipedia.org/wiki/Executive_(government)>). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-07` — **Filibuster** (`F`). [1](https://en.wikipedia.org/wiki/Filibuster). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-08` — **Generální tajemník OSN** (`G`). [1](https://en.wikipedia.org/wiki/Secretary-General_of_the_United_Nations). Locate: 1: Powers and duties; Appointment process: chief administrative officer, General Assembly and Security Council.
- `politics-cs-02-09` — **Hegemonie** (`H`). [1](https://en.wikipedia.org/wiki/Hegemony). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-10` — **Chargé d'affaires** (`Ch`). [1](https://en.wikipedia.org/wiki/Charg%C3%A9_d'affaires). Locate: 1: Types / En pied: accreditation to foreign minister rather than head of state.
- `politics-cs-02-11` — **Interpelace** (`I`). [1](<https://en.wikipedia.org/wiki/Interpellation_(politics)>); [2](https://www.psp.cz/docs/laws/constitution.html). Locate: 1: Introduction: legislative questioning of government · 2: Constitution Article 53: deputies’ right to question ministers.
- `politics-cs-02-12` — **Jurisdikce** (`J`). [1](https://en.wikipedia.org/wiki/Jurisdiction). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-13` — **Konzul** (`K`). [1](<https://en.wikipedia.org/wiki/Consul_(representative)>). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-14` — **Lustrace** (`L`). [1](https://en.wikipedia.org/wiki/Lustration). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-15` — **Mandát** (`M`). [1](<https://cs.wikipedia.org/wiki/Mand%C3%A1t_(politika)>). Locate: 1: Introduction: authority entrusted to an elected representative, not a perceived popular policy mandate.
- `politics-cs-02-16` — **Naturalizace** (`N`). [1](https://en.wikipedia.org/wiki/Naturalization). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-17` — **Opozice** (`O`). [1](<https://en.wikipedia.org/wiki/Opposition_(politics)>). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-18` — **Poměrný volební systém** (`P`). [1](https://en.wikipedia.org/wiki/Proportional_representation). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-19` — **Ratifikace** (`R`). [1](https://en.wikipedia.org/wiki/Ratification). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-20` — **Římský statut** (`Ř`). [1](https://en.wikipedia.org/wiki/Rome_Statute). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-21` — **Subsidiarita** (`S`). [1](https://en.wikipedia.org/wiki/Subsidiarity). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-22` — **Šaría** (`Š`). [1](https://en.wikipedia.org/wiki/Sharia). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-23` — **Tajné hlasování** (`T`). [1](https://en.wikipedia.org/wiki/Secret_ballot). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-24` — **Ultimátum** (`U`). [1](https://en.wikipedia.org/wiki/Ultimatum). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-25` — **Velvyslanec** (`V`). [1](https://en.wikipedia.org/wiki/Ambassador). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-26` — **Washingtonská smlouva** (`W`). [1](https://en.wikipedia.org/wiki/North_Atlantic_Treaty). Locate: 1: Introduction: Washington treaty establishing NATO in 1949.
- `politics-cs-02-27` — **Zelená kniha** (`Z`). [1](https://en.wikipedia.org/wiki/Green_paper). Locate: 1: Introduction / definition and explanatory body.
- `politics-cs-02-28` — **Ženevský protokol** (`Ž`). [1](https://en.wikipedia.org/wiki/Geneva_Protocol). Locate: 1: Introduction / definition and explanatory body.

## politics-en-01

[Politics and diplomacy · 01](../src/content/politics-en-01.json) — en, politics, 28 entries.

Source JSON SHA-256: `059dae88f8b76371ab60bb26931ceaa808527929f8c5ebced67bf51efde7bb7a`.

- `politics-en-01-01` — **Amnesty** (`A`). [1](https://en.wikipedia.org/wiki/Amnesty). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-02` — **Bicameralism** (`B`). [1](https://en.wikipedia.org/wiki/Bicameralism). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-03` — **Constitution** (`C`). [1](https://en.wikipedia.org/wiki/Constitution). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-04` — **Checks and balances** (`CH`). [1](https://en.wikipedia.org/wiki/Separation_of_powers). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-05` — **Diplomatic immunity** (`D`). [1](https://en.wikipedia.org/wiki/Diplomatic_immunity). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-06` — **Embargo** (`E`). [1](https://en.wikipedia.org/wiki/Economic_sanctions). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-07` — **Federalism** (`F`). [1](https://en.wikipedia.org/wiki/Federalism). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-08` — **Gerrymandering** (`G`). [1](https://en.wikipedia.org/wiki/Gerrymandering). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-09` — **Habeas corpus** (`H`). [1](https://en.wikipedia.org/wiki/Habeas_corpus). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-10` — **Impeachment** (`I`). [1](https://en.wikipedia.org/wiki/Impeachment). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-11` — **Judicial review** (`J`). [1](https://en.wikipedia.org/wiki/Judicial_review). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-12` — **Knesset** (`K`). [1](https://en.wikipedia.org/wiki/Knesset). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-13` — **Lobbying** (`L`). [1](https://en.wikipedia.org/wiki/Lobbying). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-14` — **Monarchy** (`M`). [1](https://en.wikipedia.org/wiki/Monarchy). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-15` — **Non-aligned Movement** (`N`). [1](https://en.wikipedia.org/wiki/Non-Aligned_Movement). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-16` — **Ombudsman** (`O`). [1](https://en.wikipedia.org/wiki/Ombudsman). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-17` — **Proportional representation** (`P`). [1](https://en.wikipedia.org/wiki/Proportional_representation). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-18` — **Quorum** (`Q`). [1](https://en.wikipedia.org/wiki/Quorum). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-19` — **Referendum** (`R`). [1](https://en.wikipedia.org/wiki/Referendum). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-20` — **Sovereignty** (`S`). [1](https://en.wikipedia.org/wiki/Sovereignty). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-21` — **Shadow cabinet** (`SH`). [1](https://en.wikipedia.org/wiki/Shadow_cabinet). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-22` — **Theocracy** (`T`). [1](https://en.wikipedia.org/wiki/Theocracy). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-23` — **Universal suffrage** (`U`). [1](https://en.wikipedia.org/wiki/Universal_suffrage). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-24` — **Veto** (`V`). [1](https://en.wikipedia.org/wiki/Veto). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-25` — **Westminster system** (`W`). [1](https://en.wikipedia.org/wiki/Westminster_system). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-26` — **Xenophobia** (`X`). [1](https://en.wikipedia.org/wiki/Xenophobia). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-27` — **Young Turks** (`Y`). [1](https://en.wikipedia.org/wiki/Young_Turks). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-01-28` — **Zionism** (`Z`). [1](https://en.wikipedia.org/wiki/Zionism). Locate: 1: Introduction / definition and explanatory body.

## politics-en-02

[Politics and diplomacy · 02](../src/content/politics-en-02.json) — en, politics, 28 entries.

Source JSON SHA-256: `9b6bc8fbb24d3c599f5f83a154ad6dc4c0fbffba40ff8a1a243a828ec80e0096`.

- `politics-en-02-01` — **Accession** (`A`). [1](https://treaties.un.org/Pages/Overview.aspx?path=overview/glossary/page1_en.xml). Locate: 1: Glossary / Accession: becoming party to a treaty negotiated and signed by other states.
- `politics-en-02-02` — **Bilateralism** (`B`). [1](https://en.wikipedia.org/wiki/Bilateralism). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-03` — **Coalition** (`C`). [1](https://en.wikipedia.org/wiki/Coalition_government). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-04` — **Chargé d'affaires** (`CH`). [1](https://en.wikipedia.org/wiki/Charg%C3%A9_d'affaires). Locate: 1: Types / En pied: accreditation to a foreign minister.
- `politics-en-02-05` — **Devolution** (`D`). [1](https://en.wikipedia.org/wiki/Devolution). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-06` — **Extradition** (`E`). [1](https://en.wikipedia.org/wiki/Extradition). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-07` — **Filibuster** (`F`). [1](https://en.wikipedia.org/wiki/Filibuster). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-08` — **Geneva Conventions** (`G`). [1](https://en.wikipedia.org/wiki/Geneva_Conventions). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-09` — **Hegemony** (`H`). [1](https://en.wikipedia.org/wiki/Hegemony). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-10` — **Intergovernmental organization** (`I`). [1](https://en.wikipedia.org/wiki/Intergovernmental_organization). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-11` — **Jurisdiction** (`J`). [1](https://en.wikipedia.org/wiki/Jurisdiction). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-12` — **Kleptocracy** (`K`). [1](https://en.wikipedia.org/wiki/Kleptocracy). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-13` — **Legislature** (`L`). [1](https://en.wikipedia.org/wiki/Legislature). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-14` — **Motion of no confidence** (`M`). [1](https://en.wikipedia.org/wiki/Motion_of_no_confidence). Locate: 1: Introduction: negative proposal, distinct vote and inverse confidence motion; continued legislative support.
- `politics-en-02-15` — **Naturalization** (`N`). [1](https://en.wikipedia.org/wiki/Naturalization). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-16` — **Oligarchy** (`O`). [1](https://en.wikipedia.org/wiki/Oligarchy). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-17` — **Persona non grata** (`P`). [1](https://en.wikipedia.org/wiki/Persona_non_grata). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-18` — **Qualified majority** (`Q`). [1](https://en.wikipedia.org/wiki/Voting_in_the_Council_of_the_European_Union). Locate: 1: Lisbon Treaty / Qualified majority voting: 55% of states, 65% of population and 2014 rule.
- `politics-en-02-19` — **Ratification** (`R`). [1](https://en.wikipedia.org/wiki/Ratification). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-20` — **Subsidiarity** (`S`). [1](https://en.wikipedia.org/wiki/Subsidiarity). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-21` — **Sharia** (`SH`). [1](https://en.wikipedia.org/wiki/Sharia). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-22` — **Treaty** (`T`). [1](https://en.wikipedia.org/wiki/Treaty). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-23` — **Ultimatum** (`U`). [1](https://en.wikipedia.org/wiki/Ultimatum). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-24` — **Vienna Convention on Diplomatic Relations** (`V`). [1](https://en.wikipedia.org/wiki/Vienna_Convention_on_Diplomatic_Relations). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-25` — **White paper** (`W`). [1](https://en.wikipedia.org/wiki/White_paper). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-26` — **Xi Jinping** (`X`). [1](https://en.wikipedia.org/wiki/Xi_Jinping). Locate: 1: Vice presidency (2008–2013): party leadership appointment on 15 November 2012.
- `politics-en-02-27` — **Young Ireland** (`Y`). [1](https://en.wikipedia.org/wiki/Young_Ireland). Locate: 1: Introduction / definition and explanatory body.
- `politics-en-02-28` — **Zoning** (`Z`). [1](https://en.wikipedia.org/wiki/Zoning). Locate: 1: Introduction / definition and explanatory body.

## science-cs-01

[Věda a technika · 01](../src/content/science-cs-01.json) — cs, science, 28 entries.

Source JSON SHA-256: `adfbadadc829b3730e6a44450c6a24cf71bc2b625acf9b5012994512475b857d`.

- `science-cs-01-01` — **Ampér** (`A`). [1](https://en.wikipedia.org/wiki/Ampere); [2](https://www.nist.gov/pml/owm/metric-si/si-units). Locate: 1: Introduction / definition and explanatory body · 2: Base and Derived Units: electric current / ampere (A).
- `science-cs-01-02` — **Barometr** (`B`). [1](https://en.wikipedia.org/wiki/Barometer). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-03` — **Celsius** (`C`). [1](https://en.wikipedia.org/wiki/Anders_Celsius). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-04` — **Čočka** (`Č`). [1](https://en.wikipedia.org/wiki/Lens). Locate: 1: Introduction; Types of simple lenses: curved surfaces and refraction.
- `science-cs-01-05` — **Difrakce** (`D`). [1](https://en.wikipedia.org/wiki/Diffraction). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-06` — **Elektron** (`E`). [1](https://en.wikipedia.org/wiki/Electron). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-07` — **Farad** (`F`). [1](https://en.wikipedia.org/wiki/Farad). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-08` — **Galvanometr** (`G`). [1](https://en.wikipedia.org/wiki/Galvanometer). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-09` — **Hertz** (`H`). [1](https://en.wikipedia.org/wiki/Hertz). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-10` — **Chrom** (`Ch`). [1](https://en.wikipedia.org/wiki/Chromium). Locate: 1: Introduction; Metallurgy: chromium in corrosion-resistant steel.
- `science-cs-01-11` — **Izotop** (`I`). [1](https://en.wikipedia.org/wiki/Isotope). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-12` — **Joule** (`J`). [1](https://en.wikipedia.org/wiki/Joule). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-13` — **Kondenzátor** (`K`). [1](https://en.wikipedia.org/wiki/Capacitor). Locate: 1: Introduction; Overview: electrical energy between insulated conductors.
- `science-cs-01-14` — **Laser** (`L`). [1](https://en.wikipedia.org/wiki/Laser). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-15` — **Mikroskop** (`M`). [1](https://en.wikipedia.org/wiki/Microscope). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-16` — **Newton** (`N`). [1](<https://en.wikipedia.org/wiki/Newton_(unit)>). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-17` — **Ohm** (`O`). [1](https://en.wikipedia.org/wiki/Ohm). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-18` — **Proton** (`P`). [1](https://en.wikipedia.org/wiki/Proton). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-19` — **Rezistor** (`R`). [1](https://en.wikipedia.org/wiki/Resistor). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-20` — **Řetězová reakce** (`Ř`). [1](https://en.wikipedia.org/wiki/Chain_reaction). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-21` — **Sublimace** (`S`). [1](<https://en.wikipedia.org/wiki/Sublimation_(phase_transition)>). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-22` — **Šroub** (`Š`). [1](<https://en.wikipedia.org/wiki/Screw_(simple_machine)>). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-23` — **Tranzistor** (`T`). [1](https://en.wikipedia.org/wiki/Transistor). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-24` — **Uran** (`U`). [1](https://en.wikipedia.org/wiki/Uranium). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-25` — **Volt** (`V`). [1](https://en.wikipedia.org/wiki/Volt). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-26` — **Wolfram** (`W`). [1](https://en.wikipedia.org/wiki/Tungsten). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-27` — **Zesilovač** (`Z`). [1](https://en.wikipedia.org/wiki/Amplifier). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-01-28` — **Žárovka** (`Ž`). [1](https://en.wikipedia.org/wiki/Incandescent_light_bulb). Locate: 1: Introduction / definition and explanatory body.

## science-cs-02

[Věda a technika · 02](../src/content/science-cs-02.json) — cs, science, 28 entries.

Source JSON SHA-256: `11118fb2b8f77bcb1245e0459277b1cf37a44cc50166bc9dcce6a3a4fb2e0475`.

- `science-cs-02-01` — **Anoda** (`A`). [1](https://en.wikipedia.org/wiki/Anode). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-02` — **Baterie** (`B`). [1](https://en.wikipedia.org/wiki/Electric_battery). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-03` — **Cyklotron** (`C`). [1](https://en.wikipedia.org/wiki/Cyclotron). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-04` — **Černé těleso** (`Č`). [1](https://en.wikipedia.org/wiki/Black_body). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-05` — **Dioda** (`D`). [1](https://en.wikipedia.org/wiki/Diode). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-06` — **Elektrolýza** (`E`). [1](https://en.wikipedia.org/wiki/Electrolysis). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-07` — **Fúze** (`F`). [1](https://en.wikipedia.org/wiki/Nuclear_fusion). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-08` — **Gyroskop** (`G`). [1](https://en.wikipedia.org/wiki/Gyroscope). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-09` — **Holografie** (`H`). [1](https://en.wikipedia.org/wiki/Holography). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-10` — **Chladič** (`Ch`). [1](https://en.wikipedia.org/wiki/Heat_sink). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-11` — **Indukčnost** (`I`). [1](https://en.wikipedia.org/wiki/Inductance). Locate: 1: Introduction: changing current, induced voltage and henry.
- `science-cs-02-12` — **Jádro atomu** (`J`). [1](https://en.wikipedia.org/wiki/Atomic_nucleus). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-13` — **Kelvin** (`K`). [1](https://en.wikipedia.org/wiki/Kelvin); [2](https://www.nist.gov/pml/owm/metric-si/si-units). Locate: 1: Introduction / definition and explanatory body · 2: Base and Derived Units: temperature / kelvin (K).
- `science-cs-02-14` — **Lití** (`L`). [1](https://en.wikipedia.org/wiki/Casting). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-15` — **Manometr** (`M`). [1](https://en.wikipedia.org/wiki/Pressure_measurement). Locate: 1: Hydrostatic: liquid-column height measures pressure difference.
- `science-cs-02-16` — **Napětí** (`N`). [1](https://en.wikipedia.org/wiki/Voltage). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-17` — **Osciloskop** (`O`). [1](https://en.wikipedia.org/wiki/Oscilloscope). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-18` — **Páka** (`P`). [1](https://en.wikipedia.org/wiki/Lever). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-19` — **Radar** (`R`). [1](https://en.wikipedia.org/wiki/Radar). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-20` — **Řemenice** (`Ř`). [1](https://cs.wikipedia.org/wiki/%C5%98emenice). Locate: 1: Introduction: shaft-mounted wheel transmitting motion with a belt.
- `science-cs-02-21` — **Supravodivost** (`S`). [1](https://en.wikipedia.org/wiki/Superconductivity). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-22` — **Štěpení jádra** (`Š`). [1](https://en.wikipedia.org/wiki/Nuclear_fission). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-23` — **Transformátor** (`T`). [1](https://en.wikipedia.org/wiki/Transformer). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-24` — **Ultrazvuk** (`U`). [1](https://en.wikipedia.org/wiki/Ultrasound). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-25` — **Vakuum** (`V`). [1](https://en.wikipedia.org/wiki/Vacuum). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-26` — **Wattmetr** (`W`). [1](https://en.wikipedia.org/wiki/Wattmeter). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-27` — **Zkrat** (`Z`). [1](https://en.wikipedia.org/wiki/Short_circuit). Locate: 1: Introduction / definition and explanatory body.
- `science-cs-02-28` — **Železobeton** (`Ž`). [1](https://en.wikipedia.org/wiki/Reinforced_concrete). Locate: 1: Introduction / definition and explanatory body.

## science-en-01

[Science and technology · 01](../src/content/science-en-01.json) — en, science, 28 entries.

Source JSON SHA-256: `0959ef5df3cac5bb0ebeb573356cee6174c43dee2c04f6f10f4c58b7e005e300`.

- `science-en-01-01` — **Ammeter** (`A`). [1](https://en.wikipedia.org/wiki/Ammeter). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-02` — **Buoyancy** (`B`). [1](https://en.wikipedia.org/wiki/Buoyancy). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-03` — **Capacitor** (`C`). [1](https://en.wikipedia.org/wiki/Capacitor). Locate: 1: Introduction; Overview: electrical energy between insulated conductors.
- `science-en-01-04` — **Chromatography** (`CH`). [1](https://en.wikipedia.org/wiki/Chromatography). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-05` — **Diode** (`D`). [1](https://en.wikipedia.org/wiki/Diode). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-06` — **Electron** (`E`). [1](https://en.wikipedia.org/wiki/Electron). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-07` — **Farad** (`F`). [1](https://en.wikipedia.org/wiki/Farad). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-08` — **Geiger counter** (`G`). [1](https://en.wikipedia.org/wiki/Geiger_counter). Locate: 1: Principle of operation: gas-filled tube and electrical pulses.
- `science-en-01-09` — **Hertz** (`H`). [1](https://en.wikipedia.org/wiki/Hertz). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-10` — **Isotope** (`I`). [1](https://en.wikipedia.org/wiki/Isotope). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-11` — **Joule** (`J`). [1](https://en.wikipedia.org/wiki/Joule). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-12` — **Kelvin** (`K`). [1](https://en.wikipedia.org/wiki/Kelvin); [2](https://www.nist.gov/pml/owm/metric-si/si-units). Locate: 1: Introduction / definition and explanatory body · 2: Base and Derived Units: temperature / kelvin (K).
- `science-en-01-13` — **Laser** (`L`). [1](https://en.wikipedia.org/wiki/Laser). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-14` — **Momentum** (`M`). [1](https://en.wikipedia.org/wiki/Momentum). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-15` — **Newton** (`N`). [1](<https://en.wikipedia.org/wiki/Newton_(unit)>). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-16` — **Ohm** (`O`). [1](https://en.wikipedia.org/wiki/Ohm). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-17` — **Proton** (`P`). [1](https://en.wikipedia.org/wiki/Proton). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-18` — **Quark** (`Q`). [1](https://en.wikipedia.org/wiki/Quark). Locate: 1: Introduction; Classification / properties table: three valence quarks in proton and neutron.
- `science-en-01-19` — **Radar** (`R`). [1](https://en.wikipedia.org/wiki/Radar). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-20` — **Superconductivity** (`S`). [1](https://en.wikipedia.org/wiki/Superconductivity). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-21` — **Shear stress** (`SH`). [1](https://en.wikipedia.org/wiki/Shear_stress). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-22` — **Transistor** (`T`). [1](https://en.wikipedia.org/wiki/Transistor). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-23` — **Ultrasound** (`U`). [1](https://en.wikipedia.org/wiki/Ultrasound). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-24` — **Volt** (`V`). [1](https://en.wikipedia.org/wiki/Volt). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-25` — **Wavelength** (`W`). [1](https://en.wikipedia.org/wiki/Wavelength). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-26` — **Xenon** (`X`). [1](https://en.wikipedia.org/wiki/Xenon). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-27` — **Yield strength** (`Y`). [1](<https://en.wikipedia.org/wiki/Yield_(engineering)>). Locate: 1: Introduction / definition and explanatory body.
- `science-en-01-28` — **Zener diode** (`Z`). [1](https://en.wikipedia.org/wiki/Zener_diode). Locate: 1: Introduction / definition and explanatory body.

## science-en-02

[Science and technology · 02](../src/content/science-en-02.json) — en, science, 28 entries.

Source JSON SHA-256: `1288863ac49c3ed7fd40bd4af0f48303d0ff4fc6aea499c4fe6cfa4da5aec16d`.

- `science-en-02-01` — **Alternating current** (`A`). [1](https://en.wikipedia.org/wiki/Alternating_current). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-02` — **Boyle's law** (`B`). [1](https://en.wikipedia.org/wiki/Boyle's_law). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-03` — **Cathode** (`C`). [1](https://en.wikipedia.org/wiki/Cathode). Locate: 1: In chemistry: reduction defines the cathode independently of polarity.
- `science-en-02-04` — **Chain reaction** (`CH`). [1](https://en.wikipedia.org/wiki/Chain_reaction). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-05` — **Diffraction** (`D`). [1](https://en.wikipedia.org/wiki/Diffraction). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-06` — **Electrolysis** (`E`). [1](https://en.wikipedia.org/wiki/Electrolysis). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-07` — **Fusion** (`F`). [1](https://en.wikipedia.org/wiki/Nuclear_fusion). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-08` — **Gyroscope** (`G`). [1](https://en.wikipedia.org/wiki/Gyroscope). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-09` — **Holography** (`H`). [1](https://en.wikipedia.org/wiki/Holography). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-10` — **Inductor** (`I`). [1](https://en.wikipedia.org/wiki/Inductor). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-11` — **Josephson effect** (`J`). [1](https://en.wikipedia.org/wiki/Josephson_effect). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-12` — **Kinetic energy** (`K`). [1](https://en.wikipedia.org/wiki/Kinetic_energy). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-13` — **Lever** (`L`). [1](https://en.wikipedia.org/wiki/Lever). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-14` — **Manometer** (`M`). [1](https://en.wikipedia.org/wiki/Pressure_measurement). Locate: 1: Hydrostatic: U-tube and height difference.
- `science-en-02-15` — **Neutrino** (`N`). [1](https://en.wikipedia.org/wiki/Neutrino). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-16` — **Oscilloscope** (`O`). [1](https://en.wikipedia.org/wiki/Oscilloscope). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-17` — **Pascal** (`P`). [1](<https://en.wikipedia.org/wiki/Pascal_(unit)>). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-18` — **Quantum entanglement** (`Q`). [1](https://en.wikipedia.org/wiki/Quantum_entanglement). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-19` — **Refraction** (`R`). [1](https://en.wikipedia.org/wiki/Refraction). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-20` — **Sublimation** (`S`). [1](<https://en.wikipedia.org/wiki/Sublimation_(phase_transition)>). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-21` — **Shock wave** (`SH`). [1](https://en.wikipedia.org/wiki/Shock_wave). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-22` — **Transformer** (`T`). [1](https://en.wikipedia.org/wiki/Transformer). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-23` — **Ultraviolet** (`U`). [1](https://en.wikipedia.org/wiki/Ultraviolet). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-24` — **Vacuum** (`V`). [1](https://en.wikipedia.org/wiki/Vacuum). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-25` — **Wheatstone bridge** (`W`). [1](https://en.wikipedia.org/wiki/Wheatstone_bridge). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-26` — **X-ray diffraction** (`X`). [1](https://en.wikipedia.org/wiki/X-ray_crystallography). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-27` — **Young's modulus** (`Y`). [1](https://en.wikipedia.org/wiki/Young's_modulus). Locate: 1: Introduction / definition and explanatory body.
- `science-en-02-28` — **Zirconium** (`Z`). [1](https://en.wikipedia.org/wiki/Zirconium); [2](https://periodic-table.rsc.org/element/40/zirconium). Locate: 1: Introduction; Separation of zirconium and hafnium: symbol, cladding and low neutron absorption · 2: Chemistry in its element transcript: reactor use, fuel cladding and neutron absorption.
