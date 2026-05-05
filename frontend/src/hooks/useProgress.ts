import { useState, useEffect, useCallback } from "react";
import { getDB } from "@/lib/db";
import type { Progress } from "@/types";

// 오늘 날짜 키 ("YYYY-MM-DD")
function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function useProgress() {
  const [todayProgress, setTodayProgress] = useState<Progress | null>(null);
  const [allProgress, setAllProgress] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    try {
      const db = await getDB();
      const all = await db.getAll("progress");
      const sorted = all.sort((a, b) => b.date.localeCompare(a.date));
      setAllProgress(sorted);

      const today = await db.get("progress", todayKey());
      setTodayProgress(today ?? null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // 오늘 진도 업데이트 (누적)
  const updateTodayProgress = useCallback(async (
    patch: Partial<Omit<Progress, "date">>
  ) => {
    const db = await getDB();
    const key = todayKey();
    const existing = await db.get("progress", key);

    const updated: Progress = {
      date: key,
      sessionCount: (existing?.sessionCount ?? 0) + (patch.sessionCount ?? 0),
      vocabCount:   (existing?.vocabCount   ?? 0) + (patch.vocabCount   ?? 0),
      quizScore:    patch.quizScore ?? existing?.quizScore ?? 0,
    };

    await db.put("progress", updated);
    await fetchProgress();
  }, [fetchProgress]);

  // 최근 N일 진도 (차트용)
  const getRecentProgress = useCallback((days: number): Progress[] => {
    return allProgress.slice(0, days);
  }, [allProgress]);

  return {
    todayProgress,
    allProgress,
    isLoading,
    updateTodayProgress,
    getRecentProgress,
  };
}