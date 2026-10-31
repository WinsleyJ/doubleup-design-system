// Thema's en lagen inlezen, met overerving (theme.json → extends) en kleurmodi.
// Gedeeld door build/build.mjs en de check-scripts.
//
// Volgorde van samenvoegen (later wint):
//   1. brand-bestanden van het thema (incl. ouders)
//   2. common (basis + dup), algemeen + modus-specifiek (*.light|dark.tokens.json)
//   3. components
//   4. overrides van het thema zelf: overrides.tokens.json + overrides.<modus>.tokens.json
//      (extends erft alleen de brand-laag; overrides en roles.json worden NIET geërfd)

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const srcDir = join(root, 'src');
export const themesDir = join(srcDir, 'themes');
export const MODES = ['light', 'dark'];

export const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const isToken = (v) => isObj(v) && '$value' in v;

/** Diep samenvoegen; bij twee tokens worden velden samengevoegd ($extensions blijft behouden). */
export const deepMerge = (a, b) => {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    if (isToken(v) && isToken(out[k])) out[k] = { ...out[k], ...v };
    else if (isObj(v) && isObj(out[k]) && !isToken(v)) out[k] = deepMerge(out[k], v);
    else out[k] = v;
  }
  return out;
};

export const listThemes = () =>
  readdirSync(themesDir).filter((n) => statSync(join(themesDir, n)).isDirectory() && !n.startsWith('_'));

export const themeConfig = (theme) => {
  const p = join(themesDir, theme, 'theme.json');
  return existsSync(p) ? readJson(p) : {};
};

/** Modus van een bestand: 'light' | 'dark' | null (geldt voor beide). */
export const fileMode = (file) => basename(file).match(/\.(light|dark)\.tokens\.json$/)?.[1] ?? null;
const isOverrides = (file) => /^overrides(\.(light|dark))?\.tokens\.json$/.test(basename(file));
const forMode = (mode) => (f) => fileMode(f) === null || fileMode(f) === mode;

export const tokenFiles = (dir) => {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir).sort()) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...tokenFiles(p));
    else if (n.endsWith('.tokens.json')) out.push(p);
  }
  return out;
};

/** Keten van thema's van basis naar specifiek, bv. ['doubleup', 'showcase-blauw']. */
export const themeChain = (theme, seen = []) => {
  if (seen.includes(theme)) throw new Error(`Cyclische extends: ${[...seen, theme].join(' → ')}`);
  const parent = themeConfig(theme).extends;
  return parent ? [...themeChain(parent, [...seen, theme]), theme] : [theme];
};

const mergeFiles = (acc, files) => files.reduce((a, f) => deepMerge(a, readJson(f)), acc);
const themeFiles = (theme) => themeChain(theme).flatMap((t) => tokenFiles(join(themesDir, t)));
const ownFiles = (theme) => tokenFiles(join(themesDir, theme));

/** Alleen de brand-laag van een thema (incl. ouders). */
export const loadBrandTokens = (theme) =>
  mergeFiles(
    {},
    themeFiles(theme).filter((f) => !isOverrides(f)),
  );

/** Alles voor één thema in één modus: invoer voor Style Dictionary en de checks. */
export const loadAllTokens = (theme, mode = 'light') => {
  const m = forMode(mode);
  let t = loadBrandTokens(theme);
  t = mergeFiles(t, tokenFiles(join(srcDir, 'common')).filter(m));
  t = mergeFiles(t, tokenFiles(join(srcDir, 'components')).filter(m));
  t = mergeFiles(
    t,
    ownFiles(theme).filter((f) => isOverrides(f) && m(f)),
  );
  return t;
};

/** Tokenpaden die in een modus-specifiek bestand staan (common of overrides van dit thema). */
export const modePaths = (theme, mode) => {
  const files = [
    ...tokenFiles(join(srcDir, 'common')),
    ...tokenFiles(join(srcDir, 'components')),
    ...ownFiles(theme).filter(isOverrides),
  ].filter((f) => fileMode(f) === mode);
  const paths = new Set();
  const walk = (n, p) => {
    if (isToken(n)) return paths.add(p.join('.'));
    if (isObj(n)) for (const [k, v] of Object.entries(n)) if (!k.startsWith('$')) walk(v, [...p, k]);
  };
  for (const f of files) walk(readJson(f), []);
  return paths;
};

export const getNode = (tokens, path) => path.split('.').reduce((n, k) => (n ? n[k] : undefined), tokens);

/** Waarde van een tokenpad, referenties worden gevolgd. */
export const resolve = (tokens, path, depth = 0) => {
  if (depth > 20) throw new Error(`Te diepe verwijzing bij ${path}`);
  const node = getNode(tokens, path);
  if (!isToken(node)) throw new Error(`Token niet gevonden: ${path}`);
  const v = node.$value;
  const m = typeof v === 'string' && v.match(/^\{(.+)\}$/);
  return m ? resolve(tokens, m[1], depth + 1) : v;
};

/** Alle tokens als [pad, node]-paren. */
export const allTokens = (tokens) => {
  const out = [];
  const walk = (n, p) => {
    if (isToken(n)) return out.push([p.join('.'), n]);
    if (isObj(n)) for (const [k, v] of Object.entries(n)) if (!k.startsWith('$')) walk(v, [...p, k]);
  };
  walk(tokens, []);
  return out;
};
