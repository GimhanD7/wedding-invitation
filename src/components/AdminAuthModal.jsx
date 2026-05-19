import React, { useState } from 'react';

export default function AdminAuthModal({ isAdminRoute, isAdminAuthenticated, setIsAdminAuthenticated, setIsPanelOpen }) {
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!isAdminRoute || isAdminAuthenticated) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminPinInput === '2026' || adminPinInput === 'admin123' || adminPinInput === '1234') {
      sessionStorage.setItem('wedding_admin_authenticated', 'true');
      setIsAdminAuthenticated(true);
      setIsPanelOpen(true);
      setAdminPinInput('');
      setAdminError('');
    } else {
      setAdminError('Invalid security PIN. Please try again!');
      setAdminPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-2xl px-4 select-none animate-fade-in animate-duration-500">
      <div className="max-w-md w-full bg-stone-900/90 border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center space-y-6">
        
        {/* Background elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none"></div>

        {/* Emblem Monogram */}
        <div className="w-16 h-16 rounded-full border border-amber-500/40 flex items-center justify-center bg-stone-950 mx-auto shadow-lg shadow-amber-500/5">
          <i className="fa-solid fa-lock text-xl text-amber-400 animate-pulse"></i>
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
            Invitation Studio
          </h3>
          <p className="font-sans text-xs uppercase tracking-widest text-amber-500/80 font-semibold">
            Administrative Portal
          </p>
          <p className="font-sans text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
            Enter your administrative PIN below to customize details and view guest RSVPs.
          </p>
        </div>

        {/* PIN Code Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength="8"
              placeholder="••••"
              value={adminPinInput}
              onChange={(e) => {
                setAdminPinInput(e.target.value);
                setAdminError('');
              }}
              className="w-full bg-stone-950/80 border border-stone-800 focus:border-amber-400 rounded-2xl py-3 px-4 text-center text-xl font-bold tracking-[0.4em] text-amber-300 placeholder-stone-700 focus:outline-none transition-all duration-300"
            />
          </div>

          {adminError && (
            <p className="text-xs text-red-500 font-semibold animate-bounce mt-1">
              ⚠ {adminError}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                window.location.hash = '';
                window.location.pathname = '/';
              }}
              className="py-3 rounded-xl border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white text-xs uppercase tracking-widest font-bold transition-all duration-300"
            >
              Exit to Card
            </button>

            <button
              type="submit"
              className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 text-xs uppercase tracking-widest font-bold shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              Unlock Admin
            </button>
          </div>

        </form>

        <span className="block text-[9px] text-stone-600 font-medium">
          * Secure cloud environment protected by Firebase SSL
        </span>

      </div>
    </div>
  );
}
