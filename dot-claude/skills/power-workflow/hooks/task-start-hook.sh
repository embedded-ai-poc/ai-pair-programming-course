#!/bin/bash
# Task Start Hook for Power-Workflow
# PreToolUse hook - Tracks Task starts for parallel detection
set -euo pipefail

HOOK_INPUT=$(cat)
STATE_FILE=".claude/power-workflow.local.md"
LOG_FILE=".claude/power-workflow-tasks.log"

[[ ! -f "$STATE_FILE" ]] && { echo '{"decision":"approve"}'; exit 0; }

STATE_CONTENT=$(cat "$STATE_FILE")
echo "$STATE_CONTENT" | grep -q 'active: true' || { echo '{"decision":"approve"}'; exit 0; }

PHASE=$(echo "$STATE_CONTENT" | grep '^phase:' | sed 's/phase: *//' | tr -d ' ')
[[ ! "$PHASE" =~ ^[0-9]+$ ]] && PHASE=0

case "$PHASE" in
  3) PHASE_NAME="REQ-VERIFY" ;;
  4) PHASE_NAME="EXPLORE" ;;
  5) PHASE_NAME="DESIGN" ;;
  6) PHASE_NAME="DESIGN-VERIFY" ;;
  8) PHASE_NAME="CODE-VERIFY" ;;
  *) echo '{"decision":"approve"}'; exit 0 ;;
esac

mkdir -p ".claude"
TIMESTAMP=$(date +%s%3N 2>/dev/null || echo "$(date +%s)000")
TOOL_ID=$(echo "$HOOK_INPUT" | jq -r '.tool_use_id // "unknown"' 2>/dev/null || echo "unknown")
echo "${PHASE}|${TIMESTAMP}|start|${TOOL_ID}" >> "$LOG_FILE"

START_COUNT=$(grep -c "^${PHASE}|.*|start|" "$LOG_FILE" 2>/dev/null || echo 0)
REQUIRED=3

if [[ $START_COUNT -lt $REQUIRED ]]; then
  [[ $START_COUNT -eq 1 ]] && EXTRA=" Launch remaining IN PARALLEL." || EXTRA=""
  jq -n --arg p "$PHASE" --arg n "$PHASE_NAME" --arg c "$START_COUNT" --arg r "$REQUIRED" --arg e "$EXTRA" \
    '{"decision":"approve","message":"[power-workflow] Phase \($p) (\($n)): Task \($c)/\($r) started.\($e)"}'
else
  jq -n --arg p "$PHASE" --arg c "$START_COUNT" \
    '{"decision":"approve","message":"[power-workflow] Phase \($p): \($c) tasks started."}'
fi
