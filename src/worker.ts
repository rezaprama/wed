import { HttpError, city, audience, cursor, submission, jsonBody, sameOrigin, tokenMatches } from './validation';

import config from '../wedding.json';

// Default deployment needs only assets. These bindings are optional until setup:guestbook is run.
type AppEnv = Env & { DB?: D1Database; ADMIN_TOKEN?: string; IP_HASH_KEY?: string };

const headers = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), autoplay=(self)',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self'; img-src 'self' data:; font-src 'self'; media-src 'self'; connect-src 'self' https://cloudflareinsights.com; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  'Cross-Origin-Opener-Policy': 'same-origin',
};

function json(value: unknown, status = 200): Response {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
}

async function admin(request: Request, env: AppEnv) {
  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1] ?? '';
  if (!env.ADMIN_TOKEN || !token || !await tokenMatches(token, env.ADMIN_TOKEN)) {
    throw new HttpError(401, 'Invalid admin token.');
  }
}

async function api(request: Request, env: AppEnv, url: URL): Promise<Response> {
  if (url.pathname === '/api/health' && request.method === 'GET') {
    if (config.guestbook.enabled) {
      if (!env.DB) throw new HttpError(503, 'Guestbook database is not configured.');
      await env.DB.prepare('SELECT 1').first();
    }
    return json({ ok: true, service: 'wed', guestbook: config.guestbook.enabled ? 'enabled' : 'disabled' });
  }
  if (!config.guestbook.enabled || !env.DB) throw new HttpError(503, 'The guestbook is disabled.');
  if (url.pathname === '/api/wishes' && request.method === 'GET') {
    const event = city(url.searchParams.get('city'));
    const before = cursor(url.searchParams.get('cursor'));
    const { results } = await env.DB.prepare(
      "SELECT id, name, message, created_at FROM wishes WHERE city = ? AND audience = ? AND status = 'approved' AND id < ? ORDER BY id DESC LIMIT 21"
    ).bind(event.toLowerCase(), audience(event), before).all<{ id: number; name: string; message: string; created_at: string }>();
    const items = results.slice(0, 20);
    return json({ items, nextCursor: results.length > 20 ? items.at(-1)!.id : null });
  }
  if (url.pathname === '/api/wishes' && request.method === 'POST') {
    sameOrigin(request);
    if (!env.IP_HASH_KEY) throw new HttpError(503, 'The guestbook is not configured.');
    const item = submission(await jsonBody(request));
    const existing = await env.DB.prepare('SELECT request_id FROM wishes WHERE request_id = ?').bind(item.requestId).first();
    if (existing) return json({ accepted: true }, 202);
    const ip = request.headers.get('CF-Connecting-IP') ?? 'local';
    const day = new Date().toISOString().slice(0, 10);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${env.IP_HASH_KEY}:${day}:${ip}`));
    const hash = [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, '0')).join('');
    // Single atomic statement prevents concurrent requests bypassing the daily limit.
    const inserted = await env.DB.prepare(
      'INSERT OR IGNORE INTO wishes (request_id, city, audience, name, message, ip_hash) SELECT ?, ?, ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM wishes WHERE ip_hash = ?) < 5 RETURNING id'
    ).bind(item.requestId, item.city, item.audience, item.name, item.message, hash, hash).first();
    if (!inserted) {
      const duplicate = await env.DB.prepare('SELECT id FROM wishes WHERE request_id = ?').bind(item.requestId).first();
      if (!duplicate) throw new HttpError(429, 'Five wishes per day. Please try again tomorrow.');
    }
    return json({ accepted: true }, 202);
  }
  if (url.pathname === '/api/admin/wishes' && request.method === 'GET') {
    await admin(request, env);
    const before = cursor(url.searchParams.get('cursor'));
    const { results } = await env.DB.prepare(
      "SELECT id, city, audience, name, message, created_at FROM wishes WHERE status = 'pending' AND id < ? ORDER BY id DESC LIMIT 51"
    ).bind(before).all<{ id: number }>();
    const items = results.slice(0, 50);
    return json({ items, nextCursor: results.length > 50 ? items.at(-1)!.id : null });
  }
  const match = url.pathname.match(/^\/api\/admin\/wishes\/([1-9]\d{0,14})$/);
  if (match && request.method === 'POST') {
    sameOrigin(request);
    await admin(request, env);
    const body = await jsonBody(request);
    const status = body && typeof body === 'object' ? (body as Record<string, unknown>).status : null;
    if (status !== 'approved' && status !== 'rejected') throw new HttpError(400, 'Invalid moderation status.');
    const row = await env.DB.prepare("UPDATE wishes SET status = ? WHERE id = ? AND status = 'pending' RETURNING id")
      .bind(status, Number(match[1])).first();
    if (!row) throw new HttpError(404, 'Wish not found or already moderated.');
    return json({ updated: true });
  }
  if (url.pathname === '/api/wishes' || url.pathname.startsWith('/api/admin/')) {
    throw new HttpError(405, 'Method not allowed.');
  }
  throw new HttpError(404, 'Endpoint not found.');
}

export default {
  async fetch(request: Request, env: AppEnv): Promise<Response> {
    const url = new URL(request.url);
    let response: Response;
    try {
      if (url.pathname.startsWith('/api/')) {
        response = await api(request, env, url);
      } else {
        const path = url.pathname;
        const match = path.match(/^\/([a-zA-Z0-9-]+)(?:\/index\.html|\/)?$/);
        const route = match?.[1];
        const event = route ? config.events.find(event => event.slug === route.toLowerCase()) : null;
        if (path === '/robots.txt') {
          const body = config.allowIndexing ? `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /send/\nDisallow: /api/\nSitemap: ${url.origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n';
          response = new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        } else if (path === '/sitemap.xml') {
          const links = config.allowIndexing ? ['/', ...config.events.flatMap(event => [`/${event.slug}/`, `/${event.slug.toUpperCase()}/`])] : [];
          const urls = links.map(path => `<url><loc>${url.origin}${path}</loc></url>`).join('');
          response = new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
        } else if (event && route !== route!.toLowerCase() && route !== route!.toUpperCase()) {
          response = new Response('Not found', { status: 404 });
        } else if (event && path !== `/${route}/`) {
          url.pathname = `/${route}/`; response = Response.redirect(url.href, 301);
        } else if (path.startsWith('/parents/')) {
          const slug = path.split('/')[2];
          if (config.events.some(event => event.slug === slug)) { url.pathname = `/${slug.toUpperCase()}/`; response = Response.redirect(url.href, 301); }
          else response = new Response('Not found', { status: 404 });
        } else if (request.method !== 'GET' && request.method !== 'HEAD') {
          response = new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
        } else {
          const assetUrl = new URL(url);
          if (event && route === route!.toUpperCase()) assetUrl.pathname = `/parents/${event.slug}/`;
          response = await env.ASSETS.fetch(new Request(assetUrl, request));
          if (response.headers.get('Content-Type')?.includes('text/html') && typeof HTMLRewriter !== 'undefined') {
            const canonical = `${url.origin}${path}`;
            response = new HTMLRewriter().on('link[rel="canonical"]', { element(element) { element.setAttribute('href', canonical); } })
              .on('meta[property="og:url"]', { element(element) { element.setAttribute('content', canonical); } })
              .on('meta[property="og:image"]', { element(element) { element.setAttribute('content', new URL(element.getAttribute('content')!, url.origin).href); } }).transform(response);
          }
        }
      }
    } catch (error) {
      if (error instanceof HttpError) response = json({ error: error.message }, error.status);
      else {
        console.error(JSON.stringify({ event: 'request_failed', path: url.pathname, kind: error instanceof Error ? error.name : 'unknown' }));
        response = json({ error: 'Temporarily unavailable. Please try again later.' }, 503);
      }
    }
    const secured = new Response(response.body, response);
    for (const [name, value] of Object.entries(headers)) secured.headers.set(name, value);
    if (!config.allowIndexing || url.pathname.startsWith('/api/') || /^\/(admin|send)\//.test(url.pathname) || secured.status >= 400) secured.headers.set('X-Robots-Tag', 'noindex, nofollow');
    if (url.pathname.startsWith('/assets/')) secured.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    else if (url.pathname.startsWith('/fonts/')) secured.headers.set('Cache-Control', 'public, max-age=604800');
    if (url.protocol === 'https:') secured.headers.set('Strict-Transport-Security', 'max-age=31536000');
    if (!url.pathname.startsWith('/api/') && secured.headers.get('Content-Type')?.includes('text/html')) {
      secured.headers.set('Cache-Control', 'no-cache');
    }
    return secured;
  },
} satisfies ExportedHandler<AppEnv>;
