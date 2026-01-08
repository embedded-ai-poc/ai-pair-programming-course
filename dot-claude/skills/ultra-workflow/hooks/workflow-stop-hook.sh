#!/bin/bash
# Workflow Stop Hook for Ultra-Workflow
# Prevents session exit if workflow is incomplete

set -euo pipefail

# Read hook input from stdin
HOOK_INPUT=$(cat)

# State file path
STATE_FILE=".claude/ultra-workflow.local.md"

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

# Parse loop count
LOOP_COUNT=$(echo "$STATE_CONTENT" | grep 'loop_count:' | sed 's/loop_count: *//' | tr -d ' ')
if [[ ! "$LOOP_COUNT" =~ ^[0-9]+$ ]]; then
  LOOP_COUNT=0
fi

# Build warning message and output JSON
jq -n \
  --arg phase "$PHASE" \
  --arg coverage "$COVERAGE" \
  --arg loops "$LOOP_COUNT" \
  '{
    "decision": "block",
    "message": "[ultra-workflow] Workflow incomplete!\nCurrent Phase: \($phase)/10\nCoverage: \($coverage)%\nLoop Count: \($loops)/3\n\nOptions:\n1. Continue working to complete the workflow\n2. Use /cancel-uw to abort"
  }'

exit 0
