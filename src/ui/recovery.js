import { message } from '../messages.js';
import { button, element, field, input } from './dom.js';
import { deviceStrings } from './device-strings.js';

/** @param {import('../runtime/recovery.js').Recovery} recovery
 * @param {import('../domain/types.js').Game | null} state
 * @param {import('../domain/types.js').Language} language
 * @param {() => void} retry @param {() => void} discard
 * @param {() => void} changed @param {AbortSignal} signal
 * @param {(file: File) => void} importGame */
export function recoveryView(
  recovery,
  state,
  language,
  retry,
  discard,
  changed,
  signal,
  importGame,
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
  panel.append(exportControls(recovery, state, t, changed, signal));
  if (!recovery.writable || recovery.error)
    panel.append(button(t.retryRecovery, 'retry-recovery', retry, signal));
  if (recovery.original !== null && !recovery.writable)
    panel.append(button(t.discardSave, 'discard-save', discard, signal));
  if (!state && recovery.writable && recovery.original === null)
    panel.append(importControl(t, importGame, signal));
  return panel;
}

/** @param {import('../runtime/recovery.js').Recovery} recovery
 * @param {import('../domain/types.js').Game | null} state
 * @param {import('./device-strings.js').DeviceTexts} t
 * @param {() => void} changed @param {AbortSignal} signal */
function exportControls(recovery, state, t, changed, signal) {
  const panel = element('div', '', { class: 'actions' });
  if (state || typeof recovery.original === 'string')
    panel.append(
      button(
        t.exportGame,
        'export-game',
        () => {
          recovery.export(state);
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

/** @param {import('./device-strings.js').DeviceTexts} t
 * @param {(file: File) => void} importGame @param {AbortSignal} signal */
function importControl(t, importGame, signal) {
  const file = input('import-game', 'file', '');
  file.accept = '.json,application/json';
  file.addEventListener(
    'change',
    () => {
      const chosen = file.files?.[0];
      if (chosen) importGame(chosen);
    },
    { signal },
  );
  const label = field(t.importGame, file);
  label.className = 'file-import';
  return label;
}
