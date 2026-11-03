import { App } from './app.js';
import { browserClock } from './runtime/clock.js';
import { startApplication } from './runtime/startup.js';
import './style.css';
import './studio.css';

const root = document.querySelector('#app');
if (!(root instanceof HTMLElement)) throw new Error('Missing application root');
const startup = startApplication(
  root,
  (packs) =>
    new App(
      root,
      browserClock,
      () => Math.random(),
      () => crypto.randomUUID(),
      packs,
    ),
  document
    .querySelector('meta[name="hexy-catalog"]')
    ?.getAttribute('content') ?? new URL('catalog.json', document.baseURI).href,
  navigator.language.startsWith('cs') ? 'cs' : 'en',
);
window.addEventListener(
  'pagehide',
  (event) => {
    startup.dispose();
    if (event.persisted) {
      window.addEventListener('pageshow', () => window.location.reload(), {
        once: true,
      });
    }
  },
  { once: true },
);
await startup.ready;
