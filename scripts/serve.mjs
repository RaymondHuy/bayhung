import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve('dist');
const site = JSON.parse(await readFile('data/site.json', 'utf8'));
const base = new URL(site.siteUrl).pathname.replace(/\/$/, '');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
const server = http.createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (base && path === '/') { res.writeHead(302, { Location: `${base}/` }); res.end(); return; }
    if (base && (path === base || path.startsWith(`${base}/`))) path = path.slice(base.length) || '/';
    let file = resolve(root, `.${path}`);
    if (file !== root && !file.startsWith(root + sep)) throw new Error('Invalid path');
    const info = await stat(file);
    if (info.isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    const compressed = /\bgzip\b/.test(req.headers['accept-encoding'] || '') && /\.(html|css|js|json|xml|txt|svg)$/.test(file);
    res.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'Vary': 'Accept-Encoding',
      ...(compressed ? { 'Content-Encoding': 'gzip' } : {})
    });
    res.end(compressed ? gzipSync(body) : body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await readFile(resolve(root, '404.html')).catch(() => 'Not found. Run npm run build first.'));
  }
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log(`Bảy Hưng: http://127.0.0.1:${process.env.PORT || 4173}${base}/`));
