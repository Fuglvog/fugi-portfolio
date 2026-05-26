# FüGï Content Agent

Generates post-ready captions + a fal.ai art prompt for a given brand's
social posts. Writes `out/<brand>/posts.csv` for import into a third-party
scheduler (Buffer / SocialPilot).

**Does NOT** publish, schedule, engage, or call fal.ai directly.
See `CLAUDE.md` for full scope.

Multi-brand: each brand lives under `brands/<brand>/` (e.g. `brands/fugi/`,
`brands/bs/`). The pipeline requires an explicit `<brand>` arg — no default,
to prevent cross-contamination.

## Setup
```
npm install
cp .env.example .env       # then fill ANTHROPIC_API_KEY
```

`brands/fugi/voice_guidelines.md` is committed. The visual files are
scaffolds with TODOs — the ART task is deferred until they're real.

## Usage
```
node src/orchestrator.js <brand> "your idea here" [platform] [datetime]
```
Brands: whatever folders exist under `brands/`. Platforms: `tiktok`
(default), `ig`, `x`, `youtube`. Datetime is optional — leave empty and
pick a slot in the scheduler UI.

Appends a row to `out/<brand>/posts.csv`. Until `art.js` is implemented,
the `art_prompt` column is empty — generate the cover image yourself and
fill `media_path` by hand before importing the CSV.

## Token-free prompt iteration
```
node scripts/dry-run.js <brand> "your idea" tiktok
```
Prints the exact request body that would hit the API and a mocked
response through the same parse logic. No API call, no tokens spent.
Use for tuning `brands/<brand>/voice_guidelines.md` or the system prompt wrapper.

## Files
- `src/copy.js` — caption draft via Claude
- `src/formatter.js` — platform shaping (X newline collapse, truncation)
- `src/art.js` — fal.ai prompt builder (**stub**; see CLAUDE.md)
- `src/orchestrator.js` — wires them together, writes CSV
- `src/csv.js` — CSV append/header logic
- `src/platforms.js` — per-platform config
- `scripts/dry-run.js` — token-free preview
