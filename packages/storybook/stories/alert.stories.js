const ICONS = {
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z',
  success: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2 15-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9Z',
  warning: 'M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z',
  error: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z',
};
const TEXT = {
  info: ['Goed om te weten', 'Je wijzigingen worden automatisch bewaard.'],
  success: ['Gelukt', 'Je aanvraag is verstuurd. We nemen binnen twee werkdagen contact op.'],
  warning: ['Let op', 'Je sessie verloopt over 5 minuten.'],
  error: ['Er ging iets mis', 'Het formulier bevat 1 fout. Controleer het e-mailadres.'],
};
const alert = (type) => `<div class="dup-alert dup-alert--${type}" role="${type === 'error' ? 'alert' : 'status'}">
  <svg class="dup-alert__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${ICONS[type]}"/></svg>
  <div class="dup-alert__message"><h2 class="dup-alert__heading">${TEXT[type][0]}</h2><p class="dup-paragraph" style="margin:0">${TEXT[type][1]}</p></div>
</div>`;

export default { title: 'Componenten/Alert' };

export const Typen = {
  render: () => `<div class="sb-stack">${['info', 'success', 'warning', 'error'].map(alert).join('')}</div>`,
};
