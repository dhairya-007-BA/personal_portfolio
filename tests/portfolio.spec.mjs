import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const theme = (page) => page.locator('html');

test('OS is the only theme source; live changes, reload and old preference cleanup', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('portfolio-theme', 'dark'));
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(theme(page)).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBeNull();
  await expect(page.getByLabel('Color theme')).toHaveCount(0);
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(theme(page)).toHaveAttribute('data-theme', 'dark');
  expect(await page.locator('html').evaluate((el) => getComputedStyle(el).colorScheme)).toBe('dark');
  await page.reload();
  await expect(theme(page)).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(theme(page)).toHaveAttribute('data-theme', 'light');
});

test('system theme works when storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, 'removeItem', { value: () => { throw new Error('blocked'); } });
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(theme(page)).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(theme(page)).toHaveAttribute('data-theme', 'light');
});

test('mobile menu supports keyboard, Escape, outside click, navigation and resizing', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Toggle navigation' });
  const links = page.locator('#nav-links');
  await expect(links).toBeHidden();
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(page.locator('.nav-link').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused();
  await expect(links).toBeHidden();
  await button.click();
  await page.mouse.click(5, 600);
  await expect(links).toBeHidden();
  await button.click();
  await page.locator('.nav-link[href="#projects"]').click();
  await expect(links).toBeHidden();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('#projects')).toBeFocused();
  await button.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(links).toBeVisible();
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(links).toBeHidden();
});

for (const colorScheme of ['light', 'dark']) {
  test(`${colorScheme}: all requested widths have no overflow and all sections remain visible`, async ({ page }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    await page.goto('/');
    for (const width of [320, 360, 375, 390, 414, 430, 768, 820, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `overflow at ${width}`).toBe(true);
      const overflows = await page.locator('main *').evaluateAll((els) => els.filter((el) => {
        const rect = el.getBoundingClientRect();
        return !el.closest('.pc-viewport') && rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1);
      }).map((el) => el.className));
      expect(overflows, `elements overflow at ${width}`).toEqual([]);
      const logo = page.locator('.logo-fixed img');
      await expect(logo).toBeVisible();
      expect(await logo.evaluate((img) => img.complete && img.naturalWidth > 0 && Math.abs(img.clientWidth - img.clientHeight) <= 1)).toBe(true);
      await page.emulateMedia({ colorScheme: colorScheme === 'dark' ? 'light' : 'dark' });
      await expect(theme(page)).toHaveAttribute('data-theme', colorScheme === 'dark' ? 'light' : 'dark');
      await page.emulateMedia({ colorScheme });
      await expect(theme(page)).toHaveAttribute('data-theme', colorScheme);
      for (const id of ['home', 'about', 'experience', 'projects', 'skills', 'contact']) {
        await expect(page.locator(`#${id}`)).toBeVisible();
      }
    }
  });
  test(`${colorScheme}: WCAG 2.1 AA desktop and mobile audit`, async ({ page }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    await page.goto('/');
    for (const width of [1440, 375]) {
      await page.setViewportSize({ width, height: 900 });
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations).toEqual([]);
    }
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  });
}

test('content, local links, metadata, and assets; no runtime errors', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', (response) => { if (response.url().startsWith('http://127.0.0.1') && response.status() >= 400) errors.push(response.url()); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page).toHaveTitle(/Business Analyst & Data Analytics/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dhairya Singhal');
  await expect(page.getByRole('heading', { name: 'Teaching Assistant', exact: true })).toBeVisible();
  const experience = page.locator('.t-card').filter({ has: page.getByRole('heading', { name: 'Teaching Assistant', exact: true }) });
  await expect(experience).toContainText('September 2026 – December 2026');
  await expect(experience).toContainText('BUS 217W — Critical Thinking in Business');
  await expect(page.locator('.p-card')).toHaveCount(10);
  await expect(page.locator('.pc-pause, .theme-control, .contact-email')).toHaveCount(0);
  for (const href of await page.locator('a').evaluateAll((links) => links.map((a) => a.getAttribute('href')))) {
    expect(href).toBeTruthy();
    if (href.startsWith('#')) await expect(page.locator(href)).toHaveCount(1);
    else if (!href.includes(':')) expect((await request.get(href)).ok()).toBe(true);
  }
  expect(await page.locator('a[target="_blank"]').evaluateAll((links) => links.every((a) => a.rel.includes('noopener') && a.rel.includes('noreferrer')))).toBe(true);
  expect(await page.locator('body').innerText()).not.toMatch(/dhairyasinghal403@gmail.com|Chief Project Manager/i);
  await expect(page.locator('.timeline h3')).toHaveText(['Teaching Assistant', 'Supply Chain Analyst (Co-op)', 'Junior Business Analyst (Co-op)', 'Data Research Assistant']);
  const ids = await page.locator('[id]').evaluateAll((elements) => elements.map((el) => el.id));
  expect(new Set(ids).size).toBe(ids.length);
  await expect(page.getByRole('link', { name: 'Email', exact: true })).toHaveAttribute('href', 'mailto:dhairyasinghal403@gmail.com');
  expect(errors).toEqual([]);
});

