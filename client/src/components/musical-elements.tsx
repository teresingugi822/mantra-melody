import { Music, Music2, Radio, Disc3 } from "lucide-react";

interface WaveformBarsProps {
  count?: number;
  className?: string;
  animated?: boolean;
}

export function WaveformBars({ count = 5, className = "", animated = true }: WaveformBarsProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-primary rounded-full ${animated ? 'animate-wave-pulse motion-reduce:animate-none' : ''}`}
          style={{
            height: `${Math.random() * 20 + 10}px`,
            animationDelay: animated ? `${i * 0.1}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}

interface VinylRecordProps {
  size?: 'sm' | 'md' | 'lg';
  spinning?: boolean;
  className?: string;
}

export function VinylRecord({ size = 'md', spinning = false, className = "" }: VinylRecordProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-20 w-20',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <Disc3 
        className={`h-full w-full text-primary ${spinning ? 'animate-vinyl-spin motion-reduce:animate-none' : ''}`}
      />
    </div>
  );
}

interface MusicNoteProps {
  floating?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function MusicNote({ floating = false, className = "", style }: MusicNoteProps) {
  return (
    <Music2 className={`text-primary/30 ${floating ? 'animate-note-float motion-reduce:animate-none' : ''} ${className}`} style={style} />
  );
}

interface WaveformPatternProps {
  className?: string;
}

export function WaveformPattern({ className = "" }: WaveformPatternProps) {
  return (
    <div className={`absolute inset-0 waveform-pattern pointer-events-none ${className}`} />
  );
}

interface GenreIconProps {
  genre: string;
  className?: string;
}

export function GenreIcon({ genre, className = "" }: GenreIconProps) {
  const icons = {
    soul: <Disc3 className={className} />,
    blues: <Music className={className} />,
    'hip-hop': <Radio className={className} />,
    reggae: <Music2 className={className} />,
    pop: <Music2 className={className} />,
    acoustic: <Music className={className} />,
  };

  return icons[genre as keyof typeof icons] || <Music2 className={className} />;
}
