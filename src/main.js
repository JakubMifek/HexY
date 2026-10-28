import { message } from './messages.js';
import './style.css';

const status = document.querySelector('#status');
if (status) status.textContent = message('en', 'foundation');
