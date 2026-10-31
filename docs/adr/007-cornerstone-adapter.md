# ADR-007: Cornerstone-adapter — child theme, sync-plugin en componentroute

- **Status:** voorgesteld (componentroute: wacht op keuze Winsley; globals: wacht op sandboxtest T2/T3)
- **Datum:** 2026-10-31
- **Beslissers:** Claude (voorstel), Winsley

## Context

M1 = het design system productieklaar in Themeco Pro/Cornerstone. Spike-resultaten en bronnen: `docs/adapters/cornerstone.md`.

## Besluit (voorgesteld)

1. **Child theme `dup-pro-child`** laadt fonts, thema-CSS en `dup.css` uit gebouwde assets; zet `data-theme` (en via de wisselaar `data-color-scheme`) op `<html>`; `body.dup-document`.
2. **Global Colors = rollen, niet waarden:** ± 14 semantische kleuren met waarde `var(--…)` naar common-tokens (thema- en modusbewust). Fallback na test: `light-dark()`.
3. **Global Variables** (7.9+): ± 25 veelgebruikte tokens als verwijzing, prefix `ds-` (geen botsing met `--dup-*`/`--basis-*`).
4. **Beheer via `wp dup tokens sync`**: alleen items met prefix `dup-`/`ds-`; idempotent; redacteursitems blijven staan.
5. **Componenten — aanbevolen Route B:** Cornerstone Components die de referentie-markup van `@doubleup/css` renderen, met Parameters voor alleen tekst/link/variant/toon. Layout en eenvoudige tekst native met onze klassen. Alternatief Route A: native elementen gestyled met tokens via Element CSS.

## Gevolgen

- Eén bron voor componentstyling (dezelfde CSS als Storybook en de axe-test).
- Redacteuren kiezen uit een beperkte set; afwijken van de huisstijl kost moeite (bewust).
- Sandbox met Pro nodig om T1–T9 (`docs/adapters/cornerstone.md` § 3) te draaien voordat dit ADR "geaccepteerd" wordt.
