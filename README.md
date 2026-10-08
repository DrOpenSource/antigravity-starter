# Antigravity Starter Template & Scaffolding Tool (`agy-init`)

A lightweight, zero-dependency, production-grade project bootstrap generator for **Antigravity**, **Claude Code**, **Cursor**, and other agentic coding environments.

---

## Why This Exists

Most agentic setups fail in production due to two extremes:
1. **Zero structure**: Agents wander, forget project constraints, don't write tests, and break working code.
2. **Heavy multi-agent harnesses**: Over-engineered loops that burn millions of tokens passing verbose state back and forth.

This starter provides the **Lean High-Discipline Model**:
- **`AGENTS.md`**: A tight (<100 line) directory-level constitution that keeps agents grounded every turn.
- **`.agents/skills/`**: Progressive disclosure skills loaded only on-demand without context waste.
- **`docs/ROADMAP.md`**: A living sprint backlog that keeps execution structured across sessions.
- **Zero Dependencies**: Pure Node.js script using built-in modules (`node:readline`, `node:fs`).

---

## Quickstart

### 1. In Any Existing or New Project Directory

Run the interactive wizard:
```bash
npx agy-init
```

Or run non-interactively with custom parameters:
```bash
npx agy-init --yes --name "MyCoolApp" --stack "Next.js / TypeScript" --test "Vitest"
```

### 2. What Gets Generated

```
my-project/
├── .agents/
│   └── skills/
│       ├── sprint-manager/      # Progressive sprint & milestone tracking
│       │   └── SKILL.md
│       └── project-kickoff/     # Standardized alignment questionnaire
│           └── SKILL.md
├── docs/
│   ├── ARCHITECTURE.md          # System architecture & key decisions
│   └── ROADMAP.md               # Sprint backlog with verification checklists
└── AGENTS.md                    # Tailored project protocol and verification standards
```

---

## Verifying and Testing

Run the included automated verification test:
```bash
node test/run-test.js
```
