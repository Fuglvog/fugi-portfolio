# brand/ — ground truth

Paste the FüGï brand files here. The agent reads these at runtime; they are
the single source of truth for voice and visual identity.

Expected files:
- `voice_guidelines.md`  — drives caption generation (COPY task)
- `visual_identity.md`   — feeds the fal.ai art prompt (ART task)
- `fal_ai_templates.md`  — fal.ai prompt patterns to reuse (ART task)

If any of these is missing, the corresponding task will refuse to run
rather than hallucinate brand voice.
