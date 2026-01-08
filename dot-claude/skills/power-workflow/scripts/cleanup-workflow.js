#!/usr/bin/env node
/**
 * Cleanup Power-Workflow
 * Removes hooks and optionally deletes state file
 *
 * Usage:
 *   node cleanup-workflow.js           - Cleanup with state file removal
 *   node cleanup-workflow.js --keep    - Cleanup but keep state file
 *   node cleanup-workflow.js --cancel  - Force cancel (mark as inactive)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const keepState = args.includes('--keep');
const forceCancel = args.includes('--cancel');
const cwd = process.cwd();
const claudeDir = path.join(cwd, '.claude');
const stateFile = path.join(claudeDir, 'power-workflow.local.md');
const logFile = path.join(claudeDir, 'power-workflow-tasks.log');

// Check state file
let wasActive = false;
let finalPhase = 0;
let coverage = 0;
let loopCounts = { req: 0, design: 0, code: 0 };

if (fs.existsSync(stateFile)) {
  const content = fs.readFileSync(stateFile, 'utf8');
  wasActive = content.includes('active: true');

  const phaseMatch = content.match(/phase:\s*(\d+)/);
  finalPhase = phaseMatch ? parseInt(phaseMatch[1]) : 0;

  const coverageMatch = content.match(/last_coverage:\s*(\d+)/);
  coverage = coverageMatch ? parseInt(coverageMatch[1]) : 0;

  // Parse loop counts
  const reqLoopMatch = content.match(/req_verify:\s*(\d+)/);
  const designLoopMatch = content.match(/design_verify:\s*(\d+)/);
  const codeLoopMatch = content.match(/code_verify:\s*(\d+)/);
  loopCounts.req = reqLoopMatch ? parseInt(reqLoopMatch[1]) : 0;
  loopCounts.design = designLoopMatch ? parseInt(designLoopMatch[1]) : 0;
  loopCounts.code = codeLoopMatch ? parseInt(codeLoopMatch[1]) : 0;

  if (forceCancel && wasActive) {
    // Mark as inactive instead of deleting
    const updatedContent = content
      .replace('active: true', 'active: false')
      .replace(/last_updated:.*/, `last_updated: "${new Date().toISOString()}"`);
    fs.writeFileSync(stateFile, updatedContent);
    console.log('[power-workflow] Workflow marked as CANCELLED');
  } else if (!keepState) {
    fs.unlinkSync(stateFile);
    console.log('[power-workflow] State file removed');
  }
} else {
  console.log('[power-workflow] No active workflow found');
}

// Clean up log file
if (fs.existsSync(logFile) && !keepState && !forceCancel) {
  try {
    fs.unlinkSync(logFile);
    console.log('[power-workflow] Task log file removed');
  } catch (e) {
    console.error('[power-workflow] Warning: Failed to remove log file:', e.message);
  }
}

// Unregister hooks
const hookManagerPath = path.join(__dirname, 'hook-manager.js');
try {
  execSync(`node "${hookManagerPath}" unregister`, {
    cwd: cwd,
    stdio: 'inherit'
  });
} catch (e) {
  console.error('[power-workflow] Warning: Failed to unregister hooks:', e.message);
}

// Summary
console.log('');
console.log('================================================================');
console.log('              POWER-WORKFLOW CLEANUP COMPLETE                   ');
console.log('================================================================');
console.log(`  Was active: ${wasActive ? 'YES' : 'NO'}`);
console.log(`  Final phase: ${finalPhase}/10`);
console.log(`  Coverage: ${coverage}%`);
console.log(`  Loop counts:`);
console.log(`    - REQ-VERIFY: ${loopCounts.req}`);
console.log(`    - DESIGN-VERIFY: ${loopCounts.design}`);
console.log(`    - CODE-VERIFY: ${loopCounts.code}`);
console.log(`  State file: ${keepState ? 'KEPT' : (forceCancel ? 'MARKED INACTIVE' : 'REMOVED')}`);
console.log(`  Hooks: UNREGISTERED`);
console.log('================================================================');

if (finalPhase < 10 && wasActive && !forceCancel) {
  console.log('');
  console.log('WARNING: Workflow ended before completion (Phase 10)');
  console.log('Consider reviewing why the workflow did not complete.');
}
