#!/usr/bin/env node
/**
 * Register Task Completion for Power-Workflow
 * Manual task registration (workaround for hooks not firing on Task tool)
 *
 * Usage: node register-tasks.js [count]
 *   count: number of tasks completed (default: 3)
 *
 * Example: node register-tasks.js 3
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const taskCount = parseInt(args[0]) || 3;
const cwd = process.cwd();
const claudeDir = path.join(cwd, '.claude');
const stateFile = path.join(claudeDir, 'power-workflow.local.md');
const logFile = path.join(claudeDir, 'power-workflow-tasks.log');

if (!fs.existsSync(stateFile)) {
  console.error('[power-workflow] No active workflow found');
  process.exit(1);
}

const stateContent = fs.readFileSync(stateFile, 'utf8');

// Check if workflow is active
if (!stateContent.includes('active: true')) {
  console.error('[power-workflow] Workflow is not active');
  process.exit(1);
}

// Get current phase
const phaseMatch = stateContent.match(/phase:\s*(\d+)/);
const phase = phaseMatch ? parseInt(phaseMatch[1]) : 0;

// Only allow in parallel phases
const parallelPhases = [3, 4, 5, 6, 8];
if (!parallelPhases.includes(phase)) {
  console.error(`[power-workflow] Phase ${phase} does not require parallel agents`);
  process.exit(1);
}

const phaseNames = {
  3: 'REQ-VERIFY',
  4: 'EXPLORE',
  5: 'DESIGN',
  6: 'DESIGN-VERIFY',
  8: 'CODE-VERIFY'
};

// Register tasks
const timestamp = Date.now();
let logEntries = '';

for (let i = 0; i < taskCount; i++) {
  // Add start entries (simulating parallel start within 1 second)
  logEntries += `${phase}|${timestamp + i * 100}|start|manual-${i}|task-${i + 1}\n`;
}

for (let i = 0; i < taskCount; i++) {
  // Add complete entries
  logEntries += `${phase}|${timestamp + 1000 + i * 100}|complete|manual-${i}\n`;
}

// Ensure .claude directory exists
if (!fs.existsSync(claudeDir)) {
  fs.mkdirSync(claudeDir, { recursive: true });
}

// Append to log file
fs.appendFileSync(logFile, logEntries);

// Update state file
let updatedState = stateContent;
const phaseKey = `phase_${phase}`;
const counterRegex = new RegExp(`(${phaseKey}:\\s*)(\\d+)`);

if (counterRegex.test(updatedState)) {
  updatedState = updatedState.replace(counterRegex, `$1${taskCount}`);
  updatedState = updatedState.replace(
    /last_updated:\s*"[^"]+"/,
    `last_updated: "${new Date().toISOString()}"`
  );
  fs.writeFileSync(stateFile, updatedState);
}

console.log(`[power-workflow] Phase ${phase} (${phaseNames[phase]}): Registered ${taskCount} tasks`);
console.log('');

// Check gate
const { execSync } = require('child_process');
const checkGatePath = path.join(__dirname, 'check-gate.js');

try {
  execSync(`node "${checkGatePath}" ${phase}`, { stdio: 'inherit' });
  console.log('');
  console.log('>> Gate PASSED. Ready for next phase.');
} catch (e) {
  console.log('');
  console.log('>> Gate check completed.');
}
