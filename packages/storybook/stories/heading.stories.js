export default { title: 'Componenten/Heading' };

export const Niveaus = {
  render: () =>
    [1, 2, 3, 4, 5, 6]
      .map(
        (l) =>
          `<p class="sb-label">dup-heading-${l}</p><h${l} class="dup-heading-${l}">Websites die je merk verdubbelen</h${l}>`,
      )
      .join(''),
};
