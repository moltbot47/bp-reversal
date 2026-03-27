import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "BP Reversal — 90-Day Protocol",
  description:
    "Reverse high blood pressure naturally with a science-backed 90-day protocol. Track 21 daily habits across 4 pillars.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BP Reversal",
  },
};

export const viewport: Viewport = {
  themeColor: "#EEEFE9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlex.variable} h-full`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full bg-[#EEEFE9] text-[#1D2939]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
