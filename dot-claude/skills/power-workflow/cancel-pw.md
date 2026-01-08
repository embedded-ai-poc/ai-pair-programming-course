# Cancel Power-Workflow

Cancel active power-workflow, remove hooks, and cleanup state.

## When to Use

Use when you need to:
- Abort the current workflow
- Start fresh with a new task
- Fix issues that prevent workflow continuation

## Execution

Run the cleanup script with cancel flag:

```bash
node ~/.claude/skills/power-workflow/scripts/cleanup-workflow.js --cancel
```

## What It Does

1. Marks the current workflow as `active: false` (preserves state for review)
2. Unregisters all power-workflow hooks from `.claude/settings.local.json`
3. Preserves the task log file for debugging

## Options

- `--cancel`: Mark workflow as cancelled but keep state file (default)
- `--keep`: Keep state file without marking as cancelled
- No flags: Completely remove state file

## After Cancellation

You can:
- Review the state file at `.claude/power-workflow.local.md`
- Check the task log at `.claude/power-workflow-tasks.log`
- Start a new workflow with `/pw [task description]`
