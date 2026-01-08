#!/usr/bin/env node

/**
 * resume-workflow.js
 * Resume a paused power-workflow and re-register hooks
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = os.homedir();
const STATE_FILE = path.join(process.cwd(), '.claude', 'power-workflow.local.md');
const SETTINGS_FILE = path.join(process.cwd(), '.claude', 'settings.local.json');
const HOOKS_FILE = path.join(HOME, '.claude', 'skills', 'power-workflow', 'hooks', 'hooks.json');

function parseYamlFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = {};
  match[1].split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (value === 'null') value = null;
      else if (!isNaN(value) && value !== '') value = Number(value);
      else if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);

      yaml[key] = value;
    }
  });
  return yaml;
}

function updateYamlField(content, field, value) {
  const regex = new RegExp(`^(${field}:).*$`, 'm');
  const valueStr = typeof value === 'string' ? `"${value}"` : value;

  if (content.match(regex)) {
    return content.replace(regex, `$1 ${valueStr}`);
  } else {
    return content.replace(/^(active:.*\n)/m, `$1${field}: ${valueStr}\n`);
  }
}

function registerHooks() {
  try {
    // Read hooks definition
    if (!fs.existsSync(HOOKS_FILE)) {
      console.error('[power-workflow] Hooks definition not found:', HOOKS_FILE);
      return false;
    }

    const hooksConfig = JSON.parse(fs.readFileSync(HOOKS_FILE, 'utf-8'));

    // Read or create settings
    let settings = {};
    if (fs.existsSync(SETTINGS_FILE)) {
      settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    }

    // Ensure hooks object exists
    if (!settings.hooks) {
      settings.hooks = {};
    }

    // Merge hooks (preserving existing ones)
    for (const [event, matchers] of Object.entries(hooksConfig.hooks || {})) {
      if (!settings.hooks[event]) {
        settings.hooks[event] = [];
      }

      for (const matcher of matchers) {
        // Check if this matcher already exists
        const existingIndex = settings.hooks[event].findIndex(
          m => m.matcher === matcher.matcher
        );

        if (existingIndex >= 0) {
          // Merge hooks
          const existing = settings.hooks[event][existingIndex];
          for (const hook of matcher.hooks || []) {
            const hookExists = (existing.hooks || []).some(
              h => h.command === hook.command
            );
            if (!hookExists) {
              if (!existing.hooks) existing.hooks = [];
              existing.hooks.push(hook);
            }
          }
        } else {
          settings.hooks[event].push(matcher);
        }
      }
    }

    // Write settings
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    console.log('[power-workflow] Hooks registered to .claude/settings.local.json');
    return true;
  } catch (e) {
    console.error('[power-workflow] Error registering hooks:', e.message);
    return false;
  }
}

function getPhaseInstructions(phase) {
  const instructions = {
    1: 'Run init-workflow.js to initialize',
    2: 'Define REQ-XXX requirements with AC-XXX acceptance criteria',
    3: 'Launch 3 parallel verifier agents for REQ-VERIFY',
    4: 'Launch 3 parallel explorer agents for EXPLORE',
    5: 'Launch 3 parallel architect agents for DESIGN',
    6: 'Launch 3 parallel verifier agents for DESIGN-VERIFY',
    7: 'Implement the code (free implementation)',
    8: 'Launch 4 parallel verifier agents for CODE-VERIFY (use /vw)',
    9: 'Run tests and verify coverage >= 90%',
    10: 'Generate completion report'
  };
  return instructions[phase] || 'Continue with current phase';
}

function main() {
  // Check if state file exists
  if (!fs.existsSync(STATE_FILE)) {
    console.error('[power-workflow] No workflow state found.');
    console.error('Start a new workflow with: /pw [task description]');
    process.exit(1);
  }

  // Read and parse state
  let content = fs.readFileSync(STATE_FILE, 'utf-8');
  const state = parseYamlFrontmatter(content);

  // Check if workflow exists
  if (!state.active && !state.paused) {
    console.error('[power-workflow] No workflow to resume.');
    console.error('Start a new workflow with: /pw [task description]');
    process.exit(1);
  }

  // Check if paused
  if (!state.paused) {
    console.log('[power-workflow] Workflow is not paused (already running).');
    console.log(`Current phase: ${state.phase}/10`);
    process.exit(0);
  }

  // Calculate pause duration
  let pauseDuration = 'unknown';
  if (state.paused_at) {
    const pausedAt = new Date(state.paused_at);
    const now = new Date();
    const diffMs = now - pausedAt;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) {
      pauseDuration = `${diffMins} minutes`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      pauseDuration = `${diffHours} hours ${diffMins % 60} minutes`;
    }
  }

  // Update state to resumed
  content = updateYamlField(content, 'paused', false);
  content = updateYamlField(content, 'resumed_at', new Date().toISOString());
  content = updateYamlField(content, 'last_updated', new Date().toISOString());

  fs.writeFileSync(STATE_FILE, content);
  console.log('[power-workflow] Workflow RESUMED');

  // Register hooks
  registerHooks();

  // Output summary
  console.log('');
  console.log('================================================================');
  console.log('              POWER-WORKFLOW RESUMED                            ');
  console.log('================================================================');
  console.log(`  Paused for: ${pauseDuration}`);
  console.log(`  Current phase: ${state.phase}/10 (${state.phase_name || 'N/A'})`);
  console.log('  State: ACTIVE');
  console.log('  Hooks: REGISTERED');
  console.log('----------------------------------------------------------------');
  console.log('  Loop counts:');
  console.log(`    - REQ-VERIFY: ${state.loop_counts?.req_verify || 0}`);
  console.log(`    - DESIGN-VERIFY: ${state.loop_counts?.design_verify || 0}`);
  console.log(`    - CODE-VERIFY: ${state.loop_counts?.code_verify || 0}`);
  console.log('----------------------------------------------------------------');
  console.log(`  Next step: ${getPhaseInstructions(state.phase)}`);
  console.log('================================================================');
}

main();
