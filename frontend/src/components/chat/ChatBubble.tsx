import type { Message } from "@/types";
import styles from "./ChatBubble.module.scss";

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`${styles.wrapper} ${isUser ? styles.user : styles.ai}`}>
      {!isUser && (
        <div className={styles.avatar}>🤖</div>
      )}
      <div className={styles.bubble}>
        <p className={styles.text}>{message.content}</p>
        <span className={styles.time}>
          {new Date(message.createdAt).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}