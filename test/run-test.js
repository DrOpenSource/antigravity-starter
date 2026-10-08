import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agy-init-test-'));

try {
  console.log(`Running test in temporary directory: ${tempDir}`);
  const scriptPath = path.resolve('bin/index.js');
  
  execSync(
    `node "${scriptPath}" --yes --name "AuthService" --description "NextGen Auth" --problem "Token theft" --persona "SecOps" --features "OAuth3,Biometrics" --non-goals "Password recovery" --stack "Rust / Axum" --test "cargo test" --target "${tempDir}"`,
    { stdio: 'inherit' }
  );

  const expectedFiles = [
    path.join('docs', 'PRD.md'),
    'AGENTS.md',
    path.join('.agents', 'skills', 'sprint-manager', 'SKILL.md'),
    path.join('.agents', 'skills', 'project-kickoff', 'SKILL.md'),
    path.join('docs', 'ARCHITECTURE.md'),
    path.join('docs', 'ROADMAP.md')
  ];

  for (const rel of expectedFiles) {
    const full = path.join(tempDir, rel);
    if (!fs.existsSync(full)) {
      throw new Error(`Missing expected file: ${rel}`);
    }
    console.log(`Verified existence of ${rel}`);
  }

  const prdContent = fs.readFileSync(path.join(tempDir, 'docs', 'PRD.md'), 'utf-8');
  if (!prdContent.includes('Token theft') || !prdContent.includes('OAuth3')) {
    throw new Error('PRD does not contain expected dynamic parameters');
  }

  const agentsMdContent = fs.readFileSync(path.join(tempDir, 'AGENTS.md'), 'utf-8');
  if (!agentsMdContent.includes('AuthService') || !agentsMdContent.includes('cargo test')) {
    throw new Error('AGENTS.md does not contain expected dynamic stack parameters');
  }

  console.log('\nAll tests passed successfully!');
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
