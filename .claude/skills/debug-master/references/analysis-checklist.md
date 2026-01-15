# Systematic Debugging Analysis Checklist

A comprehensive checklist for systematic bug investigation. Use this to ensure thorough analysis during debugging sessions.

## Pre-Analysis Checklist

### Information Gathering
- [ ] **Problem Description**: Clear understanding of what's wrong
- [ ] **Expected Behavior**: What should happen
- [ ] **Actual Behavior**: What is happening
- [ ] **Error Messages**: Exact text of any errors
- [ ] **Stack Trace**: Full trace if available
- [ ] **Reproduction Steps**: How to trigger the bug
- [ ] **Environment**: Where it occurs (dev/staging/prod)
- [ ] **Timeline**: When it started / last known working

### Context Collection
- [ ] **Affected Users**: Who is impacted
- [ ] **Frequency**: How often it occurs
- [ ] **Workaround**: Any temporary solution exists
- [ ] **Related Issues**: Similar past problems
- [ ] **Recent Changes**: What changed recently
- [ ] **Dependencies**: Related components/services

---

## Phase 1: Problem Definition Checklist

### Symptom Analysis
- [ ] List all reported symptoms
- [ ] Categorize symptom types (crash/hang/data/UI/performance)
- [ ] Rate symptom severity
- [ ] Identify primary vs secondary symptoms
- [ ] Note symptom frequency and patterns

### Error Analysis
- [ ] Parse error message components
- [ ] Identify error type/code
- [ ] Extract stack trace information
- [ ] Note error context (operation, data)
- [ ] Search for error in codebase

### Scope Definition
- [ ] Identify affected features
- [ ] List affected files/modules
- [ ] Determine blast radius
- [ ] Assess data risk
- [ ] Define investigation boundaries

---

## Phase 2: Parallel Analysis Checklist

### Problem Analyzer Tasks
- [ ] Document all symptoms in structured format
- [ ] Classify bug type (logic/crash/data/etc.)
- [ ] Create reproduction profile
- [ ] Assess severity on all dimensions
- [ ] Calculate overall priority
- [ ] Identify any missing information

### Code Analyzer Tasks
- [ ] Locate all relevant source files
- [ ] Map execution flow through code
- [ ] Identify entry points and handlers
- [ ] Find suspicious code patterns
- [ ] Check error handling coverage
- [ ] Assess code quality in area
- [ ] Document potential bug locations

### Git Historian Tasks
- [ ] Analyze commits in relevant timeframe
- [ ] Identify changes to affected files
- [ ] Find potential regression points
- [ ] Check for related past issues
- [ ] Review commit messages for context
- [ ] Identify relevant contributors
- [ ] Document suspect commits

---

## Phase 3: Synthesis Checklist

### Correlation Analysis
- [ ] Map symptoms to code locations
- [ ] Correlate code changes with symptom timeline
- [ ] Identify overlapping findings between agents
- [ ] Resolve any conflicting information
- [ ] Build unified timeline of events

### Evidence Consolidation
- [ ] Rank findings by relevance
- [ ] Score evidence strength
- [ ] Identify gaps in analysis
- [ ] Document assumptions made
- [ ] Note areas needing clarification

### Pattern Matching
- [ ] Compare with known bug patterns
- [ ] Check for similar past issues
- [ ] Identify common anti-patterns
- [ ] Note any unusual patterns

---

## Phase 4: Root Cause Analysis Checklist

### Hypothesis Generation
- [ ] Generate hypotheses from synthesis
- [ ] Consider multiple potential causes
- [ ] Include unlikely possibilities
- [ ] Document reasoning for each
- [ ] Ensure hypotheses are testable

### Hypothesis Evaluation
For each hypothesis:
- [ ] List supporting evidence
- [ ] List contradicting evidence
- [ ] Assign confidence percentage
- [ ] Define verification steps
- [ ] Estimate verification effort

### Root Cause Validation
- [ ] Can hypothesis explain ALL symptoms?
- [ ] Does timeline match?
- [ ] Are there alternative explanations?
- [ ] Is the hypothesis falsifiable?
- [ ] What would prove it wrong?

---

## Phase 5: Clarification Checklist

### Decision Point
- [ ] Is highest confidence > 80%?
- [ ] Are multiple hypotheses within 10%?
- [ ] Is critical information missing?
- [ ] Would questions significantly help?

