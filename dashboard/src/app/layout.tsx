import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cupping Patch Efficacy Dashboard",
  description: "음압패치 효과 검증 임상시험 대시보드 — 14개 보고서 데이터 기반",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
