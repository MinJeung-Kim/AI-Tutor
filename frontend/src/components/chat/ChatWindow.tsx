"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import ChatBubble from "./ChatBubble";
import StreamingBubble from "./StreamingBubble";
import ChatInput from "./ChatInput";
import styles from "./ChatWindow.module.scss";

interface ChatWindowProps {
  sessionId: string;
}

export default function ChatWindow({ sessionId }: ChatWindowProps) {
  const { messages, streamingText, isStreaming, error, loadMessages, sendMessage, cancelStream } =
    useChat({ sessionId });

  const bottomRef = useRef<HTMLDivElement>(null);

  // 세션 메시지 초기 로드
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // 새 메시지마다 스크롤 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  return (
    <div className={styles.window}>
      {/* 메시지 목록 */}
      <div className={styles.messages}>
        {messages.length === 0 && !isStreaming && (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>💬</p>
            <p className={styles.emptyText}>AI 튜터에게 영어로 말을 걸어보세요!</p>
            <p className={styles.emptyHint}>
              예시: "Can you correct my English?"
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* 스트리밍 중인 AI 응답 */}
        {isStreaming && <StreamingBubble text={streamingText} />}

        {/* 에러 메시지 */}
        {error && (
          <div className={styles.error}>{error}</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <ChatInput
        onSend={sendMessage}
        onCancel={cancelStream}
        isStreaming={isStreaming}
      />
    </div>
  );
}