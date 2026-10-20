<div align="center">

# wed

**Your day. Your website.**

A free wedding website template for GitHub and Cloudflare.

[Live demo](https://wed.rezaprama.workers.dev) · [Bahasa Indonesia](README.id.md) · [Photo guide](docs/photos.md) · [Setup help](docs/setup.md)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/rezaprama/wed)
[![Checks](https://github.com/rezaprama/wed/actions/workflows/check.yml/badge.svg)](https://github.com/rezaprama/wed/actions/workflows/check.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-7b2f91)](LICENSE)

</div>

Change the names. Add your photos. Send the link.

**No WordPress. No paid theme. No subscription to this template.** The default site needs no database, API key or terminal. Hosting can stay at $0 within Cloudflare's Free limits. You receive a free `workers.dev` address; buying your own domain is optional.

![wed invitation preview](docs/preview-desktop.png)

<details><summary>See the mobile preview</summary>

<img src="docs/preview-mobile.png" width="390" alt="wed sample invitation on a mobile screen">

</details>

The sample demo scored **100 in all four PageSpeed categories on mobile and desktop** on 20 October 2026. [Reports and measurement context](docs/performance.md). Your photos and added features can change the results.

## Make it yours, one small step at a time

1. **Make a copy.** Click **Deploy to Cloudflare** above. Sign in to your own Cloudflare and GitHub accounts. The setup makes a repository in your account. Alternatively, [Use this template](https://github.com/rezaprama/wed/generate), then connect that copy through Cloudflare → Workers & Pages → Create application → Import a repository.
2. **Deploy the sample.** Your repository can have any short name, such as `our-wedding`. Keep the Cloudflare **Worker name** as `wed` for the first deploy. Use the Free plan. Build command: `npm run build`. Deploy command: `npm run deploy`. Choose Node.js 24 (`NODE_VERSION=24` if needed). Deploy once to see your sample website. [Want another Worker name?](docs/setup.md#2-deploy-the-sample)
3. **Change the words.** In your GitHub copy, open **`wedding.json`**, click the pencil, and replace the names, dates and places. Keep the quotation marks and commas. Set `demo` to `false`. Set `language` to `"en"` or `"id"`. Click **Commit changes**. This saves your changes.
4. **Add your photos.** Open **`public/media`** → **Add file** → **Upload files**. Upload `couple.jpg`, `person-one.jpg`, `person-two.jpg` and your gallery photos. In `wedding.json`, change each matching `.svg` path to your new filename. For example, `"/media/couple.jpg"`. [See the exact photo map](docs/photos.md).
5. **Share your website.** Cloudflare rebuilds after each saved change. Copy the working URL from its dashboard. Open `/send/` to make a link for each guest. Example: `https://your-site.workers.dev/one/?to=Your%20Guest`.

That is enough for an invitation. Music, gifts and a guestbook are optional. The [full guide](docs/setup.md) covers the same steps with common fixes.

**Keep the original template public. Make your own copy private before uploading private photos or gift details.** A private repository hides source files, but the published website is still visible to anyone with its link. `allowIndexing: false` asks search engines not to list it; it is not a password.

## What you get

- A responsive invitation, a cover, two people, event details, maps, a gallery and calendar links.
- One readable settings file, **`wedding.json`**. No JSX or HTML edits needed for normal personalization.
- Two sample cities and two audiences. Lowercase paths invite the couple's guests. Uppercase paths invite the parents' guests. Rename the city slugs or remove an event in the settings file.
- A `/send/` page to create personalized links. Guest names stay in your browser; sending a WhatsApp message is your choice.
- Optional local background music that starts when the invitation opens. One button pauses/resumes it. No YouTube player or third-party scripts on first load.
- Optional gift details and profile links. Empty settings produce no empty cards.
- Optional moderated wishes on Cloudflare D1, with a protected `/admin/` page. [Enable it later](docs/guestbook.md).
- Original SVG placeholder artwork, local licensed fonts, automatic responsive WebP photos and no browser framework.
- Keyboard-friendly dialogs, reduced motion, two fonts, three text sizes and three solid UI colors.
- A real 404 page, canonical URLs that follow your deployed hostname, robots settings and a sitemap.

The demo names, families, dates and venues are examples. The artwork is a placeholder, not a photo of a real couple. Replace these before sending your invitation.

## Four sample links

| Occasion | Couple's guests | Parents' guests |
| --- | --- | --- |
| First city | `/one/` | `/ONE/` |
| Second city | `/two/` | `/TWO/` |

The home page uses the first occasion. City navigation preserves the guest name and audience. Each audience has its own wish feed when the guestbook is enabled. Letter case matters.

## What is free?

The code and placeholder artwork use the **MIT license**. The fonts use their own included **SIL Open Font License**. Commercial use and customization are welcome; follow those licenses.

Cloudflare offers a Free plan for Workers and optional D1. The current Workers allowance includes 100,000 Worker requests per day. D1 includes 5 million rows read and 100,000 rows written per day, with 5 GB total storage. These are account limits, not unlimited hosting. This template runs the Worker for site requests, so plan capacity using that allowance. Check current [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) and [GitHub plan limits](https://docs.github.com/en/billing/concepts/product-billing/github-actions) before a large event. A custom domain or music license may have its own cost.

## For developers

Use Node.js 24 or newer.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:8788`. Local preview creates ignored local secrets and a local SQLite file. It never uses a production database. `npm run dev:cloudflare` uses the official Wrangler simulator instead.

```sh
npm run typegen
npm run check
npm run deploy:dry-run
npx wrangler login
npm run deploy
npm run smoke -- https://your-site.workers.dev
```

The default deployment needs no secret. For automatic updates, use Cloudflare's GitHub integration; the included GitHub Actions workflow validates pushes and pull requests without needing a deployment token. [Architecture and performance](docs/performance.md) explains the design and measurements.

```text
wedding.json        Your names, dates, places and media paths
public/media/       Your photos and optional music
src/                Template, browser code, styles and Worker
scripts/            Build, validation, preview and optional setup
migrations/         Optional guestbook schema
tests/              Config, routing, privacy and database checks
docs/               Small, focused guides
```

## Help make the next wedding easier

Found a problem? [Open an issue](https://github.com/rezaprama/wed/issues/new/choose). Want to improve the template? Read [CONTRIBUTING.md](CONTRIBUTING.md). Small fixes, clear docs and new language support are welcome.

If wed helps you, a star helps another couple find it. Share only screenshots you have permission to publish.
