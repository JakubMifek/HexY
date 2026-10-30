import { message } from '../messages.js';
import { button, element } from './dom.js';
import { deviceStrings } from './device-strings.js';
import { mountGameDialog } from './game-dialog.js';

/** @param {import('../runtime/recovery.js').Recovery} recovery
 * @param {import('../domain/types.js').Game | null} state
 * @param {import('../domain/types.js').Language} language
 * @param {() => void} retry @param {() => void} discard
 * @param {() => void} changed @param {AbortSignal} signal
 * @param {() => import('../domain/types.js').Game | null} [current] */
export function recoveryView(
  recovery,
  state,
  language,
  retry,
  discard,
  changed,
  signal,
  current = () => state,
) {
  const t = deviceStrings[language];
  const panel = element('section', '', { class: 'recovery panel' });
  panel.append(element('h2', t.recovery));
  panel.append(
    element('p', recovery.saved ? t.saved : t.unsaved, {
      id: 'game-save-status',
      role: 'status',
    }),
  );
  if (recovery.error)
    panel.append(
      element('p', `${message(language, recovery.error)} ${t.recoveryHelp}`, {
        id: 'recovery-error',
        role: 'alert',
      }),
    );
  panel.append(exportControls(recovery, current, t, changed, signal));
  if (!recovery.writable || recovery.error)
    panel.append(button(t.retryRecovery, 'retry-recovery', retry, signal));
  if (recovery.original !== null && !recovery.writable)
    panel.append(button(t.discardSave, 'discard-save', discard, signal));
  return panel;
}

/** @param {import('../runtime/recovery.js').Recovery} recovery
 * @param {() => import('../domain/types.js').Game | null} current
 * @param {import('./device-strings.js').DeviceTexts} t
 * @param {() => void} changed @param {AbortSignal} signal */
function exportControls(recovery, current, t, changed, signal) {
  const state = current();
  const panel = element('div', '', { class: 'actions' });
  if (state || typeof recovery.original === 'string')
    panel.append(
      button(
        t.exportGame,
        'export-game',
        () => {
          recovery.export(current());
          changed();
        },
        signal,
      ),
    );
  if (state && !recovery.writable && typeof recovery.original === 'string')
    panel.append(
      button(
        t.exportOriginal,
        'export-original',
        () => {
          recovery.export(null);
          changed();
        },
        signal,
      ),
    );
  return panel;
}

/** @param {import('../app.js').App} app @param {AbortSignal} signal */
export function recoveryLauncher(app, signal) {
  const t = deviceStrings[app.language];
  const control = button(
    `! ${app.recovery.saved ? t.recovery : t.unsavedShort}`,
    'open-recovery',
    () => openRecovery(app),
    signal,
  );
  control.setAttribute(
    'aria-label',
    `${t.recovery}: ${app.recovery.saved ? t.saved : t.unsaved}`,
  );
  control.setAttribute('aria-live', 'polite');
  return control;
}

/** @param {import('../app.js').App} app */
function openRecovery(app) {
  if (app.disposed || app.dialog) return;
  app.interrupt();
  const dialog = document.createElement('dialog');
  const lifecycle = new AbortController();
  const t = deviceStrings[app.language];
  const signal = lifecycle.signal;
  dialog.setAttribute('aria-label', t.recovery);
  dialog.className = 'recovery-dialog';
  const refresh = () =>
    dialog.replaceChildren(
      recoveryView(
        app.recovery,
        app.state,
        app.language,
        () => {
          app.retryRecovery();
          refresh();
        },
        () => {
          close();
          app.navigation.requestExit(true);
        },
        refresh,
        signal,
        () => app.state,
      ),
      button(t.close, 'close-recovery', () => close(), signal),
    );
  refresh();
  const close = mountGameDialog(app, dialog, lifecycle, 'open-recovery');
}
