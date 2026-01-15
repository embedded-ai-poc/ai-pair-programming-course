# debug-master

A systematic debugging pipeline with parallel multi-agent analysis for efficient root cause identification and resolution.

## Metadata

```yaml
name: debug-master
description: Systematic debugging pipeline with parallel analysis using multi-agent architecture
version: 1.0.0
triggers:
  - debug
  - bug
  - error
  - fix
  - issue
  - 문제
  - 버그
  - 에러
auto_triggers:
  - "error"
  - "bug"
  - "exception"
  - "crash"
  - "not working"
  - "broken"
```

## Overview

This skill implements a 7-phase debugging pipeline that leverages parallel multi-agent analysis to quickly identify root causes and propose effective solutions. The architecture ensures thorough investigation while minimizing debugging time.

## Pipeline Phases

### Phase 1: Problem Definition
**Goal**: Clearly understand the issue from the user's perspective.

**Actions**:
1. Parse user's problem description
2. Identify key symptoms mentioned
3. Note any error messages provided
4. Understand expected vs actual behavior
5. Determine severity and impact

**Output**: Structured problem statement with:
- Problem summary
- Symptoms list
- Error messages (if any)
- Expected behavior
- Actual behavior
- Severity assessment

### Phase 2: Parallel Analysis
**Goal**: Gather comprehensive information through simultaneous investigation.

Launch THREE parallel analysis agents using the Task tool:

#### Agent 1: problem-analyzer
- Analyze symptoms and error patterns
- Identify reproduction steps
- Categorize the type of bug
- See: `agents/problem-analyzer.md`

#### Agent 2: code-analyzer
- Find relevant source files
- Trace execution flow
- Identify suspicious code areas
- Check for common anti-patterns
- See: `agents/code-analyzer.md`

#### Agent 3: git-historian
- Analyze recent commits
- Find related changes
- Identify potential regression points
- Check for correlated issues
- See: `agents/git-historian.md`

**Parallel Execution**:
```
Use Task tool to launch all three agents simultaneously:
- Task 1: Run problem-analyzer with symptom context
- Task 2: Run code-analyzer with relevant file paths
- Task 3: Run git-historian with time range and file scope
```

### Phase 3: Information Synthesis
**Goal**: Combine findings from all analysis agents.

**Actions**:
1. Collect results from all three agents
2. Identify overlapping findings
3. Correlate symptoms with code areas
4. Map timeline of changes to symptom onset
5. Build unified investigation report

**Output**: Synthesis report containing:
- Key findings from each agent
- Correlation matrix
- Timeline of relevant events
- Confidence scores for each finding

### Phase 4: Root Cause Analysis
**Goal**: Form and rank hypotheses about the root cause.

**Actions**:
1. Generate hypotheses based on synthesis
2. Evaluate each hypothesis against evidence
3. Assign confidence levels (High/Medium/Low)
4. Consider multiple potential causes
5. Document reasoning chain

**Hypothesis Template**:
```
Hypothesis: [Description]
Evidence For: [Supporting findings]
Evidence Against: [Contradicting findings]
Confidence: [High/Medium/Low] - [Percentage]
Verification Steps: [How to confirm]
```

### Phase 5: User Clarification
**Goal**: Ask targeted questions only when truly needed.

**When to Ask**:
- Multiple hypotheses with similar confidence
- Missing critical reproduction information
- Ambiguous error context
- Environment-specific concerns

**Question Guidelines**:
- Ask maximum 3 questions at a time
- Make questions specific and actionable
- Provide context for why the question matters
- Offer multiple-choice options when possible

**Skip this phase if**:
- High-confidence root cause identified (>80%)
- All necessary information is available
- Evidence strongly points to single cause

### Phase 6: Solution Proposal
**Goal**: Suggest fixes with confidence levels and trade-offs.

**Actions**:
1. Generate solution for each viable hypothesis
2. Evaluate implementation complexity
3. Assess risk of each solution
4. Consider side effects
5. Prioritize by effectiveness and safety

