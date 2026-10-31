// README (merkboek) van het Design System-artifact.
export const README = ({ sha, repo, now }) => `# DoubleUP

Huisstijl en design system van DoubleUP: inkt en zuurlime, brede zware koppen in Archivo, ronde vormen uit het logo. Eén bron voor elk platform, licht en donker.

> **Alleen-lezen kopie.** Bron van waarheid is de repo \`${repo}\` (\`PLAN.md\`). Deze pagina is gegenereerd door \`packages/design-system/build.mjs\` op \`${sha}\` (${now.slice(0, 10)}). Wijzigen doe je in de repo; daarna opnieuw exporteren.

## Merk in één oogopslag

- **Inkt \`#111318\`** (\`brand-color-neutral-950\`) — de kleur van het logo; tekst, knoppen in licht, de donkere achtergrond.
- **Zuurlime \`#c6f432\`** (\`brand-color-accent-200\`) — het enige accent. Werkt als markeerstift: vlakken, onderstrepingen, markeringen. In licht **nooit als tekstkleur** (1,3:1 op wit); in donker juist de actiekleur.
- **Archivo**, koppen gewicht 800 en 118% breed — sluit aan op het brede woordmerk. Lopende tekst in dezelfde familie, normaal breed.
- **Rond** — knoppen zijn pillen (\`basis-border-radius-round\`), afgeleid van de ronde lijneinden in het logo. Kaarten en containers \`basis-border-radius-md\`.
- **Lagen** — de tweede U in het lagen-logo staat op 38% (\`dup-opacity-subtle\`); bruikbaar als stijlmiddel voor gelaagde vlakken.

## Kleur

Componenten gebruiken **kleurrollen**, nooit de brand-schalen direct. De rollen volgen NL Design System \`basis\`:

| Rol | Gebruik |
|---|---|
| \`default\` | Pagina, tekst, randen, invoervelden |
| \`action-1\` | Primaire acties en links. Licht: inkt (lime tekst op knoppen). Donker: lime |
| \`accent-1\`, \`highlight\` | Het lime accent: onderstreping van links, markering, huidige pagina |
| \`info\`, \`positive\`, \`warning\`, \`negative\` | Meldingen en status — nooit decoratief |
| \`disabled\` | Uitgeschakelde elementen |

Per rol: \`bg-document → bg-subtle → bg-default → bg-hover → bg-active\` (vlakken), \`border-subtle/default/hover/active\` (randen), \`color-subtle/default/hover/active/document\` (tekst). Vulkleuren voor knoppen: \`dup-color-<rol>-bg-solid\` met \`dup-color-<rol>-color-on-solid\`.

Regels:
- Lopende tekst: \`basis-color-default-color-document\` op \`basis-color-default-bg-document\`.
- Secundaire tekst: \`basis-color-default-color-subtle\` (≥ 4,5:1, ook op \`bg-subtle\`).
- Randen van invoervelden: \`basis-color-default-border-default\` (≥ 3:1).
- Lime alleen op inkt of als vlak achter inkt-tekst.

Elke tekst/achtergrond-combinatie hierboven haalt WCAG 2.2 AA in licht én donker; de repo toetst ruim 2.700 paren bij elke build.

## Typografie

Archivo (variabel, zelf gehost, SIL OFL). Koppen \`heading-1\` t/m \`heading-6\` (klassen \`.dup-heading-1…6\`), gewicht 800, \`font-stretch\` 118%. Tekst: \`lead\`, \`body\`, \`small\`. Alle groottes zijn vloeiend (\`clamp()\`) tussen 360 en 1280 px schermbreedte; de tabel toont de desktopwaarde.

- Eén \`h1\` per pagina; het HTML-niveau volgt de structuur, de klasse het uiterlijk.
- Regellengte lopende tekst maximaal 65 tekens.
- Eén lime markering (\`.dup-mark\`) per kop, niet meer.

## Ruimte en vorm

- Ruimte op een 4px-raster: \`basis-space-block-2xs\` (2px) t/m \`-6xl\` (128px), dezelfde schaal voor inline, row en column.
- Afronding: pillen voor interactie (\`round\`), \`md\` voor kaarten, \`sm\` voor velden en meldingen.
- Schaduw spaarzaam: alleen \`basis-box-shadow-md\` bij hover op klikbare kaarten.
- Focus: 3px ring (\`basis-border-width-lg\`), 2px vrij, kleur van de actierol.
- Aanraakdoel minimaal 44×44 px.

## Logo en iconografie

Zie de groep **Logos**. Inkt-varianten op licht, \`-wit\` op donker. Het logo niet vervormen, niet in lime zetten en geen effecten toevoegen. Iconen: lijnstijl met ronde uiteinden (stroke 2,5, \`round\` caps en joins), passend bij het beeldmerk.

## Toon

Nederlands, direct en concreet, in de je-vorm. Korte zinnen; zeg wat iets doet. Knoppen beginnen met een werkwoord ("Plan een gesprek", "Verstuur"). Foutmeldingen zeggen wat er mis is én hoe het op te lossen ("Vul een volledig e-mailadres in, bijvoorbeeld naam@domein.nl").

## Thema's

Dit is het thema \`doubleup\`. Het design system kent meer thema's met dezelfde componenten — \`showcase-blauw\`, \`showcase-oranje\` (demo's) en \`voorbeeld\` (proefthema). Een nieuw thema is alleen een nieuwe brand-laag; zie de repo.

## Gebruik in code

\`\`\`html
<link rel="stylesheet" href="@doubleup/fonts/archivo.css">
<link rel="stylesheet" href="@doubleup/tokens/css/doubleup.css">
<link rel="stylesheet" href="@doubleup/css">
<body class="dup-document" data-theme="doubleup">
  <section data-theme="doubleup" data-color-scheme="dark">…</section>
</body>
\`\`\`

\`data-color-scheme\` staat altijd samen met \`data-theme\` op hetzelfde element. Zonder \`data-color-scheme\` volgt de pagina de systeemvoorkeur.

Op deze pagina: \`components/bundle.css\` bevat de thema-tokens (licht en donker gekoppeld aan de themawissel van de pagina) plus alle componentstijlen.

## Niet gesynchroniseerd

- Inverse rollen (\`basis-color-<rol>-inverse-*\`), de \`min\`/\`max\`-ruimtes en de componenttokens (\`dup-<component>-*\`) staan niet in de tokenlijst hier; ze zitten wel in \`bundle.css\` en in de repo.
- Vloeiende lettergroottes zijn hier als desktopwaarde opgenomen; \`font-stretch\` staat in de toelichting van elke kopstijl.
- Componenten zijn pure HTML/CSS (geen JavaScript-bundel); de voorbeelden zijn statische markup met de echte stylesheet.
`;
