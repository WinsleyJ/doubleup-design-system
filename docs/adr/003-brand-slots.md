# ADR-003: Vaste slot-structuur voor de brand-laag

- **Status:** geaccepteerd
- **Datum:** 2026-10-31
- **Beslissers:** Winsley, Claude

## Context

Doel: voor een nieuwe klant alleen een brand-laag aanmaken. Het projectdocument laat de naamgeving van brand-tokens vrij. Als elke klant eigen namen gebruikt, moet de common-laag per klant opnieuw gemapt worden.

## Besluit

De brand-laag heeft een constante root `brand` en een **vaste set slots** die de standaard common-mapping verwacht:

- `brand.color.neutral.{0,50,100,200,…,900,950}` (0 = wit; anker van DoubleUP op 950)
- `brand.color.accent.{50…950}` (+ optioneel `accent-2`, `accent-3`)
- `brand.color.{info,positive,warning,negative}.{50…950}`
- `brand.font-family.{display,body,mono}` · `brand.font-stretch.{normal,display}`
- `brand.space.{0,50,100,…,900}` · `brand.radius.{none,s,m,l,pill}` · `brand.border-width.{s,m,l}`
- `brand.opacity.{subtle,disabled}` · `brand.shadow.{s,m,l}` · `brand.duration.{fast,normal,slow}` · `brand.easing.standard`
- `brand.font-weight.{regular,medium,semibold,bold,black}` · `brand.line-height.{tight,snug,normal}` · `brand.font-size.{sm,md,lg,xl,2xl,3xl,4xl}`

_Bijgewerkt 31-10-2026 (stap 1): definitieve slotlijst. Kleurschalen worden gegenereerd uit `palette.json` (OKLCH, vaste lichtheidscurve). Thema's kunnen erven via `theme.json` (`extends`)._

Klant-eigen namen mogen als **aliassen** naast de slots (`brand.color.lintblauw` → `{brand.color.accent.700}`). Semantische afwijkingen gaan in `overrides.tokens.json` van het thema.

## Gevolgen

- In stap 2 komt `check-contract`: controleert per thema of alle verplichte slots gevuld zijn.
- Slotlijst is definitief sinds stap 1 (zie boven). `check-contract` volgt in stap 2.
