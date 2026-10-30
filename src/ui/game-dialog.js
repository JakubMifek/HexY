/** @param {import('../app.js').App} app @param {HTMLDialogElement} dialog
 * @param {AbortController} lifecycle @param {string} focusId */
export function mountGameDialog(app, dialog, lifecycle, focusId) {
  const close = () => {
    if (app.dialog !== dialog) return;
    lifecycle.abort();
    if (!app.disposed) app.inputs.requireReleases();
    app.dialog = null;
    dialog.close();
    dialog.remove();
    if (!app.disposed)
      (
        document.getElementById(focusId) ??
        document.getElementById('phase-heading')
      )?.focus({ preventScroll: true });
  };
  const signal = lifecycle.signal;
  // Native close is deferred; owned dismissal must revoke readiness before returning.
  dialog.addEventListener(
    'cancel',
    (event) => {
      event.preventDefault();
      close();
    },
    { signal },
  );
  dialog.addEventListener('close', close, { signal });
  app.dialog = dialog;
  document.body.append(dialog);
  dialog.showModal();
  return close;
}
