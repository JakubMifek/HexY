import { button, element, field, input, select } from './dom.js';

/** @typedef {{name: string, color: string}} PlayerDetails
 * @typedef {{
 * players: Record<import('../domain/types.js').Player, PlayerDetails>,
 * language: import('../domain/types.js').Language, mode: 'letters'|'numbers',
 * answerMode: 'hosted'|'automatic', starter: 'A'|'B'|'random', seconds: number
 * }} Setup */

/** @param {import('../domain/types.js').Language} language @returns {Setup} */
export function defaultSetup(language) {
  return {
    players: {
      A: { name: 'A', color: '#0891b2' },
      B: { name: 'B', color: '#d97706' },
    },
    language,
    mode: 'letters',
    answerMode: 'hosted',
    starter: 'A',
    seconds: 30,
  };
}

/** @param {import('./strings.js').Texts} t @param {Setup} settings
 * @param {(value: Setup) => void} start @param {AbortSignal} signal
 * @param {() => void} changed @param {HTMLElement} preparation */
export function setupView(t, settings, start, signal, changed, preparation) {
  const form = document.createElement('form');
  form.noValidate = true;
  form.className = 'setup panel';
  form.append(element('h1', t.setup), element('p', t.intro));
  const grid = element('div', '', { class: 'setup-grid' });
  grid.append(...playerFields(t, settings), ...gameFields(t, settings));
  const submit = button(t.start, 'start', () => {}, signal);
  const error = element('p', '', { role: 'alert', id: 'setup-error' });
  submit.type = 'submit';
  form.append(
    grid,
    error,
    element('p', t.colors, { class: 'muted' }),
    element('p', t.catalogHelp),
    element('p', t.rules),
    preparation,
    submit,
    element('p', t.limit, { class: 'muted' }),
  );
  grid.addEventListener(
    'input',
    () => {
      Object.assign(settings, readSetup(form));
      changed();
    },
    { signal },
  );
  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        error.textContent = t.invalidSetup;
        const invalid = form.querySelector(':invalid');
        if (invalid instanceof HTMLElement) invalid.focus();
        return;
      }
      start(readSetup(form));
    },
    { signal },
  );
  return form;
}

/** @param {import('./strings.js').Texts} t @param {Setup} settings */
function playerFields(t, settings) {
  const fields = [];
  for (const player of /** @type {const} */ (['A', 'B'])) {
    const name = input(`name${player}`, 'text', settings.players[player].name);
    name.required = true;
    name.maxLength = 30;
    fields.push(
      field(t[`player${player}`], name),
      field(
        t[`color${player}`],
        input(`color${player}`, 'color', settings.players[player].color),
      ),
    );
  }
  return fields;
}

/** @param {import('./strings.js').Texts} t @param {Setup} settings */
function gameFields(t, settings) {
  const seconds = input('seconds', 'number', String(settings.seconds));
  Object.assign(seconds, { min: '1', max: '3600', step: '1', required: true });
  return [
    field(
      t.starter,
      select(
        'starter',
        [
          ['A', t.playerA],
          ['B', t.playerB],
          ['random', t.random],
        ],
        settings.starter,
      ),
    ),
    field(t.seconds, seconds),
    field(
      t.board,
      select(
        'mode',
        [
          ['letters', t.letters],
          ['numbers', t.numbers],
        ],
        settings.mode,
      ),
    ),
    field(
      t.answerMode,
      select(
        'answerMode',
        [
          ['hosted', t.hosted],
          ['automatic', t.automatic],
        ],
        settings.answerMode,
      ),
    ),
    field(
      t.content,
      select(
        'language',
        [
          ['cs', 'Čeština'],
          ['en', 'English'],
        ],
        settings.language,
      ),
    ),
  ];
}

/** @param {HTMLFormElement} form @returns {Setup} */
function readSetup(form) {
  const data = new FormData(form);
  const value = (/** @type {string} */ name) => String(data.get(name));
  return {
    players: {
      A: { name: value('nameA').trim() || 'A', color: value('colorA') },
      B: { name: value('nameB').trim() || 'B', color: value('colorB') },
    },
    language: value('language') === 'cs' ? 'cs' : 'en',
    mode: value('mode') === 'numbers' ? 'numbers' : 'letters',
    answerMode: value('answerMode') === 'automatic' ? 'automatic' : 'hosted',
    starter: readStarter(value('starter')),
    seconds: Number(value('seconds')),
  };
}

/** @param {string} value @returns {'A'|'B'|'random'} */
function readStarter(value) {
  if (value === 'random') return 'random';
  return value === 'B' ? 'B' : 'A';
}
