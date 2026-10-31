# ADR-001: Tokenformaat DTCG + Style Dictionary v5

- **Status:** geaccepteerd
- **Datum:** 2026-10-31
- **Beslissers:** Winsley, Claude

## Context

Het projectdocument _Design Tokens_ toont voorbeelden in het oude Style Dictionary-formaat (`value`). Sinds Style Dictionary v4 wordt het W3C DTCG-formaat (`$value`, `$type`, `$description`) native ondersteund; v5.5 ondersteunt ook DTCG 2025.10 (o.a. dimension als object). Style Dictionary kan beide formaten niet binnen één build mengen. NL DS gebruikt in `basis`/Candidate ook `$type`/`$extensions`.

## Opties

1. Oud Style Dictionary-formaat (`value`)
2. DTCG (`$value`, `$type`)

## Besluit

**DTCG**, gebouwd met **Style Dictionary 5.x** (nu 5.7.1, vastgepind). Bestanden eindigen op `.tokens.json`.

## Gevolgen

- Compatibel met NL DS, Figma-variabelen-imports, Tokens Studio en andere DTCG-tools.
- `validate-names` weigert tokens met `value` zonder `$value`.
- Dimension-tokens schrijven we voorlopig als string (`"1rem"`); overstap naar objectnotatie (`{ "value": 1, "unit": "rem" }`) pas als alle consumers dit ondersteunen.
