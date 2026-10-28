import { createGame, transition } from './domain/game.js';
import { randomStarter } from './domain/config.js';
import { DomainError, requireValue } from './domain/errors.js';
import { message } from './messages.js';
import { Workspace } from './workspace.js';
import { RoundClock } from './runtime/clock.js';
import { Inputs } from './runtime/inputs.js';
import { Recovery } from './runtime/recovery.js';
import { DUEL_SYMBOLS } from './runtime/symbols.js';
import { applicationView } from './ui/application.js';
import { strings } from './ui/strings.js';
import { defaultSetup } from './ui/setup.js';
import { transitionFeedback } from './ui/game.js';
import { confirmNewGame } from './ui/header.js';

export class App {
  disposed = false;
  lastObservedNow = 0;
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
    this.workspace = new Workspace(random, sessionId, () =>
      this.renderPresentation(),
    );
    const preferences = this.workspace.preferences;
    this.settings = preferences.setup;
    this.language = preferences.language;
    this.theme = preferences.theme;
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
    this.inputs = new Inputs(
      window,
      clock,
      (action) => this.send(action),
      () => this.interrupt(),
    );
    this.keyboard = this.inputs.keyboard;
    this.recovery = new Recovery();
    this.restore();
    this.render();
  }

  /** @param {import('./ui/setup.js').Setup} settings */
  start(settings) {
    if (this.disposed || this.state) return;
    this.guard(() => {
      this.workspace.model.configure(settings);
      const pack = this.workspace.model.packForStart();
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
            symbols: Object.keys(DUEL_SYMBOLS),
          },
        },
        this.now(),
        this.sessionId(),
      );
      this.settings = settings;
      this.workspace.model.lock();
      this.savePreferences();
      this.recovery.save(this.state);
      this.feedback = {};
      this.render();
      this.root.querySelector('.game')?.scrollIntoView({ block: 'start' });
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
        now: this.now(),
        random: this.random,
      });
      if (result.outcome === 'ignored') return;
      this.state = result.state;
      this.recovery.save(this.state);
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
      this.inputs.requireReleases();
    }
    this.send({
      type: 'interrupt',
      sessionId: state.sessionId,
      revision: state.revision,
    });
  }

  canRestart() {
    const blocked =
      !this.inputs.ready() || document.hidden || !document.hasFocus();
    if (!blocked) return true;
    const feedback = this.root.querySelector('#restart-feedback');
    if (feedback) feedback.textContent = strings[this.language].rearmNeeded;
    return false;
  }

  /** @param {string} language @param {string} theme */
  changePresentation(language, theme) {
    this.language = language === 'cs' ? 'cs' : 'en';
    this.theme = theme;
    this.savePreferences();
    this.renderPresentation();
  }

  renderPresentation() {
    const opportunity = this.state;
    const previous = this.root.querySelector('#answer');
    const draft = previous instanceof HTMLInputElement ? previous.value : '';
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
    document.documentElement.lang = this.language;
    document.documentElement.dataset.theme = this.theme;
    this.inputs.bind(this.state);
    this.root.replaceChildren(...applicationView(this, signal));
    this.inputs.releaseFeedback();
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
    if (now < this.lastObservedNow) {
      this.guard(() => {
        throw new DomainError('clockBackwards');
      });
      return;
    }
    this.lastObservedNow = now;
    const stage = this.state?.stage;
    const timer = this.root.querySelector('#timer');
    if (timer && stage?.phase === 'question') {
      timer.textContent = `${Math.ceil(Math.max(0, stage.round.deadline - now) / 1000)} s`;
    }
  }

  now() {
    const now = this.clock.now();
    requireValue(now >= this.lastObservedNow, 'clockBackwards');
    this.lastObservedNow = now;
    return now;
  }

  requestNew() {
    if (this.disposed || this.dialog?.open) return;
    const phase = this.state?.stage.phase;
    if (phase === 'duel-active' || phase === 'duel-preview') this.interrupt();
    this.dialog = confirmNewGame(strings[this.language], () => {
      if (this.disposed || !this.recovery.discard()) {
        this.renderPresentation();
        return;
      }
      this.timer.dispose();
      this.inputs.bind(null);
      this.state = null;
      this.workspace.model.unlock();
      this.feedback = {};
      this.render();
    });
  }

  restore() {
    this.state = this.recovery.load(this.clock.now(), this.sessionId()) ?? null;
    if (!this.state) return;
    this.workspace.model.lock();
    this.recovery.save(this.state);
    if (this.state.stage.phase === 'duel-interrupted')
      this.inputs.requireReleases();
    this.timer.bind(this.state);
  }

  retryRecovery() {
    if (this.disposed) return;
    if (this.state) {
      this.recovery.retrySave(this.state, this.clock.now(), this.sessionId());
    } else this.restore();
    this.renderPresentation();
  }

  /** @param {File} file */
  async importGame(file) {
    if (this.disposed || this.state) return;
    const state = await this.recovery.import(
      file,
      () => this.clock.now(),
      this.sessionId,
    );
    if (this.disposed) return;
    if (state) {
      this.state = state;
      this.workspace.model.lock();
      this.recovery.save(state);
      if (state.stage.phase === 'duel-interrupted')
        this.inputs.requireReleases();
      this.timer.bind(state);
    }
    this.renderPresentation();
  }

  setupChanged() {
    const changed = this.workspace.model.configure(this.settings);
    this.savePreferences();
    if (changed) this.render();
    else
      this.root
        .querySelector('.library-status')
        ?.replaceWith(this.workspace.statusView());
  }

  savePreferences() {
    this.workspace.savePreferences({
      language: this.language,
      theme: this.theme,
      setup: this.settings,
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
    this.inputs.dispose();
    this.recovery.dispose();
    this.viewListeners.abort();
    this.dialog?.close();
    this.workspace.dispose();
    this.root.replaceChildren();
  }
}
