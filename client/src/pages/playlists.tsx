import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SongCard } from "@/components/song-card";
import { AudioPlayer } from "@/components/audio-player";
import { Music, ArrowLeft, Plus, Loader2, Sun, Sparkles, Moon } from "lucide-react";
import type { Song } from "@shared/schema";
import morningImage from "@assets/generated_images/Morning_motivation_playlist_cover_e6f38d41.png";
import daytimeImage from "@assets/generated_images/Daytime_energy_playlist_cover_c331b96d.png";
import bedtimeImage from "@assets/generated_images/Bedtime_calm_playlist_cover_fb1fe09e.png";

const playlistConfig = {
  morning: {
    title: "Morning Motivation",
    description: "Start your day with energizing mantras that set a positive tone",
    icon: Sun,
    image: morningImage,
    gradient: "from-orange-400 to-pink-500",
  },
  daytime: {
    title: "Daytime Energy",
    description: "Stay inspired and focused throughout your active hours",
    icon: Sparkles,
    image: daytimeImage,
    gradient: "from-blue-400 to-cyan-500",
  },
  bedtime: {
    title: "Bedtime Calm",
    description: "Wind down with peaceful mantras for reflection and rest",
    icon: Moon,
    image: bedtimeImage,
    gradient: "from-indigo-500 to-purple-600",
  },
};

export default function Playlists() {
  const [, navigate] = useLocation();
  const params = useParams();
  const playlistType = params.type as "morning" | "daytime" | "bedtime";
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const config = playlistConfig[playlistType];
  const Icon = config?.icon;

  const { data: songs, isLoading } = useQuery<Song[]>({
    queryKey: [`/api/playlists/${playlistType}/songs`],
    enabled: !!playlistType,
  });

  const handlePlaySong = (song: Song) => {
    setSelectedSong(song);
  };

  const handleNext = () => {
    if (!selectedSong || !songs) return;
    const currentIndex = songs.findIndex(s => s.id === selectedSong.id);
    if (currentIndex < songs.length - 1) {
      setSelectedSong(songs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (!selectedSong || !songs) return;
    const currentIndex = songs.findIndex(s => s.id === selectedSong.id);
    if (currentIndex > 0) {
      setSelectedSong(songs[currentIndex - 1]);
    }
  };

  const currentIndex = selectedSong && songs ? songs.findIndex(s => s.id === selectedSong.id) : -1;
  const hasNext = currentIndex >= 0 && currentIndex < (songs?.length || 0) - 1;
  const hasPrevious = currentIndex > 0;

  if (!config) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-serif">Mantra Music</span>
          </div>
          <Button
            onClick={() => navigate("/create")}
            data-testid="button-create-new"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </div>
      </header>

      {/* Playlist Hero */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${config.image})` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${config.gradient} opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="relative z-10 h-full flex items-end pb-12">
          <div className="container px-4 md:px-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              {Icon && <Icon className="h-12 w-12" />}
              <h1 className="text-4xl md:text-5xl font-bold font-serif" data-testid="text-playlist-title">
                {config.title}
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-2xl" data-testid="text-playlist-description">
              {config.description}
            </p>
            <p className="mt-2 text-sm text-white/70" data-testid="text-song-count">
              {songs?.length || 0} {songs?.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl px-4 md:px-6 py-12">
        {/* Current Player */}
        {selectedSong && (
          <div className="mb-8">
            <AudioPlayer
              song={selectedSong}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
            />
          </div>
        )}

        {/* Songs List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loader-songs" />
            </div>
          ) : songs && songs.length > 0 ? (
            songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={handlePlaySong}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Icon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-title">
                No Songs in This Playlist
              </h3>
              <p className="text-muted-foreground mb-6" data-testid="text-empty-description">
                Create a mantra song and add it to this playlist to get started
              </p>
              <Button onClick={() => navigate("/create")} data-testid="button-create-first">
                <Plus className="mr-2 h-4 w-4" />
                Create a Song
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
