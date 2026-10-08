#!/usr/bin/env node

/**
 * agy-init: Universal Project-Agnostic Antigravity & Claude Code Scaffolding Tool
 * 
 * Solves the "Zero Context" problem by executing an Intent-to-PRD interview,
 * generating foundational specs (docs/PRD.md), tailored AGENTS.md,
 * progressive skills, and sprint roadmap trackers.
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    name: '',
    description: '',
    problem: '',
    persona: '',
    mvpFeatures: '',
    nonGoals: '',
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
    } else if (arg === '--problem' && args[i + 1]) {
      options.problem = args[++i];
    } else if (arg === '--persona' && args[i + 1]) {
      options.persona = args[++i];
    } else if (arg === '--features' && args[i + 1]) {
      options.mvpFeatures = args[++i];
    } else if (arg === '--non-goals' && args[i + 1]) {
      options.nonGoals = args[++i];
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
  --problem <p>      The core problem being solved
  --persona <p>      The target user persona
  --features <f>     Comma-separated list of 2-3 MVP features
  --non-goals <ng>   Comma-separated list of items out of scope for V1
  --stack <stack>    Primary tech stack (e.g. "TypeScript", "Python / FastAPI", "Go")
  --test <runner>    Test runner (e.g. "Vitest", "Jest", "pytest", "go test")
  --target <dir>     Target directory to scaffold into (default: current directory)
  -h, --help         Show this help message
`);
}

function detectExistingDocs(targetDir) {
  const candidates = [
    path.join(targetDir, 'docs', 'PRD.md'),
    path.join(targetDir, 'PRD.md'),
    path.join(targetDir, 'specs', 'PRD.md'),
    path.join(targetDir, 'README.md')
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return c;
    }
  }
  return null;
}

async function promptUser(defaults) {
  const rl = readline.createInterface({ input, output });

  try {
    const existingDoc = detectExistingDocs(defaults.targetDir);
    if (existingDoc) {
      console.log(`💡 Detected existing specification file: ${path.relative(defaults.targetDir, existingDoc)}`);
    }

    const defaultName = defaults.name || path.basename(defaults.targetDir);
    const name = (await rl.question(`\n1. Project Name [${defaultName}]: `)).trim() || defaultName;

    const defaultDesc = defaults.description || 'Production software system built with agentic pairing';
    const description = (await rl.question(`2. One-Line Description [${defaultDesc}]: `)).trim() || defaultDesc;

    console.log('\n--- 🎯 Intent-to-PRD Alignment ---');
    const defaultProblem = defaults.problem || 'Lack of automated, reliable tooling for rapid development';
    const problem = (await rl.question(`3. Core Problem Solved [${defaultProblem}]: `)).trim() || defaultProblem;

    const defaultPersona = defaults.persona || 'Developers using AI-assisted coding workflows';
    const persona = (await rl.question(`4. Target User / Persona [${defaultPersona}]: `)).trim() || defaultPersona;

    const defaultFeatures = defaults.mvpFeatures || 'Core engine, Interactive CLI/UI, Automated tests';
    const mvpFeatures = (await rl.question(`5. Key MVP Features (comma separated) [${defaultFeatures}]: `)).trim() || defaultFeatures;

    const defaultNonGoals = defaults.nonGoals || 'Full cloud platform integration, complex legacy migrations';
    const nonGoals = (await rl.question(`6. Explicit Non-Goals for V1 [${defaultNonGoals}]: `)).trim() || defaultNonGoals;

    console.log('\n--- 🛠️ Tech Stack & Verification ---');
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

    return {
      name,
      description,
      problem,
      persona,
      mvpFeatures,
      nonGoals,
      stack,
      testRunner,
      targetDir: defaults.targetDir
    };
  } finally {
    rl.close();
  }
}

function generatePrdMd(config) {
  const featureList = config.mvpFeatures
    .split(',')
    .map(f => f.trim())
    .filter(Boolean)
    .map((f, i) => `| **F${i + 1}: ${f}** | Core user journey capability | Verified with automated tests |`)
    .join('\n');

  const nonGoalList = config.nonGoals
    .split(',')
    .map(ng => ng.trim())
    .filter(Boolean)
    .map(ng => `* **${ng}**: Out of scope for V1 to prevent scope bloat.`)
    .join('\n');

  return `# ${config.name} — Product Requirements Document (PRD)

## 1. Executive Summary
**${config.name}**: ${config.description}

---

## 2. Problem Statement & User Pain Points
* **Primary Problem**: ${config.problem}
* **Target Audience**: ${config.persona}

---

## 3. MVP Feature Scope
| Feature | Intent | Acceptance Gate |
| :--- | :--- | :--- |
${featureList}

---

## 4. Explicit Non-Goals (Out of Scope for V1)
${nonGoalList}

---

## 5. Technical Constraints & Verification Standard
* **Language & Runtime**: ${config.stack}
* **Test Suite**: Automated tests using \`${config.testRunner}\` required for all features.
* **Safety Rules**: Zero data loss, clean failure rollbacks, no unverified destructive actions.
`;
}

function generateAgentsMd(config) {
  return `# AGENTS.md — ${config.name} Protocol

Welcome, Agent. You are pair programming on **${config.name}**: ${config.description}.

---

## 1. Core Operating Principles

1. **Safety First**: Never execute irreversible or destructive operations without an explicit checkpoint or user approval.
2. **Lean Context & Cost Optimization**:
   - Keep interactions efficient and avoid token bloat.
   - Use progressive disclosure: reference \`docs/PRD.md\`, \`docs/ARCHITECTURE.md\`, and \`.agents/skills/\`.
   - Maintain living status in \`docs/ROADMAP.md\` rather than restating plans in chat.
3. **Strict Verification**:
   - Every sprint feature must have automated tests using \`${config.testRunner}\`.
   - Always run linting, typing, and test suites before declaring tasks complete.

---

## 2. Scope & Boundaries (From PRD)
* **Core Problem**: ${config.problem}
* **Target Users**: ${config.persona}
* **Explicit Non-Goals**: ${config.nonGoals}

---

## 3. Technology Stack & Standards

- **Core Stack**: ${config.stack}
- **Testing Standard**: ${config.testRunner} (Automated unit & regression tests)
- **Architecture**: Decoupled domain engine + clean interfaces

---

## 4. Directory Layout

\`\`\`
${config.name}/
├── .agents/                 # Antigravity/agent skills and workflows
│   └── skills/
│       ├── sprint-manager/  # Milestone and sprint tracking
│       └── project-kickoff/ # Standardized alignment on new scopes
├── docs/                    # Living system documentation
│   ├── PRD.md               # Product requirements & acceptance criteria
│   ├── ARCHITECTURE.md      # Technical architecture & design decisions
│   └── ROADMAP.md           # Sprint backlog & acceptance checklists
└── src/                     # Core application source code
\`\`\`

---

## 5. Sprint Delivery Workflow

For every milestone/task:
1. Review current task criteria in \`docs/ROADMAP.md\` and specs in \`docs/PRD.md\`.
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
[1. Spec in PRD]  ──►  [2. Break into Tasks]  ──►  [3. Implement & Test]  ──►  [4. Verify Gate]
  (docs/PRD.md)           (docs/ROADMAP.md)           (src/ + test/)             (npm test)
\`\`\`

### Step 1: Spec in PRD
Before writing code, verify:
* Is the feature defined in \`docs/PRD.md\`?
* Are the acceptance criteria and non-goals respected?

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

function generateProjectKickoffSkill() {
  return `---
name: project-kickoff
description: >-
  Use this skill whenever starting a new project, initializing an empty repository, or beginning a major system rewrite. Ensures structured alignment before code is written.
---

# Project Kickoff & Alignment Skill

This skill defines the standardized, low-cost kickoff protocol for any software project in Antigravity or Claude Code.

---

## The Zero-Context Rule

If an agent joins a new project or an empty directory:
**DO NOT START WRITING APPLICATION CODE BLINDLY.**

If \`docs/PRD.md\` does not exist:
1. Execute an Intent-to-PRD interview with the user.
2. Generate \`docs/PRD.md\` first to establish scope, MVP features, and non-goals.
3. Derive \`docs/ARCHITECTURE.md\` and \`docs/ROADMAP.md\` from the PRD.
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
  const featureTasks = config.mvpFeatures
    .split(',')
    .map(f => f.trim())
    .filter(Boolean)
    .map((f, i) => `- [ ] **2.${i + 1} MVP: ${f}**: Implement core logic and automated tests.`)
    .join('\n');

  return `# ${config.name} — Development Roadmap & Sprints

This document is the living source of truth for all milestone progress, derived from \`docs/PRD.md\`.

---

## Sprint Overview

| Sprint | Goal | Target Status |
| :--- | :--- | :--- |
| **Sprint 1: Core Foundation & Scaffolding** | Setup environment, basic project structure, baseline unit tests | Ready to Start |
| **Sprint 2: Core MVP Features** | Implementation of primary user journeys from PRD | Planned |
| **Sprint 3: Interface & Integration** | Connect UI / API layer with core logic | Planned |
| **Sprint 4: Verification & Polish** | End-to-end testing, packaging, and documentation | Planned |

---

## Detailed Sprint Backlog

### Sprint 1: Core Foundation & Scaffolding
- [ ] **1.1 Setup**: Project configuration and dependencies.
- [ ] **1.2 Core Domain Skeleton**: Initial modules and typings.
- [ ] **1.3 Test Suite**: Baseline tests running with \`${config.testRunner}\`.

### Sprint 2: Core MVP Features (From PRD)
${featureTasks}
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
      problem: options.problem || 'Lack of automated reliable tooling for rapid development',
      persona: options.persona || 'Developers using AI-assisted coding workflows',
      mvpFeatures: options.mvpFeatures || 'Core engine, Interactive CLI/UI, Automated tests',
      nonGoals: options.nonGoals || 'Full cloud platform integration, complex legacy migrations',
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
      filePath: path.join(config.targetDir, 'docs', 'PRD.md'),
      content: generatePrdMd(config)
    },
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
      content: generateProjectKickoffSkill()
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

  console.log('\n✨ Antigravity configuration successfully initialized with PRD foundation!');
  console.log('You can now open Antigravity or Claude Code. Your agent will automatically adhere to AGENTS.md, docs/PRD.md, and docs/ROADMAP.md.\n');
}

main().catch((err) => {
  console.error('\n❌ Error scaffolding project:', err);
  process.exit(1);
});