**Solution Template**:
```
Solution [N]: [Title]
Target Hypothesis: [Which root cause this addresses]
Confidence: [Percentage]
Implementation Complexity: [Low/Medium/High]
Risk Level: [Low/Medium/High]
Description: [What the fix does]
Files to Modify: [List of files]
Side Effects: [Potential impacts]
Rollback Plan: [How to undo if needed]
```

### Phase 7: Implementation
**Goal**: Apply the fix with user approval.

**Actions**:
1. Present recommended solution(s) to user
2. Await user approval or modification request
3. Implement the approved fix
4. Add appropriate tests if applicable
5. Verify the fix resolves the issue
6. Document the resolution

**Implementation Checklist**:
- [ ] User approved the solution
- [ ] Backup/branch created if needed
- [ ] Changes implemented
- [ ] Tests added/updated
- [ ] Fix verified locally
- [ ] No new issues introduced

## Execution Instructions

When this skill is triggered, follow these steps:

### Step 1: Initial Assessment
```
Read the user's problem description carefully.
Extract:
- What is broken?
- When did it start?
- Any error messages?
- Can it be reproduced?
```

### Step 2: Launch Parallel Agents
```
Use Task tool to run three parallel investigations:

Task 1 - Problem Analyzer:
"Analyze the following bug symptoms: [symptoms]
Error messages: [errors]
Expected behavior: [expected]
Actual behavior: [actual]
Follow the problem-analyzer agent instructions."

Task 2 - Code Analyzer:
"Investigate code related to: [feature/component]
Search for: [relevant patterns]
Check files: [suspected files]
Follow the code-analyzer agent instructions."

Task 3 - Git Historian:
"Analyze git history for: [affected area]
Time range: [when issue started or last known working]
Focus on: [relevant files/functions]
Follow the git-historian agent instructions."
```

### Step 3: Synthesize Results
After all agents complete, combine their findings:
- Create correlation matrix
- Identify strongest leads
- Note any conflicts in findings

### Step 4: Form Hypotheses
Based on synthesis, create ranked hypotheses:
- Assign confidence percentages
- Document evidence chains
- Identify verification steps

### Step 5: Decide on Clarification
Evaluate if clarification is needed:
- If highest confidence > 80%, proceed to solutions
- If multiple hypotheses within 10%, ask for clarification
- Maximum 3 targeted questions

### Step 6: Propose Solutions
Present solutions in order of recommendation:
- Include confidence levels
- Explain trade-offs
- Provide implementation details

### Step 7: Implement with Approval
Wait for user to approve, then:
- Make the changes
- Test if possible
- Report results

## References

- See `references/debugging-patterns.md` for common bug patterns
- See `references/analysis-checklist.md` for systematic checklist

## Output Format

Always structure your debugging output as:

```
## Debug Session: [Issue Title]

### Phase 1: Problem Definition
[Structured problem statement]

### Phase 2: Parallel Analysis
[Results from each agent]

### Phase 3: Synthesis
[Combined findings and correlations]

### Phase 4: Root Cause Hypotheses
[Ranked hypotheses with confidence]

### Phase 5: Clarification (if needed)
[Targeted questions or "Skipped - high confidence"]

### Phase 6: Proposed Solutions
[Ranked solutions with details]

### Phase 7: Implementation
[Status and results]
```

## Best Practices

1. **Be Systematic**: Follow the pipeline even for "obvious" bugs
2. **Parallelize**: Always run analysis agents simultaneously
3. **Quantify Confidence**: Use percentages, not just High/Medium/Low
4. **Document Evidence**: Show your reasoning for hypotheses
5. **Minimize Questions**: Only ask when truly needed
6. **Consider Multiple Causes**: Bugs often have multiple contributing factors
7. **Test Fixes**: Verify solutions before declaring success
8. **Learn from Resolution**: Document patterns for future reference
