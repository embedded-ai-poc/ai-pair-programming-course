---
name: power-workflow
description: |
  Triple-Verify 개발 워크플로우. 요구사항/설계/코드 각 단계에서 3개 독립 검증 에이전트가 강제 검증.
  Gate 기반 Phase 전환, 병렬 에이전트 강제 실행, SuperClaude/웹검색 통합.
  Triggers: pw, power, power-workflow
---

# POWER-WORKFLOW: Triple-Verify Development

> **핵심 철학**: 코드 작성은 자유롭게, 검증은 강제적으로
> 3개 체크포인트에서 독립 검증 에이전트가 객관적으로 검증

## ABSOLUTE RULES (절대 규칙)

```
+------------------------------------------------------------------------+
|  1. 검증 단계(Phase 3/6/8)는 반드시 3개 병렬 에이전트로 실행            |
|  2. 검증 통과 전까지 다음 Phase 진행 불가 (Gate 강제)                   |
|  3. 검증 에이전트는 반드시 문제를 찾으려고 노력해야 함 (비판적 시각)    |
|  4. 루프백 3회 초과 시 사용자 개입 필수                                 |
|  5. SuperClaude 명령어, 웹검색 등 검증된 도구 적극 활용                 |
+------------------------------------------------------------------------+
```

## 10-Phase Workflow

```
[1.INIT] → [2.ANALYZE] → [3.REQ-VERIFY] → [4.EXPLORE] → [5.DESIGN]
                              ↑ 루프백                        ↓
                              └──────────────────────── [6.DESIGN-VERIFY]
                                                              ↓
[10.COMPLETE] ← [9.TEST] ← [8.CODE-VERIFY] ← [7.IMPLEMENT]
                               ↑ 루프백            │
                               └───────────────────┘
```

---

## Phase 1: INIT

**Gate**: 상태 파일 생성 + 훅 등록

**Script**: `node ~/.claude/skills/power-workflow/scripts/init-workflow.js "$ARGUMENTS"`

**Actions**:
1. `.claude/power-workflow.local.md` 상태 파일 생성
2. 훅 등록 (`.claude/settings.local.json`)
3. TodoWrite로 작업 목록 초기화

---

## Phase 2: ANALYZE (요구사항 분석)

**Gate**: REQ 1개 이상 + AC 2개 이상 정의

**Actions**:
1. 사용자 요청 분석
2. REQ-XXX 형식으로 요구사항 정의
3. AC-XXX-X 형식으로 수용 기준 정의
4. PRD 초안 작성

**권장 도구**:
- `/sc:brainstorm` - 요구사항 도출
- `WebSearch` - 유사 사례/베스트 프랙티스 조사

**Output Format**:
```markdown
## REQ-001: [제목]
- Description: [설명]
- Acceptance Criteria:
  * AC-001-1: [테스트 가능한 기준]
  * AC-001-2: [테스트 가능한 기준]
- Priority: [P1/P2/P3]
- Complexity: [S/M/L/XL]
```

---

## Phase 3: REQ-VERIFY (요구사항 검증) ★ 강제 ★

**Gate**: 3개 검증 에이전트 통과 + verify-work 신뢰도 기반 필터링

**중요**: Task 3개 실행 후 반드시 등록 스크립트 실행:
```bash
node ~/.claude/skills/power-workflow/scripts/register-tasks.js 3
```

**MANDATORY 병렬 실행**:
```yaml
Launch 3 verifier agents IN PARALLEL (한 번에 3개 Task 호출):

  Verifier 1 - 완전성 검증:
    prompt: |
      REQ-XXX 요구사항의 완전성을 검증하라.
      - 누락된 요구사항은 없는가?
      - 엣지 케이스가 고려되었는가?
      - 에러 처리 요구사항이 있는가?
      비판적 시각으로 최소 3개 이상의 문제점을 찾아라.

      **신뢰도 점수 필수**: 각 이슈에 0-100% 신뢰도 부여
      - 85% 미만 이슈는 FILTERED로 표시

  Verifier 2 - 명확성 검증:
    prompt: |
      REQ-XXX 요구사항의 명확성을 검증하라.
      - 모호한 표현은 없는가?
      - AC가 측정/테스트 가능한가?
      - 용어 정의가 명확한가?
      비판적 시각으로 최소 3개 이상의 문제점을 찾아라.

      **신뢰도 점수 필수**: 각 이슈에 0-100% 신뢰도 부여
      - 85% 미만 이슈는 FILTERED로 표시

  Verifier 3 - 실현가능성 검증:
    prompt: |
      REQ-XXX 요구사항의 실현가능성을 검증하라.
      - 기술적으로 구현 가능한가?
      - 현재 코드베이스와 호환되는가?
      - 리소스/시간 제약 내에서 가능한가?
      비판적 시각으로 최소 3개 이상의 문제점을 찾아라.

      **신뢰도 점수 필수**: 각 이슈에 0-100% 신뢰도 부여
      - 85% 미만 이슈는 FILTERED로 표시
```

