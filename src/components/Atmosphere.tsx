"use client";
import { useEffect, useState } from "react";

export default function Atmosphere() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#050505]">
      {/* Deep Blood Red Glow - Top Right */}
      <div 
        className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full opacity-30 mix-blend-screen blur-[120px] animate-pulse"
        style={{ 
          background: 'radial-gradient(circle, rgba(138, 3, 3, 0.8) 0%, rgba(138, 3, 3, 0) 70%)',
          animationDuration: '8s'
        }}
      />
      
      {/* Desert Sand Glow - Bottom Left */}
      <div 
        className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full opacity-20 mix-blend-screen blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(207, 181, 59, 0.6) 0%, rgba(207, 181, 59, 0) 70%)' }}
      />

      {/* Center Darkness Overlay to keep text readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050505_100%)] opacity-80" />

      {/* Grain/Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.25] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Floating Embers / Dust Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {mounted && [...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#cfb53b] blur-[1px]"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1,
              animation: `floatUp ${Math.random() * 20 + 10}s linear infinite`,
              animationDelay: `-${Math.random() * 20}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
