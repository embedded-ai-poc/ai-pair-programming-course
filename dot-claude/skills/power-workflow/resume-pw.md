---
name: resume-pw
description: Resume a paused power-workflow and re-register hooks.
---

# Resume Power-Workflow

Resume a previously paused power-workflow and re-register hooks.

## Execution

Run the resume script:

```bash
node ~/.claude/skills/power-workflow/scripts/resume-workflow.js
```

## What It Does

1. Sets the workflow state to `paused: false` in `.claude/power-workflow.local.md`
2. Re-registers power-workflow hooks to `.claude/settings.local.json`
3. Restores all previous progress (phase, loop counts, verification results)
4. Shows current phase and what to do next

## Prerequisites

- An existing paused workflow (`.claude/power-workflow.local.md` with `paused: true`)
- If no paused workflow exists, use `/pw [task]` to start a new one

## Resume Workflow

After resuming, you will continue from the phase where you paused.

## State Changes

| Field | Before | After |
|-------|--------|-------|
| active | true | true |
| paused | true | false |
| hooks | UNREGISTERED | REGISTERED |
