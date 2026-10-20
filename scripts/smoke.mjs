import assert from 'node:assert/strict';
import config from '../wedding.json' with { type: 'json' };

const base = process.argv[2];
if (!base) throw new Error('Add your URL: npm run smoke -- https://your-site.workers.dev');
const get = path => fetch(new URL(path, base), { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WedSmoke/1.0)' } });
assert.equal((await (await get('/api/health')).json()).ok, true);
for (const event of config.events) {
  for (const route of [event.slug, event.slug.toUpperCase()]) {
    const response = await get(`/${route}/`);
    assert.equal(response.status, 200);
    assert.ok((await response.text()).includes(`data-city="${route}"`));
  }
}
assert.equal((await get('/robots.txt')).status, 200);
assert.equal((await get('/sitemap.xml')).status, 200);
assert.equal((await get('/this-page-does-not-exist/')).status, 404);
console.log('Smoke PASS: health, invitation variants, robots, sitemap and real 404. No wishes submitted.');
