# Adapter: Themeco Pro + Cornerstone

Spike-resultaten (31-10-2026) en het ontwerp van de landing. Bronnen: uitsluitend theme.co docs, changelogs en forum (ADR/§ 10 #7). Laatst bekeken versie: **Cornerstone 7.9.8 (27-10-2026)**, Pro 6.9.x.

Legenda: ✅ gedocumenteerd · ⚠️ gedocumenteerd maar met beperking · 🔬 te verifiëren in de sandbox (met Pro)

## 1. Bevindingen

### Global Colors

|     | Bevinding                                                                                                                                                                                | Bron                                         |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| ✅  | Opgeslagen in `wp_options` → `cornerstone_color_items`: JSON-string (via `wp_slash(json_encode(...))`) met items `{ "title", "value", "_id" }`. Programmatisch vullen is gedocumenteerd. | theme.co/docs/color-manager                  |
| ✅  | Elke global color is ook een CSS-variabele `--cs-gc-<_id>`.                                                                                                                              | forum t/115050 (2026)                        |
| ⚠️  | `value: "var(--x)"` werkt op de frontend en in de builder-preview, maar het **staaltje in de kleurkiezer blijft leeg**. Themeco noemt een eigen light/dark-kiezer als toekomstplan.      | forum t/105329 (2023), t/113398 (sept. 2025) |
| ✅  | Sinds 7.8.0 accepteert de kleurkiezer `light-dark(a, b)` als waarde.                                                                                                                     | changelog 7.8.0 (03-03-2026)                 |
| ✅  | Sinds 7.7.9 helperfunctie `cs_color_get_stored` (lezen).                                                                                                                                 | changelog 7.7.9                              |
| ✅  | Theme Options-export/-import neemt global colors en fonts mee (7.6.0). IDs zijn bewerkbaar.                                                                                              | changelog 7.6.0                              |

### Global Fonts

|     | Bevinding                                                                                                                                                                             | Bron                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| ✅  | Font Manager: aliassen ("Body", "Headline") + custom fonts (upload per bestand, met gewicht en stijl). Typography-instellingen in Theme Options kiezen een alias voor body en koppen. | theme.co/docs/font-manager |
| ✅  | Helper `cs_fonts_get_config` (7.7.9), filter `cs_font_data` (gerepareerd in 7.8.4), Dynamic Content voor global fonts (7.7.0).                                                        | changelog                  |
| 🔬  | Opslagformaat van font-items en ondersteuning van **variabele fonts** (gewicht als bereik `100 900`) niet gedocumenteerd.                                                             | —                          |

### Global Variables (nieuw in 7.9.0)

|     | Bevinding                                                                                                                                                            | Bron                           |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| ✅  | Theme option `cs_theme_variables`: lijst van `{ id, value }`. Lezen: `cs_stack_get_value()`, schrijven: `cs_stack_set_value()` (voorbeeld met `after_switch_theme`). | theme.co/docs/global-variables |
| ✅  | Elke variabele wordt `--<id>` op `:root`; waarde mag elke CSS-waarde zijn, **ook `var(...)`**.                                                                       | idem                           |
| ✅  | Dynamic Content: `{{dc:global:variable id="x"}}` → `var(--x)`; `variable-raw` → de waarde. Uitzetten: filter `cs_global_variables_enabled`.                          | idem                           |
| ✅  | Extra CSS bij het renderen: action `cs_after_styling` + `cornerstone('Styling')->addStyles()`.                                                                       | idem                           |

### Components, Parameters, export

|     | Bevinding                                                                                                                                                                                  | Bron                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| ✅  | Components in Component Sets; "Create as Component" (7.9.0); Parameters per instantie (tekst, kleur, link, afbeelding, select); Slots; shortcode `[cs_component id="…" parameters='{…}']`. | theme.co/docs/component-builder-overview |
| ✅  | Documenten hebben een directe exportknop (7.5.8); `.tco`-import; "Export Documents" in Dev tools (7.4.13); Template API werkt global fonts/colors bij (7.5.16).                            | changelog                                |
| ✅  | Elementen in een Component tonen het gebruik ("Component usage list", 7.9.4).                                                                                                              | changelog                                |
| 🔬  | Exportformaat (`.tco`) en of het als bestand in git beheersbaar is.                                                                                                                        | —                                        |

### Overig

|     | Bevinding                                                                                                                                                          | Bron                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| ✅  | Theme option voor een `color-scheme`-metatag (7.7.0).                                                                                                              | changelog                      |
| ✅  | Custom Document Assets (7.9.0): scripts/stylesheets per document of in Theme Options.                                                                              | release notes 7.9              |
| ⚠️  | CSS-variabelen in element-instellingen: in oudere versies alleen via `calc(var(--x))`; sinds 7.8.2 schakelen gewicht/unit-velden naar "breakout mode" bij `var()`. | forum t/94917, changelog 7.8.2 |

## 2. Ontwerp van de landing

```
@doubleup/tokens  ─┐                         ┌─ dup-pro-child (child theme)
@doubleup/css     ─┼─ build → assets/  ──────┤    laadt fonts + thema-CSS + dup.css, zet data-theme/data-color-scheme
@doubleup/fonts   ─┘                         └─ dup-tokens-sync (plugin, WP-CLI)
                                                  schrijft Global Colors, Global Variables, (Fonts)
```

### 2.1 Child theme `dup-pro-child`

- `Template: pro`. Laadt `@doubleup/fonts/archivo.css`, `@doubleup/tokens/css/<thema>.css` (of `all-themes.css` voor de showcase) en `@doubleup/css` — gekopieerd naar `assets/` door een buildscript, versie = bestandshash.
- Zet `data-theme="<thema>"` op `<html>` (filter `language_attributes`); thema instelbaar via constante/optie, standaard `doubleup`.
- Kleurmodus: zonder voorkeur volgt de site het systeem (`prefers-color-scheme`); een kleine wisselaar zet `data-color-scheme` op `<html>` en onthoudt de keuze. Vroeg in `<head>` om flitsen te voorkomen.
- Voegt `dup-document` toe aan `<body>` (filter `body_class`).

### 2.2 Global Colors — rollen, niet waarden

Een korte, semantische palette voor redacteuren (± 14 kleuren), elk met **waarde `var(--…)`** naar onze common-tokens, zodat thema én modus automatisch meeschakelen:

| `_id`                                                        | Titel          | Waarde                                      |
| ------------------------------------------------------------ | -------------- | ------------------------------------------- |
| `dup-text`                                                   | Tekst          | `var(--basis-color-default-color-document)` |
| `dup-text-subtle`                                            | Tekst subtiel  | `var(--basis-color-default-color-subtle)`   |
| `dup-bg`                                                     | Achtergrond    | `var(--basis-color-default-bg-document)`    |
| `dup-bg-subtle`                                              | Vlak           | `var(--basis-color-default-bg-subtle)`      |
| `dup-border`                                                 | Rand           | `var(--basis-color-default-border-default)` |
| `dup-action`                                                 | Actie          | `var(--dup-color-action-1-bg-solid)`        |
| `dup-on-action`                                              | Tekst op actie | `var(--dup-color-action-1-color-on-solid)`  |
| `dup-accent`                                                 | Accent         | `var(--dup-color-accent-1-bg-solid)`        |
| `dup-info` / `dup-positive` / `dup-warning` / `dup-negative` | Meldingen      | `var(--basis-color-<rol>-color-default)`    |

⚠️ Bekende beperking: het staaltje in de kiezer blijft leeg bij `var()`. 🔬 Te testen: of dat in 7.9.x is opgelost. Valt het tegen, dan is het alternatief `light-dark(<licht>, <donker>)` met hex-waarden: staaltje zichtbaar en modus schakelt mee, maar **niet** thema-bewust (een showcase-thema in een sectie krijgt dan de DoubleUP-kleuren). Keuze vastleggen na de test.

### 2.3 Global Variables — vindbaarheid in de builder

Een selectie (± 30) van de meest gebruikte tokens als Global Variable, zodat ze in de builder kiesbaar zijn (Dynamic Content). Waarde altijd een verwijzing, zodat thema en modus blijven werken. Prefix **`ds-`** om botsing met onze eigen variabelen (`--dup-*`, `--basis-*`) te voorkomen (een variabele `--dup-x: var(--dup-x)` zou naar zichzelf verwijzen):

`ds-space-xs … ds-space-3xl` → `var(--basis-space-block-…)`, `ds-radius-sm/md/lg/round`, `ds-font-size-sm … 4xl`, `ds-text`, `ds-action`, …

### 2.4 Global Fonts

Font Manager: één custom font **Archivo Variable** (het woff2 uit `@doubleup/fonts`), aliassen **Display** en **Body**; Theme Options → Typography: body = Body, koppen = Display. 🔬 Opslag en variabel-gewicht testen; tot die tijd handmatige instructie in het draaiboek.

### 2.5 Componenten — voorstel (keuze, zie open vraag)

**Route A — Cornerstone-elementen gestyled met tokens:** native elementen (Button, Headline, Text…) met Element CSS (`$el { background: var(--dup-button-primary-background-color) … }`) en Parameters voor de variant. Vertrouwd voor redacteuren, maar de styling wordt per element herhaald en de HTML is die van Cornerstone (`x-anchor`), niet onze referentie-markup.

**Route B — referentie-markup als Component (aanbevolen):** per component een Cornerstone Component met een Raw/HTML-element dat exact de markup van `@doubleup/css` rendert (`<a class="dup-button dup-button--{{dc:p:variant}}">{{dc:p:label}}</a>`), en Parameters voor alleen wat de redacteur mag kiezen (tekst, link, variant, toon). Eén bron voor de CSS (dezelfde als Storybook en de axe-test), gegarandeerd toegankelijk, en dezelfde markup als op elk ander platform.

**Combinatie:** layout (Section/Row/Column/Grid) en eenvoudige tekst blijven native Cornerstone, met onze klassen (`dup-heading-2`, `dup-paragraph`) via het Class-veld; interactieve en samengestelde componenten (button, link, card, alert, formulierveld, navigatie, skip-link) via Route B.

### 2.6 Sync-plugin `dup-tokens-sync`

`wp dup tokens sync [--theme=doubleup] [--dry-run]`:

1. leest `tokens/<thema>.light.json` uit de child theme-assets;
2. schrijft de semantische Global Colors (`cornerstone_color_items`) en Global Variables (`cs_theme_variables`) — **alleen items met prefix `dup-`/`ds-`**; door redacteuren toegevoegde items blijven staan;
3. idempotent: tweede run = geen wijziging; `--dry-run` toont het verschil.

## 3. Testplan in de sandbox (vereist Pro)

| #   | Test                                        | Verwacht                                                                       |
| --- | ------------------------------------------- | ------------------------------------------------------------------------------ |
| T1  | Child theme activeren                       | `<html data-theme="doubleup">`, fonts en CSS geladen; builder-preview identiek |
| T2  | Global color `var(--…)`                     | Werkt op frontend + preview; staaltje: leeg of zichtbaar? (bepaalt § 2.2)      |
| T3  | Global color `light-dark()`                 | Staaltje zichtbaar; schakelt mee met `data-color-scheme`                       |
| T4  | `wp dup tokens sync`                        | Colors + Variables aanwezig; tweede run zonder wijzigingen; eigen items intact |
| T5  | Font Manager met variabel woff2             | Gewichten 100–900 kiesbaar? Opslagformaat noteren                              |
| T6  | Component "Button" via Route B              | Parameters werken; markup = referentie; axe zonder fouten                      |
| T7  | Export/import van de Component Set          | Bestand reproduceerbaar in git?                                                |
| T8  | Showcase-pagina met `data-theme` per sectie | Elk thema correct, ook in donker                                               |
| T9  | Playwright + axe tegen de demopagina's      | 0 schendingen, licht en donker                                                 |

## 4. Themeco Pro aanleveren (besloten 31-10-2026)

Pro is commercieel en komt **nooit** in deze repo.

- **Lokaal:** zet de zip neer als `sandboxes/wordpress/vendor-private/pro.zip` (staat in `.gitignore`). Daarna `pnpm build`, `cd sandboxes/wordpress && ddev start && ./seed.sh`.
- **Privé CI:** de zip staat als bijlage van een release in de privé repo `WinsleyJ/wp-packages`.
  1. Maak in `wp-packages` een release, bv. tag `themeco-pro-6.9.8`, met de bijlage `pro.zip` (naam begint met `pro`).
  2. Maak een fine-grained token met alleen **Contents: read** op `WinsleyJ/wp-packages`.
  3. In `WinsleyJ/doubleup-design-system` → Settings → Secrets and variables → Actions: secret `WP_PACKAGES_TOKEN` (het token) en variabele `PRO_RELEASE_TAG` (bv. `themeco-pro-6.9.8`).
  4. De CI-taak `wordpress` haalt de zip op, start DDEV en richt de sandbox in. Zonder token/variabele wordt de taak overgeslagen (melding, geen fout).
- Nieuwe Pro-versie: nieuwe release in `wp-packages`, variabele `PRO_RELEASE_TAG` bijwerken.
