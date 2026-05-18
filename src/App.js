import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from './components/LoadingScreen';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  getDocs 
} from 'firebase/firestore';

// Theme configurations for the Wedding Invitation
const themes = {
  goldLight: {
    name: 'Champagne Gold',
    bgGradient: 'from-[#FCFBF7] via-[#F7F4EB] to-[#EFEADA]',
    primary: 'amber',
    text: 'text-stone-900',
    accent: 'text-[#b8953a]',
    accentHover: 'hover:text-[#a1802d]',
    accentBg: 'bg-[#b8953a]',
    accentBgHover: 'hover:bg-[#a1802d]',
    accentBorder: 'border-[#b8953a]',
    accentBorderMuted: 'border-[#b8953a]/30',
    glow: 'shadow-amber-500/10',
    btnBg: 'bg-white/80 hover:bg-stone-50 border border-[#b8953a]/40 text-stone-800',
    btnAccent: 'bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-stone-950 font-semibold shadow-lg shadow-[#d4af37]/20',
    cardBg: 'bg-white/95 border border-[#b8953a]/25 shadow-xl shadow-stone-200/50 text-stone-800',
    textMuted: 'text-stone-500',
    darkMuted: 'bg-stone-100',
    polaroidBg: 'bg-white text-stone-800 border border-stone-200 shadow-xl',
    dividerColor: 'from-transparent via-[#b8953a]/40 to-transparent'
  },
  goldDark: {
    name: 'Obsidian Gold',
    bgGradient: 'from-stone-950 via-[#191307] to-stone-950',
    primary: 'amber',
    text: 'text-stone-100',
    accent: 'text-[#e5c158]',
    accentHover: 'hover:text-[#f3e5ab]',
    accentBg: 'bg-[#e5c158]',
    accentBgHover: 'hover:bg-[#f3e5ab]',
    accentBorder: 'border-[#e5c158]',
    accentBorderMuted: 'border-[#e5c158]/30',
    glow: 'shadow-amber-500/20',
    btnBg: 'bg-stone-950/60 hover:bg-stone-900/80 border border-[#e5c158]/40 text-amber-100',
    btnAccent: 'bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-stone-950 font-semibold shadow-lg shadow-amber-500/30',
    cardBg: 'bg-stone-950/80 border border-[#e5c158]/20',
    textMuted: 'text-stone-400',
    darkMuted: 'bg-stone-950/60',
    polaroidBg: 'bg-stone-50 text-stone-800 shadow-md',
    dividerColor: 'from-transparent via-[#e5c158]/40 to-transparent'
  },
  emerald: {
    name: 'Emerald Gold',
    bgGradient: 'from-emerald-950 via-teal-950 to-emerald-950',
    primary: 'emerald',
    text: 'text-emerald-50',
    accent: 'text-amber-400',
    accentHover: 'hover:text-amber-300',
    accentBg: 'bg-amber-400',
    accentBgHover: 'hover:bg-amber-300',
    accentBorder: 'border-amber-400',
    accentBorderMuted: 'border-amber-400/30',
    glow: 'shadow-amber-500/20',
    btnBg: 'bg-emerald-900/60 hover:bg-emerald-800/80 border border-amber-500/40 text-amber-100',
    btnAccent: 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-900 font-semibold shadow-lg shadow-amber-500/30',
    cardBg: 'bg-emerald-950/80 border border-amber-500/20',
    textMuted: 'text-emerald-200/60',
    darkMuted: 'bg-emerald-950/60',
    polaroidBg: 'bg-stone-50 text-stone-800',
    dividerColor: 'from-transparent via-amber-400/40 to-transparent'
  },
  crimson: {
    name: 'Royal Crimson',
    bgGradient: 'from-stone-950 via-rose-950 to-stone-950',
    primary: 'rose',
    text: 'text-rose-50',
    accent: 'text-yellow-400',
    accentHover: 'hover:text-yellow-300',
    accentBg: 'bg-yellow-400',
    accentBgHover: 'hover:bg-yellow-300',
    accentBorder: 'border-yellow-400',
    accentBorderMuted: 'border-yellow-400/30',
    glow: 'shadow-yellow-500/20',
    btnBg: 'bg-rose-950/60 hover:bg-rose-900/80 border border-yellow-500/40 text-yellow-100',
    btnAccent: 'bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-stone-900 font-semibold shadow-lg shadow-yellow-500/30',
    cardBg: 'bg-rose-950/80 border border-yellow-500/20',
    textMuted: 'text-rose-200/60',
    darkMuted: 'bg-rose-950/60',
    polaroidBg: 'bg-stone-50 text-stone-800',
    dividerColor: 'from-transparent via-yellow-400/40 to-transparent'
  },
  sapphire: {
    name: 'Midnight Sapphire',
    bgGradient: 'from-slate-950 via-blue-950 to-slate-950',
    primary: 'blue',
    text: 'text-blue-50',
    accent: 'text-amber-300',
    accentHover: 'hover:text-amber-200',
    accentBg: 'bg-amber-300',
    accentBgHover: 'hover:bg-amber-200',
    accentBorder: 'border-amber-300',
    accentBorderMuted: 'border-amber-300/30',
    glow: 'shadow-amber-400/20',
    btnBg: 'bg-blue-950/60 hover:bg-blue-900/80 border border-amber-300/40 text-amber-100',
    btnAccent: 'bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-400 hover:to-yellow-200 text-slate-950 font-semibold shadow-lg shadow-amber-400/30',
    cardBg: 'bg-blue-950/80 border border-amber-300/20',
    textMuted: 'text-blue-200/60',
    darkMuted: 'bg-blue-950/60',
    polaroidBg: 'bg-stone-50 text-stone-800',
    dividerColor: 'from-transparent via-amber-300/40 to-transparent'
  },
  blush: {
    name: 'Blush Rose',
    bgGradient: 'from-stone-900 via-rose-900 to-stone-900',
    primary: 'pink',
    text: 'text-rose-50',
    accent: 'text-amber-200',
    accentHover: 'hover:text-amber-100',
    accentBg: 'bg-amber-200',
    accentBgHover: 'hover:bg-amber-100',
    accentBorder: 'border-amber-200',
    accentBorderMuted: 'border-amber-200/30',
    glow: 'shadow-amber-300/20',
    btnBg: 'bg-rose-950/60 hover:bg-rose-900/80 border border-amber-200/40 text-amber-100',
    btnAccent: 'bg-gradient-to-r from-amber-300 to-yellow-200 hover:from-amber-200 hover:to-yellow-100 text-rose-950 font-semibold shadow-lg shadow-amber-300/30',
    cardBg: 'bg-rose-950/80 border border-amber-200/20',
    textMuted: 'text-rose-200/60',
    darkMuted: 'bg-rose-950/60',
    polaroidBg: 'bg-stone-50 text-stone-800',
    dividerColor: 'from-transparent via-amber-200/40 to-transparent'
  },
  flora: {
    name: 'Forest Sage (Flora)',
    bgGradient: 'from-[#F4F6F4] via-[#E8ECE7] to-[#DCE3DA]',
    primary: 'emerald',
    text: 'text-emerald-950',
    accent: 'text-[#5A7C54]',
    accentHover: 'hover:text-[#415C3C]',
    accentBg: 'bg-[#5A7C54]',
    accentBgHover: 'hover:bg-[#415C3C]',
    accentBorder: 'border-[#5A7C54]',
    accentBorderMuted: 'border-[#5A7C54]/30',
    glow: 'shadow-emerald-500/10',
    btnBg: 'bg-white/90 hover:bg-[#F4F6F4] border border-[#5A7C54]/35 text-[#2C3E28]',
    btnAccent: 'bg-gradient-to-r from-[#5A7C54] to-[#7FA478] text-white font-semibold shadow-lg shadow-[#5A7C54]/20',
    cardBg: 'bg-white/95 border border-[#5A7C54]/25 shadow-xl shadow-stone-200/30 text-[#2C3E28]',
    textMuted: 'text-emerald-800/60',
    darkMuted: 'bg-emerald-50',
    polaroidBg: 'bg-white text-stone-800 border border-emerald-100 shadow-xl',
    dividerColor: 'from-transparent via-[#5A7C54]/40 to-transparent'
  },
  custom: {
    name: 'Custom Palette',
    bgGradient: 'from-stone-950 via-stone-900 to-stone-950',
    primary: 'custom',
    text: 'text-stone-100',
    accent: 'text-[var(--custom-accent)]',
    accentHover: 'hover:text-[var(--custom-accent-hover)]',
    accentBg: 'bg-[var(--custom-primary)]',
    accentBgHover: 'hover:bg-[var(--custom-primary-hover)]',
    accentBorder: 'border-[var(--custom-primary)]',
    accentBorderMuted: 'border-[var(--custom-primary)]/30',
    glow: 'shadow-[var(--custom-primary)]/10',
    btnBg: 'bg-stone-900/60 hover:bg-stone-800/80 border border-[var(--custom-primary)]/40 text-stone-100',
    btnAccent: 'bg-gradient-to-r from-[var(--custom-primary)] to-[var(--custom-accent)] text-stone-950 font-bold shadow-lg shadow-[var(--custom-primary)]/20',
    cardBg: 'bg-stone-900/90 border border-[var(--custom-primary)]/20 text-stone-100',
    textMuted: 'text-stone-300/70',
    darkMuted: 'bg-stone-950/60',
    polaroidBg: 'bg-stone-900 text-stone-100 border border-[var(--custom-primary)]/10 shadow-xl',
    dividerColor: 'from-transparent via-[var(--custom-primary)]/40 to-transparent'
  }
};

