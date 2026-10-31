# Sandboxes

Lokale (en CI-)testomgevingen per platform, op basis van [DDEV](https://ddev.com). Zie `docs/adr/005-ddev-lokale-omgevingen.md`.

| Map          | Platform                | Status                                                          |
| ------------ | ----------------------- | --------------------------------------------------------------- |
| `wordpress/` | WordPress + Themeco Pro | basis klaar (stap 0); Pro, child theme en sync volgen in stap 4 |
| `drupal/`    | Drupal                  | na M1                                                           |
| `craft/`     | Craft CMS               | na M1                                                           |

Astro en EmDash hebben geen DDEV nodig; die draaien via `pnpm dev`.

## WordPress starten

```bash
cd sandboxes/wordpress
ddev start
./seed.sh
```

Themeco Pro is commercieel en staat **niet** in git. Zet de zip lokaal neer als `sandboxes/wordpress/vendor-private/pro.zip`.
