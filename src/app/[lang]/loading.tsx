"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function Loading() {
  const { dir } = useLanguage();
  
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
      <p 
        className="text-white/50 text-sm font-medium animate-pulse"
        dir={dir}
      >
        {dir === "rtl" ? "در حال بارگذاری..." : "Loading..."}
      </p>
    </div>
  );
}
