"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { personas } from "../data/personas";
import PersonaCard from "./PersonaCard";
import { useLanguage, Language } from "@/contexts/LanguageContext";

import { getAvatarUrl } from "@/utils/avatar";

export default function PersonaGallery() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { language, setLanguage, dir } = useLanguage();

  const selectedPersona = personas.find(p => p.id === selectedId);
  const avatarSrc = selectedPersona ? getAvatarUrl(selectedPersona) : "";

  const categoriesSet = new Set<string>();
  personas.forEach(p => {
    categoriesSet.add(p.category);
    if (p.categories) {
      p.categories.forEach(c => categoriesSet.add(c));
    }
  });
  // Sort predefined categories for logical order, or just Array.from
  const categories = ["All", ...Array.from(categoriesSet)];

  const filteredPersonas = personas.filter(p => {
    const matchesFilter = activeFilter === "All" || p.category === activeFilter || (p.categories && p.categories.includes(activeFilter as any));
    
    const localizedName = t(`personas.${p.id}.name`).toLowerCase();
    const localizedTitle = t(`personas.${p.id}.title`).toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = !searchQuery || localizedName.includes(query) || localizedTitle.includes(query);
    
    return matchesFilter && matchesSearch;
  });

  const toggleLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-8">

      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">{t("ui.galleryTitle")}</h1>
          <p className="text-lg text-white/50 font-light">{t("ui.gallerySubtitle")}</p>
        </header>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8 relative">
          <input
            type="text"
            placeholder={t("ui.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
          />
          <div className={`absolute top-1/2 -translate-y-1/2 ${dir === "rtl" ? "left-4" : "right-4"} text-white/40 pointer-events-none`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === cat 
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{t(`ui.filters.${cat}`)}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeFilter === cat ? "bg-black/10 text-black" : "bg-white/10 text-white/40"
              }`}>
                {cat === "All" ? personas.length : personas.filter(p => p.category === cat || (p.categories && p.categories.includes(cat as any))).length}
              </span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPersonas.map((persona) => (
              <motion.div
                key={persona.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <PersonaCard 
                  persona={persona} 
                  onClick={() => setSelectedId(persona.id)} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Expanded Profile Modal */}
      <AnimatePresence>
        {selectedId && selectedPersona && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              layoutId={`card-${selectedPersona.id}`}
              className="relative w-full max-w-3xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-y-auto custom-scrollbar"
              dir={dir}
            >
              {/* Header with Avatar Glow */}
              <div className="relative p-8 pb-12 overflow-hidden border-b border-white/5">
                <div 
                  className="absolute top-[-50%] left-[-10%] w-full h-[200%] blur-[100px] opacity-20 pointer-events-none"
                  style={{ backgroundColor: selectedPersona.colorAccent }}
                />
                
                <div className="relative z-10 flex justify-between items-start gap-6">
                  <div className="flex gap-6 items-center">
                    {/* Modal Avatar */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-full overflow-hidden border-2 border-white/20 relative">
                      <img 
                        src={avatarSrc} 
                        alt={t(`personas.${selectedPersona.id}.name`)}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    
                    <div>
                      <motion.span 
                        layoutId={`category-${selectedPersona.id}`}
                        className="text-sm font-mono text-white/50 mb-2 block"
                      >
                        {t(`ui.filters.${selectedPersona.category}`)}
                      </motion.span>
                      <motion.h2 
                      layoutId={`name-${selectedPersona.id}`}
                      className="text-3xl sm:text-4xl font-bold text-white mb-2"
                    >
                      {t(`personas.${selectedPersona.id}.name`)}
                    </motion.h2>
                    <motion.h3 
                      layoutId={`title-${selectedPersona.id}`}
                      className="text-lg sm:text-xl"
                      style={{ color: selectedPersona.colorAccent }}
                    >
                      {t(`personas.${selectedPersona.id}.title`)}
                    </motion.h3>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedId(null)}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8">
                <div className="flex gap-4 text-sm text-white/40">
                  <span>{t("ui.role")}: {t(`personas.${selectedPersona.id}.role`)}</span>
                </div>

                <p className="text-xl text-white/90 leading-relaxed font-light text-justify">
                  {t(`personas.${selectedPersona.id}.shortDescription`)}
                </p>

                <div className="w-full h-px bg-white/5 my-8" />

                <div className="prose prose-invert max-w-none">
                  <p className="text-white/70 leading-loose text-justify text-lg whitespace-pre-wrap">
                    {t(`personas.${selectedPersona.id}.fullStory`)}
                  </p>
                </div>

                {t(`personas.${selectedPersona.id}.quote`) && (
                  <div 
                    className={`mt-12 p-8 rounded-2xl bg-white/[0.02] border-${dir === 'rtl' ? 'r' : 'l'}-4`}
                    style={{ borderColor: selectedPersona.colorAccent }}
                  >
                    {t(`personas.${selectedPersona.id}.quoteArabic`, { defaultValue: '' }) && (
                      <p className="text-2xl text-center font-bold text-white mb-4 dir-rtl" style={{ fontFamily: 'Tahoma' }}>
                        « {t(`personas.${selectedPersona.id}.quoteArabic`)} »
                      </p>
                    )}
                    <p className="text-lg text-center font-light italic" style={{ color: selectedPersona.colorAccent }}>
                      {t(`personas.${selectedPersona.id}.quote`)}
                    </p>
                  </div>
                )}

                {/* Source Citation */}
                {t(`personas.${selectedPersona.id}.source`, { defaultValue: '' }) && (
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-sm text-white/30 font-mono flex items-center gap-2">
                      <span className="w-4 h-px bg-white/30"></span>
                      {t("ui.source")}: 
                      {t(`personas.${selectedPersona.id}.sourceUrl`, { defaultValue: '' }) ? (
                        <a href={t(`personas.${selectedPersona.id}.sourceUrl`)} target="_blank" rel="noopener noreferrer" className="text-[#c1a063] hover:text-white underline underline-offset-4 transition-colors">
                          {t(`personas.${selectedPersona.id}.source`)}
                        </a>
                      ) : (
                        t(`personas.${selectedPersona.id}.source`)
                      )}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
