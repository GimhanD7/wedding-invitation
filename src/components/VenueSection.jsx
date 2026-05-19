import React from 'react';
import LeafCorner from './LeafCorner';

export default function VenueSection({ settings }) {
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

  return (
    <section id="details" className="scroll-snap-section relative min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 bg-white text-stone-900 overflow-hidden">
      
      {/* Soft Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      {settings.theme === 'flora' && (
        <>
          <LeafCorner position="top-left" className="opacity-45 text-[#5A7C54]/25" />
          <LeafCorner position="bottom-right" className="opacity-45 text-[#5A7C54]/25" />
        </>
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        
        <div className="text-center space-y-4 mb-16">
          <span className={`font-serif text-sm uppercase tracking-[0.2em] font-semibold ${settings.theme === 'emerald' ? 'text-emerald-800' : settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-[#b8953a]'}`}>
            The Celebration Place
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 font-medium">
            Venue & Timing
          </h2>
          <div className={`h-[2px] w-24 mx-auto ${settings.theme === 'flora' ? 'bg-[#5A7C54]' : 'bg-amber-500'}`}></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: Venue Details Card */}
          <div className="space-y-8 bg-stone-50 border border-stone-200 rounded-3xl p-8 md:p-10 shadow-xl shadow-stone-200/50">
            
            {/* Palace Icon Banner */}
            <div className="flex items-center gap-4 border-b border-stone-200/60 pb-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner ${settings.theme === 'flora' ? 'bg-[#5A7C54]/10 text-[#5A7C54]' : 'bg-amber-500/10 text-amber-600'}`}>
                <i className="fa-solid fa-hotel"></i>
              </div>
              <div>
                <h3 className="font-serif text-2xl font-semibold text-stone-800 tracking-wide">
                  {settings.venueName}
                </h3>
                <p className="font-sans text-stone-500 text-sm mt-1">
                  {settings.venueAddress}
                </p>
              </div>
            </div>

            {/* Event Timing Items */}
            <div className="space-y-6">
              
              {/* Date Row */}
              <div className="flex items-start gap-4">
                <div className={`text-lg mt-1 w-6 ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-500'}`}>
                  <i className="fa-solid fa-calendar-days"></i>
                </div>
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-widest text-stone-400 font-semibold">
                    Wedding Date
                  </h4>
                  <p className="font-serif text-lg text-stone-800 font-medium mt-1">
                    {getFormattedDate()}
                  </p>
                </div>
              </div>

              {/* Time Row */}
              <div className="flex items-start gap-4">
                <div className={`text-lg mt-1 w-6 ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-500'}`}>
                  <i className="fa-solid fa-clock"></i>
                </div>
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-widest text-stone-400 font-semibold">
                    Ceremony Commences
                  </h4>
                  <p className="font-serif text-lg text-stone-800 font-medium mt-1">
                    At {getFormattedTime()} onwards
                  </p>
                </div>
              </div>

              {/* Dress Code Row */}
              <div className="flex items-start gap-4">
                <div className={`text-lg mt-1 w-6 ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-500'}`}>
                  <i className="fa-solid fa-shirt"></i>
                </div>
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-widest text-stone-400 font-semibold">
                    Dress Code
                  </h4>
                  <p className="font-serif text-lg text-stone-800 font-medium mt-1">
                    Formal & Traditional Wedding Attire
                  </p>
                </div>
              </div>

            </div>

            {/* Google Navigation Button */}
            <div className="pt-4">
              <a
                href={settings.venueGoogleLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                  settings.theme === 'flora' 
                    ? 'bg-gradient-to-r from-[#5A7C54] to-[#7FA478] hover:from-[#415C3C] hover:to-[#5A7C54] text-white shadow-[#5A7C54]/20 hover:shadow-[#5A7C54]/35' 
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20 hover:shadow-amber-500/35'
                }`}
              >
                <i className="fa-solid fa-map-location-dot text-lg"></i>
                Navigate via Google Maps
              </a>
            </div>

          </div>

          {/* RIGHT: Visual Map Frame */}
          <div className="relative group border border-stone-200 rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-stone-100 flex items-center justify-center">
            
            {/* Simulated Map Illustration with elegant overlay */}
            <div className="absolute inset-0 bg-cover bg-center select-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80')` }}></div>
            <div className="absolute inset-0 bg-stone-900/30 group-hover:bg-stone-900/10 transition-colors duration-300"></div>

            {/* High-end Styled Map Card Pin */}
            <div className="relative z-10 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-amber-500/20 shadow-2xl max-w-sm text-center mx-4 group-hover:scale-105 transition-transform duration-500">
              <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center text-xl mx-auto shadow-lg shadow-red-500/35 animate-bounce mb-3">
                <i className="fa-solid fa-location-pin"></i>
              </div>
              <h4 className="font-serif text-lg font-bold text-stone-800">
                {settings.venueName}
              </h4>
              <p className="font-sans text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                We can't wait to see you! Click below or scan code to view interactive directions.
              </p>
              <div className="mt-4 flex justify-center">
                <a
                  href={settings.venueGoogleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 hover:text-amber-700 transition-colors"
                >
                  View Interactive Map
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
