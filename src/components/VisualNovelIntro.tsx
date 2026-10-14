import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../audio';
import { ChevronDown, FastForward } from 'lucide-react';

interface VisualNovelIntroProps {
  fromName: string;
  toName: string;
  dialogueLines: string[];
  onComplete: () => void;
}

export const VisualNovelIntro: React.FC<VisualNovelIntroProps> = ({
  fromName,
  toName,
  dialogueLines,
  onComplete,
}) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentRawLine = dialogueLines[lineIndex] || '';
  const currentFullLine = currentRawLine.replace(/\{to\}/g, toName).replace(/\{from\}/g, fromName);

  // Typewriter effect
  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');

    let charIdx = 0;
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      charIdx++;
      setDisplayedText(currentFullLine.slice(0, charIdx));
      if (charIdx >= currentFullLine.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsTyping(false);
      }
    }, 24);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [lineIndex, currentFullLine]);

  const handleAdvance = () => {
    if (isTyping) {
      // Instantly finish line
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setDisplayedText(currentFullLine);
      setIsTyping(false);
      playSound('tap');
    } else {
      if (lineIndex + 1 < dialogueLines.length) {
        setLineIndex((prev) => prev + 1);
        playSound('tap');
      } else {
        playSound('seal');
        onComplete();
      }
    }
  };

  // Handle keyboard navigation (Space / Enter / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleAdvance();
      } else if (e.key === 'Escape') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div
      onClick={handleAdvance}
      className="fixed inset-0 z-50 flex flex-col justify-between cursor-pointer select-none text-[#fff7e6] overflow-hidden bg-[radial-gradient(ellipse_60%_55%_at_50%_38%,_rgba(255,226,150,0.55),_rgba(255,226,150,0)_70%),repeating-linear-gradient(90deg,#7d1226_0_34px,#8f1830_34px_68px)]"
    >
      {/* Cinematic vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#28040c]/70 via-transparent to-[#28040c]/90 pointer-events-none" />

      {/* Top Header & Skip Button */}
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f4d98a] animate-pulse" />
          <span className="font-display text-xs uppercase tracking-widest text-[#f4d98a]/90">
            Prologue: The Royal Summons
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#28040c]/70 border border-[#d9b45a] text-[#f4d98a] hover:bg-[#b3263f] transition-all shadow-md active:scale-95"
        >
          <span>Skip Prologue</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Imperial Emblem */}
      <div className="relative z-0 flex-1 flex items-center justify-center pointer-events-none px-4">
        <svg
          className="w-44 h-44 sm:w-56 sm:h-56 filter drop-shadow-[0_0_24px_rgba(255,214,120,0.7)]"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <g fill="none" stroke="#f4d98a" strokeWidth="3" strokeLinecap="round">
            <path d="M100 176 C40 160 18 110 30 60" />
            <path d="M100 176 C160 160 182 110 170 60" />
          </g>
          <g fill="#f4d98a">
            <ellipse cx="34" cy="92" rx="9" ry="16" transform="rotate(-25 34 92)" />
            <ellipse cx="46" cy="128" rx="9" ry="16" transform="rotate(-50 46 128)" />
            <ellipse cx="72" cy="156" rx="9" ry="16" transform="rotate(-75 72 156)" />
            <ellipse cx="30" cy="60" rx="8" ry="14" transform="rotate(-5 30 60)" />
            <ellipse cx="166" cy="92" rx="9" ry="16" transform="rotate(25 166 92)" />
            <ellipse cx="154" cy="128" rx="9" ry="16" transform="rotate(50 154 128)" />
            <ellipse cx="128" cy="156" rx="9" ry="16" transform="rotate(75 128 156)" />
            <ellipse cx="170" cy="60" rx="8" ry="14" transform="rotate(5 170 60)" />
          </g>
          <path
            d="M100 138 C52 104 66 62 100 84 C134 62 148 104 100 138 Z"
            fill="#e8798b"
            stroke="#f4d98a"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path d="M72 50 L80 30 L92 42 L100 24 L108 42 L120 30 L128 50 Z" fill="#f4d98a" />
        </svg>
      </div>

      {/* Bottom Dialogue Box */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 pb-6 sm:pb-8">
        <div className="relative p-6 sm:p-8 rounded-2xl bg-[#22040c]/90 border-2 border-[#d9b45a] shadow-[0_0_0_4px_rgba(217,180,90,0.25),0_14px_40px_rgba(0,0,0,0.7)] backdrop-blur-md min-h-[140px] sm:min-h-[160px] flex flex-col justify-between">
          {/* Character Nameplate */}
          <div className="absolute -top-4 left-6 px-4 py-1 rounded-lg bg-gradient-to-r from-[#b3263f] to-[#7d1226] border-2 border-[#d9b45a] shadow-md">
            <span className="font-display font-bold text-sm tracking-wider text-[#fbe7a8]">
              {fromName}
            </span>
          </div>

          {/* Typewriter message */}
          <p className="font-body text-base sm:text-xl text-[#fbeedd] leading-relaxed pt-2">
            {displayedText}
            {isTyping && <span className="inline-block w-2 h-5 ml-1 bg-[#f4d98a] animate-pulse" />}
          </p>

          {/* Next indicator */}
          <div className="flex items-center justify-between text-xs text-[#f4d98a]/80 pt-3 border-t border-[#d9b45a]/20 mt-4">
            <span className="font-medium">
              Act {lineIndex + 1} of {dialogueLines.length}
            </span>
            <div className="flex items-center gap-1.5 animate-bob">
              <span className="font-bold tracking-wider uppercase text-[10px]">
                {lineIndex + 1 < dialogueLines.length ? 'Tap to continue' : 'Enter the Theatre'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
