// Bouwt de assets van de child theme uit de packages (niet met de hand bewerken; staan in .gitignore):
//   child-theme/assets/css/{dup.css, themes/<thema>.css, all-themes.css}
//   child-theme/assets/fonts/{*.css, files/*.woff2}
//   child-theme/assets/tokens/<thema>.<modus>.json
//   child-theme/assets/cornerstone/globals.json  ← invoer voor `wp dup tokens sync`
import { copyFileSync, cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const assets = join(here, 'child-theme', 'assets');
const tokensDist = dirname(dirname(require.resolve('@doubleup/tokens/css/doubleup.css')));
const fontsDir = dirname(require.resolve('@doubleup/fonts/archivo.css'));

for (const d of ['css', 'fonts', 'tokens', 'cornerstone']) rmSync(join(assets, d), { recursive: true, force: true });
mkdirSync(join(assets, 'css', 'themes'), { recursive: true });
mkdirSync(join(assets, 'tokens'), { recursive: true });
mkdirSync(join(assets, 'cornerstone'), { recursive: true });

// CSS
copyFileSync(require.resolve('@doubleup/css'), join(assets, 'css', 'dup.css'));
const themes = readdirSync(join(tokensDist, 'css')).filter((f) => f.endsWith('.css') && f !== 'all-themes.css');
for (const f of themes) copyFileSync(join(tokensDist, 'css', f), join(assets, 'css', 'themes', f));
copyFileSync(join(tokensDist, 'css', 'all-themes.css'), join(assets, 'css', 'all-themes.css'));

// Fonts (css + woff2 + licenties)
cpSync(fontsDir, join(assets, 'fonts'), {
  recursive: true,
  filter: (s) => !s.includes('node_modules') && !s.endsWith('package.json') && !s.endsWith('README.md'),
});

// Tokens (JSON per thema × modus)
for (const f of readdirSync(join(tokensDist, 'json')).filter((f) => /\.(light|dark)\.json$/.test(f)))
  copyFileSync(join(tokensDist, 'json', f), join(assets, 'tokens', f));

// Globals voor Cornerstone: semantische kleuren en variabelen, altijd als verwijzing (thema- en modusbewust)
const COLORS = [
  ['dup-text', 'Tekst', '--basis-color-default-color-document'],
  ['dup-text-subtle', 'Tekst subtiel', '--basis-color-default-color-subtle'],
  ['dup-bg', 'Achtergrond', '--basis-color-default-bg-document'],
  ['dup-bg-subtle', 'Vlak', '--basis-color-default-bg-subtle'],
  ['dup-border', 'Rand', '--basis-color-default-border-default'],
  ['dup-border-subtle', 'Rand subtiel', '--basis-color-default-border-subtle'],
  ['dup-action', 'Actie', '--dup-color-action-1-bg-solid'],
  ['dup-on-action', 'Tekst op actie', '--dup-color-action-1-color-on-solid'],
  ['dup-link', 'Link', '--basis-color-action-1-color-default'],
  ['dup-accent', 'Accent', '--dup-color-accent-1-bg-solid'],
  ['dup-info', 'Info', '--basis-color-info-color-default'],
  ['dup-positive', 'Positief', '--basis-color-positive-color-default'],
  ['dup-warning', 'Waarschuwing', '--basis-color-warning-color-default'],
  ['dup-negative', 'Negatief', '--basis-color-negative-color-default'],
];
const SIZES = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
const VARIABLES = [
  ...SIZES.map((s) => [`ds-space-${s}`, `--basis-space-block-${s}`]),
  ...['sm', 'md', 'lg', 'round'].map((r) => [`ds-radius-${r}`, `--basis-border-radius-${r}`]),
  ...['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'].map((s) => [`ds-font-size-${s}`, `--basis-text-font-size-${s}`]),
  ['ds-font-body', '--basis-text-font-family-default'],
  ['ds-font-display', '--basis-heading-font-family'],
  ['ds-heading-stretch', '--dup-heading-font-stretch'],
  ['ds-shadow-md', '--basis-box-shadow-md'],
  ['ds-page-width', '--basis-page-max-inline-size'],
];

// Controle: elke verwezen variabele moet bestaan in het thema
const defined = new Set(
  [...readFileSync(join(tokensDist, 'css', 'doubleup.css'), 'utf8').matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1]),
);
const missing = [...COLORS.map((c) => c[2]), ...VARIABLES.map((v) => v[1])].filter((v) => !defined.has(v));
if (missing.length) throw new Error(`Onbekende tokens in globals: ${missing.join(', ')}`);

const globals = {
  $description:
    'Gegenereerd door adapters/cornerstone/build.mjs. Invoer voor `wp dup tokens sync`. Alleen items met prefix dup-/ds- worden beheerd.',
  colors: COLORS.map(([id, title, v]) => ({ _id: id, title, value: `var(${v})` })),
  variables: VARIABLES.map(([id, v]) => ({ id, value: `var(${v})` })),
};
writeFileSync(join(assets, 'cornerstone', 'globals.json'), JSON.stringify(globals, null, 2) + '\n');
console.log(
  `✔ child-theme assets: ${themes.length} thema's, ${globals.colors.length} global colors, ${globals.variables.length} global variables`,
);
