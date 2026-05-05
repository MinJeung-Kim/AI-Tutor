"use client";
 
import { useSession } from "@/hooks/seSession";
import { useVocab } from "@/hooks/useVocab";
import { useProgress } from "@/hooks/useProgress";
import styles from "./page.module.scss";

export default function HomePage() {
  const { sessions, createSession } = useSession();
  const { vocab, addVocab } = useVocab();
  const { todayProgress, updateTodayProgress } = useProgress();

  const handleTest = async () => {
    // 세션 생성 테스트
    await createSession("테스트 세션");

    // 단어 추가 테스트
    await addVocab({
      word: "eloquent",
      meaning: "유창한, 설득력 있는",
      example: "She gave an eloquent speech.",
    });

    // 진도 업데이트 테스트
    await updateTodayProgress({ sessionCount: 1, vocabCount: 1 });
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>EnglishAI 👋</h1>

      <button onClick={handleTest} className={styles.testBtn}>
        DB 테스트 실행
      </button>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{sessions.length}</span>
          <span className={styles.statLabel}>세션</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{vocab.length}</span>
          <span className={styles.statLabel}>단어</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>
            {todayProgress?.sessionCount ?? 0}
          </span>
          <span className={styles.statLabel}>오늘 학습</span>
        </div>
      </div>
    </div>
  );
}