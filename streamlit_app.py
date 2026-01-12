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
    page_title="~*~*~ 최강 AI 챗봇 ~*~*~",
    page_icon="⭐",
    layout="wide"
)

# CSS 로드
with open("style.css", "r", encoding="utf-8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)


# ============================================================
# 90년대 인터넷 감성 요소들
# ============================================================

RETRO_HEADER = """
<div style="text-align: center; padding: 10px; background: linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #9400D3); margin-bottom: 20px;">
    <marquee behavior="alternate" scrollamount="5">
        <span style="font-size: 24px; color: white; text-shadow: 2px 2px 0 black;">
            ⭐ Welcome to the BEST AI Chatbot ⭐ 방문해 주셔서 감사합니다 ⭐ You are visitor #
        </span>
        <span style="font-size: 28px; color: #FFFF00; font-weight: bold; text-shadow: 2px 2px 0 red;">1,337</span>
        <span style="font-size: 24px; color: white; text-shadow: 2px 2px 0 black;">
            ⭐ Sign my guestbook! ⭐
        </span>
    </marquee>
</div>

<div style="text-align: center; margin-bottom: 10px;">
    <img src="https://web.archive.org/web/20090829052949im_/http://geocities.com/SiliconValley/Peaks/4645/construction.gif" width="100" onerror="this.style.display='none'">
    <span style="color: #FF0000; font-size: 14px; animation: blink 1s infinite;">🚧 UNDER CONSTRUCTION 🚧</span>
    <img src="https://web.archive.org/web/20090829052949im_/http://geocities.com/SiliconValley/Peaks/4645/construction.gif" width="100" onerror="this.style.display='none'">
</div>
"""

DANCING_EMOJIS = """
<div style="text-align: center; font-size: 30px; margin: 10px 0;">
    <span style="display: inline-block; animation: bounce 0.5s infinite;">🕺</span>
    <span style="display: inline-block; animation: bounce 0.5s infinite 0.1s;">💃</span>
    <span style="display: inline-block; animation: bounce 0.5s infinite 0.2s;">🎵</span>
    <span style="display: inline-block; animation: bounce 0.5s infinite 0.3s;">🌟</span>
    <span style="display: inline-block; animation: bounce 0.5s infinite 0.4s;">💖</span>
    <span style="display: inline-block; animation: bounce 0.5s infinite 0.5s;">🎶</span>
    <span style="display: inline-block; animation: bounce 0.5s infinite 0.6s;">✨</span>
</div>
"""

NETSCAPE_BADGE = """
<div style="text-align: center; margin-top: 20px; padding: 10px; background: #C0C0C0; border: 3px outset white;">
    <table align="center" border="0">
        <tr>
            <td style="background: #000080; color: white; padding: 5px; font-size: 12px;">
                Best viewed with<br>
                <b>Netscape Navigator 4.0</b><br>
                Resolution: 1024x768
            </td>
            <td style="padding: 5px;">
                <span style="font-size: 20px;">🌐</span>
            </td>
        </tr>
    </table>
    <p style="font-size: 10px; color: #666;">
        Last updated: 1999년 12월 31일 |
        <span style="animation: rainbow 2s linear infinite;">Made with 💖 in Korea</span>
    </p>
</div>
"""

GUESTBOOK_BANNER = """
<div style="background: #FFFF00; border: 3px dashed #FF0000; padding: 10px; margin: 10px 0; text-align: center;">
    <span style="color: #FF0000; font-weight: bold; font-size: 16px;">
        📝 Sign my GUESTBOOK! 방명록에 글 남겨주세요! 📝
    </span>
</div>
"""


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
        # 90년대 스타일 타이틀
        st.markdown("""
            <div style="text-align: center; margin-bottom: 20px; padding: 10px; background: linear-gradient(180deg, #000080, #0000FF); border: 4px outset #C0C0C0;">
                <h2 style="color: #00FF00; text-shadow: 2px 2px 0 #FF00FF; margin: 0; animation: shake 0.5s infinite;">
                    ⭐ AI 챗봇 ⭐
                </h2>
                <p style="color: #FFFF00; font-size: 10px; margin: 5px 0 0 0;">
                    Since 1999
                </p>
            </div>
        """, unsafe_allow_html=True)

        # 움직이는 이모지
        st.markdown("""
            <div style="text-align: center; font-size: 20px;">
                <span style="display: inline-block; animation: spin3d 2s linear infinite;">🌐</span>
                <span style="display: inline-block; animation: bounce 1s infinite;">💻</span>
                <span style="display: inline-block; animation: spin3d 2s linear infinite reverse;">🌐</span>
            </div>
        """, unsafe_allow_html=True)

        st.markdown("""
            <h3 style="color: #00FFFF; text-shadow: 1px 1px 0 #FF0000; text-align: center;">
                🖥️ Model Configuration 🖥️
            </h3>
        """, unsafe_allow_html=True)

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

        # 상태 표시 - 90년대 스타일
        if st.session_state.api_key_valid:
            st.markdown("""
                <div style="background: #00FF00; color: #000000; padding: 10px; text-align: center; border: 3px outset #FFFFFF; margin: 10px 0;">
                    <span style="font-weight: bold; animation: blink 1s infinite;">✓ SYSTEM ONLINE ✓</span>
                </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
                <div style="background: #FF0000; color: #FFFFFF; padding: 10px; text-align: center; border: 3px outset #FFFFFF; margin: 10px 0;">
                    <span style="font-weight: bold; animation: blink 0.5s infinite;">✗ SYSTEM OFFLINE ✗</span>
                </div>
            """, unsafe_allow_html=True)

        st.markdown(f"""
            <div style="background: #000000; color: #00FF00; padding: 5px; font-family: monospace; border: 2px inset #808080; text-align: center;">
                Messages: {len(st.session_state.chat_session['messages'])} |
                <span style="animation: rainbow 3s linear infinite;">ONLINE</span>
            </div>
        """, unsafe_allow_html=True)

        # Netscape 뱃지
        st.markdown(NETSCAPE_BADGE, unsafe_allow_html=True)


# ============================================================
# 메인 채팅 UI
# ============================================================

def render_chat():
    """메인 채팅 UI를 렌더링합니다."""
    # 레트로 헤더 표시
    st.markdown(RETRO_HEADER, unsafe_allow_html=True)
    st.markdown(DANCING_EMOJIS, unsafe_allow_html=True)

    # 메인 타이틀 - 무지개 그림자
    st.markdown("""
        <h1 style="text-align: center; color: #FFFF00; text-shadow: 3px 3px 0 #FF0000, 6px 6px 0 #FF7F00, 9px 9px 0 #00FF00, 12px 12px 0 #0000FF;">
            ~*~*~ 최강 AI 챗봇 ~*~*~
        </h1>
    """, unsafe_allow_html=True)

    st.markdown(GUESTBOOK_BANNER, unsafe_allow_html=True)

    # API 키 오류 시
    if not st.session_state.api_key_valid:
        st.markdown(f"""
            <div style="background: #800000; border: 5px ridge #FF0000; padding: 20px; text-align: center;">
                <h3 style="color: #FFFF00; animation: blink 1s infinite;">⚠️ ERROR ⚠️</h3>
                <p style="color: #00FF00; font-family: monospace;">{st.session_state.error_message or ERROR_MESSAGES["no_api_key"]}</p>
                <marquee style="color: #FF00FF;">Please configure your API key to continue...</marquee>
            </div>
        """, unsafe_allow_html=True)
        st.stop()

    # 채팅 영역
    chat_container = st.container()

    with chat_container:
        for message in st.session_state.chat_session["messages"]:
            role = message["role"]
            content = message["content"]

            # 90년대 감성 이모지 아바타
            if role == "assistant":
                avatar = "🤖"
            else:
                avatar = "👤"

            with st.chat_message(role, avatar=avatar):
                st.markdown(content)

    # 사용자 입력
    if user_input := st.chat_input("여기에 메시지를 입력하세요... 🌟"):
        # 사용자 메시지 표시
        with st.chat_message("user", avatar="👤"):
            st.markdown(user_input)

        # AI 응답 생성
        with st.chat_message("assistant", avatar="🤖"):
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
