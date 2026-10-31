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
import { Navigation } from './runtime/navigation.js';
import { portableGame } from './domain/portable.js';
import { displayCountdown } from './ui/countdown.js';

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
    this.settings.language = this.language;
    this.navigation = new Navigation(this);
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
      () => this.dialog === null,
    );
    this.keyboard = this.inputs.keyboard;
    this.recovery = new Recovery();
    this.inputs.controls.changed = (bindings) => {
      this.recovery.bindings = bindings;
      if (this.state) this.recovery.save(this.state);
      this.renderPresentation();
    };
    this.restore();
    this.render();
  }

  /** @param {import('./ui/setup.js').Setup} settings */
  start(settings) {
    if (this.disposed || this.state) return;
    this.guard(() => {
      this.workspace.model.configure(settings);
      const pack = this.workspace.model.packForStart();
      const state = createGame(
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
            length: 7,
            symbols: Object.keys(DUEL_SYMBOLS),
          },
        },
        this.now(),
        this.sessionId(),
      );
      portableGame(state, settings, this.inputs.controls.bindings);
      this.state = state;
      this.settings = settings;
      this.language = settings.language;
      this.recovery.settings = settings;
      this.recovery.bindings = this.inputs.controls.bindings;
      this.workspace.model.lock();
      this.savePreferences();
      this.recovery.save(this.state);
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
    this.inputs.board.reset();
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
    return (
      this.inputs.ready() && !this.dialog?.open && !this.inputs.dialog?.open
    );
  }

  /** @param {string} language @param {string} theme */
  changePresentation(language, theme) {
    if (!this.state) {
      this.language = language === 'cs' ? 'cs' : 'en';
      this.settings.language = this.language;
      this.workspace.model.configure(this.settings);
    }
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
    document.documentElement.dataset.playing = String(!!this.state);
    this.inputs.language = this.language;
    this.inputs.bind(this.state);
    this.root.replaceChildren(...applicationView(this, signal));
    delete this.feedback.flipCell;
    this.inputs.releaseFeedback();
    this.displayTime(this.clock.now());
    this.restoreFocus(focused);
  }

  /** @param {string | undefined} previous */
  restoreFocus(previous) {
    if (this.dialog?.open) return;
    const prior = previous ? document.getElementById(previous) : null;
    if (prior && prior.getAttribute('aria-disabled') !== 'true') {
      prior.focus({ preventScroll: true });
      return;
    }
    const next = this.root.querySelector('#answer, #phase-heading, #nameA');
    if (next instanceof HTMLElement) {
      next.focus({ preventScroll: true });
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
    displayCountdown(this.root, this.state, now);
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
    this.navigation.requestExit();
  }

  restore() {
    this.state = this.recovery.load(this.clock.now(), this.sessionId()) ?? null;
    if (!this.state) return;
    this.navigation.restoreSettings();
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
    if (state) this.navigation.imported(state);
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
      this.root.querySelector('#feedback')?.replaceChildren();
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
