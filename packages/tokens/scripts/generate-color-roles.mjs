// Genereert de kleur-common-laag (NL DS basis.color.* + dup.color.*) per kleurmodus,
// plus per thema de afwijkingen uit roles.json als overrides.
//
// Uitvoer:
//   src/common/color.light.tokens.json, src/common/color.dark.tokens.json   (standaard rol → slot)
//   src/themes/<thema>/overrides.light|dark.tokens.json                      (alleen als roles.json iets afwijkt)
// Niet met de hand bewerken.
//
// Contrastvereisten worden als $extensions["dup.contrast"] bij de voorgrond-tokens gezet;
// scripts/check-contrast.mjs toetst ze per thema × modus.

import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { listThemes, MODES, srcDir, themesDir } from './lib/themes.mjs';

// NL DS basis-kleurrollen (zie @nl-design-system-unstable/basis-design-tokens)
const ROLES = [
  'default',
  'accent-1',
  'accent-2',
  'accent-3',
  'action-1',
  'action-2',
  'highlight',
  'selected',
  'disabled',
  'info',
  'positive',
  'warning',
  'negative',
];
const DEFAULT_SLOT = {
  default: 'neutral',
  'accent-1': 'accent',
  'accent-2': 'accent',
  'accent-3': 'accent',
  'action-1': 'accent',
  'action-2': 'neutral',
  highlight: 'accent',
  selected: 'accent',
  disabled: 'neutral',
  info: 'info',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
};

// Trap: welke stap van de slot-schaal hoort bij welke basis-eigenschap.
const RAMP = {
  light: {
    neutral: {
      'bg-document': 0,
      'bg-subtle': 50,
      'bg-default': 100,
      'bg-hover': 200,
      'bg-active': 300,
      'border-subtle': 200,
      'border-default': 500,
      'border-hover': 600,
      'border-active': 700,
      'color-subtle': 700,
      'color-default': 800,
      'color-hover': 900,
      'color-active': 950,
      'color-document': 950,
    },
    color: {
      'bg-document': 50,
      'bg-subtle': 100,
      'bg-default': 200,
      'bg-hover': 300,
      'bg-active': 400,
      'border-subtle': 300,
      'border-default': 600,
      'border-hover': 700,
      'border-active': 800,
      'color-subtle': 700,
      'color-default': 800,
      'color-hover': 900,
      'color-active': 950,
      'color-document': 950,
    },
  },
  dark: {
    neutral: {
      'bg-document': 950,
      'bg-subtle': 900,
      'bg-default': 800,
      'bg-hover': 700,
      'bg-active': 600,
      'border-subtle': 800,
      'border-default': 500,
      'border-hover': 400,
      'border-active': 300,
      'color-subtle': 300,
      'color-default': 200,
      'color-hover': 100,
      'color-active': 50,
      'color-document': 50,
    },
    color: {
      'bg-document': 950,
      'bg-subtle': 900,
      'bg-default': 900,
      'bg-hover': 800,
      'bg-active': 700,
      'border-subtle': 700,
      'border-default': 400,
      'border-hover': 300,
      'border-active': 200,
      'color-subtle': 300,
      'color-default': 200,
      'color-hover': 100,
      'color-active': 50,
      'color-document': 50,
    },
  },
};

// Contrastvereisten binnen een rol: voorgrond → [achtergronden], soort
const CONTRAST = {
  'color-document': [['bg-document'], 'text'],
  'color-default': [['bg-default', 'bg-document'], 'text'],
  'color-subtle': [['bg-subtle', 'bg-document'], 'text'],
  'color-hover': [['bg-hover'], 'text'],
  'color-active': [['bg-active'], 'text'],
  'border-default': [['bg-document'], 'non-text'],
};
const SOLID = ['bg-solid', 'bg-solid-hover', 'bg-solid-active', 'color-on-solid'];
const EXEMPT = new Set(['disabled']); // WCAG 1.4.3 uitzondering voor inactieve bedieningselementen

const other = (mode) => (mode === 'light' ? 'dark' : 'light');
const ref = (slot, step) => `{brand.color.${slot}.${step}}`;

