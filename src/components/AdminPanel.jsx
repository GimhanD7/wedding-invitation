import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, collection, onSnapshot, getDocs, deleteDoc } from 'firebase/firestore';

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
  bgMusicUrl: 'https://archive.org/download/jamendo-375578/01-1628418-DHDMusic-Wedding%20Piano.mp3',
  customColorPrimary: '#5a7c54',
  customColorSecondary: '#b8953a'
};

export default function AdminPanel({ isPanelOpen, setIsPanelOpen, settings, themes, triggerConfetti }) {
  const [activeTab, setActiveTab] = useState('info');
  const [tempSettings, setTempSettings] = useState({ ...settings });
  const [personalizedGuest, setPersonalizedGuest] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [wishes, setWishes] = useState([]);
  const [editingWishId, setEditingWishId] = useState(null);
  const [editWishForm, setEditWishForm] = useState({ name: '', message: '' });

  // Load current settings into tempSettings when they change or drawer opens
  useEffect(() => {
    if (isPanelOpen) {
      setTempSettings({ ...settings });
    }
  }, [settings, isPanelOpen]);

  // Subscribe to RSVPs for admin view
  useEffect(() => {
    if (!isPanelOpen) return;
    const unsubRsvps = onSnapshot(collection(db, "rsvps"), (snapshot) => {
      const rsvpList = [];
      snapshot.forEach((doc) => {
        rsvpList.push({ id: doc.id, ...doc.data() });
      });
      setRsvps(rsvpList);
    });

    return () => {
      unsubRsvps();
    };
  }, [isPanelOpen]);

  // Subscribe to Wishes for admin view
  useEffect(() => {
    if (!isPanelOpen) return;
    const unsubWishes = onSnapshot(collection(db, "wishes"), (snapshot) => {
      const wishesList = [];
      snapshot.forEach((doc) => {
        wishesList.push({ id: doc.id, ...doc.data() });
      });
      setWishes(wishesList);
    });

    return () => {
      unsubWishes();
    };
  }, [isPanelOpen]);

  const handleDeleteWish = async (wishId) => {
    if (window.confirm("Are you sure you want to delete this wish?")) {
      try {
        await deleteDoc(doc(db, "wishes", wishId));
      } catch (err) {
        console.error("Failed to delete wish:", err);
      }
    }
  };

  const handleStartEditWish = (wish) => {
    setEditingWishId(wish.id);
    setEditWishForm({ name: wish.name, message: wish.message });
  };

  const handleSaveWish = async (wishId) => {
    try {
      const wishRef = doc(db, "wishes", wishId);
      await setDoc(wishRef, {
        name: editWishForm.name,
        message: editWishForm.message
      }, { merge: true });
      setEditingWishId(null);
    } catch (err) {
      console.error("Failed to update wish:", err);
    }
  };

  const handleApplySettings = async () => {
    try {
      const settingsDocRef = doc(db, "wedding", "settings");
      await setDoc(settingsDocRef, tempSettings);
      setIsPanelOpen(false);
      triggerConfetti();
    } catch (e) {
      console.error("Error updating settings in Firestore: ", e);
    }
  };

  const handleResetSettings = async () => {
    if (window.confirm("Are you sure you want to reset settings to default values?")) {
      try {
        const settingsDocRef = doc(db, "wedding", "settings");
        await setDoc(settingsDocRef, defaultSettings);
        setTempSettings({ ...defaultSettings });
        setIsPanelOpen(false);
      } catch (e) {
        console.error("Error resetting settings in Firestore: ", e);
      }
    }
  };

  const handleCopyLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const cleanGuest = personalizedGuest.trim();
    const guestParam = encodeURIComponent(cleanGuest);
    const finalUrl = cleanGuest ? `${baseUrl}?guest=${guestParam}` : baseUrl;
    
    navigator.clipboard.writeText(finalUrl)
      .then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      })
      .catch(err => console.log("Copy link failed: ", err));
  };

  if (!isPanelOpen) return null;

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-stone-900 border-l border-stone-800 text-stone-200 z-50 shadow-2xl transition-transform duration-500`}>
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
        <div className="grid grid-cols-5 border-b border-stone-800 text-[8px] sm:text-[9px] uppercase tracking-widest font-semibold text-center select-none bg-stone-900/50">
          {[
            { id: 'info', icon: 'fa-user-pen', label: 'Couples' },
            { id: 'date', icon: 'fa-calendar-day', label: 'Venue' },
            { id: 'theme', icon: 'fa-palette', label: 'Design' },
            { id: 'rsvps', icon: 'fa-envelope-open-text', label: `RSVPs (${rsvps.length})` },
            { id: 'wishes', icon: 'fa-comment-dots', label: `Wishes (${wishes.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 flex flex-col items-center gap-1 transition-colors border-b-2 ${activeTab === tab.id ? 'border-amber-400 text-amber-400 bg-stone-800/30' : 'border-transparent text-stone-400 hover:text-white'}`}
            >
              <i className={`fa-solid ${tab.icon} text-sm sm:text-base`}></i>
              <span className="text-[7px] sm:text-[9px] mt-1">{tab.label}</span>
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

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-2">
                  Loading Screen Door Background Image URL
                </label>
                <input
                  type="text"
                  value={tempSettings.loadingBgImg || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, loadingBgImg: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-2 text-stone-200 text-xs focus:outline-none"
                  placeholder="e.g. https://images.unsplash.com/... or a golden floral texture"
                />
                <span className="block text-[9px] text-stone-500 mt-1">
                  * Splits the custom high-quality image perfectly down the center seam of the double doors!
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

          {/* TAB E: Admin Wishes Management */}
          {activeTab === 'wishes' && (
            <div className="space-y-4 animate-fade-in text-stone-200">
              
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h4 className="font-serif text-sm font-bold text-amber-400 uppercase tracking-wider">
                  Wishes Management
                </h4>
                <span className="text-[10px] text-stone-400 font-semibold uppercase">
                  {wishes.length} Submissions
                </span>
              </div>

              {wishes.length === 0 ? (
                <div className="text-center py-10 bg-stone-900/40 rounded-2xl border border-stone-800">
                  <p className="text-xs text-stone-500">
                    No wishes have been submitted yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                  {wishes.map(w => (
                    <div
                      key={w.id}
                      className="p-4 bg-stone-900 border border-stone-800 rounded-xl space-y-3"
                    >
                      {editingWishId === w.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] uppercase tracking-widest text-stone-400 font-semibold mb-1">
                              Guest Name
                            </label>
                            <input
                              type="text"
                              value={editWishForm.name}
                              onChange={(e) => setEditWishForm({ ...editWishForm, name: e.target.value })}
                              className="w-full bg-stone-950 border border-stone-850 rounded-lg px-2.5 py-1.5 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-widest text-stone-400 font-semibold mb-1">
                              Blessing Message
                            </label>
                            <textarea
                              rows="3"
                              value={editWishForm.message}
                              onChange={(e) => setEditWishForm({ ...editWishForm, message: e.target.value })}
                              className="w-full bg-stone-950 border border-stone-850 rounded-lg px-2.5 py-1.5 text-stone-100 text-xs focus:outline-none focus:border-amber-500 resize-none"
                            />
                          </div>
                          <div className="flex gap-2 justify-end pt-1">
                            <button
                              onClick={() => setEditingWishId(null)}
                              className="px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border border-stone-700 text-stone-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveWish(w.id)}
                              className="px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-amber-500 hover:bg-amber-600 text-stone-950"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-serif text-sm font-semibold text-white block">
                                {w.name}
                              </span>
                              <span className="text-[9px] text-stone-500 block">
                                {w.timestamp?.seconds ? new Date(w.timestamp.seconds * 1000).toLocaleDateString() : 'Today'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleStartEditWish(w)}
                                className="w-7 h-7 rounded-lg bg-stone-850 hover:bg-stone-800 flex items-center justify-center text-amber-400 transition-colors"
                                title="Edit Wish"
                              >
                                <i className="fa-solid fa-pencil text-[10px]"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteWish(w.id)}
                                className="w-7 h-7 rounded-lg bg-stone-855 hover:bg-stone-800 flex items-center justify-center text-red-400 transition-colors"
                                title="Delete Wish"
                              >
                                <i className="fa-solid fa-trash text-[10px]"></i>
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-amber-300/80 italic bg-stone-950/40 p-2.5 rounded-lg">
                            "{w.message}"
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Settings Actions Footer (Only visible on non-RSVP/non-Wishes tabs) */}
        {activeTab !== 'rsvps' && activeTab !== 'wishes' && (
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
  );
}
