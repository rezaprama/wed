import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { dirname } from 'node:path';
import { applyTheme } from '../src/theme.mjs';
const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(await readFile(resolve(root, 'wedding.json'), 'utf8'));
if (config.demo) {
  const media = [config.couple.photo, config.couple.first.photo, config.couple.second.photo, ...config.gallery];
  if (media.some(path => !path.endsWith('.svg')) || config.gifts.length || config.socials.length || config.music.file || config.guestbook.enabled) throw new Error('Sample mode must use placeholder SVGs and no personal gift/social/audio data or message collection. Set demo to false in your own private copy before personalization.');
}
const css = applyTheme((await readFile(resolve(root, 'src/style.css'), 'utf8')).replace(/\/\*[\s\S]*?\*\//g, ''), config);
const colors = new Set([...css.matchAll(/#[a-f0-9]{3,8}\b/gi)].map(match => match[0].toLowerCase()));
const sizes = [...css.matchAll(/--text-\w+\s*:\s*(\d+px)/g)].map(match => match[1]);
const families = new Set([...css.matchAll(/@font-face\s*\{[^}]*font-family:\s*([^;]+)/g)].map(match => match[1].trim()));
if (colors.size > 3 || families.size > 3 || new Set(sizes).size > 3) throw new Error('Design limit exceeded: at most three colors, typefaces and text sizes.');
for (const [, value] of css.matchAll(/font-size\s*:\s*([^;}]+)/g)) if (!/^(inherit|var\(--text-(body|heading|title)\))$/.test(value.trim())) throw new Error(`Uncontrolled text size: ${value}`);
if (/(?:linear|radial|conic)-gradient\(|\b(?:rgba?|hsla?|color-mix)\(/.test(css)) throw new Error('Use the three solid palette colors.');
const luminance = hex => hex.slice(1).match(/../g).map(channel => parseInt(channel, 16) / 255).map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4).reduce((sum, channel, index) => sum + channel * [.2126, .7152, .0722][index], 0);
const token = name => css.match(new RegExp(`--${name}:\\s*(#[a-f0-9]{6})`, 'i'))[1];
for (const name of ['ink', 'accent']) {
  const values = [luminance(token(name)), luminance(token('paper'))].sort((a, b) => b - a);
  if ((values[0] + .05) / (values[1] + .05) < 4.5) throw new Error(`${name} fails WCAG AA text contrast.`);
}
async function files(directory) { return (await Promise.all((await readdir(directory, { withFileTypes: true })).map(entry => entry.isDirectory() ? files(resolve(directory, entry.name)) : resolve(directory, entry.name)))).flat(); }
let checked = 0;
for (const file of await files(resolve(root, 'dist'))) {
  if (!['.html', '.css', '.js', '.svg'].includes(extname(file))) continue;
  const text = await readFile(file, 'utf8');
  if (/wp-content\/|\/assets\/legacy\/|\/public_html\//i.test(text)) throw new Error(`Legacy WordPress asset reference found in ${file}`);
  if (file.endsWith('.html')) {
    if (/\son(?:click|load|error)=|\sstyle=|<script(?![^>]*\bsrc=)/i.test(text)) throw new Error(`Inline handlers/styles/scripts in ${file}`);
    for (const match of text.matchAll(/(?:src|href)="(\/(?:assets|fonts|media)\/[^"?#]+|\/favicon\.svg)"/g)) {
      await access(resolve(root, 'dist', '.' + match[1])); checked++;
    }
    if (/<iframe\b/i.test(text)) throw new Error('Default pages must not load third-party iframes.');
  }
}
const documents = [...(await readdir(root)).filter(name => name.endsWith('.md')).map(name => resolve(root, name)), ...(await files(resolve(root, 'docs'))).filter(path => path.endsWith('.md'))];
for (const file of documents) {
  const content = await readFile(file, 'utf8');
  const links = [...content.matchAll(/\]\(([^)]+)\)|<img\b[^>]*src="([^"]+)"/g)].map(match => match[1] || match[2]);
  for (const link of links) {
    if (/^(?:https?:|#)/.test(link)) continue;
    await access(resolve(dirname(file), link.split('#')[0]));
  }
}
console.log(`Checks PASS: ${checked} local references; ${families.size} typefaces, ${sizes.join('/')}, ${colors.size} UI colors; sample privacy checks and no eager embeds.`);
