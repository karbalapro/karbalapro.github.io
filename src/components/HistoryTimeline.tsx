"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HistoryTimeline() {
  const { t } = useTranslation();
  const { dir } = useLanguage();

  const events = [
    { id: "event1" },
    { id: "event2" },
    { id: "event3" },
    { id: "event4" },
    { id: "event5" },
    { id: "event6" },
    { id: "event7" },
    { id: "event8" },
    { id: "event9" },
    { id: "event10" },
    { id: "event11" },
    { id: "event12" },
    { id: "event13" },
    { id: "event14" },
    { id: "event15" },
    { id: "event16" }
  ];

  return (
    <div className="w-full mx-auto py-24 px-4 md:px-8 relative" dir={dir}>
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
          {t('ui.timelineTitle')}
        </h2>
        <p className="text-white/50 text-sm md:text-lg max-w-2xl mx-auto">
          {dir === 'rtl' ? 'سیر تاریخی وقایع از مدینه تا کربلا و بازگشت' : 'The historical timeline of events from Madinah to Karbala and the return.'}
        </p>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Central Vertical Line */}
        <div className={`absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-500/0 via-amber-500/50 to-amber-500/0 
          ${dir === 'rtl' ? 'right-6 md:right-1/2 md:translate-x-1/2' : 'left-6 md:left-1/2 md:-translate-x-1/2'}`}>
        </div>

        <div className="space-y-12 md:space-y-8 relative z-10">
          {events.map((event, index) => {
            const isEven = index % 2 === 0;
            
            // Text alignment logic for alternating desktop layout
            const textAlignClass = dir === 'rtl' 
              ? (isEven ? 'md:text-right text-right' : 'md:text-left text-right')
              : (isEven ? 'md:text-left text-left' : 'md:text-right text-left');

            // Flex direction logic for alternating desktop layout
            const flexDirClass = isEven ? '' : 'md:flex-row-reverse';

            return (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 100 }}
                className={`flex flex-col md:flex-row items-start md:items-center relative ${flexDirClass}`}
              >
                {/* Desktop Empty Space for alternating layout */}
                <div className="hidden md:block w-1/2" />
                
                {/* Center Node Dot */}
                <div className={`absolute w-5 h-5 rounded-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)] border-4 border-[#0a0a0a] mt-6 md:mt-0
                  ${dir === 'rtl' ? 'right-6 translate-x-[45%] md:right-1/2 md:translate-x-1/2' : 'left-6 -translate-x-[45%] md:left-1/2 md:-translate-x-1/2'}`} />
                
                {/* Content Card Container */}
                <div className={`w-full md:w-1/2 ${
                  dir === 'rtl' 
                  ? 'pr-16 pl-4 md:px-12' 
                  : 'pl-16 pr-4 md:px-12'
                }`}>
                  <div className={`bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/10 hover:border-amber-500/40 transition-all duration-500 group shadow-2xl relative overflow-hidden ${textAlignClass}`}>
                    
                    {/* Hover Glow Effect */}
                    <div className={`absolute top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -z-10 transition-transform duration-700 group-hover:scale-[2.5] 
                      ${isEven ? (dir === 'rtl' ? 'left-0' : 'right-0') : (dir === 'rtl' ? 'right-0' : 'left-0')}`}>
                    </div>
                    
                    {/* Card Content */}
                    <span className="inline-block py-1 px-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs md:text-sm font-bold mb-4">
                      {t(`timeline.${event.id}Date`)}
                    </span>
                    <h3 className="text-xl md:text-3xl font-black text-white mb-4 tracking-tight leading-snug">
                      {t(`timeline.${event.id}`)}
                    </h3>
                    <p className="text-white/60 leading-relaxed text-sm md:text-base">
                      {t(`timeline.${event.id}Desc`)}
                    </p>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
