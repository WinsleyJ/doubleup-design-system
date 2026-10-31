# Thema's

| Thema             | Doel                                            | Accent                                             | Lettertype                   | Erft van   |
| ----------------- | ----------------------------------------------- | -------------------------------------------------- | ---------------------------- | ---------- |
| `doubleup`        | Huisstijl DoubleUP (productie)                  | Zuurlime `#c6f432`                                 | Archivo, koppen 118% breed   | —          |
| `showcase-blauw`  | Demo: laten zien wat een andere brand-laag doet | Elektrisch blauw `#2f5bff`; info → cyaan `#0891b2` | Mona Sans, koppen 115% breed | `doubleup` |
| `showcase-oranje` | Demo                                            | Signaaloranje `#ff5a1f`                            | Bricolage Grotesque, 100%    | `doubleup` |

Alle thema's zijn tegelijk te laden (CSS per `[data-theme="…"]`); zo kan een showcase-pagina live wisselen.

## Bestanden per thema (`packages/tokens/src/themes/<thema>/`)

| Bestand                             | Inhoud                                                                                                                                                                  |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `palette.json`                      | Invoer: ankerkleuren per slot (neutral, accent, info, positive, warning, negative)                                                                                      |
| `brand-color.tokens.json`           | **Gegenereerd** met `pnpm --filter @doubleup/tokens palette <thema>`                                                                                                    |
| `brand-font.tokens.json`            | `brand.font-family.{display,body,mono}`, `brand.font-stretch.{normal,display}`                                                                                          |
| `brand.tokens.json`                 | Overige schalen (space, radius, border-width, opacity, shadow, duration, easing, font-weight, line-height, font-size). Alleen in `doubleup`; showcase-thema's erven dit |
| `roles.json`                        | Optioneel: afwijkingen van de standaard rol → slot-koppeling per modus (ADR-006). Wordt **niet** geërfd                                                                 |
| `overrides.light\|dark.tokens.json` | **Gegenereerd** uit `roles.json`                                                                                                                                        |
| `theme.json`                        | Optioneel: `{ "extends": "<thema>" }`                                                                                                                                   |

## Hoe het accent wordt ingezet (verschilt per thema)

| Rol                 | doubleup light           | doubleup dark         | showcase-blauw light    | showcase-oranje light  |
| ------------------- | ------------------------ | --------------------- | ----------------------- | ---------------------- |
| Primaire knop       | inkt-vlak, lime tekst    | lime vlak, inkt tekst | accent-600, witte tekst | accent-500, inkt tekst |
| Link                | inkt, lime onderstreping | lime                  | accent-600              | accent-600             |
| Focus               | inkt                     | lime                  | accent-600              | accent-600             |
| Markering/highlight | lime                     | lime                  | accent-600              | accent-500             |

Lime is op wit onleesbaar als tekst (1,3:1); daarom draagt het in light mode alleen vlakken, onderstrepingen en markeringen. `check-contrast` bewaakt dit.

Sinds stap 2 komt dit uit de common-laag: standaard `action-1` → `accent`; `doubleup/roles.json` zet in light `action-1` op `neutral` met `color-on-solid` = lime. De showcase-thema's volgen de standaard.
