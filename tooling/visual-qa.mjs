import { chromium } from '@playwright/test';
import { mkdir, readFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
await mkdir('test-results/visual', { recursive: true });
// Original reference is served only inside the test browser, never in dist/.
const original = Object.fromEntries(['index.html', 'style.css', 'script.js'].map((file) => [file, execFileSync('git', ['show', `HEAD:${file}`])]));
original['logo.png'] = await readFile('logo.png');
await rm('dist/qa-original', { recursive: true, force: true });
const browser = await chromium.launch();
const page = await browser.newPage();
await page.route('**/qa-original/*', (route) => {
  const file = new URL(route.request().url()).pathname.split('/').pop();
  const contentType = { 'index.html': 'text/html', 'style.css': 'text/css', 'script.js': 'text/javascript', 'logo.png': 'image/png' }[file];
  return original[file] ? route.fulfill({ body: original[file], contentType }) : route.abort();
});
for (const colorScheme of ['light', 'dark']) {
  await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
  for (const [width, height] of [[375, 812], [390, 844], [768, 1024], [1440, 900], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto('http://127.0.0.1:4173');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `test-results/visual/${colorScheme}-${width}-top.png` });
    await page.screenshot({ path: `test-results/visual/${colorScheme}-${width}.png`, fullPage: true });
    if (width === 375 || width === 1440) {
      for (const section of ['about', 'experience', 'projects', 'skills', 'contact']) {
        await page.locator(`#${section}`).screenshot({ path: `test-results/visual/${colorScheme}-${width}-${section}.png` });
      }
    }
  }
}
for (const variant of ['qa-original/index.html', '']) {
  for (const color of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: color, reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`http://127.0.0.1:4173/${variant}`);
    await page.evaluate((theme) => { document.documentElement.dataset.theme = theme; }, color);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `test-results/visual/${variant ? 'original' : 'restored'}-${color}-hero.png` });
  }
}
console.log('Saved original/restored comparisons and light/dark visual QA in test-results/visual');
await browser.close();
