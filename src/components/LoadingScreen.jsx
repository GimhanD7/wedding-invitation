import React, { useState, useEffect, useRef } from 'react';

function LoadingScreen({ brideName, groomName, onEnter, onInteraction }) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Audio elements
  const birdsAudioRef = useRef(null);
  
  // Custom bird parameters for a diverse, natural flight pattern
  const [birds, setBirds] = useState([]);

  useEffect(() => {
    // Generate birds on mount
    const generatedBirds = Array.from({ length: 12 }).map((_, idx) => {
      const size = Math.random() * 0.5 + 0.4; // scale from 0.4 to 0.9
      const speed = Math.random() * 10 + 10; // duration from 10s to 20s
      const delay = Math.random() * -15; // pre-delay to distribute them immediately
      const startY = Math.random() * 45 + 10; // vertical position from 10% to 55%
      const opacity = Math.random() * 0.5 + 0.4; // opacity from 0.4 to 0.9
      const flapSpeed = size * 0.6; // larger birds flap slower

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

    // Simulate progress load to 100% over exactly 5 seconds (5000ms)
    const duration = 5000;
    const intervalTime = 50; // Update progress every 50ms
    const totalSteps = duration / intervalTime; // 100 steps
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

  // Auto-open invitation once loaded
  useEffect(() => {
    if (isLoaded) {
      const timeout = setTimeout(() => {
        setIsEntering(true);
        
        // Play sound effects if possible (will succeed if user clicked/tapped anywhere during loading)
        if (birdsAudioRef.current) {
          birdsAudioRef.current.volume = 0.35;
          birdsAudioRef.current.play().catch(err => {
            console.log("Auto-play birds sound blocked:", err);
          });
        }

        setTimeout(() => {
          if (onEnter) {
            onEnter();
          }
        }, 900); // Allow fade-out animation to complete
      }, 400); // 400ms sweet spot to register visual 100% progress

      return () => clearTimeout(timeout);
    }
  }, [isLoaded, onEnter]);

  // Try to play audio on first user touch/interaction anywhere on the screen
  const handleScreenInteraction = () => {
    if (!hasInteracted) {
      if (birdsAudioRef.current) {
        birdsAudioRef.current.play().then(() => {
          setHasInteracted(true);
        }).catch(err => {
          console.log("Audio play postponed:", err);
        });
      }
      
      // Let the parent App.js unblock/pre-play its audios!
      if (onInteraction) {
        onInteraction();
      }
    }
  };

  return (
    <div 
      onClick={handleScreenInteraction}
      onTouchStart={handleScreenInteraction}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#02131b] via-[#042836] to-[#01090f] overflow-hidden select-none transition-all duration-1000 ease-out ${
        isEntering ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Self-contained CSS Styles for Wing Flapping, Tree Swaying, Moon Aura & Flight paths */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flyRight {
          0% {
            transform: translateX(-15vw) translateY(0);
          }
          50% {
            transform: translateX(50vw) translateY(-25px);
          }
          100% {
            transform: translateX(115vw) translateY(0);
          }
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
          50% { transform: rotate(1.2deg) skewX(0.8deg); }
        }

        .tree-sway-slow {
          transform-origin: bottom center;
          animation: sway 8s ease-in-out infinite;
        }

        .tree-sway-fast {
          transform-origin: bottom center;
          animation: sway 5.5s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.08); }
        }

        .pulse-glow-circle {
          animation: pulseGlow 4s ease-in-out infinite;
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }

        .float-slow-content {
          animation: floatSlow 5s ease-in-out infinite;
        }
      `}} />

      {/* Nature Audio Loop */}
      <audio 
        ref={birdsAudioRef} 
        src="https://archive.org/download/Red_Library_Animals_Birds/R01-24-Birds%20Chirping%20Outside.mp3" 
        loop 
        preload="auto"
      />

      {/* Sky Sparkles / Stars Background Layer */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"></div>
      
      {/* Floating Sparkles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[25%] left-[20%] w-1.5 h-1.5 bg-amber-200 rounded-full blur-[1px] animate-pulse"></div>
        <div className="absolute top-[40%] left-[80%] w-1 h-1 bg-white rounded-full blur-[1px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[15%] left-[70%] w-2 h-2 bg-amber-100 rounded-full blur-[1px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-[60%] left-[15%] w-1 h-1 bg-white rounded-full blur-[0.5px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Large Rising Glowing Golden Sun/Moon in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-gradient-to-b from-amber-500/10 to-transparent blur-[70px] pointer-events-none"></div>

      {/* Golden Crescent Moon high in the sky */}
      <div className="absolute top-[15%] right-[15%] w-14 h-14 rounded-full bg-gradient-to-tr from-amber-100 to-yellow-50 shadow-[0_0_35px_rgba(251,191,36,0.3)] pointer-events-none flex items-center justify-center">
        <div className="absolute inset-[-6px] rounded-full bg-amber-400/10 blur-sm pulse-glow-circle"></div>
        {/* Crescent shadow to make it a crescent moon */}
        <div className="absolute w-12 h-12 rounded-full bg-[#02131b] -top-1 -left-2"></div>
      </div>

      {/* FLYING BIRDS LAYER */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
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
            <svg 
              className="w-12 h-12 text-amber-200/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" 
              viewBox="0 0 100 100" 
              fill="currentColor"
            >
              {/* Left Wing */}
              <path 
                className="wing-left" 
                d="M50 50 Q30 20 5 35 Q25 42 50 50 Z" 
              />
              {/* Right Wing */}
              <path 
                className="wing-right" 
                d="M50 50 Q70 20 95 35 Q75 42 50 50 Z" 
              />
              {/* Bird Body */}
              <path d="M50 42 Q52 47 56 50 Q52 53 50 58 Q48 53 44 50 Q48 47 50 42 Z" />
            </svg>
          </div>
        ))}
      </div>

      {/* TREES SILHOUETTE LAYERS (Generates beautifully swayable forests) */}
      <div className="absolute bottom-0 left-0 w-full h-44 overflow-hidden pointer-events-none z-10">
        
        {/* Layer 1: Back Forest (Taller, lighter, swaying slowly) */}
        <div className="absolute bottom-0 w-full h-36 flex justify-around items-end opacity-[0.12] text-teal-950 px-2">
          {Array.from({ length: 9 }).map((_, i) => {
            const scale = 0.8 + Math.random() * 0.4;
            const isPine = i % 2 === 0;
            return (
              <div 
                key={`back-tree-${i}`} 
                className="tree-sway-slow flex-shrink-0"
                style={{ 
                  transform: `scale(${scale})`,
                  animationDelay: `${i * -0.6}s`
                }}
              >
                {isPine ? (
                  // Pine Tree Silhouette
                  <svg width="75" height="150" viewBox="0 0 100 200" fill="currentColor">
                    <path d="M50 10 L85 90 L70 90 L90 140 L60 140 L95 190 L5 190 L40 140 L10 140 L30 90 L15 90 Z" />
                  </svg>
                ) : (
                  // Leafy Tree Silhouette
                  <svg width="85" height="150" viewBox="0 0 100 200" fill="currentColor">
                    <path d="M48 100 Q50 190 42 195 L58 195 Q50 190 52 100 Z" />
                    <circle cx="50" cy="70" r="35" />
                    <circle cx="30" cy="85" r="28" />
                    <circle cx="70" cy="85" r="28" />
                    <circle cx="50" cy="45" r="28" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Layer 2: Front Forest (Shorter, darker, swaying faster) */}
        <div className="absolute bottom-0 w-full h-28 flex justify-around items-end opacity-[0.24] text-slate-950 px-1">
          {Array.from({ length: 11 }).map((_, i) => {
            const scale = 0.7 + Math.random() * 0.5;
            const isPine = i % 3 === 0;
            return (
              <div 
                key={`front-tree-${i}`} 
                className="tree-sway-fast flex-shrink-0"
                style={{ 
                  transform: `scale(${scale})`,
                  animationDelay: `${i * -0.4}s`
                }}
              >
                {isPine ? (
                  // Pine Tree Silhouette
                  <svg width="60" height="120" viewBox="0 0 100 200" fill="currentColor">
                    <path d="M50 10 L85 90 L70 90 L90 140 L60 140 L95 190 L5 190 L40 140 L10 140 L30 90 L15 90 Z" />
                  </svg>
                ) : (
                  // Leafy Tree Silhouette
                  <svg width="70" height="120" viewBox="0 0 100 200" fill="currentColor">
                    <path d="M48 100 Q50 190 42 195 L58 195 Q50 190 52 100 Z" />
                    <circle cx="50" cy="70" r="35" />
                    <circle cx="30" cy="85" r="28" />
                    <circle cx="70" cy="85" r="28" />
                    <circle cx="50" cy="45" r="28" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* MAIN CONTENT BLOCK (Center Welcome Card) */}
      <div className="z-30 text-center px-6 max-w-lg float-slow-content">
        
        {/* Monogram Badge */}
        <div className="w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center bg-stone-900/60 shadow-lg shadow-amber-500/5 mx-auto mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent blur-[2px]"></div>
          <span className="font-serif text-lg font-bold tracking-widest text-amber-400">
            {brideName ? brideName.charAt(0) : 'B'}&{groomName ? groomName.charAt(0) : 'G'}
          </span>
        </div>

        <p className="font-serif text-[10px] sm:text-xs uppercase tracking-[0.35em] text-amber-500/80 mb-2 font-medium">
          You Are Warmly Invited
        </p>

        <h2 className="font-serif text-3xl sm:text-4xl text-amber-200 font-light mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {brideName || 'Bride'} <span className="font-greatvibes text-amber-500 italic text-2xl sm:text-3xl mx-1">&</span> {groomName || 'Groom'}
        </h2>

        {/* LOADING PROGRESS / ENTER BUTTON */}
        <div className="flex flex-col items-center justify-center gap-4 h-24">
          {!isLoaded ? (
            <div className="w-full flex flex-col items-center gap-3">
              {/* Progress Text */}
              <span className="font-serif text-xs text-amber-200/80 tracking-widest animate-pulse">
                Entering Natural Paradise... {progress}%
              </span>
              
              {/* Gold Progress Bar */}
              <div className="w-56 sm:w-64 h-[3px] bg-stone-950/80 rounded-full border border-amber-500/10 overflow-hidden relative shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.7)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 animate-pulse">
              <span className="font-serif text-sm text-amber-400 tracking-[0.25em] font-semibold uppercase">
                Opening Invitation...
              </span>
              <span className="text-[10px] text-amber-200/50 uppercase tracking-widest block select-none">
                🎵 Music & Sounds Loading
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Floating Instructions/Status Note at the bottom */}
      <div className="absolute bottom-6 z-30 text-center select-none pointer-events-none">
        <p className="text-[9px] uppercase tracking-[0.25em] text-stone-500/80">
          {!hasInteracted ? "🎵 Tap anywhere to enjoy the full sound experience" : "A Lifetime of Love and Happiness"}
        </p>
      </div>

    </div>
  );
}

export default LoadingScreen;
