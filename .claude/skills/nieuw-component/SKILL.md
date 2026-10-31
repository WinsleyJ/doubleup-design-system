---
name: nieuw-component
description: Een nieuw component toevoegen aan het DoubleUP Design System (tokens, referentie-CSS, story, platform-mapping, docs). Gebruik wanneer om een nieuw component of een nieuwe componentvariant wordt gevraagd.
---

# Nieuw component toevoegen

## Voorbereiding

- Naam volgens HTML/CSS/ARIA-termen (`docs/conventies/naamgeving.md`). Bestaat er een NL DS Candidate-component met dezelfde naam? Volg dan diens token-namen voor herkenbaarheid.
- Bepaal varianten (appearance), states (component state) en user action states.

## Stappen

1. **Tokens:** `packages/tokens/src/components/<component>.tokens.json` onder `dup.<component>.…`. Waarden verwijzen naar common (`{basis.…}` of `{dup.…}`), nooit naar `{brand.…}`.
2. `pnpm build && pnpm check`.
3. **Referentie-CSS** (vanaf stap 3): `packages/css/src/<component>.css`, BEM-klassen `.dup-<component>`, `.dup-<component>--<modifier>`, uitsluitend `var(--dup-<component>-…)`.
4. **Story** (vanaf stap 3): alle varianten × states, in beide thema's en beide kleurmodi.
5. **Cornerstone** (vanaf stap 4): Component + Parameters in `adapters/cornerstone/components/`; Parameters exposen alleen toegestane varianten.
6. **Docs:** token-tabel (alfabetisch) laten bijwerken door de `docs-writer`-agent.

## Klaar wanneer

Checks groen, story zonder axe-fouten, Cornerstone-component gebruikt alleen `--dup-…`/`--basis-…`.
