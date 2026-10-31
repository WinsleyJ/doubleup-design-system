---
name: nieuw-thema
description: Een nieuw thema (klant of proefthema) toevoegen aan het DoubleUP Design System. Gebruik wanneer om een nieuwe huisstijl, klantthema of brand-laag wordt gevraagd.
---

# Nieuw thema toevoegen

Een nieuw thema = een nieuwe **brand-laag**. Common, componenten en adapters blijven ongewijzigd (ADR-003).

## Benodigd van de gebruiker

Vraag wat ontbreekt: themanaam (alleen `a-z0-9-`), kleuren (hex of omschrijving), lettertypes (self-hosted open source), logo's. Ontbreekt een accent of neutral-schaal, stel er één voor en laat kiezen.

## Stappen

1. Map `packages/tokens/src/themes/<thema>/` aanmaken.
2. `brand.tokens.json` maken met **alle verplichte slots** uit ADR-003 (gebruik `themes/doubleup/brand.tokens.json` als voorbeeld van de structuur, niet van de waarden).
3. Eigen klantnamen alleen als alias naast de slots.
4. Wijkt de klant semantisch af (bv. links ≠ actiekleur)? Alleen dan `overrides.tokens.json` met `basis`/`dup`-tokens.
5. Fonts: woff2 in `packages/fonts/<thema>/` (zodra die package bestaat).
6. `pnpm build && pnpm check` — moet groen zijn (naamconventie, contract, contrast in light én dark).
7. Platform: `wp dup tokens sync --theme=<thema>` in de WordPress-sandbox (zodra stap 4 klaar is).
8. `PLAN.md` § 9/§ 10 bijwerken.

## Klaar wanneer

Build en alle checks groen; er is niets gewijzigd buiten `src/themes/<thema>/` (en eventueel fonts/logo's).
