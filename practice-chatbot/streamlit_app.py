import streamlit as st
import base64
import os

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
# 유틸리티 함수
# ============================================================

def get_base64_img(path):
    """이미지 파일을 base64로 인코딩합니다."""
    if os.path.exists(path):
        with open(path, "rb") as f:
            data = f.read()
        return base64.b64encode(data).decode()
    return None


# ============================================================
# 페이지 설정
# ============================================================

st.set_page_config(
    page_title="Nexus AI",
    page_icon="assets/logo.png",
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
        # 로고 및 타이틀
        logo_base64 = get_base64_img("assets/logo.png")
        if logo_base64:
            st.markdown(f"""
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 30px;">
                    <img src="data:image/png;base64,{logo_base64}" width="50">
                    <h2 style="margin: 0; color: white;">Nexus AI</h2>
                </div>
            """, unsafe_allow_html=True)
        else:
            st.title("Nexus AI")

        st.markdown("### Model Configuration")

        # 모델 선택
        model_options = list(MODELS.keys())
        model_names = [MODELS[k]["name"] for k in model_options]
        current_model = st.session_state.chat_session["model"]
        current_index = model_options.index(current_model) if current_model in model_options else 0

        selected_index = st.selectbox(
            "Select AI Engine",
            range(len(model_options)),
            index=current_index,
            format_func=lambda i: model_names[i],
            label_visibility="collapsed"
        )

        selected_model = model_options[selected_index]
        if selected_model != st.session_state.chat_session["model"]:
            st.session_state.chat_session["model"] = selected_model
            st.rerun()

        # 모델 설명
        st.caption(MODELS[selected_model]["description"])
        
        # 모델 아이콘 표시
        icon_path = f"assets/{selected_model}.png"
        icon_base64 = get_base64_img(icon_path)
        if icon_base64:
            st.markdown(f"""
                <div style="text-align: center; margin-top: 20px;">
                    <img src="data:image/png;base64,{icon_base64}" width="120" style="border-radius: 12px; filter: drop-shadow(0 0 10px rgba(118, 75, 162, 0.4));">
                </div>
            """, unsafe_allow_html=True)

        st.divider()

        # 대화 초기화
        if st.button("New Conversation", use_container_width=True):
            clear_session(st.session_state.chat_session)
            st.rerun()

        st.divider()

        # 상태 표시
        if st.session_state.api_key_valid:
            st.markdown('<div class="model-chip" style="background: #28a745;">System Online</div>', unsafe_allow_html=True)
        else:
            st.markdown('<div class="model-chip" style="background: #dc3545;">System Offline</div>', unsafe_allow_html=True)

        st.caption(f"Messages: {len(st.session_state.chat_session['messages'])}")


# ============================================================
# 메인 채팅 UI
# ============================================================

def render_chat():
    """메인 채팅 UI를 렌더링합니다."""
    # API 키 오류 시
    if not st.session_state.api_key_valid:
        st.markdown(f"""
            <div style="background: rgba(220, 53, 69, 0.1); border: 1px solid #dc3545; padding: 20px; border-radius: 10px;">
                <h3 style="color: #dc3545; margin-top: 0;">Configuration Required</h3>
                <p style="color: white;">{st.session_state.error_message or ERROR_MESSAGES["no_api_key"]}</p>
            </div>
        """, unsafe_allow_html=True)
        st.stop()

    # 채팅 영역
    chat_container = st.container()

    with chat_container:
        for message in st.session_state.chat_session["messages"]:
            role = message["role"]
            content = message["content"]
            
            # 아바타 설정
            avatar = None
            if role == "assistant":
                avatar = f"assets/{st.session_state.chat_session['model']}.png"
            
            with st.chat_message(role, avatar=avatar):
                st.markdown(content)

    # 사용자 입력
    if user_input := st.chat_input("Message Nexus AI..."):
        # 사용자 메시지 표시
        with st.chat_message("user"):
            st.markdown(user_input)

        # AI 응답 생성
        with st.chat_message("assistant", avatar=f"assets/{st.session_state.chat_session['model']}.png"):
            with st.spinner("Processing..."):
                success, response = send_message(
                    st.session_state.client,
                    st.session_state.chat_session,
                    user_input
                )

            if success:
                st.markdown(response)
            else:
                st.error(response)

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
