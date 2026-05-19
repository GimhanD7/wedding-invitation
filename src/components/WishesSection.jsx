import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import LeafCorner from './LeafCorner';

export default function WishesSection({ settings, triggerConfetti }) {
  const [wishForm, setWishForm] = useState({ name: '', message: '' });

  const isDark = ['goldDark', 'emerald', 'crimson', 'sapphire', 'custom'].includes(settings.theme);

  // Dynamic color matching active palette
  const primaryColor = settings.theme === 'custom' ? settings.customColorPrimary : 
                       (settings.theme === 'flora' ? '#5A7C54' : 
                        (settings.theme === 'emerald' ? '#059669' : 
                         (settings.theme === 'crimson' ? '#e11d48' : 
                          (settings.theme === 'sapphire' ? '#2563eb' : '#b8953a'))));

  const handleWishSubmit = async (e) => {
    e.preventDefault();
    if (!wishForm.name.trim() || !wishForm.message.trim()) return;

    const colors = [
      'bg-amber-100 text-amber-800',
      'bg-emerald-100 text-emerald-800',
      'bg-rose-100 text-rose-800',
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newWish = {
      name: wishForm.name,
      message: wishForm.message,
      color: randomColor,
      date: 'Today',
      timestamp: new Date()
    };

    try {
      await addDoc(collection(db, "wishes"), newWish);
      setWishForm({ name: '', message: '' });
      triggerConfetti();
    } catch (err) {
      console.error("Error saving wish to Firestore:", err);
    }
  };

  return (
    <section 
      id="wishes" 
      className={`scroll-snap-section relative min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 overflow-hidden transition-all duration-500 ${
        isDark ? 'bg-stone-950 text-stone-200' : 'bg-stone-50 text-stone-900'
      }`}
    >
      {/* Decorative leaf shapes or stars overlay */}
      {settings.theme === 'flora' ? (
        <>
          <LeafCorner position="top-right" className="opacity-35 text-[#5A7C54]/25" />
          <LeafCorner position="bottom-left" className="opacity-35 text-[#5A7C54]/25" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>
      )}

      <div className="max-w-6xl mx-auto relative z-10 w-full flex flex-col items-center">
        
        {/* Elegantly Styled Header Section */}
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <span 
            className="font-serif text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold block"
            style={{ color: primaryColor }}
          >
            The Guest Book
          </span>
          <h2 className={`font-serif text-4xl sm:text-5xl font-light tracking-wide ${isDark ? 'text-white' : 'text-stone-850'}`}>
            Best Wishes Wall
          </h2>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="w-12 h-[1px] bg-stone-300/40"></span>
            <i className="fa-solid fa-feather-pointed text-xs" style={{ color: primaryColor }}></i>
            <span className="w-12 h-[1px] bg-stone-300/40"></span>
          </div>
        </div>

        {/* Beautiful Centered Glassmorphic Wishing Card */}
        <div className="w-full max-w-xl">
          
          <div 
            className={`border rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-500 backdrop-blur-md ${
              isDark 
                ? 'bg-stone-900/60 border-stone-800/80 shadow-black/60' 
                : 'bg-white/90 border-stone-200/80 shadow-stone-200/50'
            }`}
          >
            {/* Top theme gradient accent line */}
            <div 
              className="absolute top-0 left-0 w-full h-[6px]"
              style={{ backgroundColor: primaryColor }}
            ></div>

            {/* Faded Quote emblem in back */}
            <div className="absolute top-6 right-8 opacity-[0.03] pointer-events-none">
              <i className="fa-solid fa-quote-right text-7xl text-stone-400"></i>
            </div>
            
            <h3 className={`font-serif text-xl sm:text-2xl font-light text-center mb-6 sm:mb-8 tracking-wide ${isDark ? 'text-amber-300/80' : 'text-stone-800'}`}>
              Leave Your Blessings
            </h3>

            <form onSubmit={handleWishSubmit} className="space-y-5 sm:space-y-6">
              
              <div>
                <label className={`block text-[10px] sm:text-xs uppercase tracking-widest font-semibold mb-2 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  Your Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-stone-400/80 text-sm">
                    <i className="fa-regular fa-user"></i>
                  </span>
                  <input
                    type="text"
                    required
                    value={wishForm.name}
                    onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                    className={`block w-full pl-11 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-4 text-sm transition-all duration-300 ${
                      isDark 
                        ? 'bg-stone-950/80 border-stone-800 text-stone-200 placeholder-stone-600 focus:ring-amber-500/10 focus:border-amber-500/50' 
                        : 'bg-stone-50/50 border-stone-250 text-stone-800 placeholder-stone-400 focus:ring-amber-500/10 focus:border-amber-500/50'
                    }`}
                    style={{ 
                      '--tw-ring-color': `${primaryColor}20`,
                      focusBorderColor: primaryColor 
                    }}
                    placeholder="e.g. Aunt Malkanthi"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] sm:text-xs uppercase tracking-widest font-semibold mb-2 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  Your Blessing
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-stone-400/80 text-sm">
                    <i className="fa-regular fa-comment-dots"></i>
                  </span>
                  <textarea
                    rows="4"
                    required
                    value={wishForm.message}
                    onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                    className={`block w-full pl-11 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-4 text-sm transition-all duration-300 resize-none ${
                      isDark 
                        ? 'bg-stone-950/80 border-stone-800 text-stone-200 placeholder-stone-600 focus:ring-amber-500/10 focus:border-amber-500/50' 
                        : 'bg-stone-50/50 border-stone-250 text-stone-800 placeholder-stone-400 focus:ring-amber-500/10 focus:border-amber-500/50'
                    }`}
                    style={{ 
                      '--tw-ring-color': `${primaryColor}20`,
                      focusBorderColor: primaryColor 
                    }}
                    placeholder="Write a sweet blessing for our new journey..."
                  ></textarea>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                  }}
                >
                  <i className="fa-regular fa-envelope-open"></i>
                  Post Wishing Card
                </button>
              </div>

            </form>

          </div>

          {/* Luxury bottom ribbon indicator */}
          <div className="flex items-center justify-center gap-3 mt-6 sm:mt-8 opacity-45">
            <i className="fa-solid fa-hands-praying text-stone-400 text-xs"></i>
            <span className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              Thank You for Your Blessings
            </span>
          </div>

        </div>

      </div>

    </section>
  );
}
