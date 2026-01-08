---
name: ultra-workflow
description: Ultimate 10-phase TDD workflow with Dual-MCP integration (Context7 + Sequential-Thinking). 90%+ coverage gates, parallel agents in EXPLORE/DESIGN/REVIEW phases, Ralph-Loop escalation after 3 failures. Triggers on ultra, full tdd, strict tdd workflow.
---

# ULTRA-WORKFLOW: 10-Phase TDD with Dual-MCP

> **Ultimate Development Workflow**: Strict TDD + Context7 + Sequential-Thinking + SuperClaude

## ABSOLUTE RULES (NEVER VIOLATE)

```
+------------------------------------------------------------------------+
|  1. NEVER write implementation without failing tests first (TDD)       |
|  2. NEVER proceed to next phase without passing current gate           |
|  3. NEVER claim completion without 90%+ coverage verification          |
|  4. NEVER skip requirement tracking (REQ-XXX throughout)               |
|  5. NEVER bypass parallel agent requirements in EXPLORE/DESIGN/REVIEW  |
|  6. ALWAYS use Context7 for documentation lookup                       |
|  7. ALWAYS use Sequential-Thinking for complex analysis                |
+------------------------------------------------------------------------+
```

## Dual-MCP Architecture

```
+=============================================================================+
||                        DUAL-MCP SYNERGY                                    ||
+=============================================================================+
||  CONTEXT7 MCP                    ||  SEQUENTIAL-THINKING MCP              ||
||  - Latest library docs           ||  - Structured reasoning               ||
||  - Framework best practices      ||  - 5 Whys root cause analysis        ||
||  - Code examples                 ||  - Decision trees                     ||
||  - Troubleshooting guides        ||  - Problem decomposition              ||
+=============================================================================+
```

### MCP Tool Reference

| Tool | Purpose |
|------|---------|
| `mcp__context7__resolve-library-id` | Find library ID from name |
| `mcp__context7__get-library-docs` | Fetch library documentation |
| `mcp__sequential-thinking__sequentialthinking` | Multi-step reasoning |

### Common Library IDs

```
Vue.js:     /vuejs/vue, /vuejs/pinia, /vuejs/router
React:      /facebook/react, /vercel/next.js
Supabase:   /supabase/supabase, /supabase/supabase-js
Testing:    /vitest-dev/vitest, /microsoft/playwright
Node.js:    /expressjs/express, /fastify/fastify
TypeScript: /microsoft/typescript
```

## 10-Phase Workflow State Machine

```
[1.INIT] -> [2.ANALYZE] -> [3.EXPLORE] -> [4.CLARIFY] -> [5.DESIGN]
   |           |              |              |              |
 GATE 1      GATE 2         GATE 3        GATE 4         GATE 5
(state)      (REQs)        (files)       (answers)     (approach)
                                                           |
[10.COMPLETE] <- [9.COVERAGE] <- [8.TEST] <- [7.REVIEW] <- [6.TDD-IMPL]
     |               |              |            |              |
   GATE 10        GATE 9         GATE 8       GATE 7         GATE 6
  (summary)       (90%+)         (pass)      (issues)        (code)

FAIL at 7/8/9 -> Loop back to Phase 6 (max 3 times)
Loop > 3 -> Ralph-Loop Escalation
```

---

## Phase Definitions

### Phase 1: INIT

**Gate**: State file created + hooks registered

**Script**: `node ~/.claude/skills/ultra-workflow/scripts/init-workflow.js "$ARGUMENTS"`

**Actions**:
1. Create `.claude/ultra-workflow.local.md` (state file)
2. Register hooks to `.claude/settings.local.json` (project-level)
3. Detect frontend keywords
4. Initialize MCP flags

**Hooks Registered**:
- `Stop`: Blocks session exit if workflow incomplete
- `PreToolUse`: TDD enforcement (warns if impl before tests)
- `PostToolUse`: Test reminders after file modifications

---

### Phase 2: ANALYZE (+ Context7)

**Gate**: 1+ REQ-XXX with 2+ AC-XXX, user approved

**MCP Integration**:
```javascript
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/[technology]",
  topic: "best practices architecture patterns"
})
```

**SuperClaude**: `/sc:brainstorm --strategy systematic --ctx7 --seq`

**Output Format**:
```
REQ-001: [Title]
- Description: [What]
- Acceptance Criteria:
  * AC-001-1: [Testable]
  * AC-001-2: [Testable]
- Test Files: [Where]
- Priority: [High/Medium/Low]
```

---

### Phase 3: EXPLORE (3 Parallel Agents)

**Gate**: 5+ key files identified

**MANDATORY Parallel Execution**:
```yaml
Launch 3 code-explorer agents IN PARALLEL:
  Agent 1: "Find similar features and patterns"
  Agent 2: "Map architecture layers and data flow"
  Agent 3: "Analyze testing patterns and coverage"
```

**MCP Integration**:
```javascript
mcp__sequential-thinking__sequentialthinking({
  thought: "Analyzing codebase structure...",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
})
```

---

### Phase 4: CLARIFY

**Gate**: All questions answered

Use `AskUserQuestion` for:
- Edge cases
- Error handling strategy
- Integration points
- Performance requirements

---

### Phase 5: DESIGN (3 Parallel Architects + Frontend)

**Gate**: User selects approach

