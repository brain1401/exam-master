import "./globals.css";
import type { Metadata } from "next";
import { Viewport } from "next";
import Navbar from "./components/Navbar/Navbar";
import AuthContext from "@/context/AuthContext";
import JotaiProvider from "@/context/JotaiContext";
import localFont from "next/font/local";
import NextUIContext from "@/context/NextUIContext";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

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
  preload: true,
});

export const metadata: Metadata = {
  title: "Exam Master",
  description:
    "실제 시험을 보듯이 시험 문제를 외우는 것을 도와주는 서비스입니다.",
};

export const viewport: Viewport = {
  userScalable: false,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="light">
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTM}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${process.env.NEXT_PUBLIC_GTM}');
        `}
      </Script>
      <body
        className={`${NotoSansKR.className} m-0 min-h-[calc(var(--vh,1vh)*100)] overflow-y-scroll bg-main bg-contain bg-repeat p-0`}
      >
        <AuthContext>
          <JotaiProvider>
            <NextUIContext>
              <Navbar />
              <main>{children}</main>
            </NextUIContext>
            <Analytics />
          </JotaiProvider>
        </AuthContext>
      </body>
    </html>
  );
}
