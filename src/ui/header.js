import { button, element, svg } from './dom.js';
import { mountGameDialog } from './game-dialog.js';
import { message } from '../messages.js';

/** @param {import('./strings.js').Texts} t @param {string} language @param {string} theme
 * @param {(language: string, theme: string) => void} change
 * @param {(() => void) | null} newGame @param {AbortSignal} signal @param {() => void} save */
export function headerView(t, language, theme, change, newGame, signal, save) {
  const header = element('header', '', { class: 'header' });
  const brand = element('div', '', { class: 'brand' });
  const logo = svg('svg', {
    viewBox: '0 0 64 64',
    width: '48',
    height: '48',
    'aria-hidden': 'true',
  });
  logo.append(
    svg('path', {
      d: 'M32 3 57 17v30L32 61 7 47V17Z',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '4',
    }),
    svg('path', {
      d: 'm15 19 17 13 17-13M32 32v22',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '6',
      'stroke-linecap': 'round',
    }),
  );
  brand.append(logo, element('strong', 'HexY'), element('span', t.tagline));
  const controls = element('div', '', { class: 'header-controls' });
  const toggle = button(
    theme === 'light' ? '☾' : '☀',
    'theme',
    () => change(language, theme === 'light' ? 'dark' : 'light'),
    signal,
  );
  toggle.setAttribute(
    'aria-label',
    `${t.theme}: ${theme === 'light' ? t.dark : t.light}`,
  );
  toggle.className = 'theme-toggle';
  controls.append(toggle);
  if (newGame)
    controls.append(
      button(t.exit, 'exit-game', newGame, signal),
      button(t.save, 'save-game', save, signal),
    );
  header.append(brand, controls);
  return header;
}

/** @param {import('../app.js').App} app
 * @param {import('./strings.js').Texts} t @param {(save: boolean) => boolean} depart */
export function confirmNewGame(app, t, depart) {
  const lifecycle = new AbortController();
  const signal = lifecycle.signal;
  const dialog = document.createElement('dialog');
  dialog.setAttribute('aria-labelledby', 'discard-title');
  const error = element('p', '', { role: 'alert', id: 'exit-error' });
  const finish = (/** @type {boolean} */ save) => {
    if (app.disposed) return;
    if (depart(save)) {
      close();
      app.render();
    } else {
      error.textContent = message(app.language, app.recovery.error);
      app.renderPresentation();
    }
  };
  dialog.append(
    element('h2', t.confirmNew, { id: 'discard-title' }),
    button(t.cancel, 'cancel-new', () => close(), signal),
    ...(app.state
      ? [button(t.saveReturn, 'save-return', () => finish(true), signal)]
      : []),
    button(t.discard, 'discard-new', () => finish(false), signal),
    error,
  );
  const close = mountGameDialog(app, dialog, lifecycle, 'exit-game');
  dialog.querySelector('button')?.focus();
  return dialog;
}
