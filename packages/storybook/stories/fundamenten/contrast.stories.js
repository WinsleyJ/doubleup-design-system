import { DOC_CSS } from './fundamenten.css.js';
import { contrastFor, esc, nl } from './_lib.js';

export default { title: 'Fundamenten/Contrast' };

export const Contrastmatrix = {
  render: (_, { globals }) => {
    const rows = contrastFor(globals.theme, globals.mode);
    const ok = rows.filter((r) => r.pass).length;
    const min = rows.length ? Math.min(...rows.map((r) => r.ratio)) : null;
    return `${DOC_CSS}<div class="doc">
  <div><h1 class="dup-heading-2">Contrast</h1>
  <p class="dup-paragraph">Alle contrastvereisten van thema <b>${esc(globals.theme)}</b> (${globals.mode === 'dark' ? 'donker' : 'licht'}), zoals <code>check-contrast</code> ze in elke build toetst. Tekst 4,5:1, grote tekst en niet-tekst (randen, focus, iconen) 3:1.</p>
  <p class="dup-paragraph"><b>${ok} van ${rows.length}</b> paren voldoen · laagste ratio ${nl(min)}:1</p></div>
  <div class="scroll" tabindex="0" role="region" aria-label="Contrastparen">
  <table><thead><tr><th scope="col">Voorbeeld</th><th scope="col">Voorgrond</th><th scope="col">Achtergrond</th><th scope="col">Ratio</th><th scope="col">Minimum</th><th scope="col">Oordeel</th></tr></thead><tbody>
  ${rows
    .map((r) => {
      const [fg, , bg] = r.name.split(' ');
      return `<tr><td><span class="chip" style="background:${r.bg};box-shadow:inset 0 0 0 ${r.use === 'non-text' ? '4px' : '1px'} ${r.fg}"></span></td>
      <td><code>${esc(fg)}</code><br><code>${r.fg}</code></td><td><code>${esc(bg)}</code><br><code>${r.bg}</code></td>
      <td>${nl(r.ratio)}:1</td><td>${nl(r.min)}:1 (${r.use === 'text' ? 'tekst' : r.use === 'large-text' ? 'grote tekst' : 'niet-tekst'})</td>
      <td class="${r.pass ? 'pass' : 'fail'}">${r.pass ? 'Voldoet' : 'Voldoet niet'}</td></tr>`;
    })
    .join('')}
  </tbody></table></div>
</div>`;
  },
};
