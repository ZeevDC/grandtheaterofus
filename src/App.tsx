import React, { useState, useEffect } from 'react';
import { APP_DATA } from './data';
import { playSound, toggleSound, isSoundEnabled } from './audio';
import { PetalCanvas, fireRoyalConfetti } from './components/PetalCanvas';
import { ImperialGate } from './components/ImperialGate';
import { VisualNovelIntro } from './components/VisualNovelIntro';
import { LettersSection } from './components/LettersSection';
import { PhotoFrames } from './components/PhotoFrames';
import { GamesSection } from './components/GamesSection';
import { ScratchCard } from './components/ScratchCard';
import {
  Heart,
  Music,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Plus,
  Check,
  Sparkles,
  Ticket,
  ChevronDown,
  Clock,
  Calendar,
  Lock,
  Crown
} from 'lucide-react';

export default function App() {
  // App Phase: 'gate' | 'vn' | 'theatre'
  const [phase, setPhase] = useState<'gate' | 'vn' | 'theatre'>(() => {
    try {
      const savedUnlocked = sessionStorage.getItem('gtou_unlocked');
      return savedUnlocked === 'true' ? 'theatre' : 'gate';
    } catch {
      return 'gate';
    }
  });

  // Dark / Light Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('gtou_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('gtou_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    playSound('tap');
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sound toggle state
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
    if (next) playSound('tap');
  };

  // Global particle burst trigger count
  const [burstCount, setBurstCount] = useState(0);
  const triggerBurst = () => setBurstCount((c) => c + 1);

  // Countdown timer calculations
  const [daysTogether, setDaysTogether] = useState<string>('idk');
  const [daysRemaining, setDaysRemaining] = useState<number | string>(0);
  const [countdownLabel, setCountdownLabel] = useState<string>(APP_DATA.nextLabel);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const start = new Date(APP_DATA.startDate + 'T00:00:00');
      setDaysTogether('idk');

      const next = new Date(APP_DATA.nextDate + 'T00:00:00');
      const left = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (left > 0) {
        setDaysRemaining(left);
        setCountdownLabel(APP_DATA.nextLabel);
      } else {
        setDaysRemaining('Today');
        setCountdownLabel('is the glorious day!');
      }
    };
    calc();
    const timer = setInterval(calc, 60000);
    return () => clearInterval(timer);
  }, []);

  // Reasons drawer state
  const [currentReason, setCurrentReason] = useState<string | null>(null);
  const [seenReasons, setSeenReasons] = useState<number[]>([]);

  const handleDrawReason = () => {
    const unpicked = APP_DATA.reasons
      .map((_, i) => i)
      .filter((i) => !seenReasons.includes(i));

    let chosenIdx: number;
    if (unpicked.length > 0) {
      chosenIdx = unpicked[Math.floor(Math.random() * unpicked.length)];
    } else {
      chosenIdx = Math.floor(Math.random() * APP_DATA.reasons.length);
    }

    setCurrentReason(APP_DATA.reasons[chosenIdx]);
    setSeenReasons((prev) => {
      if (!prev.includes(chosenIdx)) {
        const next = [...prev, chosenIdx];
        if (next.length === APP_DATA.reasons.length) {
          playSound('fanfare');
          triggerBurst();
        } else {
          playSound('chime');
        }
        return next;
      }
      playSound('tap');
      return prev;
    });
  };

  // Coupons state (saved in localStorage)
  const [redeemedCoupons, setRedeemedCoupons] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('gtou_coupons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleRedeemCoupon = (idx: number) => {
    if (redeemedCoupons.includes(idx)) return;
    const next = [...redeemedCoupons, idx];
    setRedeemedCoupons(next);
    try {
      localStorage.setItem('gtou_coupons', JSON.stringify(next));
    } catch {
      // ignore
    }
    playSound('seal');
    triggerBurst();
  };

  // Open When Accordions
  const [openWhenIndex, setOpenWhenIndex] = useState<number | null>(null);
  const handleToggleOpenWhen = (idx: number) => {
    playSound('tap');
    setOpenWhenIndex((prev) => (prev === idx ? null : idx));
  };

  // Bucket list state
  const [bucketItems, setBucketItems] = useState<{ t: string; d: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem('gtou_bucket');
      return saved ? JSON.parse(saved) : APP_DATA.bucket.map((t) => ({ t, d: false }));
    } catch {
      return APP_DATA.bucket.map((t) => ({ t, d: false }));
    }
  });
  const [newBucketText, setNewBucketText] = useState('');

  const handleToggleBucket = (idx: number) => {
    const next = [...bucketItems];
    next[idx].d = !next[idx].d;
    setBucketItems(next);
    try {
      localStorage.setItem('gtou_bucket', JSON.stringify(next));
    } catch {
      // ignore
    }
    if (next[idx].d) {
      playSound('chime');
      triggerBurst();
    } else {
      playSound('tap');
    }
  };

  const handleAddBucket = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newBucketText.trim();
    if (!val) return;
    const next = [...bucketItems, { t: val, d: false }];
    setBucketItems(next);
    try {
      localStorage.setItem('gtou_bucket', JSON.stringify(next));
    } catch {
      // ignore
    }
    setNewBucketText('');
    playSound('tap');
  };

  // Handlers for phase transitions
  const handleUnlockGate = () => {
    setPhase('vn');
  };

  const handleCompleteVN = () => {
    try {
      sessionStorage.setItem('gtou_unlocked', 'true');
    } catch {
      // ignore
    }
    setPhase('theatre');
    triggerBurst();
    playSound('fanfare');
  };

  const handleRelockGate = () => {
    try {
      sessionStorage.removeItem('gtou_unlocked');
    } catch {
      // ignore
    }
    setPhase('gate');
    playSound('tap');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 relative selection:bg-[#f4d98a] selection:text-[#3a1018]">
      {/* Falling Rose & Golden Petals Canvas */}
      <PetalCanvas burstTrigger={burstCount} />

      {/* PHASE 1: IMPERIAL GATE */}
      {phase === 'gate' && (
        <ImperialGate
          toName={APP_DATA.toName}
          hint={APP_DATA.hint}
          correctPassword={APP_DATA.password}
          onUnlocked={handleUnlockGate}
        />
      )}

      {/* PHASE 2: VISUAL NOVEL INTRO */}
      {phase === 'vn' && (
        <VisualNovelIntro
          fromName={APP_DATA.fromName}
          toName={APP_DATA.toName}
          dialogueLines={APP_DATA.vn}
          onComplete={handleCompleteVN}
        />
      )}

      {/* PHASE 3: THE MAIN GRAND THEATRE */}
      {phase === 'theatre' && (
        <div className="flex flex-col min-h-screen">
          {/* TOP CONTROLS & FLOATING BAR */}
          <header className="sticky top-0 z-40 bg-[var(--surface)]/90 backdrop-blur-md border-b-2 border-[var(--line)] shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
              {/* Brand Title */}
              <a
                href="#top"
                className="flex items-center gap-2 group font-display font-bold text-sm sm:text-base text-[var(--accent)] tracking-wide hover:opacity-90"
              >
                <Crown className="w-5 h-5 text-[var(--gold)] flex-shrink-0" />
                <span className="hidden sm:inline">The Grand Theatre of Us</span>
                <span className="sm:hidden">The Grand Theatre</span>
              </a>

              {/* Utility actions: Sound, Theme, Relock */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className="p-2 rounded-full border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)] hover:border-[var(--accent)] transition-all shadow-sm active:scale-95"
                  title={soundOn ? 'Mute royal audio' : 'Enable royal audio'}
                  aria-label={soundOn ? 'Mute royal audio' : 'Enable royal audio'}
                >
                  {soundOn ? <Volume2 className="w-4 h-4 text-[var(--gold)]" /> : <VolumeX className="w-4 h-4 text-[var(--muted)]" />}
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-full border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)] hover:border-[var(--accent)] transition-all shadow-sm active:scale-95"
                  title={theme === 'dark' ? 'Switch to Imperial Daylight' : 'Switch to Velvet Night'}
                  aria-label="Toggle theme mode"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-[#f4d98a]" /> : <Moon className="w-4 h-4 text-[var(--accent)]" />}
                </button>

                <button
                  type="button"
                  onClick={handleRelockGate}
                  className="px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--surface2)] text-xs font-bold text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all flex items-center gap-1.5"
                  title="Seal the gates again"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Relock</span>
                </button>
              </div>
            </div>

            {/* Scrollable Section Navigation Tabs */}
            <nav
              className="max-w-6xl mx-auto px-4 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold tracking-wide"
              aria-label="Theatre acts"
            >
              {[
                ['#cast', 'The Cast'],
                ['#letters', 'Six Letters'],
                ['#story', 'Our Story'],
                ['#reasons', 'Reasons'],
                ['#games', 'Games'],
                ['#music', 'Our Song'],
                ['#coupons', 'Coupons'],
                ['#openwhen', 'Open When'],
                ['#future', 'Future Acts'],
                ['#surprise', 'The Surprise'],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="px-3 py-1.5 rounded-full whitespace-nowrap text-[var(--text)] hover:bg-[var(--surface2)] border border-transparent hover:border-[var(--line)] transition-all"
                >
                  {label}
                </a>
              ))}
            </nav>
          </header>

          <main id="top" className="flex-1">
            {/* HERO PROLOGUE BANNER */}
            <section className="relative text-center text-[#fff7e6] py-20 px-4 sm:px-6 bg-[radial-gradient(ellipse_at_50%_0%,_#b3263f_0%,_#7a1228_55%,_#4a0a19_100%)] border-b-4 border-[var(--gold-bright)] overflow-hidden">
              <div className="max-w-4xl mx-auto relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/25 border border-[#f4d98a]/40 text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#f8dc8e]">
                  <span>Squad Edition • Commemorative Theatre</span>
                </div>

                <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-[#f8dc8e] tracking-tight drop-shadow-[0_4px_12px_rgba(40,4,12,0.8)] leading-tight">
                  The Grand Theatre of Us
                </h1>

                <p className="text-base sm:text-xl text-[#f9e8cf] max-w-2xl mx-auto font-body leading-relaxed">
                  A performance in many acts, staged for six very important people:{' '}
                  <b className="text-[#f8dc8e] underline decoration-[#f4d98a]/60 underline-offset-4">
                    {APP_DATA.toName}
                  </b>
                  .
                </p>

                {/* Royal Counters */}
                <div className="pt-4 flex flex-wrap justify-center gap-4 sm:gap-6">
                  {/* Friendship Days Counter */}
                  <div className="min-w-[170px] p-4 sm:p-5 rounded-2xl bg-[#28040c]/60 border-2 border-[#d9b45a]/70 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#f4d98a] mb-1">
                      <Clock className="w-4 h-4" />
                      <span>Fellowship</span>
                    </div>
                    <b className="font-display text-3xl sm:text-4xl text-[#f8dc8e] block">
                      {daysTogether}
                    </b>
                    <span className="text-xs sm:text-sm text-[#f2dcc0]">
                      days of friendship
                    </span>
                  </div>

                  {/* Countdown to Next Project */}
                  <div className="min-w-[170px] p-4 sm:p-5 rounded-2xl bg-[#28040c]/60 border-2 border-[#d9b45a]/70 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#f4d98a] mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Next Act</span>
                    </div>
                    <b className="font-display text-3xl sm:text-4xl text-[#f8dc8e] block">
                      {daysRemaining}
                    </b>
                    <span className="text-xs sm:text-sm text-[#f2dcc0] max-w-[200px] block mx-auto">
                      {countdownLabel}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ACT I: THE CAST */}
            <section id="cast" className="py-16 sm:py-24 px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                <div className="border-b-2 border-[var(--line)] pb-4 mb-8 relative">
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text)] tracking-wide">
                    The Cast
                  </h2>
                  <p className="text-base text-[var(--muted)] mt-1">
                    Six people, one very loud and wonderful group chat.
                  </p>
                  <div className="w-20 h-1 bg-[var(--accent)] mt-3 rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {APP_DATA.members.map((m) => (
                    <article
                      key={m.name}
                      className="rounded-2xl p-6 bg-[var(--surface)] border-2 border-[var(--line)] border-t-[6px] border-t-[var(--accent)] shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#b3263f] to-[#6f0f23] border-2 border-[#d9b45a] flex items-center justify-center text-3xl mb-4 shadow-md">
                          {m.emoji}
                        </div>

                        {/* Name & Title */}
                        <h3 className="font-display font-bold text-2xl text-[var(--text)] mb-1">
                          {m.name}
                        </h3>
                        <div className="font-display font-semibold text-sm text-[var(--accent)] mb-4">
                          {m.title}
                        </div>

                        {/* Stats Bars */}
                        <div className="space-y-2.5 mb-6">
                          {m.stats.map(([statName, val]) => (
                            <div key={statName} className="text-xs">
                              <div className="flex justify-between font-semibold mb-1 text-[var(--muted)]">
                                <span>{statName}</span>
                                <span>{val}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-[var(--surface2)] overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--gold-bright)] transition-all duration-700"
                                  style={{ width: `${val}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Member Quote */}
                      <p className="font-hand text-2xl text-[var(--text)] border-t border-[var(--line)] pt-4 mt-auto italic">
                        "{m.quote}"
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* ACT II: SIX LETTERS */}
            <section id="letters" className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--surface)]">
              <div className="max-w-6xl mx-auto">
                <div className="border-b-2 border-[var(--line)] pb-4 mb-8">
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text)] tracking-wide">
                    Six Letters
                  </h2>
                  <p className="text-base text-[var(--muted)] mt-1">
                    Unseal each envelope to read the personal words penned for review season and beyond.
                  </p>
                  <div className="w-20 h-1 bg-[var(--accent)] mt-3 rounded-full" />
                </div>

                <LettersSection
                  letters={APP_DATA.letters}
                  members={APP_DATA.members}
                  fromName={APP_DATA.fromName}
                />
              </div>
            </section>

            {/* ACT III: OUR STORY SO FAR */}
            <section id="story" className="py-16 sm:py-24 px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                <div className="border-b-2 border-[var(--line)] pb-4 mb-8">
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text)] tracking-wide">
                    Our Story So Far
                  </h2>
                  <p className="text-base text-[var(--muted)] mt-1">
                    Cherished memories framed in imperial gold.
                  </p>
                  <div className="w-20 h-1 bg-[var(--accent)] mt-3 rounded-full" />
                </div>

                <PhotoFrames initialPhotos={PHOTOS} />
              </div>
            </section>

            {/* ACT IV: REASONS WE LOVE THIS GROUP */}
            <section id="reasons" className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--surface)]">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="border-b-2 border-[var(--line)] pb-4">
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text)] tracking-wide">
                    Reasons We Love This Group
                  </h2>
                  <p className="text-base text-[var(--muted)] mt-1">
                    Draw from the imperial parchment to reveal why this squad is unmatched.
                  </p>
                  <div className="w-20 h-1 bg-[var(--accent)] mx-auto mt-3 rounded-full" />
                </div>

                {/* Parchment Box */}
                <div className="p-8 sm:p-12 rounded-2xl bg-[var(--surface2)] border-t-[8px] border-b-[8px] border-[var(--accent)] shadow-xl max-w-2xl mx-auto min-h-[170px] flex items-center justify-center">
                  <p className="font-hand text-2xl sm:text-3xl text-[var(--text)] leading-relaxed">
                    {currentReason ? `"${currentReason}"` : 'Press the button below to draw an imperial reason.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleDrawReason}
                    className="py-3 px-8 rounded-full bg-[var(--accent)] text-white font-bold tracking-wide hover:bg-[var(--accent-hover)] transition-all shadow-md active:scale-95 text-base sm:text-lg border-2 border-[var(--gold-bright)]"
                  >
                    Draw a Reason ✨
                  </button>

                  <div className="text-sm font-semibold text-[var(--muted)]">
                    {seenReasons.length > 0 && (
                      <span>
                        You have discovered {seenReasons.length} of {APP_DATA.reasons.length} reasons.
                        {seenReasons.length === APP_DATA.reasons.length && ' That is every single one. Umu!'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ACT V: GAMES FOR MY FAVORITE PEOPLE */}
            <section id="games" className="py-16 sm:py-24 px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                <div className="border-b-2 border-[var(--line)] pb-4 mb-8">
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text)] tracking-wide">
                    Games for My Favorite People
                  </h2>
                  <p className="text-base text-[var(--muted)] mt-1">
                    Test your squad trivia, match the royal emblems, and solve the scavenger hunt.
                  </p>
                  <div className="w-20 h-1 bg-[var(--accent)] mt-3 rounded-full" />
                </div>

                <GamesSection
                  quizData={APP_DATA.quiz}
                  memIcons={APP_DATA.memIcons}
                  huntData={APP_DATA.hunt}
                  huntPrize={APP_DATA.huntPrize}
                />
              </div>
            </section>

            {/* ACT VI: OUR SONG */}
            <section id="music" className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--surface)]">
              <div className="max-w-4xl mx-auto">
                <div className="border-b-2 border-[var(--line)] pb-4 mb-8 text-center sm:text-left">
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text)] tracking-wide">
                    Our Song
                  </h2>
                  <p className="text-base text-[var(--muted)] mt-1">
                    The soundtrack of our season: "End of Beginning" by Djo.
                  </p>
                  <div className="w-20 h-1 bg-[var(--accent)] mt-3 rounded-full" />
                </div>

                <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface2)] border-2 border-[var(--line)] shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    {/* Vinyl Record */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-900 border-4 border-[var(--gold-bright)] shadow-xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 animate-spin-slow">
                      <span className="animate-none">🎵</span>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <span className="text-xs uppercase tracking-widest font-bold text-[var(--gold)]">
                        Official Anthem • Spotify Player
                      </span>
                      <h3 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text)] mt-0.5">
                        End of Beginning
                      </h3>
                      <p className="text-sm sm:text-base text-[var(--muted)] font-medium">
                        Artist: Djo • Dedicated to the Squad
                      </p>
                    </div>
                  </div>

                  {/* Embedded Spotify Player */}
                  <div className="overflow-hidden rounded-xl border-2 border-[var(--line)] shadow-lg bg-black">
                    <iframe
                      data-testid="embed-iframe"
                      title="Spotify Embed: End of Beginning by Djo"
                      style={{ borderRadius: '12px' }}
                      src="https://open.spotify.com/embed/track/3qhlB30KknSejmIvZZLjOD?utm_source=generator&si=898243b583f9417a"
                      width="100%"
                      height="352"
                      frameBorder={0}
                      allowFullScreen={true}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ACT VII: THE COUPON BOOK */}
            <section id="coupons" className="py-16 sm:py-24 px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                <div className="border-b-2 border-[var(--line)] pb-4 mb-8">
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text)] tracking-wide">
                    The Coupon Book
                  </h2>
                  <p className="text-base text-[var(--muted)] mt-1">
                    Each coupon is valid exactly once. Redeem by tapping, then present to the group chat.
                  </p>
                  <div className="w-20 h-1 bg-[var(--accent)] mt-3 rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {APP_DATA.coupons.map((c, i) => {
                    const isRedeemed = redeemedCoupons.includes(i);
                    return (
                      <div
                        key={c.t}
                        className={`relative p-6 rounded-2xl bg-[var(--surface)] border-2 border-dashed border-[var(--gold-bright)] shadow-md transition-all flex flex-col justify-between overflow-hidden ${
                          isRedeemed ? 'opacity-70 bg-[var(--surface2)]/50' : 'hover:-translate-y-1'
                        }`}
                      >
                        <div className="pr-12">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] mb-1">
                            <Ticket className="w-3.5 h-3.5" />
                            <span>VOUCHER #{i + 1}</span>
                          </div>
                          <h3 className="font-display font-bold text-xl text-[var(--text)] mb-2">
                            {c.t}
                          </h3>
                          <p className="text-sm text-[var(--muted)]">
                            {c.d}
                          </p>
                        </div>

                        {/* Stamp if redeemed */}
                        {isRedeemed ? (
                          <div className="mt-4 pt-3 border-t border-[var(--line)]">
                            <div className="inline-block px-3 py-1 rounded-md border-2 border-[var(--accent)] text-[var(--accent)] font-display font-bold text-xs uppercase tracking-wider transform -rotate-6">
                              REDEEMED ✓
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRedeemCoupon(i)}
                            className="mt-6 w-full py-2.5 px-4 rounded-full bg-[var(--accent)] text-white font-bold text-xs uppercase tracking-wider hover:bg-[var(--accent-hover)] transition-all shadow-sm active:scale-95"
                          >
                            Redeem Voucher
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ACT VIII: OPEN WHEN... */}
            <section id="openwhen" className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--surface)]">
              <div className="max-w-4xl mx-auto">
                <div className="border-b-2 border-[var(--line)] pb-4 mb-8">
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text)] tracking-wide">
                    Open When...
                  </h2>
                  <p className="text-base text-[var(--muted)] mt-1">
                    Messages prepared for whenever life feels quiet, loud, or uncertain.
                  </p>
                  <div className="w-20 h-1 bg-[var(--accent)] mt-3 rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {APP_DATA.openWhen.map((item, idx) => {
                    const isOpen = openWhenIndex === idx;
                    return (
                      <div
                        key={item.t}
                        className="rounded-2xl border-2 border-[var(--line)] overflow-hidden shadow-sm bg-[var(--surface2)]"
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleOpenWhen(idx)}
                          className="w-full text-left p-5 flex items-center justify-between gap-3 font-semibold text-[var(--text)] hover:bg-[var(--surface)]/70 transition-colors"
                        >
                          <div>
                            <span className="block font-display text-xs uppercase tracking-widest text-[var(--accent)] font-bold mb-0.5">
                              Open when...
                            </span>
                            <span className="text-base font-bold">{item.t}</span>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-[var(--accent)] transition-transform duration-200 flex-shrink-0 ${
                              isOpen ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="p-5 pt-3 bg-[var(--surface)] border-t border-[var(--line)] font-hand text-2xl text-[var(--text)] leading-snug">
                            {item.m}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ACT IX: THINGS WE WILL DO TOGETHER */}
            <section id="future" className="py-16 sm:py-24 px-4 sm:px-6">
              <div className="max-w-3xl mx-auto">
                <div className="border-b-2 border-[var(--line)] pb-4 mb-8">
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text)] tracking-wide">
                    Things We Will Do Together
                  </h2>
                  <p className="text-base text-[var(--muted)] mt-1">
                    The squad's eternal bucket list. Check off achievements or inscribe your own royal dreams.
                  </p>
                  <div className="w-20 h-1 bg-[var(--accent)] mt-3 rounded-full" />
                </div>

                {/* Checklist */}
                <div className="space-y-3 mb-6">
                  {bucketItems.map((item, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-3.5 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
                        item.d
                          ? 'bg-[var(--surface2)] border-[var(--line)] opacity-80'
                          : 'bg-[var(--surface)] border-[var(--line)] hover:border-[var(--accent)] shadow-sm'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.d}
                        onChange={() => handleToggleBucket(idx)}
                        className="w-5 h-5 rounded accent-[var(--accent)] cursor-pointer"
                      />
                      <span
                        className={`text-base font-medium flex-1 ${
                          item.d ? 'line-through text-[var(--muted)]' : 'text-[var(--text)]'
                        }`}
                      >
                        {item.t}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Add new bucket item form */}
                <form onSubmit={handleAddBucket} className="flex gap-3">
                  <input
                    type="text"
                    value={newBucketText}
                    onChange={(e) => setNewBucketText(e.target.value)}
                    placeholder="Add an adventure to our bucket list..."
                    aria-label="New bucket list idea"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--gold)]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-hover)] transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </form>
              </div>
            </section>

            {/* ACT X: ONE LAST THING (FINALE SCRATCH-OFF) */}
            <section id="surprise" className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--surface)] border-t-2 border-[var(--line)]">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <div>
                  <h2 className="font-display font-bold text-3xl sm:text-5xl text-[var(--text)] tracking-wide">
                    One Last Thing
                  </h2>
                  <p className="text-base sm:text-lg text-[var(--muted)] mt-2">
                    Scratch the royal gold foil with your cursor or finger to reveal the final message.
                  </p>
                  <div className="w-20 h-1 bg-[var(--accent)] mx-auto mt-3 rounded-full" />
                </div>

                <ScratchCard
                  title={APP_DATA.finaleTitle.replace(/\{to\}/g, APP_DATA.toName)}
                  message={APP_DATA.finale.replace(/\{to\}/g, APP_DATA.toName).replace(/\{from\}/g, APP_DATA.fromName)}
                  onRevealed={triggerBurst}
                />
              </div>
            </section>
          </main>

          {/* FOOTER */}
          <footer className="py-12 px-6 text-center bg-[#4a0a19] text-[#f2dcc0] border-t-4 border-[var(--gold-bright)] space-y-3">
            <b className="font-display text-2xl text-[#f8dc8e] block tracking-wide">
              Umu! The end of the show.
            </b>
            <p className="text-sm sm:text-base text-[#f2dcc0]/90 max-w-md mx-auto">
              Made with far too much enthusiasm by{' '}
              <span className="text-[#f8dc8e] font-bold">{APP_DATA.fromName}</span>, for{' '}
              <span className="text-[#f8dc8e] font-bold">{APP_DATA.toName}</span>.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#f4d98a]/70">
              <span>Six companions • Infinite acts</span>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

// Inlined photo memory assets from original prompt
const PHOTOS: string[] = [
  '/memories/photo-1.jpg',
  '/memories/photo-2.jpg',
  '/memories/photo-3.jpg',
  '/memories/photo-4.jpg',
  '/memories/photo-5.jpg',
  '/memories/photo-6.jpg',
];

// Base photo memory array
const DEFAULT_MEMORIES: string[] = PHOTOS;
