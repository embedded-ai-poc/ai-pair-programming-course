#!/usr/bin/env node
/**
 * Initialize Ultra-Workflow
 * Creates state file, detects project type, and registers hooks
 * Windows compatible (Node.js)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const taskDescription = args.join(' ') || 'No task description provided';
const cwd = process.cwd();

// Detect frontend keywords
const frontendKeywords = ['UI', 'component', 'button', 'form', 'modal', 'page', 'layout', 'style', 'CSS', 'vue', 'react', 'frontend'];
const frontendDetected = frontendKeywords.some(kw =>
  taskDescription.toLowerCase().includes(kw.toLowerCase())
);

// Create .claude directory if not exists
const claudeDir = path.join(cwd, '.claude');
if (!fs.existsSync(claudeDir)) {
  fs.mkdirSync(claudeDir, { recursive: true });
}

// Check if workflow already active
const stateFile = path.join(claudeDir, 'ultra-workflow.local.md');
if (fs.existsSync(stateFile)) {
  const content = fs.readFileSync(stateFile, 'utf8');
  if (content.includes('active: true')) {
    console.log('[ultra-workflow] WARNING: Workflow already active!');
    console.log('Use /cancel-uw to cancel the current workflow first.');

    const phaseMatch = content.match(/phase:\s*(\d+)/);
    const phaseNameMatch = content.match(/phase_name:\s*"([^"]+)"/);
    if (phaseMatch) {
      console.log('Current phase: ' + phaseMatch[1] + ' (' + (phaseNameMatch ? phaseNameMatch[1] : 'unknown') + ')');
    }
    process.exit(1);
  }
}

// State file content
const now = new Date().toISOString();
const stateContent = '---\n' +
'active: true\n' +
'phase: 1\n' +
'phase_name: "INIT"\n' +
'iteration: 1\n' +
'max_iterations: 50\n' +
'loop_count: 0\n' +
'max_loops: 3\n' +
'gates_passed: []\n' +
'started_at: "' + now + '"\n' +
'last_updated: "' + now + '"\n' +
'\n' +
'# Requirements\n' +
'requirements: []\n' +
'current_ac: null\n' +
'\n' +
'# TDD State\n' +
'test_written: false\n' +
'tdd_phase: null\n' +
'\n' +
'# Coverage\n' +
'last_coverage: 0\n' +
'target_coverage: 90\n' +
'\n' +
'# MCP Integration\n' +
'mcp_context7_enabled: true\n' +
'mcp_sequential_enabled: true\n' +
'\n' +
'# Frontend\n' +
'frontend_detected: ' + frontendDetected + '\n' +
'frontend_components: []\n' +
'\n' +
'# Loop History\n' +
'loop_history: []\n' +
'\n' +
'# Results\n' +
'explore_findings: []\n' +
'design_options: []\n' +
'review_issues: []\n' +
'test_results: {}\n' +
'---\n' +
'\n' +
'# Task Description\n' +
'\n' +
taskDescription + '\n' +
'\n' +
'# Phase Log\n' +
'\n' +
'## Phase 1: INIT\n' +
'- Started: ' + now + '\n' +
'- Frontend detected: ' + frontendDetected + '\n' +
'- Hooks registered: true\n';

// Write state file
fs.writeFileSync(stateFile, stateContent);

// Register hooks
const hookManagerPath = path.join(__dirname, 'hook-manager.js');
try {
  execSync('node "' + hookManagerPath + '" register', {
    cwd: cwd,
    stdio: 'inherit'
  });
} catch (e) {
  console.error('[ultra-workflow] Warning: Failed to register hooks:', e.message);
}

console.log('');
console.log('========================================================');
console.log('              ULTRA-WORKFLOW INITIALIZED                 ');
console.log('========================================================');
console.log('  State file: .claude/ultra-workflow.local.md');
console.log('  Frontend detected: ' + (frontendDetected ? 'YES' : 'NO'));
console.log('  Hooks: REGISTERED (project-level)');
console.log('--------------------------------------------------------');
console.log('  Commands:');
console.log('    /cancel-uw  - Cancel workflow and remove hooks');
console.log('========================================================');
console.log('');
console.log('Task: ' + taskDescription.substring(0, 60) + (taskDescription.length > 60 ? '...' : ''));
