// Genereert alle logovarianten in svg/. Uitvoer is gelijk aan de projectbestanden _Huisstijl/*.svg,
// plus *-currentcolor.svg-varianten die de tekstkleur (en dus thema/kleurmodus) volgen.
import { mkdirSync, writeFileSync } from 'node:fs';
import { ARROW, U1, U2, WORDMARK } from './src/parts.mjs';

const INK = '#111318';
const WHITE = '#ffffff';
const svg = (viewBox, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="DoubleUP">${body}</svg>`;
const stroke = (d, color, w) =>
  `<path d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none"></path>`;
const arrow = (c) =>
  `<polygon points="${ARROW}" fill="${c}" stroke="${c}" stroke-width="3" stroke-linejoin="round"></polygon>`;

const markMask = (id) =>
  `<mask id="${id}" maskUnits="userSpaceOnUse" x="-5" y="-5" width="50" height="50">${stroke(U1, '#fff', 7)}${stroke(U2, '#000', 10.4)}${stroke(U2, '#fff', 7)}${arrow('#fff')}</mask>`;

const logo = (id, fill) =>
  svg(
    '1.5 -0.5 36 34',
    `${markMask(id)}<rect x="-5" y="-5" width="50" height="50" fill="${fill}" mask="url(#${id})"></rect>`,
  );

const logoLagen = (id, fill) =>
  svg(
    '1.5 -0.5 36 34',
    `<mask id="${id}" maskUnits="userSpaceOnUse" x="-5" y="-5" width="50" height="50">${stroke(U1, '#fff', 7)}${stroke(U2, '#000', 10.4)}</mask><rect x="-5" y="-5" width="50" height="50" fill="${fill}" fill-opacity="0.38" mask="url(#${id})"></rect>${stroke(U2, fill, 7)}${arrow(fill)}`,
  );

const icoon = (id, fill, u1 = '#000') =>
  svg(
    '2 2 36 36',
    `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40"><rect x="2" y="2" width="36" height="36" rx="10" fill="#fff"></rect><g transform="translate(5.6 6.4) scale(0.74)">${stroke(U1, u1, 7)}${stroke(U2, '#fff', 10.4)}${stroke(U2, '#000', 7)}${arrow('#000')}</g></mask><rect x="2" y="2" width="36" height="36" rx="10" fill="${fill}" mask="url(#${id})"></rect>`,
  );

const lockup = (id, fill) =>
  svg(
    '-0.5 0 276 34.5',
    `<g transform="translate(-2 0.5)">${markMask(id)}<rect x="-5" y="-5" width="50" height="50" fill="${fill}" mask="url(#${id})"></rect></g><path transform="translate(38.513 33.5) scale(0.030612)" d="${WORDMARK}" fill="${fill}"></path>`,
  );

const files = {
  'doubleup-logo': logo('dm1', INK),
  'doubleup-logo-wit': logo('dm2', WHITE),
  'doubleup-logo-lagen': logoLagen('dm3a', INK),
  'doubleup-logo-lagen-wit': logoLagen('dm4a', WHITE),
  'doubleup-icoon': icoon('di1', INK),
  'doubleup-icoon-wit': icoon('di2', WHITE),
  'doubleup-icoon-lagen': icoon('di3', INK, '#9e9e9e'),
  'doubleup-icoon-lagen-wit': icoon('di4', WHITE, '#9e9e9e'),
  'doubleup-lockup': lockup('dl1', INK),
  'doubleup-lockup-wit': lockup('dl2', WHITE),
  // Volgen de tekstkleur: werken in elk thema en in light/dark zonder aparte bestanden.
  'doubleup-logo-currentcolor': logo('dm-cc', 'currentColor'),
  'doubleup-logo-lagen-currentcolor': logoLagen('dm-cc-l', 'currentColor'),
  'doubleup-icoon-currentcolor': icoon('di-cc', 'currentColor'),
  'doubleup-lockup-currentcolor': lockup('dl-cc', 'currentColor'),
};

mkdirSync(new URL('./svg/', import.meta.url), { recursive: true });
for (const [name, content] of Object.entries(files))
  writeFileSync(new URL(`./svg/${name}.svg`, import.meta.url), content);
console.log(`✔ ${Object.keys(files).length} logo-bestanden geschreven naar packages/icons/svg/`);
