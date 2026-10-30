import { button, element } from './dom.js';
import { deviceStrings } from './device-strings.js';

/** @param {import('../runtime/inputs.js').Inputs} inputs @param {AbortSignal} signal */
export function inputControls(inputs, signal) {
  const t = deviceStrings[inputs.language];
  const panel = element('div', '', { class: 'device-controls' });
  panel.append(
    button(t.controls, 'input-controls', () => inputs.open(), signal),
    element('p', inputs.storageError ? inputs.mappingNotice() : '', {
      id: 'device-error',
      role: 'alert',
    }),
  );
  return panel;
}

/** @param {import('../runtime/inputs.js').Inputs} inputs @param {AbortSignal} signal */
export function duelInputs(inputs, signal) {
  const panel = element('div', '', { class: 'duel-inputs' });
  panel.append(
    element(
      'p',
      `A · ${inputs.controls.label('A')} / B · ${inputs.controls.label('B')}`,
    ),
    touchView(deviceStrings[inputs.language], inputs, signal),
    element('p', '', { id: 'release-status', role: 'status' }),
    element('p', inputs.controllerStatus(), {
      id: 'controller-status',
      role: 'status',
    }),
  );
  if (inputs.controls.needsConnection())
    panel.append(
      button(
        deviceStrings[inputs.language].record,
        'rebind-controls',
        () => inputs.open(),
        signal,
      ),
    );
  return panel;
}

/** @param {import('./device-strings.js').DeviceTexts} t
 * @param {import('../runtime/inputs.js').Inputs} inputs @param {AbortSignal} signal */
export function touchView(t, inputs, signal) {
  const panel = element('section', '', { class: 'touch-controls' });
  for (const player of /** @type {const} */ (['A', 'B'])) {
    const control = button(
      `${player} · ${t.buzzer}`,
      `buzzer-${player}`,
      () => {},
      signal,
    );
    control.className = `buzzer buzzer-${player}`;
    control.addEventListener(
      'pointerdown',
      (event) => inputs.touch.down(event, player),
      { signal },
    );
    panel.append(control);
  }
  return panel;
}

/** @param {import('./device-strings.js').DeviceTexts} t
 * @param {import('../runtime/inputs.js').Inputs} inputs @param {AbortSignal} signal */
export function inputView(t, inputs, signal) {
  const panel = element('div', '', { class: 'input-panel' });
  panel.append(element('h2', t.controls, { id: 'input-title' }));
  for (const player of /** @type {const} */ (['A', 'B'])) {
    const row = element('div', '', { class: 'binding-row' });
    row.append(
      element('strong', player),
      element('span', inputs.controls.label(player), {
        id: `binding-${player}`,
      }),
      button(
        `${t.record} ${player}`,
        `record-${player}`,
        () => inputs.controls.recorder.start(player),
        signal,
      ),
    );
    panel.append(row);
  }
  panel.append(
    element('p', '', { id: 'record-status', role: 'status' }),
    element('p', '', { id: 'input-test-status', role: 'status' }),
    button(
      t.cancelRecord,
      'cancel-record',
      () => inputs.controls.recorder.cancel(),
      signal,
    ),
    element('p', inputs.controllerStatus(), {
      id: 'controller-status',
      role: 'status',
    }),
    element('p', '', { id: 'input-error', role: 'alert' }),
    button(t.close, 'close-inputs', () => inputs.close(), signal),
  );
  return panel;
}
