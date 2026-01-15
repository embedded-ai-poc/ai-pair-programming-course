#!/usr/bin/env node
/**
 * Gate 상태 확인 스크립트
 *
 * Usage: node check-gate.js [phase]
 *
 * Returns: Gate 통과 여부 및 상세 상태
 */

const fs = require('fs');
const yaml = require('yaml');

const WORKFLOW_FILE = '.claude/agentic-workflow.local.md';

function parseWorkflowFile() {
  if (!fs.existsSync(WORKFLOW_FILE)) {
    return null;
  }

  const content = fs.readFileSync(WORKFLOW_FILE, 'utf8');
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!yamlMatch) return null;

  return yaml.parse(yamlMatch[1]);
}

function checkGate(phase) {
  const state = parseWorkflowFile();

  if (!state) {
    return { active: false, message: 'No workflow active' };
  }

  const targetPhase = phase || state.phase;

  const checks = {
    1: () => ({
      name: 'DISCOVER',
      requirements: {
        'requirements_defined': (state.requirements?.length || 0) >= 1,
        'acs_per_req': state.requirements?.every(r => (r.acs?.length || 0) >= 2) || false,
        'count': state.requirements?.length || 0
      }
    }),
    2: () => ({
      name: 'EXPLORE',
      requirements: {
        'key_files_5+': (state.exploration?.key_files?.length || 0) >= 5,
        'patterns_documented': (state.exploration?.patterns?.length || 0) > 0,
        'agents_completed': state.exploration?.agents_completed || 0,
        'key_files_count': state.exploration?.key_files?.length || 0
      }
    }),
    3: () => ({
      name: 'DESIGN',
      requirements: {
        'approach_selected': !!state.design?.selected_approach,
        'user_approved': !!state.design?.user_approved,
        'selected': state.design?.selected_approach || 'none'
      }
    }),
    4: () => ({
      name: 'IMPLEMENT',
      requirements: {
        'all_acs_done': (state.implementation?.completed_acs?.length || 0) >= (state.implementation?.total_acs || 0),
        'completed': state.implementation?.completed_acs?.length || 0,
        'total': state.implementation?.total_acs || 0
      }
    }),
    5: () => ({
      name: 'VERIFY',
      requirements: {
        'verdict_pass': state.verification?.verdict === 'PASS',
        'critical_zero': (state.verification?.issues?.filter(i => i.severity === 'CRITICAL')?.length || 0) === 0,
        'verdict': state.verification?.verdict || 'PENDING',
        'loop_count': state.verification?.loop_count || 0,
        'agents_completed': state.verification?.agents_completed || 0
      }
    }),
    6: () => ({
      name: 'COMPLETE',
      requirements: {
        'complete': true
      }
    })
  };

  const check = checks[targetPhase];
  if (!check) {
    return { error: `Unknown phase: ${targetPhase}` };
  }

  const result = check();
  const allPassed = Object.values(result.requirements)
    .filter(v => typeof v === 'boolean')
    .every(v => v === true);

  return {
    active: state.active,
    current_phase: state.phase,
    checking_phase: targetPhase,
    phase_name: result.name,
    gate_status: allPassed ? 'PASS' : 'FAIL',
    details: result.requirements,
    can_advance: allPassed
  };
}

// Main
const args = process.argv.slice(2);
const phase = args[0] ? parseInt(args[0]) : null;

const result = checkGate(phase);
console.log(JSON.stringify(result, null, 2));
