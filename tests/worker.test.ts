import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import worker from '../src/worker.ts';
import config from '../wedding.json';
import { sqliteD1 } from '../scripts/sqlite-adapter.mjs';

function setup(enabled = true) {
  config.guestbook.enabled = enabled;
  const DB = sqliteD1();
  const env = { DB, ADMIN_TOKEN: 'test-admin', IP_HASH_KEY: 'test-ip-secret', ASSETS: { fetch: async () => new Response('<html></html>', { headers: { 'Content-Type': 'text/html' } }) } };
  const call = (path: string, method = 'GET', body?: unknown, extra: Record<string, string> = {}) => worker.fetch(new Request(`https://wed.test${path}`, {
    method,
    headers: { Origin: 'https://wed.test', 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.10', ...extra },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }), env as Env);
  const item = (city = 'one') => ({ city, name: 'Tamu Keluarga', message: 'Semoga selalu bahagia.', requestId: randomUUID(), website: '' });
  return { DB, env, call, item };
}

test('health verifies database; every response gets security headers', async () => {
  const { call } = setup();
  const response = await call('/api/health');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(response.headers.get('X-Frame-Options'), 'DENY');
  assert.match(response.headers.get('Content-Security-Policy')!, /script-src 'self'/);
});

test('new wishes stay pending, approval publishes only safe public fields in their city', async () => {
  const { call, item, DB } = setup();
  assert.equal((await call('/api/wishes', 'POST', item())).status, 202);
  assert.deepEqual((await (await call('/api/wishes?city=one')).json()).items, []);
  assert.equal(DB.raw.prepare('SELECT status FROM wishes').get().status, 'pending');
  assert.equal((await call('/api/admin/wishes/1', 'POST', { status: 'approved' }, { Authorization: 'Bearer test-admin' })).status, 200);
  const visible = (await (await call('/api/wishes?city=one')).json()).items;
  assert.equal(visible.length, 1);
  assert.deepEqual(Object.keys(visible[0]).sort(), ['created_at', 'id', 'message', 'name']);
  assert.deepEqual((await (await call('/api/wishes?city=two')).json()).items, []);
});

test('moderation needs valid bearer token; rejected wishes never publish', async () => {
  const { call, item } = setup();
  await call('/api/wishes', 'POST', item());
  for (const token of ['', 'Bearer wrong', 'test-admin']) {
    assert.equal((await call('/api/admin/wishes', 'GET', undefined, { Authorization: token })).status, 401);
    assert.equal((await call('/api/admin/wishes/1', 'POST', { status: 'approved' }, { Authorization: token })).status, 401);
  }
  assert.equal((await call('/api/admin/wishes/1', 'POST', { status: 'rejected' }, { Authorization: 'Bearer test-admin' })).status, 200);
  assert.equal((await call('/api/admin/wishes/1', 'POST', { status: 'approved' }, { Authorization: 'Bearer test-admin' })).status, 404);
  assert.deepEqual((await (await call('/api/wishes?city=one')).json()).items, []);
});

test('cross-origin and missing-origin mutations fail', async () => {
  const { call, item } = setup();
  for (const origin of ['https://attacker.example', 'null', '']) {
    assert.equal((await call('/api/wishes', 'POST', item(), { Origin: origin })).status, 403);
  }
});

test('invalid city, cursor, size, honeypot and fields fail before database writes', async () => {
  const { call, item, DB } = setup();
  for (const changes of [{ city: 'other' }, { name: 'A' }, { message: 'x'.repeat(1001) }, { name: 25 }, { website: 'https://bot.example' }, { requestId: 'invalid' }]) {
    assert.equal((await call('/api/wishes', 'POST', { ...item(), ...changes })).status, 400);
  }
  for (const query of ['city=other', 'city=one&cursor=-1', 'city=one&cursor=1%20OR%201=1', 'city=one&cursor=9007199254740992']) {
    assert.equal((await call(`/api/wishes?${query}`)).status, 400);
  }
  assert.equal((await call('/api/wishes', 'POST', item(), { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await call('/api/wishes', 'POST', { ...item(), message: 'x'.repeat(9000) })).status, 413);
  assert.equal(DB.raw.prepare('SELECT count(*) AS total FROM wishes').get().total, 0);
});

test('atomic daily throttle covers both cities; retry IDs remain idempotent', async () => {
  const { call, item, DB } = setup();
  const original = item();
  for (let i = 0; i < 3; i++) assert.equal((await call('/api/wishes', 'POST', original)).status, 202);
  const responses = await Promise.all(Array.from({ length: 7 }, (_, i) => call('/api/wishes', 'POST', item(i % 2 ? 'two' : 'one'))));
  assert.equal(responses.filter(response => response.status === 202).length, 4);
  assert.equal(responses.filter(response => response.status === 429).length, 3);
  assert.equal(DB.raw.prepare('SELECT count(*) AS total FROM wishes').get().total, 5);
  assert.equal((await call('/api/wishes', 'POST', item(), { 'CF-Connecting-IP': '192.0.2.20' })).status, 202);
});

test('SQL-looking text stays data; raw IP and secret are never persisted', async () => {
  const { call, item, DB } = setup();
  const value = { ...item(), name: "O'Connor", message: "'); DROP TABLE wishes; -- <script>alert(1)</script>" };
  assert.equal((await call('/api/wishes', 'POST', value)).status, 202);
  const row = DB.raw.prepare('SELECT * FROM wishes').get();
  assert.equal(row.message, value.message);
  assert.match(row.ip_hash, /^[0-9a-f]{64}$/);
  assert.doesNotMatch(JSON.stringify(row), /192\.0\.2\.10|test-ip-secret/);
});

test('cursor pagination has no duplicates and exposes only approved rows', async () => {
  const { call, DB } = setup();
  const insert = DB.raw.prepare("INSERT INTO wishes(request_id,city,name,message,ip_hash,status) VALUES(?,'one','Nama','Doa baik','test','approved')");
  for (let i = 0; i < 23; i++) insert.run(randomUUID());
  const first = await (await call('/api/wishes?city=one')).json();
  assert.equal(first.items.length, 20);
  const second = await (await call(`/api/wishes?city=one&cursor=${first.nextCursor}`)).json();
  assert.equal(second.items.length, 3);
  assert.equal(second.nextCursor, null);
  assert.equal(new Set([...first.items, ...second.items].map(item => item.id)).size, 23);
});

test('four invitation routes preserve case, canonical URLs and audience-specific assets', async () => {
  const { call, env } = setup();
  const fetched: string[] = [];
  env.ASSETS.fetch = async (request: Request) => {
    fetched.push(new URL(request.url).pathname);
    return new Response('<html></html>', { headers: { 'Content-Type': 'text/html' } });
  };
  for (const [route, asset] of [['one', 'one'], ['ONE', 'parents/one'], ['two', 'two'], ['TWO', 'parents/two']]) {
    const redirect = await call(`/${route}?to=Tamu%20Keluarga`);
    assert.equal(redirect.status, 301);
    assert.equal(redirect.headers.get('Location'), `https://wed.test/${route}/?to=Tamu%20Keluarga`);
    assert.equal((await call(`/${route}/`)).status, 200);
    assert.equal(fetched.at(-1), `/${asset}/`);

  }
});

test('friends and parents have isolated moderated feeds in both cities', async () => {
  const { call, item, DB } = setup();
  for (const [index, route] of ['one', 'ONE', 'two', 'TWO'].entries()) {
    const wish = { ...item(route), message: `Doa untuk ${route}` };
    assert.equal((await call('/api/wishes', 'POST', wish)).status, 202);
    assert.equal((await call(`/api/admin/wishes/${index + 1}`, 'POST', { status: 'approved' }, { Authorization: 'Bearer test-admin' })).status, 200);
  }
  for (const route of ['one', 'ONE', 'two', 'TWO']) {
    const feed = await (await call(`/api/wishes?city=${route}`)).json();
    assert.equal(feed.items.length, 1);
    assert.equal(feed.items[0].message, `Doa untuk ${route}`);
  }
  assert.equal(DB.raw.prepare("SELECT count(*) AS total FROM wishes WHERE audience = 'parents'").get().total, 2);
  assert.equal((await call('/api/wishes?city=Tgr')).status, 400);
});

test('streamed bodies enforce byte limit even without Content-Length', async () => {
  const { env } = setup();
  const response = await worker.fetch(new Request('https://wed.test/api/wishes', {
    method: 'POST', headers: { Origin: 'https://wed.test', 'Content-Type': 'application/json' },
    body: new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(8193)); controller.close(); } }), duplex: 'half',
  } as RequestInit), env as Env);
  assert.equal(response.status, 413);
});


test('default demo has no writable backend, but health and public indexing still work', async () => {
  const { call } = setup(false);
  assert.equal((await call('/api/health')).status, 200);
  assert.equal((await call('/api/wishes', 'POST', {})).status, 503);
  assert.equal((await call('/')).headers.get('X-Robots-Tag'), null);
  assert.equal((await call('/admin/')).headers.get('X-Robots-Tag'), 'noindex, nofollow');
  assert.match(await (await call('/robots.txt')).text(), /Allow: \/\n/);
  assert.match(await (await call('/sitemap.xml')).text(), /https:\/\/wed.test\/ONE\//);
});

test('privacy switch disables indexing in headers, robots and sitemap', async () => {
  const { call } = setup(false);
  const original = config.allowIndexing;
  config.allowIndexing = false;
  try {
    assert.equal((await call('/')).headers.get('X-Robots-Tag'), 'noindex, nofollow');
    assert.match(await (await call('/robots.txt')).text(), /Disallow: \/\n/);
    assert.doesNotMatch(await (await call('/sitemap.xml')).text(), /<url>/);
  } finally { config.allowIndexing = original; }
});
