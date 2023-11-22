import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar/Navbar";
import AuthContext from "@/context/AuthContext";
import JotaiProvider from "@/context/JotaiContext";
import localFont from "next/font/local";
import NextUIContext from "@/context/NextUIContext";
const NotoSansKR = localFont({
  src: [
    {
      path: "../../public/fonts/NotoSansKR-Thin.ttf",
      weight: "100",
    },
    {
      path: "../../public/fonts/NotoSansKR-ExtraLight.ttf",
      weight: "200",
    },
    {
      path: "../../public/fonts/NotoSansKR-Light.ttf",
      weight: "300",
    },
    {
      path: "../../public/fonts/NotoSansKR-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../public/fonts/NotoSansKR-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../public/fonts/NotoSansKR-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../../public/fonts/NotoSansKR-Bold.ttf",
      weight: "700",
    },
    {
      path: "../../public/fonts/NotoSansKR-ExtraBold.ttf",
      weight: "800",
    },
    {
      path: "../../public/fonts/NotoSansKR-Black.ttf",
      weight: "900",
    },
  ],
  display: "swap",
});

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
    <html lang="ko" className="light">
      <body
        className={`${NotoSansKR.className} min-h-screen overflow-y-scroll bg-main`}
      >
        <AuthContext>
          <JotaiProvider>
            <NextUIContext>
              <Navbar />
              <main>{children}</main>
            </NextUIContext>
          </JotaiProvider>
        </AuthContext>
      </body>
    </html>
  );
}
