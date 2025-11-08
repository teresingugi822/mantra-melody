import { useEffect, useRef, useState } from "react";

interface LyricsDisplayProps {
  lyrics: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

export function LyricsDisplay({ 
  lyrics, 
  currentTime, 
  duration,
  isPlaying 
}: LyricsDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Split lyrics into lines and filter out empty ones
  const lines = lyrics
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Calculate which line should be highlighted based on playback time
  useEffect(() => {
    if (!duration || duration === 0 || lines.length === 0) return;

    // Simple linear progression: divide total time by number of lines
    const timePerLine = duration / lines.length;
    const currentLineIndex = Math.floor(currentTime / timePerLine);
    const newIndex = Math.min(currentLineIndex, lines.length - 1);
    
    setHighlightedIndex(newIndex);

    // Auto-scroll to keep highlighted line centered
    if (containerRef.current && isPlaying) {
      const highlightedElement = containerRef.current.querySelector(
        `[data-line-index="${newIndex}"]`
      );
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentTime, duration, lines.length, isPlaying]);

  if (!lyrics || lines.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" data-testid="lyrics-display-empty">
        <p className="text-center text-muted-foreground italic text-lg font-serif">
          No lyrics available
        </p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full overflow-y-auto overflow-x-hidden px-4"
      style={{ height: '500px' }}
      ref={containerRef}
      data-testid="lyrics-display"
    >
      {/* Centered lyrics container with karaoke-style display */}
      <div className="flex flex-col items-center justify-start min-h-full py-48">
        {lines.map((line, index) => {
          const isHighlighted = index === highlightedIndex;
          const isPast = index < highlightedIndex;
          const isFuture = index > highlightedIndex;

          return (
            <div
              key={index}
              data-line-index={index}
              data-testid={`lyrics-line-${index}`}
              className={`
                text-center transition-all duration-500 ease-out py-3 px-6 rounded-lg
                font-serif leading-relaxed
                ${isHighlighted 
                  ? 'text-primary font-bold text-3xl md:text-4xl scale-110 opacity-100' 
                  : isPast
                    ? 'text-muted-foreground/60 text-xl md:text-2xl scale-95 opacity-70'
                    : 'text-muted-foreground/40 text-xl md:text-2xl scale-90 opacity-50'
                }
              `}
              style={{
                textShadow: isHighlighted ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'none',
              }}
            >
              {line}
            </div>
          );
        })}
      </div>

      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
