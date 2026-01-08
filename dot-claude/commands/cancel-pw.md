# Cancel Power-Workflow

Cancel active power-workflow, remove hooks, and cleanup state.

## Execution

Run the cleanup script with cancel flag:

```bash
node ~/.claude/skills/power-workflow/scripts/cleanup-workflow.js --cancel
```

## What It Does

1. Marks the current workflow as `active: false`
2. Unregisters all power-workflow hooks from `.claude/settings.local.json`
3. Preserves the task log file for debugging

After cancellation, you can start a new workflow with `/pw [task description]`
