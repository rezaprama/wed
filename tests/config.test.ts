import { test } from 'node:test';
import assert from 'node:assert/strict';
import config from '../wedding.json' with { type: 'json' };
import { validateConfig } from '../src/config.mjs';
import { renderPage, variants } from '../src/render.mjs';

test('configuration rejects broken dates, ambiguous routes, dangerous links and traversal', () => {
  for (const change of [
    value => { value.events[0].date = '2027-02-30'; },
    value => { value.events[0].slug = 'admin'; },
    value => { value.events[0].mapUrl = 'javascript:alert(1)'; },
    value => { value.couple.photo = '/media/../private.jpg'; },
    value => { value.events[1].slug = value.events[0].slug; },
    value => { value.events[0].timeZone = 'unknown'; },
    value => { value.events[0].end = '01:00'; },
  ]) {
    const input = structuredClone(config); change(input);
    assert.throws(() => validateConfig(input));
  }
  assert.equal(validateConfig(structuredClone(config)).couple.names, config.couple.names);
});

test('one config produces every audience, escapes names and omits disabled features', () => {
  const input = structuredClone(config);
  input.couple.names = '<img src=x onerror=alert(1)>';
  const images = Object.fromEntries([input.couple.photo, input.couple.first.photo, input.couple.second.photo, ...input.gallery].map(path => [path, { src: path }]));
  const assets = { images, css: '/style.css', app: '/app.js' };
  for (const variant of variants(input)) {
    const html = renderPage(input, variant, assets);
    assert.ok(html.includes(`data-city="${variant.route}"`));
    assert.equal(html.includes('id="hosts-title"'), variant.parents);
    assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
    assert.doesNotMatch(html, /id="wish-form"|<iframe|<audio|youtube\.com/);
    assert.match(html, /<dialog open id="invitation-cover"/);
  }
  input.language = 'id';
  assert.match(renderPage(input, variants(input)[0], assets), /Buka undangan/);
});
