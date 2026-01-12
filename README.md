# AI 페어프로그래밍 워크샵

AI 페어프로그래밍 교육을 위한 자료 저장소입니다.

## 시작하기

```bash
git clone https://github.com/embedded-ai-poc/ai-pair-programming-course.git
cd ai-pair-programming-course
```

## 디렉토리 구조

```
ai-pair-programming-course/
├── slides/                    # 워크샵 슬라이드
├── chatbot_sample/            # AI 페어프로그래밍 실습용 샘플 프로젝트
├── dot-claude/                # Claude Code 설정 파일 템플릿
└── *.m4a, *.pdf              # 참고 오디오/문서 자료
```

## 슬라이드

`slides/` 디렉토리에서 다음 파일을 브라우저로 열어보세요:

- **1day.html** - 1일차 워크샵 슬라이드
- **ai-pair-programming.html** - AI 페어프로그래밍 심화 슬라이드

## 샘플 프로젝트

`chatbot_sample/`은 AI 페어프로그래밍 실습을 위한 샘플 프로젝트입니다.

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

`dot-claude/` 디렉토리에는 Claude Code 설정 템플릿이 포함되어 있습니다.

### 설정 방법

프로젝트 루트에서 `dot-claude`를 `.claude`로 복사하세요:

```bash
# Windows
xcopy dot-claude .claude /E /I

# Mac/Linux
cp -r dot-claude .claude
```

### 포함된 설정

- **commands/** - 커스텀 슬래시 명령어
- **skills/** - 사용자 정의 스킬
- **plugins/** - 플러그인 설정
- **settings.json** - Claude Code 기본 설정

## 참고 자료

| 파일 | 설명 |
|------|------|
| AI_페어_프로그래머_활용_실전_전략.m4a | 페어프로그래밍 전략 오디오 |
| AI-페어프로그래밍-Recap.m4a | 워크샵 요약 오디오 |
| AI로개발을가속하기.pdf | 참고 문서 |
