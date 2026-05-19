import React from 'react';

export default function GoldOrnament({ theme, className = "h-8 w-auto text-amber-400" }) {
  const isFlora = theme === 'flora';
  const dividerGrad = isFlora ? 'via-[#5A7C54]/50' : 'via-amber-500/50';

  return (
    <div className="flex items-center justify-center gap-3 my-6 animate-pulse-slow">
      <div className={`h-[1px] w-16 bg-gradient-to-r from-transparent ${dividerGrad} to-transparent`}></div>
      {isFlora ? (
        <svg className="h-8 w-auto text-[#5A7C54]" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Center delicate flower */}
          <circle cx="50" cy="12" r="3.5" fill="currentColor"/>
          <circle cx="45" cy="8" r="2.5" fill="currentColor" opacity="0.8"/>
          <circle cx="55" cy="8" r="2.5" fill="currentColor" opacity="0.8"/>
          <circle cx="45" cy="16" r="2.5" fill="currentColor" opacity="0.8"/>
          <circle cx="55" cy="16" r="2.5" fill="currentColor" opacity="0.8"/>
          <circle cx="50" cy="12" r="1.5" fill="#fff"/>
          {/* Leaf stems branching out left and right */}
          <path d="M40 12 C35 12, 28 8, 20 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M60 12 C65 12, 72 8, 80 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          {/* Small leaves sprouting */}
          <path d="M30 11 C28 8, 24 9, 26 12" fill="currentColor"/>
          <path d="M70 11 C72 8, 76 9, 74 12" fill="currentColor"/>
          <path d="M35 13 C33 16, 29 15, 31 12" fill="currentColor"/>
          <path d="M65 13 C67 16, 71 15, 69 12" fill="currentColor"/>
        </svg>
      ) : (
        <svg className={className} viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 2 C42 8, 30 8, 20 8 M50 2 C58 8, 70 8, 80 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M50 18 C42 12, 30 12, 20 12 M50 18 C58 12, 70 12, 80 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="50" cy="10" r="3.5" fill="currentColor" className="shadow-lg shadow-amber-400"/>
          <circle cx="35" cy="10" r="1.5" fill="currentColor"/>
          <circle cx="65" cy="10" r="1.5" fill="currentColor"/>
        </svg>
      )}
      <div className={`h-[1px] w-16 bg-gradient-to-l from-transparent ${dividerGrad} to-transparent`}></div>
    </div>
  );
}
