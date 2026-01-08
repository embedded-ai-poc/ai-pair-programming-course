#!/usr/bin/env node
/**
 * Hook Manager for Power-Workflow
 * Registers/unregisters hooks in project-level settings
 *
 * Usage:
 *   node hook-manager.js register   - Add hooks
 *   node hook-manager.js unregister - Remove hooks
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const action = process.argv[2] || 'register';
const cwd = process.cwd();
const claudeDir = path.join(cwd, '.claude');
const settingsFile = path.join(claudeDir, 'settings.local.json');
const hooksDir = path.join(os.homedir(), '.claude', 'skills', 'power-workflow', 'hooks');

// Hook definitions
const HOOKS_CONFIG = {
  Stop: [
    {
      matcher: '',
      hooks: [
        {
          type: 'command',
          command: `node "${path.join(hooksDir, 'workflow-stop-hook.js').replace(/\\/g, '/')}"`
        }
      ]
    }
  ],
  SubagentStop: [
    {
      hooks: [
        {
          type: 'command',
          command: `node "${path.join(hooksDir, 'subagent-stop-hook.js').replace(/\\/g, '/')}"`,
          timeout: 30
        }
      ]
    }
  ],
  PreToolUse: [
    {
      matcher: 'Task',
      hooks: [
        {
          type: 'command',
          command: `node "${path.join(hooksDir, 'task-start-hook.js').replace(/\\/g, '/')}"`,
          timeout: 10
        }
      ]
    }
  ],
  PostToolUse: [
    {
      matcher: 'Task',
      hooks: [
        {
          type: 'command',
          command: `node "${path.join(hooksDir, 'task-counter-hook.js').replace(/\\/g, '/')}"`,
          timeout: 30
        }
      ]
    }
  ]
};

function ensureClaudeDir() {
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
  }
}

function readSettings() {
  if (fs.existsSync(settingsFile)) {
    try {
      return JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

function writeSettings(settings) {
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
}

function mergeHookArrays(existing, newHooks, hookType) {
  if (!existing || !Array.isArray(existing)) {
    return newHooks;
  }

  // Filter out power-workflow hooks from existing (to avoid duplicates)
  const filtered = existing.filter(entry => {
    if (!entry.hooks) return true;
    return !entry.hooks.some(h =>
      h.command && h.command.includes('power-workflow')
    );
  });

  // Append new hooks
  return [...filtered, ...newHooks];
}

function registerHooks() {
  ensureClaudeDir();
  const settings = readSettings();

  // Merge hooks instead of overwriting
  if (!settings.hooks) {
    settings.hooks = {};
  }

  // Merge each hook type preserving existing hooks
  for (const [hookType, hookArray] of Object.entries(HOOKS_CONFIG)) {
    settings.hooks[hookType] = mergeHookArrays(
      settings.hooks[hookType],
      hookArray,
      hookType
    );
  }

  writeSettings(settings);
  console.log('[power-workflow] Hooks registered to .claude/settings.local.json');
  console.log('  - Stop hook: Blocks exit if workflow incomplete');
  console.log('  - PreToolUse hook: Parallel agent verification');
  console.log('  - PostToolUse hook: Task counter for parallel tracking');
  console.log('  (Existing hooks preserved)');
}

function unregisterHooks() {
  if (!fs.existsSync(settingsFile)) {
    console.log('[power-workflow] No settings.local.json found');
    return;
  }

  const settings = readSettings();

  // Remove only power-workflow hooks, preserve others
  if (settings.hooks) {
    for (const hookType of Object.keys(settings.hooks)) {
      if (Array.isArray(settings.hooks[hookType])) {
        settings.hooks[hookType] = settings.hooks[hookType].filter(entry => {
          if (!entry.hooks) return true;
          return !entry.hooks.some(h =>
            h.command && h.command.includes('power-workflow')
          );
        });

        // Remove empty arrays
        if (settings.hooks[hookType].length === 0) {
          delete settings.hooks[hookType];
        }
      }
    }

    // Remove hooks object if empty
    if (Object.keys(settings.hooks).length === 0) {
      delete settings.hooks;
    }
  }

  // If settings is now empty, remove the file
  if (Object.keys(settings).length === 0) {
    fs.unlinkSync(settingsFile);
    console.log('[power-workflow] Removed empty settings.local.json');
  } else {
    writeSettings(settings);
    console.log('[power-workflow] Power-workflow hooks removed (other hooks preserved)');
  }
}

// Main
switch (action) {
  case 'register':
    registerHooks();
    break;
  case 'unregister':
    unregisterHooks();
    break;
  default:
    console.log('Usage: node hook-manager.js [register|unregister]');
    process.exit(1);
}
