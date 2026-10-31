// Bouwt per thema de token-output met Style Dictionary v5 (DTCG-formaat), in light en dark.
//
// CSS (dist/css/<thema>.css), één bestand per thema:
//   [data-theme="t"]                              → alle tokens, lichte waarden
//   [data-theme="t"][data-color-scheme="dark"]    → alleen modus-tokens, donker
//   @media (prefers-color-scheme: dark) { [data-theme="t"]:not([data-color-scheme="light"]) … }
// Regel: data-color-scheme staat altijd samen met data-theme op hetzelfde element.
// Alle selectors zijn even specifiek, dus het dichtstbijzijnde thema wint; geneste secties
// (donkere band op lichte pagina, of een ander thema in een showcase) werken zo betrouwbaar.
//
// Verder: dist/css/all-themes.css, dist/json/<thema>.<modus>.json, dist/json/all-themes.json, dist/js/<thema>.<modus>.js

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import StyleDictionary from 'style-dictionary';
import { formattedVariables } from 'style-dictionary/utils';
import { listThemes, loadAllTokens, MODES, modePaths, root, themeChain } from '../scripts/lib/themes.mjs';

const dist = `${root}/dist`;
rmSync(dist, { recursive: true, force: true });

StyleDictionary.registerFormat({
  name: 'dup/css-mode',
  format: ({ dictionary, options }) => {
    const { theme, mode } = options;
    const t = `[data-theme="${theme}"]`;
    const vars = formattedVariables({ format: 'css', dictionary, outputReferences: true, usesDtcg: true });
    if (mode === 'light') return `${t} {\n  color-scheme: light;\n${vars}\n}\n`;
    const body = `  color-scheme: dark;\n${vars}`;
    return (
      `${t}[data-color-scheme="dark"] {\n${body}\n}\n\n` +
      `@media (prefers-color-scheme: dark) {\n  ${t}:not([data-color-scheme="light"]) {\n${body.replace(/^/gm, '  ')}\n  }\n}\n`
    );
  },
});

const themes = listThemes();
if (themes.length === 0) {
  console.error('Geen thema’s gevonden in src/themes/.');
  process.exit(1);
}

const css = [];
for (const theme of themes) {
  const parts = [];
  for (const mode of MODES) {
    const only = mode === 'dark' ? modePaths(theme, 'dark') : null;
    const sd = new StyleDictionary({
      tokens: loadAllTokens(theme, mode),
      usesDtcg: true,
      log: { verbosity: 'silent', warnings: 'disabled' },
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath: `${dist}/tmp/`,
          files: [
            {
              destination: `${theme}.${mode}.css`,
              format: 'dup/css-mode',
              filter: only ? (token) => only.has(token.path.join('.')) : undefined,
              options: { theme, mode },
            },
          ],
        },
        json: {
          transformGroup: 'js',
          buildPath: `${dist}/json/`,
          files: [{ destination: `${theme}.${mode}.json`, format: 'json/nested' }],
        },
        js: {
          transformGroup: 'js',
          buildPath: `${dist}/js/`,
          files: [{ destination: `${theme}.${mode}.js`, format: 'javascript/esm' }],
        },
      },
    });
    await sd.buildAllPlatforms();
    parts.push(readFileSync(`${dist}/tmp/${theme}.${mode}.css`, 'utf8'));
  }
  const file = `/**\n * DoubleUP Design System — thema "${theme}" (${themeChain(theme).join(' → ')})\n * Gegenereerd; niet met de hand bewerken.\n */\n\n${parts.join('\n')}`;
  mkdirSync(`${dist}/css`, { recursive: true });
  writeFileSync(`${dist}/css/${theme}.css`, file);
  css.push(file);
  console.log(`✔ thema "${theme}" gebouwd (light + dark)`);
}
writeFileSync(`${dist}/css/all-themes.css`, css.join('\n'));
// Alle thema's × modi in één JSON (voor Storybook-documentatie en exports)
const all = { themes, modes: MODES, tokens: {} };
for (const theme of themes) {
  all.tokens[theme] = {};
  for (const mode of MODES)
    all.tokens[theme][mode] = JSON.parse(readFileSync(`${dist}/json/${theme}.${mode}.json`, 'utf8'));
}
writeFileSync(`${dist}/json/all-themes.json`, JSON.stringify(all));
rmSync(`${dist}/tmp`, { recursive: true, force: true });
console.log(`✔ dist/css/all-themes.css (${themes.length} thema's)`);
