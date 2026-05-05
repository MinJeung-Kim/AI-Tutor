import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.models import get_chat_pipeline
from app.routers import chat, health

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="EnglishAI API",
    version="0.1.0",
    docs_url="/docs" if settings.app_env == "development" else None,
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(health.router)
app.include_router(chat.router)


@app.on_event("startup")
async def startup() -> None:
    """앱 시작 시 모델 미리 로드"""
    logger.info("앱 시작 — 모델 예열 중...")
    get_chat_pipeline()
    logger.info("준비 완료")