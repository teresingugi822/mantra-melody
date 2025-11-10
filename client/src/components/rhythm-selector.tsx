import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music2 } from "lucide-react";
import { RHYTHM_OPTIONS, type Genre, type Rhythm } from "@shared/schema";

interface RhythmSelectorProps {
  genre: Genre;
  selectedRhythm: Rhythm | null;
  onSelectRhythm: (rhythm: Rhythm) => void;
}

export function RhythmSelector({ genre, selectedRhythm, onSelectRhythm }: RhythmSelectorProps) {
  const rhythms = RHYTHM_OPTIONS[genre];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Music2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold" data-testid="text-rhythm-heading">
          Choose Rhythm
        </h3>
        <Badge variant="outline" className="text-xs">
          {genre}
        </Badge>
      </div>
      <div className="grid gap-3">
        {rhythms.map((rhythm) => (
          <Card
            key={rhythm.value}
            className={`cursor-pointer transition-all hover-elevate ${
              selectedRhythm === rhythm.value
                ? "ring-2 ring-primary bg-primary/5"
                : ""
            }`}
            onClick={() => onSelectRhythm(rhythm.value as Rhythm)}
            data-testid={`card-rhythm-${rhythm.value}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1" data-testid={`text-rhythm-label-${rhythm.value}`}>
                    {rhythm.label}
                  </h4>
                  <p className="text-sm text-muted-foreground" data-testid={`text-rhythm-description-${rhythm.value}`}>
                    {rhythm.description}
                  </p>
                </div>
                {selectedRhythm === rhythm.value && (
                  <Badge variant="default" className="flex-shrink-0">
                    Selected
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
