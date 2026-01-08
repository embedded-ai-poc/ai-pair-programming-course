#!/usr/bin/env node
/**
 * Initialize Power-Workflow
 * Creates state file and registers hooks
 * Windows compatible (Node.js)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const taskDescription = args.join(' ') || 'No task description provided';
const cwd = process.cwd();

// Create .claude directory if not exists
const claudeDir = path.join(cwd, '.claude');
if (!fs.existsSync(claudeDir)) {
  fs.mkdirSync(claudeDir, { recursive: true });
}

// File paths
const stateFile = path.join(claudeDir, 'power-workflow.local.md');
const logFile = path.join(claudeDir, 'power-workflow-tasks.log');

// Check if workflow already active
if (fs.existsSync(stateFile)) {
  const content = fs.readFileSync(stateFile, 'utf8');
  if (content.includes('active: true')) {
    console.log('[power-workflow] WARNING: Workflow already active!');
    console.log('Use /cancel-pw to cancel the current workflow first.');

    const phaseMatch = content.match(/phase:\s*(\d+)/);
    const phaseNameMatch = content.match(/phase_name:\s*"([^"]+)"/);
    if (phaseMatch) {
      console.log(`Current phase: ${phaseMatch[1]} (${phaseNameMatch ? phaseNameMatch[1] : 'unknown'})`);
    }
    process.exit(1);
  }
}

// State file content
const now = new Date().toISOString();
const stateContent = `---
active: true
phase: 1
phase_name: "INIT"
loop_counts:
  req_verify: 0
  design_verify: 0
  code_verify: 0
max_loops: 3
requirements: []
design_approach: null
verification_results:
  req: []
  design: []
  code: []
parallel_agents_required:
  phase_3: 3
  phase_4: 3
  phase_5: 3
  phase_6: 3
  phase_8: 4
parallel_agents_launched:
  phase_3: 0
  phase_4: 0
  phase_5: 0
  phase_6: 0
  phase_8: 0
last_coverage: 0
target_coverage: 90
started_at: "${now}"
last_updated: "${now}"
---

# Task Description

${taskDescription}

# Phase Log

## Phase 1: INIT
- Started: ${now}
- Hooks registered: pending
`;

// Write state file
fs.writeFileSync(stateFile, stateContent);

// Clean up any existing log file from previous workflow
if (fs.existsSync(logFile)) {
  fs.unlinkSync(logFile);
  console.log('[power-workflow] Previous task log cleared');
}

// Register hooks
const hookManagerPath = path.join(__dirname, 'hook-manager.js');
try {
  execSync(`node "${hookManagerPath}" register`, {
    cwd: cwd,
    stdio: 'inherit'
  });
} catch (e) {
  console.error('[power-workflow] Warning: Failed to register hooks:', e.message);
}

// Update state to mark hooks as registered
let updatedContent = fs.readFileSync(stateFile, 'utf8');
updatedContent = updatedContent.replace('- Hooks registered: pending', '- Hooks registered: true');
fs.writeFileSync(stateFile, updatedContent);

console.log('');
console.log('================================================================');
console.log('              POWER-WORKFLOW INITIALIZED                        ');
console.log('================================================================');
console.log('  State file: .claude/power-workflow.local.md');
console.log('  Hooks: REGISTERED');
console.log('----------------------------------------------------------------');
console.log('  Triple-Verify Checkpoints:');
console.log('    Phase 3: REQ-VERIFY   (3 parallel agents)');
console.log('    Phase 6: DESIGN-VERIFY (3 parallel agents)');
console.log('    Phase 8: CODE-VERIFY  (4 verify-work agents)');
console.log('----------------------------------------------------------------');
console.log('  Commands:');
console.log('    /cancel-pw  - Cancel workflow and remove hooks');
console.log('================================================================');
console.log('');
console.log(`Task: ${taskDescription.substring(0, 60)}${taskDescription.length > 60 ? '...' : ''}`);
console.log('');
console.log('>> Proceed to Phase 2: ANALYZE');
console.log('   Define REQ-XXX requirements with AC-XXX acceptance criteria');
