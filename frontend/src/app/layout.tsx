import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import MainContent from "@/components/layout/MainContent";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "EnglishAI — AI 영어 튜터",
  description: "AI와 함께하는 영어 학습",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {/* 데스크탑: 사이드바 */}
        <Sidebar />

        {/* 콘텐츠 영역 */}
        <MainContent>
          {children}
        </MainContent>

        {/* 모바일: 바텀 탭바 */}
        <BottomNav />
      </body>
    </html>
  );
}