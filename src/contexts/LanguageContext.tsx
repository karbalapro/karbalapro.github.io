"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../i18n"; // Import i18n configuration

export type Language = "fa" | "en" | "ar" | "ur";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>("fa");
  const [dir, setDir] = useState<"rtl" | "ltr">("rtl");

  useEffect(() => {
    // Determine direction based on language
    const newDir = language === "en" ? "ltr" : "rtl";
    setDir(newDir);
    document.documentElement.dir = newDir;
    document.documentElement.lang = language;
    
    // Update i18next language
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir }}>
      <div dir={dir} className={dir === "rtl" ? "font-vazirmatn" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
