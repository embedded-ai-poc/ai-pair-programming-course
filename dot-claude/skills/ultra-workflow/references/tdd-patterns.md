# TDD Patterns Reference

## The Three Laws of TDD

1. **Write no production code without a failing test**
2. **Write only enough test to fail** (compilation failures count)
3. **Write only enough code to pass the test**

## Common Test Patterns

### Arrange-Act-Assert (AAA)

```python
def test_user_creation():
    # Arrange
    email = "test@example.com"
    password = "secure123"
    
    # Act
    user = create_user(email, password)
    
    # Assert
    assert user.email == email
    assert user.is_active == True
```

### Given-When-Then (BDD Style)

```python
def test_login_with_valid_credentials():
    # Given a registered user
    user = User.create(email="test@example.com", password="pass123")
    
    # When they attempt to login
    result = login(email="test@example.com", password="pass123")
    
    # Then they should receive a valid token
    assert result.success == True
    assert result.token is not None
```

## Test Naming Conventions

### Pattern: `test_[unit]_[scenario]_[expected]`

```python
# Good
def test_calculator_divide_by_zero_raises_error():
def test_user_login_with_wrong_password_returns_unauthorized():
def test_order_total_with_discount_applies_percentage():

# Bad
def test_divide():
def test_login():
def test_order():
```

## Edge Cases Checklist

Always test:
- [ ] Empty input
- [ ] Null/None input
- [ ] Boundary values (0, -1, MAX_INT)
- [ ] Invalid types
- [ ] Concurrent access (if applicable)
- [ ] Network failures (if applicable)
- [ ] Timeout scenarios

## Red-Green-Refactor Examples

### Example 1: Calculator

```python
# RED: Write failing test
def test_add_two_numbers():
    calc = Calculator()
    assert calc.add(2, 3) == 5  # Fails: Calculator doesn't exist

# GREEN: Minimal implementation
class Calculator:
    def add(self, a, b):
        return a + b  # Just enough to pass

# REFACTOR: Improve (if needed)
# In this case, code is already clean
```

### Example 2: User Validation

```python
# RED: Write failing test
def test_email_validation_rejects_invalid_format():
    validator = EmailValidator()
    assert validator.is_valid("not-an-email") == False

# GREEN: Minimal implementation
class EmailValidator:
    def is_valid(self, email):
        return "@" in email  # Minimal!

# RED: Add another test
def test_email_validation_requires_domain():
    validator = EmailValidator()
    assert validator.is_valid("test@") == False  # Fails!

# GREEN: Extend implementation
class EmailValidator:
    def is_valid(self, email):
        if "@" not in email:
            return False
        parts = email.split("@")
        return len(parts) == 2 and len(parts[1]) > 0

# REFACTOR: Use regex for clarity
import re
class EmailValidator:
    EMAIL_PATTERN = re.compile(r'^[^@]+@[^@]+\.[^@]+$')
    
    def is_valid(self, email):
        return bool(self.EMAIL_PATTERN.match(email))
```

## Mocking Strategies

### When to Mock

- External services (APIs, databases, file system)
- Time-dependent operations
- Random number generation
- Expensive computations (for unit tests)

### When NOT to Mock

- The unit under test
- Simple value objects
- Everything (leads to brittle tests)

### Mock Example

```python
from unittest.mock import Mock, patch

def test_payment_service_calls_gateway():
    # Mock external dependency
    mock_gateway = Mock()
    mock_gateway.charge.return_value = {"success": True, "id": "txn_123"}
    
    service = PaymentService(gateway=mock_gateway)
    result = service.process_payment(amount=100)
    
    mock_gateway.charge.assert_called_once_with(100)
    assert result.transaction_id == "txn_123"
```

## Test Isolation

Each test must:
1. Set up its own data
2. Not depend on other tests
3. Clean up after itself
4. Be runnable in any order

```python
class TestUserService:
    def setup_method(self):
        """Run before each test"""
        self.db = create_test_database()
        self.service = UserService(self.db)
    
    def teardown_method(self):
        """Run after each test"""
        self.db.clear()
    
    def test_create_user(self):
        # Test is isolated
        user = self.service.create("test@example.com")
        assert user is not None
```

## TDD Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Test After | Biased tests | Always test first |
| Giant Tests | Hard to debug | One assertion per test |
| Shared State | Flaky tests | Isolate completely |
| Testing Impl | Brittle tests | Test behavior only |
| No Refactor | Tech debt | Always refactor phase |
