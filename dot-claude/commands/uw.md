---
name: uw
description: "Ultimate 10-phase TDD workflow with Dual-MCP (Context7 + Sequential-Thinking). 90%+ coverage gates, parallel agents, Ralph-Loop escalation. Auto-registers hooks."
---

# /uw - Ultimate Development Workflow

You are now operating in **Ultra-Workflow** mode.

## FIRST: Initialize the Workflow

Run the init script to set up state and register hooks:
```bash
node ~/.claude/skills/ultra-workflow/scripts/init-workflow.js "$ARGUMENTS"
```

This will:
1. Create `.claude/ultra-workflow.local.md` (state file)
2. Register hooks to `.claude/settings.local.json` (project-level)
3. Detect frontend keywords for frontend-design agent

## Workflow Features

- 10-phase TDD development lifecycle
- Dual-MCP integration (Context7 for docs, Sequential-Thinking for analysis)
- SuperClaude command integration
- 90%+ coverage gate enforcement
- Parallel agents in EXPLORE/DESIGN/REVIEW phases
- Ralph-Loop escalation after 3 failures
- **Auto-registered hooks** (Stop, PreToolUse, PostToolUse)

## 10 Phases

| Phase | Name | Gate |
|-------|------|------|
| 1 | INIT | State file created, hooks registered |
| 2 | ANALYZE | 1+ REQ with 2+ AC, user approved |
| 3 | EXPLORE | 5+ key files identified (3 parallel agents) |
| 4 | CLARIFY | All questions answered |
| 5 | DESIGN | User selects approach (3 parallel architects) |
| 6 | TDD-IMPL | All ACs have passing tests (RED-GREEN-REFACTOR) |
| 7 | REVIEW | No Critical/Major issues (3 parallel reviewers) |
| 8 | TEST | All tests pass |
| 9 | COVERAGE | Coverage >= 90% |
| 10 | COMPLETE | Summary generated, hooks removed |

## Hooks (Auto-Registered)

| Hook | Purpose |
|------|---------|
| Stop | Blocks exit if workflow incomplete |
| PreToolUse | TDD enforcement (warns if impl before test) |
| PostToolUse | Test reminders after file edits |

## Commands

| Command | Description |
|---------|-------------|
| `/uw [task]` | Start new workflow |
| `/cancel-uw` | Cancel workflow, remove hooks |

## MCP Integration

Use these tools throughout:
- `mcp__context7__get-library-docs` for documentation
- `mcp__sequential-thinking__sequentialthinking` for analysis

## Phase 10: COMPLETE

When Phase 10 is reached, run cleanup:
```bash
node ~/.claude/skills/ultra-workflow/scripts/cleanup-workflow.js
```

## Now

After running the init script, proceed to Phase 2: ANALYZE.

Refer to the `ultra-workflow` skill at `~/.claude/skills/ultra-workflow/SKILL.md` for detailed phase instructions.

User request: $ARGUMENTS
