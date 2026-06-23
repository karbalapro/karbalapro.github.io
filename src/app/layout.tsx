import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import Atmosphere from "@/components/Atmosphere";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://karbalapro.github.io'),
  title: {
    default: "دانشنامه عاشورا و زیارت‌نامه‌های تعاملی | Ashura Encyclopedia",
    template: "%s | دانشنامه عاشورا",
  },
  description: "جامع‌ترین دایرةالمعارف شخصیت‌های واقعه کربلا (بیش از ۲۷۴ شخصیت) به همراه قرائت تعاملی زیارت عاشورا و زیارت وارث با ترجمه سه‌زبانه.",
  keywords: ["کربلا", "عاشورا", "امام حسین", "زیارت عاشورا", "زیارت وارث", "شخصیت‌های کربلا", "دانشنامه عاشورا", "Karbala", "Ashura", "Imam Hussain", "Ziyarat Ashura"],
  authors: [{ name: "Karbala Pro" }],
  creator: "Karbala Pro",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://karbalapro.github.io",
    title: "دانشنامه تعاملی عاشورا",
    description: "جامع‌ترین دایرةالمعارف شخصیت‌های واقعه کربلا به همراه زیارت‌نامه‌های صوتی.",
    siteName: "Karbala Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "دانشنامه تعاملی عاشورا",
    description: "بزرگترین پایگاه داده شخصیت‌های عاشورا",
  },
  verification: {
    google: "KHjQLFqA7PcO8zTOp2oaOklFYdGi7uclfCgZcAfB_5o",
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Schema for LLMs and Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "دانشنامه عاشورا | Karbala Pro",
    "url": "https://karbalapro.github.io",
    "description": "جامع‌ترین دایرةالمعارف شخصیت‌های کربلا و زیارت‌نامه‌ها",
    "inLanguage": ["fa", "en", "ar"]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-white">
        {/* Inject JSON-LD Schema for AI/LLM SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <Atmosphere />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <ScrollToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}
