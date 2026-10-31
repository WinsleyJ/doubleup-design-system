# DoubleUP Design System — Plan

> **Levend document.** Elke werksessie begint met het lezen van dit bestand en eindigt met het bijwerken van [§ 9 Status](#9-status--voortgang) en [§ 10 Beslissingenlog](#10-beslissingenlog).
> **Dit bestand is de enige bron van waarheid.** Notities, artifacts of chats buiten deze repo zijn niet leidend; wijkt iets af, dan geldt dit plan (zie § 0).
> Versie 0.4 · 31 oktober 2026 · eigenaar: Winsley (DoubleUP)

---

## Inhoud

0. [Werkafspraken voor elke sessie](#0-werkafspraken-voor-elke-sessie)

1. [Doel en uitgangspunten](#1-doel-en-uitgangspunten)
2. [Architectuur: drie tokenlagen, één contract](#2-architectuur-drie-tokenlagen-één-contract)
3. [Monorepo-structuur](#3-monorepo-structuur)
4. [Adapters: hoe tokens in een platform landen](#4-adapters-hoe-tokens-in-een-platform-landen)
5. [Roadmap](#5-roadmap)
6. [Storybook, Chromatic en visuele regressie](#6-storybook-chromatic-en-visuele-regressie)
7. [Model- en agentstrategie](#7-model--en-agentstrategie)
8. [Tokenbesparing](#8-tokenbesparing)
9. [Status / voortgang](#9-status--voortgang)
10. [Beslissingenlog](#10-beslissingenlog)
11. [Open vragen](#11-open-vragen)
12. [Risico's](#12-risicos)

---

## 0. Werkafspraken voor elke sessie

Deze afspraken gelden voor **elke** Claude-sessie, in welke app dan ook (Claude Code, claude.ai-chat, Cowork, mobiel).

1. **Repo koppelen en dit plan lezen vóór er iets gemaakt wordt.** Repo: `WinsleyJ/doubleup-design-system`. Lees § 9 (status) en § 10 (beslissingen). Kan een sessie de repo niet bereiken: niets ontwerpen of besluiten, alleen vragen of meelezen.
2. **Eén stap tegelijk, in volgorde van § 5.** Geen stap overslaan of een eigen fasering maken.
3. **Beslissingen staan alleen in § 10.** Afwijken van een beslissing = eerst de gebruiker vragen, daarna § 10 bijwerken.
4. **Resultaten landen in de repo** (branch + PR). Een artifact of projectnotitie mag als preview of samenvatting, maar verwijst naar de repo en bevat geen eigen beslissingen.
5. **Het claude.ai-project bevat alleen een verwijzing** naar dit plan (`claude/LEES EERST – DoubleUP design system`), geen kopie van plan of beslissingen. Zo kunnen er geen twee versies ontstaan.

---

## 1. Doel en uitgangspunten

**Doel:** één design system waarmee DoubleUP (en later klanten) websites bouwt op meerdere platforms, waarbij voor een nieuwe klant in principe **alleen een nieuwe brand-laag** nodig is en alle platform-mappings hergebruikt worden.

**Eerste mijlpaal (M1):** de DoubleUP-huisstijl (light + dark) productieklaar in **WordPress met Themeco Pro + Cornerstone**, via een child theme.

**Uitgangspunten**

- Tokenstructuur volgt de afspraken in het projectdocument _Design Tokens_ (NL Design System-naamgeving: prefix → block → element → modifier → property; alleen kleine letters, cijfers en koppeltekens; termen uit HTML/CSS/ARIA).
- **Bronformaat: DTCG** (`$value`, `$type`, `$description`) conform spec 2025.10. Style Dictionary v5 leest dit native. _Let op:_ het voorbeeld in het projectdocument gebruikt nog het oude `value`-formaat; Style Dictionary kan beide formaten niet in één build mengen, dus we kiezen één keer voor DTCG.
- **Build: Style Dictionary v5** → CSS custom properties, SCSS, JS/TS, JSON en platform-specifieke formaten (Cornerstone, `theme.json`, …).
- Toegankelijkheid is een eis, geen extraatje: WCAG 2.2 AA contrast wordt **automatisch** getoetst in de build, voor elk thema × elke kleurmodus.
- Platformonafhankelijk eerst: componenten krijgen eerst een **referentie-implementatie in HTML/CSS**; platforms (Cornerstone, Gutenberg, Astro, …) mappen daarop.

---

## 2. Architectuur: drie tokenlagen, één contract

```
┌──────────────────────────────────────────────────────────────────────┐
│  BRAND  (per thema: doubleup, klant-x, …)                            │
│  Ruwe opties: paletten, font-families, schalen. Vaste slot-structuur │
│  + vrije aliassen in de taal van de klant.                           │
└───────────────────────────────┬──────────────────────────────────────┘
                                │  verwijzingen {brand.…}
┌───────────────────────────────▼──────────────────────────────────────┐
│  COMMON  (het CONTRACT — gelijk voor alle thema's)                   │
│  NL DS basis-tokens (basis.…) + eigen aanvullingen (dup.…)           │
│  Semantisch: tekst, achtergrond, interactie, feedback, focus,        │
│  heading-font, space…  Light + dark waarden.                         │
└───────────────────────────────┬──────────────────────────────────────┘
                                │  verwijzingen {basis.…} / {dup.…}
┌───────────────────────────────▼──────────────────────────────────────┐
│  COMPONENT  (gedeeld, optioneel per thema te overschrijven)          │
│  dup.button.primary-action.hover.background-color, …                 │
└───────────────────────────────┬──────────────────────────────────────┘
                                │  CSS custom properties
┌───────────────────────────────▼──────────────────────────────────────┐
│  ADAPTERS (per platform — hergebruikt voor ELKE klant)               │
│  Cornerstone · Gutenberg · Astro/EmDash · Drupal · Craft             │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.1 De sleutel tot hergebruik: het common-contract

Adapters (Cornerstone-components, Gutenberg-blocks, …) lezen **uitsluitend common- en component-tokens**, nooit brand-tokens. Daardoor:

- verandert er voor een nieuwe klant niets in de adapters;
- is een nieuw thema = **brand-laag invullen** (+ eventueel een paar overrides).

Om "alleen een nieuwe brand-laag" écht waar te maken, krijgt de brand-laag een **vaste slot-structuur** met een constante root `brand`:

```
brand.color.neutral.{0,50,100,…,950,1000}   ← grijs-/ink-schaal
brand.color.accent.{50…950}                 ← primaire accentkleur
brand.color.accent-2.{50…950}               ← optioneel
brand.color.positive / negative / warning / info .{…}
brand.font-family.{display, body, mono}
brand.size.radius.{s, m, l, pill}
brand.opacity.{subtle, disabled}
…
```

Klanten mogen daarnaast **eigen namen als aliassen** toevoegen (bijv. `brand.color.lintblauw` → `{brand.color.accent.700}`), zodat de vrijheid uit het projectdocument behouden blijft. De standaard common-mapping verwijst alleen naar slots en werkt dus ongewijzigd voor elk thema dat de slots vult. Wijkt een klant semantisch af (bijv. links in een andere kleur dan buttons), dan komt er een klein `overrides.tokens.json` in dat thema.

### 2.2 Prefix

- **Systeemprefix: `dup`** (besloten). Gebruikt voor component-tokens en voor common-tokens die `basis` niet dekt. Deze prefix verandert **niet** per klant — anders breken alle mappings. CSS: `--dup-…`, klassen: `.dup-button`.
- **Common-laag: NL Design System `basis`-tokens** (besloten; toets positief, zie `docs/adr/004-nl-design-system-basis.md`). Waar `basis` een token heeft, gebruiken we dat (`--basis-…`); ontbreekt iets, dan vullen we aan onder `dup`. Voordeel: NL DS Candidate-componenten en de theme-wizard werken direct met onze thema's.
  - _Voorwaarde (getoetst in ADR-004, positief op 31-10-2026):_ `basis` moet bruikbaar zijn buiten de overheidscontext en op alle beoogde platforms (WordPress/Cornerstone, Gutenberg, Astro/EmDash, Drupal, Craft). Concreet: stabiliteit/versie van de basis-set, licentie, dekking van onze behoeften (o.a. kleurmodi), en geen afhankelijkheid van React of NL-specifieke componenten. Valt de toets negatief uit, dan krijgt de common-laag dezelfde semantische opzet maar volledig onder `dup`.
- **Brand:** root `brand` (thema-gescopet in CSS, zie 2.3).

### 2.3 Thema's en kleurmodi in CSS

```css
/* gegenereerd door Style Dictionary */
[data-theme="doubleup"] { --brand-color-neutral-950: #111318; … }

[data-theme="doubleup"],
[data-theme="doubleup"][data-color-scheme="light"] {
  color-scheme: light;
  --basis-…: var(--brand-color-neutral-950);   /* common via basis (zie 2.2) */
  --dup-…:   var(--brand-color-accent-600);    /* aanvulling onder dup */
  …
}
[data-theme="doubleup"][data-color-scheme="dark"] { color-scheme: dark; … }
@media (prefers-color-scheme: dark) {
  [data-theme="doubleup"]:not([data-color-scheme="light"]) { … }
}
```

- Modi zitten in de **common-laag** (twee waarden per semantisch token), niet in brand.
- Respecteert systeemvoorkeur, met handmatige override via `data-color-scheme`.
- Thema's zijn aparte CSS-bestanden (`doubleup.css`, `klant-x.css`) — een site laadt alleen zijn eigen thema.

### 2.4 Startpunten uit de DoubleUP-logo's

| Waarneming in logo                             | Wordt brand-token                                                                |
| ---------------------------------------------- | -------------------------------------------------------------------------------- |
| Ink-kleur `#111318` (alle positieve varianten) | `brand.color.neutral.950` (anker van de neutral-schaal)                          |
| Wit `#ffffff` (negatieve varianten)            | `brand.color.neutral.0`                                                          |
| "Lagen"-variant: tweede U op 38 % dekking      | `brand.opacity.subtle = 0.38` — ook bruikbaar als stijlmiddel (gelaagde vlakken) |
| Icoon: 36×36 met `rx=10` (≈ 28 %)              | inspiratie voor `brand.size.radius.l`                                            |
| Dikke, ronde lijnen (round caps)               | ronde hoeken/caps als vormtaal in componenten                                    |
| Pijl-omhoog / dubbele U                        | motief voor iconografie, focus- en hover-effecten                                |

Accentkleur: in stap 1 leg ik 3 voorstellen voor (incl. contrastcheck op ink én wit, light + dark).

---

## 3. Monorepo-structuur

Nieuwe repo, voorstel naam: **`WinsleyJ/doubleup-design-system`** (privé). pnpm workspaces; Turborepo pas toevoegen als builds traag worden.

```
doubleup-design-system/
├─ PLAN.md                       ← dit document
├─ CLAUDE.md                     ← korte instructies voor Claude (≤ 80 regels)
├─ docs/
│  ├─ conventies/naamgeving.md   ← uit projectdoc "Design Tokens"
│  ├─ adr/                       ← Architecture Decision Records (1 per beslissing)
│  └─ adapters/cornerstone.md
├─ .claude/
│  ├─ agents/                    ← subagents (zie § 7)
│  └─ skills/                    ← herhaalbare workflows (nieuw-thema, nieuw-component, …)
├─ packages/
│  ├─ tokens/
│  │  ├─ src/
│  │  │  ├─ themes/
│  │  │  │  ├─ doubleup/brand.tokens.json
│  │  │  │  ├─ doubleup/overrides.tokens.json
│  │  │  │  └─ voorbeeld/brand.tokens.json      ← proefthema (stap 2)
│  │  │  ├─ common/{color,typography,space,…}.tokens.json
│  │  │  └─ components/{button,link,…}.tokens.json
│  │  ├─ build/                   ← Style Dictionary config, transforms, formats
│  │  ├─ scripts/                 ← validate-names, check-contrast, check-contract
│  │  └─ dist/                    ← gegenereerd (niet in git)
│  ├─ css/                        ← referentiecomponenten (HTML/CSS, BEM: .dup-button)
│  ├─ icons/                      ← logo's + iconen (SVG, uit project _Huisstijl)
│  ├─ fonts/                      ← self-hosted open-source fonts (woff2 + @font-face, per thema)
│  └─ storybook/                  ← documentatie + visuele tests
├─ adapters/
│  ├─ cornerstone/                ← M1
│  │  ├─ child-theme/             ← dup-pro-child
│  │  ├─ plugin/                  ← dup-tokens-sync (WP-CLI + admin)
│  │  ├─ components/              ← geëxporteerde Cornerstone Components (JSON)
│  │  └─ tests/                   ← Playwright tegen lokale WP
│  ├─ gutenberg/                  ← later
│  ├─ astro/                      ← later (ook basis voor EmDash)
│  ├─ drupal/                     ← later
│  └─ craft/                      ← later
├─ sandboxes/                     ← lokale testomgevingen (DDEV), zie § 4.3
│  ├─ wordpress/                  ← M1: WP + Pro + child theme + sync-plugin
│  ├─ drupal/                     ← later
│  └─ craft/                      ← later
└─ .github/workflows/             ← CI: build, validate, test, release
```

**Versiebeheer & distributie:** Changesets voor semver + changelog; npm-packages via GitHub Packages (privé). WordPress-onderdelen (child theme, sync-plugin, Cornerstone-components) als zip-assets in **GitHub Releases** (besloten).

---

## 4. Adapters: hoe tokens in een platform landen

Elke adapter bestaat uit dezelfde drie delen, zodat uitbreiden voorspelbaar wordt:

| Deel                     | Wat                                                                                   | Hergebruik per klant                |
| ------------------------ | ------------------------------------------------------------------------------------- | ----------------------------------- |
| **A. Token-output**      | Style Dictionary-platform/format dat tokens in de vorm giet die het platform verwacht | 100 % — draait op elk thema         |
| **B. Component-mapping** | Native componenten van het platform die common/component-tokens consumeren            | 100 % — leest alleen CSS-variabelen |
| **C. Packaging & sync**  | Hoe het in een site komt (child theme, plugin, npm-package, …)                        | 100 % — thema is een parameter      |

### 4.1 Cornerstone (M1) — aanpak

Wat Cornerstone (Pro 6.9 / Cornerstone 7.9, sept. 2026) biedt en hoe we het gebruiken:

| Cornerstone-mogelijkheid                                                                                       | Gebruik                                                                                                                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Child theme** (Pro)                                                                                          | Laadt thema-CSS (`doubleup.css`), zet `data-theme` / `data-color-scheme` op `<html>`, dark-mode-toggle, basis-typografie                                                                                                               |
| **Global Colors** (Color Manager; opgeslagen in wp_option `cornerstone_color_items`, programmatisch te vullen) | Gesynchroniseerd uit common-tokens zodat redacteuren in de color picker semantische kleuren zien. _Spike:_ kan een global color `var(--dup-…)` als waarde hebben? Zo ja → dark mode werkt automatisch in de builder                    |
| **Global Fonts** (Font Manager)                                                                                | Gesynchroniseerd uit `brand.font-family.*` / common heading/body                                                                                                                                                                       |
| **Global Variables** (nieuw in 7.9: CSS-variabelen als Globals)                                                | Kandidaat om spacing/radius/typografie-tokens zichtbaar te maken in de builder. _Spike:_ opslagformaat en of het aan onze bestaande CSS-variabelen kan koppelen                                                                        |
| **Theme Options-export** (bevat sinds kort global colors en fonts)                                             | Alternatief/aanvulling: Style Dictionary genereert een importeerbaar Theme Options-JSON                                                                                                                                                |
| **Components + Parameters**                                                                                    | Onze componenten (button, card, alert, …) als Cornerstone Components; Element-CSS gebruikt uitsluitend `var(--dup-…)`; Parameters exposen alléén toegestane varianten (bijv. `appearance: primary-action / secondary-action / subtle`) |
| **Theme Parameters**                                                                                           | Thema-brede schakelaars (bijv. standaard kleurmodus)                                                                                                                                                                                   |
| **Custom Document Assets**                                                                                     | Eventueel voor component-specifieke JS (dark-mode-toggle, disclosure)                                                                                                                                                                  |

**Sync-mechanisme:** plugin `dup-tokens-sync` met een WP-CLI-commando (`wp dup tokens sync --theme=doubleup`) dat de gegenereerde JSON leest en Global Colors/Fonts/Variables idempotent bijwerkt. Componenten worden als JSON in de repo geversioneerd en via de Template Manager / import geladen.

**Bronnen voor de Cornerstone-adapter:** uitsluitend de actuele officiële documentatie, changelogs en het forum van theme.co (`theme.co/docs`, `theme.co/docs/changelog`, `theme.co/forum`). De oude repo `cornerstone-parameters` is verouderd en wordt niet gebruikt.

### 4.2 Toekomstige adapters (kort)

| Platform  | Token-output                                                   | Component-mapping                                        |
| --------- | -------------------------------------------------------------- | -------------------------------------------------------- |
| Gutenberg | `theme.json` (palette, fontFamilies, spacing) + CSS-variabelen | Block styles / block variations / eventueel eigen blocks |
| Astro     | CSS + TS-tokens                                                | Astro-componenten met BEM-klassen uit `packages/css`     |
| EmDash    | Idem Astro (EmDash is Astro-native)                            | Thema met tokens/blocks volgens EmDash-themeconventie    |
| Drupal    | CSS + `*.libraries.yml`                                        | Single Directory Components (SDC)                        |
| Craft CMS | CSS + Twig-globals                                             | Twig-partials/macros                                     |

### 4.3 Lokale ontwikkel- en testomgevingen

**Keuze: DDEV** (advies Claude, akkoord Winsley). Waarom DDEV en niet wp-env of Local:

|                                      | DDEV                   | wp-env        | Local         |
| ------------------------------------ | ---------------------- | ------------- | ------------- |
| WordPress                            | ✅                     | ✅            | ✅            |
| Drupal                               | ✅ (eigen projecttype) | ❌            | ❌            |
| Craft CMS                            | ✅ (eigen projecttype) | ❌            | ❌            |
| Config in repo (reproduceerbaar)     | ✅ `.ddev/config.yaml` | ✅            | ❌ (GUI)      |
| Bruikbaar in CI (Playwright)         | ✅                     | ✅            | ❌            |
| WP-CLI / Drush / Craft CLI ingebouwd | ✅                     | alleen WP-CLI | alleen WP-CLI |

- Elk platform krijgt een eigen sandbox in `sandboxes/<platform>/` met een `.ddev/`-config en een seed-script (installatie, thema/plugin activeren, demo-inhoud, `sync` draaien).
- **Astro en EmDash** draaien gewoon via Node/pnpm (`pnpm dev`); geen DDEV nodig. Wel dezelfde Playwright-tests.
- Eén gedeelde set Playwright-tests per **demopagina-scenario** (homepage, content, formulier), zodat elk platform dezelfde visuele en a11y-controles krijgt.
- Commerciële software (Pro) wordt lokaal in de sandbox geplaatst en staat in `.gitignore`; zie open vraag over CI.

---

## 5. Roadmap

Legenda modellen: **O** = Opus 5.5 · **S** = Sonnet 5.5 · **H** = Haiku 5.5 (zie § 7).

### Stap 0 — Fundament (± 1 sessie)

- [x] Repo `doubleup-design-system` aanmaken (jij) en koppelen aan Claude
- [x] pnpm workspace, Node 22, Prettier, `.editorconfig`, `.gitignore` (incl. `dist/`, Pro-thema), basis-CI (`.github/workflows/ci.yml`)
- [x] `CLAUDE.md` (kort), `docs/conventies/naamgeving.md`, ADR-template
- [x] Subagents (5) + 2 skills aanmaken (§ 7), deny-lijst in `.claude/settings.json`
- [x] DDEV-config + `sandboxes/wordpress` met `seed.sh` (nog zonder Pro) — _nog niet gedraaid: DDEV is niet beschikbaar in Claude's cloudomgeving; eerste `ddev start` lokaal bij jou of in CI_
- [x] ADR-001 tokenformaat (DTCG) · ADR-002 prefix `dup` · ADR-003 brand-slots · ADR-004 toets NL DS `basis` (**positief**) · ADR-005 DDEV
- [x] Extra: `validate-names`-script (naamconventie + DTCG-formaat) en een eerste brand-token-set met alleen logo-waarden

**Model:** O voor ADR's · S voor scaffolding · H voor config-bestanden
**DoD:** `pnpm install && pnpm build` draait groen op een lege token-set.

### Stap 1 — Huisstijl DoubleUP: brand-laag (± 2 sessies)

- [x] Input meenemen: `docs/verkenningen/2026-10-31-tokens-v0.1.md` (ink-schaal, feedbackkleuren, Archivo als fontkandidaat, vormtaal), omzetten naar brand-slots
- [x] Neutral-schaal rond `#111318` (OKLCH-gebaseerd, 0–950; 950 = logokleur) — generator `scripts/generate-palette.mjs` + `palette.json` per thema
- [x] 3 accentvoorstellen → jij kiest → accent-schaal 50–950 — **gekozen: zuurlime `#c6f432`**; blauw en oranje bewaard als showcase-thema's (`docs/themas.md`)
- [x] Feedbackkleuren (positive/negative/warning/info), schalen 50–950
- [x] Typografie: 2–3 voorstellen voor **self-hosted open-source fonts** (SIL OFL of vergelijkbaar, variable font waar mogelijk, woff2-subsets, `font-display: swap`) → jij kiest → `packages/fonts`; **gekozen: Archivo** (koppen 118% breed); Mona Sans en Bricolage Grotesque in de showcase-thema's; type-schaal (fluid, `clamp()`), line-heights, font-weights
- [x] Space-schaal, radius, border-width, opacity (`0.38` uit logo), schaduwen, motion (duration/easing), font-weights, line-heights, vloeiende font-size-schaal (sm–4xl, sluit aan op `basis.text.font-size`)
- [x] Logo's en iconen naar `packages/icons` (generator; 10 originelen + 4 `currentColor`-varianten)
- [x] Extra: `check-contrast` in `pnpm check` (108 paren: 3 thema's × light/dark), thema-overerving (`extends`), `roles.json` per thema
- [x] Visuele review via keuzepagina: https://claude.ai/artifact/XAM3XfMnvkydWqJkA1NJpG
- [ ] ~~Design System-artifact~~ → **verplaatst naar einde stap 3** en dan _gegenereerd uit de repo_ (zie § 10 #22), zodat het geen tweede bron van waarheid wordt

**Model:** O voor kleur-/typografiekeuzes en schaalopbouw · S voor uitschrijven JSON
**DoD:** brand-tokens valide DTCG, contrastrapport groen voor alle beoogde tekst/achtergrond-paren.

### Stap 2 — Common- en component-tokens + build-pipeline (± 3 sessies)

- [x] Common-laag: alle 614 NL DS `basis`-tokens gevuld + aanvullingen onder `dup` (vulkleuren `dup.color.<rol>.bg-solid…`, motion, opacity, heading-breedte). Kleurrollen gegenereerd per modus (ADR-006)
- [x] Component-tokens (14 componenten, ~330 tokens): button, link, heading, paragraph, form-field-label/-description/-error-message, text-input, alert, skip-link, mark (namen volgens NL DS Candidate) + eigen card, navigation; contrastvereisten bij de tokens
- [x] Style Dictionary v5-config: CSS per thema met light/dark (`data-theme` + `data-color-scheme` + `prefers-color-scheme`), `all-themes.css`, JSON en JS per modus — _SCSS nog niet (pas als een platform erom vraagt)_
- [x] Scripts (deterministisch, geen LLM nodig): `validate-names`, `check-contrast` (vereisten als `$extensions` bij het token; 1.614 paren), `check-contract` (brand-slots, alle basis-tokens, referenties, laagregel)
- [x] **Proefthema `voorbeeld`** (warm neutraal, groenblauw, Source Serif 4, strakke hoeken, eigen typeschaal; erft niets) → haalt contract en contrast **zonder wijziging** in common of componenten
- [x] Gegenereerde token-documentatie: `dist/docs/tokens.md` (per laag alfabetisch, licht/donker, verwijzing) en `dist/docs/themes.md` (brand per thema naast elkaar)

**Model:** O voor common-contract-ontwerp · S voor build/scripts · H voor docs-generatie
**DoD:** beide thema's bouwen, alle checks groen in CI.

### Stap 3 — Referentiecomponenten + Storybook (± 3 sessies)

- [ ] `packages/css`: componenten als pure HTML/CSS (BEM, `.dup-button--primary-action`), uitsluitend via component-tokens
- [ ] Storybook (HTML/Vite-framework) met toolbar voor thema × kleurmodus
- [ ] Pagina's: tokens-overzicht, kleurcontrast-matrix, typografie, componenten met alle states
- [ ] a11y-addon (axe) in elke story

**Model:** S · O voor review van de componentstructuur
**DoD:** alle componenten in beide thema's en beide modi zonder axe-fouten.

### Stap 4 — Cornerstone-landing (M1) (± 4–5 sessies)

- [ ] **Spikes (eerst!, op basis van theme.co docs, changelogs en forum):** opslag Global Colors/Fonts/Variables · `var()` in global colors · Theme Options-export-formaat · component-export-formaat. Resultaat → `docs/adapters/cornerstone.md`
- [ ] `sandboxes/wordpress` (DDEV) uitbreiden met Pro (licentie lokaal, nooit in repo) + seed-script
- [ ] Child theme `dup-pro-child`: laden thema-CSS, `data-theme`, kleurmodus + toggle, basistypografie
- [ ] Plugin `dup-tokens-sync` + WP-CLI-commando
- [ ] Style Dictionary-format(s) voor Cornerstone (colors/fonts/variables JSON)
- [ ] Cornerstone Components + Parameters voor de componentset uit stap 2/3
- [ ] Demopagina's: homepage, contentpagina, formulier — in light en dark
- [ ] **Thema-showcase** op de DoubleUP-site: themawisselaar (`doubleup` / `showcase-blauw` / `showcase-oranje`) × light/dark op dezelfde Cornerstone-pagina — laat zien wat een brand-laag doet
- [ ] Draaiboek "nieuwe klant in Cornerstone" (≤ 1 A4)

**Model:** O voor de spikes en de sync-architectuur · S voor bouw · H voor herhalende component-JSON
**DoD:** thema wisselen = andere CSS + `sync`-commando; geen handmatige stappen in de builder.

### Stap 5 — Kwaliteit & productieklaar (± 2 sessies)

- [ ] CI: build → validate → contrast → Storybook build → Chromatic → Playwright (WP)
- [ ] Chromatic op Storybook (zie § 6)
- [ ] Playwright-screenshots van de Cornerstone-demopagina's (thema × modus × 2 viewports)
- [ ] Changesets + releases (npm-packages via GitHub Packages, WP-zips via GitHub Releases)
- [ ] Onafhankelijke review door een verse agent (§ 7) tegen dit plan + WCAG-checklist
- [ ] Livegang nieuwe DoubleUP-site op het nieuwe systeem (nieuw opgezet; staat los van de eerdere test-repo `doubleup-website`)

**DoD M1:** nieuwe DoubleUP-site draait in productie op het design system; tweede (proef)thema werkt zonder adapterwijziging.

### Fase 2 en verder (na M1)

| Volgorde (voorstel)                        | Waarom                                                                                  |
| ------------------------------------------ | --------------------------------------------------------------------------------------- |
| 6. Gutenberg (`theme.json` + block styles) | Zelfde WP-stack, grote hergebruik-winst                                                 |
| 7. Astro → EmDash                          | EmDash is Astro-native, dus één adapter-basis voor twee                                 |
| 8. Drupal (SDC)                            |                                                                                         |
| 9. Craft CMS (Twig)                        |                                                                                         |
| Doorlopend                                 | Nieuwe componenten, eerste echte klantthema, Figma-variabelen-sync (Figma is gekoppeld) |

---

## 6. Storybook, Chromatic en visuele regressie

**Mijn advies: Storybook niet als toekomstmuziek, maar vroeg en licht (stap 3); Chromatic direct daarna (stap 5).** Redenen:

1. Zodra er twee thema's en twee modi zijn, wil je **één plek** zien wat een tokenwijziging doet. Dat is Storybook, en het is meteen je documentatie.
2. Visuele regressie is goedkoop om te starten en duur om later in te halen: baselines vastleggen terwijl er nog weinig componenten zijn is makkelijk.
3. Chromatic dekt alleen Storybook. De **Cornerstone-output** test je apart met Playwright-screenshots tegen een lokale WP. Beide zijn nodig.

**Budget Chromatic (gratis plan):** 5.000 snapshots/maand, alleen Chrome; elke viewport/browser telt als extra snapshot; bij overschrijding pauzeert het testen tot de volgende maand. Schatting: 40 stories × 2 thema's × 2 modi = 160 snapshots per build → ± 30 builds/maand. Met **TurboSnap** (`onlyChanged`) alleen gewijzigde stories → ruim voldoende. Thema's/modi via Chromatic _Modes_. Alternatief als het knelt: Argos (gratis tier ook 5.000 screenshots).

---

## 7. Model- en agentstrategie

### 7.1 Modellen

| Model                      | Inzetten voor                                                                                               | Niet voor                                    |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **Opus 5.5**               | Architectuurkeuzes (ADR's), common-contract, kleur-/typografiesysteem, Cornerstone-spikes, eindreviews      | Uitschrijven van grote hoeveelheden JSON/CSS |
| **Sonnet 5.5** (standaard) | Implementatie: Style Dictionary-config, scripts, componenten, stories, child theme, plugin                  | —                                            |
| **Haiku 5.5**              | Mechanisch werk: config-bestanden, docs-tabellen, changelog, herhalende component-JSON, codebase-zoekacties | Ontwerpbeslissingen                          |
| Fable 5.1                  | Niet gepland; hooguit als second opinion bij een vastgelopen architectuurvraag                              | Dagelijks werk (kosten)                      |

Vuistregel: **denken met Opus, bouwen met Sonnet, kopiëren/zoeken met Haiku.** Begin een sessie op Sonnet; wissel naar Opus alleen voor stappen gemarkeerd met **O** in de roadmap.

### 7.2 Subagents (`.claude/agents/*.md`)

| Agent                    | Model                         | Taak                                                                              | Wanneer                                           |
| ------------------------ | ----------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------- |
| `token-architect`        | opus                          | Ontwerpt/reviewt tokenstructuur, naamgeving, contract                             | Stap 1–2, bij nieuwe tokencategorieën             |
| `cornerstone-specialist` | opus (spikes) / sonnet (bouw) | Onderzoekt en bouwt de Cornerstone-adapter                                        | Stap 4                                            |
| `a11y-reviewer`          | sonnet                        | Contrast, focus, toetsenbord, ARIA; leest rapporten van scripts                   | Einde stap 1, 3, 4                                |
| `independent-reviewer`   | opus                          | Verse context, beoordeelt werk tegen PLAN.md + DoD, zonder het bouwproces te zien | Einde elke stap (alleen bij mijlpalen)            |
| `docs-writer`            | haiku                         | Docs, changelog, token-tabellen bijwerken                                         | Na elke merge                                     |
| _Explore_ (ingebouwd)    | haiku                         | Brede zoekacties in de codebase                                                   | Alleen als je echt veel bestanden moet doorzoeken |

**Regel:** spawn een subagent alleen als (a) het werk een eigen, afgebakende context heeft, of (b) onafhankelijkheid nodig is (review). Elke spawn begint koud en kost dus extra tokens. Kleine taken doet de hoofdsessie zelf.

### 7.3 Skills (`.claude/skills/`)

Herhaalbare workflows als skill, zodat instructies pas geladen worden als ze nodig zijn:

- `nieuw-thema` — brand-slots invullen, contrast- en contractcheck, build, Cornerstone-sync
- `nieuw-component` — tokens → CSS → story → Cornerstone component → docs
- `cornerstone-sync` — lokale WP bijwerken en screenshots maken

---

## 8. Tokenbesparing

Gerangschikt op impact:

1. **Scripts boven LLM.** Naamgeving, contrast, contract-volledigheid en DTCG-validatie zijn deterministisch → scripts in CI. Claude leest alleen het (korte) rapport. Grootste besparing.
2. **Eén taak per sessie, `PLAN.md` als overdracht.** Nieuwe sessie: lees § 9, pak de volgende taak, werk § 9/§ 10 bij, stop. Geen lange sessies die steeds opnieuw context compacteren.
3. **`CLAUDE.md` kort houden (≤ 80 regels).** Details in `docs/` en skills, die alleen geladen worden wanneer relevant.
4. **Gegenereerde bestanden buiten beeld.** `dist/`, `node_modules/`, het Pro-thema en Storybook-builds in `.gitignore` en in de deny-lijst van `.claude/settings.json`, zodat Claude ze niet leest.
5. **Scaffolding-generatoren.** Nieuw component/thema via een script (`pnpm new:component button`) i.p.v. door Claude laten uitschrijven.
6. **Juiste model per stap** (§ 7.1) en subagents spaarzaam (§ 7.2).
7. **Dit claude.ai-project licht houden.** Alle projectdocumenten worden aan het begin van een chat ingelezen; de SVG-lockups zijn groot (lange paden). Zodra de logo's in de repo staan (`packages/icons`), kun je ze uit het project halen, of alleen één referentie-SVG laten staan.

---

## 9. Status / voortgang

| Stap                                | Status                            | Laatste update | Notities                                                                     |
| ----------------------------------- | --------------------------------- | -------------- | ---------------------------------------------------------------------------- |
| 0 Fundament                         | ✅ klaar (gemerged, PR #1)        | 31-10-2026     | DDEV nog lokaal te testen                                                    |
| 1 Brand-laag DoubleUP               | ✅ klaar (PR `stap-1-brand-laag`) | 31-10-2026     | Lime + Archivo; 2 showcase-thema's; contrastcheck in CI                      |
| 2 Common/component + build          | ✅ klaar (branch `stap-2-common`) | 31-10-2026     | 4 thema's × 2 modi; 2.034 tokens; 2.704 contrastparen groen; SCSS uitgesteld |
| 3 Referentiecomponenten + Storybook | ⬜ volgende                       |                | Component-tokens liggen klaar; Storybook toont ook `dist/docs`               |
| 4 Cornerstone-landing               | ⬜                                |                |                                                                              |
| 5 Kwaliteit & productie             | ⬜                                |                |                                                                              |

**Volgende actie:** PR's mergen (#2 → `stap-1-brand-laag` → `stap-2-common`); daarna stap 3: referentiecomponenten (HTML/CSS) + Storybook met thema- en modewisselaar.

---

## 10. Beslissingenlog

| #   | Datum      | Beslissing                                                                                                                                                                                                                                                  | Door                               |
| --- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 1   | 31-10-2026 | Nieuwe monorepo; bestaande repo's (`doubleup-design-tokens`, `doubleup-theme`, `cornerstone-parameters`) niet als basis                                                                                                                                     | Winsley                            |
| 2   | 31-10-2026 | Kleurpalet: monochroom (ink `#111318`) + 1 accentkleur, light + dark                                                                                                                                                                                        | Winsley                            |
| 3   | 31-10-2026 | Cornerstone: Pro + child theme, volledige landing (CSS-variabelen, Global Colors/Fonts, Components/Parameters)                                                                                                                                              | Winsley                            |
| 4   | 31-10-2026 | Plan leeft als `PLAN.md` in de repo                                                                                                                                                                                                                         | Winsley                            |
| 5   | 31-10-2026 | Voorstel: DTCG-formaat + Style Dictionary v5 (bevestigen in ADR-001)                                                                                                                                                                                        | Claude → ter bevestiging           |
| 6   | 31-10-2026 | Voorstel: Storybook in stap 3, Chromatic in stap 5 (niet uitstellen tot na M1)                                                                                                                                                                              | Claude → ter bevestiging           |
| 7   | 31-10-2026 | Cornerstone-kennis alleen uit officiële theme.co-documentatie, changelogs en forum; repo `cornerstone-parameters` wordt niet gebruikt (verouderd)                                                                                                           | Winsley                            |
| 8   | 31-10-2026 | Systeemprefix `dup` (component-tokens + common-aanvullingen; CSS `--dup-…`, klassen `.dup-…`)                                                                                                                                                               | Winsley                            |
| 9   | 31-10-2026 | Common-laag sluit aan op NL DS `basis`-tokens, **mits** dat ook werkt voor niet-overheidsprojecten en alle beoogde platforms (toets in ADR-004; anders volledig onder `dup`)                                                                                | Winsley                            |
| 10  | 31-10-2026 | Lettertypen: uitsluitend self-hosted open source                                                                                                                                                                                                            | Winsley                            |
| 11  | 31-10-2026 | Lokale omgevingen: DDEV (WordPress, later Drupal en Craft); Astro/EmDash via Node                                                                                                                                                                           | Claude-advies, akkoord Winsley     |
| 12  | 31-10-2026 | Distributie WP-onderdelen via GitHub Releases                                                                                                                                                                                                               | Winsley                            |
| 13  | 31-10-2026 | Repo `doubleup-website` was een test en staat los van dit project; M1 levert een nieuwe DoubleUP-site op                                                                                                                                                    | Winsley                            |
| 14  | 31-10-2026 | Pro-licentie mag gebruikt worden in een privé CI-omgeving → Playwright-tests tegen WordPress draaien in CI                                                                                                                                                  | Winsley                            |
| 15  | 31-10-2026 | Toets NL DS `basis` positief: common-laag = `basis` (v3.1.1 vastgepind) + aanvullingen onder `dup` (ADR-004)                                                                                                                                                | Claude, conform voorwaarde Winsley |
| 16  | 31-10-2026 | Voorstel #5 vastgelegd in ADR-001: DTCG + Style Dictionary 5.7.1 (vastgepind)                                                                                                                                                                               | Claude → bezwaar? laat het weten   |
| 17  | 31-10-2026 | Een sessie zonder repo-toegang maakte een eigen plan (tokens v0.1, prefix `doubleup`, geen `basis`/accent/dark). Niet leidend; bruikbare delen bewaard als verkenning. Werkafspraken § 0 toegevoegd; projectnotitie vervangen door verwijzing "LEES EERST". | Claude, op verzoek Winsley         |
| 18  | 31-10-2026 | Accent DoubleUP: zuurlime `#c6f432`. Light: knoppen inkt met lime tekst, links inkt met lime onderstreping; dark: lime als actie-/linkkleur                                                                                                                 | Winsley                            |
| 19  | 31-10-2026 | Lettertype DoubleUP: Archivo (variabel, self-hosted), koppen 118% breed                                                                                                                                                                                     | Winsley                            |
| 20  | 31-10-2026 | Niet-gekozen voorstellen blijven als showcase-thema's: `showcase-blauw` (blauw + Mona Sans, info → cyaan) en `showcase-oranje` (oranje + Bricolage). Doel: thema-showcase op de DoubleUP-site (stap 4)                                                      | Winsley                            |
| 21  | 31-10-2026 | Thema's kunnen erven (`theme.json` → `extends`); kleurschalen worden gegenereerd uit `palette.json`                                                                                                                                                         | Claude                             |
| 22  | 31-10-2026 | Design System-artifact verplaatst van stap 1 naar einde stap 3, gegenereerd uit de repo (geen tweede bron van waarheid, zie § 0)                                                                                                                            | Claude → bezwaar? laat het weten   |
| 23  | 31-10-2026 | Kleurrollen gegenereerd met vaste trap per modus; vulkleuren als `dup.color.<rol>.bg-solid…`; contrastvereisten als `$extensions` bij het token (ADR-006)                                                                                                   | Claude → ter review                |
| 24  | 31-10-2026 | `data-color-scheme` altijd samen met `data-theme` op hetzelfde element (nodig voor betrouwbare nesting/showcase)                                                                                                                                            | Claude → ter review                |
| 25  | 31-10-2026 | `extends` erft alleen de brand-laag, niet `roles.json`/overrides                                                                                                                                                                                            | Claude                             |
| 26  | 31-10-2026 | Componentnamen volgen NL DS Candidate (button `primary/secondary/subtle` + tonen `positive/negative`; alert `error/info/success/warning`) i.p.v. `primary-action` uit het projectdocument-voorbeeld                                                         | Claude → bezwaar? laat het weten   |
| 27  | 31-10-2026 | Proefthema `voorbeeld` (Source Serif 4, erft niets) blijft als contract-test in de repo                                                                                                                                                                     | Claude                             |
| 28  | 31-10-2026 | Tokendocumentatie wordt gegenereerd naar `dist/docs` (niet gecommit); Storybook toont haar in stap 3                                                                                                                                                        | Claude                             |

---

## 11. Open vragen

1. **EUPL-licentie NL DS `basis`:** we kopiëren geen bestanden, alleen tokennamen als contract. Even juridisch laten bevestigen voordat er klantwerk op gebouwd wordt (zie ADR-004).

---

## 12. Risico's

| Risico                                                                                                                       | Impact                                                     | Maatregel                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cornerstone-opslagformaten (global colors/variables, components) zijn deels ongedocumenteerd en kunnen per update veranderen | Sync breekt na update                                      | Spikes eerst; adapter test tegen vastgepinde Pro-versie; Playwright-screenshots in CI; versiecheck in sync-plugin                                     |
| Global Colors accepteren mogelijk geen `var()` → dark mode niet via de color picker                                          | Redacteuren kiezen vaste hex-waarden die niet meeschakelen | Fallback: componenten gebruiken altijd tokens in Element-CSS; color picker alleen voor uitzonderingen                                                 |
| Pro is commerciële software                                                                                                  | Niet in repo of publieke CI                                | Lokaal in DDEV-sandbox; in **privé** CI ophalen uit een versleutelde bron (GitHub Secret / privé artifact), nooit committen of in logs tonen          |
| NL DS `basis` wijzigt of is te overheidsspecifiek                                                                            | Common-laag moet later omgebouwd worden                    | Toets vooraf (ADR-004); `basis`-versie vastpinnen; eigen aanvullingen altijd onder `dup`, zodat uitstappen beperkt blijft tot de common-laag          |
| DTCG 2025.10-ondersteuning verschilt per tool                                                                                | Incompatibiliteit met bijv. Figma-plugins                  | Style Dictionary als enige bron-consument; exports per tool als aparte output                                                                         |
| Sessie zonder repo-toegang werkt zonder plan en maakt eigen keuzes                                                           | Dubbel werk, tegenstrijdige beslissingen                   | § 0 werkafspraken; projectdoc "LEES EERST" + projectinstructie; CI weigert afwijkende namen (`validate-names` staat alleen `brand`/`basis`/`dup` toe) |
| Scope-creep naar andere platforms vóór M1                                                                                    | M1 schuift op                                              | Adapters na M1 alleen als ADR/notitie, geen code                                                                                                      |
