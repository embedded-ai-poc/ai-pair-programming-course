#!/bin/bash
#
# Validate a Claude Code skill structure
#
# Usage:
#   ./validate-skill.sh <skill-directory>
#
# Example:
#   ./validate-skill.sh ~/.claude/skills/my-skill
#

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_pass() { echo -e "${GREEN}[PASS]${NC} $1"; }
log_fail() { echo -e "${RED}[FAIL]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

ERRORS=0
WARNINGS=0

check_pass() {
    log_pass "$1"
}

check_fail() {
    log_fail "$1"
    ((ERRORS++))
}

check_warn() {
    log_warn "$1"
    ((WARNINGS++))
}

if [[ $# -lt 1 ]]; then
    echo "Usage: $0 <skill-directory>"
    exit 1
fi

SKILL_DIR="$1"

echo "Validating skill: $SKILL_DIR"
echo "================================"

# Check directory exists
if [[ ! -d "$SKILL_DIR" ]]; then
    check_fail "Directory does not exist: $SKILL_DIR"
    exit 1
fi

# Check SKILL.md exists
SKILL_MD="$SKILL_DIR/SKILL.md"
if [[ -f "$SKILL_MD" ]]; then
    check_pass "SKILL.md exists"
else
    check_fail "SKILL.md not found"
    exit 1
fi

# Check YAML frontmatter
if head -1 "$SKILL_MD" | grep -q "^---$"; then
    check_pass "YAML frontmatter present"
else
    check_fail "Missing YAML frontmatter (must start with ---)"
fi

# Check name field
if grep -q "^name:" "$SKILL_MD"; then
    NAME=$(grep "^name:" "$SKILL_MD" | head -1 | sed 's/name:\s*//')
    if [[ "$NAME" =~ ^[a-z][a-z0-9-]*$ ]]; then
        check_pass "Name is valid kebab-case: $NAME"
    else
        check_warn "Name should be kebab-case: $NAME"
    fi
else
    check_fail "Missing 'name' field in frontmatter"
fi

# Check description field
if grep -q "^description:" "$SKILL_MD"; then
    DESC=$(grep "^description:" "$SKILL_MD" | head -1)
    DESC_LEN=${#DESC}
    if [[ $DESC_LEN -gt 50 ]]; then
        check_pass "Description present ($DESC_LEN chars)"
    else
        check_warn "Description may be too short ($DESC_LEN chars)"
    fi

    # Check for trigger phrases
    if echo "$DESC" | grep -qi "use when\|when asked\|trigger"; then
        check_pass "Description includes trigger phrases"
    else
        check_warn "Consider adding trigger phrases to description"
    fi
else
    check_fail "Missing 'description' field in frontmatter"
fi

# Check file size
SIZE=$(wc -w < "$SKILL_MD")
if [[ $SIZE -lt 5000 ]]; then
    check_pass "SKILL.md size is reasonable ($SIZE words)"
else
    check_warn "SKILL.md may be too large ($SIZE words, recommend < 5000)"
fi

# Check for examples section
if grep -qi "## example\|## 예제" "$SKILL_MD"; then
    check_pass "Examples section present"
else
    check_warn "Consider adding an Examples section"
fi

# Check scripts are executable
if [[ -d "$SKILL_DIR/scripts" ]]; then
    for script in "$SKILL_DIR/scripts"/*.{sh,py} 2>/dev/null; do
        if [[ -f "$script" ]]; then
            if [[ -x "$script" ]]; then
                check_pass "Script is executable: $(basename "$script")"
            else
                check_warn "Script not executable: $(basename "$script")"
            fi
        fi
    done
fi

echo "================================"
echo "Validation complete: $ERRORS errors, $WARNINGS warnings"

if [[ $ERRORS -gt 0 ]]; then
    exit 1
else
    exit 0
fi
