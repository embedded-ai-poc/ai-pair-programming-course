#!/bin/bash
# TDD Pre-Tool Hook for Ultra-Workflow
# PreToolUse hook - Warns if implementation before tests
set -euo pipefail

HOOK_INPUT=$(cat)
STATE_FILE=".claude/ultra-workflow.local.md"

FILE_PATH=$(echo "$HOOK_INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""' 2>/dev/null || echo "")
[[ -z "$FILE_PATH" ]] && { echo '{"decision":"approve"}'; exit 0; }

# Check if test file
if echo "$FILE_PATH" | grep -qiE '\.(test|spec)\.|test_|_test\.|tests/|__tests__/'; then
  echo '{"decision":"approve"}'
  exit 0
fi

# Check if implementation file
EXT="${FILE_PATH##*.}"
case "$EXT" in
  js|ts|jsx|tsx|vue|py|java|go|rs) IS_IMPL=true ;;
  *) IS_IMPL=false ;;
esac

if [[ "$IS_IMPL" != "true" ]] || [[ ! -f "$STATE_FILE" ]]; then
  echo '{"decision":"approve"}'
  exit 0
fi

STATE_CONTENT=$(cat "$STATE_FILE")

if echo "$STATE_CONTENT" | grep -qE 'tdd_phase: red|test_written: false'; then
  if echo "$STATE_CONTENT" | grep -q 'phase: 6'; then
    jq -n --arg file "$FILE_PATH" \
      '{"decision":"approve","message":"[ultra-workflow] TDD Warning: Write tests FIRST!\nPhase: RED - Write failing test first.\nFile: \($file)"}'
    exit 0
  fi
fi

echo '{"decision":"approve"}'
