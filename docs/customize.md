# Change words, colors, sizes and content sections

[Bahasa Indonesia](customize.id.md) · [Start from zero](setup.md) · [Ask AI for help](ai.md)

Everything here uses **`wedding.json`**. Open it in your GitHub copy, click the pencil, change the values and **Commit changes**. Cloudflare publishes after validation succeeds.

These snippets show parts of the file. Do not replace the entire `wedding.json` with one small snippet. The [AI prompt](../prompts/personalize.en.txt) can prepare the complete file if editing JSON is unfamiliar.

## Names and words

- `couple.names`: names together, such as `Galih & Ratna`.
- `couple.first` and `couple.second`: each person's name, family, photo and birth date.
- `birthDate`: a date such as `2000-01-01`. The second sample is `2000-08-17`. Remove this field to hide the birth date.
- `events`: cities, event names, dates, times, venues and maps.
- `language`: `en` for English or `id` for Indonesian. This changes built-in labels. Your own text stays as you wrote it.

## Three colors

Find `theme`, then `colors`:

```json
"colors": {
  "background": "#f7f1f9",
  "text": "#3d1c47",
  "accent": "#7b2f91"
}
```

`background` is the page background. `text` is the main text. `accent` is used for buttons and links. Write `#` followed by six color digits/letters. The sample illustrations follow your chosen palette too. Your own photos and unmarked SVG artwork keep their original colors.

You can copy one complete row into these three fields:

| Choice | background | text | accent |
| --- | --- | --- | --- |
| Original purple | `#f7f1f9` | `#3d1c47` | `#7b2f91` |
| Green | `#f6f7ed` | `#203b2f` | `#356848` |
| Warm | `#fff5ec` | `#442c24` | `#934b34` |

The build checks readability. Text and accent must each have at least 4.5:1 contrast against the background. If it says `too hard to read`, choose darker text on a light background, or use a palette above. Gradients and a fourth color are outside these settings.

## Three text sizes

```json
"fontSizes": { "body": 16, "heading": 28, "title": 52 }
```

| Field | Used for | Allowed numbers |
| --- | --- | --- |
| body | Ordinary text, buttons and the small credit | 16 to 20 |
| heading | Section headings | 24 to 40 |
| title | Large cover names | 40 to 64 |

Use whole numbers without quotation marks or `px`. Keep `body < heading < title`. A larger example is `18`, `32`, `56`. The same two local fonts stay in use. Images and layout adapt to the screen.

## Add dress code, parking or your own note

Replace `"extraSections": []` with:

```json
"extraSections": [
  { "title": "Dress code", "text": "Please wear sage green." },
  { "title": "Parking", "text": "Use the parking area beside the main entrance." }
]
```

These appear after event details on every invitation variant. Add up to four sections. A title can contain 100 characters; text can contain 1,000. These are plain-text fields. HTML is not executed. Use `[]` to hide the sections.

## Other built-in choices

| What you want | Setting |
| --- | --- |
| More memories | Add local `/media/` paths to `gallery`. |
| Music | Upload audio you may use, then set `music.file`, such as `/media/song.mp3`. |
| Video | Put a complete HTTPS link in `videoUrl`. |
| Instagram or other profiles | Add `label` and `url` entries to `socials`. |
| Gifts | Add `label`, `value`, `owner` entries to `gifts` in your private copy. |
| Guest wishes | Follow the [guestbook guide](guestbook.md). |
| Stay out of search results | Set `allowIndexing` to `false`. This does not add a password. |

For a feature that needs code changes, use the [feature guide](features.md). One small change at a time makes problems easier to find.
