#!/usr/bin/env node
/**
 * agentic-workflow 초기화 스크립트
 *
 * Usage: node init-workflow.js "task description"
 *
 * Actions:
 * 1. .claude/agentic-workflow.local.md 상태 파일 생성
 * 2. 초기 상태 설정
 */

const fs = require('fs');
const path = require('path');

const WORKFLOW_FILE = '.claude/agentic-workflow.local.md';

function initWorkflow(taskDescription) {
  // Ensure .claude directory exists
  const claudeDir = path.dirname(WORKFLOW_FILE);
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
  }

  // Check if workflow already active
  if (fs.existsSync(WORKFLOW_FILE)) {
    const content = fs.readFileSync(WORKFLOW_FILE, 'utf8');
    if (content.includes('active: true')) {
      console.error('Workflow already active. Use /aw:cancel to cancel first.');
      process.exit(1);
    }
  }

  const now = new Date().toISOString();

  const initialState = `---
active: true
phase: 1
phase_name: "DISCOVER"
started_at: "${now}"
last_updated: "${now}"

task: "${taskDescription || 'No description'}"

requirements: []

design:
  selected_approach: null
  user_approved: false
  approaches: []

exploration:
  key_files: []
  patterns: []
  agents_completed: 0

implementation:
  completed_acs: []
  total_acs: 0

verification:
  verdict: null
  issues: []
  loop_count: 0
  agents_completed: 0

config:
  max_loops: 3
  auto_retry: true
---

# Agentic Workflow Session

## Task
${taskDescription || 'No description'}

## Progress Log

### Phase 1: DISCOVER
- Started: ${now}
- Status: IN_PROGRESS
`;

  fs.writeFileSync(WORKFLOW_FILE, initialState);

  console.log(`Workflow initialized successfully.`);
  console.log(`State file: ${WORKFLOW_FILE}`);
  console.log(`Task: ${taskDescription || 'No description'}`);
  console.log(`Phase: 1 - DISCOVER`);

  return {
    success: true,
    file: WORKFLOW_FILE,
    phase: 1
  };
}

// Main execution
const args = process.argv.slice(2);
const taskDescription = args.join(' ');

try {
  const result = initWorkflow(taskDescription);
  console.log(JSON.stringify(result));
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
