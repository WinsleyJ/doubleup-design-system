// Richtlijnen en live voorbeelden per component voor het Design System-artifact.
// Markup = dezelfde klassen als @doubleup/css en de Storybook-stories.
const ARROW = `<svg class="dup-button__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>`;
const ICON = {
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z',
  success: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2 15-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9Z',
  warning: 'M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z',
  error: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z',
};
const row = (inner) =>
  `<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-block-end:12px">${inner}</div>`;

export const COMPONENTS = [
  {
    name: 'Button',
    group: 'Acties',
    height: 260,
    readme: `
# Button

Knop voor een actie op de pagina; varianten primary, secondary en subtle, met tonen positive en negative.

## Wanneer
- **primary**: de belangrijkste actie in een gebied (één per gebied).
- **secondary**: een gelijkwaardig alternatief naast primary.
- **subtle**: een lichte actie (annuleren, meer laden).
- **positive/negative**: alleen als de actie zelf die betekenis heeft (bevestigen, verwijderen).
- Navigeert de "knop" naar een andere pagina? Gebruik \`<a class="dup-button …">\`; voert hij iets uit, gebruik \`<button>\`.

## Markup
\`\`\`html
<button type="button" class="dup-button dup-button--primary">Plan een gesprek</button>
<button type="button" class="dup-button dup-button--secondary dup-button--negative">Verwijder</button>
<button type="button" class="dup-button dup-button--primary dup-button--icon-only" aria-label="Volgende">…svg…</button>
\`\`\`

## Tokens
\`dup.button.*\` (namen volgens NL DS Candidate). Primary gebruikt de vulkleur \`dup.color.action-1.bg-solid\` met \`color-on-solid\`; bij DoubleUP licht is dat inkt met lime tekst, donker lime met inkt tekst.

## Toegankelijkheid
Minimaal 44×44 px (\`basis.pointer-target\`). Alleen-icoon-knoppen krijgen een \`aria-label\`. Uitgeschakeld: \`disabled\` (of \`aria-disabled="true"\` als hij focusbaar moet blijven).`,
    preview: `
${row(`<button type="button" class="dup-button dup-button--primary">Plan een gesprek${ARROW}</button><button type="button" class="dup-button dup-button--secondary">Bekijk werk</button><button type="button" class="dup-button dup-button--subtle">Annuleren</button>`)}
${row(`<button type="button" class="dup-button dup-button--primary dup-button--positive">Bevestig</button><button type="button" class="dup-button dup-button--secondary dup-button--negative">Verwijder</button><button type="button" class="dup-button dup-button--primary" disabled>Uitgeschakeld</button><button type="button" class="dup-button dup-button--primary dup-button--icon-only" aria-label="Volgende">${ARROW}</button>`)}`,
  },
  {
    name: 'Link',
    group: 'Acties',
    height: 140,
    readme: `
# Link

Tekstlink naar een andere pagina of plek; altijd onderstreept, met een onderstreping in de accentkleur.

## Markup
\`\`\`html
<a class="dup-link" href="/werk">Bekijk ons werk</a>
<a class="dup-link" href="/" aria-current="page">Home</a>
\`\`\`

## Tokens
\`dup.link.*\`. Tekstkleur \`basis.color.action-1.color-default\`, onderstreping \`dup.color.accent-1.bg-solid\` (decoratief, geen contrasteis). Bij hover wordt de onderstreping dikker.

## Toegankelijkheid
Onderstreping blijft altijd zichtbaar: kleur alleen is niet genoeg om een link te herkennen (WCAG 1.4.1). Huidige pagina: \`aria-current="page"\`, niet "active".`,
    preview: `<p class="dup-paragraph">Lees <a class="dup-link" href="#">hoe we werken</a> of bekijk <a class="dup-link" href="#" aria-current="page">deze pagina</a>.</p>`,
  },
  {
    name: 'Heading',
    group: 'Tekst',
    height: 300,
    readme: `
# Heading

Koppen in zes niveaus, los van het HTML-element: kies het element voor de structuur en de klasse voor het uiterlijk.

## Markup
\`\`\`html
<h1 class="dup-heading-1">Websites die je merk verdubbelen</h1>
<h2 class="dup-heading-3">Een kleinere h2</h2>
\`\`\`

## Tokens
\`dup.heading.level-1 … level-6.*\`. Lettertype \`basis.heading.font-family\` (Archivo), gewicht \`basis.heading.font-weight\` (800), breedte \`dup.heading.font-stretch\` (118%): breed en zwaar, zoals het woordmerk. Groottes vloeiend van mobiel naar desktop.

## Toegankelijkheid
Eén \`h1\` per pagina; sla geen niveaus over in de documentstructuur.`,
    preview: [1, 2, 3, 4]
      .map((l) => `<p class="dup-heading-${l}" role="presentation" style="margin-block:0 8px">Kop niveau ${l}</p>`)
      .join('\n'),
  },
  {
    name: 'Paragraph',
    group: 'Tekst',
    height: 200,
    readme: `
# Paragraph

Lopende tekst, met een grotere intro-variant (lead).

## Markup
\`\`\`html
<p class="dup-paragraph dup-paragraph--lead">Intro onder de kop.</p>
<p class="dup-paragraph">Lopende tekst.</p>
\`\`\`

## Tokens
\`dup.paragraph.*\`. Regellengte maximaal 65 tekens.`,
    preview: `<p class="dup-paragraph dup-paragraph--lead">Eén design system, elk platform. Van huisstijl tot Cornerstone-pagina, consistent en toegankelijk.</p>
<p class="dup-paragraph">Design tokens leggen elke visuele keuze één keer vast. Componenten lezen alleen die tokens, dus een nieuw thema is een nieuwe brand-laag.</p>`,
  },
  {
    name: 'Mark',
    group: 'Tekst',
    height: 120,
    readme: `
# Mark

Markering van een woord in een kop of tekst: het lime "highlighter"-accent van DoubleUP.

## Markup
\`\`\`html
<h1 class="dup-heading-1">Websites die je merk <mark class="dup-mark">verdubbelen</mark></h1>
\`\`\`

## Tokens
\`dup.mark.*\` → \`dup.color.highlight.bg-solid\` en \`color-on-solid\`. Spaarzaam gebruiken: één markering per kop.`,
    preview: `<p class="dup-heading-2" role="presentation" style="margin:0">Websites die je merk <mark class="dup-mark">verdubbelen</mark></p>`,
  },
  {
    name: 'FormField',
    group: 'Formulieren',
    height: 330,
    readme: `
# FormField

Formulierveld met label, optionele toelichting, foutmelding en tekstinvoer.

## Markup
\`\`\`html
<div class="dup-form-field">
  <label class="dup-form-field-label" for="mail">E-mailadres</label>
  <p class="dup-form-field-description" id="mail-desc">We sturen alleen een bevestiging.</p>
  <p class="dup-form-field-error-message" id="mail-err">Vul een volledig e-mailadres in.</p>
  <input class="dup-text-input" id="mail" type="email" aria-describedby="mail-desc mail-err" aria-invalid="true">
</div>
\`\`\`

## Tokens
\`dup.form-field-label.*\`, \`dup.form-field-description.*\`, \`dup.form-field-error-message.*\`, \`dup.text-input.*\` (gebaseerd op \`basis.form-control.*\`). Breedtes: \`dup-text-input--xs … --xl\`, \`--stretch\`.

## Toegankelijkheid
Altijd een zichtbaar \`<label>\`; toelichting en fout koppelen via \`aria-describedby\`; ongeldig via \`aria-invalid="true"\`. Placeholder is geen label.`,
    preview: `<div style="display:grid;gap:16px;max-inline-size:28rem">
<div class="dup-form-field"><label class="dup-form-field-label" for="p-naam">Naam</label><input class="dup-text-input dup-text-input--stretch" id="p-naam" placeholder="Voor- en achternaam"></div>
<div class="dup-form-field"><label class="dup-form-field-label" for="p-mail">E-mailadres</label><p class="dup-form-field-description" id="p-mail-d">We sturen alleen een bevestiging.</p><p class="dup-form-field-error-message" id="p-mail-e"><svg class="dup-form-field-error-message__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${ICON.error}"/></svg>Vul een volledig e-mailadres in.</p><input class="dup-text-input dup-text-input--stretch" id="p-mail" value="naam@" aria-describedby="p-mail-d p-mail-e" aria-invalid="true"></div>
</div>`,
  },
  {
    name: 'Alert',
    group: 'Feedback',
    height: 330,
    readme: `
# Alert

Melding over de status van iets: info, success, warning of error.

## Markup
\`\`\`html
<div class="dup-alert dup-alert--success" role="status">
  <svg class="dup-alert__icon" aria-hidden="true">…</svg>
  <div class="dup-alert__message"><h2 class="dup-alert__heading">Gelukt</h2><p class="dup-paragraph">Je aanvraag is verstuurd.</p></div>
</div>
\`\`\`

## Tokens
\`dup.alert.<type>.*\` op de basis-rollen info, positive, warning en negative.

## Toegankelijkheid
\`role="status"\` voor informatie, \`role="alert"\` alleen bij fouten die direct aandacht vragen. Betekenis niet alleen in kleur: icoon én kop.`,
    preview: ['info', 'success', 'warning', 'error']
      .map(
        (t, i) =>
          `<div class="dup-alert dup-alert--${t}" role="${t === 'error' ? 'alert' : 'status'}"><svg class="dup-alert__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${ICON[t]}"/></svg><div class="dup-alert__message"><p class="dup-alert__heading">${['Goed om te weten', 'Gelukt', 'Let op', 'Er ging iets mis'][i]}</p></div></div>`,
      )
      .join('\n'),
  },
  {
    name: 'Card',
    group: 'Inhoud',
    height: 220,
    readme: `
# Card

Kaart voor een afgebakend stuk inhoud; als \`dup-card--link\` is de hele kaart klikbaar via de link in de titel.

## Markup
\`\`\`html
<article class="dup-card dup-card--link">
  <span class="dup-card__subtle">01</span>
  <h3 class="dup-heading-4"><a class="dup-card__link" href="/tokens">Huisstijl in tokens</a></h3>
  <p class="dup-card__subtle">Kleur, type en ruimte als één bron.</p>
</article>
\`\`\`

## Tokens
\`dup.card.*\`; hover: \`dup.card.hover.*\` (achtergrond en \`basis.box-shadow.md\`).

## Toegankelijkheid
Eén link per klikbare kaart (in de titel); de rest van de kaart blijft gewone tekst voor schermlezers.`,
    preview: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
${['Huisstijl in tokens', 'Cornerstone-landing', 'Toegankelijk'].map((t, i) => `<article class="dup-card dup-card--link"><span class="dup-card__subtle">0${i + 1}</span><p class="dup-heading-4" role="presentation"><a class="dup-card__link" href="#">${t}</a></p><p class="dup-card__subtle">${['Kleur, type en ruimte als één bron.', 'Componenten voor redacteuren.', 'WCAG 2.2 AA, automatisch getoetst.'][i]}</p></article>`).join('\n')}
</div>`,
  },
  {
    name: 'Navigation',
    group: 'Navigatie',
    height: 110,
    readme: `
# Navigation

Hoofdnavigatie; de huidige pagina krijgt een dikke onderstreping in de accentkleur.

## Markup
\`\`\`html
<nav class="dup-navigation" aria-label="Hoofdmenu">
  <ul class="dup-navigation__list">
    <li><a class="dup-navigation__link" href="/" aria-current="page">Home</a></li>
    <li><a class="dup-navigation__link" href="/werk">Werk</a></li>
  </ul>
</nav>
\`\`\`

## Tokens
\`dup.navigation.*\`; huidige pagina: \`dup.navigation.link.current.*\`.`,
    preview: `<nav class="dup-navigation" aria-label="Hoofdmenu"><ul class="dup-navigation__list"><li><a class="dup-navigation__link" href="#" aria-current="page">Home</a></li><li><a class="dup-navigation__link" href="#">Diensten</a></li><li><a class="dup-navigation__link" href="#">Werk</a></li><li><a class="dup-navigation__link" href="#">Contact</a></li></ul></nav>`,
  },
  {
    name: 'SkipLink',
    group: 'Navigatie',
    height: 120,
    readme: `
# SkipLink

Link "Direct naar de inhoud" als eerste element van de pagina; zichtbaar zodra hij focus krijgt.

## Markup
\`\`\`html
<a class="dup-skip-link" href="#inhoud">Direct naar de inhoud</a>
…
<main id="inhoud" tabindex="-1">…</main>
\`\`\`

## Tokens
\`dup.skip-link.*\` → vulkleur van action-1.`,
    preview: `<div style="position:relative;min-block-size:64px"><a class="dup-skip-link" href="#inhoud" style="clip-path:none;block-size:auto;inline-size:auto;min-block-size:44px;min-inline-size:44px;padding:8px 24px;overflow:visible">Direct naar de inhoud</a></div>`,
  },
];
