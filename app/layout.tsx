import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineFlow AI",
  description: "AI short film script and storyboard planning tool"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
