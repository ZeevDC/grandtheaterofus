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
  "data:image/jpeg;base64,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",
  "data:image/jpeg;base64,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"
];

// Base photo memory array
const DEFAULT_MEMORIES: string[] = PHOTOS;
