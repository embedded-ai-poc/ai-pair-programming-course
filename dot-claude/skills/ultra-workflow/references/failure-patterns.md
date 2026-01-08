# Failure Patterns & Recovery Guide

## Common Failure Categories

### 1. Test Failures

#### Assertion Error
```
AssertionError: Expected 5, got 4
```

**Analysis**:
- Is the test correct?
- Is the implementation correct?
- Is there an off-by-one error?

**Recovery**:
1. Verify test expectation matches requirement
2. Debug implementation step by step
3. Fix the actual bug (not the test)

#### Import/Module Error
```
ModuleNotFoundError: No module named 'mymodule'
```

**Analysis**:
- Missing dependency?
- Wrong path?
- Circular import?

**Recovery**:
1. Check if module is installed
2. Verify import path
3. Check for circular dependencies

#### Timeout
```
TimeoutError: Test exceeded 30s limit
```

**Analysis**:
- Infinite loop?
- Waiting for external resource?
- N+1 query problem?

**Recovery**:
1. Add logging to identify slow point
2. Mock external dependencies
3. Optimize algorithm if needed

### 2. Coverage Failures

#### Below Threshold
```
FAIL: Coverage 85% < 90% threshold
```

**Analysis Checklist**:
- [ ] Which files are under-covered?
- [ ] Which lines are missing?
- [ ] Are they error handlers?
- [ ] Are they edge cases?

**Recovery**:
1. Run coverage with `--cov-report=term-missing`
2. Identify uncovered lines
3. Write tests for missing scenarios:

```python
# Common uncovered patterns:

# 1. Error handlers
def test_handles_invalid_input():
    with pytest.raises(ValueError):
        process_data(None)

# 2. Edge cases
def test_empty_list():
    assert process_list([]) == []

# 3. Else branches
def test_condition_false_path():
    result = calculate(negative_value)
    assert result == default_value
```

#### Untestable Code
Some code seems impossible to test:

**Pattern**: External side effect
```python
def send_email(user):
    smtp.send(user.email, "Hello")  # Hard to test
```

**Solution**: Dependency injection
```python
def send_email(user, sender=smtp):
    sender.send(user.email, "Hello")

# Now testable:
def test_send_email():
    mock_sender = Mock()
    send_email(user, sender=mock_sender)
    mock_sender.send.assert_called_once()
```

### 3. Requirement Failures

#### Scope Creep
**Symptom**: Implementation does more than required

**Analysis**:
- What was actually requested?
- What extra features were added?

**Recovery**:
1. Review original REQ-XXX
2. Remove unrelated code
3. Create new REQ for extras (if needed)

#### Misunderstood Requirement
**Symptom**: Tests pass but behavior wrong

**Analysis**:
- Re-read original request
- Compare AC with implementation

**Recovery**:
1. Go back to PHASE 1
2. Clarify requirement with user
3. Update REQ and tests
4. Re-implement

#### Missing Requirement
**Symptom**: Something wasn't considered

**Analysis**:
- Was it in original request?
- Is it implied by context?

**Recovery**:
1. Add as new REQ
2. Get user approval
3. Continue TDD cycle

### 4. Integration Failures

#### Works in Isolation, Fails Together
```
test_unit: PASS
test_integration: FAIL
```

**Analysis**:
- State pollution between tests?
- Different environment?
- Race condition?

**Recovery**:
1. Check test isolation
2. Verify mocks match reality
3. Add integration-specific tests

#### Database/External Service
```
ConnectionError: Could not connect to database
```

**Recovery**:
1. For unit tests: Mock the dependency
2. For integration tests: Use test containers
3. Verify connection settings

## Recovery Decision Tree

```
FAILURE DETECTED
      │
      ▼
┌─────────────────┐
│ What type?      │
└────────┬────────┘
         │
    ┌────┴────┬─────────────┬──────────────┐
    ▼         ▼             ▼              ▼
  TEST    COVERAGE     REQUIREMENT     INTEGRATION
    │         │             │              │
    ▼         ▼             ▼              ▼
Debug the  Add tests    Back to       Check
assertion  for missing  PHASE 1       dependencies
    │      lines            │              │
    ▼         │             ▼              ▼
Fix impl     │         Clarify        Mock or
or test      │         with user      use testcontainer
    │         │             │              │
    └────────┴─────────────┴──────────────┘
                      │
                      ▼
              RE-RUN ALL TESTS
                      │
                      ▼
               ┌──────────────┐
               │  ALL PASS?   │
               └──────┬───────┘
                      │
              YES ────┴──── NO
               │             │
               ▼             ▼
           CONTINUE     LOOP AGAIN
```

## Anti-Pattern Detection

### Signs of Trouble

| Warning Sign | What It Means | Action |
|--------------|---------------|--------|
| Tests suddenly skip | Something broke silently | Investigate immediately |
| Coverage drops | New untested code | Don't merge, add tests |
| Flaky tests | Non-determinism | Fix isolation/timing |
| Slow tests | Missing mocks | Add mocks for external |
| Too many mocks | Testing impl not behavior | Rethink test strategy |

### Prevention Strategies

1. **Run tests frequently** - Catch issues early
2. **Commit often** - Easy to bisect problems
3. **Review coverage diff** - No regression
4. **Keep tests fast** - < 10s for unit suite
5. **Fix flaky immediately** - Never ignore

## Escalation Protocol

When stuck after 3 attempts:

1. **Document the failure**
   ```
   ESCALATION:
   - Issue: [description]
   - Tried: [what was attempted]
   - Result: [what happened]
   - Theory: [best guess]
   ```

2. **Ask user for guidance**
   - Present findings
   - Offer options
   - Don't guess blindly

3. **Consider alternatives**
   - Different approach?
   - Simplify requirement?
   - Known limitation?
