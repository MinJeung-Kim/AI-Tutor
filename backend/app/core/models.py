from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

from app.core.config import settings

if TYPE_CHECKING:
    from transformers import Pipeline

logger = logging.getLogger(__name__)

# 싱글턴 인스턴스
_chat_pipeline: "Pipeline | None" = None


def get_chat_pipeline() -> "Pipeline":
    global _chat_pipeline

    if _chat_pipeline is not None:
        return _chat_pipeline

    logger.info("모델 로딩 중: %s", settings.chat_model_name)

    tokenizer = AutoTokenizer.from_pretrained(settings.chat_model_name)
    model = AutoModelForCausalLM.from_pretrained(settings.chat_model_name)

    _chat_pipeline = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        max_new_tokens=settings.max_new_tokens,
        temperature=settings.temperature,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id,
    )

    logger.info("모델 로딩 완료")
    return _chat_pipeline