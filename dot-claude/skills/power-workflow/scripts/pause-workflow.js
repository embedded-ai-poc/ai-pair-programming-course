#!/usr/bin/env node

/**
 * pause-workflow.js
 * Pause active power-workflow and temporarily disable hooks
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = os.homedir();
const STATE_FILE = path.join(process.cwd(), '.claude', 'power-workflow.local.md');
const SETTINGS_FILE = path.join(process.cwd(), '.claude', 'settings.local.json');

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
    // Add field after 'active:' line
    return content.replace(/^(active:.*\n)/m, `$1${field}: ${valueStr}\n`);
  }
}

function removeHooks() {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      return;
    }

    const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));

    if (settings.hooks) {
      // Remove power-workflow hooks
      ['PreToolUse', 'PostToolUse', 'Stop'].forEach(event => {
        if (settings.hooks[event]) {
          settings.hooks[event] = settings.hooks[event].filter(matcher => {
            if (matcher.hooks) {
              matcher.hooks = matcher.hooks.filter(hook =>
                !hook.command || !hook.command.includes('power-workflow')
              );
              return matcher.hooks.length > 0;
            }
            return true;
          });
          if (settings.hooks[event].length === 0) {
            delete settings.hooks[event];
          }
        }
      });

      if (Object.keys(settings.hooks).length === 0) {
        delete settings.hooks;
      }
    }

    if (Object.keys(settings).length === 0) {
      fs.unlinkSync(SETTINGS_FILE);
      console.log('[power-workflow] Removed empty settings.local.json');
    } else {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      console.log('[power-workflow] Hooks unregistered from settings.local.json');
    }
  } catch (e) {
    console.error('[power-workflow] Error removing hooks:', e.message);
  }
}

function main() {
  // Check if state file exists
  if (!fs.existsSync(STATE_FILE)) {
    console.error('[power-workflow] No active workflow found.');
    console.error('Start a new workflow with: /pw [task description]');
    process.exit(1);
  }

  // Read and parse state
  let content = fs.readFileSync(STATE_FILE, 'utf-8');
  const state = parseYamlFrontmatter(content);

  // Check if workflow is active
  if (!state.active) {
    console.error('[power-workflow] No active workflow to pause.');
    console.error('Start a new workflow with: /pw [task description]');
    process.exit(1);
  }

  // Check if already paused
  if (state.paused) {
    console.log('[power-workflow] Workflow is already paused.');
    console.log('Resume with: /resume-pw');
    process.exit(0);
  }

  // Update state to paused
  content = updateYamlField(content, 'paused', true);
  content = updateYamlField(content, 'paused_at', new Date().toISOString());
  content = updateYamlField(content, 'last_updated', new Date().toISOString());

  fs.writeFileSync(STATE_FILE, content);
  console.log('[power-workflow] Workflow marked as PAUSED');

  // Remove hooks
  removeHooks();

  // Output summary
  console.log('');
  console.log('================================================================');
  console.log('              POWER-WORKFLOW PAUSED                             ');
  console.log('================================================================');
  console.log(`  Current phase: ${state.phase}/10 (${state.phase_name || 'N/A'})`);
  console.log('  State: PAUSED');
  console.log('  Hooks: UNREGISTERED');
  console.log('----------------------------------------------------------------');
  console.log('  Progress preserved. You can now work on other tasks.');
  console.log('');
  console.log('  To resume: /resume-pw');
  console.log('================================================================');
}

main();
