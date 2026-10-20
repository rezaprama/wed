# Add a feature without replacing the whole website

[Bahasa Indonesia](features.id.md) · [Copy the AI prompt](../prompts/feature.en.txt) · [No-code settings](customize.md)

## Check the built-in choices first

| Request | Shortest path |
| --- | --- |
| Dress code, parking, guest notes | `extraSections` in `wedding.json` |
| Another city or event | Add an `events` entry, up to four |
| More photos | `gallery`, up to 12 |
| Music and video | `music.file` and `videoUrl` |
| Profiles or other links | `socials` |
| Wishes approved by an owner | [Optional D1 guestbook](guestbook.md) |

These need content changes. AI does not need to rebuild the project from scratch.

## When the request needs code

Copy the [feature prompt](../prompts/feature.en.txt). Describe the feature and an example. For example: “Add a countdown to the first event. After that time, show a thank-you message. Respect the event time zone.”

Give AI the files from your copy. If it cannot open a private repo, ask it which files it needs. An AI tool with folder and terminal access is more convenient for code changes. Ordinary chat can still return full files, but cannot run checks itself.

## File map for an AI or developer

| File | Purpose |
| --- | --- |
| `wedding.json` | Invitation content and feature choices |
| `wedding.schema.json` | Settings recognized by editors |
| `src/config.mjs` | Reject invalid settings |
| `src/theme.mjs` | Three colors, three sizes, contrast and CSS token application |
| `src/render.mjs` | HTML variants and interface translations |
| `src/style.css` | Layout using the same design tokens |
| `src/client/app.js` | Browser interactions, including cover and gallery |
| `src/worker.ts` | Routing and optional guestbook API |
| `scripts/build.mjs` | Generate the website and optimized assets |
| `scripts/check.mjs` | Design, asset, sample-privacy and document-link checks |
| `tests/` | Behavior tests |

## Working order for a code change

1. Describe one example of the desired result. Keep unrelated features separate.
2. Read `AGENTS.md` and relevant files. Heavy additions should have a disabled-by-default switch.
3. Update schema and validation for new settings. Add English and Indonesian interface labels.
4. Reuse color/size tokens. Keep keyboard access, reduced motion and all four invitation variants.
5. Test meaningful new behavior. With Node.js 24, run `npm run verify` for type checking, tests, build, design, assets, documents and the Cloudflare dry run.
6. For visual changes, check desktop and mobile: cover, buttons, the new section and overflowing text.
7. If publication is requested, run `npm run deploy`, then `npm run smoke -- https://your-site.workers.dev`.
8. For changes affecting initial downloads or major interactions, measure the live URL with PageSpeed again. Record actual results.

Passing checks does not prove event facts are correct. Do not invent tests, scores or cost guarantees. Do not disable checks to make a broken change pass.

## Constraints to preserve

- At most three UI colors, three text sizes and three font families. Photos keep their colors.
- At least 4.5:1 text and accent contrast against the background.
- Load heavy assets, audio, video and external services only when needed.
- Keep guest details and tokens out of public repositories and logs.
- Preserve guestbook validation, same-origin writes, moderation and rate limits.
- Paid resources, access/visibility changes, database deletion and force-push need a clear request. Ordinary content edits do not need new credentials.

`AGENTS.md` holds the rules. `CLAUDE.md` and `GEMINI.md` point to them. AI tools differ; if yours does not load the rules automatically, ask it to read them or paste them. Written rules guide the AI. Automated validation supplies additional checks that can actually run.
