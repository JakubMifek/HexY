import { button, element, field, select } from './dom.js';

/** @param {import('../domain/types.js').Game} state @param {import('./strings.js').Texts} t
 * @param {(action: import('../domain/types.js').ActionBody) => void} send @param {AbortSignal} signal */
export function hostView(state, t, send, signal) {
  const section = element('section', '', {
    class: 'host panel',
    'aria-label': t.host,
  });
  section.append(element('h2', t.host));
  if (state.stage.phase !== 'selecting' && state.stage.phase !== 'won') {
    section.append(element('p', t.hostUnavailable));
    return section;
  }
  section.append(element('p', t.hostHelp, { class: 'muted' }));
  const cell = select(
    'host-cell',
    Array.from({ length: 28 }, (_, i) => [String(i + 1), String(i + 1)]),
  );
  const owner = select('host-owner', [
    ['unclaimed', t.unclaimed],
    ['A', t.playerA],
    ['B', t.playerB],
    ['black', t.black],
  ]);
  const cells = element('div', '', { class: 'controls' });
  cells.append(
    field(t.cell, cell),
    field(t.state, owner),
    button(
      t.setCell,
      'set-cell',
      () =>
        send({
          type: 'set-cell',
          cell: Number(cell.value),
          owner: readOwner(owner.value),
        }),
      signal,
    ),
  );
  section.append(cells, chooserControls(state.chooser, t, send, signal));
  return section;
}

/** @param {import('../domain/types.js').Player} player @param {import('./strings.js').Texts} t
 * @param {(action: import('../domain/types.js').ActionBody) => void} send @param {AbortSignal} signal */
function chooserControls(player, t, send, signal) {
  const chooser = select(
    'host-chooser',
    [
      ['A', t.playerA],
      ['B', t.playerB],
    ],
    player,
  );
  const turns = element('div', '', { class: 'controls' });
  turns.append(
    field(t.chooser, chooser),
    button(
      t.setChooser,
      'set-chooser',
      () =>
        send({
          type: 'set-chooser',
          player: chooser.value === 'A' ? 'A' : 'B',
        }),
      signal,
    ),
  );
  return turns;
}

/** @param {string} value @returns {import('../domain/types.js').Owner} */
function readOwner(value) {
  if (value === 'A' || value === 'B' || value === 'black') return value;
  return 'unclaimed';
}
