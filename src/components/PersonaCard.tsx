"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Persona } from "../types";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAvatarUrl } from "@/utils/avatar";

interface Props {
  persona: Persona;
  onClick: () => void;
  priority?: boolean;
}

export default function PersonaCard({ persona, onClick, priority = false }: Props) {
  const { dir } = useLanguage();
  const { t } = useTranslation();
  const avatarSrc = getAvatarUrl(persona);
  
  return (
    <motion.div
      layoutId={`card-${persona.id}`}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="relative cursor-pointer group"
    >
      {/* Outer Glow Effect behind the card */}
      <div 
        className="absolute -inset-0.5 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition duration-500"
        style={{ backgroundColor: persona.colorAccent }}
      />
      
      {/* Card Content */}
      <div className="relative h-72 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col justify-end overflow-hidden">
        
        {/* The Avatar with Bursting Light or Image */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full flex items-center justify-center">
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
            <div 
              className="absolute inset-0 z-0 blur-md opacity-50"
              style={{ backgroundColor: persona.colorAccent }}
            />
            <img 
              src={avatarSrc} 
              alt={t(`personas.${persona.id}.name`)}
              className="absolute inset-0 w-full h-full object-cover z-10"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              width={128}
              height={128}
            />
          </div>
        </div>
        
        <div className={`z-10 relative mt-auto ${dir === "ltr" ? "text-left" : "text-right"}`}>
          <motion.span 
            className="text-xs font-mono text-white/70 mb-2 block"
          >
            {t(`ui.filters.${persona.category}`)}
          </motion.span>
          <motion.h3 
            className="text-2xl font-bold text-white mb-1"
          >
            {t(`personas.${persona.id}.name`)}
          </motion.h3>
          <motion.p 
            className="text-sm font-light"
            style={{ color: `color-mix(in srgb, ${persona.colorAccent} 40%, white)` }}
          >
            {t(`personas.${persona.id}.title`)}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
