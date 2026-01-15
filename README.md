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
├── chatbot_sample/         # AI 챗봇 실습 프로젝트
├── .claude/                # Claude Code 설정 템플릿
│   ├── skills/             # 사용자 정의 스킬
│   ├── plugins/            # 공식 플러그인
│   └── settings.json       # 기본 설정
└── AI로개발을가속하기.pdf  # 참고 문서
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

## 샘플 프로젝트

`chatbot_sample/`은 AI 페어프로그래밍 실습을 위한 챗봇 프로젝트입니다.

### 설정 방법

```bash
cd chatbot_sample
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

## Claude Code 설정

`.claude/` 디렉토리에는 강의에서 소개하는 Claude Code 설정이 포함되어 있습니다.

### 포함된 스킬

| 스킬 | 설명 |
|------|------|
| `agentic-workflow` | 자율적 개발 워크플로우 |
| `debug-master` | 체계적 디버깅 워크플로우 |
| `minimal-ppt` | HTML 프레젠테이션 생성 |
| `skill-builder` | 새 스킬 생성 도우미 |

### 포함된 플러그인

| 플러그인 | 설명 |
|----------|------|
| `feature-dev` | 기능 개발 에이전트 (탐색, 설계, 리뷰) |
| `frontend-design` | 프론트엔드 디자인 스킬 |
| `hookify` | 커스텀 훅 규칙 작성 |

### 사용 방법

전체 설정을 자신의 Claude Code에 복사하세요:

```bash
# Windows
xcopy .claude %USERPROFILE%\.claude /E /I /Y

# Mac/Linux
cp -r .claude ~/.claude/
```

또는 필요한 부분만 선택적으로 복사:

```bash
# 스킬만 복사
cp -r .claude/skills ~/.claude/

# 플러그인만 복사
cp -r .claude/plugins ~/.claude/
```
