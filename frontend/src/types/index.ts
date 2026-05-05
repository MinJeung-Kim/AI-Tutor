// 채팅 메시지
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

// 학습 세션
export interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// 단어장 아이템
export interface VocabItem {
  id: string;
  word: string;
  meaning: string;
  example: string;
  createdAt: number;
}

// 학습 진도
export interface Progress {
  date: string;           // "2025-05-05"
  sessionCount: number;
  vocabCount: number;
  quizScore: number;      // 0~100
}

// API 응답 공통
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// 채팅 API
export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  reply: string;
  correction?: string;    // 문법 교정 결과
}