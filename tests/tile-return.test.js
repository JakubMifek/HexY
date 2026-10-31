// @vitest-environment jsdom
import { afterEach, expect, test, vi } from 'vitest';
import { positionReturn, returnOrigin } from '../src/ui/tile-return.js';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.replaceChildren();
});

function board() {
  const root = document.createElement('div');
  root.innerHTML =
    '<svg><g id="cell-28" class="returning-tile"><g class="tile-face returning"><polygon class="hex-base" /><g class="return-front" /></g></g></svg>';
  document.body.append(root);
  return root;
}

/** @param {HTMLElement} root @param {string} selector */
function required(root, selector) {
  const element = root.querySelector(selector);
  if (!(element instanceof SVGElement)) throw new Error(selector);
  return element;
}

test('origin uses the visible face center, including Firefox transform-origin displacement', () => {
  const root = board();
  const face = required(root, '.tile-face');
  const polygon = required(root, 'polygon');
  const matrix = { a: 1.22, d: 1.22, e: 999, f: 888 };
  Object.defineProperty(face, 'getScreenCTM', { value: () => matrix });
  vi.spyOn(polygon, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(100, 200, 60, 72),
  );
  expect(returnOrigin(root, 28)).toEqual({ a: 1.22, d: 1.22, e: 130, f: 236 });
  expect(returnOrigin(root, undefined)).toBeNull();
  expect(returnOrigin(root, 1)).toBeNull();
});

test('return scale and translation preserve the measured face without assuming 1.22 local zoom', () => {
  const root = board();
  const tile = required(root, '#cell-28');
  const face = required(root, '.tile-face');
  Object.defineProperty(tile, 'getScreenCTM', {
    value: () => ({ a: 2, d: 2, e: 400, f: 200 }),
  });
  positionReturn(
    root,
    { a: 2.44, d: 2.44, e: 360, f: 180 },
    new AbortController().signal,
  );
  expect(face.style.getPropertyValue('--return-scale')).toBe('1.22');
  expect(face.style.getPropertyValue('--return-x')).toBe('-20px');
  expect(face.style.getPropertyValue('--return-y')).toBe('-10px');
});

test.each([null, { a: 0, d: 1 }, { a: 1, d: 0 }])(
  'unavailable or singular destination %j does not produce invalid CSS',
  (destination) => {
    const root = board();
    Object.defineProperty(root.querySelector('#cell-28'), 'getScreenCTM', {
      value: () => destination,
    });
    positionReturn(
      root,
      { a: 1, d: 1, e: 0, f: 0 },
      new AbortController().signal,
    );
    expect(required(root, '.tile-face').getAttribute('style')).toBeNull();
  },
);
