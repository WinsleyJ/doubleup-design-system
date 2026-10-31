// Deterministische controle van tokennamen en -formaat (geen LLM nodig).
// Regels: docs/conventies/naamgeving.md
//  1. Elk naamdeel: alleen a-z, 0-9 en koppeltekens; geen koppelteken aan begin/eind of dubbel.
//  2. Root moet 'brand', 'basis' of 'dup' zijn.
//  3. Bestanden in src/themes/** mogen alleen 'brand' (en overrides: 'basis'/'dup') bevatten;
//     src/common/** alleen 'basis' of 'dup'; src/components/** alleen 'dup'.
//  4. DTCG-formaat: tokens gebruiken '$value' (niet 'value') en hebben een '$type' (eigen of geërfd van groep).
// Exit code 1 bij fouten.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src');

const SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ROOTS = new Set(['brand', 'basis', 'dup']);

const allowedRoots = (file) => {
  const parts = relative(srcDir, file).split(sep);
  if (parts[0] === 'themes') return file.endsWith('overrides.tokens.json') ? ['basis', 'dup'] : ['brand'];
  if (parts[0] === 'common') return ['basis', 'dup'];
  if (parts[0] === 'components') return ['dup'];
  return [...ROOTS];
};

const files = [];
const collect = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) collect(p);
    else if (name.endsWith('.tokens.json')) files.push(p);
  }
};
collect(srcDir);

const errors = [];
let count = 0;

const walk = (node, path, inheritedType, file) => {
  if ('value' in node && !('$value' in node)) {
    errors.push(`${file}: ${path.join('.')} gebruikt 'value' i.p.v. '$value' (DTCG)`);
    return;
  }
  const type = node.$type ?? inheritedType;
  if ('$value' in node) {
    count++;
    if (!type) errors.push(`${file}: ${path.join('.')} heeft geen $type`);
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (!SEGMENT.test(key)) errors.push(`${file}: naamdeel "${key}" in ${[...path, key].join('.')} is ongeldig`);
    if (child && typeof child === 'object') walk(child, [...path, key], type, file);
  }
};

for (const file of files) {
  const rel = relative(root, file);
  let json;
  try {
    json = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`${rel}: ongeldige JSON (${e.message})`);
    continue;
  }
  const allowed = allowedRoots(file);
  for (const top of Object.keys(json)) {
    if (top.startsWith('$')) continue;
    if (!allowed.includes(top))
      errors.push(`${rel}: root "${top}" niet toegestaan hier (verwacht: ${allowed.join(', ')})`);
  }
  walk(json, [], undefined, rel);
}

if (errors.length) {
  console.error(`✖ ${errors.length} fout(en) in tokennamen/formaat:\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✔ ${count} tokens in ${files.length} bestand(en) voldoen aan de naamconventie`);
