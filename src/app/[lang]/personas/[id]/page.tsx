"use client";

import { use, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { personas } from "@/data/personas";
import { getAvatarUrl } from "@/utils/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import PersonaCard from "@/components/PersonaCard";

export default function PersonaPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
  const resolvedParams = use(params);
  const { lang, id } = resolvedParams;
  
  const { t } = useTranslation();
  const { dir, setLanguage } = useLanguage();
  const [showToast, setShowToast] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'next' | 'prev') => {
    if (!carouselRef.current) return;
    const multiplier = dir === 'rtl' ? -1 : 1;
    const scrollAmount = 300 * multiplier;
    const delta = direction === 'next' ? scrollAmount : -scrollAmount;
    carouselRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  useEffect(() => {
    // Ensure the client-side language context matches the URL
    if (['fa', 'en', 'ar'].includes(lang)) {
      setLanguage(lang as any);
    }
  }, [lang, setLanguage]);

  const personaIndex = personas.findIndex(p => p.id === id);
  if (personaIndex === -1) {
    notFound();
  }
  const persona = personas[personaIndex];

  // Next and Previous navigation
  const prevPersona = personaIndex > 0 ? personas[personaIndex - 1] : null;
  const nextPersona = personaIndex < personas.length - 1 ? personas[personaIndex + 1] : null;

  // Dynamic deterministic algorithm for Related Personas (7 to 10 max)
  const sameCategory = personas.filter(p => p.id !== id && p.category === persona.category);
  const otherCategory = personas.filter(p => p.id !== id && p.category !== persona.category);
  
  const deterministicSort = (a: any, b: any) => {
    const sum = (str: string) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (sum(a.id) % 100) - (sum(b.id) % 100);
  };

  const dynamicCount = 7 + (id.length % 4); // Random-like deterministic count between 7 and 10
  
  const relatedPersonas = [...sameCategory, ...otherCategory]
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i) // Ensure uniqueness
    .sort(deterministicSort)
    .slice(0, dynamicCount);

  const handleShare = async () => {
    const shareData = {
      title: t(`personas.${persona.id}.name`),
      text: t(`personas.${persona.id}.shortDescription`),
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const avatarSrc = getAvatarUrl(persona);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8 flex justify-center items-start">
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
            
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                title="Share"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#c1a063]/20 flex items-center justify-center text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </button>
              <Link 
                href="/"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
              >
                ✕
              </Link>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 50, x: "-50%" }}
              className="fixed bottom-10 left-1/2 z-50 bg-[#c1a063] text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(193,160,99,0.5)] flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              {t("ui.linkCopied", { defaultValue: "Link copied!" })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Body */}
        <div className="p-8 space-y-8">
          <div className="flex gap-4 text-sm text-white/40">
            <span>{t("ui.role")}: {t(`personas.${persona.id}.role`, { defaultValue: '' })}</span>
          </div>

          <p className="text-xl text-white/90 leading-relaxed font-light text-justify">
            {t(`personas.${persona.id}.shortDescription`, { defaultValue: '' })}
          </p>

          <div className="w-full h-px bg-white/5 my-8" />

          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 leading-loose text-justify text-lg whitespace-pre-wrap">
              {t(`personas.${persona.id}.fullStory`, { defaultValue: '' })}
            </p>
          </div>

          {t(`personas.${persona.id}.quote`, { defaultValue: '' }) && (
            <div className="mt-12 bg-white/5 border-l-4 border-white/20 p-6 sm:p-8 rounded-r-2xl italic">
              {t(`personas.${persona.id}.quoteArabic`, { defaultValue: '' }) && (
                <p className="text-xl sm:text-2xl text-white font-serif mb-6 leading-loose text-right" dir="rtl">
                  {t(`personas.${persona.id}.quoteArabic`, { defaultValue: '' })}
                </p>
              )}
              <p className="text-lg text-white/80 leading-relaxed">
                "{t(`personas.${persona.id}.quote`, { defaultValue: '' })}"
              </p>
              <div className="mt-4 text-sm text-white/40 font-mono flex items-center gap-2">
                <span>—</span>
                {t(`personas.${persona.id}.sourceUrl`, { defaultValue: '' }) ? (
                  <a 
                    href={t(`personas.${persona.id}.sourceUrl`, { defaultValue: '' })} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#c1a063] transition-colors hover:underline decoration-[#c1a063]/30 underline-offset-4"
                  >
                    {t(`personas.${persona.id}.source`, { defaultValue: '' })}
                  </a>
                ) : (
                  <span>{t(`personas.${persona.id}.source`, { defaultValue: '' })}</span>
                )}
              </div>
            </div>
          )}

          {/* Next / Previous Navigation */}
          <div className="w-full h-px bg-white/5 my-12" />
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
            {prevPersona ? (
              <Link href={`/${lang}/personas/${prevPersona.id}`} className="flex-1 flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <img src={getAvatarUrl(prevPersona)} alt={t(`personas.${prevPersona.id}.name`)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <div className={`flex flex-col ${dir === 'ltr' ? 'text-left' : 'text-right'}`}>
                  <span className="text-xs text-white/40 uppercase tracking-wider">{t("ui.previous", { defaultValue: "Previous" })}</span>
                  <span className="font-bold text-white group-hover:text-[#c1a063] transition-colors">{t(`personas.${prevPersona.id}.name`)}</span>
                </div>
              </Link>
            ) : <div className="flex-1" />}

            {nextPersona ? (
              <Link href={`/${lang}/personas/${nextPersona.id}`} className={`flex-1 flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group ${dir === 'ltr' ? 'flex-row-reverse text-right' : 'flex-row-reverse text-left'}`}>
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <img src={getAvatarUrl(nextPersona)} alt={t(`personas.${nextPersona.id}.name`)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/40 uppercase tracking-wider">{t("ui.next", { defaultValue: "Next" })}</span>
                  <span className="font-bold text-white group-hover:text-[#c1a063] transition-colors">{t(`personas.${nextPersona.id}.name`)}</span>
                </div>
              </Link>
            ) : <div className="flex-1" />}
          </div>

          {/* Related Personas Carousel */}
          {relatedPersonas.length > 0 && (
            <div className="mt-16 pt-8 border-t border-white/5">
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-2xl font-bold text-white">{t("ui.relatedPersonas", { defaultValue: "Related Companions" })}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => scrollCarousel('prev')}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    aria-label="Previous"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {dir === 'rtl' ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
                    </svg>
                  </button>
                  <button 
                    onClick={() => scrollCarousel('next')}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    aria-label="Next"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {dir === 'rtl' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* RTL Supported Scroll Snap Carousel */}
              <div 
                ref={carouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar" 
                style={{ scrollBehavior: 'smooth' }}
              >
                {relatedPersonas.map((rp) => (
                  <div key={rp.id} className="snap-start shrink-0 w-[260px] sm:w-[300px]">
                    <Link href={`/${lang}/personas/${rp.id}`} className="block h-full">
                      <PersonaCard persona={rp} onClick={() => {}} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
