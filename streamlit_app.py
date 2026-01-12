import streamlit as st
import random

from config import (
    get_api_key,
    MODELS,
    DEFAULT_MODEL,
    ERROR_MESSAGES
)
from chatbot import (
    create_client,
    validate_api_key,
    create_session,
    send_message,
    clear_session,
    get_current_model_name
)


# ============================================================
# 페이지 설정
# ============================================================

st.set_page_config(
    page_title="~*~*~ 최강 AI 챗봇 ~*~*~",
    page_icon="⭐",
    layout="wide"
)

# CSS 로드
with open("style.css", "r", encoding="utf-8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)


# ============================================================
# 세션 상태 초기화
# ============================================================

def init_session_state():
    """Streamlit 세션 상태를 초기화합니다."""
    if "client" not in st.session_state:
        st.session_state.client = None
    if "chat_session" not in st.session_state:
        st.session_state.chat_session = create_session(DEFAULT_MODEL)
    if "api_key_valid" not in st.session_state:
        st.session_state.api_key_valid = False
    if "error_message" not in st.session_state:
        st.session_state.error_message = None
    if "visitor_count" not in st.session_state:
        st.session_state.visitor_count = random.randint(1000, 9999)

init_session_state()


# ============================================================
# API 키 검증 및 클라이언트 생성
# ============================================================

def setup_api_client():
    """API 키를 검증하고 클라이언트를 생성합니다."""
    if st.session_state.api_key_valid and st.session_state.client:
        return True

    api_key = get_api_key()
    if not api_key:
        try:
            api_key = st.secrets.get("OPENROUTER_API_KEY")
        except Exception:
            pass

    is_valid, error = validate_api_key(api_key)
    if not is_valid:
        st.session_state.api_key_valid = False
        st.session_state.error_message = error
        return False

    st.session_state.client = create_client(api_key)
    st.session_state.api_key_valid = True
    st.session_state.error_message = None
    return True


# ============================================================
# 사이드바 UI
# ============================================================

def render_sidebar():
    """사이드바 UI를 렌더링합니다."""
    with st.sidebar:
        # 타이틀
        st.markdown("""
            <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: linear-gradient(180deg, #000080, #0000FF); border: 4px outset #C0C0C0;">
                <h2 style="color: #00FF00; text-shadow: 2px 2px 0 #000; margin: 0;">
                    ⭐ AI 챗봇 ⭐
                </h2>
            </div>
        """, unsafe_allow_html=True)

        st.markdown("### 🖥️ 모델 선택")

        # 모델 선택
        model_options = list(MODELS.keys())
        model_names = [MODELS[k]["name"] for k in model_options]
        current_model = st.session_state.chat_session["model"]
        current_index = model_options.index(current_model) if current_model in model_options else 0

        selected_index = st.selectbox(
            "AI 모델",
            range(len(model_options)),
            index=current_index,
            format_func=lambda i: model_names[i],
            label_visibility="collapsed"
        )

        selected_model = model_options[selected_index]
        if selected_model != st.session_state.chat_session["model"]:
            st.session_state.chat_session["model"] = selected_model
            st.toast(f"✨ {MODELS[selected_model]['name']} 모델로 변경!")
            st.rerun()

        # 모델 정보 팝업
        with st.expander("ℹ️ 모델 정보 보기"):
            model_info = MODELS[selected_model]
            st.markdown(f"""
                **{model_info['name']}**

                {model_info['description']}

                - 최대 토큰: {model_info['max_tokens']:,}
            """)

        st.divider()

        # 대화 초기화
        if st.button("🗑️ 대화 초기화", use_container_width=True):
            msg_count = len(st.session_state.chat_session['messages'])
            clear_session(st.session_state.chat_session)
            st.toast(f"💫 {msg_count}개 메시지 삭제 완료!")
            st.rerun()

        st.divider()

        # 상태 표시
        if st.session_state.api_key_valid:
            st.success("✓ 연결됨")
        else:
            st.error("✗ 연결 안됨")

        st.caption(f"💬 메시지: {len(st.session_state.chat_session['messages'])}개")
        st.caption(f"👀 방문자: #{st.session_state.visitor_count}")


# ============================================================
# 메인 채팅 UI
# ============================================================

def render_chat():
    """메인 채팅 UI를 렌더링합니다."""
    # 헤더
    st.markdown("""
        <div style="text-align: center; padding: 15px; background: linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #9400D3); margin-bottom: 20px; border-radius: 10px;">
            <h1 style="color: white; text-shadow: 3px 3px 0 #000; margin: 0; font-size: 2em;">
                ~*~*~ 최강 AI 챗봇 ~*~*~
            </h1>
        </div>
    """, unsafe_allow_html=True)

    # API 키 오류 시
    if not st.session_state.api_key_valid:
        st.error("⚠️ API 키가 설정되지 않았습니다.")
        with st.expander("🔧 설정 방법"):
            st.markdown(st.session_state.error_message or ERROR_MESSAGES["no_api_key"])
        st.stop()

    # 현재 모델 표시
    current_model_name = get_current_model_name(st.session_state.chat_session)
    st.caption(f"🤖 현재 모델: **{current_model_name}**")

    # 채팅 영역
    chat_container = st.container()

    with chat_container:
        for message in st.session_state.chat_session["messages"]:
            role = message["role"]
            content = message["content"]

            if role == "assistant":
                avatar = "🤖"
            else:
                avatar = "👤"

            with st.chat_message(role, avatar=avatar):
                st.markdown(content)

    # 사용자 입력
    if user_input := st.chat_input("메시지를 입력하세요..."):
        # 사용자 메시지 표시
        with st.chat_message("user", avatar="👤"):
            st.markdown(user_input)

        # AI 응답 생성
        with st.chat_message("assistant", avatar="🤖"):
            with st.spinner("🔮 생각 중..."):
                success, response = send_message(
                    st.session_state.client,
                    st.session_state.chat_session,
                    user_input
                )

            if success:
                st.markdown(response)
                st.toast("✅ 응답 완료!")
            else:
                st.error(response)
                st.toast("❌ 오류 발생", icon="⚠️")

        st.rerun()


# ============================================================
# 메인 함수
# ============================================================

def main():
    """Streamlit 앱 메인 함수."""
    setup_api_client()
    render_sidebar()
    render_chat()

if __name__ == "__main__":
    main()
