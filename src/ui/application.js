import { element } from './dom.js';
import { strings } from './strings.js';
import { menuView } from './menu.js';
import { gameView } from './game.js';
import { headerView } from './header.js';
import { recoveryView, recoveryLauncher } from './recovery.js';
import { duelInputs } from './inputs.js';

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
    () => {
      app.recovery.export(app.state);
      app.renderPresentation();
    },
  );
  const main = element('main');
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
      main
        .querySelector('.question-panel')
        ?.append(duelInputs(app.inputs, signal));
  } else {
    main.append(menuView(app, signal));
    if (
      (app.workspace.storageError || app.workspace.error) &&
      app.navigation.page !== 'desk'
    )
      main.append(app.workspace.statusView());
  }
  attachRecovery(app, header, main, signal);
  return [header, main, element('p', '', { id: 'error', role: 'alert' })];
}

/** @param {import('../app.js').App} app @param {HTMLElement} header
 * @param {HTMLElement} main @param {AbortSignal} signal */
function attachRecovery(app, header, main, signal) {
  const state = app.state;
  if (app.recovery.error || !app.recovery.writable) {
    if (state)
      header
        .querySelector('.header-controls')
        ?.prepend(recoveryLauncher(app, signal));
    else
      main.append(
        recoveryView(
          app.recovery,
          state,
          app.language,
          () => app.retryRecovery(),
          () => app.requestNew(),
          () => app.renderPresentation(),
          signal,
        ),
      );
  }
}
