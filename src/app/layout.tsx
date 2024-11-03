import "./globals.css";
import type { Metadata } from "next";
import { Viewport } from "next";
import MainNavbar from "@/components/Navbar/MainNavbar";
import AuthContext from "@/context/AuthContext";
import localFont from "next/font/local";
import Script from "next/script";
import ReduxProvider from "@/context/ReduxContext";
import ReactQueryContext from "@/context/ReactQueryContext";
import { Toaster } from "@/components/ui/toaster";
import JotaiProvider from "@/context/JotaiContext";
import { ThemeProvider } from "@/context/ThemeContext";
import GoogleAdsense from "./components/GoogleAdsense";

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
  title: {
    template: "%s - Exam Master",
    default: "Exam Master",
  },
  description:
    "AI기반으로 시험 문제집을 생성하고 모의시험을 볼 수 있는 AI CBT 서비스입니다.",
  openGraph: {
    title: "Exam Master",
    description:
      "AI 기반으로 시험 문제집을 생성하고 모의시험을 볼 수 있는 AI CBT 서비스입니다.",
    type: "website",
    locale: "ko_KR",
  },
  other: {
    "google-adsense-account": "ca-pub-3107487479671403",
  },
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
    <html lang="ko" className="w-full md:w-auto" suppressHydrationWarning>
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
      <GoogleAdsense />

      <body
        className={`${NotoSansKR.className} w-full bg-background bg-cover bg-repeat antialiased md:w-auto`}
      >
        <AuthContext>
          <ReduxProvider>
            <ReactQueryContext>
              <JotaiProvider storeType="main">
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                >
                  <MainNavbar />
                  <main className="flex flex-1 flex-col">{children}</main>
                  <Toaster />
                </ThemeProvider>
              </JotaiProvider>
            </ReactQueryContext>
          </ReduxProvider>
        </AuthContext>
      </body>
    </html>
  );
}
