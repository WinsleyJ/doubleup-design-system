// Wisselaar licht/donker voor [dup_color_scheme_toggle].
// Zet data-color-scheme op <html> (samen met data-theme, zie ADR-006) en onthoudt de keuze.
(() => {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const current = () => root.getAttribute('data-color-scheme') || (media.matches ? 'dark' : 'light');

  const render = () => {
    const dark = current() === 'dark';
    document.querySelectorAll('[data-dup-color-scheme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(dark));
      btn.querySelector('[data-label-light]')?.toggleAttribute('hidden', dark);
      btn.querySelector('[data-label-dark]')?.toggleAttribute('hidden', !dark);
    });
  };

  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-dup-color-scheme-toggle]');
    if (!btn) return;
    const next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-color-scheme', next);
    try {
      localStorage.setItem('dup-color-scheme', next);
    } catch {
      /* opslag niet beschikbaar: alleen voor deze pagina */
    }
    render();
  });

  media.addEventListener('change', render);
  render();
})();
