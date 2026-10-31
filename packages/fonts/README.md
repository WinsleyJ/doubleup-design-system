# @doubleup/fonts

Zelf gehoste, open-source variabele fonts (woff2, Latin-subset: alle Nederlandse tekens en €). Geen externe CDN.

| Familie (CSS)                  | Bestand                   | Assen                            | Thema             | Licentie                                |
| ------------------------------ | ------------------------- | -------------------------------- | ----------------- | --------------------------------------- |
| `Archivo Variable`             | `archivo.css`             | gewicht 100–900, breedte 62–125% | `doubleup`        | SIL OFL 1.1                             |
| `Mona Sans Variable`           | `mona-sans.css`           | gewicht 200–900, breedte 75–125% | `showcase-blauw`  | SIL OFL 1.1 (Reserved Font Name "Mona") |
| `Bricolage Grotesque Variable` | `bricolage-grotesque.css` | gewicht 200–800, breedte 75–100% | `showcase-oranje` | SIL OFL 1.1                             |

Bron: Fontsource (`@fontsource-variable/*` v5.3.0), bestanden `*-latin-standard-normal.woff2`. Licentieteksten in `licenses/`.

## Gebruik

Laad alleen de familie van het actieve thema (de familienaam staat in token `brand.font-family.*`):

```css
@import '@doubleup/fonts/archivo.css';
```

Op een showcase-pagina met meerdere thema's laad je alle drie; `font-display: swap` en `unicode-range` zorgen dat alleen wat gebruikt wordt, wordt gedownload.

## Aandachtspunt

Mona Sans heeft een _Reserved Font Name_. We gebruiken het ongewijzigde Fontsource-subset onder de eigen naam, zoals Fontsource en Google Fonts dat ook doen. Wordt Mona Sans ooit voor een klantsite gekozen, dan dit punt even laten bevestigen.
