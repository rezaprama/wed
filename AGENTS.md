# Project instructions

- This repository is a public, reusable wedding template. Never add real guest messages, private photos, personal bank details, secrets or private-repository history.
- Keep names, events and media choices in `wedding.json`. Validate before building.
- Use at most three font families, three fixed text sizes and three solid UI colors. Preserve keyboard access and reduced motion.
- Third-party embeds load only after a visitor requests them. No audit-specific code or user-agent exceptions.
- Run `npm run check` and `npm run deploy:dry-run` before deploying. Run the safe smoke check afterward.
- Default demo has no writable guestbook. Optional D1 mode requires moderation, same-origin writes, bounded input and daily salted IP hashes.
- Keep English and Indonesian setup instructions aligned. Explain each required action in plain language.
- Commit only source, licensed placeholder assets and deliberate public documentation. Ignore build outputs, local secrets, database files and audit scratch.
