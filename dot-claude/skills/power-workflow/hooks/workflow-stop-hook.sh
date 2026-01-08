#!/bin/bash
# Workflow Stop Hook for Power-Workflow
# Prevents session exit if workflow is incomplete

set -euo pipefail

# Read hook input from stdin
HOOK_INPUT=$(cat)

# State file path
STATE_FILE=".claude/power-workflow.local.md"

# No state file = no active workflow
if [[ ! -f "$STATE_FILE" ]]; then
  echo '{"decision":"approve"}'
  exit 0
fi

STATE_CONTENT=$(cat "$STATE_FILE")

# Check if workflow is active
if ! echo "$STATE_CONTENT" | grep -q 'active: true'; then
  echo '{"decision":"approve"}'
  exit 0
fi

# Parse phase
PHASE=$(echo "$STATE_CONTENT" | grep '^phase:' | sed 's/phase: *//' | tr -d ' ')
if [[ ! "$PHASE" =~ ^[0-9]+$ ]]; then
  PHASE=0
fi

# Phase 10 = COMPLETE
if [[ $PHASE -ge 10 ]]; then
  echo '{"decision":"approve"}'
  exit 0
fi

# Parse coverage
COVERAGE=$(echo "$STATE_CONTENT" | grep 'last_coverage:' | sed 's/last_coverage: *//' | tr -d ' ')
if [[ ! "$COVERAGE" =~ ^[0-9]+$ ]]; then
  COVERAGE=0
fi

# Build warning message and output JSON
jq -n \
  --arg phase "$PHASE" \
  --arg coverage "$COVERAGE" \
  '{
    "decision": "block",
    "message": "[power-workflow] Workflow incomplete!\nCurrent Phase: \($phase)/10\nCoverage: \($coverage)%\n\nOptions:\n1. Continue working to complete the workflow\n2. Use /cancel-pw to abort"
  }'

exit 0
