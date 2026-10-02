---
title: "Plugin & Skills Integration Architecture"
aliases: [superpowers-setup, skills-integration, gemini-skills]
tags: [architecture, setup, plugins, skills, memory]
sources:
  - "daily/2026-04-20.md"
created: 2026-04-20
updated: 2026-04-20
---

# Plugin & Skills Integration Architecture

The Hotel Management App workspace uses a `plugins/` and `Skills/` folder system adapted from the Claude Code ecosystem to work with Antigravity (Gemini-based AI).

## Key Points

- `GEMINI.md` at project root is the master context file — loaded at the start of every session
- Skill trigger rules in `GEMINI.md` map prompt keywords to specific skill files
- Memory compilation is manual: user says "compile session" → AI writes daily log + updates knowledge base
- The `plugins/superpowers/` folder contains 14 development methodology skills (brainstorming, TDD, debugging, etc.)
- The `Skills/` folder contains UI/UX and Three.js skills

## Details

### Adaptation from Claude Code
The plugins were built for Claude Code's native `Skill` tool (invoked with `/skill`) and auto-firing `SessionStart`/`SessionEnd` hooks. Since Antigravity uses Gemini under the hood, these native mechanisms don't exist. The adaptation uses:
1. `GEMINI.md` with `@` path references to load skill files into session context
2. Declared trigger rules (keyword → skill) instead of automatic hooks
3. Manual "compile session" command instead of Python `session-end.py` hook

### Directory Structure
```
hotel management app/
├── GEMINI.md                    ← loaded every session (master context)
├── ANTIGRAVITY_SKILLS.md        ← user cheat sheet
├── plugins/
│   ├── superpowers/             ← dev methodology skills (14 skills)
│   ├── claude-memory-compiler-main/ ← memory system schema
│   ├── claude-mem-main/         ← alternative memory system
│   ├── claudedesignskills/      ← design skills
│   └── graphify-4/              ← graph visualization
├── Skills/
│   ├── ui-ux-pro-max/           ← 97 palettes, 57 fonts, 99 UX rules
│   ├── ui-ux-designer/          ← expert UI/UX design persona
│   └── threejs-skills-main/     ← 10 Three.js skill modules
├── daily/                       ← raw session logs (source)
└── knowledge/
    ├── index.md                 ← master catalog
    ├── log.md                   ← build log
    ├── concepts/                ← atomic knowledge articles
    ├── connections/             ← cross-cutting insights
    └── qa/                      ← filed Q&A answers
```

### Skill Trigger Priority
1. Process skills first (brainstorming, debugging) — these determine HOW to approach
2. Implementation skills second (UI/UX, Three.js) — these guide execution

## Related Concepts

*No related articles yet — knowledge base is new.*

## Sources

- [[daily/2026-04-20.md]] — Initial setup session
