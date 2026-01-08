---
name: verify-work
description: Use this skill to verify workflow results after ultra-workflow or agentic-dev execution. Triggers on "검증해줘", "확인해줘", "리뷰해줘", PR 제출 전 점검, 코드 품질 확인. Extracts requirements, runs 4 parallel agents, filters issues by confidence, generates evidence-based verification report.
---

# VERIFY-WORK: Post-Workflow Verification Inspector

> 꼼꼼한 검사관 모드 - 워크플로우 결과물의 완전성과 정확성을 검증

## ABSOLUTE RULES (NEVER VIOLATE)

```
+------------------------------------------------------------------------+
|  1. 모든 판정에는 증거(tool output)가 필수                              |
|  2. 신뢰도 임계값 미달 이슈는 보고하지 않음                             |
|  3. Phase Gate 통과 전 다음 단계 진입 금지                              |
|  4. False Positive 최소화 (정확도 > 양)                                |
|  5. 4개 에이전트 병렬 실행 필수 (Phase 2)                              |
+------------------------------------------------------------------------+
```

## 5-Phase Verification Workflow

```
[1.EXTRACT] -> [2.VERIFY] -> [3.SCORE] -> [4.EVIDENCE] -> [5.REPORT]
     |             |             |             |              |
   GATE 1       GATE 2        GATE 3        GATE 4         GATE 5
 (REQ-XXX)   (4 agents)    (filtered)    (artifacts)     (verdict)
```

---

## Phase 1: EXTRACT (요구사항 역추출)

**Gate**: 최소 1개 REQ + 2개 AC 추출

**Sources to Analyze**:
1. 대화 히스토리 (이전 요청 내용)
2. `git log --oneline -20` (최근 커밋 메시지)
3. `git diff HEAD~N` (변경 내역)
4. TodoWrite 이력 (있는 경우)

**Output Format**:
```markdown
## 추출된 요구사항

### REQ-001: [제목]
- 원본 요청: "[사용자가 요청한 내용]"
- Type: Feature | Bug | Refactor
- Priority: P1-Critical | P2-High | P3-Medium

| AC ID | 기준 | 예상 위치 |
|-------|------|-----------|
| AC-001-1 | [테스트 가능한 기준] | [파일:라인] |
| AC-001-2 | [테스트 가능한 기준] | [파일:라인] |
```

---

## Phase 2: VERIFY (4개 병렬 에이전트)

**Gate**: 모든 에이전트 완료 + 결과 통합

**MANDATORY Parallel Execution**:
```yaml
Launch 4 verification agents IN PARALLEL:
  Agent 1 (requirement-extractor): "역추출된 요구사항이 원래 의도와 일치하는지"
  Agent 2 (code-verifier): "코드가 각 AC를 충족하는지"
  Agent 3 (test-auditor): "테스트가 AC를 커버하는지"
  Agent 4 (quality-inspector): "SOLID/보안/성능 이슈 검사"
```

See `./agents/` for detailed agent definitions.

---

## Phase 3: SCORE (신뢰도 기반 필터링)

**Gate**: 모든 이슈에 신뢰도 점수 부여

**Confidence Thresholds**:
```javascript
THRESHOLDS = {
  SECURITY_VULNERABILITY: 0.90,   // 보안: 매우 높은 확신만
  MISSING_REQUIREMENT: 0.85,      // 누락 기능: 높은 확신
  TEST_COVERAGE_GAP: 0.80,        // 테스트 누락: 중간
  CODE_QUALITY: 0.75,             // 코드 품질: 낮은 임계값
  STYLE_SUGGESTION: 0.60          // 스타일: 가장 낮음
}

// 정확도 80% 미만 이슈는 보고하지 않음
if (issue.confidence < THRESHOLDS[issue.type]) {
  issue.filtered = true;
}
```

See `./references/confidence-scoring.md` for details.

---

## Phase 4: EVIDENCE (증거 수집)

**Gate**: 모든 증거 아티팩트 수집

**Required Evidence**:
1. `git diff` 출력 (변경 내역)
2. 테스트 실행 결과 (`npm test`, `pytest` 등)
3. 커버리지 리포트 (가능한 경우)
4. 린터/정적분석 결과 (가능한 경우)

```bash
# Evidence Collection Commands
git diff --stat HEAD~N
git log --oneline -10
npm test 2>&1 || pytest -v 2>&1 || echo "No test runner found"
```

---

## Phase 5: REPORT (최종 판정)

**Gate**: 최종 리포트 생성

**Output Format**:
```markdown
# VERIFICATION REPORT

## Summary
| Metric | Value |
|--------|-------|
| Overall Status | PASS / PARTIAL / FAIL |
| Requirements Coverage | X/Y (Z%) |
| Test Coverage | XX% |
| Critical Issues | N |
| Warnings | N |

## Requirements Verification

### REQ-001: [제목]
| AC | Status | Evidence | Confidence |
|----|--------|----------|------------|
| AC-001-1 | PASS | [file:line] | 95% |
| AC-001-2 | FAIL | Missing test | 88% |

## Issues Found

### CRITICAL (Must Fix)
| ID | Type | Location | Description | Confidence |
|----|------|----------|-------------|------------|
| ISS-001 | SECURITY | auth.js:45 | SQL Injection risk | 92% |

### WARNING (Should Fix)
| ID | Type | Location | Description | Confidence |
|----|------|----------|-------------|------------|
| ISS-002 | QUALITY | utils.js:12 | Duplicate code | 78% |

## Evidence Artifacts
- git diff: [captured]
- test results: [captured]
- coverage: [XX%]

## Verdict

**[PASS/PARTIAL/FAIL]**

### If FAIL:
다음 항목 해결 후 재검증 필요:
1. [ ] ISS-001: SQL Injection 수정
2. [ ] AC-001-2: 테스트 추가

### If PASS:
모든 요구사항이 충족되었습니다. PR 제출 가능.
```

---

## Verdict Criteria

### PASS
- 모든 AC 구현 및 테스트됨
- Critical 이슈 0개
- 커버리지 >= 80% (또는 프로젝트 기준)

### PARTIAL
- 대부분의 AC 충족
- Critical 0개, Warning 1~3개
- 커버리지 >= 70%

### FAIL
- AC 누락 있음
- Critical 이슈 1개 이상
- 커버리지 < 70%

---

## CLI Integration

```bash
# Evidence collection commands
git diff HEAD~5 --stat
git log --oneline -10 --format="%h %s"
npm test 2>&1 | head -50
pytest -v 2>&1 | head -50
```

---

## Supporting Files

- See `./agents/requirement-extractor.md` for requirement extraction agent
- See `./agents/code-verifier.md` for code verification agent
- See `./agents/test-auditor.md` for test audit agent
- See `./agents/quality-inspector.md` for quality inspection agent
- See `./references/verification-checklist.md` for complete checklist
- See `./references/confidence-scoring.md` for scoring methodology

---

## Boundaries

**Will:**
- 모든 5 Phase 순차 실행
- 4개 에이전트 병렬 검증
- 신뢰도 기반 필터링 적용
- 증거 기반 판정

**Will Not:**
- Phase 건너뛰기
- 증거 없이 판정
- 낮은 신뢰도 이슈 보고
- 코드 수정 (검증만 수행)

---

**Version**: 1.0.0
