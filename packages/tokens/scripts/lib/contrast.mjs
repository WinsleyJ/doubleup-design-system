// WCAG 2.x contrastberekening.
import { wcagContrast } from 'culori';

export const contrast = (fg, bg) => Math.round(wcagContrast(fg, bg) * 100) / 100;

/** Minimale ratio per soort gebruik (WCAG 2.2 AA). */
export const MIN = {
  text: 4.5, // 1.4.3 normale tekst
  'large-text': 3, // 1.4.3 grote tekst (≥ 24px, of ≥ 18,66px vet)
  'non-text': 3, // 1.4.11 randen van bedieningselementen, focusindicator, iconen
};

/**
 * @param {{ name: string, fg: string, bg: string, use: keyof MIN }[]} pairs
 * @returns {{ name, fg, bg, use, ratio, min, pass }[]}
 */
export const evaluate = (pairs) =>
  pairs.map((p) => {
    const ratio = contrast(p.fg, p.bg);
    const min = MIN[p.use];
    return { ...p, ratio, min, pass: ratio >= min };
  });
