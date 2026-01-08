#!/usr/bin/env node
/**
 * Advance Phase for Power-Workflow
 * Validates gate and advances to next phase
 *
 * Usage: node advance-phase.js [--force]
 * Returns: exit 0 if advanced, exit 1 if blocked
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const forceAdvance = args.includes('--force');
const cwd = process.cwd();
const stateFile = path.join(cwd, '.claude', 'power-workflow.local.md');

const PHASE_NAMES = {
  1: 'INIT',
  2: 'ANALYZE',
  3: 'REQ-VERIFY',
  4: 'EXPLORE',
  5: 'DESIGN',
  6: 'DESIGN-VERIFY',
  7: 'IMPLEMENT',
  8: 'CODE-VERIFY',
  9: 'TEST',
  10: 'COMPLETE'
};

function readState() {
  if (!fs.existsSync(stateFile)) {
    return null;
  }
  return fs.readFileSync(stateFile, 'utf8');
}

function writeState(content) {
  fs.writeFileSync(stateFile, content);
}

function parseYamlValue(content, key) {
  const match = content.match(new RegExp(`${key}:\\s*(.+)`));
  return match ? match[1].trim() : null;
}

function updatePhase(content, newPhase) {
  const now = new Date().toISOString();
  let updated = content;

  // Update phase number
  updated = updated.replace(/phase:\s*\d+/, `phase: ${newPhase}`);

  // Update phase name
  updated = updated.replace(/phase_name:\s*"[^"]+"/, `phase_name: "${PHASE_NAMES[newPhase]}"`);

  // Update timestamp
  updated = updated.replace(/last_updated:\s*"[^"]+"/, `last_updated: "${now}"`);

  // Add phase log entry
  const logEntry = `\n## Phase ${newPhase}: ${PHASE_NAMES[newPhase]}\n- Started: ${now}\n`;

  // Find the Phase Log section and append
  if (updated.includes('# Phase Log')) {
    updated = updated + logEntry;
  }

  return updated;
}

function checkGate(phase) {
  const checkGatePath = path.join(__dirname, 'check-gate.js');
  try {
    execSync(`node "${checkGatePath}" ${phase}`, {
      cwd: cwd,
      stdio: 'pipe'
    });
    return { passed: true };
  } catch (e) {
    return { passed: false, output: e.stdout ? e.stdout.toString() : e.message };
  }
}

// Main
const state = readState();
if (!state) {
  console.error('[power-workflow] No state file found');
  process.exit(1);
}

const currentPhase = parseInt(parseYamlValue(state, 'phase') || '1');

if (currentPhase >= 10) {
  console.log('[power-workflow] Workflow already complete');
  process.exit(0);
}

// Check current phase gate
if (!forceAdvance) {
  const gateResult = checkGate(currentPhase);
  if (!gateResult.passed) {
    console.error(`[power-workflow] Gate ${currentPhase} not passed. Cannot advance.`);
    console.error('Use --force to override (not recommended)');
    if (gateResult.output) {
      console.error(gateResult.output);
    }
    process.exit(1);
  }
}

const nextPhase = currentPhase + 1;
const updatedState = updatePhase(state, nextPhase);
writeState(updatedState);

console.log('================================================================');
console.log(`[power-workflow] Phase Advanced: ${currentPhase} -> ${nextPhase}`);
console.log(`  From: ${PHASE_NAMES[currentPhase]}`);
console.log(`  To:   ${PHASE_NAMES[nextPhase]}`);
console.log('================================================================');

// Phase-specific instructions
switch (nextPhase) {
  case 2:
    console.log('\n>> Phase 2: ANALYZE');
    console.log('   Define requirements using REQ-XXX format');
    console.log('   Each REQ needs 2+ acceptance criteria (AC-XXX-X)');
    break;
  case 3:
    console.log('\n>> Phase 3: REQ-VERIFY (MANDATORY)');
    console.log('   Launch 3 verification agents IN PARALLEL');
    console.log('   - Verifier 1: Completeness check');
    console.log('   - Verifier 2: Clarity check');
    console.log('   - Verifier 3: Feasibility check');
    break;
  case 4:
    console.log('\n>> Phase 4: EXPLORE');
    console.log('   Launch 3 explorer agents IN PARALLEL');
    console.log('   Identify 5+ key files in the codebase');
    break;
  case 5:
    console.log('\n>> Phase 5: DESIGN');
    console.log('   Launch 3 architect agents IN PARALLEL');
    console.log('   - Minimal, Clean, Pragmatic approaches');
    break;
  case 6:
    console.log('\n>> Phase 6: DESIGN-VERIFY (MANDATORY)');
    console.log('   Launch 3 verification agents IN PARALLEL');
    console.log('   - Validity, Compatibility, Maintainability checks');
    break;
  case 7:
    console.log('\n>> Phase 7: IMPLEMENT');
    console.log('   Write code freely (no restrictions)');
    console.log('   Declare completion when done');
    break;
  case 8:
    console.log('\n>> Phase 8: CODE-VERIFY (MANDATORY)');
    console.log('   Launch 3 verification agents IN PARALLEL');
    console.log('   - Quality, Requirements, Security checks');
    console.log('   Use /vw or feature-dev:code-reviewer');
    break;
  case 9:
    console.log('\n>> Phase 9: TEST');
    console.log('   Run tests and verify 90%+ coverage');
    break;
  case 10:
    console.log('\n>> Phase 10: COMPLETE');
    console.log('   Generate completion report');
    console.log('   Run: node ~/.claude/skills/power-workflow/scripts/cleanup-workflow.js');
    break;
}

process.exit(0);
