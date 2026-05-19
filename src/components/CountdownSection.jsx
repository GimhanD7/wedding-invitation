import React, { useState, useEffect } from 'react';
import LeafCorner from './LeafCorner';

export default function CountdownSection({ settings, currentTheme, isLight }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(settings.weddingDate) - +new Date();
      let left = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        left = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return left;
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.weddingDate]);

  return (
    <section className={`scroll-snap-section relative min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 text-center bg-gradient-to-r ${currentTheme.bgGradient} border-b border-amber-500/10 overflow-hidden`}>
      
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,_var(--tw-gradient-stops)) from-amber-500/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>
      {settings.theme === 'flora' && (
        <>
          <LeafCorner position="top-right" className="opacity-45 text-[#5A7C54]/25" />
          <LeafCorner position="bottom-left" className="opacity-45 text-[#5A7C54]/25" />
        </>
      )}

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        <p className="font-serif text-sm uppercase tracking-[0.2em] text-amber-400 font-semibold">
          The Golden Hour
        </p>

        {/* Countdown Header with elegant curved flourish */}
        <div className="space-y-4">
          <h2 className={`font-cursive text-5xl md:text-7xl leading-tight ${isLight ? 'text-stone-800' : 'text-amber-100'}`}>
            Counting Down to <span className={`${settings.theme === 'flora' ? 'text-[#5A7C54] decoration-[#5A7C54]/40' : 'text-amber-500 decoration-amber-500/40'} underline decoration-wavy decoration-1 underline-offset-8`}>Forever</span>
          </h2>
          <div className={`h-[1px] w-48 bg-gradient-to-r from-transparent ${settings.theme === 'flora' ? 'via-[#5A7C54]/40' : 'via-amber-400/40'} to-transparent mx-auto`}></div>
        </div>

        <p className={`font-sans text-sm md:text-base max-w-xl mx-auto leading-relaxed ${isLight ? 'text-stone-600' : 'text-amber-100/70'}`}>
          Every second brings us closer to the moment we walk down the aisle together. We cannot wait to share this beautiful milestone with you.
        </p>

        {/* TIMER DIGIT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto pt-6 select-none">
          
          {/* Days */}
          <div className={`p-6 rounded-2xl backdrop-blur-md ${currentTheme.cardBg} transition-all duration-300 hover:scale-105 ${currentTheme.glow}`}>
            <span className={`block font-serif text-5xl md:text-6xl font-light tracking-wide animate-pulse-slow ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-500'}`}>
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className={`block text-xs uppercase tracking-widest font-semibold mt-3 ${isLight ? 'text-stone-500' : 'text-amber-200/50'}`}>
              Days
            </span>
          </div>

          {/* Hours */}
          <div className={`p-6 rounded-2xl backdrop-blur-md ${currentTheme.cardBg} transition-all duration-300 hover:scale-105 ${currentTheme.glow}`}>
            <span className={`block font-serif text-5xl md:text-6xl font-light tracking-wide ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-500'}`}>
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className={`block text-xs uppercase tracking-widest font-semibold mt-3 ${isLight ? 'text-stone-500' : 'text-amber-200/50'}`}>
              Hours
            </span>
          </div>

          {/* Minutes */}
          <div className={`p-6 rounded-2xl backdrop-blur-md ${currentTheme.cardBg} transition-all duration-300 hover:scale-105 ${currentTheme.glow}`}>
            <span className={`block font-serif text-5xl md:text-6xl font-light tracking-wide ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-500'}`}>
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className={`block text-xs uppercase tracking-widest font-semibold mt-3 ${isLight ? 'text-stone-500' : 'text-amber-200/50'}`}>
              Minutes
            </span>
          </div>

          {/* Seconds */}
          <div className={`p-6 rounded-2xl backdrop-blur-md ${currentTheme.cardBg} transition-all duration-300 hover:scale-105 ${currentTheme.glow}`}>
            <span className={`block font-serif text-5xl md:text-6xl font-light tracking-wide ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-500'}`}>
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className={`block text-xs uppercase tracking-widest font-semibold mt-3 ${isLight ? 'text-stone-500' : 'text-amber-200/50'}`}>
              Seconds
            </span>
          </div>

        </div>

        {/* Quick countdown footer */}
        <p className={`font-cursive text-2xl pt-4 ${settings.theme === 'flora' ? 'text-[#5A7C54]/95' : 'text-amber-400/90'}`}>
          ...until we say "I Do"
        </p>

      </div>

    </section>
  );
}
