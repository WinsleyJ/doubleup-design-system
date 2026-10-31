// Toegankelijkheidstest: elke story × elk thema × elke kleurmodus met axe-core (WCAG 2.0–2.2 A/AA).
// Vereist een statische build: pnpm --filter @doubleup/storybook build
// Rapport: storybook-static/a11y-report.md · exit code 1 bij schendingen.
import { createReadStream, existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../storybook-static/', import.meta.url));
if (!existsSync(join(root, 'index.json'))) {
  console.error('✖ Geen Storybook-build gevonden; draai eerst: pnpm --filter @doubleup/storybook build');
  process.exit(1);
}
const THEMES = ['doubleup', 'showcase-blauw', 'showcase-oranje', 'voorbeeld'];
const MODES = ['light', 'dark'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};
const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(root, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!file.startsWith(root) || !existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const stories = Object.values(JSON.parse(readFileSync(join(root, 'index.json'), 'utf8')).entries).filter(
  (e) => e.type === 'story',
);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const failures = [];
let runs = 0;
for (const s of stories) {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      await page.goto(`${base}/iframe.html?id=${s.id}&viewMode=story&globals=theme:${theme};mode:${mode}`);
      await page.waitForSelector('#storybook-root > *', { timeout: 15000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(150); // play-functies (bv. focus) laten afronden
      await page.addScriptTag({ content: axeSource });
      const result = await page.evaluate(
        (tags) =>
          window.axe.run('#storybook-root', { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] }),
        TAGS,
      );
      runs++;
      for (const v of result.violations)
        failures.push({
          story: `${s.title} › ${s.name}`,
          theme,
          mode,
          rule: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.map((n) => n.target.join(' ')).slice(0, 3),
        });
    }
  }
}
await browser.close();
server.close();

const lines = [
  '# Toegankelijkheidsrapport (axe-core, WCAG 2.2 AA)',
  '',
  `${stories.length} stories × ${THEMES.length} thema's × ${MODES.length} modi = ${runs} controles.`,
  '',
];
if (failures.length) {
  lines.push('| Story | Thema | Modus | Regel | Impact | Elementen |', '|---|---|---|---|---|---|');
  for (const f of failures)
    lines.push(
      `| ${f.story} | ${f.theme} | ${f.mode} | ${f.rule}: ${f.help} | ${f.impact} | \`${f.nodes.join('`, `')}\` |`,
    );
} else lines.push('Geen schendingen gevonden.');
writeFileSync(join(root, 'a11y-report.md'), lines.join('\n') + '\n');

if (failures.length) {
  console.error(`✖ ${failures.length} schending(en) in ${runs} controles (rapport: storybook-static/a11y-report.md)`);
  for (const f of failures.slice(0, 15))
    console.error(`  - ${f.story} [${f.theme}/${f.mode}] ${f.rule} (${f.impact}): ${f.nodes[0]}`);
  process.exit(1);
}
console.log(
  `✔ toegankelijkheid: ${runs} controles (${stories.length} stories × ${THEMES.length} thema's × ${MODES.length} modi) zonder schendingen`,
);
