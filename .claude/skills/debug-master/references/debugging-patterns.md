# Debugging Patterns Reference

A comprehensive reference of common bug patterns, their symptoms, detection strategies, and resolution approaches.

## Bug Pattern Categories

### 1. Null/Undefined Reference Bugs

#### Pattern: Null Pointer Dereference
**Symptoms**:
- "Cannot read property 'X' of null/undefined"
- "NullPointerException"
- "TypeError: X is not a function"
- Crashes on specific data conditions

**Detection Strategy**:
```
1. Search for: variable access without null checks
2. Look for: optional chaining missing (?.)
3. Check: API responses assumed to always exist
4. Find: function returns that may be null
```

**Common Locations**:
- API response handling
- Database query results
- Configuration access
- DOM element access
- Object destructuring

**Resolution Pattern**:
```javascript
// Before (buggy)
const name = user.profile.name;

// After (safe)
const name = user?.profile?.name ?? 'Unknown';
```

---

### 2. Asynchronous/Concurrency Bugs

#### Pattern: Race Condition
**Symptoms**:
- Intermittent failures
- "Works sometimes"
- Different results on different runs
- State appears corrupted randomly

**Detection Strategy**:
```
1. Search for: shared mutable state
2. Look for: async operations modifying same data
3. Check: missing await/then chains
4. Find: state reads between async operations
```

**Common Locations**:
- Multi-threaded data access
- Async state updates
- Event handler timing
- Cache invalidation
- Database transactions

**Resolution Pattern**:
```javascript
// Before (race condition)
let count = 0;
async function increment() {
  const current = count;
  await someAsyncOp();
  count = current + 1;
}

// After (atomic)
async function increment() {
  await mutex.acquire();
  try {
    count++;
  } finally {
    mutex.release();
  }
}
```

#### Pattern: Deadlock
**Symptoms**:
- Application hangs indefinitely
- No error messages
- High CPU or 0% CPU
- Thread dump shows waiting threads

**Detection Strategy**:
```
1. Search for: nested lock acquisitions
2. Look for: circular wait patterns
3. Check: resource acquisition order
4. Find: blocking calls inside locks
```

---

### 3. Memory and Resource Bugs

#### Pattern: Memory Leak
**Symptoms**:
- Gradual performance degradation
- Out of memory errors over time
- Increasing memory usage
- GC pressure increasing

**Detection Strategy**:
```
1. Search for: event listeners not removed
2. Look for: growing arrays/maps
3. Check: closures capturing large objects
4. Find: missing cleanup in unmount/destroy
```

**Common Locations**:
- Event listener registration
- Interval/timeout not cleared
- Closure references
- Global state accumulation
- Cache without eviction

**Resolution Pattern**:
```javascript
// Before (leak)
componentDidMount() {
  window.addEventListener('resize', this.handleResize);
}

// After (proper cleanup)
componentDidMount() {
  window.addEventListener('resize', this.handleResize);
}
componentWillUnmount() {
  window.removeEventListener('resize', this.handleResize);
}
```

#### Pattern: Resource Exhaustion
**Symptoms**:
- "Too many open files"
- Connection pool exhausted
- Timeout errors
- Gradual failure rate increase

**Detection Strategy**:
```
1. Search for: opened resources without close
2. Look for: missing finally blocks
3. Check: error paths that skip cleanup
4. Find: unbounded resource acquisition
```

---

### 4. Logic Bugs

#### Pattern: Off-by-One Error
**Symptoms**:
- Missing first/last element
- Array index out of bounds
- Infinite loops
- Fence post errors

**Detection Strategy**:
```
1. Search for: loop conditions with <=, <, >=, >
2. Look for: array index calculations
3. Check: boundary condition handling
4. Find: string substring operations
```

**Common Locations**:
- Loop boundaries
- Array slicing
- Pagination
- Range calculations
- Date calculations

**Resolution Pattern**:
```python
# Before (off-by-one)
for i in range(1, len(array)):  # Misses first element
    process(array[i])

# After (correct)
for i in range(len(array)):
    process(array[i])
```

#### Pattern: Incorrect Boolean Logic
**Symptoms**:
- Feature works "backwards"
- Conditions trigger unexpectedly
- Filters include/exclude wrong items
- Access control failures

**Detection Strategy**:
```
1. Search for: complex boolean expressions
2. Look for: negated conditions
3. Check: AND vs OR confusion
4. Find: missing parentheses in logic
```

**Resolution Pattern**:
```javascript
// Before (wrong logic)
if (!isAdmin && !isModerator) {
  allowAccess();  // Wrong: allows non-admins
}

// After (correct)
if (isAdmin || isModerator) {
  allowAccess();
}
```

---

### 5. Data Handling Bugs

#### Pattern: Type Coercion Issues
**Symptoms**:
- "0" treated as false
- String concatenation instead of addition
- Unexpected NaN results
- Comparison failures

**Detection Strategy**:
```
1. Search for: == instead of ===
2. Look for: + operator with mixed types
3. Check: boolean conversion of strings
4. Find: number parsing without validation
```

