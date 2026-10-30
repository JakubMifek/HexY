import { button, element, field, select } from './dom.js';

/** @param {import('../domain/types.js').Game} state @param {import('./strings.js').Texts} t
 * @param {(action: import('../domain/types.js').ActionBody) => void} send @param {AbortSignal} signal */
export function hostView(state, t, send, signal) {
  const section = element('section', '', {
    class: 'host panel',
    'aria-label': t.host,
  });
  section.append(element('h2', t.host));
  if (state.stage.phase === 'question' || state.stage.phase === 'opponent') {
    section.append(
      button(
        t.correct,
        'judge-correct',
        () => send({ type: 'judge', correct: true }),
        signal,
      ),
      button(
        t.wrong,
        'judge-wrong',
        () => send({ type: 'judge', correct: false }),
        signal,
      ),
    );
    return section;
  }
  if (state.stage.phase !== 'selecting' && state.stage.phase !== 'won') {
    section.append(element('p', t.hostUnavailable));
    return section;
  }
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
  section.append(cells);
  return section;
}

/** @param {string} value @returns {import('../domain/types.js').Owner} */
function readOwner(value) {
  if (value === 'A' || value === 'B' || value === 'black') return value;
  return 'unclaimed';
}
