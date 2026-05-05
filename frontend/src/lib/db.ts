import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Session, VocabItem, Progress } from "@/types";

// DB 스키마 타입 정의
interface EnglishAIDB extends DBSchema {
  sessions: {
    key: string;
    value: Session;
    indexes: { "by-updatedAt": number };
  };
  vocabulary: {
    key: string;
    value: VocabItem;
    indexes: { "by-createdAt": number };
  };
  progress: {
    key: string; // "YYYY-MM-DD"
    value: Progress;
  };
}

const DB_NAME = "english-ai-db";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<EnglishAIDB> | null = null;

// DB 연결 (싱글턴)
export async function getDB(): Promise<IDBPDatabase<EnglishAIDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<EnglishAIDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 세션 스토어
      const sessionStore = db.createObjectStore("sessions", {
        keyPath: "id",
      });
      sessionStore.createIndex("by-updatedAt", "updatedAt");

      // 단어장 스토어
      const vocabStore = db.createObjectStore("vocabulary", {
        keyPath: "id",
      });
      vocabStore.createIndex("by-createdAt", "createdAt");

      // 진도 스토어
      db.createObjectStore("progress", {
        keyPath: "date",
      });
    },
  });

  return dbInstance;
}