import React, { useRef, useEffect, useState, useCallback } from 'react';
import { playSound } from '../audio';
import { fireFullCelebration } from './PetalCanvas';

interface ScratchCardProps {
  title: string;
  message: string;
  onRevealed?: () => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ title, message, onRevealed }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawing = useRef(false);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.max(260, Math.floor(rect.height || 260));

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#e6c26e');
    grad.addColorStop(0.3, '#fae69e');
    grad.addColorStop(0.6, '#f8dc8e');
    grad.addColorStop(1, '#c9a043');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative imperial pattern
    ctx.strokeStyle = 'rgba(155, 27, 48, 0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    ctx.fillStyle = 'rgba(122, 18, 40, 0.75)';
    ctx.font = '700 22px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', width / 2, height / 2 - 14);

    ctx.font = '28px serif';
    ctx.fillText('🌹  👑  🌹', width / 2, height / 2 + 28);
    
    ctx.font = '500 13px "Zen Maru Gothic", sans-serif';
    ctx.fillStyle = 'rgba(74, 10, 25, 0.65)';
    ctx.fillText('Use cursor or finger to wipe away the gold', width / 2, height / 2 + 65);
  }, []);

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [initCanvas]);

  const checkCompletion = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const totalSampled = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 32) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const ratio = transparentCount / (totalSampled / 8);
    const pct = Math.min(100, Math.round(ratio * 100));
    setScratchPercent(pct);

    if (ratio > 0.45 && !isRevealed) {
      revealFull();
    }
  };

  const revealFull = () => {
    setIsRevealed(true);
    playSound('fanfare');
    fireFullCelebration();
    if (onRevealed) onRevealed();
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    checkCompletion();
  };

  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden border-4 border-[#d9b45a] shadow-2xl bg-gradient-to-br from-[#9b1b30] via-[#7a1228] to-[#4a0a19] text-[#fff7e6] min-h-[260px] flex items-center justify-center p-8 select-none"
      >
        {/* Underlying secret content */}
        <div className="z-0 px-4 py-6 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f4d98a]/20 border-2 border-[#f4d98a] flex items-center justify-center text-3xl shadow-inner">
            👑
          </div>
          <h3 className="font-display font-bold text-2xl md:text-3xl text-[#f8dc8e] mb-3 tracking-wide drop-shadow">
            {title}
          </h3>
          <p className="font-hand text-2xl md:text-3xl text-[#fbeedd] leading-relaxed">
            {message}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#f4d98a]/80 bg-black/20 px-3 py-1 rounded-full border border-[#f4d98a]/30">
            <span>Imperial Seal Approved</span>
          </div>
        </div>

        {/* Scratchable gold canvas layer */}
        <canvas
          ref={canvasRef}
          aria-label="Interactive scratch-off gold foil layer"
          className={`absolute inset-0 w-full h-full cursor-crosshair touch-none transition-opacity duration-700 z-10 ${
            isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onPointerDown={(e) => {
            isDrawing.current = true;
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            scratch(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (isDrawing.current) {
              scratch(e.clientX, e.clientY);
            }
          }}
          onPointerUp={(e) => {
            isDrawing.current = false;
            try {
              (e.target as HTMLElement).releasePointerCapture(e.pointerId);
            } catch {
              // ignore
            }
          }}
          onPointerCancel={() => {
            isDrawing.current = false;
          }}
        />
      </div>

      {/* Controls & progress */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {!isRevealed ? (
          <>
            <button
              type="button"
              onClick={revealFull}
              className="text-xs uppercase tracking-wider font-bold px-4 py-2 rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] hover:bg-[var(--surface2)] transition-all shadow-sm active:scale-95"
            >
              Reveal without scratching
            </button>
            {scratchPercent > 0 && (
              <span className="text-xs font-medium text-[var(--muted)]">
                {scratchPercent}% scratched
              </span>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsRevealed(false);
              setScratchPercent(0);
              setTimeout(initCanvas, 50);
            }}
            className="text-xs uppercase tracking-wider font-bold px-4 py-2 rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] transition-all shadow-sm"
          >
            Cover with gold again
          </button>
        )}
      </div>
    </div>
  );
};
