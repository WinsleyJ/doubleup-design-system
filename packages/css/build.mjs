// Bundelt src/index.css (met @imports) tot één bestand: dist/dup.css.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const src = new URL('./src/', import.meta.url);
const index = readFileSync(new URL('index.css', src), 'utf8');
const parts = [...index.matchAll(/@import '\.\/(.+?)';/g)].map(
  ([, f]) => `/* ${f} */\n` + readFileSync(new URL(f, src), 'utf8'),
);
mkdirSync(new URL('./dist/', import.meta.url), { recursive: true });
writeFileSync(
  new URL('./dist/dup.css', import.meta.url),
  `/* DoubleUP Design System — referentiecomponenten (gegenereerd). */\n\n${parts.join('\n')}`,
);
console.log(`✔ dist/dup.css (${parts.length} bestanden)`);
