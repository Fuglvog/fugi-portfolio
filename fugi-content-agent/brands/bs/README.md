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
node src/orchestrator.js bs "your idea" youtube
node scripts/to-publer.js bs        # transforms posts.csv → publer/<platform>.csv
```
Internal CSV: `out/bs/posts.csv` (source of truth, separate from FüGï's).
Publer exports: `out/bs/publer/<platform>.csv` (one file per platform —
import each into the BebeWORLDWIDE Publer Workspace, select that
platform's accounts at upload).
