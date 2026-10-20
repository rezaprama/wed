# Your first invitation

You need a GitHub account and a Cloudflare account. Choose their Free plans. This guide starts with a working invitation, without a database.

## 1. Make a copy

Use the Deploy to Cloudflare button in the README. Cloudflare connects your GitHub account and creates a copy for you. Or use GitHub's **Use this template → Create a new repository**, choose **Private** if you will add private photos, and import that repository in Cloudflare Workers & Pages.

Call it something short, such as `our-wedding`. A repository is the folder that holds your website files.

## 2. Deploy the sample

Use these settings if Cloudflare asks:

| Field | Value |
| --- | --- |
| Worker name | `wed` |
| Root directory | `/` |
| Build command | `npm run build` |
| Deploy command | `npm run deploy` |
| Node version | `24` |
| Database / secrets | None for the default site |

If Node version is not shown, add the build environment variable `NODE_VERSION` with value `24`. Cloudflare detects the Wrangler configuration. Open the resulting `workers.dev` link. You should see Rani & Dimas and placeholder artwork.

The repository name and Worker name are separate. `wed` matches the default `name` in `wrangler.jsonc`. If you want a different website name, first edit that `name` in your copy, save it, then use the exact same name in Cloudflare. This avoids a Worker-name mismatch during builds.

Official references: [Deploy button](https://developers.cloudflare.com/workers/platform/deploy-buttons/), [GitHub templates](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template), [Cloudflare Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), [build troubleshooting](https://developers.cloudflare.com/workers/ci-cd/builds/troubleshoot/).

## 3. Replace the words

Open `wedding.json` in your GitHub copy. Click the pencil. Change the text inside quotation marks. Keep the field names, quotation marks, commas and brackets.

```json
"language": "en",
"demo": false,
"allowIndexing": false
```

- `language` changes interface labels. Use `en` for English or `id` for Indonesian.
- `demo: false` removes the sample-only notice.
- `allowIndexing: false` asks search engines not to list your invitation. This lowers the SEO audit score intentionally. It does not prevent people from opening the link.
- `couple` holds names, family lines, parents/hosts, the cover photo and hashtag.
- `events` holds the cities. Dates use `YYYY-MM-DD`. Times use 24-hour `HH:MM`. Time zones use names such as `Asia/Jakarta` or `Europe/London`.
- `slug` is the short city code used in the URL. Example: `jakarta` gives `/jakarta/` and `/JAKARTA/`. Use lowercase letters, numbers or hyphens. Keep at least one event.

Click **Commit changes** to save. Cloudflare rebuilds. If a value is invalid, the build tells you which field to fix; the previous successful site stays live.

## 4. Add photos

Use the [photo map](photos.md). Upload images to `public/media/`. Then update their paths in `wedding.json`. An uploaded file named `cover.jpg` has the path `/media/cover.jpg`.

JPG, PNG, WebP and AVIF photos work. The build makes smaller responsive WebP copies and removes image metadata from the generated raster copies. It does not remove metadata from the original file stored in your repository. Choose a private repository for private source photos. Original placeholder SVGs can be deleted after their config paths are replaced.

## 5. Optional extras

**Music:** upload audio you have permission to use, for example `public/media/song.mp3`. Set `music.file` to `/media/song.mp3`. Leave it empty to disable music. The visitor opens the invitation, then playback starts. Browsers can require another click on Play music. Use a small file; the browser downloads it only after opening the invitation.

**Profiles:** add an item to `socials`, such as `{"label":"Our profile","url":"https://www.instagram.com/your-account/"}`. An empty array hides the links.

**Gifts:** add a gift entry with `label`, `value` and `owner`. The value can be copied by guests. Leave `gifts: []` to hide the section. Parents' invitations omit gifts.

**Video:** put a complete HTTPS link in `videoUrl`. It opens only when clicked. No video is downloaded or embedded on first load.

**Wishes:** follow the separate [guestbook guide](guestbook.md). Skip it if you want a simpler site.

## 6. Send guest links

Open `/send/` on your website. Choose the city and hosts. Type one guest name per line. Press Make guest links. Copy a link or message. WhatsApp opens a draft; you decide whether to send it. No messages are sent automatically.

You can also write `?to=Guest%20Name` at the end of an invitation URL. Do not put phone numbers, passwords or private identifiers in these links.

## When something goes wrong

| What you see | What to do |
| --- | --- |
| Build says `Missing image` | Check the filename, letter case and matching `/media/` path. |
| JSON error | Undo the last edit. Check for a missing comma or quotation mark. |
| Sample notice still visible | Save `"demo": false` and wait for a successful rebuild. |
| Old page after saving | Confirm the latest Cloudflare build succeeded, then refresh. |
| No sound | Click Open invitation or Play music. Check the audio file exists and is playable. |
| Guestbook disabled | This is the default. Use the optional guestbook guide if you need it. |
| Parents' link looks different | Uppercase routes intentionally use parents as hosts. |

For help, open an issue without uploading private photos, guest names, gift details or tokens.
