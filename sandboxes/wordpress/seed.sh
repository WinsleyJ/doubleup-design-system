#!/usr/bin/env bash
# Zet de WordPress-sandbox op (idempotent). Uitvoeren vanuit sandboxes/wordpress/:
#   ddev start && ./seed.sh
#
# Themeco Pro (commercieel) wordt NIET meegeleverd. Plaats de zip lokaal in:
#   vendor-private/pro.zip
# In privé-CI wordt dit bestand uit een versleutelde bron gehaald (zie ADR-005).
set -euo pipefail

cd "$(dirname "$0")"

SITE_URL="https://dup-wordpress.ddev.site"
ADMIN_USER="${ADMIN_USER:-admin}"
ADMIN_PASS="${ADMIN_PASS:-admin}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@example.com}"

if ! ddev wp core is-installed >/dev/null 2>&1; then
  ddev wp core download --locale=nl_NL --skip-content --force
  ddev wp core install \
    --url="$SITE_URL" \
    --title="DUP sandbox" \
    --admin_user="$ADMIN_USER" \
    --admin_password="$ADMIN_PASS" \
    --admin_email="$ADMIN_EMAIL" \
    --skip-email
  ddev wp option update permalink_structure '/%postname%/'
fi

# Themeco Pro (optioneel tot stap 4)
if [[ -f vendor-private/pro.zip ]]; then
  ddev wp theme install vendor-private/pro.zip --force
else
  echo "ℹ vendor-private/pro.zip niet gevonden — Pro wordt overgeslagen (nodig vanaf stap 4)."
fi

# Child theme en sync-plugin komen uit de monorepo via .ddev/docker-compose.dup.yaml.
# Eerst bouwen (vanuit de repo-root): pnpm build
if ddev wp theme is-installed pro >/dev/null 2>&1; then
  ddev wp theme activate dup-pro-child
  ddev wp plugin activate dup-tokens-sync
  ddev wp dup tokens sync
else
  echo "ℹ Pro niet geïnstalleerd: child theme en sync overgeslagen."
fi

echo "✔ Sandbox klaar: $SITE_URL (admin: $ADMIN_USER)"
