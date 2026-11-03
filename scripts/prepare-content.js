import { mkdirSync, writeFileSync } from 'node:fs';
import { contentData } from './content-data.js';

const catalog = contentData(process.cwd());
mkdirSync('public', { recursive: true });
writeFileSync('public/catalog.json', JSON.stringify(catalog) + '\n');
console.log(`Prepared ${catalog.packs.length} runtime question decks`);
