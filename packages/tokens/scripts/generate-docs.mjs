// Genereert tokendocumentatie: per laag alfabetisch (conform projectdocument "Design Tokens").
// Uitvoer: dist/docs/tokens.md (alle lagen) en dist/docs/themes.md (brand-waarden per thema).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { allTokens, layerOf, listThemes, loadAllTokens, loadBrandTokens, resolve, root } from './lib/themes.mjs';

const REF_THEME = 'doubleup';
const cssVar = (path) => `--${path.replaceAll('.', '-')}`;
const fmt = (v) => {
  if (Array.isArray(v)) return v.map((x) => (typeof x === 'object' ? JSON.stringify(x) : x)).join(', ');
  if (v && typeof v === 'object')
    return 'offsetX' in v ? `${v.offsetX} ${v.offsetY} ${v.blur} ${v.spread} ${v.color}` : JSON.stringify(v);
  return String(v);
};
const cell = (s) =>
  String(s ?? '')
    .replaceAll('|', '\\|')
    .replaceAll('\n', ' ');
const val = (tokens, path) => {
  try {
    return fmt(resolve(tokens, path));
  } catch {
    return '—';
  }
};

const light = loadAllTokens(REF_THEME, 'light');
const dark = loadAllTokens(REF_THEME, 'dark');
const tokens = allTokens(light).sort(([a], [b]) => a.localeCompare(b));

const groupOf = (path) => {
  const l = layerOf(path);
  if (l === 'brand') return 'Brand';
  if (l === 'common') return path.startsWith('basis.') ? 'Common · basis (NL DS)' : 'Common · dup-aanvullingen';
  return `Component · ${path.split('.')[1]}`;
};

const groups = new Map();
for (const t of tokens) {
  const l = groupOf(t[0]);
  if (!groups.has(l)) groups.set(l, []);
  groups.get(l).push(t);
}
const order = (l) => (l === 'Brand' ? 0 : l.startsWith('Common · basis') ? 1 : l.startsWith('Common') ? 2 : 3);
const layers = [...groups.keys()].sort((a, b) => order(a) - order(b) || a.localeCompare(b));

const out = [
  '# Design tokens — DoubleUP Design System',
  '',
  `Gegenereerd door \`scripts/generate-docs.mjs\`. Waarden van thema **${REF_THEME}**; brand-waarden per thema in \`themes.md\`.`,
  `Totaal: ${tokens.length} tokens. Binnen elke laag alfabetisch.`,
  '',
  '## Inhoud',
  '',
  ...layers.map(
    (l) =>
      `- [${l}](#${l
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/ +/g, '-')}) (${groups.get(l).length})`,
  ),
  '',
];
for (const l of layers) {
  out.push(
    `## ${l}`,
    '',
    '| Token | CSS-variabele | Type | Licht | Donker | Verwijst naar | Beschrijving |',
    '|---|---|---|---|---|---|---|',
  );
  for (const [path, node] of groups.get(l)) {
    const ref = typeof node.$value === 'string' && node.$value.startsWith('{') ? node.$value : '';
    const lv = val(light, path);
    const dv = val(dark, path);
    out.push(
      `| \`${path}\` | \`${cssVar(path)}\` | ${cell(node.$type)} | ${cell(lv)} | ${dv === lv ? '' : cell(dv)} | ${cell(ref)} | ${cell(node.$description)} |`,
    );
  }
  out.push('');
}

// Brand-waarden per thema naast elkaar
const themes = listThemes();
const brands = Object.fromEntries(themes.map((t) => [t, loadBrandTokens(t)]));
const brandPaths = [...new Set(themes.flatMap((t) => allTokens(brands[t]).map(([p]) => p)))].sort();
const th = [
  '# Brand-laag per thema',
  '',
  'Gegenereerd. Alle thema’s vullen dezelfde slots (ADR-003).',
  '',
  `| Token | ${themes.join(' | ')} |`,
  `|---|${themes.map(() => '---').join('|')}|`,
  ...brandPaths.map((p) => `| \`${p}\` | ${themes.map((t) => cell(val(brands[t], p))).join(' | ')} |`),
  '',
];

const dir = join(root, 'dist', 'docs');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'tokens.md'), out.join('\n'));
writeFileSync(join(dir, 'themes.md'), th.join('\n'));
console.log(
  `✔ documentatie: dist/docs/tokens.md (${tokens.length} tokens, ${layers.length} groepen) en dist/docs/themes.md`,
);
