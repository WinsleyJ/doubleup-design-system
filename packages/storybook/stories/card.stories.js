const card = (n, title, text, link) => `<article class="dup-card${link ? ' dup-card--link' : ''}">
  <span class="dup-card__subtle">0${n}</span>
  <h3 class="dup-heading-4">${link ? `<a class="dup-card__link" href="#">${title}</a>` : title}</h3>
  <p class="dup-card__subtle">${text}</p>
</article>`;

export default { title: 'Componenten/Card' };

export const Standaard = {
  render: () => `<div class="sb-grid">
  ${card(1, 'Huisstijl in tokens', 'Kleur, type en ruimte als één bron, voor elk platform.')}
  ${card(2, 'Cornerstone-landing', 'Componenten die redacteuren veilig kunnen gebruiken.')}
  ${card(3, 'Toegankelijk', 'WCAG 2.2 AA, automatisch getoetst bij elke wijziging.')}
</div>`,
};

export const Klikbaar = {
  render: () => `<div class="sb-grid">
  ${card(1, 'Huisstijl in tokens', 'De hele kaart is klikbaar via de titel.', true)}
  ${card(2, 'Cornerstone-landing', 'Hover en focus op de kaart.', true)}
</div>`,
};
