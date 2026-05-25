# FüGï Content Agent — Brain File

> Read this first every session. It's the authority on scope, voice, and
> what NOT to do. If a request conflicts with this file, flag it before acting.

---

## Operator
**Bagel** — ME student @ WSU. Music producer/DJ as **FüGï**. Indie dev.

**Comms style:** blunt, efficient, casual. No hype-bro filler ("amazing!",
"awesome!", "let's gooo"). Don't ask permission to start drafting — draft,
then offer variants. Outputs should be **phone-scannable** (the operator runs
sessions from a phone via Remote Control). Avoid 200-line code dumps; build
in reviewable chunks.

---

## What this agent is

A **content creation agent**. Takes rough ideas → produces post-ready
copy + cover art → hands off to a third-party scheduler via CSV.

### The 3 layers (we are ONLY building layer 1)
1. **CREATION** ← this agent
   Copy in FüGï's voice + fal.ai cover art + per-platform formatting.
2. **SCHEDULE / PUBLISH** ← bought (Buffer or SocialPilot). NOT built here.
3. **ENGAGEMENT** ← manual for now.
   Auto-liking/commenting is a 2026 ban risk on TikTok/IG/X — skip it.

### Out of scope (do not build, do not suggest)
- Direct publishing to social APIs.
- OAuth flows for any social platform.
- Auto-engagement (likes, comments, follows, DMs).
- Analytics dashboards.
- Anything requiring a long-running server.

---

## Architecture

```
                ┌──────────────────┐
   idea ───────►│   ORCHESTRATOR   │── reads ground truth (brand files)
                └────────┬─────────┘
                         │ fans out to 3 sub-tasks
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
    ┌───────┐       ┌───────┐       ┌───────────┐
    │ COPY  │       │  ART  │       │ FORMATTER │
    │ draft │       │ fal.ai│       │ per-plat  │
    └───┬───┘       └───┬───┘       └─────┬─────┘
        └───────────────┴─────────────────┘
                         │
                         ▼
                  posts.csv  (caption, platform, datetime, media_path)
                         │
                         ▼
               operator imports → Buffer / SocialPilot
```

- **COPY** drafts caption from brand voice files.
- **ART** generates cover/thumbnail via the **fal.ai MCP server**.
- **FORMATTER** adapts the draft per platform (TikTok / IG / X / YouTube).
- Output is a **CSV handoff** — no direct API push. Keeps auth/OAuth out of v1
  so there's nothing miserable to debug from a phone.

---

## Ground truth — brand files (authority over assumptions)

Live in OneDrive hub **"All FüGï Assets"**. Operator pastes/uploads as needed
— do NOT guess voice if a file hasn't been provided yet, ask for it.

- `00_INDEX.md`
- `01_Brand/voice_guidelines.md`
- `01_Brand/visual_identity.md`
- `05_Prompts/fal_ai_templates.md`

---

## Hard constraints

| # | Rule |
|---|------|
| 1 | Repo lives at `C:\Users\rfugl\Claude Code1\fugi-content-agent\` on the PC. **NEVER inside OneDrive** — sync engine breaks dev tooling. |
| 2 | Brand assets stay in OneDrive. Code stays local. Don't cross them. |
| 3 | Keep it **LIGHT**. Mostly prompt engineering + a fal.ai call + a CSV writer. If a step is getting heavy, **stop and flag** — operator wants the simpler path. |
| 4 | Shell is **PowerShell**. CMake is not on PATH. |
| 5 | This `CLAUDE.md` is the brain — keep it current as we build. |
| 6 | No emojis in code/comments unless asked. |
| 7 | Outputs are reviewed on a phone — keep responses scannable. |

---

## Remote container note

Sessions may run in the Claude Code remote container at
`/home/user/fugi-portfolio/fugi-content-agent/`. The Windows path above is
the operator's local working copy. Code is identical; only the path differs.

Branch: `claude/fugi-content-agent-4GQ58` on `fuglvog/fugi-portfolio`.

---

## Session log

- **2026-05-25 — Session 1.** Repo bootstrapped. CLAUDE.md created.
  File structure plan + brand-file request pending operator review.