**신뢰도 임계값** (verify-work 연계):
```javascript
THRESHOLDS = {
  MISSING_REQUIREMENT: 0.85,  // 누락 요구사항
  AMBIGUOUS_AC: 0.80,         // 모호한 AC
  FEASIBILITY_RISK: 0.75      // 실현가능성 리스크
}
```

**검증 실패 시**: Phase 2로 루프백 (요구사항 수정)
**검증 통과 기준**: Critical 이슈 0개, 85%+ 신뢰도 Major 이슈 해결됨

---

## Phase 4: EXPLORE (코드베이스 탐색)

**Gate**: 핵심 파일 5개 이상 식별

**MANDATORY 병렬 실행**:
```yaml
Launch 3 explorer agents IN PARALLEL:
  Explorer 1: "유사 기능 및 패턴 분석"
  Explorer 2: "아키텍처 레이어 및 데이터 흐름 분석"
  Explorer 3: "테스트 패턴 및 커버리지 분석"
```

**권장 도구**:
- `/sc:analyze` - 코드 분석
- `Grep`, `Glob` - 패턴 검색

---

## Phase 5: DESIGN (설계)

**Gate**: 설계 문서 작성 완료

**MANDATORY 병렬 실행**:
```yaml
Launch 3 architect agents IN PARALLEL:
  Approach 1 (Minimal): "최소 변경, 최대 재사용"
  Approach 2 (Clean): "베스트 프랙티스, 유지보수성"
  Approach 3 (Pragmatic): "속도 + 품질 균형 (권장)"
```

**권장 도구**:
- `/sc:design` - 설계 문서 생성
- `WebSearch` - 아키텍처 패턴 조사

---

## Phase 6: DESIGN-VERIFY (설계 검증) ★ 강제 ★

**Gate**: 3개 검증 에이전트 통과

**중요**: Task 3개 실행 후 반드시 등록 스크립트 실행:
```bash
node ~/.claude/skills/power-workflow/scripts/register-tasks.js 3
```

**MANDATORY 병렬 실행**:
```yaml
Launch 3 verifier agents IN PARALLEL:

  Architect-Verifier 1 - 타당성 검증:
    prompt: |
      설계의 기술적 타당성을 검증하라.
      - 선택한 아키텍처가 요구사항을 충족하는가?
      - 기술 스택 선택이 적절한가?
      - 성능/확장성 고려가 충분한가?
      비판적 시각으로 최소 3개 이상의 문제점을 찾아라.

  Architect-Verifier 2 - 호환성 검증:
    prompt: |
      기존 코드베이스와의 호환성을 검증하라.
      - 기존 패턴/컨벤션을 따르는가?
      - 기존 모듈과의 통합이 자연스러운가?
      - Breaking change가 있는가?
      비판적 시각으로 최소 3개 이상의 문제점을 찾아라.

  Architect-Verifier 3 - 유지보수성 검증:
    prompt: |
      설계의 유지보수성을 검증하라.
      - 코드 복잡도가 적절한가?
      - 테스트 용이성이 확보되었는가?
      - 향후 확장이 용이한가?
      비판적 시각으로 최소 3개 이상의 문제점을 찾아라.
```

**검증 실패 시**: Phase 5로 루프백 (설계 수정)

---

## Phase 7: IMPLEMENT (구현)

**Gate**: 코드 작성 완료 선언

**자유롭게 구현** (경고/차단 없음):
- 테스트 코드 작성 권장 (강제 아님)
- 코드 품질은 Phase 8에서 검증
- 완료 선언 시 Phase 8로 자동 전환

**권장 도구**:
- `/sc:implement` - 코드 구현
- `WebSearch` - API 문서, 라이브러리 사용법 조회

---

## Phase 8: CODE-VERIFY (코드 검증) ★ verify-work 통합 ★

**Gate**: verify-work 4개 에이전트 통과 + 신뢰도 기반 이슈 해결

