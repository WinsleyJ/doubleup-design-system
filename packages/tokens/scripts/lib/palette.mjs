// Kleurschalen genereren in OKLCH, verankerd op een merkkleur.
// Herbruikbaar voor elk thema (skill: nieuw-thema).
//
// - Lichtheid (L) volgt een vaste curve per stap, zodat schalen van verschillende
//   tinten onderling vergelijkbaar zijn (stap 700 van rood ≈ even donker als 700 van blauw).
// - De ankerkleur komt exact terug op de stap waarvan de L het dichtst bij ligt.
// - Chroma volgt een curve rond de chroma van het anker en wordt binnen sRGB gehouden.

import { clampChroma, converter, formatHex } from 'culori';

const toOklch = converter('oklch');

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Doel-lichtheid per stap (OKLCH L, 0–1).
export const LIGHTNESS = {
  50: 0.975,
  100: 0.95,
  200: 0.9,
  300: 0.83,
  400: 0.74,
  500: 0.64,
  600: 0.55,
  700: 0.47,
  800: 0.39,
  900: 0.3,
  950: 0.22,
};

// Chroma-factor per stap t.o.v. de piek (kleuren) of t.o.v. het anker (neutral).
const CHROMA_CURVE = {
  color: {
    50: 0.14,
    100: 0.24,
    200: 0.42,
    300: 0.64,
    400: 0.85,
    500: 1,
    600: 1,
    700: 0.92,
    800: 0.8,
    900: 0.66,
    950: 0.52,
  },
  neutral: {
    50: 0.3,
    100: 0.38,
    200: 0.46,
    300: 0.55,
    400: 0.65,
    500: 0.75,
    600: 0.82,
    700: 0.88,
    800: 0.93,
    900: 0.97,
    950: 1,
  },
};

const hex = (l, c, h) => formatHex(clampChroma({ mode: 'oklch', l, c, h }, 'oklch'));

/**
 * @param {string} anchorHex  merkkleur, bv. '#111318'
 * @param {object} [opts]
 * @param {'color'|'neutral'} [opts.kind='color']
 * @param {number} [opts.anchorStep]  forceer op welke stap het anker komt
 * @param {Record<number, number>} [opts.lightness]  afwijkende L-curve
 * @returns {{ steps: Record<number,string>, anchorStep: number }}
 */
export function generateScale(anchorHex, opts = {}) {
  const kind = opts.kind ?? 'color';
  const L = { ...LIGHTNESS, ...(opts.lightness ?? {}) };
  const a = toOklch(anchorHex);
  const hue = a.h ?? 0;
  const anchorStep =
    opts.anchorStep ?? STEPS.reduce((best, s) => (Math.abs(L[s] - a.l) < Math.abs(L[best] - a.l) ? s : best), STEPS[0]);

  const curve = CHROMA_CURVE[kind];
  // Piek-chroma zo kiezen dat de curve exact door het anker gaat.
  const peak = a.c / curve[anchorStep];

  const steps = {};
  for (const s of STEPS) {
    steps[s] = s === anchorStep ? formatHex(anchorHex) : hex(L[s], peak * curve[s], hue);
  }
  return { steps, anchorStep };
}
