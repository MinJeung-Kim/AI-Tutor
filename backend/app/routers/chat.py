from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import stream_chat_response

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/stream")
async def chat_stream(req: ChatRequest) -> StreamingResponse:
    """SSE 스트리밍 채팅 엔드포인트"""
    return StreamingResponse(
        stream_chat_response(req.message),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # nginx 버퍼링 비활성화
        },
    )


@router.post("/", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    """일반 단일 응답 엔드포인트 (테스트용)"""
    from app.core.models import get_chat_pipeline
    from app.services.chat_service import _build_prompt

    pipe = get_chat_pipeline()
    prompt = _build_prompt(req.message)
    result = pipe(prompt)

    full_text: str = result[0]["generated_text"]
    reply = full_text.replace(prompt, "").strip()

    return ChatResponse(reply=reply, session_id=req.session_id)