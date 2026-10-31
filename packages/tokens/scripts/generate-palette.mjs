// Genereert brand-kleurtokens voor een thema uit een klein invoerbestand.
// Gebruik: node scripts/generate-palette.mjs <thema>
// Invoer:  src/themes/<thema>/palette.json
// Uitvoer: src/themes/<thema>/brand-color.tokens.json (niet met de hand bewerken)
//
// Per kleurslot: schaal 50–950 en vulkleur-aliassen:
//   solid        = de ankerkleur (de merkkleur zelf)
//   on-solid     = wit of neutral.950, wat het meeste contrast geeft
//   solid-hover  = één stap richting méér contrast met on-solid
//   solid-active = twee stappen richting méér contrast met on-solid

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { contrast } from './lib/contrast.mjs';
import { generateScale, STEPS } from './lib/palette.mjs';
import { root } from './lib/themes.mjs';

const theme = process.argv[2];
if (!theme) {
  console.error('Gebruik: node scripts/generate-palette.mjs <thema>');
  process.exit(1);
}

const dir = join(root, 'src', 'themes', theme);
const cfg = JSON.parse(readFileSync(join(dir, 'palette.json'), 'utf8'));

const WHITE = '#ffffff';
const neutral = generateScale(cfg.colors.neutral.anchor, {
  kind: 'neutral',
  anchorStep: cfg.colors.neutral.anchorStep,
});
const INK = neutral.steps[950];

const stepFrom = (anchorStep, delta) => {
  const i = STEPS.indexOf(anchorStep);
  const j = i + delta;
  return STEPS[j] ?? STEPS[i - delta];
};

const color = { $type: 'color' };

for (const [slot, def] of Object.entries(cfg.colors)) {
  const { steps, anchorStep } =
    slot === 'neutral' ? neutral : generateScale(def.anchor, { kind: def.kind ?? 'color', anchorStep: def.anchorStep });
  const scale = {};
  if (def.kind === 'neutral') scale['0'] = { $value: WHITE };
  for (const [s, hex] of Object.entries(steps))
    scale[s] =
      Number(s) === anchorStep ? { $value: hex, $description: def.description ?? 'Ankerkleur' } : { $value: hex };

  const anchor = steps[anchorStep];
  const onDark = contrast(INK, anchor) >= contrast(WHITE, anchor); // tekst op de vulkleur is donker?
  const dir = onDark ? -1 : 1; // donkere tekst → lichtere hover; witte tekst → donkerdere hover
  scale.solid = { $value: `{brand.color.${slot}.${anchorStep}}`, $description: 'Vulkleur: de ankerkleur zelf' };
  scale['solid-hover'] = { $value: `{brand.color.${slot}.${stepFrom(anchorStep, dir)}}` };
  scale['solid-active'] = { $value: `{brand.color.${slot}.${stepFrom(anchorStep, 2 * dir)}}` };
  scale['on-solid'] = {
    $value: onDark ? '{brand.color.neutral.950}' : '{brand.color.neutral.0}',
    $description: `Tekst op de vulkleur (${Math.max(contrast(INK, anchor), contrast(WHITE, anchor))}:1)`,
  };
  color[slot] = scale;
}

const out = {
  $description: `Gegenereerd door scripts/generate-palette.mjs uit palette.json (${theme}). Niet met de hand bewerken.`,
  brand: { color },
};

const file = join(dir, 'brand-color.tokens.json');
writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
console.log(`✔ ${Object.keys(cfg.colors).length} kleurschalen geschreven naar ${file.replace(root + '/', '')}`);