**MANDATORY Parallel Execution**:
```yaml
Launch 4 agents IN PARALLEL:
  Approach 1 (Minimal): "Smallest diff, maximum reuse"
  Approach 2 (Clean): "Best practices, maintainability"
  Approach 3 (Pragmatic): "Speed + quality balance (RECOMMENDED)"
  + frontend-design (if frontend_detected)
```

**MCP Integration**:
```javascript
// Fetch latest patterns
mcp__context7__get-library-docs({
  topic: "recommended patterns best practices"
})

// Design decision tree
mcp__sequential-thinking__sequentialthinking({
  thought: "Evaluating design options...",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
})
```

**SuperClaude**: `/sc:design --type specification --ctx7 --seq`

---

### Phase 6: TDD-IMPL (RED-GREEN-REFACTOR)

**Gate**: All ACs have passing tests

#### TDD Cycle (Per AC)

```
+---------------------------------------------------------------+
|   RED      ->    GREEN     ->    REFACTOR    ->   Next AC     |
|   FAIL!          PASS!           PASS!                        |
+---------------------------------------------------------------+
| Write test    Minimal code    Improve code                    |
| Run: FAIL     Run: PASS       Run: PASS                       |
| Commit:       Commit:         Commit:                         |
| test:...      feat:...        refactor:...                    |
+---------------------------------------------------------------+
```

**MCP Integration** (Before Implementation):
```javascript
// Fetch docs for each library
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/vuejs/vue",
  topic: "composition API ref reactive"
})
```

**SuperClaude**: `/sc:implement --with-tests --safe --ctx7`

---

### Phase 7: REVIEW (3 Parallel Reviewers)

**Gate**: No Critical/Major issues

**MANDATORY Parallel Execution**:
```yaml
Launch 3 code-reviewer agents IN PARALLEL:
  Reviewer 1: "Simplicity, DRY, over-engineering check"
  Reviewer 2: "Bugs, logic errors, security vulnerabilities"
  Reviewer 3: "Project conventions, test coverage"
```

**Confidence Threshold**: >= 80%

**SuperClaude**: `/sc:analyze --focus security,performance --depth deep --seq`

---

### Phase 8: TEST

**Gate**: All tests pass

**Script**: `node scripts/run-tests.js`

Auto-detects: npm/yarn/pnpm, pytest, cargo, go, dotnet, make

---

### Phase 9: COVERAGE

**Gate**: Coverage >= 90%

**Script**: `node scripts/coverage-check.js 90`

---

### Phase 10: COMPLETE

**Gate**: Summary generated + hooks removed

**Script**: `node ~/.claude/skills/ultra-workflow/scripts/cleanup-workflow.js`

**Actions**:
1. Mark TodoWrite complete
2. Generate completion report
3. Remove hooks from `.claude/settings.local.json`
4. Delete state file
5. Suggest next steps (PR, docs)

**Note**: If workflow needs to be cancelled, use `/cancel-uw` command

---

## Loop-Back Rules

| Source | Trigger | Action |
|--------|---------|--------|
| Phase 7 | Critical/Major issues | Back to Phase 6 |
| Phase 8 | Test failures | Back to Phase 6 |
| Phase 9 | Coverage < 90% | Back to Phase 6 |

**Max Loops**: 3

**Escalation** (loop_count >= 3):
```bash
/ralph-loop "Fix remaining issues. <promise>ALL TESTS PASS AND COVERAGE >= 90%</promise>" --max-iterations 20
```

---

## Phase-MCP Quick Reference

| Phase | Context7 | Sequential | SuperClaude |
|-------|----------|------------|-------------|
| 2. ANALYZE | Domain docs | Requirements structuring | /sc:brainstorm |
| 3. EXPLORE | - | Pattern analysis | - |
| 5. DESIGN | Latest patterns | Decision trees | /sc:design |
| 6. TDD-IMPL | Implementation docs | - | /sc:implement |
| 7. REVIEW | Best practices | Security analysis | /sc:analyze |
| Loopback | Troubleshooting | 5 Whys (MANDATORY BOTH) | /sc:troubleshoot |

---

## SuperClaude Flags

| Flag | Description |
|------|-------------|
| `--ctx7` | Enable Context7 MCP |
| `--seq` | Enable Sequential-Thinking MCP |
| `--ultrathink` | Maximum depth (~32K tokens) |
| `--delegate auto` | Parallel sub-agents |
| `--with-tests` | Include test generation |
| `--safe` | Security validation |

---

## State File Schema

Location: `.claude/ultra-workflow.local.md`

```yaml
---
active: true
phase: 1
phase_name: "INIT"
loop_count: 0
max_loops: 3
test_written: false
tdd_phase: null  # red|green|refactor
last_coverage: 0
target_coverage: 90
mcp_context7_enabled: true
mcp_sequential_enabled: true
frontend_detected: false
---
```

---

## Boundaries

**Will:**
- Enforce all 10 phases with gates
- Use Dual-MCP for documentation and reasoning
- Execute parallel agents in required phases
- Loop back on failures (max 3)
- Escalate to Ralph-Loop after 3 failures

**Will Not:**
- Skip phases or gates
- Allow implementation without tests
- Exit below 90% coverage
- Ignore MCP recommendations

---

**Version**: 1.0.0
**Based on**: agentic-dev + agentic-dev-workflow + SuperClaude
