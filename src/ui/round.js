import { opponent } from '../domain/outcomes.js';
import { button, element, field, input } from './dom.js';

/** @param {import('../domain/types.js').Game} state */
export function answeringPlayer(state) {
  const stage = state.stage;
  return stage.phase === 'opponent'
    ? opponent(stage.round.originalChooser)
    : state.chooser;
}

/** @param {import('../domain/types.js').Game} state
 * @param {import('./setup.js').Setup['players']} players @param {import('./strings.js').Texts} t
 * @param {(action: import('../domain/types.js').ActionBody) => void} send
 * @param {AbortSignal} signal */
export function roundView(state, players, t, send, signal) {
  const panel = element('section', '', {
    class: 'question-panel panel',
    'aria-labelledby': 'phase-heading',
  });
  panel.append(
    element('h2', roundTitle(state, players, t), {
      id: 'phase-heading',
      tabindex: '-1',
    }),
  );
  const phase = state.stage.phase;
  if (phase === 'selecting') panel.append(element('p', t.choose));
  else if (phase === 'question' || phase === 'opponent')
    questionView(panel, state, t, send, signal);
  else if (phase === 'duel-interrupted') readinessView(panel, t, send, signal);
  else if (phase === 'duel-preview' || phase === 'duel-active')
    duelView(panel, state, t);
  return panel;
}

/** @param {import('../domain/types.js').Game} state
 * @param {import('./setup.js').Setup['players']} players @param {import('./strings.js').Texts} t */
function roundTitle(state, players, t) {
  const stage = state.stage;
  if (stage.phase === 'question' || stage.phase === 'opponent') {
    const id = answeringPlayer(state);
    return `${id} · ${players[id].name} — ${t[stage.phase]}`;
  }
  if (stage.phase === 'won')
    return `${stage.winner} · ${players[stage.winner].name} — ${t.won}`;
  return t[stage.phase];
}

/** @param {HTMLElement} panel @param {import('../domain/types.js').Game} state
 * @param {import('./strings.js').Texts} t
 * @param {(action: import('../domain/types.js').ActionBody) => void} send @param {AbortSignal} signal */
function questionView(panel, state, t, send, signal) {
  const stage = state.stage;
  if (stage.phase !== 'question' && stage.phase !== 'opponent') return;
  const question = state.pack.questions[stage.round.cell - 1];
  panel.append(
    element(
      'p',
      `${t.cell} ${stage.round.cell} · ${t.initial} ${question.initial}`,
      { class: 'eyebrow' },
    ),
    element('p', question.text, {
      class: 'question-text',
      lang: question.language,
    }),
    element('p', stage.phase === 'question' ? t.remaining : t.untimed),
  );
  if (stage.phase === 'question')
    panel.append(
      element('output', '', {
        id: 'timer',
        'aria-label': t.remaining,
        'aria-live': 'off',
        class: 'timer',
      }),
    );
  const controls = element('div', '', { class: 'controls' });
  if (state.config.answerMode === 'hosted') {
    controls.append(
      button(
        t.correct,
        'judge-correct',
        () => send({ type: 'judge', correct: true }),
        signal,
      ),
      button(
        t.wrong,
        'judge-wrong',
        () => send({ type: 'judge', correct: false }),
        signal,
      ),
    );
  } else controls.append(answerForm(state, t, send, signal));
  controls.append(
    button(t.giveUp, 'give-up', () => send({ type: 'give-up' }), signal),
  );
  panel.append(controls);
}

/** @param {import('../domain/types.js').Game} state @param {import('./strings.js').Texts} t
 * @param {(action: import('../domain/types.js').ActionBody) => void} send @param {AbortSignal} signal */
function answerForm(state, t, send, signal) {
  const form = document.createElement('form');
  form.noValidate = true;
  form.className = 'answer-form';
  const answer = input('answer', 'text', '');
  answer.autocomplete = 'off';
  answer.spellcheck = false;
  answer.required = true;
  const submit = button(t.submit, 'submit-answer', () => {}, signal);
  const validation = element('span', '', { role: 'alert', id: 'answer-error' });
  submit.type = 'submit';
  form.append(field(t.answer, answer), submit, validation);
  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();
      if (!answer.value.trim()) {
        validation.textContent = t.emptyAnswer;
        answer.focus();
        return;
      }
      send({
        type: 'answer',
        player: answeringPlayer(state),
        text: answer.value,
      });
    },
    { signal },
  );
  return form;
}

/** @param {HTMLElement} panel @param {import('../domain/types.js').Game} state
 * @param {import('./strings.js').Texts} t */
function duelView(panel, state, t) {
  const stage = state.stage;
  if (stage.phase !== 'duel-preview' && stage.phase !== 'duel-active') return;
  const symbols = { circle: '●', triangle: '▲', square: '■', star: '★' };
  const target = symbolName(stage.round.target, t);
  panel.append(
    element('p', `${t.target}: ${target}`, {
      class: 'target',
      id: 'duel-target',
    }),
  );
  const index = Math.floor(
    (state.lastNow - stage.round.startsAt) / state.config.duel.symbolMs,
  );
  const symbol =
    stage.phase === 'duel-preview'
      ? stage.round.target
      : stage.round.sequence[index];
  const glyph = symbols[/** @type {keyof typeof symbols} */ (symbol)];
  panel.append(
    element('div', glyph, { class: 'duel-symbol', 'aria-hidden': 'true' }),
    element(
      'p',
      stage.phase === 'duel-preview'
        ? t.waiting
        : `${t.current}: ${symbolName(symbol, t)}`,
      { id: 'duel-current' },
    ),
    element('p', t.duelHelp),
  );
}

/** @param {string} symbol @param {import('./strings.js').Texts} t */
function symbolName(symbol, t) {
  switch (symbol) {
    case 'circle':
      return t.circle;
    case 'triangle':
      return t.triangle;
    case 'square':
      return t.square;
    case 'star':
      return t.star;
    default:
      throw new Error('Unsupported duel symbol');
  }
}

/** @param {HTMLElement} panel @param {import('./strings.js').Texts} t
 * @param {(action: import('../domain/types.js').ActionBody) => void} send @param {AbortSignal} signal */
function readinessView(panel, t, send, signal) {
  panel.append(element('p', t.interruptHelp, { id: 'rearm-help' }));
  const a = input('ready-A', 'checkbox', 'A');
  const b = input('ready-B', 'checkbox', 'B');
  const restart = button(
    t.restart,
    'restart',
    () => {
      if (a.checked && b.checked) send({ type: 'restart' });
    },
    signal,
  );
  restart.disabled = true;
  restart.setAttribute('aria-describedby', 'rearm-help restart-feedback');
  const update = () => {
    restart.disabled = !a.checked || !b.checked;
  };
  a.addEventListener('change', update, { signal });
  b.addEventListener('change', update, { signal });
  panel.append(
    field(`${t.playerA} · ${t.ready}`, a),
    field(`${t.playerB} · ${t.ready}`, b),
    restart,
    element('p', '', { id: 'restart-feedback', role: 'alert' }),
  );
}
