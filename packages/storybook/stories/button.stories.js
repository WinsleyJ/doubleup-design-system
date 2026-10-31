const ARROW = `<svg class="dup-button__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>`;
const btn = ({ variant = 'primary', tone = '', label = 'Knop', disabled = false, icon = false }) =>
  `<button type="button" class="dup-button dup-button--${variant}${tone ? ` dup-button--${tone}` : ''}"${disabled ? ' disabled' : ''}>${label}${icon ? ARROW : ''}</button>`;

export default {
  title: 'Componenten/Button',
  render: (args) => btn(args),
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'subtle'] },
    tone: { control: 'inline-radio', options: ['', 'positive', 'negative'] },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    icon: { control: 'boolean' },
  },
  args: { variant: 'primary', tone: '', label: 'Plan een gesprek', disabled: false, icon: false },
};

export const Speeltuin = {};

export const Varianten = {
  render: () =>
    ['primary', 'secondary', 'subtle']
      .map(
        (v) => `<p class="sb-label">${v}</p><div class="sb-row">
        ${btn({ variant: v, label: 'Standaard' })}
        ${btn({ variant: v, tone: 'positive', label: 'Positief' })}
        ${btn({ variant: v, tone: 'negative', label: 'Negatief' })}
        ${btn({ variant: v, label: 'Met icoon', icon: true })}
        ${btn({ variant: v, label: 'Uitgeschakeld', disabled: true })}</div>`,
      )
      .join(''),
};

export const AlleenIcoon = {
  name: 'Alleen icoon',
  render: () =>
    `<button type="button" class="dup-button dup-button--primary dup-button--icon-only" aria-label="Volgende">${ARROW}</button>`,
};
