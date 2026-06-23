"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { ziyarats } from "@/data/ziyarats";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ZiyaratReaderClient({ routeLang, id }: { routeLang: string, id: string }) {
  const { t } = useTranslation();
  const { language, setLanguage, dir } = useLanguage();
  
  useEffect(() => {
    if (['fa', 'en', 'ar'].includes(routeLang)) {
      setLanguage(routeLang as any);
    }
  }, [routeLang, setLanguage]);
  
  const ziyarat = ziyarats.find(z => z.id === id);
  
  // Font size state (1 = default, 1.5 = 150%, 2 = 200%)
  const [fontScale, setFontScale] = useState<number>(1);

  if (!ziyarat) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h1>Ziyarat not found.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Header & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 bg-white/5 p-4 rounded-2xl border border-white/10">
          <Link href={`/${language}/ziyarat`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={dir === 'rtl' ? 'rotate-180' : ''}>
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className="text-sm font-medium">{t("ui.ziyarats")}</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">{t("ui.fontSize")}:</span>
            <div className="flex bg-[#0a0a0a] rounded-lg border border-white/10 overflow-hidden">
              <button 
                onClick={() => setFontScale(Math.max(0.8, fontScale - 0.2))}
                className="px-3 py-1 text-white/70 hover:bg-white/10 transition-colors"
              >A-</button>
              <button 
                onClick={() => setFontScale(1)}
                className="px-3 py-1 border-x border-white/10 text-white/70 hover:bg-white/10 transition-colors text-xs"
              >Reset</button>
              <button 
                onClick={() => setFontScale(Math.min(2.5, fontScale + 0.2))}
                className="px-3 py-1 text-white/70 hover:bg-white/10 transition-colors"
              >A+</button>
            </div>
          </div>
        </div>

        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">{t(ziyarat.titleKey)}</h1>
          <div className="h-1 w-24 bg-emerald-500/50 mx-auto rounded-full" />
        </header>

        {/* Audio Player */}
        {ziyarat.audio && ziyarat.audio[language as keyof typeof ziyarat.audio] && (
          <div className="bg-[#0a0a0a] border border-emerald-500/30 p-4 rounded-2xl mb-12 flex flex-col items-center shadow-lg shadow-emerald-500/5" id="audio-container">
            <span className="text-sm text-emerald-400 mb-3 font-medium">
              {language === 'fa' ? 'صوت زیارت' : language === 'ar' ? 'صوت الزيارة' : 'Audio Recitation'}
            </span>
            <audio 
              controls 
              className="w-full max-w-md h-10 outline-none"
              src={ziyarat.audio[language as keyof typeof ziyarat.audio]}
              preload="metadata"
              onError={(e) => {
                const target = e.target as HTMLAudioElement;
                target.parentElement!.innerHTML = `<div class="text-sm text-red-400">Audio file not found: ${target.getAttribute('src')}</div><div class="text-xs text-white/50 mt-1">Please place the MP3 file in the public folder.</div>`;
              }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Verses Container */}
        <div className="space-y-12 pb-24">
          {ziyarat.verses.map((verse, idx) => {
            const translationText = language === 'fa' ? verse.fa : language === 'ar' ? verse.ar : verse.en;
            
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white/5 border border-white/10 p-6 sm:p-10 rounded-3xl"
              >
                {/* Arabic Text (Always shown, beautiful and large) */}
                <p 
                  className="text-white text-center leading-loose font-bold mb-8 font-serif drop-shadow-md"
                  style={{ fontSize: `${1.5 * fontScale}rem`, lineHeight: `${2.5 * fontScale}rem` }}
                  dir="rtl"
                >
                  {verse.arabic}
                </p>
                
                {/* Translation Text */}
                {language !== 'ar' && (
                  <>
                    <div className="w-full h-px bg-white/10 mb-8" />
                    <p 
                      className={`text-emerald-400/90 leading-relaxed ${dir === 'ltr' ? 'text-left' : 'text-right'}`}
                      style={{ fontSize: `${1 * fontScale}rem`, lineHeight: `${1.8 * fontScale}rem` }}
                      dir={dir}
                    >
                      {translationText}
                    </p>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
