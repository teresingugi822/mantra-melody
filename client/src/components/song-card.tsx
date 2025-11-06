import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Music } from "lucide-react";
import type { Song } from "@shared/schema";
import { format } from "date-fns";

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
}

export function SongCard({ song, onPlay }: SongCardProps) {
  return (
    <Card className="hover-elevate transition-all cursor-pointer group" data-testid={`song-card-${song.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Album Art Placeholder */}
          <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Music className="h-8 w-8 text-primary" />
          </div>

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold mb-1 truncate" data-testid={`text-song-title-${song.id}`}>
              {song.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2" data-testid={`text-song-lyrics-${song.id}`}>
              {song.lyrics}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" data-testid={`badge-genre-${song.id}`}>
                {song.genre}
              </Badge>
              {song.playlistType && (
                <Badge variant="outline" data-testid={`badge-playlist-${song.id}`}>
                  {song.playlistType}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground" data-testid={`text-date-${song.id}`}>
                {format(new Date(song.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>

          {/* Play Button */}
          <Button
            size="icon"
            variant="ghost"
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(song);
            }}
            data-testid={`button-play-${song.id}`}
          >
            <Play className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
