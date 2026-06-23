"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function LivePageClient({ routeLang }: { routeLang: string }) {
  const { t } = useTranslation();
  const { dir, setLanguage } = useLanguage();

  useEffect(() => {
    if (['fa', 'en', 'ar'].includes(routeLang)) {
      setLanguage(routeLang as any);
    }
  }, [routeLang, setLanguage]);

  const streams = [
    {
      id: "hussain",
      title: t("ui.shrineHussain"),
      // Imam Hussain Shrine Official Channel Live URL or a placeholder
      url: "https://www.youtube.com/embed/Exnlnte1kRI?autoplay=1&mute=1",
      accentColor: "#e74c3c"
    },
    {
      id: "abbas",
      title: t("ui.shrineAbbas"),
      // Using a direct live video ID instead of channel embed which was unavailable
      url: "https://www.youtube.com/embed/NtZMElkMF4k?autoplay=1&mute=1",
      accentColor: "#2ecc71"
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center gap-3 px-6 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-6"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-red-500">LIVE</span>
          </motion.div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">{t("ui.liveTitle")}</h1>
          <p className="text-lg text-white/50 font-light">{t("ui.liveSubtitle")}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {streams.map((stream, idx) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col gap-6"
            >
              <h2 className={`text-2xl sm:text-3xl font-bold text-white ${dir === 'ltr' ? 'text-left' : 'text-right'}`}>
                {stream.title}
              </h2>
              <div
                className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl group"
                style={{ boxShadow: `0 20px 50px -20px ${stream.accentColor}40` }}
              >
                {/* Background glow placeholder */}
                <div
                  className="absolute inset-0 blur-3xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: stream.accentColor }}
                />
                <iframe
                  src={stream.url}
                  title={stream.title}
                  className="absolute inset-0 w-full h-full border-0 z-10"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
