# 🧠 Antigravity Master Context — Hotel Management App

This file is read at the start of every session. It loads all skills and memory into context.

---

## 🔌 Active Skills & Plugins

@./plugins/superpowers/skills/using-superpowers/SKILL.md
@./plugins/superpowers/skills/using-superpowers/references/gemini-tools.md

---

## ⚡ Superpower Trigger Rules

Read and follow these rules BEFORE any response:

### MANDATORY: Check skills before ANY action
If there is even a 1% chance a skill applies, invoke it. This is not optional.

### Automatic Skill Triggers

| If the user says... | Invoke this skill first |
|---------------------|------------------------|
| "build", "create", "add feature", "I want to" | `brainstorming` → then `writing-plans` |
| "fix", "bug", "error", "not working", "broken" | `systematic-debugging` |
| "design", "UI", "page", "component", "layout", "style" | `ui-ux-pro-max` + `ui-ux-designer` |
| "3D", "three.js", "WebGL", "animation", "scene" | `threejs-*` skills (pick relevant module) |
| "review", "check my code", "look at this" | `requesting-code-review` |
| "test", "TDD", "unit test", "write tests" | `test-driven-development` |
| "merge", "PR", "I'm done", "finished" | `finishing-a-development-branch` |
| "debug", "why is", "what's wrong" | `systematic-debugging` |
| "plan", "break this down", "tasks" | `writing-plans` |

---

## 📚 Skill Library Paths

### Superpowers Skills (General Dev Methodology)
- Brainstorming: `./plugins/superpowers/skills/brainstorming/SKILL.md`
- Writing Plans: `./plugins/superpowers/skills/writing-plans/SKILL.md`
- Executing Plans: `./plugins/superpowers/skills/executing-plans/SKILL.md`
- TDD: `./plugins/superpowers/skills/test-driven-development/SKILL.md`
- Systematic Debugging: `./plugins/superpowers/skills/systematic-debugging/SKILL.md`
- Verification: `./plugins/superpowers/skills/verification-before-completion/SKILL.md`
- Code Review (Request): `./plugins/superpowers/skills/requesting-code-review/SKILL.md`
- Code Review (Receive): `./plugins/superpowers/skills/receiving-code-review/SKILL.md`
- Git Worktrees: `./plugins/superpowers/skills/using-git-worktrees/SKILL.md`
- Finishing Branch: `./plugins/superpowers/skills/finishing-a-development-branch/SKILL.md`
- Subagent Dev: `./plugins/superpowers/skills/subagent-driven-development/SKILL.md`
- Parallel Agents: `./plugins/superpowers/skills/dispatching-parallel-agents/SKILL.md`
- Writing Skills: `./plugins/superpowers/skills/writing-skills/SKILL.md`

### UI/UX Skills
- UI/UX Pro Max: `./Skills/ui-ux-pro-max/SKILL.md`
- UI/UX Designer: `./Skills/ui-ux-designer/SKILL.md`

### Three.js Skills
- Fundamentals: `./Skills/threejs-skills-main/skills/threejs-fundamentals/`
- Animation: `./Skills/threejs-skills-main/skills/threejs-animation/`
- Geometry: `./Skills/threejs-skills-main/skills/threejs-geometry/`
- Lighting: `./Skills/threejs-skills-main/skills/threejs-lighting/`
- Materials: `./Skills/threejs-skills-main/skills/threejs-materials/`
- Shaders: `./Skills/threejs-skills-main/skills/threejs-shaders/`
- Textures: `./Skills/threejs-skills-main/skills/threejs-textures/`
- Post-processing: `./Skills/threejs-skills-main/skills/threejs-postprocessing/`
- Loaders: `./Skills/threejs-skills-main/skills/threejs-loaders/`
- Interaction: `./Skills/threejs-skills-main/skills/threejs-interaction/`

### Memory System
- Schema: `./plugins/claude-memory-compiler-main/AGENTS.md`
- Knowledge Index: `./knowledge/index.md`
- Today's Log: `./daily/` (most recent file)

---

## 🧠 Memory Knowledge Base

> Read `./knowledge/index.md` NOW to load what has been learned in previous sessions.

The knowledge base follows this structure:
- `daily/YYYY-MM-DD.md` — raw session logs (what happened, decisions made, lessons learned)
- `knowledge/index.md` — master catalog of all compiled knowledge
- `knowledge/concepts/` — atomic knowledge articles
- `knowledge/connections/` — cross-cutting insight articles
- `knowledge/qa/` — filed Q&A articles

### To Trigger Memory Compilation

When the user says **"compile session"** or **"end session"** or **"save this session"**:
1. Write `daily/YYYY-MM-DD.md` based on today's conversation
2. Identify new concepts, decisions, and lessons learned
3. Create or update articles in `knowledge/concepts/`
4. If a cross-cutting insight links 2+ concepts, create in `knowledge/connections/`
5. Update `knowledge/index.md` table with new/modified articles
6. Append to `knowledge/log.md`

Follow the schema defined in `./plugins/claude-memory-compiler-main/AGENTS.md` exactly.

---

## 🏨 Project Context

This is a **Hotel Management Application** with:
- `frontend-staff/` — Staff-facing frontend
- `frontend-guest/` — Guest-facing frontend
- `.kiro/` — Kiro AI specs

Always remember the project structure when making code changes.

---

## 📋 Instruction Priority

1. **User's explicit instructions** (this GEMINI.md, direct requests) — HIGHEST
2. **Superpowers skills** — override default behavior
3. **Default assistant behavior** — lowest priority
