// Thema's inlezen, inclusief overerving via theme.json { "extends": "<ander thema>" }.
// Gedeeld door build/build.mjs en scripts/check-contrast.mjs.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const srcDir = join(root, 'src');
export const themesDir = join(srcDir, 'themes');

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

export const deepMerge = (a, b) => {
  const out = { ...a };
  for (const [k, v] of Object.entries(b))
    out[k] = isObj(v) && isObj(out[k]) && !('$value' in v) ? deepMerge(out[k], v) : v;
  return out;
};

export const listThemes = () =>
  readdirSync(themesDir).filter((n) => statSync(join(themesDir, n)).isDirectory() && !n.startsWith('_'));

export const themeConfig = (theme) => {
  const p = join(themesDir, theme, 'theme.json');
  return existsSync(p) ? readJson(p) : {};
};

const tokenFiles = (dir) => {
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

/** Alle tokens van een thema (incl. ouders), samengevoegd. */
export const loadThemeTokens = (theme) =>
  themeChain(theme).reduce(
    (acc, t) => tokenFiles(join(themesDir, t)).reduce((a, f) => deepMerge(a, readJson(f)), acc),
    {},
  );

/** Thema-tokens + common + componenten = volledige invoer voor Style Dictionary. */
export const loadAllTokens = (theme) =>
  [...tokenFiles(join(srcDir, 'common')), ...tokenFiles(join(srcDir, 'components'))].reduce(
    (a, f) => deepMerge(a, readJson(f)),
    loadThemeTokens(theme),
  );

/** Rollen (roles.json) met overerving. */
export const loadRoles = (theme) =>
  themeChain(theme).reduce((acc, t) => {
    const p = join(themesDir, t, 'roles.json');
    return existsSync(p) ? deepMerge(acc, readJson(p)) : acc;
  }, {});

/** Waarde van een tokenpad, bv. 'brand.color.accent.200', referenties worden gevolgd. */
export const resolve = (tokens, path, depth = 0) => {
  if (depth > 10) throw new Error(`Te diepe verwijzing bij ${path}`);
  const node = path.split('.').reduce((n, k) => (n ? n[k] : undefined), tokens);
  if (!node || !('$value' in node)) throw new Error(`Token niet gevonden: ${path}`);
  const v = node.$value;
  const m = typeof v === 'string' && v.match(/^\{(.+)\}$/);
  return m ? resolve(tokens, m[1], depth + 1) : v;
};
