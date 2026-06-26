"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLanguage, Language } from "@/contexts/LanguageContext";

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, dir } = useLanguage();

  const toggleLanguage = (lang: Language) => {
    setLanguage(lang);
    
    // If we are on a language-prefixed route, navigate to the new language URL
    if (pathname.match(/^\/(fa|en|ar)(\/|$)/)) {
      const newPath = pathname.replace(/^\/(fa|en|ar)/, `/${lang}`);
      router.push(newPath);
    }
  };

  const navItems = [
    { name: t("ui.home"), path: `/${language}` },
    { name: t("ui.historyAndMap"), path: `/${language}/history` },
    { name: t("ui.liveZiyarat"), path: `/${language}/live` },
    { name: t("ui.ziyarats"), path: `/${language}/ziyarat` },
    { name: t("ui.personasTitle"), path: `/${language}/personas` },
    { name: t("ui.memoriesTitle"), path: `/${language}/memories` }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Language Switcher */}
        <div className={`flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10`} dir={dir}>
          <button 
            onClick={() => toggleLanguage("fa")} 
            className={`px-3 py-1 rounded-md text-sm transition-colors ${language === "fa" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
          >
            فارسی
          </button>
          <button 
            onClick={() => toggleLanguage("ar")} 
            className={`px-3 py-1 rounded-md text-sm transition-colors ${language === "ar" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
          >
            العربية
          </button>
          <button 
            onClick={() => toggleLanguage("en")} 
            className={`px-3 py-1 rounded-md text-sm transition-colors ${language === "en" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
          >
            English
          </button>
        </div>

      </div>
    </header>
  );
}
