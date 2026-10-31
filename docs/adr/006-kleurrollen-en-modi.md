# ADR-006: Kleurrollen, vulkleuren en kleurmodi

- **Status:** geaccepteerd
- **Datum:** 2026-10-31
- **Beslissers:** Claude (uitwerking ADR-004), ter review Winsley

## Context

De common-laag volgt NL DS `basis` (ADR-004). `basis.color.<rol>` kent 13 rollen (+ `-inverse`), elk met 14 eigenschappen (`bg-document` … `color-document`). Er is geen token voor een stevige vulkleur (knoppen), en `basis` zegt niets over dark mode. Thema's verschillen in hoe het accent wordt ingezet (lime is op wit onleesbaar als tekst).

## Besluit

1. **Gegenereerd, niet handgeschreven.** `scripts/generate-color-roles.mjs` vult alle rollen via een vaste **trap** per modus (welke schaalstap hoort bij welke eigenschap) en een standaard koppeling rol → brand-slot (`action-1` → `accent`, `default` → `neutral`, …). Uitvoer: `src/common/color.light|dark.tokens.json`.
2. **Vulkleuren onder `dup`:** `dup.color.<rol>.{bg-solid, bg-solid-hover, bg-solid-active, color-on-solid}`. Ze verwijzen naar brand-aliassen `brand.color.<slot>.{solid, solid-hover, solid-active, on-solid}` die `generate-palette.mjs` per slot berekent (anker = vulkleur; tekstkleur = wit of inkt, wat het meeste contrast geeft; hover = één stap richting méér contrast).
3. **Inverse rollen** zien eruit als de andere modus (donkere band op een lichte pagina gebruikt de donkere trap).
4. **Afwijkingen per thema** in `roles.json` (`roles`: andere slot per rol; `tokens`: losse eigenschap). De generator schrijft alleen de verschillen naar `overrides.light|dark.tokens.json` in dat thema. `extends` erft brand-bestanden, **geen** overrides of `roles.json`.
5. **Contrast staat bij het token:** `$extensions["dup.contrast"] = [{ against, use }]`. `check-contrast` toetst alle vereisten per thema × modus.
6. **Modi in CSS:** één bestand per thema. `[data-theme="t"]` = alle tokens (licht); `[data-theme="t"][data-color-scheme="dark"]` en `@media (prefers-color-scheme: dark) { [data-theme="t"]:not([data-color-scheme="light"]) }` = alleen de kleurtokens (donker). **Regel: `data-color-scheme` staat altijd samen met `data-theme` op hetzelfde element.** Daardoor zijn alle selectors even specifiek en wint het dichtstbijzijnde thema, ook bij nesting.

## Gevolgen

- Nieuwe kleurrol of andere trap = generator aanpassen, niet honderden tokens.
- Showcase/nesting werkt (getest: thema in thema, licht in donker).
- Een sectie die alleen de modus wisselt, moet ook `data-theme` herhalen (`<section data-theme="doubleup" data-color-scheme="dark">`).
- In donkere modus zijn `bg-subtle` en `bg-default` van gekleurde rollen gelijk (stap 900); nodig om de actieve toestand op 4,5:1 te houden.
