import { button, element, field, input } from './dom.js';
import { strings } from './strings.js';
import { optionsView, playerSetup } from './setup.js';
import { inputControls } from './inputs.js';

/** @param {import('../app.js').App} app @param {AbortSignal} signal */
export function menuView(app, signal) {
  const t = strings[app.language];
  const nav = app.navigation;
  const back = () => nav.go('menu');
  if (nav.page === 'players')
    return playerSetup(t, app.settings, () => nav.go('desk'), back, signal);
  if (nav.page === 'desk') return deskView(app, signal);
  if (nav.page === 'options') {
    const panel = optionsView(
      t,
      app.settings,
      () => nav.optionsChanged(),
      back,
      signal,
    );
    panel.append(inputControls(app.inputs, signal));
    return panel;
  }
  if (nav.page === 'import') return importView(app, signal);
  const panel = element('section', '', { class: 'menu panel' });
  panel.append(
    element('p', t.tagline, { class: 'eyebrow' }),
    element('h1', t.menu),
    element('p', t.intro),
    button(t.newGame, 'new-game', () => nav.newGame(), signal),
    button(t.options, 'options', () => nav.go('options'), signal),
    button(t.importGame, 'open-import', () => nav.go('import'), signal),
  );
  return panel;
}

/** @param {import('../app.js').App} app @param {AbortSignal} signal */
function deskView(app, signal) {
  const t = strings[app.language];
  const nav = app.navigation;
  const panel = element('section', '', { class: 'desk' });
  panel.append(
    element('p', t.stepDesk, { class: 'eyebrow' }),
    element('h1', t.desk),
  );
  const choices = element('div', '', { class: 'board-choices' });
  for (const mode of /** @type {const} */ (['numbers', 'letters'])) {
    const tile = button(
      '',
      `mode-${mode}`,
      () => {
        app.settings.mode = mode;
        nav.boardChosen = true;
        app.setupChanged();
        app.renderPresentation();
      },
      signal,
    );
    tile.className = 'board-choice';
    tile.setAttribute(
      'aria-pressed',
      String(nav.boardChosen && app.settings.mode === mode),
    );
    tile.append(
      element('span', mode === 'numbers' ? '1 · 2 · 3' : 'A · B · C', {
        class: 'tile-preview',
        'aria-hidden': 'true',
      }),
      element('strong', t[mode]),
      element('span', mode === 'numbers' ? t.numberHelp : t.letterHelp),
    );
    choices.append(tile);
  }
  panel.append(choices);
  if (nav.boardChosen) panel.append(app.workspace.view(signal));
  panel.append(button(t.back, 'back-players', () => nav.go('players'), signal));
  if (nav.boardChosen) {
    const hosted = app.settings.answerMode === 'hosted';
    panel.append(
      button(
        hosted ? t.downloadPlay : t.start,
        'start',
        () => nav.play(),
        signal,
      ),
    );
    if (hosted)
      panel.append(element('p', t.downloadNotice, { class: 'muted' }));
  }
  return panel;
}

/** @param {import('../app.js').App} app @param {AbortSignal} signal */
function importView(app, signal) {
  const t = strings[app.language];
  const panel = element('section', '', { class: 'setup panel' });
  panel.append(element('h1', t.importGame), element('p', t.importHelp));
  if (app.navigation.pending) {
    panel.append(
      element('p', t.downloadNotice),
      button(
        t.downloadPlay,
        'import-play',
        () => app.navigation.adoptImport(),
        signal,
      ),
    );
  } else {
    const file = input('import-game', 'file', '');
    file.accept = '.json,application/json';
    file.addEventListener(
      'change',
      () => {
        const chosen = file.files?.[0];
        if (chosen) void app.importGame(chosen);
      },
      { signal },
    );
    panel.append(field(t.importGame, file));
  }
  panel.append(
    button(t.back, 'back-menu', () => app.navigation.go('menu'), signal),
  );
  return panel;
}
