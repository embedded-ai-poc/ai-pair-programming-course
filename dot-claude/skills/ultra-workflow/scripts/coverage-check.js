#!/usr/bin/env node
/**
 * Coverage Check for Ultra-Workflow
 * Runs coverage and checks against threshold
 * Windows compatible (Node.js)
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const threshold = parseInt(args[0]) || 90;
const cwd = process.cwd();

// Detect coverage command
function detectCoverageCommand() {
  if (fs.existsSync(path.join(cwd, 'package.json'))) {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    const scripts = pkg.scripts || {};

    let pm = 'npm';
    if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) pm = 'pnpm';
    else if (fs.existsSync(path.join(cwd, 'yarn.lock'))) pm = 'yarn';

    if (scripts['test:coverage']) {
      return { cmd: `${pm} run test:coverage`, type: 'node' };
    }
    if (scripts.coverage) {
      return { cmd: `${pm} run coverage`, type: 'node' };
    }
    if (scripts.test) {
      // Try vitest or jest with coverage
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps.vitest) {
        return { cmd: `${pm} exec vitest run --coverage`, type: 'vitest' };
      }
      if (deps.jest) {
        return { cmd: `${pm} exec jest --coverage`, type: 'jest' };
      }
      // Generic npm test with coverage flag
      return { cmd: `${pm} test -- --coverage`, type: 'node' };
    }
  }

  if (fs.existsSync(path.join(cwd, 'pytest.ini')) ||
      fs.existsSync(path.join(cwd, 'pyproject.toml'))) {
    return { cmd: 'pytest --cov --cov-report=term-missing', type: 'pytest' };
  }

  if (fs.existsSync(path.join(cwd, 'Cargo.toml'))) {
    return { cmd: 'cargo tarpaulin', type: 'rust' };
  }

  if (fs.existsSync(path.join(cwd, 'go.mod'))) {
    return { cmd: 'go test -coverprofile=coverage.out ./... && go tool cover -func=coverage.out', type: 'go' };
  }

  return null;
}

// Parse coverage from output
function parseCoverage(output, type) {
  let match;

  switch (type) {
    case 'vitest':
    case 'jest':
      // Look for "All files" line: All files | 85.71 | 75 | 100 | 85.71
      match = output.match(/All files[^|]*\|\s*([\d.]+)/);
      if (match) return parseFloat(match[1]);
      break;

    case 'pytest':
      // TOTAL ... 85%
      match = output.match(/TOTAL\s+\d+\s+\d+\s+(\d+)%/);
      if (match) return parseFloat(match[1]);
      break;

    case 'go':
      // total: (statements) 85.0%
      match = output.match(/total:\s+\(statements\)\s+([\d.]+)%/);
      if (match) return parseFloat(match[1]);
      break;

    case 'rust':
      // Coverage: 85.00%
      match = output.match(/Coverage:\s+([\d.]+)%/);
      if (match) return parseFloat(match[1]);
      break;

    default:
      // Generic percentage pattern
      match = output.match(/(\d+(?:\.\d+)?)\s*%/);
      if (match) return parseFloat(match[1]);
  }

  return null;
}

// Update state file with coverage
function updateState(coverage) {
  const stateFile = path.join(cwd, '.claude', 'ultra-workflow.local.md');
  if (fs.existsSync(stateFile)) {
    let content = fs.readFileSync(stateFile, 'utf8');
    content = content.replace(/last_coverage:\s*\d+/, `last_coverage: ${Math.floor(coverage)}`);
    content = content.replace(/last_updated:.*/, `last_updated: "${new Date().toISOString()}"`);
    fs.writeFileSync(stateFile, content);
  }
}

// Main
function checkCoverage() {
  const config = detectCoverageCommand();

  if (!config) {
    console.log('[ultra-workflow] No coverage tool detected');
    process.exit(1);
  }

  console.log(`[ultra-workflow] Running: ${config.cmd}`);
  console.log(`[ultra-workflow] Threshold: ${threshold}%`);
  console.log('---');

  const result = spawnSync(config.cmd, [], {
    cwd: cwd,
    shell: true,
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  const output = (result.stdout || '') + (result.stderr || '');
  console.log(output);

  const coverage = parseCoverage(output, config.type);

  console.log('---');
  if (coverage !== null) {
    console.log(`[ultra-workflow] Coverage: ${coverage.toFixed(1)}%`);
    console.log(`[ultra-workflow] Threshold: ${threshold}%`);
    console.log(`[ultra-workflow] Status: ${coverage >= threshold ? 'PASS' : 'FAIL'}`);

    updateState(coverage);

    if (coverage >= threshold) {
      process.exit(0);
    } else {
      console.log(`[ultra-workflow] Missing: ${(threshold - coverage).toFixed(1)}%`);
      process.exit(1);
    }
  } else {
    console.log('[ultra-workflow] Could not parse coverage from output');
    process.exit(1);
  }
}

checkCoverage();
