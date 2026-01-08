# Requirement Tracking Format (REQ-XXX/AC-XXX)

## Overview

The agentic-dev workflow uses structured requirement tracking to ensure traceability from user request to implementation to tests.

## Requirement Format

```markdown
REQ-001: [Short Descriptive Title]
- Description: [Clear explanation of what needs to be done]
- Type: [Feature | Bug | Refactor | Enhancement]
- Priority: [P1-Critical | P2-High | P3-Medium | P4-Low]
- Estimated Complexity: [S | M | L | XL]

### Acceptance Criteria
| ID | Criterion | Test Function | Status |
|----|-----------|---------------|--------|
| AC-001-1 | [Specific, testable criterion] | test_xxx | PENDING |
| AC-001-2 | [Specific, testable criterion] | test_yyy | PENDING |

### Affected Files
- `src/module/file.py` - [what changes]
- `src/module/other.py` - [what changes]

### Test Files
- `tests/test_module.py` - [tests to add]

### Dependencies
- Depends on: REQ-XXX (or "None")
- Blocks: REQ-YYY (or "None")
```

## Numbering Convention

### Requirements (REQ-XXX)
- Sequential three-digit numbering: REQ-001, REQ-002, REQ-003
- Never reuse numbers, even if requirement is removed
- Group related requirements with comments

### Acceptance Criteria (AC-XXX-X)
- Format: AC-{REQ number}-{AC number}
- Examples: AC-001-1, AC-001-2, AC-002-1
- Each AC must be independently testable

## Status Values

### Requirement Status
| Status | Meaning |
|--------|---------|
| `PENDING` | Not started |
| `IN_PROGRESS` | Currently being implemented |
| `BLOCKED` | Waiting on dependency |
| `COMPLETE` | All ACs done |
| `VERIFIED` | Tested and reviewed |

### AC Status
| Status | Meaning |
|--------|---------|
| `PENDING` | Not started |
| `RED` | Failing test written |
| `GREEN` | Test passing |
| `REFACTORED` | Code improved, tests still pass |
| `DONE` | Complete and verified |

## TDD Mapping

Each AC MUST map to a test:

```markdown
## TDD Traceability

| AC | Test File | Test Function | TDD Phase | Coverage |
|----|-----------|---------------|-----------|----------|
| AC-001-1 | tests/test_auth.py | test_login_success | REFACTORED | 100% |
| AC-001-2 | tests/test_auth.py | test_login_invalid | GREEN | 95% |
| AC-001-3 | tests/test_auth.py | test_token_expiry | RED | 0% |
```

## Commit Message Format

Reference requirements in commits:

```
test(REQ-001): add failing test for AC-001-1
feat(REQ-001): implement AC-001-1 login endpoint
refactor(REQ-001): extract validation logic
```

## Examples

### Good Acceptance Criteria
```
AC-001-1: POST /login with valid credentials returns 200 and JWT token
AC-001-2: POST /login with invalid password returns 401 Unauthorized
AC-001-3: JWT token expires after 24 hours (configurable)
AC-001-4: Rate limit login attempts to 5 per minute per IP
```

### Bad Acceptance Criteria
```
AC-001-1: Login should work (too vague)
AC-001-2: System should be secure (not testable)
AC-001-3: Fast response time (no specific metric)
```

## Template for Phase 2 (ANALYZE)

```markdown
## Requirements Analysis

### Context
- Project Type: [e.g., Python/FastAPI, Node/Express]
- Test Framework: [e.g., pytest, jest]
- Existing Patterns: [Brief description]

### Requirements

REQ-001: [Title]
- Description: [What]
- Type: Feature
- Priority: P1-Critical
- Complexity: M

#### Acceptance Criteria
| ID | Criterion | Test | Status |
|----|-----------|------|--------|
| AC-001-1 | [Criterion] | test_xxx | PENDING |
| AC-001-2 | [Criterion] | test_yyy | PENDING |

#### Files
- Affected: src/auth/service.py
- Tests: tests/test_auth.py

---

### Out of Scope
- [Things NOT included]

### Clarifications Needed
- [Questions for Phase 4]
```

## Validation Rules

1. **Every REQ must have at least 2 ACs**
2. **Every AC must be testable** (measurable, specific)
3. **Every AC must map to exactly one test function**
4. **No AC should test multiple behaviors** (split if needed)
5. **Coverage path must be traceable** from REQ to test to code
