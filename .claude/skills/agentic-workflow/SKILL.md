---
name: agentic-workflow
description: |
  Autonomous development workflow that enforces completion through parallel agents and verification gates.
  Combines feature-dev structure, ralph-loop persistence, hookify enforcement, and verify-work validation.

  Triggers: /aw, agentic, autonomous workflow, 자율개발, 에이전틱
---

# AGENTIC-WORKFLOW: Autonomous Development Pipeline

> **"완료될 때까지 멈추지 않는 AI 개발 파이프라인"**
> feature-dev + ralph-loop + hookify + verify-work 통합

## ABSOLUTE RULES

```
+------------------------------------------------------------------------+
|  1. Phase Gate 통과 전 다음 단계 진행 불가                               |
|  2. 검증 실패 시 자동으로 이전 Phase 재시도 (max 3회)                    |
|  3. 병렬 에이전트는 반드시 동시 실행 (Task 도구 병렬 호출)               |
|  4. 모든 요구사항(REQ-XXX)에 대해 AC 충족 검증 필수                      |
|  5. 3회 연속 실패 시 사용자에게 개입 요청 (AskUserQuestion)              |
+------------------------------------------------------------------------+
```

## 6-Phase Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 1      PHASE 2       PHASE 3        PHASE 4       PHASE 5       │
│  DISCOVER  →  EXPLORE   →   DESIGN     →   IMPLEMENT  →  VERIFY        │
│     │            │             │               │            │          │
│   GATE 1      GATE 2        GATE 3          GATE 4       GATE 5        │
│  (요구사항)   (코드이해)    (설계승인)      (구현완료)    (검증통과)    │
│                                                 ↑            │          │
│                                                 └────────────┘          │
│                                              FAIL 시 자동 루프백        │
│                                                                         │
│  검증 통과 시 → PHASE 6: COMPLETE (완료 보고서)                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: DISCOVER (요구사항 발견)

**Goal**: 무엇을 만들어야 하는지 명확히 이해
**Gate**: REQ-XXX 1개+ & AC-XXX 2개+ 정의됨 & 사용자 승인

### Actions

1. **사용자 요청 분석**
   - 초기 요청 파싱
   - 암묵적 요구사항 도출

2. **명확화 질문** (AskUserQuestion)
   - 모호한 부분 질문
   - 엣지 케이스 확인
   - 제약 조건 파악

3. **요구사항 구조화**
   ```markdown
   ## REQ-001: [제목]
   - Description: [설명]
   - Priority: P1 | P2 | P3

   ### Acceptance Criteria
   | AC ID | 기준 | 검증 방법 |
   |-------|------|-----------|
   | AC-001-1 | [구체적 기준] | [어떻게 확인] |
   | AC-001-2 | [구체적 기준] | [어떻게 확인] |
   ```

4. **사용자 승인 요청**

### Gate Check
```
- [ ] requirements.length >= 1
- [ ] each REQ has >= 2 ACs
- [ ] user_approved == true
```

---

## Phase 2: EXPLORE (코드베이스 탐색)

**Goal**: 기존 코드 패턴과 구조 완전 이해
**Gate**: 핵심 파일 5개+ 식별 & 패턴 문서화

### Actions

1. **3개 Explorer 에이전트 병렬 실행**

   ```yaml
   # Task 도구로 동시에 3개 실행
   Explorer 1 (similar-features):
     prompt: |
       기능 "[feature]"과 유사한 기존 구현을 찾아 분석하라.
       - 비슷한 패턴과 구현 방식 파악
       - 핵심 파일 5-10개 목록 제공
       - 재사용 가능한 코드/패턴 식별

   Explorer 2 (architecture):
     prompt: |
       "[feature area]" 관련 아키텍처를 분석하라.
       - 레이어 구조 (presentation → business → data)
       - 데이터 흐름 추적
       - 핵심 추상화 및 인터페이스

   Explorer 3 (testing-patterns):
     prompt: |
       테스트 패턴과 확장점을 분석하라.
       - 기존 테스트 구조와 패턴
       - 테스트 프레임워크 및 유틸리티
       - 커버리지 현황
   ```

2. **에이전트가 식별한 핵심 파일 읽기**
   - 모든 에이전트가 반환한 파일 목록 취합
   - Read 도구로 핵심 파일들 상세 분석

3. **탐색 결과 종합**
   ```markdown
   ## Codebase Analysis

   ### Key Files (file:line)
   1. src/auth/login.ts:45 - 로그인 로직
   2. src/api/client.ts:20 - API 클라이언트
   ...

   ### Patterns Found
   - [패턴명]: [설명] - [file:line]

   ### Reusable Components
   - [컴포넌트]: [용도]
   ```

### Gate Check
```
- [ ] key_files.length >= 5
- [ ] patterns documented
- [ ] all 3 explorer agents completed
```

---

## Phase 3: DESIGN (설계)

