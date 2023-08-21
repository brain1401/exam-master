import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Navbar from "./components/Navbar";
import AuthContext from "@/context/AuthContext";

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
      <body className={`${open_sans.className} overflow-x-hidden`}>
        <AuthContext>
          <Navbar />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
