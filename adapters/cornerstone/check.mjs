// Controles voor de Cornerstone-adapter (zonder WordPress/Pro):
//  1. PHP-syntaxis van child theme en plugin (php -l);
//  2. unittest van de samenvoeglogica (tests/merge-test.php);
//  3. globals.json verwijst alleen naar bestaande tokens (gecontroleerd in build.mjs).
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const here = new URL('.', import.meta.url).pathname;
const php = (args) => execFileSync('php', args, { encoding: 'utf8' });
try {
  php(['-v']);
} catch {
  console.error('✖ php niet gevonden; installeer PHP 8.1+ om de adapter te controleren');
  process.exit(1);
}
const files = [];
const walk = (d) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (n === 'assets' || n === 'node_modules') continue;
    if (statSync(p).isDirectory()) walk(p);
    else if (n.endsWith('.php')) files.push(p);
  }
};
walk(join(here, 'child-theme'));
walk(join(here, 'plugin'));
for (const f of files) php(['-l', f]);
console.log(`✔ PHP-syntaxis: ${files.length} bestanden`);
try {
  process.stdout.write(php([join(here, 'tests', 'merge-test.php')]));
} catch (e) {
  process.stdout.write(e.stdout ?? '');
  console.error('✖ merge-test faalt');
  process.exit(1);
}
console.log('✔ samenvoeglogica Cornerstone-globals');
