"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { personas } from "../data/personas";
import PersonaCard from "./PersonaCard";
import { useLanguage, Language } from "@/contexts/LanguageContext";

import { getAvatarUrl } from "@/utils/avatar";

export default function PersonaGallery({ routeLang }: { routeLang?: string }) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const ITEMS_PER_PAGE = 24; // 24 items per page
  
  const { language, setLanguage, dir } = useLanguage();

  useEffect(() => {
    setMounted(true);
    if (routeLang && ['fa', 'en', 'ar'].includes(routeLang)) {
      setLanguage(routeLang as any);
    }
  }, [routeLang, setLanguage]);

  const handleFilterClick = (cat: string) => {
    if (activeFilter === cat) return;
    setIsFiltering(true);
    // Allow the React tree to render the spinner before blocking the main thread
    setTimeout(() => {
      setActiveFilter(cat);
      setCurrentPage(1);
      setIsFiltering(false);
    }, 150);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

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

  const totalPages = Math.ceil(filteredPersonas.length / ITEMS_PER_PAGE);
  const paginatedPersonas = filteredPersonas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

        {/* Search Bar with WebMCP annotations for AI agents */}
        <form 
          className="max-w-md mx-auto mb-8 relative"
          data-mcp-name="searchPersonas" 
          data-mcp-description="Search for a specific historical persona or character from the tragedy of Ashura."
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="search"
            name="query"
            data-mcp-input="query"
            placeholder={t("ui.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
          />
          <div className={`absolute top-1/2 -translate-y-1/2 ${dir === "rtl" ? "left-4" : "right-4"} text-white/40 pointer-events-none`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </form>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterClick(cat)}
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
        {isFiltering ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {paginatedPersonas.map((persona, index) => (
                  <Link key={persona.id} href={`/${language}/personas/${persona.id}`} className="block h-full">
                    <PersonaCard 
                      persona={persona} 
                      onClick={() => {}} 
                      priority={index < 6}
                    />
                  </Link>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {mounted && totalPages > 1 && (
              <div className="mt-16 w-full max-w-4xl mx-auto flex justify-between items-center bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl shadow-2xl">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex-1 max-w-[120px] px-4 py-3 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium text-center"
                >
                  {t("ui.prevPage")}
                </button>
                
                <div className="flex items-center gap-2 overflow-x-auto px-4 hide-scrollbar py-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`min-w-[40px] h-10 px-2 rounded-lg flex items-center justify-center transition-all font-bold shrink-0 ${
                        currentPage === i + 1 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                          : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex-1 max-w-[120px] px-4 py-3 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium text-center"
                >
                  {t("ui.nextPage")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
