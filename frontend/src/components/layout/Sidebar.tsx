"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import Icon from "@/components/ui/Icon";
import styles from "./Sidebar.module.scss";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* 로고 */}
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🇺🇸</span>
        <span className={styles.logoText}>EnglishAI</span>
      </div>

      {/* 네비 링크 */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 하단 버전 */}
      <div className={styles.footer}>
        <span>v0.1.0</span>
      </div>
    </aside>
  );
}