// Controleert de referentie-CSS:
//  1. geen brand-tokens (--brand-*): componenten gebruiken alleen common (--basis-*, --dup-*) en component-tokens;
//  2. elke var(--…) bestaat als token in de gebouwde thema-CSS (vangt typfouten);
//  3. interne hulpvariabelen heten --_* en worden in hetzelfde bestand gedeclareerd.
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let themeCss;
try {
  themeCss = readFileSync(require.resolve('@doubleup/tokens/css/doubleup.css'), 'utf8');
} catch {
  console.error('✖ @doubleup/tokens is niet gebouwd; draai eerst pnpm build');
  process.exit(1);
}
const defined = new Set([...themeCss.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1]));

const errors = [];
let uses = 0;
const dir = new URL('./src/', import.meta.url);
for (const f of readdirSync(dir).filter((n) => n.endsWith('.css'))) {
  const css = readFileSync(new URL(f, dir), 'utf8');
  const local = new Set([...css.matchAll(/(--_[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
  for (const [, name] of css.matchAll(/var\((--[a-z0-9_-]+)/g)) {
    uses++;
    if (name.startsWith('--brand-'))
      errors.push(`${f}: gebruikt brand-token ${name}; gebruik een component- of common-token`);
    else if (name.startsWith('--_')) {
      if (!local.has(name)) errors.push(`${f}: hulpvariabele ${name} wordt niet in dit bestand gedeclareerd`);
    } else if (!defined.has(name)) errors.push(`${f}: onbekend token ${name}`);
  }
}
if (errors.length) {
  console.error(`✖ ${errors.length} fout(en) in de referentie-CSS:\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✔ referentie-CSS: ${uses} token-verwijzingen, allemaal bestaand en zonder brand-tokens`);
