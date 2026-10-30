import { randomPlayers } from '../ui/setup.js';
import { confirmNewGame } from '../ui/header.js';
import { strings } from '../ui/strings.js';

export class Navigation {
  /** @type {'menu'|'options'|'players'|'desk'|'import'} */
  page = 'menu';
  boardChosen = false;
  /** @type {import('../domain/types.js').Game | null} */
  pending = null;

  /** @param {import('../app.js').App} app */
  constructor(app) {
    this.app = app;
  }

  /** @param {'menu'|'options'|'players'|'desk'|'import'} page */
  go(page) {
    this.page = page;
    if (page === 'desk') this.app.savePreferences();
    if (page !== 'import') {
      this.pending = null;
      this.app.recovery.generation += 1;
    }
    this.app.renderPresentation();
  }

  newGame() {
    this.app.settings.players = randomPlayers(this.app.random, this.app.theme);
    this.boardChosen = false;
    this.go('players');
  }

  /** @param {boolean} [protectedOriginal] */
  requestExit(protectedOriginal = false) {
    const app = this.app;
    if (app.disposed || app.dialog) return;
    app.interrupt();
    confirmNewGame(app, strings[app.language], (save) =>
      this.finish(save, protectedOriginal),
    );
  }

  /** @param {boolean} save @param {boolean} protectedOriginal */
  finish(save, protectedOriginal) {
    const app = this.app;
    if (app.disposed) return false;
    if (save && app.state) {
      const now = app.clock.now();
      if (!Number.isFinite(now) || now < app.lastObservedNow) {
        app.recovery.error = 'clockBackwards';
        return false;
      }
      app.send({
        type: 'tick',
        sessionId: app.state.sessionId,
        revision: app.state.revision,
      });
      if (!app.recovery.export(app.state)) return false;
    }
    const cleared = protectedOriginal
      ? app.recovery.discard()
      : app.recovery.discardCurrent();
    if (!cleared) return false;
    app.timer.dispose();
    app.inputs.requireReleases();
    app.inputs.bind(null);
    app.state = null;
    const model = app.workspace.model;
    model.unlock();
    model.proposal = null;
    model.accepted = null;
    model.editing = null;
    model.language = '';
    app.feedback = {};
    this.page = 'menu';
    return true;
  }

  optionsChanged() {
    const app = this.app;
    app.language = app.settings.language;
    app.setupChanged();
    app.renderPresentation();
  }

  play() {
    const app = this.app;
    app.guard(() => {
      const pack = app.workspace.model.packForStart();
      if (
        app.settings.answerMode === 'hosted' &&
        !app.workspace.download(pack, true)
      )
        return;
      app.start(app.settings);
    });
  }

  /** @param {import('../domain/types.js').Game} state */
  imported(state) {
    this.pending = state;
    if (state.config.answerMode === 'automatic') this.adoptImport();
    else this.app.renderPresentation();
  }

  adoptImport() {
    const app = this.app;
    const state = this.pending;
    if (!state || app.disposed || app.state) return;
    if (
      state.config.answerMode === 'hosted' &&
      !app.workspace.download(state.pack, true)
    )
      return;
    this.pending = null;
    app.state = state;
    this.restoreSettings();
    app.workspace.model.lock();
    app.recovery.save(state);
    if (state.stage.phase === 'duel-interrupted') app.inputs.requireReleases();
    app.timer.bind(state);
    app.renderPresentation();
  }

  restoreSettings() {
    const app = this.app;
    const state = app.state;
    if (!state) return;
    app.settings = app.recovery.settings ?? {
      ...app.settings,
      language: state.pack.language,
      mode: state.pack.mode === 'letters' ? 'letters' : 'numbers',
      seconds: state.config.timeLimitMs / 1000,
      answerMode: state.config.answerMode,
      starter: state.config.starter,
    };
    app.language = app.settings.language;
    app.recovery.settings = app.settings;
    if (app.recovery.bindings)
      app.inputs.controls.restore(app.recovery.bindings);
    app.recovery.bindings = app.inputs.controls.bindings;
    app.savePreferences();
  }
}
