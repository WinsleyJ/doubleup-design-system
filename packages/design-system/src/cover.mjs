// Cover van het Design System-artifact (components/Cover/preview.html).
export const cover = () => `<!-- @dsCard height=300 -->
<style>
  .cv { position: relative; inline-size: 960px; block-size: 300px; background: var(--basis-color-default-bg-document); overflow: hidden; }
  .cv svg { position: absolute; inset: 0; }
  .ink { fill: var(--basis-color-default-color-document); }
  .lime { fill: var(--brand-color-accent-200); }
  .tint { fill: var(--basis-color-default-bg-active); }
  .arc { fill: none; stroke: var(--brand-color-accent-200); stroke-linecap: round; }
  .arc-ink { fill: none; stroke: var(--basis-color-default-bg-document); stroke-linecap: round; }
  .cv-text { position: absolute; inset-inline-start: 40px; inset-block-end: 40px; max-inline-size: 420px; }
  .cv-name { margin: 0; font-family: var(--font-display); font-weight: 800; font-stretch: 118%; font-size: 70px; line-height: 0.92; letter-spacing: -0.01em; color: var(--basis-color-default-color-document); }
  .cv-tag { margin: 12px 0 0; font-family: var(--font-display); font-size: 14px; color: var(--basis-color-default-color-subtle); }
</style>
<div class="cv">
  <svg viewBox="0 0 960 300" width="960" height="300" aria-hidden="true">
    <!--
      blocks: inkt-slab (basis-color-default-color-document) 224×300, lime (brand-color-accent-200) 192×144 met radius round (72), tint (basis-color-default-bg-active) 160×112 met radius md
      arrangement: één hoge slab met twee satellieten rechts, lime blok bloedt over de bovenrand
      pattern: letterlijk motief — de dubbele U-bogen van het beeldmerk, als halve rondingen in lime over de inkt-slab ("ronde lijneinden, pilvorm" uit het merkboek)
      scales: breedtes/afstanden uit basis-space (32, 48, 64), streek 24 = lg-ruimte, radii round en md
    -->
    <rect class="ink" x="512" y="0" width="224" height="300"/>
    <rect class="lime" x="768" y="-24" width="192" height="144" rx="72"/>
    <rect class="tint" x="768" y="152" width="160" height="112" rx="12"/>
    <path class="arc" stroke-width="24" d="M560 96 V176 A48 48 0 0 0 656 176 V96"/>
    <path class="arc-ink" stroke-width="40" d="M608 120 V176 A48 48 0 0 0 704 176 V72"/>
    <path class="arc" stroke-width="24" d="M608 120 V176 A48 48 0 0 0 704 176 V72"/>
  </svg>
  <div class="cv-text">
    <p class="cv-name">DoubleUP</p>
    <p class="cv-tag">Eén design system, elk platform — licht en donker.</p>
  </div>
</div>
`;
