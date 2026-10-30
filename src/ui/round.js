import { opponent } from '../domain/outcomes.js';
import { DUEL_SYMBOLS, symbolKey } from '../runtime/symbols.js';
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
  else if (phase === 'duel-interrupted')
    panel.append(element('p', t.interruptHelp));
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
  if (question.text.length > 240) panel.classList.add('long-question');
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
  if (state.config.answerMode === 'automatic')
    controls.append(answerForm(state, t, send, signal));
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
  const target = t[symbolKey(stage.round.target)];
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
  const glyph = DUEL_SYMBOLS[symbolKey(symbol)];
  panel.append(
    element('div', glyph, { class: 'duel-symbol', 'aria-hidden': 'true' }),
    element(
      'p',
      stage.phase === 'duel-preview'
        ? t.waiting
        : `${t.current}: ${t[symbolKey(symbol)]}`,
      { id: 'duel-current' },
    ),
  );
}
