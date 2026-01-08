---
name: pause-pw
description: Pause active power-workflow and temporarily disable hooks.
---

# Pause Power-Workflow

Pause active power-workflow, temporarily disable hooks, and preserve state for later resumption.

## Execution

Run the pause script:

```bash
node ~/.claude/skills/power-workflow/scripts/pause-workflow.js
```

## What It Does

1. Sets the workflow state to `paused: true` in `.claude/power-workflow.local.md`
2. Temporarily unregisters power-workflow hooks from `.claude/settings.local.json`
3. Preserves all progress (phase, loop counts, verification results)
4. Allows you to work on other tasks without workflow interference

## When to Use

- Need to handle an urgent task during workflow execution
- Want to take a break without losing progress
- Need to switch to a different project temporarily

## Resume

To resume the paused workflow:

```
/resume-pw
```

## State Changes

| Field | Before | After |
|-------|--------|-------|
| active | true | true |
| paused | false | true |
| hooks | REGISTERED | UNREGISTERED |
