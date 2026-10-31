// Contractcontrole per thema × kleurmodus:
//  1. Brand: elk thema (incl. ouders) vult alle verplichte slots (ADR-003).
//  2. Common: elke definitie uit NL DS basis (vastgepinde versie) heeft een waarde.
//  3. Referenties: elke {verwijzing} bestaat.
//  4. Laagregel: component-tokens (dup.<component>) verwijzen niet naar brand.
// Exit code 1 bij fouten.
import { createRequire } from 'node:module';
import {
  allTokens,
  getNode,
  layerOf,
  listThemes,
  loadAllTokens,
  loadBrandTokens,
  MODES,
  readJson,
} from './lib/themes.mjs';

const require = createRequire(import.meta.url);
const basisDef = readJson(require.resolve('@nl-design-system-unstable/basis-design-tokens/src/tokens.json'));
const basisVersion = readJson(require.resolve('@nl-design-system-unstable/basis-design-tokens/package.json')).version;

// Definities uit basis: een node met $type en zonder kind-objecten is een token.
const basisPaths = [];
const walkDef = (n, p) => {
  const children = Object.entries(n).filter(([k, v]) => !k.startsWith('$') && v && typeof v === 'object');
  if ('$type' in n && children.length === 0) return basisPaths.push(p.join('.'));
  for (const [k, v] of children) walkDef(v, [...p, k]);
};
walkDef(basisDef, []);

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const SOLID = ['solid', 'solid-hover', 'solid-active', 'on-solid'];
const BRAND_SLOTS = [
  'brand.color.neutral.0',
  ...['neutral', 'accent', 'info', 'positive', 'warning', 'negative'].flatMap((s) =>
    [...STEPS, ...SOLID].map((x) => `brand.color.${s}.${x}`),
  ),
  ...['display', 'body', 'mono'].map((x) => `brand.font-family.${x}`),
  ...['normal', 'display'].map((x) => `brand.font-stretch.${x}`),
  ...[0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((x) => `brand.space.${x}`),
  ...['pointer-target', 'page', 'measure'].map((x) => `brand.size.${x}`),
  ...['none', 's', 'm', 'l', 'pill'].map((x) => `brand.radius.${x}`),
  ...['s', 'm', 'l'].map((x) => `brand.border-width.${x}`),
  ...['subtle', 'disabled'].map((x) => `brand.opacity.${x}`),
  ...['s', 'm', 'l'].map((x) => `brand.shadow.${x}`),
  ...['fast', 'normal', 'slow'].map((x) => `brand.duration.${x}`),
  'brand.easing.standard',
  ...['regular', 'medium', 'semibold', 'bold', 'black'].map((x) => `brand.font-weight.${x}`),
  ...['tight', 'snug', 'normal'].map((x) => `brand.line-height.${x}`),
  ...['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'].map((x) => `brand.font-size.${x}`),
];

const isToken = (n) => n && typeof n === 'object' && '$value' in n;
const errors = [];

for (const theme of listThemes()) {
  const brand = loadBrandTokens(theme);
  for (const slot of BRAND_SLOTS)
    if (!isToken(getNode(brand, slot))) errors.push(`${theme}: brand-slot ontbreekt: ${slot}`);

  for (const mode of MODES) {
    const tokens = loadAllTokens(theme, mode);
    for (const p of basisPaths)
      if (!isToken(getNode(tokens, p))) errors.push(`${theme}/${mode}: basis-token zonder waarde: ${p}`);
    for (const [path, node] of allTokens(tokens)) {
      const refs = JSON.stringify(node.$value).match(/\{[^{}"]+\}/g) ?? [];
      for (const r of refs) {
        const target = r.slice(1, -1);
        if (!isToken(getNode(tokens, target)))
          errors.push(`${theme}/${mode}: ${path} verwijst naar onbekend token ${r}`);
        if (layerOf(path) === 'component' && target.startsWith('brand.'))
          errors.push(`${theme}/${mode}: component-token ${path} verwijst naar brand (${r}); gebruik common`);
      }
    }
  }
}

const unique = [...new Set(errors)];
if (unique.length) {
  console.error(
    `✖ ${unique.length} contractfout(en):\n` +
      unique
        .slice(0, 50)
        .map((e) => `  - ${e}`)
        .join('\n'),
  );
  process.exit(1);
}
console.log(
  `✔ contract: ${listThemes().length} thema's × ${MODES.length} modi vullen ${BRAND_SLOTS.length} brand-slots en ${basisPaths.length} basis-tokens (v${basisVersion})`,
);
