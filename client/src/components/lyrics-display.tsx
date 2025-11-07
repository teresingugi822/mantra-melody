import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const scrollRef = useRef<HTMLDivElement>(null);
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

    // Auto-scroll to keep highlighted line visible
    if (scrollRef.current && isPlaying) {
      const highlightedElement = scrollRef.current.querySelector(
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
      <Card data-testid="lyrics-display-empty">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground italic">
            No lyrics available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="lyrics-display">
      <CardContent className="p-6">
        <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
          <div className="space-y-3">
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
                    transition-all duration-300 py-2 px-3 rounded-md
                    ${isHighlighted 
                      ? 'text-primary font-semibold text-lg bg-primary/10 scale-105' 
                      : isPast
                      ? 'text-muted-foreground/60 text-base'
                      : 'text-foreground/80 text-base'
                    }
                  `}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
