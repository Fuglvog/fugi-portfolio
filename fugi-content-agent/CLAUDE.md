# FüGï Content Agent — Brain File

> Read this first every session. Authority on scope, voice, and what NOT to do.
> If a request conflicts with this file, flag it before acting.

---

## Operator
**Bagel** — ME student @ WSU. Music producer/DJ as **FüGï**. Indie dev.

**Comms style:** blunt, efficient, casual. No hype-bro filler. Don't ask
permission to start drafting — draft, then offer variants. Outputs should be
**phone-scannable** (operator runs sessions from a phone via Remote Control).
Avoid long code dumps; build in reviewable chunks.

---

## What this agent is

A **content creation agent**. Takes rough ideas → produces post-ready
copy + a fal.ai art prompt → hands off to a third-party scheduler via CSV.

**Multi-brand as of Session 2.** Each brand lives under `brands/<brand>/`
with its own voice/visual files and its own `out/<brand>/posts.csv`. The
pipeline requires an explicit `<brand>` arg — no default — so FüGï and
the BS dry-run brand can never cross-contaminate.

### The 3 layers (we are ONLY building layer 1)
1. **CREATION** ← this agent
   Caption in FüGï's voice + fal.ai prompt string + per-platform formatting.
2. **SCHEDULE / PUBLISH** ← bought (Buffer or SocialPilot). NOT built here.
3. **ENGAGEMENT** ← manual. Auto-likes/comments = 2026 ban risk. Skip.

### Out of scope (do not build, do not suggest)
- Direct publishing to social APIs.
- OAuth flows.
- Auto-engagement (likes, comments, follows, DMs).
- Analytics dashboards.
- Long-running servers.
- **Direct art generation** — see ART note below.

---

## Architecture

```
       <brand>, idea
            │
            ▼
   ┌──────────────────┐
   │   ORCHESTRATOR   │── reads brands/<brand>/ ground truth
   └────────┬─────────┘
   ┌────────┼────────┬────────────────┐
   ▼        ▼        ▼                ▼
 ┌─────┐  ┌─────┐  ┌─────────┐
 │COPY │  │ ART │  │FORMATTER│
 └──┬──┘  └──┬──┘  └────┬────┘
    └────────┴──────────┘
                ▼
     out/<brand>/posts.csv  (datetime, platform, caption, art_prompt, media_path)
                │
                ▼
      operator generates art separately, fills media_path,
            imports CSV → Buffer / SocialPilot
```

- **COPY** drafts caption from `brands/<brand>/voice_guidelines.md`.
- **ART** emits a fal.ai prompt string built from
  `brands/<brand>/fal_ai_templates.md` + `brands/<brand>/visual_identity.md`.
  **It does NOT call fal.ai.** Operator generates the image separately and
  fills `media_path` by hand.
- **FORMATTER** adapts the caption per platform (TikTok / IG / X / YouTube).
- Output is a **CSV handoff** — no direct API push, no OAuth, nothing to
  debug from a phone.

---

## Ground truth — brand files

Operator pastes/uploads into `brands/<brand>/`. Do NOT guess voice if a
file is missing or stubbed — ask for it. Files (per brand):

- `brands/<brand>/voice_guidelines.md`  — drives COPY
- `brands/<brand>/visual_identity.md`   — feeds ART prompt
- `brands/<brand>/fal_ai_templates.md`  — fal.ai prompt patterns to reuse
- `brands/<brand>/ideas/ideas.inbox.md` — running list of post ideas

Active brands:
- `brands/fugi/` — the real one. Voice file has real content; visual
  files are scaffolds (ART deferred).
- `brands/bs/` — throwaway dry-run brand. Started Session 2.

---

## Hard constraints

| # | Rule |
|---|------|
| 1 | **GitHub is home.** Repo is the source of truth. No machine-specific paths in code. Must run on phone shell, any laptop, future Linux box — anywhere with Node + git. |
| 2 | Keep it **LIGHT.** Mostly prompt engineering + a CSV writer. If a step is getting heavy, **stop and flag** — operator wants the simpler path. |
| 3 | Portable formats only: `.js`, `.md`, `.csv`. No binaries committed, no platform-specific tooling. |
| 4 | This `CLAUDE.md` is the brain. Keep it current as we build. |
| 5 | No emojis in code/comments unless asked. |
| 6 | Outputs reviewed on a phone — keep responses scannable. |

---

## Repo location
- Default branch: `main` on `fuglvog/fugi-portfolio`
- Session 1 branch (pipeline build): `claude/fugi-content-agent-4GQ58`
- Session 2 branch (BS dry run): `claude/bs-brand-dry-run-3k0pC`
- Path within repo: `fugi-content-agent/`
- Remote container sessions live at `/home/user/fugi-portfolio/fugi-content-agent/`

