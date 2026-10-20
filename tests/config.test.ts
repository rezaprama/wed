import { test } from 'node:test';
import assert from 'node:assert/strict';
import config from '../wedding.json' with { type: 'json' };
import { validateConfig } from '../src/config.mjs';
import { renderPage, variants } from '../src/render.mjs';
import { applyTheme, resolveTheme, themeSvg } from '../src/theme.mjs';
import { readFileSync } from 'node:fs';

test('configuration rejects broken dates, ambiguous routes, dangerous links and traversal', () => {
  for (const change of [
    value => { value.events[0].date = '2027-02-30'; },
    value => { value.events[0].slug = 'admin'; },
    value => { value.events[0].mapUrl = 'javascript:alert(1)'; },
    value => { value.couple.photo = '/media/../private.jpg'; },
    value => { value.events[1].slug = value.events[0].slug; },
    value => { value.events[0].timeZone = 'unknown'; },
    value => { value.events[0].end = '01:00'; },
    value => { value.couple.first.birthDate = '2000-02-30'; },
    value => { value.couple.second.birthDate = '1999-02-29'; },
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

test('birth dates display by language, accept leap years and can be omitted', () => {
  const input = structuredClone(config);
  input.couple.first.birthDate = '2000-02-29';
  delete input.couple.second.birthDate;
  validateConfig(input);
  const images = Object.fromEntries([input.couple.photo, input.couple.first.photo, input.couple.second.photo, ...input.gallery].map(path => [path, { src: path }]));
  const assets = { images, css: '/style.css', app: '/app.js' };
  assert.match(renderPage(input, variants(input)[0], assets), /Born <time datetime="2000-02-29">29 February 2000<\/time>/);
  input.language = 'id';
  const html = renderPage(input, variants(input)[0], assets);
  assert.match(html, /Lahir <time datetime="2000-02-29">29 Februari 2000<\/time>/);
  assert.equal((html.match(/datetime="2000-/g) || []).length, 1);
  assert.match(html, /Template by <a href="https:\/\/rezaprama\.com" target="_blank" rel="noopener noreferrer">Reza Prama Arviandi<\/a>/);
});

test('theme choices produce real CSS and preserve old configurations', () => {
  const input = structuredClone(config);
  input.theme.colors = { background: '#f6f7ed', text: '#203b2f', accent: '#356848' };
  input.theme.fontSizes = { body: 18, heading: 32, title: 56 };
  validateConfig(input);
  const css = applyTheme(readFileSync(new URL('../src/style.css', import.meta.url), 'utf8'), input);
  assert.match(css, /--paper: #f6f7ed;/);
  assert.match(css, /--accent: #356848;/);
  assert.match(css, /--text-body: 18px;/);
  const artwork = readFileSync(new URL('../public/media/couple.svg', import.meta.url), 'utf8');
  const themedArtwork = themeSvg(artwork, input);
  assert.doesNotMatch(themedArtwork, /#7b2f91|#f7f1f9|#3d1c47/i);
  assert.match(themedArtwork, /#356848/);
  assert.equal(themeSvg('<svg><path fill="#7b2f91"/></svg>', input), '<svg><path fill="#7b2f91"/></svg>');
  delete input.theme;
  assert.equal(resolveTheme(validateConfig(input)).colors.accent, '#7b2f91');
});

test('theme guardrails reject unreadable colors, CSS injection and extra design tokens', () => {
  for (const change of [
    value => { value.theme.colors.text = '#f7f1f9'; },
    value => { value.theme.colors.accent = 'red; display:none'; },
    value => { value.theme.colors.fourth = '#000000'; },
    value => { value.theme.fontSizes.body = 12; },
    value => { value.theme.fontSizes.title = 200; },
    value => { value.theme.fontSizes.heading = 40; value.theme.fontSizes.title = 40; },
  ]) {
    const input = structuredClone(config); change(input);
    assert.throws(() => validateConfig(input), /theme/);
  }
});

test('extra sections are optional plain text and cannot inject HTML', () => {
  const input = structuredClone(config);
  input.extraSections = [{ title: 'Dress code', text: '<script>alert(1)</script>\nSage green.' }];
  validateConfig(input);
  const images = Object.fromEntries([input.couple.photo, input.couple.first.photo, input.couple.second.photo, ...input.gallery].map(path => [path, { src: path }]));
  const html = renderPage(input, variants(input)[0], { images, css: '/style.css', app: '/app.js' });
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>alert/);
  input.extraSections = Array(5).fill({ title: 'A', text: 'B' });
  assert.throws(() => validateConfig(input), /extraSections/);
  delete input.extraSections;
  validateConfig(input);
});
