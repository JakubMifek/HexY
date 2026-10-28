/**
 * @typedef {'cs'|'en'} Language
 * @typedef {'A'|'B'} Player
 * @typedef {'unclaimed'|'black'|Player} Owner
 * @typedef {'source'|'letters'|'numbers'} PackMode
 * @typedef {{
 * id: string, text: string, initial: string, answer: string,
 * aliases: string[], category: string, language: Language, sources: string[]
 * }} Question
 * @typedef {{
 * schemaVersion: 1, id: string, title: string, language: Language,
 * mode: PackMode, authors: string[], license: string, questions: Question[]
 * }} Pack
 * @typedef {{previewMs: number, symbolMs: number, length: number, symbols: string[]}} DuelConfig
 * @typedef {{
 * answerMode: 'hosted'|'automatic', timeLimitMs: number,
 * starter: Player, duel: DuelConfig
 * }} GameConfig
 * @typedef {{cell: number, originalChooser: Player}} Round
 * @typedef {Round & {startedAt: number, deadline: number}} QuestionRound
 * @typedef {Round & {
 * target: string, sequence: string[], startsAt: number
 * }} DuelRound
 * @typedef {{phase: 'selecting'} |
 * {phase: 'question'|'opponent', round: QuestionRound} |
 * {phase: 'duel-preview'|'duel-active', round: DuelRound} |
 * {phase: 'duel-interrupted', round: Round} |
 * {phase: 'won', winner: Player, winningCells: number[]}} Stage
 * @typedef {{
 * schemaVersion: 1, sessionId: string, pack: Pack, config: GameConfig, cells: Owner[],
 * chooser: Player, revision: number, lastNow: number, stage: Stage
 * }} Game
 * @typedef {{
 * type: 'select', cell: number
 * } | {type: 'answer', player: Player, text: string}
 * | {type: 'judge', correct: boolean}
 * | {type: 'give-up'|'tick'|'interrupt'|'restart'}
 * | {type: 'press', players: Player[]}
 * | {type: 'set-cell', cell: number, owner: Owner}
 * | {type: 'set-chooser', player: Player}} ActionBody
 * @typedef {ActionBody & {sessionId: string, revision: number}} Action
 * @typedef {{now: number, random: () => number}} Environment
 * @typedef {{state: Game, outcome: 'applied'|'ignored', reason?: string}} Transition
 */
export {};
