#!/usr/bin/env node

/**
 * agy-init: Universal Project-Agnostic Antigravity & Claude Code Scaffolding Tool
 * 
 * Sets up production-grade agent configurations, progressive skills,
 * and sprint roadmap trackers in any repository.
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    name: '',
    description: '',
    stack: 'TypeScript / Node.js',
    testRunner: 'Vitest',
    targetDir: process.cwd(),
    yes: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--yes' || arg === '-y') {
      options.yes = true;
    } else if (arg === '--name' && args[i + 1]) {
      options.name = args[++i];
    } else if (arg === '--description' && args[i + 1]) {
      options.description = args[++i];
    } else if (arg === '--stack' && args[i + 1]) {
      options.stack = args[++i];
    } else if (arg === '--test' && args[i + 1]) {
      options.testRunner = args[++i];
    } else if (arg === '--target' && args[i + 1]) {
      options.targetDir = path.resolve(args[++i]);
    }
  }

  return options;
}

function printBanner() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════╗
║                   🔮 Antigravity Project Bootstrap                   ║
║         Lightweight, Production-Grade Agent Setup for Any Repo        ║
╚═══════════════════════════════════════════════════════════════════════╝
`);
}

function printHelp() {
  console.log(`
Usage:
  npx agy-init [options]
  node bin/index.js [options]

Options:
  -y, --yes          Accept all defaults without interactive prompts
  --name <name>      Project name (default: current directory name)
  --description <d>  One-line project description
  --stack <stack>    Primary tech stack (e.g. "TypeScript", "Python / FastAPI", "Go")
  --test <runner>    Test runner (e.g. "Vitest", "Jest", "pytest", "go test")
  --target <dir>     Target directory to scaffold into (default: current directory)
  -h, --help         Show this help message
`);
}

async function promptUser(defaults) {
  const rl = readline.createInterface({ input, output });

  try {
    const defaultName = defaults.name || path.basename(defaults.targetDir);
    const name = (await rl.question(`Project Name [${defaultName}]: `)).trim() || defaultName;

    const defaultDesc = defaults.description || 'Production software system built with agentic pairing';
    const description = (await rl.question(`Description [${defaultDesc}]: `)).trim() || defaultDesc;

    console.log('\nCommon Tech Stacks:');
    console.log('  1) TypeScript / Node.js (Strict)');
    console.log('  2) Full-Stack Next.js / React');
    console.log('  3) Python / FastAPI');
    console.log('  4) Go (Golang)');
    console.log('  5) VS Code / IDE Extension');
    const stackChoice = (await rl.question(`Select stack or type custom [1]: `)).trim();
    let stack = defaults.stack;
    if (stackChoice === '1' || stackChoice === '') stack = 'TypeScript / Node.js (Strict)';
    else if (stackChoice === '2') stack = 'Full-Stack Next.js / React';
    else if (stackChoice === '3') stack = 'Python / FastAPI';
    else if (stackChoice === '4') stack = 'Go (Golang)';
    else if (stackChoice === '5') stack = 'VS Code / IDE Extension';
    else stack = stackChoice;

    const defaultTest = stack.includes('Python') ? 'pytest' : stack.includes('Go') ? 'go test' : 'Vitest';
    const testRunner = (await rl.question(`Test Runner [${defaultTest}]: `)).trim() || defaultTest;

    return { name, description, stack, testRunner, targetDir: defaults.targetDir };
  } finally {
    rl.close();
  }
}

function generateAgentsMd(config) {
  return `# AGENTS.md — ${config.name} Protocol

Welcome, Agent. You are pair programming on **${config.name}**: ${config.description}.

---

## 1. Core Operating Principles

1. **Safety First**: Never execute irreversible or destructive operations without an explicit checkpoint or user approval.
2. **Lean Context & Cost Optimization**:
   - Keep interactions efficient and avoid token bloat.
   - Use progressive disclosure: reference modular docs in \`docs/\` and specialized skills in \`.agents/skills/\`.
   - Maintain living status in \`docs/ROADMAP.md\` rather than restating plans in chat.
3. **Strict Verification**:
   - Every sprint feature must have automated tests using \`${config.testRunner}\`.
   - Always run linting, typing, and test suites before declaring tasks complete.

---

## 2. Technology Stack & Standards

- **Core Stack**: ${config.stack}
- **Testing Standard**: ${config.testRunner} (Automated unit & regression tests)
- **Architecture**: Decoupled domain engine + clean interfaces

---

## 3. Directory Layout

\`\`\`
${config.name}/
├── .agents/                 # Antigravity/agent skills and workflows
│   └── skills/
│       ├── sprint-manager/  # Milestone and sprint tracking
│       └── project-kickoff/ # Standardized alignment on new scopes
├── docs/                    # Living system documentation
│   ├── ARCHITECTURE.md      # Technical architecture & design decisions
│   └── ROADMAP.md           # Sprint backlog & acceptance checklists
└── src/                     # Core application source code
\`\`\`

---

## 4. Sprint Delivery Workflow

For every milestone/task:
1. Review current task criteria in \`docs/ROADMAP.md\`.
2. Implement incrementally with modular, testable code.
3. Write/run tests with \`${config.testRunner}\`.
4. Update \`docs/ROADMAP.md\` with status \`[x]\` upon verification.
`;
}

function generateSprintManagerSkill() {
  return `---
name: sprint-manager
description: >-
  Use this skill to plan, execute, and track project sprints, milestones, and task checklists. Ensures structured, production-ready delivery without token waste.
---

# Sprint Manager Skill

This skill enforces a lightweight, production-grade development lifecycle across sprints without incurring heavy multi-agent orchestration costs.

## When to Use
- Starting a new feature or phase.
- Breaking requirements into measurable sprints with acceptance criteria.
- Updating milestone progress and verifying delivery gates.

---

## 1. The Sprint Lifecycle

Every feature or milestone must follow this 4-step cadence:

\`\`\`
[1. Align & Spec]  ──►  [2. Break into Tasks]  ──►  [3. Implement & Test]  ──►  [4. Verify Gate]
   (docs/ROADMAP.md)       (docs/ROADMAP.md)           (src/ + test/)             (npm test)
\`\`\`

### Step 1: Align & Spec
Before writing code, verify:
* Are the technical inputs clearly defined?
* Is there an architecture spec in \`docs/ARCHITECTURE.md\`?
* What are the explicit edge cases (failures, rollbacks, errors)?

### Step 2: Task Checklist in ROADMAP.md
Maintain a clear markdown checklist in \`docs/ROADMAP.md\`:
* \`[ ]\` Not started
* \`[/]\` In progress
* \`[x]\` Completed and verified with tests

### Step 3: Incremental Implementation & Testing
* Keep domain logic modular and independently testable.
* Add automated unit tests covering both the happy path and edge cases.

### Step 4: Verification Gate
Never mark a sprint or task as completed until:
1. All automated tests pass.
2. Build/typecheck succeeds without errors.
`;
}

function generateProjectKickoffSkill(config) {
  return `---
name: project-kickoff
description: >-
  Use this skill whenever starting a new project, initializing an empty repository, or beginning a major system rewrite. Ensures structured alignment before code is written.
---

# Project Kickoff & Alignment Skill

This skill defines the standardized, low-cost kickoff protocol for any software project in Antigravity or Claude Code.

---

## The Kickoff Flow

When an agent detects a new or uninitialized project, it must **never start writing code blindly**. Instead, it executes this 3-step sequence:

\`\`\`
[1. Detect Empty/New Project]
              │
              ▼
[2. Present Alignment Questionnaire (Ask Questions)]
    - Target Environment & Form Factor
    - Core Tech Stack & Bundler
    - UI/Styling System
    - Testing & Verification Strategy
              │
              ▼
[3. Scaffold Lean Artifacts]
    - AGENTS.md (Project protocol)
    - docs/ARCHITECTURE.md (System design)
    - docs/ROADMAP.md (Sprint backlog)
\`\`\`
`;
}

function generateArchitectureMd(config) {
  return `# ${config.name} — System Architecture

## 1. Overview
${config.description}

## 2. Technology Stack
- **Primary Stack**: ${config.stack}
- **Testing**: ${config.testRunner}

## 3. High-Level Architecture Diagram
\`\`\`mermaid
graph TD
    Entry["User / Client Interface"] --> AppCore["Application Core"]
    AppCore --> Services["Domain Services"]
    Services --> Data["Persistence / State"]
\`\`\`

## 4. Key Architectural Decisions
- **Modularity**: Domain logic decoupled from interface drivers.
- **Verification**: Testable units isolated from external side-effects.
- **Progressive Delivery**: Features delivered in verified sprint increments.
`;
}

function generateRoadmapMd(config) {
  return `# ${config.name} — Development Roadmap & Sprints

This document is the living source of truth for all milestone progress.

---

## Sprint Overview

| Sprint | Goal | Target Status |
| :--- | :--- | :--- |
| **Sprint 1: Core Foundation & Scaffolding** | Setup environment, basic project structure, baseline unit tests | Ready to Start |
| **Sprint 2: Core Domain Logic** | Implementation of primary features & business logic | Planned |
| **Sprint 3: Interface & Integration** | Connect UI / API layer with core logic | Planned |
| **Sprint 4: Verification & Polish** | End-to-end testing, packaging, and documentation | Planned |

---

## Detailed Sprint Backlog

### Sprint 1: Core Foundation & Scaffolding
- [ ] **1.1 Setup**: Project configuration and dependencies.
- [ ] **1.2 Core Domain Skeleton**: Initial modules and typings.
- [ ] **1.3 Test Suite**: Baseline tests running with \`${config.testRunner}\`.
`;
}

async function main() {
  printBanner();
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  let config;
  if (options.yes) {
    config = {
      name: options.name || path.basename(options.targetDir),
      description: options.description || 'Production software system built with agentic pairing',
      stack: options.stack,
      testRunner: options.testRunner,
      targetDir: options.targetDir
    };
  } else {
    config = await promptUser(options);
  }

  console.log(`\n📦 Scaffolding Antigravity setup for "${config.name}" in:`);
  console.log(`   ${config.targetDir}\n`);

  const files = [
    {
      filePath: path.join(config.targetDir, 'AGENTS.md'),
      content: generateAgentsMd(config)
    },
    {
      filePath: path.join(config.targetDir, '.agents', 'skills', 'sprint-manager', 'SKILL.md'),
      content: generateSprintManagerSkill()
    },
    {
      filePath: path.join(config.targetDir, '.agents', 'skills', 'project-kickoff', 'SKILL.md'),
      content: generateProjectKickoffSkill(config)
    },
    {
      filePath: path.join(config.targetDir, 'docs', 'ARCHITECTURE.md'),
      content: generateArchitectureMd(config)
    },
    {
      filePath: path.join(config.targetDir, 'docs', 'ROADMAP.md'),
      content: generateRoadmapMd(config)
    }
  ];

  for (const file of files) {
    const dir = path.dirname(file.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(file.filePath, file.content, 'utf-8');
    const rel = path.relative(config.targetDir, file.filePath);
    console.log(`  ✓ Created ${rel}`);
  }

  console.log('\n✨ Antigravity configuration successfully initialized!');
  console.log('You can now open Antigravity or Claude Code. Your agent will automatically adhere to AGENTS.md and track milestones in docs/ROADMAP.md.\n');
}

main().catch((err) => {
  console.error('\n❌ Error scaffolding project:', err);
  process.exit(1);
});
