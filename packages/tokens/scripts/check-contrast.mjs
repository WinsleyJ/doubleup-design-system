// Toetst per thema × kleurmodus de contrastparen tegen WCAG 2.2 AA.
// Rollen komen uit src/themes/<thema>/roles.json (met overerving); waarden uit de brand-tokens.
// Exit code 1 als een paar niet voldoet. Rapport: dist/reports/contrast.md
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { evaluate } from './lib/contrast.mjs';
import { listThemes, loadRoles, loadThemeTokens, resolve, root } from './lib/themes.mjs';

// [naam, voorgrond-rol, achtergrond-rol, soort]
const PAIRS = [
  ['Tekst standaard', 'text', 'bg', 'text'],
  ['Tekst subtiel', 'muted', 'bg', 'text'],
  ['Tekst subtiel op vlak', 'muted', 'subtle', 'text'],
  ['Link', 'link', 'bg', 'text'],
  ['Link op vlak', 'link', 'subtle', 'text'],
  ['Link hover', 'link-hover', 'bg', 'text'],
  ['Primaire knop: tekst', 'action-fg', 'action-bg', 'text'],
  ['Primaire knop: hover', 'action-fg', 'action-hover', 'text'],
  ['Focus-indicator', 'focus', 'bg', 'non-text'],
  ['Rand invoerveld', 'input-border', 'bg', 'non-text'],
  ...['info', 'positive', 'warning', 'negative'].flatMap((k) => [
    [`Melding ${k}: tekst`, `feedback-${k}-text`, `feedback-${k}-bg`, 'text'],
    [`Melding ${k}: rand`, `feedback-${k}-border`, `feedback-${k}-bg`, 'non-text'],
  ]),
];

const lines = ['# Contrastrapport (WCAG 2.2 AA)', ''];
let failures = 0;
let total = 0;

for (const theme of listThemes()) {
  const tokens = loadThemeTokens(theme);
  const roles = loadRoles(theme);
  for (const mode of ['light', 'dark']) {
    const r = roles[mode];
    if (!r) {
      console.error(`✖ ${theme}: geen rollen voor modus "${mode}" in roles.json`);
      failures++;
      continue;
    }
    const val = (role) => {
      if (!r[role]) throw new Error(`${theme}/${mode}: rol "${role}" ontbreekt in roles.json`);
      return resolve(tokens, r[role]);
    };
    const results = evaluate(PAIRS.map(([name, fg, bg, use]) => ({ name, fg: val(fg), bg: val(bg), use })));
    const bad = results.filter((x) => !x.pass);
    total += results.length;
    failures += bad.length;
    lines.push(
      `## ${theme} · ${mode}`,
      '',
      '| Paar | Voorgrond | Achtergrond | Ratio | Min | |',
      '|---|---|---|---|---|---|',
    );
    for (const x of results)
      lines.push(`| ${x.name} | \`${x.fg}\` | \`${x.bg}\` | ${x.ratio} | ${x.min} | ${x.pass ? '✅' : '❌'} |`);
    lines.push('');
    for (const x of bad) console.error(`✖ ${theme}/${mode}: ${x.name} ${x.ratio}:1 < ${x.min}:1 (${x.fg} op ${x.bg})`);
  }
}

const dir = join(root, 'dist', 'reports');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'contrast.md'), lines.join('\n') + '\n');

if (failures) {
  console.error(`✖ ${failures} van ${total} contrastparen voldoen niet (rapport: dist/reports/contrast.md)`);
  process.exit(1);
}
console.log(`✔ ${total} contrastparen voldoen aan WCAG 2.2 AA (rapport: dist/reports/contrast.md)`);
