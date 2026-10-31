// Exporteert het DoubleUP-thema naar het formaat van het claude.ai "Design System"-artifact.
// De repo is de bron van waarheid: het artifact is alleen-lezen ("editing": "code") en wordt
// opnieuw gegenereerd met dit script. Uitvoer: dist/project/** (zie docs/design-system-artifact.md).
//
// Invoer: @doubleup/tokens (dist/json, dist/css), @doubleup/css (dist/dup.css), @doubleup/fonts, @doubleup/icons,
//         assets.json (blob-id's van geüploade logo's, bijgewerkt na upload).
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMPONENTS } from './src/components.mjs';
import { README } from './src/readme.mjs';
import { cover } from './src/cover.mjs';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'dist', 'project');
const THEME = 'doubleup';
const pkg = (p) => require.resolve(p);
const read = (p) => readFileSync(p, 'utf8');

rmSync(join(here, 'dist'), { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const write = (rel, content) => {
  const f = join(out, rel);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, content);
};

const light = JSON.parse(read(pkg(`@doubleup/tokens/json/${THEME}.light.json`)));
const dark = JSON.parse(read(pkg(`@doubleup/tokens/json/${THEME}.dark.json`)));
const get = (o, p) => p.split('.').reduce((n, k) => n?.[k], o);
const name = (p) => p.replaceAll('.', '-');
let sha = 'onbekend';
try {
  sha = execSync('git rev-parse --short HEAD', { cwd: here }).toString().trim();
} catch {}
const now = new Date().toISOString();

// ---------- tokens.json ----------
const STEPS = ['0', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const SLOTS = ['neutral', 'accent', 'info', 'positive', 'warning', 'negative'];
const ROLES = [
  'default',
  'action-1',
  'action-2',
  'accent-1',
  'accent-2',
  'accent-3',
  'highlight',
  'selected',
  'disabled',
  'info',
  'positive',
  'warning',
  'negative',
];
const PROPS = {
  'bg-document': 'Achtergrond van een pagina/sectie in deze rol.',
  'bg-subtle': 'Rustig vlak (kaart, paneel).',
  'bg-default': 'Standaardvlak (bv. geselecteerde rij, tag).',
  'bg-hover': 'Vlak bij hover.',
  'bg-active': 'Vlak bij indrukken/actief.',
  'border-subtle': 'Decoratieve lijn; geen contrasteis.',
  'border-default': 'Rand van bedieningselementen; ≥ 3:1 op bg-document.',
  'border-hover': 'Rand bij hover.',
  'border-active': 'Rand bij actief/focus.',
  'color-subtle': 'Secundaire tekst; ≥ 4,5:1 op bg-subtle en bg-document.',
  'color-default': 'Tekst/iconen in deze rol; ≥ 4,5:1 op bg-default en bg-document.',
  'color-hover': 'Tekst bij hover; ≥ 4,5:1 op bg-hover.',
  'color-active': 'Tekst bij actief; ≥ 4,5:1 op bg-active.',
  'color-document': 'Lopende tekst in deze rol; ≥ 4,5:1 op bg-document.',
};
const SOLID = {
  'bg-solid': 'Stevige vulkleur (primaire knop, skip-link).',
  'bg-solid-hover': 'Vulkleur bij hover.',
  'bg-solid-active': 'Vulkleur bij indrukken.',
  'color-on-solid': 'Tekst op de vulkleur; ≥ 4,5:1 op alle drie de vulkleuren.',
};
const colors = [];
for (const s of SLOTS)
  for (const st of STEPS) {
    const v = get(light, `brand.color.${s}.${st}`);
    if (v)
      colors.push({
        name: `brand-color-${s}-${st}`,
        value: v,
        usage: `Brand-schaal ${s}, stap ${st}. Bouwsteen: componenten gebruiken de rollen hieronder, niet deze schaal.`,
      });
  }
for (const r of ROLES) {
  for (const [p, u] of Object.entries(PROPS))
    colors.push({
      name: `basis-color-${r}-${p}`,
      value: { light: get(light, `basis.color.${r}.${p}`), dark: get(dark, `basis.color.${r}.${p}`) },
      usage: `Rol ${r}: ${u}`,
    });
  for (const [p, u] of Object.entries(SOLID))
    colors.push({
      name: `dup-color-${r}-${p}`,
      value: { light: get(light, `dup.color.${r}.${p}`), dark: get(dark, `dup.color.${r}.${p}`) },
      usage: `Rol ${r}: ${u}`,
    });
}

const maxOf = (clamp) => clamp.match(/,\s*([0-9.]+rem)\)$/)?.[1] ?? clamp;
const stack = (arr) => arr.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ');
const HEADINGS = { 1: '4xl', 2: '3xl', 3: '2xl', 4: 'xl', 5: 'lg', 6: 'md' };
const tokens = {
  name: 'DoubleUP',
  version: 1,
  meta: {
    source: 'github',
    repo: 'WinsleyJ/doubleup-design-system',
    ref: `main@${sha}`,
    package: 'packages/tokens',
    paths: {
      tokens: ['packages/tokens/src'],
      css: ['packages/css/src'],
      fonts: ['packages/fonts'],
      assets: ['packages/icons/svg'],
      docs: ['PLAN.md', 'docs'],
    },
    synced: now,
    note: 'Gegenereerd door packages/design-system/build.mjs. Wijzigen in de repo, niet hier.',
  },
  color: {
    themes: [
      { id: 'light', name: 'Licht' },
      { id: 'dark', name: 'Donker' },
    ],
    tokens: colors,
  },
  type: {
    fonts: [
      { family: 'Archivo Variable', file: 'fonts/archivo-variable-latin.woff2', weight: '100 900', style: 'normal' },
    ],
    families: { display: stack(light.brand['font-family'].display), mono: stack(light.brand['font-family'].mono) },
    groups: [
      {
        name: 'Koppen',
        family: 'display',
        styles: Object.entries(HEADINGS).map(([l, s]) => ({
          name: `heading-${l}`,
          fontSize: maxOf(get(light, `basis.text.font-size.${s}`)),
          lineHeight: get(light, `basis.text.line-height.${s}`),
          fontWeight: get(light, 'basis.heading.font-weight'),
          sample: 'Websites die je merk verdubbelen',
          usage: `.dup-heading-${l} · vloeiend ${get(light, `basis.text.font-size.${s}`)} · font-stretch ${get(light, 'dup.heading.font-stretch')}`,
        })),
      },
      {
        name: 'Tekst',
        family: 'display',
        styles: [
          ['lead', 'lg', 'Intro onder een kop (.dup-paragraph--lead).'],
          ['body', 'md', 'Lopende tekst (.dup-paragraph).'],
          ['small', 'sm', 'Toelichting, foutmelding, bijschrift.'],
        ].map(([n, s, u]) => ({
          name: n,
          fontSize: maxOf(get(light, `basis.text.font-size.${s}`)),
          lineHeight: get(light, `basis.text.line-height.${s}`),
          fontWeight: get(light, 'basis.text.font-weight.default'),
          usage: `${u} Vloeiend ${get(light, `basis.text.font-size.${s}`)}.`,
        })),
      },
    ],
  },
  spacing: {
    note: 'Eén schaal voor block, inline, row en column (basis.space.*); hier de block-variant.',
    tokens: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'].map((s) => ({
      name: `basis-space-block-${s}`,
      value: get(light, `basis.space.block.${s}`),
      usage: `Ruimte ${s}.`,
    })),
  },
  radius: {
    tokens: [
      ['none', 'Geen afronding.'],
      ['sm', 'Invoervelden, meldingen.'],
      ['md', 'Kaarten, containers.'],
      ['lg', 'Grote vlakken; verhouding van het app-icoon.'],
      ['round', 'Knoppen en pillen; sluit aan op de ronde lijneinden van het logo.'],
    ].map(([r, u]) => ({ name: `basis-border-radius-${r}`, value: get(light, `basis.border-radius.${r}`), usage: u })),
  },
  shadow: {
    tokens: ['sm', 'md', 'lg'].map((s) => {
      const v = get(light, `basis.box-shadow.${s}`);
      return {
        name: `basis-box-shadow-${s}`,
        value: `${v.offsetX} ${v.offsetY} ${v.blur} ${v.spread} ${v.color}`,
        usage: s === 'md' ? 'Klikbare kaart bij hover.' : `Schaduw ${s}.`,
      };
    }),
  },
  borderWidth: {
    tokens: ['sm', 'md', 'lg'].map((s) => ({
      name: `basis-border-width-${s}`,
      value: get(light, `basis.border-width.${s}`),
      usage: {
        sm: 'Invoervelden, kaarten.',
        md: 'Knoppen, links (onderstreping).',
        lg: 'Focusring, markering huidige pagina.',
      }[s],
    })),
  },
  opacity: {
    tokens: [
      {
        name: 'dup-opacity-subtle',
        value: String(get(light, 'dup.opacity.subtle')),
        usage: 'Dekking van de tweede U in het lagen-logo; als stijlmiddel voor gelaagde vlakken.',
      },
      {
        name: 'dup-opacity-disabled',
        value: String(get(light, 'dup.opacity.disabled')),
        usage: 'Uitgeschakelde elementen (naast de disabled-kleurrol).',
      },
    ],
  },
};
write('tokens.json', JSON.stringify(tokens, null, 2) + '\n');