/** Tokens voor één rol in één context (ramp-modus), als { basis: {...}, dup: {...} } */
function roleTokens(name, slot, rampMode, tokenOverrides = {}, exempt = false) {
  const ramp = RAMP[rampMode][slot === 'neutral' ? 'neutral' : 'color'];
  const basis = {};
  for (const [prop, step] of Object.entries(ramp)) {
    basis[prop] = { $value: ref(slot, step) };
    if (!exempt && CONTRAST[prop]) {
      const [against, use] = CONTRAST[prop];
      basis[prop].$extensions = { 'dup.contrast': against.map((a) => ({ against: `basis.color.${name}.${a}`, use })) };
    }
  }
  const neutralDark = slot === 'neutral' && rampMode === 'dark';
  const dup = {
    'bg-solid': { $value: neutralDark ? ref('neutral', 50) : `{brand.color.${slot}.solid}` },
    'bg-solid-hover': { $value: neutralDark ? ref('neutral', 100) : `{brand.color.${slot}.solid-hover}` },
    'bg-solid-active': { $value: neutralDark ? ref('neutral', 200) : `{brand.color.${slot}.solid-active}` },
    'color-on-solid': { $value: neutralDark ? ref('neutral', 950) : `{brand.color.${slot}.on-solid}` },
  };
  if (!exempt)
    dup['color-on-solid'].$extensions = {
      'dup.contrast': ['bg-solid', 'bg-solid-hover', 'bg-solid-active'].map((a) => ({
        against: `dup.color.${name}.${a}`,
        use: 'text',
      })),
    };
  // Thema-specifieke token-overrides, sleutel relatief aan de rol (bv. "color-on-solid")
  for (const [prop, value] of Object.entries(tokenOverrides)) {
    const target = SOLID.includes(prop) ? dup : basis;
    if (!target[prop]) throw new Error(`Onbekende eigenschap "${prop}" voor rol ${name}`);
    target[prop] = { ...target[prop], $value: value };
  }
  return { basis, dup };
}

/** Volledige kleurlaag voor een modus, gegeven de rollen-config van een thema. */
function colorLayer(mode, roles = {}) {
  const basis = { $type: 'color', transparent: { $value: 'transparent' } };
  const dup = { $type: 'color' };
  for (const role of ROLES) {
    const exempt = EXEMPT.has(role);
    // Gewone rol: trap van deze modus, rolkeuze van deze modus
    const cfg = roles[mode] ?? {};
    const slot = cfg.roles?.[role] ?? DEFAULT_SLOT[role];
    const r = roleTokens(role, slot, mode, cfg.tokens?.[role], exempt);
    basis[role] = r.basis;
    dup[role] = r.dup;
    // Inverse rol: ziet eruit als de andere modus (bv. donkere band op een lichte pagina)
    const icfg = roles[other(mode)] ?? {};
    const islot = icfg.roles?.[role] ?? DEFAULT_SLOT[role];
    const ri = roleTokens(`${role}-inverse`, islot, other(mode), icfg.tokens?.[role], exempt);
    basis[`${role}-inverse`] = ri.basis;
    dup[`${role}-inverse`] = ri.dup;
  }
  return { basis: { color: basis }, dup: { color: dup } };
}

const header = (what) => `Gegenereerd door scripts/generate-color-roles.mjs (${what}). Niet met de hand bewerken.`;
const write = (file, obj) => writeFileSync(file, JSON.stringify(obj, null, 2) + '\n');

// 1. Standaard common-laag
const standard = {};
for (const mode of MODES) {
  standard[mode] = colorLayer(mode);
  write(join(srcDir, 'common', `color.${mode}.tokens.json`), {
    $description: header(`standaard, ${mode}`),
    ...standard[mode],
  });
}

// 2. Thema-afwijkingen (alleen tokens die verschillen van de standaard)
const diff = (a, b) => {
  const out = {};
  for (const [k, v] of Object.entries(a)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) {
      if (JSON.stringify(v) !== JSON.stringify(b?.[k])) out[k] = v;
    } else if (v && typeof v === 'object') {
      const d = diff(v, b?.[k]);
      if (Object.keys(d).length) out[k] = d;
    }
  }
  return out;
};

for (const theme of listThemes()) {
  const p = join(themesDir, theme, 'roles.json');
  for (const mode of MODES) {
    const file = join(themesDir, theme, `overrides.${mode}.tokens.json`);
    if (!existsSync(p)) {
      rmSync(file, { force: true });
      continue;
    }
    const roles = JSON.parse(readFileSync(p, 'utf8'));
    const d = diff(colorLayer(mode, roles), standard[mode]);
    if (d.basis?.color) d.basis.color = { $type: 'color', ...d.basis.color };
    if (d.dup?.color) d.dup.color = { $type: 'color', ...d.dup.color };
    if (Object.keys(d).length)
      write(file, { $description: header(`afwijkingen ${theme} uit roles.json, ${mode}`), ...d });
    else rmSync(file, { force: true });
  }
}
console.log(`✔ kleurrollen gegenereerd: ${ROLES.length} rollen × 2 (+ inverse) × ${MODES.length} modi`);
