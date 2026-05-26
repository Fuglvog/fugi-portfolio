# brands/fugi/ — FüGï ground truth

The agent reads these at runtime; they are the single source of truth for
FüGï voice and visual identity. Isolated from `brands/bs/` — the pipeline
takes a `<brand>` arg and never crosses over.

Expected files:
- `voice_guidelines.md`  — drives caption generation (COPY task)
- `visual_identity.md`   — feeds the fal.ai art prompt (ART task)
- `fal_ai_templates.md`  — fal.ai prompt patterns to reuse (ART task)
- `ideas/ideas.inbox.md` — running list of post ideas

If any of these is missing, the corresponding task will refuse to run
rather than hallucinate brand voice.

## Usage
```
node src/orchestrator.js fugi "your idea" tiktok
```
Output goes to `out/fugi/posts.csv`.
