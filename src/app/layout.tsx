import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { PWAInstaller } from "@/components/PWAInstaller";

export const metadata: Metadata = {
  title: "AI 챗봇 아미",
  description: "친구 같은 AI와 채팅하는 앱",
  manifest: "/manifest.json",
  themeColor: "#5345ec",
  viewport: "width=device-width, initial-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI 챗봇 아미",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" as="style" crossOrigin="" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        <link rel="apple-touch-icon" href="/icons/icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster position="top-center" />
        <PWAInstaller />
      </body>
    </html>
  );
}
