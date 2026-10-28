/** @type {Record<string, {en: string, cs: string}>} */
const messages = {
  selectSources: {
    en: 'Select at least one source pack before generating.',
    cs: 'Před generováním vyberte alespoň jednu zdrojovou sadu.',
  },
  mixedSources: {
    en: 'Select only packs in the chosen question language. No other sources were added.',
    cs: 'Vyberte jen sady ve zvoleném jazyce otázek. Žádné další zdroje nebyly přidány.',
  },
  insufficientQuestions: {
    en: 'The selected sources contain fewer than 28 distinct questions. Select additional same-language packs.',
    cs: 'Vybrané zdroje obsahují méně než 28 různých otázek. Vyberte další sady ve stejném jazyce.',
  },
  conflictingQuestionId: {
    en: 'Selected packs reuse a question ID for different content. Select only one version or give distinct imported questions distinct IDs.',
    cs: 'Vybrané sady používají stejné ID otázky pro různý obsah. Vyberte jen jednu verzi nebo odlišným importovaným otázkám přiřaďte různá ID.',
  },
  repeatedQuestion: {
    en: 'This board repeats question text. Replace repeated questions before accepting.',
    cs: 'Na desce se opakuje znění otázky. Před přijetím nahraďte opakující se otázky.',
  },
  packIdConflict: {
    en: 'A different pack already uses this ID. Keep the existing pack; change the incoming/custom pack ID and retry.',
    cs: 'Toto ID již používá jiná sada. Zachovejte původní sadu; změňte ID importované nebo vlastní sady a zkuste to znovu.',
  },
  selectFixed: {
    en: 'Select exactly one fixed-letter pack. Source banks and number boards cannot supply fixed placement.',
    cs: 'Vyberte právě jednu pevnou písmennou sadu. Zdrojové ani číselné sady nemají pevné umístění.',
  },
  selectNumbers: {
    en: 'Select exactly one prepared number pack to preserve its order, or generate a new board from sources.',
    cs: 'Pro zachování pořadí vyberte právě jednu připravenou číselnou sadu, nebo ze zdrojů vygenerujte novou desku.',
  },
  preparationMismatch: {
    en: 'The prepared board must match the selected board mode and question language.',
    cs: 'Připravená deska musí odpovídat zvolenému režimu a jazyku otázek.',
  },
  acceptPreparation: {
    en: 'Prepare a board, save any editor changes, and accept the final proposal before starting.',
    cs: 'Připravte desku, uložte úpravy v editoru a před spuštěním přijměte finální návrh.',
  },
  contentLocked: {
    en: 'This game’s content is locked. Start a new game to prepare different content.',
    cs: 'Obsah této hry je uzamčený. Jiný obsah připravíte až pro novou hru.',
  },
  libraryVersion: {
    en: 'Unsupported local library version. Stored data was not overwritten. Export in-memory packs; use a compatible app to recover the original data.',
    cs: 'Nepodporovaná verze místní knihovny. Uložená data nebyla přepsána. Exportujte sady z paměti; původní data obnovte kompatibilní aplikací.',
  },
  storageCorrupt: {
    en: 'The local library is invalid and was not overwritten. Export in-memory packs. Preserve the original browser data before repairing it or clearing this site’s storage.',
    cs: 'Místní knihovna je neplatná a nebyla přepsána. Exportujte sady z paměti. Před opravou nebo smazáním úložiště webu zachovejte původní data prohlížeče.',
  },
  storageUnavailable: {
    en: 'Browser storage is unavailable. Your current game and packs remain in memory. Allow site storage, then retry an edit or export JSON as a backup.',
    cs: 'Úložiště prohlížeče není dostupné. Aktuální hra a sady zůstávají v paměti. Povolte úložiště webu a zopakujte úpravu nebo zálohujte exportem JSON.',
  },
  storageReadUnavailable: {
    en: 'Browser storage could not be read. Saving is blocked to protect unread data. Export your in-memory packs first, allow site storage, reload, then reimport your exports. Retrying edits without reloading cannot save.',
    cs: 'Úložiště prohlížeče nelze přečíst. Ukládání je zablokované kvůli ochraně nepřečtených dat. Nejdříve exportujte sady z paměti, povolte úložiště webu, obnovte stránku a znovu importujte exportované soubory. Opakování úprav bez obnovení stránky nemůže data uložit.',
  },
  storageBlocked: {
    en: 'Local saving is blocked after a library read failure. Original data is untouched. Export your packs and reload after resolving the storage problem.',
    cs: 'Místní ukládání je po chybě čtení zablokované. Původní data zůstávají nedotčená. Exportujte sady a po vyřešení problému obnovte stránku.',
  },
  storageQuota: {
    en: 'Browser storage is full. Export large custom copies, then confirm “Exclude from local saving” below to retry saving a smaller library. Excluded copies remain exportable in memory until reload. Do not clear site storage to fix an oversized pack.',
    cs: 'Úložiště prohlížeče je plné. Exportujte velké vlastní kopie a níže potvrďte „Vynechat z místního ukládání“; tím zkusíte uložit menší knihovnu. Vynechané kopie lze až do obnovení stránky exportovat z paměti. Kvůli příliš velké sadě nemažte úložiště webu.',
  },
  fileRead: {
    en: 'The file could not be read. Select a readable local JSON file and retry; previous packs are unchanged.',
    cs: 'Soubor nelze přečíst. Vyberte dostupný místní soubor JSON a zkuste to znovu; původní sady se nezměnily.',
  },
  exportFailed: {
    en: 'Download could not be created. Allow downloads and try again. Your pack is still in memory.',
    cs: 'Stažený soubor nelze vytvořit. Povolte stahování a zkuste to znovu. Sada zůstává v paměti.',
  },
  invalidObject: {
    en: 'Expected a JSON object.',
    cs: 'Je vyžadován objekt JSON.',
  },
  invalidText: { en: 'Enter non-empty text.', cs: 'Zadejte neprázdný text.' },
  invalidList: { en: 'Expected a JSON array.', cs: 'Je vyžadováno pole JSON.' },
  invalidNumber: {
    en: 'Use a safe whole number in the allowed range.',
    cs: 'Použijte bezpečné celé číslo v povoleném rozsahu.',
  },
  invalidChoice: {
    en: 'Choose a supported value.',
    cs: 'Vyberte podporovanou hodnotu.',
  },
  invalidCell: {
    en: 'Choose a cell from 1 to 28.',
    cs: 'Vyberte pole od 1 do 28.',
  },
  answerInitial: {
    en: 'The canonical answer must start with its explicit board prefix, including diacritics.',
    cs: 'Hlavní odpověď musí začínat uvedeným označením pole včetně diakritiky.',
  },
  missingProvenance: {
    en: 'Supply authorship and a factual source or provenance note.',
    cs: 'Doplňte autorství a věcný zdroj nebo údaj o původu.',
  },
  packVersion: {
    en: 'Unsupported pack version. Import a version 1 pack.',
    cs: 'Nepodporovaná verze sady. Importujte sadu verze 1.',
  },
  saveVersion: {
    en: 'Unsupported save version. Keep the original file; it cannot be restored by this version.',
    cs: 'Nepodporovaná verze uložené hry. Zachovejte původní soubor; tato verze jej neumí obnovit.',
  },
  emptyPack: {
    en: 'Add at least one question.',
    cs: 'Přidejte alespoň jednu otázku.',
  },
  duplicateQuestion: {
    en: 'Give every question a unique ID.',
    cs: 'Každá otázka musí mít jedinečné ID.',
  },
  mixedLanguage: {
    en: 'All questions must use the pack language.',
    cs: 'Všechny otázky musí být v jazyce sady.',
  },
  boardCount: {
    en: 'A prepared board needs exactly 28 questions or cells.',
    cs: 'Připravená deska musí obsahovat přesně 28 otázek nebo polí.',
  },
  letterPlacement: {
    en: 'Use the fixed 28 prefixes in row-major order.',
    cs: 'Použijte pevných 28 označení v pořadí po řádcích.',
  },
  invalidJson: {
    en: 'Invalid JSON. Check the file syntax before importing.',
    cs: 'Neplatný JSON. Před importem zkontrolujte syntaxi souboru.',
  },
  duelSymbols: {
    en: 'Provide at least two distinct duel symbols.',
    cs: 'Zadejte alespoň dva různé symboly rozstřelu.',
  },
  randomRange: {
    en: 'The random source must return a finite value from 0 inclusive to 1 exclusive.',
    cs: 'Zdroj náhody musí vracet konečné číslo od 0 včetně do 1 vyjma.',
  },
  invalidPress: {
    en: 'Submit one player press or one simultaneous press per player.',
    cs: 'Předejte jeden stisk hráče nebo jeden současný stisk za každého hráče.',
  },
  clockBackwards: {
    en: 'The clock moved backwards. Restore a consistent clock before continuing; no extra answer time was granted.',
    cs: 'Hodiny se posunuly zpět. Před pokračováním obnovte správný čas; čas na odpověď nebyl prodloužen.',
  },
  correctionUnavailable: {
    en: 'Host edits are available only when choosing the next field or after a win.',
    cs: 'Úpravy hostitele jsou dostupné pouze při výběru dalšího pole nebo po vítězství.',
  },
  invalidVictory: {
    en: 'The saved winner does not match the connected board. Keep the original save.',
    cs: 'Uložený vítěz neodpovídá propojení desky. Zachovejte původní soubor.',
  },
  invalidRound: {
    en: 'The saved round conflicts with the board or chooser. Keep the original save.',
    cs: 'Uložené kolo neodpovídá desce nebo hráči na tahu. Zachovejte původní soubor.',
  },
  invalidDeadline: {
    en: 'The saved deadline is inconsistent. Keep the original save; do not reset its timer.',
    cs: 'Uložený časový limit je nekonzistentní. Zachovejte původní soubor a neresetujte časovač.',
  },
  invalidDuel: {
    en: 'The saved duel sequence or timing is invalid. Keep the original save.',
    cs: 'Uložená posloupnost nebo časování rozstřelu jsou neplatné. Zachovejte původní soubor.',
  },
  sessionReused: {
    en: 'Create a new session identifier for recovery so old input cannot change the restored game.',
    cs: 'Pro obnovu vytvořte nové ID relace, aby staré vstupy nemohly změnit obnovenou hru.',
  },
  duelLength: {
    en: 'Use at most 1,000 symbols per duel sequence.',
    cs: 'Použijte nejvýše 1 000 symbolů v posloupnosti rozstřelu.',
  },
};

/** @param {import('./domain/types.js').Language} language @param {string} code */
export function message(language, code) {
  const entry = messages[code];
  if (!entry) throw new Error(`Unknown localization code: ${code}`);
  return entry[language];
}
