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

`brand/voice_guidelines.md` is committed. `brand/visual_identity.md` and
`brand/fal_ai_templates.md` are scaffolds with TODOs — fill them in when
ready (the ART task is deferred until they're real).

## Usage
```
node src/orchestrator.js "your idea here" [platform] [datetime]
```
Platforms: `tiktok` (default), `ig`, `x`, `youtube`. Datetime is optional —
leave empty and pick a slot in the scheduler UI.

Appends a row to `out/posts.csv`. Until `art.js` is implemented, the
`art_prompt` column is empty — generate the cover image yourself and
fill `media_path` by hand before importing the CSV.

## Token-free prompt iteration
```
node scripts/dry-run.js "your idea" tiktok
```
Prints the exact request body that would hit the API and a mocked
response through the same parse logic. No API call, no tokens spent.
Use for tuning `brand/voice_guidelines.md` or the system prompt wrapper.

## Files
- `src/copy.js` — caption draft via Claude
- `src/formatter.js` — platform shaping (X newline collapse, truncation)
- `src/art.js` — fal.ai prompt builder (**stub**; see CLAUDE.md)
- `src/orchestrator.js` — wires them together, writes CSV
- `src/csv.js` — CSV append/header logic
- `src/platforms.js` — per-platform config
- `scripts/dry-run.js` — token-free preview
