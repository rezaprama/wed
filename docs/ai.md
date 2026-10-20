# Ask AI, then copy and paste

[Bahasa Indonesia](ai.id.md) · [Start from zero](setup.md) · [Colors and sizes](customize.md)

AI can help write the file contents. This path needs no API key, terminal or paid AI coding feature. You still create your own GitHub and Cloudflare accounts. After AI prepares the contents, you save them in your own repository.

## 1. Choose one chat app

Open [ChatGPT](https://chatgpt.com), [Gemini](https://gemini.google.com), or [Claude](https://claude.ai). Follow signup or sign in to an account you can use. Ordinary text chat is enough. Access and usage limits depend on the service.

You do not need all three. Keep passwords, email codes, tokens and private guest lists out of the conversation.

## 2. Copy the prompt

Open the **[personalization prompt](../prompts/personalize.en.txt)**. Copy its full text into AI. Replace `[WRITE YOUR REQUEST HERE]` with your request.

For example:

> Change the names to Galih and Ratna. Galih was born on 1 January 2000, Ratna on 17 August 2000. Use the green palette from the guide. Add a sage-green dress code. Keep the current event dates.

The prompt asks AI to read your current file, avoid invented details and return the complete file. You do not have to join code fragments together.

## 3. Give it your file

1. Open your GitHub repository copy.
2. Click **`wedding.json`**.
3. Copy all the file text. The **Raw** or copy-file button can help.
4. Paste it into the AI conversation. Answer any necessary questions.

Some AI tools can open a repository link; others cannot. Pasting the file text works for this workflow. A private repository is not automatically readable just because you share its link.

## 4. Save the answer in GitHub

1. Check the names, dates, times, address and map link in the answer.
2. Copy **only the JSON inside the code block**, without the code-block markers.
3. Open `wedding.json` in your GitHub copy. Click the pencil, **Edit this file**.
4. Select all the old file text and paste the AI result.
5. Click **Commit changes** to save.
6. Wait for a successful Cloudflare build, then open your website again.

An AI saying it deployed your website is not proof if it has no account access. Check the successful build and a live page that actually shows the change.

## If there is an error

Copy this prompt and fill in the brackets:

```text
I use wed. Fix this error with the smallest suitable change.
Error: [PASTE THE ERROR WITHOUT TOKENS OR SECRETS]
Current wedding.json: [PASTE THE FILE WITH UNNECESSARY PRIVATE DETAILS REMOVED]
Do not change other data or weaken checks to make it pass.
Return a complete valid wedding.json and explain the fix.
If another file causes the problem, explain which file needs inspection.
```

## Want another feature?

Start with the [no-code choices](customize.md). Dress code and parking use `extraSections`.

For a code change, use the **[feature prompt](../prompts/feature.en.txt)** and [feature guide](features.md). Chat-only AI returns files for you to paste. AI with editor/terminal access can change files and run checks. That depends on its tools and the access you provide.

## Included guardrails

- `AGENTS.md` gives working rules and a file map. `CLAUDE.md` and `GEMINI.md` point to the same rules.
- The schema helps editors recognize settings. Build validation checks dates, URLs, colors, sizes and image files.
- Design is limited to three UI colors, three text sizes and at most three font families. Colors must be readable.
- `npm run verify` runs tests, build, design/asset/document checks and a Cloudflare dry run. GitHub Actions runs it too.
- A PageSpeed score comes from measuring the published URL, not an AI assertion.

Instructions guide the AI; automated checks enforce the constraints they cover. Neither proves your event details are factually correct. Check those details yourself.

References: [OpenAI prompting guidance](https://developers.openai.com/api/docs/guides/prompt-engineering), [Gemini getting started](https://support.google.com/gemini/answer/13275745), [Claude getting started](https://support.claude.com/en/articles/8114491-get-started-with-claude).
