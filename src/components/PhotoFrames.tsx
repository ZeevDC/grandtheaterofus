import React, { useState } from 'react';
import { Camera, RefreshCw, ZoomIn, X, Download } from 'lucide-react';
import { playSound } from '../audio';

interface PhotoFramesProps {
  initialPhotos: string[];
}

export const PhotoFrames: React.FC<PhotoFramesProps> = ({ initialPhotos }) => {
  const [photos, setPhotos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gtou_photos');
      return saved ? JSON.parse(saved) : initialPhotos;
    } catch {
      return initialPhotos;
    }
  });

  const [activeZoomIndex, setActiveZoomIndex] = useState<number | null>(null);

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const next = [...photos];
        next[index] = reader.result;
        setPhotos(next);
        try {
          localStorage.setItem('gtou_photos', JSON.stringify(next));
        } catch {
          // ignore quota limits
        }
        playSound('success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setPhotos(initialPhotos);
    try {
      localStorage.removeItem('gtou_photos');
    } catch {
      // ignore
    }
    playSound('tap');
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <p className="text-sm md:text-base text-[var(--muted)]">
          Tap any framed memory to replace with a photo from your device, or inspect in high definition.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Photos</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((src, i) => (
          <div
            key={i}
            className="group relative rounded-xl p-3 bg-[var(--surface)] border-4 border-[#d9b45a] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* The Photo Container */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900 border border-[var(--line)]">
              <img
                src={src}
                alt={`Squad memory photo ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay controls on hover/focus */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                {/* Zoom button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveZoomIndex(i);
                    playSound('tap');
                  }}
                  className="p-2.5 rounded-full bg-white/90 text-neutral-900 hover:bg-white hover:scale-110 transition-all shadow-md"
                  title="Inspect photo"
                  aria-label="Inspect photo full size"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>

                {/* Replace photo label */}
                <label className="p-2.5 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] hover:scale-110 transition-all shadow-md cursor-pointer">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(i, e)}
                    className="sr-only"
                    aria-label={`Replace photo ${i + 1}`}
                  />
                </label>
              </div>
            </div>

            {/* Caption & label */}
            <div className="mt-3 flex items-center justify-between text-xs font-display text-[var(--muted)] px-1">
              <span className="font-bold tracking-wider text-[var(--accent)]">
                ACT #{i + 1}
              </span>
              <span>Memory Archive</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Zoom modal */}
      {activeZoomIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 flex flex-col items-center justify-center"
          onClick={() => setActiveZoomIndex(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border-4 border-[var(--gold-bright)] shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[activeZoomIndex]}
              alt={`Squad memory zoom ${activeZoomIndex + 1}`}
              className="max-h-[80vh] w-auto object-contain mx-auto"
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <a
                href={photos[activeZoomIndex]}
                download={`squad_memory_${activeZoomIndex + 1}.jpg`}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                title="Download photo"
              >
                <Download className="w-5 h-5" />
              </a>
              <button
                type="button"
                onClick={() => setActiveZoomIndex(null)}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
