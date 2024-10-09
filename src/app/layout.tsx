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
    "실제 시험을 보듯이 시험 문제를 외우는 것을 도와주는 서비스입니다.",
  openGraph: {
    title: "Exam Master",
    description:
      "실제 시험을 보듯이 시험 문제를 외우는 것을 도와주는 서비스입니다.",
    type: "website",
    locale: "ko_KR",
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
    <html lang="ko" suppressHydrationWarning>
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
      <Script
        async
        strategy="lazyOnload"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
      />
      <body
        className={`${NotoSansKR.className} bg-background bg-cover bg-repeat antialiased`}
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
