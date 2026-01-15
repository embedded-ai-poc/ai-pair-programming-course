#!/usr/bin/env node
/**
 * Phase 전환 스크립트
 *
 * Usage: node advance-phase.js [target_phase]
 *
 * Actions:
 * 1. 현재 Phase Gate 검증
 * 2. 통과 시 다음 Phase로 전환
 * 3. 상태 파일 업데이트
 */

const fs = require('fs');
const yaml = require('yaml');

const WORKFLOW_FILE = '.claude/agentic-workflow.local.md';

const PHASES = {
  1: { name: 'DISCOVER', next: 2 },
  2: { name: 'EXPLORE', next: 3 },
  3: { name: 'DESIGN', next: 4 },
  4: { name: 'IMPLEMENT', next: 5 },
  5: { name: 'VERIFY', next: 6 },
  6: { name: 'COMPLETE', next: null }
};

const GATES = {
  1: (state) => {
    const reqs = state.requirements || [];
    if (reqs.length === 0) return { pass: false, reason: 'No requirements defined' };
    for (const req of reqs) {
      if (!req.acs || req.acs.length < 2) {
        return { pass: false, reason: `REQ-${req.id} needs at least 2 ACs` };
      }
    }
    if (!state.design?.user_approved && state.phase === 1) {
      // For phase 1, we need requirements approved, not design
      // This is handled by user confirmation
    }
    return { pass: true };
  },
  2: (state) => {
    const files = state.exploration?.key_files || [];
    if (files.length < 5) {
      return { pass: false, reason: `Need 5+ key files, found ${files.length}` };
    }
    if (state.exploration?.agents_completed < 3) {
      return { pass: false, reason: 'All 3 explorer agents must complete' };
    }
    return { pass: true };
  },
  3: (state) => {
    if (!state.design?.selected_approach) {
      return { pass: false, reason: 'No design approach selected' };
    }
    if (!state.design?.user_approved) {
      return { pass: false, reason: 'Design not approved by user' };
    }
    return { pass: true };
  },
  4: (state) => {
    const completed = state.implementation?.completed_acs || [];
    const total = state.implementation?.total_acs || 0;
    if (total === 0) return { pass: false, reason: 'No ACs to implement' };
    if (completed.length < total) {
      return { pass: false, reason: `${completed.length}/${total} ACs completed` };
    }
    return { pass: true };
  },
  5: (state) => {
    if (state.verification?.verdict !== 'PASS') {
      const issues = state.verification?.issues || [];
      const critical = issues.filter(i => i.severity === 'CRITICAL').length;
      return {
        pass: false,
        reason: `Verdict: ${state.verification?.verdict || 'PENDING'}, Critical: ${critical}`
      };
    }
    return { pass: true };
  },
  6: () => ({ pass: true }) // Complete always passes
};

function parseWorkflowFile() {
  if (!fs.existsSync(WORKFLOW_FILE)) {
    throw new Error('Workflow not active. Use /aw to start.');
  }

  const content = fs.readFileSync(WORKFLOW_FILE, 'utf8');
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!yamlMatch) {
    throw new Error('Invalid workflow file format');
  }

  return yaml.parse(yamlMatch[1]);
}

function updateWorkflowFile(state) {
  const content = fs.readFileSync(WORKFLOW_FILE, 'utf8');
  const yamlStr = yaml.stringify(state);
  const newContent = content.replace(
    /^---\n[\s\S]*?\n---/,
    `---\n${yamlStr}---`
  );
  fs.writeFileSync(WORKFLOW_FILE, newContent);
}

function advancePhase(targetPhase) {
  const state = parseWorkflowFile();

  if (!state.active) {
    throw new Error('Workflow not active');
  }

  const currentPhase = state.phase;
  const nextPhase = targetPhase || PHASES[currentPhase]?.next;

  if (!nextPhase) {
    console.log('Workflow already complete');
    return { success: true, phase: currentPhase, complete: true };
  }

  // Check gate for current phase
  const gateCheck = GATES[currentPhase](state);

  if (!gateCheck.pass) {
    console.error(`Gate ${currentPhase} failed: ${gateCheck.reason}`);
    return {
      success: false,
      phase: currentPhase,
      gate_failed: true,
      reason: gateCheck.reason
    };
  }

  // Advance to next phase
  state.phase = nextPhase;
  state.phase_name = PHASES[nextPhase].name;
  state.last_updated = new Date().toISOString();

  updateWorkflowFile(state);

  console.log(`Advanced to Phase ${nextPhase}: ${PHASES[nextPhase].name}`);

  return {
    success: true,
    previous_phase: currentPhase,
    phase: nextPhase,
    phase_name: PHASES[nextPhase].name
  };
}

// Main
const args = process.argv.slice(2);
const targetPhase = args[0] ? parseInt(args[0]) : null;

try {
  const result = advancePhase(targetPhase);
  console.log(JSON.stringify(result));
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