**Goal**: 최적의 구현 방안 설계 및 사용자 승인
**Gate**: 사용자가 설계 방안 선택함

### Actions

1. **3개 Architect 에이전트 병렬 실행**

   ```yaml
   Architect 1 (minimal):
     prompt: |
       "최소 변경" 접근법으로 설계하라.
       - 기존 코드 최대 재사용
       - 가장 작은 변경 범위
       - 빠른 구현 가능

       Output: 파일별 변경 계획, 구체적 구현 단계

   Architect 2 (clean):
     prompt: |
       "클린 아키텍처" 접근법으로 설계하라.
       - 베스트 프랙티스 적용
       - 유지보수성 극대화
       - 확장성 고려

       Output: 파일별 변경 계획, 구체적 구현 단계

   Architect 3 (pragmatic): # 권장
     prompt: |
       "실용적 균형" 접근법으로 설계하라.
       - 속도와 품질의 균형
       - 현실적인 트레이드오프
       - 팀 컨텍스트 고려

       Output: 파일별 변경 계획, 구체적 구현 단계
   ```

2. **접근법 비교 및 추천**
   ```markdown
   ## Design Approaches

   | 접근법 | 장점 | 단점 | 변경 파일 | 복잡도 |
   |--------|------|------|-----------|--------|
   | Minimal | 빠름 | 기술부채 | 3개 | Low |
   | Clean | 유지보수 | 시간 | 7개 | High |
   | Pragmatic | 균형 | - | 5개 | Medium |

   **추천**: Pragmatic (이유: ...)
   ```

3. **사용자 선택 요청** (AskUserQuestion)
   - 각 접근법 요약 제시
   - 추천 사항 포함
   - 사용자 선택 대기

### Gate Check
```
- [ ] all 3 architect agents completed
- [ ] design_approach selected
- [ ] user_approved == true
```

---

## Phase 4: IMPLEMENT (구현)

**Goal**: 선택된 설계에 따라 코드 구현
**Gate**: 모든 AC가 코드로 구현됨

### Actions

1. **TodoWrite로 구현 단계 추적**
   ```
   - [ ] AC-001-1: [구체적 구현 내용]
   - [ ] AC-001-2: [구체적 구현 내용]
   - [ ] AC-002-1: [구체적 구현 내용]
   ```

2. **AC별 순차 구현**
   - 선택된 설계 문서 참조
   - 코드베이스 컨벤션 준수
   - 각 AC 완료 시 TodoWrite 업데이트

3. **구현 완료 선언**
   - 모든 AC 체크
   - Phase 5로 전환

### Gate Check
```
- [ ] all ACs implemented
- [ ] no compilation errors
- [ ] code follows conventions
```

### On Error: 자동 재시도
- 구현 중 오류 발생 시 해당 AC 재시도
- 동일 오류 3회 반복 시 사용자 개입 요청

---

## Phase 5: VERIFY (검증) ★ 핵심 ★

**Goal**: 모든 요구사항이 올바르게 구현되었는지 검증
**Gate**: Critical 이슈 0개 & AC 커버리지 100%

### Actions

1. **4개 Verifier 에이전트 병렬 실행**

   ```yaml
   Verifier 1 (requirement-matcher):
     prompt: |
       원래 요구사항과 구현을 매칭하라.
       - 각 REQ-XXX가 어디에 구현되었는지
       - 각 AC-XXX가 충족되었는지 (file:line)
       - 누락된 요구사항 있는지

       Output: | REQ | AC | Status | Evidence | Confidence |

   Verifier 2 (code-verifier):
     prompt: |
       코드 품질을 검증하라.
       - 버그, 로직 에러, 코드 스멜
       - 에러 핸들링 적절성
       - Confidence 80% 이상만 보고

       Output: | Issue ID | Type | Location | Confidence |

   Verifier 3 (test-auditor):
     prompt: |
       테스트 커버리지를 검증하라.
       - 각 AC별 테스트 존재 여부
       - 테스트 품질 (meaningful assertions)
       - 커버리지 게이밍 감지

       Output: | AC | Test File | Coverage | Quality |

   Verifier 4 (quality-inspector):
     prompt: |
       보안/성능/SOLID를 검증하라.
       - 보안: 90%+ 신뢰도만 보고
       - 품질: 75%+ 신뢰도만 보고
       - 성능 이슈 식별

       Output: | Issue ID | Category | Severity | Confidence |
   ```

2. **신뢰도 기반 필터링**
   ```javascript
   THRESHOLDS = {
     SECURITY_CRITICAL: 0.90,
     MISSING_REQUIREMENT: 0.85,
     TEST_COVERAGE_GAP: 0.80,
     CODE_QUALITY: 0.75
   }
   // 임계값 미달 이슈는 FILTERED
   ```

3. **증거 수집**
   ```bash
   git diff --stat HEAD~N
   git log --oneline -10
   npm test 2>&1 || pytest -v 2>&1
   ```

