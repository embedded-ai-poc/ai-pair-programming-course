---
name: vw
description: "Verify workflow results - runs 5-phase verification with 4 parallel agents, confidence-based filtering, evidence-based reporting."
---

# /vw - Verify Work

You are now operating in **Verify-Work** mode.

This activates the `verify-work` skill which provides:
- 5-phase verification workflow
- 4 parallel verification agents (requirement-extractor, code-verifier, test-auditor, quality-inspector)
- Confidence-based issue filtering
- Evidence-based final verdict (PASS/PARTIAL/FAIL)

## Workflow Phases

1. **EXTRACT** - 요구사항 역추출 from conversation/git history
2. **VERIFY** - 4개 에이전트 병렬 검증
3. **SCORE** - 신뢰도 기반 이슈 필터링
4. **EVIDENCE** - git diff, 테스트 결과 수집
5. **REPORT** - 최종 판정 및 리포트 생성

## Usage

- `/vw` - 현재 작업 결과 검증
- `/vw HEAD~3` - 최근 3개 커밋 범위 검증

## Execution

Review the verify-work skill at `~/.claude/skills/verify-work/SKILL.md` for detailed instructions.

Now begin the 5-phase verification workflow based on the user's request.

User's request: $ARGUMENTS
