# Optional guestbook

Skip this guide if you only want an invitation. The default demo does not collect messages. A working guestbook needs a small Cloudflare D1 database and two private random values. It can fit the D1 Free allowance, subject to account limits.

## Set it up on your computer

Install Node.js 24. Download or clone your own repository. Open a terminal in its folder.

```sh
npm ci
npx wrangler login
npm run setup:guestbook
npm run typegen
npm run deploy
```

The setup script creates a uniquely named D1 database, adds its non-secret binding to `wrangler.jsonc`, enables `guestbook.enabled` in `wedding.json`, and creates random `ADMIN_TOKEN` and `IP_HASH_KEY` values in ignored `.dev.vars` if the file does not exist. Existing local tokens are preserved. A partial or invalid existing token file stops setup without overwriting it.

Deployment applies the schema and uploads local secrets through `--secrets-file`. Their values are never placed in command arguments or printed by the scripts. Later Cloudflare builds inherit deployed secrets. If a DB binding already exists, the setup script does not create another database. Check the existing binding and `guestbook.enabled` setting before deploying.

Commit **`wedding.json`** and **`wrangler.jsonc`** to your own repository. The database ID is not a secret. **Never commit `.dev.vars`.** Check the same repository in Cloudflare's GitHub build integration so future edits update the same Worker.

## Approve wishes

1. Open `.dev.vars` locally. Copy the value after `ADMIN_TOKEN=`.
2. Open `https://your-site.workers.dev/admin/`.
3. Paste the token into the password field. Sign in.
4. Approve or reject each wish. Pending wishes are not public.
5. Sign out when finished. The browser keeps the token only in memory.

Tokens must never go in a URL, screenshot, issue or chat message. Use HTTPS for the live website. Guestbook writes require the same origin, valid bounded JSON, a request ID and a valid event. Messages are rendered as text. The database stores a daily salted hash for rate limiting, not raw IP addresses. Each source may submit at most five wishes per UTC day across all occasions. Duplicate request IDs do not create duplicate wishes.

## Back up before future schema changes

```sh
npx wrangler d1 export DB --remote --output .local/guestbook-backup.sql
```

Keep exports out of Git and public issue attachments. The initial migration creates tables; later schema changes should preserve existing messages and have a backup/rollback plan. Deleting or disabling the frontend does not delete the database.

## Local testing

`npm run dev` uses SQLite on your computer, not production D1. To try the form locally, enable `guestbook.enabled`, then run the preview. Its local tokens are stored in ignored `.dev.vars`. `npm test` exercises moderation, audience isolation, throttling, pagination, SQL-looking text, cross-origin rejection and byte limits without a Cloudflare account.
