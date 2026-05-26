# brands/bs/ — BS-brand sandbox

Throwaway brand for dry-running the full creation → schedule → publish loop
without putting FüGï content at risk. Files here are isolated from
`brands/fugi/` — the pipeline takes a `<brand>` arg and never crosses over.

Expected files (same shape as `brands/fugi/`):
- `voice_guidelines.md` — drives caption generation (COPY task)
- `visual_identity.md`  — feeds the fal.ai art prompt (ART task; deferred)
- `fal_ai_templates.md` — fal.ai prompt patterns (ART task; deferred)
- `ideas/ideas.inbox.md` — running list of post ideas

If `voice_guidelines.md` is missing, COPY refuses to run rather than
hallucinate voice.

## Usage
```
node src/orchestrator.js bs "your idea" tiktok
```
Output goes to `out/bs/posts.csv` — separate from FüGï's CSV.
