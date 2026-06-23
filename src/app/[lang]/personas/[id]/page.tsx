"use client";

import { use, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { personas } from "@/data/personas";
import { getAvatarUrl } from "@/utils/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function PersonaPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
  const resolvedParams = use(params);
  const { lang, id } = resolvedParams;
  
  const { t } = useTranslation();
  const { dir, setLanguage } = useLanguage();

  useEffect(() => {
    // Ensure the client-side language context matches the URL
    if (['fa', 'en', 'ar'].includes(lang)) {
      setLanguage(lang as any);
    }
  }, [lang, setLanguage]);

  const persona = personas.find(p => p.id === id);
  
  if (!persona) {
    notFound();
  }

  const avatarSrc = getAvatarUrl(persona);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-8 flex justify-center items-start">
      <motion.div
        layoutId={`card-${persona.id}`}
        className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden mt-8"
        dir={dir}
      >
        {/* Header with Avatar Glow */}
        <div className="relative p-8 pb-12 overflow-hidden border-b border-white/5">
          <div 
            className="absolute top-[-50%] left-[-10%] w-full h-[200%] blur-[100px] opacity-20 pointer-events-none"
            style={{ backgroundColor: persona.colorAccent }}
          />
          
          <div className="relative z-10 flex justify-between items-start gap-6">
            <div className="flex gap-6 items-center">
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-full overflow-hidden border-2 border-white/20 relative">
                <img 
                  src={avatarSrc} 
                  alt={t(`personas.${persona.id}.name`)}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              <div>
                <motion.span 
                  layoutId={`category-${persona.id}`}
                  className="text-sm font-mono text-white/50 mb-2 block"
                >
                  {t(`ui.filters.${persona.category}`)}
                </motion.span>
                <motion.h1 
                  layoutId={`name-${persona.id}`}
                  className="text-3xl sm:text-4xl font-bold text-white mb-2"
                >
                  {t(`personas.${persona.id}.name`)}
                </motion.h1>
                <motion.h2 
                  layoutId={`title-${persona.id}`}
                  className="text-lg sm:text-xl"
                  style={{ color: persona.colorAccent }}
                >
                  {t(`personas.${persona.id}.title`)}
                </motion.h2>
              </div>
            </div>
            
            <Link 
              href="/"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
            >
              ✕
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          <div className="flex gap-4 text-sm text-white/40">
            <span>{t("ui.role")}: {t(`personas.${persona.id}.role`)}</span>
          </div>

          <p className="text-xl text-white/90 leading-relaxed font-light text-justify">
            {t(`personas.${persona.id}.shortDescription`)}
          </p>

          <div className="w-full h-px bg-white/5 my-8" />

          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 leading-loose text-justify text-lg whitespace-pre-wrap">
              {t(`personas.${persona.id}.fullStory`)}
            </p>
          </div>

          {t(`personas.${persona.id}.quote`) && (
            <div className="mt-12 bg-white/5 border-l-4 border-white/20 p-6 sm:p-8 rounded-r-2xl italic">
              {t(`personas.${persona.id}.quoteArabic`) && (
                <p className="text-xl sm:text-2xl text-white font-serif mb-6 leading-loose text-right" dir="rtl">
                  {t(`personas.${persona.id}.quoteArabic`)}
                </p>
              )}
              <p className="text-lg text-white/80 leading-relaxed">
                "{t(`personas.${persona.id}.quote`)}"
              </p>
              <div className="mt-4 text-sm text-white/40 font-mono">
                — {t(`personas.${persona.id}.source`)}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
