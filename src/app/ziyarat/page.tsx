"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { ziyarats } from "@/data/ziyarats";
import { motion } from "framer-motion";

export default function ZiyaratsList() {
  const { t } = useTranslation();
  const { dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">{t("ui.ziyaratTitle")}</h1>
          <p className="text-lg text-white/50 font-light">{t("ui.ziyaratSubtitle")}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ziyarats.map((ziyarat, idx) => (
            <Link key={ziyarat.id} href={`/ziyarat/${ziyarat.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 h-64 flex flex-col justify-end overflow-hidden group cursor-pointer"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                
                <div className="relative z-10">
                  <h2 className={`text-2xl font-bold text-white mb-2 ${dir === 'ltr' ? 'text-left' : 'text-right'}`}>
                    {t(ziyarat.titleKey)}
                  </h2>
                  <p className={`text-sm text-white/60 ${dir === 'ltr' ? 'text-left' : 'text-right'}`}>
                    {t(ziyarat.descriptionKey)}
                  </p>
                </div>

                {/* Decorative Icon */}
                <div className="absolute top-8 right-8 text-white/5 group-hover:text-emerald-500/20 transition-colors">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
