# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repo.

## Source of truth

**Read [`AGENTS.md`](./AGENTS.md) first.** It owns the project's coding standards, design system, domain rules, behavioral rules, and document map (`REACT_CODING_STANDARDS.md`, `DESIGN_SYSTEM.md`, `docs/*`). Everything below is Claude Code harness configuration only — it does NOT duplicate AGENTS.md.

## Commands (quick ref)

- `npm run dev` — Vite dev server (proxies `/api` → `http://localhost:3000`).
- `npm run build` — `tsc -b` then `vite build` (fails on type error).
- `npm run lint` — ESLint (flat config).
- `npm run test:run` — Vitest single run; `npm run test:coverage` for v8 coverage (50% threshold).
- Single test: `npx vitest run <path> -t "should_..."`.

---

# ClaudeKit Engineer (installed)

Kit lives under `.claude/`. Custom OpenSpec workflow under `.claude/commands/opsx/` and `.claude/skills/openspec-*` is preserved alongside it.

## Role

Analyze user requirements, delegate to sub-agents in `.claude/agents/`, and ensure delivery follows the architectural standards in `AGENTS.md`.

## Workflows (kit rules)

- Primary: `./.claude/rules/primary-workflow.md`
- Development: `./.claude/rules/development-rules.md`
- Orchestration: `./.claude/rules/orchestration-protocol.md`
- Documentation: `./.claude/rules/documentation-management.md`
- All others: `./.claude/rules/*`

**IMPORTANT:**
- Activate skills from the catalog as needed for the task.
- DO NOT modify skills in `~/.claude/skills` directly — modify them in this working directory.
- Strictly follow `./.claude/rules/development-rules.md`.
- Read `./README.md` before planning or implementation.
- Sacrifice grammar for concision in reports; list unresolved questions at the end.

## Project rules override kit rules

Where `AGENTS.md` (and the docs it maps) conflict with kit rules in `.claude/rules/*`, **AGENTS.md wins**.

## Git

**DO NOT** use `chore` or `docs` commit types for changes inside `.claude/`.

## Hook Response Protocol

### Privacy Block Hook (`@@PRIVACY_PROMPT@@`)

When a tool call is blocked, the output contains JSON between `@@PRIVACY_PROMPT_START@@` and `@@PRIVACY_PROMPT_END@@`. **You MUST use `AskUserQuestion`** to get approval.

1. Parse the JSON from the hook output.
2. Use `AskUserQuestion` with the question data.
3. On approval → `bash cat "filepath"`. On skip → continue without the file.

## Python Scripts (Skills)

Use the venv interpreter for `.claude/skills/` scripts:
- **Linux/macOS:** `.claude/skills/.venv/bin/python3 scripts/xxx.py`
- **Windows:** `.claude\skills\.venv\Scripts\python.exe scripts\xxx.py`

If a script fails, fix it directly and re-run.

## Markdown output paths

- Plans → `./plans/`
- Docs → `./docs/`
- Reports → `./plans/reports/`

DO NOT create markdown files outside these unless the user explicitly asks.

**IMPORTANT:** *MUST READ* and *MUST COMPLY* with `AGENTS.md` and the **Workflows** section above — *MANDATORY. NON-NEGOTIABLE. NO EXCEPTIONS.*
