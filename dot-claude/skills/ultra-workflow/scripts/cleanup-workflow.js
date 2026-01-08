#!/usr/bin/env node
/**
 * Cleanup Ultra-Workflow
 * Removes hooks and optionally deletes state file
 * Windows compatible (Node.js)
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
const stateFile = path.join(claudeDir, 'ultra-workflow.local.md');

// Check state file
let wasActive = false;
let finalPhase = 0;
let coverage = 0;

if (fs.existsSync(stateFile)) {
  const content = fs.readFileSync(stateFile, 'utf8');
  wasActive = content.includes('active: true');

  const phaseMatch = content.match(/phase:\s*(\d+)/);
  finalPhase = phaseMatch ? parseInt(phaseMatch[1]) : 0;

  const coverageMatch = content.match(/last_coverage:\s*(\d+)/);
  coverage = coverageMatch ? parseInt(coverageMatch[1]) : 0;

  if (forceCancel && wasActive) {
    // Mark as inactive instead of deleting
    const updatedContent = content
      .replace('active: true', 'active: false')
      .replace(/last_updated:.*/, `last_updated: "${new Date().toISOString()}"`);
    fs.writeFileSync(stateFile, updatedContent);
    console.log('[ultra-workflow] Workflow marked as CANCELLED');
  } else if (!keepState) {
    fs.unlinkSync(stateFile);
    console.log('[ultra-workflow] State file removed');
  }
} else {
  console.log('[ultra-workflow] No active workflow found');
}

// Unregister hooks
const hookManagerPath = path.join(__dirname, 'hook-manager.js');
try {
  execSync(`node "${hookManagerPath}" unregister`, {
    cwd: cwd,
    stdio: 'inherit'
  });
} catch (e) {
  console.error('[ultra-workflow] Warning: Failed to unregister hooks:', e.message);
}

// Summary
console.log('');
console.log('========================================================');
console.log('              ULTRA-WORKFLOW CLEANUP COMPLETE            ');
console.log('========================================================');
console.log(`  Was active: ${wasActive ? 'YES' : 'NO'}`);
console.log(`  Final phase: ${finalPhase}/10`);
console.log(`  Coverage: ${coverage}%`);
console.log(`  State file: ${keepState ? 'KEPT' : (forceCancel ? 'MARKED INACTIVE' : 'REMOVED')}`);
console.log(`  Hooks: UNREGISTERED`);
console.log('========================================================');

if (finalPhase < 10 && wasActive && !forceCancel) {
  console.log('');
  console.log('WARNING: Workflow ended before completion (Phase 10)');
  console.log('Consider reviewing why the workflow did not complete.');
}
