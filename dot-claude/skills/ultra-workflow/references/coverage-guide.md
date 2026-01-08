# Coverage Guide

## Quick Reference by Language

### Python (pytest-cov)

```bash
# Install
pip install pytest-cov

# Run with coverage
pytest --cov=src --cov-report=term-missing --cov-fail-under=90

# HTML report
pytest --cov=src --cov-report=html
open htmlcov/index.html
```

**pyproject.toml**:
```toml
[tool.coverage.run]
branch = true
source = ["src"]
omit = ["*/tests/*", "*/__pycache__/*"]

[tool.coverage.report]
fail_under = 90
show_missing = true
exclude_lines = [
    "pragma: no cover",
    "if __name__ == .__main__.:",
    "raise NotImplementedError",
]
```

### JavaScript/TypeScript (Jest)

```bash
# Run with coverage
npm test -- --coverage --coverageThreshold='{"global":{"lines":90,"branches":80}}'

# Or in package.json
```

**jest.config.js**:
```javascript
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/__mocks__/',
  ],
};
```

### TypeScript (Vitest)

```bash
# Run with coverage
npx vitest --coverage
```

**vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      threshold: {
        lines: 90,
        branches: 80,
        functions: 90,
        statements: 90,
      },
    },
  },
});
```

### Go

```bash
# Run with coverage
go test -coverprofile=coverage.out ./...

# View coverage
go tool cover -func=coverage.out

# HTML report
go tool cover -html=coverage.out -o coverage.html

# Fail if under threshold (script)
COVERAGE=$(go tool cover -func=coverage.out | grep total | awk '{print $3}' | sed 's/%//')
if (( $(echo "$COVERAGE < 90" | bc -l) )); then
    echo "Coverage $COVERAGE% is below 90%"
    exit 1
fi
```

### Rust

```bash
# Using cargo-tarpaulin
cargo install cargo-tarpaulin
cargo tarpaulin --fail-under 90

# Using llvm-cov
cargo install cargo-llvm-cov
cargo llvm-cov --fail-under-lines 90
```

### Java (JaCoCo with Maven)

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
        <execution>
            <id>check</id>
            <goals>
                <goal>check</goal>
            </goals>
            <configuration>
                <rules>
                    <rule>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.90</minimum>
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

## Coverage Types

| Type | What it measures | Target |
|------|------------------|--------|
| Line | Lines executed | 90%+ |
| Branch | Decision paths (if/else) | 80%+ |
| Function | Functions called | 90%+ |
| Statement | Statements executed | 90%+ |

## Detecting Test Framework

```bash
# Auto-detect and run appropriate coverage
detect_and_run_coverage() {
    if [ -f "pytest.ini" ] || [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
        pytest --cov --cov-fail-under=90
    elif [ -f "package.json" ]; then
        if grep -q "vitest" package.json; then
            npx vitest --coverage
        else
            npm test -- --coverage
        fi
    elif [ -f "go.mod" ]; then
        go test -coverprofile=c.out ./... && go tool cover -func=c.out
    elif [ -f "Cargo.toml" ]; then
        cargo tarpaulin --fail-under 90
    elif [ -f "pom.xml" ]; then
        mvn test jacoco:report
    else
        echo "Unknown project type"
        exit 1
    fi
}
```

## What NOT to Cover

Exclude from coverage calculation:
- Test files themselves
- Configuration files
- Type definitions (TypeScript .d.ts)
- Generated code
- Third-party code
- Debug/logging code (pragmatic)

## Meaningful vs Gaming Coverage

### Bad: Gaming Coverage
```python
# This passes coverage but tests nothing useful
def test_user_model():
    user = User(name="test")  # Line executed ✓
    str(user)                  # Line executed ✓
    # No assertions!
```

### Good: Meaningful Coverage
```python
def test_user_email_validation():
    user = User(name="test", email="invalid")
    assert user.is_valid() == False
    assert "email" in user.errors
    
def test_user_email_accepts_valid():
    user = User(name="test", email="test@example.com")
    assert user.is_valid() == True
```

## Coverage Report Interpretation

```
Name                      Stmts   Miss Branch BrPart  Cover   Missing
----------------------------------------------------------------------
src/auth/login.py            50      5     20      3    88%   45-49, 67
src/auth/logout.py           20      0      8      0   100%
src/users/service.py         80     12     30      5    82%   23-30, 55-60
----------------------------------------------------------------------
TOTAL                       150     17     58      8    88%
```

Key columns:
- **Stmts**: Total statements
- **Miss**: Uncovered statements
- **Branch**: Total branch points
- **BrPart**: Partially covered branches
- **Missing**: Line numbers to cover

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Coverage stuck at 0% | Check source path configuration |
| Tests pass but coverage low | Add edge case tests |
| Branch coverage low | Test both if/else paths |
| Coverage tool not found | Install: pip/npm install |
