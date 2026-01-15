---
name: skill-builder
description: Creates new Claude Code skills with proper structure, YAML frontmatter, and best practices. Use when asked to "create a skill", "make a new skill", "build a skill", "skill 만들어줘", or "스킬 생성".
---

# Skill Builder

A comprehensive skill for creating well-structured Claude Code skills with proper conventions and best practices.

## When to Use

Invoke this skill when:
- Creating a new skill from scratch
- Converting existing prompts/workflows into reusable skills
- Improving or refactoring existing skills
- Need guidance on skill structure and organization

## Skill Structure Overview

```
.claude/skills/
└── skill-name/
    ├── SKILL.md           # Required: Core skill definition
    ├── scripts/           # Optional: Helper scripts (Python, Bash)
    ├── references/        # Optional: Documentation, guides
    ├── templates/         # Optional: Code/file templates
    └── assets/            # Optional: Binary files, images
```

## SKILL.md Format

### Required YAML Frontmatter

```yaml
---
name: skill-name-kebab-case
description: Clear, trigger-rich description. Include specific phrases that should activate this skill.
---
```

### Description Best Practices

1. **Start with action verb**: "Creates...", "Generates...", "Analyzes..."
2. **Include trigger phrases**: Specific words/phrases that invoke the skill
3. **Be concise**: Under 200 characters ideally
4. **Multi-language support**: Include Korean triggers if needed

**Good Example:**
```yaml
description: Generates unit tests for TypeScript functions. Use when asked to "write tests", "create test cases", "테스트 작성", or "유닛테스트 만들어줘".
```

### Markdown Body Structure

```markdown
# Skill Name

Brief overview of what this skill does.

## When to Use

- Bullet points of scenarios
- Include edge cases

## Core Instructions

Step-by-step process Claude should follow:

1. First action
2. Second action
3. ...

## Input Requirements

What information is needed from the user:
- Required: X, Y
- Optional: Z

## Output Format

Describe expected output structure.

## Examples

### Example 1: Basic Usage
[Show input → output]

### Example 2: Advanced Usage
[Show complex scenario]

## Best Practices

- Guidelines for quality
- Common pitfalls to avoid

## Related Skills

- Link to related skills if applicable
```

## Creating Skills: Step-by-Step Process

### Step 1: Define Purpose
Ask the user:
- What task should this skill automate?
- What triggers should activate it?
- What inputs are required?
- What output format is expected?

### Step 2: Choose Location
- **Global** (`~/.claude/skills/`): Available in all projects
- **Project** (`.claude/skills/`): Project-specific

### Step 3: Create Directory Structure
```bash
mkdir -p ~/.claude/skills/skill-name/{scripts,references,templates}
```

### Step 4: Write SKILL.md
Apply the format above with:
- Strong trigger descriptions
- Clear step-by-step instructions
- Practical examples

### Step 5: Add Resources (Optional)
- **scripts/**: Executable helpers
- **references/**: Documentation to load
- **templates/**: Code snippets, file templates

### Step 6: Test the Skill
- Restart Claude Code or start new session
- Test with various trigger phrases
- Verify output quality

## Helper Script Template

### Python Script Template (scripts/helper.py)
```python
#!/usr/bin/env python3
"""
Skill helper script description.
Usage: python helper.py <args>
"""
import sys
import json

def main():
    if len(sys.argv) < 2:
        print("Usage: python helper.py <input>", file=sys.stderr)
        sys.exit(1)

    input_data = sys.argv[1]
    # Process input
    result = {"status": "success", "data": input_data}
    print(json.dumps(result))

if __name__ == "__main__":
    main()
```

### Bash Script Template (scripts/helper.sh)
```bash
#!/bin/bash
# Skill helper script description
# Usage: ./helper.sh <args>

set -euo pipefail

if [ $# -lt 1 ]; then
    echo "Usage: $0 <input>" >&2
    exit 1
fi

INPUT="$1"
# Process input
echo "Processed: $INPUT"
```

## SKILL.md Template

Use this template when creating new skills:

```markdown
---
name: {skill-name}
description: {action-verb} {what it does}. Use when asked to "{trigger1}", "{trigger2}", "{korean-trigger}".
---

# {Skill Title}

{One-sentence description of the skill's purpose.}

## When to Use

- {Scenario 1}
- {Scenario 2}
- {Scenario 3}

## Instructions

1. {Step 1}
2. {Step 2}
3. {Step 3}

## Input Requirements

- **Required**: {required inputs}
- **Optional**: {optional inputs}

## Output Format

{Describe the expected output format}

## Examples

### Example: {Use Case Name}

**Input**: {example input}

**Output**: {example output}

## Best Practices

- {Practice 1}
- {Practice 2}
```

## Quality Checklist

Before finalizing a skill, verify:

- [ ] Name is kebab-case and descriptive
- [ ] Description includes trigger phrases
- [ ] Korean triggers included if relevant
- [ ] Instructions are clear and numbered
- [ ] Examples demonstrate real usage
- [ ] Helper scripts are executable (`chmod +x`)
- [ ] No sensitive information in skill files

## Advanced Patterns

### Skill with Multiple Agents
If your skill needs to spawn subagents:
```markdown
## Execution Flow

1. Launch `analyzer` agent to examine input
2. Launch `generator` agent to create output
3. Launch `reviewer` agent to validate
```

### Skill with External Tools
Reference bundled scripts:
```markdown
## Using Helper Scripts

Run the validation script:
\`\`\`bash
python ${SKILL_ROOT}/scripts/validate.py input.json
\`\`\`
```

### Conditional Logic
```markdown
## Decision Points

**If input is TypeScript:**
- Use `tsc` for type checking
- Generate `.ts` files

**If input is Python:**
- Use `mypy` for type checking
- Generate `.py` files
```

## Common Mistakes to Avoid

1. **Vague descriptions**: Be specific about triggers
2. **Missing examples**: Always include at least one example
3. **Overly long SKILL.md**: Keep under 5,000 words
4. **No Korean support**: Add Korean triggers for Korean users
5. **Hardcoded paths**: Use relative paths or variables

## Output

When creating a skill, output:
1. Complete SKILL.md content
2. Any required helper scripts
3. Directory creation commands
4. Installation verification steps
