const field = ({ id, label, description, error, value = '', placeholder = '', state = '', size = '' }) => `
<div class="dup-form-field">
  <label class="dup-form-field-label${state === 'disabled' ? ' dup-form-field-label--disabled' : ''}" for="${id}">${label}</label>
  ${description ? `<p class="dup-form-field-description" id="${id}-desc">${description}</p>` : ''}
  ${error ? `<p class="dup-form-field-error-message" id="${id}-err"><svg class="dup-form-field-error-message__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z"/></svg>${error}</p>` : ''}
  <input class="dup-text-input${size ? ` dup-text-input--${size}` : ''}" id="${id}" type="text" value="${value}"${placeholder ? ` placeholder="${placeholder}"` : ''}
    ${[description && `${id}-desc`, error && `${id}-err`].filter(Boolean).length ? `aria-describedby="${[description && `${id}-desc`, error && `${id}-err`].filter(Boolean).join(' ')}"` : ''}
    ${error ? 'aria-invalid="true"' : ''}${state === 'disabled' ? ' disabled' : ''}${state === 'readonly' ? ' readonly' : ''}>
</div>`;

export default { title: 'Componenten/Formulierveld' };

export const States = {
  render: () => `<div class="sb-stack">
  ${field({ id: 'naam', label: 'Naam', placeholder: 'Voor- en achternaam' })}
  ${field({ id: 'mail', label: 'E-mailadres', description: 'We sturen alleen een bevestiging.', value: 'naam@domein.nl' })}
  ${field({ id: 'mail2', label: 'E-mailadres', description: 'We sturen alleen een bevestiging.', error: 'Vul een volledig e-mailadres in, bijvoorbeeld naam@domein.nl.', value: 'naam@' })}
  ${field({ id: 'klant', label: 'Klantnummer', value: 'DUP-2026-001', state: 'readonly', description: 'Alleen-lezen' })}
  ${field({ id: 'uit', label: 'Kortingscode', value: '', state: 'disabled', description: 'Niet beschikbaar' })}
</div>`,
};

export const Breedtes = {
  render: () =>
    `<div class="sb-stack">${['xs', 'sm', 'md', 'lg', 'xl', 'stretch'].map((s) => field({ id: `w-${s}`, label: `Breedte ${s}`, size: s })).join('')}</div>`,
};
