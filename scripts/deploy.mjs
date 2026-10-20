import { spawnSync } from 'node:child_process';
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import config from '../wedding.json' with { type: 'json' };
const root = resolve(import.meta.dirname, '..');
function run(args) {
  const child = spawnSync(process.execPath, [resolve(root, 'node_modules/wrangler/bin/wrangler.js'), ...args], { cwd: root, stdio: 'inherit' });
  if (child.status !== 0) process.exit(child.status || 1);
}
if (config.guestbook.enabled) run(['d1', 'migrations', 'apply', 'DB', '--remote']);
const args = ['deploy'];
if (config.guestbook.enabled) {
  try { await access(resolve(root, '.dev.vars')); args.push('--secrets-file', '.dev.vars'); } catch { /* Remote builds inherit existing Cloudflare secrets. */ }
}
run(args);
