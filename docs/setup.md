# Your first invitation, starting with no accounts

[Bahasa Indonesia](setup.id.md) · [Back to the main page](../README.md)

Get the sample online first. Then change the words and photos. You can do the main steps in a laptop browser, without installing an app or typing terminal commands.

## A few words you will see

| Word | What it means |
| --- | --- |
| GitHub | A place to keep your invitation files. Think of an online folder. |
| Repository, or repo | One project folder on GitHub. |
| Cloudflare | The service that publishes those files as a website guests can open. |
| Commit changes | Save your file changes. |
| Build | Cloudflare is preparing your website from the files. |
| Deploy | Cloudflare is publishing the prepared website. |

## No accounts yet? Start here

1. Open [GitHub signup](https://github.com/signup). Follow the form or available sign-in options. Use an email inbox you can open.
2. Choose a username, such as `galih-ratna`. This is your account name, separate from the invitation wording.
3. Open GitHub's email and finish verification. Choose **Free** if asked for a plan.
4. Open [Cloudflare signup](https://dash.cloudflare.com/sign-up). Follow signup and email verification.
5. Sign in to Cloudflare. Use **Workers Free** for this guide. You can skip buying a domain or setting up domain DNS.

Your website gets a free `workers.dev` address. The sample needs no purchased domain or database. If a screen offers a paid upgrade, you do not need it for these steps.

You are ready when you can sign in to both accounts. Official help: [GitHub account](https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github), [Cloudflare account](https://developers.cloudflare.com/fundamentals/account/create-account/).

## 1. Make a copy

1. Open [Make a copy of wed](https://github.com/rezaprama/wed/generate).
2. Under **Owner**, choose your GitHub account.
3. Under **Repository name**, enter a short name, such as `our-wedding`.
4. Choose **Private** to keep source photos and personal details off public GitHub.
5. Click **Create repository**. Wait for the file list.

You are ready when the address contains your account, such as `github.com/your-name/our-wedding`. Edit this copy. A private repository hides source files; the published website remains visible to anyone with its link.

## 2. Deploy the sample

In Cloudflare, open **Workers & Pages → Create application → Import a repository**, or **Connect to Git**. Connect your GitHub account. If asked which repositories to allow, select your invitation copy. Choose `our-wedding`, then enter:

| Field | Value |
| --- | --- |
| Worker name | `wed` |
| Production branch | `main` |
| Root directory | `/` |
| Build command | `npm run build` |
| Deploy command | `npm run deploy` |
| Node version | `24` |
| Database / secrets | None for the default site |

If Node version is not shown, add the build environment variable `NODE_VERSION` with value `24`. Cloudflare detects the Wrangler configuration.

Click **Deploy** and wait for success. Open the resulting `workers.dev` link. You should see Galih & Ratna and placeholder artwork. Menu labels can change; look for the option to import a GitHub repository. The README's **Deploy to Cloudflare** button is another path that also creates a copy. Since step 1 already made your copy, import that copy here.

The repository name and Worker name are separate. `wed` matches the default `name` in `wrangler.jsonc`. If you want a different website name, first edit that `name` in your copy, save it, then use the exact same name in Cloudflare. This avoids a Worker-name mismatch during builds.

Official references: [Deploy button](https://developers.cloudflare.com/workers/platform/deploy-buttons/), [GitHub templates](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template), [Cloudflare Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), [build troubleshooting](https://developers.cloudflare.com/workers/ci-cd/builds/troubleshoot/).

## 3. Replace the words

Open `wedding.json` in your GitHub copy. Click the pencil, **Edit this file**. Change the text inside quotation marks. Keep the field names, quotation marks, commas and brackets.

```json
"language": "en",
"demo": false,
"allowIndexing": false
```

- `language` changes interface labels. Use `en` for English or `id` for Indonesian.
- `demo: false` removes the sample-only notice.
- `allowIndexing: false` asks search engines not to list your invitation. This lowers the SEO audit score intentionally. It does not prevent people from opening the link.
- `couple` holds names, family lines, parents/hosts, the cover photo and hashtag.
- `couple.first.birthDate` and `couple.second.birthDate` are optional birth dates, written as `YYYY-MM-DD`. The sample uses Galih (1 January 2000) and Ratna (17 August 2000). Remove the `birthDate` field to hide a birth date.
- `events` holds the cities. Dates use `YYYY-MM-DD`. Times use 24-hour `HH:MM`. Time zones use names such as `Asia/Jakarta` or `Europe/London`.
- `slug` is the short city code used in the URL. Example: `jakarta` gives `/jakarta/` and `/JAKARTA/`. Use lowercase letters, numbers or hyphens. Keep at least one event.

Click **Commit changes** to save. Cloudflare rebuilds. If a value is invalid, the build tells you which field to fix; the previous successful site stays live.

Not comfortable editing the file? [Ask AI to prepare the complete file](ai.md), then paste it into GitHub. For colors, sizes and dress code, use the [customization guide](customize.md). It uses the same file.

## 4. Add your photos

1. In your GitHub copy, open **public**, then **media**.
2. Click **Add file → Upload files**. Choose a photo from your laptop, such as `couple.jpg`.
3. Click **Commit changes** to save the upload.
4. Open `wedding.json`, click the pencil and change `/media/couple.svg` to `/media/couple.jpg`.
5. Save with **Commit changes**. Wait for a successful Cloudflare build.

The [photo map](photos.md) shows where each image appears. Use simple filenames and match uppercase/lowercase letters exactly. JPG, PNG, WebP and AVIF work. The build makes smaller WebP copies and removes metadata from generated photos. Original files in your repository still retain their metadata, so use a private repo for personal source photos. You can remove unused sample SVGs after updating every reference.

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

To restore older content: open `wedding.json` → **History** → choose a version that worked → copy that file's text. Return to the file on `main`, click the pencil, paste the older text and **Commit changes**. A typo does not require deleting your repository.

Keep passwords, email codes and tokens to yourself. The [AI guide](ai.md) has a repair prompt. Use the [feature guide](features.md) when a change needs code.
