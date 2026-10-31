import { svg } from './dom.js';

/** @param {string} color */
export function countdownView(color) {
  const ring = svg('g', {
    class: 'tile-countdown',
    transform: 'rotate(-90)',
    'aria-hidden': 'true',
    'stroke-dasharray': '100 100',
    'stroke-dashoffset': '0',
  });
  for (const [stroke, width] of [
    ['#17283c', '5'],
    [color, '3'],
  ]) {
    ring.append(
      svg('circle', {
        r: '21',
        fill: 'none',
        stroke,
        'stroke-width': width,
        pathLength: '100',
      }),
    );
  }
  return ring;
}

/** @param {ParentNode} root @param {import('../domain/types.js').Game | null} state
 * @param {number} now */
export function displayCountdown(root, state, now) {
  if (state?.stage.phase !== 'question') return;
  const ring = root.querySelector('.tile-countdown');
  if (!ring) return;
  const remaining = Math.min(
    100,
    Math.max(
      0,
      ((state.stage.round.deadline - now) / state.config.timeLimitMs) * 100,
    ),
  );
  ring.setAttribute('stroke-dasharray', `${remaining} 100`);
  // Negative offset leaves the elapsed arc empty clockwise from twelve o'clock.
  ring.setAttribute('stroke-dashoffset', String(remaining - 100));
}