4. **최종 판정**

   | Verdict | 조건 |
   |---------|------|
   | **PASS** | Critical 0개, AC 100%, Coverage >= 80% |
   | **PARTIAL** | Critical 0개, Warning 1-3개 |
   | **FAIL** | Critical 1개+ OR AC 누락 |

### On FAIL: 자동 루프백

```
FAIL 판정 시:
1. 이슈 목록 정리
2. Phase 4로 자동 이동
3. 이슈 해결 후 다시 Phase 5
4. loop_count++

if loop_count >= 3:
  AskUserQuestion("3회 검증 실패. 다음 중 선택:")
  - 계속 시도
  - 특정 이슈 무시하고 진행
  - 워크플로우 중단
```

### Gate Check
```
- [ ] all 4 verifier agents completed
- [ ] verdict == "PASS" OR user_override
- [ ] critical_issues == 0
```

---

## Phase 6: COMPLETE (완료)

**Goal**: 작업 완료 및 문서화
**Gate**: 완료 보고서 생성

### Actions

1. **완료 보고서 생성**
   ```markdown
   # Workflow Complete Report

   ## Summary
   - Task: [원래 요청]
   - Duration: [소요 시간]
   - Phases Completed: 6/6
   - Loop-backs: [횟수]

   ## Requirements Fulfilled
   | REQ | Status | Evidence |
   |-----|--------|----------|
   | REQ-001 | DONE | file:line |

   ## Files Modified
   - src/auth/login.ts (45 lines)
   - src/api/client.ts (20 lines)

   ## Key Decisions
   1. [결정 사항]

   ## Recommended Next Steps
   - [ ] 추가 테스트
   - [ ] 문서화
   - [ ] PR 생성
   ```

2. **상태 파일 정리**
   - .claude/agentic-workflow.local.md 삭제 또는 archived

3. **후속 작업 제안**

---

## State Management

### 상태 파일: `.claude/agentic-workflow.local.md`

```yaml
---
active: true
phase: 1
phase_name: "DISCOVER"
started_at: "2025-01-14T10:00:00Z"
last_updated: "2025-01-14T10:30:00Z"

requirements:
  - id: REQ-001
    title: ""
    acs:
      - id: AC-001-1
        description: ""
        status: pending  # pending | implemented | verified
    status: pending

design:
  selected_approach: null  # minimal | clean | pragmatic
  user_approved: false

exploration:
  key_files: []
  patterns: []

implementation:
  completed_acs: []

verification:
  verdict: null  # PASS | PARTIAL | FAIL
  issues: []
  loop_count: 0

config:
  max_loops: 3
  auto_retry: true
---
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/aw [task]` | 새 워크플로우 시작 |
| `/aw:status` | 현재 Phase 및 상태 확인 |
| `/aw:retry` | 현재 Phase 재시도 |
| `/aw:skip` | 현재 Phase 스킵 (주의) |
| `/aw:cancel` | 워크플로우 취소 |

---

## Execution Flow

### 워크플로우 시작 시

```
1. 상태 파일 생성 (.claude/agentic-workflow.local.md)
2. TodoWrite로 전체 Phase 등록
3. Phase 1 시작
```

### Phase 전환 시

```
1. 현재 Phase Gate 검증
2. Gate 통과 시:
   - 상태 파일 업데이트
   - TodoWrite 업데이트
   - 다음 Phase 시작
3. Gate 실패 시:
   - 실패 원인 분석
   - 필요한 작업 수행
   - Gate 재검증
```

### 검증 실패 시

```
1. 이슈 목록 정리
2. loop_count 증가
3. if loop_count < max_loops:
   - Phase 4로 루프백
   - 이슈 해결 시도
4. else:
   - 사용자에게 개입 요청
```

---

## Agent Definitions

See `agents/` directory for detailed agent prompts:

- `agents/explorer.md` - 코드베이스 탐색 에이전트
- `agents/architect.md` - 설계 에이전트
- `agents/verifier.md` - 검증 에이전트

---

## Best Practices

1. **명확한 요구사항**: Phase 1에서 충분히 시간 투자
2. **작은 단위**: 큰 작업은 여러 워크플로우로 분리
3. **점진적 검증**: 각 AC 완료 후 부분 검증 권장
4. **컨텍스트 유지**: 상태 파일 통해 진행 상황 추적

---

## Boundaries

**Will:**
- 6 Phase 순차 실행
- 병렬 에이전트 동시 실행 (Task 도구)
- Gate 미통과 시 진행 차단
- 검증 실패 시 자동 루프백
- 신뢰도 기반 이슈 필터링

**Will Not:**
- Phase 스킵 (명시적 요청 없이)
- 검증 없이 완료 선언
- 사용자 승인 없이 설계 진행
- 무한 루프 (max_loops 제한)

---

**Version**: 1.0.0
**Based on**: feature-dev + ralph-loop + hookify + verify-work
