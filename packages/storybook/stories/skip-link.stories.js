export default { title: 'Componenten/Skip-link' };

export const Gefocust = {
  render: () => `<div style="position:relative;min-block-size:6rem">
  <a class="dup-skip-link" href="#inhoud">Direct naar de inhoud</a>
  <p class="dup-paragraph" style="padding-block-start:4rem">Druk op Tab om de skip-link te zien. In deze story krijgt hij automatisch focus.</p>
  <main id="inhoud" tabindex="-1"></main>
</div>`,
  play: async ({ canvasElement }) => canvasElement.querySelector('.dup-skip-link')?.focus(),
};
