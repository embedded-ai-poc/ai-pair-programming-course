"""
설정 관리 모듈

OpenRouter API 설정, 지원 모델 목록, 에러 메시지를 관리합니다.
이 파일을 수정하여 새로운 모델을 추가하거나 설정을 변경할 수 있습니다.

사용 예시:
    from config import MODELS, get_api_key, ERROR_MESSAGES
"""

import os
from dotenv import load_dotenv


# ============================================================
# 환경변수 로드
# ============================================================

# .env 파일에서 환경변수 로드 (override=True로 기존 값 덮어쓰기)
load_dotenv(override=True)


# ============================================================
# API 설정
# ============================================================

# OpenRouter API 기본 URL
API_BASE_URL = "https://openrouter.ai/api/v1"

# API 요청 타임아웃 (초)
API_TIMEOUT = 30

# 대화 히스토리 최대 메시지 수
MAX_HISTORY_LENGTH = 20


# ============================================================
# 지원 모델 목록
# ============================================================

# 모델 정보 딕셔너리
# - id: OpenRouter에서 사용하는 모델 ID
# - name: 사용자에게 표시할 이름
# - max_tokens: 최대 출력 토큰 수
# - description: 모델 설명
MODELS = {
    "gemini": {
        "id": "google/gemini-3-flash-preview",
        "name": "Gemini 3.0 Flash Preview",
        "max_tokens": 8192,
        "description": "Google의 최신 Gemini 3.0 모델 (빠르고 강력)"
    },
    "claude": {
        "id": "anthropic/claude-3.5-sonnet",
        "name": "Claude 3.5 Sonnet",
        "max_tokens": 4096,
        "description": "Anthropic의 강력한 AI 모델, 긴 대화에 적합"
    },
    "gpt": {
        "id": "openai/gpt-4o-mini",
        "name": "GPT-4o Mini",
        "max_tokens": 4096,
        "description": "OpenAI의 빠르고 저렴한 모델"
    }
}

# 기본 모델 (처음 실행 시 사용)
DEFAULT_MODEL = "gemini"


# ============================================================
# 에러 메시지 (한국어)
# ============================================================

ERROR_MESSAGES = {
    # API 키 관련
    "no_api_key": """
API 키가 설정되지 않았습니다.

설정 방법:
1. https://openrouter.ai 에서 회원가입
2. Keys 메뉴에서 API 키 생성
3. .env 파일에 다음 내용 추가:
   OPENROUTER_API_KEY=여기에_API_키_입력
""",

    "invalid_api_key": "올바른 API 키가 아닙니다. openrouter.ai에서 키를 확인하세요.",

    # 네트워크 관련
    "network_error": "인터넷 연결을 확인해주세요.",
    "timeout": "응답 시간 초과 (30초). 잠시 후 다시 시도해주세요.",

    # 서버 관련
    "rate_limit": "요청 한도 초과. 잠시 후 다시 시도해주세요.",
    "server_error": "서버 오류 발생. 잠시 후 다시 시도해주세요.",

    # 입력 관련
    "empty_input": "메시지를 입력해주세요.",
    "invalid_model": "존재하지 않는 모델입니다. 사용 가능한 모델: {models}",

    # 일반 오류
    "unknown_error": "알 수 없는 오류가 발생했습니다: {error}"
}


# ============================================================
# 헬퍼 함수
# ============================================================

def get_api_key():
    """
    환경변수에서 API 키를 가져옵니다.

    Returns:
        str 또는 None: API 키 문자열, 없으면 None

    사용 예시:
        api_key = get_api_key()
        if api_key is None:
            print("API 키를 설정해주세요")
    """
    return os.getenv("OPENROUTER_API_KEY")


def get_model_id(model_name):
    """
    모델 이름으로 OpenRouter 모델 ID를 가져옵니다.

    Args:
        model_name: 모델 이름 (예: "claude", "gpt", "gemini")

    Returns:
        str 또는 None: 모델 ID, 없으면 None

    사용 예시:
        model_id = get_model_id("claude")
        # "anthropic/claude-3.5-sonnet" 반환
    """
    model = MODELS.get(model_name.lower())
    if model:
        return model["id"]
    return None


def get_model_list():
    """
    사용 가능한 모델 목록을 문자열로 반환합니다.

    Returns:
        str: 모델 목록 문자열

    사용 예시:
        print(get_model_list())
        # "claude (Claude 3.5 Sonnet), gpt (GPT-4o Mini), ..."
    """
    items = []
    for key, info in MODELS.items():
        items.append(f"{key} ({info['name']})")
    return ", ".join(items)
