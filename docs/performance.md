# Performance, accessibility and privacy

wed renders static HTML at build time. It sends no browser framework, remote fonts, analytics SDK, YouTube player or map iframe by default. The cover is present in server HTML before JavaScript upgrades it to a modal dialog. JavaScript enhances dialogs, links, clipboard and the optional guestbook.

Raster photos become responsive WebP at build time. Their generated files lose source metadata. SVG placeholders stay small. CSS, scripts and generated images have content-based filenames; those assets receive long cache lifetimes. Critical cover media and the title font are preloaded. Other photos use native lazy loading. Optional audio has `preload="none"` and starts after the visitor opens the invitation. Maps and video are links opened by choice.

The default typography uses two local font families, three fixed text sizes and three solid UI colors. `scripts/check.mjs` enforces these limits, checks asset/document links, rejects legacy WordPress asset paths, and requires sample mode to use SVG placeholders without personal gift/social/audio data or message collection. Config validation rejects malformed event data, unsafe URLs and local path traversal. The 15 tests also cover the optional D1 backend.

## How to measure

1. Deploy the site, then open [PageSpeed Insights](https://pagespeed.web.dev/).
2. Paste the exact public URL.
3. Run an analysis and inspect both Mobile and Desktop.
4. Save the report link, test date and four scores. Compare the same URL and device mode after changes.
5. Inspect the actual failed audits. Do not hide features or detect the audit user agent to improve a score.

Performance measurements vary with network, test infrastructure, browser/Lighthouse version, your photos and added features. A perfect lab run is not a guarantee of future scores or search ranking. Lighthouse also cannot prove full accessibility: use a keyboard and check real phones.

## Measurements

Live demo: https://wed.rezaprama.workers.dev

Measured on **20 October 2026**, using the unmodified sample configuration and SVG placeholders, Lighthouse 13.5.0:

| Device | Performance | Accessibility | Best Practices | SEO | Report |
| --- | --- | --- | --- | --- | --- |
| Mobile | 100 | 100 | 100 | 100 | [PageSpeed report](https://pagespeed.web.dev/analysis/https-wed-rezaprama-workers-dev/hzq83lt6bl?form_factor=mobile) |
| Desktop | 100 | 100 | 100 | 100 | [PageSpeed report](https://pagespeed.web.dev/analysis/https-wed-rezaprama-workers-dev/hzq83lt6bl?form_factor=desktop) |

Evidence: [mobile screenshot](pagespeed-mobile.png), [desktop screenshot](pagespeed-desktop.png). These are measured demo results, not promises for customized photos, optional features or future tests. Real-user field data was unavailable at the time of the run.

## Search visibility

The public sample uses `allowIndexing: true`, with a sitemap, crawlable pages, a description and canonical URLs generated for the actual deployment hostname. Tools and APIs stay `noindex`. Personal copies may use `allowIndexing: false`. That intentionally prevents a perfect SEO audit while requesting privacy from search engines. It does not restrict access to the live site.

The public template has no personal photographs, historical guest messages, real gift details, private Cloudflare IDs or private-repository history. The optional live guestbook only publishes approved messages. A public demo should normally keep that feature disabled.
