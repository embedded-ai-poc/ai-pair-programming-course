"""
콘솔 챗봇 애플리케이션

터미널에서 실행하여 AI와 대화할 수 있습니다.

실행 방법:
    python console_app.py

명령어:
    /help     - 도움말 표시
    /models   - 사용 가능한 모델 목록
    /model X  - 모델 변경 (예: /model claude)
    /clear    - 대화 초기화
    /quit     - 종료 (또는 'quit', 'exit', '종료')
"""

from config import (
    get_api_key,
    MODELS,
    DEFAULT_MODEL,
    ERROR_MESSAGES,
    get_model_list
)
from chatbot import (
    create_client,
    validate_api_key,
    create_session,
    send_message,
    switch_model,
    clear_session,
    get_current_model_name
)


def print_welcome():
    """
    시작 메시지를 출력합니다.
    """
    print("=" * 60)
    print("  AI 챗봇에 오신 것을 환영합니다!")
    print("=" * 60)
    print()
    print("  /help    - 도움말 보기")
    print("  /quit    - 종료하기")
    print()
    print("-" * 60)


def print_help():
    """
    도움말 메시지를 출력합니다.
    """
    print()
    print("=" * 40)
    print("  도움말")
    print("=" * 40)
    print()
    print("  명령어:")
    print("    /help     - 이 도움말 표시")
    print("    /models   - 사용 가능한 모델 목록")
    print("    /model X  - 모델 변경 (예: /model claude)")
    print("    /clear    - 대화 초기화")
    print("    /quit     - 종료")
    print()
    print("  종료:")
    print("    'quit', 'exit', '종료' 입력")
    print()
    print("-" * 40)


def print_models(current_model):
    """
    사용 가능한 모델 목록을 출력합니다.

    Args:
        current_model: 현재 사용 중인 모델 이름
    """
    print()
    print("=" * 50)
    print("  사용 가능한 모델")
    print("=" * 50)
    print()

    for key, info in MODELS.items():
        # 현재 모델 표시
        marker = " [현재]" if key == current_model else ""
        print(f"  {key}{marker}")
        print(f"    - 이름: {info['name']}")
        print(f"    - 설명: {info['description']}")
        print()

    print("  사용법: /model 모델이름")
    print("  예시: /model claude")
    print()
    print("-" * 50)


def handle_command(command, session):
    """
    슬래시 명령어를 처리합니다.

    Args:
        command: 사용자가 입력한 명령어 (예: "/model claude")
        session: 대화 세션 딕셔너리

    Returns:
        bool: 프로그램 종료 여부 (True면 종료)
    """
    # 명령어 파싱
    parts = command.strip().split()
    cmd = parts[0].lower()

    # /quit - 종료
    if cmd in ["/quit", "/exit", "/종료"]:
        return True

    # /help - 도움말
    if cmd == "/help":
        print_help()
        return False

    # /models - 모델 목록
    if cmd == "/models":
        print_models(session["model"])
        return False

    # /model - 모델 변경
    if cmd == "/model":
        if len(parts) < 2:
            print()
            print("[알림] 모델 이름을 입력해주세요.")
            print("예시: /model claude")
            print()
            return False

        new_model = parts[1]
        success, error = switch_model(session, new_model)

        if success:
            print()
            print(f"[알림] 모델이 '{get_current_model_name(session)}'(으)로 변경되었습니다.")
            print()
        else:
            print()
            print(f"[오류] {error}")
            print()
        return False

    # /clear - 대화 초기화
    if cmd == "/clear":
        clear_session(session)
        print()
        print("[알림] 대화 내용이 초기화되었습니다.")
        print()
        return False

    # 알 수 없는 명령어
    print()
    print(f"[알림] 알 수 없는 명령어: {cmd}")
    print("/help 를 입력하여 사용 가능한 명령어를 확인하세요.")
    print()
    return False


def main():
    """
    챗봇 메인 함수.
    프로그램 시작점입니다.
    """
    # 환영 메시지 출력
    print_welcome()

    # API 키 확인
    api_key = get_api_key()
    is_valid, error = validate_api_key(api_key)

    if not is_valid:
        print()
        print("[오류] API 키 문제")
        print(error)
        print()
        return

    print(f"[알림] API 키 확인 완료!")
    print()

    # 클라이언트 및 세션 생성
    client = create_client(api_key)
    session = create_session(DEFAULT_MODEL)

    print(f"[알림] 현재 모델: {get_current_model_name(session)}")
    print()

    # 메인 대화 루프
    while True:
        try:
            # 사용자 입력 받기
            user_input = input("나: ").strip()

            # 종료 명령어 확인
            if user_input.lower() in ["quit", "exit", "종료"]:
                print()
                print("챗봇을 종료합니다. 감사합니다!")
                break

            # 빈 입력 처리
            if not user_input:
                print()
                print(f"[알림] {ERROR_MESSAGES['empty_input']}")
                print()
                continue

            # 슬래시 명령어 처리
            if user_input.startswith("/"):
                should_quit = handle_command(user_input, session)
                if should_quit:
                    print()
                    print("챗봇을 종료합니다. 감사합니다!")
                    break
                continue

            # AI에게 메시지 전송
            print()
            print("AI가 생각 중...")

            success, response = send_message(client, session, user_input)

            if success:
                print()
                print(f"AI: {response}")
                print()
            else:
                print()
                print(f"[오류] {response}")
                print()

        except KeyboardInterrupt:
            # Ctrl+C 처리
            print()
            print()
            print("챗봇을 종료합니다. 감사합니다!")
            break

        except Exception as e:
            print()
            print(f"[오류] 예상치 못한 오류: {e}")
            print()


# 프로그램 시작점
if __name__ == "__main__":
    main()
