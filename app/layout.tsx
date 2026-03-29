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
  openGraph: {
    title: "BP Reversal — Reverse High Blood Pressure Naturally",
    description:
      "A free 90-day protocol targeting the 4 root causes of hypertension. 21 daily habits. Science-backed. Track your progress.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BP Reversal — 90-Day Protocol",
    description:
      "Free app to reverse high blood pressure naturally. 21 daily habits across 4 pillars.",
    images: ["/og-image.png"],
  },
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
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full bg-[#EEEFE9] text-[#1D2939]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
