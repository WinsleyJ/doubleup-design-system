// Bouwt per thema de token-output met Style Dictionary v5 (DTCG-formaat).
// Invoer per thema: src/themes/<thema>/** (incl. ouders via theme.json "extends") + src/common/** + src/components/**
// Uitvoer: dist/css/<thema>.css, dist/json/<thema>.json, dist/js/<thema>.js
//
// Kleurmodi (light/dark) en platform-formats (Cornerstone, theme.json, …) volgen in stap 2 en 4.

import StyleDictionary from 'style-dictionary';
import { listThemes, loadAllTokens, root, themeChain } from '../scripts/lib/themes.mjs';

const themes = listThemes();
if (themes.length === 0) {
  console.error('Geen thema’s gevonden in src/themes/.');
  process.exit(1);
}

for (const theme of themes) {
  const sd = new StyleDictionary({
    tokens: loadAllTokens(theme),
    usesDtcg: true,
    log: { verbosity: 'default', warnings: 'warn' },
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: `${root}/dist/css/`,
        files: [
          {
            destination: `${theme}.css`,
            format: 'css/variables',
            options: { selector: `[data-theme="${theme}"]`, outputReferences: true },
          },
        ],
      },
      json: {
        transformGroup: 'js',
        buildPath: `${root}/dist/json/`,
        files: [{ destination: `${theme}.json`, format: 'json/nested' }],
      },
      js: {
        transformGroup: 'js',
        buildPath: `${root}/dist/js/`,
        files: [{ destination: `${theme}.js`, format: 'javascript/esm' }],
      },
    },
  });

  await sd.buildAllPlatforms();
  console.log(`✔ thema "${theme}" gebouwd (${themeChain(theme).join(' → ')})`);
}
