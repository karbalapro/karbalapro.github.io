"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { personas } from "../data/personas";
import PersonaCard from "./PersonaCard";
import { useLanguage, Language } from "@/contexts/LanguageContext";

import { getAvatarUrl } from "@/utils/avatar";

export default function PersonaGallery() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { language, setLanguage, dir } = useLanguage();

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
    <div className="min-h-screen py-12 px-4 sm:px-8">

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
              <Link key={persona.id} href={`/${language}/personas/${persona.id}`} className="block">
                <PersonaCard 
                  persona={persona} 
                  onClick={() => {}} 
                />
              </Link>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