test('contact validates without clearing the draft; skip link and reduced motion work', async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  expect(await page.locator('html').evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe('auto');
  await page.getByRole('button', { name: 'Open email draft' }).click();
  await expect(page.locator('input[name="name"]')).toBeFocused();
  await page.getByLabel('Name', { exact: true }).fill('   ');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('recruiter@example.com');
  await page.getByLabel('Message', { exact: true }).fill('Hello Dhairya');
  await page.getByRole('button', { name: 'Open email draft' }).click();
  await expect(page.getByRole('status')).toContainText('not just spaces');
  await page.getByLabel('Name', { exact: true }).fill('Recruiter');
  await page.getByRole('button', { name: 'Open email draft' }).click();
  await expect(page.getByRole('status')).toContainText('Send it in your email app');
  await expect(page.getByLabel('Message', { exact: true })).toHaveValue('Hello Dhairya');
});

test('content and navigation remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 }, colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173');
  expect(await page.locator('html').evaluate((el) => getComputedStyle(el).colorScheme)).toBe('dark');
  await page.emulateMedia({ colorScheme: 'light' });
  expect(await page.locator('html').evaluate((el) => getComputedStyle(el).colorScheme)).toBe('light');
  await expect(page.locator('.nav-links')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Teaching Assistant', exact: true })).toBeVisible();
  await expect(page.locator('.p-card')).toHaveCount(10);
  await context.close();
});

test('carousel arrows and every project link remain keyboard accessible', async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const viewport = page.locator('.pc-viewport');
  await viewport.scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Next project', exact: true }).click();
  await expect.poll(() => viewport.evaluate((el) => el.scrollLeft)).toBeGreaterThan(200);
  await page.getByRole('button', { name: 'Previous project', exact: true }).click();
  await expect.poll(() => viewport.evaluate((el) => el.scrollLeft)).toBeLessThan(2);
  const links = page.locator('.p-card a');
  await links.first().focus();
  for (let i = 1; i < await links.count(); i++) {
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    await expect(links.nth(i)).toBeFocused();
    const inside = await links.nth(i).evaluate((link) => {
      const viewport = link.closest('.pc-viewport').getBoundingClientRect();
      const rect = link.getBoundingClientRect();
      return rect.left >= viewport.left - 1 && rect.right <= viewport.right + 1;
    });
    expect(inside).toBe(true);
  }
});


test('automatic rotation waits for reading and pauses on interaction and live reduced motion', async ({ page }) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  // Avoid smooth document scrolling during this timer-focused test.
  await page.locator('#projects').evaluate((el) => el.scrollIntoView({ behavior: 'instant' }));
  const viewport = page.locator('.pc-viewport');
  await expect(viewport).toBeInViewport();
  await page.clock.runFor(1000);
  await page.clock.runFor(10000);
  expect(await viewport.evaluate((el) => el.scrollLeft)).toBe(0);
  await page.clock.runFor(2500);
  const step = await page.locator('.p-card').first().evaluate((el) => el.getBoundingClientRect().width + 16);
  await expect.poll(() => viewport.evaluate((el) => el.scrollLeft)).toBeCloseTo(step, 0);
  await viewport.hover();
  const hovered = await viewport.evaluate((el) => el.scrollLeft);
  await page.clock.runFor(13000);
  expect(await viewport.evaluate((el) => el.scrollLeft)).toBe(hovered);
  await page.mouse.move(0, 0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.runFor(13000);
  expect(await viewport.evaluate((el) => el.scrollLeft)).toBe(hovered);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('.p-card a').nth(1).focus();
  const focused = await viewport.evaluate((el) => el.scrollLeft);
  await page.clock.runFor(13000);
  expect(await viewport.evaluate((el) => el.scrollLeft)).toBe(focused);
});

test('page lifecycle stops rotation and restores it without duplicate handlers', async ({ page }) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('#projects').evaluate((el) => el.scrollIntoView({ behavior: 'instant' }));
  const viewport = page.locator('.pc-viewport');
  await expect(viewport).toBeInViewport();
  await page.clock.runFor(1000);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
  await page.clock.runFor(13000);
  expect(await viewport.evaluate((el) => el.scrollLeft)).toBe(0);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await page.clock.runFor(1000);
  await page.clock.runFor(13000);
  await expect.poll(() => viewport.evaluate((el) => el.scrollLeft)).toBeGreaterThan(200);
});
