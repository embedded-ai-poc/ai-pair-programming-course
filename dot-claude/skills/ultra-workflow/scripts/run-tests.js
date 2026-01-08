#!/usr/bin/env node
/**
 * Run Tests for Ultra-Workflow
 * Auto-detects test framework and runs tests
 * Windows compatible (Node.js)
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

// Detect package manager and test command
function detectTestCommand() {
  // Node.js projects
  if (fs.existsSync(path.join(cwd, 'package.json'))) {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    const scripts = pkg.scripts || {};

    // Determine package manager
    let pm = 'npm';
    if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) pm = 'pnpm';
    else if (fs.existsSync(path.join(cwd, 'yarn.lock'))) pm = 'yarn';

    if (scripts.test) {
      return `${pm} test`;
    }
    if (scripts['test:unit']) {
      return `${pm} run test:unit`;
    }
    if (scripts['test:coverage']) {
      return `${pm} run test:coverage`;
    }
  }

  // Python
  if (fs.existsSync(path.join(cwd, 'pytest.ini')) ||
      fs.existsSync(path.join(cwd, 'pyproject.toml')) ||
      fs.existsSync(path.join(cwd, 'setup.py'))) {
    return 'pytest';
  }

  // Rust
  if (fs.existsSync(path.join(cwd, 'Cargo.toml'))) {
    return 'cargo test';
  }

  // Go
  if (fs.existsSync(path.join(cwd, 'go.mod'))) {
    return 'go test ./...';
  }

  // .NET
  if (fs.readdirSync(cwd).some(f => f.endsWith('.csproj') || f.endsWith('.sln'))) {
    return 'dotnet test';
  }

  // Makefile
  if (fs.existsSync(path.join(cwd, 'Makefile'))) {
    const makefile = fs.readFileSync(path.join(cwd, 'Makefile'), 'utf8');
    if (makefile.includes('test:')) {
      return 'make test';
    }
  }

  return null;
}

// Run tests
function runTests() {
  const testCmd = detectTestCommand();

  if (!testCmd) {
    console.log('[ultra-workflow] No test framework detected');
    console.log('Supported: npm/yarn/pnpm, pytest, cargo, go, dotnet, make');
    process.exit(1);
  }

  console.log(`[ultra-workflow] Running: ${testCmd}`);
  console.log('---');

  try {
    // Use shell: true for Windows compatibility
    const result = spawnSync(testCmd, [], {
      cwd: cwd,
      shell: true,
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' }
    });

    if (result.status === 0) {
      console.log('---');
      console.log('[ultra-workflow] Tests PASSED');
      process.exit(0);
    } else {
      console.log('---');
      console.log('[ultra-workflow] Tests FAILED');
      process.exit(result.status || 1);
    }
  } catch (error) {
    console.error('[ultra-workflow] Error running tests:', error.message);
    process.exit(1);
  }
}

runTests();