### Question Formulation
If clarification needed:
- [ ] Limit to maximum 3 questions
- [ ] Make questions specific and actionable
- [ ] Explain why each question matters
- [ ] Offer multiple-choice when possible
- [ ] Prioritize by information value

### Skip Criteria
Skip clarification if:
- [ ] High confidence root cause (>80%)
- [ ] All necessary information available
- [ ] Evidence strongly points to single cause
- [ ] Questions unlikely to change approach

---

## Phase 6: Solution Proposal Checklist

### Solution Generation
For each viable hypothesis:
- [ ] Design specific fix
- [ ] Consider alternative approaches
- [ ] Evaluate implementation complexity
- [ ] Assess risk of each approach
- [ ] Identify potential side effects

### Solution Evaluation
For each solution:
- [ ] Confidence it will work
- [ ] Implementation effort
- [ ] Test coverage needed
- [ ] Rollback difficulty
- [ ] Impact on other features
- [ ] Performance implications

### Solution Documentation
- [ ] Clear description of fix
- [ ] Files to be modified
- [ ] Code changes required
- [ ] Test plan
- [ ] Rollback procedure
- [ ] Success criteria

---

## Phase 7: Implementation Checklist

### Pre-Implementation
- [ ] User approval received
- [ ] Backup created if needed
- [ ] Branch created for changes
- [ ] Dependencies verified
- [ ] Test environment ready

### Implementation
- [ ] Changes made as documented
- [ ] Code follows project standards
- [ ] No unintended changes
- [ ] Comments added where needed
- [ ] Error handling included

### Verification
- [ ] Local testing passed
- [ ] Reproduction steps no longer trigger bug
- [ ] No new errors introduced
- [ ] Related functionality still works
- [ ] Performance not degraded

### Post-Implementation
- [ ] Tests added/updated
- [ ] Documentation updated if needed
- [ ] Changes committed with clear message
- [ ] Team notified if relevant
- [ ] Resolution documented

---

## Quality Gates

### Minimum Evidence Requirements
Before proposing solution:
- [ ] At least 2 supporting pieces of evidence
- [ ] No major contradicting evidence
- [ ] Clear causal chain established
- [ ] Hypothesis explains all symptoms
- [ ] Verification approach defined

### Solution Requirements
Before implementing:
- [ ] Solution addresses root cause (not just symptom)
- [ ] Risk assessment completed
- [ ] Rollback plan exists
- [ ] Test plan defined
- [ ] User approval obtained

### Completion Requirements
Before closing:
- [ ] Bug verified as fixed
- [ ] No regression introduced
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Resolution communicated

---

## Quick Reference

### Red Flags During Analysis
- Multiple unrelated symptoms → Multiple bugs?
- Can't reproduce → Environmental issue?
- Only in production → Configuration issue?
- Started after deploy → Regression?
- Intermittent → Race condition?
- Getting worse → Resource leak?

### Confidence Level Guide
| Level | Percentage | Evidence Required |
|-------|------------|-------------------|
| High | 80-100% | Multiple strong evidence, no contradictions |
| Medium | 50-79% | Some evidence, minor gaps |
| Low | 20-49% | Limited evidence, significant uncertainty |
| Speculative | <20% | Minimal evidence, needs investigation |

### Priority Decision Matrix
| Confidence | Impact | Decision |
|------------|--------|----------|
| High | High | Implement immediately |
| High | Low | Schedule implementation |
| Low | High | Investigate more first |
| Low | Low | Lowest priority |

---

## Notes Template

Use this template for debugging session notes:

```markdown
# Debug Session: [Issue Title]
**Date**: [Date]
**Reporter**: [Who reported]
**Severity**: [P0/P1/P2/P3]

## Problem Summary
[Brief description]

## Key Findings
1. [Finding 1]
2. [Finding 2]
3. [Finding 3]

## Root Cause
**Hypothesis**: [Description]
**Confidence**: [Percentage]
**Evidence**: [Key evidence]

## Solution
**Approach**: [Description]
**Files Changed**: [List]
**Risk**: [Low/Medium/High]

## Resolution
**Status**: [Fixed/Pending/Blocked]
**Verified By**: [How tested]
**Commit**: [Hash if applicable]

## Lessons Learned
- [What could prevent similar bugs]
```
