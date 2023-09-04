import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Navbar from "./components/Navbar/Navbar";
import AuthContext from "@/context/AuthContext";
import JotaiProvider from "@/context/JotaiContext";
import { Suspense } from "react";

const open_sans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Exam Master",
  description:
    "실제 시험을 보듯이 시험 문제를 외우는 것을 도와주는 서비스입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${open_sans.className}`}>
        <AuthContext>
          <JotaiProvider>
            <Navbar />
            <Suspense fallback={<div>로딩중...</div>}>
              <main>{children}</main>
            </Suspense>
          </JotaiProvider>
        </AuthContext>
      </body>
    </html>
  );
}
