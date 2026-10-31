// Hulpfuncties voor de documentatiepagina's (geen component-CSS; alleen voor Storybook).
import ALL from '@doubleup/tokens/json/all-themes.json';
import CONTRAST from '@doubleup/tokens/reports/contrast.json';

export const tokensFor = (theme, mode) => ALL.tokens[theme]?.[mode] ?? ALL.tokens.doubleup.light;
export const contrastFor = (theme, mode) => CONTRAST.find((r) => r.theme === theme && r.mode === mode)?.results ?? [];
export const get = (obj, path) => path.split('.').reduce((n, k) => n?.[k], obj);
export const cssVar = (path) => `--${path.replaceAll('.', '-')}`;
export const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Platte lijst [pad, waarde] van een geneste token-JSON. */
export const flatten = (obj, prefix = []) =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? flatten(v, [...prefix, k]) : [[[...prefix, k].join('.'), v]],
  );

const lum = (hex) => {
  const m = String(hex).match(/^#([0-9a-f]{6})/i);
  if (!m) return null;
  const c = [0, 2, 4]
    .map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  if (x === null || y === null) return null;
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
/** Tekstkleur (zwart of wit) met het meeste contrast op een achtergrond. */
export const onColor = (bg) => ((ratio('#000000', bg) ?? 21) >= (ratio('#ffffff', bg) ?? 0) ? '#000000' : '#ffffff');
export const nl = (n) => (n == null ? '—' : n.toFixed(2).replace('.', ','));