**중요**: Task 4개 실행 후 반드시 등록 스크립트 실행:
```bash
node ~/.claude/skills/power-workflow/scripts/register-tasks.js 4
```

### Step 1: `/vw` 실행 (필수)

verify-work 스킬을 먼저 실행하여 5-Phase 검증 수행:
```
/vw
# 또는 수동으로 4개 에이전트 병렬 실행
```

### Step 2: 4개 병렬 에이전트 (verify-work 방식)

**MANDATORY 병렬 실행**:
```yaml
Launch 4 verifier agents IN PARALLEL:

  Agent 1 - requirement-extractor:
    prompt: |
      역추출된 요구사항이 원래 의도와 일치하는지 검증.
      - .claude/power-workflow.local.md의 requirements 참조
      - REQ-XXX → 코드 매핑

      **Output**: | REQ | AC | Status | Evidence | Confidence |

  Agent 2 - code-verifier:
    subagent_type: "feature-dev:code-reviewer"
    prompt: |
      코드 품질 검증. Confidence 80% 이상만 보고.
      - 버그, 로직 에러, 코드 스멜
      - 에러 핸들링, 네이밍

      **Output**: | Issue ID | Type | Location | Confidence |

  Agent 3 - test-auditor:
    prompt: |
      테스트가 AC를 커버하는지 검증.
      - AC별 테스트 존재 여부
      - 커버리지 분석

      **Output**: | AC | Test File | Coverage | Status |

  Agent 4 - quality-inspector:
    prompt: |
      보안/성능/SOLID 검증.
      - 보안: 90%+ 신뢰도만
      - 품질: 75%+ 신뢰도만

      **Output**: | Issue ID | Type | Severity | Confidence |
```

### Step 3: 신뢰도 기반 필터링

```javascript
THRESHOLDS = {
  SECURITY_VULNERABILITY: 0.90,  // 보안
  MISSING_REQUIREMENT: 0.85,     // 누락 기능
  TEST_COVERAGE_GAP: 0.80,       // 테스트 누락
  CODE_QUALITY: 0.75             // 코드 품질
}
// 임계값 미달 이슈는 FILTERED
```

### Step 4: 최종 판정

- **PASS**: Critical 0개, AC 100%, 커버리지 >= 80%
- **PARTIAL**: Critical 0개, Warning 1-3개
- **FAIL**: Critical 1개+ 또는 AC 누락

**검증 실패 시**: Phase 7로 루프백 (코드 수정)
**루프 3회 초과 시**: 사용자 개입 요청 (AskUserQuestion)

**권장 도구**:
- `/vw` (verify-work skill) - **필수**
- `/sc:analyze --focus security,performance`

---

## Phase 9: TEST

**Gate**: 모든 테스트 통과 + 커버리지 90%+

**Script**: `node ~/.claude/skills/power-workflow/scripts/run-tests.js`

**Actions**:
1. 테스트 프레임워크 자동 감지
2. 테스트 실행
3. 커버리지 측정 및 검증

**권장 도구**:
- `/sc:test` - 테스트 실행

---

## Phase 10: COMPLETE

**Gate**: 완료 보고서 생성 + 훅 제거

**Script**: `node ~/.claude/skills/power-workflow/scripts/cleanup-workflow.js`

**Actions**:
1. 완료 보고서 생성
2. 훅 해제
3. 상태 파일 정리

---

## Loop-Back Rules (루프백 규칙)

| Source | Trigger | Action |
|--------|---------|--------|
| Phase 3 | 요구사항 검증 실패 | → Phase 2 (요구사항 수정) |
| Phase 6 | 설계 검증 실패 | → Phase 5 (설계 수정) |
| Phase 8 | 코드 검증 실패 | → Phase 7 (코드 수정) |
| Phase 9 | 테스트 실패 | → Phase 7 (코드 수정) |

**Max Loops**: 각 검증 단계별 3회
**Escalation**: 3회 초과 시 `AskUserQuestion`으로 사용자 개입 요청

---

## State File Schema

Location: `.claude/power-workflow.local.md`

```yaml
---
active: true
phase: 1
phase_name: "INIT"
loop_counts:
  req_verify: 0      # Phase 3 루프 횟수
  design_verify: 0   # Phase 6 루프 횟수
  code_verify: 0     # Phase 8 루프 횟수
max_loops: 3
requirements: []
design_approach: null
verification_results:
  req: []
  design: []
  code: []
parallel_agents_launched:
  phase_3: 0
  phase_4: 0
  phase_5: 0
  phase_6: 0
  phase_8: 0
last_coverage: 0
target_coverage: 90
started_at: ""
last_updated: ""
---
```

