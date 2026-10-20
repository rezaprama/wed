import { readFile, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { parse, modify, applyEdits } from 'jsonc-parser';
import { validateConfig } from '../src/config.mjs';

const root = resolve(import.meta.dirname, '..');
const configPath = resolve(root, 'wedding.json');
const config = validateConfig(JSON.parse(await readFile(configPath, 'utf8')));
let wrangler = await readFile(resolve(root, 'wrangler.jsonc'), 'utf8');
const settings = parse(wrangler);
if (settings.d1_databases?.some(binding => binding.binding === 'DB')) {
  console.log('A DB binding already exists. No database created. See docs/guestbook.md for the remaining steps.');
  process.exit(0);
}
if (!/^[a-z0-9-]{1,50}$/.test(settings.name)) throw new Error('Use a short lowercase Worker name in wrangler.jsonc first.');
let secrets;
try { secrets = await readFile(resolve(root, '.dev.vars'), 'utf8'); }
catch {
  secrets = `ADMIN_TOKEN=${randomBytes(32).toString('hex')}\nIP_HASH_KEY=${randomBytes(32).toString('hex')}\n`;
  await writeFile(resolve(root, '.dev.vars'), secrets, { mode: 0o600 });
}
for (const key of ['ADMIN_TOKEN', 'IP_HASH_KEY']) if (!new RegExp(`^${key}=[a-f0-9]{64}$`, 'm').test(secrets)) throw new Error(`.dev.vars needs an independent 64-character random hex ${key}. Your existing file was preserved.`);
const database = `${settings.name}-wishes-${randomBytes(3).toString('hex')}`;
const command = spawnSync(process.execPath, [resolve(root, 'node_modules/wrangler/bin/wrangler.js'), 'd1', 'create', database, '--binding', 'DB', '--update-config'], { cwd: root, stdio: 'inherit' });
if (command.status !== 0) throw new Error('Database setup stopped. Run npx wrangler login, then try again. Existing local secrets were preserved.');
wrangler = await readFile(resolve(root, 'wrangler.jsonc'), 'utf8');
const bindingIndex = parse(wrangler).d1_databases?.findIndex(binding => binding.binding === 'DB');
if (bindingIndex === undefined || bindingIndex < 0) throw new Error('Wrangler did not create a DB binding. Check its output before retrying.');
wrangler = applyEdits(wrangler, modify(wrangler, ['secrets'], { required: ['ADMIN_TOKEN', 'IP_HASH_KEY'] }, { formattingOptions: { insertSpaces: true, tabSize: 2 } }));
wrangler = applyEdits(wrangler, modify(wrangler, ['d1_databases', bindingIndex, 'migrations_dir'], 'migrations', { formattingOptions: { insertSpaces: true, tabSize: 2 } }));
await writeFile(resolve(root, 'wrangler.jsonc'), wrangler);
config.guestbook.enabled = true;
config.demo = false;
await writeFile(configPath, JSON.stringify(config, null, 2) + '\n');
console.log('Guestbook configured. Private random tokens are in ignored .dev.vars. Their values are not printed.\nNext: npm run typegen, then npm run deploy. Open /admin/ and use ADMIN_TOKEN from .dev.vars.\nCommit wedding.json and wrangler.jsonc to your own repository. Never commit .dev.vars.');
