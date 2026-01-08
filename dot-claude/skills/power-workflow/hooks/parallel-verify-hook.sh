#!/bin/bash
# Parallel Verify Hook for Power-Workflow
# PreToolUse hook - Provides guidance for parallel agent execution
set -euo pipefail

HOOK_INPUT=$(cat)
STATE_FILE=".claude/power-workflow.local.md"

if [[ ! -f "$STATE_FILE" ]]; then
  echo '{"decision":"approve"}'
  exit 0
fi

STATE_CONTENT=$(cat "$STATE_FILE")
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

jq -n --arg phase "$PHASE" --arg name "$PHASE_NAME" \
  '{"decision":"approve","message":"[power-workflow] Phase \($phase) (\($name)): Parallel agents required.\nLaunch 3 Task agents IN PARALLEL (single message with 3 Task calls)."}'