// ---------- bundle.css: thema-tokens (light/dark van de pagina) + referentiecomponenten ----------
const themeCss = read(pkg(`@doubleup/tokens/css/${THEME}.css`))
  .replace(`[data-theme="${THEME}"] {`, ':root,\n[data-theme="light"],\n[data-theme="dark"] {')
  .replace(`[data-theme="${THEME}"][data-color-scheme="dark"] {`, '[data-theme="dark"] {')
  .replace(/@media \(prefers-color-scheme: dark\) \{[\s\S]*$/, '');
const dupCss = read(pkg('@doubleup/css'));
const bundle = `/* DoubleUP Design System — thema "${THEME}" + referentiecomponenten. Gegenereerd uit ${tokens.meta.repo}@${sha}. */\n${themeCss}\n${dupCss}`;
if (/<\/style/i.test(bundle)) throw new Error('bundle.css bevat </style');
write('components/bundle.css', bundle);

// ---------- componenten ----------
for (const c of COMPONENTS) {
  write(`components/${c.name}/README.md`, c.readme.trim() + '\n');
  write(
    `components/${c.name}/preview.html`,
    `<!-- @dsCard group="${c.group}" height=${c.height} -->\n<div class="dup-document" style="padding:24px">\n${c.preview.trim()}\n</div>\n`,
  );
}
write('components/Cover/preview.html', cover());

// ---------- README ----------
write('README.md', README({ sha, repo: tokens.meta.repo, now }));

// ---------- fonts ----------
mkdirSync(join(out, 'fonts'), { recursive: true });
copyFileSync(
  join(dirname(pkg('@doubleup/fonts/archivo.css')), 'files/archivo-variable-latin.woff2'),
  join(out, 'fonts/archivo-variable-latin.woff2'),
);

// ---------- logo's (uploads) ----------
const LOGOS = [
  'doubleup-logo',
  'doubleup-logo-wit',
  'doubleup-logo-lagen',
  'doubleup-logo-lagen-wit',
  'doubleup-icoon',
  'doubleup-icoon-wit',
  'doubleup-icoon-lagen',
  'doubleup-icoon-lagen-wit',
  'doubleup-lockup',
  'doubleup-lockup-wit',
];
const iconsDir = join(dirname(pkg('@doubleup/icons/package.json')), 'svg');
mkdirSync(join(here, 'dist', 'uploads'), { recursive: true });
for (const l of LOGOS) copyFileSync(join(iconsDir, `${l}.svg`), join(here, 'dist', 'uploads', `${l}.svg`));
write(
  'assets/Logos/README.md',
  `# Logo's\n\nInkt-varianten (#111318) voor lichte achtergronden, \`-wit\` voor donkere. \`lagen\`: de tweede U op 38% dekking (\`dup-opacity-subtle\`). \`icoon\`: app-icoon (afgeronde tegel). \`lockup\`: beeldmerk + woordmerk.\n\nGeef het logo minimaal de hoogte van de kleine letters als vrije ruimte rondom. Niet vervormen, niet in de accentkleur zetten, geen effecten. In code: \`@doubleup/icons/svg/*-currentcolor.svg\` volgt de tekstkleur (en dus thema en modus).\n`,
);

const assetsFile = join(here, 'assets.json');
const uploaded = existsSync(assetsFile) ? JSON.parse(read(assetsFile)) : {};
const files = {};
const order = [];
for (const l of LOGOS) {
  const rec = uploaded[`${l}.svg`];
  if (!rec) continue;
  files[`${l}.svg`] = { name: `${l}.svg`, blob: rec.blob, size: rec.size, type: 'image/svg+xml' };
  order.push(`${l}.svg`);
}

// ---------- index ----------
const index = {
  v: 3,
  layout: 'files',
  createdOnFiles: { v: 1, at: uploaded.$createdAt ?? now },
  title: 'DoubleUP',
  namespace: 'DoubleUP',
  libraries: [],
  editing: 'code',
  sections: {},
  groups: ['Logos'],
  assetGroups: { Logos: { name: 'Logos', tile: 'm', order, files } },
  blobs: {},
  docs: { readme: 'project/README.md', sections: [] },
  lastChange: {
    by: 'Winsley',
    at: now,
    via: `GitHub · ${tokens.meta.repo}@${sha}`,
    note: 'Gegenereerd uit de repo (packages/design-system).',
  },
};
write('design-system.json', JSON.stringify(index, null, 2) + '\n');

const missing = LOGOS.filter((l) => !uploaded[`${l}.svg`]);
console.log(
  `✔ Design System-export: dist/project (${colors.length} kleuren, ${COMPONENTS.length} componenten, ${order.length}/${LOGOS.length} logo's met blob-id)`,
);
if (missing.length) console.log(`ℹ nog te uploaden (dist/uploads): ${missing.join(', ')}`);
