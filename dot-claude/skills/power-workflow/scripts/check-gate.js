#!/usr/bin/env node
/**
 * Check Gate Conditions for Power-Workflow
 * Validates if current phase gate conditions are met
 *
 * Usage: node check-gate.js [phase]
 * Returns: exit 0 if passed, exit 1 if failed
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const targetPhase = parseInt(args[0]) || null;
const cwd = process.cwd();
const claudeDir = path.join(cwd, '.claude');
const stateFile = path.join(claudeDir, 'power-workflow.local.md');
const logFile = path.join(claudeDir, 'power-workflow-tasks.log');

// Escape special regex characters
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readState() {
  if (!fs.existsSync(stateFile)) {
    return null;
  }
  return fs.readFileSync(stateFile, 'utf8');
}

function parseYamlValue(content, key) {
  const escapedKey = escapeRegex(key);
  const match = content.match(new RegExp(`${escapedKey}:\\s*(.+)`));
  return match ? match[1].trim() : null;
}

function parseYamlArray(content, key) {
  const escapedKey = escapeRegex(key);
  const match = content.match(new RegExp(`${escapedKey}:\\s*\\[([^\\]]*)\\]`));
  if (match) {
    const items = match[1].split(',').map(s => s.trim().replace(/"/g, '')).filter(s => s);
    return items;
  }
  return [];
}

function parseNestedValue(content, parent, child) {
  const escapedParent = escapeRegex(parent);
  const escapedChild = escapeRegex(child);
  const regex = new RegExp(`${escapedParent}:[\\s\\S]*?${escapedChild}:\\s*(\\d+)`);
  const match = content.match(regex);
  return match ? parseInt(match[1]) : 0;
}

// Check parallel execution from log file
// Supports multiple entry types: start, subagent, legacy (phase|timestamp only)
function checkParallelExecution(phase) {
  if (!fs.existsSync(logFile)) {
    return { count: 0, isParallel: false, startCount: 0, completeCount: 0 };
  }

  const logContent = fs.readFileSync(logFile, 'utf8');
  const lines = logContent.trim().split('\n').filter(l => l);

  // Parse entries for this phase
  const startEntries = [];
  const completeEntries = [];

  lines.forEach(line => {
    const parts = line.split('|');
    const p = parseInt(parts[0]);
    if (p !== phase) return;

    const timestamp = parseInt(parts[1]);
    const entryType = parts[2] || 'complete'; // legacy format has no type

    if (entryType === 'start') {
      startEntries.push({ timestamp, type: 'start' });
    } else if (entryType === 'subagent' || entryType === 'complete' || !isNaN(parseInt(entryType))) {
      // 'subagent', 'complete', or legacy format (just timestamp)
      completeEntries.push({ timestamp, type: 'complete' });
    }
  });

  // Use the higher count (start or complete) for gate checking
  // This handles both PreToolUse (start) and PostToolUse/SubagentStop (complete)
  const count = Math.max(startEntries.length, completeEntries.length);

  // Check parallel execution from start timestamps (more accurate)
  let isParallel = false;
  const timestampsToCheck = startEntries.length >= 2 ? startEntries : completeEntries;

  if (timestampsToCheck.length >= 2) {
    const timestamps = timestampsToCheck.map(e => e.timestamp);
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    isParallel = (maxTime - minTime) < 5000; // 5 second window
  }

  return {
    count,
    isParallel,
    startCount: startEntries.length,
    completeCount: completeEntries.length
  };
}

function checkGate(phase, state) {
  const result = { passed: false, reason: '', details: {}, warnings: [] };

  switch (phase) {
    case 1: // INIT
      result.passed = state.includes('Hooks registered: true');
      result.reason = result.passed ? 'Hooks registered' : 'Hooks not registered';
      break;

    case 2: // ANALYZE
      const reqs = parseYamlArray(state, 'requirements');
      result.details.requirements = reqs.length;
      result.passed = reqs.length >= 1;
      result.reason = result.passed
        ? `${reqs.length} requirements defined`
        : 'Need at least 1 requirement (REQ-XXX)';
      break;

    case 3: { // REQ-VERIFY
      const { count, isParallel, startCount, completeCount } = checkParallelExecution(3);
      result.details.tasks_started = startCount;
      result.details.tasks_completed = completeCount;
      result.details.parallel_execution = isParallel;
      result.passed = count >= 4;  // verify-work: 4 agents
      if (!isParallel && count >= 3) {
        result.warnings.push('Tasks were executed sequentially, not in parallel');
      }
      result.reason = result.passed
        ? `${count} verification agents (started: ${startCount}, completed: ${completeCount})${isParallel ? ' (parallel)' : ''}`
        : `Need 3 parallel verification agents (started: ${startCount}, completed: ${completeCount})`;
      break;
    }

    case 4: { // EXPLORE
      const { count, isParallel } = checkParallelExecution(4);
      result.details.agents_completed = count;
      result.details.parallel_execution = isParallel;
      result.passed = count >= 4;  // verify-work: 4 agents
      if (!isParallel && count >= 3) {
        result.warnings.push('Tasks were executed sequentially, not in parallel');
      }
      result.reason = result.passed
        ? `${count} explorer agents completed${isParallel ? ' (parallel)' : ''}`
        : `Need 3 parallel explorer agents (completed: ${count})`;
      break;
    }

    case 5: { // DESIGN
      const { count, isParallel } = checkParallelExecution(5);
      const designApproach = parseYamlValue(state, 'design_approach');
      result.details.agents_completed = count;
      result.details.parallel_execution = isParallel;
      result.details.approach_selected = designApproach !== 'null' && designApproach !== null;
      result.passed = count >= 4;  // verify-work: 4 agents
      if (!isParallel && count >= 3) {
        result.warnings.push('Tasks were executed sequentially, not in parallel');
      }
      result.reason = result.passed
        ? `${count} architect agents completed${isParallel ? ' (parallel)' : ''}`
        : `Need 3 parallel architect agents (completed: ${count})`;
      break;
    }

    case 6: { // DESIGN-VERIFY
      const { count, isParallel } = checkParallelExecution(6);
      result.details.agents_completed = count;
      result.details.parallel_execution = isParallel;
      result.passed = count >= 4;  // verify-work: 4 agents
      if (!isParallel && count >= 3) {
        result.warnings.push('Tasks were executed sequentially, not in parallel');
      }
      result.reason = result.passed
        ? `${count} design verification agents completed${isParallel ? ' (parallel)' : ''}`
        : `Need 3 parallel design verification agents (completed: ${count})`;
      break;
    }

    case 7: // IMPLEMENT
      // Implementation gate requires explicit flag - no loose string matching
      result.passed = state.includes('implementation_complete: true');
      result.reason = result.passed
        ? 'Implementation declared complete'
        : 'Set "implementation_complete: true" in state file when done';
      break;

    case 8: { // CODE-VERIFY
      const { count, isParallel } = checkParallelExecution(8);
      result.details.agents_completed = count;
      result.details.parallel_execution = isParallel;
      result.passed = count >= 4;  // verify-work: 4 agents
      if (!isParallel && count >= 3) {
        result.warnings.push('Tasks were executed sequentially, not in parallel');
      }
      result.reason = result.passed
        ? `${count} code verification agents completed${isParallel ? ' (parallel)' : ''}`
        : `Need 4 parallel verify-work agents (completed: ${count})`;
      break;
    }

    case 9: // TEST
      const coverage = parseInt(parseYamlValue(state, 'last_coverage') || '0');
      const targetCoverage = parseInt(parseYamlValue(state, 'target_coverage') || '90');
      result.details.coverage = coverage;
      result.details.target = targetCoverage;
      result.passed = coverage >= targetCoverage;
      result.reason = result.passed
        ? `Coverage ${coverage}% >= ${targetCoverage}%`
        : `Coverage ${coverage}% < ${targetCoverage}% (need ${targetCoverage - coverage}% more)`;
      break;

    case 10: // COMPLETE
      result.passed = true;
      result.reason = 'Workflow complete';
      break;

    default:
      result.reason = `Unknown phase: ${phase}`;
  }

  return result;
}

// Main
const state = readState();
if (!state) {
  console.error('[power-workflow] No state file found at:', stateFile);
  console.error('  Run "node init-workflow.js" first to initialize the workflow');
  process.exit(1);
}

const currentPhase = parseInt(parseYamlValue(state, 'phase') || '1');
const phaseToCheck = targetPhase || currentPhase;

const gateResult = checkGate(phaseToCheck, state);

console.log(`[power-workflow] Gate Check: Phase ${phaseToCheck}`);
console.log(`  Status: ${gateResult.passed ? 'PASSED' : 'FAILED'}`);
console.log(`  Reason: ${gateResult.reason}`);

if (Object.keys(gateResult.details).length > 0) {
  console.log('  Details:');
  for (const [key, value] of Object.entries(gateResult.details)) {
    console.log(`    - ${key}: ${value}`);
  }
}

if (gateResult.warnings.length > 0) {
  console.log('  Warnings:');
  for (const warning of gateResult.warnings) {
    console.log(`    ! ${warning}`);
  }
}

process.exit(gateResult.passed ? 0 : 1);
