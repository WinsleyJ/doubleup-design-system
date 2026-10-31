# CLAUDE.md — DoubleUP Design System

Multi-brand design system. Tokens (DTCG) → Style Dictionary v5 → CSS-variabelen → platform-adapters (eerst Themeco Pro/Cornerstone).

## Altijd

- **Begin elke sessie met `PLAN.md` § 9 (Status)** en pak de eerstvolgende open taak. Eén taak per sessie.
- **Eindig elke sessie** met het bijwerken van `PLAN.md` § 9 (status) en § 10 (beslissingen) als er iets besloten is.
- Communiceer en documenteer in het **Nederlands**; code, commits en identifiers in het Engels waar gebruikelijk.
- Twijfel over een keuze die de gebruiker aangaat → eerst vragen.

## Tokenregels (details: `docs/conventies/naamgeving.md`)

- Drie lagen: `brand` (per thema, vaste slots) → common (`basis` + aanvullingen `dup`) → component (`dup`).
- Adapters en componenten gebruiken **nooit** `brand`-tokens, alleen common/component.
- Naamdelen: alleen `a-z`, `0-9`, `-`. Volgorde: prefix.block.element.modifier.property.
- DTCG: `$value`, `$type`, `$description`. Nooit `value`.
- Na elke tokenwijziging: `pnpm build && pnpm check`.

## Commando's

- `pnpm install` · `pnpm build` · `pnpm check` · `pnpm format`

## Waar staat wat

- `packages/tokens/src/{themes,common,components}` — bron-tokens
- `packages/tokens/scripts/` — deterministische checks (gebruik deze i.p.v. handmatig controleren)
- `docs/adr/` — architectuurbeslissingen · `docs/adapters/` — platform-notities
- `adapters/<platform>/` — platform-landingen · `sandboxes/<platform>/` — DDEV-testomgevingen

## Niet doen

- Geen bestanden lezen in `dist/`, `node_modules/`, `sandboxes/*/web/` (gegenereerd/extern).
- Nooit commerciële software (Themeco Pro/Cornerstone) of licentiesleutels committen.
- Cornerstone-kennis alleen uit theme.co docs/changelog/forum; niet uit oude repo's.
- Geen adapters voor andere platforms bouwen vóór mijlpaal M1 (alleen notities/ADR).

## Modellen & agents

Zie `PLAN.md` § 7. Denken = Opus, bouwen = Sonnet, mechanisch/zoeken = Haiku. Subagents alleen voor afgebakende of onafhankelijke taken.
