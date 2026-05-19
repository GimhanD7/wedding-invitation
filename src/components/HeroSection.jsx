import React from 'react';
import LeafCorner from './LeafCorner';
import GoldOrnament from './GoldOrnament';

export default function HeroSection({ settings, currentTheme, isLight }) {
  const brideInitial = settings.brideName && settings.brideName.trim() ? settings.brideName.trim().charAt(0) : 'B';
  const groomInitial = settings.groomName && settings.groomName.trim() ? settings.groomName.trim().charAt(0) : 'G';

  const getFormattedDate = () => {
    try {
      const date = new Date(settings.weddingDate);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return "Monday, May 25, 2026";
    }
  };

  const getFormattedTime = () => {
    try {
      const date = new Date(settings.weddingDate);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "03:30 PM";
    }
  };

  const handleAddToCalendar = () => {
    const eventDateStr = settings.weddingDate.replace(/[-:]/g, '');
    const bride = settings.brideName && settings.brideName.trim() ? settings.brideName.trim() : 'Bride';
    const groom = settings.groomName && settings.groomName.trim() ? settings.groomName.trim() : 'Groom';
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(bride + ' & ' + groom + ' Wedding')}&dates=${eventDateStr}/${eventDateStr}&details=${encodeURIComponent('We invite you to celebrate our union!')}&location=${encodeURIComponent(settings.venueName + ', ' + settings.venueAddress)}`;
    window.open(calendarUrl, '_blank');
  };

  return (
    <section className="scroll-snap-section relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 py-16 overflow-hidden">
      
      {/* Decorative Golden Floral Corners / Leafy Corner Frames */}
      {settings.theme === 'flora' ? (
        <>
          <LeafCorner position="top-left" className="animate-pulse-slow text-[#5A7C54]/30" />
          <LeafCorner position="top-right" className="animate-pulse-slow text-[#5A7C54]/30" />
          <LeafCorner position="bottom-left" className="animate-pulse-slow text-[#5A7C54]/30" />
          <LeafCorner position="bottom-right" className="animate-pulse-slow text-[#5A7C54]/30" />
        </>
      ) : (
        <>
          <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-amber-400/30 rounded-tl-3xl pointer-events-none hidden md:block"></div>
          <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-amber-400/30 rounded-tr-3xl pointer-events-none hidden md:block"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-amber-400/30 rounded-bl-3xl pointer-events-none hidden md:block"></div>
          <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-amber-400/30 rounded-br-3xl pointer-events-none hidden md:block"></div>
        </>
      )}

      {/* Floating Top Monogram Badge */}
      <div 
        style={settings.theme === 'custom' ? { borderColor: 'var(--custom-primary)', boxShadow: '0 4px 12px -2px var(--custom-primary)' } : {}}
        className={`w-20 h-20 rounded-full border-2 flex items-center justify-center shadow-lg mb-8 fade-in-up-1 relative group overflow-hidden ${
          settings.theme === 'flora' 
            ? 'border-[#5A7C54]/50 bg-white/70 shadow-[#5A7C54]/5' 
            : settings.theme === 'goldLight'
              ? 'border-[#b8953a]/50 bg-white/70 shadow-[#b8953a]/5'
              : settings.theme === 'custom'
                ? 'bg-stone-950/60'
                : 'border-amber-400/50 bg-stone-900/50 shadow-amber-400/10'
        }`}>
        <div className={`absolute inset-0 bg-gradient-to-tr opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          settings.theme === 'flora' 
            ? 'from-[#5A7C54]/10 via-transparent to-[#5A7C54]/10' 
            : settings.theme === 'goldLight'
              ? 'from-[#b8953a]/10 via-transparent to-[#b8953a]/10'
              : 'from-amber-500/10 via-transparent to-amber-500/10'
        }`}></div>
        <span 
          style={settings.theme === 'custom' ? { color: 'var(--custom-primary)' } : {}}
          className={`font-serif text-2xl font-bold tracking-widest ${
            settings.theme === 'flora' 
              ? 'text-[#5A7C54]' 
              : settings.theme === 'goldLight'
                ? 'text-[#b8953a]'
                : settings.theme === 'custom' ? '' : 'text-amber-400 animate-gold-glow'
          }`}>
          {brideInitial} & {groomInitial}
        </span>
      </div>

      {/* Invitation Text */}
      <p 
        style={settings.theme === 'custom' ? { color: 'var(--custom-primary)' } : {}}
        className={`font-serif text-sm md:text-base uppercase tracking-[0.3em] mb-4 fade-in-up-1 ${
          settings.theme === 'flora' ? 'text-[#5A7C54]/90' : settings.theme === 'goldLight' ? 'text-[#b8953a]/90' : 'text-amber-400/90'
        }`}>
        Save the Date
      </p>

      {/* Large Elegant Couple Names */}
      <div className="space-y-4 max-w-4xl px-4 select-none mb-6">
        <h1 
          style={settings.theme === 'custom' ? { color: 'var(--custom-primary)' } : {}}
          className={`font-cursive text-7xl md:text-9xl leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] fade-in-up-2 ${
            settings.theme === 'flora' ? 'text-[#5A7C54]' : settings.theme === 'goldLight' ? 'text-[#b8953a]' : 'text-amber-400 animate-gold-glow'
          }`}>
          {settings.brideName}
        </h1>
        <div className="flex items-center justify-center gap-6 fade-in-up-3">
          <div 
            style={settings.theme === 'custom' ? { backgroundImage: 'linear-to-r', from: 'transparent', to: 'var(--custom-primary)' } : {}}
            className={`h-[1px] w-20 bg-gradient-to-r from-transparent ${
              settings.theme === 'flora' ? 'to-[#5A7C54]/40' : settings.theme === 'goldLight' ? 'to-[#b8953a]/40' : 'to-amber-400/40'
            }`}></div>
          <span 
            style={settings.theme === 'custom' ? { color: 'var(--custom-accent)' } : {}}
            className={`font-serif text-3xl md:text-4xl font-light ${
              settings.theme === 'flora' ? 'text-[#5A7C54]/90' : settings.theme === 'goldLight' ? 'text-[#b8953a]/90' : 'text-amber-200/90'
            }`}>&</span>
          <div 
            style={settings.theme === 'custom' ? { backgroundImage: 'linear-to-l', from: 'transparent', to: 'var(--custom-primary)' } : {}}
            className={`h-[1px] w-20 bg-gradient-to-l from-transparent ${
              settings.theme === 'flora' ? 'to-[#5A7C54]/40' : settings.theme === 'goldLight' ? 'to-[#b8953a]/40' : 'to-amber-400/40'
            }`}></div>
        </div>
        <h1 
          style={settings.theme === 'custom' ? { color: 'var(--custom-primary)' } : {}}
          className={`font-cursive text-7xl md:text-9xl leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] fade-in-up-4 ${
            settings.theme === 'flora' ? 'text-[#5A7C54]' : settings.theme === 'goldLight' ? 'text-[#b8953a]' : 'text-amber-400 animate-gold-glow'
          }`}>
          {settings.groomName}
        </h1>
      </div>

      <GoldOrnament theme={settings.theme} />

      {/* Wedding Date Display */}
      <div className="fade-in-up-5 space-y-3">
        <p className={`font-serif text-xl md:text-2xl tracking-wide font-light ${isLight ? 'text-stone-800' : 'text-amber-100/90'}`}>
          {getFormattedDate()}
        </p>
        <p className={`font-sans text-sm tracking-[0.2em] uppercase ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-[#b8953a]'}`}>
          At {getFormattedTime()} • {settings.venueName}
        </p>
      </div>

      {/* Hero Quick Navigation CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-12 fade-in-up-6">
        <a
          href="#details"
          className={`px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:scale-105 ${currentTheme.btnBg}`}
        >
          Event Details
        </a>
        <a
          href="#rsvp"
          className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 hover:scale-105 ${currentTheme.btnAccent}`}
        >
          R.S.V.P. Now
        </a>
        <button
          onClick={handleAddToCalendar}
          className={`px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:scale-105 ${currentTheme.btnBg}`}
        >
          Add to Calendar
        </button>
      </div>

      {/* Elegant Breathing Scroll Down Arrow Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-amber-400/40 animate-bounce pointer-events-none">
        <span className="text-[10px] tracking-[0.2em] uppercase font-sans">Scroll Down</span>
        <i className="fa-solid fa-chevron-down text-sm"></i>
      </div>

    </section>
  );
}