---

## Deferred — pick up next session

The COPY + FORMATTER + ORCHESTRATOR pipeline is live and produces usable
CSV rows today. ART is the only piece still stubbed.

**Why ART is deferred:** it's not blocked on code, it's blocked on
content. `brand/voice_guidelines.md` is the only brand file with real
content. The two visual files are scaffolds:

| File | Status | What it needs |
|---|---|---|
| `brand/visual_identity.md` | Mostly TODO | Exact hex values, logo rules, typography, cover/thumbnail style, recurring motifs |
| `brand/fal_ai_templates.md` | Scaffold only | Refined per-use templates (track cover, YouTube thumb, vertical cover, story graphic) once first generations are done |

Implementing `art.js` against the current files would produce generic
prompts that violate the voice file's "specifics over adjectives" rule.
Honest stub > misleading output. The orchestrator catches `art.js`'s
throw and leaves `art_prompt` empty in the CSV — operator can hand-write
art prompts for now.

**Order of operations when picking up:**
1. Operator fills in `brands/<brand>/visual_identity.md` (exact hex,
   typography, cover style — the "TODO — Bagel to confirm" section).
2. Operator refines `brands/<brand>/fal_ai_templates.md` per-use templates.
3. Implement `src/art.js`: reads both visual files + the idea, calls
   Claude with them as system context, returns a fal.ai prompt string.
   Signature: `buildArtPrompt({ brand, idea, platform })`. Pattern matches
   `copy.js` (Opus 4.7, adaptive thinking, no streaming, read brand files
   at runtime — single source of truth).
4. No orchestrator changes needed — it already imports and calls
   `buildArtPrompt({ brand, ... })` with try/catch.

---

## Session log

- **2026-05-26 — Session 2. BS-brand dry run.**
  - Goal: prove the full create → schedule → publish loop end-to-end on a
    throwaway brand before risking FüGï content. FüGï creative work paused.
  - Merged `claude/fugi-content-agent-4GQ58` (Session 1 pipeline) into
    `claude/bs-brand-dry-run-3k0pC`.
  - **Restructured for multi-brand isolation.** `brand/` → `brands/fugi/`,
    `ideas/` → `brands/fugi/ideas/`. Added `brands/bs/`.
  - `src/copy.js`, `src/csv.js`, `src/orchestrator.js`, `src/art.js`,
    `scripts/dry-run.js` all take an explicit `<brand>` arg now. **No
    default brand** — fails loud to prevent cross-contamination.
  - CSV output now per-brand: `out/<brand>/posts.csv`. `.gitignore`
    updated to `out/**/*.csv`.
  - System prompt in `buildSystem(voice, brand)` now references the brand
    by name instead of hardcoded "FüGï".
  - **Buffer CSV format flagged as uncertain** — operator to verify on
    Buffer's site before importing.

- **2026-05-25 — Session 1.**
  - Bootstrapped repo + CLAUDE.md.
  - Scope changes: GitHub-is-home (dropped PC-path / OneDrive rules);
    ART is text-only prompt generation (no fal.ai MCP).
  - Scaffolding committed.
  - `voice_guidelines.md` pasted. `visual_identity.md` and
    `fal_ai_templates.md` are scaffolds with TODOs.
  - **`src/copy.js` shipped.** Reads `brand/voice_guidelines.md` at runtime,
    calls Claude (Opus 4.7 + adaptive thinking) with voice as system prompt.
  - **`scripts/dry-run.js` shipped.** Token-free preview of the request
    payload and the parsed return value. Use for voice/prompt iteration.
  - **`src/formatter.js` shipped.** Pure function: collapses newlines for
    X (single-line only), truncates to `maxChars` on word boundary with
    `…`, warns to stderr on truncation. No I/O.
  - **`src/orchestrator.js` shipped.** Chains
    `draftCopy → formatCaption → buildArtPrompt → appendPost`. Art.js
    refactored from a module-load throw into an exported function;
    orchestrator catches its current throw and leaves `art_prompt` empty
    in the CSV. When art.js is implemented, no orchestrator change needed.
  - `out/posts.csv` added to .gitignore — it's generated handoff output,
    not source. The `out/` directory stays via `.gitkeep`.
  - **Pipeline is end-to-end runnable.** Operator can now run
    `node src/orchestrator.js "idea" platform` and get a posts.csv row.
  - **Session closed.** ART deferred (see above). README updated to
    reflect actual CLI shape + deferred status.
