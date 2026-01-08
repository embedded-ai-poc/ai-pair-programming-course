#!/usr/bin/env node
/**
 * Coverage Check for Power-Workflow
 * Runs coverage and checks against threshold
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const threshold = parseInt(args[0]) || 90;
const cwd = process.cwd();

function detectCoverageCommand() {
  if (fs.existsSync(path.join(cwd, 'package.json'))) {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    const scripts = pkg.scripts || {};

    let pm = 'npm';
    if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) pm = 'pnpm';
    else if (fs.existsSync(path.join(cwd, 'yarn.lock'))) pm = 'yarn';

    if (scripts['test:coverage']) return { cmd: `${pm} run test:coverage`, type: 'node' };
    if (scripts.coverage) return { cmd: `${pm} run coverage`, type: 'node' };
    if (scripts.test) {
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps.vitest) return { cmd: `${pm} exec vitest run --coverage`, type: 'vitest' };
      if (deps.jest) return { cmd: `${pm} exec jest --coverage`, type: 'jest' };
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

function parseCoverage(output, type) {
  let match;
  switch (type) {
    case 'vitest':
    case 'jest':
      match = output.match(/All files[^|]*\|\s*([\d.]+)/);
      if (match) return parseFloat(match[1]);
      break;
    case 'pytest':
      match = output.match(/TOTAL\s+\d+\s+\d+\s+(\d+)%/);
      if (match) return parseFloat(match[1]);
      break;
    case 'go':
      match = output.match(/total:\s+\(statements\)\s+([\d.]+)%/);
      if (match) return parseFloat(match[1]);
      break;
    case 'rust':
      match = output.match(/Coverage:\s+([\d.]+)%/);
      if (match) return parseFloat(match[1]);
      break;
    default:
      match = output.match(/(\d+(?:\.\d+)?)\s*%/);
      if (match) return parseFloat(match[1]);
  }
  return null;
}

function updateState(coverage) {
  const stateFile = path.join(cwd, '.claude', 'power-workflow.local.md');
  if (fs.existsSync(stateFile)) {
    let content = fs.readFileSync(stateFile, 'utf8');
    content = content.replace(/last_coverage:\s*\d+/, `last_coverage: ${Math.floor(coverage)}`);
    content = content.replace(/last_updated:.*/, `last_updated: "${new Date().toISOString()}"`);
    fs.writeFileSync(stateFile, content);
  }
}

function checkCoverage() {
  const config = detectCoverageCommand();

  if (!config) {
    console.log('[power-workflow] No coverage tool detected');
    process.exit(1);
  }

  console.log(`[power-workflow] Running: ${config.cmd}`);
  console.log(`[power-workflow] Threshold: ${threshold}%`);
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
    console.log(`[power-workflow] Coverage: ${coverage.toFixed(1)}%`);
    console.log(`[power-workflow] Threshold: ${threshold}%`);
    console.log(`[power-workflow] Status: ${coverage >= threshold ? 'PASS' : 'FAIL'}`);

    updateState(coverage);

    if (coverage >= threshold) {
      process.exit(0);
    } else {
      console.log(`[power-workflow] Missing: ${(threshold - coverage).toFixed(1)}%`);
      process.exit(1);
    }
  } else {
    console.log('[power-workflow] Could not parse coverage from output');
    process.exit(1);
  }
}

checkCoverage();
