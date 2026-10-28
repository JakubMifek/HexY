import cs from './general-cs-01.json';
import en from './general-en-01.json';
import { validatePack } from '../domain/packs.js';

export function bundledPacks() {
  return [validatePack(cs), validatePack(en)];
}
