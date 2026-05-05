import { useState, useCallback, useRef } from "react"; 
import { useSession } from "./seSession";
import type { Message } from "@/types";

interface UseChatOptions {
  sessionId: string;
}

export function useChat({ sessionId }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState("");  // 스트리밍 중 텍스트
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { addMessage, getSession } = useSession();

  // 세션 메시지 불러오기
  const loadMessages = useCallback(async () => {
    const session = await getSession(sessionId);
    if (session) setMessages(session.messages);
  }, [sessionId, getSession]);

  // 메시지 전송 + SSE 스트리밍
  const sendMessage = useCallback(async (content: string) => {
    if (isStreaming || !content.trim()) return;

    setError(null);

    // 1. 유저 메시지 즉시 추가
    const userMessage = await addMessage(sessionId, {
      role: "user",
      content,
    });
    setMessages((prev) => [...prev, userMessage]);

    // 2. SSE 스트리밍 시작
    setIsStreaming(true);
    setStreamingText("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content, sessionId }),
          signal: abortRef.current.signal,
        }
      );

      if (!res.ok) throw new Error("서버 응답 오류");
      if (!res.body) throw new Error("스트림 없음");

      // 3. 스트림 읽기
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // SSE 형식 파싱: "data: 텍스트\n\n"
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const token = line.slice(6); // "data: " 제거
            if (token === "[DONE]") break;
            fullText += token;
            setStreamingText(fullText);
          }
        }
      }

      // 4. 완성된 AI 메시지를 DB에 저장
      const aiMessage = await addMessage(sessionId, {
        role: "assistant",
        content: fullText,
      });
      setMessages((prev) => [...prev, aiMessage]);
      setStreamingText("");

    } catch (err) {
      if ((err as Error).name === "AbortError") return; // 취소는 무시
      setError("메시지 전송에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming, sessionId, addMessage]);

  // 스트리밍 취소
  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setStreamingText("");
  }, []);

  return {
    messages,
    streamingText,
    isStreaming,
    error,
    loadMessages,
    sendMessage,
    cancelStream,
  };
}