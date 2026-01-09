# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

AI 페어프로그래밍 워크샵용 HTML 프레젠테이션 슬라이드 모음. 순수 HTML/CSS/JS로 구현된 슬라이드 시스템.

## 프레젠테이션 구조

- **index.html**: 통합 마스터 클래스 (전체 개요)
- **1day.html**: Day 1 - 입문 (마인드셋)
- **2day.html / 2day-adv.html**: Day 2 - Context Engineering & 파이프라인
- **3day.html / 3day-adv.html**: Day 3 - Agentic Workflow, MCP, Agent SDK
- **ai-pair-programming.html**: 종합 슬라이드
- **appendix-ontology/**: 온톨로지 부록 슬라이드

## 슬라이드 시스템 아키텍처

모든 HTML 파일은 동일한 슬라이드 패턴 사용:
- `.slides` 컨테이너 내 `.slide` 요소들이 수평 배치
- 좌우 화살표 또는 키보드로 네비게이션
- `translateX` 애니메이션으로 슬라이드 전환

### 슬라이드 배경 클래스
```
.blue    - 파란 그라데이션 (표지/강조)
.mint    - 민트 그라데이션
.orange  - 오렌지 그라데이션
.violet  - 보라 그라데이션
.surface - 어두운 표면색
.light   - 밝은 배경
```

### 텍스트 강조 클래스
```
.em     - 파란색 강조
.red    - 빨간색 경고
.green  - 초록색 긍정
.yellow - 노란색 주의
```

## 작업 시 주의사항

- 한국어 콘텐츠 - 모든 슬라이드 텍스트는 한국어
- 반응형 폰트 - `clamp()` 함수로 뷰포트 대응
- 이미지는 루트 또는 하위 폴더에 PNG로 저장
- 슬라이드 추가 시 기존 CSS 클래스 패턴 재사용
