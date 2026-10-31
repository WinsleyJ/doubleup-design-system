# ADR-005: DDEV voor lokale en CI-testomgevingen

- **Status:** geaccepteerd
- **Datum:** 2026-10-31
- **Beslissers:** Claude (advies), Winsley (akkoord)

## Context

M1 vraagt een WordPress-omgeving met Themeco Pro. Later volgen Drupal, Craft CMS, Astro en EmDash. We willen één reproduceerbare aanpak, ook in (privé) CI. De Pro-licentie mag in privé-CI gebruikt worden.

## Opties

1. wp-env — alleen WordPress
2. Local — alleen WordPress, GUI, niet in CI
3. **DDEV** — WordPress, Drupal en Craft als projecttypes, config in repo, bruikbaar in CI

## Besluit

**DDEV** per platform in `sandboxes/<platform>/`. Astro en EmDash draaien via Node/pnpm.

## Gevolgen

- Elke sandbox: `.ddev/config.yaml` + `seed.sh` (installatie, activeren, demo-inhoud, token-sync).
- Pro/Cornerstone-zip wordt **niet** gecommit: lokaal in `sandboxes/wordpress/vendor-private/`, in CI uit een versleutelde bron (GitHub Secret of privé release-asset).
- Playwright-tests (stap 5) draaien tegen de DDEV-sandbox, lokaal en in CI.
