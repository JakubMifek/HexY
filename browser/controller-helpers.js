export async function installPads(page) {
  await page.addInitScript(() => {
    const pads = [0, 1].map((index) => ({
      index,
      id: `Boundary ${index}`,
      connected: true,
      mapping: 'standard',
      axes: [0, 0],
      buttons: Array.from({ length: 16 }, () => ({
        pressed: false,
        value: 0,
        touched: false,
      })),
    }));
    Object.defineProperty(navigator, 'getGamepads', {
      value: () => pads.map((pad) => (pad.connected ? pad : null)),
    });
    window.addEventListener('phase-ten-pad', (event) => {
      const {
        index = 0,
        button,
        held,
        axes,
        connected,
        mapping,
      } = event.detail;
      const pad = pads[index];
      if (button !== undefined) pad.buttons[button].pressed = held;
      if (axes) pad.axes = axes;
      if (connected !== undefined) pad.connected = connected;
      if (mapping !== undefined) pad.mapping = mapping;
    });
  });
}

export async function padEvent(page, detail, milliseconds = 16) {
  await page.evaluate(
    (detail) =>
      window.dispatchEvent(new CustomEvent('phase-ten-pad', { detail })),
    detail,
  );
  await page.clock.runFor(milliseconds);
}
