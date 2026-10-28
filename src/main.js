import { App } from './app.js';
import { browserClock } from './runtime/clock.js';
import './style.css';

const root = document.querySelector('#app');
if (!(root instanceof HTMLElement)) throw new Error('Missing application root');
const app = new App(
  root,
  browserClock,
  () => Math.random(),
  () => crypto.randomUUID(),
);
window.addEventListener(
  'pagehide',
  (event) => {
    app.dispose();
    if (event.persisted) {
      window.addEventListener('pageshow', () => window.location.reload(), {
        once: true,
      });
    }
  },
  { once: true },
);
