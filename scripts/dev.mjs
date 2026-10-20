import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { readFile, writeFile, stat, mkdir } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { randomBytes } from 'node:crypto';
import worker from '../src/worker.ts';
import { sqliteD1 } from './sqlite-adapter.mjs';

const root = resolve(import.meta.dirname, '..');
const directory = resolve(root, 'dist');
await mkdir(resolve(root, '.local'), { recursive: true });
let secrets;
try { secrets = await readFile(resolve(root, '.dev.vars'), 'utf8'); }
catch {
  secrets = `ADMIN_TOKEN=${randomBytes(32).toString('hex')}\nIP_HASH_KEY=${randomBytes(32).toString('hex')}\n`;
  await writeFile(resolve(root, '.dev.vars'), secrets, { mode: 0o600 });
}
const port = Number(process.env.PORT || 8788);
const vars = Object.fromEntries(secrets.split(/\r?\n/).filter(line => line.includes('=')).map(line => { const at = line.indexOf('='); return [line.slice(0, at), line.slice(at + 1).replace(/^"|"$/g, '')]; }));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.wav': 'audio/wav' };
const env = { ...vars, DB: sqliteD1(resolve(root, '.local/guestbook.sqlite')), ASSETS: {
  async fetch(request) {
    const url = new URL(request.url);
    const path = resolve(directory, '.' + decodeURIComponent(url.pathname));
    if (path !== directory && !path.startsWith(directory + sep)) return new Response('Not found', { status: 404 });
    try {
      let target = path;
      if ((await stat(target)).isDirectory()) {
        if (!url.pathname.endsWith('/')) { url.pathname += '/'; return Response.redirect(url.href, 307); }
        target = resolve(target, 'index.html');
      }
      const bytes = await readFile(target);
      return new Response(request.method === 'HEAD' ? null : bytes, { headers: { 'Content-Type': types[extname(target)] || 'application/octet-stream' } });
    } catch { return new Response(await readFile(resolve(directory, '404.html')), { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }); }
  },
} };
createServer(async (incoming, outgoing) => {
  try {
    const request = new Request(`http://127.0.0.1:${port}${incoming.url}`, { method: incoming.method, headers: incoming.headers, ...(incoming.method !== 'GET' && incoming.method !== 'HEAD' ? { body: Readable.toWeb(incoming), duplex: 'half' } : {}) });
    const response = await worker.fetch(request, env);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body) Readable.fromWeb(response.body).pipe(outgoing); else outgoing.end();
  } catch { outgoing.writeHead(500); outgoing.end('Preview error.'); }
}).listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}/\nLocal admin token is in ignored .dev.vars. No production database is accessed.`));
