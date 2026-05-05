from __future__ import annotations

import asyncio
import logging
from collections.abc import AsyncGenerator

from app.core.models import get_chat_pipeline

logger = logging.getLogger(__name__)

# 시스템 프롬프트 — AI 튜터 역할 정의
SYSTEM_PROMPT = (
    "You are a friendly English tutor. "
    "Help the student practice English conversation. "
    "If the student makes grammar mistakes, gently correct them "
    "and provide the corrected sentence. "
    "Keep responses concise and encouraging."
)


def _build_prompt(user_message: str) -> str:
    """DialoGPT 형식에 맞게 프롬프트 구성"""
    return f"{SYSTEM_PROMPT}\nStudent: {user_message}\nTutor:"


async def stream_chat_response(
    message: str,
) -> AsyncGenerator[str, None]:
    """
    HuggingFace 모델 응답을 단어 단위로 스트리밍
    SSE 형식: "data: 토큰\n\n"
    """
    pipe = get_chat_pipeline()
    prompt = _build_prompt(message)

    # HuggingFace pipeline은 동기 → asyncio로 감싸서 비동기 처리
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        None,
        lambda: pipe(prompt),
    )

    # 생성된 전체 텍스트에서 프롬프트 제거
    full_text: str = result[0]["generated_text"]
    reply = full_text.replace(prompt, "").strip()

    if not reply:
        reply = "I'm not sure how to respond. Could you try again?"

    # 단어 단위로 쪼개서 스트리밍처럼 보내기
    # 실제 토큰 스트리밍은 TextIteratorStreamer로 확장 가능
    words = reply.split(" ")
    for i, word in enumerate(words):
        token = word if i == 0 else f" {word}"
        yield f"data: {token}\n\n"
        await asyncio.sleep(0.05)  # 타이핑 효과

    yield "data: [DONE]\n\n"