import { DOC_CSS } from './fundamenten.css.js';
import { esc, get, onColor, tokensFor } from './_lib.js';

const ROLES = [
  'default',
  'action-1',
  'action-2',
  'accent-1',
  'highlight',
  'selected',
  'info',
  'positive',
  'warning',
  'negative',
  'disabled',
];
const PROPS = [
  'bg-document',
  'bg-subtle',
  'bg-default',
  'bg-hover',
  'bg-active',
  'border-subtle',
  'border-default',
  'border-hover',
  'border-active',
  'color-subtle',
  'color-default',
  'color-hover',
  'color-active',
  'color-document',
];
const SOLID = ['bg-solid', 'bg-solid-hover', 'bg-solid-active', 'color-on-solid'];
const SLOTS = ['neutral', 'accent', 'info', 'positive', 'warning', 'negative'];
const STEPS = ['0', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

const sw = (label, hex, sub) =>
  `<div class="sw"><b style="background:${hex};color:${onColor(hex)}">${esc(label)}</b><span>${esc(sub ?? hex)}</span></div>`;

export default { title: 'Fundamenten/Kleur' };

export const Kleurrollen = {
  render: (_, { globals }) => {
    const t = tokensFor(globals.theme, globals.mode);
    return `${DOC_CSS}<div class="doc">
  <div><h1 class="dup-heading-2">Kleurrollen</h1>
  <p class="dup-paragraph">NL DS <code>basis.color.&lt;rol&gt;.*</code> plus vulkleuren <code>dup.color.&lt;rol&gt;.*</code> voor thema <b>${esc(globals.theme)}</b> (${globals.mode === 'dark' ? 'donker' : 'licht'}). Componenten gebruiken alleen deze rollen, nooit de brand-schalen.</p></div>
  ${ROLES.map(
    (r) => `<section aria-labelledby="rol-${r}"><h2 class="dup-heading-4" id="rol-${r}"><code>${r}</code></h2>
    <div class="scale">${PROPS.map((p) => sw(p, get(t, `basis.color.${r}.${p}`))).join('')}</div>
    <div class="scale">${SOLID.map((p) => sw(p, get(t, `dup.color.${r}.${p}`))).join('')}</div></section>`,
  ).join('')}
</div>`;
  },
};

export const BrandSchalen = {
  name: 'Brand-schalen',
  render: (_, { globals }) => {
    const t = tokensFor(globals.theme, 'light');
    return `${DOC_CSS}<div class="doc">
  <div><h1 class="dup-heading-2">Brand-schalen</h1>
  <p class="dup-paragraph">De bouwstenen van thema <b>${esc(globals.theme)}</b>, gegenereerd in OKLCH uit één ankerkleur per slot (<code>palette.json</code>). Alleen de common-laag verwijst hiernaar.</p></div>
  ${SLOTS.map((s) => {
    const steps = STEPS.filter((x) => get(t, `brand.color.${s}.${x}`));
    return `<section aria-labelledby="slot-${s}"><h2 class="dup-heading-4" id="slot-${s}"><code>brand.color.${s}</code></h2>
    <div class="scale">${steps.map((x) => sw(x, get(t, `brand.color.${s}.${x}`))).join('')}${sw('solid', get(t, `brand.color.${s}.solid`))}</div></section>`;
  }).join('')}
</div>`;
  },
};
