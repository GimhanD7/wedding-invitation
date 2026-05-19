import React from 'react';

export default function LeafCorner({ position = "top-left", className = "" }) {
  const transform = 
    position === "top-left" ? "scale(1, 1)" :
    position === "top-right" ? "scale(-1, 1) translate(-100, 0)" :
    position === "bottom-left" ? "scale(1, -1) translate(0, -100)" :
    "scale(-1, -1) translate(-100, -100)";

  return (
    <div className={`absolute pointer-events-none z-0 ${className} ${
      position === "top-left" ? "top-0 left-0" :
      position === "top-right" ? "top-0 right-0" :
      position === "bottom-left" ? "bottom-0 left-0" :
      "bottom-0 right-0"
    }`}>
      <svg className="w-32 h-32 md:w-56 md:h-56 text-[#5A7C54]/25 transition-all duration-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform={transform}>
          {/* Main elegant branch */}
          <path d="M0 0 C25 8, 50 35, 75 75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          
          {/* Organic aesthetic leaves */}
          {/* Sprout 1 */}
          <path d="M22 6 C28 1, 36 10, 30 14 C23 17, 16 11, 22 6 Z" fill="currentColor"/>
          <path d="M19 8 L27 11" stroke="currentColor" strokeWidth="0.6"/>
          
          {/* Sprout 2 */}
          <path d="M42 21 C48 16, 55 26, 50 31 C44 35, 36 28, 42 21 Z" fill="currentColor"/>
          <path d="M37 25 L45 27" stroke="currentColor" strokeWidth="0.6"/>

          {/* Sprout 3 */}
          <path d="M58 40 C65 34, 71 45, 66 49 C60 54, 52 46, 58 40 Z" fill="currentColor"/>
          <path d="M53 45 L61 46" stroke="currentColor" strokeWidth="0.6"/>

          {/* Sprout 4 (Tip Leaf) */}
          <path d="M72 65 C78 60, 83 71, 78 75 C73 78, 66 71, 72 65 Z" fill="currentColor"/>
          
          {/* Opposite side sprouting leaves */}
          {/* Sprout 5 */}
          <path d="M10 22 C4 26, 6 36, 14 33 C20 29, 18 19, 10 22 Z" fill="currentColor"/>
          <path d="M13 25 L11 29" stroke="currentColor" strokeWidth="0.6"/>

          {/* Sprout 6 */}
          <path d="M28 43 C22 47, 24 57, 32 54 C38 50, 36 40, 28 43 Z" fill="currentColor"/>
          <path d="M31 46 L29 50" stroke="currentColor" strokeWidth="0.6"/>

          {/* Sprout 7 */}
          <path d="M46 64 C40 68, 41 78, 49 76 C55 72, 53 62, 46 64 Z" fill="currentColor"/>
          <path d="M48 67 L46 72" stroke="currentColor" strokeWidth="0.6"/>
        </g>
      </svg>
    </div>
  );
}
