# AI Pair Programming Course

AI 페어 프로그래밍 실습 과정을 위한 저장소입니다.

## 강의 자료

### 1Day 기본 강의
`slides` 폴더를 다운로드한 후 아래 파일을 브라우저에서 실행하세요:

```
slides/ai-pair-programming.html
```

## Claude Code 설정

### dot-claude 폴더 설정
`dot-claude` 폴더를 `.claude`로 이름을 변경하여 사용자 홈 디렉토리에 복사하세요:

```bash
# Windows
copy dot-claude %USERPROFILE%\.claude

# Mac/Linux
cp -r dot-claude ~/.claude
```

## 챗봇 프로젝트

### 프로젝트 구조
```
├── config.py          # 설정 (API, 모델 정보)
├── chatbot.py         # 챗봇 핵심 로직
├── console_app.py     # 콘솔 버전
├── streamlit_app.py   # 웹 UI 버전
├── style.css          # 웹 UI 스타일
├── requirements.txt   # 의존성 패키지
└── .env.example       # 환경변수 예시
```

### 설치 및 실행

1. **의존성 설치**
```bash
pip install -r requirements.txt
```

2. **API 키 설정**
```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집하여 API 키 입력
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

3. **실행**
```bash
# 웹 버전
streamlit run streamlit_app.py

# 콘솔 버전
python console_app.py
```

### 지원 모델
- **Gemini 3.0 Flash Preview** - Google의 최신 모델 (기본값)
- **Claude 3.5 Sonnet** - Anthropic의 강력한 모델
- **GPT-4o Mini** - OpenAI의 빠르고 저렴한 모델

## API 키 발급

1. [OpenRouter](https://openrouter.ai) 회원가입
2. Keys 메뉴에서 API 키 생성
3. `.env` 파일에 키 입력
