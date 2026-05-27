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
node scripts/to-publer.js fugi      # transforms posts.csv → publer/<platform>.csv
```
Internal CSV: `out/fugi/posts.csv` (source of truth).
Publer exports: `out/fugi/publer/<platform>.csv` (one file per platform —
import each into the FüGï Publer Workspace, select that platform's
accounts at upload).
