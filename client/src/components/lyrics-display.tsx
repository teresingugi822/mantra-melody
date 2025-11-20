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

    // Lead time: show lyrics 2 seconds before they're sung
    const LEAD_TIME_SECONDS = 2;
    const adjustedTime = currentTime + LEAD_TIME_SECONDS;

    // Simple linear progression: divide total time by number of lines
    const timePerLine = duration / lines.length;
    const currentLineIndex = Math.floor(adjustedTime / timePerLine);
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
          
          // Show next 2 upcoming lines prominently
          const isUpcomingSoon = index === highlightedIndex + 1;
          const isUpcomingNext = index === highlightedIndex + 2;

          return (
            <div
              key={index}
              data-line-index={index}
              data-testid={`lyrics-line-${index}`}
              className={`
                text-center transition-all duration-700 ease-out py-3 px-6 rounded-lg
                font-serif leading-relaxed
                ${isHighlighted 
                  ? 'text-primary font-bold text-3xl md:text-4xl lg:text-5xl scale-110 opacity-100' 
                  : isUpcomingSoon
                    ? 'text-foreground font-semibold text-2xl md:text-3xl scale-105 opacity-90'
                    : isUpcomingNext
                      ? 'text-foreground/80 text-xl md:text-2xl scale-100 opacity-75'
                      : isPast
                        ? 'text-muted-foreground/50 text-lg md:text-xl scale-90 opacity-60'
                        : 'text-muted-foreground/30 text-base md:text-lg scale-85 opacity-40'
                }
              `}
              style={{
                textShadow: isHighlighted 
                  ? '0 0 30px rgba(139, 92, 246, 0.5)' 
                  : isUpcomingSoon 
                    ? '0 0 15px rgba(139, 92, 246, 0.2)'
                    : 'none',
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
