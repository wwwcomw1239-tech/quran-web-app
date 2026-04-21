import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AudioPlayerProvider } from "@/lib/AudioPlayerContext";
import { GlobalAudioPlayer } from "@/components/GlobalAudioPlayer";
import { LanguageProvider } from "@/lib/i18n";
import { AudioQualityProvider } from "@/lib/audioQuality";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#059669" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://quran-web-app.pages.dev"),
  title: "نور القرآن - Noor Al-Quran",
  description: "تطبيق نور القرآن - استمع إلى تلاوات عطرة من كتاب الله واقرأ الكتب الإسلامية. Noor Al-Quran - Listen to beautiful Quran recitations and read Islamic books.",
  keywords: ["نور القرآن", "القرآن الكريم", "استماع القرآن", "تلاوات", "Noor Al-Quran", "Quran", "Islamic", "PWA", "Recitation"],
  authors: [{ name: "Noor Al-Quran Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "نور القرآن",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "نور القرآن - Noor Al-Quran",
    description: "استمع إلى تلاوات القرآن الكريم بصوت 100 قارئ واقرأ مكتبة من أكثر من 1100 كتاب إسلامي وشاهد المئات من دروس العلماء ومقاطع الأطفال التعليمية",
    type: "website",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "نور القرآن - Noor Al-Quran",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "نور القرآن - Noor Al-Quran",
    description: "استمع إلى تلاوات القرآن الكريم بصوت 100 قارئ واقرأ مكتبة من أكثر من 1100 كتاب إسلامي وشاهد المئات من دروس العلماء",
    images: ["/icons/icon-512x512.png"],
  },
  applicationName: "نور القرآن - Noor Al-Quran",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  creator: "Noor Al-Quran Team",
  publisher: "Noor Al-Quran",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        {/* ⚡ تحسين الأداء: نستخدم preconnect فقط للأصول الحرجة (الخطوط)
           و dns-prefetch للأصول الأخرى - preconnect يستهلك موارد الشبكة،
           فإذا كثرنا منها سنبطّئ بدل أن نسرّع */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://server.mp3quran.net" crossOrigin="anonymous" />
        {/* DNS prefetch للأصول التي تُستخدم فقط بعد تفاعل المستخدم */}
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://yt3.ggpht.com" />
        <link rel="dns-prefetch" href="https://archive.org" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://quran-shorts-api.almuhasab9.workers.dev" />
        {/* Load Arabic fonts non-blockingly (swap to system font while loading) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
          media="print"
          // @ts-ignore - switch to 'all' once loaded, so fonts load asynchronously
          onLoad={"this.media='all'" as any}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        </noscript>

        {/* PWA Meta Tags */}
        <meta name="application-name" content="نور القرآن - Noor Al-Quran" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="نور القرآن" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Favicon for various platforms */}
        <link rel="icon" type="image/x-icon" sizes="48x48" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-72x72.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />

        {/* Windows tiles */}
        <meta name="msapplication-square70x70logo" content="/icons/icon-72x72.png" />
        <meta name="msapplication-square144x144logo" content="/icons/icon-144x144.png" />
        <meta name="msapplication-square150x150logo" content="/icons/icon-152x152.png" />
        <meta name="msapplication-wide310x150logo" content="/icons/icon-192x192.png" />
        <meta name="msapplication-square310x310logo" content="/icons/icon-512x512.png" />

        {/* Script to set direction and theme based on saved preferences - prevents flickering */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Language direction
                  var lang = localStorage.getItem('quran-language');
                  if (lang === 'en') {
                    document.documentElement.setAttribute('dir', 'ltr');
                    document.documentElement.setAttribute('lang', 'en');
                  } else {
                    document.documentElement.setAttribute('dir', 'rtl');
                    document.documentElement.setAttribute('lang', 'ar');
                  }
                  
                  // Theme - prevent flash
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AudioQualityProvider>
              <AudioPlayerProvider>
                {children}
                <GlobalAudioPlayer />
              </AudioPlayerProvider>
            </AudioQualityProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
