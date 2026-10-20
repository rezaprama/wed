# Contributing to wed

Help someone publish their wedding without a web-development course.

1. Open an issue before a large change. Explain the user problem.
2. Make a small branch. Keep names/events/media in `wedding.json`.
3. Use Node.js 24. Run `npm ci`, `npm run typegen`, `npm run check` and `npm run deploy:dry-run`.
4. For visible changes, check desktop and mobile, keyboard navigation and reduced motion. Attach screenshots using sample data only.
5. Keep English and Indonesian guides in sync. Explain words a beginner may not know.
6. Open a pull request with the behavior change and checks you ran.

Keep first load small. Do not add remote fonts, trackers or eagerly loaded embeds. Stay within three typefaces, three text sizes and three UI colors. Do not add private media, credentials, guestbook exports, generated caches or copied proprietary theme code.

All contributions must be compatible with the MIT license. Retain notices for included fonts or other permitted assets. Report security concerns through [SECURITY.md](SECURITY.md), not a public issue.

Bahasa Indonesia: perbaikan kecil, laporan bug yang jelas, dan petunjuk yang lebih mudah sangat membantu. Gunakan data contoh pada screenshot. Jangan unggah foto pribadi, token, atau daftar tamu.
