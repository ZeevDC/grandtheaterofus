import React, { useState } from 'react';
import { QuizQuestion, HuntClue } from '../data';
import { playSound } from '../audio';
import { fireRoyalConfetti } from './PetalCanvas';
import { Check, HelpCircle, Trophy, RotateCcw, Sparkles } from 'lucide-react';

interface GamesSectionProps {
  quizData: QuizQuestion[];
  memIcons: string[];
  huntData: HuntClue[];
  huntPrize: string;
}

export const GamesSection: React.FC<GamesSectionProps> = ({
  quizData,
  memIcons,
  huntData,
  huntPrize,
}) => {
  /* ================== QUIZ STATE ================== */
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleSelectOption = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    const q = quizData[currentQ];
    if (idx === q.a) {
      setQuizScore((prev) => prev + 1);
      playSound('chime');
    } else {
      playSound('tap');
    }
  };

  const handleNextQuestion = () => {
    if (currentQ + 1 < quizData.length) {
      setCurrentQ((prev) => prev + 1);
      setSelectedOpt(null);
    } else {
      setQuizFinished(true);
      if (quizScore + (selectedOpt === quizData[currentQ].a ? 1 : 0) === quizData.length) {
        playSound('fanfare');
        fireRoyalConfetti();
      } else {
        playSound('success');
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQ(0);
    setSelectedOpt(null);
    setQuizScore(0);
    setQuizFinished(false);
    playSound('tap');
  };

  /* ================== MEMORY GAME STATE ================== */
  const generateDeck = () => {
    return [...memIcons, ...memIcons].sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState<string[]>(generateDeck);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLock, setIsLock] = useState(false);

  const handleFlipCard = (index: number) => {
    if (isLock || flippedIndices.includes(index) || matchedPairs.includes(cards[index])) {
      return;
    }

    playSound('flip');
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx] === cards[secondIdx]) {
        // Matched!
        playSound('chime');
        setMatchedPairs((prev) => {
          const updated = [...prev, cards[firstIdx]];
          if (updated.length === memIcons.length) {
            playSound('fanfare');
            fireRoyalConfetti();
          }
          return updated;
        });
        setFlippedIndices([]);
      } else {
        // Mismatched
        setIsLock(true);
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLock(false);
        }, 850);
      }
    }
  };

  const restartMemory = () => {
    setCards(generateDeck());
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setIsLock(false);
    playSound('tap');
  };

  /* ================== SCAVENGER HUNT STATE ================== */
  const [huntStep, setHuntStep] = useState(0);
  const [huntInput, setHuntInput] = useState('');
  const [huntFeedback, setHuntFeedback] = useState<string | null>(null);
  const [showHuntHint, setShowHuntHint] = useState(false);

  const handleCheckHunt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (huntStep >= huntData.length) return;

    const currentClue = huntData[huntStep];
    const val = huntInput.trim().toLowerCase();

    if (currentClue.accept.some((ans) => val.includes(ans.toLowerCase()))) {
      playSound('chime');
      setHuntFeedback(null);
      setShowHuntHint(false);
      setHuntInput('');
      const nextStep = huntStep + 1;
      setHuntStep(nextStep);
      if (nextStep >= huntData.length) {
        playSound('fanfare');
        fireRoyalConfetti();
      }
    } else {
      playSound('tap');
      setHuntFeedback(`Not quite! Would you like a royal hint?`);
    }
  };

  return (
    <div className="space-y-8">
      {/* 2-column grid for Quiz and Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QUIZ PANEL */}
        <div className="p-6 md:p-8 rounded-2xl bg-[var(--surface)] border-2 border-[var(--line)] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[var(--surface2)] text-[var(--gold)] border border-[var(--line)]">
                The Royal Inquisition
              </span>
              {!quizFinished && (
                <span className="text-xs font-semibold text-[var(--muted)]">
                  Question {currentQ + 1} of {quizData.length}
                </span>
              )}
            </div>

            <h3 className="font-display font-bold text-xl md:text-2xl text-[var(--text)] mb-4">
              How well do you know us?
            </h3>

            {!quizFinished ? (
              <div>
                <p className="font-semibold text-base md:text-lg mb-6 text-[var(--text)]">
                  {quizData[currentQ].q}
                </p>

                <div className="space-y-3 mb-6">
                  {quizData[currentQ].opts.map((opt, idx) => {
                    let btnStyle =
                      'bg-[var(--surface2)] text-[var(--text)] border-[var(--line)] hover:border-[var(--accent)]';
                    if (selectedOpt !== null) {
                      if (idx === quizData[currentQ].a) {
                        btnStyle = 'bg-emerald-700 text-white border-emerald-800 shadow-md font-bold';
                      } else if (idx === selectedOpt) {
                        btnStyle = 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-md';
                      } else {
                        btnStyle = 'opacity-60 bg-[var(--surface2)] border-[var(--line)]';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        disabled={selectedOpt !== null}
                        className={`w-full text-left p-3.5 md:p-4 rounded-xl border-2 transition-all duration-150 flex items-center justify-between ${btnStyle}`}
                      >
                        <span className="text-sm md:text-base">{opt}</span>
                        {selectedOpt !== null && idx === quizData[currentQ].a && (
                          <Check className="w-5 h-5 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOpt !== null && (
                  <div
                    className={`p-4 rounded-xl text-sm md:text-base font-medium mb-4 ${
                      selectedOpt === quizData[currentQ].a
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200'
                        : 'bg-rose-50 text-rose-900 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-200'
                    }`}
                  >
                    {selectedOpt === quizData[currentQ].a
                      ? quizData[currentQ].yes
                      : quizData[currentQ].no}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[var(--surface2)] border-2 border-[var(--gold)] flex items-center justify-center text-[var(--accent)]">
                  <Trophy className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-2xl text-[var(--text)]">
                  You scored {quizScore} out of {quizData.length}
                </h4>
                <p className="text-[var(--muted)] max-w-sm mx-auto">
                  {quizScore === quizData.length
                    ? 'A perfect score. You know this squad by heart! Umu!'
                    : quizScore >= quizData.length / 2
                    ? 'Very good! We should celebrate with dessert together soon.'
                    : 'We have some catching up to do! Date night, right away.'}
                </p>
              </div>
            )}
          </div>

          <div>
            {!quizFinished ? (
              selectedOpt !== null && (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full py-3 px-6 rounded-full bg-[var(--accent)] text-white font-bold tracking-wide hover:bg-[var(--accent-hover)] transition-all shadow-md active:scale-98"
                >
                  {currentQ + 1 < quizData.length ? 'Next Question →' : 'See Royal Score'}
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={restartQuiz}
                className="w-full py-3 px-6 rounded-full border-2 border-[var(--accent)] text-[var(--accent)] font-bold tracking-wide hover:bg-[var(--accent)] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            )}
          </div>
        </div>

        {/* MEMORY MATCH PANEL */}
        <div className="p-6 md:p-8 rounded-2xl bg-[var(--surface)] border-2 border-[var(--line)] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[var(--surface2)] text-[var(--gold)] border border-[var(--line)]">
                Imperial Memory Match
              </span>
              <span className="text-xs font-semibold text-[var(--muted)]">
                Pairs: {matchedPairs.length} / {memIcons.length} • Moves: {moves}
              </span>
            </div>

            <h3 className="font-display font-bold text-xl md:text-2xl text-[var(--text)] mb-2">
              The Emblems of Us
            </h3>
            <p className="text-sm text-[var(--muted)] mb-5">
              Flip the imperial tiles to pair each squad companion.
            </p>

            {/* 4x4 Grid */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-[340px] mx-auto mb-6">
              {cards.map((icon, idx) => {
                const isFlipped = flippedIndices.includes(idx) || matchedPairs.includes(icon);
                const isMatched = matchedPairs.includes(icon);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleFlipCard(idx)}
                    aria-label={isFlipped ? `Card ${icon}` : 'Hidden imperial card'}
                    className={`aspect-square rounded-xl border-2 font-bold text-2xl sm:text-3xl flex items-center justify-center transition-all duration-300 transform select-none ${
                      isFlipped
                        ? isMatched
                          ? 'bg-[#f4d98a]/30 border-[var(--accent)] shadow-sm scale-95 opacity-90'
                          : 'bg-[var(--surface2)] border-[var(--gold-bright)] shadow-md rotate-y-180'
                        : 'bg-gradient-to-br from-[#b3263f] to-[#6f0f23] border-[#d9b45a] text-[#f4d98a] hover:scale-105 active:scale-95 shadow-md'
                    }`}
                  >
                    <span>{isFlipped ? icon : '✦'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            {matchedPairs.length === memIcons.length ? (
              <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-900 dark:text-emerald-200 mb-3 text-sm font-semibold flex items-center justify-between">
                <span>Completed in {moves} moves! Royal memory unlocked.</span>
                <button
                  type="button"
                  onClick={restartMemory}
                  className="text-xs font-bold underline ml-2"
                >
                  Play again
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={restartMemory}
                className="w-full py-2.5 px-4 rounded-full border border-[var(--line)] text-xs uppercase tracking-wider font-bold text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-all"
              >
                Reset Cards
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ROYAL SCAVENGER HUNT PANEL */}
      <div className="p-6 md:p-8 rounded-2xl bg-[var(--surface)] border-2 border-[var(--line)] shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[var(--gold)]" />
          <span className="text-xs uppercase tracking-widest font-bold text-[var(--gold)]">
            Royal Scavenger Hunt
          </span>
        </div>
        <h3 className="font-display font-bold text-2xl text-[var(--text)] mb-3">
          Solve the Imperial Riddles
        </h3>

        {huntStep < huntData.length ? (
          <div className="space-y-4 max-w-xl">
            <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-base font-semibold text-[var(--text)]">
              {huntData[huntStep].clue}
            </div>

            <form onSubmit={handleCheckHunt} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={huntInput}
                onChange={(e) => setHuntInput(e.target.value)}
                placeholder="Type your answer..."
                aria-label="Your answer to the clue"
                autoCapitalize="none"
                autoComplete="off"
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] text-[var(--text)] focus:border-[var(--gold)] outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-hover)] transition-all shadow-md active:scale-95"
              >
                Check Answer
              </button>
            </form>

            {huntFeedback && (
              <div className="flex items-center justify-between text-sm text-[var(--muted)] pt-1">
                <span>{huntFeedback}</span>
                <button
                  type="button"
                  onClick={() => setShowHuntHint(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent)] underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Reveal Hint</span>
                </button>
              </div>
            )}

            {showHuntHint && (
              <div className="p-3 rounded-lg bg-[var(--surface2)] text-xs text-[var(--muted)] border border-[var(--line)]">
                <b>Hint:</b> {huntData[huntStep].hint}
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#b3263f] to-[#7a1228] text-white border-2 border-[var(--gold-bright)] shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--gold-bright)] text-[#3a1018] flex items-center justify-center font-bold text-xl">
                ✓
              </div>
              <h4 className="font-display font-bold text-2xl text-[#f8dc8e]">
                Hunt Complete! The Imperial Decree is Sealed.
              </h4>
            </div>
            <p className="text-lg text-[#fbeedd] mt-2 font-hand leading-relaxed">
              {huntPrize}
            </p>
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#f4d98a]">
                Awarded by {huntData.length} of {huntData.length} clues
              </span>
              <button
                type="button"
                onClick={() => setHuntStep(0)}
                className="text-xs font-bold underline text-white/80 hover:text-white"
              >
                Play Hunt Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
