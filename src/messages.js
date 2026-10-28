/** @type {Record<string, {en: string, cs: string}>} */
const messages = {
  foundation: {
    en: 'Domain foundation only. The playable game is coming in a later phase.',
    cs: 'Pouze základ herní logiky. Hratelná hra vznikne v další fázi.',
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
