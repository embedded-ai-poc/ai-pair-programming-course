# AI 페어프로그래밍 강의 자료

AI 페어프로그래밍 교육을 위한 자료 저장소입니다.

## 시작하기

```bash
git clone https://github.com/embedded-ai-poc/ai-pair-programming-course.git
cd ai-pair-programming-course
```

## 디렉토리 구조

```
ai-pair-programming-course/
├── index.html              # 강의 슬라이드 (브라우저로 열기)
├── assets/                 # 슬라이드 이미지 리소스
├── audiobooks/             # 오디오 학습 자료
├── practice-chatbot/       # AI 챗봇 실습 프로젝트
└── references/             # 참고 자료
    └── AI로개발을가속하기.pdf
```

## 강의 슬라이드

`index.html`을 브라우저에서 열어 슬라이드를 확인하세요.

- **키보드**: ← → 또는 스페이스바로 이동
- **터치**: 좌우 스와이프

### 커리큘럼

| Part | 주제 | 내용 |
|------|------|------|
| Day 1 | 마인드셋 | AI 페어프로그래밍 개념, Vibe Coding |
| Day 2-1 | Context Engineering | CLAUDE.md, Rule-Growing |
| Day 2-2 | 파이프라인 & TDD | Multi-Agent 패턴, 루프백 워크플로우 |
| Day 3-1 | Agentic Workflow | Skills, 개인화 철학 |
| Day 3-2 | MCP | Model Context Protocol, AI Slop 주의 |

## 오디오 학습 자료

`audiobooks/` 디렉토리에서 확인하세요.

| 파일 | 설명 |
|------|------|
| AI_페어_프로그래머_활용_실전_전략.m4a | 페어프로그래밍 전략 오디오 |
| AI-페어프로그래밍-Recap.m4a | 강의 요약 오디오 |

## 실습 프로젝트

`practice-chatbot/`은 AI 페어프로그래밍 실습을 위한 챗봇 프로젝트입니다.

### 설정 방법

```bash
cd practice-chatbot
cp .env.example .env
# .env 파일을 열어 OpenRouter API 키 설정
pip install -r requirements.txt
```

### 실행

```bash
# Streamlit 웹 앱
streamlit run streamlit_app.py

# 콘솔 앱
python console_app.py
```

## 참고 자료

`references/` 디렉토리에서 추가 학습 자료를 확인하세요.

| 파일 | 설명 |
|------|------|
| AI로개발을가속하기.pdf | AI 기반 개발 가속화 가이드 |