function App() {
  // --- STATE FOR WEB SITE CUSTOMIZATION ---
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

  // Sidebar / panel controls
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [tempSettings, setTempSettings] = useState({ ...settings });
  
  // Customizer link building variables
  const [personalizedGuest, setPersonalizedGuest] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // --- ADMIN SECURITY & PATH ROUTING ---
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => sessionStorage.getItem('wedding_admin_authenticated') === 'true'
  );
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminError, setAdminError] = useState('');

  // --- PLAY MUSIC STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = useRef(null);
  
  const [showLoading, setShowLoading] = useState(true);
  const natureAudioRef = useRef(null);

  useEffect(() => {
    // Nature sound initialization (birds chirping)
    natureAudioRef.current = new Audio("https://archive.org/download/Red_Library_Animals_Birds/R01-24-Birds%20Chirping%20Outside.mp3");
    natureAudioRef.current.loop = true;
    natureAudioRef.current.volume = 0.25; // Keep it soft in the background

    return () => {
      if (natureAudioRef.current) {
        natureAudioRef.current.pause();
      }
    };
  }, []);

  // Global click / tap listener to start music on first user interaction anywhere
  useEffect(() => {
    if (audioStarted) return;

    const startAudioOnFirstClick = (e) => {
      if (audioStarted) return;

      // Ignore if clicking the music floating button
      if (e.target.closest('button') && (e.target.closest('button').title === "Mute Music" || e.target.closest('button').title === "Play Romantic Music")) {
        return;
      }

      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAudioStarted(true);
            
            if (natureAudioRef.current) {
              natureAudioRef.current.play().catch(e => console.log("Nature auto-play failed on click:", e));
            }

            // Clean up event listeners
            document.removeEventListener('click', startAudioOnFirstClick);
            document.removeEventListener('touchstart', startAudioOnFirstClick);
          })
          .catch(e => {
            console.log("Interaction did not unblock audio yet:", e);
          });
      }
    };

    document.addEventListener('click', startAudioOnFirstClick);
    document.addEventListener('touchstart', startAudioOnFirstClick);

    return () => {
      document.removeEventListener('click', startAudioOnFirstClick);
      document.removeEventListener('touchstart', startAudioOnFirstClick);
    };
  }, [audioStarted]);

  // --- COUNTDOWN STATE ---
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // --- RSVP FORM STATE ---
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    phone: '',
    guestsCount: 1,
    attendance: 'attending',
    message: ''
  });
  const [rsvps, setRsvps] = useState([]);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  
  // --- GUEST BOOK / WISHES STATE ---
  const [wishes, setWishes] = useState([]);
  const [wishForm, setWishForm] = useState({
    name: '',
    message: '',
    avatarColor: 'bg-amber-500'
  });

  // Canvas ref for Confetti
  const canvasRef = useRef(null);

  // --- URL PARAMS, ADMIN DETECTOR & FIRESTORE REAL-TIME SYNC ---
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
      setSettings(prev => {
        const newSettings = { ...prev, ...urlSettings };
        setTempSettings(newSettings);
        return newSettings;
      });
      if (urlSettings.guestName && urlSettings.guestName !== 'Mr. / Mr. & Mrs. / Ms. / Family') {
        setRsvpForm(prev => ({ ...prev, name: urlSettings.guestName }));
      }
    }

    // 3. Subscribe to Settings in Firestore
    const unsubSettings = onSnapshot(doc(db, "wedding", "settings"), (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        // Merge Firestore cloud configurations with URL guest parameter configurations
        // URL guest parameters must ALWAYS take priority over Firestore configurations
        setSettings(prev => ({ 
          ...prev, 
          ...cloudData, 
          ...urlSettings, 
          guestName: urlSettings.guestName || cloudData.guestName || prev.guestName 
        }));
        setTempSettings(prev => ({ 
          ...prev, 
          ...cloudData, 
          ...urlSettings, 
          guestName: urlSettings.guestName || cloudData.guestName || prev.guestName 
        }));
      } else {
        const initialDefault = {
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
        };
        setDoc(doc(db, "wedding", "settings"), initialDefault)
          .catch(e => console.log("Failed to seed initial Firestore settings:", e));
      }
    });

    // 4. Subscribe to RSVPs in Firestore
    const rsvpQuery = query(collection(db, "rsvps"), orderBy("timestamp", "desc"));
    const unsubRsvps = onSnapshot(rsvpQuery, (snapshot) => {
      const rsvpList = [];
      snapshot.forEach((docSnap) => {
        rsvpList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setRsvps(rsvpList);
    });

    // 5. Subscribe to Wishes in Firestore
    const wishesQuery = query(collection(db, "wishes"), orderBy("timestamp", "desc"));
    const unsubWishes = onSnapshot(wishesQuery, (snapshot) => {
      const wishesList = [];
      snapshot.forEach((docSnap) => {
        wishesList.push({ id: docSnap.id, ...docSnap.data() });
      });
      if (wishesList.length > 0) {
        setWishes(wishesList);
      } else {
        const mockWishes = [
          { name: 'Nimal & Kanthi', message: 'Wishing you both a lifetime of love and happiness together! So excited to celebrate!', date: 'Just now', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
          { name: 'Dr. Ruwan', message: 'May your wedding day be filled with sweet memories and the beginning of a beautiful journey.', date: '2 hours ago', color: 'bg-rose-100 text-rose-800 border-rose-300' },
          { name: 'Asha Jayawardena', message: 'Congratulations Niwarthana and Thenuka! May God bless your union with endless joy.', date: '1 day ago', color: 'bg-blue-100 text-blue-800 border-blue-300' }
        ];
        setWishes(mockWishes);
        // Seed initial wishes to Firestore if empty
        mockWishes.forEach(async (wish) => {
          await addDoc(collection(db, "wishes"), { ...wish, timestamp: new Date() });
        });
      }
    });

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
      unsubSettings();
      unsubRsvps();
      unsubWishes();
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

  // --- DYNAMIC MUSIC LOADER ---
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = settings.bgMusicUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.log("Autoplay was blocked by browser", e);
          setIsPlaying(false);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.bgMusicUrl]);

  // --- TICK COUNTDOWN TIMER ---
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(settings.weddingDate) - +new Date();
      let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.weddingDate]);

  // --- CELEBRATION CONGRATULATIONS PARTICLES SYSTEM ---
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
              x: Math.random() * 100, // percentage
              size: Math.random() * 18 + 10, // px
              duration: Math.random() * 8 + 5, // seconds
              delay: Math.random() * 2, // seconds
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

  // --- MUSIC PLAY/PAUSE CONTROL ---
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      if (natureAudioRef.current) natureAudioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        alert("Please interact with the page first so we can play the background music!");
      });
      if (natureAudioRef.current) {
        natureAudioRef.current.play().catch(err => {
          console.log("Nature audio failed to resume:", err);
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  // --- CONFETTI CANNON TRIGGER ---
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];
    
    // Glittering festive color palette
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

  // --- RSVP FORM HANDLERS ---
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

  // --- WISH SUBMISSION HANDLER ---
  const handleWishSubmit = async (e) => {
    e.preventDefault();
    if (!wishForm.name.trim() || !wishForm.message.trim()) return;

    const avatarColors = [
      'bg-amber-100 text-amber-800 border-amber-300', 
      'bg-rose-100 text-rose-800 border-rose-300', 
      'bg-emerald-100 text-emerald-800 border-emerald-300',
      'bg-blue-100 text-blue-800 border-blue-300',
      'bg-teal-100 text-teal-800 border-teal-300'
    ];

    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const newWish = {
      name: wishForm.name,
      message: wishForm.message,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      color: randomColor,
      timestamp: new Date()
    };

    try {
      await addDoc(collection(db, "wishes"), newWish);
      setWishForm({
        name: '',
        message: '',
        avatarColor: 'bg-amber-500'
      });
      triggerConfetti();
    } catch (err) {
      console.error("Error submitting wish to Firestore:", err);
    }
  };

  // --- CUSTOMIZER CONTROLLER ---
  const handleApplySettings = async () => {
    try {
      await setDoc(doc(db, "wedding", "settings"), tempSettings);
      setSettings(tempSettings);
      setIsPanelOpen(false);
      triggerConfetti();
    } catch (err) {
      console.error("Error applying settings to Firestore:", err);
    }
  };

  const handleResetSettings = async () => {
    const defaultSettings = {
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
      bgMusicUrl: 'https://www.chosic.com/wp-content/uploads/2021/07/In-love-again.mp3',
      customColorPrimary: '#5a7c54',
      customColorSecondary: '#b8953a'
    };
    try {
      await setDoc(doc(db, "wedding", "settings"), defaultSettings);
      setSettings(defaultSettings);
      setTempSettings(defaultSettings);
      setIsPanelOpen(false);
      triggerConfetti();
    } catch (err) {
      console.error("Error resetting settings in Firestore:", err);
    }
  };

  // --- GENERATE PERSONALIZED INVITATION SHAREABLE LINK ---
  const handleCopyLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const queryParams = new URLSearchParams();

    queryParams.append('bride', settings.brideName);
    queryParams.append('groom', settings.groomName);
    queryParams.append('date', settings.weddingDate);
    queryParams.append('venue', settings.venueName);
    queryParams.append('address', settings.venueAddress);
    queryParams.append('map', settings.venueGoogleLink);
    queryParams.append('theme', settings.theme);
    queryParams.append('img1', settings.coupleOutdoorImg);
    queryParams.append('img2', settings.couplePortraitImg);
    queryParams.append('music', settings.bgMusicUrl);
    
    if (personalizedGuest.trim()) {
      queryParams.append('guest', personalizedGuest);
    } else {
      queryParams.append('guest', settings.guestName);
    }

    const shareUrl = `${baseUrl}?${queryParams.toString()}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const currentTheme = themes[settings.theme] || themes.emerald;
  const isLight = settings.theme === 'goldLight' || settings.theme === 'flora';
  const brideInitial = settings.brideName && settings.brideName.trim() ? settings.brideName.trim().charAt(0) : 'B';
  const groomInitial = settings.groomName && settings.groomName.trim() ? settings.groomName.trim().charAt(0) : 'G';

  // Format Date beautifully
  const getFormattedDate = () => {
    try {
      const date = new Date(settings.weddingDate);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return "Monday, May 25, 2026";
    }
  };

  // Format Time beautifully
  const getFormattedTime = () => {
    try {
      const date = new Date(settings.weddingDate);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "03:30 PM";
    }
  };

  // SVG Premium Leaf Corner / Vine decoration
  const LeafCorner = ({ position = "top-left", className = "" }) => {
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
            {/* The main elegant branch trailing from the absolute corner (0,0) */}
            <path d="M0 0 C25 8, 50 35, 75 75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            
            {/* Organic, hand-crafted aesthetic leaves along the branch */}
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
  };

  // SVG Gold Floral / Nature Leafy Line Divider
  const GoldOrnament = ({ className = "h-8 w-auto text-amber-400" }) => {
    const isFlora = settings.theme === 'flora';
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
  };

  return (
    <div className={`scroll-snap-container bg-gradient-to-b ${currentTheme.bgGradient} ${currentTheme.text} font-sans relative transition-colors duration-1000`}>
      {/* Dynamic Custom Theme Style Override Injector */}
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
          onInteraction={() => {
            // Synchronously pre-play and pause both audios on the first touch gesture to unblock browser autoplay restrictions!
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
                  natureAudioRef.current.play().catch(e => console.log("Nature sound play failed:", e));
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

      {/* Floating & Falling Congratulations Gold Sparks & Hearts background layer */}
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

      {/* FLOATING ACTION UTILITIES (Music, Customizer Control, Scroll-To-Top) */}
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
            onClick={() => {
              setTempSettings({ ...settings });
              setIsPanelOpen(true);
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 hover:scale-110`}
            title="Customize Invitation / Manage RSVPs"
          >
            <i className="fa-solid fa-wand-magic-sparkles text-lg animate-pulse"></i>
          </button>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Luxury Golden Welcome Cover)                             */}
      {/* ========================================================================= */}
      <section className="scroll-snap-section relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 py-16 overflow-hidden">
        
        {/* Decorative Golden Floral Corners / Leafy Corner Frames */}
        {settings.theme === 'flora' ? (
          <>
            <LeafCorner position="top-left" className="animate-pulse-slow text-[#5A7C54]/30" />
            <LeafCorner position="top-right" className="animate-pulse-slow text-[#5A7C54]/30" />
            <LeafCorner position="bottom-left" className="animate-pulse-slow text-[#5A7C54]/30" />
            <LeafCorner position="bottom-right" className="animate-pulse-slow text-[#5A7C54]/30" />
          </>
        ) : (
          <>
            <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-amber-400/30 rounded-tl-3xl pointer-events-none hidden md:block"></div>
            <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-amber-400/30 rounded-tr-3xl pointer-events-none hidden md:block"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-amber-400/30 rounded-bl-3xl pointer-events-none hidden md:block"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-amber-400/30 rounded-br-3xl pointer-events-none hidden md:block"></div>
          </>
        )}

        {/* Floating Top Monogram Badge */}
        <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center shadow-lg mb-8 fade-in-up-1 relative group overflow-hidden ${
          settings.theme === 'flora' 
            ? 'border-[#5A7C54]/50 bg-white/70 shadow-[#5A7C54]/5' 
            : settings.theme === 'goldLight'
              ? 'border-[#b8953a]/50 bg-white/70 shadow-[#b8953a]/5'
              : 'border-amber-400/50 bg-stone-900/50 shadow-amber-400/10'
        }`}>
          <div className={`absolute inset-0 bg-gradient-to-tr opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            settings.theme === 'flora' 
              ? 'from-[#5A7C54]/10 via-transparent to-[#5A7C54]/10' 
              : settings.theme === 'goldLight'
                ? 'from-[#b8953a]/10 via-transparent to-[#b8953a]/10'
                : 'from-amber-500/10 via-transparent to-amber-500/10'
          }`}></div>
          <span className={`font-serif text-2xl font-bold tracking-widest ${
            settings.theme === 'flora' 
              ? 'text-[#5A7C54]' 
              : settings.theme === 'goldLight'
                ? 'text-[#b8953a]'
                : 'text-amber-400 animate-gold-glow'
          }`}>
            {brideInitial} & {groomInitial}
          </span>
        </div>

        {/* Invitation Text */}
        <p className={`font-serif text-sm md:text-base uppercase tracking-[0.3em] mb-4 fade-in-up-1 ${
          settings.theme === 'flora' ? 'text-[#5A7C54]/90' : settings.theme === 'goldLight' ? 'text-[#b8953a]/90' : 'text-amber-400/90'
        }`}>
          Save the Date
        </p>

        {/* Large Elegant Couple Names */}
        <div className="space-y-4 max-w-4xl px-4 select-none mb-6">
          <h1 className={`font-cursive text-7xl md:text-9xl leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] fade-in-up-2 ${
            settings.theme === 'flora' ? 'text-[#5A7C54]' : settings.theme === 'goldLight' ? 'text-[#b8953a]' : 'text-amber-400 animate-gold-glow'
          }`}>
            {settings.brideName}
          </h1>
          <div className="flex items-center justify-center gap-6 fade-in-up-3">
            <div className={`h-[1px] w-20 bg-gradient-to-r from-transparent ${
              settings.theme === 'flora' ? 'to-[#5A7C54]/40' : settings.theme === 'goldLight' ? 'to-[#b8953a]/40' : 'to-amber-400/40'
            }`}></div>
            <span className={`font-serif text-3xl md:text-4xl font-light ${
              settings.theme === 'flora' ? 'text-[#5A7C54]/90' : settings.theme === 'goldLight' ? 'text-[#b8953a]/90' : 'text-amber-200/90'
            }`}>&</span>
            <div className={`h-[1px] w-20 bg-gradient-to-l from-transparent ${
              settings.theme === 'flora' ? 'to-[#5A7C54]/40' : settings.theme === 'goldLight' ? 'to-[#b8953a]/40' : 'to-amber-400/40'
            }`}></div>
          </div>
          <h1 className={`font-cursive text-7xl md:text-9xl leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] fade-in-up-4 ${
            settings.theme === 'flora' ? 'text-[#5A7C54]' : settings.theme === 'goldLight' ? 'text-[#b8953a]' : 'text-amber-400 animate-gold-glow'
          }`}>
            {settings.groomName}
          </h1>
        </div>

        <GoldOrnament />

        {/* Wedding Date Display */}
        <div className="fade-in-up-5 space-y-3">
          <p className={`font-serif text-xl md:text-2xl tracking-wide font-light ${isLight ? 'text-stone-800' : 'text-amber-100/90'}`}>
            {getFormattedDate()}
          </p>
          <p className={`font-sans text-sm tracking-[0.2em] uppercase ${settings.theme === 'flora' ? 'text-[#5A7C54]' : settings.theme === 'goldLight' ? 'text-[#b8953a]' : 'text-amber-400/80'}`}>
            At {getFormattedTime()} • {settings.venueName}
          </p>
        </div>

        {/* Hero Quick Navigation CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-12 fade-in-up-6">
          <a
            href="#details"
            className={`px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:scale-105 ${currentTheme.btnBg}`}
          >
            Event Details
          </a>
          <a
            href="#rsvp"
            className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 hover:scale-105 ${currentTheme.btnAccent}`}
          >
            R.S.V.P. Now
          </a>
          <button
            onClick={() => {
              // Trigger Add to Calendar action
              const eventDateStr = settings.weddingDate.replace(/[-:]/g, '');
              const bride = settings.brideName && settings.brideName.trim() ? settings.brideName.trim() : 'Bride';
              const groom = settings.groomName && settings.groomName.trim() ? settings.groomName.trim() : 'Groom';
              const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(bride + ' & ' + groom + ' Wedding')}&dates=${eventDateStr}/${eventDateStr}&details=${encodeURIComponent('We invite you to celebrate our union!')}&location=${encodeURIComponent(settings.venueName + ', ' + settings.venueAddress)}`;
              window.open(calendarUrl, '_blank');
            }}
            className={`px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:scale-105 ${currentTheme.btnBg}`}
          >
            Add to Calendar
          </button>
        </div>

        {/* Elegant Breathing Scroll Down Arrow Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-amber-400/40 animate-bounce pointer-events-none">
          <span className="text-[10px] tracking-[0.2em] uppercase font-sans">Scroll Down</span>
          <i className="fa-solid fa-chevron-down text-sm"></i>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. PERSONALIZED GUEST INVITATION & POLAROIDS SECTION                       */}
      {/* ========================================================================= */}
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

          {/* RIGHT COLUMN: Polaroid Photo Overlap (Just like the user's reference image!) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center py-4 sm:py-8 relative min-h-[320px] xs:min-h-[380px] sm:min-h-[440px] md:min-h-[480px]">
            
            {/* Background Decorative Gold Ring graphic */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <i className="fa-solid fa-ring text-[200px] sm:text-[300px] text-amber-600 animate-pulse-slow"></i>
            </div>

            {/* Photo 1: Polaroid Frame tilted left */}
            <div className="absolute left-[2%] sm:left-[10%] md:left-[15%] top-2 sm:top-4 w-[45%] sm:w-64 md:w-72 bg-white p-2.5 sm:p-4 shadow-2xl rounded-sm rotate-[-8deg] hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 border border-stone-200 select-none group">
              <div className="relative overflow-hidden aspect-[4/5] bg-stone-100 rounded-sm">
                <img
                  src={settings.coupleOutdoorImg}
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
                  src={settings.couplePortraitImg}
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

      {/* ========================================================================= */}
      {/* 3. COUNTDOWN TO FOREVER TIMER SECTION                                     */}
      {/* ========================================================================= */}
      <section className={`scroll-snap-section relative min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 text-center bg-gradient-to-r ${currentTheme.bgGradient} border-b border-amber-500/10 overflow-hidden`}>
        
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,_var(--tw-gradient-stops)) from-amber-500/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        {settings.theme === 'flora' && (
          <>
            <LeafCorner position="top-right" className="opacity-45 text-[#5A7C54]/25" />
            <LeafCorner position="bottom-left" className="opacity-45 text-[#5A7C54]/25" />
          </>
        )}

        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-amber-400 font-semibold">
            The Golden Hour
          </p>

          {/* Countdown Header with elegant curved flourish */}
          <div className="space-y-4">
            <h2 className={`font-cursive text-5xl md:text-7xl leading-tight ${isLight ? 'text-stone-800' : 'text-amber-100'}`}>
              Counting Down to <span className={`${settings.theme === 'flora' ? 'text-[#5A7C54] decoration-[#5A7C54]/40' : 'text-amber-500 decoration-amber-500/40'} underline decoration-wavy decoration-1 underline-offset-8`}>Forever</span>
            </h2>
            <div className={`h-[1px] w-48 bg-gradient-to-r from-transparent ${settings.theme === 'flora' ? 'via-[#5A7C54]/40' : 'via-amber-400/40'} to-transparent mx-auto`}></div>
          </div>

          <p className={`font-sans text-sm md:text-base max-w-xl mx-auto leading-relaxed ${isLight ? 'text-stone-600' : 'text-amber-100/70'}`}>
            Every second brings us closer to the moment we walk down the aisle together. We cannot wait to share this beautiful milestone with you.
          </p>

          {/* TIMER DIGIT CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto pt-6 select-none">
            
            {/* Days */}
            <div className={`p-6 rounded-2xl backdrop-blur-md ${currentTheme.cardBg} transition-all duration-300 hover:scale-105 ${currentTheme.glow}`}>
              <span className={`block font-serif text-5xl md:text-6xl font-light tracking-wide animate-pulse-slow ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-500'}`}>
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className={`block text-xs uppercase tracking-widest font-semibold mt-3 ${isLight ? 'text-stone-500' : 'text-amber-200/50'}`}>
                Days
              </span>
            </div>

            {/* Hours */}
            <div className={`p-6 rounded-2xl backdrop-blur-md ${currentTheme.cardBg} transition-all duration-300 hover:scale-105 ${currentTheme.glow}`}>
              <span className={`block font-serif text-5xl md:text-6xl font-light tracking-wide ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-500'}`}>
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className={`block text-xs uppercase tracking-widest font-semibold mt-3 ${isLight ? 'text-stone-500' : 'text-amber-200/50'}`}>
                Hours
              </span>
            </div>

            {/* Minutes */}
            <div className={`p-6 rounded-2xl backdrop-blur-md ${currentTheme.cardBg} transition-all duration-300 hover:scale-105 ${currentTheme.glow}`}>
              <span className={`block font-serif text-5xl md:text-6xl font-light tracking-wide ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-500'}`}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className={`block text-xs uppercase tracking-widest font-semibold mt-3 ${isLight ? 'text-stone-500' : 'text-amber-200/50'}`}>
                Minutes
              </span>
            </div>

            {/* Seconds */}
            <div className={`p-6 rounded-2xl backdrop-blur-md ${currentTheme.cardBg} transition-all duration-300 hover:scale-105 ${currentTheme.glow}`}>
              <span className={`block font-serif text-5xl md:text-6xl font-light tracking-wide ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-500'}`}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className={`block text-xs uppercase tracking-widest font-semibold mt-3 ${isLight ? 'text-stone-500' : 'text-amber-200/50'}`}>
                Seconds
              </span>
            </div>

          </div>

          {/* Quick countdown footer */}
          <p className={`font-cursive text-2xl pt-4 ${settings.theme === 'flora' ? 'text-[#5A7C54]/95' : 'text-amber-400/90'}`}>
            ...until we say "I Do"
          </p>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. VENUE DETAILS & MAP SECTION                                            */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 5. RSVP FORM SECTION (Luxury Golden Card Frame)                           */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 6. BEST WISHES & GUEST BOOK BOARD SECTION                                 */}
      {/* ========================================================================= */}
      <section className="scroll-snap-section relative min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 bg-stone-100 text-stone-900 overflow-hidden">
        {settings.theme === 'flora' && (
          <>
            <LeafCorner position="top-right" className="opacity-45 text-[#5A7C54]/25" />
            <LeafCorner position="bottom-left" className="opacity-45 text-[#5A7C54]/25" />
          </>
        )}
        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="text-center space-y-4 mb-16">
            <span className={`font-serif text-sm uppercase tracking-[0.2em] font-semibold ${settings.theme === 'emerald' ? 'text-emerald-800' : settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-[#b8953a]'}`}>
              The Guest Book
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-800 font-medium">
              Best Wishes Wall
            </h2>
            <div className={`h-[2px] w-24 mx-auto ${settings.theme === 'flora' ? 'bg-[#5A7C54]' : 'bg-amber-500'}`}></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* LEFT COLUMN: Submit a Wish Form */}
            <div className="lg:col-span-1 bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-stone-200/50 space-y-6">
              
              <h3 className="font-serif text-xl font-semibold text-stone-800 border-b border-stone-100 pb-4">
                Leave Your Blessings
              </h3>

              <form onSubmit={handleWishSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-400 font-semibold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={wishForm.name}
                    onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                    className="block w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 bg-stone-50/50 text-sm"
                    placeholder="e.g. Aunt Malkanthi"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-400 font-semibold mb-2">
                    Your Blessing
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={wishForm.message}
                    onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                    className="block w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 bg-stone-50/50 text-sm resize-none"
                    placeholder="Write a sweet blessing for Niwarthana and Thenuka..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-900 hover:to-black text-white font-semibold text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  Post Wishing Card
                </button>

              </form>

            </div>

            {/* RIGHT COLUMN: Pinned Polaroid Wishes Board */}
            <div className="lg:col-span-2 relative min-h-[400px]">
              
              {wishes.length === 0 ? (
                
                <div className="bg-white border border-stone-200 p-8 rounded-3xl text-center space-y-4 shadow-xl">
                  <p className="font-sans text-stone-500">
                    No blessings have been posted yet. Be the first to leave a wish!
                  </p>
                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {wishes.map((w, idx) => (
                    
                    // Cute customized wishing boards with standard rotation tilts
                    <div
                      key={idx}
                      className={`p-6 bg-white border border-stone-200 shadow-lg rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-103 hover:z-10`}
                      style={{
                        transform: `rotate(${idx % 2 === 0 ? -1.5 : 1.5}deg)`
                      }}
                    >
                      <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-amber-500 to-amber-300"></div>
                      
                      {/* Pinned board needle badge */}
                      <div className="absolute top-4 right-4 text-amber-500/25">
                        <i className="fa-solid fa-thumbtack text-xl"></i>
                      </div>

                      <div className="space-y-4">
                        
                        <p className="font-cursive text-2xl text-amber-600 tracking-wide select-none pt-2">
                          "{w.message}"
                        </p>

                        <div className="flex items-center gap-3 border-t border-stone-100 pt-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${w.color ? w.color : 'bg-amber-100 text-amber-800'}`}>
                            {w.name ? w.name.charAt(0) : 'W'}
                          </div>
                          <div>
                            <p className="font-serif text-sm font-semibold text-stone-800">
                              {w.name}
                            </p>
                            <p className="font-sans text-[10px] text-stone-400">
                              {w.date || 'Just now'}
                            </p>
                          </div>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>

              )}

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 7. FOOTER SECTION                                                         */}
      {/* ========================================================================= */}
      <footer className={`scroll-snap-section relative min-h-screen flex flex-col justify-center py-16 px-4 md:px-8 text-center bg-gradient-to-b ${currentTheme.bgGradient} border-t border-amber-500/10 overflow-hidden`}>
        {settings.theme === 'flora' && (
          <>
            <LeafCorner position="top-left" className="opacity-45 text-[#5A7C54]/25" />
            <LeafCorner position="top-right" className="opacity-45 text-[#5A7C54]/25" />
          </>
        )}
        {/* Soft Background Double Interlocking Golden Wedding Rings / Large Leafy Wreath */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
          {settings.theme === 'flora' ? (
            <svg className="w-80 h-80 text-[#5A7C54]/15 animate-pulse-slow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M45 80 C20 70, 20 30, 45 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
              <circle cx="30" cy="50" r="3" fill="currentColor"/>
              <circle cx="34" cy="38" r="3" fill="currentColor"/>
              <circle cx="34" cy="62" r="3" fill="currentColor"/>
              <circle cx="41" cy="27" r="3" fill="currentColor"/>
              <circle cx="41" cy="73" r="3" fill="currentColor"/>
              <path d="M55 80 C80 70, 80 30, 55 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
              <circle cx="70" cy="50" r="3" fill="currentColor"/>
              <circle cx="66" cy="38" r="3" fill="currentColor"/>
              <circle cx="66" cy="62" r="3" fill="currentColor"/>
              <circle cx="59" cy="27" r="3" fill="currentColor"/>
              <circle cx="59" cy="73" r="3" fill="currentColor"/>
            </svg>
          ) : (
            <div className="relative w-64 h-64 flex items-center justify-center">
              <i className="fa-solid fa-ring text-[180px] text-amber-500/15 absolute -translate-x-12 rotate-[-12deg] animate-pulse-slow"></i>
              <i className="fa-solid fa-ring text-[180px] text-amber-500/15 absolute translate-x-12 rotate-[12deg] animate-pulse-slow"></i>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-8 select-none flex flex-col items-center justify-center">
          
          {/* Regal Interlocking Gold Monogram Emblem / Wax Seal */}
          <div className={`w-28 h-28 rounded-full border-4 border-double flex items-center justify-center bg-stone-950/20 shadow-2xl group hover:scale-105 transition-all duration-500 relative ${settings.theme === 'flora' ? 'border-[#5A7C54]/40 hover:border-[#5A7C54] shadow-[#5A7C54]/5' : 'border-amber-500/40 hover:border-amber-400 shadow-amber-500/5'}`}>
            <div className={`absolute inset-1 rounded-full border animate-spin-slow ${settings.theme === 'flora' ? 'border-[#5A7C54]/20' : 'border-amber-500/20'}`}></div>
            <span className={`font-serif text-3xl font-extrabold tracking-widest drop-shadow-md select-none ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-400'}`}>
              {settings.brideName ? settings.brideName.charAt(0) : 'B'}&{settings.groomName ? settings.groomName.charAt(0) : 'G'}
            </span>
          </div>

          <div className="space-y-4">
            <h2 className={`font-cursive text-6xl md:text-7xl leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] ${settings.theme === 'flora' ? 'text-[#5A7C54]' : 'text-amber-400 animate-gold-glow'}`}>
              {settings.brideName || 'Bride'} & {settings.groomName || 'Groom'}
            </h2>
            <div className={`h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent ${settings.theme === 'flora' ? 'via-[#5A7C54]/40' : 'via-amber-500/40'} to-transparent`}></div>
          </div>

          <div className="space-y-3 max-w-lg">
            <p className={`font-pinyon text-3xl italic tracking-wider ${settings.theme === 'flora' ? 'text-[#5A7C54]/90' : 'text-amber-500/90'}`}>
              "Forever begins today..."
            </p>
            <p className={`font-serif text-sm tracking-[0.15em] uppercase leading-relaxed ${isLight ? 'text-stone-700' : 'text-amber-100/70'}`}>
              Thank you for being a part of our beautiful beginning and sharing in our celebration of love.
            </p>
          </div>

          {/* Elegant Leafy Vector Divider */}
          <div className="flex items-center justify-center gap-3 py-2">
            <div className={`h-[1px] w-12 bg-gradient-to-r from-transparent ${settings.theme === 'flora' ? 'via-[#5A7C54]/30' : 'via-amber-500/30'} to-transparent`}></div>
            <i className={`fa-solid fa-leaf text-xs ${settings.theme === 'flora' ? 'text-[#5A7C54]/60' : 'text-amber-500/40'}`}></i>
            <div className={`h-[1px] w-12 bg-gradient-to-l from-transparent ${settings.theme === 'flora' ? 'via-[#5A7C54]/30' : 'via-amber-500/30'} to-transparent`}></div>
          </div>

          {/* Navigation link triggers inside footer */}
          <div className="flex justify-center gap-6 text-xs uppercase tracking-widest font-semibold pb-4">
            <a href="#invitation" className={`transition-colors duration-300 ${settings.theme === 'flora' ? 'hover:text-[#5A7C54]/80 text-stone-500' : isLight ? 'hover:text-amber-500 text-stone-500' : 'hover:text-amber-500 text-stone-400'}`}>Welcome</a>
            <a href="#details" className={`transition-colors duration-300 ${settings.theme === 'flora' ? 'hover:text-[#5A7C54]/80 text-stone-500' : isLight ? 'hover:text-amber-500 text-stone-500' : 'hover:text-amber-500 text-stone-400'}`}>Venue</a>
            <a href="#rsvp" className={`transition-colors duration-300 ${settings.theme === 'flora' ? 'hover:text-[#5A7C54]/80 text-stone-500' : isLight ? 'hover:text-amber-500 text-stone-500' : 'hover:text-amber-500 text-stone-400'}`}>R.S.V.P.</a>
          </div>

          <p className={`font-sans text-[10px] uppercase tracking-[0.2em] pt-4 border-t w-full ${settings.theme === 'flora' ? 'border-[#5A7C54]/10 text-stone-400' : 'border-amber-500/10 text-amber-100/30'} ${isLight ? 'text-stone-400' : 'text-amber-100/30'}`}>
            © 2026 Digital Invitation • Designed with Pure Elegance
          </p>

        </div>

      </footer>

      {/* ========================================================================= */}
      {/* 8. SLIDING CONTROL PANEL (REAL-TIME LIVE WEDDING invitation SETTINGS)     */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* ADMIN AUTHENTICATION DIALOG (GLASSMORPHIC GOLD PIN LOCK)                 */}
      {/* ========================================================================= */}
      {isAdminRoute && !isAdminAuthenticated && (
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
            <form 
              onSubmit={(e) => {
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
              }}
              className="space-y-4"
            >
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
      )}

      {/* ========================================================================= */}
      {/* 8. SLIDING CONTROL PANEL (REAL-TIME LIVE WEDDING INVITATION SETTINGS)     */}
      {/* ========================================================================= */}
      {isAdminRoute && isAdminAuthenticated && (
        <div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-stone-900 border-l border-stone-800 text-stone-200 z-50 shadow-2xl transition-transform duration-500 ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            
            {/* Customizer Header */}
            <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-stone-950 shadow-lg">
                  <i className="fa-solid fa-gears text-lg"></i>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                    Invitation Studio
                  </h3>
                  <p className="font-sans text-[10px] text-stone-400 uppercase tracking-widest">
                    Live Customizer & RSVPs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="w-10 h-10 rounded-full border border-stone-800 hover:border-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* TAB LINKS BAR */}
            <div className="grid grid-cols-4 border-b border-stone-800 text-xs uppercase tracking-widest font-semibold text-center select-none bg-stone-900/50">
              {[
                { id: 'info', icon: 'fa-user-pen', label: 'Couples' },
                { id: 'date', icon: 'fa-calendar-day', label: 'Venue' },
                { id: 'theme', icon: 'fa-palette', label: 'Design' },
                { id: 'rsvps', icon: 'fa-envelope-open-text', label: `RSVPs (${rsvps.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 flex flex-col items-center gap-1 transition-colors border-b-2 ${activeTab === tab.id ? 'border-amber-400 text-amber-400 bg-stone-800/30' : 'border-transparent text-stone-400 hover:text-white'}`}
                >
                  <i className={`fa-solid ${tab.icon} text-base`}></i>
                  <span className="text-[9px] mt-1">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB CONTENT (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-stone-950/20">
              
              {/* TAB A: Couple Personal Details */}
              {activeTab === 'info' && (
                <div className="space-y-5 animate-fade-in">
                  
                  <h4 className="font-serif text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800 pb-2">
                    Couple Information
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">
                        Bride Name
                      </label>
                      <input
                        type="text"
                        value={tempSettings.brideName}
                        onChange={(e) => setTempSettings({ ...tempSettings, brideName: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-2 text-stone-100 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">
                        Groom Name
                      </label>
                      <input
                        type="text"
                        value={tempSettings.groomName}
                        onChange={(e) => setTempSettings({ ...tempSettings, groomName: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-2 text-stone-100 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <h4 className="font-serif text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800 pb-2 pt-2">
                    Personalized Guest Link Generator
                  </h4>

                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    Type a guest name below to generate a highly customized shareable invitation link specifically for them!
                  </p>

                  <div className="space-y-4 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">
                        Individual Guest Name
                      </label>
                      <input
                        type="text"
                        value={personalizedGuest}
                        onChange={(e) => setPersonalizedGuest(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-2 text-amber-300 placeholder-stone-600 text-sm font-semibold focus:outline-none"
                        placeholder="e.g. Mr. & Mrs. Jayasekara"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-copy"></i>
                      {copiedLink ? "Link Copied!" : "Copy Guest Link"}
                    </button>
                    {copiedLink && (
                      <span className="block text-center text-[10px] text-emerald-400 font-medium">
                        ✓ Share this copied link directly with this guest!
                      </span>
                    )}
                  </div>

                </div>
              )}

              {/* TAB B: Venue & Schedule Details */}
              {activeTab === 'date' && (
                <div className="space-y-5 animate-fade-in">
                  
                  <h4 className="font-serif text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800 pb-2">
                    Venue & Schedule Details
                  </h4>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">
                      Wedding Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={tempSettings.weddingDate.substring(0, 16)}
                      onChange={(e) => setTempSettings({ ...tempSettings, weddingDate: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-2 text-stone-100 text-sm focus:outline-none"
                    />
                    <span className="block text-[9px] text-stone-500 mt-1">
                      * The countdown timer recalculates automatically in real time!
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      value={tempSettings.venueName}
                      onChange={(e) => setTempSettings({ ...tempSettings, venueName: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-2 text-stone-100 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">
                      Venue Address
                    </label>
                    <input
                      type="text"
                      value={tempSettings.venueAddress}
                      onChange={(e) => setTempSettings({ ...tempSettings, venueAddress: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-2 text-stone-100 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">
                      Google Maps Navigation Link
                    </label>
                    <input
                      type="url"
                      value={tempSettings.venueGoogleLink}
                      onChange={(e) => setTempSettings({ ...tempSettings, venueGoogleLink: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-2 text-stone-100 text-xs focus:outline-none"
                    />
                  </div>

                </div>
              )}

              {/* TAB C: Themes & Custom Background Music/Images */}
              {activeTab === 'theme' && (
                <div className="space-y-5 animate-fade-in">
                  
                  <h4 className="font-serif text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800 pb-2">
                    Select Design Theme Colors
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(themes).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setTempSettings({ ...tempSettings, theme: key })}
                        className={`p-3 rounded-xl border text-left transition-all duration-300 flex flex-col gap-1 ${tempSettings.theme === key ? 'bg-stone-800 border-amber-400 shadow-md shadow-amber-400/5' : 'border-stone-800 hover:bg-stone-900/60 text-stone-400'}`}
                      >
                        <span className="text-xs font-bold text-white">{value.name}</span>
                        <div className="flex gap-1.5 mt-1">
                          <div className="w-3.5 h-3.5 rounded-full border border-stone-700/60" style={{
                            backgroundColor: key === 'goldLight' ? '#f7f4eb' :
                                            key === 'goldDark' ? '#1c1917' :
                                            key === 'emerald' ? '#064e3b' :
                                            key === 'crimson' ? '#4c0519' :
                                            key === 'sapphire' ? '#172554' :
                                            key === 'flora' ? '#E8ECE7' :
                                            key === 'custom' ? (tempSettings.customColorPrimary || '#5a7c54') : '#500724'
                          }}></div>
                          <div className="w-3.5 h-3.5 rounded-full" style={{
                            backgroundColor: key === 'goldLight' ? '#b8953a' :
                                            key === 'goldDark' ? '#e5c158' :
                                            key === 'emerald' ? '#fbbf24' :
                                            key === 'crimson' ? '#facc15' :
                                            key === 'sapphire' ? '#fde047' :
                                            key === 'flora' ? '#5A7C54' :
                                            key === 'custom' ? (tempSettings.customColorSecondary || '#b8953a') : '#f472b6'
                          }}></div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Color Palette Color Pickers */}
                  {tempSettings.theme === 'custom' && (
                    <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-4 animate-fade-in">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        🎨 Select Custom Colors
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-stone-400 font-semibold mb-1.5">
                            Primary Color
                          </label>
                          <div className="flex items-center gap-2 bg-stone-900 p-2 rounded-xl border border-stone-800">
                            <input
                              type="color"
                              value={tempSettings.customColorPrimary || '#5a7c54'}
                              onChange={(e) => setTempSettings({ ...tempSettings, customColorPrimary: e.target.value })}
                              className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                            />
                            <span className="text-[10px] font-mono uppercase text-stone-300">
                              {tempSettings.customColorPrimary || '#5a7c54'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-stone-400 font-semibold mb-1.5">
                            Accent Color
                          </label>
                          <div className="flex items-center gap-2 bg-stone-900 p-2 rounded-xl border border-stone-800">
                            <input
                              type="color"
                              value={tempSettings.customColorSecondary || '#b8953a'}
                              onChange={(e) => setTempSettings({ ...tempSettings, customColorSecondary: e.target.value })}
                              className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                            />
                            <span className="text-[10px] font-mono uppercase text-stone-300">
                              {tempSettings.customColorSecondary || '#b8953a'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="block text-[8px] text-stone-500 text-center leading-relaxed">
                        * Custom theme dynamically applies your selected colors across all UI highlights and buttons!
                      </span>
                    </div>
                  )}

                  <h4 className="font-serif text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800 pb-2 pt-2">
                    Media & Background Audio Customization
                  </h4>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">
                      Couple Image 1 (Outdoor Polaroid) URL
                    </label>
                    <input
                      type="text"
                      value={tempSettings.coupleOutdoorImg}
                      onChange={(e) => setTempSettings({ ...tempSettings, coupleOutdoorImg: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-2 text-stone-200 text-xs focus:outline-none"
                    />
                    <span className="block text-[9px] text-stone-500 mt-1">
                      * You can paste any high-quality image URL or leave it as default.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">
                      Couple Image 2 (Portrait Polaroid) URL
                    </label>
                    <input
                      type="text"
                      value={tempSettings.couplePortraitImg}
                      onChange={(e) => setTempSettings({ ...tempSettings, couplePortraitImg: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-2 text-stone-200 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">
                      Background Instrumental Music MP3 URL
                    </label>
                    <input
                      type="text"
                      value={tempSettings.bgMusicUrl}
                      onChange={(e) => setTempSettings({ ...tempSettings, bgMusicUrl: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-2 text-stone-200 text-xs focus:outline-none"
                    />
                    <span className="block text-[9px] text-stone-500 mt-1">
                      * Supports custom royalty-free MP3 URLs to personalize the music atmosphere.
                    </span>
                  </div>

                </div>
              )}

              {/* TAB D: host Admin RSVP Tracker */}
              {activeTab === 'rsvps' && (
                <div className="space-y-4 animate-fade-in text-stone-200">
                  
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <h4 className="font-serif text-sm font-bold text-amber-400 uppercase tracking-wider">
                      RSVPs Tracker
                    </h4>
                    <button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to clear all RSVPs?")) {
                          try {
                            const querySnapshot = await getDocs(collection(db, "rsvps"));
                            const deletePromises = [];
                            querySnapshot.forEach((docSnap) => {
                              deletePromises.push(deleteDoc(doc(db, "rsvps", docSnap.id)));
                            });
                            await Promise.all(deletePromises);
                            setRsvps([]);
                          } catch (err) {
                            console.error("Failed to clear RSVPs in Firestore:", err);
                          }
                        }
                      }}
                      className="text-[9px] font-semibold uppercase tracking-widest text-red-500 hover:text-red-400"
                    >
                      Clear All
                    </button>
                  </div>

                  {rsvps.length === 0 ? (
                    
                    <div className="text-center py-10 bg-stone-900/40 rounded-2xl border border-stone-800">
                      <p className="text-xs text-stone-500">
                        No RSVPs have been submitted yet. Responses will show up here live!
                      </p>
                    </div>

                  ) : (

                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                      {rsvps.map(r => (
                        <div
                          key={r.id}
                          className={`p-4 bg-stone-900 border ${r.attendance === 'attending' ? 'border-emerald-900/60' : 'border-rose-900/60'} rounded-xl space-y-2`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-serif text-sm font-semibold text-white block">
                                {r.name}
                              </span>
                              <span className="text-[10px] text-stone-500">
                                {r.dateString}
                              </span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${r.attendance === 'attending' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                              {r.attendance === 'attending' ? 'Attending' : 'Declined'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-400 pt-1 border-t border-stone-800/40">
                            <div>
                              <i className="fa-solid fa-users text-stone-600 mr-1.5"></i>
                              {r.guestsCount} Guests
                            </div>
                            <div>
                              <i className="fa-solid fa-phone text-stone-600 mr-1.5"></i>
                              {r.phone}
                            </div>
                          </div>

                          {r.message && (
                            <p className="text-xs text-amber-300/80 italic bg-stone-950/40 p-2 rounded-lg mt-1 select-none">
                              "{r.message}"
                            </p>
                          )}

                        </div>
                      ))}
                    </div>

                  )}

                </div>
              )}

            </div>

            {/* Settings Actions Footer (Only visible on non-RSVP tabs) */}
            {activeTab !== 'rsvps' && (
              <div className="p-6 border-t border-stone-800 bg-stone-950 grid grid-cols-2 gap-4">
                
                <button
                  onClick={handleResetSettings}
                  className="w-full py-3 rounded-xl border border-stone-800 hover:border-stone-700 font-semibold text-xs uppercase tracking-widest text-stone-400 hover:text-white transition-colors"
                >
                  Reset Default
                </button>

                <button
                  onClick={handleApplySettings}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-500/10 transition-transform duration-300 hover:scale-[1.02]"
                >
                  Apply Changes
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
