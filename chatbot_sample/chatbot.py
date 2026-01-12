"""
챗봇 핵심 로직 모듈

OpenRouter API와 통신하고 대화를 관리하는 핵심 기능을 제공합니다.
콘솔 앱과 Streamlit 앱 모두 이 모듈을 공유합니다.

사용 예시:
    from chatbot import create_client, send_message, create_session

    client = create_client(api_key)
    session = create_session("gpt")
    response = send_message(client, session, "안녕하세요!")
"""

from openai import OpenAI
import openai
import requests

from config import (
    API_BASE_URL,
    API_TIMEOUT,
    MAX_HISTORY_LENGTH,
    MODELS,
    DEFAULT_MODEL,
    ERROR_MESSAGES,
    get_model_id,
    get_model_list
)


# ============================================================
# API 클라이언트 생성
# ============================================================

def create_client(api_key):
    """
    OpenRouter API 클라이언트를 생성합니다.

    Args:
        api_key: OpenRouter API 키

    Returns:
        OpenAI: API 클라이언트 객체

    사용 예시:
        client = create_client("sk-or-...")
    """
    client = OpenAI(
        base_url=API_BASE_URL,
        api_key=api_key,
        timeout=API_TIMEOUT
    )
    return client


def validate_api_key(api_key):
    """
    API 키가 유효한지 확인합니다.
    /models 엔드포인트를 호출하여 검증합니다.

    Args:
        api_key: 검증할 API 키

    Returns:
        tuple: (성공 여부, 에러 메시지 또는 None)

    사용 예시:
        is_valid, error = validate_api_key(api_key)
        if not is_valid:
            print(error)
    """
    # API 키가 비어있는지 확인
    if not api_key or api_key.strip() == "":
        return False, ERROR_MESSAGES["no_api_key"]

    # API 호출로 키 유효성 검증
    try:
        response = requests.get(
            f"{API_BASE_URL}/models",
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=10
        )

        if response.status_code == 401:
            return False, ERROR_MESSAGES["invalid_api_key"]

        if response.status_code == 200:
            return True, None

        return False, ERROR_MESSAGES["unknown_error"].format(
            error=f"상태 코드: {response.status_code}"
        )

    except requests.exceptions.ConnectionError:
        return False, ERROR_MESSAGES["network_error"]
    except requests.exceptions.Timeout:
        return False, ERROR_MESSAGES["timeout"]
    except Exception as e:
        return False, ERROR_MESSAGES["unknown_error"].format(error=str(e))


# ============================================================
# 세션 관리
# ============================================================

def create_session(model_name=None):
    """
    새로운 대화 세션을 생성합니다.

    Args:
        model_name: 사용할 모델 이름 (기본값: DEFAULT_MODEL)

    Returns:
        dict: 세션 정보 딕셔너리
            - model: 현재 모델 이름
            - messages: 대화 히스토리 리스트

    사용 예시:
        session = create_session("claude")
        session = create_session()  # 기본 모델 사용
    """
    if model_name is None:
        model_name = DEFAULT_MODEL

    # 모델이 유효한지 확인
    if model_name.lower() not in MODELS:
        model_name = DEFAULT_MODEL

    return {
        "model": model_name.lower(),
        "messages": []
    }


def add_message(session, role, content):
    """
    세션에 메시지를 추가합니다.
    최대 개수를 초과하면 오래된 메시지를 삭제합니다.

    Args:
        session: 대화 세션 딕셔너리
        role: 메시지 역할 ("user" 또는 "assistant")
        content: 메시지 내용

    Returns:
        None (세션을 직접 수정)

    사용 예시:
        add_message(session, "user", "안녕하세요!")
        add_message(session, "assistant", "안녕하세요! 무엇을 도와드릴까요?")
    """
    session["messages"].append({
        "role": role,
        "content": content
    })

    # 최대 개수 초과 시 가장 오래된 메시지부터 삭제
    if len(session["messages"]) > MAX_HISTORY_LENGTH:
        # 리스트 슬라이싱으로 효율적으로 제한
        session["messages"] = session["messages"][-MAX_HISTORY_LENGTH:]


def clear_session(session):
    """
    세션의 대화 히스토리를 초기화합니다.

    Args:
        session: 대화 세션 딕셔너리

    Returns:
        None (세션을 직접 수정)

    사용 예시:
        clear_session(session)
    """
    session["messages"] = []


def switch_model(session, model_name):
    """
    세션의 모델을 변경합니다.

    Args:
        session: 대화 세션 딕셔너리
        model_name: 새로운 모델 이름

    Returns:
        tuple: (성공 여부, 에러 메시지 또는 None)

    사용 예시:
        success, error = switch_model(session, "claude")
    """
    if model_name.lower() not in MODELS:
        error_msg = ERROR_MESSAGES["invalid_model"].format(
            models=get_model_list()
        )
        return False, error_msg

    session["model"] = model_name.lower()
    return True, None


# ============================================================
# 메시지 전송
# ============================================================

