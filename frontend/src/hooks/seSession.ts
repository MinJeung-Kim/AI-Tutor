import { useState, useEffect, useCallback } from "react";
import { getDB } from "@/lib/db";
import type { Session, Message } from "@/types";

export function useSession() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 전체 세션 불러오기 (최신순)
  const fetchSessions = useCallback(async () => {
    try {
      const db = await getDB();
      const all = await db.getAllFromIndex("sessions", "by-updatedAt");
      setSessions(all.reverse()); // 최신순 정렬
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // 새 세션 생성
  const createSession = useCallback(async (title: string): Promise<Session> => {
    const now = Date.now();
    const session: Session = {
      id: crypto.randomUUID(),
      title,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDB();
    await db.put("sessions", session);
    await fetchSessions();
    return session;
  }, [fetchSessions]);

  // 메시지 추가
  const addMessage = useCallback(async (
    sessionId: string,
    message: Omit<Message, "id" | "createdAt">
  ): Promise<Message> => {
    const db = await getDB();
    const session = await db.get("sessions", sessionId);
    if (!session) throw new Error("세션을 찾을 수 없어요");

    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    const updated: Session = {
      ...session,
      messages: [...session.messages, newMessage],
      updatedAt: Date.now(),
    };

    await db.put("sessions", updated);
    await fetchSessions();
    return newMessage;
  }, [fetchSessions]);

  // 세션 삭제
  const deleteSession = useCallback(async (sessionId: string) => {
    const db = await getDB();
    await db.delete("sessions", sessionId);
    await fetchSessions();
  }, [fetchSessions]);

  // 단일 세션 조회
  const getSession = useCallback(async (
    sessionId: string
  ): Promise<Session | undefined> => {
    const db = await getDB();
    return db.get("sessions", sessionId);
  }, []);

  return {
    sessions,
    isLoading,
    createSession,
    addMessage,
    deleteSession,
    getSession,
  };
}