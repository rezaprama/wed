import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { build, transform } from 'esbuild';
import { validateConfig } from '../src/config.mjs';
import { renderPage, renderTool, variants } from '../src/render.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
if (dirname(dist) !== root || basename(dist) !== 'dist') throw new Error('Unexpected build output.');
const config = validateConfig(JSON.parse(await readFile(resolve(root, 'wedding.json'), 'utf8')));
await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, 'assets'), { recursive: true });
await cp(resolve(root, 'public'), dist, { recursive: true });
// Publish selected, generated media only. Source photos may contain private metadata.
const mediaOutput = resolve(dist, 'media');
if (dirname(mediaOutput) !== dist || basename(mediaOutput) !== 'media') throw new Error('Unexpected media output.');
await rm(mediaOutput, { recursive: true, force: true });
await mkdir(mediaOutput, { recursive: true });
await cp(resolve(root, 'public/media/botanical.svg'), resolve(mediaOutput, 'botanical.svg'));
const digest = bytes => createHash('sha256').update(bytes).digest('hex').slice(0, 12);
const images = {};
const paths = [...new Set([config.couple.photo, config.couple.first.photo, config.couple.second.photo, ...config.gallery])];
for (const path of paths) {
  let bytes;
  try { bytes = await readFile(resolve(root, 'public', '.' + path)); }
  catch { throw new Error(`Missing image: public${path}. Add the file or fix its path in wedding.json.`); }
  const hash = digest(bytes);
  if (path.endsWith('.svg')) {
    const src = `/assets/${hash}.svg`; await writeFile(resolve(dist, '.' + src), bytes); images[path] = { src };
  } else {
    const metadata = await sharp(bytes).metadata();
    const maximum = Math.min(metadata.width, 1200);
    const widths = [...new Set([400, 800, maximum].filter(width => width <= maximum))].sort((a, b) => a - b);
    const output = [];
    for (const width of widths) {
      const src = `/assets/${hash}-${width}.webp`;
      await sharp(bytes).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 76, effort: 5 }).toFile(resolve(dist, '.' + src));
      output.push({ src, width });
    }
    images[path] = { src: output.at(-1).src, srcset: output.map(image => `${image.src} ${image.width}w`).join(', ') };
  }
}
if (config.music.file) {
  try { await readFile(resolve(root, 'public', '.' + config.music.file)); }
  catch { throw new Error(`Missing music: public${config.music.file}. Add your licensed audio or leave music.file empty.`); }
  const target = resolve(dist, '.' + config.music.file);
  await mkdir(dirname(target), { recursive: true });
  await cp(resolve(root, 'public', '.' + config.music.file), target);
}
const css = (await transform(await readFile(resolve(root, 'src/style.css'), 'utf8'), { loader: 'css', minify: true })).code;
const cssPath = `/assets/style-${digest(css)}.css`;
await writeFile(resolve(dist, '.' + cssPath), css);
const bundle = await build({ entryPoints: { app: resolve(root, 'src/client/app.js'), generator: resolve(root, 'src/client/generator.js'), admin: resolve(root, 'src/client/admin.js') }, bundle: true, minify: true, target: ['es2022'], outdir: resolve(dist, 'assets'), entryNames: '[name]-[hash]', metafile: true });
const entry = name => '/' + Object.keys(bundle.metafile.outputs).find(path => bundle.metafile.outputs[path].entryPoint?.endsWith(`/${name}.js`)).replaceAll('\\', '/').replace(/^.*?dist\//, '');
const assets = { css: cssPath, app: entry('app'), generator: entry('generator'), admin: entry('admin'), images };
const pages = variants(config);
for (const page of pages) {
  const target = resolve(dist, page.asset, 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, renderPage(config, page, assets));
}
await writeFile(resolve(dist, 'index.html'), renderPage(config, pages[0], assets, true));
for (const type of ['send', 'admin']) {
  await mkdir(resolve(dist, type), { recursive: true });
  await writeFile(resolve(dist, type, 'index.html'), renderTool(config, type, assets));
}
await writeFile(resolve(dist, '404.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | wed</title><link rel="stylesheet" href="${cssPath}"></head><body><main class="tool-page"><h1>Page not found.</h1><p><a href="/">Back to the invitation</a></p></main></body></html>`);
console.log(`Built ${pages.length + 3} pages. Images optimized; scripts/styles fingerprinted. Guestbook ${config.guestbook.enabled ? 'enabled' : 'disabled'}.`);
