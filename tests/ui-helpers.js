/** @param {import('../src/app.js').App} app */
export function prepare(app) {
  app.settings.mode = 'letters';
  app.settings.starter = 'A';
  app.workspace.model.configure(app.settings);
  app.navigation.boardChosen = true;
  app.navigation.go('desk');
}

/** @param {import('../src/app.js').App} app @param {string} selector @param {string} value */
export function setting(app, selector, value) {
  if (selector === '#theme') {
    setTheme(app, value);
    return true;
  }

  /** @param {import('../src/app.js').App} app @param {string} value */
  function setTheme(app, value) {
    if (app.theme !== value)
      document.querySelector('#theme')?.dispatchEvent(new MouseEvent('click'));
  }
  const options = ['#ui-language', '#language', '#seconds', '#starter'];
  const players = ['#nameA', '#nameB', '#colorA', '#colorB', '#answerMode'];
  if (selector === '#mode') {
    app.navigation.boardChosen = true;
    app.navigation.go('desk');
    document
      .querySelector(`#mode-${value}`)
      ?.dispatchEvent(new MouseEvent('click'));
    return true;
  }
  if (!options.includes(selector) && !players.includes(selector)) return false;
  if (app.state) throw new Error('Game settings are not editable during play');
  const previous = app.navigation.page;
  app.navigation.go(options.includes(selector) ? 'options' : 'players');
  const control = document.querySelector(
    selector === '#ui-language' ? '#language' : selector,
  );
  fillControl(control, value);
  app.savePreferences();
  app.navigation.go(previous);
  return true;
}

/** @param {Element | null} control @param {string} value */
function fillControl(control, value) {
  if (!(
    control instanceof HTMLInputElement || control instanceof HTMLSelectElement
  ))
    throw new Error('Missing setting');
  control.value = value;
  control.dispatchEvent(new Event('input', { bubbles: true }));
  control.dispatchEvent(new Event('change', { bubbles: true }));
}
