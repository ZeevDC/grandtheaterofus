import React, { useState } from 'react';
import { playSound } from '../audio';
import { KeyRound, ShieldAlert } from 'lucide-react';

interface ImperialGateProps {
  toName: string;
  hint: string;
  correctPassword: string;
  onUnlocked: () => void;
}

export const ImperialGate: React.FC<ImperialGateProps> = ({
  toName,
  hint,
  correctPassword,
  onUnlocked,
}) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = password.trim().toLowerCase();
    if (clean === correctPassword.toLowerCase()) {
      playSound('seal');
      onUnlocked();
    } else {
      playSound('tap');
      setErrorMsg('That is not the seal word. Read the imperial hint and try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[radial-gradient(ellipse_at_50%_20%,_#b3263f_0%,_#6f0f23_55%,_#3a0612_100%)] text-[#fff7e6] overflow-y-auto">
      <div
        className={`w-full max-w-md my-auto text-center p-8 rounded-3xl bg-[#28040c]/85 border-2 border-[#d9b45a] shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-md transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Imperial Seal SVG Emblem */}
        <div className="w-28 h-28 mx-auto mb-6 relative flex items-center justify-center drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
          <svg className="w-full h-full" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="54" fill="#8e1328" stroke="#d9b45a" strokeWidth="4" />
            <circle
              cx="60"
              cy="60"
              r="43"
              fill="none"
              stroke="#d9b45a"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M34 78 L38 46 L50 60 L60 40 L70 60 L82 46 L86 78 Z"
              fill="#f4d98a"
            />
            <rect x="34" y="80" width="52" height="7" rx="2" fill="#f4d98a" />
            <circle cx="38" cy="45" r="3.5" fill="#f4d98a" />
            <circle cx="60" cy="39" r="3.5" fill="#f4d98a" />
            <circle cx="82" cy="45" r="3.5" fill="#f4d98a" />
          </svg>
        </div>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#f4d98a] mb-2 tracking-wide">
          A gift awaits, {toName}
        </h1>
        <p className="text-sm sm:text-base text-[#f6e3c6] mb-6 leading-relaxed">
          This page is sealed by imperial decree. Speak the password to break the seal and raise the theatre curtain.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Speak the word..."
              aria-label="Seal password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="w-full text-center py-3 px-4 rounded-xl font-bold tracking-widest text-lg bg-[#fff7e6]/95 text-[#3a1018] border-2 border-[#d9b45a] focus:ring-4 focus:ring-[#f4d98a]/40 outline-none shadow-inner"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-full font-bold text-base tracking-wider uppercase bg-[#9b1b30] text-white border-2 border-[#d9b45a] shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:bg-[#b3263f] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <KeyRound className="w-5 h-5 text-[#f4d98a]" />
            <span>Open the Gates</span>
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-400 text-rose-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#d9b45a]/30">
          <p className="text-xs sm:text-sm text-[#e9c9a8]">
            <span className="font-bold text-[#f4d98a]">Imperial Hint:</span> {hint}
          </p>
        </div>
      </div>
    </div>
  );
};
