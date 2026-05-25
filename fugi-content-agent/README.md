# FüGï Content Agent

Generates post-ready captions + a fal.ai art prompt for FüGï's social posts.
Writes `out/posts.csv` for import into a third-party scheduler
(Buffer / SocialPilot).

**Does NOT** publish, schedule, engage, or call fal.ai directly.
See `CLAUDE.md` for full scope.

## Setup
```
npm install
cp .env.example .env       # then fill ANTHROPIC_API_KEY
```
Paste the brand files (voice_guidelines.md, visual_identity.md,
fal_ai_templates.md) into `brand/`.

## Usage
```
npm run post -- "your idea here" --platform tiktok
```
Appends a row to `out/posts.csv`. Generate the cover image yourself
using the `art_prompt` column, then fill `media_path` by hand and import
the CSV into your scheduler.

## Platforms supported
`tiktok`, `ig`, `x`, `youtube`
