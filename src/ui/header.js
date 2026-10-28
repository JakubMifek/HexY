import { button, element, field, select, svg } from './dom.js';

/** @param {import('./strings.js').Texts} t @param {string} language @param {string} theme
 * @param {(language: string, theme: string) => void} change
 * @param {(() => void) | null} newGame @param {AbortSignal} signal */
export function headerView(t, language, theme, change, newGame, signal) {
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
  const languages = select(
    'ui-language',
    [
      ['cs', 'Čeština'],
      ['en', 'English'],
    ],
    language,
  );
  const themes = select(
    'theme',
    [
      ['light', t.light],
      ['dark', t.dark],
    ],
    theme,
  );
  const update = () => change(languages.value, themes.value);
  languages.addEventListener('change', update, { signal });
  themes.addEventListener('change', update, { signal });
  controls.append(field(t.language, languages), field(t.theme, themes));
  if (newGame) controls.append(button(t.newGame, 'new-game', newGame, signal));
  header.append(brand, controls);
  return header;
}

/** @param {import('./strings.js').Texts} t @param {() => void} discard */
export function confirmNewGame(t, discard) {
  const lifecycle = new AbortController();
  const signal = lifecycle.signal;
  const dialog = document.createElement('dialog');
  dialog.setAttribute('aria-labelledby', 'discard-title');
  dialog.append(
    element('h2', t.confirmNew, { id: 'discard-title' }),
    button(t.cancel, 'cancel-new', () => dialog.close(), signal),
    button(
      t.discard,
      'discard-new',
      () => {
        dialog.close();
        discard();
      },
      signal,
    ),
  );
  dialog.addEventListener(
    'close',
    () => {
      lifecycle.abort();
      dialog.remove();
    },
    { signal },
  );
  document.body.append(dialog);
  dialog.showModal();
  dialog.querySelector('button')?.focus();
  return dialog;
}
