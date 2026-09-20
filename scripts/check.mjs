import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';

const root = resolve('dist');
const site = JSON.parse(await readFile('data/site.json', 'utf8'));
const phone = site.phone.replace(/[\s().-]/g, '');
const siteURL = new URL(`${site.siteUrl.replace(/\/$/, '')}/`);
const base = siteURL.pathname.replace(/\/$/, '');
const failures = [];
const checks = [];
function check(condition, message) {
  checks.push(message);
  if (!condition) failures.push(message);
}
const decode = (text) => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
}
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(join(dir, entry.name)) : join(dir, entry.name)))).flat();
}
const files = await walk(root).catch(() => { throw new Error('Build output missing. Run npm run build first.'); });
const htmlFiles = files.filter((file) => extname(file) === '.html');
assert(htmlFiles.length > 1, 'Expected a complete site with multiple HTML pages.');
const documents = new Map();
for (const file of htmlFiles) documents.set(file, await readFile(file, 'utf8'));
const titles = new Map();
const descriptions = new Map();
const indexable = new Set();
const internalReferences = [];

for (const [file, html] of documents) {
  const name = relative(root, file).split(sep).join('/');
  const route = name === 'index.html' ? '' : name.replace(/index\.html$/, '');
  const expectedURL = new URL(route, siteURL).href;
  const tags = [...html.matchAll(/<(?:meta|link|html|a|img|script|source)\b[^>]*>/gi)].map((match) => ({ type: match[0].match(/^<(\w+)/)[1].toLowerCase(), ...attributes(match[0]) }));
  const metas = tags.filter((tag) => tag.type === 'meta');
  const noindex = metas.some((tag) => tag.name === 'robots' && /\bnoindex\b/i.test(tag.content));
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim();
  const description = metas.find((tag) => tag.name === 'description')?.content?.trim();
  const canonical = tags.find((tag) => tag.type === 'link' && tag.rel === 'canonical')?.href;
  check(tags.find((tag) => tag.type === 'html')?.lang === 'vi', `${name}: Vietnamese language declared`);
  check(!!title, `${name}: title present`);
  check(!!description, `${name}: meta description present`);
  check(!titles.has(title), `${name}: unique title (also used by ${titles.get(title) ?? 'none'})`);
  check(!descriptions.has(description), `${name}: unique description (also used by ${descriptions.get(description) ?? 'none'})`);
  titles.set(title, name);
  descriptions.set(description, name);
  check((html.match(/<h1\b/gi) ?? []).length === 1, `${name}: exactly one h1`);
  check(metas.some((tag) => tag.name === 'viewport' && /width=device-width/.test(tag.content)), `${name}: responsive viewport`);
  check(canonical === expectedURL, `${name}: canonical equals ${expectedURL}`);
  if (name === '404.html') check(noindex, '404.html: search engines excluded');
  if (!noindex) indexable.add(expectedURL);
  const ids = [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((match) => match[1]);
  check(new Set(ids).size === ids.length, `${name}: IDs are unique`);
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1]);
      const validateSchema = (value) => {
        if (!value || typeof value !== 'object') return;
        if (Array.isArray(value)) { value.forEach(validateSchema); return; }
        if ('price' in value) check(![0, '0', '0.00', ''].includes(value.price), `${name}: contact pricing has no invented zero-price offer`);
        if ('telephone' in value) check(Boolean(phone) && value.telephone === phone, `${name}: structured telephone uses configured number`);
        check(!('aggregateRating' in value), `${name}: no unverified aggregate ratings`);
        Object.values(value).forEach(validateSchema);
      };
      validateSchema(data);
    } catch (error) { check(false, `${name}: valid JSON-LD (${error.message})`); }
  }
  for (const tag of tags) {
    if (tag.type === 'img') {
      check('alt' in tag, `${name}: image ${tag.src} has alt text`);
      check(Number(tag.width) > 0 && Number(tag.height) > 0, `${name}: image ${tag.src} reserves layout space`);
    }
    if (!site.phone && tag.href?.startsWith('tel:')) check(false, `${name}: no telephone link before phone configuration`);
    if (!site.zalo && /https?:\/\/(?:www\.)?zalo\.me\//i.test(tag.href ?? '')) check(false, `${name}: no Zalo link before Zalo configuration`);
    for (const key of ['href', 'src']) if (tag[key]) internalReferences.push({ source: name, value: tag[key], from: expectedURL });
    if (tag.srcset) {
      for (const candidate of tag.srcset.split(',')) internalReferences.push({ source: name, value: candidate.trim().split(/\s+/)[0], from: expectedURL });
    }
  }
  check(!/\b(?:lorem ipsum|YOUR_PHONE|YOUR_ZALO|TODO|example\.com)\b/i.test(html), `${name}: no unfinished template placeholders`);
}

for (const { source, value, from } of internalReferences) {
  if (/^(?:data:|mailto:|tel:|javascript:)/i.test(value)) continue;
  let url;
  try { url = new URL(value, from); } catch { check(false, `${source}: valid URL ${value}`); continue; }
  if (url.origin !== siteURL.origin) continue;
  if (base && !url.pathname.startsWith(`${base}/`) && url.pathname !== base) {
    check(false, `${source}: ${value} stays inside GitHub Pages base ${base}`);
    continue;
  }
  const localPath = decodeURIComponent(url.pathname.slice(base.length));
  let target = resolve(root, `.${localPath || '/'}`);
  if (target !== root && !target.startsWith(root + sep)) { check(false, `${source}: safe internal path ${value}`); continue; }
  try {
    if ((await stat(target)).isDirectory()) target = join(target, 'index.html');
    await stat(target);
  } catch { check(false, `${source}: internal resource exists ${value}`); continue; }
  if (url.hash && extname(target) === '.html') {
    const targetHTML = documents.get(target) ?? await readFile(target, 'utf8');
    const id = decodeURIComponent(url.hash.slice(1));
    const targetIDs = [...targetHTML.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((match) => match[1]);
    check(targetIDs.includes(id), `${source}: fragment target exists ${value}`);
  }
}

const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
const sitemapURLs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
check(sitemapURLs.length === new Set(sitemapURLs).size, 'sitemap.xml: no duplicate URLs');
check(sitemapURLs.length === indexable.size && sitemapURLs.every((url) => indexable.has(url)), 'sitemap.xml: exactly all indexable generated pages');
check(!sitemapURLs.some((url) => url.endsWith('/404.html')), 'sitemap.xml: excludes 404');
const robots = await readFile(join(root, 'robots.txt'), 'utf8');
check(robots.includes(`Sitemap: ${new URL('sitemap.xml', siteURL).href}`), 'robots.txt: absolute sitemap URL');
check(!/^Disallow:\s*\/\s*$/m.test(robots), 'robots.txt: does not block the site');
check(files.some((file) => relative(root, file) === '.nojekyll'), 'GitHub Pages: .nojekyll present');
const budgets = { '.js': 100_000, '.css': 120_000, '.webp': 1_000_000, '.jpg': 1_000_000, '.woff2': 150_000 };
for (const file of files) {
  const budget = budgets[extname(file)];
  if (budget) check((await stat(file)).size <= budget, `${relative(root, file)}: asset below ${Math.round(budget / 1000)} kB budget`);
}
if (failures.length) {
  console.error(`\n${failures.length} static check(s) failed:\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Static checks passed: ${htmlFiles.length} HTML pages, ${indexable.size} indexable URLs, ${checks.length} checks and ${internalReferences.length} resource references.`);
}
