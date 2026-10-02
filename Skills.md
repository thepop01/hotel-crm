# ⚡ ANTIGRAVITY SUPERPOWERS — Cheat Sheet

*Say any of these phrases and the corresponding superpower activates automatically.*

---

## 🏗️ Building Something New

| Say this... | What happens |
|-------------|-------------|
| `"I want to build [X]"` | Brainstorming skill → clarifying questions → spec doc |
| `"Let's create [X]"` | Brainstorming → design approval → implementation plan |
| `"New feature: [X]"` | Plan written in bite-sized 2-5 min tasks with exact file paths |
| `"Break this down into tasks"` | Writing-plans skill activates |

---

## 🐛 Fixing Bugs

| Say this... | What happens |
|-------------|-------------|
| `"Fix this bug: [X]"` | Systematic debugging — 4-phase root cause process |
| `"Why is [X] not working?"` | Root cause tracing before any code change |
| `"Something's broken"` | Debugging skill: observe → hypothesize → test → fix |
| `"Verify the fix"` | Verification skill: confirms fix actually works |

---

## 🎨 Design & UI Work

| Say this... | What happens |
|-------------|-------------|
| `"Design a [X] page"` | UI/UX Pro Max → design system generation → implementation |
| `"Make the UI look better"` | Color palettes, typography, UX guidelines all loaded |
| `"Build a component"` | Accessibility checklist + design system applied |
| `"What style should I use?"` | 97 curated color palettes + 57 font pairings searched |

---

## 🔵 Three.js / 3D

| Say this... | What happens |
|-------------|-------------|
| `"Add a 3D scene"` | Three.js fundamentals + animation skills loaded |
| `"Three.js [X]"` | Relevant skill module loaded (geometry, lighting, shaders, etc.) |
| `"Add post-processing effects"` | Post-processing skill loaded |
| `"Custom GLSL shader"` | Shaders skill module loaded |

---

## 🔍 Code Review

| Say this... | What happens |
|-------------|-------------|
| `"Review this code"` | Pre-review checklist runs — spots issues by severity |
| `"Check my work"` | Reviews against the original plan/spec |
| `"I got feedback from review"` | Receiving-code-review skill — how to respond effectively |

---

## 🧪 Testing

| Say this... | What happens |
|-------------|-------------|
| `"Write tests"` | TDD skill: RED-GREEN-REFACTOR cycle enforced |
| `"Test-driven"` | Failing test written BEFORE any implementation code |
| `"Add unit tests for [X]"` | Test structure + assertions written first |

---

## 🌿 Git / Branch Management

| Say this... | What happens |
|-------------|-------------|
| `"I'm done with this feature"` | Finishing-a-development-branch: verify tests → merge/PR options |
| `"Create a worktree"` | Git worktrees skill: isolated branch + clean baseline |
| `"Open a PR"` | Pre-PR checklist + PR description written |

---

## 🧠 Memory System — Session Compiler

| Say this... | What happens |
|-------------|-------------|
| `"Compile session"` | Today's session → `daily/YYYY-MM-DD.md` → knowledge articles |
| `"Save this session"` | Same as above |
| `"End session"` | Memory compiler writes lessons learned to knowledge base |
| `"What did we learn about [X]?"` | Queries knowledge base index for answer |
| `"What decisions have we made?"` | Searches compiled knowledge articles |

### What gets saved to memory:
- ✅ Decisions made (why we chose X over Y)
- ✅ Lessons learned (gotchas, edge cases discovered)
- ✅ Patterns and architectures established
- ✅ Libraries/approaches that worked or didn't
- ✅ Action items for next sessions

### Knowledge base location:
```
hotel management app/
├── daily/              ← raw session logs
├── knowledge/
│   ├── index.md        ← master catalog
│   ├── log.md          ← build log
│   ├── concepts/       ← atomic knowledge articles
│   ├── connections/    ← cross-cutting insights
│   └── qa/             ← filed Q&A articles
```

---

## 💡 Power Combos

| Goal | Phrase sequence |
|------|----------------|
| Full new feature flow | `"I want to build X"` → approve spec → `"go"` |
| Premium UI component | `"Design a X component"` → code implemented → `"verify"` |
| Bug hunt + fix | `"Why is X broken"` → root cause found → `"fix it"` → `"verify the fix"` |
| End of work session | `"Compile session"` → knowledge base updated for next time |

---

*All superpowers defined in: `Readme.md` (project root)*
*Skills library: `plugins/superpowers/skills/`*
*UI skills: `Skills/ui-ux-pro-max/` and `Skills/ui-ux-designer/`*
*Three.js skills: `Skills/threejs-skills-main/skills/`*
*Memory schema: `plugins/claude-memory-compiler-main/AGENTS.md`*
