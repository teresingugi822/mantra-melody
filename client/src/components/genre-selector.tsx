import { GENRES, type Genre } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Music, Music2, Music3, Music4, Radio, Guitar } from "lucide-react";

interface GenreSelectorProps {
  value: Genre | null;
  onChange: (genre: Genre) => void;
}

const genreIcons: Record<Genre, React.ComponentType<{ className?: string }>> = {
  soul: Music,
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

export function GenreSelector({ value, onChange }: GenreSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Choose Your Genre</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {GENRES.map((genre) => {
          const Icon = genreIcons[genre];
          const isSelected = value === genre;
          
          return (
            <Button
              key={genre}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={`h-auto py-4 flex flex-col items-center gap-2 ${
                isSelected ? "" : "hover-elevate"
              }`}
              onClick={() => onChange(genre)}
              data-testid={`button-genre-${genre}`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium">{genreLabels[genre]}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
