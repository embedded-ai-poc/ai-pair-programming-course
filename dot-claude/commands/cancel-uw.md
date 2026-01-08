---
name: cancel-uw
description: "Cancel active ultra-workflow, remove hooks, and cleanup state. Use when you need to abort the current workflow."
---

# /cancel-uw - Cancel Ultra-Workflow

You are cancelling the current ultra-workflow session.

## Cleanup Script

Run the cleanup script:
```bash
node ~/.claude/skills/ultra-workflow/scripts/cleanup-workflow.js --cancel
```

## What This Does

1. Marks the workflow state as **inactive** (preserves history)
2. Removes all hooks from `.claude/settings.local.json`
3. Reports final status (phase reached, coverage)

## After Cancellation

- You can start a new workflow with `/uw`
- The old state file is preserved for reference (marked inactive)
- No hooks will interfere with normal operations

## Confirmation

After running the cleanup script, confirm to the user:
- Workflow cancelled
- Hooks removed
- Ready for new tasks

User's request: $ARGUMENTS
