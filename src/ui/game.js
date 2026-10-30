import { boardView } from './board.js';
import { button, element } from './dom.js';
import { hostView } from './host.js';
import { answeringPlayer, roundView } from './round.js';

/** @typedef {{answer?: string, recipient?: 'A'|'B'|'black', wrong?: boolean, flipCell?: number}} Feedback */

/** @param {import('../domain/types.js').Game} state @param {import('./setup.js').Setup} settings
 * @param {import('./strings.js').Texts} t @param {Feedback} feedback
 * @param {(action: import('../domain/types.js').ActionBody) => void} send @param {AbortSignal} signal */
export function gameView(state, settings, t, feedback, send, signal) {
  const game = element('div', '', {
    class: 'game',
    'data-phase': state.stage.phase,
    'data-feedback':
      feedback.answer && feedback.answer.length > 80 ? 'long' : '',
  });
  game.append(
    playerBar(state, settings, t, send, signal),
    boardView(
      state,
      settings,
      t,
      (cell) => send({ type: 'select', cell }),
      signal,
      feedback.flipCell,
    ),
    roundView(state, settings.players, t, send, signal),
  );
  const result = element('p', '', {
    id: 'feedback',
    role: 'status',
    class: 'feedback',
  });
  if (feedback.wrong) result.textContent = t.wrongAgain;
  else if (feedback.recipient) {
    result.textContent =
      feedback.recipient === 'black'
        ? t.blackResult
        : `${t.captured} ${feedback.recipient} · ${settings.players[feedback.recipient].name}.`;
    if (feedback.answer)
      result.append(
        element('span', ` ${t.resolved}: ${feedback.answer}`, {
          lang: state.pack.language,
        }),
      );
  }
  game.append(result);
  if (state.config.answerMode === 'hosted')
    game.append(hostView(state, t, send, signal));
  return game;
}

/** @param {import('../domain/types.js').Game} state @param {import('./setup.js').Setup} settings
 * @param {import('./strings.js').Texts} t
 * @param {(action: import('../domain/types.js').ActionBody) => void} send @param {AbortSignal} signal */
function playerBar(state, settings, t, send, signal) {
  const bar = element('section', '', {
    class: 'player-bar',
    'aria-label': t.chooser,
  });
  const winner = state.stage.phase === 'won' ? state.stage.winner : null;
  const active = winner || answeringPlayer(state);
  for (const id of /** @type {const} */ (['A', 'B'])) {
    const player = settings.players[id];
    const panel = element('div', '', {
      class: `player ${id === active ? 'active' : ''}`,
    });
    panel.style.borderColor = player.color;
    panel.append(element('strong', `${id} · ${player.name}`));
    if (id === active)
      panel.append(
        element('span', playerRole(state, t), { class: 'player-role' }),
      );
    if (
      state.config.answerMode === 'hosted' &&
      (state.stage.phase === 'selecting' || state.stage.phase === 'won')
    ) {
      const chooser = button(
        '↗',
        `choose-${id}`,
        () => send({ type: 'set-chooser', player: id }),
        signal,
      );
      chooser.setAttribute('aria-label', `${t.setChooser}: ${player.name}`);
      panel.append(chooser);
    }
    bar.append(panel);
  }
  return bar;
}

/** @param {import('../domain/types.js').Game} state @param {import('./strings.js').Texts} t */
function playerRole(state, t) {
  if (state.stage.phase === 'won') return t.winner;
  if (state.stage.phase === 'question' || state.stage.phase === 'opponent')
    return t.turn;
  return t.chooser;
}

/** @param {import('../domain/types.js').Game} before @param {import('../domain/types.js').Game} after
 * @param {import('../domain/types.js').Action} action @returns {Feedback} */
export function transitionFeedback(before, after, action) {
  const stage = before.stage;
  if (stage.phase === 'selecting' && after.stage.phase === 'question')
    return { flipCell: after.stage.round.cell };
  if (!('round' in stage)) return {};
  const recipient = after.cells[stage.round.cell - 1];
  if (recipient === 'unclaimed') {
    return {
      wrong:
        after.stage.phase === 'question' &&
        (action.type === 'judge' || action.type === 'answer'),
    };
  }
  if (recipient !== before.cells[stage.round.cell - 1]) {
    const answer =
      stage.phase === 'question' || stage.phase === 'opponent'
        ? before.pack.questions[stage.round.cell - 1].answer
        : undefined;
    return { recipient, answer };
  }
  return {};
}
