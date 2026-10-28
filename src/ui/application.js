import { element } from './dom.js';
import { strings } from './strings.js';
import { setupView } from './setup.js';
import { gameView } from './game.js';
import { headerView } from './header.js';
import { recoveryView } from './recovery.js';

/** @param {import('../app.js').App} app @param {AbortSignal} signal */
export function applicationView(app, signal) {
  const t = strings[app.language];
  const header = headerView(
    t,
    app.language,
    app.theme,
    (language, theme) => app.changePresentation(language, theme),
    app.state ? () => app.requestNew() : null,
    signal,
  );
  const main = element('main');
  main.append(app.inputs.controls(app.language, signal));
  const state = app.state;
  if (state) {
    const context = { sessionId: state.sessionId, revision: state.revision };
    main.append(
      gameView(
        state,
        app.settings,
        t,
        app.feedback,
        (action) => app.send({ ...action, ...context }),
        signal,
      ),
    );
    if (state.stage.phase.startsWith('duel-'))
      main.querySelector('.question-panel')?.append(app.inputs.buzzers(signal));
    main.append(app.workspace.view(signal, state.pack));
  } else {
    main.append(
      setupView(
        t,
        app.settings,
        (settings) => app.start(settings),
        signal,
        () => app.setupChanged(),
        app.workspace.view(signal, null),
      ),
    );
  }
  main.append(
    recoveryView(
      app.recovery,
      state,
      app.language,
      () => app.retryRecovery(),
      () => app.requestNew(),
      () => app.renderPresentation(),
      signal,
      (file) => {
        void app.importGame(file);
      },
    ),
  );
  return [header, main, element('p', '', { id: 'error', role: 'alert' })];
}
