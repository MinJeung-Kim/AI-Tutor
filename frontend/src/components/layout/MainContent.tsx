import styles from "./MainContent.module.scss";

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <main className={styles.main}>
      {children}
    </main>
  );
}