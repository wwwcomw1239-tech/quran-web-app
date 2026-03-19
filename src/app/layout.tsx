import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "القرآن الكريم - استمع إلى تلاوات عطرة",
  description: "موقع القرآن الكريم - استمع إلى تلاوات الشيخ محمد صديق المنشاوي براويQuality عالية. جميع السور الـ 114 متاحة للاستماع المباشر.",
  keywords: ["القرآن الكريم", "استماع القرآن", "تلاوات", "محمد صديق المنشاوي", "Quran", "Islamic"],
  authors: [{ name: "Quran Web App" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "القرآن الكريم",
    description: "استمع إلى تلاوات القرآن الكريم بصوت الشيخ محمد صديق المنشاوي",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "القرآن الكريم",
    description: "استمع إلى تلاوات القرآن الكريم بصوت الشيخ محمد صديق المنشاوي",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Cairo', 'Amiri', sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
