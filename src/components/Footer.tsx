"use client";

import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0a0a0a]/80 backdrop-blur-md border-t border-white/10 py-6 mt-16 relative z-10">
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50 ${dir === "rtl" ? "text-right" : "text-left"}`}
        dir={dir}
      >
        <p>
          &copy; {currentYear} {t("ui.copyright")}
        </p>
        <p className="flex items-center gap-1">
          {t("ui.developedBy")}
          <a
            href="https://devahmad.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors border-b border-transparent hover:border-emerald-300 ml-1"
          >
            AHMADFAZELI
          </a>
        </p>
      </div>
    </footer>
  );
}
