import styles from "./StreamingBubble.module.scss";

interface StreamingBubbleProps {
  text: string;
}

export default function StreamingBubble({ text }: StreamingBubbleProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>🤖</div>
      <div className={styles.bubble}>
        {text ? (
          <p className={styles.text}>{text}</p>
        ) : (
          // 텍스트 오기 전 점 애니메이션
          <div className={styles.dots}>
            <span /><span /><span />
          </div>
        )}
      </div>
    </div>
  );
}