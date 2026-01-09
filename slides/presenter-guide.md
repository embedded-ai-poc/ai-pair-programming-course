# AI 페어프로그래밍 워크샵 - 발표 순서 가이드

---

## 1. 커버 & 어제 리캡
- 고민을 아웃소싱, 마스터셰프, Model × Harness × Pilot

## 2. 마인드셋 전환
- A to Z 탈피 → Recursive Gap Filling
- "무엇을 만들어야 하는지 아는 것"

## 3. Context Engineering
- 맥락이 품질을 결정
- 같은 AI, 같은 요청이라도 맥락에 따라 결과가 다름

## 4. CLAUDE.md & Rule-Growing
- 프로젝트 맥락 파일
- AI한테 시키기 → 이상한 짓 관찰 → 룰 추가 → 반복

## 5. 파이프라인 & TDD
- 요구사항 → PRD → TDD → 코드리뷰 → 검증
- 루프백 워크플로우, 무한루프 방지 (max 3회)

## 6. Hooks & MCP
- Hook: PreToolUse, PostToolUse, Stop (이벤트 기반 자동 트리거)
- MCP: 외부 도구 연결 (Context7, GitHub 등)

## 7. Multi-Agent & 공식 플러그인
- 병렬 에이전트 패턴
- Hookify, Feature-Dev, Frontend-Design, Ralph Loop

## 8. Agent SDK 기초
- Skills/Hooks = 마크다운 기반, 간단
- Agent SDK = Python/TS, 복잡한 로직

---

## 9. Agentic Workflow ← 여기서부터 고급
- Traditional (질문→답변) vs Agentic (목표→자율실행)
- "차별화는 워크플로우에서 나온다"

## 10. Skills 구축
- SKILL.md 작성법
- 폴더 구조: ~/.claude/skills/my-workflow/

## 11. Command vs Skill 비교
- Command = 단축키 (내가 실행)
- Skill = 지식 (Claude가 참조)
- **둘 다 있어야 정확한 결과**

## 12. 10-Phase Workflow
- INIT → ANALYZE → REQ-VERIFY → EXPLORE → DESIGN → DESIGN-VERIFY → IMPLEMENT → CODE-VERIFY → TEST → COMPLETE
- 신뢰도 기반 필터링 (False Positive 제거)

## 13. Claude Code vs Cursor
- Claude Code: 복잡한 워크플로우, CI/CD, 자동화
- Cursor: 빠른 수정, IDE 통합, 간단한 작업

---

## 14. 실습 프로젝트
- 포모도로 타이머
- git clone → claude → 수정 요청 → 브라우저 확인

## 15. 마무리
- 핵심: 차별화는 워크플로우에서
- 다음 단계: 1주차 CLAUDE.md → 2주차 Skill → 3주차 MCP → 4주차 전체

---

## 주의: 순서 지키기!
- Hooks/MCP 설명할 때 Skills 먼저 말하지 않기
- Skills 설명할 때 10-Phase 먼저 말하지 않기
- 실습은 맨 마지막!
