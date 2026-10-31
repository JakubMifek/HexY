/** @typedef {Pick<DOMMatrix, 'a'|'d'|'e'|'f'>} ReturnOrigin */

/** @param {HTMLElement} root @param {number | undefined} cell */
export function returnOrigin(root, cell) {
  if (cell === undefined) return null;
  const tile = root.querySelector(`#cell-${cell} .tile-face`);
  if (
    !(tile instanceof SVGGraphicsElement) ||
    typeof tile.getScreenCTM !== 'function'
  )
    return null;
  const matrix = tile.getScreenCTM();
  const polygon = tile.querySelector('.hex-base');
  if (matrix && polygon) {
    const box = polygon.getBoundingClientRect();
    // Firefox's group CTM translation can omit the CSS transform-origin offset.
    matrix.e = box.x + box.width / 2;
    matrix.f = box.y + box.height / 2;
  }
  return matrix;
}

/** @param {HTMLElement} root @param {ReturnOrigin | null} origin
 * @param {AbortSignal} signal */
export function positionReturn(root, origin, signal) {
  const face = root.querySelector('.returning');
  if (!(face instanceof SVGElement)) return;
  const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const finish = () => {
    face.classList.remove('returning');
    face.parentElement?.classList.remove('returning-tile');
    face.querySelector('.return-front')?.remove();
    motion?.removeEventListener('change', changedMotion);
  };
  const changedMotion = () => {
    if (motion?.matches) finish();
  };
  if (motion?.matches) {
    finish();
    return;
  }
  motion?.addEventListener('change', changedMotion, { signal });
  alignReturn(face, origin);
  face.addEventListener(
    'animationend',
    (event) => {
      if (event.target !== face || event.animationName !== 'tile-return')
        return;
      finish();
    },
    { signal },
  );
}

/** @param {SVGElement} face @param {ReturnOrigin | null} origin */
function alignReturn(face, origin) {
  const tile = face.parentElement;
  if (origin && tile instanceof SVGGraphicsElement) {
    const destination = tile.getScreenCTM();
    if (destination && destination.a !== 0 && destination.d !== 0) {
      face.style.setProperty(
        '--return-x',
        `${(origin.e - destination.e) / destination.a}px`,
      );
      face.style.setProperty(
        '--return-y',
        `${(origin.f - destination.f) / destination.d}px`,
      );
      face.style.setProperty(
        '--return-scale',
        String(origin.d / destination.d),
      );
      face.style.setProperty(
        '--return-width-scale',
        String(origin.a / destination.a),
      );
    }
  }
}
