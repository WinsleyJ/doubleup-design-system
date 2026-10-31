---
name: nieuw-thema
description: Een nieuw thema (klant, showcase of proefthema) toevoegen aan het DoubleUP Design System. Gebruik wanneer om een nieuwe huisstijl, klantthema of brand-laag wordt gevraagd.
---

# Nieuw thema toevoegen

Een nieuw thema = een nieuwe **brand-laag**. Common, componenten en adapters blijven ongewijzigd (ADR-003). Overzicht van bestaande thema's en bestanden: `docs/themas.md`.

## Benodigd van de gebruiker

Vraag wat ontbreekt: themanaam (alleen `a-z0-9-`), merkkleur(en) (hex), lettertype (self-hosted open source), logo's. Ontbreekt een accent, stel er drie voor (zoals in stap 1) en laat kiezen.

## Stappen

1. Map `packages/tokens/src/themes/<thema>/`.
2. **Erven of niet?** Lijkt het thema op een bestaand thema en verschillen alleen kleur/letter → `theme.json` met `{ "extends": "doubleup" }`. Anders: eigen `brand.tokens.json` met alle schalen (kopieer de structuur van `doubleup`, niet de waarden).
3. `palette.json`: ankerkleuren voor `neutral` (met `"kind": "neutral"`), `accent`, `info`, `positive`, `warning`, `negative`. Botst het accent met een meldingskleur, verschuif dan de meldingskleur.
4. `pnpm --filter @doubleup/tokens palette <thema>` → schrijft `brand-color.tokens.json`.
5. `brand-font.tokens.json`: `brand.font-family.{display,body,mono}` en `brand.font-stretch.{normal,display}`. Fontbestand + `@font-face` in `packages/fonts` (OFL-licentie meeleveren).
6. Alleen als de standaard rolkoppeling niet past (bv. een heel licht accent): `roles.json` met afwijkingen per modus (ADR-006, voorbeeld: `themes/doubleup/roles.json`). Daarna `pnpm --filter @doubleup/tokens roles`.
7. Klant-eigen kleurnamen alleen als alias naast de slots.
8. `pnpm build && pnpm check` — naamconventie, contract (alle brand-slots) én contrast (light + dark) moeten groen zijn. Rapport: `packages/tokens/dist/reports/contrast.md`.
9. Thema toevoegen aan `docs/themas.md`; `PLAN.md` § 9/§ 10 bijwerken.
10. Platform (vanaf stap 4): `wp dup tokens sync --theme=<thema>`.

## Klaar wanneer

Build en alle checks groen; niets gewijzigd buiten het thema, `packages/fonts` en documentatie.
