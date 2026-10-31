import { DOC_CSS } from './fundamenten.css.js';
import { esc, get, tokensFor } from './_lib.js';

const SIZES = ['4xl', '3xl', '2xl', 'xl', 'lg', 'md', 'sm'];

export default { title: 'Fundamenten/Typografie' };

export const Typografie = {
  render: (_, { globals }) => {
    const t = tokensFor(globals.theme, globals.mode);
    return `${DOC_CSS}<div class="doc">
  <div><h1 class="dup-heading-2">Typografie</h1>
  <p class="dup-paragraph">Koppen: <code>${esc(get(t, 'basis.heading.font-family'))}</code>, gewicht ${esc(get(t, 'basis.heading.font-weight'))}, breedte ${esc(get(t, 'dup.heading.font-stretch'))}.<br>Lopende tekst: <code>${esc(get(t, 'basis.text.font-family.default'))}</code>. Groottes zijn vloeiend (<code>clamp()</code>) tussen 360 en 1280 pixels schermbreedte.</p></div>
  <section aria-labelledby="koppen"><h2 class="dup-heading-3" id="koppen">Koppen</h2>
  ${[1, 2, 3, 4, 5, 6].map((l) => `<p class="dup-paragraph" style="margin:0"><code>dup-heading-${l}</code> · <code>${esc(get(t, `dup.heading.level-${l}.font-size`))}</code></p><p class="dup-heading-${l}" role="presentation">Websites die je merk verdubbelen</p>`).join('')}
  </section>
  <section aria-labelledby="tekstgroottes"><h2 class="dup-heading-3" id="tekstgroottes">Tekstgroottes</h2>
  <table><thead><tr><th scope="col">Token</th><th scope="col">Waarde</th><th scope="col">Regelafstand</th><th scope="col">Voorbeeld</th></tr></thead><tbody>
  ${SIZES.map((s) => `<tr><td><code>basis.text.font-size.${s}</code></td><td><code>${esc(get(t, `basis.text.font-size.${s}`))}</code></td><td>${esc(get(t, `basis.text.line-height.${s}`))}</td><td style="font-size:var(--basis-text-font-size-${s});line-height:var(--basis-text-line-height-${s})">Dubbel zo goed</td></tr>`).join('')}
  </tbody></table></section>
  <section aria-labelledby="gewichten"><h2 class="dup-heading-3" id="gewichten">Gewichten</h2>
  <div class="row">${['default', 'bold'].map((w) => `<figure><span style="font-size:var(--basis-text-font-size-xl);font-weight:var(--basis-text-font-weight-${w})">Aa Bb Cc 0123</span><figcaption><code>basis.text.font-weight.${w}</code> = ${esc(get(t, `basis.text.font-weight.${w}`))}</figcaption></figure>`).join('')}
  ${['medium', 'semibold'].map((w) => `<figure><span style="font-size:var(--basis-text-font-size-xl);font-weight:var(--dup-text-font-weight-${w})">Aa Bb Cc 0123</span><figcaption><code>dup.text.font-weight.${w}</code> = ${esc(get(t, `dup.text.font-weight.${w}`))}</figcaption></figure>`).join('')}</div>
  </section>
</div>`;
  },
};
