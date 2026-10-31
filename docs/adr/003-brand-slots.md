# ADR-003: Vaste slot-structuur voor de brand-laag

- **Status:** geaccepteerd
- **Datum:** 2026-10-31
- **Beslissers:** Winsley, Claude

## Context

Doel: voor een nieuwe klant alleen een brand-laag aanmaken. Het projectdocument laat de naamgeving van brand-tokens vrij. Als elke klant eigen namen gebruikt, moet de common-laag per klant opnieuw gemapt worden.

## Besluit

De brand-laag heeft een constante root `brand` en een **vaste set slots** die de standaard common-mapping verwacht:

- `brand.color.neutral.{0,50,100,200,…,900,950,1000}`
- `brand.color.accent.{50…950}` (+ optioneel `accent-2`, `accent-3`)
- `brand.color.{positive,negative,warning,info}.{50…950}`
- `brand.font-family.{display,body,mono}`
- schalen voor `size`, `space`, `radius`, `border-width`, `opacity`, `shadow`, `motion` (vastgelegd in stap 1)

Klant-eigen namen mogen als **aliassen** naast de slots (`brand.color.lintblauw` → `{brand.color.accent.700}`). Semantische afwijkingen gaan in `overrides.tokens.json` van het thema.

## Gevolgen

- In stap 2 komt `check-contract`: controleert per thema of alle verplichte slots gevuld zijn.
- De exacte slotlijst wordt in stap 1 definitief en dan in dit ADR bijgewerkt.