def send_message(client, session, user_input):
    """
    사용자 메시지를 보내고 AI 응답을 받습니다.

    Args:
        client: OpenRouter API 클라이언트
        session: 대화 세션 딕셔너리
        user_input: 사용자가 입력한 메시지

    Returns:
        tuple: (성공 여부, 응답 또는 에러 메시지)
            - 성공 시: (True, AI 응답 문자열)
            - 실패 시: (False, 에러 메시지 문자열)

    사용 예시:
        success, response = send_message(client, session, "안녕!")
        if success:
            print(response)
        else:
            print(f"오류: {response}")
    """
    # 빈 입력 확인
    if not user_input or user_input.strip() == "":
        return False, ERROR_MESSAGES["empty_input"]

    # 모델 정보 가져오기
    model_info = MODELS.get(session["model"])
    if not model_info:
        return False, ERROR_MESSAGES["invalid_model"].format(
            models=get_model_list()
        )

    # 사용자 메시지를 임시 저장 (롤백 대비)
    user_message = {"role": "user", "content": user_input}
    session["messages"].append(user_message)

    # 히스토리 제한 적용
    if len(session["messages"]) > MAX_HISTORY_LENGTH:
        session["messages"] = session["messages"][-MAX_HISTORY_LENGTH:]

    # API 호출
    try:
        response = client.chat.completions.create(
            model=model_info["id"],
            max_tokens=model_info["max_tokens"],
            messages=session["messages"]
        )

        # 응답 추출
        assistant_message = response.choices[0].message.content

        # AI 응답을 세션에 추가
        add_message(session, "assistant", assistant_message)

        return True, assistant_message

    # OpenAI SDK 구조화된 예외 처리
    except openai.RateLimitError:
        # Rate limit 에러 - 롤백 후 반환
        _rollback_user_message(session, user_message)
        return False, ERROR_MESSAGES["rate_limit"]

    except openai.APIConnectionError:
        # 네트워크 연결 에러
        _rollback_user_message(session, user_message)
        return False, ERROR_MESSAGES["network_error"]

    except openai.APITimeoutError:
        # 타임아웃 에러
        _rollback_user_message(session, user_message)
        return False, ERROR_MESSAGES["timeout"]

    except openai.AuthenticationError:
        # 인증 에러
        _rollback_user_message(session, user_message)
        return False, ERROR_MESSAGES["invalid_api_key"]

    except openai.APIStatusError as e:
        # 기타 API 상태 에러 (5xx 등)
        _rollback_user_message(session, user_message)
        if e.status_code >= 500:
            return False, ERROR_MESSAGES["server_error"]
        return False, ERROR_MESSAGES["unknown_error"].format(error=str(e))

    except Exception as e:
        # 기타 예외
        _rollback_user_message(session, user_message)
        error_message = handle_error(e)
        return False, error_message


def _rollback_user_message(session, user_message):
    """
    에러 발생 시 사용자 메시지를 롤백합니다.
    추가한 정확한 메시지를 찾아서 삭제합니다.

    Args:
        session: 대화 세션 딕셔너리
        user_message: 롤백할 사용자 메시지 딕셔너리
    """
    # 마지막 메시지가 추가한 메시지와 일치하면 삭제
    if session["messages"] and session["messages"][-1] == user_message:
        session["messages"].pop()


def handle_error(error):
    """
    API 오류를 사용자 친화적인 메시지로 변환합니다.

    Args:
        error: 발생한 예외 객체

    Returns:
        str: 한국어 에러 메시지

    사용 예시:
        try:
            # API 호출
        except Exception as e:
            message = handle_error(e)
            print(message)
    """
    error_str = str(error).lower()

    # 타임아웃
    if "timeout" in error_str or "timed out" in error_str:
        return ERROR_MESSAGES["timeout"]

    # 인증 오류
    if "401" in error_str or "unauthorized" in error_str:
        return ERROR_MESSAGES["invalid_api_key"]

    # Rate limit
    if "429" in error_str or "rate" in error_str:
        return ERROR_MESSAGES["rate_limit"]

    # 서버 오류 (5xx)
    if any(code in error_str for code in ["500", "502", "503", "504"]):
        return ERROR_MESSAGES["server_error"]

    # 네트워크 오류
    if "connection" in error_str or "network" in error_str:
        return ERROR_MESSAGES["network_error"]

    # 알 수 없는 오류
    return ERROR_MESSAGES["unknown_error"].format(error=str(error))


# ============================================================
# 유틸리티 함수
# ============================================================

def get_current_model_name(session):
    """
    현재 세션에서 사용 중인 모델의 표시 이름을 반환합니다.

    Args:
        session: 대화 세션 딕셔너리

    Returns:
        str: 모델 표시 이름

    사용 예시:
        name = get_current_model_name(session)
        print(f"현재 모델: {name}")
    """
    model_key = session.get("model", DEFAULT_MODEL)
    model_info = MODELS.get(model_key)
    if model_info:
        return model_info["name"]
    return "알 수 없는 모델"
