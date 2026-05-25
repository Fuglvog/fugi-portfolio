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
                ┌──────────────────┐
   idea ───────►│   ORCHESTRATOR   │── reads brand/ ground truth
                └────────┬─────────┘
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
    ┌───────┐       ┌───────┐       ┌───────────┐
    │ COPY  │       │  ART  │       │ FORMATTER │
    │ caption│      │ PROMPT│       │ per-plat  │
    │ draft │       │ string│       │ shape     │
    └───┬───┘       └───┬───┘       └─────┬─────┘
        └───────────────┴─────────────────┘
                         ▼
          out/posts.csv  (datetime, platform, caption, art_prompt, media_path)
                         │
                         ▼
            operator generates art separately, fills media_path,
                  imports CSV → Buffer / SocialPilot
```

- **COPY** drafts caption from `brand/voice_guidelines.md`.
- **ART** emits a fal.ai prompt string built from `brand/fal_ai_templates.md`
  + `brand/visual_identity.md`. **It does NOT call fal.ai.** Operator
  generates the image separately and fills `media_path` by hand.
- **FORMATTER** adapts the caption per platform (TikTok / IG / X / YouTube).
- Output is a **CSV handoff** — no direct API push, no OAuth, nothing to
  debug from a phone.

---

## Ground truth — brand files

Operator pastes/uploads into `brand/`. Do NOT guess voice if a file is
missing or stubbed — ask for it. Files:

- `brand/voice_guidelines.md`  — drives COPY
- `brand/visual_identity.md`   — feeds ART prompt
- `brand/fal_ai_templates.md`  — fal.ai prompt patterns to reuse

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
- Branch: `claude/fugi-content-agent-4GQ58` on `fuglvog/fugi-portfolio`
- Path within repo: `fugi-content-agent/`
- Remote container sessions live at `/home/user/fugi-portfolio/fugi-content-agent/`

---

## Session log

- **2026-05-25 — Session 1.**
  - Bootstrapped repo + CLAUDE.md.
  - Scope changes: GitHub-is-home (dropped PC-path / OneDrive rules);
    ART is text-only prompt generation (no fal.ai MCP).
  - Scaffolding committed.
  - `voice_guidelines.md` pasted. `visual_identity.md` and
    `fal_ai_templates.md` are scaffolds with TODOs.
  - **`src/copy.js` shipped.** Reads `brand/voice_guidelines.md` at runtime,
    calls Claude (Opus 4.7 + adaptive thinking) with voice as system prompt.
    Awaiting operator review before formatter.js / art.js / orchestrator.js.
