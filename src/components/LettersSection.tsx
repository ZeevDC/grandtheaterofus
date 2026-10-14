import React, { useState } from 'react';
import { Letter, CastMember } from '../data';
import { playSound } from '../audio';
import { fireRoyalConfetti } from './PetalCanvas';
import { Check, MailOpen, Heart, Sparkles } from 'lucide-react';

interface LettersSectionProps {
  letters: Letter[];
  members: CastMember[];
  fromName: string;
}

export const LettersSection: React.FC<LettersSectionProps> = ({
  letters,
  members,
  fromName,
}) => {
  const [activeLetterIdx, setActiveLetterIdx] = useState<number | null>(null);
  const [openedLetters, setOpenedLetters] = useState<number[]>([]);

  const handleSelectLetter = (index: number) => {
    setActiveLetterIdx(index);
    playSound('seal');

    if (!openedLetters.includes(index)) {
      const nextOpened = [...openedLetters, index];
      setOpenedLetters(nextOpened);
      if (nextOpened.length === letters.length) {
        playSound('fanfare');
        fireRoyalConfetti();
      }
    }
  };

  const activeLetter = activeLetterIdx !== null ? letters[activeLetterIdx] : null;
  const isAllOpened = openedLetters.length === letters.length;

  return (
    <div className="space-y-6">
      {/* Description & counter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm md:text-base text-[var(--muted)]">
          Tap each friend's wax seal to break the imperial ribbon and read their personal letter.
        </p>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[var(--surface2)] text-[var(--accent)] border border-[var(--line)]">
          <MailOpen className="w-4 h-4 text-[var(--gold)]" />
          <span>
            {openedLetters.length} of {letters.length} Unsealed
          </span>
        </div>
      </div>

      {/* Wax seal buttons */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {letters.map((letter, idx) => {
          const isSelected = activeLetterIdx === idx;
          const isRead = openedLetters.includes(idx);
          const member = members[idx];

          return (
            <button
              key={letter.to}
              type="button"
              onClick={() => handleSelectLetter(idx)}
              className={`group flex items-center gap-2.5 py-2 pl-2 pr-4 rounded-full font-bold text-sm tracking-wide transition-all duration-200 border-2 shadow-sm active:scale-95 ${
                isSelected
                  ? 'bg-[var(--gold-bright)] text-[#3a1018] border-[var(--accent)] shadow-md scale-105'
                  : 'bg-[var(--accent)] text-white border-[var(--gold-bright)] hover:bg-[var(--accent-hover)]'
              }`}
            >
              {/* Seal icon container */}
              <div className="w-8 h-8 rounded-full bg-[#f4d98a] text-[#3a1018] flex items-center justify-center text-lg shadow-inner flex-shrink-0">
                {member ? member.emoji : '✉'}
              </div>
              <span>For {letter.to}</span>
              {isRead && (
                <Check
                  className={`w-4 h-4 ml-0.5 ${
                    isSelected ? 'text-[var(--accent)]' : 'text-[#f4d98a]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Letter Reading View */}
      <div
        className="relative rounded-2xl p-6 sm:p-10 md:p-12 border-2 border-[var(--line)] shadow-xl bg-[var(--surface)] text-[var(--text)] transition-all"
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, transparent 0, transparent 2.2rem, color-mix(in srgb, var(--line) 40%, transparent) 2.2rem, calc(2.2rem + 1px))',
        }}
      >
        {activeLetter ? (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <h3 className="font-display font-bold text-2xl text-[var(--accent)] tracking-wide flex items-center gap-2">
                <span>Dear {activeLetter.to},</span>
              </h3>
              <span className="text-xs font-semibold text-[var(--muted)]">
                Personal Epistle
              </span>
            </div>

            <div className="space-y-4 font-hand text-2xl sm:text-3xl text-[var(--text)] leading-relaxed">
              {activeLetter.text.map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-snug">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-6 border-t border-[var(--line)] flex flex-col items-end text-right font-hand text-2xl sm:text-3xl text-[var(--accent)]">
              <span>Sincerely,</span>
              <span className="font-bold text-3xl sm:text-4xl">{fromName}</span>
            </div>

            {isAllOpened && (
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-[var(--gold-bright)]/20 via-[var(--rose)]/20 to-[var(--gold-bright)]/20 border-2 border-[var(--gold)] text-center space-y-1">
                <div className="inline-flex items-center gap-2 text-sm md:text-base font-bold text-[var(--accent)]">
                  <Sparkles className="w-5 h-5 text-[var(--gold)]" />
                  <span>All six imperial envelopes have been opened!</span>
                  <Heart className="w-5 h-5 text-[var(--rose)] fill-[var(--rose)]" />
                </div>
                <p className="font-hand text-2xl text-[var(--text)]">
                  Group hug, right now. No escape.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--surface2)] border-2 border-[var(--line)] flex items-center justify-center text-3xl">
              💌
            </div>
            <h4 className="font-display font-bold text-xl text-[var(--text)]">
              Select a seal to unfold a letter
            </h4>
            <p className="text-sm text-[var(--muted)] max-w-md mx-auto">
              Six personal letters await Jho, Suz, Ja, Nanno, Sunny, and Debs. Tap a seal above to read their message.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
