import { DOC_CSS } from './fundamenten.css.js';
import { cssVar, esc, flatten, tokensFor } from './_lib.js';

export default { title: 'Fundamenten/Alle tokens' };

export const AlleTokens = {
  name: 'Alle tokens',
  render: (_, { globals }) => {
    const light = Object.fromEntries(flatten(tokensFor(globals.theme, 'light')));
    const dark = Object.fromEntries(flatten(tokensFor(globals.theme, 'dark')));
    const rows = Object.keys(light).sort();
    const el = document.createElement('div');
    el.innerHTML = `${DOC_CSS}<div class="doc">
  <div><h1 class="dup-heading-2">Alle tokens</h1>
  <p class="dup-paragraph">${rows.length} tokens van thema <b>${esc(globals.theme)}</b>, alfabetisch. Zoek op naam of waarde.</p>
  <div class="dup-form-field"><label class="dup-form-field-label" for="zoek">Zoeken</label>
  <input class="dup-text-input dup-text-input--lg" id="zoek" type="search" placeholder="bijv. button, accent, 2xl"></div>
  <p class="dup-form-field-description" id="aantal" aria-live="polite"></p></div>
  <div class="scroll" tabindex="0" role="region" aria-label="Tokens">
  <table><thead><tr><th scope="col">Token</th><th scope="col">CSS-variabele</th><th scope="col">Licht</th><th scope="col">Donker</th></tr></thead><tbody>
  ${rows.map((p) => `<tr data-q="${esc(`${p} ${light[p]} ${dark[p]}`.toLowerCase())}"><td><code>${esc(p)}</code></td><td><code>${cssVar(p)}</code></td><td><code>${esc(light[p])}</code></td><td>${dark[p] === light[p] ? '' : `<code>${esc(dark[p])}</code>`}</td></tr>`).join('')}
  </tbody></table></div></div>`;
    const input = el.querySelector('#zoek');
    const count = el.querySelector('#aantal');
    const trs = [...el.querySelectorAll('tbody tr')];
    const update = () => {
      const q = input.value.trim().toLowerCase();
      let n = 0;
      for (const tr of trs) {
        const show = !q || tr.dataset.q.includes(q);
        tr.hidden = !show;
        n += show;
      }
      count.textContent = `${n} van ${trs.length} tokens`;
    };
    input.addEventListener('input', update);
    update();
    return el;
  },
};
