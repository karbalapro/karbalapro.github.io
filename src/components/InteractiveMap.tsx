"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { mapPins, MapPin } from "@/data/mapPins";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Tent, Droplets, Swords, Landmark, MapPin as MapPinIcon, X, ChevronRight } from "lucide-react";

export default function InteractiveMap() {
  const { t } = useTranslation();
  const { dir, language } = useLanguage();
  const [activePin, setActivePin] = useState<MapPin | null>(null);

  const getPinStyle = (type: string) => {
    switch (type) {
      case "camp": return { color: "text-emerald-500", bg: "bg-emerald-500", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.5)]", Icon: Tent };
      case "water": return { color: "text-blue-400", bg: "bg-blue-400", shadow: "shadow-[0_0_15px_rgba(96,165,250,0.5)]", Icon: Droplets };
      case "battle": return { color: "text-red-500", bg: "bg-red-500", shadow: "shadow-[0_0_15px_rgba(239,68,68,0.5)]", Icon: Swords };
      case "shrine": return { color: "text-amber-300", bg: "bg-amber-300", shadow: "shadow-[0_0_15px_rgba(252,211,77,0.5)]", Icon: Landmark };
      default: return { color: "text-amber-500", bg: "bg-amber-500", shadow: "shadow-[0_0_15px_rgba(245,158,11,0.5)]", Icon: MapPinIcon };
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-[2rem] overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl">
      {/* Map Container */}
      <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden group">
        
        {/* The Base Map Image */}
        <Image 
          src="/images/karbala-map-v2.png" 
          alt="Karbala Interactive Map" 
          fill
          className={`object-cover transition-transform duration-1000 ${activePin ? 'scale-105' : 'group-hover:scale-105'}`}
        />

        {/* Map Overlay for Darkening */}
        <div className={`absolute inset-0 bg-[#0a0a0a]/50 pointer-events-none transition-opacity duration-700 ${activePin ? 'opacity-80' : 'opacity-40'}`} />

        {/* Pins Rendering */}
        {mapPins.map((pin) => {
          const { color, bg, shadow, Icon } = getPinStyle(pin.type);
          const isActive = activePin?.id === pin.id;
          
          return (
            <button
              key={pin.id}
              onClick={() => setActivePin(isActive ? null : pin)}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 focus:outline-none ${isActive ? 'scale-125 z-20' : 'hover:scale-125 hover:z-20'}`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              title={t(pin.titleKey)}
            >
              {/* Ping Animation and Icon Container */}
              <span className="relative flex items-center justify-center h-10 w-10 md:h-12 md:w-12 group/pin">
                {/* Outer Ping */}
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-40 ${bg} ${isActive ? 'animate-none scale-150' : 'animate-ping'}`} />
                
                {/* Inner Icon Button */}
                <span className={`relative flex items-center justify-center rounded-full h-10 w-10 md:h-12 md:w-12 border border-white/20 bg-[#121212]/90 backdrop-blur-md transition-colors duration-300 ${shadow} ${isActive ? 'border-white/50 bg-[#222]' : 'group-hover/pin:border-white/40 group-hover/pin:bg-[#1a1a1a]'}`}>
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color} drop-shadow-lg`} strokeWidth={2.5} />
                </span>
                
                {/* Tooltip Title on Hover (desktop only) */}
                {!isActive && (
                  <span className="absolute top-full mt-3 whitespace-nowrap bg-[#0a0a0a]/90 backdrop-blur-xl text-white text-xs md:text-sm font-bold px-4 py-2 rounded-xl border border-white/10 opacity-0 group-hover/pin:opacity-100 transition-opacity duration-300 hidden md:block pointer-events-none shadow-2xl">
                    {t(pin.titleKey)}
                  </span>
                )}
              </span>
            </button>
          );
        })}

        {/* Slide Panel for Active Pin Details */}
        <AnimatePresence>
          {activePin && (
            <motion.div
              initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50, y: 50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: dir === 'rtl' ? -50 : 50, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`absolute z-30 bottom-0 md:bottom-auto md:top-0 w-full md:w-[400px] max-h-[85%] md:max-h-none md:h-full bg-[#0a0a0a]/95 backdrop-blur-3xl border-t md:border-t-0 ${dir === 'rtl' ? 'md:left-0 md:border-r' : 'md:right-0 md:border-l'} border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.7)] flex flex-col rounded-t-[2rem] md:rounded-none`}
              dir={dir}
            >
              <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar relative">
                
                {/* Close Button */}
                <button 
                  onClick={() => setActivePin(null)}
                  className={`absolute top-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 z-10`}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-8 mt-2 pr-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 bg-white/5 border border-white/10 shadow-inner ${getPinStyle(activePin.type).shadow}`}>
                    {(() => {
                      const { Icon, color } = getPinStyle(activePin.type);
                      return <Icon className={`w-7 h-7 ${color}`} strokeWidth={2} />;
                    })()}
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight leading-snug">
                    {t(activePin.titleKey)}
                  </h3>
                  
                  <div className="w-16 h-1 bg-amber-500/50 rounded-full mb-6"></div>
                  
                  <p className="text-white/70 leading-relaxed md:text-lg">
                    {t(activePin.descKey)}
                  </p>
                </div>

                {activePin.personaId && (
                  <div className="mt-auto pt-6 border-t border-white/10">
                    <Link 
                      href={`/${language}/personas/${activePin.personaId}`}
                      className="group flex items-center justify-between p-4 md:p-5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 rounded-2xl transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs text-amber-500/70 mb-1 font-medium uppercase tracking-wider">{t('ui.viewPersonaProfile')}</span>
                        <span className="text-sm md:text-base font-bold text-amber-500">{t(`personas.${activePin.personaId}.name`)}</span>
                      </div>
                      <div className={`w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center transition-transform duration-300 group-hover:bg-amber-500/40 group-hover:scale-110 ${dir === 'rtl' ? '-rotate-180' : ''}`}>
                        <ChevronRight className="w-5 h-5 text-amber-500" />
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
