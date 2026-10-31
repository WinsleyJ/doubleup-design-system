# @doubleup/css

Referentiecomponenten in pure HTML/CSS. Platform-adapters (Cornerstone, Gutenberg, …) gebruiken dezelfde klassen of mappen hun eigen componenten op dezelfde tokens.

```html
<link rel="stylesheet" href="@doubleup/tokens/css/doubleup.css" />
<link rel="stylesheet" href="@doubleup/css" />
<body class="dup-document" data-theme="doubleup">
  …
</body>
```

| Component     | Klassen                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Document      | `.dup-document` (achtergrond, tekst, focusstijl)                                                                       |
| Heading       | `.dup-heading-1` … `.dup-heading-6`                                                                                    |
| Paragraph     | `.dup-paragraph`, `--lead`                                                                                             |
| Link          | `.dup-link` (+ `aria-current="page"`, `aria-disabled="true"`)                                                          |
| Mark          | `.dup-mark`                                                                                                            |
| Button        | `.dup-button` + `--primary` \| `--secondary` \| `--subtle`, toon `--positive` \| `--negative`, `--icon-only`, `__icon` |
| Formulierveld | `.dup-form-field`, `.dup-form-field-label`, `.dup-form-field-description`, `.dup-form-field-error-message`             |
| Text input    | `.dup-text-input` + `--xs` … `--xl`, `--stretch`; states via `aria-invalid`, `disabled`, `readonly`                    |
| Alert         | `.dup-alert` + `--info` \| `--success` \| `--warning` \| `--error`, `__icon`, `__message`, `__heading`                 |
| Card          | `.dup-card`, `--link` (hele kaart klikbaar via `__link`), `__subtle`                                                   |
| Navigation    | `.dup-navigation`, `__list`, `__link` (+ `aria-current="page"`)                                                        |
| Skip-link     | `.dup-skip-link`                                                                                                       |

Regels (afgedwongen door `pnpm check`): alleen `--dup-*`/`--basis-*`-tokens, nooit `--brand-*`; interne hulpvariabelen heten `--_*`.
