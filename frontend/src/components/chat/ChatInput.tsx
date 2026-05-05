"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import styles from "./ChatInput.module.scss";

interface ChatInputProps {
  onSend: (content: string) => void;
  onCancel: () => void;
  isStreaming: boolean;
}

export default function ChatInput({
  onSend,
  onCancel,
  isStreaming,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue("");
    // 높이 초기화
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Shift+Enter → 줄바꿈 / Enter → 전송
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 텍스트에 맞게 높이 자동 조절
  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="메시지를 입력하세요... (Enter로 전송)"
          rows={1}
          disabled={false}
        />

        {isStreaming ? (
          <button
            className={`${styles.btn} ${styles.cancel}`}
            onClick={onCancel}
            aria-label="전송 취소"
          >
            ■
          </button>
        ) : (
          <button
            className={`${styles.btn} ${styles.send}`}
            onClick={handleSend}
            disabled={!value.trim()}
            aria-label="메시지 전송"
          >
            ↑
          </button>
        )}
      </div>
      <p className={styles.hint}>
        Shift + Enter로 줄바꿈
      </p>
    </div>
  );
}