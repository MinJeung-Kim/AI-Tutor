import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_chat_basic():
    res = client.post(
        "/chat/",
        json={"message": "Hello! Can you help me practice English?"},
    )
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert isinstance(data["reply"], str)
    assert len(data["reply"]) > 0


def test_chat_stream():
    """SSE 스트리밍 응답 확인"""
    with client.stream(
        "POST",
        "/chat/stream",
        json={"message": "What is the weather like today?"},
    ) as res:
        assert res.status_code == 200
        assert "text/event-stream" in res.headers["content-type"]

        chunks = []
        for line in res.iter_lines():
            if line.startswith("data: "):
                token = line[6:]
                if token == "[DONE]":
                    break
                chunks.append(token)

        full_text = "".join(chunks)
        assert len(full_text) > 0