import React from 'react';
import LeafCorner from './LeafCorner';

export default function Footer({ settings, currentTheme, isLight }) {
  return (
    <footer className={`scroll-snap-section relative min-h-screen flex flex-col justify-center py-16 px-4 md:px-8 text-center bg-gradient-to-b ${currentTheme.bgGradient} border-t border-amber-500/10 overflow-hidden`}>
      {settings.theme === 'flora' && (
        <>
          <LeafCorner position="top-left" className="opacity-45 text-[#5A7C54]/25" />
          <LeafCorner position="top-right" className="opacity-45 text-[#5A7C54]/25" />
        </>
      )}
      {/* Soft Background Double Interlocking Golden Wedding Rings / Large Leafy Wreath */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
        {settings.theme === 'flora' ? (
          <svg className="w-80 h-80 text-[#5A7C54]/15 animate-pulse-slow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M45 80 C20 70, 20 30, 45 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
            <circle cx="30" cy="50" r="3" fill="currentColor"/>
            <circle cx="34" cy="38" r="3" fill="currentColor"/>
            <circle cx="34" cy="62" r="3" fill="currentColor"/>
            <circle cx="41" cy="27" r="3" fill="currentColor"/>
            <circle cx="41" cy="73" r="3" fill="currentColor"/>
            <path d="M55 80 C80 70, 80 30, 55 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
            <circle cx="70" cy="50" r="3" fill="currentColor"/>
            <circle cx="66" cy="38" r="3" fill="currentColor"/>
            <circle cx="66" cy="62" r="3" fill="currentColor"/>
            <circle cx="59" cy="27" r="3" fill="currentColor"/>
            <circle cx="59" cy="73" r="3" fill="currentColor"/>
          </svg>
        ) : (
          <div className="relative w-64 h-64 flex items-center justify-center">
            <i className="fa-solid fa-ring text-[180px] text-amber-500/15 absolute -translate-x-12 rotate-[-12deg] animate-pulse-slow"></i>
            <i className="fa-solid fa-ring text-[180px] text-amber-500/15 absolute translate-x-12 rotate-[12deg] animate-pulse-slow"></i>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8 select-none flex flex-col items-center justify-center">
        
        {/* Regal Interlocking Gold Monogram Emblem / Wax Seal */}
        <div className={`w-28 h-28 rounded-full border-4 border-double flex items-center justify-center bg-stone-950/20 shadow-2xl group hover:scale-105 transition-all duration-500 relative ${settings.theme === 'flora' ? 'border-[#5A7C54]/40 hover:border-[#5A7C54] shadow-[#5A7C54]/5' : 'border-amber-500/40 hover:border-amber-400 shadow-amber-500/5'}`}>
          <div className={`absolute inset-1 rounded-full border animate-spin-slow ${settings.theme === 'flora' ? 'border-[#5A7C54]/20' : 'border-amber-500/20'}`}></div>
          <span className={`font-serif text-3xl font-extrabold tracking-widest drop-shadow-md select-none ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-400'}`}>
            {settings.brideName ? settings.brideName.charAt(0) : 'B'}&{settings.groomName ? settings.groomName.charAt(0) : 'G'}
          </span>
        </div>

        <div className="space-y-4">
          <h2 className={`font-cursive text-6xl md:text-7xl leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-400 animate-gold-glow'}`}>
            {settings.brideName || 'Bride'} & {settings.groomName || 'Groom'}
          </h2>
          <div className={`h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent ${settings.theme === 'flora' ? 'via-[#5A7C54]/40' : 'via-amber-500/40'} to-transparent`}></div>
        </div>

        <div className="space-y-3 max-w-lg">
          <p className={`font-pinyon text-3xl italic tracking-wider ${settings.theme === 'flora' ? 'text-[#5A7C54]/90' : 'text-amber-500/90'}`}>
            "Forever begins today..."
          </p>
          <p className={`font-serif text-sm tracking-[0.15em] uppercase leading-relaxed ${isLight ? 'text-stone-700' : 'text-amber-100/70'}`}>
            Thank you for being a part of our beautiful beginning and sharing in our celebration of love.
          </p>
        </div>

        {/* Elegant Leafy Vector Divider */}
        <div className="flex items-center justify-center gap-3 py-2">
          <div className={`h-[1px] w-12 bg-gradient-to-r from-transparent ${settings.theme === 'flora' ? 'via-[#5A7C54]/30' : 'via-amber-500/30'} to-transparent`}></div>
          <i className={`fa-solid fa-leaf text-xs ${settings.theme === 'flora' ? 'text-[#5A7C54]/60' : 'text-amber-500/40'}`}></i>
          <div className={`h-[1px] w-12 bg-gradient-to-l from-transparent ${settings.theme === 'flora' ? 'via-[#5A7C54]/30' : 'via-amber-500/30'} to-transparent`}></div>
        </div>

        {/* Navigation link triggers inside footer */}
        <div className="flex justify-center gap-6 text-xs uppercase tracking-widest font-semibold pb-4">
          <a href="#invitation" className={`transition-colors duration-300 ${settings.theme === 'flora' ? 'hover:text-[#5A7C54]/80 text-stone-500' : isLight ? 'hover:text-amber-500 text-stone-500' : 'hover:text-amber-500 text-stone-400'}`}>Welcome</a>
          <a href="#details" className={`transition-colors duration-300 ${settings.theme === 'flora' ? 'hover:text-[#5A7C54]/80 text-stone-500' : isLight ? 'hover:text-amber-500 text-stone-500' : 'hover:text-amber-500 text-stone-400'}`}>Venue</a>
          <a href="#rsvp" className={`transition-colors duration-300 ${settings.theme === 'flora' ? 'hover:text-[#5A7C54]/80 text-stone-500' : isLight ? 'hover:text-amber-500 text-stone-500' : 'hover:text-amber-500 text-stone-400'}`}>R.S.V.P.</a>
        </div>

        <p className={`font-sans text-[10px] uppercase tracking-[0.2em] pt-4 border-t w-full ${settings.theme === 'flora' ? 'border-[#5A7C54]/10 text-stone-400' : 'border-amber-500/10 text-amber-100/30'} ${isLight ? 'text-stone-400' : 'text-amber-100/30'}`}>
          © 2026 Digital Invitation • Designed with Pure Elegance
        </p>

      </div>

    </footer>
  );
}
