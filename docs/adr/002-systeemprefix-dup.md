# ADR-002: Systeemprefix `dup`

- **Status:** geaccepteerd
- **Datum:** 2026-10-31
- **Beslissers:** Winsley

## Context

NL DS schrijft een prefix per organisatie voor (alleen `a-z`, geen koppelteken). Het systeem moet herbruikbaar zijn voor klanten: als de prefix per klant zou veranderen, breken alle platform-mappings.

## Opties

1. `doubleup`
2. Neutrale korte prefix `dup`
3. Prefix per klant

## Besluit

**`dup`** voor component-tokens en voor common-tokens die `basis` niet dekt. Vast voor alle thema's/klanten. CSS: `--dup-…`; klassen: `.dup-…`; WordPress-onderdelen: `dup-pro-child`, `dup-tokens-sync`.

## Gevolgen

- Adapters zijn klant-onafhankelijk.
- Thema-namen (`data-theme="doubleup"`, `data-theme="klantx"`) blijven klant-specifiek.
