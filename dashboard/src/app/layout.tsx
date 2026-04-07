import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "휴먼피부임상센터 음압패치 임상결과",
  description: "휴먼피부임상센터 음압패치 임상결과 — 14개 보고서 데이터 기반",
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