**Common Locations**:
- Form input handling
- API data processing
- Configuration parsing
- Database result handling
- URL parameter processing

**Resolution Pattern**:
```javascript
// Before (coercion bug)
if (userInput == 0) { }  // "0" is truthy but equals 0

// After (explicit)
if (Number(userInput) === 0) { }
```

#### Pattern: Data Truncation/Overflow
**Symptoms**:
- Data appears corrupted
- Numbers wrap around
- Strings cut off
- Dates in wrong century

**Detection Strategy**:
```
1. Search for: integer type limits
2. Look for: string length constraints
3. Check: database column sizes
4. Find: numeric precision issues
```

---

### 6. Error Handling Bugs

#### Pattern: Swallowed Exceptions
**Symptoms**:
- Silent failures
- "Nothing happens" reports
- State inconsistency
- Missing error messages

**Detection Strategy**:
```
1. Search for: empty catch blocks
2. Look for: catch without rethrow
3. Check: generic exception handlers
4. Find: .catch() without error handling
```

**Common Locations**:
- Try-catch blocks
- Promise chains
- Event handlers
- Background jobs
- Third-party integrations

**Resolution Pattern**:
```javascript
// Before (swallowed)
try {
  await riskyOperation();
} catch (e) {
  // Silent failure
}

// After (proper handling)
try {
  await riskyOperation();
} catch (e) {
  logger.error('Operation failed', e);
  throw new AppError('Operation failed', { cause: e });
}
```

#### Pattern: Incomplete Error Recovery
**Symptoms**:
- Partial state after errors
- Inconsistent data
- System in bad state after failure
- Retry doesn't help

**Detection Strategy**:
```
1. Search for: partial operations before error check
2. Look for: missing rollback logic
3. Check: cleanup in error paths
4. Find: state mutations before async calls
```

---

### 7. Integration Bugs

#### Pattern: API Contract Violation
**Symptoms**:
- 400/500 errors from services
- Deserialization failures
- Missing required fields
- Version mismatch errors

**Detection Strategy**:
```
1. Search for: API call construction
2. Look for: request/response mapping
3. Check: API version in requests
4. Find: schema validation
```

**Common Locations**:
- REST API calls
- GraphQL queries
- Message queue producers
- Webhook handlers
- Third-party SDK usage

#### Pattern: Timeout/Retry Issues
**Symptoms**:
- Intermittent failures
- Duplicate operations
- Inconsistent responses
- Cascade failures

**Detection Strategy**:
```
1. Search for: timeout configurations
2. Look for: retry logic
3. Check: idempotency handling
4. Find: circuit breaker patterns
```

---

### 8. Configuration Bugs

#### Pattern: Environment Mismatch
**Symptoms**:
- "Works on my machine"
- Different behavior in prod
- Missing environment variables
- Wrong service endpoints

**Detection Strategy**:
```
1. Search for: environment variable access
2. Look for: hardcoded values
3. Check: environment-specific configs
4. Find: default value handling
```

**Common Locations**:
- Environment variables
- Configuration files
- Feature flags
- Service discovery
- Secrets management

**Resolution Pattern**:
```javascript
// Before (missing default)
const apiUrl = process.env.API_URL;

// After (with validation)
const apiUrl = process.env.API_URL;
if (!apiUrl) {
  throw new Error('API_URL environment variable is required');
}
```

---

## Detection Cheat Sheet

| Bug Type | Search Pattern | Priority Check |
|----------|---------------|----------------|
| Null Deref | `\.(\w+)` without `\?\.` | Recent variable access |
| Race Condition | `async.*await` with shared state | State modifications |
| Memory Leak | `addEventListener` without `remove` | Event handlers |
| Off-by-One | `< length` vs `<= length` | Loop boundaries |
| Type Coercion | `==` without `===` | Comparisons |
| Swallowed Error | `catch.*\{\s*\}` | Empty catch blocks |
| API Issue | `fetch\|axios\|http` | External calls |
| Config Bug | `process\.env\|config\.` | Environment access |

## Resolution Priority Matrix

| Severity | Frequency | Priority | Action |
|----------|-----------|----------|--------|
| High | High | P0 | Immediate fix |
| High | Low | P1 | Fix this sprint |
| Low | High | P1 | Fix this sprint |
| Low | Low | P2 | Scheduled fix |

## Quick Diagnosis Flowchart

```
1. Is it reproducible?
   ├── No → Likely: Race condition, timing issue, environment
   └── Yes → Continue

2. Is there an error message?
   ├── No → Likely: Logic error, silent failure, wrong output
   └── Yes → Analyze error type

3. Does it depend on data?
   ├── No → Likely: Logic error, configuration
   └── Yes → Likely: Null handling, validation, edge case

4. Is it environment-specific?
   ├── No → Likely: Code bug
   └── Yes → Likely: Configuration, dependency, resource

5. Did it work before?
   ├── No → Likely: Original bug, design flaw
   └── Yes → Likely: Regression, check recent changes
```
