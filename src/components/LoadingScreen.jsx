import React, { useState, useEffect, useRef } from 'react';

function LoadingScreen({ brideName, groomName, onEnter, onInteraction }) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Audio element for birds nature loop
  const birdsAudioRef = useRef(null);
  
  // Custom bird parameters for background flight reveal
  const [birds, setBirds] = useState([]);

  useEffect(() => {
    // Generate birds on mount
    const generatedBirds = Array.from({ length: 10 }).map((_, idx) => {
      const size = Math.random() * 0.4 + 0.4; // scale from 0.4 to 0.8
      const speed = Math.random() * 12 + 12; // duration from 12s to 24s
      const delay = Math.random() * -12; // pre-delay to distribute them immediately
      const startY = Math.random() * 40 + 15; // vertical position from 15% to 55%
      const opacity = Math.random() * 0.5 + 0.4;
      const flapSpeed = size * 0.5;

      return {
        id: idx,
        size,
        speed,
        delay,
        startY,
        opacity,
        flapSpeed
      };
    });
    setBirds(generatedBirds);

    // Simulate progress load to 100% over 5 seconds (5000ms)
    const duration = 5000;
    const intervalTime = 50;
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progressPercent = Math.min((currentStep / totalSteps) * 100, 100);
      setProgress(Math.floor(progressPercent));

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setIsLoaded(true);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  // Auto-reveal / open doors once loaded (exactly after 5 seconds of loading)
  useEffect(() => {
    if (isLoaded) {
      const timeout = setTimeout(() => {
        handleReveal();
      }, 300); // 300ms delay for premium visual pacing before doors slide open
      return () => clearTimeout(timeout);
    }
  }, [isLoaded]);

  const handleReveal = () => {
    if (hasInteracted) return;
    setHasInteracted(true);
    
    // 1. Play our local bird nature audio loop
    if (birdsAudioRef.current) {
      birdsAudioRef.current.volume = 0.3;
      birdsAudioRef.current.play().catch(err => {
        console.log("Birds sound autoplay blocked or failed:", err);
      });
    }

    // 2. Trigger parent App.js unblock/pre-play music event (satisfying browser autoplay rules instantly!)
    if (onInteraction) {
      onInteraction();
    }

    // 3. Trigger door opening visual transition
    setIsEntering(true);

    // 4. Fire onEnter to clean up LoadingScreen after doors are fully open
    setTimeout(() => {
      if (onEnter) {
        onEnter();
      }
    }, 1300); // Allow double door slide transition to complete
  };

  // Unblock browser audios on touch/click anywhere on the loading screen before it opens
  const handleScreenInteraction = () => {
    if (birdsAudioRef.current) {
      birdsAudioRef.current.play().catch(e => console.log("Birds unblock waiting:", e));
    }
    if (onInteraction) {
      onInteraction();
    }
  };

  return (
    <div 
      onClick={handleScreenInteraction}
      onTouchStart={handleScreenInteraction}
      className="fixed inset-0 z-50 overflow-hidden select-none bg-[#01090f]"
    >
      {/* Self-contained CSS styles for double doors, wing flapping, sway, and neon shadows */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flyRight {
          0% { transform: translateX(-15vw) translateY(0); }
          50% { transform: translateX(50vw) translateY(-20px); }
          100% { transform: translateX(115vw) translateY(0); }
        }
        
        .bird-fly-animation {
          animation: flyRight linear infinite;
        }

        @keyframes flapLeft {
          0%, 100% { transform: rotate(0deg) skewY(0deg); }
          50% { transform: rotate(-35deg) skewY(-15deg) translateY(-2px); }
        }

        @keyframes flapRight {
          0%, 100% { transform: rotate(0deg) skewY(0deg); }
          50% { transform: rotate(35deg) skewY(15deg) translateY(-2px); }
        }

        .wing-left {
          transform-origin: 50px 50px;
          animation: flapLeft var(--flap-duration) ease-in-out infinite;
        }

        .wing-right {
          transform-origin: 50px 50px;
          animation: flapRight var(--flap-duration) ease-in-out infinite;
        }

        @keyframes sway {
          0%, 100% { transform: rotate(0deg) skewX(0deg); }
          50% { transform: rotate(1.5deg) skewX(0.8deg); }
        }

        .tree-sway-slow {
          transform-origin: bottom center;
          animation: sway 7s ease-in-out infinite;
        }

        .tree-sway-fast {
          transform-origin: bottom center;
          animation: sway 5s ease-in-out infinite;
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(0.5deg); }
        }

        .float-slow-content {
          animation: floatSlow 6s ease-in-out infinite;
        }
        
        /* 3D door-opening perspective effects */
        .door-perspective {
          perspective: 1200px;
        }
      `}} />

      {/* Nature Audio Loop */}
      <audio 
        ref={birdsAudioRef} 
        src="https://archive.org/download/Red_Library_Animals_Birds/R01-24-Birds%20Chirping%20Outside.mp3" 
        loop 
        preload="auto"
      />

      {/* BACKGROUND UNDER-DOORS LAYER (Revealed as doors open) */}
      <div className="absolute inset-0 z-10 opacity-60 pointer-events-none flex flex-col items-center justify-center">
        {/* Sky Sparkles / Stars */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
        
        {/* Golden Crescent Moon high in the sky */}
        <div className="absolute top-[12%] right-[12%] w-12 h-12 rounded-full bg-gradient-to-tr from-amber-100 to-yellow-50 shadow-[0_0_30px_rgba(251,191,36,0.2)] pointer-events-none">
          <div className="absolute w-10 h-10 rounded-full bg-[#01090f] -top-1 -left-2"></div>
        </div>

        {/* Large Rising Glowing Golden Aura */}
        <div className="absolute w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-gradient-to-b from-amber-500/10 to-transparent blur-[60px]"></div>

        {/* FLYING BIRDS LAYER */}
        <div className="absolute inset-0 w-full h-full">
          {birds.map((bird) => (
            <div
              key={bird.id}
              className="bird-fly-animation absolute"
              style={{
                animationDuration: `${bird.speed}s`,
                animationDelay: `${bird.delay}s`,
                top: `${bird.startY}%`,
                opacity: bird.opacity,
                transform: `scale(${bird.size})`,
                left: '-10%',
                '--flap-duration': `${bird.flapSpeed}s`
              }}
            >
              <svg className="w-10 h-10 text-amber-200/60 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100" fill="currentColor">
                <path className="wing-left" d="M50 50 Q30 20 5 35 Q25 42 50 50 Z" />
                <path className="wing-right" d="M50 50 Q70 20 95 35 Q75 42 50 50 Z" />
                <path d="M50 42 Q52 47 56 50 Q52 53 50 58 Q48 53 44 50 Q48 47 50 42 Z" />
              </svg>
            </div>
          ))}
        </div>

        {/* TREES SILHOUETTE LAYERS */}
        <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden">
          {/* Back Forest */}
          <div className="absolute bottom-0 w-full h-24 flex justify-around items-end opacity-[0.08] text-teal-950 px-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`bg-tree-${i}`} className="tree-sway-slow flex-shrink-0" style={{ transform: `scale(${0.7 + i * 0.05})`, animationDelay: `${i * -0.5}s` }}>
                <svg width="60" height="120" viewBox="0 0 100 200" fill="currentColor">
                  <path d="M50 10 L85 90 L70 90 L90 140 L60 140 L95 190 L5 190 L40 140 L10 140 L30 90 L15 90 Z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DOUBLE DOORS CONTAINER LAYER */}
      <div className="absolute inset-0 z-30 door-perspective flex pointer-events-none">
        
        {/* LEFT DOOR PANEL */}
        <div 
          className={`w-1/2 h-full bg-gradient-to-b from-[#020b12] via-[#051c2a] to-[#01090f] border-r-2 border-amber-500/30 flex flex-col items-end justify-center relative transition-transform duration-[1200ms] cubic-bezier(0.77, 0, 0.175, 1) pointer-events-auto ${
            isEntering ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          {/* Left Door Details & Gold Filigree lines */}
          <div className="absolute inset-y-10 left-10 right-0 border-t border-b border-l border-amber-500/10 rounded-l-2xl pointer-events-none"></div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 w-[1px] h-3/4 bg-gradient-to-b from-transparent via-amber-500/15 to-transparent"></div>
          
          {/* Left half of loading welcome cards & initials */}
          <div className="pr-6 text-right max-w-[240px] float-slow-content">
            <div className="w-14 h-14 rounded-full border border-amber-500/25 flex items-center justify-end pr-3 bg-stone-950/60 shadow-lg shadow-amber-500/5 ml-auto mb-6 relative overflow-hidden">
              <span className="font-serif text-lg font-bold tracking-wider text-amber-400">
                {brideName ? brideName.charAt(0) : 'B'}
              </span>
            </div>
            <p className="font-serif text-[9px] uppercase tracking-[0.35em] text-amber-500/80 mb-2">
              Warmly
            </p>
            <h2 className="font-serif text-xl sm:text-2xl text-amber-100 font-light truncate drop-shadow-md">
              {brideName || 'Bride'}
            </h2>
          </div>
        </div>

        {/* RIGHT DOOR PANEL */}
        <div 
          className={`w-1/2 h-full bg-gradient-to-b from-[#020b12] via-[#051c2a] to-[#01090f] border-l-2 border-amber-500/30 flex flex-col items-start justify-center relative transition-transform duration-[1200ms] cubic-bezier(0.77, 0, 0.175, 1) pointer-events-auto ${
            isEntering ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          {/* Right Door Details & Gold Filigree lines */}
          <div className="absolute inset-y-10 right-10 left-0 border-t border-b border-r border-amber-500/10 rounded-r-2xl pointer-events-none"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-4 w-[1px] h-3/4 bg-gradient-to-b from-transparent via-amber-500/15 to-transparent"></div>
          
          {/* Right half of loading welcome cards & initials */}
          <div className="pl-6 text-left max-w-[240px] float-slow-content">
            <div className="w-14 h-14 rounded-full border border-amber-500/25 flex items-center justify-start pl-3 bg-stone-950/60 shadow-lg shadow-amber-500/5 mb-6 relative overflow-hidden">
              <span className="font-serif text-lg font-bold tracking-wider text-amber-400">
                {groomName ? groomName.charAt(0) : 'G'}
              </span>
            </div>
            <p className="font-serif text-[9px] uppercase tracking-[0.35em] text-amber-500/80 mb-2">
              Invited
            </p>
            <h2 className="font-serif text-xl sm:text-2xl text-amber-100 font-light truncate drop-shadow-md">
              {groomName || 'Groom'}
            </h2>
          </div>
        </div>

        {/* JOINT CENTER lock/divider overlay (fades out as doors slide) */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center z-40 transition-opacity duration-700 ${
          isEntering ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100'
        }`}>
          {/* Central Wax Seal Emblem & Divider */}
          <div className="absolute h-full w-[2px] bg-gradient-to-b from-amber-500/0 via-amber-500/25 to-amber-500/0 pointer-events-none"></div>
          
          <div className="w-20 h-20 rounded-full border-2 border-amber-500/40 flex items-center justify-center bg-[#010c14] shadow-[0_0_30px_rgba(245,158,11,0.15)] relative scale-110 mb-8 float-slow-content">
            <div className="absolute inset-1 rounded-full border border-amber-500/10"></div>
            <span className="font-serif text-xl font-bold tracking-wider text-amber-400 select-none">
              &
            </span>
          </div>

          {/* PROGRESS / LAUNCH ENTRY BUTTON */}
          
        </div>

      </div>

      {/* Subtitle footer note at the bottom */}
      <div className={`absolute bottom-6 left-0 right-0 z-40 text-center transition-opacity duration-500 ${
        isEntering ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <p className="text-[8px] uppercase tracking-[0.3em] text-stone-500">
          A Celebration of Love, Trust & Togetherness
        </p>
      </div>

    </div>
  );
}

export default LoadingScreen;
