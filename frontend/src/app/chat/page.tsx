"use client";

import { useState, useEffect } from "react"; 
import { useSession } from "@/hooks/seSession";
import ChatWindow from "@/components/chat/ChatWindow";
import styles from "./page.module.scss";

export default function ChatPage() {
  const { sessions, createSession } = useSession();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // 세션 없으면 자동 생성
  useEffect(() => {
    const init = async () => {
      if (sessions.length === 0) {
        const session = await createSession("새 대화");
        setActiveSessionId(session.id);
      } else {
        setActiveSessionId(sessions[0].id);
      }
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions.length]);

  if (!activeSessionId) {
    return (
      <div className={styles.loading}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return <ChatWindow sessionId={activeSessionId} />;
}