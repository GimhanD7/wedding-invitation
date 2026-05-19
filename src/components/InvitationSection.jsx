import React from 'react';
import LeafCorner from './LeafCorner';

export default function InvitationSection({ settings }) {
  return (
    <section id="invitation" className="scroll-snap-section relative min-h-screen flex flex-col justify-center py-12 sm:py-20 md:py-24 px-4 md:px-8 bg-stone-100 text-stone-900 border-t border-b border-stone-200">
      
      {/* Soft elegant background graphics */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
      {settings.theme === 'flora' && (
        <>
          <LeafCorner position="top-left" className="opacity-45 text-[#5A7C54]/30" />
          <LeafCorner position="bottom-right" className="opacity-45 text-[#5A7C54]/30" />
        </>
      )}

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16 w-full">
        
        {/* LEFT COLUMN: The Personal Card */}
        <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-center lg:text-left">
          
          <span className={`font-serif text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold block ${settings.theme === 'emerald' ? 'text-emerald-800' : settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-[#b8953a]'}`}>
            We Request the Honor of Your Presence
          </span>

          <div className="space-y-2 sm:space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-800 font-medium">
              Dear Honorable Guests,
            </h2>
            <div className="h-[2px] w-24 bg-amber-500 mx-auto lg:mx-0"></div>
          </div>

          <p className="font-sans text-stone-600 leading-relaxed text-sm sm:text-base max-w-lg mx-auto lg:mx-0">
            Together with our families, we joyfully invite you to share in our celebration of love, commitment, and marriage. Your presence and warm blessings on this auspicious day would mean the world to us.
          </p>

          {/* PERSONALIZED GUEST CARD - DYNAMIC AND HIGHLY MODERN */}
          <div className="bg-white border-2 border-double border-amber-500/40 p-5 sm:p-8 rounded-2xl shadow-xl shadow-stone-300/50 max-w-sm sm:max-w-md mx-auto lg:mx-0 transition-transform duration-300 hover:scale-103 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 to-amber-300"></div>
            <div className="space-y-3 sm:space-y-4">
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-stone-400 font-semibold block">
                Exclusively Invited
              </span>
              
              {/* Guest name loaded dynamically from settings / URL */}
              <div className="py-3 sm:py-4 px-2 border-b border-stone-100">
                <p className="font-greatvibes text-3xl sm:text-4xl md:text-5xl text-amber-600 drop-shadow-sm select-none truncate">
                  {settings.guestName || "Valued Family & Friends"}
                </p>
              </div>

              <p className="font-sans text-[10px] sm:text-xs text-stone-500 italic">
                * This link is customized specially for you. Please confirm your attendance in the RSVP section below.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Polaroid Photo Overlap */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-4 sm:py-8 relative min-h-[320px] xs:min-h-[380px] sm:min-h-[440px] md:min-h-[480px]">
          
          {/* Background Decorative Gold Ring graphic */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <i className="fa-solid fa-ring text-[200px] sm:text-[300px] text-amber-600 animate-pulse-slow"></i>
          </div>

          {/* Photo 1: Polaroid Frame tilted left */}
          <div className="absolute left-[2%] sm:left-[10%] md:left-[15%] top-2 sm:top-4 w-[45%] sm:w-64 md:w-72 bg-white p-2.5 sm:p-4 shadow-2xl rounded-sm rotate-[-8deg] hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 border border-stone-200 select-none group">
            <div className="relative overflow-hidden aspect-[4/5] bg-stone-100 rounded-sm">
              <img
                src={settings.coupleOutdoorImg || "images/couple_outdoor.png"}
                alt="Outdoor Couple Shoot"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="pt-3 sm:pt-6 pb-1 sm:pb-2 text-center">
              <p className="font-cursive text-xl sm:text-2xl md:text-3xl text-amber-600 tracking-wide">
                Our Forever
              </p>
              <p className="font-sans text-[8px] sm:text-[10px] tracking-wider text-stone-400 mt-1 uppercase">
                Pre-Wedding Shoot
              </p>
            </div>
          </div>

          {/* Photo 2: Polaroid Frame tilted right, overlapping Photo 1 */}
          <div className="absolute right-[2%] sm:right-[10%] md:right-[15%] bottom-2 sm:bottom-4 w-[45%] sm:w-64 md:w-72 bg-white p-2.5 sm:p-4 shadow-2xl rounded-sm rotate-[6deg] hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 border border-stone-200 select-none group">
            <div className="relative overflow-hidden aspect-[4/5] bg-stone-100 rounded-sm">
              <img
                src={settings.couplePortraitImg || "images/couple_portrait.png"}
                alt="Close Up Couple Portrait"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="pt-3 sm:pt-6 pb-1 sm:pb-2 text-center">
              <p className="font-cursive text-xl sm:text-2xl md:text-3xl text-amber-600 tracking-wide">
                Love & Devotion
              </p>
              <p className="font-sans text-[8px] sm:text-[10px] tracking-wider text-stone-400 mt-1 uppercase">
                May 25, 2026
              </p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
