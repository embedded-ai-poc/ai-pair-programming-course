#!/bin/bash
# Task Counter Hook for Power-Workflow
# PostToolUse hook - Counts Task completions with append-only log
set -euo pipefail

HOOK_INPUT=$(cat)
STATE_FILE=".claude/power-workflow.local.md"
LOG_FILE=".claude/power-workflow-tasks.log"

[[ ! -f "$STATE_FILE" ]] && { echo '{"decision":"approve"}'; exit 0; }

STATE_CONTENT=$(cat "$STATE_FILE")
PHASE=$(echo "$STATE_CONTENT" | grep '^phase:' | sed 's/phase: *//' | tr -d ' ')
[[ ! "$PHASE" =~ ^[0-9]+$ ]] && PHASE=0

case "$PHASE" in 3|4|5|6|8) ;; *) echo '{"decision":"approve"}'; exit 0 ;; esac

TIMESTAMP=$(date +%s%3N 2>/dev/null || echo "$(date +%s)000")
echo "${PHASE}|${TIMESTAMP}" >> "$LOG_FILE"

TASK_COUNT=$(grep -c "^${PHASE}|" "$LOG_FILE" 2>/dev/null || echo 0)
REQUIRED=3

PARALLEL_MSG=""
if [[ $TASK_COUNT -ge 2 ]]; then
  TIMESTAMPS=$(grep "^${PHASE}|" "$LOG_FILE" | cut -d'|' -f2 | sort -n)
  FIRST=$(echo "$TIMESTAMPS" | head -1)
  LAST=$(echo "$TIMESTAMPS" | tail -1)
  DIFF=$((LAST - FIRST))
  [[ $DIFF -lt 5000 ]] && PARALLEL_MSG=" (parallel detected)" || PARALLEL_MSG=" (WARNING: sequential)"
fi

sed -i "s/phase_${PHASE}: *[0-9]*/phase_${PHASE}: ${TASK_COUNT}/" "$STATE_FILE" 2>/dev/null || true

if [[ $TASK_COUNT -ge $REQUIRED ]]; then
  jq -n --arg p "$PHASE" --arg c "$TASK_COUNT" --arg r "$REQUIRED" --arg m "$PARALLEL_MSG" \
    '{"decision":"approve","message":"[power-workflow] Phase \($p): \($c)/\($r) agents completed\($m). Gate READY."}'
else
  NEED=$((REQUIRED - TASK_COUNT))
  jq -n --arg p "$PHASE" --arg c "$TASK_COUNT" --arg r "$REQUIRED" --arg n "$NEED" \
    '{"decision":"approve","message":"[power-workflow] Phase \($p): \($c)/\($r) agents completed. Need \($n) more."}'
fi
