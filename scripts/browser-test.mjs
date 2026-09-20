import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const site = JSON.parse(await readFile('data/site.json', 'utf8'));
const catalog = JSON.parse(await readFile('data/catalog.json', 'utf8'));
const base = new URL(site.siteUrl).pathname.replace(/\/$/, '');
const origin = 'http://127.0.0.1:4173';
const url = (route = '/') => `${origin}${base}${route}`;
const routes = ['/', '/san-pham/', '/gioi-thieu/', '/lien-he/', '/cam-nang/'];
const failures = [];
const reports = [];
let server;
let browser;
const pause = (ms) => new Promise((done) => setTimeout(done, ms));

async function test(label, operation) {
  try { await operation(); console.log(`PASS ${label}`); }
  catch (error) { failures.push(`${label}: ${error.message}`); console.error(`FAIL ${label}: ${error.message}`); }
}
async function assertLayout(page, label) {
  assert(await page.locator('h1').isVisible(), `${label}: h1 visible`);
  const layout = await page.evaluate(() => ({
    width: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    broken: [...document.images].filter((image) => image.loading !== 'lazy' && (!image.complete || image.naturalWidth === 0)).map((image) => image.currentSrc),
  }));
  assert(layout.documentWidth <= layout.width + 1, `${label}: horizontal overflow ${layout.documentWidth}px > ${layout.width}px`);
  assert.deepEqual(layout.broken, [], `${label}: broken images`);
}
async function audit(page, label) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const serious = result.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
  reports.push({ label, violations: result.violations.map(({ id, impact, nodes }) => ({ id, impact, elements: nodes.map((node) => node.target.join(' ')) })) });
  assert.equal(serious.length, 0, `${label}: accessibility issues ${JSON.stringify(serious.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) })))}`);
}
async function visit(page, route) {
  const response = await page.goto(url(route), { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200, `${route}: successful response`);
  await page.evaluate(async () => { await document.fonts.ready; });
}
async function capture(page, name) {
  // Scroll images into view so full-page screenshots include native lazy images.
  await page.evaluate(async () => {
    for (const image of document.images) {
      image.scrollIntoView({ block: 'center', behavior: 'instant' });
      await image.decode().catch(() => {});
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.screenshot({ path: `/private/tmp/bay-hung-${name}.png`, fullPage: true });
  await page.screenshot({ path: `/private/tmp/bay-hung-${name}-viewport.png` });
}

try {
  const running = await fetch(url()).then((response) => response.ok).catch(() => false);
  if (!running) {
    server = spawn(process.execPath, ['scripts/serve.mjs'], { stdio: 'pipe', env: { ...process.env, PORT: '4173' } });
    let available = false;
    for (let attempt = 0; attempt < 40; attempt++) {
      available = await fetch(url()).then((response) => response.ok).catch(() => false);
      if (available) break;
      await pause(100);
    }
    assert(available, 'Local preview server did not start; run npm run build first.');
  }
  browser = await chromium.launch({ headless: true });
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const page = await desktop.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await test('Desktop home and navigation', async () => {
    await visit(page, '/');
    await assertLayout(page, 'Desktop home');
    await audit(page, 'Desktop home');
    await capture(page, 'desktop');
    const links = page.locator('#primary-nav a');
    assert(await links.count() > 0, 'Primary navigation contains links');
    for (const href of await links.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')))) {
      assert(href && href.startsWith(`${base}/`), `Navigation uses configured base: ${href}`);
    }
  });
  for (const route of routes.slice(1)) {
    await test(`Desktop ${route}`, async () => {
      await visit(page, route);
      await assertLayout(page, route);
      await audit(page, route);
    });
  }
  await test('Product filters and search', async () => {
    await visit(page, '/san-pham/');
    const cards = page.locator('[data-product]');
    assert.equal(await cards.count(), catalog.length, 'All products appear initially');
    await page.locator('[data-filter="tao"]').click();
    const filtered = page.locator('[data-product]:visible');
    assert.equal(await filtered.count(), catalog.filter((product) => product.category === 'tao').length, 'Apple filter selects correct product count');
    for (const category of await filtered.evaluateAll((elements) => elements.map((element) => element.dataset.category))) assert.equal(category, 'tao');
    await page.locator('[data-filter="all"]').click();
    assert.equal(await filtered.count(), catalog.length, 'All filter resets selection');
    for (const query of ['nho', 'nho nhap khau']) {
      await page.locator('#product-search').fill(query);
      assert(await filtered.count() > 0, 'Search has matching results');
      for (const category of await filtered.evaluateAll((elements) => elements.map((element) => element.dataset.category))) assert.equal(category, 'nho', 'Search supports accents and only displays matching products');
    }
    await page.locator('#product-search').fill('zzznothingmatches');
    assert.equal(await filtered.count(), 0, 'Unmatched query hides every product');
    await page.locator('#product-search').fill('');
    assert.equal(await filtered.count(), catalog.length, 'Cleared search restores products');
  });
  await test('Quotation form creates a local copyable message', async () => {
    await visit(page, '/lien-he/');
    const form = page.locator('#quote-form');
    const product = form.locator('[name="product"]');
    if (await product.evaluate((element) => element.tagName === 'SELECT')) {
      const option = await product.locator('option').evaluateAll((options) => options.find((option) => option.value && !option.disabled)?.value);
      assert(option, 'Product choices exist');
      await product.selectOption(option);
    } else await product.fill('Táo nhập khẩu');
    await form.locator('[name="quantity"]').fill('10 thùng');
    await form.locator('[name="location"]').fill('Quận 3, TP.HCM');
    await form.locator('[name="note"]').fill('Cần trao đổi quy cách thùng trước khi đặt.');
    const outbound = [];
    const listen = (request) => { if (request.method() !== 'GET' || (!request.url().startsWith(origin) && !request.url().startsWith('data:'))) outbound.push(`${request.method()} ${request.url()}`); };
    page.on('request', listen);
    await form.locator('[type="submit"]').click();
    const result = page.locator('#quote-result');
    await result.waitFor({ state: 'visible' });
    const message = await result.evaluate((element) => {
      const output = element.querySelector('#quote-message') ?? element;
      return 'value' in output ? output.value : output.textContent;
    });
    assert(message.includes('10 thùng') && message.includes('Quận 3'), 'Quote includes submitted quantity and location');
    assert(await page.locator('#copy-quote').isVisible(), 'Copy control is available');
    await page.locator('#copy-quote').click();
    page.off('request', listen);
    assert.deepEqual(outbound, [], 'Quote generation does not send data or submit a remote form');
  });
  await test('Dark theme, persistence and reduced motion', async () => {
    await visit(page, '/');
    await page.locator('[data-theme-toggle]').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.evaluate(async () => {
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
      await Promise.all(document.getAnimations().filter((animation) => animation.effect?.getTiming().iterations !== Infinity).map((animation) => animation.finished.catch(() => {})));
    });
    await audit(page, 'Dark home');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark', 'Theme survives reload');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches));
    assert.notEqual(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'smooth', 'Reduced motion disables smooth scrolling');
    await assertLayout(page, 'Reduced motion home');
  });

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1, colorScheme: 'light' });
  const mobilePage = await mobile.newPage();
  mobilePage.on('pageerror', (error) => pageErrors.push(error.message));
  await test('Mobile menu and home', async () => {
    await visit(mobilePage, '/');
    await assertLayout(mobilePage, 'Mobile home');
    await audit(mobilePage, 'Mobile home');
    await capture(mobilePage, 'mobile');
    const toggle = mobilePage.locator('[data-menu-toggle]');
    assert(await toggle.isVisible(), 'Mobile menu toggle visible');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    assert(await mobilePage.locator('#primary-nav').isVisible());
    await mobilePage.locator(`#primary-nav a[href="${base}/san-pham/"]`).click();
    await mobilePage.waitForURL(url('/san-pham/'));
    await assertLayout(mobilePage, 'Mobile products');
  });
  for (const route of routes.slice(1)) {
    await test(`Mobile ${route}`, async () => {
      await visit(mobilePage, route);
      await assertLayout(mobilePage, `Mobile ${route}`);
      await audit(mobilePage, `Mobile ${route}`);
    });
  }
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noJSPage = await noJS.newPage();
  for (const route of [...routes, `/san-pham/${catalog[0].slug}/`]) {
    await test(`No JavaScript ${route}`, async () => {
      await visit(noJSPage, route);
      await assertLayout(noJSPage, `No JavaScript ${route}`);
      assert(await noJSPage.locator('main a[href]').count() > 0, 'Content retains working links');
      assert(await noJSPage.locator('#primary-nav a[href]:visible').count() > 0, 'Primary navigation remains accessible without JS');
      if (route === '/san-pham/') assert.equal(await noJSPage.locator('[data-product]:visible').count(), catalog.length, 'Catalog is available without JS');
    });
  }
  await test('No client-side exceptions', () => assert.deepEqual(pageErrors, []));
} finally {
  await browser?.close();
  server?.kill('SIGTERM');
}
const advisory = reports.filter((report) => report.violations.length > 0);
if (advisory.length) console.log(`Accessibility details: ${JSON.stringify(advisory, null, 2)}`);
if (failures.length) {
  console.error(`\n${failures.length} browser check(s) failed:\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('Browser checks passed: responsive layouts, accessibility, catalog, quote builder, theme, and progressive content. Screenshots: /private/tmp/bay-hung-desktop.png and /private/tmp/bay-hung-mobile.png');
}
