import { BOARD } from '../domain/board.js';
import { svg } from './dom.js';

const HEX = '0,-28 24.25,-14 24.25,14 0,28 -24.25,14 -24.25,-14';

/** @param {import('../domain/types.js').Game} state
 * @param {import('./setup.js').Setup} settings @param {import('./strings.js').Texts} t
 * @param {(cell: number) => void} choose @param {AbortSignal} signal @param {number} [flipCell] */
export function boardView(state, settings, t, choose, signal, flipCell) {
  const board = svg('svg', {
    viewBox: '-190 -36 380 354',
    role: 'group',
    'aria-label': t.board,
    class: 'board',
  });
  board.append(boardDefs());
  for (const cell of BOARD) {
    const group = cellView(state, settings, t, cell, flipCell);
    wireCell(
      group,
      cell.id,
      group.getAttribute('aria-disabled') === 'false',
      choose,
      signal,
    );
    board.append(group);
  }
  board.addEventListener('keydown', (event) => moveFocus(event, board), {
    signal,
  });
  return board;
}

/** @param {import('../domain/types.js').Game} state
 * @param {import('./setup.js').Setup} settings @param {import('./strings.js').Texts} t
 * @param {typeof BOARD[number]} cell @param {number | undefined} flipCell */
function cellView(state, settings, t, cell, flipCell) {
  const owner = state.cells[cell.id - 1];
  const owned = owner === 'A' || owner === 'B';
  const { label, initial } = tileLabels(state, cell.id);
  const available = !owned && state.stage.phase === 'selecting';
  const group = svg('g', {
    transform: `translate(${cell.x * 29},${cell.y * 29})`,
    id: `cell-${cell.id}`,
    role: 'button',
    tabindex: available ? '0' : '-1',
    'aria-disabled': String(!available),
    'aria-label': `${t.cell} ${cell.id} · ${cellDescription(owner, initial ?? label, settings, t)}`,
    class: `cell ${owner}${isWinning(state, cell.id) ? ' winning' : ''}`,
    'data-owner': owner,
  });
  const fill = owned ? settings.players[owner].color : `var(--cell-${owner})`;
  group.append(
    tileFace(fill, owned ? null : label, initial, flipCell === cell.id),
  );
  return group;
}

/** @param {import('../domain/types.js').Game} state @param {number} id */
function tileLabels(state, id) {
  const question = state.pack.questions[id - 1];
  const label = state.pack.mode === 'letters' ? question.initial : String(id);
  const stage = state.stage;
  const selected =
    (stage.phase === 'question' || stage.phase === 'opponent') &&
    stage.round.cell === id;
  return { label, initial: selected ? question.initial : null };
}

/** @param {string} fill @param {string | null} label @param {string | null} initial @param {boolean} flip */
function tileFace(fill, label, initial, flip) {
  const flipping = flip && initial !== null;
  const face = svg('g', {
    class: `tile-face${flipping ? ' flipping' : ''}`,
    'aria-hidden': 'true',
  });
  face.append(
    svg('polygon', { points: HEX, fill, class: 'hex-base' }),
    svg('polygon', { points: HEX, fill: 'url(#gloss)', class: 'hex-gloss' }),
    svg('path', { d: 'M-22,-13 L0,-26 L22,-13', class: 'bevel' }),
  );
  if (label !== null)
    face.append(
      svg(
        'text',
        {
          y: initial === null ? '7' : '9',
          'text-anchor': 'middle',
          class: `cell-label${initial === null ? '' : ' revealed-initial'}`,
        },
        initial ?? label,
      ),
    );
  if (flipping)
    face.append(
      svg(
        'text',
        { y: '7', 'text-anchor': 'middle', class: 'tile-before' },
        label ?? '',
      ),
    );
  return face;
}

function boardDefs() {
  const defs = svg('defs', {});
  const gradient = svg('linearGradient', {
    id: 'gloss',
    x1: '0',
    y1: '0',
    x2: '0.25',
    y2: '1',
  });
  for (const [offset, color, opacity] of [
    ['0', 'white', '.75'],
    ['.48', 'white', '.08'],
    ['.5', 'black', '.04'],
    ['1', 'black', '.3'],
  ]) {
    gradient.append(
      svg('stop', { offset, 'stop-color': color, 'stop-opacity': opacity }),
    );
  }

  defs.append(gradient);
  return defs;
}

/** @param {import('../domain/types.js').Owner} owner @param {string} label
 * @param {import('./setup.js').Setup} settings @param {import('./strings.js').Texts} t */
function cellDescription(owner, label, settings, t) {
  if (owner === 'A' || owner === 'B')
    return `${t.owner} ${owner} · ${settings.players[owner].name}`;
  return `${label} · ${t[owner]}`;
}

/** @param {import('../domain/types.js').Game} state @param {number} cell */
function isWinning(state, cell) {
  return state.stage.phase === 'won' && state.stage.winningCells.includes(cell);
}

/** @param {SVGElement} group @param {number} id @param {boolean} available
 * @param {(cell: number) => void} choose @param {AbortSignal} signal */
function wireCell(group, id, available, choose, signal) {
  group.addEventListener(
    'click',
    () => {
      if (available) choose(id);
    },
    { signal },
  );
  group.addEventListener(
    'keydown',
    (event) => {
      if (!boardKeyboardAvailable()) return;
      if (
        available &&
        !event.repeat &&
        (event.key === 'Enter' || event.key === ' ')
      ) {
        event.preventDefault();
        choose(id);
      }
    },
    { signal },
  );
}

/** @param {KeyboardEvent} event @param {SVGElement} board */
function moveFocus(event, board) {
  if (!boardKeyboardAvailable()) return;
  const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
    event.key
  ];
  if (!delta) return;
  event.preventDefault();
  moveBoardSelection(board, delta);
}

/** @param {SVGElement} board @param {number} delta */
export function moveBoardSelection(board, delta) {
  const cells = Array.from(board.querySelectorAll('[tabindex="0"]'));
  if (!cells.length) return;
  const index = document.activeElement
    ? cells.indexOf(document.activeElement)
    : -1;
  const next =
    cells[index < 0 ? 0 : (index + delta + cells.length) % cells.length];
  if (next instanceof SVGElement) next.focus();
}

function boardKeyboardAvailable() {
  return (
    !document.hidden &&
    document.hasFocus() &&
    !document.querySelector('dialog[open]')
  );
}
