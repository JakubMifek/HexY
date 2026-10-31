import { button, element, field, input, select } from './dom.js';

const PLAYER_COLORS = { A: '#129FB5', B: '#FBA123' };

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
      A: { name: 'A', color: PLAYER_COLORS.A },
      B: { name: 'B', color: PLAYER_COLORS.B },
    },
    language,
    mode: 'numbers',
    answerMode: 'hosted',
    starter: 'random',
    seconds: 30,
  };
}

const NAMES = [
  'Aragorn',
  'Arwen',
  'Bilbo',
  'Boromir',
  'Éowyn',
  'Faramir',
  'Frodo',
  'Galadriel',
  'Gandalf',
  'Gimli',
  'Legolas',
  'Merry',
  'Pippin',
  'Samwise',
];

/** @param {() => number} random */
export function randomPlayers(random) {
  const pool = [...NAMES];
  const take = () => pool.splice(Math.floor(random() * pool.length), 1)[0];
  return {
    A: { name: take(), color: PLAYER_COLORS.A },
    B: { name: take(), color: PLAYER_COLORS.B },
  };
}

/** @param {import('./strings.js').Texts} t @param {Setup} settings
 * @param {() => void} next @param {() => void} back @param {AbortSignal} signal */
export function playerSetup(t, settings, next, back, signal) {
  const form = document.createElement('form');
  form.className = 'setup panel';
  form.noValidate = true;
  form.append(
    element('p', t.stepPlayers, { class: 'eyebrow' }),
    element('h1', t.setup),
  );
  const grid = element('div', '', { class: 'setup-grid' });
  grid.append(...playerFields(t, settings, signal));
  const host = select(
    'answerMode',
    [
      ['hosted', t.hosted],
      ['automatic', t.automatic],
    ],
    settings.answerMode,
  );
  host.addEventListener(
    'change',
    () => {
      settings.answerMode = host.value === 'hosted' ? 'hosted' : 'automatic';
    },
    { signal },
  );
  const submit = button(t.next, 'next-setup', () => {}, signal);
  submit.type = 'submit';
  const error = element('p', '', { id: 'setup-error', role: 'alert' });
  form.append(
    grid,
    field(t.answerMode, host),
    element('p', t.colors, { class: 'muted' }),
    error,
    button(t.back, 'back-menu', back, signal),
    submit,
  );
  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();
      if (
        !form.checkValidity() ||
        Object.values(settings.players).some((p) => !p.name.trim())
      ) {
        error.textContent = t.invalidSetup;
        return;
      }
      next();
    },
    { signal },
  );
  return form;
}

/** @param {import('./strings.js').Texts} t @param {Setup} settings
 * @param {() => void} changed @param {() => void} back @param {AbortSignal} signal */
export function optionsView(t, settings, changed, back, signal) {
  const panel = element('section', '', { class: 'setup panel' });
  const seconds = input('seconds', 'number', String(settings.seconds));
  Object.assign(seconds, { min: '1', max: '3600', step: '1', required: true });
  const starter = select(
    'starter',
    [
      ['random', t.random],
      ['A', t.playerA],
      ['B', t.playerB],
    ],
    settings.starter,
  );
  const language = select(
    'language',
    [
      ['cs', 'Čeština'],
      ['en', 'English'],
    ],
    settings.language,
  );
  const error = element('p', '', { id: 'setup-error', role: 'alert' });
  seconds.addEventListener(
    'input',
    () => {
      error.textContent = seconds.checkValidity() ? '' : t.invalidSetup;
      if (seconds.checkValidity()) {
        settings.seconds = Number(seconds.value);
        changed();
      }
    },
    { signal },
  );
  starter.addEventListener(
    'change',
    () => {
      settings.starter = readStarter(starter.value);
      changed();
    },
    { signal },
  );
  language.addEventListener(
    'change',
    () => {
      settings.language = language.value === 'cs' ? 'cs' : 'en';
      changed();
    },
    { signal },
  );
  panel.append(
    element('h1', t.options),
    field(t.seconds, seconds),
    field(t.starter, starter),
    field(t.language, language),
    error,
    button(t.back, 'back-menu', back, signal),
  );
  return panel;
}

/** @param {string} value @returns {'random'|'A'|'B'} */
function readStarter(value) {
  if (value === 'random') return 'random';
  return value === 'A' ? 'A' : 'B';
}

/** @param {import('./strings.js').Texts} t @param {Setup} settings @param {AbortSignal} signal */
function playerFields(t, settings, signal) {
  return /** @type {const} */ (['A', 'B']).map((id) => {
    const player = settings.players[id];
    const name = input(`name${id}`, 'text', player.name);
    name.required = true;
    name.maxLength = 30;
    const color = input(`color${id}`, 'color', player.color);
    name.addEventListener(
      'input',
      () => {
        player.name = name.value;
      },
      { signal },
    );
    color.addEventListener(
      'input',
      () => {
        player.color = color.value;
      },
      { signal },
    );
    const card = element('div', '', { class: 'player-setup' });
    card.append(field(t[`player${id}`], name), field(t[`color${id}`], color));
    return card;
  });
}
