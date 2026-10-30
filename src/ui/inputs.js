import { button, element, field, input, select } from './dom.js';
import { KEY_CODES } from '../runtime/keyboard.js';
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
      `A · ${inputs.keyboard.mapping.A} / B · ${inputs.keyboard.mapping.B}`,
    ),
    touchView(deviceStrings[inputs.language], inputs, signal),
    element('p', '', { id: 'release-status', role: 'status' }),
    element('p', inputs.controllerStatus(), {
      id: 'controller-status',
      role: 'status',
    }),
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
  panel.append(
    element('h2', t.controls, { id: 'input-title' }),
    button(t.close, 'close-inputs', () => inputs.close(), signal),
    element('p', t.test),
    element('p', t.keyHelp),
  );
  for (const player of /** @type {const} */ (['A', 'B'])) {
    const key = select(
      `key-${player}`,
      KEY_CODES.map((code) => [code, code]),
      inputs.keyboard.mapping[player],
    );
    key.addEventListener('change', () => inputs.remap(player, key.value), {
      signal,
    });
    panel.append(field(`${player} · ${t.key}`, key));
  }
  panel.append(
    element('p', t.connect),
    element('div', '', { id: 'gamepad-settings' }),
    element('p', t.touchHelp),
    touchView(t, inputs, signal),
    element('p', t.testIdle, { id: 'input-test-status', role: 'status' }),
    element('p', '', { id: 'input-error', role: 'alert' }),
    element('p', t.fairness),
  );
  return panel;
}

/** @param {import('./device-strings.js').DeviceTexts} t
 * @param {import('../runtime/inputs.js').Inputs} inputs @param {AbortSignal} signal */
export function gamepadView(t, inputs, signal) {
  const panel = element('div');
  const pads = inputs.gamepads;
  panel.append(element('h3', t.devices));
  if (pads.status)
    panel.append(
      element(
        'p',
        t[/** @type {'unsupported'|'denied'|'disconnected'} */ (pads.status)],
        { role: 'status' },
      ),
    );
  for (const player of /** @type {const} */ (['A', 'B'])) {
    const assigned = pads.assignments[player];
    const choices = [
      ['', t.none],
      ...[...pads.devices.values()].map(({ token, pad }) => [
        token,
        `${pad.index} · ${pad.id}`,
      ]),
    ];
    const device = select(`device-${player}`, choices, assigned?.token);
    const index = input(
      `button-${player}`,
      'number',
      String(assigned?.button ?? 0),
    );
    index.min = '0';
    const assign = button(
      `${player} · ${t.assign}`,
      `assign-${player}`,
      () => inputs.assign(player, device.value, Number(index.value)),
      signal,
    );
    panel.append(
      field(`${player} · ${t.device}`, device),
      field(`${player} · ${t.button}`, index),
      assign,
    );
  }
  return panel;
}
