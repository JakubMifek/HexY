import { expect, test } from 'vitest';
import { BOARD, neighbors, winningGroup } from '../src/domain/board.js';

/** @param {number[]} owned @returns {import('../src/domain/types.js').Owner[]} */
function cells(owned) {
  return BOARD.map(({ id }) => (owned.includes(id) ? 'A' : 'unclaimed'));
}

test('28 unique row-major cells, seven per edge and two edges at each corner', () => {
  expect(BOARD).toHaveLength(28);
  expect(BOARD.map((c) => c.id)).toEqual(
    Array.from({ length: 28 }, (_, i) => i + 1),
  );
  for (const edge of ['left', 'right', 'bottom']) {
    expect(BOARD.filter((cell) => cell.edges.includes(edge))).toHaveLength(7);
  }
  for (const id of [1, 22, 28]) expect(BOARD[id - 1].edges).toHaveLength(2);
  expect(BOARD.map((c) => [c.x, c.y])).toContainEqual([0, 0]);
});

test('shared-side adjacency is symmetric and excludes diagonal corner contacts', () => {
  expect(neighbors(1)).toEqual([2, 3]);
  expect(neighbors(5)).toEqual([2, 3, 4, 6, 8, 9]);
  expect(neighbors(22)).toEqual([16, 23]);
  expect(neighbors(28)).toEqual([21, 27]);
  expect(neighbors(0)).toEqual([]);
  for (const cell of BOARD) {
    for (const id of neighbors(cell.id)) {
      expect(neighbors(id)).toContain(cell.id);
      const neighbor = BOARD[id - 1];
      expect(Math.hypot(cell.x - neighbor.x, cell.y - neighbor.y)).toBeCloseTo(
        Math.sqrt(3),
      );
    }
  }
});

test('a corner-to-bottom side path wins using both top-corner edges', () => {
  const path = [1, 2, 4, 7, 11, 16, 22];
  expect(winningGroup(cells(path), 'A')).toEqual(path);
  expect(winningGroup(cells(path.slice(0, -1)), 'A')).toEqual([]);
});

test('a branching connected group reaches three edges without top corner', () => {
  const path = [7, 8, 9, 10, 13, 18, 24];
  expect(winningGroup(cells(path), 'A')).toEqual(path);
});

test('disconnected edge groups and lone corners do not win', () => {
  for (const owned of [[1, 22, 28], [2, 4, 10, 15, 24, 25], []]) {
    expect(winningGroup(cells(owned), 'A')).toEqual([]);
  }
});

test('black, unclaimed and opponent cells cannot bridge a group', () => {
  const path = [1, 2, 4, 7, 11, 16, 22];
  for (const owner of /** @type {const} */ (['B', 'black', 'unclaimed'])) {
    const board = cells(path);
    board[6] = owner;
    expect(winningGroup(board, 'A')).toEqual([]);
  }
});
