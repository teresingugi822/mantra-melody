import { GENRES, type Genre } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Music, Music2, Music3, Music4, Radio, Guitar, Disc3 } from "lucide-react";
import { WaveformPattern } from "@/components/musical-elements";

interface GenreSelectorProps {
  value: Genre | null;
  onChange: (genre: Genre) => void;
}

const genreIcons: Record<Genre, React.ComponentType<{ className?: string }>> = {
  soul: Disc3,
  blues: Music2,
  "hip-hop": Radio,
  reggae: Music3,
  pop: Music4,
  acoustic: Guitar,
};

const genreLabels: Record<Genre, string> = {
  soul: "Soul",
  blues: "Blues",
  "hip-hop": "Hip-Hop",
  reggae: "Reggae",
  pop: "Pop",
  acoustic: "Acoustic",
};

const genreDescriptions: Record<Genre, string> = {
  soul: "Soulful • Uplifting • Smooth",
  blues: "Deep • Emotional • Raw",
  "hip-hop": "Rhythmic • Bold • Urban",
  reggae: "Groovy • Positive • Island",
  pop: "Catchy • Bright • Energetic",
  acoustic: "Natural • Warm • Intimate",
};

export function GenreSelector({ value, onChange }: GenreSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Choose Your Musical Vibe</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {GENRES.map((genre) => {
          const Icon = genreIcons[genre];
          const isSelected = value === genre;
          const genreClass = `genre-${genre}`;
          
          return (
            <Button
              key={genre}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={`relative overflow-hidden h-auto py-6 flex flex-col items-center gap-2 ${
                isSelected ? "musical-glow" : "hover-elevate"
              } ${!isSelected ? genreClass : ""}`}
              onClick={() => onChange(genre)}
              data-testid={`genre-${genre}`}
            >
              {!isSelected && <WaveformPattern className="opacity-30" />}
              <div className="relative">
                <Icon className="h-8 w-8" />
              </div>
              <div className="text-center relative">
                <span className="block text-sm font-semibold">{genreLabels[genre]}</span>
                <span className="block text-xs opacity-70 mt-1">{genreDescriptions[genre]}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
