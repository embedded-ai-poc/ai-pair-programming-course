#!/bin/bash
# SubagentStop Hook for Power-Workflow
# Tracks subagent (Task) completions
set -euo pipefail

HOOK_INPUT=$(cat)
STATE_FILE=".claude/power-workflow.local.md"
LOG_FILE=".claude/power-workflow-tasks.log"

[[ ! -f "$STATE_FILE" ]] && { echo '{"decision":"approve"}'; exit 0; }

STATE_CONTENT=$(cat "$STATE_FILE")
echo "$STATE_CONTENT" | grep -q 'active: true' || { echo '{"decision":"approve"}'; exit 0; }

PHASE=$(echo "$STATE_CONTENT" | grep '^phase:' | sed 's/phase: *//' | tr -d ' ')
[[ ! "$PHASE" =~ ^[0-9]+$ ]] && PHASE=0

case "$PHASE" in 3|4|5|6|8) ;; *) echo '{"decision":"approve"}'; exit 0 ;; esac

TIMESTAMP=$(date +%s%3N 2>/dev/null || echo "$(date +%s)000")
SESSION_ID=$(echo "$HOOK_INPUT" | jq -r '.session_id // "unknown"' 2>/dev/null || echo "unknown")
echo "${PHASE}|${TIMESTAMP}|subagent|${SESSION_ID}" >> "$LOG_FILE"

COUNT=$(grep -c "^${PHASE}|.*|subagent|" "$LOG_FILE" 2>/dev/null || echo 0)
REQUIRED=3

sed -i "s/phase_${PHASE}: *[0-9]*/phase_${PHASE}: ${COUNT}/" "$STATE_FILE" 2>/dev/null || true

if [[ $COUNT -ge $REQUIRED ]]; then
  jq -n --arg p "$PHASE" --arg c "$COUNT" --arg r "$REQUIRED" \
    '{"decision":"approve","message":"[power-workflow] Phase \($p): \($c)/\($r) subagents completed. Gate READY."}'
else
  jq -n --arg p "$PHASE" --arg c "$COUNT" --arg r "$REQUIRED" \
    '{"decision":"approve","message":"[power-workflow] Phase \($p): \($c)/\($r) subagents completed."}'
fi
