# Skill Development Best Practices

## 1. Naming Conventions

### Skill Directory Name
- Use **kebab-case**: `my-awesome-skill`
- Be descriptive but concise
- Avoid generic names like `helper` or `util`

### YAML `name` Field
- Match the directory name exactly
- No spaces, underscores, or special characters

## 2. Description Writing

### Trigger-Rich Descriptions
The description is crucial for skill discovery. Include:

1. **Action verb first**: What the skill does
2. **Specific triggers**: Phrases that should activate it
3. **Language variants**: Korean/English triggers

**Pattern:**
```
{Verb} {what}. Use when asked to "{trigger1}", "{trigger2}", "{korean}".
```

**Examples:**
```yaml
# Good
description: Generates React components with TypeScript. Use when asked to "create component", "make React component", "리액트 컴포넌트 만들어".

# Bad
description: A skill for React development.
```

## 3. Instruction Clarity

### Use Numbered Steps
```markdown
## Instructions

1. Analyze the input requirements
2. Identify the appropriate template
3. Generate the code structure
4. Add documentation comments
5. Validate the output
```

### Include Decision Points
```markdown
## Instructions

1. Check input type:
   - If TypeScript: Use `.ts` extension
   - If JavaScript: Use `.js` extension
2. Generate code...
```

## 4. Examples Are Essential

### Minimum: One Complete Example
```markdown
## Examples

### Example: Create User Service

**Input:**
```
Create a user service with CRUD operations
```

**Output:**
```typescript
// user.service.ts
export class UserService {
  async create(data: CreateUserDto): Promise<User> { ... }
  async findById(id: string): Promise<User> { ... }
  async update(id: string, data: UpdateUserDto): Promise<User> { ... }
  async delete(id: string): Promise<void> { ... }
}
```
```

### Better: Multiple Examples
- Basic usage
- Edge cases
- Advanced usage

## 5. Keep It Concise

### Target Word Count
- **SKILL.md**: 1,000-3,000 words ideal
- **Maximum**: 5,000 words
- Move detailed docs to `references/`

### Progressive Disclosure
```
SKILL.md          → Core instructions (always loaded)
references/       → Detailed guides (loaded on demand)
examples/         → Working examples (loaded on demand)
```

## 6. Script Best Practices

### Make Scripts Executable
```bash
chmod +x scripts/*.sh scripts/*.py
```

### Use Proper Shebang
```python
#!/usr/bin/env python3
```

```bash
#!/bin/bash
```

### Handle Errors Gracefully
```python
try:
    result = process(input)
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
```

## 7. Testing Your Skill

### Manual Testing Checklist
- [ ] Skill appears in `/context` or skill list
- [ ] Triggers work with various phrasings
- [ ] Instructions are followed correctly
- [ ] Output matches expectations
- [ ] Scripts execute without errors

### Test Phrases to Try
```
"스킬이름 해줘"
"skill-name please"
"I need to {trigger phrase}"
"Can you {trigger phrase}?"
```

## 8. Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Too vague description | Add specific trigger phrases |
| No Korean support | Add Korean trigger phrases |
| Overly complex SKILL.md | Split into references/ |
| Hardcoded paths | Use `${SKILL_ROOT}` or relative paths |
| Missing examples | Add at least one complete example |
| No error handling | Add validation and error messages |

## 9. Maintenance

### Version Your Skills
Add version in frontmatter:
```yaml
---
name: my-skill
description: ...
version: 1.0.0
---
```

### Document Changes
Keep a changelog in `references/CHANGELOG.md`

## 10. Security Considerations

- Never include API keys or secrets
- Validate user inputs in scripts
- Use safe file operations
- Avoid shell injection vulnerabilities
