import { createGame, transition } from './domain/game.js';
import { randomStarter } from './domain/config.js';
import { DomainError } from './domain/errors.js';
import { message } from './messages.js';
import { prepareStarter } from './content/catalog.js';
import { RoundClock } from './runtime/clock.js';
import { DuelKeyboard } from './runtime/keyboard.js';
import { element } from './ui/dom.js';
import { strings } from './ui/strings.js';
import { defaultSetup, setupView } from './ui/setup.js';
import { gameView, transitionFeedback } from './ui/game.js';
import { confirmNewGame, headerView } from './ui/header.js';

export class App {
  disposed = false;
  /** @type {import('./domain/types.js').Game | null} */
  state = null;
  /** @type {import('./domain/types.js').Language} */
  language = 'cs';
  theme = 'light';
  settings = defaultSetup('cs');
  /** @type {import('./ui/game.js').Feedback} */
  feedback = {};
  viewListeners = new AbortController();
  /** @type {HTMLDialogElement | null} */
  dialog = null;

  /** @param {HTMLElement} root @param {import('./runtime/clock.js').Clock} clock
   * @param {() => number} random @param {() => string} sessionId */
  constructor(root, clock, random, sessionId) {
    this.root = root;
    this.clock = clock;
    this.random = random;
    this.sessionId = sessionId;
    this.timer = new RoundClock(
      clock,
      (state) =>
        this.send({
          type: 'tick',
          sessionId: state.sessionId,
          revision: state.revision,
        }),
      (now) => this.displayTime(now),
    );
    this.keyboard = new DuelKeyboard(
      window,
      clock,
      (action) => this.send(action),
      () => this.interrupt(),
    );
    this.render();
  }

  /** @param {import('./ui/setup.js').Setup} settings */
  start(settings) {
    if (this.disposed) return;
    this.guard(() => {
      const pack = prepareStarter(settings, this.random);
      this.state = createGame(
        pack,
        {
          answerMode: settings.answerMode,
          timeLimitMs: settings.seconds * 1000,
          starter:
            settings.starter === 'random'
              ? randomStarter(this.random)
              : settings.starter,
          duel: {
            previewMs: 2000,
            symbolMs: 900,
            length: 5,
            symbols: ['circle', 'triangle', 'square', 'star'],
          },
        },
        this.clock.now(),
        this.sessionId(),
      );
      this.settings = settings;
      this.feedback = {};
      this.render();
      this.timer.bind(this.state);
    });
  }

  /** @param {import('./domain/types.js').Action} action */
  send(action) {
    if (this.disposed) return;
    this.guard(() => {
      if (!this.state) return;
      const before = this.state;
      const restarting =
        action.type === 'restart' &&
        before.stage.phase === 'duel-interrupted' &&
        action.sessionId === before.sessionId &&
        action.revision === before.revision;
      if (restarting && !this.canRestart()) return;
      const result = transition(before, action, {
        now: this.clock.now(),
        random: this.random,
      });
      if (result.outcome === 'ignored') return;
      this.state = result.state;
      this.feedback = transitionFeedback(before, this.state, action);
      this.render();
      this.timer.bind(this.state);
    });
  }

  interrupt() {
    const state = this.state;
    if (!state) return;
    if (
      state.stage.phase === 'duel-active' ||
      state.stage.phase === 'duel-preview' ||
      state.stage.phase === 'duel-interrupted'
    ) {
      this.keyboard.requireReleases();
    }
    this.send({
      type: 'interrupt',
      sessionId: state.sessionId,
      revision: state.revision,
    });
  }

  canRestart() {
    const blocked =
      this.keyboard.held.size ||
      this.keyboard.releasesRequired.size ||
      document.hidden ||
      !document.hasFocus();
    if (!blocked) return true;
    const feedback = this.root.querySelector('#restart-feedback');
    if (feedback) feedback.textContent = strings[this.language].rearmNeeded;
    return false;
  }

  /** @param {string} language @param {string} theme */
  changePresentation(language, theme) {
    const opportunity = this.state;
    const previous = this.root.querySelector('#answer');
    const draft = previous instanceof HTMLInputElement ? previous.value : '';
    this.language = language === 'cs' ? 'cs' : 'en';
    this.theme = theme;
    this.render();
    const answer = this.root.querySelector('#answer');
    if (this.state === opportunity && answer instanceof HTMLInputElement) {
      answer.value = draft;
    }
  }

  render() {
    if (this.disposed) return;
    const focused = document.activeElement?.id;
    this.viewListeners.abort();
    this.viewListeners = new AbortController();
    const signal = this.viewListeners.signal;
    const t = strings[this.language];
    document.documentElement.lang = this.language;
    document.documentElement.dataset.theme = this.theme;
    const header = headerView(
      t,
      this.language,
      this.theme,
      (language, theme) => this.changePresentation(language, theme),
      this.state ? () => this.requestNew() : null,
      signal,
    );
    const main = element('main');
    const state = this.state;
    if (state) {
      const context = { sessionId: state.sessionId, revision: state.revision };
      main.append(
        gameView(
          state,
          this.settings,
          t,
          this.feedback,
          (action) => this.send({ ...action, ...context }),
          signal,
        ),
      );
    } else
      main.append(
        setupView(t, this.settings, (settings) => this.start(settings), signal),
      );
    this.root.replaceChildren(
      header,
      main,
      element('p', '', { id: 'error', role: 'alert' }),
    );
    this.keyboard.bind(state);
    this.displayTime(this.clock.now());
    this.restoreFocus(focused);
  }

  /** @param {string | undefined} previous */
  restoreFocus(previous) {
    if (this.dialog?.open) return;
    const prior = previous ? document.getElementById(previous) : null;
    if (prior && prior.getAttribute('aria-disabled') !== 'true') {
      prior.focus();
      return;
    }
    const next = this.root.querySelector('#answer, #phase-heading, #nameA');
    if (next instanceof HTMLElement) {
      next.focus({ preventScroll: true });
      if (this.state && this.state.stage.phase !== 'selecting') {
        this.root
          .querySelector('.question-panel')
          ?.scrollIntoView({ block: 'nearest' });
      }
    }
  }

  /** @param {number} now */
  displayTime(now) {
    const stage = this.state?.stage;
    const timer = this.root.querySelector('#timer');
    if (timer && stage?.phase === 'question') {
      timer.textContent = `${Math.ceil(Math.max(0, stage.round.deadline - now) / 1000)} s`;
    }
  }

  requestNew() {
    if (this.dialog?.open) return;
    const phase = this.state?.stage.phase;
    if (phase === 'duel-active' || phase === 'duel-preview') this.interrupt();
    this.dialog = confirmNewGame(strings[this.language], () => {
      this.timer.dispose();
      this.keyboard.bind(null);
      this.state = null;
      this.feedback = {};
      this.render();
    });
  }

  /** @param {() => void} action */
  guard(action) {
    try {
      action();
    } catch (error) {
      if (!(error instanceof DomainError)) throw error;
      const alert = this.root.querySelector('#error');
      if (alert)
        alert.textContent = `${message(this.language, error.code)} ${strings[this.language].retry}`;
    }
  }

  dispose() {
    this.disposed = true;
    this.state = null;
    this.timer.dispose();
    this.keyboard.dispose();
    this.viewListeners.abort();
    this.dialog?.close();
    this.root.replaceChildren();
  }
}
