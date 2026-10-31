# Naamgeving van design tokens

Gebaseerd op het projectdocument _Design Tokens_ (NL Design System-afspraken) en de beslissingen in `PLAN.md` § 10. Afdwingbare regels worden gecontroleerd door `packages/tokens/scripts/validate-names.mjs`.

## Lagen en roots

| Laag              | Root            | Waar                                       | Voorbeeld                                          |
| ----------------- | --------------- | ------------------------------------------ | -------------------------------------------------- |
| Brand             | `brand`         | `src/themes/<thema>/brand.tokens.json`     | `brand.color.neutral.950`                          |
| Common            | `basis` (NL DS) | `src/common/`                              | `basis.color.accent-1.bg-default`                  |
| Common-aanvulling | `dup`           | `src/common/`                              | `dup.motion.duration.fast`                         |
| Component         | `dup`           | `src/components/`                          | `dup.button.primary-action.hover.background-color` |
| Thema-overrides   | `basis` / `dup` | `src/themes/<thema>/overrides.tokens.json` | —                                                  |

- De systeemprefix `dup` is gelijk voor elke klant. Zo blijven alle adapters herbruikbaar.
- `brand` wordt alleen door common-tokens (en overrides) gerefereerd, nooit door componenten of adapters.

## Volgorde (BEM)

1. **Prefix** (verplicht): `dup` (of `basis` voor NL DS-common)
2. **Block** (verplicht): component, bv. `button`, `link`
3. **Element** (optioneel): onderdeel, bv. `icon`, `label`
4. **Modifier** (optioneel), in deze volgorde:
   1. Appearance: `large`, `primary-action`, `subtle`, `negative`, …
   2. Component state: `checked`, `disabled`, `indeterminate`, `invalid`, …
   3. User action state: `active`, `focus`, `focus-visible`, `hover`
5. **Property** (verplicht): CSS-property, bv. `color`, `background-color`, `font-weight`

Voorbeeld: `dup.button.primary-action.disabled.background-color`

## Schrijfwijze

- Alleen kleine letters `a-z`, cijfers en koppeltekens. Geen koppelteken aan begin/eind of dubbel.
- Termen uit HTML, CSS, SVG en WAI-ARIA, niet uit populaire UI-frameworks.
- States volgens CSS/ARIA: `current` (link naar huidige pagina) ≠ `active` (ingedrukt).
- In documentatie: binnen elke laag alfabetisch sorteren.

## Brand-slots (vaste structuur)

Zie `PLAN.md` § 2.1. Elk thema vult dezelfde slots (`brand.color.neutral.*`, `brand.color.accent.*`, `brand.font-family.*`, …). Eigen klantnamen mogen als **alias** naast de slots bestaan.

## Bestandsformaat

DTCG (spec 2025.10): `$value`, `$type`, `$description`, `$extensions`. Referenties: `{brand.color.neutral.950}`. Bestandsnaam eindigt op `.tokens.json`.

## CSS

`dup.button.color` → `--dup-button-color`. Thema-scope via `[data-theme="<thema>"]`, kleurmodus via `[data-color-scheme="light|dark"]` en `prefers-color-scheme`.
