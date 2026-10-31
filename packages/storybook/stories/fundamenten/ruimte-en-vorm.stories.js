import { DOC_CSS } from './fundamenten.css.js';
import { esc, get, tokensFor } from './_lib.js';

const SPACE = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

export default { title: 'Fundamenten/Ruimte en vorm' };

export const RuimteEnVorm = {
  name: 'Ruimte en vorm',
  render: (_, { globals }) => {
    const t = tokensFor(globals.theme, globals.mode);
    return `${DOC_CSS}<div class="doc">
  <h1 class="dup-heading-2">Ruimte en vorm</h1>
  <section aria-labelledby="ruimte"><h2 class="dup-heading-3" id="ruimte">Ruimte</h2>
  <p class="dup-paragraph">Dezelfde schaal voor <code>block</code>, <code>inline</code>, <code>row</code> en <code>column</code>; <code>min</code>/<code>max</code> per stap voor vloeiende ruimte.</p>
  <table><thead><tr><th scope="col">Token</th><th scope="col">Waarde</th><th scope="col" style="inline-size:50%">Grootte</th></tr></thead><tbody>
  ${SPACE.map((s) => `<tr><td><code>basis.space.block.${s}</code></td><td><code>${esc(get(t, `basis.space.block.${s}`))}</code></td><td><div class="bar" style="inline-size:var(--basis-space-block-${s})"></div></td></tr>`).join('')}
  </tbody></table></section>
  <section aria-labelledby="hoeken"><h2 class="dup-heading-3" id="hoeken">Afronding</h2>
  <div class="row">${['none', 'sm', 'md', 'lg', 'round'].map((r) => `<figure><div class="box" style="border-radius:var(--basis-border-radius-${r})"></div><figcaption><code>basis.border-radius.${r}</code><br>${esc(get(t, `basis.border-radius.${r}`))}</figcaption></figure>`).join('')}</div></section>
  <section aria-labelledby="randen"><h2 class="dup-heading-3" id="randen">Randdikte</h2>
  <div class="row">${['sm', 'md', 'lg'].map((r) => `<figure><div class="box" style="background:none;border:var(--basis-border-width-${r}) solid var(--basis-color-default-border-default)"></div><figcaption><code>basis.border-width.${r}</code> = ${esc(get(t, `basis.border-width.${r}`))}</figcaption></figure>`).join('')}</div></section>
  <section aria-labelledby="schaduw"><h2 class="dup-heading-3" id="schaduw">Schaduw</h2>
  <div class="row">${['sm', 'md', 'lg'].map((r) => `<figure><div class="box" style="background:var(--basis-color-default-bg-document);box-shadow:var(--basis-box-shadow-${r});border-radius:var(--basis-border-radius-md)"></div><figcaption><code>basis.box-shadow.${r}</code></figcaption></figure>`).join('')}</div></section>
  <section aria-labelledby="beweging"><h2 class="dup-heading-3" id="beweging">Beweging</h2>
  <p class="dup-paragraph"><code>dup.duration.fast/normal/slow</code> = ${['fast', 'normal', 'slow'].map((d) => esc(get(t, `dup.duration.${d}`))).join(' / ')} · easing <code>${esc(get(t, 'dup.easing.standard'))}</code>. Bij <code>prefers-reduced-motion</code> valt alle beweging weg.</p></section>
</div>`;
  },
};
