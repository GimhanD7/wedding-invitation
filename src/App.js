import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// Sub-components
import LoadingScreen from './components/LoadingScreen';
import HeroSection from './components/HeroSection';
import InvitationSection from './components/InvitationSection';
import CountdownSection from './components/CountdownSection';
import VenueSection from './components/VenueSection';
import RsvpSection from './components/RsvpSection';
import WishesSection from './components/WishesSection';
import Footer from './components/Footer';
import AdminAuthModal from './components/AdminAuthModal';
import AdminPanel from './components/AdminPanel';

// Constants
import { themes } from './constants/themes';

function App() {
  // --- STATE FOR SITE SETTINGS ---
  const [settings, setSettings] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '2026-05-25T15:30:00',
    venueName: 'Saminro Grand Palace',
    venueAddress: 'Veyangoda, Sri Lanka',
    venueGoogleLink: 'https://maps.google.com/?q=Saminro+Grand+Palace+Veyangoda',
    theme: 'flora',
    guestName: 'Mr. / Mr. & Mrs. / Ms. / Family',
    coupleOutdoorImg: 'images/couple_outdoor.png',
    couplePortraitImg: 'images/couple_portrait.png',
    bgMusicUrl: 'https://archive.org/download/jamendo-375578/01-1628418-DHDMusic-Wedding%20Piano.mp3',
    customColorPrimary: '#5a7c54',
    customColorSecondary: '#b8953a'
  });

  // Sidebar / Panel Controls
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // --- ADMIN SECURITY & PATH ROUTING ---
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => sessionStorage.getItem('wedding_admin_authenticated') === 'true'
  );

  // --- AUDIO SOUNDTRACKS & PLAYBACK STATUS ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  
  const audioRef = useRef(null);
  const natureAudioRef = useRef(null);
  const canvasRef = useRef(null);

  // Setup birds chirping forest ambient soundtrack
  useEffect(() => {
    natureAudioRef.current = new Audio("https://archive.org/download/Red_Library_Animals_Birds/R01-24-Birds%20Chirping%20Outside.mp3");
    natureAudioRef.current.loop = true;
    natureAudioRef.current.volume = 0.25;

    return () => {
      if (natureAudioRef.current) {
        natureAudioRef.current.pause();
      }
    };
  }, []);

  // Audio Play / Pause orchestration effect
  useEffect(() => {
    if (audioStarted && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Main music play blocked:", e));
        natureAudioRef.current?.play().catch(e => console.log("Nature sound play blocked:", e));
      } else {
        audioRef.current.pause();
        natureAudioRef.current?.pause();
      }
    }
  }, [isPlaying, audioStarted]);

  // Global touch listener to unblock browser auto-play restrictions on first gesture
  useEffect(() => {
    if (audioStarted) return;

    const startAudioOnFirstInteraction = (e) => {
      if (audioStarted) return;

      // Ignore trigger if clicking direct play/mute controller
      if (e.target.closest('button') && (e.target.closest('button').title === "Mute Music" || e.target.closest('button').title === "Play Romantic Music")) {
        return;
      }

      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAudioStarted(true);
            
            if (natureAudioRef.current) {
              natureAudioRef.current.play().catch(e => console.log("Nature auto-play failed on interaction:", e));
            }

            document.removeEventListener('click', startAudioOnFirstInteraction);
            document.removeEventListener('touchstart', startAudioOnFirstInteraction);
          })
          .catch(e => console.log("First touch interaction did not unblock audio yet:", e));
      }
    };

    document.addEventListener('click', startAudioOnFirstInteraction);
    document.addEventListener('touchstart', startAudioOnFirstInteraction);

    return () => {
      document.removeEventListener('click', startAudioOnFirstInteraction);
      document.removeEventListener('touchstart', startAudioOnFirstInteraction);
    };
  }, [audioStarted]);

  // --- URL PARAMS, ROUTING & FIRESTORE DATABASE REAL-TIME SYNC ---
  useEffect(() => {
    // 1. Detect Admin Route (Path, Hash, or Query)
    const checkRoute = () => {
      const isPathAdmin = window.location.pathname === '/admin' || 
                          window.location.hash === '#admin' || 
                          window.location.search.includes('admin=true');
      setIsAdminRoute(isPathAdmin);
      
      if (isPathAdmin && sessionStorage.getItem('wedding_admin_authenticated') === 'true') {
        setIsPanelOpen(true);
      }
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    // 2. Parse URL parameters for localized guest overrides
    const params = new URLSearchParams(window.location.search);
    const urlSettings = {};
    if (params.get('bride')) urlSettings.brideName = params.get('bride');
    if (params.get('groom')) urlSettings.groomName = params.get('groom');
    if (params.get('date')) urlSettings.weddingDate = params.get('date');
    if (params.get('venue')) urlSettings.venueName = params.get('venue');
    if (params.get('address')) urlSettings.venueAddress = params.get('address');
    if (params.get('map')) urlSettings.venueGoogleLink = params.get('map');
    if (params.get('theme') && themes[params.get('theme')]) urlSettings.theme = params.get('theme');
    if (params.get('guest')) urlSettings.guestName = params.get('guest');
    if (params.get('img1')) urlSettings.coupleOutdoorImg = params.get('img1');
    if (params.get('img2')) urlSettings.couplePortraitImg = params.get('img2');
    if (params.get('music')) urlSettings.bgMusicUrl = params.get('music');

    if (Object.keys(urlSettings).length > 0) {
      setSettings(prev => ({ ...prev, ...urlSettings }));
    }

    // 3. Subscribe to Settings document in Firestore
    const unsubSettings = onSnapshot(doc(db, "wedding", "settings"), (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        setSettings(prev => ({ 
          ...prev, 
          ...cloudData, 
          ...urlSettings, 
          guestName: urlSettings.guestName || cloudData.guestName || prev.guestName 
        }));
      } else {
        const initialDefault = {
          brideName: 'Bride',
          groomName: 'Groom',
          weddingDate: '2026-05-25T15:30:00',
          venueName: 'Saminro Grand Palace',
          venueAddress: 'Veyangoda, Sri Lanka',
          venueGoogleLink: 'https://maps.google.com/?q=Saminro+Grand+Palace+Veyangoda',
          theme: 'flora',
          guestName: 'Valued Family & Friends',
          coupleOutdoorImg: '',
          couplePortraitImg: '',
          bgMusicUrl: 'https://archive.org/download/jamendo-375578/01-1628418-DHDMusic-Wedding%20Piano.mp3',
          customColorPrimary: '#5a7c54',
          customColorSecondary: '#b8953a'
        };
        setDoc(doc(db, "wedding", "settings"), initialDefault)
          .catch(e => console.error("Failed to seed initial Firestore settings:", e));
      }
    });

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
      unsubSettings();
    };
  }, []);

  // --- DYNAMIC DOCUMENT TITLE UPDATER ---
  useEffect(() => {
    const bride = settings.brideName && settings.brideName.trim() ? settings.brideName.trim() : '';
    const groom = settings.groomName && settings.groomName.trim() ? settings.groomName.trim() : '';
    if (bride && groom) {
      document.title = `${bride} & ${groom} - Our Wedding Invitation`;
    } else {
      document.title = "Our Wedding Invitation";
    }
  }, [settings.brideName, settings.groomName]);

  // --- DYNAMIC MUSIC LOADING HANDLER ---
  useEffect(() => {
    if (audioRef.current && settings.bgMusicUrl) {
      audioRef.current.src = settings.bgMusicUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.log("Autoplay blocked on background audio change:", e);
          setIsPlaying(false);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.bgMusicUrl]);

  // --- FLOATING congratulations & LEAVES PARTICLES ---
  const [hearts, setHearts] = useState([]);
  useEffect(() => {
    const symbols = settings.theme === 'flora' ? [
      { char: '🍃', color: 'text-emerald-600/30', flow: 'fall' },
      { char: '🌸', color: 'text-pink-400/25', flow: 'fall' },
      { char: '🌿', color: 'text-teal-600/25', flow: 'fall' },
      { char: '🍂', color: 'text-amber-600/20', flow: 'fall' },
      { char: '✨', color: 'text-emerald-500/30', flow: 'fall' },
      { char: '❀', color: 'text-pink-300/30', flow: 'fall' }
    ] : [
      { char: '✨', color: 'text-amber-400/40', flow: 'fall' },
      { char: '✦', color: 'text-yellow-300/35', flow: 'fall' },
      { char: '❤', color: 'text-amber-500/30', flow: 'rise' },
      { char: '💖', color: 'text-amber-300/25', flow: 'fall' },
      { char: '🎉', color: 'text-yellow-400/20', flow: 'fall' },
      { char: '•', color: 'text-amber-400/20', flow: 'rise' }
    ];

    const interval = setInterval(() => {
      setHearts(prev => {
        if (prev.length < 35) {
          const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
          return [
            ...prev,
            {
              id: Math.random(),
              x: Math.random() * 100,
              size: Math.random() * 18 + 10,
              duration: Math.random() * 8 + 5,
              delay: Math.random() * 2,
              char: randomSymbol.char,
              color: randomSymbol.color,
              flow: randomSymbol.flow
            }
          ];
        }
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [settings.theme]);

  const cleanHeart = (id) => {
    setHearts(prev => prev.filter(h => h.id !== id));
  };

  // --- MUSIC FLOATING BUTTON TRIGGERS ---
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      natureAudioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {
        alert("Please tap anywhere on the page to unblock background audio playback!");
      });
      natureAudioRef.current?.play().catch(err => console.log("Ambient resume failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  // --- CONFETTI CANNON CELEBRATION SHOWER ---
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];
    const colors = ['#fbbf24', '#f59e0b', '#d97706', '#fef08a', '#ffffff', '#a855f7', '#ec4899'];

    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      
      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2.5;
        p.x += Math.sin(p.tiltAngle) * 0.5;
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 12;

        if (p.y < canvas.height) {
          active = true;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r / 1.5;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      if (active) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    draw();
  };

  const currentTheme = themes[settings.theme] || themes.goldLight;
  const isLight = settings.theme === 'goldLight' || settings.theme === 'flora';

  return (
    <div className={`scroll-snap-container bg-gradient-to-b ${currentTheme.bgGradient} ${currentTheme.text} font-sans relative transition-colors duration-1000`}>
      
      {/* Custom Theme Color Injector */}
      {settings.theme === 'custom' && (
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --custom-primary: ${settings.customColorPrimary || '#5a7c54'};
            --custom-accent: ${settings.customColorSecondary || '#b8953a'};
            --custom-primary-hover: ${settings.customColorPrimary || '#5a7c54'}dd;
            --custom-accent-hover: ${settings.customColorSecondary || '#b8953a'}dd;
          }
        `}} />
      )}
      
      {showLoading && (
        <LoadingScreen 
          brideName={settings.brideName} 
          groomName={settings.groomName} 
          settings={settings}
          onInteraction={() => {
            if (audioRef.current) {
              audioRef.current.play().then(() => {
                audioRef.current.pause();
                setAudioStarted(true);
              }).catch(e => console.log("Pre-play music unblock failed:", e));
            }
            if (natureAudioRef.current) {
              natureAudioRef.current.play().then(() => {
                natureAudioRef.current.pause();
              }).catch(e => console.log("Pre-play nature sound unblock failed:", e));
            }
          }}
          onEnter={() => {
            setIsPlaying(true);
            setAudioStarted(true);
            
            let mainPlayPromise = Promise.resolve();
            if (audioRef.current) {
              mainPlayPromise = audioRef.current.play();
            }

            mainPlayPromise
              .then(() => {
                if (natureAudioRef.current) {
                  natureAudioRef.current.play().catch(e => console.log("Nature sound play failed on enter:", e));
                }
              })
              .catch(e => {
                console.log("Music blocked on auto-enter:", e);
                setIsPlaying(false);
                setAudioStarted(false);
              });

            setShowLoading(false);
          }}
        />
      )}

      {/* Audio element for romance background soundtrack */}
      <audio ref={audioRef} loop />

      {/* Fullscreen Overlay Canvas for Confetti */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" />

      {/* Floating & Falling Congratulations Sparks & Leaves background layer */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-10">
        {hearts.map(heart => (
          <span
            key={heart.id}
            className={`absolute select-none pointer-events-none ${heart.color || 'text-amber-400/25'} ${
              heart.flow === 'fall' ? 'animate-fall-gold' : 'animate-float'
            }`}
            style={{
              left: `${heart.x}%`,
              fontSize: `${heart.size}px`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
              ...(heart.flow === 'fall' ? { top: '-40px' } : { bottom: '-40px' })
            }}
            onAnimationEnd={() => cleanHeart(heart.id)}
          >
            {heart.char || '❤'}
          </span>
        ))}
      </div>

      {/* FLOATING ACTION UTILITIES (Music & Customizer Trigger) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
        
        {/* MUSIC CONTROLLER */}
        <button
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isPlaying ? 'bg-amber-400 text-stone-900 animate-spin-slow' : currentTheme.btnBg} border border-amber-400/50 hover:scale-110`}
          title={isPlaying ? "Mute Music" : "Play Romantic Music"}
        >
          {isPlaying ? (
            <div className="relative flex items-center justify-center">
              <i className="fa-solid fa-music text-base"></i>
              {/* Pulsing Music Waves */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-900 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-stone-900"></span>
              </span>
            </div>
          ) : (
            <i className="fa-solid fa-music text-amber-400 text-base"></i>
          )}
        </button>

        {/* CUSTOMIZER DRAWER TRIGGER (ONLY FOR AUTHENTICATED ADMINS) */}
        {isAdminRoute && isAdminAuthenticated && (
          <button
            onClick={() => setIsPanelOpen(true)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 hover:scale-110`}
            title="Customize Invitation / Manage RSVPs"
          >
            <i className="fa-solid fa-wand-magic-sparkles text-lg animate-pulse"></i>
          </button>
        )}

      </div>

      {/* 1. HERO SECTION */}
      <HeroSection settings={settings} currentTheme={currentTheme} isLight={isLight} />

      {/* 2. PERSONALIZED GUEST INVITATION & POLAROIDS SECTION */}
      <InvitationSection settings={settings} />

      {/* 3. COUNTDOWN TO FOREVER TIMER SECTION */}
      <CountdownSection settings={settings} currentTheme={currentTheme} isLight={isLight} />

      {/* 4. VENUE DETAILS & MAP SECTION */}
      <VenueSection settings={settings} />

      {/* 5. RSVP FORM SECTION */}
      <RsvpSection settings={settings} theme={settings.theme} triggerConfetti={triggerConfetti} />

      {/* 6. BEST WISHES & GUEST BOOK BOARD SECTION */}
      <WishesSection settings={settings} triggerConfetti={triggerConfetti} />

      {/* 7. FOOTER SECTION */}
      <Footer settings={settings} currentTheme={currentTheme} isLight={isLight} />

      {/* 8. ADMIN AUTHENTICATION MODAL */}
      <AdminAuthModal 
        isAdminRoute={isAdminRoute} 
        isAdminAuthenticated={isAdminAuthenticated} 
        setIsAdminAuthenticated={setIsAdminAuthenticated}
        setIsPanelOpen={setIsPanelOpen}
      />

      {/* 9. SLIDING CONTROL PANEL (REAL-TIME LIVE SETTINGS) */}
      <AdminPanel 
        isPanelOpen={isPanelOpen} 
        setIsPanelOpen={setIsPanelOpen} 
        settings={settings} 
        themes={themes} 
        triggerConfetti={triggerConfetti} 
      />

    </div>
  );
}

export default App;
