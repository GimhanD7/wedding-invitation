import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import LeafCorner from './LeafCorner';

export default function RsvpSection({ settings, theme, triggerConfetti }) {
  const [rsvpForm, setRsvpForm] = useState({
    name: settings.guestName && settings.guestName !== 'Mr. / Mr. & Mrs. / Ms. / Family' ? settings.guestName : '',
    phone: '',
    guestsCount: 1,
    attendance: 'attending',
    message: ''
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!rsvpForm.name.trim()) return;

    const newRsvp = {
      ...rsvpForm,
      dateString: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      timestamp: new Date()
    };

    try {
      await addDoc(collection(db, "rsvps"), newRsvp);
      setRsvpSubmitted(true);
      triggerConfetti();

      // Reset Form partially
      setRsvpForm(prev => ({
        ...prev,
        phone: '',
        message: ''
      }));
    } catch (err) {
      console.error("Error submitting RSVP to Firestore:", err);
    }
  };

  return (
    <section id="rsvp" className="scroll-snap-section relative min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 bg-stone-50 border-t border-b border-stone-200 overflow-hidden">
      
      {/* Decorative corner leaves */}
      {settings.theme === 'flora' ? (
        <>
          <LeafCorner position="top-left" className="opacity-45 text-[#5A7C54]/30" />
          <LeafCorner position="bottom-right" className="opacity-45 text-[#5A7C54]/30" />
        </>
      ) : (
        <>
          <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.1),transparent_70%)] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.1),transparent_70%)] pointer-events-none"></div>
        </>
      )}

      <div className="max-w-3xl mx-auto relative z-10">
        
        <div className="text-center space-y-4 mb-16">
          <span className={`font-serif text-sm uppercase tracking-[0.2em] font-semibold ${settings.theme === 'emerald' ? 'text-emerald-800' : settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-[#b8953a]'}`}>
            Kindly Respond by May 15, 2026
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 font-medium">
            R. S. V. P.
          </h2>
          <div className={`h-[2px] w-24 mx-auto ${settings.theme === 'flora' ? 'bg-[#5A7C54]' : 'bg-amber-500'}`}></div>
        </div>

        {/* RSVP CARD CONTAINER */}
        <div className={`bg-white border-2 border-double p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-amber-500/5 ${settings.theme === 'flora' ? 'border-[#5A7C54]/30' : 'border-amber-500/30'}`}>
          
          {/* Decorative embossed card header */}
          <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${settings.theme === 'flora' ? 'from-[#5A7C54] via-[#7FA478] to-[#5A7C54]' : 'from-amber-500 via-yellow-400 to-amber-500'}`}></div>

          {rsvpSubmitted ? (
            
            // SUCCESS CONGRATULATORY CARD
            <div className="text-center py-10 space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600 text-4xl mx-auto shadow-inner">
                <i className="fa-solid fa-heart-circle-check"></i>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-3xl font-bold text-stone-800">
                  Thank You So Much!
                </h3>
                <p className="font-sans text-stone-600 max-w-md mx-auto leading-relaxed">
                  Your response has been beautifully received and saved. We are thrilled to celebrate this special milestone with you!
                </p>
              </div>
              <div className="h-[1px] w-32 bg-stone-200 mx-auto my-6"></div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setRsvpSubmitted(false);
                    triggerConfetti();
                  }}
                  className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider border border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white transition-all duration-300"
                >
                  Submit Another Attendance
                </button>
              </div>
            </div>

          ) : (

            // THE INTERACTIVE FORM
            <form onSubmit={handleRsvpSubmit} className="space-y-6 text-stone-800">
              
              <p className="text-center font-sans text-stone-500 text-sm leading-relaxed mb-6">
                Please let us know if you will be joining us. Kindly respond to help us make the event unforgettable for everyone.
              </p>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name field */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-400 font-semibold mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 text-sm">
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <input
                      type="text"
                      required
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 bg-stone-50/50 transition-colors"
                      placeholder="e.g. Mr. & Mrs. Perera"
                    />
                  </div>
                </div>

                {/* Phone field */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-400 font-semibold mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 text-sm">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <input
                      type="tel"
                      required
                      value={rsvpForm.phone}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 bg-stone-50/50 transition-colors"
                      placeholder="e.g. +94 77 123 4567"
                    />
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Attendance Choice */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-400 font-semibold mb-2">
                    Are You Attending?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setRsvpForm({ ...rsvpForm, attendance: 'attending' })}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${rsvpForm.attendance === 'attending' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-md shadow-emerald-500/5' : 'border-stone-200 hover:bg-stone-50 text-stone-500'}`}
                    >
                      <i className="fa-solid fa-circle-check"></i>
                      Attending
                    </button>

                    <button
                      type="button"
                      onClick={() => setRsvpForm({ ...rsvpForm, attendance: 'declined' })}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${rsvpForm.attendance === 'declined' ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-md shadow-rose-500/5' : 'border-stone-200 hover:bg-stone-50 text-stone-500'}`}
                    >
                      <i className="fa-solid fa-circle-xmark"></i>
                      Declined
                    </button>

                  </div>
                </div>

                {/* Guests count selection */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-400 font-semibold mb-2">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 text-sm">
                      <i className="fa-solid fa-users"></i>
                    </div>
                    <select
                      value={rsvpForm.guestsCount}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, guestsCount: Number(e.target.value) })}
                      className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 bg-stone-50/50 transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* Message Field */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-400 font-semibold mb-2">
                  Warm Note to the Couple (Optional)
                </label>
                <textarea
                  rows="3"
                  value={rsvpForm.message}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                  className="block w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 bg-stone-50/50 transition-colors resize-none"
                  placeholder="Leave a sweet congratulatory word or dietary restrictions..."
                ></textarea>
              </div>

              {/* Submit Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 hover:scale-[1.02]"
                >
                  Confirm My Response
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </section>
  );
}
