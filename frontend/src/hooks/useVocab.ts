import { useState, useEffect, useCallback } from "react";
import { getDB } from "@/lib/db";
import type { VocabItem } from "@/types";

export function useVocab() {
  const [vocab, setVocab] = useState<VocabItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVocab = useCallback(async () => {
    try {
      const db = await getDB();
      const all = await db.getAllFromIndex("vocabulary", "by-createdAt");
      setVocab(all.reverse());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVocab();
  }, [fetchVocab]);

  // 단어 추가
  const addVocab = useCallback(async (
    item: Omit<VocabItem, "id" | "createdAt">
  ): Promise<VocabItem> => {
    const newItem: VocabItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    const db = await getDB();
    await db.put("vocabulary", newItem);
    await fetchVocab();
    return newItem;
  }, [fetchVocab]);

  // 단어 삭제
  const deleteVocab = useCallback(async (id: string) => {
    const db = await getDB();
    await db.delete("vocabulary", id);
    await fetchVocab();
  }, [fetchVocab]);

  // 단어 검색
  const searchVocab = useCallback((keyword: string): VocabItem[] => {
    const lower = keyword.toLowerCase();
    return vocab.filter(
      (v) =>
        v.word.toLowerCase().includes(lower) ||
        v.meaning.includes(keyword)
    );
  }, [vocab]);

  return {
    vocab,
    isLoading,
    addVocab,
    deleteVocab,
    searchVocab,
  };
}