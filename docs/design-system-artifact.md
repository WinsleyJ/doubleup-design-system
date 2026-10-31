# Design System-artifact (claude.ai)

**Link:** https://claude.ai/artifact/TzCAfqRJN9SWEaehCnJi4s (slug `da89e1bc-8dd8-4da2-b998-1ed500335f7c`)

Een **alleen-lezen kopie** van het thema `doubleup` als claude.ai Design System: merkboek, kleurrollen (licht + donker), brand-schalen, typografie, ruimte, afronding, schaduw, 10 componenten met live voorbeelden en richtlijnen, logo's en een cover. Andere Claude-sessies en ontwerptools kunnen het lezen en erop bouwen.

De repo blijft de bron van waarheid (`PLAN.md` § 0). Het artifact staat op `"editing": "code"`: op de pagina zelf kan niets worden gewijzigd.

## Opnieuw synchroniseren (na een wijziging in tokens, CSS of logo's)

1. `pnpm build` (bouwt tokens, CSS en de export in `packages/design-system/dist/project`).
2. Zijn logo's gewijzigd? Upload de bestanden uit `packages/design-system/dist/uploads/` opnieuw als asset naar het artifact en zet de nieuwe blob-id's in `packages/design-system/assets.json`; daarna opnieuw `pnpm --filter @doubleup/design-system-export build`.
3. Publiceer de bestanden uit `dist/project/` naar het artifact (Claude: `publish_files`, mode `patch`, paden `project/<pad>`, `project/design-system.json` als laatste).

Vraag in een Claude-sessie met de repo gekoppeld: _"Synchroniseer het Design System-artifact met de repo"_ — de stappen hierboven staan in deze file.

## Wat er (bewust) niet in staat

- Inverse kleurrollen, `min`/`max`-ruimtes en componenttokens staan niet in de tokenlijst (wel in `components/bundle.css`).
- Vloeiende lettergroottes als desktopwaarde; `font-stretch` in de toelichting.
- Alleen het thema `doubleup`; de showcase-thema's en `voorbeeld` staan in Storybook.
