// Volledige voorbeeldpagina: laat in één oogopslag zien wat een thema doet. Wissel thema en modus in de toolbar.
const ARROW = `<svg class="dup-button__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>`;
const card = (n, t, d) =>
  `<article class="dup-card dup-card--link"><span class="dup-card__subtle">0${n}</span><h3 class="dup-heading-4"><a class="dup-card__link" href="#">${t}</a></h3><p class="dup-card__subtle">${d}</p></article>`;

export default { title: 'Voorbeelden/Landingspagina', parameters: { a11y: { test: 'error' } } };

export const Landingspagina = {
  render: () => `
<a class="dup-skip-link" href="#inhoud">Direct naar de inhoud</a>
<nav class="dup-navigation" aria-label="Hoofdmenu"><ul class="dup-navigation__list">
  <li><a class="dup-navigation__link" href="#" aria-current="page">Home</a></li>
  <li><a class="dup-navigation__link" href="#">Diensten</a></li>
  <li><a class="dup-navigation__link" href="#">Werk</a></li>
  <li><a class="dup-navigation__link" href="#">Contact</a></li>
</ul></nav>
<main id="inhoud" style="display:grid;gap:var(--basis-space-row-2xl);padding-block:var(--basis-space-block-3xl)">
  <section style="max-inline-size:52rem">
    <h1 class="dup-heading-1">Websites die je merk <mark class="dup-mark">verdubbelen</mark></h1>
    <p class="dup-paragraph dup-paragraph--lead">Eén design system, elk platform. Van huisstijl tot Cornerstone-pagina, consistent en toegankelijk.</p>
    <div class="sb-row">
      <a class="dup-button dup-button--primary" href="#">Plan een gesprek${ARROW}</a>
      <a class="dup-button dup-button--secondary" href="#">Bekijk werk</a>
      <a class="dup-link" href="#">Lees hoe we werken</a>
    </div>
  </section>
  <section aria-labelledby="diensten">
    <h2 class="dup-heading-2" id="diensten">Wat we doen</h2>
    <div class="sb-grid">
      ${card(1, 'Huisstijl in tokens', 'Kleur, type en ruimte als één bron, voor elk platform.')}
      ${card(2, 'Cornerstone-landing', 'Componenten die redacteuren veilig kunnen gebruiken.')}
      ${card(3, 'Toegankelijk', 'WCAG 2.2 AA, automatisch getoetst bij elke wijziging.')}
    </div>
  </section>
  <section aria-labelledby="contact" style="max-inline-size:40rem">
    <h2 class="dup-heading-2" id="contact">Contact</h2>
    <div class="dup-alert dup-alert--success" role="status"><div class="dup-alert__message"><h3 class="dup-alert__heading">Bedankt!</h3><p class="dup-paragraph" style="margin:0">We nemen binnen twee werkdagen contact op.</p></div></div>
    <form class="sb-stack" onsubmit="event.preventDefault()">
      <div class="dup-form-field"><label class="dup-form-field-label" for="lp-naam">Naam</label><input class="dup-text-input dup-text-input--stretch" id="lp-naam" autocomplete="name"></div>
      <div class="dup-form-field"><label class="dup-form-field-label" for="lp-mail">E-mailadres</label><p class="dup-form-field-description" id="lp-mail-d">We sturen alleen een bevestiging.</p><input class="dup-text-input dup-text-input--stretch" id="lp-mail" type="email" autocomplete="email" aria-describedby="lp-mail-d"></div>
      <div><button class="dup-button dup-button--primary" type="submit">Verstuur</button></div>
    </form>
  </section>
</main>`,
};
