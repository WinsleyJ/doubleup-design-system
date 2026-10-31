// Genereert brand-kleurtokens voor een thema uit een klein invoerbestand.
// Gebruik: node scripts/generate-palette.mjs <thema>
// Invoer:  src/themes/<thema>/palette.json
// Uitvoer: src/themes/<thema>/brand-color.tokens.json (niet met de hand bewerken)

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateScale } from './lib/palette.mjs';

const theme = process.argv[2];
if (!theme) {
  console.error('Gebruik: node scripts/generate-palette.mjs <thema>');
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src', 'themes', theme);
const cfg = JSON.parse(readFileSync(join(dir, 'palette.json'), 'utf8'));

const toTokens = (steps, anchorStep, anchorNote) =>
  Object.fromEntries(
    Object.entries(steps).map(([s, hex]) => [
      s,
      Number(s) === anchorStep ? { $value: hex, $description: anchorNote } : { $value: hex },
    ]),
  );

const color = { $type: 'color' };

for (const [slot, def] of Object.entries(cfg.colors)) {
  const { steps, anchorStep } = generateScale(def.anchor, { kind: def.kind ?? 'color', anchorStep: def.anchorStep });
  const scale = toTokens(steps, anchorStep, def.description ?? 'Ankerkleur');
  if (def.kind === 'neutral') {
    scale['0'] = { $value: '#ffffff' };
    // Volgorde 0, 50 … 950
    color[slot] = { 0: scale['0'], ...Object.fromEntries(Object.entries(scale).filter(([k]) => k !== '0')) };
  } else {
    color[slot] = scale;
  }
}

const out = {
  $description: `Gegenereerd door scripts/generate-palette.mjs uit palette.json (${theme}). Niet met de hand bewerken.`,
  brand: { color },
};

const file = join(dir, 'brand-color.tokens.json');
writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
console.log(`✔ ${Object.keys(cfg.colors).length} kleurschalen geschreven naar ${file.replace(root + '/', '')}`);
