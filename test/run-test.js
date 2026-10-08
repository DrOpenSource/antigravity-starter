import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agy-init-test-'));

try {
  console.log(`Running test in temporary directory: ${tempDir}`);
  const scriptPath = path.resolve('bin/index.js');
  
  execSync(
    `node "${scriptPath}" --yes --name "SampleService" --description "Testing bootstrap" --stack "Go (Golang)" --test "go test" --target "${tempDir}"`,
    { stdio: 'inherit' }
  );

  const expectedFiles = [
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

  const agentsMdContent = fs.readFileSync(path.join(tempDir, 'AGENTS.md'), 'utf-8');
  if (!agentsMdContent.includes('SampleService') || !agentsMdContent.includes('go test')) {
    throw new Error('AGENTS.md does not contain expected dynamic stack parameters');
  }

  console.log('\nAll tests passed successfully!');
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