### Task Log File

Location: `.claude/power-workflow-tasks.log`

병렬 에이전트 실행을 추적하는 append-only 로그 파일:
- 형식: `phase|timestamp`
- Race condition 방지를 위해 append 방식 사용
- Gate 체크 시 timestamp 기반 병렬 실행 검증 (5초 이내면 병렬)

---

## Recommended Tools Integration

| Phase | SuperClaude | Other Tools |
|-------|-------------|-------------|
| 2. ANALYZE | `/sc:brainstorm` | WebSearch |
| 3. REQ-VERIFY | `/sc:analyze` | 신뢰도 기반 필터링 |
| 4. EXPLORE | `/sc:analyze` | Grep, Glob |
| 5. DESIGN | `/sc:design` | WebSearch |
| 6. DESIGN-VERIFY | `/sc:spec-panel` | 신뢰도 기반 필터링 |
| 7. IMPLEMENT | `/sc:implement` | WebSearch |
| 8. CODE-VERIFY | **`/vw` (필수)**, `/sc:analyze` | verify-work 4 agents |
| 9. TEST | `/sc:test` | - |

### verify-work 연계 상세

Phase 8에서 `/vw` (verify-work) 스킬은 **필수** 실행:
- 4개 병렬 에이전트: requirement-extractor, code-verifier, test-auditor, quality-inspector
- 신뢰도 기반 이슈 필터링 (SECURITY: 90%, REQUIREMENT: 85%, TEST: 80%, QUALITY: 75%)
- 증거 기반 최종 판정 (PASS/PARTIAL/FAIL)

---

## Commands

| Command | Description |
|---------|-------------|
| `/pw [task]` | 새 워크플로우 시작 |
| `/cancel-pw` | 워크플로우 취소, 훅 제거 |

---

## Boundaries

**Will:**
- 모든 검증 단계에서 병렬 에이전트 강제 실행 (Phase 3/6: 3개, Phase 8: 4개)
- Phase 8에서 `/vw` (verify-work) 스킬 필수 실행
- 신뢰도 기반 이슈 필터링 (False Positive 최소화)
- Gate 미통과 시 다음 Phase 진행 차단
- 검증 에이전트는 비판적 시각으로 문제 탐지
- SuperClaude, WebSearch 등 도구 적극 활용

**Will Not:**
- 검증 단계 스킵
- 단일 에이전트로 검증 대체
- 신뢰도 임계값 미달 이슈 보고
- 루프 제한 무시
- 검증 없이 완료 선언

---

**Version**: 1.2.0 (2026-01-05)
- **verify-work 통합**: Phase 8에서 4개 에이전트 필수 실행
- 신뢰도 기반 이슈 필터링 (SECURITY 90%, REQ 85%, TEST 80%, QUALITY 75%)
- Phase 3/6에 신뢰도 점수 시스템 추가
- Race condition 해결 (append-only task log)
- 병렬 실행 검증 (timestamp 기반)

---

## Deep-Research Integration (AI 판단 기반)

> **원칙**: 강제가 아닌 AI 판단 하에 필요시 `/deep-research` 또는 Task sub-agent로 호출

### 호출 권장 시점

| Phase | 상황 | 호출 방식 |
|-------|------|-----------|
| 2. ANALYZE | 새로운 기술/패턴 조사 필요 | `Task(deep-research)` |
| 4. EXPLORE | 외부 라이브러리/패턴 비교 필요 | `Task(deep-research)` |
| 5. DESIGN | 아키텍처 결정 지원 필요 | `Task(deep-research)` |

### 호출 판단 기준

```
AI가 다음 상황일 때 deep-research 호출 고려:
- 새로운 기술/라이브러리 선택이 필요한 경우
- 베스트 프랙티스 또는 사례 조사가 필요한 경우
- 기술적 의사결정에 근거 자료가 부족한 경우
- 사용자가 조사/분석을 명시적으로 요청한 경우
```

### 호출 예시

```yaml
# Phase 2에서 AI 판단 호출
Task:
  subagent_type: "general-purpose"
  prompt: |
    /deep-research React Server Components vs Next.js App Router 비교
    Standard 모드로 진행하고 결과를 요약해서 반환

# Phase 5에서 AI 판단 호출
Task:
  subagent_type: "general-purpose"
  prompt: |
    /deep-research 인증 시스템 아키텍처 패턴 (JWT vs Session)
    설계 결정에 필요한 비교 분석 수행
```
