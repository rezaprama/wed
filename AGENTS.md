# Project instructions

- Upstream is a public, reusable wedding template: use fictional sample content and licensed placeholders. Never publish real guest messages, private photos, personal bank details, secrets or private-repository history here. In an owner's personal private copy, use their supplied content within the requested scope and privacy settings. Do not change visibility on their behalf without a clear request.
- Keep names, events and media choices in `wedding.json`. Validate before building.
- Use at most three font families, three fixed text sizes and three solid UI colors. Preserve keyboard access and reduced motion.
- Third-party embeds load only after a visitor requests them. No audit-specific code or user-agent exceptions.
- Run `npm run check` and `npm run deploy:dry-run` before deploying. Run the safe smoke check afterward.
- Default demo has no writable guestbook. Optional D1 mode requires moderation, same-origin writes, bounded input and daily salted IP hashes.
- Keep English and Indonesian setup instructions aligned. Explain each required action in plain language.
- Commit only source, licensed placeholder assets and deliberate public documentation. Ignore build outputs, local secrets, database files and audit scratch.

## Small changes first

- Read the current config and relevant source before editing. Preserve unrelated user changes. Ask only for information that materially blocks the request.
- Content, birth dates, colors, sizes and plain-text sections belong in `wedding.json`. Prefer existing optional features before adding code.
- `theme.colors` has only `background`, `text`, `accent`. Use six-digit hex and at least 4.5:1 text/background and accent/background contrast.
- `theme.fontSizes` has only `body` (16-20), `heading` (24-40), `title` (40-64), with `body < heading < title`. Use existing CSS variables, not new font-size literals.
- Extra content uses up to four `extraSections` with escaped plain `title` and `text`. Do not turn these into arbitrary HTML.
- Keep the default footer credit: `Template by rezaprama.com`, unless the owner asks to change it.
- Do not introduce frameworks, trackers, external fonts, dependencies or paid resources merely for convenience. Explain a necessary new dependency. Heavy additions must be optional and deferred.
- Do not provision paid resources, widen access, change repository visibility, destroy databases or force-push without a clear request. Do not ask for passwords, login codes or existing secrets in chat.
- Never weaken CSP, escaping, validation, moderation, rate limits or design/privacy checks to make a change pass. No audit-detection code or invented PageSpeed numbers.
- New settings need schema, runtime validation and bilingual documentation. Test meaningful new behavior. Check desktop/mobile for visual changes.
- Run `npm run verify` before publication. If the user requested publishing, continue through the repo deploy script and safe live smoke test. Report actual results and concrete blockers.
- A chat-only assistant should return the necessary complete changed files and saving instructions, and clearly state that tests/deploy were not executed.

## File map

See [docs/features.md](docs/features.md) and [docs/features.id.md](docs/features.id.md). Shared project rules live here; `CLAUDE.md` and `GEMINI.md` point here. Human instructions determine the authorized scope. These rules guide changes; automated checks enforce the constraints they cover, not every possible error.
