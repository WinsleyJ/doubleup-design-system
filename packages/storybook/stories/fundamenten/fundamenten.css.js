// Stijl voor de documentatiepagina's, als string zodat hij met de story mee-rendert.
export const DOC_CSS = `<style>
.doc { display: grid; gap: var(--basis-space-row-xl); }
.doc table { border-collapse: collapse; inline-size: 100%; font-size: var(--basis-text-font-size-sm); }
.doc th, .doc td { text-align: start; padding: var(--basis-space-block-xs) var(--basis-space-inline-sm); border-block-end: 1px solid var(--basis-color-default-border-subtle); vertical-align: middle; }
.doc th { background: var(--basis-color-default-bg-subtle); font-weight: var(--basis-text-font-weight-bold); position: sticky; inset-block-start: 0; }
.doc code { font-family: var(--basis-text-font-family-monospace); font-size: 0.85em; overflow-wrap: anywhere; }
.doc .scale { display: grid; grid-template-columns: repeat(auto-fit, minmax(5.5rem, 1fr)); gap: var(--basis-space-row-2xs); margin-block-end: var(--basis-space-block-lg); }
.doc .sw { border-radius: var(--basis-border-radius-sm); overflow: hidden; border: 1px solid var(--basis-color-default-border-subtle); }
.doc .sw b { display: flex; align-items: end; block-size: 3.25rem; padding: var(--basis-space-block-2xs) var(--basis-space-inline-xs); font-size: var(--basis-text-font-size-sm); }
.doc .sw span { display: block; padding: var(--basis-space-block-2xs) var(--basis-space-inline-xs); font-family: var(--basis-text-font-family-monospace); font-size: 0.75rem; }
.doc .chip { display: inline-block; inline-size: 1.5rem; block-size: 1.5rem; border-radius: var(--basis-border-radius-sm); box-shadow: inset 0 0 0 1px var(--basis-color-default-border-default); vertical-align: middle; }
.doc .pass { color: var(--basis-color-positive-color-default); font-weight: var(--basis-text-font-weight-bold); }
.doc .fail { color: var(--basis-color-negative-color-default); font-weight: var(--basis-text-font-weight-bold); }
.doc .bar { block-size: 0.75rem; background: var(--basis-color-default-color-document); border-radius: 2px; }
.doc .box { inline-size: 6rem; block-size: 4rem; background: var(--basis-color-default-bg-default); }
.doc .row { display: flex; flex-wrap: wrap; gap: var(--basis-space-row-md); align-items: end; }
.doc figure { margin: 0; display: grid; gap: var(--basis-space-row-2xs); font-size: var(--basis-text-font-size-sm); }
.doc .scroll { max-block-size: 70vh; overflow: auto; border: 1px solid var(--basis-color-default-border-subtle); border-radius: var(--basis-border-radius-sm); }
</style>`;
