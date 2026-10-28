export const EDGE_LENGTH = 7;
export const CELL_COUNT = 28;

export const BOARD = Object.freeze(
  Array.from({ length: EDGE_LENGTH }, (_, row) =>
    Array.from({ length: row + 1 }, (_, column) =>
      Object.freeze({
        id: (row * (row + 1)) / 2 + column + 1,
        row,
        column,
        x: Math.sqrt(3) * (column - row / 2),
        y: row * 1.5,
        edges: Object.freeze([
          ...(column === 0 ? ['left'] : []),
          ...(column === row ? ['right'] : []),
          ...(row === EDGE_LENGTH - 1 ? ['bottom'] : []),
        ]),
      }),
    ),
  ).flat(),
);

/** @param {number} cell */
export function neighbors(cell) {
  const origin = BOARD[cell - 1];
  if (!origin) return [];
  return BOARD.filter(({ row, column }) => {
    const dr = row - origin.row;
    const dc = column - origin.column;
    return (
      (dr === 0 && Math.abs(dc) === 1) ||
      (dr === -1 && (dc === -1 || dc === 0)) ||
      (dr === 1 && (dc === 0 || dc === 1))
    );
  }).map(({ id }) => id);
}

/** @param {import('./types.js').Owner[]} cells
 * @param {import('./types.js').Player} player */
export function winningGroup(cells, player) {
  const visited = new Set();
  for (const cell of BOARD) {
    if (visited.has(cell.id) || cells[cell.id - 1] !== player) continue;
    const group = connectedGroup(cells, player, cell.id, visited);
    const edges = new Set(group.flatMap((id) => BOARD[id - 1].edges));
    if (edges.size === 3) return group.sort((a, b) => a - b);
  }
  return [];
}

/** @param {import('./types.js').Owner[]} cells
 * @param {import('./types.js').Player} player @param {number} start
 * @param {Set<number>} visited */
function connectedGroup(cells, player, start, visited) {
  const group = [];
  const pending = [start];
  while (pending.length) {
    const id = pending.pop();
    if (id === undefined || visited.has(id)) continue;
    visited.add(id);
    group.push(id);
    pending.push(...neighbors(id).filter((next) => cells[next - 1] === player));
  }
  return group;
}
