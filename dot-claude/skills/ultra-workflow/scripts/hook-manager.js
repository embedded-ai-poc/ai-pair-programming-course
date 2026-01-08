#!/usr/bin/env node
/**
 * Hook Manager for Ultra-Workflow
 * Registers/unregisters hooks in project-level settings
 *
 * Usage:
 *   node hook-manager.js register   - Add hooks to .claude/settings.local.json
 *   node hook-manager.js unregister - Remove hooks from .claude/settings.local.json
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const action = process.argv[2] || 'register';
const cwd = process.cwd();
const claudeDir = path.join(cwd, '.claude');
const settingsFile = path.join(claudeDir, 'settings.local.json');
const hooksDir = path.join(os.homedir(), '.claude', 'skills', 'ultra-workflow', 'hooks');

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
  PreToolUse: [
    {
      matcher: 'Write|Edit|MultiEdit',
      hooks: [
        {
          type: 'command',
          command: `node "${path.join(hooksDir, 'tdd-pretool-hook.js').replace(/\\/g, '/')}"`,
          timeout: 10
        }
      ]
    }
  ],
  PostToolUse: [
    {
      matcher: 'Write|Edit|MultiEdit',
      hooks: [
        {
          type: 'command',
          command: `node "${path.join(hooksDir, 'post-tool-hook.js').replace(/\\/g, '/')}"`,
          timeout: 5
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

function registerHooks() {
  ensureClaudeDir();
  const settings = readSettings();

  // Add hooks
  settings.hooks = HOOKS_CONFIG;

  writeSettings(settings);
  console.log('[ultra-workflow] Hooks registered to .claude/settings.local.json');
  console.log('  - Stop hook: Blocks exit if workflow incomplete');
  console.log('  - PreToolUse hook: TDD enforcement');
  console.log('  - PostToolUse hook: Test reminders');
}

function unregisterHooks() {
  if (!fs.existsSync(settingsFile)) {
    console.log('[ultra-workflow] No settings.local.json found');
    return;
  }

  const settings = readSettings();

  // Remove hooks
  delete settings.hooks;

  // If settings is now empty, remove the file
  if (Object.keys(settings).length === 0) {
    fs.unlinkSync(settingsFile);
    console.log('[ultra-workflow] Removed empty settings.local.json');
  } else {
    writeSettings(settings);
    console.log('[ultra-workflow] Hooks removed from .claude/settings.local.json');
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
