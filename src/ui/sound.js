import { button, element } from './dom.js';
import { strings } from './strings.js';

/** @param {import('../app.js').App} app @param {AbortSignal} signal */
export function soundOptions(app, signal) {
  const t = strings[app.language];
  const panel = element('div', '', { class: 'sound-options' });
  const toggle = button(
    t.sound,
    'sound-enabled',
    () => {
      app.sounds.setEnabled(!app.sounds.enabled);
      toggle.setAttribute('aria-pressed', String(app.sounds.enabled));
      toggle.textContent = app.sounds.enabled ? t.soundOn : t.soundOff;
      toggle.addEventListener(
        'click',
        (event) => app.sounds.player.gesture(event),
        { signal },
      );
      app.savePreferences();
      if (app.workspace.storageError) app.renderPresentation();
    },
    signal,
  );
  toggle.setAttribute('aria-pressed', String(app.sounds.enabled));
  toggle.textContent = app.sounds.enabled ? t.soundOn : t.soundOff;
  panel.append(toggle, element('p', t.soundHelp, { class: 'muted' }));
  return panel;
}

/** @param {import('../app.js').App} app */
export function updateSoundStatus(app) {
  const status = app.root.querySelector('#sound-status');
  const code = app.sounds.player.status;
  if (!(status instanceof HTMLElement)) return;
  const t = strings[app.language];
  const summary = {
    soundBlocked: t.soundPaused,
    soundUnavailable: t.soundUnsupported,
    soundFailed: t.soundError,
  };
  status.textContent = code ? summary[code] : '';
  status.title = code ? t[code] : '';
  status.setAttribute('aria-label', status.title);
}
