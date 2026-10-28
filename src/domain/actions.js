import { requireValue } from './errors.js';
import {
  cellId,
  choice,
  integer,
  list,
  owner,
  player,
  record,
  text,
} from './validation.js';

/** @param {unknown} value @returns {import('./types.js').Action} */
export function validateAction(value) {
  const data = record(value, 'action');
  const sessionId = text(data.sessionId, 'action.sessionId');
  const revision = integer(data.revision, 'action.revision');
  const type = choice(
    data.type,
    /** @type {const} */ ([
      'select',
      'answer',
      'judge',
      'give-up',
      'tick',
      'interrupt',
      'restart',
      'press',
      'set-cell',
      'set-chooser',
    ]),
    'action.type',
  );
  return { ...actionBody(type, data), sessionId, revision };
}

/** @param {import('./types.js').ActionBody['type']} type
 * @param {Record<string, unknown>} data
 * @returns {import('./types.js').ActionBody} */
function actionBody(type, data) {
  switch (type) {
    case 'select':
      return { type, cell: cellId(data.cell, 'action.cell') };
    case 'answer':
      requireValue(typeof data.text === 'string', 'invalidText', 'action.text');
      return {
        type,
        player: player(data.player, 'action.player'),
        text: data.text,
      };
    case 'judge':
      requireValue(
        typeof data.correct === 'boolean',
        'invalidChoice',
        'action.correct',
      );
      return { type, correct: data.correct };
    case 'press':
      return { type, players: validatePresses(data.players) };
    case 'set-cell':
      return {
        type,
        cell: cellId(data.cell, 'action.cell'),
        owner: owner(data.owner, 'action.owner'),
      };
    case 'set-chooser':
      return { type, player: player(data.player, 'action.player') };
    default:
      return { type };
  }
}

/** @param {unknown} value */
function validatePresses(value) {
  const players = list(value, 'action.players').map((item) =>
    player(item, 'action.players'),
  );
  requireValue(
    players.length >= 1 &&
      players.length <= 2 &&
      new Set(players).size === players.length,
    'invalidPress',
    'action.players',
  );
  return players;
}
