import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface Petal {
  x: number;
  y: number;
  s: number;
  vy: number;
  vx: number;
  r: number;
  vr: number;
  w: number;
  c: string;
  burst?: boolean;
  dead?: boolean;
}

export function fireRoyalConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f4d98a', '#e8798b', '#b3263f', '#d9b45a', '#ffffff'],
    shapes: ['circle', 'square'],
  });
}

export function fireFullCelebration() {
  const duration = 2.5 * 1000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#f4d98a', '#e8798b', '#b3263f', '#d9b45a'],
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#f4d98a', '#e8798b', '#b3263f', '#d9b45a'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}

interface PetalCanvasProps {
  burstTrigger?: number;
}

export const PetalCanvas: React.FC<PetalCanvasProps> = ({ burstTrigger = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createPetal = (topOnly: boolean): Petal => {
      return {
        x: Math.random() * canvas.width,
        y: topOnly ? -20 - Math.random() * 200 : Math.random() * canvas.height,
        s: 5 + Math.random() * 7,
        vy: 0.6 + Math.random() * 1.0,
        vx: (Math.random() - 0.5) * 0.7,
        r: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.04,
        w: Math.random() * 6.28,
        c: Math.random() < 0.25 ? 'rgba(244,217,138,0.75)' : 'rgba(232,121,139,0.65)'
      };
    };

    // Initialize 26 floating petals
    petalsRef.current = [];
    for (let i = 0; i < 26; i++) {
      petalsRef.current.push(createPetal(false));
    }

    let isRunning = true;
    const loop = () => {
      if (!isRunning) return;
      if (!document.hidden) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const petals = petalsRef.current;

        for (const p of petals) {
          p.w += 0.02;
          p.x += p.vx + Math.sin(p.w) * 0.6;
          p.y += p.vy;
          p.r += p.vr;

          if (p.y > canvas.height + 25) {
            if (p.burst) {
              p.dead = true;
            } else {
              Object.assign(p, createPetal(true));
            }
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.r);
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        petalsRef.current = petals.filter(p => !p.dead);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      isRunning = false;
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Handle burst triggers
  useEffect(() => {
    if (burstTrigger > 0) {
      const canvas = canvasRef.current;
      if (canvas && petalsRef.current) {
        for (let i = 0; i < 45; i++) {
          const p: Petal = {
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * 150,
            s: 7 + Math.random() * 6,
            vy: 2.0 + Math.random() * 2.5,
            vx: (Math.random() - 0.5) * 1.5,
            r: Math.random() * 6.28,
            vr: (Math.random() - 0.5) * 0.06,
            w: Math.random() * 6.28,
            c: Math.random() < 0.4 ? 'rgba(244,217,138,0.85)' : 'rgba(232,121,139,0.8)',
            burst: true,
          };
          petalsRef.current.push(p);
        }
      }
      fireRoyalConfetti();
    }
  }, [burstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-30"
      aria-hidden="true"
    />
  );
};
