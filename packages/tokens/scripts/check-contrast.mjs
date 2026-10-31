// Toetst per thema × kleurmodus alle contrastvereisten tegen WCAG 2.2 AA.
// Een vereiste staat bij het voorgrond-token zelf:
//   "$extensions": { "dup.contrast": [{ "against": "<pad achtergrond>", "use": "text" | "large-text" | "non-text" }] }
// Exit code 1 als een paar niet voldoet. Rapport: dist/reports/contrast.md en contrast.json
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { evaluate } from './lib/contrast.mjs';
import { allTokens, listThemes, loadAllTokens, MODES, resolve, root } from './lib/themes.mjs';

const lines = ['# Contrastrapport (WCAG 2.2 AA)', ''];
const report = [];
let failures = 0;
let total = 0;

for (const theme of listThemes()) {
  for (const mode of MODES) {
    const tokens = loadAllTokens(theme, mode);
    const pairs = [];
    for (const [path, node] of allTokens(tokens)) {
      for (const req of node.$extensions?.['dup.contrast'] ?? []) {
        pairs.push({
          name: `${path} op ${req.against}`,
          fg: resolve(tokens, path),
          bg: resolve(tokens, req.against),
          use: req.use,
        });
      }
    }
    const results = evaluate(pairs);
    report.push({ theme, mode, results });
    const bad = results.filter((x) => !x.pass);
    total += results.length;
    failures += bad.length;
    lines.push(`## ${theme} · ${mode} — ${results.length - bad.length}/${results.length}`, '');
    if (bad.length) {
      lines.push('| Paar | Voorgrond | Achtergrond | Ratio | Min |', '|---|---|---|---|---|');
      for (const x of bad) lines.push(`| ${x.name} | \`${x.fg}\` | \`${x.bg}\` | ${x.ratio} | ${x.min} |`);
      lines.push('');
    }
    for (const x of bad)
      console.error(`✖ ${theme}/${mode}: ${x.name} — ${x.ratio}:1 < ${x.min}:1 (${x.fg} op ${x.bg})`);
  }
}

const dir = join(root, 'dist', 'reports');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'contrast.md'), lines.join('\n') + '\n');
writeFileSync(join(dir, 'contrast.json'), JSON.stringify(report));

if (failures) {
  console.error(`✖ ${failures} van ${total} contrastparen voldoen niet (rapport: dist/reports/contrast.md)`);
  process.exit(1);
}
console.log(`✔ ${total} contrastparen voldoen aan WCAG 2.2 AA (rapport: dist/reports/contrast.md)`);
