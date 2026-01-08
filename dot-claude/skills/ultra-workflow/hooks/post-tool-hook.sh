#!/bin/bash
# Post-Tool Hook for Ultra-Workflow
# PostToolUse hook - Reminds to run tests after modifications
set -euo pipefail

HOOK_INPUT=$(cat)
STATE_FILE=".claude/ultra-workflow.local.md"

FILE_PATH=$(echo "$HOOK_INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""' 2>/dev/null || echo "")
[[ -z "$FILE_PATH" ]] && { echo '{"decision":"approve"}'; exit 0; }
[[ ! -f "$STATE_FILE" ]] && { echo '{"decision":"approve"}'; exit 0; }

STATE_CONTENT=$(cat "$STATE_FILE")

if echo "$STATE_CONTENT" | grep -q 'phase: 6'; then
  TDD_PHASE=$(echo "$STATE_CONTENT" | grep 'tdd_phase:' | sed 's/tdd_phase: *//' | tr -d ' ' || echo "unknown")
  FILENAME=$(basename "$FILE_PATH")
  jq -n --arg file "$FILENAME" --arg tdd "$TDD_PHASE" \
    '{"decision":"approve","message":"[ultra-workflow] Modified: \($file)\nTDD Phase: \($tdd | ascii_upcase)\nRemember: Run tests and verify coverage!"}'
  exit 0
fi

echo '{"decision":"approve"}'
